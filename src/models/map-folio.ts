export interface MapFolio {
    id: string;
    name: string;
    maps: Map[];
}

export interface Map {
    id: string;
    name: string;
    items: MapItem[];
}

export interface MapItem {
    id: string;
    type: 'tile' | 'pc' | 'monster';
    x: number;
    y: number;
    width: number;
    height: number;
    terrain: string | null;
    style: 'square' | 'rounded' | 'circle' | null;
}

export const TERRAIN_TYPES = [
    'cavern',
    'dirt',
    'flagstone',
    'floorboard',
    'grassland',
    'pit',
    'sand',
    'snow',
    'water'
];
