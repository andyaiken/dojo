import { CloseCircleOutlined, CommentOutlined, ControlOutlined, UserOutlined } from '@ant-design/icons';
import { Col, Drawer, notification, Row } from 'antd';
import React from 'react';

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

import { MonsterStatblockCard } from '../cards/monster-statblock-card';
import { NumberSpin } from '../controls/number-spin';
import { Selector } from '../controls/selector';
import { Textbox } from '../controls/textbox';
import { ConditionModal } from '../modals/condition-modal';
import { PCEditorModal } from '../modals/editors/pc-editor-modal';
import { StatBlockModal } from '../modals/stat-block-modal';
import { AwardPanel } from '../panels/award-panel';
import { DieRollPanel } from '../panels/die-roll-panel';
import { DieRollResultPanel } from '../panels/die-roll-result-panel';
import { ErrorBoundary } from '../panels/error-boundary';
import { GridPanel } from '../panels/grid-panel';
import { InitiativeOrder } from '../panels/initiative-order';
import { MapPanel } from '../panels/map-panel';
import { Note } from '../panels/note';
import { PageFooter } from '../panels/page-footer';
import { PageHeader } from '../panels/page-header';
import { PageSidebar } from '../panels/page-sidebar';
import { PDF } from '../panels/pdf';
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
			theme: 'light'
		};
		try {
			const str = window.localStorage.getItem('data-options');
			if (str) {
				options = JSON.parse(str);

				if (options.theme === undefined) {
					options.theme = 'light';
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
				surge: '',
				draws: [],
				npc: null,
				selectedPartyID: null,
				selectedMonsterID: null
			},
			options: options
		};
	}

	//#endregion

	//#region Lifecycle

	public componentDidMount() {
		CommsPlayer.onStateChanged = () => this.forceUpdate();
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

	//#endregion

	//#region Rendering helper methods

	private getNothingSection() {
		const characterID = Comms.getCharacterID(Comms.getID());

		let pcSection = null;
		if ((characterID === '') && (Comms.data.party !== null)) {
			const pcs: JSX.Element[] = [];
			Comms.data.party.pcs.filter(pc => pc.active).forEach(pc => {
				const claimed = Comms.data.people.some(person => person.characterID === pc.id);
				if (!claimed) {
					pcs.push(
						<button key={pc.id} onClick={() => CommsPlayer.sendUpdate('', pc.id)}>
							<div className='section'>
								<PortraitPanel source={pc} inline={true} />
								{pc.name}
							</div>
							<div className='section small'>{'level ' + pc.level + ' ' + pc.race + ' ' + pc.classes}</div>
						</button>
					);
				}
			});
			pcSection = (
				<div>
					<hr/>
					<p>in the meantime, please select your character:</p>
					{pcs}
					<p>or, create a new character <button className='link' onClick={() => this.newPC()}>here</button></p>
				</div>
			);
		}

		return (
			<Row align='middle' justify='center' className='scrollable'>
				<Note>
					<p>the dm is not currently sharing anything with you; when they do, you'll see it here</p>
					{pcSection}
				</Note>
			</Row>
		);
	}

	private getCombatSection(combat: Combat, additional: any) {
		const characterID = Comms.getCharacterID(Comms.getID());
		const selectedAreaID = additional['selectedAreaID'] as string ?? '';
		const highlightedSquare = additional['highlightedSquare'] as { x: number, y: number} | null ?? null;

		let banner = null;
		const current = combat.combatants.find(c => c.current);
		if (current && (current.id === characterID)) {
			banner = (
				<Note>
					<p>you are the current initiative holder</p>
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
				toggleItemSelection={(id, ctrl) => null}
			/>
		);

		let map = null;
		if (combat.map) {
			map = (
				<div className='scrollable horizontal-only'>
					<MapPanel
						map={combat.map}
						mode='combat-player'
						viewport={Mercator.getViewport(combat.map, selectedAreaID)}
						showGrid={this.state.addingToMap}
						combatants={combat.combatants}
						selectedItemIDs={[characterID]}
						fog={combat.fog}
						focussedSquare={highlightedSquare}
						itemSelected={(id, ctrl) => null}
						gridSquareClicked={(x, y) => {
							if (this.state.addingToMap) {
								const list = Napoleon.getMountsAndRiders([characterID], combat.combatants);
								list.forEach(c => Mercator.add(combat.map as Map, c, x, y));
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
		const selectedAreaID = additional['selectedAreaID'] as string ?? '';
		const highlightedSquare = additional['highlightedSquare'] as { x: number, y: number} | null ?? null;

		return (
			<div className='scrollable both-ways'>
				<MapPanel
					map={exploration.map}
					mode='combat-player'
					viewport={Mercator.getViewport(exploration.map, selectedAreaID)}
					showGrid={this.state.addingToMap}
					combatants={exploration.combatants}
					selectedItemIDs={[characterID]}
					fog={exploration.fog}
					focussedSquare={highlightedSquare}
					itemSelected={(id, ctrl) => null}
					gridSquareClicked={(x, y) => {
						if (this.state.addingToMap) {
							const list = Napoleon.getMountsAndRiders([characterID], exploration.combatants);
							list.forEach(c => Mercator.add(exploration.map as Map, c, x, y));
							this.setAddingToMap(false);
							CommsPlayer.sendSharedUpdate();
							this.forceUpdate();
						}
					}}
				/>
			</div>
		);
	}

	private getHandoutSection(handout: Handout) {
		switch (handout.type) {
			case 'image':
				return (
					<img
						className='nonselectable-image borderless'
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
			case 'pdf':
				return (
					<div className='scrollable'>
						<PDF src={handout.src} />
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
								<p>connecting to <span className='app-name'>dojo</span>...</p>
							</Note>
						</div>
					</Row>
				);
			case 'connected':
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
					<CommentOutlined
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
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
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
		if (this.props.dmcode === '') {
			return (
				<Note>
					<p>this url isn't a valid dojo player url - there's no 6-letter dm code at the end</p>
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

	private roll(mode: '' | 'advantage' | 'disadvantage') {
		const result = Gygax.rollDice(this.state.dice, this.state.constant, mode);
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
							rollDice={mode => this.roll(mode)}
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
					options={['roll', 'enter'].map(o => ({ id: o, text: o }))}
					selectedID={this.state.mode}
					onSelect={mode => this.setMode(mode)}
				/>
				<hr/>
				{content}
			</div>
		);
	}
}

//#endregion
