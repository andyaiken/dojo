import { Combatant } from './combat';

export interface Map {
	id: string;
	name: string;
	items: MapItem[];
	walls: MapWall[];
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
	type: 'tile' | 'pc' | 'monster' | 'companion' | 'token' | 'overlay';
	x: number;
	y: number;
	z: number;
	width: number;															// Used by tiles
	height: number;															// Used by tiles
	depth: number;															// Used by tiles
	terrain: string;														// Used by tiles
	customBackground: string;												// Used by tiles
	customLink: string;														// Used by tiles
	content: { type: string, orientation: string, style: string } | null;	// Used by tiles
	size: string;															// Used by overlays
	color: string;															// Used by overlays
	opacity: number;														// Used by overlays
	style: 'square' | 'rounded' | 'circle' | null;							// Used by tiles and overlays
}

export interface MapWall {
	id: string;
	pointA: {
		x: number,
		y: number,
		z: number
	};
	pointB: {
		x: number,
		y: number,
		z: number
	};
	display: string;
	blocksLineOfSight: boolean;
	blocksMovement: boolean;
}

export interface MapArea {
	id: string;
	name: string;
	text: string;
	x: number;
	y: number;
	z: number;
	width: number;
	height: number;
	depth: number;
}

export interface Exploration {
	id: string;
	name: string;
	map: Map;
	mapAreaID: string | null;
	partyID: string;
	fog: { x: number, y: number }[];
	lighting: 'bright light' | 'dim light' | 'darkness';
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
	'custom',
	'link'
];
