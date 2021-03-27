import { CloseCircleOutlined } from '@ant-design/icons';
import { Col, Drawer, notification, Row } from 'antd';
import Mousetrap from 'mousetrap';
import React from 'react';

import { Factory } from '../../utils/factory';
import { Frankenstein } from '../../utils/frankenstein';
import { Gygax } from '../../utils/gygax';
import { Matisse } from '../../utils/matisse';
import { Mercator } from '../../utils/mercator';
import { Napoleon } from '../../utils/napoleon';
import { Shakespeare } from '../../utils/shakespeare';
import { Comms, CommsDM } from '../../utils/uhura';
import { Utils } from '../../utils/utils';
import { Verne } from '../../utils/verne';

import { Adventure, Plot, Scene, SceneLink, SceneResource } from '../../models/adventure';
import { Combat, Combatant, CombatSetup, Notification } from '../../models/combat';
import { Condition } from '../../models/condition';
import { Encounter, EncounterSlot, EncounterWave } from '../../models/encounter';
import { Exploration, Map, MapArea, MapItem } from '../../models/map';
import { Options, Sidebar } from '../../models/misc';
import { Monster, MonsterGroup, Trait } from '../../models/monster';
import { Companion, Party, PC } from '../../models/party';

import { ErrorBoundary, RenderError } from '../error';
import { CombatStartModal } from '../modals/combat-start-modal';
import { ConditionModal } from '../modals/condition-modal';
import { DemographicsModal } from '../modals/demographics-modal';
import { MonsterEditorModal } from '../modals/editors/monster-editor-modal';
import { PCEditorModal } from '../modals/editors/pc-editor-modal';
import { ImageSelectionModal } from '../modals/image-selection-modal';
import { AdventureImportModal } from '../modals/import/adventure-import-modal';
import { MapImportModal } from '../modals/import/map-import-modal';
import { MonsterGroupImportModal } from '../modals/import/monster-group-import-modal';
import { MonsterImportModal } from '../modals/import/monster-import-modal';
import { PartyImportModal } from '../modals/import/party-import-modal';
import { PCImportModal } from '../modals/import/pc-import-modal';
import { EncounterSelectionModal } from '../modals/encounter-selection-modal';
import { MapSelectionModal } from '../modals/map-selection-modal';
import { MarkdownModal } from '../modals/markdown-modal';
import { MonsterSelectionModal } from '../modals/monster-selection-modal';
import { RandomGeneratorModal } from '../modals/random-generator-modal';
import { StatBlockModal } from '../modals/stat-block-modal';
import { ThemeSelectionModal } from '../modals/theme-selection-modal';
import { CombatNotificationPanel } from '../panels/combat-notification-panel';
import { DieRollResultPanel } from '../panels/die-roll-panel';
import { PageFooter } from '../panels/page-footer';
import { PageHeader } from '../panels/page-header';
import { PageSidebar } from '../panels/page-sidebar';
import { MessagePanel } from '../panels/session-panel';
import { AdventureListScreen } from '../screens/adventure-list-screen';
import { AdventureScreen } from '../screens/adventure-screen';
import { CombatScreen } from '../screens/combat-screen';
import { EncounterListScreen } from '../screens/encounter-list-screen';
import { EncounterScreen } from '../screens/encounter-screen';
import { ExplorationScreen } from '../screens/exploration-screen';
import { HomeScreen } from '../screens/home-screen';
import { MapListScreen } from '../screens/map-list-screen';
import { MapScreen } from '../screens/map-screen';
import { MonsterGroupListScreen } from '../screens/monster-group-list-screen';
import { MonsterGroupScreen } from '../screens/monster-group-screen';
import { PartyListScreen } from '../screens/party-list-screen';
import { PartyScreen } from '../screens/party-screen';

interface Props {
}

interface State {
	view: string;
	drawer: any;
	sidebar: Sidebar;

	parties: Party[];
	library: MonsterGroup[];
	encounters: Encounter[];
	maps: Map[];
	adventures: Adventure[];
	combats: Combat[];
	explorations: Exploration[];
	options: Options;

	selectedPartyID: string | null;
	selectedMonsterGroupID: string | null;
	selectedEncounterID: string | null;
	selectedMapID: string | null;
	selectedAdventureID: string | null;
	selectedCombatID: string | null;
	selectedExplorationID: string | null;
}

export class Main extends React.Component<Props, State> {

	//#region Constructor

	constructor(props: Props) {
		super(props);

		let parties: Party[] = [];
		try {
			const str = window.localStorage.getItem('data-parties');
			if (str) {
				parties = JSON.parse(str);

				parties.forEach(party => {
					if (party.awards === undefined) {
						party.awards = [];
					}

					party.pcs.forEach(pc => {
						if (pc.darkvision === undefined) {
							pc.darkvision = 0;
						}

						if (pc.awards === undefined) {
							pc.awards = [];
						}
					});
				});
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
						if (m.acInfo === undefined) {
							m.acInfo = '';
						}
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
						if (slot.faction === undefined) {
							slot.faction = 'foe';
						}
					});

					encounter.waves.forEach(wave => {
						wave.slots.forEach(slot => {
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
					m.items.forEach(item => {
						if (item.customLink === undefined) {
							item.customLink = '';
						}
						if (item.z === undefined) {
							item.z = 0;
						}
						if (item.depth === undefined) {
							item.depth = 1;
						}
					});
					if (m.areas === undefined) {
						m.areas = [];
					}
					m.areas.forEach(area => {
						if (area.z === undefined) {
							area.z = 0;
						}
						if (area.depth === undefined) {
							area.depth = 1;
						}
					});
				});
			}
		} catch (ex) {
			console.error('Could not parse JSON: ', ex);
		}

		let adventures: Adventure[] = [];
		try {
			const str = window.localStorage.getItem('data-adventures');
			if (str) {
				adventures = JSON.parse(str);
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
						if (c.darkvision === undefined) {
							c.darkvision = 0;
						}
						if (c.lightSource === undefined) {
							c.lightSource = null;
						}
						if (c.path === undefined) {
							c.path = null;
						}
					});

					if (combat.encounter) {
						combat.encounter.slots.forEach(slot => {
							if (slot.roles === undefined) {
								slot.roles = [];
							}
							if (slot.faction === undefined) {
								slot.faction = 'foe';
							}
						});

						combat.encounter.waves.forEach(wave => {
							wave.slots.forEach(slot => {
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
						combat.map.items.forEach(item => {
							if (item.customLink === undefined) {
								item.customLink = '';
							}
							if (item.z === undefined) {
								item.z = 0;
							}
							if (item.depth === undefined) {
								item.depth = 1;
							}
						});
						if (combat.map.areas === undefined) {
							combat.map.areas = [];
						}
						combat.map.areas.forEach(area => {
							if (area.z === undefined) {
								area.z = 0;
							}
							if (area.depth === undefined) {
								area.depth = 1;
							}
						});
					}

					if (combat.fog === undefined) {
						combat.fog = [];
					}

					if (combat.lighting === undefined) {
						combat.lighting = 'bright light';
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
					ex.map.items.forEach(item => {
						if (item.customLink === undefined) {
							item.customLink = '';
						}
					});
					if (ex.map.areas === undefined) {
						ex.map.areas = [];
					}
					ex.combatants.forEach(c => {
						if (c.darkvision === undefined) {
							c.darkvision = 0;
						}
						if (c.lightSource === undefined) {
							c.lightSource = null;
						}
						if (c.path === undefined) {
							c.path = null;
						}
					});

					if (ex.lighting === undefined) {
						ex.lighting = 'bright light';
					}
				});
			}
		} catch (ex) {
			console.error('Could not parse JSON: ', ex);
		}

		let options: Options = {
			showMonsterDieRolls: false,
			showAwards: false,
			theme: 'light',
			diagonals: 'onepointfive',
			featureFlags: []
		};
		try {
			const str = window.localStorage.getItem('data-options');
			if (str) {
				options = JSON.parse(str);

				if (options.showAwards === undefined) {
					options.showAwards = false;
				}
				if (options.theme === undefined) {
					options.theme = 'light';
				}
				if (options.diagonals === undefined) {
					options.diagonals = 'onepointfive';
				}
				if (options.featureFlags === undefined) {
					options.featureFlags = [];
				}
			}
		} catch (ex) {
			console.error('Could not parse JSON: ', ex);
		}

		const dice: { [sides: number]: number } = {};
		[4, 6, 8, 10, 12, 20, 100].forEach(n => dice[n] = 0);
		dice[20] = 1;

		this.state = {
			view: 'home',
			drawer: null,
			sidebar: {
				visible: false,
				type: 'tools',
				subtype: 'die',
				dice: dice,
				constant: 0,
				dieRolls: [],
				handout: null,
				languageMode: 'common',
				languagePreset: Shakespeare.getLanguagePresets()[0].name,
				selectedLanguages: Shakespeare.getLanguagePresets()[0].languages,
				languageOutput: [],
				surge: '',
				draws: [],
				npc: null,
				selectedPartyID: null,
				selectedMonsterID: null
			},
			parties: parties,
			library: library,
			encounters: encounters,
			maps: maps,
			adventures: adventures,
			combats: combats,
			explorations: explorations,
			options: options,
			selectedPartyID: null,
			selectedMonsterGroupID: null,
			selectedEncounterID: null,
			selectedMapID: null,
			selectedAdventureID: null,
			selectedCombatID: null,
			selectedExplorationID: null
		};

		Matisse.clearUnusedImages(maps, adventures, combats, explorations);
	}

	//#endregion

	//#region Lifecycle

	public componentDidMount() {
		Mousetrap.bind('ctrl+f', e => {
			e.preventDefault();
			this.setSidebar('search');
		});

		CommsDM.onStateChanged = () => this.setState(this.state);
		CommsDM.onDataChanged = () => this.setState(this.state);
		CommsDM.onNewConnection = name => {
			const peopleVisible = this.state.sidebar.visible && (this.state.sidebar.type === 'session') && (this.state.sidebar.subtype === 'people');
			if (!peopleVisible) {
				notification.open({
					message: (
						<div className='section'>
							<b>{name}</b> has joined
						</div>
					),
					closeIcon: <CloseCircleOutlined />,
					duration: 5
				});
			}
		};
		Comms.onNewMessage = message => {
			const messagesVisible = this.state.sidebar.visible && (this.state.sidebar.type === 'session') && (this.state.sidebar.subtype === 'messages');
			if (!messagesVisible) {
				notification.open({
					message: (
						<MessagePanel
							user='dm'
							message={message}
							showByline={true}
							openImage={data => this.setState({drawer: { type: 'image', data: data }})}
						/>
					),
					closeIcon: <CloseCircleOutlined />,
					duration: 5
				});
			}
		};
	}

	public componentWillUnmount() {
		Mousetrap.unbind('ctrl+f');

		CommsDM.onStateChanged = null;
		CommsDM.onDataChanged = null;
		CommsDM.onNewConnection = null;
		Comms.onNewMessage = null;

		CommsDM.shutdown();
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

	private setSidebar(type: string) {
		let subtype = '';
		switch (type) {
			case 'tools':
				subtype = 'die';
				break;
			case 'generators':
				subtype = 'name';
				break;
			case 'reference':
				subtype = 'skills';
				break;
			case 'session':
				subtype = 'management';
				break;
			case 'about':
				subtype = 'dojo';
				break;
		}

		const sidebar = this.state.sidebar;
		sidebar.visible = true;
		sidebar.type = type;
		sidebar.subtype = subtype;

		this.setState({
			sidebar: sidebar
		});
	}

	private openDice() {
		const sidebar = this.state.sidebar;
		sidebar.visible = true;
		sidebar.type = 'tools';
		sidebar.subtype = 'die';

		sidebar.dice = {};
		[4, 6, 8, 10, 12, 20, 100].forEach(n => sidebar.dice[n] = 0);
		sidebar.dice[6] = 1;

		this.setState({
			sidebar: sidebar
		});
	}

	private openSceneResource(resource: SceneResource) {
		let src = resource.content;
		if (resource.type === 'image') {
			const img = Matisse.getImage(resource.content);
			if (img) {
				src = img.data;
			}
		}

		const sidebar = this.state.sidebar;
		sidebar.visible = true;
		sidebar.type = 'tools';
		sidebar.subtype = 'handout';
		sidebar.handout = {
			type: resource.type,
			src: src
		};

		this.setState({
			sidebar: sidebar
		});
	}

	private toggleSidebar() {
		const sidebar = this.state.sidebar;
		sidebar.visible = !sidebar.visible;
		this.setState({
			sidebar: sidebar
		});
	}

	private closeDrawer() {
		this.setState({
			drawer: null
		});
	}

	private selectParty(party: Party | null) {
		this.setState({
			view: 'parties',
			selectedPartyID: party ? party.id : null
		});
	}

	private selectMonsterGroup(group: MonsterGroup | null) {
		this.setState({
			view: 'library',
			selectedMonsterGroupID: group ? group.id : null
		});
	}

	private selectEncounter(encounter: Encounter | null) {
		this.setState({
			view: 'encounters',
			selectedEncounterID: encounter ? encounter.id : null
		});
	}

	private selectMap(map: Map | null) {
		this.setState({
			view: 'maps',
			selectedMapID: map ? map.id : null
		});
	}

	private selectAdventure(adventure: Adventure | null) {
		this.setState({
			view: 'adventures',
			selectedAdventureID: adventure ? adventure.id : null
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
			selectedEncounterID: id,
			selectedCombatID: null
		});
	}

	private selectMapByID(id: string | null) {
		this.save();
		this.setState({
			view: 'maps',
			selectedMapID: id,
			selectedExplorationID: null
		});
	}

	private selectAdventureByID(id: string | null) {
		this.save();
		this.setState({
			view: 'adventures',
			selectedAdventureID: id
		});
	}

	private selectCombatByID(id: string | null) {
		this.save();
		this.setState({
			view: 'encounters',
			selectedEncounterID: null,
			selectedCombatID: id
		});
	}

	private selectExplorationByID(id: string | null) {
		this.save();
		this.setState({
			view: 'maps',
			selectedMapID: null,
			selectedExplorationID: id
		});
	}

	private rollDice(text: string, count: number, sides: number, constant: number, mode: '' | 'advantage' | 'disadvantage') {
		const dice: { [sides: number]: number } = {};
		[4, 6, 8, 10, 12, 20, 100].forEach(n => dice[n] = 0);
		dice[sides] = count;

		const result = Gygax.rollDice(text, dice, constant, mode);

		const sidebar = this.state.sidebar;
		sidebar.dieRolls.unshift(result);

		this.setState({
			sidebar: sidebar
		}, () => {
			notification.open({
				key: result.id,
				message: (
					<DieRollResultPanel result={result} />
				),
				closeIcon: <CloseCircleOutlined />,
				duration: 5
			});
		});
	}

	private openSession() {
		const sidebar = this.state.sidebar;
		sidebar.visible = true;
		sidebar.type = 'session';
		sidebar.subtype = 'management';

		this.setState({
			sidebar: sidebar
		});
	}

	private showMarkdown(title: string, content: string) {
		this.setState({
			drawer: {
				type: 'markdown',
				title: title,
				content: content
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
		Utils.sort(this.state.adventures);
		Utils.sort(this.state.combats);
		Utils.sort(this.state.explorations);

		if (type === 'initiative') {
			if (!(combatant as Combatant).pending) {
				const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
				Napoleon.sortCombatants(combat as Combat);
			}
		}

		if (type === 'hpCurrent') {
			const c = combatant as Combatant;
			c.hpCurrent = Math.min(c.hpCurrent || 0, c.hpMax || 0);
			c.hpCurrent = Math.max(c.hpCurrent || 0, 0);
		}

		if (type === 'hpTemp') {
			const c = combatant as Combatant;
			c.hpTemp = Math.max(c.hpTemp || 0, 0);
		}

		if (type === 'mountID') {
			const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
			if (combat && combat.map) {
				Napoleon.setMountPositions(combat.combatants, combat.map);
			}
		}

		this.setState({
			parties: this.state.parties,
			library: this.state.library,
			encounters: this.state.encounters,
			maps: this.state.maps,
			adventures: this.state.adventures,
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

		let parties = this.state.parties;
		parties.push(party);
		parties = Utils.sort(parties);

		this.setState({
			parties: parties,
			selectedPartyID: party.id
		});
	}

	private deleteParty(party: Party) {
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

	private setPartyLevel(party: Party, level: number) {
		party.pcs.filter(pc => pc.active).forEach(pc => pc.level = level);
		this.setState({
			parties: this.state.parties
		});
	}

	private showPartyReference(party: Party) {
		const sidebar = this.state.sidebar;
		sidebar.visible = true;
		sidebar.type = 'reference';
		sidebar.subtype = 'party';
		sidebar.selectedPartyID = party.id;

		this.setState({
			sidebar: sidebar
		});
	}

	private clonePC(pc: PC, name: string) {
		const party = this.state.parties.find(p => p.pcs.includes(pc));
		if (party) {
			const clone: PC = JSON.parse(JSON.stringify(pc));
			clone.id = Utils.guid();
			clone.name = name;

			party.pcs.push(clone);
			Utils.sort(party.pcs);

			this.setState({
				parties: this.state.parties
			});
		}
	}

	private moveToParty(pc: PC, partyID: string) {
		const sourceParty = this.state.parties.find(party => party.pcs.includes(pc));
		if (sourceParty) {
			const index = sourceParty.pcs.indexOf(pc);
			sourceParty.pcs.splice(index, 1);

			const party = this.state.parties.find(p => p.id === partyID);
			if (party) {
				party.pcs.push(pc);
				Utils.sort(party.pcs);

				this.setState({
					parties: this.state.parties
				});
			}
		}
	}

	private deletePC(pc: PC) {
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

		let groups = this.state.library;
		groups.push(group);
		groups = Utils.sort(groups);

		this.setState({
			library: groups,
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

	private deleteMonsterGroup(group: MonsterGroup) {
		const index = this.state.library.indexOf(group);
		this.state.library.splice(index, 1);
		this.setState({
			library: this.state.library,
			selectedMonsterGroupID: null
		});
	}

	private deleteMonster(monster: Monster) {
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

	private addMonster() {
		this.setState({
			drawer: {
				type: 'monster',
				monster: Factory.createMonster()
			}
		});
	}

	private generateMonster() {
		const group = this.state.library.find(g => g.id === this.state.selectedMonsterGroupID);
		if (group) {
			let cr = 1;
			let sizes: string[] = [];
			let types: string[] = [];
			let roles: string[] = [];

			if (group.monsters.length > 0) {
				cr = Math.round(group.monsters.map(m => m.challenge).reduce((a, b) => a + b, 0) / group.monsters.length);
				sizes = group.monsters.map(m => m.size).filter((value, index, array) => array.indexOf(value) === index);
				types = group.monsters.map(m => m.category).filter((value, index, array) => array.indexOf(value) === index);
				roles = group.monsters.map(m => m.role).filter((value, index, array) => array.indexOf(value) === index);
			}

			this.setState({
				drawer: {
					type: 'random-monster',
					data: {
						cr: cr,
						size: sizes.length === 1 ? sizes[0] : null,
						type: types.length === 1 ? types[0] : null,
						role: roles.length === 1 ? roles[0] : null
					},
					canAccept: () => {
						const data = this.state.drawer.data;
						const monsters = Frankenstein.filterMonsters(this.state.library, data.cr, data.size, data.type, data.role);
						return monsters.length >= 2;
					},
					onAccept: () => {
							const data = this.state.drawer.data;
							const monsters = Frankenstein.filterMonsters(this.state.library, data.cr, data.size, data.type, data.role);

							const monster = Factory.createMonster();
							Frankenstein.spliceMonsters(monster, monsters);
							monster.name = Shakespeare.capitalise(Shakespeare.generateName());
							monster.challenge = data.cr;

							group.monsters.push(monster);
							Utils.sort(group.monsters);

							this.setState({
								view: 'library',
								library: this.state.library,
								drawer: {
									type: 'statblock',
									source: monster
								}
							});
					}
				}
			});
		}
	}

	private editMonster(monster: Monster) {
		const copy = JSON.parse(JSON.stringify(monster));
		this.setState({
			drawer: {
				type: 'monster',
				monster: copy
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

	private cloneMonster(monster: Monster, name: string) {
		const group = this.state.library.find(g => g.monsters.includes(monster));
		if (group) {
			const clone: Monster = JSON.parse(JSON.stringify(monster));
			clone.id = Utils.guid();
			clone.name = name;
			clone.traits.forEach(t => t.id = Utils.guid());

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

		if (templateName) {
			const template = Napoleon.encounterTemplates().find(t => t.name === templateName);
			if (template) {
				encounter.slots = template.slots.map(s => {
					const slot = Factory.createEncounterSlot();
					slot.roles = s.roles;
					slot.count = s.count;
					return slot;
				});
			}
		}

		let encounters = this.state.encounters;
		encounters.push(encounter);
		encounters = Utils.sort(encounters);

		this.setState({
			view: 'encounters',
			encounters: encounters,
			selectedEncounterID: encounter.id
		});
	}

	private createEncounter(partyID: string | null, scene: Scene | null = null) {
		if (!partyID && (this.state.parties.length === 1)) {
			partyID = this.state.parties[0].id;
		}

		let xp = 1000;
		if (partyID) {
			const party = this.state.parties.find(p => p.id === partyID);
			if (party) {
				xp = Napoleon.getXPForDifficulty(party, 'medium');
			}
		}

		this.setState({
			drawer: {
				type: 'random-encounter',
				data: {
					type: (partyID === null) ? 'xp' : 'party',
					xp: xp,
					partyID: partyID,
					difficulty: 'medium',
					template: '',
					filter: Factory.createMonsterFilter()
				},
				canAccept: () => {
					return (this.state.drawer.data.type !== 'party') || (this.state.drawer.data.partyID !== null);
				},
				onAccept: () => {
					const encounter = Factory.createEncounter();

					Napoleon.buildEncounter(encounter, this.state.drawer.data.xp, this.state.drawer.data.template, this.state.drawer.data.filter, this.state.library, id => this.getMonster(id));
					Napoleon.sortEncounter(encounter, id => this.getMonster(id));

					if (Utils.randomBoolean()) {
						encounter.notes = '**victory condition:** ' + Napoleon.getVictoryCondition(encounter, id => this.getMonster(id));
					}

					if (scene) {
						encounter.name = scene.name;

						const resource = Factory.createSceneResource();
						resource.type = 'encounter';
						resource.name = encounter.name;
						resource.content = encounter.id;
						scene.resources.push(resource);
					}

					let encounters = this.state.encounters;
					encounters.push(encounter);
					encounters = Utils.sort(encounters);

					this.setState({
						view: scene ? 'adventures' : 'encounters',
						encounters: encounters,
						adventures: this.state.adventures,
						selectedEncounterID: scene ? this.state.selectedEncounterID : encounter.id,
						drawer: null
					});
				}
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

	private deleteEncounter(encounter: Encounter) {
		const index = this.state.encounters.indexOf(encounter);
		this.state.encounters.splice(index, 1);

		this.setState({
			encounters: this.state.encounters,
			selectedEncounterID: null
		});
	}

	private addToEncounterSlot(encounter: Encounter, wave: EncounterWave, slot: EncounterSlot, monster: Monster, closeDrawer: boolean) {
		const list = wave ? wave.slots : encounter.slots;

		if (!slot) {
			slot = Factory.createEncounterSlot();
			list.push(slot);
		}

		const group = this.state.library.find(g => g.monsters.includes(monster));
		if (group) {
			slot.monsterID = monster.id;

			Napoleon.sortEncounter(encounter, id => this.getMonster(id));

			let drawer = this.state.drawer;
			if (closeDrawer) {
				drawer = null;
			} else {
				drawer.monster = null;
			}

			this.setState({
				encounters: this.state.encounters,
				drawer: drawer
			});
		}
	}

	private createEncounterFromMonsters(monsterIDs: string[]) {
		const enc = Factory.createEncounter();
		monsterIDs.forEach(monsterID => {
			const slot = Factory.createEncounterSlot();
			slot.monsterID = monsterID;
			enc.slots.push(slot);
		});
		this.state.encounters.push(enc);
		this.setState({
			view: 'encounters',
			encounters: this.state.encounters,
			selectedEncounterID: enc.id
		});
	}

	//#endregion

	//#region Map screen

	private addMap() {
		const map = Factory.createMap();

		let maps = this.state.maps;
		maps.push(map);
		maps = Utils.sort(maps);

		Utils.sort(maps);
		this.setState({
			maps: maps,
			selectedMapID: map.id
		});
	}

	private generateMap(plot: Plot | null = null) {
		this.setState({
			drawer: {
				type: 'random-map',
				data: {
					areas: 5
				},
				canAccept: () => {
					return true;
				},
				onAccept: () => {
					const map = Factory.createMap();
					Mercator.generate(this.state.drawer.data.areas, map);
					map.areas.forEach(area => {
						area.text = Shakespeare.generateRoomDescription();
					});

					if (plot) {
						plot.map = map;
						map.areas.forEach(area => {
							const scene = Factory.createScene();
							scene.id = area.id;
							scene.name = area.name;
							if (area.text) {
								scene.content = '> ' + area.text;
							}
							plot.scenes.push(scene);

							area.text = '';
						});
					} else {
						this.state.maps.push(map);
					}

					this.setState({
						view: plot ? 'adventures' : 'maps',
						maps: this.state.maps,
						adventures: this.state.adventures,
						selectedMapID: plot ? this.state.selectedMapID : map.id,
						drawer: null
					});
				}
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

	private deleteMap(map: Map) {
		const index = this.state.maps.indexOf(map);
		this.state.maps.splice(index, 1);
		this.setState({
			maps: this.state.maps,
			selectedMapID: null
		});
	}

	private selectMapTileImage(map: Map, tile: MapItem) {
		this.setState({
			drawer: {
				type: 'select-image',
				onAccept: (id: string) => {
					this.changeValue(tile, 'customBackground', id);
					this.closeDrawer();
				}
			}
		});
	}

	private cloneMapTile(map: Map, tile: MapItem) {
		const copy = JSON.parse(JSON.stringify(tile));
		copy.id = Utils.guid();
		copy.x += 1;
		copy.y += 1;
		map.items.push(copy);

		this.setState({
			maps: this.state.maps
		});
	}

	private rotateMapTile(map: Map, tile: MapItem) {
		const tmp = tile.width;
		tile.width = tile.height;
		tile.height = tmp;

		const diff = Math.floor((tile.width - tile.height) / 2);
		tile.x -= diff;
		tile.y += diff;

		if (tile.content) {
			tile.content.orientation = tile.content.orientation === 'horizontal' ? 'vertical' : 'horizontal';
		}

		this.setState({
			maps: this.state.maps
		});
	}

	private deleteMapTile(map: Map, tile: MapItem) {
		const index = map.items.indexOf(tile);
		map.items.splice(index, 1);

		this.setState({
			maps: this.state.maps
		});
	}

	private clearMapTiles(map: Map) {
		map.items = [];

		this.setState({
			maps: this.state.maps
		});
	}

	private bringToFront(map: Map, tile: MapItem) {
		const index = map.items.indexOf(tile);
		map.items.splice(index, 1);
		map.items.push(tile);

		this.setState({
			maps: this.state.maps
		});
	}

	private sendToBack(map: Map, tile: MapItem) {
		const index = map.items.indexOf(tile);
		map.items.splice(index, 1);
		map.items.unshift(tile);

		this.setState({
			maps: this.state.maps
		});
	}

	private moveMapTileOrArea(map: Map, thing: MapItem | MapArea, dir: string, step: number) {
		Mercator.move(map, thing.id, dir, step);

		this.setState({
			maps: this.state.maps
		});
	}

	private addMapArea(map: Map, area: MapArea) {
		map.areas.push(area);
		Utils.sort(map.areas);

		this.setState({
			maps: this.state.maps
		});
	}

	private deleteMapArea(map: Map, area: MapArea) {
		const index = map.areas.indexOf(area);
		map.areas.splice(index, 1);

		this.setState({
			maps: this.state.maps
		});
	}

	private clearMapAreas(map: Map) {
		map.areas = [];

		this.setState({
			maps: this.state.maps
		});
	}

	private generateRoom(map: Map) {
		Mercator.addRoom(map);

		this.setState({
			maps: this.state.maps
		});
	}

	//#endregion

	//#region Adventure screen

	private addAdventure() {
		const adventure = Factory.createAdventure();
		adventure.plot.scenes.push(Factory.createScene())

		let adventures = this.state.adventures;
		adventures.push(adventure);
		adventures = Utils.sort(adventures);

		this.setState({
			adventures: adventures,
			selectedAdventureID: adventure.id
		});
	}

	private importAdventure() {
		this.setState({
			drawer: {
				type: 'import-adventure',
				adventure: Factory.createAdventure()
			}
		});
	}

	private generateAdventure() {
		let partyID: string | null = null;
		if (this.state.parties.length === 1) {
			partyID = this.state.parties[0].id;
		}

		let xp = 1000;
		if (partyID) {
			const party = this.state.parties.find(p => p.id === partyID);
			if (party) {
				xp = Napoleon.getXPForDifficulty(party, 'medium');
			}
		}

		this.setState({
			drawer: {
				type: 'random-adventure',
				mapData: {
					areas: 5
				},
				encounterData: {
					type: (partyID === null) ? 'xp' : 'party',
					xp: xp,
					partyID: partyID,
					difficulty: 'medium',
					template: '',
					filter: Factory.createMonsterFilter()
				},
				canAccept: () => {
					return (this.state.drawer.encounterData.type !== 'party') || (this.state.drawer.encounterData.partyID !== null);
				},
				onAccept: () => {
					const adventure = Factory.createAdventure();

					const map = Factory.createMap();
					Mercator.generate(this.state.drawer.mapData.areas, map);
					adventure.plot.map = map;

					let encounters = this.state.encounters;
					let adventures = this.state.adventures;

					map.areas.forEach(area => {
						const scene = Factory.createScene();
						scene.id = area.id;
						scene.name = area.name;
						scene.content = '> ' + Shakespeare.generateRoomDescription();
						adventure.plot.scenes.push(scene);

						const encounter = Factory.createEncounter();
						encounter.name = area.name;

						const data = this.state.drawer.encounterData;
						Napoleon.buildEncounter(encounter, data.xp, data.template, data.filter, this.state.library, id => this.getMonster(id));
						Napoleon.sortEncounter(encounter, id => this.getMonster(id));

						if (Utils.randomBoolean()) {
							encounter.notes = '**victory condition:** ' + Napoleon.getVictoryCondition(encounter, id => this.getMonster(id));
						}

						encounters.push(encounter);

						const resource = Factory.createSceneResource();
						resource.type = 'encounter';
						resource.name = encounter.name;
						resource.content = encounter.id;
						scene.resources.push(resource);
					});

					encounters = Utils.sort(encounters);
					adventures.push(adventure);
					adventures = Utils.sort(adventures);

					this.setState({
						view: 'adventures',
						encounters: encounters,
						adventures: adventures,
						selectedAdventureID: adventure.id,
						drawer: null
					});
				}
			}
		});
	}

	private acceptImportedAdventure() {
		this.state.adventures.push(this.state.drawer.adventure);
		this.setState({
			adventures: this.state.adventures,
			drawer: null
		});
	}

	private deleteAdventure(adventure: Adventure) {
		const index = this.state.adventures.indexOf(adventure);
		this.state.adventures.splice(index, 1);
		this.setState({
			adventures: this.state.adventures,
			selectedAdventureID: null
		});
	}

	private addScene(plot: Plot, sceneBefore: Scene | null, sceneAfter: Scene | null) {
		const newScene = Factory.createScene();
		plot.scenes.push(newScene);
		if (sceneBefore) {
			const link = Factory.createSceneLink();
			link.sceneID = newScene.id;
			sceneBefore.links.push(link);
		}
		if (sceneAfter) {
			const link = Factory.createSceneLink();
			link.sceneID = sceneAfter.id;
			newScene.links.push(link);
		}
		this.setState({
			adventures: this.state.adventures
		});
		return newScene;
	}

	private moveScene(plot: Plot, scene: Scene, dir: 'left' | 'right') {
		Verne.moveScene(plot, scene, dir);
		this.setState({
			adventures: this.state.adventures
		});
	}

	private deleteScene(plot: Plot, scene: Scene) {
		plot.scenes = plot.scenes.filter(s => s.id !== scene.id);
		plot.scenes.forEach(s => {
			s.links = s.links.filter(l => l.sceneID !== scene.id);
		});
		this.setState({
			adventures: this.state.adventures
		});
	}

	private addLink(scene: Scene, sceneID: string) {
		const link = Factory.createSceneLink();
		link.sceneID = sceneID;
		scene.links.push(link);
		this.setState({
			adventures: this.state.adventures
		});
	}

	private deleteLink(scene: Scene, link: SceneLink) {
		scene.links = scene.links.filter(l => l.id !== link.id);
		this.setState({
			adventures: this.state.adventures
		});
	}

	private addMapToPlot(plot: Plot, random: boolean) {
		if (random) {
			this.generateMap(plot);
		} else {
			this.setState({
				drawer: {
					type: 'add-map-to-plot',
					plot: plot,
					accept: (map: Map) => {
						const clone: Map = JSON.parse(JSON.stringify(map));
						clone.areas.forEach(area => area.text = '');
						plot.map = clone;
						clone.areas.forEach(area => {
							const scene = Factory.createScene();
							scene.id = area.id;
							scene.name = area.name;
							plot.scenes.push(scene);
						});
						this.setState({
							adventures: this.state.adventures,
							drawer: null
						});
					}
				}
			});
		}
	}

	private removeMapFromPlot(plot: Plot) {
		plot.map = null;
		this.setState({
			adventures: this.state.adventures
		});
	}

	private addResourceToScene(scene: Scene, type: 'text' | 'url' | 'image') {
		if (type === 'image') {
			this.setState({
				drawer: {
					type: 'select-image',
					onAccept: (id: string) => {
						const resource = Factory.createSceneResource();
						resource.type = type;
						resource.content = id;
						scene.resources.push(resource);

						this.setState({
							adventures: this.state.adventures,
							drawer: null
						});
					}
				}
			});
		} else {
			const resource = Factory.createSceneResource();
			resource.type = type;
			scene.resources.push(resource);

			this.setState({
				adventures: this.state.adventures
			});
		}
	}

	private addEncounterToScene(scene: Scene, party: Party | null, random: boolean) {
		if (random) {
			this.createEncounter(null, scene);
		} else {
			this.setState({
				drawer: {
					type: 'add-encounter-to-scene',
					scene: scene,
					party: party,
					accept: (encounter: Encounter) => {
						const resource = Factory.createSceneResource();
						resource.type = 'encounter';
						resource.name = encounter.name;
						resource.content = encounter.id;
						scene.resources.push(resource);

						this.setState({
							adventures: this.state.adventures,
							drawer: null
						});
					}
				}
			});
		}
	}

	private removeResourceFromScene(scene: Scene, resourceID: string) {
		scene.resources = scene.resources.filter(r => r.id !== resourceID);
		this.setState({
			adventures: this.state.adventures
		});
	}

	//#endregion

	//#region Combat screen

	// Start combat

	private createCombat(
		partyID: string,
		encounter: Encounter | null,
		map: Map | null = null,
		mapAreaID: string | null = null,
		fog: { x: number, y: number }[] = [],
		lighting: 'bright light' | 'dim light' | 'darkness' = 'bright light',
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
			setup.slotInfo = Gygax.getCombatSlotData(enc, id => this.getMonster(id));
		}
		if (map) {
			setup.map = map;
			setup.mapAreaID = mapAreaID;
			setup.fog = fog;
			setup.lighting = lighting;
		}
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
				const monster = Napoleon.slotToMonster(slot, id => this.getMonster(id));
				if (monster) {
					const slotInfo = combatSetup.slotInfo.find(info => info.id === slot.id);
					if (slotInfo) {
						slotInfo.members.forEach(m => {
							combat.combatants.push(Napoleon.convertMonsterToCombatant(monster, m.init, m.hp, m.name, slot.faction));
						});
					}
				}
			});

			// Add an Init 20 item
			combat.combatants.push(Napoleon.convertPlaceholderToCombatant());

			Napoleon.sortCombatants(combat);

			if (combatSetup.map) {
				combat.map = JSON.parse(JSON.stringify(combatSetup.map));
				combat.mapAreaID = combatSetup.mapAreaID;
				combat.fog = combatSetup.fog;
				combat.lighting = combatSetup.lighting;
			}

			let combats = this.state.combats;
			combats.push(combat);
			combats = Utils.sort(combats);

			this.setState({
				view: 'encounters',
				combats: combats,
				explorations: this.state.explorations,
				selectedCombatID: combat.id,
				selectedExplorationID: null,
				drawer: null
			});
		}
	}

	// Add a wave

	private openAddWaveModal() {
		const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
		if (combat) {
			const setup = Factory.createCombatSetup();
			setup.encounter = combat.encounter;
			setup.slotInfo = Gygax.getCombatSlotData(combat.encounter, id => this.getMonster(id));

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
					const monster = Napoleon.slotToMonster(slot, id => this.getMonster(id));
					if (monster) {
						const slotInfo = combatSetup.slotInfo.find(info => info.id === slot.id);
						if (slotInfo) {
							slotInfo.members.forEach(m => {
								combat.combatants.push(Napoleon.convertMonsterToCombatant(monster, m.init, m.hp, m.name, slot.faction));
							});
						}
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
			setup.slotInfo = Gygax.getCombatSlotData(setup.encounter, id => this.getMonster(id));

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
				slot.monsterID = monster.id;
				combatSetup.encounter.slots.push(slot);

				combatSetup.slotInfo = Gygax.getCombatSlotData(combatSetup.encounter, id => this.getMonster(id));

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
				const monster = Napoleon.slotToMonster(slot, id => this.getMonster(id));
				if (monster) {
					const slotInfo = combatSetup.slotInfo.find(info => info.id === slot.id);
					if (slotInfo) {
						slotInfo.members.forEach(m => {
							combat.combatants.push(Napoleon.convertMonsterToCombatant(monster, m.init, m.hp, m.name, slot.faction));
						});
					}
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

			Utils.sort(combat.combatants, [{ field: 'displayName', dir: 'asc' }]);

			this.setState({
				combats: this.state.combats
			});
		}
	}

	// Combat management

	private pauseCombat() {
		if (Comms.data.shared.type === 'combat') {
			CommsDM.shareNothing();
		}

		const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
		if (combat) {
			this.setState({
				view: 'encounters',
				combats: this.state.combats,
				selectedCombatID: null
			});
		}
	}

	private resumeCombat(combat: Combat) {
		this.setState({
			view: 'encounters',
			combats: this.state.combats,
			selectedCombatID: combat.id
		});
	}

	private endCombat(combat: Combat, goToMap: boolean = false) {
		if (Comms.data.shared.type === 'combat') {
			CommsDM.shareNothing();
		}

		const index = this.state.combats.indexOf(combat);
		this.state.combats.splice(index, 1);
		this.setState({
			view: 'encounters',
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
					c.path = null;
				});

				// See if we can work out the party ID from the combatants
				let partyID: string | null = null;
				const pcs = combatants.filter(c => c.type === 'pc');
				if (pcs.length > 0) {
					const party = this.state.parties.find(p => p.pcs.find(pc1 => pc1.id === pcs[0].id));
					if (party) {
						partyID = party.id;

						// Make sure there's no-one missing
						party.pcs.filter(pc => pc.active).forEach(pc => {
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
					exploration.mapAreaID = combat.mapAreaID;
					exploration.fog = combat.fog;
					exploration.lighting = combat.lighting;
					exploration.combatants = combatants;

					// Clear the map of any monsters
					exploration.map.items = exploration.map.items.filter(i => (i.type === 'tile') || (i.type === 'pc') || (i.type === 'companion'));

					// Go to map view
					this.setState({
						view: 'maps',
						combats: this.state.combats,
						explorations: this.state.explorations,
						selectedCombatID: null,
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
										const n: Notification = {
											id: Utils.guid(),
											type: 'condition-save',
											data: c,
											combatant: actor
										};
										notification.open({
											key: n.id,
											message: (
												<CombatNotificationPanel
													notification={n}
													close={(note, removeCondition) => this.closeNotification(note, removeCondition)}
												/>
											),
											closeIcon: <CloseCircleOutlined />,
											duration: null
										});
									}
									break;
								case 'combatant':
									// If this refers to me, and point is START, remove it
									if (combatant && ((c.duration.combatantID === combatant.id) || (c.duration.combatantID === null)) && (c.duration.point === 'start')) {
										const index = actor.conditions.indexOf(c);
										actor.conditions.splice(index, 1);
										// Notify the user
										const n: Notification = {
											id: Utils.guid(),
											type: 'condition-end',
											data: c,
											combatant: actor
										};
										notification.open({
											key: n.id,
											message: (
												<CombatNotificationPanel
													notification={n}
													close={(note, removeCondition) => this.closeNotification(note, removeCondition)}
												/>
											),
											closeIcon: <CloseCircleOutlined />,
											duration: null
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
										const index = actor.conditions.indexOf(c);
										actor.conditions.splice(index, 1);
										if (combat) {
											// Notify the user
											const n: Notification = {
												id: Utils.guid(),
												type: 'condition-end',
												data: c,
												combatant: actor
											};
											notification.open({
												key: n.id,
												message: (
													<CombatNotificationPanel
														notification={n}
														close={(note, removeCondition) => this.closeNotification(note, removeCondition)}
													/>
												),
												closeIcon: <CloseCircleOutlined />,
												duration: null
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
						const n: Notification = {
							id: Utils.guid(),
							type: 'trait-recharge',
							data: t,
							combatant: combatant
						};
						notification.open({
							key: n.id,
							message: (
								<CombatNotificationPanel
									notification={n}
									openSidebar={() => this.openDice()}
									close={(note, removeCondition) => this.closeNotification(note, removeCondition)}
								/>
							),
							closeIcon: <CloseCircleOutlined />,
							duration: null
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
				c.path = null;
			});
			if (combatant) {
				combatant.current = true;
				combatant.path = [];
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
			// Handle end-of-turn conditions
			combat.combatants.filter(actor => actor.conditions)
				.forEach(actor => {
					actor.conditions.forEach(c => {
						if (c.duration) {
							switch (c.duration.type) {
								case 'saves':
									// If it's my condition, and point is END, notify the user
									if ((actor.id === combatant.id) && (c.duration.point === 'end')) {
										// Notify the user
										const saveNotification = Factory.createNotification();
										saveNotification.type = 'condition-save';
										saveNotification.data = c;
										saveNotification.combatant = actor;
										notification.open({
											key: saveNotification.id,
											message: (
												<CombatNotificationPanel
													notification={saveNotification}
													close={(note, removeCondition) => this.closeNotification(note, removeCondition)}
												/>
											),
											closeIcon: <CloseCircleOutlined />,
											duration: null
										});
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
										notification.open({
											key: endNotification.id,
											message: (
												<CombatNotificationPanel
													notification={endNotification}
													close={(note, removeCondition) => this.closeNotification(note, removeCondition)}
												/>
											),
											closeIcon: <CloseCircleOutlined />,
											duration: null
										});
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
			});

			this.setState({
				combats: this.state.combats
			});
		}
	}

	/// Miscellaneous methods

	private closeNotification(note: Notification, removeCondition: boolean) {
		notification.close(note.id);

		if (removeCondition && note.combatant && note.data) {
			const conditionIndex = note.combatant.conditions.indexOf(note.data as Condition);
			note.combatant.conditions.splice(conditionIndex, 1);
		}

		this.setState({
			combats: this.state.combats
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
			party.pcs.filter(pc => pc.active).forEach(pc => {
				const combatant = Napoleon.convertPCToCombatant(pc);
				ex.combatants.push(combatant);
			});

			let explorations = this.state.explorations;
			explorations.push(ex);
			explorations = Utils.sort(explorations);

			this.setState({
				view: 'maps',
				explorations: explorations,
				selectedExplorationID: ex.id
			});
		}
	}

	private pauseExploration() {
		if (Comms.data.shared.type === 'exploration') {
			CommsDM.shareNothing();
		}

		this.setState({
			view: 'maps',
			explorations: this.state.explorations,
			selectedExplorationID: null
		});
	}

	private resumeExploration(exploration: Exploration) {
		this.setState({
			view: 'maps',
			explorations: this.state.explorations,
			selectedExplorationID: exploration.id
		});
	}

	private endExploration(exploration: Exploration) {
		if (Comms.data.shared.type === 'exploration') {
			CommsDM.shareNothing();
		}

		const index = this.state.explorations.indexOf(exploration);
		this.state.explorations.splice(index, 1);
		this.setState({
			view: 'maps',
			explorations: this.state.explorations,
			selectedExplorationID: null
		});
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
			if (c.conditions.some(cnd => cnd.name === condition)) {
				c.conditions = c.conditions.filter(cnd => cnd.name !== condition);
			} else {
				const cnd = Factory.createCondition();
				cnd.name = condition;
				c.conditions.push(cnd);

				c.conditions = Utils.sort(c.conditions, [{ field: 'name', dir: 'asc' }]);
			}
		});

		this.setState({
			combats: this.state.combats,
			explorations: this.state.explorations
		});
	}

	private toggleHidden(combatants: Combatant[]) {
		combatants.forEach(c => c.showOnMap = !c.showOnMap);

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

	private deleteCondition(combatant: Combatant, condition: Condition) {
		combatant.conditions = combatant.conditions.filter(cnd => cnd.name !== condition.name);

		this.setState({
			combats: this.state.combats,
			explorations: this.state.explorations
		});
	}

	private scatterCombatants(combatants: Combatant[], allCombatants: Combatant[], map: Map, areaID: string | null) {
		Mercator.scatterCombatants(map, combatants, areaID);
		Napoleon.setMountPositions(allCombatants, map);

		this.setState({
			combats: this.state.combats,
			explorations: this.state.explorations
		});
	}

	private rotateMap(map: Map) {
		Mercator.rotateMap(map);

		this.setState({
			combats: this.state.combats,
			maps: this.state.maps,
			explorations: this.state.explorations
		});
	}

	private mapAdd(combatant: Combatant, x: number, y: number, currentCombatants: Combatant[], map: Map) {
		const list = Napoleon.getMountsAndRiders([combatant.id], currentCombatants);
		list.forEach(c => Mercator.add(map, c, x, y));

		this.setState({
			combats: this.state.combats,
			explorations: this.state.explorations
		});
	}

	private mapMove(ids: string[], dir: string, combatants: Combatant[], map: Map, step: number) {
		Mercator.moveCombatants(ids, dir, combatants, map, step);

		this.setState({
			combats: this.state.combats,
			explorations: this.state.explorations
		});
	}

	private mapRemove(ids: string[], combatants: Combatant[], map: Map) {
		const list = Napoleon.getMountsAndRiders(ids, combatants).map(c => c.id);
		ids.forEach(id => {
			if (!list.includes(id)) {
				list.push(id);
			}
		});
		list.forEach(id => Mercator.remove(map, id));

		this.setState({
			combats: this.state.combats,
			explorations: this.state.explorations
		});
	}

	private addMapItem(item: MapItem, map: Map) {
		map.items.push(item);

		this.setState({
			combats: this.state.combats,
			maps: this.state.maps,
			explorations: this.state.explorations
		});
	}

	private useTrait(trait: Trait) {
		trait.uses += 1;

		this.setState({
			combats: this.state.combats,
			explorations: this.state.explorations
		});
	}

	private rechargeTrait(trait: Trait) {
		trait.uses = 0;

		this.setState({
			combats: this.state.combats,
			explorations: this.state.explorations
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
			case 'adventures':
				this.saveKey(this.state.adventures, 'data-adventures');
				break;
		}

		this.saveKey(this.state.options, 'data-options');
	}

	private saveAll() {
		this.saveKey(this.state.parties, 'data-parties');
		this.saveKey(this.state.library, 'data-library');
		this.saveKey(this.state.encounters, 'data-encounters');
		this.saveKey(this.state.maps, 'data-maps');
		this.saveKey(this.state.adventures, 'data-adventures');
		this.saveKey(this.state.combats, 'data-combats');
		this.saveKey(this.state.explorations, 'data-explorations');
		this.saveKey(this.state.options, 'data-options');
	}

	private saveKey(obj: any, key: string) {
		try {
			const json = JSON.stringify(obj);
			window.localStorage.setItem(key, json);
		} catch (ex) {
			console.error('Could not stringify data: ', ex);
		}
	}

	//#endregion

	//#region Rendering

	private getBreadcrumbs() {
		const breadcrumbs: { id: string, text: string; onClick: () => void }[] = [];

		breadcrumbs.push({
			id: 'home',
			text: 'dojo',
			onClick: () => this.setView('home')
		});

		switch (this.state.view) {
			case 'parties':
				breadcrumbs.push({
					id: 'parties',
					text: 'pcs',
					onClick: () => this.selectPartyByID(null)
				});
				if (this.state.selectedPartyID) {
					const party = this.state.parties.find(p => p.id === this.state.selectedPartyID) as Party;
					breadcrumbs.push({
						id: party.id,
						text: party.name || 'unnamed party',
						onClick: () => this.selectPartyByID(this.state.selectedPartyID)
					});
				}
				break;
			case 'library':
				breadcrumbs.push({
					id: 'library',
					text: 'monsters',
					onClick: () => this.selectMonsterGroupByID(null)
				});
				if (this.state.selectedMonsterGroupID) {
					const group = this.state.library.find(g => g.id === this.state.selectedMonsterGroupID) as MonsterGroup;
					breadcrumbs.push({
						id: group.id,
						text: group.name || 'unnamed group',
						onClick: () => this.selectMonsterGroupByID(this.state.selectedMonsterGroupID)
					});
				}
				break;
			case 'encounters':
				breadcrumbs.push({
					id: 'encounters',
					text: 'encounters',
					onClick: () => this.selectEncounterByID(null)
				});
				if (this.state.selectedEncounterID) {
					const enc = this.state.encounters.find(e => e.id === this.state.selectedEncounterID) as Encounter;
					breadcrumbs.push({
						id: enc.id,
						text: enc.name || 'unnamed encounter',
						onClick: () => this.selectEncounterByID(this.state.selectedEncounterID)
					});
				}
				if (this.state.selectedCombatID) {
					const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID) as Combat;
					breadcrumbs.push({
						id: combat.id,
						text: combat.name || 'unnamed combat',
						onClick: () => this.selectCombatByID(this.state.selectedCombatID)
					});
				}
				break;
			case 'maps':
				breadcrumbs.push({
					id: 'maps',
					text: 'maps',
					onClick: () => this.selectMapByID(null)
				});
				if (this.state.selectedMapID) {
					const map = this.state.maps.find(m => m.id === this.state.selectedMapID) as Map;
					breadcrumbs.push({
						id: map.id,
						text: map.name || 'unnamed map',
						onClick: () => this.selectMapByID(this.state.selectedMapID)
					});
				}
				if (this.state.selectedExplorationID) {
					const ex = this.state.explorations.find(e => e.id === this.state.selectedExplorationID) as Exploration;
					breadcrumbs.push({
						id: ex.id,
						text: ex.name || 'unnamed exploration',
						onClick: () => this.selectExplorationByID(this.state.selectedExplorationID)
					});
				}
				break;
			case 'adventures':
				breadcrumbs.push({
					id: 'adventures',
					text: 'adventures',
					onClick: () => this.selectAdventureByID(null)
				});
				if (this.state.selectedAdventureID) {
					const adventure = this.state.adventures.find(a => a.id === this.state.selectedAdventureID) as Adventure;
					breadcrumbs.push({
						id: adventure.id,
						text: adventure.name || 'unnamed adventure',
						onClick: () => this.selectAdventureByID(this.state.selectedAdventureID)
					});
				}
				break;
		}

		return breadcrumbs;
	}

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
							parties={this.state.parties}
							encounters={this.state.encounters}
							maps={this.state.maps}
							goBack={() => this.selectParty(null)}
							deleteParty={party => this.deleteParty(party)}
							addPC={() => this.editPC(null)}
							importPC={() => this.importPC()}
							editPC={pc => this.editPC(pc)}
							updatePC={pc => this.updatePC(pc)}
							deletePC={pc => this.deletePC(pc)}
							clonePC={(pc, name) => this.clonePC(pc, name)}
							moveToParty={(pc, partyID) => this.moveToParty(pc, partyID)}
							createEncounter={partyID => this.createEncounter(partyID)}
							startEncounter={(partyID, encounterID) => {
								const encounter = this.state.encounters.find(enc => enc.id === encounterID) as Encounter;
								this.createCombat(partyID, encounter);
							}}
							startExploration={(partyID, mapID) => {
								const map = this.state.maps.find(m => m.id === mapID) as Map;
								this.startExploration(map, partyID);
							}}
							setLevel={(party, level) => this.setPartyLevel(party, level)}
							showReference={party => this.showPartyReference(party)}
							changeValue={(pc, type, value) => this.changeValue(pc, type, value)}
							nudgeValue={(pc, type, delta) => this.nudgeValue(pc, type, delta)}
						/>
					);
				}
				return (
					<PartyListScreen
						parties={this.state.parties}
						encounters={this.state.encounters}
						maps={this.state.maps}
						addParty={() => this.addParty()}
						importParty={() => this.importParty()}
						openParty={party => this.selectParty(party)}
						addPC={() => this.editPC(null)}
						importPC={() => this.importPC()}
						createEncounter={partyID => this.createEncounter(partyID)}
						startEncounter={(partyID, encounterID) => {
							const encounter = this.state.encounters.find(enc => enc.id === encounterID) as Encounter;
							this.createCombat(partyID, encounter);
						}}
						startExploration={(partyID, mapID) => {
							const map = this.state.maps.find(m => m.id === mapID) as Map;
							this.startExploration(map, partyID);
						}}
						setLevel={(party, level) => this.setPartyLevel(party, level)}
						showReference={party => this.showPartyReference(party)}
						deleteParty={party => this.deleteParty(party)}
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
							deleteMonsterGroup={group => this.deleteMonsterGroup(group)}
							openDemographics={group => this.openDemographics(group)}
							addMonster={() => this.addMonster()}
							generateMonster={() => this.generateMonster()}
							importMonster={() => this.importMonster()}
							deleteMonster={monster => this.deleteMonster(monster)}
							changeValue={(monster, type, value) => this.changeValue(monster, type, value)}
							nudgeValue={(monster, type, delta) => this.nudgeValue(monster, type, delta)}
							viewMonster={monster => this.setState({drawer: { type: 'statblock', source: monster }})}
							editMonster={monster => this.editMonster(monster)}
							cloneMonster={(monster, name) => this.cloneMonster(monster, name)}
							moveToGroup={(monster, groupID) => this.moveToGroup(monster, groupID)}
							createEncounter={monsterIDs => this.createEncounterFromMonsters(monsterIDs)}
						/>
					);
				}
				return (
					<MonsterGroupListScreen
						library={this.state.library}
						encounters={this.state.encounters}
						hasMonsters={hasMonsters}
						addMonsterGroup={() => this.addMonsterGroup()}
						importMonsterGroup={() => this.importMonsterGroup()}
						openMonsterGroup={group => this.selectMonsterGroup(group)}
						deleteMonsterGroup={group => this.deleteMonsterGroup(group)}
						addOpenGameContent={() => this.addOpenGameContent()}
						openStatBlock={monster => this.setState({drawer: { type: 'statblock', source: monster }})}
						openDemographics={group => this.openDemographics(group)}
						addMonster={() => this.addMonster()}
						importMonster={() => this.importMonster()}
						generateMonster={() => this.generateMonster()}
						createEncounter={monsterIDs => this.createEncounterFromMonsters(monsterIDs)}
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
							options={this.state.options}
							pauseCombat={() => this.pauseCombat()}
							endCombat={(combat, goToMap) => this.endCombat(combat, goToMap)}
							nudgeValue={(combatant, type, delta) => this.nudgeValue(combatant, type, delta)}
							changeValue={(combatant, type, value) => this.changeValue(combatant, type, value)}
							makeCurrent={combatant => this.makeCurrent(combatant, false)}
							makeActive={combatants => this.makeActive(combatants)}
							makeDefeated={combatants => this.makeDefeated(combatants)}
							useTrait={trait => this.useTrait(trait)}
							rechargeTrait={trait => this.rechargeTrait(trait)}
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
							deleteCondition={(combatant, condition) => this.deleteCondition(combatant, condition)}
							mapAdd={(combatant, x, y) => {
								const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID) as Combat;
								this.mapAdd(combatant, x, y, combat.combatants, combat.map as Map);
							}}
							mapMove={(ids, dir, step) => {
								const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID) as Combat;
								this.mapMove(ids, dir, combat.combatants, combat.map as Map, step);
							}}
							mapRemove={ids => {
								const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID) as Combat;
								this.mapRemove(ids, combat.combatants, combat.map as Map);
							}}
							undoStep={combatant => {
								if (combatant.path && (combatant.path.length > 0)) {
									const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID) as Combat;
									const item = (combat.map as Map).items.find(i => i.id === combatant.id);
									if (item) {
										const prev = combatant.path[combatant.path.length - 1];
										item.x = prev.x;
										item.y = prev.y;
										item.z = prev.z;
										combatant.path.splice(combatant.path.length - 1, 1);
										this.setState({
											combats: this.state.combats
										});
									}
								}
							}}
							endTurn={combatant => this.endTurn(combatant)}
							changeHP={values => this.changeHP(values)}
							toggleTag={(combatants, tag) => this.toggleTag(combatants, tag)}
							toggleCondition={(combatants, condition) => this.toggleCondition(combatants, condition)}
							toggleHidden={combatants => this.toggleHidden(combatants)}
							scatterCombatants={(combatants, areaID) => {
								const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID) as Combat;
								this.scatterCombatants(combatants, combat.combatants, combat.map as Map, areaID);
							}}
							rotateMap={() => {
								const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID) as Combat;
								this.rotateMap(combat.map as Map);
							}}
							setFog={fog => {
								const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID) as Combat;
								combat.fog = fog;
								this.setState({
									combats: this.state.combats
								});
							}}
							addOverlay={overlay => {
								const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID) as Combat;
								this.addMapItem(overlay, combat.map as Map);
							}}
							onRollDice={(text, count, sides, constant, mode) => this.rollDice(text, count, sides, constant, mode)}
							onOpenSession={() => this.openSession()}
						/>
					);
				}
				if (this.state.selectedEncounterID) {
					return (
						<EncounterScreen
							encounter={this.state.encounters.find(e => e.id === this.state.selectedEncounterID) as Encounter}
							parties={this.state.parties}
							adventures={this.state.adventures}
							cloneEncounter={(encounter, name) => this.cloneEncounter(encounter, name)}
							deleteEncounter={encounter => this.deleteEncounter(encounter)}
							startEncounter={(partyID, encounterID) => {
								const encounter = this.state.encounters.find(enc => enc.id === encounterID) as Encounter;
								this.createCombat(partyID, encounter);
							}}
							populateEncounter={encounter => {
								const monsters: Monster[] = [];
								this.state.library.forEach(group => {
									group.monsters.forEach(monster => {
										const inList = encounter.slots.some(s => s.monsterID === monster.id);
										if (!inList) {
											monsters.push(monster);
										}
									});
								});
								encounter.slots
									.filter(slot => slot.roles.length > 0)
									.forEach(slot => {
										const candidates = monsters.filter(m => slot.roles.includes(m.role));
										if (candidates.length > 0) {
											const index = Utils.randomNumber(candidates.length);
											const monster = candidates[index];
											const group = this.state.library.find(g => g.monsters.includes(monster));
											if (group) {
												slot.monsterID = monster.id;
											}
										}
									});
								Napoleon.sortEncounter(encounter, id => this.getMonster(id));
								this.setState({
									encounters: this.state.encounters
								});
							}}
							addWave={encounter => {
								const wave = Factory.createEncounterWave();
								wave.name = 'wave ' + (encounter.waves.length + 2);
								encounter.waves.push(wave);
								this.setState({
									encounters: this.state.encounters
								});
							}}
							deleteWave={(encounter, wave) => {
								const index = encounter.waves.indexOf(wave);
								encounter.waves.splice(index, 1);
								this.setState({
									encounters: this.state.encounters
								});
							}}
							moveEncounterSlot={(encounter, slot, count, fromWave, toWave) => {
								slot.count = Math.max(slot.count - count, 0);
								if (slot.count === 0) {
									if (fromWave) {
										const index = fromWave.slots.indexOf(slot);
										fromWave.slots.splice(index, 1);
									} else {
										const index = encounter.slots.indexOf(slot);
										encounter.slots.splice(index, 1);
									}
								}
								const toSlot = (toWave ? toWave.slots : encounter.slots).find(s => s.monsterID === slot.monsterID);
								if (toSlot) {
									toSlot.count += count;
								} else {
									const newSlot = Factory.createEncounterSlot();
									newSlot.monsterID = slot.monsterID;
									newSlot.monsterThemeID = slot.monsterThemeID;
									newSlot.roles = [...slot.roles];
									newSlot.count = count;
									newSlot.faction = slot.faction;
									if (toWave) {
										toWave.slots.push(newSlot);
									} else {
										encounter.slots.push(newSlot);
									}
								}
								Napoleon.sortEncounter(encounter, id => this.getMonster(id));
								this.setState({
									encounters: this.state.encounters
								});
							}}
							deleteEncounterSlot={(encounter, slot, wave) => {
								if (wave) {
									const index = wave.slots.indexOf(slot);
									wave.slots.splice(index, 1);
								} else {
									const n = encounter.slots.indexOf(slot);
									encounter.slots.splice(n, 1);
								}
								this.setState({
									encounters: this.state.encounters
								});
							}}
							chooseMonster={(encounter, slot, wave) => {
								if (slot) {
									let originalMonster = null;
									if (slot.monsterID) {
										originalMonster = this.getMonster(slot.monsterID);
									}
									this.setState({
										drawer: {
											type: 'encounter-slot-template',
											encounter: encounter,
											slot: slot,
											wave: wave,
											originalMonster: originalMonster,
											monster: originalMonster
										}
									});
								} else {
									this.setState({
										drawer: {
											type: 'encounter-slot',
											encounter: encounter,
											slot: slot,
											wave: wave,
											originalMonster: null,
											monster: null
										}
									});
								}
							}}
							chooseTheme={(encounter, slot) => {
								const themes: Monster[] = [];
								this.state.library.forEach(group => {
									group.monsters.forEach(m => {
										if ((m.id !== slot.monsterID) && (m.tag === 'any race')) {
											themes.push(m);
										}
									});
								});
								this.setState({
									drawer: {
										type: 'encounter-slot-theme',
										monster: this.getMonster(slot.monsterID),
										themes: themes,
										selectedThemeID: slot.monsterThemeID,
										onAccept: () => {
											slot.monsterThemeID = this.state.drawer.selectedThemeID;
											Napoleon.sortEncounter(encounter, id => this.getMonster(id));
											this.setState({
												encounters: this.state.encounters,
												drawer: null
											});
										}
									}
								});
							}}
							chooseRandomTheme={(encounter, slot) => {
								const themes = Frankenstein.getThemes(this.state.library, slot);
								const index = Utils.randomNumber(themes.length);
								const theme = themes[index];
								slot.monsterThemeID = theme.id;
								Napoleon.sortEncounter(encounter, id => this.getMonster(id));
								this.setState({
									encounters: this.state.encounters
								});
							}}
							splitTheme={(parent, slot) => {
								const themes = Frankenstein.getThemes(this.state.library, slot);
								parent.slots = parent.slots.filter(s => s.id !== slot.id);
								for (let n = 0; n !== slot.count; ++n) {
									const copy: EncounterSlot = JSON.parse(JSON.stringify(slot));
									copy.id = Utils.guid();
									copy.count = 1;
									const index = Utils.randomNumber(themes.length);
									const theme = themes[index];
									copy.monsterThemeID = theme.id;
									parent.slots.push(copy);
								}
								Napoleon.sortEncounterSlots(parent, id => this.getMonster(id));
								this.setState({
									encounters: this.state.encounters
								});
							}}
							removeTheme={(encounter, slot) => {
								slot.monsterThemeID = '';
								Napoleon.sortEncounter(encounter, id => this.getMonster(id));
								this.setState({
									encounters: this.state.encounters,
									drawer: null
								});
							}}
							showStatblock={monster => this.setState({drawer: { type: 'statblock', source: monster }})}
							getMonster={id => this.getMonster(id)}
							changeValue={(encounter, type, value) => this.changeValue(encounter, type, value)}
							nudgeValue={(encounter, type, delta) => this.nudgeValue(encounter, type, delta)}
							goBack={() => this.selectEncounter(null)}
						/>
					);
				}
				return (
					<EncounterListScreen
						encounters={this.state.encounters}
						combats={this.state.combats}
						parties={this.state.parties}
						adventures={this.state.adventures}
						hasMonsters={hasMonsters}
						createEncounter={() => this.createEncounter(null)}
						addEncounter={templateID => this.addEncounter(templateID)}
						openEncounter={encounter => this.selectEncounter(encounter)}
						cloneEncounter={(encounter, name) => this.cloneEncounter(encounter, name)}
						deleteEncounter={encounter => this.deleteEncounter(encounter)}
						startEncounter={(partyID, encounterID) => {
							const encounter = this.state.encounters.find(enc => enc.id === encounterID) as Encounter;
							this.createCombat(partyID, encounter);
						}}
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
							library={this.state.library}
							options={this.state.options}
							startCombat={ex => this.createCombat(ex.partyID, null, ex.map, ex.mapAreaID, ex.fog, ex.lighting, ex.combatants)}
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
							deleteCondition={(combatant, condition) => this.deleteCondition(combatant, condition)}
							changeValue={(source, field, value) => this.changeValue(source, field, value)}
							addCompanion={companion => this.addCompanionToExploration(companion)}
							mapAdd={(combatant, x, y) => {
								const ex = this.state.explorations.find(e => e.id === this.state.selectedExplorationID) as Exploration;
								this.mapAdd(combatant, x, y, ex.combatants, ex.map);
							}}
							mapMove={(ids, dir, step) => {
								const ex = this.state.explorations.find(e => e.id === this.state.selectedExplorationID) as Exploration;
								this.mapMove(ids, dir, ex.combatants, ex.map, step);
							}}
							mapRemove={ids => {
								const ex = this.state.explorations.find(e => e.id === this.state.selectedExplorationID) as Exploration;
								this.mapRemove(ids, ex.combatants, ex.map);
							}}
							scatterCombatants={(combatants, areaID) => {
								const ex = this.state.explorations.find(e => e.id === this.state.selectedExplorationID) as Exploration;
								this.scatterCombatants(combatants, ex.combatants, ex.map, areaID);
							}}
							rotateMap={() => {
								const ex = this.state.explorations.find(e => e.id === this.state.selectedExplorationID) as Exploration;
								this.rotateMap(ex.map);
							}}
							getMonster={id => this.getMonster(id)}
							useTrait={trait => this.useTrait(trait)}
							rechargeTrait={trait => this.rechargeTrait(trait)}
							setFog={fog => {
								const ex = this.state.explorations.find(e => e.id === this.state.selectedExplorationID) as Exploration;
								ex.fog = fog;
								this.setState({
									explorations: this.state.explorations
								});
							}}
							addOverlay={overlay => {
								const ex = this.state.explorations.find(e => e.id === this.state.selectedExplorationID) as Exploration;
								this.addMapItem(overlay, ex.map);
							}}
							onRollDice={(text, count, sides, constant, mode) => this.rollDice(text, count, sides, constant, mode)}
							onOpenSession={() => this.openSession()}
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
							cloneMap={(map, name) => this.cloneMap(map, name)}
							rotateMap={map => this.rotateMap(map)}
							deleteMap={map => this.deleteMap(map)}
							addMapTile={(map, tile) => this.addMapItem(tile, map)}
							selectMapTileImage={(map, tile) => this.selectMapTileImage(map, tile)}
							moveMapTile={(map, tile, dir, step) => this.moveMapTileOrArea(map, tile, dir, step)}
							cloneMapTile={(map, tile) => this.cloneMapTile(map, tile)}
							rotateMapTile={(map, tile) => this.rotateMapTile(map, tile)}
							deleteMapTile={(map, tile) => this.deleteMapTile(map, tile)}
							clearMapTiles={map => this.clearMapTiles(map)}
							bringToFront={(map, tile) => this.bringToFront(map, tile)}
							sendToBack={(map, tile) => this.sendToBack(map, tile)}
							addMapArea={(map, area) => this.addMapArea(map, area)}
							moveMapArea={(map, area, dir, step) => this.moveMapTileOrArea(map, area, dir, step)}
							deleteMapArea={(map, area) => this.deleteMapArea(map, area)}
							clearMapAreas={map => this.clearMapAreas(map)}
							generateRoom={map => this.generateRoom(map)}
							startEncounter={(partyID, mapID) => {
								const map = this.state.maps.find(m => m.id === mapID) as Map;
								this.createCombat(partyID, null, map);
							}}
							startExploration={(partyID, mapID) => {
								const map = this.state.maps.find(m => m.id === mapID) as Map;
								this.startExploration(map, partyID);
							}}
							changeValue={(source, field, value) => this.changeValue(source, field, value)}
							nudgeValue={(source, field, delta) => this.nudgeValue(source, field, delta)}
							goBack={() => this.selectMap(null)}
						/>
					);
				}
				return (
					<MapListScreen
						maps={this.state.maps}
						parties={this.state.parties}
						explorations={this.state.explorations}
						addMap={() => this.addMap()}
						importMap={() => this.importMap()}
						generateMap={() => this.generateMap()}
						openMap={map => this.selectMap(map)}
						cloneMap={(map, name) => this.cloneMap(map, name)}
						deleteMap={map => this.deleteMap(map)}
						startEncounter={(partyID, mapID) => {
							const map = this.state.maps.find(m => m.id === mapID) as Map;
							this.createCombat(partyID, null, map);
						}}
						startExploration={(partyID, mapID) => {
							const map = this.state.maps.find(m => m.id === mapID) as Map;
							this.startExploration(map, partyID);
						}}
						resumeExploration={ex => this.resumeExploration(ex)}
						deleteExploration={ex => this.endExploration(ex)}
					/>
				);
			case 'adventures':
				if (this.state.selectedAdventureID) {
					return (
						<AdventureScreen
							adventure={this.state.adventures.find(a => a.id === this.state.selectedAdventureID) as Adventure}
							parties={this.state.parties}
							encounters={this.state.encounters}
							maps={this.state.maps.filter(m => m.areas.length > 0)}
							options={this.state.options}
							goBack={() => this.selectAdventure(null)}
							addScene={(plot, sceneBefore, sceneAfter) => this.addScene(plot, sceneBefore, sceneAfter)}
							moveScene={(plot, scene, dir) => this.moveScene(plot, scene, dir)}
							deleteScene={(plot, scene) => this.deleteScene(plot, scene)}
							addLink={(scene, sceneID) => this.addLink(scene, sceneID)}
							deleteLink={(scene, link) => this.deleteLink(scene, link)}
							deleteAdventure={adventure => this.deleteAdventure(adventure)}
							addMapToPlot={(plot, random) => this.addMapToPlot(plot, random)}
							removeMapFromPlot={plot => this.removeMapFromPlot(plot)}
							addResourceToScene={(scene, type) => this.addResourceToScene(scene, type)}
							addEncounterToScene={(scene, party, random) => this.addEncounterToScene(scene, party, random)}
							removeResourceFromScene={(scene, resourceID) => this.removeResourceFromScene(scene, resourceID)}
							openEncounter={encounterID => this.selectEncounterByID(encounterID)}
							runEncounter={encounterID => {
								const encounter = this.state.encounters.find(e => e.id === encounterID);
								if (encounter) {
									this.createCombat('', encounter);
								}
							}}
							runEncounterWithMap={(encounterID, map, areaID) => {
								const encounter = this.state.encounters.find(e => e.id === encounterID);
								if (encounter) {
									this.createCombat('', encounter, map, areaID);
								}
							}}
							rotateMap={plot => {
								Mercator.rotateMap(plot.map as Map);
								this.setState({
									adventures: this.state.adventures
								});
							}}
							showNotes={scene => this.showMarkdown(scene.name || 'unnamed scene', scene.content)}
							showMonster={monster => this.setState({drawer: { type: 'statblock', source: monster }})}
							showResource={resource => this.openSceneResource(resource)}
							getMonster={id => this.getMonster(id)}
							changeValue={(adventure, type, value) => this.changeValue(adventure, type, value)}
						/>
					);
				}
				return (
					<AdventureListScreen
						adventures={this.state.adventures}
						addAdventure={() => this.addAdventure()}
						importAdventure={() => this.importAdventure()}
						generateAdventure={() => this.generateAdventure()}
						openAdventure={adventure => this.selectAdventure(adventure)}
						deleteAdventure={adventure => this.deleteAdventure(adventure)}
					/>
				);
		}

		return (
			<div>{this.state.view}</div>
		);
	}

	private getTabs() {
		return [{
			id: 'parties',
			text: 'pcs',
			selected: (this.state.view === 'parties'),
			onSelect: () => this.setView('parties')
		},
		{
			id: 'library',
			text: 'monsters',
			selected: (this.state.view === 'library'),
			onSelect: () => this.setView('library')
		},
		{
			id: 'encounters',
			text: 'encounters',
			selected: (this.state.view === 'encounters'),
			onSelect: () => this.setView('encounters')
		},
		{
			id: 'maps',
			text: 'maps',
			selected: (this.state.view === 'maps'),
			onSelect: () => this.setView('maps')
		},
		{
			id: 'adventures',
			text: 'adventures',
			selected: (this.state.view === 'adventures'),
			onSelect: () => this.setView('adventures')
		}];
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
							options={this.state.options}
						/>
					);
					header = 'statblock';
					closable = true;
					break;
				case 'image':
					content = (
						<img className='nonselectable-image' src={this.state.drawer.data} alt='shared' />
					);
					header = 'image';
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
						<Row gutter={20}>
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
							options={this.state.options}
						/>
					);
					header = 'monster designer';
					footer = (
						<Row gutter={20}>
							<Col span={6}>
								<button onClick={() => this.saveMonster()}>save changes</button>
							</Col>
							<Col span={6}>
								<button onClick={() => this.closeDrawer()}>discard changes</button>
							</Col>
							<Col span={12} />
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
				case 'random-monster':
					content = (
						<RandomGeneratorModal
							parties={[]}
							library={this.state.library}
							monsterData={this.state.drawer.data}
							mapData={null}
							encounterData={null}
							onUpdated={() => this.forceUpdate()}
						/>
					);
					header = 'generate a random monster';
					footer = (
						<button
							className={this.state.drawer.canAccept() ? '' : 'disabled'}
							onClick={() => this.state.drawer.onAccept()}
						>
							create the monster
						</button>
					);
					closable = true;
					break;
				case 'random-encounter':
					content = (
						<RandomGeneratorModal
							parties={this.state.parties}
							library={[]}
							monsterData={null}
							mapData={null}
							encounterData={this.state.drawer.data}
							onUpdated={() => this.forceUpdate()}
						/>
					);
					header = 'generate a random encounter';
					footer = (
						<button
							className={this.state.drawer.canAccept() ? '' : 'disabled'}
							onClick={() => this.state.drawer.onAccept()}
						>
							create the encounter
						</button>
					);
					closable = true;
					break;
				case 'encounter-slot':
					content = (
						<MonsterSelectionModal
							slot={this.state.drawer.slot}
							originalMonster={this.state.drawer.originalMonster}
							monster={this.state.drawer.monster}
							library={this.state.library}
							setMonster={monster => {
								const drawer = this.state.drawer;
								drawer.monster = monster;
								this.setState({
									encounters: this.state.encounters,
									drawer: drawer
								});
							}}
						/>
					);
					header = 'choose a monster';
					footer = (
						<Row gutter={10}>
							<Col span={12}>
								<button
									className={!this.state.drawer.monster ? 'disabled' : ''}
									onClick={() => this.addToEncounterSlot(this.state.drawer.encounter, this.state.drawer.wave, this.state.drawer.slot, this.state.drawer.monster, false)}
								>
									add this monster to the encounter
								</button>
							</Col>
							<Col span={12}>
								<button onClick={() => this.closeDrawer()}>close</button>
							</Col>
						</Row>
					);
					width = '75%';
					break;
				case 'encounter-slot-theme':
					content = (
						<ThemeSelectionModal
							monster={this.state.drawer.monster}
							themes={this.state.drawer.themes}
							selectedThemeID={this.state.drawer.selectedThemeID}
							selectTheme={id => {
								const drawer = this.state.drawer;
								drawer.selectedThemeID = id;
								this.setState({
									drawer: drawer
								});
							}}
						/>
					);
					header = 'choose a theme';
					footer = (
						<Row gutter={10}>
							<Col span={12}>
								<button onClick={() => this.state.drawer.onAccept()}>accept</button>
							</Col>
							<Col span={12}>
								<button onClick={() => this.closeDrawer()}>cancel</button>
							</Col>
						</Row>
					);
					width = '75%';
					break;
				case 'encounter-slot-template':
					content = (
						<MonsterSelectionModal
							slot={this.state.drawer.slot}
							originalMonster={this.state.drawer.originalMonster}
							monster={this.state.drawer.monster}
							library={this.state.library}
							setMonster={monster => {
								const drawer = this.state.drawer;
								drawer.monster = monster;
								this.setState({
									encounters: this.state.encounters,
									drawer: drawer
								});
							}}
						/>
					);
					header = 'choose a monster';
					footer = (
						<button
							className={!this.state.drawer.monster ? 'disabled' : ''}
							onClick={() => this.addToEncounterSlot(this.state.drawer.encounter, this.state.drawer.wave, this.state.drawer.slot, this.state.drawer.monster, true)}
						>
							add this monster to the encounter
						</button>
					);
					width = '75%';
					closable = true;
					break;
				case 'import-map':
					content = (
						<MapImportModal
							map={this.state.drawer.map}
						/>
					);
					header = 'import map';
					footer = (
						<Row gutter={20}>
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
				case 'random-map':
					content = (
						<RandomGeneratorModal
							parties={[]}
							library={[]}
							monsterData={null}
							mapData={this.state.drawer.data}
							encounterData={null}
							onUpdated={() => this.forceUpdate()}
						/>
					);
					header = 'generate a random map';
					footer = (
						<button
							className={this.state.drawer.canAccept() ? '' : 'disabled'}
							onClick={() => this.state.drawer.onAccept()}
						>
							create the map
						</button>
					);
					closable = true;
					break;
				case 'import-adventure':
					content = (
						<AdventureImportModal
							adventure={this.state.drawer.adventure}
						/>
					);
					header = 'import adventure';
					footer = (
						<button onClick={() => this.acceptImportedAdventure()}>
							accept adventure
						</button>
					);
					closable = true;
					break;
				case 'random-adventure':
					content = (
						<RandomGeneratorModal
							parties={this.state.parties}
							library={[]}
							monsterData={null}
							mapData={this.state.drawer.mapData}
							encounterData={this.state.drawer.encounterData}
							onUpdated={() => this.forceUpdate()}
						/>
					);
					header = 'generate a random adventure';
					footer = (
						<button
							className={this.state.drawer.canAccept() ? '' : 'disabled'}
							onClick={() => this.state.drawer.onAccept()}
						>
							create the adventure
						</button>
					);
					closable = true;
					break;
				case 'combat-start':
					content = (
						<CombatStartModal
							type='start'
							combatSetup={this.state.drawer.combatSetup}
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
						<Row gutter={20}>
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
				case 'select-image':
					content = (
						<ImageSelectionModal select={id => this.state.drawer.onAccept(id)} />
					);
					header = 'choose an image';
					width = '25%';
					break;
				case 'markdown':
					content = (
						<MarkdownModal content={this.state.drawer.content} />
					);
					header = this.state.drawer.title;
					closable = true;
					break;
				case 'add-map-to-plot':
					content = (
						<MapSelectionModal
							maps={this.state.maps.filter(m => m.areas.length > 0)}
							onSelect={map => this.state.drawer.accept(map)}
						/>
					);
					header = 'choose a map';
					closable = true;
					break;
				case 'add-encounter-to-scene':
					content = (
						<EncounterSelectionModal
							encounters={this.state.encounters}
							party={this.state.drawer.party}
							getMonster={id => this.getMonster(id)}
							onSelect={encounter => this.state.drawer.accept(encounter)}
						/>
					);
					header = 'choose an encounter';
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
			const breadcrumbs = this.getBreadcrumbs();
			const content = this.getContent();
			const tabs = this.getTabs();
			const drawer = this.getDrawer();

			return (
				<div className={'dojo ' + this.state.options.theme}>
					<div className={this.state.sidebar.visible ? 'app with-sidebar' : 'app'}>
						<ErrorBoundary>
							<PageHeader
								breadcrumbs={breadcrumbs}
								sidebarVisible={this.state.sidebar.visible}
								onToggleSidebar={() => this.toggleSidebar()}
							/>
						</ErrorBoundary>
						<ErrorBoundary>
							<div className='page-content'>
								{content}
							</div>
						</ErrorBoundary>
						<ErrorBoundary>
							<PageFooter
								tabs={tabs}
							/>
						</ErrorBoundary>
					</div>
					<ErrorBoundary>
						<PageSidebar
							sidebar={this.state.sidebar}
							user='dm'
							parties={this.state.parties}
							library={this.state.library}
							encounters={this.state.encounters}
							maps={this.state.maps}
							adventures={this.state.adventures}
							combats={this.state.combats}
							explorations={this.state.explorations}
							options={this.state.options}
							currentCombat={this.state.combats.find(c => c.id === this.state.selectedCombatID) ?? null}
							currentExploration={this.state.explorations.find(e => e.id === this.state.selectedExplorationID) ?? null}
							onSelectSidebar={type => this.setSidebar(type)}
							onUpdateSidebar={sidebar => this.setState({ sidebar: sidebar })}
							selectParty={id => this.selectPartyByID(id)}
							selectMonsterGroup={id => this.selectMonsterGroupByID(id)}
							selectEncounter={id => this.selectEncounterByID(id)}
							selectMap={id => this.selectMapByID(id)}
							selectAdventure={id => this.selectAdventureByID(id)}
							openImage={data => this.setState({drawer: { type: 'image', data: data }})}
							addAward={(awardID, awardee) => {
								awardee.awards.push(awardID);
								this.setState({
									parties: this.state.parties
								}, () => {
									CommsDM.sendPartyUpdate();
									CommsDM.prompt('award', {
										awardee: awardee.name,
										awardID: awardID
									});
								});
							}}
							deleteAward={(awardID, awardee) => {
								awardee.awards = awardee.awards.filter(id => id !== awardID);
								this.setState({
									parties: this.state.parties
								}, () => {
									CommsDM.sendPartyUpdate();
								});
							}}
							setOption={(option, value) => {
								const options = this.state.options as any;
								options[option] = value;
								this.setState({
									options: options
								});
							}}
							addFlag={flag => {
								const options = this.state.options;
								options.featureFlags.push(flag);
								options.featureFlags.sort();
								this.setState({
									options: options
								});
							}}
							removeFlag={flag => {
								const options = this.state.options;
								options.featureFlags = options.featureFlags.filter(f => f !== flag);
								this.setState({
									options: options
								});
							}}
							getMonster={id => this.getMonster(id)}
						/>
					</ErrorBoundary>
					<ErrorBoundary>
						<Drawer
							className={this.state.options.theme}
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
			return <RenderError context='Main' error={e} />;
		}
	}

	//#endregion
}
