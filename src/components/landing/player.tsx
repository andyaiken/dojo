import { Col, Drawer, Row } from 'antd';
import React from 'react';

import { Comms, CommsPlayer } from '../../utils/comms';
import Mercator from '../../utils/mercator';

import { Combat } from '../../models/combat';
import { Exploration } from '../../models/map';

import Textbox from '../controls/textbox';
import PCEditorModal from '../modals/editors/pc-editor-modal';
import StatBlockModal from '../modals/stat-block-modal';
import ErrorBoundary from '../panels/error-boundary';
import GridPanel from '../panels/grid-panel';
import InitiativeOrder from '../panels/initiative-order';
import MapPanel from '../panels/map-panel';
import Note from '../panels/note';
import PageFooter from '../panels/page-footer';
import PageHeader from '../panels/page-header';
import { MessagesPanel, PeoplePanel, SendMessagePanel } from '../panels/session-panel';

interface Props {
}

interface State {
	drawer: any;
}

export default class Player extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			drawer: null
		};
	}

	public componentDidMount() {
		CommsPlayer.onStateChanged = () => this.setState(this.state);
		CommsPlayer.onDataChanged = () => this.setState(this.state);
	}

	public componentWillUnmount() {
		CommsPlayer.onStateChanged = () => null;
		CommsPlayer.onDataChanged = () => null;

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
				<Col xs={24} sm={24} md={8} lg={6} xl={4} className='scrollable sidebar sidebar-left'>
					<Note>
						<p>the following people are connected</p>
					</Note>
					<PeoplePanel
						user='player'
						people={Comms.data.people}
						editPC={id => this.editPC(id)}
					/>
				</Col>
				<Col xs={24} sm={24} md={16} lg={18} xl={20} className='full-height sidebar'>
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
		return (
			<Row className='full-height'>
				<Col xs={24} sm={24} md={12} lg={16} xl={18} className='full-height'>
					{shared}
				</Col>
				<Col xs={24} sm={24} md={12} lg={8} xl={6} className='full-height sidebar sidebar-right'>
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

	private getCombatSection(combat: Combat, additional: any) {
		const selectedItemIDs = additional['selectedItemIDs'] as string[] ?? [];
		const selectedAreaID = additional['selectedAreaID'] as string ?? '';
		const highlightedSquare = additional['highlightedSquare'] as { x: number, y: number} | null ?? null;

		const initList = (
			<InitiativeOrder
				combat={combat}
				playerView={true}
				showDefeated={false}
				help={null}
				selectedItemIDs={selectedItemIDs}
				toggleItemSelection={(id, ctrl) => null}
			/>
		);

		let map = null;
		if (combat.map) {
			map = (
				<div className='scrollable horizontal-only'>
					<MapPanel
						map={combat.map}
						viewport={Mercator.getViewport(combat.map, selectedAreaID)}
						mode='combat-player'
						fog={combat.fog}
						combatants={combat.combatants}
						selectedItemIDs={selectedItemIDs}
						focussedSquare={highlightedSquare}
						itemSelected={(id, ctrl) => null}
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
		const selectedItemIDs = additional['selectedItemIDs'] as string[] ?? [];
		const selectedAreaID = additional['selectedAreaID'] as string ?? '';
		const highlightedSquare = additional['highlightedSquare'] as { x: number, y: number} | null ?? null;

		return (
			<div className='scrollable both-ways'>
				<MapPanel
					map={exploration.map}
					viewport={Mercator.getViewport(exploration.map, selectedAreaID)}
					mode='combat-player'
					fog={exploration.fog}
					combatants={exploration.combatants}
					selectedItemIDs={selectedItemIDs}
					focussedSquare={highlightedSquare}
					itemSelected={(id, ctrl) => null}
				/>
			</div>
		);
	}

	private getTabs() {
		return [];
	}

	private getDrawer() {
		let content = null;
		let header = null;
		let footer = null;
		const width = '50%';
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
