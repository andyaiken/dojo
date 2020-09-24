// This utility file deals with encounters and combat

import { Factory } from './factory';
import { Gygax } from './gygax';
import { Sherlock } from './sherlock';
import { Utils } from './utils';

import { Combat, Combatant } from '../models/combat';
import { Encounter, EncounterSlot, MonsterFilter } from '../models/encounter';
import { Map } from '../models/map';
import { Monster, MonsterGroup } from '../models/monster';
import { Companion, PC } from '../models/party';

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
			const monster = getMonster(slot.monsterID);
			if (monster) {
				xp += Gygax.experience(monster.challenge) * slot.count;
			}
		});

		return xp;
	}

	public static getAdjustedEncounterXP(encounter: Encounter, waveID: string | null, getMonster: (id: string) => Monster | null) {
		const count = this.getMonsterCount(encounter, waveID);
		const xp = this.getEncounterXP(encounter, waveID, getMonster);
		return xp * Gygax.experienceFactor(count);
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

	public static buildEncounter(
		encounter: Encounter, xp: number, filter: MonsterFilter, groups: MonsterGroup[],
		getMonster: (id: string) => Monster | null) {

		while (Napoleon.getAdjustedEncounterXP(encounter, null, id => getMonster(id)) <= xp) {
			if ((encounter.slots.length > 0) && (Gygax.dieRoll(3) > 1)) {
				// Increment a slot
				const index = Utils.randomNumber(encounter.slots.length);
				const slot = encounter.slots[index];
				slot.count += 1;
			} else {
				// Pick a new monster
				const candidates: { id: string, monsterName: string, groupName: string }[] = [];
				groups.forEach(group => {
					group.monsters
						.filter(monster => Napoleon.matchMonster(monster, filter))
						.filter(monster => !encounter.slots.find(slot => (slot.monsterGroupName === group.name) && (slot.monsterName === monster.name)))
						.forEach(monster => candidates.push({ id: monster.id, monsterName: monster.name, groupName: group.name }));
				});
				if (candidates.length > 0) {
					const index = Utils.randomNumber(candidates.length);
					const slot = Factory.createEncounterSlot();
					slot.monsterID = candidates[index].id;
					slot.monsterName = candidates[index].monsterName;
					slot.monsterGroupName = candidates[index].groupName;
					encounter.slots.push(slot);
				} else {
					if (encounter.slots.length === 0) {
						break;
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
		encounter.waves.forEach(w => {
			ids = ids.concat(w.slots.map(s => s.monsterID));
		});
		return !!ids.find(id => id === monsterID);
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
		combatant.altitude = 0;
		combatant.aura = { radius: 0, style: 'rounded', color: '#005080' };
		combatant.mountID = null;
		combatant.mountType = 'controlled';

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
		combatant.altitude = 0;
		combatant.aura = { radius: 0, style: 'rounded', color: '#005080' };
		combatant.mountID = null;
		combatant.mountType = 'controlled';

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
		combatant.altitude = 0;
		combatant.aura = { radius: 0, style: 'rounded', color: '#005080' };
		combatant.mountID = null;
		combatant.mountType = 'controlled';

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
			altitude: 0,
			aura: { radius: 0, style: 'rounded', color: '#005080' },
			mountID: null,
			mountType: 'controlled'
		};
	}

	public static encounterTemplates() {
		return [
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
					return Napoleon.combatHasLairActions(combat);
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
}
