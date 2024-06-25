// This utility file deals with search

import { Adventure, Plot, Scene } from '../models/adventure';
import { Encounter, EncounterSlot, EncounterWave } from '../models/encounter';
import { Map, MapArea } from '../models/map';
import { Monster, MonsterGroup, Trait } from '../models/monster';
import { Companion, Party, PC } from '../models/party';

export class Sherlock {
	public static matchParty(filter: string, party: Party) {
		if (Sherlock.match(filter, party.name)) {
			return true;
		}

		return party.pcs.some(pc => Sherlock.matchPC(filter, pc));
	}

	public static matchPC(filter: string, pc: PC) {
		if (Sherlock.match(filter, pc.name)) {
			return true;
		}

		if (Sherlock.match(filter, pc.player)) {
			return true;
		}

		if (Sherlock.match(filter, pc.race)) {
			return true;
		}

		if (Sherlock.match(filter, pc.classes)) {
			return true;
		}

		return pc.companions.some(companion => Sherlock.matchCompanion(filter, companion));
	}

	public static matchCompanion(filter: string, companion: Companion) {
		if (Sherlock.match(filter, companion.name)) {
			return true;
		}

		return false;
	}

	public static matchGroup(filter: string, group: MonsterGroup) {
		if (Sherlock.match(filter, group.name)) {
			return true;
		}

		return group.monsters.some(monster => Sherlock.matchMonster(filter, monster));
	}

	public static matchMonster(filter: string, monster: Monster) {
		if (Sherlock.match(filter, monster.name)) {
			return true;
		}

		if (Sherlock.match(filter, monster.category)) {
			return true;
		}

		if (Sherlock.match(filter, monster.tag)) {
			return true;
		}

		if (Sherlock.match(filter, monster.senses)) {
			return true;
		}

		if (Sherlock.match(filter, monster.languages)) {
			return true;
		}

		return monster.traits.some(trait => Sherlock.matchTrait(filter, trait));
	}

	public static matchTrait(filter: string, trait: Trait) {
		if (Sherlock.match(filter, trait.name)) {
			return true;
		}

		if (Sherlock.match(filter, trait.usage)) {
			return true;
		}

		if (Sherlock.match(filter, trait.text)) {
			return true;
		}

		return false;
	}

	public static matchEncounter(filter: string, encounter: Encounter, getMonster: (id: string) => Monster | null) {
		if (Sherlock.match(filter, encounter.name)) {
			return true;
		}

		if (encounter.waves.some(wave => Sherlock.matchEncounterWave(filter, wave, id => getMonster(id)))) {
			return true;
		}

		return encounter.slots.some(slot => Sherlock.matchEncounterSlot(filter, slot, id => getMonster(id)));
	}

	public static matchEncounterWave(filter: string, wave: EncounterWave, getMonster: (id: string) => Monster | null) {
		if (Sherlock.match(filter, wave.name)) {
			return true;
		}

		return wave.slots.some(slot => Sherlock.matchEncounterSlot(filter, slot, id => getMonster(id)));
	}

	public static matchEncounterSlot(filter: string, slot: EncounterSlot, getMonster: (id: string) => Monster | null) {
		const monster = getMonster(slot.monsterID);
		if (monster && Sherlock.match(filter, monster.name)) {
			return true;
		}

		return false;
	}

	public static matchMap(filter: string, map: Map) {
		if (Sherlock.match(filter, map.name)) {
			return true;
		}

		return map.areas.some(area => Sherlock.matchMapArea(filter, area));
	}

	public static matchMapArea(filter: string, area: MapArea) {
		if (Sherlock.match(filter, area.name)) {
			return true;
		}

		if (Sherlock.match(filter, area.text)) {
			return true;
		}

		return false;
	}

	public static matchAdventure(filter: string, adventure: Adventure) {
		if (Sherlock.match(filter, adventure.name)) {
			return true;
		}

		if (Sherlock.matchPlot(filter, adventure.plot)) {
			return true;
		}

		return false;
	}

	public static matchPlot(filter: string, plot: Plot) {
		if (plot.scenes.some(scene => Sherlock.matchScene(filter, scene))) {
			return true;
		}

		return false;
	}

	public static matchScene(filter: string, scene: Scene) {
		if (Sherlock.match(filter, scene.name)) {
			return true;
		}

		if (Sherlock.match(filter, scene.content)) {
			return true;
		}

		if (scene.links.some(link => Sherlock.match(filter, link.text))) {
			return true;
		}

		if (Sherlock.matchPlot(filter, scene.plot)) {
			return true;
		}

		return false;
	}

	public static match(filter: string, text: string): boolean {
		if (!filter) {
			return true;
		}

		let result = true;

		const tokens = filter.toLowerCase().split(' ');
		tokens.forEach(token => {
			if (text.toLowerCase().indexOf(token) === -1) {
				result = false;
			}
		});

		return result;
	}
}
