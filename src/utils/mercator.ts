import Factory from './factory';
import Utils from './utils';

import { Combat, Combatant } from '../models/combat';
import { Map } from '../models/map-folio';

export default class Mercator {
    public static scatterCombatants(combat: Combat) {
        if (!combat.map) {
            return;
        }

        // Remove all monsters from the map
        combat.map.items = combat.map.items.filter(item => item.type !== 'monster');

        // Find map dimensions
        const tiles = combat.map.items.filter(item => item.type === 'tile');
        if (tiles.length > 0) {
            const dimensions = Mercator.mapDimensions(combat.map);
            if (dimensions) {
                const monsters = combat.combatants.filter(combatant => combatant.type === 'monster');
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
                        item.type = 'monster';
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

    private static mapDimensions(map: Map) {
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

    private static canAddMonsterHere(map: Map, combatant: Combatant, x: number, y: number) {
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
}
