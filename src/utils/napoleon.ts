// This utility file deals with encounters and combat

import { Factory } from './factory';
import { Frankenstein } from './frankenstein';
import { Gygax } from './gygax';
import { Sherlock } from './sherlock';
import { Utils } from './utils';

import { Combat, Combatant } from '../models/combat';
import { Encounter, EncounterSlot, EncounterWave, MonsterFilter } from '../models/encounter';
import { Map } from '../models/map';
import { Monster, MonsterGroup } from '../models/monster';
import { Companion, Party, PC } from '../models/party';

export class Napoleon {
	public static getMonsterCount(encounter: Encounter, waveID: string | null) {
		let count = 0;

		let slots: EncounterSlot[] = [];
		if ((waveID === null) || (waveID === encounter.id)) {
			slots = slots.concat(encounter.slots);
		}
		encounter.waves.forEach(wave => {
			if ((waveID === null) || (waveID === wave.id)) {
				slots = slots.concat(wave.slots);
			}
		});

		slots.filter(slot => slot.faction === 'foe').forEach(slot => {
			count += slot.count;
		});

		return count;
	}

	public static getEncounterXP(encounter: Encounter, waveID: string | null, getMonster: (id: string) => Monster | null) {
		let xp = 0;

		let slots: EncounterSlot[] = [];
		if ((waveID === null) || (waveID === encounter.id)) {
			slots = slots.concat(encounter.slots);
		}
		encounter.waves.forEach(wave => {
			if ((waveID === null) || (waveID === wave.id)) {
				slots = slots.concat(wave.slots);
			}
		});

		slots.filter(slot => slot.faction === 'foe').forEach(slot => {
			const monster = this.slotToMonster(slot, id => getMonster(id));
			if (monster) {
				xp += Gygax.experience(monster.challenge) * slot.count;
			}
		});

		return xp;
	}

	public static getAdjustedEncounterXP(encounter: Encounter, waveID: string | null, getMonster: (id: string) => Monster | null) {
		const count = this.getMonsterCount(encounter, waveID);
		const xp = this.getEncounterXP(encounter, waveID, id => getMonster(id));
		return xp * Gygax.experienceFactor(count);
	}

	public static getXPForDifficulty(party: Party, difficulty: string) {
		let xp = 0;

		party.pcs.filter(pc => pc.active).forEach(pc => {
			xp += Gygax.pcExperience(pc.level, difficulty);
		});

		return xp;
	}

	public static getCombatXP(combat: Combat) {
		let xp = 0;

		combat.combatants
			.filter(combatant => combatant.type === 'monster')
			.filter(combatant => combatant.faction === 'foe')
			.forEach(combatant => {
				const monster = combatant as (Combatant & Monster);
				xp += Gygax.experience(monster.challenge);
			});

		return xp;
	}

	public static getEncounterThresholds(party: Party) {
		let easy = 0;
		let medium = 0;
		let hard = 0;
		let deadly = 0;

		const pcs = party.pcs.filter(pc => pc.active);
		pcs.forEach(pc => {
			easy += Gygax.pcExperience(pc.level, 'easy');
			medium += Gygax.pcExperience(pc.level, 'medium');
			hard += Gygax.pcExperience(pc.level, 'hard');
			deadly += Gygax.pcExperience(pc.level, 'deadly');
		});

		return {
			easy: easy,
			medium: medium,
			hard: hard,
			deadly: deadly
		};
	}

	public static getEncounterDifficulty(encounter: Encounter, waveID: string | null, party: Party, getMonster: (id: string) => Monster | null) {
		const thresholds = this.getEncounterThresholds(party);
		const adjustedXP = this.getAdjustedEncounterXP(encounter, waveID, id => getMonster(id));

		let basic = 0;
		let adjusted = 0;

		if (adjustedXP > 0) {
			if (adjustedXP >= thresholds.easy) {
				basic = 1;
			}
			if (adjustedXP >= thresholds.medium) {
				basic = 2;
			}
			if (adjustedXP >= thresholds.hard) {
				basic = 3;
			}
			if (adjustedXP >= thresholds.deadly) {
				basic = 4;
			}
			if ((thresholds.deadly > 0) && (adjustedXP >= (thresholds.deadly * 10))) {
				basic = 5;
			}
			if ((thresholds.deadly > 0) && (adjustedXP >= (thresholds.deadly * 20))) {
				basic = 6;
			}
			if ((thresholds.deadly > 0) && (adjustedXP >= (thresholds.deadly * 30))) {
				basic = 7;
			}
			if ((thresholds.deadly > 0) && (adjustedXP >= (thresholds.deadly * 40))) {
				basic = 8;
			}

			adjusted = basic;
			const pcs = party.pcs.filter(pc => pc.active);
			if (pcs.length < 3) {
				adjusted = Math.max(0, basic - 1);
			}
			if (pcs.length > 5) {
				adjusted = basic + 1;
			}
		}

		return {
			basic: basic,
			adjusted: adjusted
		};
	}

	public static getDifficultyDescription(difficulty: number) {
		switch (difficulty) {
			case 0:
				return 'trivial';
			case 1:
				return 'easy';
			case 2:
				return 'medium';
			case 3:
				return 'hard';
			case 4:
				return 'deadly';
			case 5:
				return 'tpk';
			case 6:
				return 'dm with a grudge';
			case 7:
				return 'now you\'re just being silly';
		}

		return 'please stop';
	}

	public static getFilterDescription(filter: MonsterFilter) {
		let summary = '';
		if (filter.size !== 'all sizes') {
			summary += summary ? ' ' + filter.size : filter.size;
		}
		if (filter.category !== 'all types') {
			summary += summary ? ' ' + filter.category : filter.category;
		}
		if (filter.role !== 'all roles') {
			summary += summary ? ' ' + filter.role : filter.role;
		}
		const min = Gygax.challenge(filter.challengeMin);
		const max = Gygax.challenge(filter.challengeMax);
		const cr = (filter.challengeMin === filter.challengeMax) ? min : min + ' to ' + max;
		summary += ' monsters of cr ' + cr;
		return summary;
	}

	public static buildEncounter(encounter: Encounter, xp: number, templateName: string, filter: MonsterFilter, groups: MonsterGroup[], getMonster: (id: string) => Monster | null) {
		const monsters: { id: string, role: string }[] = [];
		groups.forEach(group => {
			group.monsters
				.filter(monster => this.matchMonster(monster, filter))
				.forEach(monster => monsters.push({ id: monster.id, role: monster.role }));
		});

		if (templateName !== '') {
			if (templateName === 'random') {
				const index = Utils.randomNumber(this.encounterTemplates().length);
				templateName = this.encounterTemplates()[index].name;
			}

			// Add the template slots to the encounter
			const template = this.encounterTemplates().find(t => t.name === templateName);
			if (template) {
				encounter.slots = template.slots.map(s => {
					const slot = Factory.createEncounterSlot();
					slot.roles = s.roles;
					slot.count = s.count;
					return slot;
				});

				// Fill the slots
				encounter.slots.forEach(slot => {
					const slotMonsters = monsters.filter(m => slot.roles.includes(m.role));
					const index = Utils.randomNumber(slotMonsters.length);
					slot.monsterID = slotMonsters[index].id;
				});

				// Until the xp value is met, increment the count of a random slot
				while (this.getAdjustedEncounterXP(encounter, null, id => getMonster(id)) < xp) {
					const index = Utils.randomNumber(encounter.slots.length);
					encounter.slots[index].count += 1;
				}
			}
		} else {
			while (this.getAdjustedEncounterXP(encounter, null, id => getMonster(id)) < xp) {
				if ((encounter.slots.length > 0) && (Gygax.dieRoll(3) > 1)) {
					// Increment a slot
					const index = Utils.randomNumber(encounter.slots.length);
					const slot = encounter.slots[index];
					slot.count += 1;
				} else {
					// Pick a new monster
					const candidates = monsters.filter(monster => !encounter.slots.find(slot => slot.monsterID === monster.id));
					if (candidates.length > 0) {
						const index = Utils.randomNumber(candidates.length);
						const slot = Factory.createEncounterSlot();
						slot.monsterID = candidates[index].id;
						encounter.slots.push(slot);
					} else {
						if (encounter.slots.length === 0) {
							break;
						}
					}
				}
			}
		}

		// Split into waves
		while ((encounter.slots.length > 1) && (Gygax.dieRoll(10) === 10)) {
			const index = Utils.randomNumber(encounter.slots.length);
			const slot = encounter.slots[index];
			encounter.slots = encounter.slots.filter(s => s.id !== slot.id);
			const wave = Factory.createEncounterWave();
			wave.name = 'wave ' + (encounter.waves.length + 2);
			wave.slots.push(slot);
			encounter.waves.push(wave);
		}
	}

	public static matchMonster(monster: Monster, filter: MonsterFilter) {
		if (monster.challenge < filter.challengeMin) {
			return false;
		}

		if (monster.challenge > filter.challengeMax) {
			return false;
		}

		if (filter.name !== '') {
			if (!Sherlock.match(filter.name, monster.name)) {
				return false;
			}
		}

		if (filter.category !== 'all types') {
			if (monster.category !== filter.category) {
				return false;
			}
		}

		if (filter.size !== 'all sizes') {
			if (monster.size !== filter.size) {
				return false;
			}
		}

		if (filter.role !== 'all roles') {
			if (monster.role !== filter.role) {
				return false;
			}
		}

		return true;
	}

	public static sortEncounter(encounter: Encounter, getMonster: (id: string) => Monster | null) {
		this.sortEncounterSlots(encounter, id => getMonster(id));
		encounter.waves.forEach(wave => this.sortEncounterSlots(wave, id => getMonster(id)));
	}

	public static sortEncounterSlots(slotContainer: Encounter | EncounterWave, getMonster: (id: string) => Monster | null) {
		const uniqueSlots: EncounterSlot[] = [];
		slotContainer.slots.forEach(slot => {
			let current = uniqueSlots.find(s => (s.monsterID === slot.monsterID) && (s.monsterThemeID === slot.monsterThemeID) && (s.faction === slot.faction) && (s.roles.join(',') === slot.roles.join(',')));
			if (!current) {
				current = slot;
				uniqueSlots.push(slot);
			} else {
				current.count += slot.count;
			}
		});
		slotContainer.slots = uniqueSlots;

		slotContainer.slots.sort((a, b) => {
			let nameA = a.monsterID;
			const monsterA = this.slotToMonster(a, id => getMonster(id));
			if (monsterA && monsterA.name) {
				nameA = monsterA.name;
			}
			let nameB = b.monsterID;
			const monsterB = this.slotToMonster(b, id => getMonster(id));
			if (monsterB && monsterB.name) {
				nameB = monsterB.name;
			}
			if (nameA < nameB) { return -1; }
			if (nameA > nameB) { return 1; }
			return 0;
		});
	}

	public static sortCombatants(combat: Combat) {
		combat.combatants.sort((a, b) => {
			// First sort by initiative, descending
			if (a.initiative && b.initiative && (a.initiative < b.initiative)) { return 1; }
			if (a.initiative && b.initiative && (a.initiative > b.initiative)) { return -1; }
			// Then sort by name, ascending
			if (a.displayName < b.displayName) { return -1; }
			if (a.displayName > b.displayName) { return 1; }
			return 0;
		});
	}

	public static combatHasLairActions(combat: Combat) {
		let hasLair = false;

		combat.combatants
			.filter(c => !c.pending && c.active && !c.defeated)
			.forEach(c => {
				const monster = c as (Combatant & Monster);
				if (monster && monster.traits && monster.traits.some(t => t.type === 'lair')) {
					hasLair = true;
				}
			});

		return hasLair;
	}

	public static encounterHasMonster(encounter: Encounter, monsterID: string) {
		let ids = encounter.slots.map(s => s.monsterID);
		ids = ids.concat(encounter.slots.map(s => s.monsterThemeID));

		encounter.waves.forEach(w => {
			ids = ids.concat(w.slots.map(s => s.monsterID));
			ids = ids.concat(w.slots.map(s => s.monsterThemeID));
		});

		return !!ids.find(id => id === monsterID);
	}

	public static slotToMonster(slot: EncounterSlot, getMonster: (id: string) => Monster | null) {
		let monster = getMonster(slot.monsterID);
		if (monster) {
			if (slot.monsterThemeID) {
				const theme = getMonster(slot.monsterThemeID);
				if (theme) {
					monster = Frankenstein.applyTheme(monster, theme);
				}
			}
			if (slot.deltaCR !== 0) {
				monster = Frankenstein.adjustCR(monster, slot.deltaCR);
			}
		}

		return monster;
	}

	public static convertPCToCombatant(pc: PC): Combatant {
		const combatant = JSON.parse(JSON.stringify(pc)) as Combatant & PC;

		combatant.current = false;
		combatant.pending = true;
		combatant.active = false;
		combatant.defeated = false;

		combatant.faction = 'ally';
		combatant.displayName = pc.name;
		combatant.displaySize = pc.size;
		combatant.showOnMap = true;
		combatant.initiative = 10;
		combatant.hpMax = null;
		combatant.hpCurrent = null;
		combatant.hpTemp = null;
		combatant.conditions = [];
		combatant.tags = [];
		combatant.note = '';
		combatant.aura = { radius: 0, style: 'rounded', color: '#005080' };
		combatant.mountID = null;
		combatant.mountType = 'controlled';
		combatant.darkvision = pc.darkvision;
		combatant.lightSource = null;
		combatant.path = null;

		return combatant;
	}

	public static convertMonsterToCombatant(monster: Monster, init: number, hp: number, name: string, faction: 'foe' | 'neutral' | 'ally'): Combatant {
		const combatant = JSON.parse(JSON.stringify(monster)) as Combatant & Monster;
		combatant.id = Utils.guid();

		combatant.current = false;
		combatant.pending = false;
		combatant.active = true;
		combatant.defeated = false;

		combatant.faction = faction;
		combatant.displayName = name;
		combatant.displaySize = monster.size;
		combatant.showOnMap = true;

		combatant.initiative = init;
		combatant.hpMax = hp;
		combatant.hpCurrent = hp;
		combatant.hpTemp = 0;
		combatant.conditions = [];
		combatant.tags = [];
		combatant.note = '';
		combatant.aura = { radius: 0, style: 'rounded', color: '#005080' };
		combatant.mountID = null;
		combatant.mountType = 'controlled';
		combatant.darkvision = Frankenstein.getVisionRadius(monster);
		combatant.lightSource = null;
		combatant.path = null;

		return combatant;
	}

	public static convertCompanionToCombatant(companion: Companion | null): Combatant {
		const combatant = (companion ? JSON.parse(JSON.stringify(companion)) : {}) as Combatant & Companion;
		combatant.id = companion ? companion.id : Utils.guid();
		combatant.type = 'companion';

		combatant.current = false;
		combatant.pending = true;
		combatant.active = false;
		combatant.defeated = false;

		combatant.faction = 'ally';
		combatant.displayName = companion ? companion.name : 'companion';
		combatant.displaySize = 'medium';
		combatant.showOnMap = true;

		combatant.initiative = 10;
		combatant.hpMax = null;
		combatant.hpCurrent = null;
		combatant.hpTemp = null;
		combatant.conditions = [];
		combatant.tags = [];
		combatant.note = '';
		combatant.aura = { radius: 0, style: 'rounded', color: '#005080' };
		combatant.mountID = null;
		combatant.mountType = 'controlled';
		combatant.darkvision = 0;
		combatant.lightSource = null;
		combatant.path = null;

		return combatant;
	}

	public static convertPlaceholderToCombatant(): Combatant {
		return {
			id: Utils.guid(),
			type: 'placeholder',

			current: false,
			pending: false,
			active: true,
			defeated: false,

			faction: 'neutral',
			displayName: 'lair actions',
			displaySize: 'medium',
			showOnMap: true,
			initiative: 20,
			hpMax: null,
			hpCurrent: null,
			hpTemp: null,
			conditions: [],
			tags: [],
			note: '',
			aura: { radius: 0, style: 'rounded', color: '#005080' },
			mountID: null,
			mountType: 'controlled',
			darkvision: 0,
			lightSource: null,
			path: null
		};
	}

	public static updateCombatant(combatant: Combatant & PC, pc: PC) {
		combatant.player = pc.player;
		combatant.name = pc.name;
		combatant.displayName = pc.name;
		combatant.size = pc.size;
		combatant.race = pc.race;
		combatant.classes = pc.classes;
		combatant.level = pc.level;
		combatant.languages = pc.languages;
		combatant.passiveInsight = pc.passiveInsight;
		combatant.passiveInvestigation = pc.passiveInvestigation;
		combatant.passivePerception = pc.passivePerception;
		combatant.darkvision = pc.darkvision;
		combatant.portrait = pc.portrait;
		combatant.url = pc.url;
	}

	public static encounterTemplates(includeRandom: boolean = false) {
		const slots = [
			{
				name: 'battlefield control',
				slots: [
					{
						roles: ['controller'],
						count: 1
					},
					{
						roles: ['skirmisher', 'sneak'],
						count: 5
					}
				]
			},
			{
				name: 'commander and troops',
				slots: [
					{
						roles: ['controller', 'soldier'],
						count: 1
					},
					{
						roles: ['soldier', 'tank'],
						count: 5
					}
				]
			},
			{
				name: 'dragon\'s den',
				slots: [
					{
						roles: ['boss'],
						count: 1
					}
				]
			},
			{
				name: 'double line',
				slots: [
					{
						roles: ['soldier', 'tank'],
						count: 3
					},
					{
						roles: ['artillery', 'controller'],
						count: 2
					}
				]
			},
			{
				name: 'wolf pack',
				slots: [
					{
						roles: ['skirmisher'],
						count: 6
					}
				]
			}
		];

		if (includeRandom) {
			slots.unshift({
				name: 'random',
				slots: []
			});
		}

		return slots;
	}

	public static getActiveCombatants(combat: Combat, playerView: boolean, showDefeated: boolean) {
		const controlledMounts = combat.combatants
			.filter(c => !!c.mountID && (c.mountType === 'controlled'))
			.map(c => c.mountID || '');

		return combat.combatants
			.filter(c => !controlledMounts.includes(c.id))
			.filter(c => c.active || (c.defeated && showDefeated))
			.filter(c => {
				// Ignore anything that's hidden, unless it's a PC
				if (playerView && (c.type !== 'pc')) {
					return c.showOnMap;
				}
				return true;
			})
			.filter(c => {
				// If there's a map, ignore monsters that aren't on it
				if (playerView && (c.type === 'monster') && (!!combat.map)) {
					return !!combat.map.items.find(i => i.id === c.id);
				}
				return true;
			})
			.filter(c => {
				// If it's a placeholder, only show it if this encounter has lair actions
				if (c.type === 'placeholder') {
					return this.combatHasLairActions(combat);
				}
				return true;
			});
	}

	public static getMountsAndRiders(ids: string[], combatants: Combatant[]) {
		const list = ids.map(id => combatants.find(c => c.id === id)).filter(c => c !== undefined) as Combatant[];
		const mounts = list.map(c => combatants.find(mount => mount.id === c.mountID)).filter(c => c !== undefined) as Combatant[];
		const riders = list.map(c => combatants.find(rider => rider.mountID === c.id)).filter(c => c !== undefined) as Combatant[];
		return list.concat(mounts).concat(riders);
	}

	public static setMountPositions(combatants: Combatant[], map: Map) {
		combatants.forEach(c => {
			if (c.mountID) {
				// Set mount location to equal rider location
				const riderItem = map.items.find(i => i.id === c.id);
				const mountItem = map.items.find(i => i.id === c.mountID);
				if (riderItem && mountItem) {
					mountItem.x = riderItem.x;
					mountItem.y = riderItem.y;
				}
			}
		});
	}

	public static getVictoryCondition(encounter: Encounter, getMonster: (id: string) => Monster | null) {
		const conditions = [];

		conditions.push('the party must defeat their opponents within ' + (1 + Gygax.dieRoll(4, 1)) + ' rounds');
		conditions.push('at least one character must get to a certain area and stay there for ' + (1 + Gygax.dieRoll(4, 1)) + ' consecutive rounds');
		conditions.push('the party must leave the area within ' + (1 + Gygax.dieRoll(4, 1)) + ' rounds');
		conditions.push('the party must keep the enemy away from a certain area for the duration of the encounter');
		conditions.push('the party must escort an NPC safely through the encounter area');
		conditions.push('the party must rescue an NPC from their opponents');
		conditions.push('the party must destroy a feature of the area');

		const leaders: string[] = [];
		encounter.slots.filter(slot => slot.count === 1).forEach(slot => {
			const m = getMonster(slot.monsterID);
			if (!!m) {
				if ((m.role === 'boss') || (m.role === 'controller')) {
					leaders.push(m.name);
				}
			}
		});
		encounter.waves.forEach(wave => {
			wave.slots.filter(slot => slot.count === 1).forEach(slot => {
				const m = getMonster(slot.monsterID);
				if (!!m) {
					if ((m.role === 'boss') || (m.role === 'controller')) {
						leaders.push(m.name);
					}
				}
			});
		})

		if (leaders.length !== 0)
		{
			const l = Utils.randomNumber(leaders.length);
			const leader = leaders[l];

			conditions.push('the party must defeat ' + leader);
			conditions.push('the party must capture ' + leader);
			conditions.push('the party must defeat ' + leader + ' within ' + Gygax.dieRoll(4, 2) + ' rounds');
			conditions.push('after ' + Gygax.dieRoll(4, 2) + ' rounds, ' + leader + ' will flee or surrender');
			conditions.push('at ' + (10 * Gygax.dieRoll(4, 1)) + '% HP, ' + leader + ' will flee or surrender');
			conditions.push('the party must obtain an item from ' + leader);
			conditions.push('the party must defeat ' + leader + ' by destroying an object in the area');
			conditions.push('the party must defeat ' + leader + '; the others will then flee or surrender');
		}

		const count = this.getMonsterCount(encounter, null);
		if (count > 2) {
			conditions.push('the party must defeat ' + (2 + Utils.randomNumber(count - 2)) + ' opponents; the others will then flee or surrender');
		}

		const index = Utils.randomNumber(conditions.length);
		return conditions[index];
	}
}
