import { CheckCircleOutlined, CloseCircleOutlined, ControlOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons';
import { Col, Drawer, notification, Row, Tag } from 'antd';
import Mousetrap from 'mousetrap';
import React from 'react';
import ReactMarkdown from 'react-markdown';

import { Factory } from '../../utils/factory';
import { Gygax } from '../../utils/gygax';
import { Matisse } from '../../utils/matisse';
import { Mercator } from '../../utils/mercator';
import { Napoleon } from '../../utils/napoleon';
import { Streep } from '../../utils/streep';
import { Comms, CommsPlayer } from '../../utils/uhura';
import { Utils } from '../../utils/utils';

import { Combat, Combatant } from '../../models/combat';
import { Condition } from '../../models/condition';
import { DieRollResult } from '../../models/dice';
import { Exploration, Map } from '../../models/map';
import { Handout, Options, Sidebar } from '../../models/misc';
import { Monster } from '../../models/monster';

import { ErrorBoundary, RenderError } from '../error';
import { MonsterStatblockCard } from '../cards/monster-statblock-card';
import { Group } from '../controls/group';
import { Note } from '../controls/note';
import { NumberSpin } from '../controls/number-spin';
import { Selector } from '../controls/selector';
import { Textbox } from '../controls/textbox';
import { ConditionModal } from '../modals/condition-modal';
import { PCEditorModal } from '../modals/editors/pc-editor-modal';
import { StatBlockModal } from '../modals/stat-block-modal';
import { AwardPanel } from '../panels/award-panel';
import { DieRollPanel, DieRollResultPanel } from '../panels/die-roll-panel';
import { GridPanel } from '../panels/grid-panel';
import { InitiativeOrder } from '../panels/initiative-order';
import { MapPanel } from '../panels/map-panel';
import { PageFooter } from '../panels/page-footer';
import { PageHeader } from '../panels/page-header';
import { PageSidebar } from '../panels/page-sidebar';
import { PortraitPanel } from '../panels/portrait-panel';
import { MessagePanel } from '../panels/session-panel';

interface Props {
	dmcode: string;
}

interface State {
	addingToMap: boolean;
	drawer: any;
	sidebar: Sidebar;
	options: Options;
}

export class Player extends React.Component<Props, State> {

	//#region Constructor

	constructor(props: Props) {
		super(props);

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
			addingToMap: false,
			drawer: null,
			sidebar: {
				visible: false,
				type: 'reference',
				subtype: 'skills',
				dice: dice,
				constant: 0,
				dieRolls: [],
				handout: null,
				languageMode: 'common',
				languagePreset: null,
				selectedLanguages: [],
				languageOutput: [],
				draws: [],
				selectedPartyID: null
			},
			options: options
		};
	}

	//#endregion

	//#region Lifecycle

	public componentDidMount() {
		Mousetrap.bind('up', e => {
			e.preventDefault();
			this.moveToken('N');
		});
		Mousetrap.bind('down', e => {
			e.preventDefault();
			this.moveToken('S');
		});
		Mousetrap.bind('left', e => {
			e.preventDefault();
			this.moveToken('W');
		});
		Mousetrap.bind('right', e => {
			e.preventDefault();
			this.moveToken('E');
		});

		CommsPlayer.onStateChanged = () => {
			if (CommsPlayer.getState() !== 'connected') {
				const sidebar = this.state.sidebar;
				sidebar.type = 'reference';
				sidebar.subtype = 'skills';
				this.setState({
					sidebar: sidebar
				});
			} else {
				this.forceUpdate();
			}
		}
		CommsPlayer.onDataChanged = () => {
			Comms.data.shared.images.forEach(img => Matisse.saveImage(img.id, img.name, img.data));
			this.forceUpdate();
		};
		Comms.onPrompt = (type, data) => {
			switch (type) {
				case 'initiative':
					if (Comms.data.shared.type === 'combat') {
						if (Comms.getCharacterID(Comms.getID()) === '') {
							return;
						}

						const key = Utils.guid();
						notification.open({
							key: Utils.guid(),
							message: (
								<RollPrompt type='initiative' notificationKey={key} />
							),
							closeIcon: <CloseCircleOutlined />,
							duration: null
						});
					}
					break;
				case 'award':
					{
						const awardee = data.awardee || 'someone';
						const awardID = data.awardID;
						const award = Streep.getAward(awardID);
						if (award) {
							notification.open({
								key: Utils.guid(),
								message: (
									<div>
										<div>awarded to <b>{awardee}</b>:</div>
										<AwardPanel award={award} />
									</div>
								),
								closeIcon: <CloseCircleOutlined />,
								duration: null
							});
						}
					}
			}
		};
		Comms.onNewMessage = message => {
			const messagesVisible = this.state.sidebar.visible && (this.state.sidebar.type === 'session-chat');
			if (!messagesVisible) {
				notification.open({
					key: message.id,
					message: (
						<MessagePanel
							user='player'
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
		Mousetrap.unbind('up');
		Mousetrap.unbind('down');
		Mousetrap.unbind('left');
		Mousetrap.unbind('right');

		CommsPlayer.onStateChanged = null;
		CommsPlayer.onDataChanged = null;
		Comms.onPrompt = null;
		Comms.onNewMessage = null;

		CommsPlayer.disconnect();
	}

	//#endregion

	//#region Helper methods

	private setAddingToMap(adding: boolean) {
		this.setState({
			addingToMap: adding
		});
	}

	private setSidebar(type: string) {
		let subtype = '';
		switch (type) {
			case 'reference':
				subtype = 'skills';
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

	private editPC() {
		if (Comms.data.party) {
			const id = Comms.getCharacterID(Comms.getID());
			const pc = Comms.data.party.pcs.find(p => p.id === id);
			if (pc) {
				const copy = JSON.parse(JSON.stringify(pc));
				this.setState({
					drawer: {
						type: 'pc',
						pc: copy
					}
				});
			}
		}
	}

	private newPC() {
		const pc = Factory.createPC();
		pc.player = Comms.getName(Comms.getID());
		this.setState({
			drawer: {
				type: 'pc',
				pc: pc
			}
		});
	}

	private savePC() {
		CommsPlayer.sendCharacter(this.state.drawer.pc);

		this.setState({
			drawer: null
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
			drawer: null
		}, () => {
			CommsPlayer.sendSharedUpdate();
			this.forceUpdate();
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
			drawer: null
		}, () => {
			CommsPlayer.sendSharedUpdate();
			this.forceUpdate();
		});
	}

	private moveToken(dir: string) {
		let combatants: Combatant[] = [];
		let map: Map | null = null;

		if (Comms.data.shared.type === 'combat') {
			const combat = Comms.data.shared.data as Combat;
			combatants = combat.combatants;
			map = combat.map;
		} else if (Comms.data.shared.type === 'exploration') {
			const exploration = Comms.data.shared.data as Exploration;
			combatants = exploration.combatants;
			map = exploration.map;
		}

		if (map) {
			const ids = [Comms.getCharacterID(Comms.getID())];
			Mercator.moveCombatants(ids, dir, combatants, map, 1);

			CommsPlayer.sendSharedUpdate();
			this.forceUpdate();
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

		CommsPlayer.sendSharedUpdate();
		this.forceUpdate();
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

		CommsPlayer.sendSharedUpdate();
		this.forceUpdate();
	}

	private toggleHidden(combatants: Combatant[]) {
		combatants.forEach(c => c.showOnMap = !c.showOnMap);

		CommsPlayer.sendSharedUpdate();
		this.forceUpdate();
	}

	//#endregion

	//#region Rendering helper methods

	private getNothingSection() {
		const characterID = Comms.getCharacterID(Comms.getID());

		let pcSection = null;
		if ((characterID === '') && (Comms.data.party !== null)) {
			const pcs = Comms.data.party.pcs.filter(pc => pc.active).map(pc => (
				<Group key={pc.id}>
					<div className='content-then-icons'>
						<div className='content'>
							<div className='section'>
								<PortraitPanel source={pc} inline={true} />
								{pc.name}
							</div>
							<Tag>
								{'level ' + pc.level + ' ' + pc.race + ' ' + pc.classes}
							</Tag>
						</div>
						<div className='icons'>
							<CheckCircleOutlined
								className={Comms.data.people.some(person => person.characterID === pc.id) ? 'disabled' : ''}
								title='select'
								onClick={() => CommsPlayer.sendUpdate('', pc.id)}
							/>
						</div>
					</div>
				</Group>
			));
			pcSection = (
				<div>
					<hr/>
					<div className='section'>
						in the meantime, please select your character:
					</div>
					{pcs}
					<hr/>
					<div className='section'>
						or, create a new character <button className='link' onClick={() => this.newPC()}>here</button>
					</div>
				</div>
			);
		}

		return (
			<Row align='middle' justify='center' className='scrollable'>
				<Note>
					<div className='section'>
						the dm is not currently sharing anything with you; when they do, you&apos;ll see it here
					</div>
					{pcSection}
				</Note>
			</Row>
		);
	}

	private getCombatSection(combat: Combat, additional: any) {
		const characterID = Comms.getCharacterID(Comms.getID());
		const highlightedSquare = additional['highlightedSquare'] as { x: number, y: number} | null ?? null;

		let banner = null;
		const current = combat.combatants.find(c => c.current);
		if (current && (current.id === characterID)) {
			banner = (
				<Note>
					<div className='section'>
						you are the current initiative holder
					</div>
				</Note>
			);
		}

		const initList = (
			<InitiativeOrder
				combat={combat}
				playerView={true}
				selectedText='you'
				showDefeated={false}
				help={null}
				selectedItemIDs={[characterID]}
				toggleItemSelection={() => null}
			/>
		);

		let map = null;
		if (combat.map) {
			map = (
				<div className='scrollable horizontal-only'>
					<MapPanel
						map={combat.map}
						mode='interactive-player'
						options={this.state.options}
						showGrid={this.state.addingToMap}
						combatants={combat.combatants}
						selectedItemIDs={[characterID]}
						selectedAreaID={combat.mapAreaID}
						fog={combat.fog}
						lighting={combat.lighting}
						focussedSquare={highlightedSquare}
						itemSelected={() => null}
						itemRemove={() => null}
						gridSquareClicked={(x, y) => {
							if (this.state.addingToMap) {
								const list = Napoleon.getMountsAndRiders([characterID], combat.combatants);
								list.forEach(c => Mercator.add(combat.map as Map, c, combat.combatants, x, y));
								this.setAddingToMap(false);
								CommsPlayer.sendSharedUpdate();
								this.forceUpdate();
							}
						}}
					/>
				</div>
			);
		}

		return (
			<div className='scrollable'>
				{banner}
				<GridPanel
					heading='encounter map'
					content={[map]}
					columns={1}
					showToggle={true}
				/>
				<GridPanel
					heading='initiative order'
					content={[initList]}
					columns={1}
					showToggle={true}
				/>
			</div>
		);
	}

	private getExplorationSection(exploration: Exploration, additional: any) {
		const characterID = Comms.getCharacterID(Comms.getID());
		const highlightedSquare = additional['highlightedSquare'] as { x: number, y: number} | null ?? null;

		return (
			<div className='scrollable both-ways'>
				<MapPanel
					map={exploration.map}
					mode='interactive-player'
					options={this.state.options}
					showGrid={this.state.addingToMap}
					combatants={exploration.combatants}
					selectedItemIDs={[characterID]}
					selectedAreaID={exploration.mapAreaID}
					fog={exploration.fog}
					lighting={exploration.lighting}
					focussedSquare={highlightedSquare}
					itemSelected={() => null}
					gridSquareClicked={(x, y) => {
						if (this.state.addingToMap) {
							const list = Napoleon.getMountsAndRiders([characterID], exploration.combatants);
							list.forEach(c => Mercator.add(exploration.map as Map, c, exploration.combatants, x, y));
							this.setAddingToMap(false);
							CommsPlayer.sendSharedUpdate();
							this.forceUpdate();
						}
					}}
					toggleTag={(combatants, tag) => this.toggleTag(combatants, tag)}
					toggleCondition={(combatants, condition) => this.toggleCondition(combatants, condition)}
					toggleHidden={(combatants) => this.toggleHidden(combatants)}
				/>
			</div>
		);
	}

	private getHandoutSection(handout: Handout) {
		switch (handout.type) {
			case 'image':
				return (
					<img
						className='nonselectable-image'
						src={handout.src}
						alt='handout'
					/>
				);
			case 'audio':
				return (
					<audio controls={true}>
						<source src={handout.src} />
					</audio>
				);
			case 'video':
				return (
					<video controls={true}>
						<source src={handout.src} />
					</video>
				);
			case 'text':
				return (
					<div className='scrollable'>
						<ReactMarkdown>{handout.src}</ReactMarkdown>
					</div>
				);
			case 'readaloud':
				return (
					<div className='scrollable'>
						<Note>
							<div className='section'>{handout.src}</div>
						</Note>
					</div>
				);
		}

		return null;
	}

	private getMonsterSection(monster: Monster) {
		return (
			<div className='scrollable'>
				<MonsterStatblockCard monster={monster} />
			</div>
		);
	}

	//#endregion

	//#region Rendering

	private getContent() {
		switch (CommsPlayer.getState()) {
			case 'not connected':
				return (
					<Row align='middle' justify='center' className='full-height'>
						<ConnectPanel dmcode={this.props.dmcode} />
					</Row>
				);
			case 'connecting':
				return (
					<Row align='middle' justify='center' className='full-height'>
						<div className='connection-panel'>
							<Note>
								<div className='section'>
									connecting to <span className='app-name'>dojo</span>...
								</div>
							</Note>
						</div>
					</Row>
				);
			case 'connected':
				{
					let shared = null;
					if ((Comms.getCharacterID(Comms.getID()) === '') || (Comms.data.shared.type === 'nothing')) {
						shared = this.getNothingSection();
					} else if (Comms.data.shared.type === 'combat') {
						const combat = Comms.data.shared.data as Combat;
						const additional = Comms.data.shared.additional;
						shared = this.getCombatSection(combat, additional);
					} else if (Comms.data.shared.type === 'exploration') {
						const exploration = Comms.data.shared.data as Exploration;
						const additional = Comms.data.shared.additional;
						shared = this.getExplorationSection(exploration, additional);
					} else if (Comms.data.shared.type === 'handout') {
						const handout = Comms.data.shared.data as Handout;
						shared = this.getHandoutSection(handout);
					} else if (Comms.data.shared.type === 'monster') {
						const monster = Comms.data.shared.data as Monster;
						shared = this.getMonsterSection(monster);
					}

					return (
						<div className='full-height'>
							{shared}
						</div>
					);
				}
		}
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
				case 'pc':
					content = (
						<PCEditorModal
							pc={this.state.drawer.pc}
							library={[]}
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

	private getShortcuts() {
		const shortcuts = [];

		const id = Comms.getCharacterID(Comms.getID());
		if (id !== '') {
			shortcuts.push(
				<UserOutlined
					key='stats'
					title='update your stats'
					onClick={() => {
						this.editPC();
					}}
				/>
			);

			if (Comms.data.options.allowChat) {
				shortcuts.push(
					<MessageOutlined
						key='chat'
						title='open chat'
						onClick={() => {
							const sidebar = this.state.sidebar;
							sidebar.type = 'session-chat';
							sidebar.subtype = '';
							sidebar.visible = true;
							this.setState({
								sidebar: sidebar
							});
						}}
					/>
				);
			}

			if (Comms.data.options.allowControls) {
				if ((Comms.data.shared.type === 'combat') || (Comms.data.shared.type === 'exploration')) {
					shortcuts.push(
						<ControlOutlined
							key='controls'
							title='open character controls'
							onClick={() => {
								const sidebar = this.state.sidebar;
								sidebar.type = 'session-controls';
								sidebar.subtype = '';
								sidebar.visible = true;
								this.setState({
									sidebar: sidebar
								});
							}}
						/>
					);
				}
			}
		}

		return shortcuts;
	}

	public render() {
		try {
			const shortcuts = this.getShortcuts();
			const content = this.getContent();
			const drawer = this.getDrawer();

			return (
				<div className={'dojo ' + this.state.options.theme}>
					<div className={this.state.sidebar.visible ? 'app with-sidebar' : 'app'}>
						<ErrorBoundary>
							<PageHeader
								breadcrumbs={[
									{
										id: 'home',
										text: 'dojo - player',
										onClick: () => null
									}
								]}
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
								shortcuts={shortcuts}
							/>
						</ErrorBoundary>
					</div>
					<ErrorBoundary>
						<PageSidebar
							sidebar={this.state.sidebar}
							user='player'
							options={this.state.options}
							onSelectSidebar={type => this.setSidebar(type)}
							onUpdateSidebar={sidebar => this.setState({ sidebar: sidebar })}
							addCondition={(combatants, allCombatants) => this.addCondition(combatants, allCombatants)}
							editCondition={(combatant, condition, allCombatants) => this.editCondition(combatant, condition, allCombatants)}
							toggleAddingToMap={() => this.setAddingToMap(!this.state.addingToMap)}
							onUpdated={() => this.forceUpdate()}
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
			return <RenderError context='Player' error={e} />;
		}
	}

	//#endregion
}

//#region ConnectPanel

interface ConnectPanelProps {
	dmcode: string;
}

interface ConnectPanelState {
	name: string;
}

class ConnectPanel extends React.Component<ConnectPanelProps, ConnectPanelState> {
	constructor(props: ConnectPanelProps) {
		super(props);

		// Load player name
		const str = window.localStorage.getItem('connect-as-player') || '';

		this.state = {
			name: str
		};
	}

	private setName(name: string) {
		this.setState({
			name: name
		}, () => {
			// Save player name
			window.localStorage.setItem('connect-as-player', name);
		});
	}

	private canConnect() {
		return this.state.name !== '';
	}

	private connect() {
		if (this.canConnect()) {
			CommsPlayer.connect(this.props.dmcode, this.state.name);
		}
	}

	public render() {
		try {
			if (this.props.dmcode === '') {
				return (
					<Note>
						<div className='section'>
							this url isn&apos;t a valid dojo player url - there&apos;s no 6-letter dm code at the end
						</div>
					</Note>
				);
			}

			return (
				<div className='connection-panel'>
					<div className='heading'>connect</div>
					<Textbox placeholder='your name' debounce={false} text={this.state.name} onChange={name => this.setName(name)} />
					<button className={this.canConnect() ? '' : 'disabled'} onClick={() => this.connect()}>connect</button>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='ConnectPanel' error={e} />;
		}
	}
}

//#endregion

//#region RollPrompt

interface RollPromptProps {
	type: string;
	notificationKey: string;
}

interface RollPromptState {
	mode: string;
	dice: { [sides: number]: number };
	constant: number;
	result: DieRollResult | null;
	entry: number;
}

class RollPrompt extends React.Component<RollPromptProps, RollPromptState> {
	constructor(props: RollPromptProps) {
		super(props);

		const dice: { [sides: number]: number } = {};
		[4, 6, 8, 10, 12, 20, 100].forEach(n => dice[n] = 0);
		dice[20] = 1;

		this.state = {
			mode: 'roll',
			dice: dice,
			constant: 0,
			result: null,
			entry: 10
		};
	}

	private setMode(mode: string) {
		this.setState({
			mode: mode
		});
	}

	private setDie(sides: number, count: number) {
		const dice = this.state.dice;
		dice[sides] = count;
		this.setState({
			dice: dice
		});
	}

	private setConstant(value: number) {
		this.setState({
			constant: value
		});
	}

	private resetDice() {
		const dice = this.state.dice;
		[4, 6, 8, 10, 12, 20, 100].forEach(n => dice[n] = 0);
		this.setState({
			dice: dice,
			constant: 0
		});
	}

	private setEntry(entry: number) {
		this.setState({
			entry: entry
		});
	}

	private roll(expression: string, mode: '' | 'advantage' | 'disadvantage') {
		const result = Gygax.rollDice(expression, this.state.dice, this.state.constant, mode);
		this.setState({
			result: result
		});
	}

	private sendRoll() {
		let value = this.state.entry;
		if ((this.state.mode === 'roll') && (this.state.result !== null)) {
			value = this.state.result.constant;
			this.state.result.rolls.forEach(roll => {
				value += roll.value;
			});
		}
		CommsPlayer.sendRollResult(this.props.type, value);
		notification.close(this.props.notificationKey);
	}

	public render() {
		try {
			let content = null;
			switch (this.state.mode) {
				case 'roll':
					if (this.state.result === null) {
					content = (
						<div>
							<DieRollPanel
								dice={this.state.dice}
								constant={this.state.constant}
								setDie={(sides, count) => this.setDie(sides, count)}
								setConstant={value => this.setConstant(value)}
								resetDice={() => this.resetDice()}
								rollDice={(expression, mode) => this.roll(expression, mode)}
							/>
						</div>
					);
					} else {
						content = (
							<div>
								<DieRollResultPanel result={this.state.result} />
								<button onClick={() => this.sendRoll()}>send</button>
							</div>
						);
					}
					break;
				case 'enter':
					content = (
						<div>
							<NumberSpin
								value={this.state.entry}
								label={this.props.type}
								onNudgeValue={delta => this.setEntry(this.state.entry + delta)}
							/>
							<button onClick={() => this.sendRoll()}>send</button>
						</div>
					);
					break;
			}

			return (
				<div>
					<div className='heading'>{this.props.type}</div>
					<Selector
						options={Utils.arrayToItems(['roll', 'enter'])}
						selectedID={this.state.mode}
						onSelect={mode => this.setMode(mode)}
					/>
					<hr/>
					{content}
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='RollPrompt' error={e} />;
		}
	}
}

//#endregion
