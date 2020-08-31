import { Combatant } from './combat';

export interface Map {
	id: string;
	name: string;
	items: MapItem[];
	areas: MapArea[];
}

export interface MapDimensions {
	minX: number;
	maxX: number;
	minY: number;
	maxY: number;
}

export interface MapItem {
	id: string;
	type: 'tile' | 'pc' | 'monster' | 'companion' | 'overlay' | 'token';
	x: number;
	y: number;
	width: number;															// Used by tiles
	height: number;															// Used by tiles
	terrain: string;														// Used by tiles
	customBackground: string;												// Used by tiles
	content: { type: string, orientation: string, style: string } | null;	// Used by tiles
	size: string;															// Used by overlays
	color: string;															// Used by overlays
	opacity: number;														// Used by overlays
	style: 'square' | 'rounded' | 'circle' | null;							// Used by tiles and overlays
}

export interface MapArea {
	id: string;
	name: string;
	text: string;
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface Exploration {
	id: string;
	name: string;
	map: Map;
	partyID: string;
	fog: { x: number, y: number }[];
	combatants: Combatant[];
}

export const TERRAIN_TYPES = [
	'default',
	'cavern',
	'dirt',
	'flagstone',
	'floorboard',
	'grassland',
	'pit',
	'sand',
	'snow',
	'water',
	'custom'
];

export const DOORWAY_TYPES = [
	'single',
	'double',
	'arch',
	'bars'
];

export const STAIRWAY_TYPES = [
	'stairs',
	'spiral',
	'ladder'
];
