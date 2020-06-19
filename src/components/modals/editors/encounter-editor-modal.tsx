import { Col, Drawer, InputNumber, Row } from 'antd';
import React from 'react';

import Factory from '../../../utils/factory';
import Napoleon from '../../../utils/napoleon';
import Utils from '../../../utils/utils';

import { Encounter, EncounterSlot, EncounterWave, MonsterFilter } from '../../../models/encounter';
import { Monster, MonsterGroup } from '../../../models/monster';
import { Party } from '../../../models/party';

import EncounterSlotCard from '../../cards/encounter-slot-card';
import ConfirmButton from '../../controls/confirm-button';
import Expander from '../../controls/expander';
import RadioGroup from '../../controls/radio-group';
import Selector from '../../controls/selector';
import Textbox from '../../controls/textbox';
import DifficultyChartPanel from '../../panels/difficulty-chart-panel';
import FilterPanel from '../../panels/filter-panel';
import GridPanel from '../../panels/grid-panel';
import Note from '../../panels/note';
import StatBlockModal from '../stat-block-modal';

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
	selectedWaveID: string | null;
	selectedSlotID: string | null;
	showLibrary: boolean;
	selectedMonster: Monster | null;
	randomEncounterXP: number;
}

export default class EncounterEditorModal extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			encounter: props.encounter,
			view: 'monsters',
			filter: Factory.createMonsterFilter(),
			selectedWaveID: null,
			selectedSlotID: null,
			showLibrary: false,
			selectedMonster: null,
			randomEncounterXP: 1000
		};
	}

	private setView(view: string) {
		this.setState({
			view: view
		});
	}

	private openSlot(waveID: string | null, slotID: string | null) {
		this.setState({
			filter: Factory.createMonsterFilter(),
			selectedWaveID: waveID,
			selectedSlotID: slotID,
			showLibrary: true
		});
	}

	private setShowLibrary(show: boolean) {
		this.setState({
			showLibrary: show,
			selectedMonster: null
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

	private addToEncounterSlot(monster: Monster, closeLibrary: boolean = true) {
		let list = this.state.encounter.slots;
		if (this.state.selectedWaveID) {
			const wave = this.state.encounter.waves.find(w => w.id === this.state.selectedWaveID);
			if (wave) {
				list = wave.slots;
			}
		}

		let slot = null;
		if (this.state.selectedSlotID) {
			slot = list.find(s => s.id === this.state.selectedSlotID) ?? null;
		}

		if (!slot) {
			slot = Factory.createEncounterSlot();
			list.push(slot);
		}

		const group = this.props.library.find(g => g.monsters.includes(monster));
		if (group) {
			slot.monsterGroupName = group.name;
			slot.monsterName = monster.name;

			this.sortEncounterSlots(this.state.encounter);
			this.state.encounter.waves.forEach(wave => this.sortEncounterSlots(wave));

			this.setState({
				encounter: this.state.encounter,
				selectedWaveID: null,
				selectedSlotID: null,
				showLibrary: !closeLibrary,
				selectedMonster: null
			});
		}
	}

	private sortEncounterSlots(slotContainer: { slots: EncounterSlot[] }) {
		const uniqueSlots: EncounterSlot[] = [];
		slotContainer.slots.forEach(slot => {
			let current = uniqueSlots.find(s =>
				(s.monsterGroupName === slot.monsterGroupName)
				&& (s.monsterName === slot.monsterName)
				&& (s.roles.join(',') === slot.roles.join(',')));
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

	private useTemplate(templateID: string) {
		const template = Napoleon.encounterTemplates().find(t => t.name === templateID);
		if (template) {
			const encounter = this.state.encounter;
			encounter.slots = template.slots.map(s => {
				const slot = Factory.createEncounterSlot();
				slot.roles = s.roles;
				slot.count = s.count;
				return slot;
			});
			encounter.waves = [];

			this.setState({
				encounter: encounter
			});
		}
	}

	private fillTemplate() {
		const monsters: Monster[] = [];
		this.props.library.forEach(group => {
			group.monsters.forEach(monster => {
				const inList = this.state.encounter.slots.some(s => (s.monsterName === monster.name) && (s.monsterGroupName === group.name));
				if (!inList) {
					monsters.push(monster);
				}
			});
		});

		this.state.encounter.slots
			.filter(slot => slot.roles.length > 0)
			.forEach(slot => {
				const candidates = monsters.filter(m => slot.roles.includes(m.role));
				if (candidates.length > 0) {
					const index = Utils.randomNumber(candidates.length);
					const monster = candidates[index];
					const group = this.props.library.find(g => g.monsters.includes(monster));
					if (group) {
						slot.monsterName = monster.name;
						slot.monsterGroupName = group.name;
					}
				}
			});

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

		this.setState({
			filter: filter
		});
	}

	private resetFilter() {
		this.setState({
			filter: Factory.createMonsterFilter()
		});
	}

	private getMonsterCards(slots: EncounterSlot[], waveID: string | null) {
		const cards = [];

		slots.forEach(slot => {
			cards.push(
				<EncounterSlotCard
					slot={slot}
					monster={this.props.getMonster(slot.monsterName, slot.monsterGroupName)}
					encounter={this.props.encounter}
					library={this.props.library}
					changeValue={(source, type, value) => this.changeValue(source, type, value)}
					nudgeValue={(source, type, delta) => this.nudgeValue(source, type, delta)}
					select={s => this.openSlot(waveID, s.id)}
					remove={s => this.removeEncounterSlot(s, waveID)}
					moveToWave={(s, current, id) => this.moveToWave(s, current, id)}
					viewMonster={m => this.setSelectedMonster(m)}
				/>
			);
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
						<p>you can click the button below to add a monster, or try <b>build a random encounter</b> or <b>use an encounter template</b></p>
					</Note>
				);
			}
		}

		return cards;
	}

	private getCandidateSection() {
		let list = this.state.encounter.slots;
		if (this.state.selectedWaveID) {
			const wave = this.state.encounter.waves.find(w => w.id === this.state.selectedWaveID);
			if (wave) {
				list = wave.slots;
			}
		}

		let slot: EncounterSlot | null = null;
		if (this.state.selectedSlotID) {
			slot = list.find(s => s.id === this.state.selectedSlotID) ?? null;
		}

		const monsters: Monster[] = [];

		this.props.library.forEach(group => {
			group.monsters.forEach(monster => {
				// Ignore monsters that don't match the filter
				const matchFilter = Napoleon.matchMonster(monster, this.state.filter);

				// Ignore monsters that don't match the slot's role
				const matchRole = slot ? slot.roles.includes(monster.role) : true;

				// Ignore monsters that are already in the list
				const inList = list.some(s => (s.monsterName === monster.name) && (s.monsterGroupName === group.name));

				if (matchFilter && matchRole && !inList) {
					monsters.push(monster);
				}
			});
		});

		monsters.sort((a, b) => {
			if (a.name < b.name) { return -1; }
			if (a.name > b.name) { return 1; }
			return 0;
		});

		const hasRoles = !!slot && (slot.roles.length > 0);

		let left = (
			<RadioGroup
				items={monsters.map(m => ({ id: m.id, text: m.name, info: 'cr ' + Utils.challenge(m.challenge) }))}
				selectedItemID={this.state.selectedMonster ? this.state.selectedMonster.id : null}
				onSelect={id => this.setSelectedMonster(monsters.find(m => m.id === id) ?? null)}
			/>
		);
		if (monsters.length === 0) {
			const desc = Napoleon.getFilterDescription(this.state.filter);
			left = (
				<Note key='empty'>
					there are no monsters that meet the criteria <i>{desc}</i> (or they are all already part of the encounter)
				</Note>
			);
		}

		let right = (
			<Note>
				select a monster from the list at the left to see its statblock here
			</Note>
		);
		if (this.state.selectedMonster) {
			right = (
				<StatBlockModal source={this.state.selectedMonster} />
			);
		}

		let actions = null;
		if (hasRoles) {
			actions = (
				<button
					className={!!this.state.selectedMonster ? '' : 'disabled'}
					onClick={() => this.addToEncounterSlot(this.state.selectedMonster as Monster)}
				>
					add this monster to the encounter
				</button>
			);
		} else {
			actions = (
				<Row gutter={10}>
					<Col span={12}>
						<button
							className={!!this.state.selectedMonster ? '' : 'disabled'}
							onClick={() => this.addToEncounterSlot(this.state.selectedMonster as Monster, false)}
						>
							add this monster to the encounter
						</button>
					</Col>
					<Col span={12}>
						<button onClick={() => this.setShowLibrary(false)}>close</button>
					</Col>
				</Row>
			);
		}

		return (
			<div className='full-height'>
				<div className='drawer-header'>
					<div className='app-title'>choose a monster</div>
				</div>
				<div className='drawer-content'>
					<Row className='full-height'>
						<Col span={10} className='scrollable'>
							<div className='section'>
								<FilterPanel
									filter={this.state.filter}
									showRoles={!hasRoles}
									changeValue={(type, value) => this.changeFilterValue(type, value)}
									resetFilter={() => this.resetFilter()}
								/>
							</div>
							<hr/>
							{left}
						</Col>
						<Col span={14} className='scrollable'>
							{right}
						</Col>
					</Row>
				</div>
				<div className='drawer-footer'>
					{actions}
				</div>
			</div>
		);
	}

	private getStatblockSection() {
		return (
			<div className='full-height'>
				<div className='drawer-header'>
					<div className='app-title'>statblock</div>
				</div>
				<div className='drawer-content'>
					<div className='scrollable'>
						<StatBlockModal source={this.state.selectedMonster} />
					</div>
				</div>
				<div className='drawer-footer'/>
			</div>
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
					let templateOptions = null;
					if (this.state.encounter.slots.some(s => s.roles.length > 0)) {
						templateOptions = (
							<button onClick={() => this.fillTemplate()}>choose monsters</button>
						);
					}
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
							<Expander text='build a random encounter'>
								<p>
									add random monsters to this encounter until its (effective) xp value is at least the following value
								</p>
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
							<Expander text='use an encounter template'>
								<p>
									select one of these options to create an encounter based on a predefined template
								</p>
								<RadioGroup
									items={Napoleon.encounterTemplates().map(t => ({ id: t.name, text: t.name }))}
									selectedItemID={null}
									onSelect={id => this.useTemplate(id)}
								/>
							</Expander>
							{templateOptions}
							<hr/>
							<ConfirmButton text='clear encounter' onConfirm={() => this.clearEncounter()} />
						</div>
					);
					const waveSections = this.props.encounter.waves.map(w => {
						return (
							<div key={w.id}>
								<GridPanel
									heading={w.name || 'unnamed wave'}
									content={this.getMonsterCards(w.slots, w.id)}
									columns={3}
								/>
								<Row>
									<Col xs={24} sm={24} md={8} lg={8} xl={8}>
										<button onClick={() => this.openSlot(w.id, null)}>add a monster to this wave</button>
									</Col>
								</Row>
							</div>
						);
					});
					content = (
						<div>
							<GridPanel
								heading='encounter'
								content={this.getMonsterCards(this.props.encounter.slots, null)}
								columns={3}
							/>
							<Row>
								<Col xs={24} sm={24} md={8} lg={8} xl={8}>
									<button onClick={() => this.openSlot(null, null)}>add a monster to the encounter</button>
								</Col>
							</Row>
							{waveSections}
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
						<div className='section subheading'>encounter name</div>
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
					</Col>
					<Col span={18} className='scrollable'>
						{content}
					</Col>
					<Drawer
						visible={this.state.showLibrary}
						width='50%'
						closable={false}
						maskClosable={false}
						onClose={() => this.setShowLibrary(false)}
					>
						{this.getCandidateSection()}
					</Drawer>
					<Drawer
						visible={!this.state.showLibrary && !!this.state.selectedMonster}
						width='50%'
						closable={false}
						onClose={() => this.setSelectedMonster(null)}
					>
						{this.getStatblockSection()}
					</Drawer>
				</Row>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
