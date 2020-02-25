import { Condition } from './condition';
import { Encounter } from './encounter';
import { Map } from './map';
import { Trait } from './monster-group';
import { Party } from './party';

export interface CombatSetup {
    party: Party | null;
    encounter: Encounter | null;
    waveID: string | null;
    map: Map | null;
    monsterNames: { id: string, names: string[] }[];
    encounterInitMode: 'manual' | 'individual' | 'group';
}

export interface Combat {
    id: string;
    name: string;
    encounter: Encounter;
    combatants: Combatant[];
    map: Map | null;
    round: number;
    notifications: Notification[];
    issues: string[];
    report: CombatReportEntry[];
}

export interface Combatant {
    id: string;
    type: string;
    displayName: string;
    displaySize: string;
    showOnMap: boolean;
    current: boolean;
    pending: boolean;
    active: boolean;
    defeated: boolean;
    initiative: number | null;
    hp: number | null;
    hpTemp: number | null;
    conditions: Condition[];
    tags: string[];
    note: string;
    altitude: number;
    aura: {
        radius: number;
        style: 'square' | 'rounded' | 'circle';
        color: string;
    };
}

export interface Notification {
    id: string;
    type: 'condition-save' | 'condition-end' | 'trait-recharge';
    data: Condition | Trait | null;
    combatant: Combatant | null;
}

export interface CombatReportEntry {
    id: string;
    type: 'movement' | 'damage' | 'kill'
        | 'turn-start' | 'turn-end'
        | 'combat-start' | 'combat-end'
        | 'combat-pause' | 'combat-resume'
        | 'condition-add' | 'condition-remove';
    timestamp: number;
    combatantID: string;
    value: number;
}
