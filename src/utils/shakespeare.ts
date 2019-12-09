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

    //#region Text generation

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

    //#endregion

    public static startsWithVowel(str: string) {
        let result = false;

        ['a', 'e', 'i', 'o', 'u'].forEach(vowel => {
            if (str.toLowerCase().startsWith(vowel)) {
                result = true;
            }
        });

        return result;
    }

    private static getMultipleValues(list: string[]) {
        const items = [];
        while (Utils.randomNumber(3) !== 0) {
            items.push(list[Utils.randomNumber(list.length)]);
        }
        return items.join(', ');
    }

    public static generateName() {
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

        const femaleHuman = 'Er Ey A E Il Elia Ya Ed Eue Ild Oane Yne Orna Ie Ala Erri Ea Ia';
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

        const startIndex = Math.floor(Math.random() * starts.length);
        const endIndex = Math.floor(Math.random() * ends.length);

        let separator = '';
        if (Utils.dieRoll(10) === 1) {
            const separators = ['-', '\''];
            const sepIndex = Math.floor(Math.random() * separators.length);
            separator = separators[sepIndex];
        }

        return starts[startIndex] + separator + ends[endIndex];
    }

    public static generatePotion() {
        let str = '';

        const color = Shakespeare.potionColour(true);
        const liquid = Shakespeare.potionLiquid();
        const adj = Shakespeare.potionAdjective();
        const feature = Shakespeare.potionFeature();

        switch (Utils.randomNumber(5)) {
            case 0:
                str = color + ' ' + liquid;
                break;
            case 1:
                str = color + ' ' + liquid + ' ' + feature;
                break;
            case 2:
                str = adj + ' ' + color + ' ' + liquid;
                break;
            case 3:
                str = adj + ' ' + color + ' ' + liquid + ' ' + feature;
                break;
            case 4:
                str = adj + ' ' + liquid + ', ' + color + ' ' + feature;
                break;
        }

        const start = Shakespeare.startsWithVowel(str) ? 'an' : 'a';
        str = start + ' ' + str + ' in ' + Shakespeare.potionContainer();

        switch (Utils.randomNumber(6)) {
            case 0:
                str += '; it smells ' + Shakespeare.potionSmell();
                break;
            case 1:
                str += '; it tastes ' + Shakespeare.potionSmell();
                break;
            case 2:
                str += '; it smells ' + Shakespeare.potionSmell() + ' but tastes ' + Shakespeare.potionSmell();
                break;
            case 3:
                str += '; it smells and tastes ' + Shakespeare.potionSmell();
                break;
        }

        // TODO: Advanced: layered / varigated / alternating colours

        return str;
    }

    public static generateBookTitle() {
        let title = '';

        const np = Shakespeare.bookNounPhrase(Utils.randomBoolean(), Utils.randomBoolean());

        switch (Utils.randomNumber(5)) {
            case 0:
                // The NOUN's NOUN
                title = np + '\'s ' + Shakespeare.bookNounPhrase(Utils.randomBoolean(), false);
                break;
            case 1:
                // The NOUN and the NOUN
                title = np + ' ' + Shakespeare.bookPreposition() + ' ' + Shakespeare.bookNounPhrase(Utils.randomBoolean(), true);
                break;
            case 2:
                // VERBING the NOUN
                title = Shakespeare.bookGerund() + ' ' + Shakespeare.bookNounPhrase(Utils.randomBoolean(), true);
                break;
            case 3:
                // About NOUN
                title = Shakespeare.bookAbout() + ' ' + np;
                break;
            case 4:
                // The NOUN
                title = np;
                break;
        }

        if (Utils.randomNumber(10) === 0) {
            // Append a subtitle
            title += ': ' + Shakespeare.bookAbout() + ' ' + Shakespeare.bookNounPhrase(Utils.randomBoolean(), Utils.randomBoolean());
        }

        if (Utils.randomNumber(10) === 0) {
            // Append a volume number

            let type = '';
            switch (Utils.randomNumber(3)) {
                case 0:
                    type = 'volume';
                    break;
                case 1:
                    type = 'part';
                    break;
                case 2:
                    type = 'book';
                    break;
            }

            switch (Utils.randomNumber(5)) {
                case 0:
                    title += ', ' + type + ' one';
                    break;
                case 1:
                    title += ', ' + type + ' two';
                    break;
                case 2:
                    title += ', ' + type + ' three';
                    break;
                case 3:
                    title += ', ' + type + ' four';
                    break;
                case 4:
                    title += ', ' + type + ' five';
                    break;
            }
        }

        return title;
    }

    public static generateNPC() {
        const ages = ['elderly', 'middle-aged', 'teenage', 'youthful', 'young', 'old'];
        const age = ages[Utils.randomNumber(ages.length)];

        const professions = ['apothecary', 'architect', 'armourer', 'arrowsmith', 'astrologer', 'baker', 'barber', 'lawyer', 'beggar', 'bellfounder', 'blacksmith', 'bookbinder', 'brewer', 'bricklayer', 'butcher', 'carpenter', 'carter', 'cartwright', 'chandler', 'peddler', 'clerk', 'clockmaker', 'cobbler', 'cook', 'cooper', 'merchant', 'embroiderer', 'engraver', 'fisherman', 'fishmonger', 'forester', 'furrier', 'gardener', 'gemcutter', 'glassblower', 'goldsmith', 'grocer', 'haberdasher', 'stableman', 'courtier', 'herbalist', 'innkeeper', 'ironmonger', 'labourer', 'painter', 'locksmith', 'mason', 'messenger', 'miller', 'miner', 'minstrel', 'ploughman', 'farmer', 'porter', 'sailor', 'scribe', 'seamstress', 'shepherd', 'shipwright', 'soapmaker', 'tailor', 'tinker', 'vintner', 'weaver'];
        const profession = professions[Utils.randomNumber(professions.length)];

        let main = '';
        switch (Utils.randomNumber(3)) {
            case 0:
            case 1:
                main = profession;
                break;
            case 2:
                main = age + ' ' + profession;
                break;
        }

        main = (Shakespeare.startsWithVowel(main) ? 'an' : 'a') + ' ' + main;

        const heights = ['gangly', 'gigantic', 'hulking', 'lanky', 'short', 'small', 'stumpy', 'tall', 'tiny', 'willowy'];
        const height = heights[Utils.randomNumber(heights.length)];

        const weights = ['broad-shouldered', 'fat', 'gaunt', 'obese', 'plump', 'pot-bellied', 'rotund', 'skinny', 'slender', 'slim', 'statuesque', 'stout', 'thin'];
        const weight = weights[Utils.randomNumber(weights.length)];

        let stature = '';
        switch (Utils.randomNumber(4)) {
            case 0:
            case 1:
                stature = height + ' and ' + weight;
                break;
            case 2:
                stature = height;
                break;
            case 3:
                stature = weight;
                break;
        }

        const hairStyles = ['short', 'cropped', 'long', 'braided', 'dreadlocked', 'shoulder-length', 'wiry', 'balding', 'receeding', 'curly', 'tightly-curled', 'straight', 'greasy', 'limp', 'sparse', 'thinning', 'wavy'];
        const hairColours = ['black', 'brown', 'dark brown', 'light brown', 'red', 'ginger', 'strawberry blonde', 'blonde', 'ash blonde', 'graying', 'silver', 'white', 'gray', 'auburn'];
        const hair = hairStyles[Utils.randomNumber(hairStyles.length)] + ' ' + hairColours[Utils.randomNumber(hairColours.length)];

        let desc = '';
        switch (Utils.randomNumber(4)) {
            case 0:
            case 1:
                desc = main + ', ' + stature + ' with ' + hair + ' hair';
                break;
            case 2:
                desc = main + ' with ' + hair + ' hair';
                break;
            case 3:
                desc = main + ', ' + stature;
                break;
        }

        return desc;
    }

    public static generateNPCPhysical() {
        const physical = ['bearded', 'buck-toothed', 'chiselled', 'doe-eyed', 'fine-featured', 'florid', 'gap-toothed', 'goggle-eyed', 'grizzled', 'jowly', 'jug-eared', 'pock-marked', 'broken nose', 'red-cheeked', 'scarred', 'squinting', 'thin-lipped', 'toothless', 'weather-beaten', 'wrinkled'];
        return Shakespeare.getMultipleValues(physical);
    }

    public static generateNPCMental() {
        const mental = ['hot-tempered', 'overbearing', 'antagonistic', 'haughty', 'elitist', 'proud', 'rude', 'aloof', 'mischievous', 'impulsive', 'lusty', 'irreverent', 'madcap', 'thoughtless', 'absent-minded', 'insensitive', 'brave', 'craven', 'shy', 'fearless', 'obsequious', 'inquisitive', 'prying', 'intellectual', 'perceptive', 'keen', 'perfectionist', 'stern', 'harsh', 'punctual', 'driven', 'trusting', 'kind-hearted', 'forgiving', 'easy-going', 'compassionate', 'miserly', 'hard-hearted', 'covetous', 'avaricious', 'thrifty', 'wastrel', 'spendthrift', 'extravagant', 'kind', 'charitable', 'gloomy', 'morose', 'compulsive', 'irritable', 'vengeful', 'honest', 'truthful', 'innocent', 'gullible', 'bigoted', 'biased', 'narrow-minded', 'cheerful', 'happy', 'diplomatic', 'pleasant', 'foolhardy', 'affable', 'fatalistic', 'depressing', 'cynical', 'sarcastic', 'realistic', 'secretive', 'retiring', 'practical', 'level-headed', 'dull', 'reverent', 'scheming', 'paranoid', 'cautious', 'deceitful', 'nervous', 'uncultured', 'boorish', 'barbaric', 'graceless', 'crude', 'cruel', 'sadistic', 'immoral', 'jealous', 'belligerent', 'argumentative', 'arrogant', 'careless', 'curious', 'exacting', 'friendly', 'greedy', 'generous', 'moody', 'naive', 'opinionated', 'optimistic', 'pessimistic', 'quiet', 'sober', 'suspicious', 'uncivilised', 'violent', 'peaceful'];
        return Shakespeare.getMultipleValues(mental);
    }

    public static generateNPCSpeech() {
        const speech = ['accented', 'articulate', 'garrulous', 'breathless', 'crisp', 'gutteral', 'high-pitched', 'lisping', 'loud', 'nasal', 'slow', 'fast', 'squeaky', 'stuttering', 'wheezy', 'whiny', 'whispery', 'soft-spoken', 'laconic', 'blustering'];
        return Shakespeare.getMultipleValues(speech);
    }

    public static generateTreasure() {
        let result = '';

        const stones = ['diamond', 'ruby', 'sapphire', 'emerald', 'amethyst', 'garnet', 'topaz', 'pearl', 'black pearl', 'opal', 'fire opal', 'amber', 'coral', 'agate', 'carnelian', 'jade', 'peridot', 'moonstone', 'alexandrite', 'aquamarine', 'jacinth', 'marble'];

        switch (Utils.randomNumber(12)) {
            case 0:
            case 1:
            case 2:
                // Gemstone
                let stone = stones[Utils.randomNumber(stones.length)];

                switch (Utils.randomBoolean()) {
                    case true:
                        stone = stone + ' gemstone';
                        break;
                    case false:
                        stone = 'piece of ' + stone;
                        break;
                }

                switch (Utils.randomNumber(12)) {
                    case 0:
                        stone = 'well cut ' + stone;
                        break;
                    case 1:
                        stone = 'rough-cut ' + stone;
                        break;
                    case 2:
                        stone = 'poorly cut ' + stone;
                        break;
                    case 3:
                        stone = 'small ' + stone;
                        break;
                    case 4:
                        stone = 'large ' + stone;
                        break;
                    case 5:
                        stone = 'oddly shaped ' + stone;
                        break;
                    case 6:
                        stone = 'highly polished ' + stone;
                        break;
                    default:
                        break;
                }

                result = stone;
                break;
            case 3:
            case 4:
            case 5:
                // Object
                const fObjects = ['medal', 'statuette', 'sculpture', 'idol', 'chalice', 'goblet', 'dish', 'bowl'];
                const object = fObjects[Utils.randomNumber(fObjects.length)];

                const objectAdjectives = ['small', 'large', 'light', 'heavy', 'delicate', 'fragile', 'masterwork', 'elegant'];
                const objectAdjective = objectAdjectives[Utils.randomNumber(objectAdjectives.length)];

                result = objectAdjective + ' ' + object;
                break;
            case 6:
            case 7:
            case 8:
                // Jewellery
                const jewellery = ['ring', 'necklace', 'crown', 'circlet', 'bracelet', 'anklet', 'torc', 'brooch', 'pendant', 'locket', 'diadem', 'tiara', 'earring'];
                const item = jewellery[Utils.randomNumber(jewellery.length)];

                const metals = ['gold', 'silver', 'bronze', 'platinum', 'electrum', 'mithral', 'orium', 'adamantine'];
                const metal = metals[Utils.randomNumber(metals.length)];

                result = metal + ' ' + item;

                switch (Utils.randomNumber(5)) {
                    case 0:
                        // Enamelled or laquered
                        const deco1 = (Utils.randomBoolean()) ? 'enamelled' : 'laquered';
                        result = deco1 + ' ' + result;
                        break;
                    case 1:
                        // Filigree or plating
                        const metal2 = metals[Utils.randomNumber(metals.length)];
                        const deco2 = (Utils.randomBoolean()) ? 'plated' : 'filigreed';
                        result = metal2 + '-' + deco2 + ' ' + result;
                        break;
                }

                switch (Utils.randomNumber(10)) {
                    case 0:
                        result = 'delicate ' + result;
                        break;
                    case 1:
                        result = 'intricate ' + result;
                        break;
                    case 2:
                        result = 'elegant ' + result;
                        break;
                    case 3:
                        result = 'simple ' + result;
                        break;
                    case 4:
                        result = 'plain ' + result;
                        break;
                    default:
                        break;
                }
                break;
            case 9:
            case 10:
                // Artwork
                let artwork = '';
                switch (Utils.randomBoolean()) {
                    case true:
                        // Painting
                        artwork = 'painting';

                        switch (Utils.randomBoolean()) {
                            case true:
                                artwork = 'oil ' + artwork;
                                break;
                            case false:
                                artwork = 'watercolour ' + artwork;
                                break;
                        }
                        break;
                    case false:
                        // Drawing
                        artwork = 'drawing';

                        switch (Utils.randomNumber(3)) {
                            case 0:
                                artwork = 'pencil ' + artwork;
                                break;
                            case 1:
                                artwork = 'charcoal ' + artwork;
                                break;
                            case 2:
                                artwork = 'pastel ' + artwork;
                                break;
                        }
                        break;
                }

                const artAdjectives = ['small', 'large', 'delicate', 'fragile', 'elegant', 'detailed'];
                const artAdjective = artAdjectives[Utils.randomNumber(artAdjectives.length)];

                const media = ['canvas', 'paper', 'parchment', 'wood panels', 'fabric'];
                const medium = media[Utils.randomNumber(media.length)];

                result = artAdjective + ' ' + artwork + ' on ' + medium;

                // TODO: Subject
                break;
            case 11:
                // Musical instrument
                const instruments = ['lute', 'lyre', 'mandolin', 'violin', 'drum', 'flute', 'clarinet', 'accordion', 'banjo', 'bodhran', 'ocarina', 'zither', 'djembe', 'shawm'];
                const instrument = instruments[Utils.randomNumber(instruments.length)];

                const instrumentAdjectives = ['small', 'large', 'light', 'heavy', 'delicate', 'fragile', 'masterwork', 'elegant'];
                const instrumentAdjective = instrumentAdjectives[Utils.randomNumber(instrumentAdjectives.length)];

                result = instrumentAdjective + ' ' + instrument;
                break;
        }

        switch (Utils.randomNumber(5)) {
            case 0:
                const locations = ['feywild', 'shadowfell', 'elemental chaos', 'astral plane', 'abyss', 'distant north', 'distant east', 'distant west', 'distant south'];
                const location = locations[Utils.randomNumber(locations.length)];

                result += ' from the ' + location;
                break;
            case 1:
                const gerunds = ['decorated with', 'inscribed with', 'engraved with', 'embossed with', 'carved with'];
                const gerund = gerunds[Utils.randomNumber(gerunds.length)];

                const adjectives = ['indecipherable', 'ancient', 'curious', 'unusual', 'dwarven', 'eladrin', 'elven', 'draconic', 'gith'];
                const adjective = adjectives[Utils.randomNumber(adjectives.length)];

                const designs = ['script', 'designs', 'sigils', 'runes', 'glyphs', 'patterns'];
                const design = designs[Utils.randomNumber(designs.length)];

                result += ' ' + gerund + ' ' + adjective + ' ' + design;
                break;
            case 2:
                const magicGerunds = ['glowing with', 'suffused with', 'infused with', 'humming with', 'pulsing with'];
                const magicGerund = magicGerunds[Utils.randomNumber(magicGerunds.length)];

                const magics = ['arcane', 'divine', 'primal', 'psionic', 'dark', 'shadow', 'elemental', 'ethereal', 'unknown'];
                const magic = magics[Utils.randomNumber(magics.length)];

                const powers = ['energy', 'power', 'magic'];
                const power = powers[Utils.randomNumber(powers.length)];

                result += ' ' + magicGerund + ' ' + magic + ' ' + power;
                break;
            case 4:
                let stone = stones[Utils.randomNumber(stones.length)];

                if (Utils.randomBoolean()) {
                    stone += 's';
                } else {
                    stone = 'a single ' + stone;
                }

                const setGerunds = ['set with', 'inlaid with', 'studded with', 'with shards of'];
                const setGerund = setGerunds[Utils.randomNumber(setGerunds.length)];

                result += ' ' + setGerund + ' ' + stone;
                break;
        }

        return (Shakespeare.startsWithVowel(result) ? 'an ' : 'a ') + result;
    }

    public static generateRoomName() {
        const names = [
            'antechamber',
            'arena',
            'armoury',
            'aviary',
            'audience chamber',
            'banquet hall',
            'bath chamber',
            'barracks',
            'bedroom',
            'boudoir',
            'bestiary',
            'burial chamber',
            'cells',
            'chamber',
            'chantry',
            'chapel',
            'classroom',
            'closet',
            'court',
            'crypt',
            'dining room',
            'dormitory',
            'dressing room',
            'dumping ground',
            'entrance hall',
            'gallery',
            'game room',
            'great hall',
            'guard post',
            'hall',
            'harem',
            'hoard',
            'infirmary',
            'kennels',
            'kitchens',
            'laboratory',
            'lair',
            'library',
            'mausoleum',
            'meditation room',
            'museum',
            'nursery',
            'observatory',
            'office',
            'pantry',
            'prison',
            'quarters',
            'reception room',
            'refectory',
            'ritual chamber',
            'shrine',
            'smithy',
            'stable',
            'storeroom',
            'study',
            'temple',
            'throne room',
            'torture chamber',
            'trophy room',
            'training area',
            'treasury',
            'waiting room',
            'workroom',
            'workshop',
            'vault',
            'vestibule'
        ];

        const index = Utils.randomNumber(names.length);
        return names[index];
    }

    private static potionColour(complex: boolean) {
        let values = [
            'red',
            'scarlet',
            'crimson',
            'carmine',
            'vermillion',
            'pink',
            'blue',
            'royal blue',
            'sky blue',
            'light blue',
            'dark blue',
            'midnight blue',
            'indigo',
            'yellow',
            'lemon yellow',
            'amber',
            'green',
            'light green',
            'dark green',
            'sea green',
            'turquoise',
            'aquamarine',
            'emerald',
            'purple',
            'lavender',
            'lilac',
            'mauve',
            'orange',
            'brown',
            'maroon',
            'ochre',
            'black',
            'dark grey',
            'grey',
            'light grey',
            'off-white',
            'white',
            'golden',
            'silver'
        ];

        if (complex) {
            values = values.concat([
                'blood red',
                'cherry red',
                'ruby-coloured',
                'rose-coloured',
                'sapphire-coloured',
                'straw-coloured',
                'olive-coloured',
                'plum-coloured',
                'mud-coloured',
                'cream-coloured',
                'ivory-coloured',
                'bronze-coloured',
                'colourless',
                'clear',
                'transparent'
            ]);

            // TODO: Two colours
            // TODO: Marbled (two colours)
        }

        const index = Utils.randomNumber(values.length);
        return values[index];
    }

    private static potionAdjective() {
        const values = [
            'watery',
            'syrupy',
            'thick',
            'viscous',
            'gloopy',
            'thin',
            'runny',
            'translucent',
            'effervescent',
            'fizzing',
            'bubbling',
            'foaming',
            'volatile',
            'smoking',
            'fuming',
            'vaporous',
            'steaming',
            'cold',
            'icy cold',
            'hot',
            'sparkling',
            'iridescent',
            'cloudy',
            'opalescent',
            'luminous',
            'phosphorescent',
            'glowing'
        ];

        return values[Utils.randomNumber(values.length)];
    }

    private static potionFeature() {
        switch (Utils.randomNumber(5)) {
            case 0:
                return 'with ' + this.potionColour(true) + ' specks';
            case 1:
                return 'with flecks of ' + this.potionColour(false);
            case 2:
                const col = this.potionColour(true);
                const article = Shakespeare.startsWithVowel(col) ? 'an' : 'a';
                return 'with ' + article + ' ' + col + ' suspension';
            case 3:
                return 'with a floating ' + this.potionColour(true) + ' layer';
            case 4:
                return 'with a ribbon of ' + this.potionColour(false);
        }

        return '';
    }

    private static potionLiquid() {
        const values = ['liquid', 'solution', 'draught', 'oil', 'elixir', 'potion'];
        return values[Utils.randomNumber(values.length)];
    }

    private static potionContainer() {
        const shapes = ['small', 'rounded', 'tall', 'square', 'irregularly-shaped', 'long-necked', 'cylindrical', 'round-bottomed'];
        const materials = ['glass', 'metal', 'ceramic', 'crystal'];
        const types = ['vial', 'jar', 'bottle', 'flask'];

        const shapeIndex = Utils.randomNumber(shapes.length);
        const shape = shapes[shapeIndex];

        const materialIndex = Utils.randomNumber(materials.length);
        let material = materials[materialIndex];

        const typeIndex = Utils.randomNumber(types.length);
        const type = types[typeIndex];

        if (Utils.randomNumber(3) === 0) {
            material = this.potionColour(true) + ' ' + material;
        }

        let result = '';
        switch (Utils.randomBoolean()) {
            case true:
                result = material + ' ' + type;
                break;
            case false:
                result = shape + ' ' + material + ' ' + type;
                break;
        }

        const start = Shakespeare.startsWithVowel(result) ? 'an' : 'a';
        return start + ' ' + result;
    }

    private static potionSmell() {
        const values = [
            'acidic',
            'acrid',
            'of ammonia',
            'of apples',
            'bitter',
            'brackish',
            'buttery',
            'of cherries',
            'delicious',
            'earthy',
            'of earwax',
            'of fish',
            'floral',
            'of lavender',
            'lemony',
            'of honey',
            'fruity',
            'meaty',
            'metallic',
            'musty',
            'of onions',
            'of oranges',
            'peppery',
            'of perfume',
            'rotten',
            'salty',
            'sickly sweet',
            'starchy',
            'sugary',
            'smokey',
            'sour',
            'spicy',
            'of sweat',
            'sweet',
            'unpleasant',
            'vile',
            'vinegary'
        ];

        return values[Utils.randomNumber(values.length)];
    }

    private static bookNounPhrase(concreteNoun: boolean, article: boolean) {
        let np = Shakespeare.bookNoun(concreteNoun);

        let plural = false;
        if (concreteNoun && (Utils.randomNumber(5) === 0)) {
            // Pluralise
            np += 's';
            plural = true;
        }

        if (Utils.randomNumber(3) === 0) {
            const adj = Shakespeare.bookAdjective();
            np = adj + ' ' + np;
        }

        if (article) {
            if (Utils.randomBoolean()) {
                // Prepend 'the' or 'a' / 'an' or 'one'
                switch (Utils.randomBoolean()) {
                    case true:
                        np = 'the ' + np;
                        break;
                    case false:
                        if (!plural) {
                            switch (Utils.randomBoolean()) {
                                case true:
                                    np = (Shakespeare.startsWithVowel(np) ? 'an' : 'a') + ' ' + np;
                                    break;
                                case false:
                                    np = 'one ' + np;
                                    break;
                            }
                        } else {
                            switch (Utils.randomNumber(6)) {
                                case 0:
                                    np = 'two ' + np;
                                    break;
                                case 1:
                                    np = 'three ' + np;
                                    break;
                                case 2:
                                    np = 'four ' + np;
                                    break;
                                case 3:
                                    np = 'five ' + np;
                                    break;
                                case 4:
                                    np = 'six ' + np;
                                    break;
                                case 5:
                                    np = 'seven ' + np;
                                    break;
                            }
                        }
                        break;
                }
            }
        }

        return np;
    }

    private static bookNoun(concrete: boolean) {
        let list = [
            'elf',
            'halfling',
            'dwarf',
            'gnome',
            'tiefling',
            'dragonborn',
            'goliath',
            'changeling',
            'drow',
            'minotaur',
            'beast',
            'orc',
            'goblin',
            'hobgoblin',
            'dragon',
            'demon',
            'devil',
            'angel',
            'god',
            'gith',
            'night',
            'day',
            'eclipse',
            'shadow',
            'sky',
            'sun',
            'moon',
            'star',
            'void',
            'battle',
            'war',
            'brawl',
            'fist',
            'blade',
            'arrow',
            'spell',
            'prayer',
            'eye',
            'wing',
            'army',
            'legion',
            'brigade',
            'galleon',
            'warship',
            'frigate',
            'potion',
            'jewel',
            'ring',
            'amulet',
            'cloak',
            'sword',
            'spear',
            'helm',
            'wizard',
            'king',
            'queen',
            'prince',
            'princess',
            'warlock',
            'barbarian',
            'sorcerer',
            'thief',
            'mage',
            'child',
            'wayfarer',
            'adventurer',
            'pirate',
            'spy',
            'sage',
            'assassin',
            'mountain',
            'forest',
            'peak',
            'cave',
            'cavern',
            'lake',
            'swamp',
            'marshland',
            'island',
            'shore',
            'city',
            'town',
            'village',
            'tower',
            'arena',
            'castle',
            'citadel',
            'bridge',
            'game',
            'wager',
            'quest',
            'challenge',
            'rose',
            'lily',
            'thorn',
            'leaf',
            'word',
            'snake',
            'serpent',
            'song',
            'lament',
            'dirge',
            'elegy',
            'storm',
            'tempest'
        ];

        if (!concrete) {
            // Can you have two of them?
            // If not, they go here

            list = list.concat([
                'darkness',
                'light',
                'dusk',
                'twilight',
                'revenge',
                'vengeance',
                'blood',
                'earth',
                'water',
                'ice',
                'wood',
                'metal',
                'lightning',
                'thunder',
                'mist',
                'snow',
                'flame',
                'fire',
                'wind',
                'stone',
                'destruction',
                'life',
                'death',
                'time',
                'end',
                'danger',
                'luck',
                'chaos',
                'truth',
                'untruth',
                'lie',
                'deception',
                'music',
                'sound',
                'one',
                'two',
                'three',
                'four',
                'five',
                'six',
                'seven',
                'eight',
                'nine',
                'ten',
                'eleven',
                'twelve'
            ]);
        }

        const index = Utils.randomNumber(list.length);
        return list[index];
    }

    private static bookAdjective() {
        const list = [
            'dark',
            'bright',
            'tyrannous',
            'devout',
            'noble',
            'eldritch',
            'mystical',
            'magical',
            'sorcerous',
            'savage',
            'silent',
            'lonely',
            'violent',
            'peaceful',
            'black',
            'white',
            'gold',
            'silver',
            'red',
            'pale',
            'dying',
            'living',
            'ascending',
            'defiled',
            'mythical',
            'legendary',
            'heroic',
            'empty',
            'mighty',
            'despairing',
            'spellbound',
            'enchanted',
            'soaring',
            'falling',
            'visionary',
            'bold',
            'perilous'
        ];

        return list[Utils.randomNumber(list.length)];
    }

    private static bookGerund() {
        const list = [
            'killing',
            'murdering',
            'watching',
            'examining',
            'enchanting',
            'destroying',
            'defying',
            'betraying',
            'protecting',
            'silencing',
            'bearing',
            'fighting'
        ];

        return list[Utils.randomNumber(list.length)];
    }

    private static bookPreposition() {
        const prepositions = ['and', 'in', 'of', 'with', 'against', 'for', 'to', 'towards'];
        return prepositions[Utils.randomNumber(prepositions.length)];
    }

    private static bookAbout() {
        const starts = ['treatise', 'essay', 'monograph', 'discourse', 'dissertation', 'primer', 'history', 'enchiridion'];
        let start = starts[Utils.randomNumber(starts.length)];
        if (Utils.randomBoolean()) {
            start = (Shakespeare.startsWithVowel(start) ? 'an ' : 'a ') + start;
        } else {
            start += 's';
        }
        const about = ['about', 'on', 'concerning', 'regarding', 'on the subject of'];
        return start + ' ' + about[Utils.randomNumber(about.length)];
    }
}
