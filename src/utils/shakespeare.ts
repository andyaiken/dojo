// This utility file deals with text

import { Gygax } from './gygax';
import { Utils } from './utils';

import { PC } from '../models/party';

interface ModelLine {
	prev: string;
	freq: ModelChar[];
}

interface ModelChar {
	char: string;
	count: number;
}

export class Shakespeare {

	//#region Text generation

	private static model: ModelLine[] = [];
	private static maxLength = 0;

	public static initModel(sources: string[]) {
		const model: ModelLine[] = [];
		let maxLength = 0;

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

	public static generateLine() {
		const lines = this.generateLines(1);
		return lines.length > 0 ? lines[0] : '';
	}

	public static generateLines(requiredResults: number) {
		const lines: string[] = [];
		const allowedFailures = 100;
		let failures = 0;

		while ((lines.length < requiredResults) && (failures < allowedFailures)) {
			const line = Shakespeare.extractLine();
			if (line && !lines.includes(line) && line.length <= Shakespeare.maxLength) {
				lines.push(line);
			} else {
				failures += 1;
			}
		}

		return lines;
	}

	private static extractLine() {
		let line = String.fromCharCode(0, 1);

		// eslint-disable-next-line no-constant-condition
		while (true) {
			const prev = line.substr(line.length - 2, 2);
			const item = Shakespeare.model.find(x => x.prev === prev);
			if (item) {
				let candidates = '';
				item.freq.forEach(freq => {
					candidates += freq.char.repeat(freq.count);
				});

				const index = Utils.randomNumber(candidates.length);
				let char = candidates[index];
				if (char === String.fromCharCode(2)) {
					line = line.substr(2);
					return line;
				} else {
					if (Gygax.dieRoll() === 1) {
						const groups = ['bdg', 'ptk', 'sz', 'aeiouy', 'lr', 'ckq', 'vf'];
						groups.forEach(g => {
							if (g.includes(char)) {
								const n = Utils.randomNumber(g.length);
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

	public static getSourceLanguages(): string[] {
		// Note: When adding a language to this list, also check the Ustinov.getLanguageCode() method
		return [
			'afrikaans',
			'amharic',
			'armenian',
			'basque',
			'belarusian',
			'bulgarian',
			'chichewa',
			'chinese',
			'croatian',
			'czech',
			'danish',
			'dutch',
			'english',
			'finnish',
			'french',
			'german',
			'greek',
			'hawaiian',
			'hindi',
			'hungarian',
			'icelandic',
			'irish',
			'italian',
			'japanese',
			'kannada',
			'kazakh',
			'korean',
			'kyrgyz',
			'latvian',
			'lithuanian',
			'macedonian',
			'malay',
			'maltese',
			'maori',
			'myanmar',
			'nepali',
			'norwegian',
			'polish',
			'portuguese',
			'punjabi',
			'romanian',
			'russian',
			'samoan',
			'serbian',
			'shona',
			'somali',
			'spanish',
			'swahili',
			'swedish',
			'thai',
			'turkish',
			'welsh',
			'yiddish',
			'zulu'
		];
	}

	public static getLanguagePresets() {
		return [
			{
				name: 'draconic',
				languages: ['armenian', 'irish', 'maltese']
			},
			{
				name: 'dwarvish',
				languages: ['czech', 'german', 'kazakh']
			},
			{
				name: 'elvish',
				languages: ['finnish', 'spanish', 'welsh']
			},
			{
				name: 'giant',
				languages: ['amharic', 'hungarian', 'polish']
			},
			{
				name: 'gnomish',
				languages: ['chichewa', 'korean', 'yiddish']
			},
			{
				name: 'goblin',
				languages: ['hawaiian', 'kyrgyz', 'somali']
			},
			{
				name: 'halfling',
				languages: ['english', 'maori', 'samoan']
			},
			{
				name: 'orc',
				languages: ['macedonian', 'russian', 'turkish']
			}
		];
	}

	public static getRandomLanguages() {
		const languages = Shakespeare.getSourceLanguages();

		const selected: string[] = [];
		while (selected.length !== 3) {
			const n = Utils.randomNumber(languages.length);
			const lang = languages[n];
			if (!selected.includes(lang)) {
				selected.push(lang);
			}
		}

		return selected.sort();
	}

	//#endregion

	public static generateTranslation(original: string) {
		const alphabet = 'abcdefghijklmnopqrstuvwxyz';

		let text = '';
		for (let index = 0; index !== original.length; ++index) {
			const ch = original.toLowerCase().charAt(index);
			if (ch !== ' ') {
				const n = Utils.randomNumber(alphabet.length);
				text += alphabet[n];
			} else {
				text += ' ';
			}
		}

		return Shakespeare.shuffle(text);
	}

	public static getAllLanguages() {
		return [
			'common',
			'abyssal',
			'aquan',
			'auran',
			'celestial',
			'deep speech',
			'dwarvish',
			'elvish',
			'giant',
			'gnomish',
			'goblin',
			'halfling',
			'ignan',
			'infernal',
			'orc',
			'primordial',
			'sylvan',
			'terran',
			'undercommon'
		];
	}

	public static getKnownLanguages(pcs: PC[]) {
		return pcs
			.map(pc => pc.languages.toLowerCase())
			.join(', ')
			.split(/[,;:]+/)
			.map(val => val.trim())
			.filter(val => val.length > 0)
			.reduce((array: string[], value) => {
				if (array.indexOf(value) === -1) {
					array.push(value);
				}
				return array;
			}, [])
			.sort((a, b) => {
				if (a === 'common') {
					return -1;
				}
				if (b === 'common') {
					return 1;
				}
				return a.localeCompare(b);
			})
			.map(lang => Shakespeare.capitalise(lang));
	}

	public static startsWithVowel(str: string) {
		let result = false;

		['a', 'e', 'i', 'o', 'u'].forEach(vowel => {
			if (str.toLowerCase().startsWith(vowel)) {
				result = true;
			}
		});

		return result;
	}

	public static shuffle(str: string) {
		const chars = str.split('');

		for (let i = chars.length - 1; i > 0; i--) {
			const j = Utils.randomNumber(i + 1);
			const tmp = chars[i];
			chars[i] = chars[j];
			chars[j] = tmp;
		}

		return chars.join('');
	}

	public static capitalise(str: string) {
		return str
			.split(' ')
			.filter(val => val.length > 0)
			.map(val => {
				const first = val[0].toUpperCase();
				const rest = val.length > 1 ? val.substring(1) : '';
				return first + rest;
			})
			.join(' ');
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

		const startValerian = 'Ae Ar Au Bae Bale Ca Cor Dae Elae Gae Helae Jacae Jae Jaehae Lae Luce Mae Me Monte Nae Rha Rhae Sae Shae Sy Te Ty Va Vae Valae Vale Ver Vha Vise';
		const startLannister = 'Alys Ce Cer Da Dar Dor El Er Ge Ger Ja Jai Jo Joa Joy Ke La Lan Le Lo Lor Lu Ly Ma Mar Myr No Nor Sta Te Ti To Ty Wil Will';
		const startStark = 'Al Alys Areg Ar Arr Art Barth Ben Benj Benn Ber Brand Creg Donn Dorr Ed Edd Edder El Ell Err Ey Gill Harl Joc Jon Jonn Jor Karl Ly Lyn Lys Mar Marg Marn Mel Os Ray Rick Rob Rod Sar Sans Ser The Torrh Walt Will';
		const endValerian = 'gar gal gel gelle gon gor kar l la larr leys lla lon lor lora lys lyx max mion mithor mon mond na naera nar nara nerys nor nora nya nyra nys ra rax raxes rea rion ron rra ryn rys than xes';
		const endLannister = 'a anne balt bolt casta cella cion dict elle em en enna fford ford ffrey frey gett got hanna ielle issa la land ler lessa lia man me men mion mon mond na nna ne nei n nn nora old on ora rek reon rick rion sei sha shara son tos tyn van ven wald well win';
		const endStark = 'a ah am an anna anne antha ara ard aret aric arra edict el elle elyn en ena erick ert iah iane ion ogan old on or os ra ric rick rik ron rra well wyle wyn ya yn ys';

		const starts = [
			startHuman1, startHuman2, startDwarf, startElf, startHalfling, startDragonborn, startMisc,
			startValerian, startLannister, startStark
		].join(' ').toLowerCase().split(' ');
		const ends = [
			maleHuman, maleDwarf, maleElf, maleHalfling, maleDragonborn, maleMisc,
			femaleHuman, femaleDwarf, femaleElf, femaleHalfling, femaleDragonborn, femaleMisc,
			endValerian, endLannister, endStark
		].join(' ').toLowerCase().split(' ');

		const startIndex = Utils.randomNumber(starts.length);
		const endIndex = Utils.randomNumber(ends.length);

		let separator = '';
		if (Gygax.dieRoll(10) === 1) {
			const separators = ['-', '\'', ' '];
			const sepIndex = Utils.randomNumber(separators.length);
			separator = separators[sepIndex];
		}

		return starts[startIndex] + separator + ends[endIndex];
	}

	public static generatePotion() {
		let str = '';

		const colour = Shakespeare.potionColour(true);
		const liquid = Shakespeare.potionLiquid();
		const adj = Shakespeare.potionAdjective();
		const feature = Shakespeare.potionFeature();

		switch (Utils.randomNumber(5)) {
			case 0:
				str = colour + ' ' + liquid;
				break;
			case 1:
				str = colour + ' ' + liquid + ' ' + feature;
				break;
			case 2:
				str = adj + ' ' + colour + ' ' + liquid;
				break;
			case 3:
				str = adj + ' ' + colour + ' ' + liquid + ' ' + feature;
				break;
			case 4:
				str = adj + ' ' + liquid + ', ' + colour + ' ' + feature;
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

		return str;
	}

	public static generateNPCAge() {
		const list = [
			'elderly',
			'middle-aged',
			'teenage',
			'youthful',
			'young',
			'old'
		];
		return list[Utils.randomNumber(list.length)];
	}

	public static generateNPCProfession() {
		const list = [
			'apothecary', 'architect', 'armourer', 'arrowsmith', 'astrologer', 'baker', 'barber', 'lawyer', 'beggar', 'bellfounder',
			'blacksmith', 'bookbinder', 'brewer', 'bricklayer', 'butcher', 'carpenter', 'carter', 'cartwright', 'chandler', 'peddler',
			'clerk', 'clockmaker', 'cobbler', 'cook', 'cooper', 'merchant', 'embroiderer', 'engraver', 'fisherman', 'fishmonger',
			'forester', 'furrier', 'gardener', 'gemcutter', 'glassblower', 'goldsmith', 'grocer', 'haberdasher', 'stableman',
			'courtier', 'herbalist', 'innkeeper', 'ironmonger', 'labourer', 'painter', 'locksmith', 'mason', 'messenger', 'miller',
			'miner', 'minstrel', 'ploughman', 'farmer', 'porter', 'sailor', 'scribe', 'seamstress', 'shepherd', 'shipwright',
			'soapmaker', 'tailor', 'tinker', 'vintner', 'weaver'
		];
		return list[Utils.randomNumber(list.length)];
	}

	public static generateNPCHeight() {
		const list = [
			'gangly',
			'gigantic',
			'hulking',
			'lanky',
			'short',
			'small',
			'stumpy',
			'tall',
			'tiny',
			'willowy'
		];
		return list[Utils.randomNumber(list.length)];
	}

	public static generateNPCWeight() {
		const list = [
			'broad-shouldered',
			'fat',
			'gaunt',
			'heavy-set',
			'obese',
			'plump',
			'pot-bellied',
			'rotund',
			'skinny',
			'slender',
			'slim',
			'statuesque',
			'stout',
			'thin'
		];
		return list[Utils.randomNumber(list.length)];
	}

	public static generateNPCHair() {
		const hairStyles = [
			'short', 'cropped', 'long', 'braided', 'dreadlocked', 'shoulder-length', 'wiry', 'balding', 'receeding', 'curly',
			'tightly-curled', 'straight', 'greasy', 'limp', 'sparse', 'thinning', 'wavy'
		];
		const hairColours = [
			'black', 'brown', 'dark brown', 'light brown', 'red', 'ginger', 'strawberry blonde', 'blonde', 'ash blonde', 'graying',
			'silver', 'white', 'gray', 'auburn'
		];
		return hairStyles[Utils.randomNumber(hairStyles.length)] + ', ' + hairColours[Utils.randomNumber(hairColours.length)];
	}

	public static generateNPCPhysical() {
		const list = [
			'bearded', 'buck-toothed', 'chiselled', 'doe-eyed', 'fine-featured', 'florid', 'gap-toothed', 'goggle-eyed', 'grizzled',
			'jowly', 'jug-eared', 'pock-marked', 'broken nose', 'red-cheeked', 'scarred', 'squinting', 'thin-lipped', 'toothless',
			'weather-beaten', 'wrinkled'
		];
		return list[Utils.randomNumber(list.length)];
	}

	public static generateNPCMental() {
		const list = [
			'hot-tempered', 'overbearing', 'antagonistic', 'haughty', 'elitist', 'proud', 'rude', 'aloof', 'mischievous', 'impulsive',
			'lusty', 'irreverent', 'madcap', 'thoughtless', 'absent-minded', 'insensitive', 'brave', 'craven', 'shy', 'fearless',
			'obsequious', 'inquisitive', 'prying', 'intellectual', 'perceptive', 'keen', 'perfectionist', 'stern', 'harsh', 'punctual',
			'driven', 'trusting', 'kind-hearted', 'forgiving', 'easy-going', 'compassionate', 'miserly', 'hard-hearted', 'covetous',
			'avaricious', 'thrifty', 'wastrel', 'spendthrift', 'extravagant', 'kind', 'charitable', 'gloomy', 'morose', 'compulsive',
			'irritable', 'vengeful', 'honest', 'truthful', 'innocent', 'gullible', 'bigoted', 'biased', 'narrow-minded', 'cheerful',
			'happy', 'diplomatic', 'pleasant', 'foolhardy', 'affable', 'fatalistic', 'depressing', 'cynical', 'sarcastic', 'realistic',
			'secretive', 'retiring', 'practical', 'level-headed', 'dull', 'reverent', 'scheming', 'paranoid', 'cautious', 'deceitful',
			'nervous', 'uncultured', 'boorish', 'barbaric', 'graceless', 'crude', 'cruel', 'sadistic', 'immoral', 'jealous',
			'belligerent', 'argumentative', 'arrogant', 'careless', 'curious', 'exacting', 'friendly', 'greedy', 'generous', 'moody',
			'naive', 'opinionated', 'optimistic', 'pessimistic', 'quiet', 'sober', 'suspicious', 'uncivilised', 'violent', 'peaceful'
		];
		return list[Utils.randomNumber(list.length)];
	}

	public static generateNPCSpeech() {
		const list = [
			'accented', 'articulate', 'garrulous', 'breathless', 'crisp', 'gutteral', 'high-pitched', 'lisping', 'loud', 'nasal',
			'slow', 'fast', 'squeaky', 'stuttering', 'wheezy', 'whiny', 'whispery', 'soft-spoken', 'laconic', 'blustering'
		];
		return list[Utils.randomNumber(list.length)];
	}

	public static generateNPCTrait() {
		const list = [
			'I idolize a particular hero of my faith and constantly refer to that person\'s deeds and example.',
			'I can find common ground between the fiercest enemies, empathizing with them and always working toward peace.',
			'I see omens in every event and action. The gods try to speak to us, we just need to listen.',
			'Nothing can shake my optimistic attitude.',
			'I quote (or misquote) the sacred texts and proverbs in almost every situation.',
			'I am tolerant (or intolerant) of other faiths and respect (or condemn) the worship of other gods.',
			'I\'ve enjoyed fine food, drink, and high society among my temple\'s elite. Rough living grates on me.',
			'I\'ve spent so long in the temple that I have little practical experience dealing with people in the outside world.',
			'I fall in and out of love easily, and am always pursuing someone.',
			'I have a joke for every occasion, especially occasions where humor is inappropriate.',
			'Flattery is my preferred trick for getting what I want.',
			'I\'m a born gambler who can\'t resist taking a risk for a potential payoff.',
			'I lie about almost everything, even when there\'s no good reason to.',
			'Sarcasm and insults are my weapons of choice.',
			'I keep multiple holy symbols on me and invoke whatever deity might come in useful at any given moment.',
			'I pocket anything I see that might have some value.',
			'I always have plan for what to do when things go wrong.',
			'I am always calm, no matter what the situation. I never raise my voice or let my emotions control me.',
			'The first thing I do in a new place is note the locations of everything valuable - or where such things could be hidden.',
			'I would rather make a new friend than a new enemy.',
			'I am incredibly slow to trust. Those who seem the fairest often have the most to hide.',
			'I don\'t pay attention to the risks in a situation. Never tell me the odds.',
			'The best way to get me to do something is to tell me I can\'t do it.',
			'I blow up at the slightest insult.',
			'I know a story relevant to almost every situation.',
			'Whenever I come to a new place, I collect local rumors and spread gossip.',
			'I\'m a hopeless romantic, always searching for that \'special someone\'.',
			'Nobody stays angry at me or around me for long, since I can defuse any amount of tension.',
			'I love a good insult, even one directed at me.',
			'I get bitter if I\'m not the center of attention.',
			'I\'ll settle for nothing less than perfection.',
			'I change my mood or my mind as quickly as I change key in a song.',
			'I judge people by their actions, not their words.',
			'If someone is in trouble, I\'m always willing to lend help.',
			'When I set my mind to something, I follow through no matter what gets in my way.',
			'I have a strong sense of fair play and always try to find the most equitable solution to arguments.',
			'I\'m confident in my own abilities and do what I can to instill confidence in others.',
			'Thinking is for other people. I prefer action.',
			'I misuse long words in an attempt to sound smarter.',
			'I get bored easily. When am I going to get on with my destiny?',
			'I believe that everything worth doing is worth doing right. I can\'t help it - I\'m a perfectionist.',
			'I\'m a snob who looks down on those who can\'t appreciate fine art.',
			'I always want to know how things work and what makes people tick.',
			'I\'m full of witty aphorisms and have a proverb for every occasion.',
			'I\'m rude to people who lack my commitment to hard work and fair play.',
			'I like to talk at length about my profession.',
			'I don\'t part with my money easily and will haggle tirelessly to get the best deal possible.',
			'I\'m well known for my work, and I want to make sure everyone appreciates it. I\'m always taken aback when people haven\'t heard of me.',
			'I\'ve been isolated for so long that I rarely speak, preferring gestures and the occasional grunt.',
			'I am utterly serene, even in the face of disaster.',
			'The leader of my community has something wise to say on every topic, and I am eager to share that wisdom.',
			'I feel tremendous empathy for all who suffer.',
			'I\'m oblivious to etiquette and social expectations.',
			'I connect everything that happens to me to a grand cosmic plan.',
			'I often get lost in my own thoughts and contemplations, becoming oblivious to my surroundings.',
			'I am working on a grand philosophical theory and love sharing my ideas.',
			'My eloquent flattery makes everyone I talk to feel like the most wonderful and important person in the world.',
			'The common folk love me for my kindness and generosity.',
			'No one could doubt by looking at my regal bearing that I am a cut above the unwashed masses.',
			'I take great pains to always look my best and follow the latest fashions.',
			'I don\'t like to get my hands dirty, and I won\'t be caught dead in unsuitable accommodations.',
			'Despite my birth, I do not place myself above other folk. We all have the same blood.',
			'My favor, once lost, is lost forever.',
			'If you do me an injury, I will crush you, ruin your name, and salt your fields.',
			'I\'m driven by a wanderlust that led me away from home.',
			'I watch over my friends as if they were a litter of newborn pups.',
			'I once ran twenty-five miles without stopping to warn my clan of an approaching orc horde. I\'d do it again if I had to.',
			'I have a lesson for every situation, drawn from observing nature.',
			'I place no stock in wealthy or well-mannered folk. Money and manners won\'t save you from a hungry owlbear.',
			'I\'m always picking things up, absently fiddling with them, and sometimes accidentally breaking them.',
			'I feel far more comfortable around animals than people.',
			'I was, in fact, raised by wolves.',
			'I use polysyllabic words to convey the impression of great erudition.',
			'I\'ve read every book in the world\'s greatest libraries - or like to boast that I have.',
			'I\'m used to helping out those who aren\'t as smart as I am, and I patiently explain anything and everything to others.',
			'There\'s nothing I like more than a good mystery.',
			'I\'m willing to listen to every side of an argument before I make my own judgment.',
			'I...speak...slowly...when talking...to idiots...which...almost...everyone...is...compared...to me.',
			'I am horribly, horribly awkward in social situations.',
			'I\'m convinced that people are always trying to steal my secrets.',
			'My friends know they can rely on me, no matter what.',
			'I work hard so that I can play hard when the work is done.',
			'I enjoy sailing into new ports and making new friends over a flagon of ale.',
			'I stretch the truth for the sake of a good story.',
			'To me, a tavern brawl is a nice way to get to know a new city.',
			'I never pass up a friendly wager.',
			'My language is as foul as an otyugh nest.',
			'I like a job well done, especially if I can convince someone else to do it.',
			'I\'m always polite and respectful.',
			'I\'m haunted by memories of war. I can\'t get the images of violence out of my mind.',
			'I\'ve lost too many friends, and I\'m slow to make new ones.',
			'I\'m full of inspiring and cautionary tales from my military experience relevant to almost every combat situation.',
			'I can stare down a hellhound without flinching.',
			'I enjoy being strong and like breaking things.',
			'I have a crude sense of humor.',
			'I face problems head-on. A simple direct solution is the best path to success.',
			'I hide scraps of food and trinkets away in my pockets.',
			'I ask a lot of questions.',
			'I like to squeeze into small places where no one else can get to me.',
			'I sleep with my back to a wall or tree, with everything I own wrapped in a bundle in my arms.',
			'I eat like a pig and have bad manners.',
			'I think anyone who\'s nice to me is hiding evil intent.',
			'I don\'t like to bathe.',
			'I bluntly say what other people are hinting or hiding.'
		];
		return list[Utils.randomNumber(list.length)];
	}

	public static generateNPCIdeal() {
		const list = [
			'Faith. I trust that my deity will guide my actions. I have faith that if I work hard, things will go well. (Lawful)',
			'Tradition. The ancient traditions of worship and sacrifice must be preserved and upheld. (Lawful)',
			'Charity. I always try to help those in need, no matter what the personal cost. (Good)',
			'Change. We must help bring about the changes the gods are constantly working in the world. (Chaotic)',
			'Power. I hope to one day rise to the top of my faith\'s religious hierarchy. (Lawful)',
			'Aspiration. I seek to prove my self worthy of my god\'s favor by matching my actions against his or her teachings. (Any)',
			'Independence. I am a free spirit - no one tells me what to do. (Chaotic)',
			'Fairness. I never target people who can\'t afford to lose a few coins. (Lawful)',
			'Charity. I distribute money I acquire to the people who really need it. (Good)',
			'Creativity. I never run the same con twice. (Chaotic)',
			'Friendship. Material goods come and go. Bonds of friendship last forever. (Good)',
			'Aspiration. I\'m determined to make something of myself. (Any)',
			'Honor. I don\'t steal from others in the trade. (Lawful)',
			'Freedom. Chains are meant to be broken, as are those who would forge them. (Chaotic)',
			'Charity. I steal from the wealthy so that I can help people in need. (Good)',
			'Greed. I will do whatever it takes to become wealthy. (Evil)',
			'People. I\'m loyal to my friends, not to any ideals, and everyone else can take a trip down the Styx for all I care. (Neutral)',
			'Redemption. There\'s a spark of good in everyone. (Good)',
			'Beauty. When I perform, I make the world better than it was. (Good)',
			'Tradition. The stories, legends, and songs of the past must never be forgotten. (Lawful)',
			'Creativity. The world is in need of new ideas and bold action. (Chaotic)',
			'Greed. I\'m only in it for the money and fame. (Evil)',
			'People. I like seeing the smiles on people\'s faces when I perform. That\'s all that matters. (Neutral)',
			'Honesty. Art should reflect the soul; it should come from within and reveal who we really are. (Any)',
			'Respect. People deserve to be treated with dignity and respect. (Good)',
			'Fairness. No one should get preferential treatment before the law, and no one is above the law. (Lawful)',
			'Freedom. Tyrants must not be allowed to oppress the people. (Chaotic)',
			'Might. If I become strong, I can take what I want - what I deserve. (Evil)',
			'Sincerity. There\'s no good pretending to be something I\'m not. (Neutral)',
			'Destiny. Nothing and no one can steer me away from my higher calling. (Any)',
			'Community. It is the duty of all civilized people to strengthen the bonds of community and the security of civilization. (Lawful)',
			'Generosity. My talents were given to me so that I could use them to benefit the world. (Good)',
			'Freedom. Everyone should be free to pursue his or her livelihood. (Chaotic)',
			'Greed. I\'m only in it for the money. (Evil)',
			'People. I\'m committed to the people I care about, not to ideals. (Neutral)',
			'Aspiration. I work hard to be the best there is at my craft. (Any)',
			'Greater Good. My gifts are meant to be shared with all, not used for my own benefit. (Good)',
			'Logic. Emotions must not cloud our sense of what is right and true, or our logical thinking. (Lawful)',
			'Free Thinking. Inquiry and curiosity are the pillars of progress. (Chaotic)',
			'Power. Solitude and contemplation are paths toward mystical or magical power. (Evil)',
			'Live and Let Live. Meddling in the affairs of others only causes trouble. (Neutral)',
			'Self-Knowledge. If you know yourself, there\'re nothing left to know. (Any)',
			'Respect. Respect is due to me because of my position, but all people regardless of station deserve to be treated with dignity. (Good)',
			'Responsibility. It is my duty to respect the authority of those above me, just as those below me must respect mine. (Lawful)',
			'Independence. I must prove that I can handle myself without the coddling of my family. (Chaotic)',
			'Power. If I can attain more power, no one will tell me what to do. (Evil)',
			'Family. Blood runs thicker than water. (Any)',
			'Noble Obligation. It is my duty to protect and care for the people beneath me. (Good)',
			'Change. Life is like the seasons, in constant change, and we must change with it. (Chaotic)',
			'Greater Good. It is each person\'s responsibility to make the most happiness for the whole tribe. (Good)',
			'Honor. If I dishonor myself, I dishonor my whole clan. (Lawful)',
			'Might. The strongest are meant to rule. (Evil)',
			'Nature. The natural world is more important than all the constructs of civilization. (Neutral)',
			'Glory. I must earn glory in battle, for myself and my clan. (Any)',
			'Knowledge. The path to power and self-improvement is through knowledge. (Neutral)',
			'Beauty. What is beautiful points us beyond itself toward what is true. (Good)',
			'Logic. Emotions must not cloud our logical thinking. (Lawful)',
			'No Limits. Nothing should fetter the infinite possibility inherent in all existence. (Chaotic)',
			'Power. Knowledge is the path to power and domination. (Evil)',
			'Self-improvement. The goal of a life of study is the betterment of oneself.',
			'Respect. The thing that keeps a ship together is mutual respect between captain and crew. (Good)',
			'Fairness. We all do the work, so we all share in the rewards. (Lawful)',
			'Freedom. The sea is freedom - the freedom to go anywhere and do anything. (Chaotic)',
			'Master. I\'m a predator, and the other ships on the sea are my prey. (Evil)',
			'People. I\'m committed to my crewmates, not to ideals. (Neutral)',
			'Aspiration. Someday I\'ll own my own ship and chart my own destiny. (Any)',
			'Greater Good. Our lot is to lay down our lives in defense of others. (Good)',
			'Responsibility. I do what I must and obey just authority. (Lawful)',
			'Independence. When people follow orders blindly they embrace a kind of tyranny. (Chaotic)',
			'Might. In life as in war, the stronger force wins. (Evil)',
			'Ideals aren\'t worth killing for or going to war for. (Neutral)',
			'Nation. My city, nation, or people are all that matter. (Any)',
			'Respect. All people, rich or poor, deserve respect. (Good)',
			'Community. We have to take care of each other, because no one else is going to do it. (Lawful)',
			'Change. The low are lifted up, and the high and mighty are brought down. Change is the nature of things. (Chaotic)',
			'Retribution. The rich need to be shown what life and death are like in the gutters. (Evil)',
			'People. I help people who help me - that\'s what keeps us alive. (Neutral)',
			'Aspiration. I\'m going to prove that I\'m worthy of a better life. (Any)'
		];
		return list[Utils.randomNumber(list.length)];
	}

	public static generateNPCBond() {
		const list = [
			'I would die to recover an ancient artifact of my faith that was lost long ago.',
			'I will someday get revenge on the corrupt temple hierarchy who branded me a heretic.',
			'I owe me life to the priest who took me in when my parents died.',
			'Everything I do is for the common people.',
			'I will do anything to protect the temple where I served.',
			'I seek to preserve a sacred text that my enemies consider heretical and seek to destroy.',
			'I fleeced the wrong person and must work to ensure that this individual never crosses paths with me or those I care about.',
			'I owe everything to my mentor - a horrible person who\'s probably rotting in jail somewhere.',
			'Somewhere out there I have a child who doesn\'t know me. I\'m making the world better for him or her.',
			'I come from a noble family, and one day I\'ll reclaim my lands and title from those who stole them from me.',
			'A powerful person killed someone I love. Some day soon, I\'ll have my revenge.',
			'I swindled and ruined a person who didn\'t deserve it. I seek to atone for my misdeeds but might never be able to forgive myself.',
			'I\'m trying to pay off an old debt I owe to a generous benefactor.',
			'My ill-gotten gains go to support my family.',
			'Something important was taken from me, and I aim to steal it back.',
			'I will become the greatest thief that ever lived.',
			'I\'m guilty of a terrible crime. I hope I can redeem myself for it.',
			'Someone I loved died because of a mistake I made. That will never happen again.',
			'My instrument is my most treasured possession, and it reminds me of someone I love.',
			'Someone stole my precious instrument, and someday I\'ll get it back.',
			'I want to be famous, whatever it takes.',
			'I idolize a hero of the old tales and measure my deeds against that person\'s.',
			'I will do anything to prove myself superior to me hated rival.',
			'I would do anything for the other members of my old troupe.',
			'I have a family, but I have no idea where they are. One day, I hope to see them again.',
			'I worked the land, I love the land, and I will protect the land.',
			'A proud noble once gave me a horrible beating, and I will take my revenge on any bully I encounter.',
			'My tools are symbols of my past life, and I carry them so that I will never forget my roots.',
			'I protect those who cannot protect themselves.',
			'I wish my childhood sweetheart had come with me to pursue my destiny.',
			'The workshop where I learned my trade is the most important place in the world to me.',
			'I created a great work for someone, and then found them unworthy to receive it. I\'m still looking for someone worthy.',
			'I owe my guild a great debt for forging me into the person I am today.',
			'I pursue wealth to secure someone\'s love.',
			'One day I will return to my guild and prove that I am the greatest artisan of them all.',
			'I will get revenge on the evil forces that destroyed my place of business and ruined my livelihood.',
			'Nothing is more important than the other members of my hermitage, order, or association.',
			'I entered seclusion to hide from the ones who might still be hunting me. I must someday confront them.',
			'I\'m still seeking the enlightenment I pursued in my seclusion, and it still eludes me.',
			'I entered seclusion because I loved someone I could not have.',
			'Should my discovery come to light, it could bring ruin to the world.',
			'My isolation gave me great insight into a great evil that only I can destroy.',
			'I will face any challenge to win the approval of my family.',
			'My house\'s alliance with another noble family must be sustained at all costs.',
			'Nothing is more important that the other members of my family.',
			'I am in love with the heir of a family that my family despises.',
			'My loyalty to my sovereign is unwavering.',
			'The common folk must see me as a hero of the people.',
			'My family, clan, or tribe is the most important thing in my life, even when they are far from me.',
			'An injury to the unspoiled wilderness of my home is an injury to me.',
			'I will bring terrible wrath down on the evildoers who destroyed my homeland.',
			'I am the last of my tribe, and it is up to me to ensure their names enter legend.',
			'I suffer awful visions of a coming disaster and will do anything to prevent it.',
			'It is my duty to provide children to sustain my tribe.',
			'It is my duty to protect my students.',
			'I have an ancient text that holds terrible secrets that must not fall into the wrong hands.',
			'I work to preserve a library, university, scriptorium, or monastery.',
			'My life\'s work is a series of tomes related to a specific field of lore.',
			'I\'ve been searching my whole life for the answer to a certain question.',
			'I sold my soul for knowledge. I hope to do great deeds and win it back.',
			'I\'m loyal to my captain first, everything else second.',
			'The ship is most important - crewmates and captains come and go.',
			'I\'ll always remember my first ship.',
			'In a harbor town, I have a paramour whose eyes nearly stole me from the sea.',
			'I was cheated of my fair share of the profits, and I want to get my due.',
			'Ruthless pirates murdered my captain and crewmates, plundered our ship, and left me to die. Vengeance will be mine.',
			'I would lay down my life for the people I served with.',
			'Someone saved my life on the battlefield. To this day, I will never leave a friend behind.',
			'My honor is my life.',
			'I\'ll never forget the crushing defeat my company suffered or the enemies who dealt it.',
			'Those who fight beside me are those worth dying for.',
			'I fight for those who cannot fight for themselves.',
			'My town or city is my home, and I\'ll fight to defend it.',
			'I sponsor an orphanage to keep others from enduring what I was forced to endure.',
			'I owe my survival to another urchin who taught me to live on the streets.',
			'I owe a debt I can never repay to the person who took pity on me.',
			'I escaped my life of poverty by robbing an important person, and I\'m wanted for it.',
			'No one else is going to have to endure the hardships I\'ve been through.'
		];
		return list[Utils.randomNumber(list.length)];
	}

	public static generateNPCFlaw() {
		const list = [
			'I judge others harshly, and myself even more severely.',
			'I put too much trust in those who wield power within my temple\'s hierarchy.',
			'My piety sometimes leads me to blindly trust those that profess faith in my god.',
			'I am inflexible in my thinking.',
			'I am suspicious of strangers and suspect the worst of them.',
			'Once I pick a goal, I become obsessed with it to the detriment of everything else in my life.',
			'I can\'t resist a pretty face.',
			'I\'m always in debt. I spend my ill-gotten gains on decadent luxuries faster than I bring them in.',
			'I\'m convinced that no one could ever fool me in the way I fool others.',
			'I\'m too greedy for my own good. I can\'t resist taking a risk if there\'s money involved.',
			'I can\'t resist swindling people who are more powerful than me.',
			'I hate to admit it and will hate myself for it, but I\'ll run and preserve my own hide if the going gets tough.',
			'When I see something valuable, I can\'t think about anything but how to steal it.',
			'When faced with a choice between money and my friends, I usually choose the money.',
			'If there\'s a plan, I\'ll forget it. If I don\'t forget it, I\'ll ignore it.',
			'I have a \'tell\' that reveals when I\'m lying.',
			'I turn tail and run when things go bad.',
			'An innocent person is in prison for a crime that I committed. I\'m okay with that.',
			'I\'ll do anything to win fame and renown.',
			'I\'m a sucker for a pretty face.',
			'A scandal prevents me from ever going home again. That kind of trouble seems to follow me around.',
			'I once satirized a noble who still wants my head. It was a mistake that I will likely repeat.',
			'I have trouble keeping my true feelings hidden. My sharp tongue lands me in trouble.',
			'Despite my best efforts, I am unreliable to my friends.',
			'The tyrant who rules my land will stop at nothing to see me killed.',
			'I\'m convinced of the significance of my destiny, and blind to my shortcomings and the risk of failure.',
			'The people who knew me when I was young know my shameful secret, so I can never go home again.',
			'I have a weakness for the vices of the city, especially hard drink.',
			'Secretly, I believe that things would be better if I were a tyrant lording over the land.',
			'I have trouble trusting in my allies.',
			'I\'ll do anything to get my hands on something rare or priceless.',
			'I\'m quick to assume that someone is trying to cheat me.',
			'No one must ever learn that I once stole money from guild coffers.',
			'I\'m never satisfied with what I have - I always want more.',
			'I would kill to acquire a noble title.',
			'I\'m horribly jealous of anyone who outshines my handiwork. Everywhere I go, I\'m surrounded by rivals.',
			'Now that I\'ve returned to the world, I enjoy its delights a little too much.',
			'I harbor dark bloodthirsty thoughts that my isolation failed to quell.',
			'I am dogmatic in my thoughts and philosophy.',
			'I let my need to win arguments overshadow friendships and harmony.',
			'I\'d risk too much to uncover a lost bit of knowledge.',
			'I like keeping secrets and won\'t share them with anyone.',
			'I secretly believe that everyone is beneath me.',
			'I hide a truly scandalous secret that could ruin my family forever.',
			'I too often hear veiled insults and threats in every word addressed to me, and I\'m quick to anger.',
			'I have an insatiable desire for carnal pleasures.',
			'In fact, the world does revolve around me.',
			'By my words and actions, I often bring shame to my family.',
			'I am too enamored of ale, wine, and other intoxicants.',
			'There\'s no room for caution in a life lived to the fullest.',
			'I remember every insult I\'ve received and nurse a silent resentment toward anyone who\'s ever wronged me.',
			'I am slow to trust members of other races',
			'Violence is my answer to almost any challenge.',
			'Don\'t expect me to save those who can\'t save themselves. It is nature\'s way that the strong thrive and the weak perish.',
			'I am easily distracted by the promise of information.',
			'Most people scream and run when they see a demon. I stop and take notes on its anatomy.',
			'Unlocking an ancient mystery is worth the price of a civilization.',
			'I overlook obvious solutions in favor of complicated ones.',
			'I speak without really thinking through my words, invariably insulting others.',
			'I can\'t keep a secret to save my life, or anyone else\'s.',
			'I follow orders, even if I think they\'re wrong.',
			'I\'ll say anything to avoid having to do extra work.',
			'Once someone questions my courage, I never back down no matter how dangerous the situation.',
			'Once I start drinking, it\'s hard for me to stop.',
			'I can\'t help but pocket loose coins and other trinkets I come across.',
			'My pride will probably lead to my destruction',
			'The monstrous enemy we faced in battle still leaves me quivering with fear.',
			'I have little respect for anyone who is not a proven warrior.',
			'I made a terrible mistake in battle that cost many lives - and I would do anything to keep that mistake secret.',
			'My hatred of my enemies is blind and unreasoning.',
			'I obey the law, even if the law causes misery.',
			'I\'d rather eat my armor than admit when I\'m wrong.',
			'If I\'m outnumbered, I always run away from a fight.',
			'Gold seems like a lot of money to me, and I\'ll do just about anything for more of it.',
			'I will never fully trust anyone other than myself.',
			'I\'d rather kill someone in their sleep than fight fair.',
			'It\'s not stealing if I need it more than someone else.',
			'People who don\'t take care of themselves get what they deserve.'
		];
		return list[Utils.randomNumber(list.length)];
	}

	public static generateTreasure() {
		let result = '';

		const stones = [
			'diamond', 'ruby', 'sapphire', 'emerald', 'amethyst', 'garnet', 'topaz', 'pearl', 'black pearl', 'opal', 'fire opal',
			'amber', 'coral', 'agate', 'carnelian', 'jade', 'peridot', 'moonstone', 'alexandrite', 'aquamarine', 'jacinth', 'marble'
		];

		switch (Utils.randomNumber(12)) {
			case 0:
			case 1:
			case 2:
				{
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
				}
				break;
			case 3:
			case 4:
			case 5:
				{
					// Object
					const fObjects = [
						'medal', 'statuette', 'sculpture', 'idol', 'chalice', 'goblet', 'dish', 'bowl'
					];
					const object = fObjects[Utils.randomNumber(fObjects.length)];

					const objectAdjectives = [
						'small', 'large', 'light', 'heavy', 'delicate', 'fragile', 'masterwork', 'elegant'
					];
					const objectAdjective = objectAdjectives[Utils.randomNumber(objectAdjectives.length)];

					result = objectAdjective + ' ' + object;
				}
				break;
			case 6:
			case 7:
			case 8:
				{
					// Jewellery
					const jewellery = [
						'ring', 'necklace', 'crown', 'circlet', 'bracelet', 'anklet', 'torc', 'brooch', 'pendant', 'locket', 'diadem', 'tiara', 'earring'
					];
					const item = jewellery[Utils.randomNumber(jewellery.length)];

					const metals = [
						'gold', 'silver', 'bronze', 'platinum', 'electrum', 'mithral', 'orium', 'adamantine'
					];
					const metal = metals[Utils.randomNumber(metals.length)];

					result = metal + ' ' + item;

					switch (Utils.randomNumber(5)) {
						case 0:
							{
								// Enamelled or laquered
								const deco1 = (Utils.randomBoolean()) ? 'enamelled' : 'laquered';
								result = deco1 + ' ' + result;
							}
							break;
						case 1:
							{
								// Filigree or plating
								const metal2 = metals[Utils.randomNumber(metals.length)];
								const deco2 = (Utils.randomBoolean()) ? 'plated' : 'filigreed';
								result = metal2 + '-' + deco2 + ' ' + result;
							}
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
				}
				break;
			case 9:
			case 10:
				{
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

					const artAdjectives = [
						'small', 'large', 'delicate', 'fragile', 'elegant', 'detailed'
					];
					const artAdjective = artAdjectives[Utils.randomNumber(artAdjectives.length)];

					const media = [
						'canvas', 'paper', 'parchment', 'wood panels', 'fabric'
					];
					const medium = media[Utils.randomNumber(media.length)];

					result = artAdjective + ' ' + artwork + ' on ' + medium;
				}
				break;
			case 11:
				{
					// Musical instrument
					const instruments = [
						'lute', 'lyre', 'mandolin', 'violin', 'drum', 'flute', 'clarinet', 'accordion',
						'banjo', 'bodhran', 'ocarina', 'zither', 'djembe', 'shawm'
					];
					const instrument = instruments[Utils.randomNumber(instruments.length)];

					const instrumentAdjectives = [
						'small', 'large', 'light', 'heavy', 'delicate', 'fragile', 'masterwork', 'elegant'
					];
					const instrumentAdjective = instrumentAdjectives[Utils.randomNumber(instrumentAdjectives.length)];

					result = instrumentAdjective + ' ' + instrument;
				}
				break;
		}

		switch (Utils.randomNumber(5)) {
			case 0:
				{
					const locations = [
						'feywild', 'shadowfell', 'elemental chaos', 'astral plane', 'abyss',
						'distant north', 'distant east', 'distant west', 'distant south'
					];
					const location = locations[Utils.randomNumber(locations.length)];

					result += ' from the ' + location;
				}
				break;
			case 1:
				{
					const gerunds = [
						'decorated with', 'inscribed with', 'engraved with', 'embossed with', 'carved with'
					];
					const gerund = gerunds[Utils.randomNumber(gerunds.length)];

					const adjectives = [
						'indecipherable', 'ancient', 'curious', 'unusual', 'dwarven', 'eladrin', 'elven', 'draconic', 'gith'
					];
					const adjective = adjectives[Utils.randomNumber(adjectives.length)];

					const designs = ['script', 'designs', 'sigils', 'runes', 'glyphs', 'patterns'];
					const design = designs[Utils.randomNumber(designs.length)];

					result += ' ' + gerund + ' ' + adjective + ' ' + design;
				}
				break;
			case 2:
				{
					const magicGerunds = [
						'glowing with', 'suffused with', 'infused with', 'humming with', 'pulsing with'
					];
					const magicGerund = magicGerunds[Utils.randomNumber(magicGerunds.length)];

					const magics = [
						'arcane', 'divine', 'primal', 'psionic', 'dark', 'shadow', 'elemental', 'ethereal', 'unknown'
					];
					const magic = magics[Utils.randomNumber(magics.length)];

					const powers = [
						'energy', 'power', 'magic'
					];
					const power = powers[Utils.randomNumber(powers.length)];

					result += ' ' + magicGerund + ' ' + magic + ' ' + power;
				}
				break;
			case 4:
				{
					let stone = stones[Utils.randomNumber(stones.length)];

					if (Utils.randomBoolean()) {
						stone += 's';
					} else {
						stone = 'a single ' + stone;
					}

					const setGerunds = [
						'set with', 'inlaid with', 'studded with', 'with shards of'
					];
					const setGerund = setGerunds[Utils.randomNumber(setGerunds.length)];

					result += ' ' + setGerund + ' ' + stone;
				}
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

	public static generateRoomDescription() {
		const lines: string[] = [];

		if (Utils.randomNumber(2) === 0) {
			lines.push(this.randomWall());

			if (Utils.randomNumber(2) === 0) {
				lines.push(this.randomWallFinish());
			}
		}

		if (Utils.randomNumber(5) === 0) {
			lines.push(this.randomAir());
		}

		if (Utils.randomNumber(5) === 0) {
			lines.push(this.randomSmell());
		}

		if (Utils.randomNumber(5) === 0) {
			lines.push(this.randomSound());
		}

		if (Utils.randomNumber(10) === 0) {
			lines.push(this.randomActivity());
		}

		return lines.join(' ').trim();
	}

	private static randomWall() {
		const walls: string[] = [
			'The walls of this area are ' + this.randomWallMaterial() + '.',
			'The walls of this area are ' + this.randomWallMaterial() + ' and ' + this.randomWallMaterial() + '.',
			'The floor of this area is made from ' + this.randomWallMaterial() + '.',
			'The walls of this area are made of ' + this.randomWallMaterial() + ', while the ceiling and floor are ' + this.randomWallMaterial() + '.',
			'The walls of this area have been hewn out of solid rock.',
			'The walls of this area have been panelled in dark wood.'
		];

		const index = Utils.randomNumber(walls.length);
		return walls[index];
	}

	private static randomWallMaterial() {
		const materials: string[] = [
			'granite',
			'slate',
			'sandstone',
			'brick',
			'marble',
			'slabs of rock',
			'an unfamiliar rock'
		];

		const index = Utils.randomNumber(materials.length);
		let material = materials[index];

		if (Utils.randomNumber(2) === 0) {
			const adjectives: string[] = [
				'polished',
				'rough',
				'chiselled',
				'uneven',
				'worked',
				this.potionColour(false),
				this.potionColour(false) + ' and ' + this.potionColour(false)
			];

			const adjIndex = Utils.randomNumber(adjectives.length);
			material = adjectives[adjIndex] + ' ' + material;
		}

		return material;
	}

	private static randomWallFinish() {
		const finishes: string[] = [
			'They are covered in black soot.',
			'They are ' + this.randomStyle() + ' with ' + this.randomDecoration() + '.',
			'They are covered in claw marks.',
			'They have been painted ' + this.potionColour(false) + '.',
			'It is possible to tell that they were once plastered.',
			'Here and there, graffiti covers them.',
			'A thick layer of dust covers the room.',
			'Moss and lichen grows here and there on them.',
			'The patina of age covers them.',
			'Childlike drawings and sketches cover them.',
			'Cryptic signs have been scratched into them.'
		];

		const index = Utils.randomNumber(finishes.length);
		return finishes[index];
	}

	private static randomStyle() {
		const styles: string[] = [
			'painted',
			'engraved'
		];

		const index = Utils.randomNumber(styles.length);
		return styles[index];
	}

	private static randomDecoration() {
		const deco: string[] = [
			'abstract artwork',
			'battle scenes',
			'landscape scenes',
			'hunting scenes',
			'pastoral scenes',
			'religious symbols',
			'runes',
			'glyphs',
			'sigils',
			'cryptic signs'
		];

		const index = Utils.randomNumber(deco.length);
		return deco[index];
	}

	private static randomAir() {
		const air: string[] = [
			'The room is bitterly cold.',
			'There is a distinct chill in the air.',
			'A cold breeze blows through this area.',
			'A warm draught blows through this area.',
			'The area is uncomfortably hot.',
			'The air is dank.',
			'The air here is warm and humid.',
			'A strange mist hangs in the air here.',
			'The room\'s surfaces are covered in frost.'
		];

		const index = Utils.randomNumber(air.length);
		return air[index];
	}

	private static randomSmell() {
		const smells: string[] = [
			'A smell of burning hangs in the air.',
			'The air feels stagnant.',
			'The air smells ' + this.potionSmell(),
			'From time to time the smell of blood catches your nostrils.',
			'The stench of rotting meat is in the air.',
			'The area has a strange musky smell.',
			'You notice a strangly acrid smell throughout the area.',
			'The area is filled with an unpleasant putrid smell.'
		];

		const index = Utils.randomNumber(smells.length);
		return smells[index];
	}

	private static randomSound() {
		const sounds: string[] = [
			'You can hear distant chanting.',
			'You can hear a quiet buzzing sound.',
			'The sound of running water fills this area.',
			'A low humming sound can be heard.',
			'The area is unnaturally quiet.',
			'A quiet susurration can just be heard.',
			'Creaking sounds fill the area.',
			'Scratching sounds can be heard.',
			'From time to time, a distant voice can be heard.'
		];

		const index = Utils.randomNumber(sounds.length);
		return sounds[index];
	}

	private static randomActivity() {
		const activities: string[] = [
			'The dust swirls as if disturbed by movement.',
			'You catch a sudden movement out of the corner of your eye.',
			'From time to time tiny pieces of debris fall from the ceiling.',
			'Water drips slowly from a crack in the ceiling.',
			'Water drips down the walls.'
		];

		const index = Utils.randomNumber(activities.length);
		return activities[index];
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
		}

		if (complex && (Utils.randomNumber(5) === 0)) {
			const index1 = Utils.randomNumber(values.length);
			const index2 = Utils.randomNumber(values.length);

			// Make sure the shorter one is first
			const colours = [values[index1], values[index2]];
			Utils.sort(colours, [{ field: 'length', dir: 'asc' }]);

			return colours[0] + ' and ' + colours[1];
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
		switch (Utils.randomNumber(6)) {
			case 0:
				return 'with ' + this.potionColour(true) + ' specks';
			case 1:
				return 'with flecks of ' + this.potionColour(false);
			case 2:
				{
					const col = this.potionColour(true);
					const article = Shakespeare.startsWithVowel(col) ? 'an' : 'a';
					return 'with ' + article + ' ' + col + ' suspension';
				}
			case 3:
				return 'with a floating ' + this.potionColour(true) + ' layer';
			case 4:
				return 'with a ribbon of ' + this.potionColour(false);
			case 5:
				return 'with ' + this.potionColour(true) + ' marbling';
		}

		return '';
	}

	private static potionLiquid() {
		const values = [
			'liquid', 'solution', 'draught', 'oil', 'elixir', 'potion'
		];
		return values[Utils.randomNumber(values.length)];
	}

	private static potionContainer() {
		const shapes = [
			'small', 'rounded', 'tall', 'square', 'irregularly-shaped', 'long-necked', 'cylindrical', 'round-bottomed'
		];
		const materials = [
			'glass', 'metal', 'ceramic', 'crystal'
		];
		const types = [
			'vial', 'jar', 'bottle', 'flask'
		];

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
}
