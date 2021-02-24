import { BookOutlined, BulbOutlined, CommentOutlined, ControlOutlined, InfoCircleOutlined, SearchOutlined, ShareAltOutlined, ToolOutlined, TrophyOutlined } from '@ant-design/icons';
import React from 'react';

import { Gygax } from '../../utils/gygax';
import { Shakespeare } from '../../utils/shakespeare';
import { Comms, CommsPlayer } from '../../utils/uhura';
import { Utils } from '../../utils/utils';

import { Combat, Combatant } from '../../models/combat';
import { Condition } from '../../models/condition';
import { Encounter } from '../../models/encounter';
import { Exploration, Map } from '../../models/map';
import { Options, Sidebar } from '../../models/misc';
import { Monster, MonsterGroup } from '../../models/monster';
import { Party, PC } from '../../models/party';

import { RenderError } from '../error';
import { AboutSidebar } from '../sidebars/about-sidebar';
import { AwardsPlayerSidebar } from '../sidebars/awards-player-sidebar';
import { GeneratorsSidebar } from '../sidebars/generators-sidebar';
import { ReferenceSidebar } from '../sidebars/reference-sidebar';
import { SearchSidebar } from '../sidebars/search-sidebar';
import { SessionChatSidebar } from '../sidebars/session-chat-sidebar';
import { SessionControlsSidebar } from '../sidebars/session-controls-sidebar';
import { SessionPlayerSidebar } from '../sidebars/session-player-sidebar';
import { SessionSidebar } from '../sidebars/session-sidebar';
import { ToolsSidebar } from '../sidebars/tools-sidebar';

interface Props {
	sidebar: Sidebar;
	user: 'dm' | 'player';
	parties: Party[];
	library: MonsterGroup[];
	encounters: Encounter[];
	maps: Map[];
	combats: Combat[];
	explorations: Exploration[];
	options: Options;
	currentCombat: Combat | null;
	currentExploration: Exploration | null;
	onSelectSidebar: (type: string) => void;
	onUpdateSidebar: (sidebar: any) => void;
	selectParty: (id: string) => void;
	selectMonsterGroup: (id: string) => void;
	selectEncounter: (id: string) => void;
	selectMap: (id: string) => void;
	openImage: (data: string) => void;
	addAward: (awardID: string, awardee: Party | PC) => void;
	deleteAward: (awardID: string, awardee: Party | PC) => void;
	addCondition: (combatants: Combatant[], allCombatants: Combatant[]) => void;
	editCondition: (combatant: Combatant, condition: Condition, allCombatants: Combatant[]) => void;
	toggleAddingToMap: () => void;
	onUpdated: () => void;
	setOption: (option: string, value: any) => void;
	getMonster: (id: string) => Monster | null;
}

export class PageSidebar extends React.Component<Props> {
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
		addAward: null,
		deleteAward: null,
		addCondition: null,
		editCondition: null,
		toggleAddingToMap: null,
		onUpdated: null,
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
						<BulbOutlined
							key='generators'
							className={this.props.sidebar.type === 'generators' ? 'sidebar-icon selected' : 'sidebar-icon'}
							title='generators'
							onClick={() => this.props.onSelectSidebar('generators')}
						/>
					);
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
					if (CommsPlayer.getState() === 'connected') {
						if (Comms.data.options.allowChat) {
							options.push(
								<CommentOutlined
									key='session-chat'
									className={this.props.sidebar.type === 'session-chat' ? 'sidebar-icon selected' : 'sidebar-icon'}
									title='chat'
									onClick={() => this.props.onSelectSidebar('session-chat')}
								/>
							);
						}
						if (Comms.data.options.allowControls) {
							let allowControls = false;
							switch (Comms.data.shared.type) {
								case 'combat':
								case 'exploration':
									allowControls = true;
									break;
							}
							if (allowControls) {
								options.push(
									<ControlOutlined
										key='session-controls'
										className={this.props.sidebar.type === 'session-controls' ? 'sidebar-icon selected' : 'sidebar-icon'}
										title='controls'
										onClick={() => this.props.onSelectSidebar('session-controls')}
									/>
								);
							}
						}
						options.push(
							<ShareAltOutlined
								key='session-player'
								className={this.props.sidebar.type === 'session-player' ? 'sidebar-icon selected' : 'sidebar-icon'}
								title='session'
								onClick={() => this.props.onSelectSidebar('session-player')}
							/>
						);
						options.push(
							<TrophyOutlined
								key='awards-player'
								className={this.props.sidebar.type === 'awards-player' ? 'sidebar-icon selected' : 'sidebar-icon'}
								title='awards'
								onClick={() => this.props.onSelectSidebar('awards-player')}
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
							surge={this.props.sidebar.surge}
							rollSurge={() => {
								const sidebar = this.props.sidebar;
								sidebar.surge = Gygax.getWildSurge();
								this.props.onUpdateSidebar(sidebar);
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
							showAwards={this.props.user === 'dm'}
							addAward={(awardID, awardee) => this.props.addAward(awardID, awardee)}
							deleteAward={(awardID, awardee) => this.props.deleteAward(awardID, awardee)}
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
							parties={this.props.parties}
							openImage={data => this.props.openImage(data)}
						/>
					);
					break;
				case 'session-player':
					content = (
						<SessionPlayerSidebar
						/>
					);
					break;
				case 'session-chat':
					content = (
						<SessionChatSidebar
							openImage={data => this.props.openImage(data)}
						/>
					);
					break;
				case 'session-controls':
					content = (
						<SessionControlsSidebar
							options={this.props.options}
							addCondition={(combatants, allCombatants) => this.props.addCondition(combatants, allCombatants)}
							editCondition={(combatant, condition, allCombatants) => this.props.editCondition(combatant, condition, allCombatants)}
							toggleAddingToMap={() => this.props.toggleAddingToMap()}
							onUpdated={() => this.props.onUpdated()}
						/>
					);
					break;
				case 'awards-player':
					content = (
						<AwardsPlayerSidebar
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
							getMonster={id => this.props.getMonster(id)}
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
							options={this.props.options}
							setOption={(option, value) => this.props.setOption(option, value)}
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
