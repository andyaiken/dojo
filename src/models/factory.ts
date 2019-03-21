import * as utils from '../utils';

export function createParty() {
    return {
        id: utils.guid(),
        name: "",
        pcs: []
    };
}

export function createPC() {
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

export function createMonsterGroup() {
    return {
        id: utils.guid(),
        name: "",
        monsters: []
    };
}

export function createMonster() {
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

export function createTrait() {
    return {
        id: utils.guid(),
        name: "",
        usage: "",
        type: "action",
        text: ""
    };
}

export function createEncounter() {
    return {
        id: utils.guid(),
        name: "",
        slots: [],
        waves: []
    };
}

export function createEncounterSlot() {
    return {
        id: utils.guid(),
        monsterGroupName: "",
        monsterName: "",
        count: 1
    };
}

export function createEncounterWave() {
    return {
        id: utils.guid(),
        name: "",
        slots: []
    };
}

export function createMapFolio() {
    return {
        id: utils.guid(),
        name: "",
        maps: []
    };
}

export function createMap() {
    return {
        id: utils.guid(),
        name: "",
        items: []
    };
}

export function createMapItem() {
    return {
        id: utils.guid(),
        type: "tile",
        x: 0,
        y: 0,
        width: 4,
        height: 4,
        terrain: "flagstone"
    };
}

export function createCombat() {
    return {
        id: utils.guid(),
        name: "",
        encounterID: null,
        combatants: [],
        map: null,
        round: 1,
        notifications: [],
        issues: []
    };
}

export const SIZE_TYPES = [
    "tiny",
    "small",
    "medium",
    "large",
    "huge",
    "gargantuan"
];

export const CATEGORY_TYPES = [
    "aberration",
    "beast",
    "celestial",
    "construct",
    "dragon",
    "elemental",
    "fey",
    "fiend",
    "giant",
    "humanoid",
    "monstrosity",
    "ooze",
    "plant",
    "undead"
];

export const TRAIT_TYPES = [
    "trait",
    "action",
    "legendary",
    "lair",
    "regional"
];

export const CONDITION_TYPES = [
    "blinded",
    "charmed",
    "deafened",
    "exhaustion",
    "frightened",
    "grappled",
    "incapacitated",
    "invisible",
    "paralyzed",
    "petrified",
    "poisoned",
    "prone",
    "restrained",
    "stunned",
    "unconscious",
    "custom"
];

export const TERRAIN_TYPES = [
    "cavern",
    "dirt",
    "flagstone",
    "floorboard",
    "grassland",
    "pit",
    "sand",
    "snow",
    "water"
];