import { CheckCircleOutlined, CloseCircleOutlined, EnvironmentOutlined, SettingOutlined, UpCircleOutlined } from '@ant-design/icons';
import { Col, Drawer, Popover, Row } from 'antd';
import React from 'react';
import ReactMarkdown from 'react-markdown';

import { Factory } from '../../utils/factory';
import { Mercator } from '../../utils/mercator';
import { Napoleon } from '../../utils/napoleon';
import { Utils } from '../../utils/utils';

import { Combat, Combatant } from '../../models/combat';
import { Condition } from '../../models/condition';
import { Encounter } from '../../models/encounter';
import { Map, MapItem, MapLightSource } from '../../models/map';
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
import { NumberSpin } from '../controls/number-spin';
import { CombatControlsPanel } from '../panels/combat-controls-panel';
import { GridPanel } from '../panels/grid-panel';
import { NotOnMapInitiativeEntry, PendingInitiativeEntry } from '../panels/initiative-entry';
import { InitiativeOrder } from '../panels/initiative-order';
import { MapPanel } from '../panels/map-panel';
import { Popout } from '../panels/popout';
import { TraitPanel, TraitsPanel } from '../panels/traits-panel';

interface Props {
	combat: Combat;
	parties: Party[];
	library: MonsterGroup[];
	encounters: Encounter[];
	options: Options;
	pauseCombat: () => void;
	endCombat: (combat: Combat, goToMap: boolean) => void;
	makeCurrent: (combatant: Combatant) => void;
	makeActive: (combatants: Combatant[]) => void;
	makeDefeated: (combatants: Combatant[]) => void;
	useTrait: (trait: Trait) => void;
	rechargeTrait: (trait: Trait) => void;
	removeCombatants: (combatants: Combatant[]) => void;
	addCombatants: () => void;
	addCompanion: (companion: Companion | null) => void;
	addPC: (partyID: string, pcID: string) => void;
	addWave: () => void;
	addCondition: (combatants: Combatant[]) => void;
	editCondition: (combatant: Combatant, condition: Condition) => void;
	deleteCondition: (combatant: Combatant, condition: Condition) => void;
	mapAdd: (combatant: Combatant, x: number, y: number) => void;
	mapMove: (ids: string[], dir: string, step: number) => void;
	mapRemove: (ids: string[]) => void;
	mapAddLightSource: (map: Map, ls: MapLightSource) => void;
	mapDeleteLightSource: (map: Map, ls: MapLightSource) => void;
	mapChangeLightSource: (ls: MapLightSource, name: string, bright: number, dim: number) => void;
	undoStep: (combatant: Combatant) => void;
	endTurn: (combatant: Combatant) => void;
	changeHP: (values: {id: string, hp: number, temp: number, damage: number}[]) => void;
	changeValue: (source: any, type: string, value: any) => void;
	nudgeValue: (source: any, type: string, delta: number) => void;
	toggleTag: (combatants: Combatant[], tag: string) => void;
	toggleCondition: (combatants: Combatant[], condition: string) => void;
	toggleHidden: (combatants: Combatant[]) => void;
	scatterCombatants: (combatants: Combatant[], areaID: string | null) => void;
	rotateMap: () => void;
	setFog: (fog: { x: number, y: number }[]) => void;
	addOverlay: (overlay: MapItem) => void;
	onRollDice: (text: string, count: number, sides: number, constant: number, mode: '' | 'advantage' | 'disadvantage') => void;
}

interface State {
	showOptions: boolean;
	showDefeatedCombatants: boolean;
	selectedItemIDs: string[];
	addingToMapID: string | null;
	addingOverlay: boolean;
	editFog: boolean;
	highlightMapSquare: boolean;
	addingLightSource: boolean;
	highlightedSquare: { x: number, y: number} | null;
	playerViewOpen: boolean;
	middleColumnWidth: number;
}

export class CombatScreen extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			showOptions: false,
			showDefeatedCombatants: false,
			selectedItemIDs: [],			// The IDs of the combatants or map items that are selected
			addingToMapID: null,			// The ID of the combatant we're adding to the map
			addingOverlay: false,			// True if we're adding a custom overlay to the map
			editFog: false,
			highlightMapSquare: false,
			addingLightSource: false,
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
			editFog: false,
			highlightMapSquare: false,
			addingLightSource: false,
			highlightedSquare: null
		});
	}

	private toggleAddingOverlay() {
		this.setState({
			addingOverlay: !this.state.addingOverlay,
			addingToMapID: null,
			editFog: false,
			highlightMapSquare: false,
			addingLightSource: false,
			highlightedSquare: null
		});
	}

	private toggleEditFog() {
		this.setState({
			addingOverlay: false,
			addingToMapID: null,
			editFog: !this.state.editFog,
			highlightMapSquare: false,
			addingLightSource: false,
			highlightedSquare: null
		});
	}

	private toggleHighlightMapSquare() {
		this.setState({
			addingOverlay: false,
			addingToMapID: null,
			editFog: false,
			highlightMapSquare: !this.state.highlightMapSquare,
			addingLightSource: false,
			highlightedSquare: null
		});
	}

	private toggleAddingLightSource() {
		this.setState({
			addingOverlay: false,
			addingToMapID: null,
			editFog: false,
			highlightMapSquare: false,
			addingLightSource: !this.state.addingLightSource,
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
			overlay.type = 'token';
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
				selectedItemIDs: [overlay.id]
			});
		}

		if (this.state.editFog) {
			this.gridRectangleSelected(x, y, x, y);
		}

		if (this.state.addingLightSource) {
			this.setState({
				addingLightSource: false
			}, () => {
				const ls = Factory.createMapLightSource();
				ls.x = x;
				ls.y = y;
				this.props.mapAddLightSource(this.props.combat.map as Map, ls);
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

			this.props.addOverlay(overlay);
			this.setState({
				addingOverlay: false,
				selectedItemIDs: [overlay.id]
			});
		}

		if (this.state.editFog) {
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
				selectedText='selected'
				showDefeated={false}
				help={null}
				selectedItemIDs={this.state.selectedItemIDs}
				toggleItemSelection={() => null}
			/>
		);

		if (this.props.combat.map) {
			return (
				<Popout title='Encounter' onCloseWindow={() => this.setPlayerViewOpen(false)}>
					<Row className='full-height full-width'>
						<Col span={18} className='scrollable both-ways'>
							<div className='heading'>encounter map</div>
							<MapPanel
								key='map'
								map={this.props.combat.map}
								mode='interactive-player'
								options={this.props.options}
								combatants={this.props.combat.combatants}
								selectedItemIDs={this.props.combat.combatants.filter(c => c.type === 'pc').map(c => c.id)}
								selectedAreaID={this.props.combat.mapAreaID}
								fog={this.props.combat.fog}
								lighting={this.props.combat.lighting}
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

		let exitToMap = null;
		if (this.props.combat.map) {
			exitToMap = (
				<ConfirmButton
					onConfirm={() => {
						this.setState({
							showOptions: false
						}, () => {
							this.props.endCombat(this.props.combat, true);
						});
					}}
				>
					end combat and start exploring
				</ConfirmButton>
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
				<button
					onClick={() => {
						this.setState({
							showOptions: false
						}, () => {
							this.props.addWave();
						});
					}}
				>
					add wave
				</button>
			);
		}

		let map = null;
		if (this.props.combat.map) {
			map = (
				<div>
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
				</div>
			);
		}

		return (
			<div className='scrollable'>
				<div>
					<div className='heading'>combat</div>
					<button onClick={() => this.props.pauseCombat()}>pause combat</button>
					<ConfirmButton onConfirm={() => this.props.endCombat(this.props.combat, false)}>end combat</ConfirmButton>
					{exitToMap}
				</div>
				<div>
					<div className='heading'>combatants</div>
					<button
						onClick={() => {
							this.setState({
								showOptions: false
							}, () => {
								this.props.addCombatants();
							});
						}}
					>
						add monsters
					</button>
					{addPCs}
					{addWave}
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
				</div>
				{map}
				<div>
					<div className='heading'>layout</div>
					<Checkbox
						label='show defeated combatants'
						checked={this.state.showDefeatedCombatants}
						onChecked={() => this.toggleShowDefeatedCombatants()}
					/>
					<NumberSpin
						value='middle column size'
						downEnabled={this.state.middleColumnWidth > 4}
						upEnabled={this.state.middleColumnWidth < 14}
						onNudgeValue={delta => this.nudgeMiddleColumnWidth(delta * 2)}
					/>
				</div>
			</div>
		);
	}

	private getSelectedCombatants() {
		// Find which combatants we've selected
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
				<div>
					<Note>
						<div className='section'>
							you&apos;ve selected the current initiative holder
						</div>
					</Note>
					{this.getCheatSheet()}
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
										{Napoleon.getCombatantName(c, this.props.combat.combatants)}
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
		if (this.props.combat.map) {
			const mapItem = this.props.combat.map.items.find(i => i.id === this.state.selectedItemIDs[0]);
			if (mapItem) {
				return (
					<MapItemCard
						item={mapItem}
						moveMapItem={(item, dir, step) => this.props.mapMove([item.id], dir, step)}
						deleteMapItem={item => this.props.mapRemove([item.id])}
						changeValue={(source, field, value) => this.props.changeValue(source, field, value)}
						nudgeValue={(source, field, delta) => this.props.nudgeValue(source, field, delta)}
					/>
				);
			}
		}

		return (
			<div>
				<Note>
					<div className='section'>
						select a pc or monster from the initiative order (in the middle column) to see its details here
					</div>
				</Note>
				{this.getCheatSheet()}
			</div>
		);
	}

	private getCheatSheet() {
		const sections = [];

		if (this.props.combat.encounter.notes) {
			sections.push(
				<Group key='encounter-notes'>
					<div className='section subheading'>encounter notes</div>
					<ReactMarkdown>{this.props.combat.encounter.notes}</ReactMarkdown>
				</Group>
			);
		}

		if (this.props.combat.map && this.props.combat.mapAreaID) {
			const area = this.props.combat.map.areas.find(a => a.id === this.props.combat.mapAreaID);
			if (area && area.text) {
				sections.push(
					<Group key='area-notes'>
						<div className='section subheading'>map notes</div>
						<ReactMarkdown>{area.text}</ReactMarkdown>
					</Group>
				);
			}
		}

		const collatedTraits: { trait: Trait, combatants: string[] }[] = [];
		this.props.combat.combatants.filter(c => c.active).filter(c => c.type === 'monster').forEach(c => {
			const monster = c as Combatant & Monster;
			monster.traits.filter(trait => (trait.type === 'trait') || (trait.type === 'reaction')).forEach(trait => {
				const collated = collatedTraits.find(t => (t.trait.name === trait.name) && (t.trait.text === trait.text));
				if (collated) {
					collated.combatants.push(monster.displayName);
				} else {
					collatedTraits.push({ trait: trait, combatants: [monster.displayName] });
				}
			});
		});
		const traits = collatedTraits.filter(t => t.trait.type === 'trait');
		if (traits.length > 0) {
			sections.push(
				<Group key='traits'>
					<div className='section subheading'>traits</div>
					{
						traits.map(t => (
							<div key={t.trait.id} className='section'>
								{t.combatants.sort().join(', ') + ' ' + (t.combatants.length === 1 ? 'has' : 'have') + ' '}
								<Popover
									content={(
										<TraitPanel trait={t.trait} />
									)}
									placement='bottom'
									overlayClassName='combat-info-tooltip'
								>
									<button className='link'>{t.trait.name}</button>
								</Popover>
							</div>
						))
					}
				</Group>
			);
		}
		const reactions = collatedTraits.filter(t => t.trait.type === 'reaction');
		if (reactions.length > 0) {
			sections.push(
				<Group key='reactions'>
					<div className='section subheading'>reactions</div>
					{
						reactions.map(t => (
							<div key={t.trait.id} className='section'>
								{t.combatants.sort().join(', ') + ' ' + (t.combatants.length === 1 ? 'has' : 'have') + ' '}
								<Popover
									content={(
										<TraitPanel trait={t.trait} />
									)}
									placement='bottom'
									overlayClassName='combat-info-tooltip'
								>
									<button className='link'>{t.trait.name}</button>
								</Popover>
							</div>
						))
					}
				</Group>
			);
		}

		return sections;
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
				options={this.props.options}
				lighting={this.props.combat.lighting}
				// Main tab
				makeCurrent={combatant => this.props.makeCurrent(combatant)}
				makeActive={combatants => this.props.makeActive(combatants)}
				makeDefeated={combatants => this.defeatCombatants(combatants)}
				nextTurn={() => this.nextTurn()}
				toggleTag={(combatants, tag) => this.props.toggleTag(combatants, tag)}
				toggleCondition={(combatants, condition) => this.props.toggleCondition(combatants, condition)}
				toggleHidden={combatants => this.props.toggleHidden(combatants)}
				// HP tab
				changeHP={values => this.props.changeHP(values)}
				// Cond tab
				addCondition={combatants => this.props.addCondition(combatants)}
				editCondition={(combatant, condition) => this.props.editCondition(combatant, condition)}
				deleteCondition={(combatant, condition) => this.props.deleteCondition(combatant, condition)}
				// Map tab
				mapAdd={combatant => this.setAddingToMapID(this.state.addingToMapID ? null : combatant.id)}
				mapMove={(combatants, dir, step) => this.props.mapMove(combatants.map(c => c.id), dir, step)}
				mapRemove={combatants => this.props.mapRemove(combatants.map(c => c.id))}
				undoStep={combatant => this.props.undoStep(combatant)}
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
					changeValue={(c, type, value) => this.props.changeValue(c, type, value)}
					nudgeValue={(c, type, delta) => this.props.nudgeValue(c, type, delta)}
					makeActive={c => this.props.makeActive([c])}
					remove={c => this.props.removeCombatants([c])}
				/>
			));
			if (pending.length !== 0) {
				pendingList.unshift(
					<Note key='pending-help'>
						<div className='section'>these combatants are not yet part of the encounter</div>
						<div className='section'>set initiative on each of them, then press the <CheckCircleOutlined /> button to add them to the initiative order - or press <CloseCircleOutlined/> to remove someone from the combat</div>
						<div className='section'>you can hide this section by clicking on the <UpCircleOutlined /> button above</div>
					</Note>
				);
			}

			let initHelp = null;
			if (!initHolder) {
				initHelp = (
					<Note key='init-help'>
						<div className='section'>these are the combatants taking part in this encounter; you can select them to see their stat blocks (on the right); you can select multiple combatants by holding the <code>ctrl</code> key</div>
						<div className='section'>they are listed in initiative order (with the highest initiative score at the top of the list, and the lowest at the bottom)</div>
						<div className='section'>this message will go away when combat starts</div>
					</Note>
				);
			}
			const initList = (
				<InitiativeOrder
					combat={this.props.combat}
					playerView={false}
					selectedText='selected'
					showDefeated={this.state.showDefeatedCombatants}
					help={initHelp}
					selectedItemIDs={this.state.selectedItemIDs}
					toggleItemSelection={(id, ctrl) => this.toggleItemSelection(id, ctrl)}
				/>
			);

			let startSection = null;
			let currentSection = null;
			if (initHolder) {
				currentSection = (
					<div>
						{this.createControls([initHolder])}
						<hr/>
						{this.createCard(initHolder)}
					</div>
				);
			} else {
				startSection = (
					<div>
						<Note>
							<div className='section'>when you&apos;re ready to begin, press the <b>start combat</b> button</div>
							<div className='section'>the current initiative holder will be displayed in this column</div>
						</Note>
						<button onClick={() => this.nextTurn()}>start combat</button>
					</div>
				);
			}

			let notOnMapSection = null;
			if (this.props.combat.map) {
				const notOnMap = Napoleon.getActiveCombatants(this.props.combat, false, this.state.showDefeatedCombatants)
					.filter(c => this.props.combat.map && !this.props.combat.map.items.find(i => i.id === c.id));
				if (notOnMap.length > 0) {
					notOnMapSection = (
						<div>
							<Note>
								<div className='section'>
									these combatants are in the initiative order, but have not yet been placed on the map (shown in the middle column)
								</div>
								<div className='section'>
									to place one on the map, click the <EnvironmentOutlined /> button and then click on a map square
								</div>
								<div className='section'>
									or, click <button className='link' onClick={() => this.props.scatterCombatants(notOnMap, this.props.combat.mapAreaID)}>here</button> to scatter them randomly
								</div>
							</Note>
							{
								notOnMap.map(combatant => (
									<NotOnMapInitiativeEntry
										key={combatant.id}
										combatant={combatant}
										addToMap={c => this.setAddingToMapID(c.id)}
									/>
								))
							}
						</div>
					);
				}
			}

			let mapSection = null;
			if (this.props.combat.map) {
				mapSection = (
					<div key='map' className='scrollable horizontal-only'>
						<MapPanel
							map={this.props.combat.map}
							mode='interactive-dm'
							features={{ highlight: this.state.highlightMapSquare, editFog: this.state.editFog, lightSource: this.state.addingLightSource }}
							options={this.props.options}
							showGrid={(this.state.addingToMapID !== null) || this.state.addingOverlay || this.state.editFog || this.state.highlightMapSquare || this.state.addingLightSource}
							combatants={this.props.combat.combatants}
							selectedItemIDs={this.state.selectedItemIDs}
							selectedAreaID={this.props.combat.mapAreaID}
							fog={this.props.combat.fog}
							lighting={this.props.combat.lighting}
							focussedSquare={this.state.highlightedSquare}
							itemSelected={(id, ctrl) => this.toggleItemSelection(id, ctrl)}
							itemRemove={id => this.props.mapRemove([id])}
							conditionRemove={(combatant, condition) => this.props.deleteCondition(combatant, condition)}
							toggleTag={(combatants, tag) => this.props.toggleTag(combatants, tag)}
							toggleCondition={(combatants, condition) => this.props.toggleCondition(combatants, condition)}
							toggleHidden={(combatants) => this.props.toggleHidden(combatants)}
							areaSelected={id => this.props.changeValue(this.props.combat, 'mapAreaID', id)}
							gridSquareEntered={(x, y) => this.setHighlightedSquare(x, y)}
							gridSquareClicked={(x, y) => this.gridSquareClicked(x, y)}
							gridRectangleSelected={(x1, y1, x2, y2) => this.gridRectangleSelected(x1, y1, x2, y2)}
							changeLighting={light => this.props.changeValue(this.props.combat, 'lighting', light)}
							changeLightSource={(ls, name, bright, dim) => this.props.mapChangeLightSource(ls, name, bright, dim)}
							removeLightSource={ls => this.props.mapDeleteLightSource(this.props.combat.map as Map, ls)}
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
					</div>
				);
			}

			const legendary: JSX.Element[] = [];
			if (initHolder) {
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
											useTrait={trait => this.props.useTrait(trait)}
											rechargeTrait={trait => this.props.rechargeTrait(trait)}
										/>
									</div>
								</div>
							);
						}
					});
			}

			const middleWidth = this.state.middleColumnWidth;
			const sideWidth = (24 - middleWidth) / 2;

			return (
				<div className='full-height'>
					<Row align='middle' className='combat-top-row'>
						<Col span={sideWidth}>
							<div className='menu' onClick={() => this.toggleShowOptions()} role='button'>
								<SettingOutlined title='options' />
								<span>options</span>
							</div>
						</Col>
						<Col span={middleWidth}>
							{
								this.props.combat.combatants.find(c => c.current)
								?
								<div className='action'>
									<button onClick={() => this.nextTurn()}>next turn</button>
								</div>
								:
								null
							}
						</Col>
						<Col span={sideWidth}>
							<Row>
								<Col span={12}>
									<div className='information'>
										<div>round</div>
										<div className='information-value'>{this.props.combat.round}</div>
									</div>
								</Col>
								<Col span={12}>
									<div className='information'>
										<div className='information-value'>{Napoleon.getCombatXP(this.props.combat)}</div>
										<div>xp</div>
									</div>
								</Col>
							</Row>
						</Col>
					</Row>
					<Row className='combat-main'>
						<Col span={sideWidth} className='scrollable'>
							<GridPanel
								heading='waiting for intiative'
								content={pendingList}
								columns={1}
								showToggle={true}
							/>
							<GridPanel
								heading='not on the map'
								content={[notOnMapSection]}
								columns={1}
								showToggle={true}
							/>
							<GridPanel
								heading='ready to start'
								content={[startSection]}
								columns={1}
								showToggle={false}
							/>
							<GridPanel
								heading='initiative holder'
								content={[currentSection]}
								columns={1}
								showToggle={false}
							/>
						</Col>
						<Col span={middleWidth} className='scrollable'>
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
						open={this.state.showOptions}
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
			return <RenderError context='CombatScreen' error={e} />;
		}
	}
}
