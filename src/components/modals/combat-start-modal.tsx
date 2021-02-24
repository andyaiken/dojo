import { CloseCircleOutlined, RedoOutlined } from '@ant-design/icons';
import { Col, Row, Slider } from 'antd';
import React from 'react';

import { Factory } from '../../utils/factory';
import { Frankenstein } from '../../utils/frankenstein';
import { Gygax } from '../../utils/gygax';
import { Mercator } from '../../utils/mercator';
import { Napoleon } from '../../utils/napoleon';

import { CombatSetup, CombatSlotInfo, CombatSlotMember } from '../../models/combat';
import { Encounter, EncounterSlot, MonsterFilter } from '../../models/encounter';
import { Map } from '../../models/map';
import { Monster, MonsterGroup } from '../../models/monster';

import { RenderError } from '../error';
import { MonsterCandidateCard } from '../cards/monster-candidate-card';
import { Checkbox } from '../controls/checkbox';
import { Dropdown } from '../controls/dropdown';
import { Expander } from '../controls/expander';
import { Note } from '../controls/note';
import { NumberSpin } from '../controls/number-spin';
import { Selector } from '../controls/selector';
import { Textbox } from '../controls/textbox';
import { DifficultyChartPanel } from '../panels/difficulty-chart-panel';
import { FilterPanel } from '../panels/filter-panel';
import { MapPanel } from '../panels/map-panel';

interface Props {
	type: 'start' | 'add-wave' | 'add-combatants';
	combatSetup: CombatSetup;
	library: MonsterGroup[];
	encounters: Encounter[];
	maps: Map[];
	getMonster: (id: string) => Monster | null;
	addMonster: (monster: Monster) => void;
	notify: () => void;
}

interface State {
	combatSetup: CombatSetup;
	encounterFixed: boolean;
	mapFixed: boolean;
}

export class CombatStartModal extends React.Component<Props, State> {
	public static defaultProps = {
		encounters: null,
		maps: null,
		addMonster: null
	};

	constructor(props: Props) {
		super(props);

		this.state = {
			combatSetup: props.combatSetup,
			encounterFixed: !!props.combatSetup.encounter,
			mapFixed: !!props.combatSetup.map
		};
	}

	private setEncounterID(encounterID: string | null) {
		const setup = this.state.combatSetup;
		const encounter = this.props.encounters.find(e => e.id === encounterID);
		setup.encounter = encounter ? JSON.parse(JSON.stringify(encounter)) : null;
		setup.slotInfo = Gygax.getCombatSlotData(setup.encounter, this.props.library);
		this.setState({
			combatSetup: setup
		}, () => this.props.notify());
	}

	private setMapID(mapID: string | null) {
		const map = this.props.maps.find(m => m.id === mapID);
		const setup = this.state.combatSetup;
		setup.map = map || null;
		this.setState({
			combatSetup: setup
		});
	}

	private setWaveID(waveID: string | null) {
		const setup = this.state.combatSetup;
		setup.waveID = waveID;
		if (setup.encounter) {
			const wave = setup.encounter.waves.find(w => w.id === waveID);
			if (wave) {
				setup.slotInfo = Gygax.getCombatSlotData(wave, this.props.library);
			}
		}
		this.setState({
			combatSetup: setup
		}, () => this.props.notify());
	}

	private generateEncounter(diff: string) {
		const encounter = Factory.createEncounter();
		const filter = Factory.createMonsterFilter();

		let xp = 0;
		let sumLevel = 0;
		if (this.state.combatSetup.party) {
			const pcs = this.state.combatSetup.party.pcs.filter(pc => pc.active);
			pcs.forEach(pc => {
				xp += Gygax.pcExperience(pc.level, diff);
				sumLevel += pc.level;
			});

			const avgLevel = sumLevel / pcs.length;
			filter.challengeMax = Math.max(avgLevel, 5);
		}

		Napoleon.buildEncounter(encounter, xp, filter, this.props.library, this.props.getMonster);
		const setup = this.state.combatSetup;
		setup.encounter = encounter;
		setup.slotInfo = Gygax.getCombatSlotData(encounter, this.props.library);
		this.setState({
			combatSetup: setup
		}, () => this.props.notify());
	}

	private generateMap(type: string) {
		const map = Factory.createMap();
		Mercator.generate(type, map);

		const setup = this.state.combatSetup;
		setup.map = map;

		this.setState({
			combatSetup: setup
		}, () => this.props.notify());
	}

	private changeValue(source: any, field: string, value: any) {
		source[field] = value;

		// If we're changing init or hp on the slot, change each slot member too
		const slotInfo = source as CombatSlotInfo;
		if (slotInfo.members) {
			if (field === 'init') {
				slotInfo.members.forEach(m => m.init = value);
			}
			if (field === 'hp') {
				slotInfo.members.forEach(m => m.hp = value);
			}
		}

		this.setState({
			combatSetup: this.state.combatSetup
		});
	}

	private nudgeValue(source: any, field: string, delta: number) {
		source[field] = source[field] + delta;

		const setup = this.state.combatSetup;
		if (setup.encounter) {
			// Reset names
			if (setup.waveID) {
				const wave = setup.encounter.waves.find(w => w.id === setup.waveID);
				if (wave) {
					setup.slotInfo = Gygax.getCombatSlotData(wave, this.props.library);
				}
			} else {
				setup.slotInfo = Gygax.getCombatSlotData(setup.encounter, this.props.library);
			}
			this.setState({
				combatSetup: setup
			});
		}
	}

	public render() {
		try {
			let leftSection = null;
			let rightSection = null;

			switch (this.props.type) {
				case 'start':
					let enc = null;
					if (!this.state.encounterFixed) {
						enc = (
							<EncounterSection
								combatSetup={this.state.combatSetup}
								encounters={this.props.encounters}
								fixed={this.state.encounterFixed}
								setEncounterID={id => this.setEncounterID(id)}
								generateEncounter={diff => this.generateEncounter(diff)}
								getMonster={id => this.props.getMonster(id)}
							/>
						);
					}
					let map = null;
					if (!this.state.mapFixed) {
						map = (
							<MapSection
								combatSetup={this.state.combatSetup}
								maps={this.props.maps}
								fixed={this.state.mapFixed}
								setMapID={id => this.setMapID(id)}
								generateMap={type => this.generateMap(type)}
							/>
						);
					}
					leftSection = (
						<div>
							{enc}
							{map}
						</div>
					);
					rightSection = (
						<div>
							<OptionsSection
								type={this.props.type}
								combatSetup={this.state.combatSetup}
								getMonster={id => this.props.getMonster(id)}
								changeValue={(source, field, value) => this.changeValue(source, field, value)}
								nudgeValue={(source, field, delta) => this.nudgeValue(source, field, delta)}
							/>
						</div>
					);
					break;
				case 'add-wave':
					leftSection = (
						<div>
							<WaveSection
								combatSetup={this.state.combatSetup}
								setWaveID={id => this.setWaveID(id)}
								getMonster={id => this.props.getMonster(id)}
							/>
						</div>
					);
					rightSection = (
						<div>
							<OptionsSection
								type={this.props.type}
								combatSetup={this.state.combatSetup}
								getMonster={id => this.props.getMonster(id)}
								changeValue={(source, field, value) => this.changeValue(source, field, value)}
								nudgeValue={(source, field, delta) => this.nudgeValue(source, field, delta)}
							/>
						</div>
					);
					break;
				case 'add-combatants':
					leftSection = (
						<div>
							<MonsterSelectionSection
								combatSetup={this.state.combatSetup}
								library={this.props.library}
								addMonster={monster => this.props.addMonster(monster)}
							/>
						</div>
					);
					rightSection = (
						<div>
							<SelectedMonsterSection
								encounter={this.state.combatSetup.encounter as Encounter}
								nudgeValue={(source, field, delta) => this.nudgeValue(source, field, delta)}
								getMonster={id => this.props.getMonster(id)}
							/>
							<OptionsSection
								type={this.props.type}
								combatSetup={this.state.combatSetup}
								getMonster={id => this.props.getMonster(id)}
								changeValue={(source, field, value) => this.changeValue(source, field, value)}
								nudgeValue={(source, field, delta) => this.nudgeValue(source, field, delta)}
							/>
						</div>
					);
					break;
			}

			return (
				<Row className='full-height'>
					<Col span={12} className='scrollable'>
						{leftSection}
					</Col>
					<Col span={12} className='scrollable'>
						{rightSection}
					</Col>
				</Row>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='CombatStartModal' error={e} />;
		}
	}
}

interface EncounterSectionProps {
	combatSetup: CombatSetup;
	encounters: Encounter[];
	fixed: boolean;
	setEncounterID: (id: string | null) => void;
	generateEncounter: (diff: string) => void;
	getMonster: (id: string) => Monster | null;
}

class EncounterSection extends React.Component<EncounterSectionProps> {
	public render() {
		let tools = null;
		if (!this.props.combatSetup.encounter) {
			let selector = null;
			if (this.props.encounters.length > 0) {
				const options = this.props.encounters.map(encounter => {
					return {
						id: encounter.id,
						text: encounter.name || 'unnamed encounter'
					};
				});
				selector = (
					<Dropdown
						options={options}
						placeholder='select an encounter'
						onSelect={optionID => this.props.setEncounterID(optionID)}
					/>
				);
			}

			let random = null;
			if (this.props.combatSetup.party) {
				random = (
					<button onClick={() => this.props.generateEncounter('medium')}>generate a random encounter</button>
				);
			}

			tools = (
				<div>
					{selector}
					{random}
				</div>
			);
		}

		let encounterContent = null;
		if (this.props.combatSetup.encounter) {
			const monsterSections = this.props.combatSetup.encounter.slots.map(slot => {
				let name = '';
				const monster = this.props.getMonster(slot.monsterID);
				if (monster) {
					name = monster.name;
				}
				name = name || 'unnamed monster';
				if (slot.count > 1) {
					name += ' (x' + slot.count + ')';
				}
				return (
					<div key={slot.id} className='group-panel'>
						{name}
					</div>
				);
			});

			if (monsterSections.length === 0) {
				monsterSections.push(
					<Note key={'empty'}>no monsters</Note>
				);
			}

			encounterContent = (
				<div>
					<div className='subheading'>monsters</div>
					{monsterSections}
				</div>
			);
		}

		let clear = null;
		if (this.props.combatSetup.encounter && !this.props.fixed) {
			clear = (
				<CloseCircleOutlined onClick={() => this.props.setEncounterID(null)} />
			);
		}

		let difficulty = null;
		if (this.props.combatSetup.party && this.props.combatSetup.encounter) {
			difficulty = (
				<div>
					<div className='subheading'>difficulty</div>
					<DifficultyChartPanel
						party={this.props.combatSetup.party}
						encounter={this.props.combatSetup.encounter}
						getMonster={id => this.props.getMonster(id)}
					/>
				</div>
			);
		}

		return (
			<div>
				<div className='heading'>
					encounter
					{clear}
				</div>
				{tools}
				{encounterContent}
				{difficulty}
			</div>
		);
	}
}

interface MapSectionProps {
	combatSetup: CombatSetup;
	maps: Map[];
	fixed: boolean;
	setMapID: (id: string | null) => void;
	generateMap: (type: string) => void;
}

class MapSection extends React.Component<MapSectionProps> {
	public render() {
		let tools = null;
		if (!this.props.combatSetup.map) {
			let selector = null;
			if (this.props.maps.length > 0) {
				const options = this.props.maps.map(map => {
					return {
						id: map.id,
						text: map.name || 'unnamed map'
					};
				});
				selector = (
					<Dropdown
						options={options}
						placeholder='select a map'
						onSelect={optionID => this.props.setMapID(optionID)}
					/>
				);
			}

			tools = (
				<div>
					<Note>
						<p>this is optional - you don't have to use a map to run an encounter</p>
					</Note>
					{selector}
					<button onClick={() => this.props.generateMap('delve')}>generate a random delve</button>
				</div>
			);
		}

		let mapContent = null;
		if (this.props.combatSetup.map) {
			mapContent = (
				<div className='scrollable horizontal-only'>
					<MapPanel
						map={this.props.combatSetup.map}
						combatants={this.props.combatSetup.combatants}
					/>
				</div>
			);
		}

		let clear = null;
		if (this.props.combatSetup.map && !this.props.fixed) {
			clear = (
				<CloseCircleOutlined onClick={() => this.props.setMapID(null)} />
			);
		}

		return (
			<div>
				<div className='heading'>
					map
					{clear}
				</div>
				{tools}
				{mapContent}
			</div>
		);
	}
}

interface WaveSectionProps {
	combatSetup: CombatSetup;
	setWaveID: (id: string | null) => void;
	getMonster: (id: string) => Monster | null;
}

class WaveSection extends React.Component<WaveSectionProps> {
	public render() {
		if (this.props.combatSetup.encounter === null) {
			return (
				<div className='section'>you have not selected an encounter</div>
			);
		} else {
			if (this.props.combatSetup.encounter.waves.length === 0) {
				return (
					<div className='section'>you have not defined any waves</div>
				);
			}

			const waveOptions = this.props.combatSetup.encounter.waves.map(wave => {
				return {
					id: wave.id,
					text: wave.name || 'unnamed wave'
				};
			});

			let waveContent = null;
			if (this.props.combatSetup.waveID) {
				const selectedWave = this.props.combatSetup.encounter.waves.find(w => w.id === this.props.combatSetup.waveID);
				if (selectedWave) {
					const monsterSections = selectedWave.slots.map(slot => {
						let name = '';
						const monster = this.props.getMonster(slot.monsterID);
						if (monster) {
							name = monster.name;
						}
						name = name || 'unnamed monster';
						if (slot.count > 1) {
							name += ' (x' + slot.count + ')';
						}
						return (
							<div key={slot.id} className='group-panel'>
								{name}
							</div>
						);
					});

					if (monsterSections.length === 0) {
						monsterSections.push(
							<Note key={'empty'}>no monsters</Note>
						);
					}

					waveContent = (
						<div>
							{monsterSections}
						</div>
					);
				}
			}

			return (
				<div>
					<div className='heading'>wave</div>
					<Dropdown
						options={waveOptions}
						placeholder='select wave'
						selectedID={this.props.combatSetup.waveID ? this.props.combatSetup.waveID : undefined}
						onSelect={optionID => this.props.setWaveID(optionID)}
						onClear={() => this.props.setWaveID(null)}
					/>
					{waveContent}
				</div>
			);
		}
	}
}

interface SelectedMonsterSectionProps {
	encounter: Encounter;
	nudgeValue: (source: any, field: string, delta: number) => void;
	getMonster: (id: string) => Monster | null;
}

class SelectedMonsterSection extends React.Component<SelectedMonsterSectionProps> {
	public render() {
		const monsterSections = this.props.encounter.slots.map(slot => {
			let name = '';
			const monster = this.props.getMonster(slot.monsterID);
			if (monster) {
				name = monster.name;
			}
			name = name || 'unnamed monster';
			if (slot.count > 1) {
				name += ' (x' + slot.count + ')';
			}
			return (
				<div key={slot.id} className='group-panel'>
					{name}
					<NumberSpin
						value={'count: ' + slot.count}
						downEnabled={slot.count > 1}
						onNudgeValue={delta => this.props.nudgeValue(slot, 'count', delta)}
					/>
				</div>
			);
		});

		if (monsterSections.length === 0) {
			monsterSections.push(
				<Note key={'empty'}>no monsters</Note>
			);
		}

		return (
			<div>
				<div className='heading'>
					selected monsters
				</div>
				{monsterSections}
			</div>
		);
	}
}

interface MonsterSelectionSectionProps {
	combatSetup: CombatSetup;
	library: MonsterGroup[];
	addMonster: (monster: Monster) => void;
}

interface MonsterSelectionSectionState {
	filter: MonsterFilter;
}

class MonsterSelectionSection extends React.Component<MonsterSelectionSectionProps, MonsterSelectionSectionState> {
	constructor(props: MonsterSelectionSectionProps) {
		super(props);
		this.state = {
			filter: Factory.createMonsterFilter()
		};
	}

	private changeFilterValue(type: 'name' | 'challenge' | 'category' | 'size' | 'role', value: any) {
		const filter = this.state.filter as any;
		if (type === 'challenge') {
			filter.challengeMin = value[0];
			filter.challengeMax = value[1];
		} else {
			filter[type] = value;
		}
		this.setState({
			filter: filter
		});
	}

	private resetFilter() {
		this.setState({
			filter: Factory.createMonsterFilter()
		});
	}

	private matchMonster(monster: Monster) {
		return Napoleon.matchMonster(monster, this.state.filter);
	}

	public render() {
		const monsters: Monster[] = [];
		this.props.library.forEach(group => {
			group.monsters.forEach(monster => {
				if (this.matchMonster(monster)) {
					monsters.push(monster);
				}
			});
		});
		monsters.sort((a, b) => {
			if (a.name < b.name) { return -1; }
			if (a.name > b.name) { return 1; }
			return 0;
		});

		let selectedIDs: string[] = [];
		if (this.props.combatSetup.encounter) {
			selectedIDs = this.props.combatSetup.encounter?.slots.map(s => s.monsterID);
		}

		let allCombatants: JSX.Element | JSX.Element[] = monsters.filter(m => !selectedIDs.includes(m.id)).map(m => {
			return (
				<MonsterCandidateCard key={m.id} monster={m} selectMonster={monster => this.props.addMonster(monster)} />
			);
		});
		if (allCombatants.length === 0) {
			allCombatants = (
				<Note>
					<div className='section'>
						there are no monsters that match the above criteria (or you have already selected them all)
					</div>
				</Note>
			);
		}

		return (
			<div>
				<div className='heading'>monsters</div>
				<FilterPanel
					filter={this.state.filter}
					changeValue={(type, value) => this.changeFilterValue(type, value)}
					resetFilter={() => this.resetFilter()}
				/>
				{allCombatants}
			</div>
		);
	}
}

interface OptionsSectionProps {
	type: 'start' | 'add-wave' | 'add-combatants';
	combatSetup: CombatSetup;
	getMonster: (id: string) => Monster | null;
	changeValue: (source: any, field: string, value: any) => void;
	nudgeValue: (source: any, field: string, delta: number) => void;
}

interface OptionsSectionState {
	standardInitOptions: boolean;
	standardHPOptions: boolean;
	view: string;
}

class OptionsSection extends React.Component<OptionsSectionProps, OptionsSectionState> {
	constructor(props: OptionsSectionProps) {
		super(props);
		this.state = {
			standardInitOptions: true,
			standardHPOptions: true,
			view: 'count'
		};
	}

	private setView(view: string) {
		this.setState({
			view: view
		});
	}

	private getSlots(slotsContainer: { slots: EncounterSlot[] }, view: string) {
		return this.props.combatSetup.slotInfo.map(slotInfo => {
			const encounterSlot = slotsContainer.slots.find(s => s.id === slotInfo.id);
			if (!encounterSlot) {
				return null;
			}
			const monster = this.props.getMonster(encounterSlot.monsterID);
			if (!monster) {
				return null;
			}
			return (
				<MonsterSlotSection
					key={slotInfo.id}
					slotInfo={slotInfo}
					encounterSlot={encounterSlot}
					monster={monster}
					view={view}
					changeValue={(source, field, value) => this.props.changeValue(source, field, value)}
					nudgeValue={(source, field, delta) => this.props.nudgeValue(source, field, delta)}
				/>
			);
		});
	}

	public render() {
		if ((this.props.type === 'start') && !this.props.combatSetup.encounter) {
			return (
				<div>
					<div className='heading'>options</div>
					<div className='section'>select an encounter to see monster information here.</div>
				</div>
			);
		}

		if ((this.props.type === 'add-wave') && !this.props.combatSetup.waveID) {
			return (
				<div>
					<div className='heading'>options</div>
					<div className='section'>select a wave to see monster information here.</div>
				</div>
			);
		}

		if ((this.props.type === 'add-combatants') && (this.props.combatSetup.encounter?.slots.length === 0)) {
			return (
				<div>
					<div className='heading'>options</div>
					<div className='section'>add monsters to see their information here.</div>
				</div>
			);
		}

		if (this.props.combatSetup.encounter) {
			let slotsContainer: { slots: EncounterSlot[] } = this.props.combatSetup.encounter;
			if (this.props.combatSetup.waveID) {
				const selectedWave = this.props.combatSetup.encounter.waves.find(w => w.id === this.props.combatSetup.waveID);
				if (selectedWave) {
					slotsContainer = selectedWave;
				}
			}

			if (slotsContainer.slots.length === 0) {
				return null;
			}

			return (
				<div>
					<div className='heading'>options</div>
					<Checkbox
						checked={this.state.standardInitOptions}
						label='roll initiative once for each different type of monster'
						onChecked={checked => this.setState({ standardInitOptions: checked })}
					/>
					{this.state.standardInitOptions ? null : this.getSlots(slotsContainer, 'initiative')}
					<Checkbox
						checked={this.state.standardHPOptions}
						label='use typical hp for each monster'
						onChecked={checked => this.setState({ standardHPOptions: checked })}
					/>
					{this.state.standardHPOptions ? null : this.getSlots(slotsContainer, 'hit points')}
					<hr/>
					<Expander text='advanced options'>
						<Selector options={['count', 'names', 'faction'].map(s => ({ id: s, text: s }))} selectedID={this.state.view} onSelect={id => this.setView(id)} />
						<hr/>
						<div>{this.getSlots(slotsContainer, this.state.view)}</div>
					</Expander>
				</div>
			);
		}

		return null;
	}
}

interface MonsterSlotSectionProps {
	slotInfo: CombatSlotInfo;
	encounterSlot: EncounterSlot;
	monster: Monster;
	view: string;
	changeValue: (source: any, field: string, value: any) => void;
	nudgeValue: (source: any, field: string, delta: number) => void;
}

class MonsterSlotSection extends React.Component<MonsterSlotSectionProps> {
	private rollInit(data: CombatSlotMember | null) {
		const roll = Gygax.dieRoll();
		const bonus = Gygax.modifierValue(this.props.monster.abilityScores.dex);
		this.props.changeValue(data ?? this.props.slotInfo, 'init', roll + bonus);
	}

	private rollHP(data: CombatSlotMember | null) {
		const dieType = Gygax.hitDieType(this.props.monster.size);
		const roll = Gygax.dieRoll(dieType, this.props.monster.hitDice);
		const bonus = Gygax.modifierValue(this.props.monster.abilityScores.con) * this.props.monster.hitDice;
		this.props.changeValue(data ?? this.props.slotInfo, 'hp', roll + bonus);
	}

	private getValueSection(min: number, max: number, source: any, field: string, roll: () => void) {
		return (
			<Row align='middle'>
				<Col span={20}>
					<Slider
						min={min}
						max={max}
						value={source[field]}
						onChange={(value: any) => this.props.changeValue(source, field, value)}
					/>
				</Col>
				<Col span={4}>
					<div className='combatant-value'>
						{source[field]}
						<RedoOutlined onClick={() => roll()}/>
					</div>
				</Col>
			</Row>
		);
	}

	private getInitSection() {
		let checkbox = null;
		if (this.props.encounterSlot.count > 1) {
			checkbox = (
				<Checkbox
					label='roll initiative once for this group'
					checked={this.props.slotInfo.useGroupInit}
					onChecked={value => this.props.changeValue(this.props.slotInfo, 'useGroupInit', value)}
				/>
			);
		}

		const bonus = Gygax.modifierValue(this.props.monster.abilityScores.dex);
		const min = 1 + bonus;
		const max = 20 + bonus;

		const sections = [];
		if (this.props.slotInfo.useGroupInit) {
			sections.push(
				<div key='init'>
					{this.getValueSection(min, max, this.props.slotInfo, 'init', () => this.rollInit(null))}
				</div>
			);
		} else {
			this.props.slotInfo.members.forEach(data => {
				sections.push(
					<div key={data.id}>
						<div className='combatant-name'>{data.name}</div>
						{this.getValueSection(min, max, data, 'init', () => this.rollInit(data))}
					</div>
				);
			});
		}

		return (
			<div>
				{checkbox}
				{sections}
			</div>
		);
	}

	private getHPSection() {
		let checkbox = null;
		if (this.props.encounterSlot.count > 1) {
			checkbox = (
				<Checkbox
					label='use the same hp for every monster in this group'
					checked={this.props.slotInfo.useGroupHP}
					onChecked={value => this.props.changeValue(this.props.slotInfo, 'useGroupHP', value)}
				/>
			);
		}

		const typical = Frankenstein.getTypicalHP(this.props.monster);
		const bonus = Gygax.modifierValue(this.props.monster.abilityScores.con) * this.props.monster.hitDice;
		const min = this.props.monster.hitDice + bonus;
		const max = (this.props.monster.hitDice * Gygax.hitDieType(this.props.monster.size)) + bonus;

		const sections = [];
		if (this.props.slotInfo.useGroupHP) {
			sections.push(
				<div key='hp'>
					{this.getValueSection(min, max, this.props.slotInfo, 'hp', () => this.rollHP(null))}
					<button
						className={this.props.slotInfo.hp !== typical ? '' : 'disabled'}
						onClick={() => this.props.changeValue(this.props.slotInfo, 'hp', typical)}
					>
						reset to average hp
					</button>
				</div>
			);
		} else {
			this.props.slotInfo.members.forEach(data => {
				sections.push(
					<div key={data.id}>
						<div className='combatant-name'>{data.name}</div>
						{this.getValueSection(min, max, data, 'hp', () => this.rollHP(data))}
						<button
							className={data.hp !== typical ? '' : 'disabled'}
							onClick={() => this.props.changeValue(data, 'hp', typical)}
						>
							reset to average hp
						</button>
					</div>
				);
			});
		}

		return (
			<div>
				{checkbox}
				{sections}
			</div>
		);
	}

	public getCountSection() {
		return (
			<div>
				<NumberSpin
					value={'count: ' + this.props.encounterSlot.count}
					downEnabled={this.props.encounterSlot.count > 1}
					onNudgeValue={delta => this.props.nudgeValue(this.props.encounterSlot, 'count', delta)}
				/>
			</div>
		);
	}

	private getNameSection() {
		return this.props.slotInfo.members.map(data => {
			return (
				<Textbox
					key={data.id}
					text={data.name}
					onChange={value => this.props.changeValue(data, 'name', value)}
				/>
			);
		});
	}

	public getFactionSection() {
		return (
			<div>
				<Selector
					options={['foe', 'neutral', 'ally'].map(o => ({ id: o, text: o }))}
					selectedID={this.props.encounterSlot.faction}
					onSelect={id => this.props.changeValue(this.props.encounterSlot, 'faction', id)}
				/>
			</div>
		);
	}

	public render() {
		let header = this.props.monster.name || 'unnamed monster';
		let content = null;

		switch (this.props.view) {
			case 'initiative':
				header += ' (1d20 ' + Gygax.modifier(this.props.monster.abilityScores.dex) + ')';
				content = this.getInitSection();
				break;
			case 'hit points':
				header += ' (' + Frankenstein.getTypicalHPString(this.props.monster) + ')';
				content = this.getHPSection();
				break;
			case 'count':
				content = this.getCountSection();
				break;
			case 'names':
				content = this.getNameSection();
				break;
			case 'faction':
				content = this.getFactionSection();
				break;
		}

		return (
			<div className='group-panel combatant-setup'>
				<div className='subheading'>{header}</div>
				{content}
			</div>
		);
	}
}
