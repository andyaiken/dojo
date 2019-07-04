import { Condition } from './condition';
import { Map } from './map-folio';
import { Monster, Trait } from './monster-group';
import { PC } from './party';

export interface CombatSetup {
    partyID: string | null;
    encounterID: string | null;
    waveID: string | null;
    folioID: string | null;
    mapID: string | null;
    monsterNames: { id: string, names: string[] }[];
    encounterInitMode: 'manual' | 'individual' | 'group';
}

export interface Combat {
    id: string;
    name: string;
    encounterID: string | null;
    combatants: ((Combatant & PC) | (Combatant & Monster))[];
    map: Map | null;
    round: number;
    notifications: Notification[];
    issues: string[];
    timestamp: string | null;
}

export interface Combatant {
    id: string;
    displayName: string;
    current: boolean;
    pending: boolean;
    active: boolean;
    defeated: boolean;
    initiative: number | null;
    hp: number | null;
    conditions: Condition[];
    altitude: number;
    concentrating: boolean;
    aura: {
        size: number;
        style: 'square' | 'circle';
        color: string;
    };
}

export interface Notification {
    id: string;
    type: 'condition-save' | 'condition-end' | 'trait-recharge';
    data: Condition | Trait | null;
    combatant: (Combatant & Monster) | null;
}
