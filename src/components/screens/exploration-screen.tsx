import { Col, Row } from 'antd';
import React from 'react';

import Gygax from '../../utils/gygax';

import { Combatant } from '../../models/combat';
import { Condition } from '../../models/condition';
import { Exploration } from '../../models/map';
import { Monster } from '../../models/monster';
import { Companion, PC } from '../../models/party';

import MonsterStatblockCard from '../cards/monster-statblock-card';
import PCCard from '../cards/pc-card';
import Checkbox from '../controls/checkbox';
import ConfirmButton from '../controls/confirm-button';
import CombatControlsPanel from '../panels/combat-controls-panel';
import GridPanel from '../panels/grid-panel';
import { NotOnMapInitiativeEntry } from '../panels/initiative-entry';
import MapPanel from '../panels/map-panel';
import Note from '../panels/note';
import Popout from '../panels/popout';

interface Props {
	exploration: Exploration;
	startCombat: (exploration: Exploration) => void;
	toggleTag: (combatants: Combatant[], tag: string) => void;
	toggleCondition: (combatants: Combatant[], condition: string) => void;
	toggleHidden: (combatants: Combatant[]) => void;
	addCondition: (combatants: Combatant[]) => void;
	editCondition: (combatant: Combatant, condition: Condition) => void;
	removeCondition: (combatant: Combatant, condition: Condition) => void;
	changeValue: (source: any, field: string, value: any) => void;
	fillFog: () => void;
	clearFog: () => void;
	toggleFog: (x1: number, y1: number, x2: number, y2: number) => void;
	addCompanion: (companion: Companion) => void;
	mapAdd: (combatant: Combatant, x: number, y: number) => void;
	mapMove: (ids: string[], dir: string) => void;
	mapRemove: (ids: string[]) => void;
	onChangeAltitude: (combatant: Combatant, value: number) => void;
	rotateMap: () => void;
	getMonster: (id: string) => Monster | null;
	pauseExploration: () => void;
	endExploration: (exploration: Exploration) => void;
}

interface State {
	playerViewOpen: boolean;
	editFog: boolean;
	selectedCombatantIDs: string[];
	selectedAreaID: string | null;
}

export default class ExplorationScreen extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			playerViewOpen: false,
			editFog: false,
			selectedCombatantIDs: [],
			selectedAreaID: null
		};
	}

	private setPlayerViewOpen(open: boolean) {
		this.setState({
			playerViewOpen: open
		});
	}

	private toggleEditFog() {
		this.setState({
			editFog: !this.state.editFog,
			selectedCombatantIDs: []
		});
	}

	private setSelectedCombatantIDs(ids: string[]) {
		this.setState({
			editFog: (ids.length > 0) ? false : this.state.editFog,
			selectedCombatantIDs: ids
		});
	}

	private setSelectedAreaID(id: string | null) {
		this.setState({
			selectedAreaID: id
		});
	}

	private addCompanion(companion: Companion) {
		this.setState({
			selectedCombatantIDs: [companion.id]
		}, () => this.props.addCompanion(companion));
	}

	private toggleItemSelection(id: string | null, ctrl: boolean) {
		if (id && ctrl) {
			const ids = this.state.selectedCombatantIDs;
			if (ids.includes(id)) {
				const index = ids.indexOf(id);
				ids.splice(index, 1);
			} else {
				ids.push(id);
			}
			this.setSelectedCombatantIDs(ids);
		} else {
			this.setSelectedCombatantIDs(id ? [id] : []);
		}
	}

	private mapRemove(combatants: Combatant[]) {
		this.setState({
			selectedCombatantIDs: []
		}, () => this.props.mapRemove(combatants.map(c => c.id)));
	}

	private nudgeValue(source: any, field: string, delta: number) {
		let value = null;
		switch (field) {
			case 'challenge':
				value = Gygax.nudgeChallenge(source[field], delta);
				break;
			case 'size':
			case 'displaySize':
				value = Gygax.nudgeSize(source[field], delta);
				break;
			default:
				value = source[field] + delta;
		}

		this.props.changeValue(source, field, value);
	}

	private gridSquareClicked(x: number, y: number, playerView: boolean) {
		const combatant = this.props.exploration.combatants.find(c => c.id === this.state.selectedCombatantIDs[0]);
		const mapItem = this.props.exploration.map.items.find(i => i.id === this.state.selectedCombatantIDs[0]);
		if (combatant && !mapItem) {
			this.props.mapAdd(combatant, x, y);
		}

		if (this.state.editFog && !playerView) {
			this.props.toggleFog(x, y, x, y);
		}
	}

	private getPlayerView() {
		if (this.state.playerViewOpen) {
			return (
				<Popout title='Map' onCloseWindow={() => this.setPlayerViewOpen(false)}>
					<div className='scrollable both-ways'>
						{this.getMap(true)}
					</div>
				</Popout>
			);
		}

		return null;
	}

	private getMap(playerView: boolean) {
		const adding = (this.state.selectedCombatantIDs.length === 1) && !this.props.exploration.map.items.find(i => i.id === this.state.selectedCombatantIDs[0]);

		let viewport = null;
		if (this.state.selectedAreaID) {
			const area = this.props.exploration.map.areas.find(a => a.id === this.state.selectedAreaID);
			if (area) {
				viewport = {
					minX: area.x,
					minY: area.y,
					maxX: area.x + area.width - 1,
					maxY: area.y + area.height - 1
				};
			}
		}

		return (
			<MapPanel
				map={this.props.exploration.map}
				mode={playerView ? 'combat-player' : 'combat'}
				viewport={viewport}
				combatants={this.props.exploration.combatants}
				showGrid={(adding || this.state.editFog) && !playerView}
				selectedItemIDs={this.state.selectedCombatantIDs}
				fog={this.props.exploration.fog}
				gridSquareClicked={(x, y) => this.gridSquareClicked(x, y, playerView)}
				gridRectangleSelected={(x1, y1, x2, y2) => this.props.toggleFog(x1, y1, x2, y2)}
				itemSelected={(id, ctrl) => this.toggleItemSelection(id, ctrl)}
				areaSelected={id => this.setSelectedAreaID(id)}
			/>
		);
	}

	public render() {
		try {
			let fogSection = null;
			if (this.state.editFog) {
				fogSection = (
					<div>
						<Note>
							<p>click on map squares to turn fog of war on and off</p>
							<p>you can also click and drag to select an area</p>
						</Note>
						<button onClick={() => this.props.fillFog()}>
							fill fog of war
						</button>
						<button className={this.props.exploration.fog.length === 0 ? 'disabled' : ''} onClick={() => this.props.clearFog()}>
							clear fog of war
						</button>
					</div>
				);
			}

			const leftSidebar = (
				<div>
					<Checkbox label='edit fog of war' checked={this.state.editFog} onChecked={() => this.toggleEditFog()} />
					{fogSection}
					<hr/>
					<button onClick={() => this.props.startCombat(this.props.exploration)}>start combat</button>
					<button onClick={() => this.props.rotateMap()}>rotate map</button>
					<Checkbox
						label='show player view'
						checked={this.state.playerViewOpen}
						onChecked={value => this.setPlayerViewOpen(value)}
					/>
					<hr />
					<div className='section'>
						<button onClick={() => this.props.pauseExploration()}>pause exploration</button>
						<ConfirmButton text='end exploration' onConfirm={() => this.props.endExploration(this.props.exploration)} />
					</div>
				</div>
			);

			let rightSidebar = null;

			const selection = this.props.exploration.combatants.filter(c => this.state.selectedCombatantIDs.includes(c.id));
			const items = this.props.exploration.map.items.filter(i => this.state.selectedCombatantIDs.includes(i.id));
			if ((selection.length > 0) && (items.length === selection.length)) {
				let statblock = null;
				if (selection.length === 1) {
					switch (selection[0].type) {
						case 'pc':
							statblock = (
								<PCCard pc={selection[0] as Combatant & PC} />
							);
							break;
						case 'companion':
							const companion = selection[0] as Combatant & Companion;
							if (companion.monsterID) {
								const monster = this.props.getMonster(companion.monsterID);
								if (monster) {
									statblock = (
										<MonsterStatblockCard monster={monster} />
									);
								}
							}
							break;
					}
				}
				rightSidebar = (
					<div className='section'>
						<CombatControlsPanel
							combatants={selection}
							allCombatants={this.props.exploration.combatants}
							map={this.props.exploration.map}
							defaultTab='map'
							// Main tab
							makeCurrent={combatant => null}
							makeActive={combatants => null}
							makeDefeated={combatants => null}
							toggleTag={(combatants, tag) => this.props.toggleTag(combatants, tag)}
							toggleCondition={(combatants, condition) => this.props.toggleCondition(combatants, condition)}
							toggleHidden={combatants => this.props.toggleHidden(combatants)}
							// HP tab
							changeHP={values => null}
							// Cond tab
							addCondition={combatants => this.props.addCondition(combatants)}
							editCondition={(combatant, condition) => this.props.editCondition(combatant, condition)}
							removeCondition={(combatant, condition) => this.props.removeCondition(combatant, condition)}
							// Map tab
							mapAdd={combatant => null}
							mapMove={(combatants, dir) => this.props.mapMove(combatants.map(c => c.id), dir)}
							mapRemove={combatants => this.mapRemove(combatants)}
							onChangeAltitude={(combatant, value) => this.props.onChangeAltitude(combatant, value)}
							// Adv tab
							removeCombatants={null}
							addCompanion={companion => this.addCompanion(companion)}
							// General
							changeValue={(source, field, value) => this.props.changeValue(source, field, value)}
							nudgeValue={(source, field, delta) => this.nudgeValue(source, field, delta)}
						/>
						{statblock}
					</div>
				);
			} else {
				const notOnMap = this.props.exploration.combatants.filter(pc => !this.props.exploration.map.items.find(i => i.id === pc.id));
				if (notOnMap.length) {
					const missing = notOnMap.map(pc => {
						return (
							<NotOnMapInitiativeEntry
								key={pc.id}
								combatant={pc}
								addToMap={() => this.setSelectedCombatantIDs([pc.id])}
							/>
						);
					});
					const section = (
						<div>
							<Note>
								<div className='section'>these pcs have not yet been placed on the map</div>
								<div className='section'>to place one on the map, click the <b>place on map</b> button and then click on a map square</div>
							</Note>
							{missing}
						</div>
					);
					rightSidebar = (
						<GridPanel
							heading='not on the map'
							columns={1}
							content={[section]}
						/>
					);
				} else {
					rightSidebar = (
						<Note>
							<div className='section'>
								select a map token to see its details here
							</div>
						</Note>
					);
				}
			}

			return (
				<Row className='full-height'>
					<Col xs={24} sm={24} md={8} lg={6} xl={4} className='scrollable sidebar sidebar-left'>
						{leftSidebar}
					</Col>
					<Col xs={24} sm={24} md={8} lg={12} xl={16} className='scrollable both-ways'>
						<GridPanel
							heading={this.props.exploration.name}
							columns={1}
							content={[this.getMap(false)]}
						/>
					</Col>
					<Col xs={24} sm={24} md={8} lg={6} xl={4} className='scrollable'>
						{rightSidebar}
					</Col>
					{this.getPlayerView()}
				</Row>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}
