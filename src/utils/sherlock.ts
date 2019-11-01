// This utility file deals with search

import { Encounter, EncounterSlot, EncounterWave } from '../models/encounter';
import { Map, MapFolio, MapNote } from '../models/map-folio';
import { Monster, MonsterGroup, Trait } from '../models/monster-group';
import { Companion, Party, PC } from '../models/party';

export default class Sherlock {
    public static matchParty(filter: string, party: Party) {
        if (Sherlock.match(filter, party.name)) {
            return true;
        }

        return party.pcs.some(pc => Sherlock.matchPC(filter, pc));
    }

    public static matchPC(filter: string, pc: PC) {
        if (Sherlock.match(filter, pc.name)) {
            return true;
        }

        if (Sherlock.match(filter, pc.player)) {
            return true;
        }

        if (Sherlock.match(filter, pc.race)) {
            return true;
        }

        if (Sherlock.match(filter, pc.classes)) {
            return true;
        }

        return pc.companions.some(companion => Sherlock.matchCompanion(filter, companion));
    }

    public static matchCompanion(filter: string, companion: Companion) {
        if (Sherlock.match(filter, companion.name)) {
            return true;
        }

        return false;
    }

    public static matchGroup(filter: string, group: MonsterGroup) {
        if (Sherlock.match(filter, group.name)) {
            return true;
        }

        return group.monsters.some(monster => Sherlock.matchMonster(filter, monster));
    }

    public static matchMonster(filter: string, monster: Monster) {
        if (Sherlock.match(filter, monster.name)) {
            return true;
        }

        if (Sherlock.match(filter, monster.category)) {
            return true;
        }

        if (Sherlock.match(filter, monster.tag)) {
            return true;
        }

        if (Sherlock.match(filter, monster.senses)) {
            return true;
        }

        if (Sherlock.match(filter, monster.languages)) {
            return true;
        }

        if (Sherlock.match(filter, monster.equipment)) {
            return true;
        }

        return monster.traits.some(trait => Sherlock.matchTrait(filter, trait));
    }

    public static matchTrait(filter: string, trait: Trait) {
        if (Sherlock.match(filter, trait.name)) {
            return true;
        }

        if (Sherlock.match(filter, trait.usage)) {
            return true;
        }

        if (Sherlock.match(filter, trait.text)) {
            return true;
        }

        return false;
    }

    public static matchEncounter(filter: string, encounter: Encounter) {
        if (Sherlock.match(filter, encounter.name)) {
            return true;
        }

        if (encounter.waves.some(wave => Sherlock.matchEncounterWave(filter, wave))) {
            return true;
        }

        return encounter.slots.some(slot => Sherlock.matchEncounterSlot(filter, slot));
    }

    public static matchEncounterWave(filter: string, wave: EncounterWave) {
        if (Sherlock.match(filter, wave.name)) {
            return true;
        }

        return wave.slots.some(slot => Sherlock.matchEncounterSlot(filter, slot));
    }

    public static matchEncounterSlot(filter: string, slot: EncounterSlot) {
        if (Sherlock.match(filter, slot.monsterName)) {
            return true;
        }

        return false;
    }

    public static matchFolio(filter: string, folio: MapFolio) {
        if (Sherlock.match(filter, folio.name)) {
            return true;
        }

        return folio.maps.some(map => Sherlock.matchMap(filter, map));
    }

    public static matchMap(filter: string, map: Map) {
        if (Sherlock.match(filter, map.name)) {
            return true;
        }

        return map.notes.some(note => Sherlock.matchMapNote(filter, note));
    }

    public static matchMapNote(filter: string, note: MapNote) {
        if (Sherlock.match(filter, note.text)) {
            return true;
        }

        return false;
    }

    public static match(filter: string, text: string): boolean {
        if (!filter) {
            return true;
        }

        let result = true;

        const tokens = filter.toLowerCase().split(' ');
        tokens.forEach(token => {
            if (text.toLowerCase().indexOf(token) === -1) {
                result = false;
            }
        });

        return result;
    }
}
