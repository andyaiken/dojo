// This utility file deals with images

import Utils from './utils';

import { Combat } from '../models/combat';
import { Exploration, Map } from '../models/map';
import { SavedImage } from '../models/misc';

export default class Matisse {
	public static allImages() {
		const images: SavedImage[] = [];
		for (let n = 0; n !== window.localStorage.length; ++n) {
			const key = window.localStorage.key(n);
			if (key && key.startsWith('image-')) {
				const data = window.localStorage.getItem(key);
				if (data) {
					const img = JSON.parse(data);
					images.push({
						id: img.id,
						name: img.name,
						data: img.data
					});
				}
			}
		}

		return Utils.sort(images, [{ field: 'name', dir: 'asc'}]) as SavedImage[];
	}

	public static getImage(id: string) {
		let image: SavedImage | null = null;

		const data = window.localStorage.getItem('image-' + id);
		if (data) {
			const img = JSON.parse(data);
			image = {
				id: img.id,
				name: img.name,
				data: img.data
			};
		}

		return image;
	}

	public static saveImage(id: string, name: string, data: string) {
		const key = 'image-' + id;
		if (window.localStorage.getItem(key) === null) {
			const image = {
				id: id,
				name: name,
				data: data
			};
			window.localStorage.setItem(key, JSON.stringify(image));
		}
	}

	public static clearUnusedImages(maps: Map[], combats: Combat[], explorations: Exploration[]) {
		const images = Matisse.allImages();
		images.forEach(img => {
			// Work out if the image is used in a map tile
			let used = false;
			maps.forEach(map => {
				if (map.items.find(mi => mi.customBackground === img.id)) {
					used = true;
				}
			});
			combats.forEach(combat => {
				if (combat.map && combat.map.items.find(mi => mi.customBackground === img.id)) {
					used = true;
				}
			});
			explorations.forEach(exploration => {
				if (exploration.map.items.find(mi => mi.customBackground === img.id)) {
					used = true;
				}
			});

			if (!used) {
				window.localStorage.removeItem('image-' + img.id);
			}
		});
	}
}
