// This utility file deals with maps

import { Factory } from './factory';
import { Gygax } from './gygax';
import { Shakespeare } from './shakespeare';
import { Utils } from './utils';

import { Combatant } from '../models/combat';
import { DOORWAY_TYPES, Map, MapArea, MapItem } from '../models/map';

export class Mercator {
	public static scatterCombatants(map: Map, combatants: Combatant[], areaID: string | null) {
		// Remove these combatants from the map
		map.items = map.items.filter(item => !combatants.map(c => c.id).includes(item.id));

		// Find map dimensions
		const tiles = map.items.filter(item => item.type === 'tile');
		if (tiles.length > 0) {
			let areaDimensions: {
				minX: number;
				minY: number;
				maxX: number;
				maxY: number;
			} | null = null;
			if (areaID) {
				const area = map.areas.find(a => a.id === areaID);
				if (area) {
					areaDimensions = {
						minX: area.x,
						minY: area.y,
						maxX: area.x + area.width - 1,
						maxY: area.y + area.height - 1
					};
				}
			}
			const dimensions = areaDimensions || Mercator.mapDimensions(map.items);
			if (dimensions) {
				combatants.forEach(combatant => {
					const candidateSquares: {x: number, y: number}[] = [];

					// Find all squares that we could add this monster to
					for (let x = dimensions.minX; x <= dimensions.maxX; ++x) {
						for (let y = dimensions.minY; y <= dimensions.maxY; ++y) {
							// Could we add this monster to this square?
							const canAddHere = Mercator.canAddMonsterHere(map, combatant, x, y);
							if (canAddHere) {
								candidateSquares.push({x: x, y: y});
							}
						}
					}

					if (candidateSquares.length > 0) {
						const index = Utils.randomNumber(candidateSquares.length);
						const square = candidateSquares[index];
						const size = Gygax.miniSize(combatant.displaySize);

						const item = Factory.createMapItem();
						item.id = combatant.id;
						item.type = combatant.type as ('pc' | 'monster' | 'companion');
						item.x = square.x;
						item.y = square.y;
						item.height = size;
						item.width = size;
						map.items.push(item);
					}
				});
			}
		}
	}

	public static mapDimensions(items: MapItem[]) {
		const tiles = items.filter(item => item.type === 'tile');
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

	public static calculateDistance(item: MapItem, x: number, y: number) {
		let dx = 0;
		if ((item.x) > x) {
			dx = item.x - x;
		}
		if ((item.x + item.width - 1) < x) {
			dx = x - (item.x + item.width - 1);
		}
		let dy = 0;
		if (item.y > y) {
			dy = item.y - y;
		}
		if ((item.y + item.height - 1) < y) {
			dy = y - (item.y + item.height - 1);
		}
		return Math.ceil(Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))) * 5;
	}

	public static canAddTileHere(map: Map, x: number, y: number, width: number, height: number, minGapX: number, minGapY: number) {
		const coveredSquares: boolean[] = [];

		const left = x - minGapX;
		const top = y - minGapY;
		const right = x + (width - 1) + minGapX;
		const bottom = y + (height - 1) + minGapY;
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

		const size = Gygax.miniSize(combatant.displaySize);
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

		map.areas.forEach(area => {
			const newX = (area.y + area.height - 1) * -1;
			const newY = area.x;
			const newWidth = area.height;
			const newHeight = area.width;

			area.x = newX;
			area.y = newY;
			area.width = newWidth;
			area.height = newHeight;
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
		room.width = Gygax.dieRoll(6, 2) + 2;
		room.height = Gygax.dieRoll(6, 2) + 2;

		let extra = null;

		const dimensions = Mercator.mapDimensions(map.items);
		if (dimensions) {
			// Try to find a place we can add this tile
			const minGap = 1;
			const maxGap = 2;
			dimensions.minX -= (room.width + maxGap);
			dimensions.minY -= (room.height + maxGap);
			dimensions.maxX += maxGap;
			dimensions.maxY += maxGap;
			const candidates = [];
			for (let x = dimensions.minX; x !== dimensions.maxX; ++x) {
				for (let y = dimensions.minY; y !== dimensions.maxY; ++y) {
					const canAdd = Mercator.canAddTileHere(map, x, y, room.width, room.height, minGap, minGap);
					if (canAdd) {
						candidates.push({ x: x, y: y });
					}
				}
			}
			if (candidates.length > 0) {
				const index = Utils.randomNumber(candidates.length);
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
						if (Mercator.canAddTileHere(map, corridor.x, corridor.y, corridor.width, corridor.height, 1, 0)) {
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
						if (Mercator.canAddTileHere(map, corridor.x, corridor.y, corridor.width, corridor.height, 0, 1)) {
							corridors.push({ tile: corridor, horizontal: true });
						}
					}
				}
			});

			if (corridors.length > 0) {
				const index = Utils.randomNumber(corridors.length);
				const corridor = corridors[index];

				if ((!corridor.horizontal && (corridor.tile.height === 1)) || (corridor.horizontal && (corridor.tile.width === 1))) {
					if (Gygax.dieRoll(2) === 2) {
						corridor.tile.content = {
							type: 'doorway',
							style: Mercator.getRandomDoorwayStyle(),
							orientation: corridor.horizontal ? 'vertical' : 'horizontal'
						};
					}
				} else {
					if ((!corridor.horizontal && (corridor.tile.height >= 4)) || (corridor.horizontal && (corridor.tile.width >= 4))) {
						if (Gygax.dieRoll(2) === 2) {
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
						if (Gygax.dieRoll(2) === 2) {
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
						if (Gygax.dieRoll(3) === 3) {
							corridor.tile.content = {
								type: 'stairway',
								style: 'stairs',
								orientation: corridor.horizontal ? 'vertical' : 'horizontal'
							};
						}
					}
				}

				extra = this.getRoomAdjunct(room, map);
				map.items.push(corridor.tile);
				map.items.push(room);
				if (extra) {
					map.items.push(extra);
				}
			} else {
				return false;
			}
		} else {
			extra = this.getRoomAdjunct(room, map);
			map.items.push(room);
			if (extra) {
				map.items.push(extra);
			}
		}

		const roomTiles = [room];
		if (extra) {
			roomTiles.push(extra);
		}
		const roomDims = this.mapDimensions(roomTiles);
		if (roomDims) {
			const area = Factory.createMapArea();
			area.name = Shakespeare.capitalise(Shakespeare.generateRoomName());
			area.x = roomDims.minX - 1;
			area.y = roomDims.minY - 1;
			area.width = (roomDims.maxX - roomDims.minX) + 3;
			area.height = (roomDims.maxY - roomDims.minY) + 3;
			map.areas.push(area);
		}

		return true;
	}

	private static getRoomAdjunct(room: MapItem, map: Map) {
		if (Utils.randomBoolean()) {
			return null;
		}

		let width = 0;
		let height = 0;
		const candidates = [];
		switch (Utils.randomNumber(2)) {
			case 0:
				// Top or bottom
				width = Utils.randomNumber(room.width - 2) + 2;
				height = Gygax.dieRoll(4, 2);
				const diffX = room.width - width;
				for (let dx = 0; dx !== diffX; ++dx) {
					const x = room.x + dx;
					// Can we put this on the top?
					const y1 = room.y - height;
					if (Mercator.canAddTileHere(map, x, y1, width, height, 1, 1)) {
						candidates.push({ x: x, y: y1 });
					}
					// Can we put this on the bottom?
					const y2 = room.y + room.height;
					if (Mercator.canAddTileHere(map, x, y2, width, height, 1, 1)) {
						candidates.push({ x: x, y: y2 });
					}
				}
				break;
			case 1:
				// Left or right
				width = Gygax.dieRoll(4, 2);
				height = Utils.randomNumber(room.height - 2) + 2;
				const diffY = room.height - height;
				for (let dy = 0; dy !== diffY; ++dy) {
					const y = room.y + dy;
					// Can we put this on the left?
					const x1 = room.x - width;
					if (Mercator.canAddTileHere(map, x1, y, width, height, 1, 1)) {
						candidates.push({ x: x1, y: y });
					}
					// Can we put this on the right?
					const x2 = room.x + room.width;
					if (Mercator.canAddTileHere(map, x2, y, width, height, 1, 1)) {
						candidates.push({ x: x2, y: y });
					}
				}
				break;
		}
		if (candidates.length > 0) {
			const index = Utils.randomNumber(candidates.length);
			const selected = candidates[index];

			const extra = Factory.createMapItem();
			extra.type = 'tile';
			extra.terrain = 'default';
			extra.style = 'square';
			extra.x = selected.x;
			extra.y = selected.y;
			extra.width = width;
			extra.height = height;

			return extra;
		}

		return null;
	}

	private static getRandomDoorwayStyle() {
		const index = Utils.randomNumber(DOORWAY_TYPES.length);
		return DOORWAY_TYPES[index];
	}

	public static getViewport(map: Map, areaID: string | null) {
		if (areaID) {
			const area = map.areas.find(a => a.id === areaID);
			if (area) {
				return {
					minX: area.x,
					minY: area.y,
					maxX: area.x + area.width - 1,
					maxY: area.y + area.height - 1
				};
			}
		}

		return null;
	}

	public static add(map: Map, combatant: Combatant, x: number, y: number) {
		let item = map.items.find(mi => mi.id === combatant.id);
		if (!item) {
			item = Factory.createMapItem();
			item.id = combatant.id;
			item.type = combatant.type as 'pc' | 'monster' | 'companion';

			const size = Gygax.miniSize(combatant.displaySize);
			item.height = size;
			item.width = size;

			map.items.push(item);
		}

		item.x = x;
		item.y = y;
	}

	public static move(map: Map, id: string, dir: string, step: number) {
		let item: MapItem | MapArea | null = null;
		item = map.items.find(i => i.id === id) || null;
		if (!item) {
			item = map.areas.find(a => a.id === id) || null;
		}

		if (item) {
			switch (dir) {
				case 'N':
					item.y -= step;
					break;
				case 'NE':
					item.x += step;
					item.y -= step;
					break;
				case 'E':
					item.x += step;
					break;
				case 'SE':
					item.x += step;
					item.y += step;
					break;
				case 'S':
					item.y += step;
					break;
				case 'SW':
					item.x -= step;
					item.y += step;
					break;
				case 'W':
					item.x -= step;
					break;
				case 'NW':
					item.x -= step;
					item.y -= step;
					break;
			}
		}
	}

	public static remove(map: Map, id: string) {
		const item = map.items.find(i => i.id === id);
		if (item) {
			const index = map.items.indexOf(item);
			map.items.splice(index, 1);
		}
	}
}
