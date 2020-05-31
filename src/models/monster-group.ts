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
	role: string;
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
	portrait: string;
	legendaryActions: number;
}

export interface Trait {
	id: string;
	name: string;
	usage: string;
	type: 'trait' | 'action' | 'bonus' | 'reaction' | 'legendary' | 'lair';
	text: string;
	uses: number;
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

export const ROLE_TYPES = [
	'artillery',
	'boss',
	'controller',
	'elite',
	'lurker',
	'skirmisher',
	'tank'
];

export const TRAIT_TYPES = [
	'trait',
	'action',
	'bonus',
	'reaction',
	'legendary',
	'lair'
];
