import { CloseCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { Col, Drawer, Row } from 'antd';
import React from 'react';

import { Factory } from '../../utils/factory';
import { Gygax } from '../../utils/gygax';
import { Mercator } from '../../utils/mercator';
import { Comms, CommsDM } from '../../utils/uhura';
import { Utils } from '../../utils/utils';

import { Combatant } from '../../models/combat';
import { Condition } from '../../models/condition';
import { Exploration, MapItem } from '../../models/map';
import { Options } from '../../models/misc';
import { Monster, MonsterGroup, Trait } from '../../models/monster';
import { Companion, PC } from '../../models/party';

import { MapItemCard } from '../cards/map-item-card';
import { MonsterStatblockCard } from '../cards/monster-statblock-card';
import { PCStatblockCard } from '../cards/pc-statblock-card';
import { Checkbox } from '../controls/checkbox';
import { ConfirmButton } from '../controls/confirm-button';
import { CombatControlsPanel } from '../panels/combat-controls-panel';
import { GridPanel } from '../panels/grid-panel';
import { NotOnMapInitiativeEntry } from '../panels/initiative-entry';
import { MapPanel } from '../panels/map-panel';
import { Note } from '../panels/note';
import { Popout } from '../panels/popout';
import { TraitsPanel } from '../panels/traits-panel';

interface Props {
	exploration: Exploration;
	library: MonsterGroup[];
	options: Options;
	startCombat: (exploration: Exploration) => void;
	toggleTag: (combatants: Combatant[], tag: string) => void;
	toggleCondition: (combatants: Combatant[], condition: string) => void;
	toggleHidden: (combatants: Combatant[]) => void;
	addCondition: (combatants: Combatant[]) => void;
	editCondition: (combatant: Combatant, condition: Condition) => void;
	deleteCondition: (combatant: Combatant, condition: Condition) => void;
	changeValue: (source: any, field: string, value: any) => void;
	addCompanion: (companion: Companion) => void;
	mapAdd: (combatant: Combatant, x: number, y: number) => void;
	mapMove: (ids: string[], dir: string, step: number) => void;
	mapRemove: (ids: string[]) => void;
	onChangeAltitude: (combatant: Combatant, value: number) => void;
	scatterCombatants: (combatants: Combatant[], areaID: string | null) => void;
	rotateMap: () => void;
	getMonster: (id: string) => Monster | null;
	useTrait: (trait: Trait) => void;
	rechargeTrait: (trait: Trait) => void;
	setFog: (fog: { x: number, y: number }[]) => void;
	addOverlay: (overlay: MapItem) => void;
	onRollDice: (count: number, sides: number, constant: number) => void;
	onOpenSession: () => void;
	pauseExploration: () => void;
	endExploration: (exploration: Exploration) => void;
}

interface State {
	showOptions: boolean;
	playerViewOpen: boolean;
	addingToMapID: string | null;
	addingOverlay: boolean;
	editFog: boolean;
	highlightMapSquare: boolean;
	highlightedSquare: { x: number, y: number} | null;
	selectedItemIDs: string[];
	selectedAreaID: string | null;
}

export class ExplorationScreen extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			showOptions: false,
			playerViewOpen: false,
			addingToMapID: null,
			addingOverlay: false,
			editFog: false,
			highlightMapSquare: false,
			highlightedSquare: null,
			selectedItemIDs: [],
			selectedAreaID: null
		};
	}

	public componentDidMount() {
		window.addEventListener('beforeunload', () => {
			this.setPlayerViewOpen(false);
		});
	}

	public componentDidUpdate() {
		if (Comms.data.shared.type === 'exploration') {
			Comms.data.shared.additional = {
				selectedAreaID: this.state.selectedAreaID,
				highlightedSquare: this.state.highlightedSquare
			};
			CommsDM.sendSharedDiffUpdate();
		}
	}

	private toggleShowOptions() {
		this.setState({
			showOptions: !this.state.showOptions
		});
	}

	private setPlayerViewOpen(open: boolean) {
		this.setState({
			playerViewOpen: open
		});
	}

	private setAddingToMapID(id: string | null) {
		this.setState({
			addingToMapID: id,
			addingOverlay: false,
			editFog: false,
			highlightMapSquare: false,
			highlightedSquare: null
		});
	}

	private toggleEditFog() {
		this.setState({
			addingOverlay: false,
			editFog: !this.state.editFog,
			selectedItemIDs: [],
			highlightMapSquare: false,
			highlightedSquare: null
		});
	}

	private toggleAddingOverlay() {
		this.setState({
			addingOverlay: !this.state.addingOverlay,
			editFog: false,
			selectedItemIDs: [],
			highlightMapSquare: false,
			highlightedSquare: null
		});
	}

	private toggleHighlightMapSquare() {
		this.setState({
			addingOverlay: false,
			editFog: false,
			selectedItemIDs: [],
			highlightMapSquare: !this.state.highlightMapSquare,
			highlightedSquare: null
		});
	}

	private setHighlightedSquare(x: number, y: number, playerView: boolean) {
		if (this.state.highlightMapSquare && !playerView) {
			this.setState({
				highlightedSquare: {
					x: x,
					y: y
				}
			});
		}
	}

	private setSelectedItemIDs(ids: string[]) {
		this.setState({
			editFog: (ids.length > 0) ? false : this.state.editFog,
			selectedItemIDs: ids
		});
	}

	private setSelectedAreaID(id: string | null) {
		this.setState({
			selectedAreaID: id
		});
	}

	private addCompanion(companion: Companion) {
		this.setState({
			selectedItemIDs: [companion.id]
		}, () => this.props.addCompanion(companion));
	}

	private toggleItemSelection(id: string | null, ctrl: boolean) {
		if (id && ctrl) {
			const ids = this.state.selectedItemIDs;
			if (ids.includes(id)) {
				const index = ids.indexOf(id);
				ids.splice(index, 1);
			} else {
				ids.push(id);
			}
			this.setSelectedItemIDs(ids);
		} else {
			this.setSelectedItemIDs(id ? [id] : []);
		}
	}

	private mapRemove(combatants: Combatant[]) {
		this.setState({
			selectedItemIDs: []
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

	private fillFog() {
		if (this.props.exploration.map) {
			const fog: { x: number, y: number }[] = [];
			const dims = Mercator.mapDimensions(this.props.exploration.map.items);
			if (dims) {
				for (let x = dims.minX; x <= dims.maxX; ++x) {
					for (let y = dims.minY; y <= dims.maxY; ++y) {
						fog.push({ x: x, y: y });
					}
				}
				this.props.setFog(fog);
			}
		}
	}

	private clearFog() {
		this.props.setFog([]);
	}

	private gridSquareClicked(x: number, y: number, playerView: boolean) {
		if (this.state.addingToMapID) {
			const combatant = this.props.exploration.combatants.find(c => c.id === this.state.addingToMapID);
			if (combatant) {
				this.props.mapAdd(combatant, x, y);
			}

			this.setAddingToMapID(null);
		}

		if (this.state.addingOverlay) {
			const token = Factory.createMapItem();
			token.type = 'token';
			token.x = x;
			token.y = y;
			token.width = 1;
			token.height = 1;
			token.color = '#005080';
			token.opacity = 127;
			token.style = 'square';

			this.props.addOverlay(token);
			this.setState({
				addingOverlay: false,
				addingToMapID: null,
				selectedItemIDs: [token.id]
			});
		}

		if (this.state.editFog && !playerView) {
			this.gridRectangleSelected(x, y, x, y);
		}
	}

	private gridRectangleSelected(x1: number, y1: number, x2: number, y2: number) {
		if (this.state.addingOverlay) {
			const overlay = Factory.createMapItem();
			overlay.type = 'overlay';
			overlay.x = x1;
			overlay.y = y1;
			overlay.width = (x2 - x1) + 1;
			overlay.height = (y2 - y1) + 1;
			overlay.color = '#005080';
			overlay.opacity = 127;
			overlay.style = 'square';

			this.props.addOverlay(overlay);
			this.setState({
				addingOverlay: false,
				addingToMapID: null,
				selectedItemIDs: [overlay.id]
			});
		}

		if (this.state.editFog) {
			const fog = this.props.exploration.fog;

			for (let x = x1; x <= x2; ++x) {
				for (let y = y1; y <= y2; ++y) {
					const index = fog.findIndex(i => (i.x === x) && (i.y === y));
					if (index === -1) {
						fog.push({ x: x, y: y });
					} else {
						fog.splice(index, 1);
					}
				}
			}

			this.props.setFog(fog);
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

	private getOptions() {
		if (!this.state.showOptions) {
			return null;
		}

		let session = null;
		if (CommsDM.getState() === 'started') {
			session = (
				<Checkbox
					label='share in session'
					checked={Comms.data.shared.type === 'exploration'}
					onChecked={value => value ? CommsDM.shareExploration(this.props.exploration) : CommsDM.shareNothing()}
				/>
			);
		} else {
			session = (
				<button
					onClick={() => {
						this.setState({
							showOptions: false
						}, () => {
							this.props.onOpenSession();
						});
					}}
				>
					start a session
				</button>
			);
		}

		return (
			<div className='scrollable'>
				<div className='heading'>exploration</div>
				<button onClick={() => this.props.startCombat(this.props.exploration)}>stop exploring and start combat</button>
				<button onClick={() => this.props.pauseExploration()}>pause exploration</button>
				<ConfirmButton text='end exploration' onConfirm={() => this.props.endExploration(this.props.exploration)} />
				<div className='heading'>map</div>
				<Checkbox label='add token / overlay' checked={this.state.addingOverlay} onChecked={() => this.toggleAddingOverlay()} />
				<div className='group-panel' style={{ display: this.state.addingOverlay ? '' : 'none' }}>
					<Note>
						<p>click on a map square to add a token, or select a rectangle to add an overlay</p>
					</Note>
				</div>
				<Checkbox label='highlight map square' checked={this.state.highlightMapSquare} onChecked={() => this.toggleHighlightMapSquare()} />
				<div className='group-panel' style={{ display: this.state.highlightMapSquare ? '' : 'none' }}>
					<Note>
						<p>use your mouse to indicate a square on the map</p>
						<p>that square will be highlighted on the shared map as well</p>
					</Note>
				</div>
				<Checkbox label='edit fog of war' checked={this.state.editFog} onChecked={() => this.toggleEditFog()} />
				<div className='group-panel' style={{ display: this.state.editFog ? '' : 'none' }}>
					<Note>
						<p>click on map squares to turn fog of war on and off</p>
						<p>you can also click and drag to select an area</p>
					</Note>
					<button onClick={() => this.fillFog()}>
						fill fog of war
					</button>
					<button className={this.props.exploration.fog.length === 0 ? 'disabled' : ''} onClick={() => this.clearFog()}>
						clear fog of war
					</button>
				</div>
				<button onClick={() => this.props.rotateMap()}>rotate map</button>
				<div className='heading'>sharing</div>
				<Checkbox
					label='share in player view'
					checked={this.state.playerViewOpen}
					onChecked={value => this.setPlayerViewOpen(value)}
				/>
				{session}
			</div>
		);
	}

	private getMap(playerView: boolean) {
		return (
			<MapPanel
				map={this.props.exploration.map}
				mode={playerView ? 'combat-player' : 'combat'}
				viewport={Mercator.getViewport(this.props.exploration.map, this.state.selectedAreaID)}
				combatants={this.props.exploration.combatants}
				showGrid={((this.state.addingToMapID !== null) || this.state.addingOverlay || this.state.editFog || this.state.highlightMapSquare) && !playerView}
				selectedItemIDs={this.state.selectedItemIDs}
				fog={this.props.exploration.fog}
				focussedSquare={this.state.highlightedSquare}
				gridSquareEntered={(x, y) => this.setHighlightedSquare(x, y, playerView)}
				gridSquareClicked={(x, y) => this.gridSquareClicked(x, y, playerView)}
				gridRectangleSelected={(x1, y1, x2, y2) => this.gridRectangleSelected(x1, y1, x2, y2)}
				itemSelected={(id, ctrl) => this.toggleItemSelection(id, ctrl)}
				areaSelected={id => this.setSelectedAreaID(id)}
			/>
		);
	}

	private getSelectedCombatants() {
		// Find which combatants we've selected
		const combatants = this.state.selectedItemIDs
			.map(id => this.props.exploration.combatants.find(c => c.id === id))
			.filter(c => !!c) as Combatant[];
		Utils.sort(combatants, [{ field: 'displayName', dir: 'asc' }]);

		// Have we selected any placeholders?
		// If we have, just show the info for the first one
		const selectedPlaceholders = combatants.filter(c => c.type === 'placeholder');
		if (selectedPlaceholders.length > 0) {
			return (
				<div>
					{this.createCard(selectedPlaceholders[0])}
				</div>
			);
		}

		// Have we selected only the current combatant?
		if ((combatants.length > 0) && combatants.every(c => c.current)) {
			return (
				<Note>
					<div className='section'>
						you've selected the current initiative holder
					</div>
				</Note>
			);
		}

		// Have we selected a single combatant?
		if (combatants.length === 1) {
			return (
				<div>
					{this.createControls(combatants)}
					<hr/>
					{this.createCard(combatants[0])}
				</div>
			);
		}

		// Have we selected multiple combatants?
		if (combatants.length > 1) {
			return (
				<div>
					<Note>
						<div className='section'>multiple combatants are selected:</div>
						{combatants.map(c => (
							<div key={c.id} className='group-panel'>
								{c.displayName}
								<CloseCircleOutlined
									style={{ float: 'right', padding: '2px 0', fontSize: '14px' }}
									onClick={() => this.toggleItemSelection(c.id, true)}
								/>
							</div>
						))}
					</Note>
					{this.createControls(combatants)}
				</div>
			);
		}

		// Have we selected a map item?
		if (this.props.exploration.map) {
			const mapItem = this.props.exploration.map.items.find(i => i.id === this.state.selectedItemIDs[0]);
			if (mapItem) {
				return (
					<MapItemCard
						item={mapItem}
						moveMapItem={(item, dir, step) => this.props.mapMove([item.id], dir, step)}
						deleteMapItem={item => this.props.mapRemove([item.id])}
						changeValue={(source, field, value) => this.props.changeValue(source, field, value)}
						nudgeValue={(source, field, delta) => this.nudgeValue(source, field, delta)}
					/>
				);
			}
		}

		return (
			<Note>
				<div className='section'>
					select a map token to see its details here
				</div>
			</Note>
		);
	}

	private createControls(selectedCombatants: Combatant[]) {
		if (selectedCombatants.some(c => c.type === 'placeholder')) {
			return null;
		}

		return (
			<CombatControlsPanel
				combatants={selectedCombatants}
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
				deleteCondition={(combatant, condition) => this.props.deleteCondition(combatant, condition)}
				// Map tab
				mapAdd={combatant => this.setAddingToMapID(this.state.addingToMapID ? null : combatant.id)}
				mapMove={(combatants, dir, step) => this.props.mapMove(combatants.map(c => c.id), dir, step)}
				mapRemove={combatants => this.mapRemove(combatants)}
				onChangeAltitude={(combatant, value) => this.props.onChangeAltitude(combatant, value)}
				// Adv tab
				removeCombatants={null}
				addCompanion={companion => this.addCompanion(companion)}
				// General
				changeValue={(source, field, value) => this.props.changeValue(source, field, value)}
				nudgeValue={(source, field, delta) => this.nudgeValue(source, field, delta)}
			/>
		);
}

	private createCard(combatant: Combatant) {
		switch (combatant.type) {
			case 'pc':
				return (
					<PCStatblockCard pc={combatant as Combatant & PC} />
				);
			case 'monster':
				return (
					<MonsterStatblockCard
						monster={combatant as Combatant & Monster}
						combat={true}
						showRollButtons={this.props.options.showMonsterDieRolls}
						useTrait={trait => this.props.useTrait(trait)}
						rechargeTrait={trait => this.props.rechargeTrait(trait)}
						onRollDice={(count, sides, constant) => this.props.onRollDice(count, sides, constant)}
					/>
				);
			case 'companion':
				let card = null;
				const comp = combatant as Combatant & Companion;
				if (comp.monsterID) {
					this.props.library.forEach(group => {
						const monster = group.monsters.find(m => m.id === comp.monsterID);
						if (monster) {
							card = (
								<MonsterStatblockCard
									monster={monster}
									combat={true}
									showRollButtons={this.props.options.showMonsterDieRolls}
									useTrait={trait => this.props.useTrait(trait)}
									rechargeTrait={trait => this.props.rechargeTrait(trait)}
									onRollDice={(count, sides, constant) => this.props.onRollDice(count, sides, constant)}
								/>
							);
						}
					});
				}
				return card;
			case 'placeholder':
				const lair: JSX.Element[] = [];
				this.props.exploration.combatants.forEach(c => {
					const monster = c as (Combatant & Monster);
					if (monster && monster.traits && monster.traits.some(t => t.type === 'lair')) {
						lair.push(
							<div className='card monster' key={'lair ' + monster.id}>
								<div className='heading'>
									<div className='title'>{monster.name}</div>
								</div>
								<div className='card-content'>
									<TraitsPanel
										combatant={monster}
										mode='lair'
										useTrait={trait => this.props.useTrait(trait)}
										rechargeTrait={trait => this.props.rechargeTrait(trait)}
									/>
								</div>
							</div>
						);
					}
				});
				return lair;
		}

		return null;
	}

	public render() {
		try {
			let notOnMapSection = null;
			const notOnMap = this.props.exploration.combatants
				.filter(c => !this.props.exploration.map.items.find(i => i.id === c.id));
			if (notOnMap.length > 0) {
				notOnMapSection = (
					<div>
						<Note>
							<div className='section'>
								these pcs have not yet been placed on the map
							</div>
							<div className='section'>
								to place one on the map, click the <b>place on map</b> button and then click on a map square
							</div>
							<div className='section'>
								or click <button className='link' onClick={() => this.props.scatterCombatants(notOnMap, this.state.selectedAreaID)}>here</button> to scatter them randomly
							</div>
						</Note>
						{
							notOnMap.map(c => (
								<NotOnMapInitiativeEntry
									key={c.id}
									combatant={c}
									addToMap={() => this.setAddingToMapID(c.id)}
								/>
							))
						}
					</div>
				);
			}

			return (
				<div className='full-height'>
					<Row align='middle' className='combat-top-row'>
						<Col span={6}>
							<div className='menu' onClick={() => this.toggleShowOptions()} role='button'>
								<SettingOutlined title='options' />
								<span>options</span>
							</div>
						</Col>
						<Col span={18} />
					</Row>
					<Row className='combat-main'>
						<Col span={18} className='scrollable both-ways'>
							{this.getMap(false)}
						</Col>
						<Col span={6} className='scrollable'>
							<GridPanel
								heading='not on the map'
								content={[notOnMapSection]}
								columns={1}
								showToggle={true}
							/>
							<GridPanel
								heading='selected'
								content={[this.getSelectedCombatants()]}
								columns={1}
							/>
						</Col>
					</Row>
					{this.getPlayerView()}
					<Drawer
						className={this.props.options.theme}
						placement='left'
						closable={false}
						maskClosable={true}
						width='33%'
						visible={this.state.showOptions}
						onClose={() => this.toggleShowOptions()}
					>
						<div className='drawer-header'><div className='app-title'>options</div></div>
						<div className='drawer-content'>{this.getOptions()}</div>
						<div className='drawer-footer'>{null}</div>
					</Drawer>
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}
