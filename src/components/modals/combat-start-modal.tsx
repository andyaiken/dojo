import { CloseCircleOutlined, RedoOutlined } from '@ant-design/icons';
import { Col, Row, Slider } from 'antd';
import React from 'react';

import Factory from '../../utils/factory';
import Frankenstein from '../../utils/frankenstein';
import Mercator from '../../utils/mercator';
import Napoleon from '../../utils/napoleon';
import Utils from '../../utils/utils';

import { CombatSetup, CombatSlotInfo, CombatSlotMember } from '../../models/combat';
import { Encounter, EncounterSlot, MonsterFilter } from '../../models/encounter';
import { Map } from '../../models/map';
import { Monster, MonsterGroup } from '../../models/monster-group';
import { Party } from '../../models/party';

import MonsterCard from '../cards/monster-card';
import Checkbox from '../controls/checkbox';
import Dropdown from '../controls/dropdown';
import NumberSpin from '../controls/number-spin';
import Selector from '../controls/selector';
import Textbox from '../controls/textbox';
import DifficultyChartPanel from '../panels/difficulty-chart-panel';
import FilterPanel from '../panels/filter-panel';
import MapPanel from '../panels/map-panel';
import Note from '../panels/note';

interface Props {
	type: 'start' | 'add-wave' | 'add-combatants';
	combatSetup: CombatSetup;
	parties: Party[];
	library: MonsterGroup[];
	encounters: Encounter[];
	maps: Map[];
	getMonster: (monsterName: string, groupName: string) => Monster | null;
	addMonster: (monster: Monster) => void;
	notify: () => void;
}

interface State {
	combatSetup: CombatSetup;
	partyFixed: boolean;
	encounterFixed: boolean;
	mapFixed: boolean;
}

export default class CombatStartModal extends React.Component<Props, State> {
	public static defaultProps = {
		parties: null,
		encounters: null,
		maps: null,
		addMonster: null
	};

	constructor(props: Props) {
		super(props);

		this.state = {
			combatSetup: props.combatSetup,
			partyFixed: !!props.combatSetup.party,
			encounterFixed: !!props.combatSetup.encounter,
			mapFixed: !!props.combatSetup.map
		};
	}

	private setPartyID(partyID: string | null) {
		const setup = this.state.combatSetup;
		const party = this.props.parties.find(p => p.id === partyID);
		setup.party = party ? JSON.parse(JSON.stringify(party)) : null;
		this.setState({
			combatSetup: setup
		}, () => this.props.notify());
	}

	private setEncounterID(encounterID: string | null) {
		const setup = this.state.combatSetup;
		const encounter = this.props.encounters.find(e => e.id === encounterID);
		setup.encounter = encounter ? JSON.parse(JSON.stringify(encounter)) : null;
		setup.slotInfo = Utils.getCombatSlotData(setup.encounter, this.props.library);
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
				setup.slotInfo = Utils.getCombatSlotData(wave, this.props.library);
			}
		}
		this.setState({
			combatSetup: setup
		}, () => this.props.notify());
	}

	private generateEncounter(diff: string) {
		const encounter = Factory.createEncounter();
		encounter.name = 'new encounter';

		const filter = Factory.createMonsterFilter();

		let xp = 0;
		let sumLevel = 0;
		if (this.state.combatSetup.party) {
			const pcs = this.state.combatSetup.party.pcs.filter(pc => pc.active);
			pcs.forEach(pc => {
				xp += Utils.pcExperience(pc.level, diff);
				sumLevel += pc.level;
			});

			const avgLevel = sumLevel / pcs.length;
			filter.challengeMax = Math.max(avgLevel, 5);
		}

		Napoleon.buildEncounter(encounter, xp, filter, this.props.library, this.props.getMonster);
		const setup = this.state.combatSetup;
		setup.encounter = encounter;
		setup.slotInfo = Utils.getCombatSlotData(encounter, this.props.library);
		this.setState({
			combatSetup: setup
		}, () => this.props.notify());
	}

	private generateMap(type: string) {
		const map = Factory.createMap();
		map.name = 'new map';
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

	private nudgeCount(slotID: string, delta: number) {
		const setup = this.state.combatSetup;
		if (setup.encounter) {
			const slot = setup.encounter.slots.find(s => s.id === slotID);
			if (slot) {
				// Change number
				slot.count = Math.max(0, slot.count + delta);
				// Reset names
				setup.slotInfo = Utils.getCombatSlotData(setup.encounter, this.props.library);
				this.setState({
					combatSetup: setup
				});
			}
		}
	}

	public render() {
		try {
			let leftSection = null;
			let rightSection = null;

			switch (this.props.type) {
				case 'start':
					leftSection = (
						<div>
							<PartySection
								combatSetup={this.state.combatSetup}
								parties={this.props.parties}
								fixed={this.state.partyFixed}
								setPartyID={id => this.setPartyID(id)}
							/>
							<EncounterSection
								combatSetup={this.state.combatSetup}
								encounters={this.props.encounters}
								fixed={this.state.encounterFixed}
								setEncounterID={id => this.setEncounterID(id)}
								generateEncounter={diff => this.generateEncounter(diff)}
							/>
							<MapSection
								combatSetup={this.state.combatSetup}
								maps={this.props.maps}
								fixed={this.state.mapFixed}
								setMapID={id => this.setMapID(id)}
								generateMap={type => this.generateMap(type)}
							/>
						</div>
					);
					rightSection = (
						<div>
							<DifficultySection
								combatSetup={this.state.combatSetup}
								parties={this.props.parties}
								encounters={this.props.encounters}
								getMonster={(monsterName, groupName) => this.props.getMonster(monsterName, groupName)}
							/>
							<MonsterSection
								type={this.props.type}
								combatSetup={this.state.combatSetup}
								parties={this.props.parties}
								getMonster={(monsterName, groupName) => this.props.getMonster(monsterName, groupName)}
								changeValue={(source, field, value) => this.changeValue(source, field, value)}
								nudgeCount={(slotID, delta) => this.nudgeCount(slotID, delta)}
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
							/>
						</div>
					);
					rightSection = (
						<div>
							<MonsterSection
								type={this.props.type}
								combatSetup={this.state.combatSetup}
								parties={this.props.parties}
								getMonster={(monsterName, groupName) => this.props.getMonster(monsterName, groupName)}
								changeValue={(source, field, value) => this.changeValue(source, field, value)}
								nudgeCount={(slotID, delta) => this.nudgeCount(slotID, delta)}
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
							<MonsterSection
								type={this.props.type}
								combatSetup={this.state.combatSetup}
								parties={this.props.parties}
								getMonster={(monsterName, groupName) => this.props.getMonster(monsterName, groupName)}
								changeValue={(source, field, value) => this.changeValue(source, field, value)}
								nudgeCount={(slotID, delta) => this.nudgeCount(slotID, delta)}
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
			return <div className='render-error'/>;
		}
	}
}

interface PartySectionProps {
	combatSetup: CombatSetup;
	parties: Party[];
	fixed: boolean;
	setPartyID: (id: string | null) => void;
}

class PartySection extends React.Component<PartySectionProps> {
	public render() {
		if (this.props.parties.length === 0) {
			return (
				<div className='section'>you have not defined any parties</div>
			);
		}

		let tools = null;
		if (!this.props.combatSetup.party) {
			const partyOptions = this.props.parties.map(party => {
				return {
					id: party.id,
					text: party.name || 'unnamed party'
				};
			});

			tools = (
				<Dropdown
					options={partyOptions}
					placeholder='select a party'
					onSelect={optionID => this.props.setPartyID(optionID)}
				/>
			);
		}

		let partyContent = null;
		if (this.props.combatSetup.party) {
			const pcSections = this.props.combatSetup.party.pcs.filter(pc => pc.active).map(pc => (
				<div key={pc.id} className='group-panel'>
					{pc.name || 'unnamed pc'} (level {pc.level})
				</div>
			));

			if (pcSections.length === 0) {
				pcSections.push(
					<Note key={'empty'}>no pcs</Note>
				);
			}

			partyContent = (
				<div>
					{pcSections}
				</div>
			);
		}

		let clear = null;
		if (this.props.combatSetup.party && !this.props.fixed) {
			clear = (
				<CloseCircleOutlined onClick={() => this.props.setPartyID(null)} />
			);
		}

		return (
			<div>
				<div className='heading'>
					party
					{clear}
				</div>
				{tools}
				{partyContent}
			</div>
		);
	}
}

interface EncounterSectionProps {
	combatSetup: CombatSetup;
	encounters: Encounter[];
	fixed: boolean;
	setEncounterID: (id: string | null) => void;
	generateEncounter: (diff: string) => void;
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
				let name = slot.monsterName || 'unnamed monster';
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

			const waves = this.props.combatSetup.encounter.waves.map(wave => {
				if (wave.slots.length === 0) {
					return null;
				}

				const waveMonsters = wave.slots.map(slot => {
					let name = slot.monsterName || 'unnamed monster';
					if (slot.count > 1) {
						name += ' x' + slot.count;
					}
					return (
						<div key={slot.id} className='group-panel'>
							{name}
						</div>
					);
				});

				return (
					<div key={wave.id}>
						<div className='subheading'>{wave.name || 'unnamed wave'}</div>
						{waveMonsters}
					</div>
				);
			});

			encounterContent = (
				<div>
					{monsterSections}
					{waves}
				</div>
			);
		}

		let clear = null;
		if (this.props.combatSetup.encounter && !this.props.fixed) {
			clear = (
				<CloseCircleOutlined onClick={() => this.props.setEncounterID(null)} />
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
						text: map.name || 'unnamed map',
						display: (
							<MapPanel map={map} />
						)
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
					<Note>this is optional - you don't have to use a map to run an encounter</Note>
					{selector}
					<button onClick={() => this.props.generateMap('delve')}>generate a random delve</button>
				</div>
			);
		}

		let mapContent = null;
		if (this.props.combatSetup.map) {
			mapContent = (
				<MapPanel
					map={this.props.combatSetup.map}
				/>
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
						let name = slot.monsterName || 'unnamed monster';
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

	private changeFilterValue(type: 'name' | 'challenge' | 'category' | 'size', value: any) {
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

		const selectedIDs = this.props.combatSetup.slotInfo.map(s => s.id);

		let allCombatants: JSX.Element | JSX.Element[] = monsters.filter(m => !selectedIDs.includes(m.id)).map(m => {
			return (
				<MonsterCard key={m.id} monster={m} mode='candidate' selectMonster={monster => this.props.addMonster(monster)} />
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

interface DifficultySectionProps {
	combatSetup: CombatSetup;
	parties: Party[];
	encounters: Encounter[];
	getMonster: (monsterName: string, groupName: string) => Monster | null;
}

class DifficultySection extends React.Component<DifficultySectionProps> {
	public render() {
		if (this.props.combatSetup.party && this.props.combatSetup.encounter) {
			return (
				<div>
					<div className='heading'>encounter difficulty</div>
					<DifficultyChartPanel
						parties={this.props.parties}
						party={this.props.combatSetup.party}
						encounter={this.props.combatSetup.encounter}
						getMonster={(monsterName, monsterGroupName) => this.props.getMonster(monsterName, monsterGroupName)}
					/>
				</div>
			);
		}

		return (
			<div>
				<div className='heading'>encounter difficulty</div>
				<div className='section'>select a party and an encounter on the left to see difficulty information.</div>
			</div>
		);
	}
}

interface MonsterSectionProps {
	type: 'start' | 'add-wave' | 'add-combatants';
	combatSetup: CombatSetup;
	parties: Party[];
	getMonster: (monsterName: string, groupName: string) => Monster | null;
	changeValue: (source: any, field: string, value: any) => void;
	nudgeCount: (slotID: string, delta: number) => void;
}

interface MonsterSectionState {
	view: string;
}

class MonsterSection extends React.Component<MonsterSectionProps, MonsterSectionState> {
	constructor(props: MonsterSectionProps) {
		super(props);
		this.state = {
			view: 'init'
		};
	}

	private setView(view: string) {
		this.setState({
			view: view
		});
	}

	public render() {
		if ((this.props.type === 'start') && !this.props.combatSetup.encounter) {
			return (
				<div>
					<div className='heading'>monsters</div>
					<div className='section'>select an encounter to see monster information here.</div>
				</div>
			);
		}

		if ((this.props.type === 'add-wave') && !this.props.combatSetup.waveID) {
			return (
				<div>
					<div className='heading'>monsters</div>
					<div className='section'>select a wave to see monster information here.</div>
				</div>
			);
		}

		if ((this.props.type === 'add-combatants') && (this.props.combatSetup.encounter?.slots.length === 0)) {
			return (
				<div>
					<div className='heading'>monsters</div>
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

			const options = ['init', 'hit points', 'names', 'count'].map(s => {
				return { id: s, text: s };
			});

			const slots = this.props.combatSetup.slotInfo.map(slotInfo => {
				const encounterSlot = slotsContainer.slots.find(s => s.id === slotInfo.id);
				if (!encounterSlot) {
					return null;
				}
				const monster = this.props.getMonster(encounterSlot.monsterName, encounterSlot.monsterGroupName);
				if (!monster) {
					return null;
				}
				return (
					<MonsterSlotSection
						key={slotInfo.id}
						slotInfo={slotInfo}
						encounterSlot={encounterSlot}
						monster={monster}
						view={this.state.view}
						changeValue={(source, field, value) => this.props.changeValue(source, field, value)}
						nudgeCount={(slotID, delta) => this.props.nudgeCount(slotID, delta)}
					/>
				);
			});

			return (
				<div>
					<div className='heading'>monsters</div>
					<Selector options={options} selectedID={this.state.view} onSelect={id => this.setView(id)} />
					<hr/>
					<div>{slots}</div>
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
	nudgeCount: (slotID: string, delta: number) => void;
}

class MonsterSlotSection extends React.Component<MonsterSlotSectionProps> {
	private rollInit(data: CombatSlotMember | null) {
		const roll = Utils.dieRoll();
		const bonus = Utils.modifierValue(this.props.monster.abilityScores.dex);
		this.props.changeValue(data ?? this.props.slotInfo, 'init', roll + bonus);
	}

	private rollHP(data: CombatSlotMember | null) {
		const dieType = Utils.hitDieType(this.props.monster.size);
		const roll = Utils.dieRoll(dieType, this.props.monster.hitDice);
		const bonus = Utils.modifierValue(this.props.monster.abilityScores.con) * this.props.monster.hitDice;
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
						onChange={value => this.props.changeValue(source, field, value)}
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

		const bonus = Utils.modifierValue(this.props.monster.abilityScores.dex);
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
					label='roll hit points once for this group'
					checked={this.props.slotInfo.useGroupHP}
					onChecked={value => this.props.changeValue(this.props.slotInfo, 'useGroupHP', value)}
				/>
			);
		}

		const typical = Frankenstein.getTypicalHP(this.props.monster);
		const bonus = Utils.modifierValue(this.props.monster.abilityScores.con) * this.props.monster.hitDice;
		const min = this.props.monster.hitDice + bonus;
		const max = (this.props.monster.hitDice * Utils.hitDieType(this.props.monster.size)) + bonus;

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

	public getCountSection() {
		return (
			<NumberSpin
				value={this.props.encounterSlot.count}
				downEnabled={this.props.encounterSlot.count > 1}
				onNudgeValue={delta => this.props.nudgeCount(this.props.encounterSlot.id, delta)}
			/>
		);
	}

	public render() {
		let header = this.props.encounterSlot.monsterName;
		let content = null;
		switch (this.props.view) {
			case 'init':
				header += ' (1d20 ' + Utils.modifier(this.props.monster.abilityScores.dex) + ')';
				content = this.getInitSection();
				break;
			case 'hit points':
				header += ' (' + Frankenstein.getTypicalHPString(this.props.monster) + ')';
				content = this.getHPSection();
				break;
			case 'names':
				content = this.getNameSection();
				break;
			case 'count':
				content = this.getCountSection();
				break;
		}

		return (
			<div className='group-panel combatant-setup'>
				<div className='subheading'>{header}</div>
				<hr/>
				{content}
			</div>
		);
	}
}
