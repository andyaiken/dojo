import { Col, Drawer, Row } from 'antd';
import Mousetrap from 'mousetrap';
import React, { ErrorInfo } from 'react';

import Factory from '../utils/factory';
import Frankenstein from '../utils/frankenstein';
import Gygax from '../utils/gygax';
import Mercator from '../utils/mercator';
import Napoleon from '../utils/napoleon';
import Utils from '../utils/utils';

import { Combat, Combatant, CombatSetup, Notification } from '../models/combat';
import { Condition } from '../models/condition';
import { Encounter } from '../models/encounter';
import { Exploration, Map, MapItem } from '../models/map';
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
import StatBlockModal from './modals/stat-block-modal';
import PageFooter from './panels/page-footer';
import PageHeader from './panels/page-header';
import CombatScreen from './screens/combat-screen';
import EncounterListScreen from './screens/encounter-list-screen';
import EncounterScreen from './screens/encounter-screen';
import ExplorationScreen from './screens/exploration-screen';
import HomeScreen from './screens/home-screen';
import MapListScreen from './screens/map-list-screen';
import MapScreen from './screens/map-screen';
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
	explorations: Exploration[];

	selectedPartyID: string | null;
	selectedMonsterGroupID: string | null;
	selectedEncounterID: string | null;
	selectedMapID: string | null;
	selectedCombatID: string | null;
	selectedExplorationID: string | null;
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
						if (slot.monsterID === undefined) {
							const group = library.find(g => g.name === slot.monsterGroupName);
							if (group) {
								const monster = group.monsters.find(m => m.name === slot.monsterName);
								if (monster) {
									slot.monsterID = monster.id;
								}
							}
						}
						if (slot.roles === undefined) {
							slot.roles = [];
						}
						if (slot.faction === undefined) {
							slot.faction = 'foe';
						}
					});

					encounter.waves.forEach(wave => {
						wave.slots.forEach(slot => {
							if (slot.monsterID === undefined) {
								const group = library.find(g => g.name === slot.monsterGroupName);
								if (group) {
									const monster = group.monsters.find(m => m.name === slot.monsterName);
									if (monster) {
										slot.monsterID = monster.id;
									}
								}
							}
							if (slot.roles === undefined) {
								slot.roles = [];
							}
							if (slot.faction === undefined) {
								slot.faction = 'foe';
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

				maps.forEach(m => {
					if (m.areas === undefined) {
						m.areas = [];
					}
				});
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
						if (c.faction === undefined) {
							switch (c.type) {
								case 'pc':
								case 'companion':
									c.faction = 'ally';
									break;
								case 'monster':
									c.faction = 'foe';
									break;
								default:
									c.faction = 'neutral';
									break;
							}
						}
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

					if (combat.encounter) {
						combat.encounter.slots.forEach(slot => {
							if (slot.monsterID === undefined) {
								const group = library.find(g => g.name === slot.monsterGroupName);
								if (group) {
									const monster = group.monsters.find(m => m.name === slot.monsterName);
									if (monster) {
										slot.monsterID = monster.id;
									}
								}
							}
							if (slot.roles === undefined) {
								slot.roles = [];
							}
							if (slot.faction === undefined) {
								slot.faction = 'foe';
							}
						});

						combat.encounter.waves.forEach(wave => {
							wave.slots.forEach(slot => {
								if (slot.monsterID === undefined) {
									const group = library.find(g => g.name === slot.monsterGroupName);
									if (group) {
										const monster = group.monsters.find(m => m.name === slot.monsterName);
										if (monster) {
											slot.monsterID = monster.id;
										}
									}
								}
								if (slot.roles === undefined) {
									slot.roles = [];
								}
								if (slot.faction === undefined) {
									slot.faction = 'foe';
								}
							});
						});
					}

					if (combat.map) {
						if (combat.map.areas === undefined) {
							combat.map.areas = [];
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

		let explorations: Exploration[] = [];
		try {
			const str = window.localStorage.getItem('data-explorations');
			if (str) {
				explorations = JSON.parse(str);

				explorations.forEach(ex => {
					if (ex.map.areas === undefined) {
						ex.map.areas = [];
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
			explorations: explorations,
			selectedPartyID: null,
			selectedMonsterGroupID: null,
			selectedEncounterID: null,
			selectedMapID: null,
			selectedCombatID: null,
			selectedExplorationID: null
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
							subtype: 'skills',
							selectedPartyID: null,
							selectedMonsterID: null
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

	private selectEncounter(encounter: Encounter | null) {
		this.setState({
			selectedEncounterID: encounter ? encounter.id : null
		});
	}

	private selectMap(map: Map | null) {
		this.setState({
			selectedMapID: map ? map.id : null
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
			view: 'encounters',
			selectedEncounterID: id
		});
	}

	private selectMapByID(id: string | null) {
		this.save();
		this.setState({
			view: 'maps',
			selectedMapID: id
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
		}, () => {
			this.saveAll();

			for (let n = 0; n !== window.localStorage.length; ++n) {
				const key = window.localStorage.key(n);
				if (key) {
					window.localStorage.removeItem(key);
				}
			}
		});
	}

	// This is an internal dictionary to speed up monster lookup
	private monsterIdToGroup: { [id: string]: Monster } = {};

	private getMonster(id: string) {
		let monster: Monster | null = this.monsterIdToGroup[id];
		if (!monster) {
			const monsters = this.state.library.reduce((prev, current) => prev.concat(current.monsters), [] as Monster[]);
			monster = monsters.find(m => m.id === id) || null;
			if (monster) {
				this.monsterIdToGroup[id] = monster;
			}
		}
		return monster;
	}

	private changeValue(combatant: any, type: string, value: any) {
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
		Utils.sort(this.state.maps);
		Utils.sort(this.state.combats);
		Utils.sort(this.state.explorations);

		if (type === 'initiative') {
			if (!(combatant as Combatant).pending) {
				const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
				Napoleon.sortCombatants(combat as Combat);
			}
		}

		if (type === 'mountID') {
			const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
			if (combat && combat.map) {
				this.setMountPositions(combat.combatants, combat.map);
			}
		}

		this.setState({
			parties: this.state.parties,
			library: this.state.library,
			encounters: this.state.encounters,
			maps: this.state.maps,
			combats: this.state.combats,
			explorations: this.state.explorations,
			selectedPartyID: this.state.selectedPartyID,
			selectedMonsterGroupID: this.state.selectedMonsterGroupID,
			selectedEncounterID: this.state.selectedEncounterID,
			selectedMapID: this.state.selectedMapID,
			selectedCombatID: this.state.selectedCombatID,
			selectedExplorationID: this.state.selectedExplorationID,
			drawer: this.state.drawer,
			sidebar: this.state.sidebar
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
						value = Gygax.nudgeChallenge(obj[token], delta);
						break;
					case 'size':
					case 'displaySize':
						value = Gygax.nudgeSize(obj[token], delta);
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
						type: 'statblock',
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
			const clone: Monster = JSON.parse(JSON.stringify(monster));
			monster.id = Utils.guid();
			monster.traits.forEach(t => t.id = Utils.guid());
			monster.name = name;

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

	private cloneEncounter(encounter: Encounter, name: string) {
		const clone: Encounter = JSON.parse(JSON.stringify(encounter));
		clone.id = Utils.guid();
		clone.slots.forEach(s => s.id = Utils.guid());
		clone.waves.forEach(w => {
			w.id = Utils.guid();
			w.slots.forEach(s => s.id = Utils.guid());
		});
		clone.name = name;

		this.state.encounters.push(clone);
		Utils.sort(this.state.encounters);

		this.setState({
			encounters: this.state.encounters
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
			encounters: this.state.encounters,
			selectedEncounterID: null
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

	private cloneMap(map: Map, name: string) {
		const clone: Map = JSON.parse(JSON.stringify(map));
		clone.id = Utils.guid();
		clone.items.forEach(i => i.id = Utils.guid());
		clone.areas.forEach(a => a.id = Utils.guid());
		clone.name = name;

		this.state.maps.push(clone);
		Utils.sort(this.state.maps);

		this.setState({
			maps: this.state.maps
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

	private declineImportedMap() {
		if (this.state.drawer.map.items.length > 0) {
			const tile: MapItem = this.state.drawer.map.items[0];
			const id = tile.customBackground;
			window.localStorage.removeItem('image-' + id);
		}
		this.closeDrawer();
	}

	private removeMap(map: Map) {
		const index = this.state.maps.indexOf(map);
		this.state.maps.splice(index, 1);
		this.setState({
			maps: this.state.maps,
			selectedMapID: null
		});
	}

	//#endregion

	//#region Exploration screen

	private startExploration(map: Map, partyID: string) {
		const party = this.state.parties.find(p => p.id === partyID);
		if (party) {
			const mapCopy = JSON.parse(JSON.stringify(map));
			const ex = Factory.createExploration();
			ex.name = party.name + ' in ' + map.name;
			ex.map = mapCopy;
			ex.partyID = partyID;
			party.pcs.forEach(pc => {
				const combatant = Napoleon.convertPCToCombatant(pc);
				ex.combatants.push(combatant);
			});
			this.state.explorations.push(ex);

			this.setState({
				view: 'maps',
				explorations: this.state.explorations,
				selectedExplorationID: ex.id
			});
		}
	}

	private pauseExploration() {
		this.setState({
			selectedExplorationID: null
		});
	}

	private resumeExploration(exploration: Exploration) {
		this.setState({
			view: 'maps',
			selectedExplorationID: exploration.id
		});
	}

	private endExploration(exploration: Exploration) {
		const index = this.state.explorations.indexOf(exploration);
		this.state.explorations.splice(index, 1);
		this.setState({
			explorations: this.state.explorations,
			selectedExplorationID: null
		});
	}

	private fillFog() {
		const ex = this.state.explorations.find(e => e.id === this.state.selectedExplorationID);
		if (ex) {
			const fog: { x: number, y: number }[] = [];
			const dims = Mercator.mapDimensions(ex.map);
			if (dims) {
				for (let x = dims.minX; x <= dims.maxX; ++x) {
					for (let y = dims.minY; y <= dims.maxY; ++y) {
						fog.push({ x: x, y: y });
					}
				}
				ex.fog = fog;
				this.setState({
					explorations: this.state.explorations
				});
			}
		}
	}

	private clearFog() {
		const ex = this.state.explorations.find(e => e.id === this.state.selectedExplorationID);
		if (ex) {
			ex.fog = [];
			this.setState({
				explorations: this.state.explorations
			});
		}
	}

	private toggleFog(x1: number, y1: number, x2: number, y2: number) {
		const ex = this.state.explorations.find(e => e.id === this.state.selectedExplorationID);
		if (ex) {
			for (let x = x1; x <= x2; ++x) {
				for (let y = y1; y <= y2; ++y) {
					const index = ex.fog.findIndex(i => (i.x === x) && (i.y === y));
					if (index === -1) {
						ex.fog.push({ x: x, y: y });
					} else {
						ex.fog.splice(index, 1);
					}
				}
			}
			this.setState({
				explorations: this.state.explorations
			});
		}
	}

	private addCompanionToExploration(companion: Companion) {
		const ex = this.state.explorations.find(e => e.id === this.state.selectedExplorationID);
		if (ex) {
			ex.combatants.push(Napoleon.convertCompanionToCombatant(companion));

			Utils.sort(ex.combatants, [{ field: 'displayName', dir: 'asc' }]);

			this.setState({
				explorations: this.state.explorations
			});
		}
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
			setup.slotInfo = Gygax.getCombatSlotData(enc, this.state.library);
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
				const monster = this.getMonster(slot.monsterID);
				const slotInfo = combatSetup.slotInfo.find(info => info.id === slot.id);
				if (monster && slotInfo) {
					slotInfo.members.forEach(m => {
						combat.combatants.push(Napoleon.convertMonsterToCombatant(monster, m.init, m.hp, m.name, slot.faction));
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
				view: 'encounters'
			});
		}
	}

	// Add a wave

	private openAddWaveModal() {
		const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
		if (combat) {
			const setup = Factory.createCombatSetup();
			setup.encounter = combat.encounter;
			setup.slotInfo = Gygax.getCombatSlotData(combat.encounter, this.state.library);

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
					const monster = this.getMonster(slot.monsterID);
					const slotInfo = combatSetup.slotInfo.find(info => info.id === slot.id);
					if (monster && slotInfo) {
						slotInfo.members.forEach(m => {
							combat.combatants.push(Napoleon.convertMonsterToCombatant(monster, m.init, m.hp, m.name, slot.faction));
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
			setup.slotInfo = Gygax.getCombatSlotData(setup.encounter, this.state.library);

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
			const group = this.state.library.find(g => g.monsters.find(m => m.id === monster.id));
			if (group) {
				const slot = Factory.createEncounterSlot();
				slot.id = monster.id;
				slot.monsterID = monster.id;
				slot.monsterName = monster.name;
				slot.monsterGroupName = group.name;
				combatSetup.encounter.slots.push(slot);

				combatSetup.slotInfo = Gygax.getCombatSlotData(combatSetup.encounter, this.state.library);

				this.setState({
					drawer: this.state.drawer
				});
			}
		}
	}

	private addCombatantsToCombat() {
		const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
		const combatSetup: CombatSetup = this.state.drawer.combatSetup;
		if (combat && combatSetup && combatSetup.encounter) {
			combatSetup.encounter.slots.forEach(slot => {
				const monster = this.getMonster(slot.monsterID);
				const slotInfo = combatSetup.slotInfo.find(info => info.id === slot.id);
				if (monster && slotInfo) {
					slotInfo.members.forEach(m => {
						combat.combatants.push(Napoleon.convertMonsterToCombatant(monster, m.init, m.hp, m.name, slot.faction));
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
			view: 'encounters',
			selectedCombatID: combat.id
		});
	}

	private endCombat(combat: Combat, goToMap: boolean = false) {
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
				combatants.forEach(c => {
					c.current = false;
					c.pending = true;
					c.active = false;
					c.defeated = false;
					c.initiative = 10;
				});

				// See if we can work out the party ID from the combatants
				let partyID: string | null = null;
				const pcs = combatants.filter(c => c.type === 'pc');
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
						});
					}
				}

				Utils.sort(combatants, [{ field: 'displayName', dir: 'asc' }]);

				if (partyID) {
					// If there's already an exploration with this map and party, update it, otherwise, create it
					const mapID = combat.map.id;
					let exploration = this.state.explorations.find(e => (e.map.id === mapID) && (e.partyID === partyID));
					if (!exploration) {
						exploration = Factory.createExploration();
						exploration.name = combat.name + 'in ' + combat.map.name;
						exploration.partyID = partyID;
						this.state.explorations.push(exploration);
					}
					exploration.map = combat.map;
					exploration.fog = combat.fog;
					exploration.combatants = combatants;

					// Clear the map of any monsters
					exploration.map.items = exploration.map.items.filter(i => (i.type === 'tile') || (i.type === 'pc') || (i.type === 'companion'));

					// Go to map view
					this.setState({
						view: 'maps',
						explorations: this.state.explorations,
						selectedExplorationID: exploration.id
					});
				}
			}
		});
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

	// Map methods

	private scatterCombatants(type: 'pc' | 'monster') {
		const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
		if (combat && combat.map) {
			Mercator.scatterCombatants(combat, type);
			this.setMountPositions(combat.combatants, combat.map);

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

	//#region Combat and exploration

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
			explorations: this.state.explorations
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

				if (this.state.view === 'encounters') {
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
			}
		});

		this.setState({
			combats: this.state.combats,
			explorations: this.state.explorations
		});
	}

	private toggleHidden(combatants: Combatant[]) {
		combatants.forEach(c => {
			c.showOnMap = !c.showOnMap;
		});

		this.setState({
			combats: this.state.combats,
			explorations: this.state.explorations
		});
	}

	private addCondition(combatants: Combatant[], allCombatants: Combatant[]) {
		const condition = Factory.createCondition();
		condition.name = 'blinded';

		this.setState({
			drawer: {
				type: 'condition-add',
				condition: condition,
				combatants: combatants,
				allCombatants: allCombatants
			}
		});
	}

	private addConditionFromModal() {
		this.state.drawer.combatants.forEach((combatant: Combatant) => {
			const condition: Condition = JSON.parse(JSON.stringify(this.state.drawer.condition));
			condition.id = Utils.guid();
			combatant.conditions.push(condition);
			Utils.sort(combatant.conditions, [{ field: 'name', dir: 'asc' }]);

			if (this.state.view === 'encounters') {
				const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
				if (combat) {
					const current = combat.combatants.find(c => c.current);
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
			explorations: this.state.explorations,
			drawer: null
		});
	}

	private editCondition(combatant: Combatant, condition: Condition, allCombatants: Combatant[]) {
		this.setState({
			drawer: {
				type: 'condition-edit',
				condition: condition,
				combatants: [combatant],
				allCombatants: allCombatants
			}
		});
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
			explorations: this.state.explorations,
			drawer: null
		});
	}

	private removeCondition(combatant: Combatant, condition: Condition) {
		const index = combatant.conditions.indexOf(condition);
		combatant.conditions.splice(index, 1);

		if (this.state.view === 'encounters') {
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
		}

		this.setState({
			combats: this.state.combats,
			explorations: this.state.explorations
		});
	}

	private rotateMap(map: Map) {
		Mercator.rotateMap(map);

		this.setState({
			combats: this.state.combats,
			explorations: this.state.explorations
		});
	}

	private mapAdd(combatant: Combatant, x: number, y: number, currentCombatants: Combatant[], map: Map) {
		const combatants = [combatant];
		if (!!combatant.mountID) {
			const mount = currentCombatants.find(cmb => cmb.id === combatant.mountID);
			if (mount) {
				combatants.push(mount);
			}
		}
		combatants.forEach(c => {
			if (map) {
				// Make sure no-one is already on the map
				const ids = combatants.map(cbt => cbt.id);
				map.items = map.items.filter(i => !ids.includes(i.id));
			}

			const item = Factory.createMapItem();
			item.id = c.id;
			item.type = c.type as 'pc' | 'monster' | 'companion';
			item.x = x;
			item.y = y;

			const size = Gygax.miniSize(c.displaySize);
			item.height = size;
			item.width = size;

			if (map) {
				map.items.push(item);
			}
		});

		this.setState({
			combats: this.state.combats,
			explorations: this.state.explorations
		});
	}

	private mapMove(ids: string[], dir: string, combatants: Combatant[], map: Map) {
		ids.forEach(id => {
			if (map) {
				const item = map.items.find(i => i.id === id);
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

					if (this.state.view === 'encounters') {
						const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
						if (combat) {
							if (item.type === 'pc') {
								const entry = Factory.createCombatReportEntry();
								entry.type = 'movement';
								entry.combatantID = item.id;
								combat.report.push(entry);
							}
						}
					}
				}
			}
		});

		this.setMountPositions(combatants, map);

		this.setState({
			combats: this.state.combats,
			explorations: this.state.explorations
		});
	}

	private mapRemove(ids: string[], combatants: Combatant[], map: Map) {
		const allIDs = [...ids];
		ids.forEach(id => {
			const combatant = combatants.find(cbt => cbt.id === id);
			if (combatant && combatant.mountID) {
				allIDs.push(combatant.mountID);
			}
		});

		allIDs.forEach(id => {
			const item = map.items.find(i => i.id === id);
			if (item) {
				const index = map.items.indexOf(item);
				map.items.splice(index, 1);
			}
		});

		this.setState({
			combats: this.state.combats,
			explorations: this.state.explorations
		});
	}

	private setMountPositions(combatants: Combatant[], map: Map) {
		combatants.forEach(c => {
			if (c.mountID) {
				// Set mount location to equal rider location
				const riderItem = map.items.find(i => i.id === c.id);
				const mountItem = map.items.find(i => i.id === c.mountID);
				if (riderItem && mountItem) {
					mountItem.x = riderItem.x;
					mountItem.y = riderItem.y;
				}
			}
		});
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
				this.saveKey(this.state.combats, 'data-combats');
				break;
			case 'maps':
				this.saveKey(this.state.maps, 'data-maps');
				this.saveKey(this.state.explorations, 'data-explorations');
				break;
		}
	}

	private saveAll() {
		this.saveKey(this.state.parties, 'data-parties');
		this.saveKey(this.state.library, 'data-library');
		this.saveKey(this.state.encounters, 'data-encounters');
		this.saveKey(this.state.maps, 'data-maps');
		this.saveKey(this.state.combats, 'data-combats');
		this.saveKey(this.state.explorations, 'data-explorations');
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
				}
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
						openStatBlock={pc => this.setState({drawer: { type: 'statblock', source: pc }})}
					/>
				);
			case 'library':
				if (this.state.selectedMonsterGroupID) {
					return (
						<MonsterGroupScreen
							monsterGroup={this.state.library.find(g => g.id === this.state.selectedMonsterGroupID) as MonsterGroup}
							library={this.state.library}
							encounters={this.state.encounters}
							goBack={() => this.selectMonsterGroup(null)}
							removeMonsterGroup={() => this.removeCurrentMonsterGroup()}
							openDemographics={group => this.openDemographics(group)}
							addMonster={monster => this.addMonster(monster)}
							importMonster={() => this.importMonster()}
							removeMonster={monster => this.removeMonster(monster)}
							changeValue={(monster, type, value) => this.changeValue(monster, type, value)}
							nudgeValue={(monster, type, delta) => this.nudgeValue(monster, type, delta)}
							viewMonster={monster => this.setState({drawer: { type: 'statblock', source: monster }})}
							editMonster={monster => this.editMonster(monster)}
							cloneMonster={(monster, name) => this.cloneMonster(monster, name)}
							moveToGroup={(monster, groupID) => this.moveToGroup(monster, groupID)}
						/>
					);
				}
				return (
					<MonsterGroupListScreen
						library={this.state.library}
						hasMonsters={hasMonsters}
						addMonsterGroup={() => this.addMonsterGroup()}
						importMonsterGroup={() => this.importMonsterGroup()}
						selectMonsterGroup={group => this.selectMonsterGroup(group)}
						deleteMonsterGroup={group => this.removeMonsterGroup(group)}
						addOpenGameContent={() => this.addOpenGameContent()}
						openStatBlock={monster => this.setState({drawer: { type: 'statblock', source: monster }})}
						openDemographics={group => this.openDemographics(group)}
					/>
				);
			case 'encounters':
				if (this.state.selectedCombatID) {
					return (
						<CombatScreen
							combat={this.state.combats.find(c => c.id === this.state.selectedCombatID) as Combat}
							parties={this.state.parties}
							library={this.state.library}
							encounters={this.state.encounters}
							pauseCombat={() => this.pauseCombat()}
							endCombat={(combat, goToMap) => this.endCombat(combat, goToMap)}
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
							addCondition={combatants => {
								const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID) as Combat;
								this.addCondition(combatants, combat.combatants);
							}}
							editCondition={(combatant, condition) => {
								const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID) as Combat;
								this.editCondition(combatant, condition, combat.combatants);
							}}
							removeCondition={(combatant, condition) => this.removeCondition(combatant, condition)}
							mapAdd={(combatant, x, y) => {
								const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID) as Combat;
								this.mapAdd(combatant, x, y, combat.combatants, combat.map as Map);
							}}
							mapMove={(ids, dir) => {
								const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID) as Combat;
								this.mapMove(ids, dir, combat.combatants, combat.map as Map);
							}}
							mapRemove={ids => {
								const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID) as Combat;
								this.mapRemove(ids, combat.combatants, combat.map as Map);
							}}
							endTurn={combatant => this.endTurn(combatant)}
							changeHP={values => this.changeHP(values)}
							closeNotification={(notification, removeCondition) => this.closeNotification(notification, removeCondition)}
							toggleTag={(combatants, tag) => this.toggleTag(combatants, tag)}
							toggleCondition={(combatants, condition) => this.toggleCondition(combatants, condition)}
							toggleHidden={combatants => this.toggleHidden(combatants)}
							scatterCombatants={type => this.scatterCombatants(type)}
							rotateMap={() => {
								const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID) as Combat;
								this.rotateMap(combat.map as Map);
							}}
							setFog={fog => this.setFog(fog)}
							addOverlay={overlay => this.addMapItem(overlay)}
							showLeaderboard={() => this.showLeaderboard()}
							onRollDice={(count, sides, constant) => this.setDice(count, sides, constant)}
						/>
					);
				}
				if (this.state.selectedEncounterID) {
					return (
						<EncounterScreen
							encounter={this.state.encounters.find(e => e.id === this.state.selectedEncounterID) as Encounter}
							parties={this.state.parties}
							edit={encounter => this.editEncounter(encounter)}
							delete={encounter => this.removeEncounter(encounter)}
							run={(encounter, partyID) => this.createCombat(encounter, partyID)}
							getMonster={id => this.getMonster(id)}
							changeValue={(encounter, type, value) => this.changeValue(encounter, type, value)}
							goBack={() => this.selectEncounter(null)}
						/>
					);
				}
				return (
					<EncounterListScreen
						encounters={this.state.encounters}
						combats={this.state.combats}
						parties={this.state.parties}
						hasMonsters={hasMonsters}
						addEncounter={templateID => this.addEncounter(templateID)}
						viewEncounter={encounter => this.selectEncounter(encounter)}
						editEncounter={encounter => this.editEncounter(encounter)}
						cloneEncounter={(encounter, name) => this.cloneEncounter(encounter, name)}
						deleteEncounter={encounter => this.removeEncounter(encounter)}
						runEncounter={(encounter, partyID) => this.createCombat(encounter, partyID)}
						getMonster={id => this.getMonster(id)}
						setView={view => this.setView(view)}
						openStatBlock={monster => this.setState({drawer: { type: 'statblock', source: monster }})}
						resumeCombat={combat => this.resumeCombat(combat)}
						deleteCombat={combat => this.endCombat(combat)}
					/>
				);
			case 'maps':
				if (this.state.selectedExplorationID) {
					return (
						<ExplorationScreen
							exploration={this.state.explorations.find(e => e.id === this.state.selectedExplorationID) as Exploration}
							startCombat={ex => this.createCombat(null, ex.partyID, ex.map, ex.fog, ex.combatants)}
							toggleTag={(combatants, tag) => this.toggleTag(combatants, tag)}
							toggleCondition={(combatants, condition) => this.toggleCondition(combatants, condition)}
							toggleHidden={combatants => this.toggleHidden(combatants)}
							addCondition={combatants => {
								const ex = this.state.explorations.find(e => e.id === this.state.selectedExplorationID) as Exploration;
								this.addCondition(combatants, ex.combatants);
							}}
							editCondition={(combatant, condition) => {
								const ex = this.state.explorations.find(e => e.id === this.state.selectedExplorationID) as Exploration;
								this.editCondition(combatant, condition, ex.combatants);
							}}
							removeCondition={(combatant, condition) => this.removeCondition(combatant, condition)}
							changeValue={(source, field, value) => this.changeValue(source, field, value)}
							fillFog={() => this.fillFog()}
							clearFog={() => this.clearFog()}
							toggleFog={(x1, y1, x2, y2) => this.toggleFog(x1, y1, x2, y2)}
							addCompanion={companion => this.addCompanionToExploration(companion)}
							mapAdd={(combatant, x, y) => {
								const ex = this.state.explorations.find(e => e.id === this.state.selectedExplorationID) as Exploration;
								this.mapAdd(combatant, x, y, ex.combatants, ex.map);
							}}
							mapMove={(ids, dir) => {
								const ex = this.state.explorations.find(e => e.id === this.state.selectedExplorationID) as Exploration;
								this.mapMove(ids, dir, ex.combatants, ex.map);
							}}
							mapRemove={ids => {
								const ex = this.state.explorations.find(e => e.id === this.state.selectedExplorationID) as Exploration;
								this.mapRemove(ids, ex.combatants, ex.map);
							}}
							rotateMap={() => {
								const ex = this.state.explorations.find(e => e.id === this.state.selectedExplorationID) as Exploration;
								this.rotateMap(ex.map);
							}}
							pauseExploration={() => this.pauseExploration()}
							endExploration={exploration => this.endExploration(exploration)}
						/>
					);
				}
				if (this.state.selectedMapID) {
					return (
						<MapScreen
							map={this.state.maps.find(m => m.id === this.state.selectedMapID) as Map}
							parties={this.state.parties}
							edit={map => this.editMap(map)}
							delete={map => this.removeMap(map)}
							startExploration={(map, partyID) => this.startExploration(map, partyID)}
							changeValue={(map, type, value) => this.changeValue(map, type, value)}
							goBack={() => this.selectMap(null)}
						/>
					);
				}
				return (
					<MapListScreen
						maps={this.state.maps}
						parties={this.state.parties}
						explorations={this.state.explorations}
						addMap={() => this.editMap(null)}
						importMap={() => this.importMap()}
						generateMap={(type) => this.generateMap(type)}
						viewMap={map => this.selectMap(map)}
						editMap={map => this.editMap(map)}
						cloneMap={(map, name) => this.cloneMap(map, name)}
						deleteMap={map => this.removeMap(map)}
						explore={(map, partyID) => this.startExploration(map, partyID)}
						resumeExploration={ex => this.resumeExploration(ex)}
						deleteExploration={ex => this.endExploration(ex)}
					/>
				);
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
				const monsters: Monster[] = [];
				this.state.library.forEach(g => {
					g.monsters.forEach(m => monsters.push(m));
				});
				Utils.sort(monsters);
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
						selectedPartyID={this.state.sidebar.selectedPartyID}
						parties={this.state.parties}
						selectPartyID={id => {
							const sidebar = this.state.sidebar;
							sidebar.selectedPartyID = id;
							this.setState({
								sidebar: sidebar
							});
						}}
						selectedMonsterID={this.state.sidebar.selectedMonsterID}
						monsters={monsters}
						selectMonsterID={id => {
							const sidebar = this.state.sidebar;
							sidebar.selectedMonsterID = id;
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
				case 'statblock':
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
				case 'encounter-edit':
					content = (
						<EncounterEditorModal
							encounter={this.state.drawer.encounter}
							parties={this.state.parties}
							library={this.state.library}
							getMonster={id => this.getMonster(id)}
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
						<Row gutter={10}>
							<Col span={12}>
								<button onClick={() => this.acceptImportedMap()}>save changes</button>
							</Col>
							<Col span={12}>
								<button onClick={() => this.declineImportedMap()}>discard changes</button>
							</Col>
						</Row>
					);
					width = '75%';
					closable = false;
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
							getMonster={id => this.getMonster(id)}
							notify={() => this.setState({drawer: this.state.drawer})}
						/>
					);
					header = 'start combat';
					footer = (
						<button
							className={this.state.drawer.combatSetup.party && this.state.drawer.combatSetup.encounter ? '' : 'disabled'}
							onClick={() => this.startCombat()}
						>
							start combat
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
							getMonster={id => this.getMonster(id)}
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
							getMonster={id => this.getMonster(id)}
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
							<div className={this.state.sidebar ? 'content with-sidebar' : 'content'}>{this.getContent()}</div>
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
