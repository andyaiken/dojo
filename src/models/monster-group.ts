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

export const SIZE_TYPES = [
    'tiny',
    'small',
    'medium',
    'large',
    'huge',
    'gargantuan'
];

export const CATEGORY_TYPES = [
    'aberration',
    'beast',
    'celestial',
    'construct',
    'dragon',
    'elemental',
    'fey',
    'fiend',
    'giant',
    'humanoid',
    'monstrosity',
    'ooze',
    'plant',
    'undead'
];

export const TRAIT_TYPES = [
    'trait',
    'action',
    'legendary',
    'lair',
    'regional'
];
