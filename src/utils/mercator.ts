// This utility file deals with maps

import { Factory } from './factory';
import { Gygax } from './gygax';
import { Napoleon } from './napoleon';
import { Shakespeare } from './shakespeare';
import { Utils } from './utils';

import { Combatant } from '../models/combat';
import { Map, MapArea, MapItem, MapWall } from '../models/map';

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
			const dimensions = areaDimensions || this.mapDimensions(map.items);
			if (dimensions) {
				combatants.forEach(combatant => {
					const candidateSquares: {x: number, y: number}[] = [];

					// Find all squares that we could add this monster to
					for (let x = dimensions.minX; x <= dimensions.maxX; ++x) {
						for (let y = dimensions.minY; y <= dimensions.maxY; ++y) {
							// Could we add this monster to this square?
							const canAddHere = this.canAddMonsterHere(map, combatant, x, y);
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
						item.z = 0;
						item.height = size;
						item.width = size;
						item.depth = size;
						map.items.push(item);
					}
				});
			}
		}
	}

	public static moveCombatants(ids: string[], dir: string, combatants: Combatant[], map: Map, step: number) {
		const list = Napoleon.getMountsAndRiders(ids, combatants).map(c => c.id);
		ids.forEach(id => {
			if (!list.includes(id)) {
				list.push(id);
			}
		});
		list.forEach(id => {
			const cube = {
				x: 0,
				y: 0,
				z: 0,
				width: 1,
				height: 1,
				depth: 1
			};

			const item = map.items.find(i => i.id === id);
			if (item) {
				cube.x = item.x;
				cube.y = item.y;
				cube.z = item.z;
				cube.width = item.width;
				cube.height = item.height;
				cube.depth = item.depth;
			}

			const combatant = combatants.find(c => c.id === id);
			if (combatant) {
				const size = Math.max(1, Gygax.miniSize(combatant.displaySize));
				cube.width = size;
				cube.height = size;
				cube.depth = size;
			}

			if (this.canMove(map, cube, dir)) {
				if (item && combatant && combatant.path) {
					combatant.path.push({
						x: item.x,
						y: item.y,
						z: item.z
					});
				}
				this.move(map, id, dir, step);
			}
		});
		Napoleon.setMountPositions(combatants, map);
	}

	public static canMove(map: Map, item: { x: number, y: number, z: number, width: number, height: number, depth: number}, dir: string): boolean {
		const horizontalWalls: { start: number, end: number, y: number }[] = [];
		map.walls
			.filter(w => w.blocksMovement)
			.filter(w => this.getWallOrientation(w) === 'horizontal')
			.map(w => ({
				start: Math.min(w.pointA.x, w.pointB.x),
				end: Math.max(w.pointA.x, w.pointB.x),
				y: w.pointA.y
			}))
			.forEach(section => {
				const before = horizontalWalls.find(s => s.y === section.y && s.end === section.start);
				const after = horizontalWalls.find(s => s.y === section.y && s.start === section.end);
				if (before && after) {
					before.end = after.end;
					horizontalWalls.splice(horizontalWalls.indexOf(after), 1);
				} else if (before) {
					before.end = section.end;
				} else if (after) {
					after.start = section.start;
				} else {
					horizontalWalls.push(section);
				}
			});

		const verticalWalls: { start: number, end: number, x: number }[] = [];
		map.walls
			.filter(w => w.blocksMovement)
			.filter(w => this.getWallOrientation(w) === 'vertical')
			.map(w => ({
				start: Math.min(w.pointA.y, w.pointB.y),
				end: Math.max(w.pointA.y, w.pointB.y),
				x: w.pointA.x
			}))
			.forEach(section => {
				const before = verticalWalls.find(s => s.x === section.x && s.end === section.start);
				const after = verticalWalls.find(s => s.x === section.x && s.start === section.end);
				if (before && after) {
					before.end = after.end;
					verticalWalls.splice(verticalWalls.indexOf(after), 1);
				} else if (before) {
					before.end = section.end;
				} else if (after) {
					after.start = section.start;
				} else {
					verticalWalls.push(section);
				}
			});

		const northWalls = horizontalWalls
			.filter(w => w.y === item.y)
			.filter(w => (w.start <= item.x) && (w.end > item.x + item.width - 1));
		const eastWalls = verticalWalls
			.filter(w => w.x === item.x + item.width)
			.filter(w => (w.start <= item.y) && (w.end > item.y + item.height - 1));
		const southWalls = horizontalWalls
			.filter(w => w.y === item.y + item.height)
			.filter(w => (w.start <= item.x) && (w.end > item.x + item.width - 1));
		const westWalls = verticalWalls
			.filter(w => w.x === item.x)
			.filter(w => (w.start <= item.y) && (w.end > item.y + item.height - 1));

		switch (dir) {
			case 'N':
				return northWalls.length === 0;
			case 'NE':
				return (northWalls.length === 0) && (eastWalls.length === 0);
			case 'E':
				return eastWalls.length === 0;
			case 'SE':
				return (southWalls.length === 0) && (eastWalls.length === 0);
			case 'S':
				return southWalls.length === 0;
			case 'SW':
				return (southWalls.length === 0) && (westWalls.length === 0);
			case 'W':
				return westWalls.length === 0;
			case 'NW':
				return (northWalls.length === 0) && (westWalls.length === 0);
		}

		return true;
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

	public static calculateDistance(item: { x: number, y: number, z: number, width: number, height: number, depth: number}, x: number, y: number, z: number) {
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

		let dz = 0;
		if (item.z > z) {
			dz = item.z - z;
		}
		if ((item.z + item.depth - 1) < z) {
			dz = z - (item.z + item.depth - 1);
		}

		return Math.ceil(Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2))) * 5;
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
				const occupants = this.itemsAt(map as Map, x1, y1);
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
				const occupants = this.itemsAt(map as Map, x1, y1);
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

		map.walls.forEach(wall => {
			const x = Math.min(wall.pointA.x, wall.pointB.x);
			const y = Math.min(wall.pointA.y, wall.pointB.y);
			const width = Math.max(wall.pointA.x, wall.pointB.x) - x + 1;
			const height = Math.max(wall.pointA.y, wall.pointB.y) - y + 1;

			const newX = (y + height - 1) * -1;
			const newY = x;
			const newWidth = height;
			const newHeight = width;

			wall.pointA.x = newX + 1;
			wall.pointA.y = newY;
			wall.pointB.x = newX + newWidth;
			wall.pointB.y = newY + newHeight - 1;
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
			.reduce((sum, item) => sum + this.mapTileSize(item), 0);
	}

	public static mapTileSize(tile: MapItem) {
		if (tile.type === 'tile') {
			return tile.width * tile.height;
		}

		return 0;
	}

	public static generate(areas: number, map: Map) {
		let n = 0;
		while (n < areas) {
			if (this.addRoom(map)) {
				n += 1;
			}
		}

		this.addWalls(map, true, true);
	}

	public static addRoom(map: Map) {
		const room = Factory.createMapItem();
		room.type = 'tile';
		room.terrain = 'default';
		room.style = 'square';
		room.width = Gygax.dieRoll(6, 2) + 2;
		room.height = Gygax.dieRoll(6, 2) + 2;

		let extra = null;

		const dimensions = this.mapDimensions(map.items);
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
					const canAdd = this.canAddTileHere(map, x, y, room.width, room.height, minGap, minGap);
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
						if (this.canAddTileHere(map, corridor.x, corridor.y, corridor.width, corridor.height, 1, 0)) {
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
						if (this.canAddTileHere(map, corridor.x, corridor.y, corridor.width, corridor.height, 0, 1)) {
							corridors.push({ tile: corridor, horizontal: true });
						}
					}
				}
			});

			if (corridors.length > 0) {
				const index = Utils.randomNumber(corridors.length);
				const corridor = corridors[index];

				if ((!corridor.horizontal && (corridor.tile.height <= 4)) || (corridor.horizontal && (corridor.tile.width <= 4))) {
					if (Gygax.dieRoll(3) === 3) {
						corridor.tile.content = {
							type: 'stairway',
							style: 'stairs',
							orientation: corridor.horizontal ? 'vertical' : 'horizontal'
						};
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
					if (this.canAddTileHere(map, x, y1, width, height, 1, 1)) {
						candidates.push({ x: x, y: y1 });
					}
					// Can we put this on the bottom?
					const y2 = room.y + room.height;
					if (this.canAddTileHere(map, x, y2, width, height, 1, 1)) {
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
					if (this.canAddTileHere(map, x1, y, width, height, 1, 1)) {
						candidates.push({ x: x1, y: y });
					}
					// Can we put this on the right?
					const x2 = room.x + room.width;
					if (this.canAddTileHere(map, x2, y, width, height, 1, 1)) {
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
			item.depth = size;

			map.items.push(item);
		} else {
			if (combatant.path) {
				combatant.path.push({
					x: item.x,
					y: item.y,
					z: item.z
				});
			}
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
				case 'UP':
					item.z += step;
					break;
				case 'DOWN':
					item.z -= step;
					break;
			}
		}
	}

	public static moveWall(wall: MapWall, dir: string, step: number) {
		switch (dir) {
			case 'N':
				wall.pointA.y -= step;
				wall.pointB.y -= step;
				break;
			case 'NE':
				wall.pointA.x += step;
				wall.pointA.y -= step;
				wall.pointB.x += step;
				wall.pointB.y -= step;
				break;
			case 'E':
				wall.pointA.x += step;
				wall.pointB.x += step;
				break;
			case 'SE':
				wall.pointA.x += step;
				wall.pointA.y += step;
				wall.pointB.x += step;
				wall.pointB.y += step;
				break;
			case 'S':
				wall.pointA.y += step;
				wall.pointB.y += step;
				break;
			case 'SW':
				wall.pointA.x -= step;
				wall.pointA.y += step;
				wall.pointB.x -= step;
				wall.pointB.y += step;
				break;
			case 'W':
				wall.pointA.x -= step;
				wall.pointB.x -= step;
				break;
			case 'NW':
				wall.pointA.x -= step;
				wall.pointA.y -= step;
				wall.pointB.x -= step;
				wall.pointB.y -= step;
				break;
			case 'UP':
				wall.pointA.z += step;
				wall.pointB.z += step;
				break;
			case 'DOWN':
				wall.pointA.z -= step;
				wall.pointB.z -= step;
				break;
		}
	}

	public static remove(map: Map, id: string) {
		const item = map.items.find(i => i.id === id);
		if (item) {
			const index = map.items.indexOf(item);
			map.items.splice(index, 1);
		}
	}

	public static getDistanceBetweenItems(
		a: { x: number, y: number, z: number, width: number, height: number, depth: number},
		b: { x: number, y: number, z: number, width: number, height: number, depth: number}
	) {
		let min = Number.MAX_VALUE;

		const aMaxX = a.x + Math.max(1, a.width) - 1;
		const aMaxY = a.y + Math.max(1, a.height) - 1;
		const aMaxZ = a.z + Math.max(1, a.depth) - 1;
		const bMaxX = b.x + Math.max(1, b.width) - 1;
		const bMaxY = b.y + Math.max(1, b.height) - 1;
		const bMaxZ = b.z + Math.max(1, b.depth) - 1;

		for (let xa = a.x; xa <= aMaxX; ++xa) {
			for (let ya = a.y; ya <= aMaxY; ++ya) {
				for (let za = a.z; za <= aMaxZ; ++za) {
					for (let xb = b.x; xb <= bMaxX; ++xb) {
						for (let yb = b.y; yb <= bMaxY; ++yb) {
							for (let zb = b.z; zb <= bMaxZ; ++zb) {
								const dx = Math.abs(xa - xb);
								const dy = Math.abs(ya - yb);
								const dz = Math.abs(za - zb);
								const hyp = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2));
								min = Math.min(min, hyp);
							}
						}
					}
				}
			}
		}

		// Return an answer to the nearest half
		return Math.round(min * 2) / 2;
	}

	public static getDistance(i: MapItem, steps: { x: number, y: number, z: number }[], diagonalMode: string) {
		let d = 0;

		const allSteps = steps.filter(step => step !== null).concat([i]);
		let prev: { x: number, y: number, z: number } | null = null;
		allSteps.forEach(step => {
			if (prev) {
				d += this.getStepDistance(prev, step, diagonalMode);
			}
			prev = step;
		});

		return d;
	}

	public static getStepDistance(a: { x: number, y: number, z: number }, b: { x: number, y: number, z: number }, diagonalMode: string) {
		// Make sure we have valid data
		if (!a || !b) {
			return 0;
		}

		const dx = Math.abs(a.x - b.x);
		const dy = Math.abs(a.y - b.y);
		const dz = Math.abs(a.z - b.z);

		const d = Math.max(dx, dy, dz);

		const diagonal = ((dx > 0) && (dy > 0)) || ((dx > 0) && (dz > 0)) || ((dy > 0) && (dz > 0));
		if (diagonal) {
			if (d > 1) {
				// We're jumping to a new square - calculate distance as the crow flies
				const hyp = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2));
				return Math.round(hyp * 2) / 2;
			}

			switch (diagonalMode) {
				case 'one':
					return dx;
				case 'two':
					return dx * 2;
				default:
					return dx * 1.5;
			}
		}

		return d;
	}

	public static getWallOrientation(wall: MapWall) {
		if (wall.pointA.x === wall.pointB.x) {
			return 'vertical';
		} else if (wall.pointA.y === wall.pointB.y) {
			return 'horizontal';
		}

		return '';
	}

	public static getWallLength(wall: MapWall) {
		if (wall.pointA.x === wall.pointB.x) {
			return Math.abs(wall.pointA.y - wall.pointB.y);
		} else if (wall.pointA.y === wall.pointB.y) {
			return Math.abs(wall.pointA.x - wall.pointB.x);
		}

		return 0;
	}

	public static nudgeWallLength(wall: MapWall, delta: number) {
		if (wall.pointA.x === wall.pointB.x) {
			wall.pointB.y += delta;
		} else if (wall.pointA.y === wall.pointB.y) {
			wall.pointB.x += delta;
		}
	}

	public static addWalls(map: Map, addWalls: boolean, addDoors: boolean) {
		const walls: MapWall[] = [];

		const randomDoor = () => {
			const doors = ['door', 'double-door', 'bars'];
			const index = Utils.randomNumber(doors.length);
			return doors[index];
		};

		const addDoor = (xA: number, yA: number, xB: number, yB: number) => {
			const door = Factory.createMapWall();
			door.pointA = { x: xA, y: yA, z: 0 };
			door.pointB = { x: xB, y: yB, z: 0 };
			door.display = randomDoor();
			door.blocksMovement = false;
			if (this.getWallLength(door) <= 2) {
				if (addDoors) {
					walls.push(door);
				}
			}
			return door;
		};

		const tiles = map.items.filter(i => i.type === 'tile');
		tiles.forEach(tile => {
			const top = tile.y;
			const right = tile.x + tile.width - 1;
			const bottom = tile.y + tile.height - 1;
			const left = tile.x;

			let north: number[] = [];
			let east: number[] = [];
			let south: number[] = [];
			let west: number[] = [];
			for (let x = left; x <= right; ++x) {
				north.push(x);
				south.push(x);
			}
			for (let y = top; y <= bottom; ++y) {
				east.push(y);
				west.push(y);
			}

			// Find tiles adjacent to the north edge
			tiles.filter(t => (t.y + t.height - 1 === top - 1) && (t.x <= right) && (t.x + t.width - 1 >= left))
				.forEach(t => {
					const door = addDoor(Math.max(left, t.x), top, Math.min(right + 1, t.x + t.width), top);
					for (let x = door.pointA.x; x < door.pointB.x; ++x) {
						north = north.filter(val => val !== x);
					}
				});

			// Find tiles adjacent to the east edge
			tiles.filter(t => (t.x === right + 1) && (t.y <= bottom) && (t.y + t.height - 1 >= top))
				.forEach(t => {
					const door = addDoor(right + 1, Math.max(top, t.y), right + 1, Math.min(bottom + 1, t.y + t.height));
					for (let y = door.pointA.y; y < door.pointB.y; ++y) {
						east = east.filter(val => val !== y);
					}
				});

			// Find tiles adjacent to the south edge
			tiles.filter(t => (t.y === bottom + 1) && (t.x <= right) && (t.x + t.width - 1 >= left))
				.forEach(t => {
					const door = addDoor(Math.max(left, t.x), bottom + 1, Math.min(right + 1, t.x + t.width), bottom + 1);
					for (let x = door.pointA.x; x < door.pointB.x; ++x) {
						south = south.filter(val => val !== x);
					}
				});

			// Find tiles adjacent to the west edge
			tiles.filter(t => (t.x + t.width - 1 === left - 1) && (t.y <= bottom) && (t.y + t.height - 1 >= top))
				.forEach(t => {
					const door = addDoor(left, Math.max(top, t.y), left, Math.min(bottom + 1, t.y + t.height));
					for (let y = door.pointA.y; y < door.pointB.y; ++y) {
						west = west.filter(val => val !== y);
					}
				});

			if (addWalls) {
				// Add missing walls
				while (north.length > 0) {
					let val = north[0];
					north.splice(0, 1);

					const wall = Factory.createMapWall();
					wall.pointA.x = val;
					wall.pointA.y = top;
					wall.pointB.x = val + 1;
					wall.pointB.y = top;

					while ((north.length > 0) && (north[0] === val + 1)) {
						val = north[0];
						north.splice(0, 1);
						wall.pointB.x += 1;
					}

					walls.push(wall);
				}
				while (east.length > 0) {
					let val = east[0];
					east.splice(0, 1);

					const wall = Factory.createMapWall();
					wall.pointA.x = right + 1;
					wall.pointA.y = val;
					wall.pointB.x = right + 1;
					wall.pointB.y = val + 1;

					while ((east.length > 0) && (east[0] === val + 1)) {
						val = east[0];
						east.splice(0, 1);
						wall.pointB.y += 1;
					}

					walls.push(wall);
				}
				while (south.length > 0) {
					let val = south[0];
					south.splice(0, 1);

					const wall = Factory.createMapWall();
					wall.pointA.x = val;
					wall.pointA.y = bottom + 1;
					wall.pointB.x = val + 1;
					wall.pointB.y = bottom + 1;

					while ((south.length > 0) && (south[0] === val + 1)) {
						val = south[0];
						south.splice(0, 1);
						wall.pointB.x += 1;
					}

					walls.push(wall);
				}
				while (west.length > 0) {
					let val = west[0];
					west.splice(0, 1);

					const wall = Factory.createMapWall();
					wall.pointA.x = left;
					wall.pointA.y = val;
					wall.pointB.x = left;
					wall.pointB.y = val + 1;

					while ((west.length > 0) && (west[0] === val + 1)) {
						val = west[0];
						west.splice(0, 1);
						wall.pointB.y += 1;
					}

					walls.push(wall);
				}
			}
		});

		Utils.distinct(
			walls,
			wall => {
				const w = wall as MapWall;
				const a = w.pointA.x + ',' + w.pointA.y + ',' + w.pointA.z;
				const b = w.pointB.x + ',' + w.pointB.y + ',' + w.pointB.z;
				return a + '-' + b;
			})
			.forEach(wall => map.walls.push(wall));
	}
}
