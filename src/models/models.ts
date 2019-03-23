export interface Party {
    id: string;
    name: string;
    pcs: PC[];
}

export interface PC {
    id: string;
    type: string;
    active: boolean;
    player: string;
    name: string;
    race: string;
    classes: string;
    background: string;
    level: number;
    languages: string;
    passiveInsight: number;
    passiveInvestigation: number;
    passivePerception: number;
    initiative: number;
    url: string;
}

export interface MonsterGroup {
    id: string;
    name: string;
    monsters: Monster[];
}

export interface Monster {
    id: string;
    type: string;
    name: string;
    size: string;
    category: string;
    tag: string;
    alignment: string;
    challenge: number;
    abilityScores: {
        str: number;
        dex: number;
        con: number;
        int: number;
        wis: number;
        cha: number;
    };
    ac: number;
    hpMax: number;
    hpTemp: number;
    hitDice: number;
    damage: {
        resist: string;
        vulnerable: string;
        immune: string;
    };
    savingThrows: string;
    speed: string;
    skills: string;
    senses: string;
    languages: string;
    equipment: string;
    traits: Trait[];
    conditionImmunities: string;
}

export interface Trait {
    id: string;
    name: string;
    usage: string;
    type: 'trait' | 'action' | 'legendary' | 'lair' | 'regional';
    text: string;
}

export interface Encounter {
    id: string;
    name: string;
    slots: EncounterSlot[];
    waves: EncounterWave[];
}

export interface EncounterSlot {
    id: string;
    monsterGroupName: string;
    monsterName: string;
    count: number;
}

export interface EncounterWave {
    id: string;
    name: string;
    slots: EncounterSlot[];
}

export interface MapFolio {
    id: string;
    name: string;
    maps: Map[];
}

export interface Map {
    id: string;
    name: string;
    items: MapItem[];
}

export interface MapItem {
    id: string;
    type: "tile" | "pc" | "monster";
    x: number;
    y: number;
    width: number;
    height: number;
    terrain: string | null;
}

export interface CombatSetup {
    partyID: string | null;
    encounterID: string | null;
    waveID: string | null;
    folioID: string | null;
    mapID: string | null;
    monsterNames: { id: string, names: string[] }[];
    encounterInitMode: 'manual' | 'individual' | 'group';
}

export interface Combat {
    id: string;
    name: string;
    encounterID: string | null;
    combatants: ((Combatant & PC) | (Combatant & Monster))[];
    map: Map | null;
    round: number;
    notifications: Notification[];
    issues: string[];
    timestamp: string | null;
}

export interface Combatant {
    id: string;
    displayName: string;
    current: boolean;
    pending: boolean;
    active: boolean;
    defeated: boolean;
    initiative: number | null;
    hp: number | null;
    conditions: Condition[];
    altitude: number;
}

export interface Notification {
    id: string;
    type: 'condition-save' | 'condition-end';
    condition: Condition | null;
    combatant: (Combatant & Monster) | null;
}

export interface Condition {
    id: string;
    name: string;
    level: number;
    text: string | null;
    duration: ConditionDurationSaves | ConditionDurationCombatant | ConditionDurationRounds | null;
}

export interface ConditionDurationSaves {
    type: 'saves';
    count: number;
    saveType: string; // TODO
    saveDC: number;
    point: 'start' | 'end';
}

export interface ConditionDurationCombatant {
    type: 'combatant';
    point: 'start' | 'end';
    combatantID: string | null;
}

export interface ConditionDurationRounds {
    type: 'rounds';
    count: number;
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