import Factory from './factory';
import Utils from './utils';

import { Encounter, EncounterSlot, MonsterFilter } from '../models/encounter';
import { Monster, MonsterGroup } from '../models/monster-group';

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

    public static buildEncounter(
        encounter: Encounter, xp: number, filter: MonsterFilter, groups: MonsterGroup[],
        getMonster: (monsterName: string, groupName: string) => Monster | null) {

        while (Napoleon.getEncounterXP(encounter, (monsterName, groupName) => getMonster(monsterName, groupName)) < xp) {
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
                }
            }
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
            if (!Utils.match(filter.name, monster.name)) {
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
}
