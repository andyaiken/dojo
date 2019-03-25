import { PC } from './party';
import { Monster } from './monster-group';
import { Map } from './map-folio';
import { Condition } from './condition';

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
}

export interface Notification {
    id: string;
    type: 'condition-save' | 'condition-end';
    condition: Condition | null;
    combatant: (Combatant & Monster) | null;
}
