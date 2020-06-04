export interface Encounter {
	id: string;
	name: string;
	slots: EncounterSlot[];
	waves: EncounterWave[];
	notes: string;
}

export interface EncounterSlot {
	id: string;
	monsterGroupName: string;
	monsterName: string;
	roles: string[];
	count: number;
}

export interface EncounterWave {
	id: string;
	name: string;
	slots: EncounterSlot[];
}

export interface MonsterFilter {
	name: string;
	challengeMin: number;
	challengeMax: number;
	category: string;
	size: string;
	role: string;
}
