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
}

export interface Companion {
    id: string;
    name: string;
    monsterID: string | null;
}
