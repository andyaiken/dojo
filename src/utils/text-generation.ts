interface ModelLine {
    prev: string;
    freq: ModelChar[];
}

interface ModelChar {
    char: string;
    count: number;
}

export default class TextGenerator {

    private static model: ModelLine[] = [];

    public static initModel(sources: string[]) {
        const model: ModelLine[] = [];

        sources.forEach(source => {
            const lines = source.split(/\r?\n/);
            lines.forEach(line => {
                if (line) {
                    TextGenerator.addLineToModel(line, model);
                }
            });
        });

        TextGenerator.model = model;
    }

    private static addLineToModel(line: string, model: ModelLine[]) {
        line = String.fromCharCode(0, 1) + line + String.fromCharCode(2);

        for (let index = 2; index !== line.length; ++index) {
            const prev = line.substr(index - 2, 2);
            const char = line.substr(index, 1);

            let item = model.find(x => x.prev === prev);
            if (!item) {
                item = {
                    prev: prev,
                    freq: []
                };
                model.push(item);
            }

            let freq = item.freq.find(x => x.char === char);
            if (!freq) {
                freq = {
                    char: char,
                    count: 0
                };
                item.freq.push(freq);
            }

            freq.count += 1;
        }
    }

    public static generate(requiredResults: number): string[] {
        const lines: string[] = [];
        const allowedFailures = 100;
        let failures = 0;

        while ((lines.length < requiredResults) && (failures < allowedFailures)) {
            const line = TextGenerator.extractLine();
            if (line && !lines.includes(line)) {
                lines.push(line);
            } else {
                failures += 1;
            }
        }

        return lines;
    }

    private static extractLine() {
        let line = String.fromCharCode(0, 1);

        while (true) {
            const prev = line.substr(line.length - 2, 2);

            const item = TextGenerator.model.find(x => x.prev === prev);
            if (item) {
                let candidates = '';
                item.freq.forEach(freq => {
                    candidates += freq.char.repeat(freq.count);
                });

                const index = Math.floor(Math.random() * candidates.length);
                const char = candidates[index];
                if (char === String.fromCharCode(2)) {
                    line = line.substr(2);
                    return line;
                } else {
                    line += char;
                }
            } else {
                return null;
            }
        }
    }
}
