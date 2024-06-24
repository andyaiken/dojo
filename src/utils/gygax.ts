// This utility file contains D&D-specific helper methods

import { Factory } from './factory';
import { Frankenstein } from './frankenstein';
import { Napoleon } from './napoleon';
import { Utils } from './utils';

import { Combatant, CombatSlotInfo } from '../models/combat';
import { Condition, ConditionDurationCombatant, ConditionDurationRounds, ConditionDurationSaves } from '../models/condition';
import { DieRollResult } from '../models/dice';
import { Encounter, EncounterWave } from '../models/encounter';
import { Monster } from '../models/monster';
import { PC } from '../models/party';

export class Gygax {
	public static modifierValue(score: number): number {
		return Math.floor((score - 10) / 2);
	}

	public static modifier(score: number): string {
		const mod = this.modifierValue(score);
		let str = mod.toString();
		if (mod >= 0) {
			str = '+' + str;
		}
		return str;
	}

	public static dieRoll(sides = 20, count = 1): number {
		let total = 0;
		for (let n = 0; n !== count; ++n) {
			total += Utils.randomNumber(sides) + 1;
		}
		return total;
	}

	public static rollDice(text: string, dice: { [sides: number]: number }, constant: number, mode: '' | 'advantage' | 'disadvantage'): DieRollResult {
		const result: DieRollResult = {
			id: Utils.guid(),
			text: text,
			rolls: [],
			constant: constant,
			mode: mode
		};

		[4, 6, 8, 10, 12, 20, 100].forEach(sides => {
			const count = dice[sides];
			for (let n = 0; n !== count; ++n) {
				let value = Gygax.dieRoll(sides);
				switch (result.mode) {
					case 'advantage':
						value = Math.max(value, Gygax.dieRoll(sides));
						break;
					case 'disadvantage':
						value = Math.min(value, Gygax.dieRoll(sides));
						break;
				}
				result.rolls.push({
					id: Utils.guid(),
					sides: sides,
					value: value
				});
			}
		});

		return result;
	}

	public static miniSize(size: string): number {
		switch (size) {
			case 'tiny': return 0.4;
			case 'small': return 0.6;
			case 'medium': return 1;
			case 'large': return 2;
			case 'huge': return 3;
			case 'gargantuan': return 4;
			default: return 1;
		}
	}

	public static hitDieType(size: string) {
		switch (size) {
			case 'tiny': return 4;
			case 'small': return 6;
			case 'medium': return 8;
			case 'large': return 10;
			case 'huge': return 12;
			case 'gargantuan': return 20;
			default: return 8;
		}
	}

	public static proficiency(level: number) {
		if (level < 5) {
			return 2;
		}

		if (level < 9) {
			return 3;
		}

		if (level < 13) {
			return 4;
		}

		if (level < 17) {
			return 5;
		}

		if (level < 21) {
			return 6;
		}

		if (level < 25) {
			return 7;
		}

		if (level < 29) {
			return 8;
		}

		return 9;
	}

	public static challenge(cr: number): string {
		switch (cr) {
			case 0.125: return '1/8';
			case 0.25: return '1/4';
			case 0.5: return '1/2';
			default: return cr.toString();
		}
	}

	public static parseChallenge(cr: string): number {
		switch (cr) {
			case '1/8': return 0.125;
			case '1/4': return 0.25;
			case '1/2': return 0.5;
			default: return parseInt(cr, 10);
		}
	}

	public static challengeDetails() {
		return [
			{ cr: 0,		ac: 13,		hpMin: 1,		hpMax: 6,		attack: 3,		dmgMin: 0,		dmgMax: 1,		save: 13 },
			{ cr: 0.125,	ac: 13,		hpMin: 7,		hpMax: 35,		attack: 3,		dmgMin: 2,		dmgMax: 3,		save: 13 },
			{ cr: 0.25,		ac: 13,		hpMin: 36,		hpMax: 49,		attack: 3,		dmgMin: 4,		dmgMax: 5,		save: 13 },
			{ cr: 0.5,		ac: 13,		hpMin: 50,		hpMax: 70,		attack: 3,		dmgMin: 6,		dmgMax: 8,		save: 13 },
			{ cr: 1,		ac: 13,		hpMin: 71,		hpMax: 85,		attack: 3,		dmgMin: 9,		dmgMax: 14,		save: 13 },
			{ cr: 2,		ac: 13,		hpMin: 86,		hpMax: 100,		attack: 3,		dmgMin: 15,		dmgMax: 20,		save: 13 },
			{ cr: 3,		ac: 13,		hpMin: 101,		hpMax: 115,		attack: 4,		dmgMin: 21,		dmgMax: 26,		save: 13 },
			{ cr: 4,		ac: 14,		hpMin: 116,		hpMax: 130,		attack: 5,		dmgMin: 27,		dmgMax: 32,		save: 14 },
			{ cr: 5,		ac: 15,		hpMin: 131,		hpMax: 145,		attack: 6,		dmgMin: 33,		dmgMax: 38,		save: 15 },
			{ cr: 6,		ac: 15,		hpMin: 146,		hpMax: 160,		attack: 6,		dmgMin: 39,		dmgMax: 44,		save: 15 },
			{ cr: 7,		ac: 15,		hpMin: 161,		hpMax: 175,		attack: 6,		dmgMin: 45,		dmgMax: 50,		save: 15 },
			{ cr: 8,		ac: 16,		hpMin: 176,		hpMax: 190,		attack: 7,		dmgMin: 51,		dmgMax: 56,		save: 16 },
			{ cr: 9,		ac: 16,		hpMin: 191,		hpMax: 205,		attack: 7,		dmgMin: 57,		dmgMax: 62,		save: 16 },
			{ cr: 10,		ac: 17,		hpMin: 206,		hpMax: 220,		attack: 7,		dmgMin: 63,		dmgMax: 68,		save: 16 },
			{ cr: 11,		ac: 17,		hpMin: 221,		hpMax: 235,		attack: 8,		dmgMin: 69,		dmgMax: 74,		save: 17 },
			{ cr: 12,		ac: 17,		hpMin: 236,		hpMax: 250,		attack: 8,		dmgMin: 75,		dmgMax: 80,		save: 17 },
			{ cr: 13,		ac: 18,		hpMin: 251,		hpMax: 265,		attack: 8,		dmgMin: 81,		dmgMax: 86,		save: 18 },
			{ cr: 14,		ac: 18,		hpMin: 266,		hpMax: 280,		attack: 8,		dmgMin: 87,		dmgMax: 92,		save: 18 },
			{ cr: 15,		ac: 18,		hpMin: 281,		hpMax: 295,		attack: 8,		dmgMin: 93,		dmgMax: 98,		save: 18 },
			{ cr: 16,		ac: 18,		hpMin: 296,		hpMax: 310,		attack: 9,		dmgMin: 99,		dmgMax: 104,	save: 18 },
			{ cr: 17,		ac: 19,		hpMin: 311,		hpMax: 325,		attack: 10,		dmgMin: 105,	dmgMax: 110,	save: 19 },
			{ cr: 18,		ac: 19,		hpMin: 326,		hpMax: 340,		attack: 10,		dmgMin: 111,	dmgMax: 116,	save: 19 },
			{ cr: 19,		ac: 19,		hpMin: 341,		hpMax: 355,		attack: 10,		dmgMin: 117,	dmgMax: 122,	save: 19 },
			{ cr: 20,		ac: 19,		hpMin: 356,		hpMax: 400,		attack: 10,		dmgMin: 123,	dmgMax: 140,	save: 19 },
			{ cr: 21,		ac: 19,		hpMin: 401,		hpMax: 445,		attack: 11,		dmgMin: 141,	dmgMax: 158,	save: 20 },
			{ cr: 22,		ac: 19,		hpMin: 446,		hpMax: 490,		attack: 11,		dmgMin: 159,	dmgMax: 176,	save: 20 },
			{ cr: 23,		ac: 19,		hpMin: 491,		hpMax: 535,		attack: 11,		dmgMin: 177,	dmgMax: 194,	save: 20 },
			{ cr: 24,		ac: 19,		hpMin: 536,		hpMax: 580,		attack: 12,		dmgMin: 195,	dmgMax: 212,	save: 21 },
			{ cr: 25,		ac: 19,		hpMin: 581,		hpMax: 625,		attack: 12,		dmgMin: 213,	dmgMax: 230,	save: 21 },
			{ cr: 26,		ac: 19,		hpMin: 626,		hpMax: 670,		attack: 12,		dmgMin: 231,	dmgMax: 248,	save: 21 },
			{ cr: 27,		ac: 19,		hpMin: 671,		hpMax: 715,		attack: 13,		dmgMin: 249,	dmgMax: 266,	save: 22 },
			{ cr: 28,		ac: 19,		hpMin: 716,		hpMax: 760,		attack: 13,		dmgMin: 267,	dmgMax: 284,	save: 22 },
			{ cr: 29,		ac: 19,		hpMin: 761,		hpMax: 805,		attack: 13,		dmgMin: 285,	dmgMax: 302,	save: 22 },
			{ cr: 30,		ac: 19,		hpMin: 806,		hpMax: 850,		attack: 14,		dmgMin: 303,	dmgMax: 320,	save: 23 }
		];
	}

	public static experience(cr: number): number {
		switch (cr) {
			case 0: return 10;
			case 0.125: return 25;
			case 0.25: return 50;
			case 0.5: return 100;
			case 1: return 200;
			case 2: return 450;
			case 3: return 700;
			case 4: return 1100;
			case 5: return 1800;
			case 6: return 2300;
			case 7: return 2900;
			case 8: return 3900;
			case 9: return 5000;
			case 10: return 5900;
			case 11: return 7200;
			case 12: return 8400;
			case 13: return 10000;
			case 14: return 11500;
			case 15: return 13000;
			case 16: return 15000;
			case 17: return 18000;
			case 18: return 20000;
			case 19: return 22000;
			case 20: return 25000;
			case 21: return 33000;
			case 22: return 41000;
			case 23: return 50000;
			case 24: return 62000;
			case 30: return 155000;
			default: return 0;
		}
	}

	public static experienceFactor(count: number): number {
		switch (count) {
			case 0:
				return 0;
			case 1:
				return 1;
			case 2:
				return 1.5;
			case 3:
			case 4:
			case 5:
			case 6:
				return 2;
			case 7:
			case 8:
			case 9:
			case 10:
				return 2.5;
			case 11:
			case 12:
			case 13:
			case 14:
				return 3;
			default:
				return 4;
		}
	}

	public static pcExperience(level: number, difficulty: string): number {
		switch (difficulty) {
			case 'easy':
				switch (level) {
					case 1: return 25;
					case 2: return 50;
					case 3: return 75;
					case 4: return 125;
					case 5: return 250;
					case 6: return 300;
					case 7: return 350;
					case 8: return 450;
					case 9: return 550;
					case 10: return 600;
					case 11: return 800;
					case 12: return 1000;
					case 13: return 1100;
					case 14: return 1250;
					case 15: return 1400;
					case 16: return 1600;
					case 17: return 2000;
					case 18: return 2100;
					case 19: return 2400;
					case 20: return 2800;
					default: return 0;
				}
			case 'medium':
				switch (level) {
					case 1: return 50;
					case 2: return 100;
					case 3: return 150;
					case 4: return 250;
					case 5: return 500;
					case 6: return 600;
					case 7: return 750;
					case 8: return 900;
					case 9: return 1100;
					case 10: return 1200;
					case 11: return 1600;
					case 12: return 2000;
					case 13: return 2200;
					case 14: return 2500;
					case 15: return 2800;
					case 16: return 3200;
					case 17: return 3900;
					case 18: return 4200;
					case 19: return 4900;
					case 20: return 5700;
					default: return 0;
				}
			case 'hard':
				switch (level) {
					case 1: return 75;
					case 2: return 150;
					case 3: return 225;
					case 4: return 375;
					case 5: return 750;
					case 6: return 900;
					case 7: return 1100;
					case 8: return 1400;
					case 9: return 1600;
					case 10: return 1900;
					case 11: return 2400;
					case 12: return 3000;
					case 13: return 3400;
					case 14: return 3800;
					case 15: return 4300;
					case 16: return 4800;
					case 17: return 5900;
					case 18: return 6300;
					case 19: return 7300;
					case 20: return 8500;
					default: return 0;
				}
			case 'deadly':
				switch (level) {
					case 1: return 100;
					case 2: return 200;
					case 3: return 400;
					case 4: return 500;
					case 5: return 1100;
					case 6: return 1400;
					case 7: return 1700;
					case 8: return 2100;
					case 9: return 2400;
					case 10: return 2800;
					case 11: return 3600;
					case 12: return 4500;
					case 13: return 5100;
					case 14: return 5700;
					case 15: return 6400;
					case 16: return 7200;
					case 17: return 8800;
					case 18: return 9500;
					case 19: return 10900;
					case 20: return 12700;
					default: return 0;
				}
			default:
				return 0;
		}
	}

	public static traitType(type: string, plural: boolean): string {
		let str = '';
		switch (type) {
			case 'trait':
				str = 'trait';
				break;
			case 'action':
				str = 'action';
				break;
			case 'reaction':
				str = 'reaction';
				break;
			default:
				str = type + ' action';
				break;
		}

		if (plural) {
			str += 's';
		}

		return str;
	}

	public static nudgeChallenge(value: number, delta: number): number {
		let result = 0;

		switch (value) {
			case 0:
				if (delta === -1) {
					result = 0;
				}
				if (delta === +1) {
					result = 0.125;
				}
				break;
			case 0.125:
				if (delta === -1) {
					result = 0;
				}
				if (delta === +1) {
					result = 0.25;
				}
				break;
			case 0.25:
				if (delta === -1) {
					result = 0.125;
				}
				if (delta === +1) {
					result = 0.5;
				}
				break;
			case 0.5:
				if (delta === -1) {
					result = 0.25;
				}
				if (delta === +1) {
					result = 1;
				}
				break;
			case 1:
				if (delta === -1) {
					result = 0.5;
				}
				if (delta === +1) {
					result = 2;
				}
				break;
			default:
				result = value + delta;
				break;
		}

		return result;
	}

	public static nudgeSize(value: string, delta: number): string {
		const sizes = ['tiny', 'small', 'medium', 'large', 'huge', 'gargantuan'];
		let index = sizes.indexOf(value) + delta;
		if (index < 0) {
			index = 0;
		}
		if (index >= sizes.length) {
			index = sizes.length - 1;
		}
		return sizes[index];
	}

	public static nudgeDifficulty(value: string, delta: number): string {
		const sizes = ['easy', 'medium', 'hard', 'deadly'];
		let index = sizes.indexOf(value) + delta;
		if (index < 0) {
			index = 0;
		}
		if (index >= sizes.length) {
			index = sizes.length - 1;
		}
		return sizes[index];
	}

	public static nudgeLighting(value: string, delta: number): string {
		const sizes = ['darkness', 'dim light', 'bright light'];
		let index = sizes.indexOf(value) + delta;
		if (index < 0) {
			index = 0;
		}
		if (index >= sizes.length) {
			index = sizes.length - 1;
		}
		return sizes[index];
	}

	public static conditionText(condition: Condition): string[] {
		switch (condition.name) {
			case 'blinded':
				return [
					'a blinded creature can\'t see and automatically fails any ability check that requires sight',
					'attack rolls against the creature have advantage, and the creature\'s attack rolls have disadvantage'
				];
			case 'charmed':
				return [
					'a charmed creature can\'t attack the charmer or target the charmer with harmful abilities or magical effects',
					'the charmer has advantage on any ability check to interact socially with the creature'
				];
			case 'deafened':
				return [
					'a deafened creature can\'t hear and automatically fails any ability check that requires hearing.'
				];
			case 'exhaustion': {
				switch (condition.level) {
				case 1:
					return [
						'disadvantage on ability checks'
					];
				case 2:
					return [
						'disadvantage on ability checks',
						'speed halved'
					];
				case 3:
					return [
						'disadvantage on ability checks',
						'speed halved',
						'disadvantage on attack rolls and saving throws'
					];
				case 4:
					return [
						'disadvantage on ability checks',
						'speed halved',
						'disadvantage on attack rolls and saving throws',
						'hit point maximum halved'
					];
				case 5:
					return [
						'disadvantage on ability checks',
						'speed halved',
						'disadvantage on attack rolls and saving throws',
						'hit point maximum halved',
						'speed reduced to 0'
					];
				case 6:
					return [
						'disadvantage on ability checks',
						'speed halved',
						'disadvantage on attack rolls and saving throws',
						'hit point maximum halved',
						'speed reduced to 0',
						'death'
					];
				default:
					return [];
				}
			}
			case 'frightened':
				return [
					'a frightened creature has disadvantage on ability checks and attack rolls while the source of its fear is within line of sight',
					'the creature can\'t willingly move closer to the source of its fear'
				];
			case 'grappled':
				return [
					'a grappled creature\'s speed becomes 0, and it can\'t benefit from any bonus to its speed',
					'the condition ends if the grappler is incapacitated',
					'the condition also ends if an effect removes the grappled creature from the reach of the grappler or grappling effect'
				];
			case 'incapacitated':
				return [
					'an incapacitated creature can\'t take actions or reactions',
					'being incapacitated breaks concentration'
				];
			case 'invisible':
				return [
					'an invisible creature is impossible to see without the aid of magic or a special sense',
					'for the purpose of hiding, the creature is heavily obscured',
					'the creature\'s location can be detected by any noise it makes or any tracks it leaves',
					'attack rolls against the creature have disadvantage, and the creature\'s attack rolls have advantage'
				];
			case 'paralyzed':
				return [
					'a paralyzed creature is incapacitated (can\'t take actions or reactions) and can\'t move or speak',
					'the creature automatically fails strength and dexterity saving throws',
					'attack rolls against the creature have advantage',
					'any attack that hits the creature is a critical hit if the attacker is within 5 feet of the creature'
				];
			case 'petrified':
				return [
					'a petrified creature is transformed, along with any nonmagical objects it is wearing or carrying, into a solid inanimate substance (usually stone)',
					'its weight increases by a factor of ten, and it ceases aging',
					'the creature is incapacitated (can\'t take actions or reactions), can\'t move or speak, and is unaware of its surroundings',
					'attack rolls against the creature have advantage',
					'the creature automatically fails strength and dexterity saving throws',
					'the creature has resistance to all damage',
					'the creature is immune to poison and disease, although a poison or disease already in its system is suspended, not neutralized'
				];
			case 'poisoned':
				return [
					'a poisoned creature has disadvantage on attack rolls and ability checks'
				];
			case 'prone':
				return [
					'a prone creature\'s only movement option is to crawl, unless it stands up (using half its speed) and thereby ends the condition',
					'the creature has disadvantage on attack rolls',
					'an attack roll against the creature has advantage if the attacker is within 5 feet of the creature; otherwise, the attack roll has disadvantage'
				];
			case 'restrained':
				return [
					'a restrained creature\'s speed becomes 0, and it can\'t benefit from any bonus to its speed',
					'attack rolls against the creature have advantage, and the creature\'s attack rolls have disadvantage',
					'the creature has disadvantage on dexterity saving throws'
				];
			case 'stunned':
				return [
					'a stunned creature is incapacitated (can\'t take actions or reactions), can\'t move, and can speak only falteringly',
					'the creature automatically fails strength and dexterity saving throws',
					'attack rolls against the creature have advantage'
				];
			case 'unconscious':
				return [
					'an unconscious creature is incapacitated (can\'t take actions or reactions), can\'t move or speak, and is unaware of its surroundings',
					'the creature drops whatever its holding and falls prone',
					'the creature automatically fails strength and dexterity saving throws',
					'attack rolls against the creature have advantage',
					'any attack that hits the creature is a critical hit if the attacker is within 5 feet of the creature'
				];
			case 'custom':
				return [condition.text];
			default:
				return [];
		}
	}

	public static conditionDurationText(condition: Condition, combatants: Combatant[]) {
		if (condition.duration !== null) {
			switch (condition.duration.type) {
				case 'saves':
					{
						const saveDuration = condition.duration as ConditionDurationSaves;
						let saveType = saveDuration.saveType.toString();
						if (saveType !== 'death') {
							saveType = saveType.toUpperCase();
						}
						const saves = saveDuration.count > 1 ? 'saves' : 'save';
						return 'until they make ' + saveDuration.count + ' ' + saveType + ' ' + saves + ' at dc ' + saveDuration.saveDC;
					}
				case 'combatant':
					{
						const combatantDuration = condition.duration as ConditionDurationCombatant;
						const point = combatantDuration.point;
						const c = combatants.find(cmb => cmb.id === combatantDuration.combatantID) as (Combatant & PC) | (Combatant & Monster);
						const combatant = c ? Napoleon.getCombatantName(c, combatants) + '\'s' : 'their';
						return 'until the ' + point + ' of ' + combatant + ' next turn';
					}
				case 'rounds':
					{
						const roundsDuration = condition.duration as ConditionDurationRounds;
						const rounds = roundsDuration.count > 1 ? 'rounds' : 'round';
						return 'for ' + roundsDuration.count + ' ' + rounds;
					}
				default:
					return null;
			}
		}

		return null;
	}

	public static getCombatSlotData(encounter: Encounter | EncounterWave | null, getMonster: (id: string) => Monster | null): CombatSlotInfo[] {
		const data: CombatSlotInfo[] = [];
		if (encounter) {
			encounter.slots.forEach(slot => {
				const monster = Napoleon.slotToMonster(slot, id => getMonster(id));
				if (monster) {
					const slotInfo = Factory.createCombatSlotInfo();
					slotInfo.id = slot.id;
					slotInfo.monsterID = slot.monsterID;

					// Roll initiative and set default HP
					slotInfo.init = this.dieRoll() + this.modifierValue(monster.abilityScores.dex);
					slotInfo.hp = Frankenstein.getTypicalHP(monster);

					for (let n = 0; n !== slot.count; ++n) {
						const slotMember = Factory.createCombatSlotMember();
						slotMember.init = slotInfo.init;
						slotMember.hp = slotInfo.hp;
						slotMember.name = monster.name;
						slotMember.location = null;
						slotInfo.members.push(slotMember);
					}

					if (slot.count > 1) {
						for (let n = 0; n !== slot.count; ++n) {
							slotInfo.members[n].name = monster.name + ' ' + (n + 1);
						}
					}

					data.push(slotInfo);
				}
			});
		}

		return data;
	}

	public static getTagTitle(tag: string) {
		if (tag.startsWith('engaged')) {
			return 'engaged';
		}

		switch (tag) {
			case 'conc':
				return 'concentrating';
			case 'bane':
				return 'affected by bane';
			case 'bless':
				return 'affected by bless';
			default:
				return tag;
		}
	}

	public static getTagDescription(tag: string) {
		if (tag.startsWith('engaged')) {
			const tokens = tag.split(':');
			return tokens[1];
		}

		switch (tag) {
			case 'conc':
				return 'if damaged, must make con save (dc is half damage taken or 10, whichever is higher) or lose concentration';
			case 'bane':
				return 'subtract d4 from attack rolls and saving throws';
			case 'bless':
				return 'add d4 to attack rolls and saving throws';
			default:
				return tag;
		}
	}

	public static getWildSurge() {
		const list = [
			'Roll on this table at the start of each of your turns for the next minute, ignoring this result on subsequent rolls.',
			'For the next minute, you can see any invisible creature if you have line of sight to it.',
			'A modron chosen and controlled by the DM appears in an unoccupied space within 5 feet of you, then disappears 1 minute later.',
			'You cast fireball as a 3rd-level spell centered on yourself.',
			'You cast magic missile as a 5th-level spell.',
			'Roll a d10. Your height changes by a number of inches equal to the roll. If the roll is odd, you shrink. If the roll is even, you grow.',
			'You cast confusion centered on yourself.',
			'For the next minute, you regain 5 hit points at the start of each of your turns.',
			'You grow a long beard made of feathers that remains until you sneeze, at which point the feathers explode out from your face.',
			'You cast grease centered on yourself.',
			'Creatures have disadvantage on saving throws against the next spell you cast in the next minute that involves a saving throw.',
			'Your skin turns a vibrant shade of blue. A remove curse spell can end this effect.',
			'An eye appears on your forehead for the next minute. During that time, you have advantage on Wisdom (Perception) checks that rely on sight.',
			'For the next minute, all your spells with a casting time of 1 action have a casting time of 1 bonus action.',
			'You teleport up to 60 feet to an unoccupied space of your choice that you can see.',
			'You are transported to the Astral Plane until the end of your next turn, after which time you return to the space you previously occupied or the nearest unoccupied space if that space is occupied.',
			'Maximize the damage of the next damaging spell you cast within the next minute.',
			'Roll a d10. Your age changes by a number of years equal to the roll. If the roll is odd, you get younger (minimum 1 year old). If the roll is even, you get older.',
			'1d6 flumphs controlled by the DM appear in unoccupied spaces within 60 feet of you and are frightened of you. They vanish after 1 minute.',
			'You regain 2d10 hit points.',
			'You turn into a potted plant until the start of your next turn. While a plant, you are incapacitated and have vulnerability to all damage. If you drop to 0 hit points, your pot breaks, and your form reverts.',
			'For the next minute, you can teleport up to 20 feet as a bonus action on each of your turns.',
			'You cast levitate on yourself.',
			'A unicorn controlled by the DM appears in a space within 5 feet of you, then disappears 1 minute later.',
			'You can\'t speak for the next minute. Whenever you try, pink bubbles float out of your mouth.',
			'A spectral shield hovers near you for the next minute, granting you a +2 bonus to AC and immunity to magic missile.',
			'You are immune to being intoxicated by alcohol for the next 5d6 days.',
			'Your hair falls out but grows back within 24 hours.',
			'For the next minute, any flammable object you touch that isn\'t being worn or carried by another creature bursts into flame.',
			'You regain your lowest-level expended spell slot.',
			'For the next minute, you must shout when you speak.',
			'You cast fog cloud centered on yourself.',
			'Up to three creatures you choose within 30 feet of you take 4d10 lightning damage.',
			'You are frightened by the nearest creature until the end of your next turn.',
			'Each creature within 30 feet of you becomes invisible for the next minute. The invisibility ends on a creature when it attacks or casts a spell.',
			'You gain resistance to all damage for the next minute.',
			'A random creature within 60 feet of you becomes poisoned for 1d4 hours.',
			'You glow with bright light in a 30-foot radius for the next minute. Any creature that ends its turn within 5 feet of you is blinded until the end of its next turn.',
			'You cast polymorph on yourself. If you fail the saving throw, you turn into a sheep for the spell\'s duration.',
			'Illusory butterflies and flower petals flutter in the air within 10 feet of you for the next minute.',
			'You can take one additional action immediately.',
			'Each creature within 30 feet of you takes 1d10 necrotic damage. You regain hit points equal to the sum of the necrotic damage dealt.',
			'You cast mirror image.',
			'You cast fly on a random creature within 60 feet of you.',
			'You become invisible for the next minute. During that time, other creatures can\'t hear you. The invisibility ends if you attack or cast a spell.',
			'If you die within the next minute, you immediately come back to life as if by the reincarnate spell.',
			'Your size increases by one size category for the next minute.',
			'You and all creatures within 30 feet of you gain vulnerability to piercing damage for the next minute.',
			'You are surrounded by faint, ethereal music for the next minute.',
			'You regain all expended sorcery points.',
			'You cast speak with animals',
			'A mephit chosen and controlled by the DM appears in an unoccupied space within 5 feet of you, then disappears 1 minute later.',
			'You cast ice storm as a 4th-level spell centered on yourself.',
			'You cast scorching ray as a 5th-level spell.',
			'For the next hour, your eyes and veins shed bright light in a 20 foot radius, and dim light for an additional 20 feet.',
			'You cast plant growth centered on yourself.',
			'You cast aura of life.',
			'A daisy sprouts from your head. It may be pruned without harm.',
			'You cast faerie fire centered on yourself.',
			'You have a brief vision of the future. Roll a d20 and record the number rolled. Once in the next hour, you can replace any attack roll, saving throw, or ability check made by you or a creature that you can see with the foretelling roll. You must choose to do so before the roll, and you can replace a roll in this way only once per turn.',
			'You become unable to turn left. A remove curse spell can end this effect.',
			'A glimpse of the future gives you advantage on the next saving throw you make.',
			'You cast haste on yourself.',
			'You cast thunder step as a 3rd-level spell.',
			'You switch positions with the target immediately after the effects of the spell occur. If the spell had multiple targets, you switch places with the closest one to you.',
			'For the next minute, roll an extra die of damage for each spell you cast.',
			'You take no action on your next turn. Instead, you vomit 1d100 gold pieces.',
			'A pseudodragon controlled by the DM appears in an unoccupied space within 60 feet of you. It vanishes after 1 minute.',
			'You cast healing word as a 2nd-level spell.',
			'You turn into a harmless creature for 1d4 rounds. While in this form, you have a movement speed of 15 feet and vulnerability to all damage. If you drop to 0 hit points your form reverts.',
			'Spider legs sprout from your back, giving you a climbing speed of 20 feet. The legs remain in place for one hour.',
			'You cast freedom of movement on yourself.',
			'A couatl controlled by the DM appears in a space within 5 feet of you, then disappears 1 minute later.',
			'You\'re deafened for the next minute. For this duration, green smoke pours out from your ears.',
			'A wall of fire encircles you as a 4th-level spell. You are on the side that takes no damage.',
			'You cast create food and water.',
			'You shoot eight non-venomous snakes from your fingertips.',
			'For the next minute, any organic object you touch decays. Food spoils, plants wilt, etc. Your unarmed strikes deal an additional 1d4 necrotic damage.',
			'All silver you are carrying becomes gold.',
			'An illusory image of you is left in your space. It can be dispelled with dispel magic.',
			'You cast darkness centered on yourself.',
			'You breathe a cone of dragon\'s breath as a 2nd-level spell the next time you try to speak.',
			'You are entombed in crystal, which shatters at the end of your next turn. You gain 50 temporary hit points and are considered petrified. All these effects, incuding any remaining temporary hit points, end when the crystal shatters.',
			'For the next minute, creatures within 30 feet of you can\'t see further than 30 feet away.',
			'You cast warding wind.',
			'A random creature within 60 feet of you falls asleep for 1d4 turns or until it takes damage. While asleep they are unconscious. A creature is not affected if they cannot be put to sleep by magic.',
			'You cast color spray as a 1st-level spell.',
			'You cast flesh to stone on yourself.',
			'Illusory rain and autumn leaves fall to the ground within 10 feet of you for the next minute.',
			'If the spell requires concentration, it automatically lasts for its maximum duration; if not, its duration is doubled. If it is instantaneous, it is immediately recast on the same target.',
			'You cast thunderwave as a 1st-level spell.',
			'You cast blur.',
			'You cast reverse gravity centered on yourself.',
			'You cast blink.',
			'You regain all expended hit dice.',
			'Your size decreases by one size category for the next minute.',
			'All weapons within 30 feet of you turn into food for the next minute.',
			'A gentle gust of wind blows outward from you.',
			'For one minute, an illusory duplicate of yourself appears in an empty space adjacent to you. The duplicate is under your control and shares your initiative, hit points, sorcery points, and spell slots. Any resources spent by the duplicate are also expended by you.'
		];

		const index = Utils.randomNumber(list.length);
		return list[index].toLowerCase();
	}
}
