import { Col, Drawer, InputNumber, Row } from 'antd';
import React from 'react';

import Factory from '../../../utils/factory';
import Napoleon from '../../../utils/napoleon';

import { Encounter, EncounterSlot, EncounterWave, MonsterFilter } from '../../../models/encounter';
import { Monster, MonsterGroup } from '../../../models/monster-group';
import { Party } from '../../../models/party';

import MonsterCard from '../../cards/monster-card';
import ConfirmButton from '../../controls/confirm-button';
import Expander from '../../controls/expander';
import Selector from '../../controls/selector';
import Textbox from '../../controls/textbox';
import DifficultyChartPanel from '../../panels/difficulty-chart-panel';
import FilterPanel from '../../panels/filter-panel';
import GridPanel from '../../panels/grid-panel';
import Note from '../../panels/note';
import StatBlockModal from '../viewers/stat-block-modal';

interface Props {
	encounter: Encounter;
	parties: Party[];
	library: MonsterGroup[];
	getMonster: (monsterName: string, groupName: string) => Monster | null;
}

interface State {
	encounter: Encounter;
	view: string;
	filter: MonsterFilter;
	selectedMonster: Monster | null;
	randomEncounterXP: number;
}

export default class EncounterEditorModal extends React.Component<Props, State> {

	// We store this so we don't have to recalculate the list on every render
	private libraryMonsters: Monster[] | null;

	constructor(props: Props) {
		super(props);

		this.state = {
			encounter: props.encounter,
			view: 'monsters',
			filter: Factory.createMonsterFilter(),
			selectedMonster: null,
			randomEncounterXP: 1000
		};

		this.libraryMonsters = null;
	}

	private setView(view: string) {
		this.setState({
			view: view
		});
	}

	private setSelectedMonster(monster: Monster | null) {
		this.setState({
			selectedMonster: monster
		});
	}

	private setRandomEncounterXP(value: number) {
		this.setState({
			randomEncounterXP: Math.max(0, value)
		});
	}

	private addWave() {
		const wave = Factory.createEncounterWave();
		wave.name = 'wave ' + (this.state.encounter.waves.length + 2);
		this.state.encounter.waves.push(wave);

		this.setState({
			encounter: this.state.encounter
		});
	}

	private removeWave(wave: EncounterWave) {
		const index = this.state.encounter.waves.indexOf(wave);
		this.state.encounter.waves.splice(index, 1);

		this.setState({
			encounter: this.state.encounter
		});
	}

	private buildEncounter() {
		const encounter = this.state.encounter;
		encounter.slots = [];
		encounter.waves = [];

		Napoleon.buildEncounter(encounter, this.state.randomEncounterXP, this.state.filter, this.props.library, this.props.getMonster);
		this.sortEncounterSlots(encounter);
		encounter.waves.forEach(wave => this.sortEncounterSlots(wave));

		this.setState({
			encounter: encounter
		});
	}

	private clearEncounter() {
		const encounter = this.state.encounter;
		encounter.slots = [];
		encounter.waves = [];

		this.setState({
			encounter: encounter
		});
	}

	private addEncounterSlot(monster: Monster, waveID: string | null) {
		const group = this.props.library.find(g => g.monsters.includes(monster));
		if (group) {
			const slot = Factory.createEncounterSlot();
			slot.monsterGroupName = group.name;
			slot.monsterName = monster.name;

			if (waveID !== null) {
				const wave = this.state.encounter.waves.find(w => w.id === waveID);
				if (wave) {
					wave.slots.push(slot);
					this.sortEncounterSlots(wave);
				}
			} else {
				this.state.encounter.slots.push(slot);
				this.sortEncounterSlots(this.state.encounter);
			}

			this.setState({
				encounter: this.state.encounter
			});
		}
	}

	private sortEncounterSlots(slotContainer: { slots: EncounterSlot[] }) {
		const uniqueSlots: EncounterSlot[] = [];
		slotContainer.slots.forEach(slot => {
			let current = uniqueSlots.find(s => (s.monsterGroupName === slot.monsterGroupName) && (s.monsterName === slot.monsterName));
			if (!current) {
				current = slot;
				uniqueSlots.push(slot);
			} else {
				current.count += slot.count;
			}
		});
		slotContainer.slots = uniqueSlots;

		slotContainer.slots.sort((a, b) => {
			const aName = a.monsterName.toLowerCase();
			const bName = b.monsterName.toLowerCase();
			if (aName < bName) { return -1; }
			if (aName > bName) { return 1; }
			return 0;
		});
	}

	private removeEncounterSlot(slot: EncounterSlot, waveID: string | null) {
		if (waveID) {
			const wave = this.state.encounter.waves.find(w => w.id === waveID);
			if (wave) {
				const index = wave.slots.indexOf(slot);
				wave.slots.splice(index, 1);
			}
		} else {
			const n = this.state.encounter.slots.indexOf(slot);
			this.state.encounter.slots.splice(n, 1);
		}

		this.setState({
			encounter: this.state.encounter
		});
	}

	private swapEncounterSlot(slot: EncounterSlot, waveID: string | null, groupName: string, monsterName: string) {
		slot.monsterGroupName = groupName;
		slot.monsterName = monsterName;

		if (waveID) {
			const wave = this.state.encounter.waves.find(w => w.id === waveID);
			if (wave) {
				this.sortEncounterSlots(wave);
			}
		} else {
			this.sortEncounterSlots(this.state.encounter);
		}

		this.setState({
			encounter: this.state.encounter
		});
	}

	private moveToWave(slot: EncounterSlot, current: EncounterSlot[], waveID: string) {
		const index = current.indexOf(slot);
		current.splice(index, 1);

		if (waveID) {
			const wave = this.state.encounter.waves.find(w => w.id === waveID);
			if (wave) {
				wave.slots.push(slot);
				this.sortEncounterSlots(wave);
			}
		} else {
			this.state.encounter.slots.push(slot);
			this.sortEncounterSlots(this.state.encounter);
		}

		this.setState({
			encounter: this.state.encounter
		});
	}

	private changeValue(source: any, field: string, value: any) {
		source[field] = value;

		this.setState({
			encounter: this.state.encounter
		});
	}

	private nudgeValue(source: any, field: string, delta: number) {
		let value: number = source[field];
		value += delta;

		if (field === 'count') {
			value = Math.max(value, 1);
		}

		this.changeValue(source, field, value);
	}

	private changeFilterValue(type: 'name' | 'challenge' | 'category' | 'size' | 'role', value: any) {
		const filter = this.state.filter as any;
		if (type === 'challenge') {
			filter.challengeMin = value[0];
			filter.challengeMax = value[1];
		} else {
			filter[type] = value;
		}

		this.libraryMonsters = null;
		this.setState({
			filter: filter
		});
	}

	private resetFilter() {
		this.libraryMonsters = null;
		this.setState({
			filter: Factory.createMonsterFilter()
		});
	}

	private getMonsterCards(slots: EncounterSlot[], waveID: string | null) {
		const cards = [];

		slots.forEach(slot => {
			const monster = this.props.getMonster(slot.monsterName, slot.monsterGroupName);
			if (monster) {
				cards.push(
					<MonsterCard
						monster={monster}
						slot={slot}
						encounter={this.props.encounter}
						mode={'encounter'}
						library={this.props.library}
						nudgeValue={(source, type, delta) => this.nudgeValue(source, type, delta)}
						viewMonster={m => this.setSelectedMonster(m)}
						removeEncounterSlot={s => this.removeEncounterSlot(s, waveID)}
						swapEncounterSlot={(s, groupName, monsterName) => this.swapEncounterSlot(s, waveID, groupName, monsterName)}
						moveToWave={(s, current, id) => this.moveToWave(s, current, id)}
					/>
				);
			} else {
				cards.push(
					<div className='card error'>
						<div className='card-content'>
							<div className='subheading'>unknown monster</div>
							<hr/>
							<div className='section'>
								could not find a monster called '<b>{slot.monsterName}</b>' in a group called '<b>{slot.monsterGroupName}'</b>
							</div>
							<hr/>
							<button onClick={() => this.removeEncounterSlot(slot, waveID)}>remove</button>
						</div>
					</div>
				);
			}
		});

		if (slots.length === 0) {
			if (waveID) {
				cards.push(
					<Note>there are no monsters in this wave</Note>
				);
			} else {
				cards.push(
					<Note>
						<p>there are no monsters in this encounter</p>
						<p>you can add monsters from the list below, or try 'build a random encounter'</p>
					</Note>
				);
			}
		}

		return cards;
	}

	private getLibraryMonsters() {
		const containers: { slots: EncounterSlot[] }[] = [ this.state.encounter ];
		this.state.encounter.waves.forEach(wave => containers.push(wave));

		const monsters: Monster[] = [];
		this.props.library.forEach(group => {
			group.monsters.forEach(monster => {
				if (Napoleon.matchMonster(monster, this.state.filter)) {
					const inAll = containers
						.every(container => !!container.slots
							.find(slot => (slot.monsterGroupName === group.name) && (slot.monsterName === monster.name))
						);
					if (!inAll) {
						monsters.push(monster);
					}
				}
			});
		});

		monsters.sort((a, b) => {
			if (a.name < b.name) { return -1; }
			if (a.name > b.name) { return 1; }
			return 0;
		});

		return monsters;
	}

	private getLibrarySection() {
		if (this.libraryMonsters === null) {
			this.libraryMonsters = this.getLibraryMonsters();
		}

		const cards = this.libraryMonsters.map(monster => {
			return (
				<MonsterCard
					key={monster.id}
					monster={monster}
					encounter={this.props.encounter}
					library={this.props.library}
					mode={'encounter'}
					viewMonster={m => this.setSelectedMonster(m)}
					addEncounterSlot={(combatant, waveID) => this.addEncounterSlot(combatant, waveID)}
				/>
			);
		});

		if (cards.length === 0) {
			const desc = Napoleon.getFilterDescription(this.state.filter);
			cards.push(
				<Note key='empty'><p>there are no monsters that meet the criteria <i>{desc}</i></p></Note>
			);
		}

		return (
			<GridPanel
				heading='monster library'
				content={cards}
				columns={3}
				showToggle={true}
			/>
		);
	}

	public render() {
		try {
			let sidebar = null;
			let content = null;
			switch (this.state.view) {
				case 'monsters':
					const waves = this.props.encounter.waves.map(wave => (
						<div key={wave.id} className='group-panel'>
							<Textbox
								text={wave.name}
								placeholder='wave name'
								onChange={value => this.changeValue(wave, 'name', value)}
							/>
							<ConfirmButton text='delete wave' onConfirm={() => this.removeWave(wave)} />
						</div>
					));
					const waveSlots = this.props.encounter.waves.map(w => {
						return (
							<GridPanel
								key={w.id}
								heading={w.name || 'unnamed wave'}
								content={this.getMonsterCards(w.slots, w.id)}
								columns={3}
							/>
						);
					});
					sidebar = (
						<div>
							<div className='section'>
								<div className='subheading'>waves</div>
								{waves}
								<button onClick={() => this.addWave()}>add a new wave</button>
							</div>
							<hr/>
							<DifficultyChartPanel
								encounter={this.props.encounter}
								parties={this.props.parties}
								getMonster={(monsterName, monsterGroupName) => this.props.getMonster(monsterName, monsterGroupName)}
							/>
							<hr/>
							<div className='section'>
								<FilterPanel
									filter={this.state.filter}
									changeValue={(type, value) => this.changeFilterValue(type, value)}
									resetFilter={() => this.resetFilter()}
								/>
							</div>
							<hr/>
							<div className='section'>
								<Expander text='build a random encounter'>
									<p>add random monsters to this encounter until its (effective) xp value is at least the following value</p>
									<InputNumber
										value={this.state.randomEncounterXP}
										min={0}
										step={1000}
										onChange={value => {
											const val = parseInt((value ?? 0).toString(), 10);
											this.setRandomEncounterXP(val);
										}}
									/>
									<button onClick={() => this.buildEncounter()}>build encounter</button>
								</Expander>
								<ConfirmButton text='clear encounter' onConfirm={() => this.clearEncounter()} />
							</div>
						</div>
					);
					content = (
						<div>
							<GridPanel
								columns={3}
								content={this.getMonsterCards(this.props.encounter.slots, null)}
								heading='encounter'
							/>
							{waveSlots}
							{this.getLibrarySection()}
						</div>
					);
					break;
				case 'notes':
					sidebar = null;
					content = (
						<div>
							<GridPanel
								columns={1}
								content={[
									<Textbox
										key='notes'
										text={this.props.encounter.notes}
										placeholder='notes'
										multiLine={true}
										onChange={text => this.changeValue(this.props.encounter, 'notes', text)}
									/>
								]}
								heading='notes'
							/>
						</div>
					);
					break;
			}

			return (
				<Row className='full-height'>
					<Col span={6} className='scrollable sidebar sidebar-left'>
						<div className='section'>
							<div className='subheading'>encounter name</div>
							<Textbox
								text={this.props.encounter.name}
								placeholder='encounter name'
								onChange={value => this.changeValue(this.props.encounter, 'name', value)}
							/>
							<Selector
								options={['monsters', 'notes'].map(o => ({ id: o, text: o }))}
								selectedID={this.state.view}
								onSelect={view => this.setView(view)}
							/>
							{sidebar}
						</div>
					</Col>
					<Col span={18} className='scrollable'>
						{content}
					</Col>
					<Drawer visible={!!this.state.selectedMonster} width='50%' closable={false} onClose={() => this.setSelectedMonster(null)}>
						<StatBlockModal source={this.state.selectedMonster} />
					</Drawer>
				</Row>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}