import { Col, Drawer, Row } from 'antd';
import Mousetrap from 'mousetrap';
import React, { ErrorInfo } from 'react';

import Factory from '../utils/factory';
import Frankenstein from '../utils/frankenstein';
import Mercator from '../utils/mercator';
import Napoleon from '../utils/napoleon';
import Utils from '../utils/utils';

import { Combat, Combatant, CombatSetup, Notification } from '../models/combat';
import { Condition } from '../models/condition';
import { Encounter } from '../models/encounter';
import { Map, MapItem } from '../models/map';
import { Monster, MonsterGroup, Trait } from '../models/monster';
import { Companion, Party, PC } from '../models/party';

import Checkbox from './controls/checkbox';
import CombatStartModal from './modals/combat-start-modal';
import ConditionModal from './modals/condition-modal';
import DemographicsModal from './modals/demographics-modal';
import EncounterEditorModal from './modals/editors/encounter-editor-modal';
import MapEditorModal from './modals/editors/map-editor-modal';
import MonsterEditorModal from './modals/editors/monster-editor-modal';
import PCEditorModal from './modals/editors/pc-editor-modal';
import MapImportModal from './modals/import/map-import-modal';
import MonsterGroupImportModal from './modals/import/monster-group-import-modal';
import MonsterImportModal from './modals/import/monster-import-modal';
import PartyImportModal from './modals/import/party-import-modal';
import PCImportModal from './modals/import/pc-import-modal';
import LeaderboardModal from './modals/leaderboard-modal';
import EncounterModal from './modals/viewers/encounter-modal';
import MapModal from './modals/viewers/map-modal';
import StatBlockModal from './modals/viewers/stat-block-modal';
import PageFooter from './panels/page-footer';
import PageHeader from './panels/page-header';
import CombatListScreen from './screens/combat-list-screen';
import CombatScreen from './screens/combat-screen';
import EncounterListScreen from './screens/encounter-list-screen';
import HomeScreen from './screens/home-screen';
import MapListScreen from './screens/map-list-screen';
import MonsterGroupListScreen from './screens/monster-group-list-screen';
import MonsterGroupScreen from './screens/monster-group-screen';
import PartyListScreen from './screens/party-list-screen';
import PartyScreen from './screens/party-screen';
import AboutSidebar from './sidebars/about-sidebar';
import GeneratorsSidebar from './sidebars/generators-sidebar';
import ReferenceSidebar from './sidebars/reference-sidebar';
import SearchSidebar from './sidebars/search-sidebar';
import ToolsSidebar from './sidebars/tools-sidebar';

interface Props {
}

interface State {
	view: string;
	drawer: any;
	sidebar: any;

	parties: Party[];
	library: MonsterGroup[];
	encounters: Encounter[];
	maps: Map[];
	combats: Combat[];

	selectedPartyID: string | null;
	selectedMonsterGroupID: string | null;
	selectedCombatID: string | null;
}

export default class App extends React.Component<Props, State> {

	//#region Constructor

	constructor(props: Props) {
		super(props);

		let parties: Party[] = [];
		try {
			const str = window.localStorage.getItem('data-parties');
			if (str) {
				parties = JSON.parse(str);
			}
		} catch (ex) {
			console.error('Could not parse JSON: ', ex);
		}

		let library: MonsterGroup[] = [];
		try {
			const str = window.localStorage.getItem('data-library');
			if (str) {
				library = JSON.parse(str);

				library.forEach(group => {
					group.monsters.forEach(m => {
						if (m.legendaryActions === undefined) {
							const value = m.traits.some(t => (t.type === 'legendary') || (t.type === 'mythic')) ? 3 : 0;
							m.legendaryActions = value;
						}
						m.role = Frankenstein.getRole(m);
					});
				});
			}
		} catch (ex) {
			console.error('Could not parse JSON: ', ex);
		}

		let encounters: Encounter[] = [];
		try {
			const str = window.localStorage.getItem('data-encounters');
			if (str) {
				encounters = JSON.parse(str);

				encounters.forEach(encounter => {
					encounter.slots.forEach(slot => {
						if (slot.roles === undefined) {
							slot.roles = [];
						}
					});

					encounter.waves.forEach(wave => {
						wave.slots.forEach(slot => {
							if (slot.roles === undefined) {
								slot.roles = [];
							}
						});
					});
				});
			}
		} catch (ex) {
			console.error('Could not parse JSON: ', ex);
		}

		let maps: Map[] = [];
		try {
			const str = window.localStorage.getItem('data-maps');
			if (str) {
				maps = JSON.parse(str);
			}
		} catch (ex) {
			console.error('Could not parse JSON: ', ex);
		}

		let combats: Combat[] = [];
		try {
			const str = window.localStorage.getItem('data-combats');
			if (str) {
				combats = JSON.parse(str);

				combats.forEach(combat => {
					combat.combatants.forEach(c => {
						if (c.note === undefined) {
							c.note = '';
						}
						if (c.mountID === undefined) {
							c.mountID = null;
						}
						if (c.mountType === undefined) {
							c.mountType = 'controlled';
						}
					});

					if (combat.map) {
						if (combat.map.notes === undefined) {
							combat.map.notes = [];
						}
					}

					if (combat.fog === undefined) {
						combat.fog = [];
					}

					if (combat.report === undefined) {
						combat.report = [];
					}
				});
			}
		} catch (ex) {
			console.error('Could not parse JSON: ', ex);
		}

		this.state = {
			view: 'home',
			drawer: null,
			sidebar: null,
			parties: parties,
			library: library,
			encounters: encounters,
			maps: maps,
			combats: combats,
			selectedPartyID: null,
			selectedMonsterGroupID: null,
			selectedCombatID: null
		};
	}

	//#endregion

	//#region Lifecycle

	public componentDidMount() {
		Mousetrap.bind('ctrl+f', e => {
			e.preventDefault();
			this.setSidebar('search');
		});
	}

	public componentWillUnmount() {
		Mousetrap.unbind('ctrl+f');
	}

	public componentDidUpdate() {
		this.saveAfterDelay();
	}

	//#endregion

	//#region Helper methods

	private setView(view: string) {
		this.save();
		this.setState({
			view: view
		});
	}

	private setSidebar(type: string | null) {
		if (type) {
			switch (type) {
				case 'tools':
					const dice: { [sides: number]: number } = {};
					[4, 6, 8, 10, 12, 20, 100].forEach(n => dice[n] = 0);
					this.setState({
						sidebar: {
							type: 'tools',
							subtype: 'die',
							dice: dice,
							constant: 0
						}
					});
					break;
				case 'generators':
					this.setState({
						sidebar: {
							type: 'generators',
							subtype: 'name'
						}
					});
					break;
				case 'reference':
					this.setState({
						sidebar: {
							type: 'reference',
							subtype: 'skills'
						}
					});
					break;
				default:
					this.setState({
						sidebar: {
							type: type
						}
					});
			}
		} else {
			this.setState({
				sidebar: null
			});
		}
	}

	private closeDrawer() {
		this.setState({
			drawer: null
		});
	}

	private selectParty(party: Party | null) {
		this.setState({
			selectedPartyID: party ? party.id : null
		});
	}

	private selectMonsterGroup(group: MonsterGroup | null) {
		this.setState({
			selectedMonsterGroupID: group ? group.id : null
		});
	}

	private selectPartyByID(id: string | null) {
		this.save();
		this.setState({
			view: 'parties',
			selectedPartyID: id
		});
	}

	private selectMonsterGroupByID(id: string | null) {
		this.save();
		this.setState({
			view: 'library',
			selectedMonsterGroupID: id
		});
	}

	private selectEncounterByID(id: string | null) {
		this.save();
		this.setState({
			view: 'encounters'
		});
	}

	private selectMapByID(id: string | null) {
		this.save();
		this.setState({
			view: 'maps'
		});
	}

	private setDice(count: number, sides: number, constant: number) {
		const dice: { [sides: number]: number } = {};
		[4, 6, 8, 10, 12, 20, 100].forEach(n => dice[n] = 0);
		dice[sides] = count;

		this.setState({
			sidebar: {
				type: 'tools',
				subtype: 'die',
				dice: dice,
				constant: constant
			}
		});
	}

	private resetAll() {
		this.setState({
			parties: [],
			library: [],
			encounters: [],
			maps: [],
			combats: [],
			selectedPartyID: null,
			selectedMonsterGroupID: null,
			selectedCombatID: null
		}, () => this.saveAll());
	}

	private getMonster(monsterName: string, groupName: string) {
		const group = this.state.library.find(p => p.name === groupName);
		if (group) {
			const monster = group.monsters.find(m => m.name === monsterName);
			if (monster) {
				return monster;
			}
		}

		return null;
	}

	private changeValue(combatant: any, type: string, value: any) {
		/*
		switch (type) {
			case 'hpCurrent':
				value = Math.min(value, combatant.hpMax);
				value = Math.max(value, 0);
				break;
			case 'hpTemp':
				value = Math.max(value, 0);
				break;
			case 'level':
				value = Math.max(value, 1);
				value = (combatant.player !== undefined) ? Math.min(value, 20) : Math.min(value, 6);
				break;
			case 'count':
				value = Math.max(value, 1);
				break;
			case 'hitDice':
				value = Math.max(value, 1);
				break;
			case 'radius':
				value = Math.max(value, 0);
				break;
			default:
				// Do nothing
				break;
		}
		*/

		const tokens = type.split('.');
		let obj = combatant;
		for (let n = 0; n !== tokens.length; ++n) {
			const token = tokens[n];
			if (n === tokens.length - 1) {
				obj[token] = value;
			} else {
				obj = obj[token];
			}
		}

		Utils.sort(this.state.parties);
		Utils.sort(this.state.library);
		Utils.sort(this.state.encounters);

		if (type === 'initiative') {
			if (!(combatant as Combatant).pending) {
				const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
				Napoleon.sortCombatants(combat as Combat);
			}
		}

		if (type === 'mountID') {
			const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
			if (combat) {
				this.setMountPositions(combat);
			}
		}

		this.setState({
			parties: this.state.parties,
			library: this.state.library,
			encounters: this.state.encounters,
			combats: this.state.combats,
			selectedPartyID: this.state.selectedPartyID,
			selectedMonsterGroupID: this.state.selectedMonsterGroupID,
			selectedCombatID: this.state.selectedCombatID,
			drawer: this.state.drawer
		});
	}

	private nudgeValue(combatant: any, type: string, delta: number) {
		const tokens = type.split('.');
		let obj = combatant;
		for (let n = 0; n !== tokens.length; ++n) {
			const token = tokens[n];
			if (n === tokens.length - 1) {
				let value = null;
				switch (token) {
					case 'challenge':
						value = Utils.nudgeChallenge(obj[token], delta);
						break;
					case 'size':
					case 'displaySize':
						value = Utils.nudgeSize(obj[token], delta);
						break;
					default:
						value = obj[token] + delta;
				}
				this.changeValue(combatant, type, value);
			} else {
				obj = obj[token];
			}
		}
	}

	//#endregion

	//#region Party screen

	private addParty() {
		const party = Factory.createParty();
		party.name = 'new party';
		const parties: Party[] = ([] as Party[]).concat(this.state.parties, [party]);
		Utils.sort(parties);
		this.setState({
			parties: parties,
			selectedPartyID: party.id
		});
	}

	private removeCurrentParty() {
		const party = this.state.parties.find(p => p.id === this.state.selectedPartyID);
		if (party) {
			this.removeParty(party);
		}
	}

	private removeParty(party: Party) {
		const index = this.state.parties.indexOf(party);
		this.state.parties.splice(index, 1);
		this.setState({
			parties: this.state.parties,
			selectedPartyID: null
		});
	}

	private importParty() {
		this.setState({
			drawer: {
				type: 'import-party',
				party: Factory.createParty()
			}
		});
	}

	private acceptImportedParty() {
		this.state.parties.push(this.state.drawer.party);
		this.setState({
			parties: this.state.parties,
			drawer: null
		});
	}

	private removePC(pc: PC) {
		const party = this.state.parties.find(p => p.id === this.state.selectedPartyID);
		if (party) {
			const index = party.pcs.indexOf(pc);
			party.pcs.splice(index, 1);
			this.setState({
				parties: this.state.parties
			});
		}
	}

	private editPC(pc: PC | null) {
		if (!pc) {
			pc = Factory.createPC();
			pc.name = 'new pc';
		}

		const copy = JSON.parse(JSON.stringify(pc));
		this.setState({
			drawer: {
				type: 'pc',
				pc: copy
			}
		});
	}

	private importPC() {
		this.setState({
			drawer: {
				type: 'import-pc',
				pc: Factory.createPC()
			}
		});
	}

	private acceptImportedPC() {
		const party = this.state.parties.find(p => p.id === this.state.selectedPartyID);
		if (party) {
			party.pcs.push(this.state.drawer.pc);
			Utils.sort(party.pcs);
			this.setState({
				parties: this.state.parties,
				drawer: null
			});
		}
	}

	private updatePC(pc: PC) {
		const copy = JSON.parse(JSON.stringify(pc));
		this.setState({
			drawer: {
				type: 'update-pc',
				pc: copy
			}
		});
	}

	private savePC() {
		Utils.sort(this.state.drawer.pc.companions);
		const party = this.state.parties.find(p => p.id === this.state.selectedPartyID);
		if (party) {
			const original = party.pcs.find(pc => pc.id === this.state.drawer.pc.id);
			if (original) {
				const index = party.pcs.indexOf(original);
				party.pcs[index] = this.state.drawer.pc;
			} else {
				party.pcs.push(this.state.drawer.pc);
			}
			Utils.sort(party.pcs);
			this.setState({
				parties: this.state.parties,
				drawer: null
			});
		}
	}

	//#endregion

	//#region Library screen

	private addMonsterGroup() {
		const group = Factory.createMonsterGroup();
		group.name = 'new group';
		const library = ([] as MonsterGroup[]).concat(this.state.library, [group]);
		Utils.sort(library);
		this.setState({
			library: library,
			selectedMonsterGroupID: group.id
		});
	}

	private importMonsterGroup() {
		this.setState({
			drawer: {
				type: 'import-group',
				group: Factory.createMonsterGroup()
			}
		});
	}

	private acceptImportedGroup() {
		this.state.library.push(this.state.drawer.group);
		this.setState({
			library: this.state.library,
			drawer: null
		});
	}

	private removeCurrentMonsterGroup() {
		const group = this.state.library.find(g => g.id === this.state.selectedMonsterGroupID);
		if (group) {
			this.removeMonsterGroup(group);
		}
	}

	private removeMonsterGroup(group: MonsterGroup) {
		const index = this.state.library.indexOf(group);
		this.state.library.splice(index, 1);
		this.setState({
			library: this.state.library,
			selectedMonsterGroupID: null
		});
	}

	private removeMonster(monster: Monster) {
		const group = this.state.library.find(g => g.id === this.state.selectedMonsterGroupID);
		if (group) {
			const index = group.monsters.indexOf(monster);
			group.monsters.splice(index, 1);
			this.setState({
				library: this.state.library
			});
		}
	}

	private importMonster() {
		this.setState({
			drawer: {
				type: 'import-monster',
				monster: Factory.createMonster()
			}
		});
	}

	private acceptImportedMonster() {
		const group = this.state.library.find(g => g.id === this.state.selectedMonsterGroupID);
		if (group) {
			group.monsters.push(this.state.drawer.monster);
			Utils.sort(group.monsters);
			this.setState({
				library: this.state.library,
				drawer: null
			});
		}
	}

	private moveToGroup(monster: Monster, groupID: string) {
		const sourceGroup = this.state.library.find(group => group.monsters.includes(monster));
		if (sourceGroup) {
			const index = sourceGroup.monsters.indexOf(monster);
			sourceGroup.monsters.splice(index, 1);

			const group = this.state.library.find(g => g.id === groupID);
			if (group) {
				group.monsters.push(monster);
				Utils.sort(group.monsters);

				this.setState({
					library: this.state.library
				});
			}
		}
	}

	private addMonster(monster: Monster | null) {
		if (monster) {
			const group = this.state.library.find(g => g.id === this.state.selectedMonsterGroupID);
			if (group) {
				group.monsters.push(monster);
				Utils.sort(group.monsters);

				this.setState({
					library: this.state.library,
					drawer: {
						type: 'stat-block',
						source: monster
					}
				});
			}
		} else {
			monster = Factory.createMonster();
			monster.name = 'new monster';

			const copy = JSON.parse(JSON.stringify(monster));
			this.setState({
				drawer: {
					type: 'monster',
					monster: copy,
					showSidebar: false
				}
			});
		}
	}

	private editMonster(monster: Monster) {
		const copy = JSON.parse(JSON.stringify(monster));
		this.setState({
			drawer: {
				type: 'monster',
				monster: copy,
				showSidebar: false
			}
		});
	}

	private saveMonster() {
		const group = this.state.library.find(g => g.id === this.state.selectedMonsterGroupID);
		if (group) {
			const original = group.monsters.find(m => m.id === this.state.drawer.monster.id);
			if (original) {
				const index = group.monsters.indexOf(original);
				group.monsters[index] = this.state.drawer.monster;
			} else {
				group.monsters.push(this.state.drawer.monster);
			}
			Utils.sort(group.monsters);
			this.setState({
				library: this.state.library,
				drawer: null
			});
		}
	}

	private toggleShowSidebar() {
		const drawer = this.state.drawer;
		drawer.showSidebar = !drawer.showSidebar;
		this.setState({
			drawer: drawer
		});
	}

	private cloneMonster(monster: Monster, name: string) {
		const group = this.state.library.find(g => g.monsters.includes(monster));
		if (group) {
			const clone = Frankenstein.clone(monster, name);
			group.monsters.push(clone);
			Utils.sort(group.monsters);

			this.setState({
				library: this.state.library
			});
		}
	}

	private addOpenGameContent() {
		fetch('/dojo/data/monsters.json')
			.then(response => response.json())
			.then(json => {
				json.forEach((data: any) => {
					try {
						if (data.name) {
							const monster = Frankenstein.createFromJSON(data);

							let groupName = monster.tag || monster.category;
							if (groupName.indexOf('swarm') === 0) {
								groupName = 'swarm';
							}
							if (groupName === 'any race') {
								groupName = 'npc';
							}

							let group = this.state.library.find(p => p.name === groupName);
							if (!group) {
								group = {
									id: Utils.guid(),
									name: groupName,
									monsters: []
								};
								this.state.library.push(group);
							}
							group.monsters.push(monster);
						}
					} catch (e) {
						console.error(e);
					}
				});

				Utils.sort(this.state.library);

				this.setState({
					library: this.state.library
				});
			});
	}

	private openDemographics(group: MonsterGroup | null) {
		this.setState({
			drawer: {
				type: 'monster-demographics',
				group: group
			}
		});
	}

	//#endregion

	//#region Encounter screen

	private viewEncounter(encounter: Encounter) {
		const copy = JSON.parse(JSON.stringify(encounter));
		this.setState({
			drawer: {
				type: 'encounter-view',
				encounter: copy
			}
		});
	}

	private addEncounter(templateName: string | null) {
		const encounter = Factory.createEncounter();
		encounter.name = 'new encounter';
		if (templateName) {
			const template = Napoleon.encounterTemplates().find(t => t.name === templateName);
			if (template) {
				encounter.name = 'new ' + templateName + ' encounter';
				encounter.slots = template.slots.map(s => {
					const slot = Factory.createEncounterSlot();
					slot.roles = s.roles;
					slot.count = s.count;
					return slot;
				});
				encounter.waves = [];
			}
		}

		const copy = JSON.parse(JSON.stringify(encounter));
		this.setState({
			drawer: {
				type: 'encounter-edit',
				encounter: copy
			}
		});
	}

	private editEncounter(encounter: Encounter) {
		const copy = JSON.parse(JSON.stringify(encounter));
		this.setState({
			drawer: {
				type: 'encounter-edit',
				encounter: copy
			}
		});
	}

	private saveEncounter() {
		const encounters = this.state.encounters;
		const original = this.state.encounters.find(e => e.id === this.state.drawer.encounter.id);
		if (original) {
			const index = this.state.encounters.indexOf(original);
			encounters[index] = this.state.drawer.encounter;
		} else {
			encounters.push(this.state.drawer.encounter);
		}

		Utils.sort(encounters);
		this.setState({
			encounters: encounters,
			drawer: null
		});
	}

	private removeEncounter(encounter: Encounter) {
		const index = this.state.encounters.indexOf(encounter);
		this.state.encounters.splice(index, 1);

		this.setState({
			encounters: this.state.encounters
		});
	}

	//#endregion

	//#region Map screen

	private generateMap(type: string) {
		const map = Factory.createMap();
		map.name = 'new ' + type;
		Mercator.generate(type, map);
		this.state.maps.push(map);

		this.setState({
			maps: this.state.maps
		});
	}

	private viewMap(map: Map) {
		const copy = JSON.parse(JSON.stringify(map));
		this.setState({
			drawer: {
				type: 'map-view',
				map: copy,
				fog: [],
				partyID: null,
				combatants: []
			}
		});
	}

	private editMap(map: Map | null) {
		if (!map) {
			map = Factory.createMap();
			map.name = 'new map';
		}

		const copy = JSON.parse(JSON.stringify(map));
		this.setState({
			drawer: {
				type: 'map-edit',
				map: copy
			}
		});
	}

	private saveMap() {
		const maps = this.state.maps;
		const original = this.state.maps.find(m => m.id === this.state.drawer.map.id);
		if (original) {
			const index = this.state.maps.indexOf(original);
			maps[index] = this.state.drawer.map;
		} else {
			maps.push(this.state.drawer.map);
		}
		Utils.sort(maps);
		this.setState({
			maps: maps,
			drawer: null
		});
	}

	private importMap() {
		const map = Factory.createMap();
		this.setState({
			drawer: {
				type: 'import-map',
				map: map
			}
		});
	}

	private acceptImportedMap() {
		this.state.maps.push(this.state.drawer.map);
		this.setState({
			maps: this.state.maps,
			drawer: null
		});
	}

	private removeMap(map: Map) {
		const index = this.state.maps.indexOf(map);
		this.state.maps.splice(index, 1);
		this.setState({
			maps: this.state.maps
		});
	}

	//#endregion

	//#region Combat screen

	// Start combat

	private createCombat(
		encounter: Encounter | null = null,
		partyID: string | null = null,
		map: Map | null = null,
		fog: { x: number, y: number }[] = [],
		combatants: Combatant[] = []
		) {
		let party = this.state.parties.length === 1 ? this.state.parties[0] : null;
		if (partyID) {
			const p = this.state.parties.find(par => par.id === partyID);
			if (p) {
				party = p;
			}
		}
		let enc = this.state.encounters.length === 1 ? this.state.encounters[0] : null;
		if (encounter) {
			enc = encounter;
		}

		const setup = Factory.createCombatSetup();
		setup.party = JSON.parse(JSON.stringify(party));
		setup.encounter = JSON.parse(JSON.stringify(encounter));
		if (enc) {
			setup.slotInfo = Utils.getCombatSlotData(enc, this.state.library);
		}
		if (map) {
			setup.map = map;
		}
		setup.fog = fog;
		setup.combatants = combatants;

		this.setState({
			drawer: {
				type: 'combat-start',
				combatSetup: setup
			}
		});
	}

	private startCombat() {
		const combatSetup: CombatSetup = this.state.drawer.combatSetup;
		if (combatSetup.party && combatSetup.encounter) {
			const partyName = combatSetup.party.name || 'unnamed party';
			const encounterName = combatSetup.encounter.name || 'unnamed encounter';

			const combat = Factory.createCombat();
			combat.name = partyName + ' vs ' + encounterName;
			combat.encounter = JSON.parse(JSON.stringify(combatSetup.encounter));

			const entry = Factory.createCombatReportEntry();
			entry.type = 'combat-start';
			combat.report.push(entry);

			// Add any pre-existing combatants
			combatSetup.combatants.forEach(c => {
				combat.combatants.push(c);
			});

			// Add a copy of each PC to the encounter
			combatSetup.party.pcs.filter(pc => pc.active).forEach(pc => {
				if (!combat.combatants.find(c => c.id === pc.id)) {
					combat.combatants.push(Napoleon.convertPCToCombatant(pc));
				}
			});

			combat.encounter.slots.forEach(slot => {
				const monster = this.getMonster(slot.monsterName, slot.monsterGroupName);
				const slotInfo = combatSetup.slotInfo.find(info => info.id === slot.id);
				if (monster && slotInfo) {
					slotInfo.members.forEach(m => {
						combat.combatants.push(Napoleon.convertMonsterToCombatant(monster, m.init, m.hp, m.name));
					});
				} else {
					combat.issues.push('unknown monster: ' + slot.monsterName + ' in group ' + slot.monsterGroupName);
				}
			});

			// Add an Init 20 item
			combat.combatants.push(Napoleon.convertPlaceholderToCombatant());

			Napoleon.sortCombatants(combat);

			if (combatSetup.map) {
				combat.map = JSON.parse(JSON.stringify(combatSetup.map));
				combat.fog = combatSetup.fog;
			}

			this.setState({
				combats: ([] as Combat[]).concat(this.state.combats, [combat]),
				selectedCombatID: combat.id,
				drawer: null,
				view: 'combat'
			});
		}
	}

	// Add a wave

	private openAddWaveModal() {
		const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
		if (combat) {
			const setup = Factory.createCombatSetup();
			setup.encounter = combat.encounter;
			setup.slotInfo = Utils.getCombatSlotData(combat.encounter, this.state.library);

			this.setState({
				drawer: {
					type: 'combat-wave',
					combatSetup: setup
				}
			});
		}
	}

	private addWaveToCombat() {
		const combatSetup: CombatSetup = this.state.drawer.combatSetup;
		const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
		if (combatSetup && combatSetup.encounter && combat) {
			const wave = combatSetup.encounter.waves.find(w => w.id === combatSetup.waveID);
			if (wave) {
				wave.slots.forEach(slot => {
					const monster = this.getMonster(slot.monsterName, slot.monsterGroupName);
					const slotInfo = combatSetup.slotInfo.find(info => info.id === slot.id);
					if (monster && slotInfo) {
						slotInfo.members.forEach(m => {
							combat.combatants.push(Napoleon.convertMonsterToCombatant(monster, m.init, m.hp, m.name));
						});
					} else {
						combat.issues.push('unknown monster: ' + slot.monsterName + ' in group ' + slot.monsterGroupName);
					}
				});

				Napoleon.sortCombatants(combat);

				this.setState({
					combats: this.state.combats,
					drawer: null
				});
			}
		}
	}

	// Add combatants

	private openAddCombatantModal() {
		const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
		if (combat) {
			const setup = Factory.createCombatSetup();
			setup.encounter = Factory.createEncounter();
			setup.slotInfo = Utils.getCombatSlotData(setup.encounter, this.state.library);

			this.setState({
				drawer: {
					type: 'combat-add-combatants',
					combatSetup: setup
				}
			});
		}
	}

	private addMonsterToAddCombatantsModal(monster: Monster) {
		const combatSetup = this.state.drawer.combatSetup;
		if (combatSetup && combatSetup.encounter) {
			const group = Utils.getMonsterGroup(monster, this.state.library);
			const slot = Factory.createEncounterSlot();
			slot.id = monster.id;
			slot.monsterName = monster.name;
			slot.monsterGroupName = group.name;
			combatSetup.encounter.slots.push(slot);

			combatSetup.slotInfo = Utils.getCombatSlotData(combatSetup.encounter, this.state.library);

			this.setState({
				drawer: this.state.drawer
			});
		}
	}

	private addCombatantsToCombat() {
		const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
		const combatSetup: CombatSetup = this.state.drawer.combatSetup;
		if (combat && combatSetup && combatSetup.encounter) {
			combatSetup.encounter.slots.forEach(slot => {
				const monster = this.getMonster(slot.monsterName, slot.monsterGroupName);
				const slotInfo = combatSetup.slotInfo.find(info => info.id === slot.id);
				if (monster && slotInfo) {
					slotInfo.members.forEach(m => {
						combat.combatants.push(Napoleon.convertMonsterToCombatant(monster, m.init, m.hp, m.name));
					});
				} else {
					combat.issues.push('unknown monster: ' + slot.monsterName + ' in group ' + slot.monsterGroupName);
				}
			});

			Napoleon.sortCombatants(combat);

			this.setState({
				combats: this.state.combats,
				drawer: null
			});
		}
	}

	// Add a PC / add a companion

	private addPCToEncounter(partyID: string, pcID: string) {
		const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
		if (combat) {
			const party = this.state.parties.find(p => p.id === partyID);
			if (party) {
				const pc = party.pcs.find(item => item.id === pcID);
				if (pc) {
					combat.combatants.push(Napoleon.convertPCToCombatant(pc));
					this.setState({
						combats: this.state.combats
					});
				}
			}
		}
	}

	private addCompanionToEncounter(companion: Companion | null) {
		const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
		if (combat) {
			combat.combatants.push(Napoleon.convertCompanionToCombatant(companion));
			this.setState({
				combats: this.state.combats
			});
		}
	}

	// Combat management

	private pauseCombat() {
		const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
		if (combat) {
			const entry = Factory.createCombatReportEntry();
			entry.type = 'combat-pause';
			combat.report.push(entry);

			this.setState({
				selectedCombatID: null
			});
		}
	}

	private resumeCombat(combat: Combat) {
		const entry = Factory.createCombatReportEntry();
		entry.type = 'combat-resume';
		combat.report.push(entry);

		this.setState({
			selectedCombatID: combat.id
		});
	}

	private endCombat(combat: Combat | null = null, goToMap: boolean = false) {
		if (!combat) {
			const cbt = this.state.combats.find(c => c.id === this.state.selectedCombatID);
			if (cbt) {
				combat = cbt;
			}
		}

		if (combat) {
			const entry = Factory.createCombatReportEntry();
			entry.type = 'combat-end';
			combat.report.push(entry);

			const index = this.state.combats.indexOf(combat);
			this.state.combats.splice(index, 1);
			this.setState({
				combats: this.state.combats,
				selectedCombatID: null
			}, () => {
				if (combat && combat.map && goToMap) {
					const combatants = combat.combatants.filter(c => (c.type === 'pc') || (c.type === 'companion'));

					// See if we can work out the party ID from the combatants
					let partyID = null;
					const pcs = combat.combatants.filter(c => c.type === 'pc');
					if (pcs.length > 0) {
						const party = this.state.parties.find(p => p.pcs.find(pc1 => pc1.id === pcs[0].id));
						if (party) {
							partyID = party.id;

							// Make sure there's no-one missing
							party.pcs.forEach(pc => {
								if (!combatants.find(c => c.id === pc.id)) {
									// Add this PC
									combatants.push(Napoleon.convertPCToCombatant(pc));
								}

								pc.companions.forEach(comp => {
									if (!combatants.find(c => c.id === comp.id)) {
										// Add this companion
										combatants.push(Napoleon.convertCompanionToCombatant(comp));
									}
								});
							});
						}
					}

					Utils.sort(combatants, [{ field: 'displayName', dir: 'asc' }]);

					// Go to map view
					this.setState({
						view: 'maps',
						drawer: {
							type: 'map-view',
							map: combat.map,
							fog: combat.fog,
							partyID: partyID,
							combatants: combatants
						}
					});
				}
			});
		}
	}

	// Combatant management

	private makeCurrent(combatant: Combatant | null, newRound: boolean) {
		const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
		if (combat) {
			// Handle start-of-turn conditions
			combat.combatants.filter(actor => actor.conditions)
				.forEach(actor => {
					actor.conditions.forEach(c => {
						if (c.duration) {
							switch (c.duration.type) {
								case 'saves':
									// If it's my condition, and point is START, notify the user
									if (combatant && (actor.id === combatant.id) && (c.duration.point === 'start')) {
										combat.notifications.push({
											id: Utils.guid(),
											type: 'condition-save',
											data: c,
											combatant: actor
										});
									}
									break;
								case 'combatant':
									// If this refers to me, and point is START, remove it
									if (combatant && ((c.duration.combatantID === combatant.id) || (c.duration.combatantID === null)) && (c.duration.point === 'start')) {
										const index = actor.conditions.indexOf(c);
										actor.conditions.splice(index, 1);
										// Notify the user
										combat.notifications.push({
											id: Utils.guid(),
											type: 'condition-end',
											data: c,
											combatant: actor
										});
									}
									break;
								case 'rounds':
									// If it's my condition, decrement the condition
									if (combatant && (actor.id === combatant.id)) {
										c.duration.count -= 1;
									}
									// If it's now at 0, remove it
									if (c.duration.count === 0) {
										const n = actor.conditions.indexOf(c);
										actor.conditions.splice(n, 1);
										if (combat) {
											// Notify the user
											combat.notifications.push({
												id: Utils.guid(),
												type: 'condition-end',
												data: c,
												combatant: actor
											});
										}
									}
									break;
								default:
									// Do nothing
									break;
							}
						}
					});
				});

			// Handle recharging traits
			if (combatant && (combatant.type === 'monster')) {
				(combatant as Combatant & Monster).traits
					.filter(t => (t.uses > 0) && t.usage.toLowerCase().startsWith('recharge '))
					.forEach(t => {
						combat.notifications.push({
							id: Utils.guid(),
							type: 'trait-recharge',
							data: t,
							combatant: combatant
						});
					});
				(combatant as Combatant & Monster).traits
					.filter(t => (t.type === 'legendary') || (t.type === 'mythic'))
					.forEach(t => {
						t.uses = 0;
					});
			}

			combat.combatants.forEach(c => {
				c.current = false;
			});
			if (combatant) {
				combatant.current = true;

				if (combatant.type === 'pc') {
					const entry = Factory.createCombatReportEntry();
					entry.type = 'turn-start';
					entry.combatantID = combatant.id;
					combat.report.push(entry);
				}
			}

			if (newRound) {
				combat.round += 1;
			}

			this.setState({
				combats: this.state.combats
			});
		}
	}

	private makeActive(combatants: Combatant[]) {
		const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
		if (combat) {
			const wasPending = combatants.some(c => c.pending);

			combatants.forEach(c => {
				c.pending = false;
				c.active = true;
				c.defeated = false;
			});

			if (wasPending) {
				Napoleon.sortCombatants(combat);
			}

			this.setState({
				combats: this.state.combats
			});
		}
	}

	private makeDefeated(combatants: Combatant[]) {
		const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
		if (combat) {
			const current = combat.combatants.find(c => c.current);

			combatants.forEach(c => {
				c.pending = false;
				c.active = false;
				c.defeated = true;

				c.mountID = null;
				c.mountType = 'controlled';

				// If anyone is mounted on this combatant, dismount them
				combat.combatants.forEach(cmb => {
					if (cmb.mountID === c.id) {
						cmb.mountID = null;
						cmb.mountType = 'controlled';
					}
				});

				// If anyone is engaged with this combatant, remove that
				combat.combatants.forEach(cmb => {
					cmb.tags = cmb.tags.filter(t => t !== 'engaged:' + c.displayName);
				});

				// If this combatant is on the map, remove them from it
				if (combat.map) {
					combat.map.items = combat.map.items.filter(item => item.id !== c.id);
				}

				if (current && (current.type === 'pc') && (c.type === 'monster')) {
					const entry = Factory.createCombatReportEntry();
					entry.type = 'kill';
					entry.combatantID = current.id;
					combat.report.push(entry);
				}
			});

			// If the current combatant is one of those being defeated, end its turn
			if (current && combatants.find(c => c.id === current.id)) {
				this.endTurn(current);
			} else {
				this.setState({
					combats: this.state.combats
				});
			}
		}
	}

	private useTrait(combatant: Combatant & Monster, trait: Trait) {
		trait.uses += 1;

		this.setState({
			combats: this.state.combats
		});
	}

	private rechargeTrait(combatant: Combatant & Monster, trait: Trait) {
		trait.uses = 0;

		this.setState({
			combats: this.state.combats
		});
	}

	private removeCombatants(combatants: Combatant[]) {
		const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
		if (combat) {
			combatants.forEach(c => {
				const index = combat.combatants.indexOf(c);
				combat.combatants.splice(index, 1);

				// If anyone is mounted on this combatant, dismount them
				combat.combatants.forEach(cmb => {
					if (cmb.mountID === c.id) {
						cmb.mountID = null;
						cmb.mountType = 'controlled';
					}
				});

				// If anyone is engaged with this combatant, remove that
				combat.combatants.forEach(cmb => {
					cmb.tags = cmb.tags.filter(t => t !== 'engaged:' + c.displayName);
				});

				if (combat.map) {
					const item = combat.map.items.find(i => i.id === c.id);
					if (item) {
						const n = combat.map.items.indexOf(item);
						combat.map.items.splice(n, 1);
					}
				}
			});

			this.setState({
				combats: this.state.combats
			});
		}
	}

	private endTurn(combatant: Combatant) {
		const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
		if (combat) {
			if (combatant.type === 'pc') {
				const entry = Factory.createCombatReportEntry();
				entry.type = 'turn-end';
				entry.combatantID = combatant.id;
				combat.report.push(entry);
			}

			// Handle end-of-turn conditions
			combat.combatants.filter(actor => actor.conditions)
				.forEach(actor => {
					actor.conditions.forEach(c => {
						if (c.duration) {
							switch (c.duration.type) {
								case 'saves':
									// If it's my condition, and point is END, notify the user
									if ((actor.id === combatant.id) && (c.duration.point === 'end')) {
										const saveNotification = Factory.createNotification();
										saveNotification.type = 'condition-save';
										saveNotification.data = c;
										saveNotification.combatant = actor;
										combat.notifications.push(saveNotification);
									}
									break;
								case 'combatant':
									// If this refers to me, and point is END, remove it
									if (((c.duration.combatantID === combatant.id) || (c.duration.combatantID === null)) && (c.duration.point === 'end')) {
										const n = actor.conditions.indexOf(c);
										actor.conditions.splice(n, 1);
										// Notify the user
										const endNotification = Factory.createNotification();
										endNotification.type = 'condition-end';
										endNotification.data = c;
										endNotification.combatant = actor;
										combat.notifications.push(endNotification);
									}
									break;
								case 'rounds':
									// We check this at the beginning of each turn, not at the end
									break;
								default:
									// Do nothing
									break;
							}
						}
					});
				});

			const controlledMounts = combat.combatants
				.filter(c => !!c.mountID && (c.mountType === 'controlled'))
				.map(c => c.mountID || '');
			const active = combat.combatants
				.filter(c => !controlledMounts.includes(c.id))
				.filter(c => c.current || (!c.pending && c.active && !c.defeated))
				.filter(c => {
					if (c.type === 'placeholder') {
						return Napoleon.combatHasLairActions(combat);
					}

					return true;
				});
			if (active.length === 0) {
				// There's no-one left in the fight
				this.makeCurrent(null, false);
			} else if ((active.length === 1) && (active[0].defeated)) {
				// The only person in the fight is me, and I'm defeated
				this.makeCurrent(null, false);
			} else {
				let index = active.indexOf(combatant) + 1;
				let newRound = false;
				if (index >= active.length) {
					index = 0;
					newRound = true;
				}
				this.makeCurrent(active[index], newRound);
			}
		}
	}

	private changeHP(values: {id: string, hp: number, temp: number, damage: number}[]) {
		const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
		if (combat) {
			values.forEach(v => {
				const combatant = combat.combatants.find(c => c.id === v.id);
				if (combatant) {
					combatant.hpCurrent = v.hp;
					combatant.hpTemp = v.temp;
				}

				const current = combat.combatants.find(c => c.current);
				if (current && (current.type === 'pc')) {
					const entry = Factory.createCombatReportEntry();
					entry.type = 'damage';
					entry.combatantID = current.id;
					entry.value = v.damage;
					combat.report.push(entry);
				}
			});

			this.setState({
				combats: this.state.combats
			});
		}
	}

	private toggleTag(combatants: Combatant[], tag: string) {
		combatants.forEach(c => {
			if (c.tags.includes(tag)) {
				c.tags = c.tags.filter(t => t !== tag);
			} else {
				c.tags.push(tag);
			}
		});

		this.setState({
			combats: this.state.combats,
			drawer: this.state.drawer
		});
	}

	private toggleCondition(combatants: Combatant[], condition: string) {
		combatants.forEach(c => {
			const existing = c.conditions.find(cond => cond.name === condition);
			if (existing) {
				this.removeCondition(c, existing);
			} else {
				const cnd = Factory.createCondition();
				cnd.name = condition;
				c.conditions.push(cnd);

				c.conditions = Utils.sort(c.conditions, [{ field: 'name', dir: 'asc' }]);

				const combat = this.state.combats.find(cbt => cbt.id === this.state.selectedCombatID);
				if (combat) {
					const current = combat.combatants.find(combatant => combatant.current);
					if (current && (current.type === 'pc')) {
						const entry = Factory.createCombatReportEntry();
						entry.type = 'condition-add';
						entry.combatantID = current.id;
						combat.report.push(entry);
					}
				}
			}
		});

		this.setState({
			combats: this.state.combats,
			drawer: this.state.drawer
		});
	}

	private toggleHidden(combatants: Combatant[]) {
		combatants.forEach(c => {
			c.showOnMap = !c.showOnMap;
		});

		this.setState({
			combats: this.state.combats,
			drawer: this.state.drawer
		});
	}

	// Map methods

	private mapAdd(combatant: Combatant, x: number, y: number) {
		const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
		if (combat) {
			const combatants = [combatant];
			if (!!combatant.mountID) {
				const mount = combat.combatants.find(cmb => cmb.id === combatant.mountID);
				if (mount) {
					combatants.push(mount);
				}
			}
			combatants.forEach(c => {
				if (combat.map) {
					// Make sure no-one is already on the map
					const ids = combatants.map(cbt => cbt.id);
					combat.map.items = combat.map.items.filter(i => !ids.includes(i.id));
				}

				const item = Factory.createMapItem();
				item.id = c.id;
				item.type = c.type as 'pc' | 'monster' | 'companion';
				item.x = x;
				item.y = y;

				const size = Utils.miniSize(c.displaySize);
				item.height = size;
				item.width = size;

				if (combat.map) {
					combat.map.items.push(item);
				}
			});

			this.setState({
				combats: this.state.combats
			});
		}
	}

	private mapMove(ids: string[], dir: string) {
		const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
		if (combat) {
			ids.forEach(id => {
				if (combat.map) {
					const item = combat.map.items.find(i => i.id === id);
					if (item) {
						switch (dir) {
							case 'N':
								item.y -= 1;
								break;
							case 'NE':
								item.x += 1;
								item.y -= 1;
								break;
							case 'E':
								item.x += 1;
								break;
							case 'SE':
								item.x += 1;
								item.y += 1;
								break;
							case 'S':
								item.y += 1;
								break;
							case 'SW':
								item.x -= 1;
								item.y += 1;
								break;
							case 'W':
								item.x -= 1;
								break;
							case 'NW':
								item.x -= 1;
								item.y -= 1;
								break;
							default:
								// Do nothing
								break;
						}

						if (item.type === 'pc') {
							const entry = Factory.createCombatReportEntry();
							entry.type = 'movement';
							entry.combatantID = item.id;
							combat.report.push(entry);
						}
					}
				}
			});

			this.setMountPositions(combat);

			this.setState({
				combats: this.state.combats
			});
		}
	}

	private mapRemove(ids: string[]) {
		const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
		if (combat) {
			const allIDs = [...ids];
			ids.forEach(id => {
				const combatant = combat.combatants.find(cbt => cbt.id === id);
				if (combatant && combatant.mountID) {
					allIDs.push(combatant.mountID);
				}
			});

			allIDs.forEach(id => {
				if (combat.map) {
					const item = combat.map.items.find(i => i.id === id);
					if (item) {
						const index = combat.map.items.indexOf(item);
						combat.map.items.splice(index, 1);
					}
				}
			});

			this.setState({
				combats: this.state.combats
			});
		}
	}

	private mapAddNote(tileID: string) {
		const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
		if (combat && combat.map) {
			const note = Factory.createMapNote();
			note.targetID = tileID;
			combat.map.notes.push(note);

			this.setState({
				combats: this.state.combats
			});
		}
	}

	private mapRemoveNote(tileID: string) {
		const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
		if (combat && combat.map) {
			const index = combat.map.notes.findIndex(n => n.targetID === tileID);
			combat.map.notes.splice(index, 1);

			this.setState({
				combats: this.state.combats
			});
		}
	}

	private scatterCombatants(type: 'pc' | 'monster') {
		const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
		if (combat && combat.map) {
			Mercator.scatterCombatants(combat, type);
			this.setMountPositions(combat);

			this.setState({
				combats: this.state.combats
			});
		}
	}

	private rotateMap() {
		const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
		if (combat && combat.map) {
			Mercator.rotateMap(combat.map);

			this.setState({
				combats: this.state.combats
			});
		}
	}

	private setFog(fog: { x: number, y: number }[]) {
		const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
		if (combat) {
			combat.fog = fog;

			this.setState({
				combats: this.state.combats
			});
		}
	}

	private addMapItem(item: MapItem) {
		const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
		if (combat && combat.map) {
			combat.map.items.push(item);

			this.setState({
				combats: this.state.combats
			});
		}
	}

	private setMountPositions(combat: Combat) {
		combat.combatants.forEach(c => {
			if (c.mountID) {
				if (combat.map) {
					// Set mount location to equal rider location
					const riderItem = combat.map.items.find(i => i.id === c.id);
					const mountItem = combat.map.items.find(i => i.id === c.mountID);
					if (riderItem && mountItem) {
						mountItem.x = riderItem.x;
						mountItem.y = riderItem.y;
					}
				}
			}
		});
	}

	// Conditions

	private addCondition(combatants: Combatant[]) {
		const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
		if (combat) {
			const condition = Factory.createCondition();
			condition.name = 'blinded';

			this.setState({
				drawer: {
					type: 'condition-add',
					condition: condition,
					combatants: combatants,
					allCombatants: combat.combatants
				}
			});
		}
	}

	private addConditionFromModal() {
		const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
		if (combat) {
			this.state.drawer.combatants.forEach((combatant: Combatant) => {
				const condition: Condition = JSON.parse(JSON.stringify(this.state.drawer.condition));
				condition.id = Utils.guid();
				combatant.conditions.push(condition);
				Utils.sort(combatant.conditions, [{ field: 'name', dir: 'asc' }]);

				const current = combat.combatants.find(c => c.current);
				if (current && (current.type === 'pc')) {
					const entry = Factory.createCombatReportEntry();
					entry.type = 'condition-add';
					entry.combatantID = current.id;
					combat.report.push(entry);
				}
			});

			this.setState({
				combats: this.state.combats,
				drawer: null
			});
		}
	}

	private quickAddCondition(combatants: Combatant[], condition: Condition) {
		combatants.forEach(c => {
			if (!c.conditions.some(cond => cond.name === condition.name)) {
				const copy = JSON.parse(JSON.stringify(condition));
				c.conditions.push(copy);
			}
		});

		this.setState({
			combats: this.state.combats,
			drawer: this.state.drawer
		});
	}

	private editCondition(combatant: Combatant, condition: Condition) {
		const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
		if (combat) {
			this.setState({
				drawer: {
					type: 'condition-edit',
					condition: condition,
					combatants: [combatant],
					allCombatants: combat.combatants
				}
			});
		}
	}

	private editConditionFromModal() {
		this.state.drawer.combatants.forEach((combatant: Combatant) => {
			const original = combatant.conditions.find(c => c.id === this.state.drawer.condition.id);
			if (original) {
				const index = combatant.conditions.indexOf(original);
				combatant.conditions[index] = this.state.drawer.condition;
				Utils.sort(combatant.conditions, [{ field: 'name', dir: 'asc' }]);
			}
		});

		this.setState({
			combats: this.state.combats,
			drawer: null
		});
	}

	private removeCondition(combatant: Combatant, condition: Condition) {
		const index = combatant.conditions.indexOf(condition);
		combatant.conditions.splice(index, 1);

		const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
		if (combat) {
			const current = combat.combatants.find(c => c.current);
			if (current && (current.type === 'pc')) {
				const entry = Factory.createCombatReportEntry();
				entry.type = 'condition-remove';
				entry.combatantID = current.id;
				combat.report.push(entry);
			}
		}

		this.setState({
			combats: this.state.combats,
			drawer: this.state.drawer
		});
	}

	/// Miscellaneous methods

	private closeNotification(notification: Notification, removeCondition: boolean) {
		const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
		if (combat) {
			const index = combat.notifications.indexOf(notification);
			combat.notifications.splice(index, 1);

			if (removeCondition && notification.combatant && notification.data) {
				const conditionIndex = notification.combatant.conditions.indexOf(notification.data as Condition);
				notification.combatant.conditions.splice(conditionIndex, 1);
			}

			this.setState({
				combats: this.state.combats
			});
		}
	}

	private showLeaderboard() {
		const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
		if (combat) {
			this.setState({
				drawer: {
					type: 'leaderboard',
					combat: combat
				}
			});
		}
	}

	//#endregion

	//#region Saving

	private saveAfterDelay = Utils.debounce(() => this.saveAll(), 5 * 1000);

	private save() {
		switch (this.state.view) {
			case 'parties':
				this.saveKey(this.state.parties, 'data-parties');
				break;
			case 'library':
				this.saveKey(this.state.library, 'data-library');
				break;
			case 'encounters':
				this.saveKey(this.state.encounters, 'data-encounters');
				break;
			case 'maps':
				this.saveKey(this.state.maps, 'data-maps');
				break;
			case 'combat':
				this.saveKey(this.state.combats, 'data-combats');
				break;
		}
	}

	private saveAll() {
		this.saveKey(this.state.parties, 'data-parties');
		this.saveKey(this.state.library, 'data-library');
		this.saveKey(this.state.encounters, 'data-encounters');
		this.saveKey(this.state.maps, 'data-maps');
		this.saveKey(this.state.combats, 'data-combats');
	}

	private saveKey(obj: any, key: string) {
		try {
			const json = JSON.stringify(obj);
			console.info('Saving (' + key + '): ' + Utils.toData(json.length));
			window.localStorage.setItem(key, json);
		} catch (ex) {
			console.error('Could not stringify data: ', ex);
		}
	}

	//#endregion

	//#region Rendering

	private getContent() {
		let hasPCs = false;
		this.state.parties.forEach(party => hasPCs = hasPCs || party.pcs.length > 0);
		let hasMonsters = false;
		this.state.library.forEach(group => hasMonsters = hasMonsters || group.monsters.length > 0);

		switch (this.state.view) {
			case 'home':
				return (
					<HomeScreen />
				);
			case 'parties':
				if (this.state.selectedPartyID) {
					return (
						<PartyScreen
							party={this.state.parties.find(p => p.id === this.state.selectedPartyID) as Party}
							goBack={() => this.selectParty(null)}
							removeParty={() => this.removeCurrentParty()}
							addPC={() => this.editPC(null)}
							importPC={() => this.importPC()}
							editPC={pc => this.editPC(pc)}
							updatePC={pc => this.updatePC(pc)}
							removePC={pc => this.removePC(pc)}
							changeValue={(pc, type, value) => this.changeValue(pc, type, value)}
							nudgeValue={(pc, type, delta) => this.nudgeValue(pc, type, delta)}
						/>
					);
				} else {
					return (
						<PartyListScreen
							parties={this.state.parties}
							encounters={this.state.encounters}
							addParty={() => this.addParty()}
							importParty={() => this.importParty()}
							selectParty={party => this.selectParty(party)}
							deleteParty={party => this.removeParty(party)}
							runEncounter={(party, encounterID) => {
								const encounter = this.state.encounters.find(enc => enc.id === encounterID);
								if (encounter) {
									this.createCombat(encounter, party.id);
								}
							}}
							openStatBlock={pc => this.setState({drawer: { type: 'stat-block', source: pc }})}
						/>
					);
				}
			case 'library':
				if (this.state.selectedMonsterGroupID) {
					return (
						<MonsterGroupScreen
							monsterGroup={this.state.library.find(g => g.id === this.state.selectedMonsterGroupID) as MonsterGroup}
							library={this.state.library}
							goBack={() => this.selectMonsterGroup(null)}
							removeMonsterGroup={() => this.removeCurrentMonsterGroup()}
							openDemographics={group => this.openDemographics(group)}
							addMonster={monster => this.addMonster(monster)}
							importMonster={() => this.importMonster()}
							removeMonster={monster => this.removeMonster(monster)}
							changeValue={(monster, type, value) => this.changeValue(monster, type, value)}
							nudgeValue={(monster, type, delta) => this.nudgeValue(monster, type, delta)}
							viewMonster={monster => this.setState({drawer: { type: 'stat-block', source: monster }})}
							editMonster={monster => this.editMonster(monster)}
							cloneMonster={(monster, name) => this.cloneMonster(monster, name)}
							moveToGroup={(monster, groupID) => this.moveToGroup(monster, groupID)}
						/>
					);
				} else {
					return (
						<MonsterGroupListScreen
							library={this.state.library}
							hasMonsters={hasMonsters}
							addMonsterGroup={() => this.addMonsterGroup()}
							importMonsterGroup={() => this.importMonsterGroup()}
							selectMonsterGroup={group => this.selectMonsterGroup(group)}
							deleteMonsterGroup={group => this.removeMonsterGroup(group)}
							addOpenGameContent={() => this.addOpenGameContent()}
							openStatBlock={monster => this.setState({drawer: { type: 'stat-block', source: monster }})}
							openDemographics={group => this.openDemographics(group)}
						/>
					);
				}
			case 'encounters':
				return (
					<EncounterListScreen
						encounters={this.state.encounters}
						parties={this.state.parties}
						hasMonsters={hasMonsters}
						addEncounter={templateID => this.addEncounter(templateID)}
						viewEncounter={encounter => this.viewEncounter(encounter)}
						editEncounter={encounter => this.editEncounter(encounter)}
						deleteEncounter={encounter => this.removeEncounter(encounter)}
						runEncounter={(encounter, partyID) => this.createCombat(encounter, partyID)}
						getMonster={(monsterName, groupName) => this.getMonster(monsterName, groupName)}
						setView={view => this.setView(view)}
						openStatBlock={monster => this.setState({drawer: { type: 'stat-block', source: monster }})}
					/>
				);
			case 'maps':
				return (
					<MapListScreen
						maps={this.state.maps}
						addMap={() => this.editMap(null)}
						importMap={() => this.importMap()}
						generateMap={(type) => this.generateMap(type)}
						viewMap={map => this.viewMap(map)}
						editMap={map => this.editMap(map)}
						deleteMap={map => this.removeMap(map)}
					/>
				);
			case 'combat':
				if (this.state.selectedCombatID) {
					return (
						<CombatScreen
							combat={this.state.combats.find(c => c.id === this.state.selectedCombatID) as Combat}
							parties={this.state.parties}
							library={this.state.library}
							encounters={this.state.encounters}
							pauseCombat={() => this.pauseCombat()}
							endCombat={goToMap => this.endCombat(null, goToMap)}
							nudgeValue={(combatant, type, delta) => this.nudgeValue(combatant, type, delta)}
							changeValue={(combatant, type, value) => this.changeValue(combatant, type, value)}
							makeCurrent={combatant => this.makeCurrent(combatant, false)}
							makeActive={combatants => this.makeActive(combatants)}
							makeDefeated={combatants => this.makeDefeated(combatants)}
							useTrait={(combatant, trait) => this.useTrait(combatant, trait)}
							rechargeTrait={(combatant, trait) => this.rechargeTrait(combatant, trait)}
							removeCombatants={combatants => this.removeCombatants(combatants)}
							addCombatants={() => this.openAddCombatantModal()}
							addCompanion={companion => this.addCompanionToEncounter(companion)}
							addPC={(partyID, pcID) => this.addPCToEncounter(partyID, pcID)}
							addWave={() => this.openAddWaveModal()}
							addCondition={combatants => this.addCondition(combatants)}
							editCondition={(combatant, condition) => this.editCondition(combatant, condition)}
							removeCondition={(combatant, condition) => this.removeCondition(combatant, condition)}
							mapAdd={(combatant, x, y) => this.mapAdd(combatant, x, y)}
							mapMove={(ids, dir) => this.mapMove(ids, dir)}
							mapRemove={ids => this.mapRemove(ids)}
							mapAddNote={itemID => this.mapAddNote(itemID)}
							mapRemoveNote={itemID => this.mapRemoveNote(itemID)}
							endTurn={combatant => this.endTurn(combatant)}
							changeHP={values => this.changeHP(values)}
							closeNotification={(notification, removeCondition) => this.closeNotification(notification, removeCondition)}
							toggleTag={(combatants, tag) => this.toggleTag(combatants, tag)}
							toggleCondition={(combatants, condition) => this.toggleCondition(combatants, condition)}
							toggleHidden={combatants => this.toggleHidden(combatants)}
							scatterCombatants={type => this.scatterCombatants(type)}
							rotateMap={() => this.rotateMap()}
							setFog={fog => this.setFog(fog)}
							addOverlay={overlay => this.addMapItem(overlay)}
							showLeaderboard={() => this.showLeaderboard()}
							onRollDice={(count, sides, constant) => {
								// TODO: Open die roller with this info
								this.setDice(count, sides, constant);
								/*
								const sign = (constant >= 0) ? '+' : '-';
								const result = Utils.dieRoll(count, sides) + constant;
								message.info(
									<div className='message-details'>
										<div>rolling {count}d{sides} {sign} {Math.abs(constant)}</div>
										<div className='result'>{result}</div>
									</div>,
									10
								);
								*/
							}}
						/>
					);
				} else {
					return (
						<CombatListScreen
							combats={this.state.combats}
							hasPCs={hasPCs}
							hasMonsters={hasMonsters}
							createCombat={() => this.createCombat()}
							resumeCombat={combat => this.resumeCombat(combat)}
							deleteCombat={combat => this.endCombat(combat)}
							openStatBlock={combatant => this.setState({drawer: { type: 'stat-block', source: combatant }})}
							setView={view => this.setView(view)}
						/>
					);
				}
		}

		return null;
	}

	private getSidebar() {
		if (!this.state.sidebar) {
			return null;
		}

		let content = null;
		switch (this.state.sidebar.type) {
			case 'tools':
				content = (
					<ToolsSidebar
						view={this.state.sidebar.subtype}
						setView={view => {
							const sidebar = this.state.sidebar;
							sidebar.subtype = view;
							this.setState({
								sidebar: sidebar
							});
						}}
						dice={this.state.sidebar.dice}
						constant={this.state.sidebar.constant}
						setDie={(sides, count) => {
							const sidebar = this.state.sidebar;
							sidebar.dice[sides] = count;
							this.setState({
								sidebar: sidebar
							});
						}}
						setConstant={value => {
							const sidebar = this.state.sidebar;
							sidebar.constant = value;
							this.setState({
								sidebar: sidebar
							});
						}}
						resetDice={() => {
							const sidebar = this.state.sidebar;
							[4, 6, 8, 10, 12, 20, 100].forEach(n => sidebar.dice[n] = 0);
							sidebar.constant = 0;
							this.setState({
								sidebar: sidebar
							});
						}}
					/>
				);
				break;
			case 'generators':
				content = (
					<GeneratorsSidebar
						view={this.state.sidebar.subtype}
						setView={view => {
							const sidebar = this.state.sidebar;
							sidebar.subtype = view;
							this.setState({
								sidebar: sidebar
							});
						}}
					/>
				);
				break;
			case 'reference':
				content = (
					<ReferenceSidebar
						view={this.state.sidebar.subtype}
						setView={view => {
							const sidebar = this.state.sidebar;
							sidebar.subtype = view;
							this.setState({
								sidebar: sidebar
							});
						}}
					/>
				);
				break;
			case 'search':
				content = (
					<SearchSidebar
						parties={this.state.parties}
						library={this.state.library}
						encounters={this.state.encounters}
						maps={this.state.maps}
						openParty={id => this.selectPartyByID(id)}
						openGroup={id => this.selectMonsterGroupByID(id)}
						openEncounter={id => this.selectEncounterByID(id)}
						openMap={id => this.selectMapByID(id)}
					/>
				);
				break;
			case 'about':
				content = (
					<AboutSidebar
						parties={this.state.parties}
						library={this.state.library}
						maps={this.state.maps}
						combats={this.state.combats}
						resetAll={() => this.resetAll()}
					/>
				);
				break;
		}

		return (
			<div className='sidebar sidebar-right'>
				{content}
			</div>
		);
	}

	private getDrawer() {
		let content = null;
		let header = null;
		let footer = null;
		let width = '50%';
		let closable = false;

		if (this.state.drawer) {
			switch (this.state.drawer.type) {
				case 'stat-block':
					content = (
						<StatBlockModal
							source={this.state.drawer.source}
						/>
					);
					header = 'statblock';
					closable = true;
					break;
				case 'import-party':
					content = (
						<PartyImportModal
							party={this.state.drawer.party}
						/>
					);
					header = 'import party';
					footer = (
						<button onClick={() => this.acceptImportedParty()}>
							accept party
						</button>
					);
					closable = true;
					break;
				case 'pc':
					content = (
						<PCEditorModal
							pc={this.state.drawer.pc}
							library={this.state.library}
						/>
					);
					header = 'pc editor';
					footer = (
						<Row gutter={10}>
							<Col span={12}>
								<button onClick={() => this.savePC()}>save changes</button>
							</Col>
							<Col span={12}>
								<button onClick={() => this.closeDrawer()}>discard changes</button>
							</Col>
						</Row>
					);
					break;
				case 'import-pc':
					content = (
						<PCImportModal
							pc={this.state.drawer.pc}
						/>
					);
					header = 'import pc';
					footer = (
						<button onClick={() => this.acceptImportedPC()}>
							accept pc
						</button>
					);
					closable = true;
					break;
				case 'update-pc':
					content = (
						<PCImportModal
							pc={this.state.drawer.pc}
						/>
					);
					header = 'update pc';
					footer = (
						<button onClick={() => this.savePC()}>
							accept pc
						</button>
					);
					closable = true;
					break;
				case 'import-group':
						content = (
							<MonsterGroupImportModal
								group={this.state.drawer.group}
							/>
						);
						header = 'import monster group';
						footer = (
							<button onClick={() => this.acceptImportedGroup()}>
								accept group
							</button>
						);
						closable = true;
						break;
				case 'monster':
					content = (
						<MonsterEditorModal
							monster={this.state.drawer.monster}
							library={this.state.library}
							showSidebar={this.state.drawer.showSidebar}
						/>
					);
					header = 'monster editor';
					footer = (
						<Row gutter={10}>
							<Col span={6}>
								<button onClick={() => this.saveMonster()}>save changes</button>
							</Col>
							<Col span={6}>
								<button onClick={() => this.closeDrawer()}>discard changes</button>
							</Col>
							<Col span={12}>
								<Checkbox
									label='advanced tools'
									checked={this.state.drawer.showSidebar}
									onChecked={() => this.toggleShowSidebar()}
								/>
							</Col>
						</Row>
					);
					width = '85%';
					break;
				case 'import-monster':
					content = (
						<MonsterImportModal
							monster={this.state.drawer.monster}
						/>
					);
					header = 'import monster';
					footer = (
						<button onClick={() => this.acceptImportedMonster()}>
							accept monster
						</button>
					);
					closable = true;
					break;
				case 'monster-demographics':
					content = (
						<DemographicsModal
							groups={this.state.drawer.group ? [this.state.drawer.group] : this.state.library}
						/>
					);
					header = 'demographics';
					closable = true;
					break;
				case 'encounter-view':
					content = (
						<EncounterModal
							encounter={this.state.drawer.encounter}
							getMonster={(monsterName, groupName) => this.getMonster(monsterName, groupName)}
						/>
					);
					header = this.state.drawer.encounter.name;
					closable = true;
					break;
				case 'encounter-edit':
					content = (
						<EncounterEditorModal
							encounter={this.state.drawer.encounter}
							parties={this.state.parties}
							library={this.state.library}
							getMonster={(monsterName, groupName) => this.getMonster(monsterName, groupName)}
						/>
					);
					header = 'encounter editor';
					footer = (
						<Row gutter={10}>
							<Col span={12}>
								<button onClick={() => this.saveEncounter()}>save changes</button>
							</Col>
							<Col span={12}>
								<button onClick={() => this.closeDrawer()}>discard changes</button>
							</Col>
						</Row>
					);
					width = '75%';
					break;
				case 'map-view':
					content = (
						<MapModal
							map={this.state.drawer.map}
							fog={this.state.drawer.fog}
							partyID={this.state.drawer.partyID}
							combatants={this.state.drawer.combatants}
							parties={this.state.parties}
							startCombat={(partyID, map, fog, combatants) => this.createCombat(null, partyID, map, fog, combatants)}
							toggleTag={(combatants, tag) => this.toggleTag(combatants, tag)}
							toggleCondition={(combatants, condition) => this.toggleCondition(combatants, condition)}
							toggleHidden={combatants => this.toggleHidden(combatants)}
							quickAddCondition={(combatants, condition) => this.quickAddCondition(combatants, condition)}
							removeCondition={(combatant, condition) => this.removeCondition(combatant, condition)}
						/>
					);
					header = this.state.drawer.map.name;
					width = '75%';
					closable = true;
					break;
				case 'map-edit':
					content = (
						<MapEditorModal
							map={this.state.drawer.map}
						/>
					);
					header = 'map editor';
					footer = (
						<Row gutter={10}>
							<Col span={12}>
								<button onClick={() => this.saveMap()}>save changes</button>
							</Col>
							<Col span={12}>
								<button onClick={() => this.closeDrawer()}>discard changes</button>
							</Col>
						</Row>
					);
					width = '85%';
					break;
				case 'import-map':
					content = (
						<MapImportModal
							map={this.state.drawer.map}
						/>
					);
					header = 'import map';
					footer = (
						<button onClick={() => this.acceptImportedMap()}>
							accept map
						</button>
					);
					width = '75%';
					closable = true;
					break;
				case 'combat-start':
					content = (
						<CombatStartModal
							type='start'
							combatSetup={this.state.drawer.combatSetup}
							parties={this.state.parties}
							library={this.state.library}
							encounters={this.state.encounters}
							maps={this.state.maps}
							getMonster={(monsterName, groupName) => this.getMonster(monsterName, groupName)}
							notify={() => this.setState({drawer: this.state.drawer})}
						/>
					);
					header = 'start combat';
					footer = (
						<button
							className={this.state.drawer.combatSetup.party && this.state.drawer.combatSetup.encounter ? '' : 'disabled'}
							onClick={() => this.startCombat()}
						>
							start encounter
						</button>
					);
					width = '75%';
					closable = true;
					break;
				case 'combat-wave':
					content = (
						<CombatStartModal
							type='add-wave'
							combatSetup={this.state.drawer.combatSetup}
							library={this.state.library}
							getMonster={(monsterName, groupName) => this.getMonster(monsterName, groupName)}
							notify={() => this.setState({drawer: this.state.drawer})}
						/>
					);
					header = 'add a wave';
					footer = (
						<button
							className={this.state.drawer.combatSetup.waveID !== null ? '' : 'disabled'}
							onClick={() => this.addWaveToCombat()}
						>
							add wave
						</button>
					);
					width = '75%';
					closable = true;
					break;
				case 'combat-add-combatants':
					content = (
						<CombatStartModal
							type='add-combatants'
							combatSetup={this.state.drawer.combatSetup}
							library={this.state.library}
							getMonster={(monsterName, groupName) => this.getMonster(monsterName, groupName)}
							addMonster={monster => this.addMonsterToAddCombatantsModal(monster)}
							notify={() => this.setState({drawer: this.state.drawer})}
						/>
					);
					header = 'add combatants';
					footer = (
						<button
							className={this.state.drawer.combatSetup.encounter !== null ? '' : 'disabled'}
							onClick={() => this.addCombatantsToCombat()}
						>
							add combatants
						</button>
					);
					width = '75%';
					closable = true;
					break;
				case 'condition-add':
					content = (
						<ConditionModal
							condition={this.state.drawer.condition}
							combatants={this.state.drawer.combatants}
							allCombatants={this.state.drawer.allCombatants}
						/>
					);
					header = 'add a condition';
					footer = (
						<button onClick={() => this.addConditionFromModal()}>add</button>
					);
					width = '75%';
					closable = true;
					break;
				case 'condition-edit':
					content = (
						<ConditionModal
							condition={this.state.drawer.condition}
							combatants={this.state.drawer.combatants}
							allCombatants={this.state.drawer.allCombatants}
						/>
					);
					header = 'edit condition';
					footer = (
						<Row gutter={10}>
							<Col span={12}>
								<button onClick={() => this.editConditionFromModal()}>save changes</button>
							</Col>
							<Col span={12}>
								<button onClick={() => this.closeDrawer()}>discard changes</button>
							</Col>
						</Row>
					);
					width = '75%';
					break;
				case 'leaderboard':
					content = (
						<LeaderboardModal
							combat={this.state.drawer.combat}
						/>
					);
					header = 'leaderboard';
					closable = true;
					break;
			}
		}

		return {
			content: content,
			header: header,
			footer: footer,
			width: width,
			closable: closable
		};
	}

	public render() {
		try {
			const sidebar = this.getSidebar();
			const drawer = this.getDrawer();

			return (
				<div className='dojo'>
					<ErrorBoundary>
						<PageHeader
							sidebar={this.state.sidebar ? this.state.sidebar.type : null}
							onSelectSidebar={type => this.setSidebar(type)}
						/>
					</ErrorBoundary>
					<div className='page-content'>
						<ErrorBoundary>
							<div className='content'>{this.getContent()}</div>
						</ErrorBoundary>
						<ErrorBoundary>
							{sidebar}
						</ErrorBoundary>
					</div>
					<ErrorBoundary>
						<PageFooter
							view={this.state.view}
							onSelectView={view => this.setView(view)}
						/>
					</ErrorBoundary>
					<ErrorBoundary>
						<Drawer
							closable={false}
							maskClosable={drawer.closable}
							width={drawer.width}
							visible={drawer.content !== null}
							onClose={() => this.closeDrawer()}
						>
							<div className='drawer-header'><div className='app-title'>{drawer.header}</div></div>
							<div className='drawer-content'>{drawer.content}</div>
							<div className='drawer-footer'>{drawer.footer}</div>
						</Drawer>
					</ErrorBoundary>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}

	//#endregion
}

interface ErrorBoundaryProps {
	//
}

interface ErrorBoundaryState {
	hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	protected static getDerivedStateFromError(error: any) {
		return {
			hasError: true
		};
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error(error.name);
		console.error(error.message);
		console.error(error.stack);
		console.error(errorInfo.componentStack);
	}

	public render() {
		if (this.state.hasError) {
			return (
				<div className='render-error' />
			);
		}

		return this.props.children;
	}
}
