import { DieRollResult } from './dice';

export interface Options {
	showMonsterDieRolls: boolean;
}

export interface Sidebar {
	visible: boolean;
	type: string;
	subtype: string;
	dice: { [sides: number]: number };
	constant: number;
	dieRolls: DieRollResult[];
	handout: Handout | null;
	languagePreset: string | null;
	selectedLanguages: string[];
	languageOutput: string[];
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

export interface OracleCard {
	id: string;
	value: number | string;
	suit: string | null;
	name: string | null;
	meanings: {
		upright: string,
		reversed: string
	};
}

export interface CardDraw {
	id: string;
	cardID: string;
	reversed: boolean;
}

export interface Handout {
	type: string;
	filename: string;
	src: string;
}
