import * as utils from '../utils';

import { Party, PC, MonsterGroup, Monster, Trait, Encounter, EncounterSlot, EncounterWave, MapFolio, Map, MapItem, Combat, Notification, Condition } from './models';

export function createParty(): Party {
    return {
        id: utils.guid(),
        name: "",
        pcs: []
    };
}

export function createPC(): PC {
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

export function createMonsterGroup(): MonsterGroup {
    return {
        id: utils.guid(),
        name: "",
        monsters: []
    };
}

export function createMonster(): Monster {
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

export function createTrait(): Trait {
    return {
        id: utils.guid(),
        name: "",
        usage: "",
        type: "action",
        text: ""
    };
}

export function createEncounter(): Encounter {
    return {
        id: utils.guid(),
        name: "",
        slots: [],
        waves: []
    };
}

export function createEncounterSlot(): EncounterSlot {
    return {
        id: utils.guid(),
        monsterGroupName: "",
        monsterName: "",
        count: 1
    };
}

export function createEncounterWave(): EncounterWave {
    return {
        id: utils.guid(),
        name: "",
        slots: []
    };
}

export function createMapFolio(): MapFolio {
    return {
        id: utils.guid(),
        name: "",
        maps: []
    };
}

export function createMap(): Map {
    return {
        id: utils.guid(),
        name: "",
        items: []
    };
}

export function createMapItem(): MapItem {
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

export function createCombat(): Combat {
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

export function createNotification(): Notification {
    return {
        id: utils.guid(),
        type: "",
        condition: null,
        combatant: null
    };
}

export function createCondition(): Condition {
    return {
        id: utils.guid(),
        name: "",
        level: 1,
        text: null,
        duration: null
    }
}