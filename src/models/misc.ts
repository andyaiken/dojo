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
	name: string;
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
