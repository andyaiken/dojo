// This utility file deals with maps

import Factory from './factory';
import Utils from './utils';

import { Combat, Combatant } from '../models/combat';
import { DOORWAY_TYPES, Map, MapItem } from '../models/map';

export default class Mercator {
    public static scatterCombatants(combat: Combat, type: 'pc' | 'monster') {
        if (!combat.map) {
            return;
        }

        // Remove all monsters from the map
        combat.map.items = combat.map.items.filter(item => item.type !== type);

        // Find map dimensions
        const tiles = combat.map.items.filter(item => item.type === 'tile');
        if (tiles.length > 0) {
            const dimensions = Mercator.mapDimensions(combat.map);
            if (dimensions) {
                const monsters = combat.combatants.filter(combatant => combatant.type === type);
                monsters.forEach(combatant => {
                    const candidateSquares: {x: number, y: number}[] = [];

                    // Find all squares that we could add this monster to
                    for (let x = dimensions.minX; x <= dimensions.maxX; ++x) {
                        for (let y = dimensions.minY; y <= dimensions.maxY; ++y) {
                            // Could we add this monster to this square?
                            const canAddHere = Mercator.canAddMonsterHere(combat.map as Map, combatant, x, y);
                            if (canAddHere) {
                                candidateSquares.push({x: x, y: y});
                            }
                        }
                    }

                    if ((candidateSquares.length > 0) && combat.map) {
                        const index = Math.floor(Math.random() * candidateSquares.length);
                        const square = candidateSquares[index];
                        const size = Utils.miniSize(combatant.displaySize);

                        const item = Factory.createMapItem();
                        item.id = combatant.id;
                        item.type = type;
                        item.x = square.x;
                        item.y = square.y;
                        item.height = size;
                        item.width = size;
                        combat.map.items.push(item);
                    }
                });
            }
        }
    }

    public static mapDimensions(map: Map) {
        const tiles = map.items.filter(item => item.type === 'tile');
        if (tiles.length > 0) {
            let minX: number = tiles[0].x;
            let minY: number = tiles[0].y;
            let maxX: number = tiles[0].x + tiles[0].width - 1;
            let maxY: number = tiles[0].y + tiles[0].height - 1;
            tiles.forEach(tile => {
                minX = Math.min(minX, tile.x);
                minY = Math.min(minY, tile.y);
                maxX = Math.max(maxX, tile.x + tile.width - 1);
                maxY = Math.max(maxY, tile.y + tile.height - 1);
            });

            return {
                minX: minX,
                minY: minY,
                maxX: maxX,
                maxY: maxY
            };
        } else {
            return null;
        }
    }

    public static canAddTileHere(map: Map, tile: MapItem, x: number, y: number, minGapX: number, minGapY: number) {
        const coveredSquares: boolean[] = [];

        const left = x - minGapX;
        const top = y - minGapY;
        const right = x + (tile.width - 1) + minGapX;
        const bottom = y + (tile.height - 1) + minGapY;
        for (let x1 = left; x1 <= right; ++x1) {
            for (let y1 = top; y1 <= bottom; ++y1) {
                // Is this square free of tiles?
                const occupants = Mercator.itemsAt(map as Map, x1, y1);
                const canOccupy = occupants.every(item => item.type !== 'tile');
                coveredSquares.push(canOccupy);
            }
        }

        return coveredSquares.every(square => square);
    }

    public static canAddMonsterHere(map: Map, combatant: Combatant, x: number, y: number) {
        const coveredSquares: boolean[] = [];

        const size = Utils.miniSize(combatant.displaySize);
        const right = x + Math.max(1, size) - 1;
        const bottom = y + Math.max(1, size) - 1;
        for (let x1 = x; x1 <= right; ++x1) {
            for (let y1 = y; y1 <= bottom; ++y1) {
                // Is this square on an empty tile?
                const occupants = Mercator.itemsAt(map as Map, x1, y1);
                const canOccupy = (occupants.length > 0) && occupants.every(item => item.type === 'tile');
                coveredSquares.push(canOccupy);
            }
        }

        return coveredSquares.every(square => square);
    }

    private static itemsAt(map: Map, x: number, y: number) {
        return map.items.filter(item => {
            const left = item.x;
            const right = item.x + item.width - 1;
            const top = item.y;
            const bottom = item.y + item.height - 1;
            return (x >= left) && (x <= right) && (y >= top) && (y <= bottom);
        });
    }

    public static rotateMap(map: Map) {
        map.items.forEach(item => {
            const newX = (item.y + item.height - 1) * -1;
            const newY = item.x;
            const newWidth = item.height;
            const newHeight = item.width;

            item.x = newX;
            item.y = newY;
            item.width = newWidth;
            item.height = newHeight;

            if (item.content) {
                item.content.orientation = item.content.orientation === 'horizontal' ? 'vertical' : 'horizontal';
            }
        });
    }

    public static mapSize(map: Map) {
        return map.items
            .filter(item => item.type === 'tile')
            .reduce((sum, item) => sum + Mercator.mapTileSize(item), 0);
    }

    public static mapTileSize(tile: MapItem) {
        if (tile.type === 'tile') {
            return tile.width * tile.height;
        }

        return 0;
    }

    public static getNote(map: Map, item: MapItem) {
        return map.notes.find(n => n.targetID === item.id) || null;
    }

    public static generate(type: string, map: Map) {
        switch (type) {
            case 'dungeon':
                let dungeonRooms = 0;
                while (dungeonRooms < 10) {
                    if (Mercator.addRoom(map)) {
                        dungeonRooms += 1;
                    }
                }
                break;
            case 'delve':
                let delveRooms = 0;
                while (delveRooms < 3) {
                    if (Mercator.addRoom(map)) {
                        delveRooms += 1;
                    }
                }
                break;
            case 'room':
                let added = false;
                while (!added) {
                    added = Mercator.addRoom(map);
                }
                break;
        }
    }

    public static addRoom(map: Map) {
        const room = Factory.createMapItem();
        room.type = 'tile';
        room.terrain = 'default';
        room.style = 'square';
        room.width = Utils.dieRoll(4, 2) + 2;
        room.height = Utils.dieRoll(4, 2) + 2;

        const dimensions = Mercator.mapDimensions(map);
        if (dimensions) {
            // Try to find a place we can add this tile
            const minGap = 1;
            const maxGap = 10;
            dimensions.minX -= (room.width + maxGap);
            dimensions.minY -= (room.height + maxGap);
            dimensions.maxX += maxGap;
            dimensions.maxY += maxGap;
            const candidates = [];
            for (let x = dimensions.minX; x !== dimensions.maxX; ++x) {
                for (let y = dimensions.minY; y !== dimensions.maxY; ++y) {
                    const canAdd = Mercator.canAddTileHere(map, room, x, y, minGap, minGap);
                    if (canAdd) {
                        candidates.push({ x: x, y: y });
                    }
                }
            }
            if (candidates.length > 0) {
                const index = Math.floor(Math.random() * candidates.length);
                room.x = candidates[index].x;
                room.y = candidates[index].y;
            } else {
                return false;
            }

            // Try to add a straight corridor to another tile
            const corridors: { tile: MapItem, horizontal: boolean }[] = [];
            map.items.filter(i => i.type === 'tile').forEach(tile => {
                // Find possible straight vertical corridors joining these two tiles
                const minX = Math.max(room.x, tile.x);
                const maxX = Math.min((room.x + room.width - 1), (tile.x + tile.width - 1));
                const overlapX = maxX - minX + 1;
                if (overlapX >= 2) {
                    const corridorTop = Math.min((room.y + room.height - 1), (tile.y + tile.height - 1)) + 1;
                    const corridorBottom = Math.max(room.y, tile.y) - 1;
                    for (let x = minX; x <= maxX - 1; ++x) {
                        const corridor = Factory.createMapItem();
                        corridor.type = 'tile';
                        corridor.terrain = 'default';
                        corridor.style = 'square';
                        corridor.x = x;
                        corridor.y = corridorTop;
                        corridor.width = 2;
                        corridor.height = corridorBottom - corridorTop + 1;
                        if (Mercator.canAddTileHere(map, corridor, corridor.x, corridor.y, 1, 0)) {
                            corridors.push({ tile: corridor, horizontal: false });
                        }
                    }
                }

                // Find possible straight horizontal corridors joining these two tiles
                const minY = Math.max(room.y, tile.y);
                const maxY = Math.min((room.y + room.height - 1), (tile.y + tile.height - 1));
                const overlapY = maxY - minY + 1;
                if (overlapY >= 2) {
                    const corridorLeft = Math.min((room.x + room.width - 1), (tile.x + tile.width - 1)) + 1;
                    const corridorRight = Math.max(room.x, tile.x) - 1;
                    for (let y = minY; y <= maxY - 1; ++y) {
                        const corridor = Factory.createMapItem();
                        corridor.type = 'tile';
                        corridor.terrain = 'default';
                        corridor.style = 'square';
                        corridor.x = corridorLeft;
                        corridor.y = y;
                        corridor.width = corridorRight - corridorLeft + 1;
                        corridor.height = 2;
                        if (Mercator.canAddTileHere(map, corridor, corridor.x, corridor.y, 0, 1)) {
                            corridors.push({ tile: corridor, horizontal: true });
                        }
                    }
                }
            });

            if (corridors.length > 0) {
                const index = Math.floor(Math.random() * corridors.length);
                const corridor = corridors[index];

                if ((!corridor.horizontal && (corridor.tile.height === 1)) || (corridor.horizontal && (corridor.tile.width === 1))) {
                    if (Utils.dieRoll(2) === 2) {
                        corridor.tile.content = {
                            type: 'doorway',
                            style: Mercator.getRandomDoorwayStyle(),
                            orientation: corridor.horizontal ? 'vertical' : 'horizontal'
                        };
                    }
                } else {
                    if ((!corridor.horizontal && (corridor.tile.height >= 4)) || (corridor.horizontal && (corridor.tile.width >= 4))) {
                        if (Utils.dieRoll(2) === 2) {
                            const door = Factory.createMapItem();
                            door.type = 'tile';
                            door.terrain = 'default';
                            door.style = 'square';
                            door.content = {
                                type: 'doorway',
                                style: Mercator.getRandomDoorwayStyle(),
                                orientation: ''
                            };
                            if (corridor.horizontal) {
                                door.x = corridor.tile.x;
                                door.y = corridor.tile.y;
                                door.width = 1;
                                door.height = 2;
                                door.content.orientation = 'vertical';
                                corridor.tile.x += 1;
                                corridor.tile.width -= 1;
                            } else {
                                door.x = corridor.tile.x;
                                door.y = corridor.tile.y;
                                door.width = 2;
                                door.height = 1;
                                door.content.orientation = 'horizontal';
                                corridor.tile.y += 1;
                                corridor.tile.height -= 1;
                            }
                            map.items.push(door);
                        }
                        if (Utils.dieRoll(2) === 2) {
                            const door = Factory.createMapItem();
                            door.type = 'tile';
                            door.terrain = 'default';
                            door.style = 'square';
                            door.content = {
                                type: 'doorway',
                                style: Mercator.getRandomDoorwayStyle(),
                                orientation: ''
                            };
                            if (corridor.horizontal) {
                                door.x = corridor.tile.x + corridor.tile.width - 1;
                                door.y = corridor.tile.y;
                                door.width = 1;
                                door.height = 2;
                                door.content.orientation = 'vertical';
                                corridor.tile.width -= 1;
                            } else {
                                door.x = corridor.tile.x;
                                door.y = corridor.tile.y + corridor.tile.height - 1;
                                door.width = 2;
                                door.height = 1;
                                door.content.orientation = 'horizontal';
                                corridor.tile.height -= 1;
                            }
                            map.items.push(door);
                        }
                    }

                    if ((!corridor.horizontal && (corridor.tile.height <= 4)) || (corridor.horizontal && (corridor.tile.width <= 4))) {
                        if (Utils.dieRoll(3) === 3) {
                            corridor.tile.content = {
                                type: 'stairway',
                                style: 'stairs',
                                orientation: corridor.horizontal ? 'vertical' : 'horizontal'
                            };
                        }
                    }
                }

                map.items.push(corridor.tile);

                map.items.push(room);
            } else {
                return false;
            }
        } else {
            map.items.push(room);
        }

        // TODO: Maybe add a second or third adjacent tile

        return true;
    }

    private static getRandomDoorwayStyle() {
        const index = Math.floor(Math.random() * DOORWAY_TYPES.length);
        return DOORWAY_TYPES[index];
    }
}
