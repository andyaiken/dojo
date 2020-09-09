import { Col, Drawer, notification, Row } from 'antd';
import React from 'react';

import { Comms, CommsPlayer } from '../../utils/comms';
import Factory from '../../utils/factory';
import Gygax from '../../utils/gygax';
import Matisse from '../../utils/matisse';
import Mercator from '../../utils/mercator';
import Napoleon from '../../utils/napoleon';
import Utils from '../../utils/utils';

import { Combat, Combatant } from '../../models/combat';
import { Condition } from '../../models/condition';
import { DieRollResult } from '../../models/dice';
import { Exploration, Map } from '../../models/map';

import NumberSpin from '../controls/number-spin';
import Selector from '../controls/selector';
import Textbox from '../controls/textbox';
import ConditionModal from '../modals/condition-modal';
import PCEditorModal from '../modals/editors/pc-editor-modal';
import StatBlockModal from '../modals/stat-block-modal';
import CombatControlsPanel from '../panels/combat-controls-panel';
import DieRollPanel from '../panels/die-roll-panel';
import DieRollResultPanel from '../panels/die-roll-result-panel';
import ErrorBoundary from '../panels/error-boundary';
import GridPanel from '../panels/grid-panel';
import InitiativeOrder from '../panels/initiative-order';
import MapPanel from '../panels/map-panel';
import Note from '../panels/note';
import PageFooter from '../panels/page-footer';
import PageHeader from '../panels/page-header';
import { ConnectionsPanel, MessagesPanel, PlayerStatusPanel, SendMessagePanel } from '../panels/session-panel';

interface Props {
}

interface State {
	addingToMap: boolean;
	drawer: any;
}

export default class Player extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			addingToMap: false,
			drawer: null
		};

		let maps: Map[] = [];
		let combats: Combat[] = [];
		let explorations: Exploration[] = [];
		try {
			const str1 = window.localStorage.getItem('data-maps');
			if (str1) {
				maps = JSON.parse(str1);
			}
			const str2 = window.localStorage.getItem('data-combats');
			if (str2) {
				combats = JSON.parse(str2);
			}
			const str3 = window.localStorage.getItem('data-explorations');
			if (str3) {
				explorations = JSON.parse(str3);
			}

			Matisse.clearUnusedImages(maps, combats, explorations);
		} catch (ex) {
			console.error('Could not parse JSON: ', ex);
		}
	}

	private setAddingToMap(adding: boolean) {
		this.setState({
			addingToMap: adding
		});
	}

	public componentDidMount() {
		CommsPlayer.onStateChanged = () => this.forceUpdate();
		CommsPlayer.onDataChanged = () => {
			if (Comms.data.shared) {
				Comms.data.shared.images.forEach(img => Matisse.saveImage(img.id, img.name, img.data));
			}
			this.forceUpdate();
		};
		Comms.onPromptForRoll = type => {
			if (Comms.getCharacterID(Comms.getID()) === '') {
				return;
			}

			const key = Utils.guid();
			notification.open({
				key: key,
				message: (
					<RollPrompt type={type} notificationKey={key} />
				),
				duration: null
			});
		};
	}

	public componentWillUnmount() {
		CommsPlayer.onStateChanged = null;
		CommsPlayer.onDataChanged = null;
		Comms.onPromptForRoll = null;

		CommsPlayer.disconnect();
	}

	private editPC(id: string) {
		if (Comms.data.party) {
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

	private closeDrawer() {
		this.setState({
			drawer: null
		});
	}

	private getBeadcrumbs() {
		return [{
			id: 'home',
			text: 'dojo - player',
			onClick: () => null
		}];
	}

	private getContent() {
		switch (CommsPlayer.getState()) {
			case 'not connected':
				return (
					<Row align='middle' justify='center' className='full-height'>
						<ConnectPanel />
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
				if (Comms.data.shared && (Comms.data.shared.type === 'combat')) {
					const combat = Comms.data.shared.data as Combat;
					const additional = Comms.data.shared.additional;
					shared = this.getCombatSection(combat, additional);
				}
				if (Comms.data.shared && (Comms.data.shared.type === 'exploration')) {
					const exploration = Comms.data.shared.data as Exploration;
					const additional = Comms.data.shared.additional;
					shared = this.getExplorationSection(exploration, additional);
				}
				if (shared !== null) {
					return this.getSharedView(shared);
				}
				return this.getMessagesView();
		}
	}

	private getMessagesView() {
		return (
			<Row className='full-height'>
				<Col span={6} className='scrollable sidebar sidebar-left padded'>
					<Note>
						<p>the following people are connected</p>
					</Note>
					<ConnectionsPanel
						user='player'
						people={Comms.data.people}
						kick={id => null}
					/>
					<hr/>
					<PlayerStatusPanel
						editPC={id => this.editPC(id)}
					/>
				</Col>
				<Col span={18} className='full-height sidebar'>
					<div className='sidebar-container in-page'>
						<div className='sidebar-content'>
							<MessagesPanel
								user='player'
								messages={Comms.data.messages}
								openImage={data => this.setState({drawer: { type: 'image', data: data }})}
								openStatBlock={monster => this.setState({drawer: { type: 'statblock', source: monster }})}
							/>
						</div>
						<div className='sidebar-footer'>
							<SendMessagePanel
								user='player'
								openStatBlock={monster => this.setState({drawer: { type: 'statblock', source: monster }})}
								sendMessage={(to, text, language, untranslated) => CommsPlayer.sendMessage(to, text, language, untranslated)}
								sendLink={(to, url) => CommsPlayer.sendLink(to, url)}
								sendImage={(to, image) => CommsPlayer.sendImage(to, image)}
								sendRoll={(to, roll) => CommsPlayer.sendRoll(to, roll)}
								sendMonster={(to, monster) => null}
							/>
						</div>
					</div>
				</Col>
			</Row>
		);
	}

	private getSharedView(shared: JSX.Element) {
		let controls = null;
		if (Comms.data.options.allowControls) {
			controls = (
				<Col span={6} className='scrollable sidebar sidebar-right'>
					{this.getControls()}
				</Col>
			);
		}

		return (
			<Row className='full-height'>
				<Col span={6} className='full-height sidebar sidebar-left'>
					<div className='sidebar-container in-page'>
						<div className='sidebar-content'>
							<MessagesPanel
								user='player'
								messages={Comms.data.messages}
								openImage={data => this.setState({drawer: { type: 'image', data: data }})}
								openStatBlock={monster => this.setState({drawer: { type: 'statblock', source: monster }})}
							/>
						</div>
						<div className='sidebar-footer'>
							<SendMessagePanel
								user='player'
								openStatBlock={monster => this.setState({drawer: { type: 'statblock', source: monster }})}
								sendMessage={(to, text, language, untranslated) => CommsPlayer.sendMessage(to, text, language, untranslated)}
								sendLink={(to, url) => CommsPlayer.sendLink(to, url)}
								sendImage={(to, image) => CommsPlayer.sendImage(to, image)}
								sendRoll={(to, roll) => CommsPlayer.sendRoll(to, roll)}
								sendMonster={(to, monster) => null}
							/>
						</div>
					</div>
				</Col>
				<Col span={Comms.data.options.allowControls ? 12 : 18} className='full-height'>
					{shared}
				</Col>
				{controls}
			</Row>
		);
	}

	private getCombatSection(combat: Combat, additional: any) {
		const characterID = Comms.getCharacterID(Comms.getID());
		const selectedAreaID = additional['selectedAreaID'] as string ?? '';
		const highlightedSquare = additional['highlightedSquare'] as { x: number, y: number} | null ?? null;

		const initList = (
			<InitiativeOrder
				combat={combat}
				playerView={true}
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

	private getControls() {
		let allCombatants: Combatant[] = [];
		let map: Map | null = null;

		if (Comms.data.shared && (Comms.data.shared.type === 'combat')) {
			const combat = Comms.data.shared.data as Combat;
			allCombatants = combat.combatants;
			map = combat.map;
		}
		if (Comms.data.shared && (Comms.data.shared.type === 'exploration')) {
			const exploration = Comms.data.shared.data as Exploration;
			allCombatants = exploration.combatants;
			map = exploration.map;
		}

		const characterID = Comms.getCharacterID(Comms.getID());
		const current = allCombatants.find(c => c.id === characterID);
		if (!current) {
			return (
				<div>
					<Note>
						when you choose your character, you will be able to control it here
					</Note>
					<PlayerStatusPanel
						editPC={id => this.editPC(id)}
					/>
				</div>
			);
		}

		return (
			<CombatControlsPanel
				combatants={[current]}
				allCombatants={allCombatants}
				map={map}
				defaultTab='main'
				// Main tab
				toggleTag={(combatants, tag) => {
					combatants.forEach(c => {
						if (c.tags.includes(tag)) {
							c.tags = c.tags.filter(t => t !== tag);
						} else {
							c.tags.push(tag);
						}
					});
					CommsPlayer.sendSharedUpdate();
					this.forceUpdate();
				}}
				toggleCondition={(combatants, condition) => {
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
				}}
				toggleHidden={combatants => {
					combatants.forEach(c => c.showOnMap = !c.showOnMap);
					CommsPlayer.sendSharedUpdate();
					this.forceUpdate();
				}}
				// Cond tab
				addCondition={combatants => this.addCondition(combatants, allCombatants)}
				editCondition={(combatant, condition) => this.editCondition(combatant, condition, allCombatants)}
				removeCondition={(combatant, condition) => {
					combatant.conditions = combatant.conditions.filter(cnd => cnd.name !== condition.name);
					CommsPlayer.sendSharedUpdate();
					this.forceUpdate();
				}}
				// Map tab
				mapAdd={combatant => this.setAddingToMap(!this.state.addingToMap)}
				mapMove={(combatants, dir) => {
					const ids = combatants.map(c => c.id);
					const list = Napoleon.getMountsAndRiders(ids, allCombatants).map(c => c.id);
					ids.forEach(id => {
						if (!list.includes(id)) {
							list.push(id);
						}
					});
					list.forEach(id => Mercator.move(map as Map, id, dir));
					Napoleon.setMountPositions(allCombatants, map as Map);
					CommsPlayer.sendSharedUpdate();
					this.forceUpdate();
				}}
				mapRemove={combatants => {
					const ids = combatants.map(c => c.id);
					const list = Napoleon.getMountsAndRiders(ids, allCombatants).map(c => c.id);
					ids.forEach(id => {
						if (!list.includes(id)) {
							list.push(id);
						}
					});
					list.forEach(id => Mercator.remove(map as Map, id));
					CommsPlayer.sendSharedUpdate();
					this.forceUpdate();
				}}
				onChangeAltitude={(combatant, value) => {
					const list = Napoleon.getMountsAndRiders([combatant.id], allCombatants);
					list.forEach(c => c.altitude = value);
					CommsPlayer.sendSharedUpdate();
					this.forceUpdate();
				}}
				// Adv tab
				addCompanion={companion => {
					allCombatants.push(Napoleon.convertCompanionToCombatant(companion));
					Utils.sort(allCombatants, [{ field: 'displayName', dir: 'asc' }]);
					CommsPlayer.sendSharedUpdate();
					this.forceUpdate();
				}}
				// General
				changeValue={(source, field, value) => {
					source[field] = value;
					CommsPlayer.sendSharedUpdate();
					this.forceUpdate();
				}}
				nudgeValue={(source, field, delta) => {
					let value = null;
					switch (field) {
						case 'displaySize':
							value = Gygax.nudgeSize(source.displaySize, delta);
							break;
						default:
							value = source[field] + delta;
							break;
					}
					source[field] = value;
					CommsPlayer.sendSharedUpdate();
					this.forceUpdate();
				}}
			/>
		);
	}

	private getTabs() {
		return [];
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
						<img className='nonselectable-image' src={this.state.drawer.data} alt='' />
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

	public render() {
		try {
			const breadcrumbs = this.getBeadcrumbs();
			const content = this.getContent();
			const tabs = this.getTabs();
			const drawer = this.getDrawer();

			return (
				<div className='dojo'>
					<div className='app'>
						<ErrorBoundary>
							<PageHeader
								breadcrumbs={breadcrumbs}
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
								onSelectView={view => null}
							/>
						</ErrorBoundary>
					</div>
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
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}

//#region ConnectPanel

interface ConnectPanelProps {
}

interface ConnectPanelState {
	code: string;
	name: string;
}

class ConnectPanel extends React.Component<ConnectPanelProps, ConnectPanelState> {
	constructor(props: ConnectPanelProps) {
		super(props);
		this.state = {
			code: '',
			name: ''
		};
	}

	private setCode(code: string) {
		this.setState({
			code: code
		});
	}

	private setName(name: string) {
		this.setState({
			name: name
		});
	}

	private canConnect() {
		return (this.state.code !== '') && (this.state.name !== '');
	}

	private connect() {
		if (this.canConnect()) {
			CommsPlayer.connect(this.state.code, this.state.name);
		}
	}

	public render() {
		return (
			<div className='connection-panel'>
				<div className='heading'>connect</div>
				<Textbox placeholder='dm code' debounce={false} text={this.state.code} onChange={code => this.setCode(code)} />
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
