// This utility file deals with images

import html2canvas from 'html2canvas';

import { Utils } from './utils';
import { Verne } from './verne';

import { Adventure } from '../models/adventure';
import { Combat } from '../models/combat';
import { Exploration, Map } from '../models/map';
import { SavedImage } from '../models/misc';

export class Matisse {
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

	public static clearUnusedImages(maps: Map[], adventures: Adventure[], combats: Combat[], explorations: Exploration[]) {
		const images = Matisse.allImages();
		images.forEach(img => {
			let used = false;

			maps.forEach(map => {
				if (map.items.find(mi => mi.customBackground === img.id)) {
					used = true;
				}
			});

			adventures.forEach(adventure => {
				if (adventure.plot.map !== null) {
					if (adventure.plot.map.items.find(mi => mi.customBackground === img.id)) {
						used = true;
					}
				}
				Verne.getScenes(adventure.plot).forEach(scene => {
					if (scene.plot.map) {
						if (scene.plot.map.items.find(mi => mi.customBackground === img.id)) {
							used = true;
						}
					}
					scene.resources.forEach(resource => {
						if ((resource.type === 'image') && (resource.content === img.id)) {
							used = true;
						}
					});
				});
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

	public static takeScreenshot(elementID: string) {
		const element = document.getElementById(elementID);
		if (element) {
			html2canvas(element).then(canvas => Utils.saveImage('image.png', canvas));
		}
	}
}
