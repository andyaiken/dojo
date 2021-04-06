import { Utils } from './utils';

import { Adventure, Plot, Scene, SceneLink, SceneResource } from '../models/adventure';
import { Combat, CombatSetup, CombatSlotInfo, CombatSlotMember, Notification } from '../models/combat';
import { Condition, ConditionDurationCombatant, ConditionDurationRounds, ConditionDurationSaves } from '../models/condition';
import { Encounter, EncounterSlot, EncounterWave, MonsterFilter } from '../models/encounter';
import { Exploration, Map, MapArea, MapItem, MapWall } from '../models/map';
import { Monster, MonsterGroup, Trait } from '../models/monster';
import { Award, Companion, Party, PC } from '../models/party';

export class Factory {

	public static createParty(): Party {
		return {
			id: Utils.guid(),
			name: '',
			pcs: [],
			awards: []
		};
	}

	public static createPC(): PC {
		return {
			id: Utils.guid(),
			type: 'pc',
			active: true,
			player: '',
			name: '',
			size: 'medium',
			race: '',
			classes: '',
			level: 1,
			languages: 'Common',
			passiveInsight: 10,
			passiveInvestigation: 10,
			passivePerception: 10,
			darkvision: 0,
			portrait: '',
			url: '',
			companions: [],
			awards: []
		};
	}

	public static createCompanion(): Companion {
		return {
			id: Utils.guid(),
			name: '',
			monsterID: null
		};
	}

	public static createAward(): Award {
		return {
			id: Utils.guid(),
			category: '',
			name: '',
			description: ''
		};
	}

	public static createMonsterGroup(): MonsterGroup {
		return {
			id: Utils.guid(),
			name: '',
			monsters: []
		};
	}

	public static createMonster(): Monster {
		return {
			id: Utils.guid(),
			type: 'monster',
			name: '',
			size: 'medium',
			role: '',
			category: 'humanoid',
			tag: '',
			alignment: '',
			challenge: 1,
			abilityScores: {
				str: 10,
				dex: 10,
				con: 10,
				int: 10,
				wis: 10,
				cha: 10
			},
			ac: 10,
			acInfo: '',
			hitDice: 1,
			damage: {
				resist: '',
				vulnerable: '',
				immune: ''
			},
			savingThrows: '',
			speed: '',
			skills: '',
			senses: '',
			languages: '',
			traits: [],
			conditionImmunities: '',
			portrait: '',
			legendaryActions: 0
		};
	}

	public static createTrait(): Trait {
		return {
			id: Utils.guid(),
			name: '',
			usage: '',
			type: 'action',
			text: '',
			uses: 0
		};
	}

	public static createEncounter(): Encounter {
		return {
			id: Utils.guid(),
			name: '',
			slots: [],
			waves: [],
			notes: ''
		};
	}

	public static createEncounterSlot(): EncounterSlot {
		return {
			id: Utils.guid(),
			monsterID: '',
			monsterThemeID: '',
			roles: [],
			count: 1,
			faction: 'foe'
		};
	}

	public static createEncounterWave(): EncounterWave {
		return {
			id: Utils.guid(),
			name: '',
			slots: []
		};
	}

	public static createMonsterFilter(): MonsterFilter {
		return {
			name: '',
			challengeMin: 0,
			challengeMax: 5,
			category: 'all types',
			size: 'all sizes',
			role: 'all roles'
		};
	}

	public static createMap(): Map {
		return {
			id: Utils.guid(),
			name: '',
			items: [],
			walls: [],
			areas: []
		};
	}

	public static createMapItem(): MapItem {
		return {
			id: Utils.guid(),
			type: 'tile',
			x: 0,
			y: 0,
			z: 0,
			width: 4,
			height: 4,
			depth: 1,
			terrain: '',
			customBackground: '',
			customLink: '',
			content: null,
			size: 'medium',
			color: '',
			opacity: 255,
			style: null
		};
	}

	public static createMapWall(): MapWall {
		return {
			id: Utils.guid(),
			pointA: { x: 0, y: 0, z: 0 },
			pointB: { x: 0, y: 0, z: 0 },
			display: 'wall',
			blocksLineOfSight: true,
			blocksMovement: true
		};
	}

	public static createMapArea(): MapArea {
		return {
			id: Utils.guid(),
			name: '',
			text: '',
			x: 0,
			y: 0,
			z: 0,
			width: 1,
			height: 1,
			depth: 1
		};
	}

	public static createAdventure(): Adventure {
		return {
			id: Utils.guid(),
			name: '',
			plot: this.createPlot()
		};
	}

	public static createPlot(): Plot {
		return {
			id: Utils.guid(),
			scenes: [],
			map: null
		};
	}

	public static createScene(): Scene {
		return {
			id: Utils.guid(),
			name: '',
			content: '',
			tags: [],
			links: [],
			plot: this.createPlot(),
			resources: []
		};
	}

	public static createSceneLink(): SceneLink {
		return {
			id: Utils.guid(),
			text: '',
			sceneID: ''
		};
	}

	public static createSceneResource(): SceneResource {
		return {
			id: Utils.guid(),
			name: '',
			type: 'text',
			content: '',
			data: null
		};
	}

	public static createExploration(): Exploration {
		return {
			id: Utils.guid(),
			name: '',
			map: this.createMap(),
			mapAreaID: null,
			partyID: '',
			fog: [],
			lighting: 'bright light',
			combatants: []
		};
	}

	public static createCombatSetup(): CombatSetup {
		return {
			party: null,
			encounter: null,
			waveID: null,
			map: null,
			mapAreaID: null,
			fog: [],
			lighting: 'bright light',
			combatants: [],
			slotInfo: []
		};
	}

	public static createCombatSlotInfo(): CombatSlotInfo {
		return {
			id: '',
			monsterID: '',
			useGroupHP: true,
			useGroupInit: true,
			hp: 0,
			init: 0,
			members: []
		};
	}

	public static createCombatSlotMember(): CombatSlotMember {
		return {
			id: Utils.guid(),
			name: '',
			hp: 0,
			init: 0,
			location: null
		};
	}

	public static createCombat(): Combat {
		return {
			id: Utils.guid(),
			name: '',
			encounter: Factory.createEncounter(),
			combatants: [],
			map: null,
			mapAreaID: null,
			fog: [],
			lighting: 'bright light',
			round: 1
		};
	}

	public static createNotification(): Notification {
		return {
			id: Utils.guid(),
			type: 'condition-save',
			data: null,
			combatant: null
		};
	}

	public static createCondition(): Condition {
		return {
			id: Utils.guid(),
			name: '',
			level: 1,
			text: '',
			duration: null
		};
	}

	public static createConditionDurationSaves(): ConditionDurationSaves {
		return {
			type: 'saves',
			count: 1,
			saveType: 'str',
			saveDC: 10,
			point: 'start'
		};
	}

	public static createConditionDurationCombatant(): ConditionDurationCombatant {
		return {
			type: 'combatant',
			point: 'start',
			combatantID: null
		};
	}

	public static createConditionDurationRounds(): ConditionDurationRounds {
		return {
			type: 'rounds',
			count: 1
		};
	}
}
