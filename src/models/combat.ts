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
    fog: { x: number, y: number }[];
    slotInfo: CombatSlotInfo[];
}

export interface CombatSlotInfo {
    id: string;
    useGroupHP: boolean;
    useGroupInit: boolean;
    hp: number;
    init: number;
    members: CombatSlotMember[];
}

export interface CombatSlotMember {
    id: string;
    name: string;
    hp: number;
    init: number;
}

export interface Combat {
    id: string;
    name: string;
    encounter: Encounter;
    combatants: Combatant[];
    map: Map | null;
    fog: { x: number, y: number }[];
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
    showOnMap: boolean;     // Whether or not the combatant is hidden
    current: boolean;
    pending: boolean;
    active: boolean;
    defeated: boolean;
    initiative: number | null;
    hpMax: number | null;
    hpCurrent: number | null;
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
