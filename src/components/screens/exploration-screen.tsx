import { CloseCircleOutlined, EnvironmentOutlined, SettingOutlined } from '@ant-design/icons';
import { Col, Drawer, Row } from 'antd';
import React from 'react';

import { Factory } from '../../utils/factory';
import { Gygax } from '../../utils/gygax';
import { Mercator } from '../../utils/mercator';
import { Utils } from '../../utils/utils';

import { Combatant } from '../../models/combat';
import { Condition } from '../../models/condition';
import { Exploration, Map, MapItem, MapLightSource } from '../../models/map';
import { Options } from '../../models/misc';
import { Monster, MonsterGroup, Trait } from '../../models/monster';
import { Companion, Party, PC } from '../../models/party';

import { RenderError } from '../error';
import { MapItemCard } from '../cards/map-item-card';
import { MonsterStatblockCard } from '../cards/monster-statblock-card';
import { PCStatblockCard } from '../cards/pc-statblock-card';
import { Checkbox } from '../controls/checkbox';
import { Conditional } from '../controls/conditional';
import { ConfirmButton } from '../controls/confirm-button';
import { Expander } from '../controls/expander';
import { Group } from '../controls/group';
import { Note } from '../controls/note';
import { CombatControlsPanel } from '../panels/combat-controls-panel';
import { GridPanel } from '../panels/grid-panel';
import { NotOnMapInitiativeEntry } from '../panels/initiative-entry';
import { MapPanel } from '../panels/map-panel';
import { Popout } from '../panels/popout';
import { TraitsPanel } from '../panels/traits-panel';

interface Props {
	exploration: Exploration;
	parties: Party[];
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
	nudgeValue: (source: any, field: string, delta: number) => void;
	addPC: (partyID: string, pcID: string) => void;
	addCompanion: (companion: Companion | null) => void;
	mapAdd: (combatant: Combatant, x: number, y: number) => void;
	mapMove: (ids: string[], dir: string, step: number) => void;
	mapRemove: (ids: string[]) => void;
	mapAddLightSource: (map: Map, ls: MapLightSource) => void;
	mapDeleteLightSource: (map: Map, ls: MapLightSource) => void;
	mapChangeLightSource: (ls: MapLightSource, name: string, bright: number, dim: number) => void;
	scatterCombatants: (combatants: Combatant[], areaID: string | null) => void;
	rotateMap: () => void;
	getMonster: (id: string) => Monster | null;
	useTrait: (trait: Trait) => void;
	rechargeTrait: (trait: Trait) => void;
	setFog: (fog: { x: number, y: number }[]) => void;
	addOverlay: (overlay: MapItem) => void;
	onRollDice: (text: string, count: number, sides: number, constant: number, mode: '' | 'advantage' | 'disadvantage') => void;
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
	addingLightSource: boolean;
	highlightedSquare: { x: number, y: number} | null;
	selectedItemIDs: string[];
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
			addingLightSource: false,
			highlightedSquare: null,
			selectedItemIDs: []
		};
	}

	public componentDidMount() {
		window.addEventListener('beforeunload', () => {
			this.setPlayerViewOpen(false);
		});
	}

	public componentDidUpdate() {
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
			addingLightSource: false,
			highlightedSquare: null
		});
	}

	private toggleAddingOverlay() {
		this.setState({
			addingOverlay: !this.state.addingOverlay,
			editFog: false,
			selectedItemIDs: [],
			highlightMapSquare: false,
			addingLightSource: false,
			highlightedSquare: null
		});
	}

	private toggleEditFog() {
		this.setState({
			addingOverlay: false,
			editFog: !this.state.editFog,
			selectedItemIDs: [],
			highlightMapSquare: false,
			addingLightSource: false,
			highlightedSquare: null
		});
	}

	private toggleHighlightMapSquare() {
		this.setState({
			addingOverlay: false,
			editFog: false,
			selectedItemIDs: [],
			highlightMapSquare: !this.state.highlightMapSquare,
			addingLightSource: false,
			highlightedSquare: null
		});
	}

	private toggleAddingLightSource() {
		this.setState({
			addingOverlay: false,
			editFog: false,
			selectedItemIDs: [],
			highlightMapSquare: false,
			addingLightSource: !this.state.addingLightSource,
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
				this.props.changeValue(source, field, value);
				break;
			case 'size':
			case 'displaySize':
				value = Gygax.nudgeSize(source[field], delta);
				this.props.changeValue(source, field, value);
				break;
			default:
				this.props.nudgeValue(source, field, delta);
				break;
		}
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

		if (this.state.addingOverlay && !playerView) {
			const token = Factory.createMapItem();
			token.type = 'token';
			token.x = x;
			token.y = y;
			token.width = 1;
			token.height = 1;
			token.color = '#005080';
			token.opacity = 127;
			token.style = 'square';

			this.setState({
				addingOverlay: false,
				selectedItemIDs: [token.id]
			}, () => {
				this.props.addOverlay(token);
			});
		}

		if (this.state.editFog && !playerView) {
			this.gridRectangleSelected(x, y, x, y);
		}

		if (this.state.addingLightSource && !playerView) {
			this.setState({
				addingLightSource: false
			}, () => {
				const ls = Factory.createMapLightSource();
				ls.x = x;
				ls.y = y;
				this.props.mapAddLightSource(this.props.exploration.map as Map, ls);
			});
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

			this.setState({
				addingOverlay: false,
				selectedItemIDs: [overlay.id]
			}, () => {
				this.props.addOverlay(overlay);
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

		const parties: Party[] = [];
		this.props.exploration.combatants.filter(c => c.type === 'pc').forEach(pc => {
			const party = this.props.parties.find(p => p.pcs.find(item => item.id === pc.id));
			if (party && !parties.includes(party)) {
				parties.push(party);
			}
		});
		const pcOptions: JSX.Element[] = [];
		parties.forEach(party => {
			party.pcs.forEach(pc => {
				if (!this.props.exploration.combatants.find(c => c.id === pc.id)) {
					pcOptions.push(
						<button key={pc.id} onClick={() => this.props.addPC(party.id, pc.id)}>{pc.name} ({party.name})</button>
					);
				}
			});
		});
		let addPCs = null;
		if (pcOptions.length > 0) {
			addPCs = (
				<Expander text='add pcs'>
					{pcOptions}
				</Expander>
			);
		}

		return (
			<div className='scrollable'>
				<div className='heading'>exploration</div>
				<button onClick={() => this.props.pauseExploration()}>pause exploration</button>
				<ConfirmButton onConfirm={() => this.props.endExploration(this.props.exploration)}>end exploration</ConfirmButton>
				<ConfirmButton
					onConfirm={() => {
						this.setState({
							showOptions: false
						}, () => {
							this.props.startCombat(this.props.exploration);
						});
					}}
				>
					end exploration and start combat
				</ConfirmButton>
				<div className='heading'>explorers</div>
				{addPCs}
				<button
					onClick={() => {
						this.setState({
							showOptions: false
						}, () => {
							this.props.addCompanion(null);
						});
					}}
				>
					add a companion
				</button>
				<div className='heading'>map</div>
				<Checkbox label='add token / overlay' checked={this.state.addingOverlay} onChecked={() => this.toggleAddingOverlay()} />
				<Conditional display={this.state.addingOverlay}>
					<Note>
						<div className='section'>
							click on a map square to add a token, or select a rectangle to add an overlay
						</div>
					</Note>
				</Conditional>
				<button onClick={() => this.props.rotateMap()}>rotate the map</button>
				<div className='heading'>sharing</div>
				<Checkbox
					label='share in player view'
					checked={this.state.playerViewOpen}
					onChecked={value => this.setPlayerViewOpen(value)}
				/>
			</div>
		);
	}

	private getMap(playerView: boolean) {
		return (
			<MapPanel
				map={this.props.exploration.map}
				mode={playerView ? 'interactive-player' : 'interactive-dm'}
				features={{ highlight: this.state.highlightMapSquare, editFog: this.state.editFog, lightSource: this.state.addingLightSource }}
				options={this.props.options}
				combatants={this.props.exploration.combatants}
				showGrid={((this.state.addingToMapID !== null) || this.state.addingOverlay || this.state.editFog || this.state.highlightMapSquare || this.state.addingLightSource) && !playerView}
				selectedItemIDs={playerView ? this.props.exploration.combatants.filter(c => c.type === 'pc').map(c => c.id) : this.state.selectedItemIDs}
				selectedAreaID={this.props.exploration.mapAreaID}
				fog={this.props.exploration.fog}
				lighting={this.props.exploration.lighting}
				focussedSquare={this.state.highlightedSquare}
				gridSquareEntered={(x, y) => this.setHighlightedSquare(x, y, playerView)}
				gridSquareClicked={(x, y) => this.gridSquareClicked(x, y, playerView)}
				gridRectangleSelected={(x1, y1, x2, y2) => this.gridRectangleSelected(x1, y1, x2, y2)}
				itemSelected={(id, ctrl) => this.toggleItemSelection(id, ctrl)}
				itemRemove={id => this.props.mapRemove([id])}
				conditionRemove={(combatant, condition) => this.props.deleteCondition(combatant, condition)}
				toggleTag={(combatants, tag) => this.props.toggleTag(combatants, tag)}
				toggleCondition={(combatants, condition) => this.props.toggleCondition(combatants, condition)}
				toggleHidden={(combatants) => this.props.toggleHidden(combatants)}
				areaSelected={id => this.props.changeValue(this.props.exploration, 'mapAreaID', id)}
				changeLighting={light => this.props.changeValue(this.props.exploration, 'lighting', light)}
				changeLightSource={(ls, name, bright, dim) => this.props.mapChangeLightSource(ls, name, bright, dim)}
				removeLightSource={ls => this.props.mapDeleteLightSource(this.props.exploration.map as Map, ls)}
				toggleFeature={feature => {
					switch (feature) {
						case 'highlight':
							this.toggleHighlightMapSquare();
							break;
						case 'editFog':
							this.toggleEditFog();
							break;
						case 'lightSource':
							this.toggleAddingLightSource();
							break;
					}
				}}
				fillFog={() => this.fillFog()}
				clearFog={() => this.clearFog()}
				changeValue={(source, field, value) => this.props.changeValue(source, field, value)}
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
							<Group key={c.id}>
								<div className='content-then-icons'>
									<div className='content'>
										{c.displayName}
									</div>
									<div className='icons'>
										<CloseCircleOutlined title='deselect' onClick={() => this.toggleItemSelection(c.id, true)} />
									</div>
								</div>
							</Group>
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
				options={this.props.options}
				lighting={this.props.exploration.lighting}
				defaultTab='map'
				// Main tab
				toggleTag={(combatants, tag) => this.props.toggleTag(combatants, tag)}
				toggleCondition={(combatants, condition) => this.props.toggleCondition(combatants, condition)}
				toggleHidden={combatants => this.props.toggleHidden(combatants)}
				// Cond tab
				addCondition={combatants => this.props.addCondition(combatants)}
				editCondition={(combatant, condition) => this.props.editCondition(combatant, condition)}
				deleteCondition={(combatant, condition) => this.props.deleteCondition(combatant, condition)}
				// Map tab
				mapAdd={combatant => this.setAddingToMapID(this.state.addingToMapID ? null : combatant.id)}
				mapMove={(combatants, dir, step) => this.props.mapMove(combatants.map(c => c.id), dir, step)}
				mapRemove={combatants => this.mapRemove(combatants)}
				undoStep={() => null}
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
						onRollDice={(text, count, sides, constant, mode) => this.props.onRollDice(text, count, sides, constant, mode)}
					/>
				);
			case 'companion':
				{
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
										onRollDice={(text, count, sides, constant, mode) => this.props.onRollDice(text, count, sides, constant, mode)}
									/>
								);
							}
						});
					}
					return card;
				}
			case 'placeholder':
				{
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
								to place one on the map, click the <EnvironmentOutlined /> button and then click on a map square
							</div>
							<div className='section'>
								or click <button className='link' onClick={() => this.props.scatterCombatants(notOnMap, this.props.exploration.mapAreaID)}>here</button> to scatter them randomly
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
		} catch (e) {
			console.error(e);
			return <RenderError context='ExplorationScreen' error={e} />;
		}
	}
}
