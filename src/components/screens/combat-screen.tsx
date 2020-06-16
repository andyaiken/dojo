import { CloseCircleOutlined, MenuOutlined } from '@ant-design/icons';
import { Col, Popover, Row } from 'antd';
import React from 'react';
import Showdown from 'showdown';

import Factory from '../../utils/factory';
import Mercator from '../../utils/mercator';
import Napoleon from '../../utils/napoleon';
import Utils from '../../utils/utils';

import { Combat, Combatant, Notification } from '../../models/combat';
import { Condition, ConditionDurationSaves } from '../../models/condition';
import { Encounter } from '../../models/encounter';
import { MapItem } from '../../models/map';
import { Monster, MonsterGroup, Trait } from '../../models/monster';
import { Companion, Party, PC } from '../../models/party';

import MapItemCard from '../cards/map-item-card';
import MonsterCard from '../cards/monster-card';
import PCCard from '../cards/pc-card';
import Checkbox from '../controls/checkbox';
import ConfirmButton from '../controls/confirm-button';
import Expander from '../controls/expander';
import NumberSpin from '../controls/number-spin';
import Radial from '../controls/radial';
import CombatControlsPanel from '../panels/combat-controls-panel';
import GridPanel from '../panels/grid-panel';
import InitiativeEntry, { NotOnMapInitiativeEntry, PendingInitiativeEntry } from '../panels/initiative-entry';
import MapPanel from '../panels/map-panel';
import Note from '../panels/note';
import Popout from '../panels/popout';
import TraitsPanel from '../panels/traits-panel';

const showdown = new Showdown.Converter();
showdown.setOption('tables', true);

interface Props {
	combat: Combat;
	parties: Party[];
	library: MonsterGroup[];
	encounters: Encounter[];
	pauseCombat: () => void;
	endCombat: (goToMap: boolean) => void;
	closeNotification: (notification: Notification, removeCondition: boolean) => void;
	mapAdd: (combatant: Combatant, x: number, y: number) => void;
	makeCurrent: (combatant: Combatant) => void;
	makeActive: (combatants: Combatant[]) => void;
	makeDefeated: (combatants: Combatant[]) => void;
	useTrait: (combatant: Combatant & Monster, trait: Trait) => void;
	rechargeTrait: (combatant: Combatant & Monster, trait: Trait) => void;
	removeCombatants: (combatants: Combatant[]) => void;
	addCombatants: () => void;
	addCompanion: (companion: Companion | null) => void;
	addPC: (partyID: string, pcID: string) => void;
	addWave: () => void;
	addCondition: (combatants: Combatant[]) => void;
	editCondition: (combatant: Combatant, condition: Condition) => void;
	removeCondition: (combatant: Combatant, condition: Condition) => void;
	mapMove: (ids: string[], dir: string) => void;
	mapRemove: (ids: string[]) => void;
	mapAddNote: (id: string) => void;
	mapRemoveNote: (id: string) => void;
	endTurn: (combatant: Combatant) => void;
	changeHP: (values: {id: string, hp: number, temp: number, damage: number}[]) => void;
	changeValue: (source: {}, type: string, value: any) => void;
	nudgeValue: (source: {}, type: string, delta: number) => void;
	toggleTag: (combatants: Combatant[], tag: string) => void;
	toggleCondition: (combatants: Combatant[], condition: string) => void;
	toggleHidden: (combatants: Combatant[]) => void;
	scatterCombatants: (type: 'pc' | 'monster') => void;
	rotateMap: () => void;
	setFog: (fog: { x: number, y: number }[]) => void;
	addOverlay: (overlay: MapItem) => void;
	showLeaderboard: () => void;
	onRollDice: (count: number, sides: number, constant: number) => void;
}

interface State {
	showDefeatedCombatants: boolean;
	showRollButtons: boolean;
	selectedItemIDs: string[];
	addingToMapID: string | null;
	addingOverlay: boolean;
	addingFog: boolean;
	playerView: {
		open: boolean;
		showControls: boolean;
	};
	middleColumnWidth: number;
}

export default class CombatScreen extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			showDefeatedCombatants: false,
			showRollButtons: false,
			selectedItemIDs: [],            // The IDs of the combatants or map items that are selected
			addingToMapID: null,            // The ID of the combatant we're adding to the map
			addingOverlay: false,           // True if we're adding a custom overlay to the map
			addingFog: false,
			playerView: {
				open: false,
				showControls: false
			},
			middleColumnWidth: 8
		};
	}

	public componentDidMount() {
		window.addEventListener('beforeunload', () => {
			this.setPlayerViewOpen(false);
		});
	}

	private toggleShowDefeatedCombatants() {
		this.setState({
			showDefeatedCombatants: !this.state.showDefeatedCombatants
		});
	}

	private toggleShowRollButtons() {
		this.setState({
			showRollButtons: !this.state.showRollButtons
		});
	}

	private setSelectedItemIDs(ids: string[]) {
		this.setState({
			selectedItemIDs: ids
		});
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

	private setAddingToMapID(id: string | null) {
		this.setState({
			addingToMapID: id,
			addingOverlay: false,
			addingFog: false
		});
	}

	private toggleAddingOverlay() {
		this.setState({
			addingOverlay: !this.state.addingOverlay,
			addingToMapID: null,
			addingFog: false
		});
	}

	private toggleAddingFog() {
		this.setState({
			addingOverlay: false,
			addingToMapID: null,
			addingFog: !this.state.addingFog
		});
	}

	private fillFog() {
		if (this.props.combat.map) {
			const fog: { x: number, y: number }[] = [];
			const dims = Mercator.mapDimensions(this.props.combat.map);
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

	private setPlayerViewOpen(show: boolean) {
		const pv = this.state.playerView;
		pv.open = show;
		this.setState({
			playerView: pv
		});
	}

	private setPlayerViewShowControls(show: boolean) {
		const pv = this.state.playerView;
		pv.showControls = show;
		this.setState({
			playerView: pv
		});
	}

	private nudgeMiddleColumnWidth(delta: number) {
		this.setState({
			middleColumnWidth: this.state.middleColumnWidth + delta
		});
	}

	private nextTurn() {
		const current = this.props.combat.combatants.find(c => c.current);
		if (current) {
			this.props.endTurn(current);
		} else {
			const first = this.props.combat.combatants
				.filter(c => {
					if (c.type === 'placeholder') {
						return Napoleon.combatHasLairActions(this.props.combat);
					}

					return true;
				})
				.find(c => c.active);
			if (first) {
				this.props.makeCurrent(first);
			}
		}
	}

	private defeatCombatants(combatants: Combatant[]) {
		// Deselect any of these combatants who are currently selected...
		const ids = combatants.map(c => c.id);
		this.setState({
			selectedItemIDs: this.state.selectedItemIDs.filter(id => !ids.includes(id))
		}, () => {
			// ... then mark them as defeated
			this.props.makeDefeated(combatants);
		});
	}

	private removeCombatants(combatants: Combatant[]) {
		// Deselect any of these combatants who are currently selected...
		const ids = combatants.map(c => c.id);
		this.setState({
			selectedItemIDs: this.state.selectedItemIDs.filter(id => !ids.includes(id))
		}, () => {
			// ... then remove them
			this.props.removeCombatants(combatants);
		});
	}

	private gridSquareClicked(x: number, y: number) {
		if (this.state.addingToMapID) {
			const combatant = this.props.combat.combatants.find(c => c.id === this.state.addingToMapID);
			if (combatant) {
				this.props.mapAdd(combatant, x, y);
			}

			this.setAddingToMapID(null);
		}

		if (this.state.addingOverlay) {
			const overlay = Factory.createMapItem();
			overlay.type = 'overlay';
			overlay.x = x;
			overlay.y = y;
			overlay.width = 1;
			overlay.height = 1;
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

		if (this.state.addingFog) {
			this.toggleFog(x, y, x, y);
		}
	}

	private toggleFog(x1: number, y1: number, x2: number, y2: number) {
		const fog = this.props.combat.fog;

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

	private orderCombatants(combatants: Combatant[]) {
		const current = combatants.find(c => c.current);
		if (current) {
			const index = combatants.indexOf(current);
			if (index !== 0) {
				const all: (Combatant | string)[] = [...combatants];
				const first = all.splice(index);
				return first.concat(['top of the round']).concat(all);
			}
		}

		return combatants;
	}

	//#region Rendering helper methods

	private getPlayerView() {
		if (!this.state.playerView.open) {
			return null;
		}

		const controlledMounts = this.props.combat.combatants
			.filter(c => !!c.mountID && (c.mountType === 'controlled'))
			.map(c => c.mountID || '');
		const activeCombatants = this.props.combat.combatants
			.filter(c => (c.type === 'pc') || c.showOnMap)
			.filter(c => !c.pending && c.active && !c.defeated)
			.filter(c => !controlledMounts.includes(c.id))
			.filter(c => {
				if ((c.type === 'monster') && (!!this.props.combat.map)) {
					// Only show this monster if it's on the map
					return !!this.props.combat.map.items.find(i => i.id === c.id);
				}
				return true;
			})
			.filter(c => {
				if (c.type === 'placeholder') {
					return Napoleon.combatHasLairActions(this.props.combat);
				}
				return true;
			});
		const initList = this.orderCombatants(activeCombatants)
			.map(c => this.createCombatantRow(c, true));

		if (this.props.combat.map) {
			let controls = null;
			if (this.props.combat.map && this.state.playerView.showControls) {
				let selection = this.props.combat.combatants
					.filter(c => this.props.combat.map !== null ? this.props.combat.map.items.find(item => item.id === c.id) : false)
					.filter(c => c.showOnMap)
					.filter(c => this.state.selectedItemIDs.includes(c.id));
				if (selection.length === 0) {
					selection = this.props.combat.combatants
						.filter(c => this.props.combat.map !== null ? this.props.combat.map.items.find(item => item.id === c.id) : false)
						.filter(c => c.showOnMap)
						.filter(c => c.current);
				}

				if (selection.length === 1) {
					const token = selection[0] as ((Combatant & PC) | (Combatant & Monster));
					controls = (
						<div>
							<div className='heading lowercase'>{token.displayName}</div>
							<Radial onClick={dir => this.props.mapMove([token.id], dir)} />
							<hr/>
							<NumberSpin
								key='altitude'
								value={token.altitude + ' ft.'}
								label='altitude'
								onNudgeValue={delta => this.props.nudgeValue(token, 'altitude', delta * 5)}
							/>
							<Row gutter={10}>
								<Col span={8}>
									<Checkbox
										label='conc.'
										display='button'
										checked={token.tags.includes('conc')}
										onChecked={value => this.props.toggleTag([token], 'conc')}
									/>
								</Col>
								<Col span={8}>
									<Checkbox
										label='bane'
										display='button'
										checked={token.tags.includes('bane')}
										onChecked={value => this.props.toggleTag([token], 'bane')}
									/>
								</Col>
								<Col span={8}>
									<Checkbox
										label='bless'
										display='button'
										checked={token.tags.includes('bless')}
										onChecked={value => this.props.toggleTag([token], 'bless')}
									/>
								</Col>
							</Row>
							<Row gutter={10}>
								<Col span={8}>
									<Checkbox
										label='prone'
										display='button'
										checked={token.conditions.some(c => c.name === 'prone')}
										onChecked={value => this.props.toggleCondition([token], 'prone')}
									/>
								</Col>
								<Col span={8}>
									<Checkbox
										label='uncon.'
										display='button'
										checked={token.conditions.some(c => c.name === 'unconscious')}
										onChecked={value => this.props.toggleCondition([token], 'unconscious')}
									/>
								</Col>
								<Col span={8}>
									<Checkbox
										label='hidden'
										display='button'
										checked={!token.showOnMap}
										onChecked={value => this.props.changeValue([token], 'showOnMap', !value)}
									/>
								</Col>
							</Row>
						</div>
					);
				}

				if (selection.length > 1) {
					controls = (
						<Note>
							<div className='section'>multiple items selected</div>
						</Note>
					);
				}
			}

			let viewport = null;
			if (this.props.combat.fog.length > 0) {
				const dims = Mercator.mapDimensions(this.props.combat.map);
				if (dims) {
					// Invert the fog
					const visible: { x: number, y: number }[] = [];
					for (let x = dims.minX; x <= dims.maxX; ++x) {
						for (let y = dims.minY; y <= dims.maxY; ++y) {
							if (!this.props.combat.fog.find(f => (f.x === x) && (f.y === y))) {
								visible.push({ x: x, y: y });
							}
						}
					}
					if (visible.length > 0) {
						const xs = visible.map(f => f.x);
						const ys = visible.map(f => f.y);
						viewport = {
							minX: Math.min(...xs),
							maxX: Math.max(...xs),
							minY: Math.min(...ys),
							maxY: Math.max(...ys)
						};
					}
				}
			}

			return (
				<Popout title='Encounter' onCloseWindow={() => this.setPlayerViewOpen(false)}>
					<Row className='full-height'>
						<Col xs={24} sm={24} md={12} lg={16} xl={18} className='scrollable both-ways'>
							<MapPanel
								key='map'
								map={this.props.combat.map}
								mode='combat-player'
								viewport={viewport}
								combatants={this.props.combat.combatants}
								selectedItemIDs={this.state.selectedItemIDs}
								fog={this.props.combat.fog}
								itemSelected={(id, ctrl) => this.toggleItemSelection(id, ctrl)}
							/>
						</Col>
						<Col xs={24} sm={24} md={12} lg={8} xl={6} className='scrollable'>
							{controls}
							<div className='heading fixed-top'>initiative order</div>
							{initList}
						</Col>
					</Row>
				</Popout>
			);
		} else {
			return (
				<Popout title='Encounter' onCloseWindow={() => this.setPlayerViewOpen(false)}>
					<div className='scrollable'>
						<div className='heading'>initiative order</div>
						{initList}
					</div>
				</Popout>
			);
		}
	}

	private getMenu() {
		let notes = null;
		if (this.props.combat.encounter.notes) {
			notes = (
				<Expander text='encounter notes'>
					<div dangerouslySetInnerHTML={{ __html: showdown.makeHtml(this.props.combat.encounter.notes) }} />
				</Expander>
			);
		}
		let exitToMap = null;
		if (this.props.combat.map) {
			exitToMap = (
				<ConfirmButton text='end combat and open map' onConfirm={() => this.props.endCombat(true)} />
			);
		}

		const parties: Party[] = [];
		this.props.combat.combatants.filter(c => c.type === 'pc').forEach(pc => {
			const party = this.props.parties.find(p => p.pcs.find(item => item.id === pc.id));
			if (party && !parties.includes(party)) {
				parties.push(party);
			}
		});
		const pcOptions: JSX.Element[] = [];
		parties.forEach(party => {
			party.pcs.forEach(pc => {
				if (!this.props.combat.combatants.find(c => c.id === pc.id)) {
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

		let addWave = null;
		if (!!this.props.combat.encounter && (this.props.combat.encounter.waves.length > 0)) {
			addWave = (
				<button onClick={() => this.props.addWave()}>add wave</button>
			);
		}

		let playerView = null;
		if (this.props.combat.map && this.state.playerView.open) {
			playerView = (
				<div>
					<Checkbox
						label='show map controls'
						checked={this.state.playerView.showControls}
						onChecked={value => this.setPlayerViewShowControls(value)}
					/>
				</div>
			);
		}

		return (
			<div>
				<div className='subheading'>encounter</div>
				{notes}
				<button onClick={() => this.props.pauseCombat()}>pause combat</button>
				<ConfirmButton text='end combat' onConfirm={() => this.props.endCombat(false)} />
				{exitToMap}
				<div className='subheading'>leaderboard</div>
				<button onClick={() => this.props.showLeaderboard()}>show leaderboard</button>
				<div className='subheading'>combatants</div>
				<button onClick={() => this.props.addCombatants()}>add combatants</button>
				{addPCs}
				{addWave}
				<button onClick={() => this.props.addCompanion(null)}>add a companion</button>
				<div className='subheading'>player view</div>
				<Checkbox
					label='show player view'
					checked={this.state.playerView.open}
					onChecked={value => this.setPlayerViewOpen(value)}
				/>
				{playerView}
				<div className='subheading'>layout</div>
				<Checkbox
					label='show defeated combatants'
					checked={this.state.showDefeatedCombatants}
					onChecked={() => this.toggleShowDefeatedCombatants()}
				/>
				<Checkbox
					label='show monster die rolls'
					checked={this.state.showRollButtons}
					onChecked={() => this.toggleShowRollButtons()}
				/>
				<NumberSpin
					value='middle column size'
					downEnabled={this.state.middleColumnWidth > 4}
					upEnabled={this.state.middleColumnWidth < 14}
					onNudgeValue={delta => this.nudgeMiddleColumnWidth(delta * 2)}
				/>
			</div>
		);
	}

	private getSelectedCombatant() {
		// Find which combatants we've selected, ignoring the current initiative holder
		const combatants = this.state.selectedItemIDs
			.map(id => this.props.combat.combatants.find(c => c.id === id))
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
		if (this.props.combat.map) {
			const mapItem = this.props.combat.map.items.find(i => i.id === this.state.selectedItemIDs[0]);
			if (mapItem) {
				return (
					<MapItemCard
						item={mapItem}
						note={Mercator.getNote(this.props.combat.map, mapItem)}
						move={(item, dir) => this.props.mapMove([item.id], dir)}
						remove={item => this.props.mapRemove([item.id])}
						addNote={itemID => this.props.mapAddNote(itemID)}
						removeNote={itemID => this.props.mapRemoveNote(itemID)}
						changeValue={(source, field, value) => this.props.changeValue(source, field, value)}
						nudgeValue={(source, field, delta) => this.props.nudgeValue(source, field, delta)}
					/>
				);
			}
		}

		return (
			<Note>
				<div className='section'>
					select a pc or monster from the <b>initiative order</b> list (in the middle column) to see its details here
				</div>
			</Note>
		);
	}

	private createCombatantRow(combatant: Combatant | string, playerView: boolean) {
		if (typeof combatant === 'string') {
			return (
				<div key={combatant} className='section init-separator'>{combatant}</div>
			);
		}

		let selected = this.state.selectedItemIDs.includes(combatant.id);
		// If we're in player view, and there's no map, don't show selection
		if (playerView && !this.props.combat.map) {
			selected = false;
		}

		return (
			<InitiativeEntry
				key={combatant.id}
				combatant={combatant as Combatant}
				combat={this.props.combat}
				selected={selected}
				minimal={playerView}
				select={(c, ctrl) => this.toggleItemSelection(c.id, ctrl)}
				addToMap={c => this.setAddingToMapID(this.state.addingToMapID ? null : c.id)}
				nudgeValue={(c, type, delta) => this.props.nudgeValue(c, type, delta)}
				makeActive={c => this.props.makeActive([c])}
			/>
		);
	}

	private createControls(selectedCombatants: Combatant[]) {
		if (selectedCombatants.some(c => c.type === 'placeholder')) {
			return null;
		}

		return (
			<CombatControlsPanel
				combatants={selectedCombatants}
				allCombatants={this.props.combat.combatants}
				map={this.props.combat.map}
				defaultTab='main'
				inline={false}
				// Main tab
				makeCurrent={combatant => this.props.makeCurrent(combatant)}
				makeActive={combatants => this.props.makeActive(combatants)}
				makeDefeated={combatants => this.defeatCombatants(combatants)}
				toggleTag={(combatants, tag) => this.props.toggleTag(combatants, tag)}
				toggleCondition={(combatants, condition) => this.props.toggleCondition(combatants, condition)}
				toggleHidden={combatants => this.props.toggleHidden(combatants)}
				// HP tab
				changeHP={values => this.props.changeHP(values)}
				// Cond tab
				addCondition={combatants => this.props.addCondition(combatants)}
				quickAddCondition={(combatants, condition) => null}
				editCondition={(combatant, condition) => this.props.editCondition(combatant, condition)}
				removeCondition={(combatant, condition) => this.props.removeCondition(combatant, condition)}
				// Map tab
				mapAdd={combatant => this.setAddingToMapID(this.state.addingToMapID ? null : combatant.id)}
				mapMove={(combatants, dir) => this.props.mapMove(combatants.map(c => c.id), dir)}
				mapRemove={combatants => this.props.mapRemove(combatants.map(c => c.id))}
				// Adv tab
				removeCombatants={combatants => this.removeCombatants(combatants)}
				addCompanion={companion => this.props.addCompanion(companion)}
				// General
				changeValue={(source, type, value) => this.props.changeValue(source, type, value)}
				nudgeValue={(source, type, delta) => this.props.nudgeValue(source, type, delta)}
			/>
		);
	}

	private createCard(combatant: Combatant) {
		switch (combatant.type) {
			case 'pc':
				return (
					<PCCard
						pc={combatant as Combatant & PC}
						mode={'combat'}
						changeValue={(source, type, value) => this.props.changeValue(source, type, value)}
						nudgeValue={(source, type, delta) => this.props.nudgeValue(source, type, delta)}
					/>
				);
			case 'monster':
				return (
					<MonsterCard
						monster={combatant as Combatant & Monster}
						mode={'combat'}
						showRollButtons={this.state.showRollButtons}
						useTrait={trait => this.props.useTrait(combatant as Combatant & Monster, trait)}
						rechargeTrait={trait => this.props.rechargeTrait(combatant as Combatant & Monster, trait)}
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
								<MonsterCard
									monster={monster}
									showRollButtons={this.state.showRollButtons}
									onRollDice={(count, sides, constant) => this.props.onRollDice(count, sides, constant)}
								/>
							);
						}
					});
				}
				return card;
			case 'placeholder':
				const lair: JSX.Element[] = [];
				this.props.combat.combatants.forEach(c => {
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
										useTrait={trait => this.props.useTrait(monster, trait)}
										rechargeTrait={trait => this.props.rechargeTrait(monster, trait)}
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

	//#endregion

	public render() {
		try {
			const controlledMounts = this.props.combat.combatants
				.filter(c => !!c.mountID && (c.mountType === 'controlled'))
				.map(c => c.mountID || '');

			let current: JSX.Element | null = null;
			const pending: JSX.Element[] = [];
			const active: Combatant[] = [];

			this.props.combat.combatants
				.filter(combatant => !controlledMounts.includes(combatant.id))
				.forEach(combatant => {
					if (combatant.pending) {
						pending.push(
							<PendingInitiativeEntry
								key={combatant.id}
								combatant={combatant}
								nudgeValue={(c, type, delta) => this.props.nudgeValue(c, type, delta)}
								makeActive={c => this.props.makeActive([c])}
							/>
						);
					} else {
						if (combatant.current) {
							current = (
								<div>
									{this.createControls([combatant])}
									<hr/>
									{this.createCard(combatant)}
								</div>
							);
						}
						if (combatant.active || (combatant.defeated && this.state.showDefeatedCombatants)) {
							active.push(combatant);
						}
					}
				});

			if (pending.length !== 0) {
				pending.unshift(
					<Note key='pending-help'>
						<div className='section'>these combatants are not yet part of the encounter</div>
						<div className='section'>set initiative on each of them, then add them to the encounter</div>
					</Note>
				);
			}

			const activeCombatants = active
				.filter(c => {
					if (c.type === 'placeholder') {
						return Napoleon.combatHasLairActions(this.props.combat);
					}

					return true;
				});
			const initList = this.orderCombatants(activeCombatants)
				.map(c => this.createCombatantRow(c, false));

			let notOnMap = null;
			if (!current && this.props.combat.map) {
				const missing = activeCombatants
					.filter(c => this.props.combat.map && !this.props.combat.map.items.find(i => i.id === c.id))
					.map(c => {
						return (
							<NotOnMapInitiativeEntry
								key={c.id}
								combatant={c}
								addToMap={() => this.setAddingToMapID(c.id)}
							/>
						);
					});
				if (missing.length > 0) {
					notOnMap = (
						<div>
							<Note>
								<div className='section'>these combatants have not yet been placed on the map (which you'll find in the middle column)</div>
								<div className='section'>to place one on the map, click the <b>place on map</b> button and then click on a map square</div>
							</Note>
							{missing}
						</div>
					);
				}
			}

			if (!current) {
				initList.unshift(
					/* tslint:disable:max-line-length */
					<Note key='init-help'>
						<div className='section'>these are the combatants taking part in this encounter; you can select them to see their stat blocks (on the right)</div>
						<div className='section'>they are listed in initiative order (with the highest initiative score at the top of the list, and the lowest at the bottom)</div>
					</Note>
					/* tslint:enable:max-line-length */
				);

				current = (
					<Note>
						<div className='section'>when you're ready to begin the encounter, press the <b>start combat</b> button (above)</div>
						<div className='section'>the current initiative holder will be displayed here</div>
					</Note>
				);
			}

			let notificationSection = null;
			if (this.props.combat.notifications.length > 0) {
				notificationSection = (
					<div className='notifications'>
						{this.props.combat.notifications.map(n => (
							<NotificationPanel
								key={n.id}
								notification={n}
								close={(notification, removeCondition) => this.props.closeNotification(notification, removeCondition)}
							/>
						))}
					</div>
				);
			}

			let mapSection = null;
			if (this.props.combat.map) {
				mapSection = (
					<MapPanel
						key='map'
						map={this.props.combat.map}
						mode='combat'
						showGrid={(this.state.addingToMapID !== null) || this.state.addingOverlay || this.state.addingFog}
						combatants={this.props.combat.combatants}
						selectedItemIDs={this.state.selectedItemIDs}
						fog={this.props.combat.fog}
						itemSelected={(id, ctrl) => this.toggleItemSelection(id, ctrl)}
						gridSquareClicked={(x, y) => this.gridSquareClicked(x, y)}
						gridRectangleSelected={(x1, y1, x2, y2) => this.toggleFog(x1, y1, x2, y2)}
					/>
				);
			}

			const legendary: JSX.Element[] = [];
			this.props.combat.combatants
				.filter(c => !c.pending && c.active && !c.defeated)
				.forEach(c => {
					const monster = c as (Combatant & Monster);
					if (monster && monster.traits && monster.traits.some(t => (t.type === 'legendary') || (t.type === 'mythic')) && !monster.current) {
						legendary.push(
							<div className='card monster' key={'leg ' + monster.id}>
								<div className='heading'>
									<div className='title'>{monster.name}</div>
								</div>
								<div className='card-content'>
									<TraitsPanel
										combatant={monster}
										mode='legendary'
										useTrait={trait => this.props.useTrait(monster, trait)}
										rechargeTrait={trait => this.props.rechargeTrait(monster, trait)}
									/>
								</div>
							</div>
						);
					}
				});

			const middleWidth = this.state.middleColumnWidth;
			const sideWidth = (24 - middleWidth) / 2;

			return (
				<div className='full-height'>
					<Row align='middle' className='combat-top-row'>
						<Col span={sideWidth}>
							<div className='action'>
								<button onClick={() => this.nextTurn()}>
									{this.props.combat.combatants.find(c => c.current) ? 'next turn' : 'start combat'}
								</button>
							</div>
						</Col>
						<Col span={middleWidth}>
							<Row>
								<Col span={12}>
									<div className='statistic'>
										<div className='statistic-label'>round</div>
										<div className='statistic-value'>{this.props.combat.round}</div>
									</div>
								</Col>
								<Col span={12}>
									<div className='statistic'>
										<div className='statistic-value'>{Napoleon.getCombatXP(this.props.combat)}</div>
										<div className='statistic-label'>xp</div>
									</div>
								</Col>
							</Row>
						</Col>
						<Col span={sideWidth}>
							<div className='menu'>
								<Popover
									content={this.getMenu()}
									trigger='click'
									placement='bottomRight'
								>
									<MenuOutlined title='menu' />
								</Popover>
							</div>
						</Col>
					</Row>
					<Row className='combat-main'>
						<Col span={sideWidth} className='scrollable'>
							<GridPanel
								heading='initiative holder'
								content={[current]}
								columns={1}
								showToggle={false}
							/>
						</Col>
						<Col span={middleWidth} className='scrollable'>
							{notificationSection}
							<GridPanel
								heading='waiting for intiative'
								content={pending}
								columns={1}
								showToggle={true}
							/>
							<GridPanel
								heading={'legendary actions'}
								content={legendary}
								columns={1}
								showToggle={true}
							/>
							<GridPanel
								heading='encounter map'
								content={[mapSection]}
								columns={1}
								showToggle={true}
								controls={(
									<div>
										<button onClick={() => this.props.scatterCombatants('monster')}>scatter monsters</button>
										<button onClick={() => this.props.scatterCombatants('pc')}>scatter pcs</button>
										<Checkbox
											label={this.state.addingOverlay ? 'click on the map to add the item, or click here to cancel' : 'add token / overlay'}
											display='button'
											checked={this.state.addingOverlay}
											onChecked={() => this.toggleAddingOverlay()}
										/>
										<Checkbox
											label='edit fog of war'
											checked={this.state.addingFog}
											onChecked={() => this.toggleAddingFog()}
										/>
										<div style={{ display: this.state.addingFog ? '' : 'none' }}>
											<button onClick={() => this.fillFog()}>
												fill fog of war
											</button>
											<button className={this.props.combat.fog.length === 0 ? 'disabled' : ''} onClick={() => this.clearFog()}>
												clear fog of war
											</button>
										</div>
									</div>
								)}
							/>
							<GridPanel
								heading='initiative order'
								content={initList}
								columns={1}
								showToggle={true}
							/>
						</Col>
						<Col span={sideWidth} className='scrollable'>
							<GridPanel
								heading='not on the map'
								content={[notOnMap]}
								columns={1}
								showToggle={true}
							/>
							<GridPanel
								heading='selected combatant'
								content={[this.getSelectedCombatant()]}
								columns={1}
							/>
						</Col>
					</Row>
					{this.getPlayerView()}
				</div>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}

interface NotificationProps {
	notification: Notification;
	close: (notification: Notification, removeCondition: boolean) => void;
}

class NotificationPanel extends React.Component<NotificationProps> {
	private success() {
		switch (this.props.notification.type) {
			case 'condition-save':
			case 'condition-end':
				const condition = this.props.notification.data as Condition;
				if (condition.duration) {
					// Reduce save by 1
					if ((condition.duration.type === 'saves') || (condition.duration.type === 'rounds')) {
						condition.duration.count -= 1;
						if (condition.duration.count === 0) {
							// Remove the condition
							this.close(true);
						} else {
							this.close();
						}
					}
				}
				break;
			case 'trait-recharge':
				// Mark trait as recharged
				const trait = this.props.notification.data as Trait;
				trait.uses = 0;
				this.close();
				break;
		}
	}

	private close(removeCondition = false) {
		this.props.close(this.props.notification, removeCondition);
	}

	public render() {
		try {
			const combatant = this.props.notification.combatant as (Combatant & Monster);
			const condition = this.props.notification.data as Condition;
			const trait = this.props.notification.data as Trait;

			const name = combatant.displayName || combatant.name || 'unnamed monster';
			switch (this.props.notification.type) {
				case 'condition-save':
					const duration = condition.duration as ConditionDurationSaves;
					let saveType = duration.saveType.toString();
					if (saveType !== 'death') {
						saveType = saveType.toUpperCase();
					}
					return (
						<div key={this.props.notification.id} className='descriptive'>
							<div className='text'>
								{name} must make a {saveType} save against dc {duration.saveDC}
							</div>
							<Row gutter={10}>
								<Col span={12}>
									<button key='success' onClick={() => this.success()}>success</button>
								</Col>
								<Col span={12}>
									<button key='close' onClick={() => this.close()}>close</button>
								</Col>
							</Row>
						</div>
					);
				case 'condition-end':
					return (
						<div key={this.props.notification.id} className='descriptive'>
							<div className='text'>
								{name} is no longer affected by condition {condition.name}
							</div>
							<button onClick={() => this.close()}>close</button>
						</div>
					);
				case 'trait-recharge':
					return (
						<div key={this.props.notification.id} className='descriptive'>
							<div className='text'>
								{name} can attempt to recharge {trait.name} ({trait.usage})
							</div>
							<Row gutter={10}>
								<Col span={12}>
									<button key='recharge' onClick={() => this.success()}>recharge</button>
								</Col>
								<Col span={12}>
									<button key='close' onClick={() => this.close()}>close</button>
								</Col>
							</Row>
						</div>
					);
				default:
					return null;
			}
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}
