export interface Encounter {
	id: string;
	name: string;
	slots: EncounterSlot[];
	waves: EncounterWave[];
	notes: string;
}

export interface EncounterSlot {
	id: string;
	monsterID: string;
	monsterThemeID: string;
	roles: string[];
	count: number;
	faction: 'foe' | 'neutral' | 'ally';
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
