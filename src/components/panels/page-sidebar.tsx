import { BookOutlined, InfoCircleOutlined, SearchOutlined, ToolOutlined } from '@ant-design/icons';
import React from 'react';

import { Gygax } from '../../utils/gygax';
import { Shakespeare } from '../../utils/shakespeare';
import { Utils } from '../../utils/utils';

import { Adventure } from '../../models/adventure';
import { Combat, Combatant } from '../../models/combat';
import { Condition } from '../../models/condition';
import { Encounter } from '../../models/encounter';
import { Exploration, Map } from '../../models/map';
import { Options, Sidebar } from '../../models/misc';
import { Monster, MonsterGroup } from '../../models/monster';
import { Party } from '../../models/party';

import { RenderError } from '../error';
import { AboutSidebar } from '../sidebars/about-sidebar';
import { ReferenceSidebar } from '../sidebars/reference-sidebar';
import { SearchSidebar } from '../sidebars/search-sidebar';
import { ToolsSidebar } from '../sidebars/tools-sidebar';

interface Props {
	sidebar: Sidebar;
	user: 'dm' | 'player';
	parties: Party[];
	library: MonsterGroup[];
	encounters: Encounter[];
	maps: Map[];
	adventures: Adventure[];
	options: Options;
	currentCombat: Combat | null;
	currentExploration: Exploration | null;
	onSelectSidebar: (type: string) => void;
	onUpdateSidebar: (sidebar: any) => void;
	selectParty: (id: string) => void;
	selectMonsterGroup: (id: string) => void;
	selectEncounter: (id: string) => void;
	selectMap: (id: string) => void;
	selectAdventure: (id: string) => void;
	openImage: (data: string) => void;
	addCondition: (combatants: Combatant[], allCombatants: Combatant[]) => void;
	editCondition: (combatant: Combatant, condition: Condition, allCombatants: Combatant[]) => void;
	toggleAddingToMap: () => void;
	onUpdated: () => void;
	setOption: (option: string, value: any) => void;
	exportAll: () => void;
	importAll: (json: string) => void;
	addFlag: (flag: string) => void;
	removeFlag: (flag: string) => void;
	getMonster: (id: string) => Monster | null;
}

export class PageSidebar extends React.Component<Props> {
	public static defaultProps = {
		parties: [],
		library: [],
		encounters: [],
		maps: [],
		adventures: [],
		currentCombat: null,
		currentExploration: null,
		selectParty: null,
		selectMonsterGroup: null,
		selectEncounter: null,
		selectMap: null,
		selectAdventure: null,
		openImage: null,
		openStatBlock: null,
		addCondition: null,
		editCondition: null,
		toggleAddingToMap: null,
		onUpdated: null,
		clearUnusedImages: null,
		exportAll: null,
		importAll: null,
		getMonster: null
	};

	public render() {
		try {
			if (!this.props.sidebar.visible) {
				return null;
			}

			const options = [];
			switch (this.props.user) {
				case 'dm':
					options.push(
						<ToolOutlined
							key='tools'
							className={this.props.sidebar.type === 'tools' ? 'sidebar-icon selected' : 'sidebar-icon'}
							title='tools'
							onClick={() => this.props.onSelectSidebar('tools')}
						/>
					);
					options.push(
						<SearchOutlined
							key='search'
							className={this.props.sidebar.type === 'search' ? 'sidebar-icon selected' : 'sidebar-icon'}
							title='search'
							onClick={() => this.props.onSelectSidebar('search')}
						/>
					);
					options.push(
						<InfoCircleOutlined
							key='about'
							className={this.props.sidebar.type === 'about' ? 'sidebar-icon selected' : 'sidebar-icon'}
							title='about'
							onClick={() => this.props.onSelectSidebar('about')}
						/>
					);
					break;
				case 'player':
					options.push(
						<BookOutlined
							key='reference'
							className={this.props.sidebar.type === 'reference' ? 'sidebar-icon selected' : 'sidebar-icon'}
							title='reference'
							onClick={() => this.props.onSelectSidebar('reference')}
						/>
					);
					options.push(
						<InfoCircleOutlined
							key='about'
							className={this.props.sidebar.type === 'about' ? 'sidebar-icon selected' : 'sidebar-icon'}
							title='about'
							onClick={() => this.props.onSelectSidebar('about')}
						/>
					);
					break;
			}

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
							rollDice={(expression, mode) => {
								const sidebar = this.props.sidebar;
								const result = Gygax.rollDice(expression, sidebar.dice, sidebar.constant, mode);
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
							languageMode={this.props.sidebar.languageMode}
							setLanguageMode={mode => {
								const sidebar = this.props.sidebar;
								sidebar.languageMode = mode;
								switch (mode) {
									case 'common':
										sidebar.languagePreset = Shakespeare.getLanguagePresets()[0].name;
										sidebar.selectedLanguages = Shakespeare.getLanguagePresets()[0].languages;
										break;
									case 'random':
										sidebar.languagePreset = null;
										sidebar.selectedLanguages = Shakespeare.getRandomLanguages();
										break;
									case 'custom':
										sidebar.languagePreset = null;
										sidebar.selectedLanguages = [];
										break;
								}
								this.props.onUpdateSidebar(sidebar);
							}}
							selectedLanguagePreset={this.props.sidebar.languagePreset}
							selectedLanguages={this.props.sidebar.selectedLanguages}
							languageOutput={this.props.sidebar.languageOutput}
							selectLanguagePreset={preset => {
								const sidebar = this.props.sidebar;
								sidebar.languagePreset = null;
								sidebar.selectedLanguages = [];
								const presetInfo = Shakespeare.getLanguagePresets().find(p => p.name === preset);
								if (presetInfo) {
									sidebar.languagePreset = presetInfo.name;
									sidebar.selectedLanguages = presetInfo.languages;
								}
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
							clearLanguages={() => {
								const sidebar = this.props.sidebar;
								sidebar.selectedLanguages = [];
								this.props.onUpdateSidebar(sidebar);
							}}
							selectRandomLanguages={() => {
								const sidebar = this.props.sidebar;
								sidebar.selectedLanguages = Shakespeare.getRandomLanguages();
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
							drawCards={(count, deck) => {
								const sidebar = this.props.sidebar;
								sidebar.draws = [];
								while (sidebar.draws.length < count) {
									const index = Utils.randomNumber(deck.length);
									const card = deck[index];
									if (!sidebar.draws.find(c => c.card.id === card.id)) {
										sidebar.draws.push({
											id: Utils.guid(),
											card: card,
											reversed: Utils.randomBoolean()
										});
									}
								}
								this.props.onUpdateSidebar(sidebar);
							}}
							resetDraw={() => {
								const sidebar = this.props.sidebar;
								sidebar.draws = [];
								this.props.onUpdateSidebar(sidebar);
							}}
						/>
					);
					break;
				case 'reference':
					{
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
							/>
						);
					}
					break;
				case 'search':
					content = (
						<SearchSidebar
							parties={this.props.parties}
							library={this.props.library}
							encounters={this.props.encounters}
							maps={this.props.maps}
							adventures={this.props.adventures}
							openParty={id => this.props.selectParty(id)}
							openGroup={id => this.props.selectMonsterGroup(id)}
							openEncounter={id => this.props.selectEncounter(id)}
							openMap={id => this.props.selectMap(id)}
							openAdventure={id => this.props.selectAdventure(id)}
							getMonster={id => this.props.getMonster(id)}
						/>
					);
					break;
				case 'about':
					content = (
						<AboutSidebar
							user={this.props.user}
							options={this.props.options}
							setOption={(option, value) => this.props.setOption(option, value)}
							exportAll={() => this.props.exportAll()}
							importAll={json => this.props.importAll(json)}
							addFlag={flag => this.props.addFlag(flag)}
							removeFlag={flag => this.props.removeFlag(flag)}
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
			return <RenderError context='PageSidebar' error={e} />;
		}
	}
}
