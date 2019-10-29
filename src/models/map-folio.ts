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
    type: 'tile' | 'pc' | 'monster' | 'overlay' | 'token';
    x: number;
    y: number;
    width: number;
    height: number;
    terrain: string;                                // Used by tiles
    customBackground: string;                       // Used by tiles
    color: string;                                  // Used by overlays
    opacity: number;                                // Used by overlays
    style: 'square' | 'rounded' | 'circle' | null;  // Used by tiles and overlays
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
    'water',
    'custom'
];
