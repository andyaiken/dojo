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
