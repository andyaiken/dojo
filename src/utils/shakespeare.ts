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

    public static generateNames(count: number): string[] {
        const names: string[] = [];

        const startHuman1 = 'As Has Khe Zash Gl Ig Iv Kos Miv Pav Ser Dar Even Gor Rand Sto Tam Barer Keth Mum';
        const startHuman2 = 'Mar Burg Al Hel Wrayt S Eag Eath Joan Answ L Ot Ced At Tal Ham Jasm Mail Yash Row';
        const startDwarf = 'Adr Alber Ba Bar Gar Kildr Kath Dies Eld Gurd Har Morg Or Rur Mar Vis Jen Torg Tak Thor End Ris Em Gunn';
        const startElf = 'Ad All Aram Berri Car Enial Gann Im Per Sorvi Var Adr An Beth Bir Jelen Key Lesh Mer Mia Naiv Quel Sar Shan';
        const startHalfling = 'Al An C Cor Eld Er Finn Gar Lin Mer Os Per Ros An Cal Cor Kith Lav Ned Pae Seraph T V Chen';
        const startDragonborn = 'Are Bala Bhar Don Gh Hesk Med Meh Nad Pand Patr Sham Shed Ak Bir Farid Fla Ka Ko Mish Thav Uad Eder Hener';
        const startMisc = 'Alu Stos Fa Ravay Leo Stok Vic El Yeng Car Ric Ar Guir Es My Pey';

        const maleHuman = 'Eir Eid Eed El Ar An Or Ef Al Vin Orn Dur Stag Elm Ur Us';
        const maleDwarf = 'Ik Ich Ern End Tor Nor In Rak Gen Sik Gran Linn Vok Brek Dal Gar';
        const maleElf = 'An Ar Il Rian Ric Is Dan Arai Meral Cian En Rion Ialis Ior Nan Kas';
        const maleHalfling = 'Ton Der Ade Rin Don Rich Nan Ret Al Born Coe By Fire Yas Dal Yle';
        const maleDragonborn = 'Han Asar Ash Aar Esch An Rash En Arr Jed Rin Gar Ash Dinn Hun Rek';
        const maleMisc = 'Orel Aadi Ahn Aver Eiros Kain Retor Lannan Pet Ikos';

        const femaleHuman = 'Er Ey A E Il Elia Ya Ed Eue Ild Oane Yne Orna Ie Ala Erri';
        const femaleDwarf = 'Ber Tin Hild Dryn A Eth Runn Ellen Loda Dis Ja Lin Ra Tyrd De Rasa';
        const femaleElf = 'Rie Aea Striana Inua Rynna Ilia Na Neth Leth Iel Lee Qui Astra Ia Ania Ynn';
        const femaleHalfling = 'Dry Ree Lie Ora Emia Ian Ri Inia Ina Aena Ani Erna Lyse La Da Aela';
        const femaleDragonborn = 'Ra Ir Eh Ann Ilar Rinn Ann La Ra A Ina Va Hit Ederei Ere Eila';
        const femaleMisc = 'Ina Ceryn Vyn Ella Aella Vyre';

        const starts = [
            startHuman1, startHuman2, startDwarf, startElf, startHalfling, startDragonborn, startMisc
        ].join(' ').toLowerCase().split(' ');
        const ends = [
            maleHuman, maleDwarf, maleElf, maleHalfling, maleDragonborn, maleMisc,
            femaleHuman, femaleDwarf, femaleElf, femaleHalfling, femaleDragonborn, femaleMisc
        ].join(' ').toLowerCase().split(' ');

        while (names.length < count) {
            const startIndex = Math.floor(Math.random() * starts.length);
            const endIndex = Math.floor(Math.random() * ends.length);

            const name = starts[startIndex] + ends[endIndex];
            if (!names.includes(name)) {
                names.push(name);
            }
        }

        names.sort();

        return names;
    }
}
