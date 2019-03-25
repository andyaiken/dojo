import Utils from './utils';

import { Party, PC } from '../models/party';
import { MonsterGroup, Monster, Trait } from '../models/monster-group';
import { Encounter, EncounterSlot, EncounterWave } from '../models/encounter';
import { MapFolio, Map, MapItem } from '../models/map-folio';
import { CombatSetup, Combat, Notification } from '../models/combat';
import { Condition, ConditionDurationSaves, ConditionDurationCombatant, ConditionDurationRounds } from '../models/condition';

export default class Factory {

    public static createParty(): Party {
        return {
            id: Utils.guid(),
            name: '',
            pcs: []
        };
    }

    public static createPC(): PC {
        return {
            id: Utils.guid(),
            type: 'pc',
            active: true,
            player: '',
            name: '',
            race: '',
            classes: '',
            background: '',
            level: 1,
            languages: 'Common',
            passiveInsight: 10,
            passiveInvestigation: 10,
            passivePerception: 10,
            initiative: 10,
            url: ''
        };
    }

    public static createMonsterGroup(): MonsterGroup {
        return {
            id: Utils.guid(),
            name: '',
            monsters: []
        };
    }

    public static createMonster(): Monster {
        return {
            id: Utils.guid(),
            type: 'monster',
            name: '',
            size: 'medium',
            category: 'humanoid',
            tag: '',
            alignment: '',
            challenge: 1,
            abilityScores: {
                str: 10,
                dex: 10,
                con: 10,
                int: 10,
                wis: 10,
                cha: 10
            },
            ac: 10,
            hpMax: 4,
            hpTemp: 0,
            hitDice: 1,
            damage: {
                resist: '',
                vulnerable: '',
                immune: ''
            },
            savingThrows: '',
            speed: '',
            skills: '',
            senses: '',
            languages: '',
            equipment: '',
            traits: [],
            conditionImmunities: ''
        };
    }

    public static createTrait(): Trait {
        return {
            id: Utils.guid(),
            name: '',
            usage: '',
            type: 'action',
            text: ''
        };
    }

    public static createEncounter(): Encounter {
        return {
            id: Utils.guid(),
            name: '',
            slots: [],
            waves: []
        };
    }

    public static createEncounterSlot(): EncounterSlot {
        return {
            id: Utils.guid(),
            monsterGroupName: '',
            monsterName: '',
            count: 1
        };
    }

    public static createEncounterWave(): EncounterWave {
        return {
            id: Utils.guid(),
            name: '',
            slots: []
        };
    }

    public static createMapFolio(): MapFolio {
        return {
            id: Utils.guid(),
            name: '',
            maps: []
        };
    }

    public static createMap(): Map {
        return {
            id: Utils.guid(),
            name: '',
            items: []
        };
    }

    public static createMapItem(): MapItem {
        return {
            id: Utils.guid(),
            type: 'tile',
            x: 0,
            y: 0,
            width: 4,
            height: 4,
            terrain: null
        };
    }

    public static createCombatSetup(): CombatSetup {
        return {
            partyID: null,
            encounterID: null,
            waveID: null,
            folioID: null,
            mapID: null,
            monsterNames: [],
            encounterInitMode: 'group'
        };
    }

    public static createCombat(): Combat {
        return {
            id: Utils.guid(),
            name: '',
            encounterID: null,
            combatants: [],
            map: null,
            round: 1,
            notifications: [],
            issues: [],
            timestamp: null
        };
    }

    public static createNotification(): Notification {
        return {
            id: Utils.guid(),
            type: 'condition-save',
            condition: null,
            combatant: null
        };
    }

    public static createCondition(): Condition {
        return {
            id: Utils.guid(),
            name: '',
            level: 1,
            text: null,
            duration: null
        };
    }

    public static createConditionDurationSaves(): ConditionDurationSaves {
        return {
            type: 'saves',
            count: 1,
            saveType: 'str',
            saveDC: 10,
            point: 'start'
        };
    }

    public static createConditionDurationCombatant(): ConditionDurationCombatant {
        return {
            type: 'combatant',
            point: 'start',
            combatantID: null
        };
    }

    public static createConditionDurationRounds(): ConditionDurationRounds {
        return {
            type: 'rounds',
            count: 1
        };
    }
}
