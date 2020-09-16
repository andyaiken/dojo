import { BookOutlined, BulbOutlined, InfoCircleOutlined, SearchOutlined, ShareAltOutlined, ToolOutlined } from '@ant-design/icons';
import React from 'react';

import Gygax from '../../utils/gygax';
import Shakespeare from '../../utils/shakespeare';
import Svengali from '../../utils/svengali';
import Utils from '../../utils/utils';

import { Combat, Combatant } from '../../models/combat';
import { Condition } from '../../models/condition';
import { DieRollResult } from '../../models/dice';
import { Encounter } from '../../models/encounter';
import { Exploration, Map } from '../../models/map';
import { CardDraw, Handout, NPC } from '../../models/misc';
import { Monster, MonsterGroup } from '../../models/monster';
import { Party } from '../../models/party';

import AboutSidebar from '../sidebars/about-sidebar';
import GeneratorsSidebar from '../sidebars/generators-sidebar';
import ReferenceSidebar from '../sidebars/reference-sidebar';
import SearchSidebar from '../sidebars/search-sidebar';
import SessionSidebar from '../sidebars/session-sidebar';
import ToolsSidebar from '../sidebars/tools-sidebar';

export interface Sidebar {
	visible: boolean;
	type: string;
	subtype: string;
	dice: { [sides: number]: number };
	constant: number;
	dieRolls: DieRollResult[];
	handout: Handout | null;
	languagePreset: string | null;
	selectedLanguages: string[];
	languageOutput: string[];
	draws: CardDraw[];
	npc: NPC | null;
	selectedPartyID: string | null;
	selectedMonsterID: string | null;
}

interface Props {
	sidebar: Sidebar;
	user: 'dm' | 'player';
	parties: Party[];
	library: MonsterGroup[];
	encounters: Encounter[];
	maps: Map[];
	combats: Combat[];
	explorations: Exploration[];
	currentCombat: Combat | null;
	currentExploration: Exploration | null;
	onSelectSidebar: (type: string) => void;
	onUpdateSidebar: (sidebar: any) => void;
	selectParty: (id: string) => void;
	selectMonsterGroup: (id: string) => void;
	selectEncounter: (id: string) => void;
	selectMap: (id: string) => void;
	openImage: (data: string) => void;
	editPC: (id: string) => void;
	addCondition: (combatants: Combatant[], allCombatants: Combatant[]) => void;
	editCondition: (combatant: Combatant, condition: Condition, allCombatants: Combatant[]) => void;
	toggleAddingToMap: () => void;
	onUpdated: () => void;
}

export default class PageSidebar extends React.Component<Props> {
	public static defaultProps = {
		parties: [],
		library: [],
		encounters: [],
		maps: [],
		combats: [],
		explorations: [],
		currentCombat: null,
		currentExploration: null,
		selectParty: null,
		selectMonsterGroup: null,
		selectEncounter: null,
		selectMap: null,
		openImage: null,
		openStatBlock: null,
		editPC: null,
		addCondition: null,
		editCondition: null,
		toggleAddingToMap: null,
		onUpdated: null
	};

	public render() {
		try {
			if (!this.props.sidebar.visible) {
				return null;
			}

			const options = [];
			if (this.props.user === 'dm') {
				options.push(
					<ToolOutlined
						key='tools'
						className={this.props.sidebar.type === 'tools' ? 'sidebar-icon selected' : 'sidebar-icon'}
						title='tools'
						onClick={() => this.props.onSelectSidebar('tools')}
					/>
				);
				options.push(
					<BulbOutlined
						key='generators'
						className={this.props.sidebar.type === 'generators' ? 'sidebar-icon selected' : 'sidebar-icon'}
						title='generators'
						onClick={() => this.props.onSelectSidebar('generators')}
					/>
				);
			}
			options.push(
				<BookOutlined
					key='reference'
					className={this.props.sidebar.type === 'reference' ? 'sidebar-icon selected' : 'sidebar-icon'}
					title='reference'
					onClick={() => this.props.onSelectSidebar('reference')}
				/>
			);
			options.push(
				<ShareAltOutlined
					key='session'
					className={this.props.sidebar.type === 'session' ? 'sidebar-icon selected' : 'sidebar-icon'}
					title='session'
					onClick={() => this.props.onSelectSidebar('session')}
				/>
			);
			if (this.props.user === 'dm') {
				options.push(
					<SearchOutlined
						key='search'
						className={this.props.sidebar.type === 'search' ? 'sidebar-icon selected' : 'sidebar-icon'}
						title='search'
						onClick={() => this.props.onSelectSidebar('search')}
					/>
				);
			}
			options.push(
				<InfoCircleOutlined
					key='about'
					className={this.props.sidebar.type === 'about' ? 'sidebar-icon selected' : 'sidebar-icon'}
					title='about'
					onClick={() => this.props.onSelectSidebar('about')}
				/>
			);

			let content = null;
			switch (this.props.sidebar.type) {
				case 'tools':
					content = (
						<ToolsSidebar
							view={this.props.sidebar.subtype}
							setView={view => {
								const sidebar = this.props.sidebar;
								sidebar.subtype = view;
								this.props.onUpdateSidebar(sidebar);
							}}
							dice={this.props.sidebar.dice}
							constant={this.props.sidebar.constant}
							dieRolls={this.props.sidebar.dieRolls}
							setDie={(sides, count) => {
								const sidebar = this.props.sidebar;
								sidebar.dice[sides] = count;
								this.props.onUpdateSidebar(sidebar);
							}}
							setConstant={value => {
								const sidebar = this.props.sidebar;
								sidebar.constant = value;
								this.props.onUpdateSidebar(sidebar);
							}}
							rollDice={mode => {
								const sidebar = this.props.sidebar;
								const result = Gygax.rollDice(sidebar.dice, sidebar.constant, mode);
								sidebar.dieRolls.unshift(result);
								this.props.onUpdateSidebar(sidebar);
							}}
							resetDice={() => {
								const sidebar = this.props.sidebar;
								[4, 6, 8, 10, 12, 20, 100].forEach(n => sidebar.dice[n] = 0);
								sidebar.constant = 0;
								this.props.onUpdateSidebar(sidebar);
							}}
							handout={this.props.sidebar.handout}
							setHandout={handout => {
								const sidebar = this.props.sidebar;
								sidebar.handout = handout;
								this.props.onUpdateSidebar(sidebar);
							}}
							languagePreset={this.props.sidebar.languagePreset}
							selectedLanguages={this.props.sidebar.selectedLanguages}
							languageOutput={this.props.sidebar.languageOutput}
							selectLanguagePreset={preset => {
								const sidebar = this.props.sidebar;
								sidebar.languagePreset = preset;
								switch (preset) {
									case 'draconic':
										sidebar.selectedLanguages = ['armenian', 'irish', 'maltese'];
										break;
									case 'dwarvish':
										sidebar.selectedLanguages = ['czech', 'german', 'yiddish'];
										break;
									case 'elvish':
										sidebar.selectedLanguages = ['finnish', 'spanish', 'welsh'];
										break;
									case 'goblin':
										sidebar.selectedLanguages = ['hawaiian', 'kyrgyz', 'somali'];
										break;
									case 'orc':
										sidebar.selectedLanguages = ['macedonian', 'russian', 'turkish'];
										break;
								}
								sidebar.languageOutput = [];
								this.props.onUpdateSidebar(sidebar);
							}}
							addLanguage={language => {
								const sidebar = this.props.sidebar;
								sidebar.selectedLanguages.push(language);
								this.props.onUpdateSidebar(sidebar);
							}}
							removeLanguage={language => {
								const sidebar = this.props.sidebar;
								const index = sidebar.selectedLanguages.indexOf(language);
								sidebar.selectedLanguages.splice(index, 1);
								this.props.onUpdateSidebar(sidebar);
							}}
							selectRandomLanguages={() => {
								const languages = Shakespeare.getAllLanguages();

								const sidebar = this.props.sidebar;
								sidebar.selectedLanguages = [];
								while (sidebar.selectedLanguages.length !== 3) {
									const n = Math.floor(Math.random() * languages.length);
									const lang = languages[n];
									if (!sidebar.selectedLanguages.includes(lang)) {
										sidebar.selectedLanguages.push(lang);
									}
								}
								this.props.onUpdateSidebar(sidebar);
							}}
							resetLanguages={() => {
								const sidebar = this.props.sidebar;
								sidebar.languagePreset = null;
								sidebar.selectedLanguages = [];
								sidebar.languageOutput = [];
								this.props.onUpdateSidebar(sidebar);
							}}
							generateLanguage={() => {
								const sidebar = this.props.sidebar;
								const responses = sidebar.selectedLanguages.map(language => fetch('/dojo/data/langs/' + language + '.txt'));
								Promise.all(responses).then(r => {
									const data = r.map(response => response.text());
									Promise.all(data).then(text => {
										Shakespeare.initModel(text);
										sidebar.languageOutput = Shakespeare.generateLines(5);
										this.props.onUpdateSidebar(sidebar);
									});
								});
							}}
							draws={this.props.sidebar.draws}
							drawCards={count => {
								const deck = Svengali.getCards();

								const sidebar = this.props.sidebar;
								sidebar.draws = [];
								while (sidebar.draws.length < count) {
									const index = Utils.randomNumber(deck.length);
									const card = deck[index];
									if (!sidebar.draws.find(c => c.cardID === card.id)) {
										sidebar.draws.push({
											id: Utils.guid(),
											cardID: card.id,
											reversed: Utils.randomBoolean()
										});
									}
								}
								this.props.onUpdateSidebar(sidebar);
							}}
						/>
					);
					break;
				case 'generators':
					content = (
						<GeneratorsSidebar
							view={this.props.sidebar.subtype}
							npc={this.props.sidebar.npc}
							setView={view => {
								const sidebar = this.props.sidebar;
								sidebar.subtype = view;
								this.props.onUpdateSidebar(sidebar);
							}}
							generateNPC={() => {
								const sidebar = this.props.sidebar;
								sidebar.npc = {
									age: Shakespeare.generateNPCAge(),
									profession: Shakespeare.generateNPCProfession(),
									height: Shakespeare.generateNPCHeight(),
									weight: Shakespeare.generateNPCWeight(),
									hair: Shakespeare.generateNPCHair(),
									physical: Shakespeare.generateNPCPhysical(),
									mental: Shakespeare.generateNPCMental(),
									speech: Shakespeare.generateNPCSpeech(),
									trait: Shakespeare.generateNPCTrait(),
									ideal: Shakespeare.generateNPCIdeal(),
									bond: Shakespeare.generateNPCBond(),
									flaw: Shakespeare.generateNPCFlaw()
								};
								this.props.onUpdateSidebar(sidebar);
							}}
						/>
					);
					break;
				case 'reference':
					const monsters: Monster[] = [];
					this.props.library.forEach(g => {
						g.monsters.forEach(m => monsters.push(m));
					});
					Utils.sort(monsters);
					content = (
						<ReferenceSidebar
							view={this.props.sidebar.subtype}
							setView={view => {
								const sidebar = this.props.sidebar;
								sidebar.subtype = view;
								this.props.onUpdateSidebar(sidebar);
							}}
							selectedPartyID={this.props.sidebar.selectedPartyID}
							parties={this.props.parties}
							selectPartyID={id => {
								const sidebar = this.props.sidebar;
								sidebar.selectedPartyID = id;
								this.props.onUpdateSidebar(sidebar);
							}}
							selectedMonsterID={this.props.sidebar.selectedMonsterID}
							monsters={monsters}
							selectMonsterID={id => {
								const sidebar = this.props.sidebar;
								sidebar.selectedMonsterID = id;
								this.props.onUpdateSidebar(sidebar);
							}}
						/>
					);
					break;
				case 'session':
					content = (
						<SessionSidebar
							view={this.props.sidebar.subtype}
							setView={view => {
								const sidebar = this.props.sidebar;
								sidebar.subtype = view;
								this.props.onUpdateSidebar(sidebar);
							}}
							user={this.props.user}
							parties={this.props.parties}
							combat={this.props.currentCombat}
							exploration={this.props.currentExploration}
							openImage={data => this.props.openImage(data)}
							editPC={id => this.props.editPC(id)}
							addCondition={(combatants, allCombatants) => this.props.addCondition(combatants, allCombatants)}
							editCondition={(combatant, condition, allCombatants) => this.props.editCondition(combatant, condition, allCombatants)}
							toggleAddingToMap={() => this.props.toggleAddingToMap()}
							onUpdated={() => this.props.onUpdated()}
						/>
					);
					break;
				case 'search':
					content = (
						<SearchSidebar
							parties={this.props.parties}
							library={this.props.library}
							encounters={this.props.encounters}
							maps={this.props.maps}
							openParty={id => this.props.selectParty(id)}
							openGroup={id => this.props.selectMonsterGroup(id)}
							openEncounter={id => this.props.selectEncounter(id)}
							openMap={id => this.props.selectMap(id)}
						/>
					);
					break;
				case 'about':
					content = (
						<AboutSidebar
							parties={this.props.parties}
							library={this.props.library}
							maps={this.props.maps}
							combats={this.props.combats}
							explorations={this.props.explorations}
						/>
					);
					break;
			}

			return (
				<div className='sidebar sidebar-right'>
					<div className='sidebar-icons'>
						{options}
					</div>
					{content}
				</div>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
