// This utility file deals with encounters and combat

import Factory from './factory';
import Sherlock from './sherlock';
import Utils from './utils';

import { Combat, Combatant } from '../models/combat';
import { Encounter, EncounterSlot, MonsterFilter } from '../models/encounter';
import { Monster, MonsterGroup } from '../models/monster-group';
import { Companion, PC } from '../models/party';

export default class Napoleon {
    public static getMonsterCount(encounter: Encounter) {
        let count = 0;

        let slots: EncounterSlot[] = [];
        slots = slots.concat(encounter.slots);
        encounter.waves.forEach(wave => {
            slots = slots.concat(wave.slots);
        });

        slots.forEach(slot => {
            count += slot.count;
        });

        return count;
    }

    public static getEncounterXP(encounter: Encounter, getMonster: (monsterName: string, groupName: string) => Monster | null) {
        let xp = 0;

        let slots: EncounterSlot[] = [];
        slots = slots.concat(encounter.slots);
        encounter.waves.forEach(wave => {
            slots = slots.concat(wave.slots);
        });

        slots.forEach(slot => {
            const monster = getMonster(slot.monsterName, slot.monsterGroupName);
            if (monster) {
                xp += Utils.experience(monster.challenge) * slot.count;
            }
        });

        return xp;
    }

    public static getAdjustedEncounterXP(encounter: Encounter, getMonster: (monsterName: string, groupName: string) => Monster | null) {
        let count = 0;
        let xp = 0;

        let slots: EncounterSlot[] = [];
        slots = slots.concat(encounter.slots);
        encounter.waves.forEach(wave => {
            slots = slots.concat(wave.slots);
        });

        slots.forEach(slot => {
            count += slot.count;
            const monster = getMonster(slot.monsterName, slot.monsterGroupName);
            if (monster) {
                xp += Utils.experience(monster.challenge) * slot.count;
            }
        });

        return xp * Utils.experienceFactor(count);
    }

    public static getCombatXP(combat: Combat) {
        let xp = 0;

        combat.combatants
            .filter(combatant => combatant.type === 'monster')
            .forEach(combatant => {
                const monster = combatant as (Combatant & Monster);
                xp += Utils.experience(monster.challenge);
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
        const min = Utils.challenge(filter.challengeMin);
        const max = Utils.challenge(filter.challengeMax);
        const cr =  (filter.challengeMin === filter.challengeMax) ? min : min + ' to ' + max;
        summary += ' monsters of cr ' + cr;
        return summary;
    }

    public static buildEncounter(
        encounter: Encounter, xp: number, filter: MonsterFilter, groups: MonsterGroup[],
        getMonster: (monsterName: string, groupName: string) => Monster | null) {

        while (Napoleon.getAdjustedEncounterXP(encounter, (monsterName, groupName) => getMonster(monsterName, groupName)) <= xp) {
            if ((encounter.slots.length > 0) && (Utils.dieRoll(3) > 1)) {
                // Increment a slot
                const index = Math.floor(Math.random() * encounter.slots.length);
                const slot = encounter.slots[index];
                slot.count += 1;
            } else {
                // Pick a new monster
                const candidates: { groupName: string, monsterName: string }[] = [];
                groups.forEach(group => {
                    group.monsters
                        .filter(monster => Napoleon.matchMonster(monster, filter))
                        .filter(monster => !encounter.slots.find(slot => (slot.monsterGroupName === group.name) && (slot.monsterName === monster.name)))
                        .forEach(monster => candidates.push({groupName: group.name, monsterName: monster.name}));
                });
                if (candidates.length > 0) {
                    const index = Math.floor(Math.random() * candidates.length);
                    const slot = Factory.createEncounterSlot();
                    slot.monsterGroupName = candidates[index].groupName;
                    slot.monsterName = candidates[index].monsterName;
                    encounter.slots.push(slot);
                } else {
                    if (encounter.slots.length === 0) {
                        break;
                    }
                }
            }
        }

        // Split into waves
        while ((encounter.slots.length > 1) && (Utils.dieRoll(10) === 10)) {
            const index = Math.floor(Math.random() * encounter.slots.length);
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

    public static addPCToCombat(combat: Combat, pc: PC) {
        const combatant: Combatant = JSON.parse(JSON.stringify(pc)) as Combatant & PC;

        combatant.current = false;
        combatant.pending = true;
        combatant.active = false;
        combatant.defeated = false;

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

        combat.combatants.push(combatant);
    }

    public static addMonsterToCombat(combat: Combat, monster: Monster, init: number, hp: number, name: string) {
        const combatant: Combatant = JSON.parse(JSON.stringify(monster)) as Combatant & Monster;
        combatant.id = Utils.guid();

        combatant.current = false;
        combatant.pending = false;
        combatant.active = true;
        combatant.defeated = false;

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

        combat.combatants.push(combatant);
    }

    public static addCompanionToCombat(combat: Combat, companion: Companion | null) {
        const combatant: Combatant = {
            id: companion ? companion.id : Utils.guid(),
            type: 'companion',

            current: false,
            pending: true,
            active: false,
            defeated: false,

            displayName: companion ? companion.name : 'companion',
            displaySize: 'medium',
            showOnMap: true,
            initiative: 10,
            hpMax: null,
            hpCurrent: null,
            hpTemp: null,
            conditions: [],
            tags: [],
            note: '',
            altitude: 0,
            aura: { radius: 0, style: 'rounded', color: '#005080' }
        };

        combat.combatants.push(combatant);
    }

    public static addPlaceholderToCombat(combat: Combat) {
        const combatant: Combatant = {
            id: Utils.guid(),
            type: 'placeholder',

            current: false,
            pending: false,
            active: true,
            defeated: false,

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
            aura: { radius: 0, style: 'rounded', color: '#005080' }
        };

        combat.combatants.push(combatant);
    }
}
