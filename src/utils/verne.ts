// This utility file deals with adventures

import { Plot, Scene } from '../models/adventure';

export class Verne {
	public static getRows(plot: Plot) {
		const rows: Scene[][] = [];

		let unplaced = plot.scenes.slice();
		const placed: Scene[] = [];

		while (unplaced.length > 0) {
			// Find any scenes that only have placed scenes in their immediate upstream
			const scenes = unplaced.filter(scene => {
				// Return true only if each upstream scene is placed
				const upstream = this.getScenesWithLinksTo(plot, [scene.id]);
				return upstream.every(s => placed.includes(s));
			})

			// Add a row of placed scenes
			rows.push(scenes);

			// Update our working lists
			scenes.forEach(s => placed.push(s));
			unplaced = unplaced.filter(s => !placed.includes(s));
		}

		return rows;
	}

	public static getPotentialLinks(plot: Plot, fromScene: Scene) {
		const unavailableIDs: string[] = [];

		// Can't link to anything in the subtree before us
		let tier = [fromScene.id];
		while (tier.length > 0) {
			// Find everything that directly links to anything in tier
			const nextTier = this.getScenesWithLinksTo(plot, tier);

			// Add everything in tier to unavailable
			tier.forEach(id => unavailableIDs.push(id));

			// tier is now everything we found
			tier = nextTier.map(scene => scene.id);
		}

		// Can't link to anything we're already directly linked to
		fromScene.links.forEach(link => unavailableIDs.push(link.sceneID));

		return plot.scenes.filter(scene => !unavailableIDs.includes(scene.id));
	}

	public static getScenesWithLinksTo(plot: Plot, ids: string[]) {
		return plot.scenes.filter(scene => scene.links.some(link => ids.includes(link.sceneID)))
	}

	public static canMoveScene(plot: Plot, scene: Scene, dir: 'left' | 'right') {
		const rows = this.getRows(plot);
		const row = rows.find(r => r.includes(scene));
		if (row) {
			const index = row.indexOf(scene);
			switch (dir) {
				case 'left':
					return index !== 0;
				case 'right':
					return index !== row.length - 1;
			}
		}

		return false;
	}

	public static moveScene(plot: Plot, scene: Scene, dir: 'left' | 'right') {
		if (!this.canMoveScene(plot, scene, dir)) {
			return;
		}

		const rows = this.getRows(plot);
		const row = rows.find(r => r.includes(scene));
		if (row) {
			const index = row.indexOf(scene);
			let otherScene = null;
			switch (dir) {
				case 'left':
					otherScene = row[index - 1];
					break;
				case 'right':
					otherScene = row[index + 1];
					break;
			}
			if (otherScene) {
				const sceneIndex = plot.scenes.indexOf(scene);
				const otherSceneIndex = plot.scenes.indexOf(otherScene);
				plot.scenes[otherSceneIndex] = scene;
				plot.scenes[sceneIndex] = otherScene;
			}
		}
	}
}
