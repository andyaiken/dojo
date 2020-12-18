import { Condition } from './condition';
import { Encounter } from './encounter';
import { Map } from './map';
import { Trait } from './monster';
import { Party } from './party';

export interface CombatSetup {
	party: Party | null;
	encounter: Encounter | null;
	waveID: string | null;
	map: Map | null;
	fog: { x: number, y: number }[];
	lighting: 'bright' | 'dim' | 'dark';
	combatants: Combatant[];
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
	lighting: 'bright' | 'dim' | 'dark';
	round: number;
	issues: string[];
}

export interface Combatant {
	id: string;
	type: string;
	faction: 'foe' | 'neutral' | 'ally';
	displayName: string;
	displaySize: string;
	showOnMap: boolean;		// Whether or not the combatant is hidden
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
	mountID: string | null;
	mountType: 'controlled' | 'independent';
}

export interface Notification {
	id: string;
	type: 'condition-save' | 'condition-end' | 'trait-recharge';
	data: Condition | Trait | null;
	combatant: Combatant | null;
}
