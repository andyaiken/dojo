import { DieRollResult } from './dice';

export interface Options {
	showMonsterDieRolls: boolean;
	showAwards: boolean;
	theme: string;
	diagonals: string;
	featureFlags: string[];
}

export interface Sidebar {
	visible: boolean;
	type: string;
	subtype: string;
	dice: { [sides: number]: number };
	constant: number;
	dieRolls: DieRollResult[];
	handout: Handout | null;
	languageMode: string;
	languagePreset: string | null;
	selectedLanguages: string[];
	languageOutput: string[];
	surge: string;
	draws: CardDraw[];
	npc: NPC | null;
	selectedPartyID: string | null;
	selectedMonsterID: string | null;
}

export interface NPC {
	age: string;
	profession: string;
	height: string;
	weight: string;
	hair: string;
	physical: string;
	mental: string;
	speech: string;
	trait: string;
	ideal: string;
	bond: string;
	flaw: string;
}

export interface SavedImage {
	id: string;
	name: string;
	data: string;
}

export interface PlayingCard {
	id: string;
	value: number | string;
	name: string | null;
	data: {
		upright: string,
		reversed: string
	} | number | null;
}

export interface CardDraw {
	id: string;
	card: PlayingCard;
	reversed: boolean;
}

export interface Handout {
	type: string;
	filename: string;
	src: string;
}
