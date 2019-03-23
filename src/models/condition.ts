export interface Condition {
    id: string;
    name: string;
    level: number;
    text: string | null;
    duration: ConditionDurationSaves | ConditionDurationCombatant | ConditionDurationRounds | null;
}

export interface ConditionDurationSaves {
    type: 'saves';
    count: number;
    saveType: string; // TODO
    saveDC: number;
    point: 'start' | 'end';
}

export interface ConditionDurationCombatant {
    type: 'combatant';
    point: 'start' | 'end';
    combatantID: string | null;
}

export interface ConditionDurationRounds {
    type: 'rounds';
    count: number;
}

export const CONDITION_TYPES = [
    "blinded",
    "charmed",
    "deafened",
    "exhaustion",
    "frightened",
    "grappled",
    "incapacitated",
    "invisible",
    "paralyzed",
    "petrified",
    "poisoned",
    "prone",
    "restrained",
    "stunned",
    "unconscious",
    "custom"
];