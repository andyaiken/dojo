import * as utils from '../utils';

import {
    Party, PC,
    MonsterGroup, Monster, Trait,
    Encounter, EncounterSlot, EncounterWave,
    MapFolio, Map, MapItem,
    CombatSetup, Combat, Notification, Condition, ConditionDurationSaves, ConditionDurationCombatant, ConditionDurationRounds
} from './models';

export default class Factory {

    public static createParty(): Party {
        return {
            id: utils.guid(),
            name: "",
            pcs: []
        };
    }

    public static createPC(): PC {
        return {
            id: utils.guid(),
            type: "pc",
            active: true,
            player: "",
            name: "",
            race: "",
            classes: "",
            background: "",
            level: 1,
            languages: "Common",
            passiveInsight: 10,
            passiveInvestigation: 10,
            passivePerception: 10,
            initiative: 10,
            url: ""
        };
    }

    public static createMonsterGroup(): MonsterGroup {
        return {
            id: utils.guid(),
            name: "",
            monsters: []
        };
    }

    public static createMonster(): Monster {
        return {
            id: utils.guid(),
            type: "monster",
            name: "",
            size: "medium",
            category: "humanoid",
            tag: "",
            alignment: "",
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
                resist: "",
                vulnerable: "",
                immune: ""
            },
            savingThrows: "",
            speed: "",
            skills: "",
            senses: "",
            languages: "",
            equipment: "",
            traits: [],
            conditionImmunities: ""
        };
    }

    public static createTrait(): Trait {
        return {
            id: utils.guid(),
            name: "",
            usage: "",
            type: "action",
            text: ""
        };
    }

    public static createEncounter(): Encounter {
        return {
            id: utils.guid(),
            name: "",
            slots: [],
            waves: []
        };
    }

    public static createEncounterSlot(): EncounterSlot {
        return {
            id: utils.guid(),
            monsterGroupName: "",
            monsterName: "",
            count: 1
        };
    }

    public static createEncounterWave(): EncounterWave {
        return {
            id: utils.guid(),
            name: "",
            slots: []
        };
    }

    public static createMapFolio(): MapFolio {
        return {
            id: utils.guid(),
            name: "",
            maps: []
        };
    }

    public static createMap(): Map {
        return {
            id: utils.guid(),
            name: "",
            items: []
        };
    }

    public static createMapItem(): MapItem {
        return {
            id: utils.guid(),
            type: "tile",
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
            id: utils.guid(),
            name: "",
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
            id: utils.guid(),
            type: 'condition-save',
            condition: null,
            combatant: null
        };
    }

    public static createCondition(): Condition {
        return {
            id: utils.guid(),
            name: "",
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