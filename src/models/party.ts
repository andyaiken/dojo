export interface Party {
	id: string;
	name: string;
	pcs: PC[];
	awards: string[];
}

export interface PC {
	id: string;
	type: string;
	active: boolean;
	player: string;
	name: string;
	size: string;
	race: string;
	classes: string;
	level: number;
	languages: string;
	passiveInsight: number;
	passiveInvestigation: number;
	passivePerception: number;
	portrait: string;
	url: string;
	companions: Companion[];
	awards: string[];
}

export interface Companion {
	id: string;
	name: string;
	monsterID: string | null;
}

export interface Award {
	id: string;
	category: string;
	name: string;
	description: string;
}
