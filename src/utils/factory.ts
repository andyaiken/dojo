import Utils from './utils';

import { Combat, CombatReportEntry, CombatSetup, CombatSlotInfo, CombatSlotMember, Notification } from '../models/combat';
import { Condition, ConditionDurationCombatant, ConditionDurationRounds, ConditionDurationSaves } from '../models/condition';
import { Encounter, EncounterSlot, EncounterWave, MonsterFilter } from '../models/encounter';
import { Map, MapItem, MapNote } from '../models/map';
import { Monster, MonsterGroup, Trait } from '../models/monster';
import { Companion, Party, PC } from '../models/party';

export default class Factory {

	public static createParty(): Party {
		return {
			id: Utils.guid(),
			name: '',
			pcs: []
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
			portrait: '',
			url: '',
			companions: []
		};
	}

	public static createCompanion(): Companion {
		return {
			id: Utils.guid(),
			name: '',
			monsterID: null
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
			equipment: '',
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
			monsterGroupName: '',
			monsterName: '',
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
			notes: []
		};
	}

	public static createMapItem(): MapItem {
		return {
			id: Utils.guid(),
			type: 'tile',
			x: 0,
			y: 0,
			width: 4,
			height: 4,
			terrain: '',
			customBackground: '',
			content: null,
			size: 'medium',
			color: '',
			opacity: 255,
			style: null
		};
	}

	public static createMapNote(): MapNote {
		return {
			id: Utils.guid(),
			targetID: '',
			text: ''
		};
	}

	public static createCombatSetup(): CombatSetup {
		return {
			party: null,
			encounter: null,
			waveID: null,
			map: null,
			fog: [],
			combatants: [],
			slotInfo: []
		};
	}

	public static createCombatSlotInfo(): CombatSlotInfo {
		return {
			id: '',
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
			init: 0
		};
	}

	public static createCombat(): Combat {
		return {
			id: Utils.guid(),
			name: '',
			encounter: Factory.createEncounter(),
			combatants: [],
			map: null,
			fog: [],
			round: 1,
			notifications: [],
			issues: [],
			report: []
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

	public static createCombatReportEntry(): CombatReportEntry {
		return {
			id: Utils.guid(),
			type: 'combat-start',
			timestamp: Date.now(),
			combatantID: '',
			value: 0
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
