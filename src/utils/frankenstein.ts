// This utility file deals with monster groups and monsters

import { Factory } from './factory';
import { Gygax } from './gygax';
import { Shakespeare } from './shakespeare';
import { Utils } from './utils';

import { CONDITION_TYPES } from '../models/condition';
import { EncounterSlot } from '../models/encounter';
import { Monster, MonsterGroup, Trait, TRAIT_TYPES } from '../models/monster';

export class Frankenstein {
	public static getTypicalHP(monster: Monster) {
		const sides = Gygax.hitDieType(monster.size);
		const hpPerDie = ((sides + 1) / 2) + Gygax.modifierValue(monster.abilityScores.con);
		return Math.floor(monster.hitDice * hpPerDie);
	}

	public static getTypicalHPString(monster: Monster) {
		const die = Gygax.hitDieType(monster.size);
		const conMod = Gygax.modifierValue(monster.abilityScores.con) * monster.hitDice;

		let conModStr = '';
		if (conMod > 0) {
			conModStr = ' + ' + conMod;
		}
		if (conMod < 0) {
			conModStr = ' - ' + Math.abs(conMod);
		}

		return monster.hitDice + 'd' + die + conModStr;
	}

	public static getVisionRadius(monster: Monster) {
		let dv = 0;

		const exp = monster.senses.match(/dark\s?vision\s+(\d+)\s?ft/i);
		if (exp) {
			dv = parseInt(exp[1], 10);
		}

		return dv;
	}

	public static nudgeValue(target: Monster, field: string, delta: number) {
		let source: any = target;
		let value: any = null;
		const tokens = field.split('.');
		tokens.forEach(tkn => {
			if (tkn === tokens[tokens.length - 1]) {
				value = source[tkn];
			} else {
				source = source[tkn];
			}
		});

		let newValue;
		switch (field) {
			case 'challenge':
				newValue = Gygax.nudgeChallenge(value, delta);
				break;
			case 'size':
				newValue = Gygax.nudgeSize(value, delta);
				break;
			default:
				newValue = (value ? value : 0) + delta;
				newValue = Math.max(newValue, 0);
				break;
		}

		Frankenstein.changeValue(target, field, newValue);
	}

	public static changeValue(target: Monster, field: string, value: any) {
		let source: any = target;
		const tokens = field.split('.');
		tokens.forEach(tkn => {
			if (tkn === tokens[tokens.length - 1]) {
				source[tkn] = value;
			} else {
				source = source[tkn];
			}
		});
	}

	public static clear(monster: Monster) {
		monster.name = '';
		monster.size = 'medium';
		monster.role = '';
		monster.category = 'beast';
		monster.tag = '';
		monster.alignment = '';
		monster.challenge = 1;
		monster.abilityScores.str = 10;
		monster.abilityScores.dex = 10;
		monster.abilityScores.con = 10;
		monster.abilityScores.int = 10;
		monster.abilityScores.wis = 10;
		monster.abilityScores.cha = 10;
		monster.ac = 10;
		monster.acInfo = '';
		monster.hitDice = 1;
		monster.damage.resist = '';
		monster.damage.vulnerable = '';
		monster.damage.immune = '';
		monster.savingThrows = '';
		monster.speed = '';
		monster.skills = '';
		monster.senses = '';
		monster.languages = '';
		monster.traits = [];
		monster.conditionImmunities = '';
		monster.portrait = '';
		monster.legendaryActions = 0;
	}

	public static sortTraits(monster: Monster) {
		Utils.sort(monster.traits);

		// Multiattack traits should be first
		const multi = monster.traits.filter(t => t.name.toLowerCase().startsWith('multiattack'));
		const others = monster.traits.filter(t => !t.name.toLowerCase().startsWith('multiattack'));
		monster.traits = multi.concat(others);
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Monster creation

	public static createFromJSON(data: any): Monster {
		const monster = Factory.createMonster();

		monster.type = 'monster';
		monster.name = data.name;
		monster.size = data.size.toLowerCase();
		monster.role = '';
		monster.category = data.type;
		monster.tag = data.subtype;
		monster.alignment = data.alignment;
		monster.challenge = Gygax.parseChallenge(data.challenge_rating);
		monster.ac = data.armor_class;
		monster.acInfo = '';
		monster.speed = data.speed;
		monster.senses = data.senses;
		monster.languages = data.languages;

		const index = data.hit_dice.indexOf('d');
		monster.hitDice = parseInt(data.hit_dice.substring(0, index), 10);

		monster.abilityScores.str = data.strength;
		monster.abilityScores.dex = data.dexterity;
		monster.abilityScores.con = data.constitution;
		monster.abilityScores.int = data.intelligence;
		monster.abilityScores.wis = data.wisdom;
		monster.abilityScores.cha = data.charisma;

		monster.damage.resist = data.damage_resistances;
		monster.damage.vulnerable = data.damage_vulnerabilities;
		monster.damage.immune = data.damage_immunities;
		monster.conditionImmunities = data.condition_immunities;

		monster.legendaryActions = 0;

		const saves = [
			{
				field: 'strength_save',
				text: 'Strength'
			},
			{
				field: 'dexterity_save',
				text: 'Dexterity'
			},
			{
				field: 'constitution_save',
				text: 'Constitution'
			},
			{
				field: 'intelligence_save',
				text: 'Intelligence'
			},
			{
				field: 'wisdom_save',
				text: 'Wisdom'
			},
			{
				field: 'charisma_save',
				text: 'Charisma'
			}
		];
		saves.forEach(save => {
			if (data[save.field]) {
				const str = save.text + ' ' + data[save.field];
				monster.savingThrows += monster.savingThrows === '' ? str : ', ' + str;
			}
		});

		const skills = [
			{
				field: 'acrobatics',
				text: 'Acrobatics'
			},
			{
				field: 'animal_handling',
				text: 'Animal handling'
			},
			{
				field: 'arcana',
				text: 'Arcana'
			},
			{
				field: 'athletics',
				text: 'Athletics'
			},
			{
				field: 'deception',
				text: 'Deception'
			},
			{
				field: 'history',
				text: 'History'
			},
			{
				field: 'insight',
				text: 'Insight'
			},
			{
				field: 'intimidation',
				text: 'Intimidation'
			},
			{
				field: 'investigation',
				text: 'Investigation'
			},
			{
				field: 'medicine',
				text: 'Medicine'
			},
			{
				field: 'nature',
				text: 'Nature'
			},
			{
				field: 'perception',
				text: 'Perception'
			},
			{
				field: 'performance',
				text: 'Performance'
			},
			{
				field: 'persuasion',
				text: 'Persuasion'
			},
			{
				field: 'religion',
				text: 'Religion'
			},
			{
				field: 'sleight_of_hand',
				text: 'Sleight of hand'
			},
			{
				field: 'stealth',
				text: 'Stealth'
			},
			{
				field: 'survival',
				text: 'Survival'
			}
		];
		skills.forEach(skill => {
			if (data[skill.field]) {
				const str = skill.text + ' ' + data[skill.field];
				monster.skills += monster.skills === '' ? str : ', ' + str;
			}
		});

		if (data.special_abilities) {
			data.special_abilities.forEach((rawTrait: any) => {
				const trait = this.buildTrait(rawTrait, 'trait');
				monster.traits.push(trait);
			});
		}
		if (data.actions) {
			data.actions.forEach((rawTrait: any) => {
				const trait = this.buildTrait(rawTrait, 'action');
				monster.traits.push(trait);
			});
		}
		if (data.reactions) {
			data.reactions.forEach((rawTrait: any) => {
				const trait = this.buildTrait(rawTrait, 'reaction');
				monster.traits.push(trait);
			});
		}
		if (data.legendary_actions) {
			data.legendary_actions.forEach((rawTrait: any) => {
				const trait = this.buildTrait(rawTrait, 'legendary');
				monster.traits.push(trait);
			});
		}

		if (monster.traits.some(t => (t.type === 'legendary') || (t.type === 'mythic'))) {
			monster.legendaryActions = 3;
		}

		monster.role = this.getRole(monster);

		return monster;
	}

	private static buildTrait(rawTrait: any, type: 'trait' | 'action' | 'bonus' | 'reaction' | 'legendary' | 'mythic' | 'lair'): Trait {
		let name = '';
		let usage = '';

		const openBracket = rawTrait.name.indexOf('(');
		if (openBracket === -1) {
			name = rawTrait.name;
		} else {
			const closeBracket = rawTrait.name.indexOf(')');
			name = rawTrait.name.substring(0, openBracket - 1);
			usage = rawTrait.name.substring(openBracket + 1, closeBracket).toLowerCase();
		}

		const text: string = rawTrait.desc.replace(/•/g, '*');

		let finalType = type;
		if (name === 'Lair Actions') {
			finalType = 'lair';
		}
		if (text.indexOf('As a bonus action') === 0) {
			finalType = 'bonus';
		}

		return {
			id: Utils.guid(),
			type: finalType,
			name: name,
			usage: usage,
			text: text,
			uses: 0
		};
	}

	public static import(source: string, monster: Monster): void {
		Frankenstein.clear(monster);

		const parser = new DOMParser();
		const doc = parser.parseFromString(source, 'text/html');

		try {
			monster.name = (doc.getElementsByClassName('mon-stat-block__name')[0] as HTMLElement).innerText.trim();
			let meta = (doc.getElementsByClassName('mon-stat-block__meta')[0] as HTMLElement).innerText.toLowerCase().trim();
			const firstSpace = meta.indexOf(' ');
			monster.size = meta.substring(0, firstSpace).trim();
			meta = meta.substring(firstSpace + 1).trim();
			const comma = meta.indexOf(',');
			monster.alignment = meta.substring(comma + 1).trim();
			meta = meta.substring(0, comma).trim();
			const open = meta.indexOf('(');
			const close = meta.indexOf(')');
			if ((open !== -1) && (close !== -1)) {
				monster.tag = meta.substring(open + 1, close).trim();
				meta = meta.substring(0, open).trim();
			}
			monster.category = meta;
		} catch (ex) {
			console.error(ex);
		}

		try {
			const attrs = doc.getElementsByClassName('mon-stat-block__attribute');
			for (let attrIndex = 0; attrIndex !== attrs.length; ++attrIndex) {
				const attr = attrs[attrIndex];
				const label = (attr.getElementsByClassName('mon-stat-block__attribute-label')[0] as HTMLElement).innerText.toLowerCase().trim();
				const value = (attr.getElementsByClassName('mon-stat-block__attribute-data-value')[0] as HTMLElement).innerText.toLowerCase().trim();
				switch (label) {
					case 'armor class':
						monster.ac = Number.parseInt(value, 10);
						let info = (attr.getElementsByClassName('mon-stat-block__attribute-data-extra')[0] as HTMLElement).innerText.toLowerCase().trim();
						if (info.startsWith('(')) {
							info = info.substr(1, info.length - 2);
						}
						monster.acInfo = info;
						break;
					case 'hit points':
						const extra = (attr.getElementsByClassName('mon-stat-block__attribute-data-extra')[0] as HTMLElement).innerText.toLowerCase().trim();
						monster.hitDice = Number.parseInt(extra.substring(1, extra.indexOf('d')), 10);
						break;
					case 'speed':
						monster.speed = value;
						break;
				}
			}
		} catch (ex) {
			console.error(ex);
		}

		try {
			const stats = doc.getElementsByClassName('ability-block__stat');
			for (let statIndex = 0; statIndex !== stats.length; ++statIndex) {
				const stat = stats[statIndex];
				const ability = (stat.getElementsByClassName('ability-block__heading')[0] as HTMLElement).innerText.toLowerCase().trim();
				const scoreStr = (stat.getElementsByClassName('ability-block__score')[0] as HTMLElement).innerText.toLowerCase().trim();
				const score = Number.parseInt(scoreStr, 10);
				monster.abilityScores[ability as 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha'] = score;
			}
		} catch (ex) {
			console.error(ex);
		}

		try {
			const tidbits = doc.getElementsByClassName('mon-stat-block__tidbit');
			for (let tidbitIndex = 0; tidbitIndex !== tidbits.length; ++tidbitIndex) {
				const tidbit = tidbits[tidbitIndex];
				const label = (tidbit.getElementsByClassName('mon-stat-block__tidbit-label')[0] as HTMLElement).innerText.toLowerCase().trim();
				const value = (tidbit.getElementsByClassName('mon-stat-block__tidbit-data')[0] as HTMLElement).innerText.toLowerCase().trim();
				switch (label) {
					case 'saving throws':
						monster.savingThrows = value;
						break;
					case 'skills':
						monster.skills = value;
						break;
					case 'damage vulnerabilities':
						monster.damage.vulnerable = value;
						break;
					case 'damage resistances':
						monster.damage.resist = value;
						break;
					case 'damage immunities':
						monster.damage.immune = value;
						break;
					case 'condition immunities':
						monster.conditionImmunities = value;
						break;
					case 'senses':
						monster.senses = value;
						break;
					case 'languages':
						monster.languages = value;
						break;
					case 'challenge':
						const sp = value.indexOf(' ');
						monster.challenge = Number.parseInt(value.substring(0, sp), 10);
						break;
				}
			}
		} catch (ex) {
			console.error(ex);
		}

		try {
			const blocks = doc.getElementsByClassName('mon-stat-block__description-block');
			for (let blockIndex = 0; blockIndex !== blocks.length; ++blockIndex) {
				const block = blocks[blockIndex];
				let traitType: 'trait' | 'action' | 'bonus' | 'reaction' | 'legendary' | 'mythic' | 'lair' = 'trait';
				const headingElements = block.getElementsByClassName('mon-stat-block__description-block-heading');
				if (headingElements.length > 0) {
					const heading = (headingElements[0] as HTMLElement).innerText.toLowerCase().trim();
					switch (heading) {
						case 'actions':
							traitType = 'action';
							break;
						case 'bonus actions':
							traitType = 'bonus';
							break;
						case 'reactions':
							traitType = 'reaction';
							break;
						case 'legendary actions':
							traitType = 'legendary';
							break;
						case 'mythic actions':
							traitType = 'mythic';
							break;
						case 'lair actions':
							traitType = 'lair';
							break;
					}
				}
				const traits = block.getElementsByTagName('p');
				for (let traitIndex = 0; traitIndex !== traits.length; ++traitIndex) {
					let text = (traits[traitIndex] as HTMLElement).innerText.trim();
					const t = Factory.createTrait();
					t.type = traitType;
					const stop = text.indexOf('.');
					t.text = text.substring(stop + 1).trim();
					text = text.substring(0, stop);
					const open = text.indexOf('(');
					const close = text.indexOf(')');
					if ((open !== -1) && (close !== -1)) {
						t.usage = text.substring(open + 1, close).trim();
						text = text.substring(0, open).trim();
					}
					t.name = text;
					if (t.name) {
						monster.traits.push(t);
					} else {
						// This is part of the previous trait
						const prev = monster.traits[monster.traits.length - 1];
						prev.text += '\n';
						prev.text += t.text;
					}
				}
			}
		} catch (ex) {
			console.error(ex);
		}

		if (monster.traits.some(t => (t.type === 'legendary') || (t.type === 'mythic'))) {
			monster.legendaryActions = 3;
		}

		monster.role = this.getRole(monster);
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Themes

	public static getThemes(library: MonsterGroup[], slot: EncounterSlot) {
		const themes: Monster[] = [];
		let monster: Monster | null = null;

		library.forEach(group => {
			group.monsters.forEach(m => {
				if (m.id === slot.monsterID) {
					monster = m;
				}

				if ((m.id !== slot.monsterID) && (m.tag === 'any race')) {
					themes.push(m);
				}
			});
		});

		if (monster) {
			const similar = themes.filter(theme => theme.challenge <= (monster as Monster).challenge);
			if (similar.length > 0) {
				return similar;
			}
		}

		return themes;
	}

	public static applyTheme(target: Monster, theme: Monster) {
		const clone: Monster = JSON.parse(JSON.stringify(target));

		// These things don't change:
		// Type
		// Size
		// Role
		// Category
		// Tag
		// Alignment
		// Languages
		// Portrait

		clone.id = Utils.guid();

		if ((clone.name !== '') && (theme.name !== '')) {
			clone.name = clone.name + ' ' + theme.name;
		}

		clone.challenge = Math.max(clone.challenge, theme.challenge);

		if (theme.ac > clone.ac) {
			clone.ac = theme.ac;
			clone.acInfo = theme.acInfo;
		}

		clone.hitDice = Math.max(clone.hitDice, theme.hitDice);

		clone.abilityScores.str = Math.max(clone.abilityScores.str, theme.abilityScores.str);
		clone.abilityScores.dex = Math.max(clone.abilityScores.dex, theme.abilityScores.dex);
		clone.abilityScores.con = Math.max(clone.abilityScores.con, theme.abilityScores.con);
		clone.abilityScores.int = Math.max(clone.abilityScores.int, theme.abilityScores.int);
		clone.abilityScores.wis = Math.max(clone.abilityScores.wis, theme.abilityScores.wis);
		clone.abilityScores.cha = Math.max(clone.abilityScores.cha, theme.abilityScores.cha);

		const immuneA = this.parseDamageMods(clone.damage.immune);
		const immuneB = this.parseDamageMods(theme.damage.immune);
		clone.damage.immune = Utils.distinct(immuneA.concat(immuneB)).sort().join('; ');
		const resistA = this.parseDamageMods(clone.damage.resist);
		const resistB = this.parseDamageMods(theme.damage.resist);
		clone.damage.resist = Utils.distinct(resistA.concat(resistB)).filter(dt => !clone.damage.immune.includes(dt)).sort().join('; ');
		const vulnerableA = this.parseDamageMods(clone.damage.vulnerable);
		const vulnerableB = this.parseDamageMods(theme.damage.vulnerable);
		clone.damage.vulnerable = Utils.distinct(vulnerableA.concat(vulnerableB)).filter(dt => !clone.damage.immune.includes(dt) && !clone.damage.resist.includes(dt)).sort().join('; ');

		const ciA = clone.conditionImmunities.split(/[,;]/).map(s => s.trim());
		const ciB = target.conditionImmunities.split(/[,;]/).map(s => s.trim());
		clone.conditionImmunities = Utils.distinct(ciA.concat(ciB)).sort().join(', ');

		const savesA = this.parseSavingThrows(clone.savingThrows);
		const savesB = this.parseSavingThrows(theme.savingThrows);
		const combinedSaves = Utils.sort(Utils.distinct(savesA.concat(savesB)));
		clone.savingThrows = combinedSaves.map(save => {
			const score = clone.abilityScores[save.ability as 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha'];
			const bonus = Gygax.modifierValue(score) + Gygax.proficiency(clone.challenge);
			return save.name + ' ' + (bonus >= 0 ? '+' : '') + bonus;
		}).join(', ');

		const skillsA = this.parseSkills(clone.skills);
		const skillsB = this.parseSkills(theme.skills);
		const combinedSkills = Utils.sort(Utils.distinct(skillsA.concat(skillsB)));
		clone.skills = combinedSkills.map(skill => {
			const score = clone.abilityScores[skill.ability as 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha'];
			const bonus = Gygax.modifierValue(score) + Gygax.proficiency(clone.challenge);
			return skill.name + ' ' + (bonus >= 0 ? '+' : '') + bonus;
		}).join(', ');

		const speedA = this.parseSpeeds(clone.speed);
		const speedB = this.parseSpeeds(theme.speed);
		const walk = Math.max(speedA.walk, speedB.walk);
		const burrow = Math.max(speedA.burrow, speedB.burrow);
		const climb = Math.max(speedA.climb, speedB.climb);
		const fly = Math.max(speedA.fly, speedB.fly);
		const swim = Math.max(speedA.swim, speedB.swim);
		const hover = speedA.hover || speedB.hover;
		const speeds = [];
		if (walk > 0) {
			speeds.push(walk + ' ft');
		}
		if (burrow > 0) {
			speeds.push('burrow ' + burrow + ' ft');
		}
		if (climb > 0) {
			speeds.push('climb ' + climb + ' ft');
		}
		if (fly > 0) {
			speeds.push('fly ' + fly + ' ft' + (hover ? ' (hover)' : ''));
		}
		if (swim > 0) {
			speeds.push('swim ' + swim + ' ft');
		}
		clone.speed = speeds.join(', ');

		const sensesA = this.parseSenses(clone.senses);
		const sensesB = this.parseSenses(theme.senses);
		const blindsight = Math.max(sensesA.blindsight, sensesB.blindsight);
		const darkvision = Math.max(sensesA.darkvision, sensesB.darkvision);
		const tremorsense = Math.max(sensesA.tremorsense, sensesB.tremorsense);
		const truesight = Math.max(sensesA.truesight, sensesB.truesight);
		const senses = [];
		if (blindsight > 0) {
			senses.push('blindsight ' + blindsight + ' ft');
		}
		if (darkvision > 0) {
			senses.push('darkvision ' + darkvision + ' ft');
		}
		if (tremorsense > 0) {
			senses.push('tremorsense ' + tremorsense + ' ft');
		}
		if (truesight > 0) {
			senses.push('truesight ' + truesight + ' ft');
		}
		clone.senses = senses.join(', ');
		if (clone.senses !== '') {
			clone.senses += ', ';
		}
		let perc = 10 + Gygax.modifierValue(clone.abilityScores.wis);
		if (clone.skills.includes('Perception')) {
			perc += Gygax.proficiency(clone.challenge);
		}
		clone.senses += 'passive Perception ' + perc;

		clone.traits.forEach(t => {
			if (this.getToHitExpressions(t).length + this.getDiceExpressions(t).length + this.getSaveExpressions(t).length > 0) {
				const profDelta = Gygax.proficiency(clone.challenge) - Gygax.proficiency(target.challenge);
				if (profDelta > 0) {
					t.text += '\n\n*Increase attack bonus, damage, and save DC by +' + profDelta + '*';
				}
			}
		});
		theme.traits.forEach(t => {
			const nameClash = clone.traits.find(tr => tr.name === t.name);
			const copied = this.copyTrait(t, clone, theme);
			if (nameClash) {
				copied.name += ' (' + (theme.name || 'theme') + ')';
			}
			if (this.getToHitExpressions(copied).length + this.getDiceExpressions(copied).length + this.getSaveExpressions(copied).length > 0) {
				const profDelta = Gygax.proficiency(clone.challenge) - Gygax.proficiency(theme.challenge);
				if (profDelta > 0) {
					copied.text += '\n\n*Increase attack bonus, damage, and save DC by +' + profDelta + '*';
				}
			}
		});
		this.sortTraits(clone);

		if (clone.traits.some(t => t.type === 'legendary')) {
			clone.legendaryActions = Math.max(clone.legendaryActions, 3);
		}

		return clone;
	}

	public static parseDamageMods(str: string) {
		const types = ['acid', 'bludgeoning', 'cold', 'fire', 'force', 'lightning', 'necrotic', 'piercing', 'poison', 'psychic', 'radiant', 'slashing', 'thunder'];

		const result: string[] = [];

		str.toLowerCase().split(/[;]/).map(section => section.trim()).forEach(section => {
			const tokens = section.split(/[,]/).map(token => token.trim());
			// If the token contains any word that isn't a damage type, it's one single phrase
			const isPhrase = tokens.some(token => !types.includes(token));
			if (isPhrase) {
				result.push(section);
			} else {
				tokens.forEach(token => result.push(token));
			}
		});

		return result;
	}

	public static parseSpeeds(str: string) {
		const values = {
			walk: 0,
			burrow: 0,
			climb: 0,
			fly: 0,
			swim: 0,
			hover: false
		};

		const sections = str.split(/[,;]/).map(token => token.trim());
		sections.forEach(token => {
			const val = token.match(/\d+/);
			if (val) {
				const ft = parseInt(val[0], 10);

				if (token.startsWith('burrow')) {
					values.burrow = ft;
				} else if (token.startsWith('climb')) {
					values.climb = ft;
				} else if (token.startsWith('fly')) {
					values.fly = ft;
					values.hover = token.includes('hover');
				} else if (token.startsWith('swim')) {
					values.swim = ft;
				} else {
					values.walk = ft;
				}
			}
		});

		return values;
	}

	public static parseSenses(str: string) {
		const values = {
			blindsight: 0,
			darkvision: 0,
			tremorsense: 0,
			truesight: 0
		};

		const sections = str.split(/[,;]/).map(token => token.trim());
		sections.forEach(token => {
			const val = token.match(/\d+/);
			if (val) {
				const ft = parseInt(val[0], 10);

				if (token.startsWith('blindsight')) {
					values.blindsight = ft;
				} else if (token.startsWith('darkvision')) {
					values.darkvision = ft;
				} else if (token.startsWith('tremorsense')) {
					values.tremorsense = ft;
				} else if (token.startsWith('truesight')) {
					values.truesight = ft;
				}
			}
		});

		return values;
	}

	public static parseSavingThrows(str: string) {
		const list = [
			{ name: 'Strength', ability: 'str' },
			{ name: 'Dexterity', ability: 'dex' },
			{ name: 'Constitution', ability: 'con' },
			{ name: 'Intelligence', ability: 'int' },
			{ name: 'Wisdom', ability: 'wis' },
			{ name: 'Charisma', ability: 'cha' }
		];

		return list.filter(item => str.toLowerCase().includes(item.name.toLowerCase()));
	}

	public static parseSkills(str: string) {
		const list = [
			{ name: 'Acrobatics', ability: 'dex' },
			{ name: 'Animal handling', ability: 'wis' },
			{ name: 'Arcana', ability: 'int' },
			{ name: 'Athletics', ability: 'str' },
			{ name: 'Deception', ability: 'cha' },
			{ name: 'History', ability: 'int' },
			{ name: 'Insight', ability: 'wis' },
			{ name: 'Intimidation', ability: 'cha' },
			{ name: 'Investigation', ability: 'int' },
			{ name: 'Medicine', ability: 'wis' },
			{ name: 'Nature', ability: 'wis' },
			{ name: 'Perception', ability: 'wis' },
			{ name: 'Performance', ability: 'cha' },
			{ name: 'Persuasion', ability: 'cha' },
			{ name: 'Religion', ability: 'int' },
			{ name: 'Sleight of hand', ability: 'dex' },
			{ name: 'Stealth', ability: 'dex' },
			{ name: 'Survival', ability: 'wis' }
		];

		return list.filter(item => str.toLowerCase().includes(item.name.toLowerCase()));
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Traits

	public static copyTrait(trait: Trait, targetMonster: Monster, sourceMonster: Monster | null) {
		const copy = JSON.parse(JSON.stringify(trait)) as Trait;
		copy.id = Utils.guid();

		if (sourceMonster && sourceMonster.name) {
			const sourceName = sourceMonster.name.toLowerCase();
			const targetName = targetMonster.name.toLowerCase() || 'monster';
			copy.text = copy.text.replaceAll(' ' + sourceName, ' ' + targetName);
			copy.text = copy.text.replaceAll(' ' + Shakespeare.capitalise(sourceName), ' ' + targetName);
		}

		targetMonster.traits.push(copy);
		return copy;
	}

	public static addTrait(target: Monster, type: 'trait' | 'action' | 'bonus' | 'reaction' | 'legendary' | 'mythic' | 'lair') {
		const trait = Factory.createTrait();
		trait.type = type;
		target.traits.push(trait);
		return trait;
	}

	public static moveTrait(target: Monster, oldIndex: number, newIndex: number) {
		const t = target.traits.splice(oldIndex, 1);
		target.traits.splice(newIndex, 0, ...t);
	}

	public static removeTrait(target: Monster, trait: Trait) {
		const index = target.traits.indexOf(trait);
		target.traits.splice(index, 1);
	}

	public static swapTraits(target: Monster, t1: Trait, t2: Trait) {
		const index1 = target.traits.indexOf(t1);
		const index2 = target.traits.indexOf(t2);
		target.traits[index2] = t1;
		target.traits[index1] = t2;
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Randomisation

	public static filterMonsters(groups: MonsterGroup[], cr: number, size: string | null, type: string | null, role: string | null) {
		const monsters: Monster[] = [];

		groups.forEach(group => {
			group.monsters.forEach(m => {
				let match = true;

				const diff = Math.abs(m.challenge - cr);
				if (diff > 1) {
					match = false;
				}

				if (size && (m.size !== size)) {
					match = false;
				}

				if (type && (m.category !== type)) {
					match = false;
				}

				if (role && (m.role !== role)) {
					match = false;
				}

				if (match) {
					monsters.push(m);
				}
			});
		});

		return monsters
	}

	public static spliceMonsters(target: Monster, monsters: Monster[]) {
		const fields = [
			'size',
			'category',
			'tag',
			'alignment',
			'challenge',
			'speed',
			'senses',
			'languages',
			'abilityScores.str',
			'abilityScores.dex',
			'abilityScores.con',
			'abilityScores.int',
			'abilityScores.wis',
			'abilityScores.cha',
			'savingThrows',
			'skills',
			'ac',
			'acInfo',
			'hitDice',
			'damage.resist',
			'damage.vulnerable',
			'damage.immune',
			'conditionImmunities'
		];
		fields.forEach(field => {
			this.setRandomValue(target, field, monsters);
		});

		target.traits = [];
		TRAIT_TYPES.forEach(type => {
			// Get all traits of this type
			const traits: { trait: Trait, monster: Monster }[] = [];
			monsters.forEach(m => {
				m.traits.filter(t => t.type === type)
					.forEach(t => traits.push({ trait: t, monster: m }));
			});

			// Collate by name
			const distinct: { trait: Trait, monster: Monster, count: number }[] = [];
			traits.forEach(t => {
				const current = distinct.find(d => d.trait.name === t.trait.name);
				if (current) {
					current.count += 1;
				} else {
					distinct.push({
						trait: t.trait,
						monster: t.monster,
						count: 1
					});
				}
			});

			// If any are common to all monsters, copy them and remove from the candidates
			const addedIDs: string[] = [];
			distinct.filter(d => d.count === monsters.length)
				.forEach(d => {
					this.copyTrait(d.trait, target, d.monster);
					addedIDs.push(d.trait.id);
				});
			addedIDs.forEach(id => {
				const index = distinct.findIndex(d => d.trait.id === id);
				distinct.splice(index, 1);
			});

			const avg = traits.length / monsters.length;
			while (target.traits.filter(t => t.type === type).length < avg) {
				const index = Utils.randomNumber(distinct.length);
				const t = distinct[index].trait;
				const m = distinct[index].monster;
				this.copyTrait(t, target, m);
				distinct.splice(index, 1);
			}
		});
		this.sortTraits(target);

		if (target.traits.some(t => (t.type === 'legendary') || (t.type === 'mythic'))) {
			target.legendaryActions = 3;
		}

		target.role = this.getRole(target);
	}

	public static setRandomValue(target: Monster, field: string, monsters: Monster[]) {
		const index = Utils.randomNumber(monsters.length);
		const m = monsters[index];

		let source: any = m;
		let value = null;
		const tokens = field.split('.');
		tokens.forEach(tkn => {
			if (tkn === tokens[tokens.length - 1]) {
				value = source[tkn];
			} else {
				source = source[tkn];
			}
		});

		this.changeValue(target, field, value);
	}

	public static addRandomTrait(target: Monster, type: string, monsters: Monster[]) {
		const traits: { trait: Trait, monster: Monster }[] = [];
		monsters.forEach(m => {
			m.traits.filter(t => t.type === type)
				.forEach(t => {
					traits.push({ trait: t, monster: m });
				});
		});

		const index = Utils.randomNumber(traits.length);
		const trait = traits[index];

		this.copyTrait(trait.trait, target, trait.monster);
	}

	public static getToHitExpressions(trait: Trait) {
		const matches = Array.from(trait.text.matchAll(/([+-])\s*(\d+)\s*to hit/g));
		return matches.map(exp => {
			const expression = exp[0];
			let bonus = parseInt(exp[2], 10);
			if (exp[1] === '-') {
				bonus *= -1;
			}
			return {
				expression: expression,
				bonus: bonus
			};
		});
	}

	public static getDiceExpressions(trait: Trait) {
		const matches = Array.from(trait.text.matchAll(/(\d*)[dD](\d+)\s*(([+-])\s*(\d*))?/g));
		return matches.map(exp => {
			const expression = exp[0];
			const count = parseInt(exp[1], 10) ?? 1;
			const sides = parseInt(exp[2], 10);
			let bonus = 0;
			if (exp[3] && exp[4] && exp[5]) {
				bonus = parseInt(exp[5], 10);
				if (exp[4] === '-') {
					bonus *= -1;
				}
			}
			return {
				expression: expression,
				count: count,
				sides: sides,
				bonus: bonus
			};
		});
	}

	public static getSaveExpressions(trait: Trait) {
		const matches = Array.from(trait.text.matchAll(/(dc|DC)\s*(\d+)/g));
		return matches.map(exp => {
			const expression = exp[0];
			const dc = parseInt(exp[2], 10);
			return {
				expression: expression,
				dc: dc
			};
		});
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Role

	public static getRole(monster: Monster) {
		// If it has legendary actions, it's a boss
		if (monster.legendaryActions > 0) {
			return 'boss';
		}

		// If it can teleport, it's a skirmisher
		if (monster.traits.some(t => t.text.toLowerCase().includes('teleport'))) {
			return 'skirmisher';
		}

		// If it's got Deception or Stealth skills, it's a sneak
		const skills = monster.skills.toLowerCase();
		if (skills.includes('deception') || skills.includes('stealth')) {
			return 'sneak';
		}

		// If it can be described as 'indistinguishable', it's a sneak
		if (monster.traits.some(t => t.text.toLowerCase().includes('indistinguishable'))) {
			return 'sneak';
		}

		const expected = Gygax.challengeDetails().find(details => details.cr === monster.challenge);
		if (expected) {
			// If it has high hp, it's a tank
			const typicalHP = Frankenstein.getTypicalHP(monster);
			if (typicalHP > expected.hpMax) {
				return 'tank';
			}

			// If it has strong ranged attacks, it's an artillery
			// If it has strong melee attacks, it's a soldier
			const strongTraits = monster.traits.filter(trait => {
				const toHits = this.getToHitExpressions(trait);
				const damages = this.getDiceExpressions(trait).map(exp => (exp.count * (exp.sides + 1) / 2) + exp.bonus);
				const saves = this.getSaveExpressions(trait);
				return toHits.some(toHit => toHit.bonus > expected.attack)
					|| damages.some(dmg => dmg > expected.dmgMax)
					|| saves.some(save => save.dc > expected.save);
			});
			if (strongTraits.length > 0) {
				const rangedAttacks = strongTraits.filter(trait => {
					const text = trait.text.toLowerCase();
					return text.includes('ranged') && text.includes('attack');
				}).length;
				const meleeAttacks = strongTraits.length - rangedAttacks;
				return (rangedAttacks >= meleeAttacks) ? 'artillery' : 'soldier';
			}
		}

		// If it can impose at least two different conditions, it's a controller
		// Note that this only looks for the appearance of conditions in the text
		let count = 0;
		CONDITION_TYPES.forEach(condition => {
			if (condition !== 'custom') {
				const includes = monster.traits.some(t => t.text.toLowerCase().includes(condition.toLowerCase()));
				if (includes) {
					count += 1;
				}
			}
		});
		if (count >= 2) {
			return 'controller';
		}

		// Otherwise, it's probably a skirmisher
		return 'skirmisher';
	}
}
