// This utility file deals with text

import Utils from './utils';

interface ModelLine {
    prev: string;
    freq: ModelChar[];
}

interface ModelChar {
    char: string;
    count: number;
}

export default class Shakespeare {

    private static model: ModelLine[] = [];
    private static maxLength: number = 0;

    public static initModel(sources: string[]) {
        const model: ModelLine[] = [];
        let maxLength: number = 0;

        sources.forEach(source => {
            const lines = source.split(/\r?\n/);
            lines.forEach(line => {
                if (line) {
                    Shakespeare.addLineToModel(line, model);
                    maxLength = Math.max(maxLength, line.length);
                }
            });
        });

        Shakespeare.model = model;
        Shakespeare.maxLength = maxLength;
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

    public static generate(requiredResults: number): { line: string, fit: number }[] {
        const lines: { line: string, fit: number }[] = [];
        const allowedFailures = 100;
        let failures = 0;

        while ((lines.length < requiredResults) && (failures < allowedFailures)) {
            const line = Shakespeare.extractLine();
            if (line && !lines.map(l => l.line).includes(line) && line.length <= Shakespeare.maxLength) {
                const fit = Shakespeare.fit(line);
                lines.push({ line, fit });
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

            const item = Shakespeare.model.find(x => x.prev === prev);
            if (item) {
                let candidates = '';
                item.freq.forEach(freq => {
                    candidates += freq.char.repeat(freq.count);
                });

                const index = Math.floor(Math.random() * candidates.length);
                let char = candidates[index];
                if (char === String.fromCharCode(2)) {
                    line = line.substr(2);
                    return line;
                } else {
                    if (Utils.dieRoll() === 1) {
                        // TODO: Mutate choice
                        const groups = ['bdg', 'ptk', 'sz', 'aeiouy', 'lr', 'ckq', 'vf'];
                        groups.forEach(g => {
                            if (g.includes(char)) {
                                const n = Math.floor(Math.random() * g.length);
                                char = g[n];
                            }
                        });
                    }
                    line += char;
                }
            } else {
                return null;
            }
        }
    }

    private static fit(text: string): number {
        text = String.fromCharCode(0, 1) + text + String.fromCharCode(2);

        const values: number[] = [];
        for (let n = 2; n !== text.length; ++n) {
            const prev = text.substr(n - 2, 2);
            const ch = text[n];

            const line = Shakespeare.model.find(m => m.prev === prev);
            if (line) {
                const mc = line.freq.find(f => f.char === ch);
                if (mc) {
                    const maxCount = line.freq.reduce((max, value) => Math.max(max, value.count), 0);
                    const fit = mc.count / maxCount;
                    values.push(fit);
                } else {
                    values.push(0);
                }
            }
        }

        return values.reduce((sum, value) => sum + value, 0) / values.length;
    }
}
