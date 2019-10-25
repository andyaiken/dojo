import { Condition } from './condition';
import { Map } from './map-folio';
import { Trait } from './monster-group';

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
    combatants: Combatant[];
    map: Map | null;
    round: number;
    notifications: Notification[];
    issues: string[];
    timestamp: string | null;
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
    conditions: Condition[];
    tags: string[];
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
