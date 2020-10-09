import { CaretLeftOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import React from 'react';
import Showdown from 'showdown';

import { Encounter, EncounterSlot, EncounterWave } from '../../models/encounter';
import { Monster } from '../../models/monster';
import { Party } from '../../models/party';

import { EncounterSlotCard } from '../cards/encounter-slot-card';
import { ConfirmButton } from '../controls/confirm-button';
import { Selector } from '../controls/selector';
import { Textbox } from '../controls/textbox';
import { EncounterOptions } from '../options/encounter-options';
import { GridPanel } from '../panels/grid-panel';
import { Note } from '../panels/note';

const showdown = new Showdown.Converter();
showdown.setOption('tables', true);

interface Props {
	encounter: Encounter;
	parties: Party[];
	cloneEncounter: (encounter: Encounter, name: string) => void;
	deleteEncounter: (encounter: Encounter) => void;
	startEncounter: (partyID: string, encounterID: string) => void;
	populateEncounter: (encounter: Encounter) => void;
	addWave: (encounter: Encounter) => void;
	deleteWave: (encounter: Encounter, wave: EncounterWave) => void;
	moveEncounterSlot: (encounter: Encounter, slot: EncounterSlot, fromWave: EncounterWave | null, toWave: EncounterWave | null) => void;
	deleteEncounterSlot: (encounter: Encounter, slot: EncounterSlot, wave: EncounterWave | null) => void;
	chooseMonster: (encounter: Encounter, slot: EncounterSlot | null, wave: EncounterWave | null) => void;
	showStatblock: (monster: Monster) => void;
	getMonster: (id: string) => Monster | null;
	changeValue: (source: any, field: string, value: any) => void;
	nudgeValue: (source: any, field: string, delta: number) => void;
	goBack: () => void;
}

interface State {
	view: string;
}

export class EncounterScreen extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			view: 'monsters'
		};
	}

	private setView(view: string) {
		this.setState({
			view: view
		});
	}

	private getMonsterCards(wave: EncounterWave | null) {
		const cards = [];

		const slots = wave ? wave.slots : this.props.encounter.slots;
		slots.forEach(slot => {
			cards.push(
				<EncounterSlotCard
					slot={slot}
					monster={this.props.getMonster(slot.monsterID)}
					encounter={this.props.encounter}
					changeValue={(source, type, value) => this.props.changeValue(source, type, value)}
					nudgeValue={(source, type, delta) => this.props.nudgeValue(source, type, delta)}
					chooseMonster={s => this.props.chooseMonster(this.props.encounter, s, wave)}
					deleteEncounterSlot={s => this.props.deleteEncounterSlot(this.props.encounter, s, wave)}
					moveToWave={(s, id) => this.props.moveEncounterSlot(this.props.encounter, s, wave, id)}
					showStatblock={monster => this.props.showStatblock(monster)}
				/>
			);
		});

		if (slots.length === 0) {
			if (wave) {
				cards.push(
					<Note>there are no monsters in this wave</Note>
				);
			} else {
				cards.push(
					<Note>
						<p>there are no monsters in this encounter</p>
						<p>click the button below to add monsters</p>
					</Note>
				);
			}
		}

		return cards;
	}

	public render() {
		try {
			const waves = this.props.encounter.waves.map(wave => (
				<div key={wave.id} className='group-panel'>
					<Textbox
						text={wave.name}
						placeholder='wave name'
						onChange={value => this.props.changeValue(wave, 'name', value)}
					/>
					<ConfirmButton text='delete wave' onConfirm={() => this.props.deleteWave(this.props.encounter, wave)} />
				</div>
			));

			let templateOptions = null;
			if (this.props.encounter.slots.some(s => (s.roles.length > 0) && (s.monsterID === ''))) {
				templateOptions = (
					<div>
						<hr />
						<button onClick={() => this.props.populateEncounter(this.props.encounter)}>choose monsters</button>
					</div>
				);
			}

			const waveSections = this.props.encounter.waves.map(wave => {
				return (
					<div key={wave.id}>
						<GridPanel
							heading={wave.name || 'unnamed wave'}
							content={this.getMonsterCards(wave)}
							columns={3}
						/>
						<Row>
							<Col span={8}>
								<button onClick={() => this.props.chooseMonster(this.props.encounter, null, wave)}>add monsters to this wave</button>
							</Col>
						</Row>
					</div>
				);
			});

			let content = null;
			switch (this.state.view) {
				case 'monsters':
					content = (
						<div>
							<GridPanel
								heading='encounter'
								content={this.getMonsterCards(null)}
								columns={3}
							/>
							<Row>
								<Col span={8}>
									<button onClick={() => this.props.chooseMonster(this.props.encounter, null, null)}>add monsters to the encounter</button>
								</Col>
							</Row>
							{waveSections}
						</div>
					);
					break;
				case 'notes':
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
										onChange={text => this.props.changeValue(this.props.encounter, 'notes', text)}
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
								onChange={value => this.props.changeValue(this.props.encounter, 'name', value)}
							/>
						</div>
						<hr />
						<Selector
							options={['monsters', 'notes'].map(o => ({ id: o, text: o }))}
							selectedID={this.state.view}
							onSelect={view => this.setView(view)}
						/>
						<hr />
						<div className='section'>
							<div className='subheading'>waves</div>
							{waves}
							<button onClick={() => this.props.addWave(this.props.encounter)}>add a new wave</button>
						</div>
						<hr />
						<EncounterOptions
							encounter={this.props.encounter}
							parties={this.props.parties}
							cloneEncounter={(encounter, name) => this.props.cloneEncounter(encounter, name)}
							startEncounter={(partyID, encounterID) => this.props.startEncounter(partyID, encounterID)}
							deleteEncounter={encounter => this.props.deleteEncounter(encounter)}
							getMonster={id => this.props.getMonster(id)}
						/>
						{templateOptions}
						<hr />
						<button onClick={() => this.props.goBack()}><CaretLeftOutlined style={{ fontSize: '10px' }} /> back to the list</button>
					</Col>
					<Col span={18} className='scrollable'>
						{content}
					</Col>
				</Row>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
