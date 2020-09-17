import { CloseCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import React from 'react';
import Showdown from 'showdown';

import { Comms, CommsDM } from '../../utils/comms';
import Factory from '../../utils/factory';
import Mercator from '../../utils/mercator';
import Napoleon from '../../utils/napoleon';
import Utils from '../../utils/utils';

import { Combat, Combatant } from '../../models/combat';
import { Condition } from '../../models/condition';
import { Encounter } from '../../models/encounter';
import { MapItem } from '../../models/map';
import { Monster, MonsterGroup, Trait } from '../../models/monster';
import { Companion, Party, PC } from '../../models/party';

import MapItemCard from '../cards/map-item-card';
import MonsterStatblockCard from '../cards/monster-statblock-card';
import PCCard from '../cards/pc-card';
import Checkbox from '../controls/checkbox';
import ConfirmButton from '../controls/confirm-button';
import Expander from '../controls/expander';
import NumberSpin from '../controls/number-spin';
import CombatControlsPanel from '../panels/combat-controls-panel';
import GridPanel from '../panels/grid-panel';
import { NotOnMapInitiativeEntry, PendingInitiativeEntry } from '../panels/initiative-entry';
import InitiativeOrder from '../panels/initiative-order';
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
	endCombat: (combat: Combat, goToMap: boolean) => void;
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
	mapAdd: (combatant: Combatant, x: number, y: number) => void;
	mapMove: (ids: string[], dir: string) => void;
	mapRemove: (ids: string[]) => void;
	onChangeAltitude: (combatant: Combatant, value: number) => void;
	endTurn: (combatant: Combatant) => void;
	changeHP: (values: {id: string, hp: number, temp: number, damage: number}[]) => void;
	changeValue: (source: any, type: string, value: any) => void;
	nudgeValue: (source: any, type: string, delta: number) => void;
	toggleTag: (combatants: Combatant[], tag: string) => void;
	toggleCondition: (combatants: Combatant[], condition: string) => void;
	toggleHidden: (combatants: Combatant[]) => void;
	scatterCombatants: (type: 'pc' | 'monster', areaID: string | null) => void;
	rotateMap: () => void;
	setFog: (fog: { x: number, y: number }[]) => void;
	addOverlay: (overlay: MapItem) => void;
	onRollDice: (count: number, sides: number, constant: number) => void;
}

interface State {
	showOptions: boolean;
	showDefeatedCombatants: boolean;
	showRollButtons: boolean;
	selectedItemIDs: string[];
	selectedAreaID: string | null;
	addingToMapID: string | null;
	addingOverlay: boolean;
	editFog: boolean;
	highlightMapSquare: boolean;
	highlightedSquare: { x: number, y: number} | null;
	playerViewOpen: boolean;
	middleColumnWidth: number;
}

export default class CombatScreen extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			showOptions: false,
			showDefeatedCombatants: false,
			showRollButtons: false,
			selectedItemIDs: [],			// The IDs of the combatants or map items that are selected
			selectedAreaID: null,			// The ID of the selected map area
			addingToMapID: null,			// The ID of the combatant we're adding to the map
			addingOverlay: false,			// True if we're adding a custom overlay to the map
			editFog: false,
			highlightMapSquare: false,
			highlightedSquare: null,
			playerViewOpen: false,
			middleColumnWidth: 8
		};
	}

	public componentDidMount() {
		window.addEventListener('beforeunload', () => {
			this.setPlayerViewOpen(false);
		});
	}

	public componentDidUpdate() {
		if (Comms.data.shared.type === 'combat') {
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

	private setSelectedAreaID(id: string | null) {
		this.setState({
			selectedAreaID: id
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

	private toggleAddingOverlay() {
		this.setState({
			addingOverlay: !this.state.addingOverlay,
			addingToMapID: null,
			editFog: false,
			highlightMapSquare: false,
			highlightedSquare: null
		});
	}

	private toggleEditFog() {
		this.setState({
			addingOverlay: false,
			addingToMapID: null,
			editFog: !this.state.editFog,
			highlightMapSquare: false,
			highlightedSquare: null
		});
	}

	private toggleHighlightMapSquare() {
		this.setState({
			addingOverlay: false,
			addingToMapID: null,
			editFog: false,
			highlightMapSquare: !this.state.highlightMapSquare,
			highlightedSquare: null
		});
	}

	private setHighlightedSquare(x: number, y: number) {
		if (this.state.highlightMapSquare) {
			this.setState({
				highlightedSquare: {
					x: x,
					y: y
				}
			});
		}
	}

	private fillFog() {
		if (this.props.combat.map) {
			const fog: { x: number, y: number }[] = [];
			const dims = Mercator.mapDimensions(this.props.combat.map.items);
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
		this.setState({
			playerViewOpen: show
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

		if (this.state.editFog) {
			this.toggleFog(x, y, x, y);
		}
	}

	private toggleFog(x1: number, y1: number, x2: number, y2: number) {
		if (!this.state.editFog) {
			return;
		}

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

	//#region Rendering helper methods

	private getPlayerView() {
		if (!this.state.playerViewOpen) {
			return null;
		}

		const initList = (
			<InitiativeOrder
				combat={this.props.combat}
				playerView={true}
				showDefeated={false}
				help={null}
				selectedItemIDs={this.state.selectedItemIDs}
				toggleItemSelection={(id, ctrl) => null}
			/>
		);

		if (this.props.combat.map) {
			return (
				<Popout title='Encounter' onCloseWindow={() => this.setPlayerViewOpen(false)}>
					<Row className='full-height full-width'>
						<Col span={18} className='scrollable both-ways'>
							<MapPanel
								key='map'
								map={this.props.combat.map}
								mode='combat-player'
								viewport={Mercator.getViewport(this.props.combat.map, this.state.selectedAreaID)}
								combatants={this.props.combat.combatants}
								selectedItemIDs={this.state.selectedItemIDs}
								fog={this.props.combat.fog}
								focussedSquare={this.state.highlightedSquare}
								itemSelected={(id, ctrl) => this.toggleItemSelection(id, ctrl)}
							/>
						</Col>
						<Col span={6} className='scrollable'>
							<div className='heading fixed-top'>initiative order</div>
							{initList}
						</Col>
					</Row>
				</Popout>
			);
		} else {
			return (
				<Popout title='Encounter' onCloseWindow={() => this.setPlayerViewOpen(false)}>
					<div className='scrollable full-width'>
						<div className='heading'>initiative order</div>
						{initList}
					</div>
				</Popout>
			);
		}
	}

	private getOptions() {
		if (!this.state.showOptions) {
			return null;
		}

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
				<ConfirmButton text='end combat and continue exploration' onConfirm={() => this.props.endCombat(this.props.combat, true)} />
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

		let map = null;
		if (this.props.combat.map) {
			let pcs = null;
			if (this.props.combat.combatants.some(c => c.type === 'pc')) {
				pcs = (
					<button onClick={() => this.props.scatterCombatants('pc', this.state.selectedAreaID)}>scatter pcs</button>
				);
			}
			let monsters = null;
			if (this.props.combat.combatants.some(c => c.type === 'monster')) {
				monsters = (
					<button onClick={() => this.props.scatterCombatants('monster', this.state.selectedAreaID)}>scatter monsters</button>
				);
			}
			map = (
				<div>
					<div className='subheading'>map</div>
					{pcs}
					{monsters}
					<Checkbox
						label={this.state.addingOverlay ? 'click on the map to add the item, or click here to cancel' : 'add token / overlay'}
						display='button'
						checked={this.state.addingOverlay}
						onChecked={() => this.toggleAddingOverlay()}
					/>
					<Checkbox
						label='highlight map square'
						checked={this.state.highlightMapSquare}
						onChecked={() => this.toggleHighlightMapSquare()}
					/>
					<Checkbox
						label='edit fog of war'
						checked={this.state.editFog}
						onChecked={() => this.toggleEditFog()}
					/>
					<div style={{ display: this.state.editFog ? '' : 'none' }}>
						<button onClick={() => this.fillFog()}>
							fill fog of war
						</button>
						<button className={this.props.combat.fog.length === 0 ? 'disabled' : ''} onClick={() => this.clearFog()}>
							clear fog of war
						</button>
					</div>
				</div>
			);
		}

		return (
			<GridPanel
				heading='options'
				content={[
					<div key='options'>
						<div>
							<div className='subheading'>encounter</div>
							{notes}
							<button onClick={() => this.props.pauseCombat()}>pause combat</button>
							<ConfirmButton text='end combat' onConfirm={() => this.props.endCombat(this.props.combat, false)} />
							{exitToMap}
						</div>
						<div>
							<div className='subheading'>combatants</div>
							<button onClick={() => this.props.addCombatants()}>add combatants</button>
							{addPCs}
							{addWave}
							<button onClick={() => this.props.addCompanion(null)}>add a companion</button>
						</div>
						{map}
						<div>
							<div className='subheading'>sharing</div>
							<Checkbox
								label='share in player view'
								checked={this.state.playerViewOpen}
								onChecked={value => this.setPlayerViewOpen(value)}
							/>
							<Checkbox
								label='share in session'
								disabled={CommsDM.getState() !== 'started'}
								checked={Comms.data.shared.type === 'combat'}
								onChecked={value => value ? CommsDM.shareCombat(this.props.combat) : CommsDM.shareNothing()}
							/>
						</div>
						<div>
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
					</div>
				]}
				columns={1}
			/>
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
						move={(item, dir) => this.props.mapMove([item.id], dir)}
						remove={item => this.props.mapRemove([item.id])}
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

	private createControls(selectedCombatants: Combatant[]) {
		if (selectedCombatants.some(c => c.type === 'placeholder')) {
			return null;
		}

		return (
			<CombatControlsPanel
				combatants={selectedCombatants}
				allCombatants={this.props.combat.combatants}
				map={this.props.combat.map}
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
				editCondition={(combatant, condition) => this.props.editCondition(combatant, condition)}
				removeCondition={(combatant, condition) => this.props.removeCondition(combatant, condition)}
				// Map tab
				mapAdd={combatant => this.setAddingToMapID(this.state.addingToMapID ? null : combatant.id)}
				mapMove={(combatants, dir) => this.props.mapMove(combatants.map(c => c.id), dir)}
				mapRemove={combatants => this.props.mapRemove(combatants.map(c => c.id))}
				onChangeAltitude={(combatant, value) => this.props.onChangeAltitude(combatant, value)}
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
					<PCCard pc={combatant as Combatant & PC} />
				);
			case 'monster':
				return (
					<MonsterStatblockCard
						monster={combatant as Combatant & Monster}
						combat={true}
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
								<MonsterStatblockCard
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

			const initHolder = this.props.combat.combatants
				.filter(combatant => !controlledMounts.includes(combatant.id))
				.find(c => c.current);

			const pending = this.props.combat.combatants
				.filter(combatant => !controlledMounts.includes(combatant.id))
				.filter(combatant => combatant.pending);
			const pendingList = pending.map(combatant => (
				<PendingInitiativeEntry
					key={combatant.id}
					combatant={combatant}
					nudgeValue={(c, type, delta) => this.props.nudgeValue(c, type, delta)}
					makeActive={c => this.props.makeActive([c])}
				/>
			));
			if (pending.length !== 0) {
				let ask = null;
				if ((CommsDM.getState() === 'started') && (Comms.data.people.some(p => p.characterID !== ''))) {
					ask = (
						<button onClick={() => CommsDM.askForRoll('initiative')}>ask for initiative rolls</button>
					);
				}
				pendingList.unshift(
					<Note key='pending-help'>
						<div className='section'>these combatants are not yet part of the encounter</div>
						<div className='section'>set initiative on each of them, then add them to the encounter</div>
						{ask}
					</Note>
				);
			}

			let initHelp = null;
			if (!initHolder) {
				/* tslint:disable:max-line-length */
				initHelp = (
					<Note key='init-help'>
						<div className='section'>these are the combatants taking part in this encounter; you can select them to see their stat blocks (on the right)</div>
						<div className='section'>they are listed in initiative order (with the highest initiative score at the top of the list, and the lowest at the bottom)</div>
					</Note>
				);
				/* tslint:enable:max-line-length */
			}
			const initList = (
				<InitiativeOrder
					combat={this.props.combat}
					playerView={false}
					showDefeated={this.state.showDefeatedCombatants}
					help={initHelp}
					selectedItemIDs={this.state.selectedItemIDs}
					toggleItemSelection={(id, ctrl) => this.toggleItemSelection(id, ctrl)}
				/>
			);

			let currentSection = null;
			let notOnMapSection = null;
			if (initHolder) {
				currentSection = (
					<div>
						{this.createControls([initHolder])}
						{this.createCard(initHolder)}
					</div>
				);
			} else {
				currentSection = (
					<Note>
						<div className='section'>when you're ready to begin the encounter, press the <b>start combat</b> button (above)</div>
						<div className='section'>the current initiative holder will be displayed here</div>
					</Note>
				);

				if (this.props.combat.map) {
					const notOnMap = Napoleon.getActiveCombatants(this.props.combat, false, this.state.showDefeatedCombatants)
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
					if (notOnMap.length > 0) {
						/* tslint:disable:max-line-length */
						notOnMapSection = (
							<div>
								<Note>
									<div className='section'>these combatants are in the initiative order, but have not yet been placed on the map (which you'll find in the middle column)</div>
									<div className='section'>to place one on the map, click the <b>place on map</b> button and then click on a map square</div>
								</Note>
								{notOnMap}
							</div>
						);
						/* tslint:enable:max-line-length */
					}
				}
			}

			let mapSection = null;
			if (this.props.combat.map) {
				mapSection = (
					<div key='map' className='scrollable horizontal-only'>
						<MapPanel
							map={this.props.combat.map}
							mode='combat'
							viewport={Mercator.getViewport(this.props.combat.map, this.state.selectedAreaID)}
							showGrid={(this.state.addingToMapID !== null) || this.state.addingOverlay || this.state.editFog || this.state.highlightMapSquare}
							combatants={this.props.combat.combatants}
							selectedItemIDs={this.state.selectedItemIDs}
							fog={this.props.combat.fog}
							focussedSquare={this.state.highlightedSquare}
							itemSelected={(id, ctrl) => this.toggleItemSelection(id, ctrl)}
							areaSelected={id => this.setSelectedAreaID(id)}
							gridSquareEntered={(x, y) => this.setHighlightedSquare(x, y)}
							gridSquareClicked={(x, y) => this.gridSquareClicked(x, y)}
							gridRectangleSelected={(x1, y1, x2, y2) => this.toggleFog(x1, y1, x2, y2)}
						/>
					</div>
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
								{
									this.state.showOptions
									?
									<CloseCircleOutlined title='close options' onClick={() => this.toggleShowOptions()} />
									:
									<SettingOutlined title='options' onClick={() => this.toggleShowOptions()} />
								}
							</div>
						</Col>
					</Row>
					<Row className='combat-main'>
						<Col span={sideWidth} className='scrollable'>
							<GridPanel
								heading='initiative holder'
								content={[currentSection]}
								columns={1}
								showToggle={false}
							/>
						</Col>
						<Col span={middleWidth} className='scrollable'>
							<GridPanel
								heading='waiting for intiative'
								content={pendingList}
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
							/>
							<GridPanel
								heading='initiative order'
								content={[initList]}
								columns={1}
								showToggle={true}
							/>
						</Col>
						<Col span={sideWidth} className='scrollable'>
							{this.getOptions()}
							<GridPanel
								heading='not on the map'
								content={[notOnMapSection]}
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
