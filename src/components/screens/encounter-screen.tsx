import { CaretLeftOutlined, DeleteOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import React from 'react';

import { Napoleon } from '../../utils/napoleon';
import { Utils } from '../../utils/utils';

import { Adventure } from '../../models/adventure';
import { Encounter, EncounterSlot, EncounterWave } from '../../models/encounter';
import { Monster } from '../../models/monster';
import { Party } from '../../models/party';

import { RenderError } from '../error';
import { EncounterSlotCard } from '../cards/encounter-slot-card';
import { ConfirmButton } from '../controls/confirm-button';
import { Dropdown } from '../controls/dropdown';
import { Expander } from '../controls/expander';
import { Group } from '../controls/group';
import { Note } from '../controls/note';
import { Textbox } from '../controls/textbox';
import { EncounterOptions } from '../options/encounter-options';
import { DifficultyChartPanel } from '../panels/difficulty-chart-panel';
import { GridPanel } from '../panels/grid-panel';
import { MarkdownEditor } from '../panels/markdown-editor';

interface Props {
	encounter: Encounter;
	parties: Party[];
	adventures: Adventure[];
	cloneEncounter: (encounter: Encounter, name: string) => void;
	deleteEncounter: (encounter: Encounter) => void;
	startEncounter: (partyID: string, encounterID: string) => void;
	populateEncounter: (encounter: Encounter) => void;
	addWave: (encounter: Encounter) => void;
	deleteWave: (encounter: Encounter, wave: EncounterWave) => void;
	moveEncounterSlot: (encounter: Encounter, slot: EncounterSlot, count: number, fromWave: EncounterWave | null, toWave: EncounterWave | null) => void;
	deleteEncounterSlot: (encounter: Encounter, slot: EncounterSlot, wave: EncounterWave | null) => void;
	chooseMonster: (encounter: Encounter, slot: EncounterSlot | null, wave: EncounterWave | null) => void;
	adjustSlot: (encounter: Encounter, slot: EncounterSlot) => void;
	chooseRandomTheme: (encounter: Encounter, slot: EncounterSlot) => void;
	splitTheme: (parent: Encounter | EncounterWave, slot: EncounterSlot) => void;
	removeAdjustments: (encounter: Encounter, slot: EncounterSlot) => void;
	showStatblock: (monster: Monster) => void;
	showMinisChecklist: (encounter: Encounter) => void;
	getMonster: (id: string) => Monster | null;
	changeValue: (source: any, field: string, value: any) => void;
	nudgeValue: (source: any, field: string, delta: number) => void;
	goBack: () => void;
}

export class EncounterScreen extends React.Component<Props> {
	private getMonsterCards(wave: EncounterWave | null) {
		const cards = [];

		const slots = wave ? wave.slots : this.props.encounter.slots;
		slots.forEach(slot => {
			cards.push(
				<EncounterSlotCard
					slot={slot}
					monster={this.props.getMonster(slot.monsterID)}
					theme={this.props.getMonster(slot.monsterThemeID)}
					encounter={this.props.encounter}
					changeValue={(source, type, value) => this.props.changeValue(source, type, value)}
					nudgeValue={(source, type, delta) => this.props.nudgeValue(source, type, delta)}
					chooseMonster={s => this.props.chooseMonster(this.props.encounter, s, wave)}
					adjustSlot={s => this.props.adjustSlot(this.props.encounter, s)}
					chooseRandomTheme={s => this.props.chooseRandomTheme(this.props.encounter, s)}
					splitTheme={s => this.props.splitTheme(wave ? wave : this.props.encounter, s)}
					removeAdjustments={s => this.props.removeAdjustments(this.props.encounter, s)}
					deleteEncounterSlot={s => this.props.deleteEncounterSlot(this.props.encounter, s, wave)}
					moveToWave={(s, count, toWave) => this.props.moveEncounterSlot(this.props.encounter, s, count, wave, toWave)}
					showStatblock={monster => this.props.showStatblock(monster)}
				/>
			);
		});

		if (slots.length === 0) {
			cards.push(
				<Note>
					<div className='section'>
						there are no monsters in this {wave ? 'wave' : 'encounter'}
					</div>
				</Note>
			);
		}

		return cards;
	}

	public render() {
		try {
			const waves = this.props.encounter.waves.map(wave => (
				<Group key={wave.id}>
					<div className='content-then-icons'>
						<div className='content'>
							<Textbox
								text={wave.name}
								placeholder='wave name'
								onChange={value => this.props.changeValue(wave, 'name', value)}
							/>
						</div>
						<div className='icons'>
							<ConfirmButton onConfirm={() => this.props.deleteWave(this.props.encounter, wave)}>
								<DeleteOutlined title='delete wave' />
							</ConfirmButton>
						</div>
					</div>
				</Group>
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
					<GridPanel
						key={wave.id}
						heading={wave.name || 'unnamed wave'}
						content={this.getMonsterCards(wave)}
					/>
				);
			});

			let add = null;
			if (this.props.encounter.waves.length === 0) {
				add = (
					<button onClick={() => this.props.chooseMonster(this.props.encounter, null, null)}>add monsters</button>
				);
			} else {
				const waveOptions = [{
					id: Utils.guid(),
					text: 'encounter'
				}];
				this.props.encounter.waves.forEach(wave => {
					waveOptions.push({
						id: wave.id,
						text: wave.name || 'unnamed wave'
					});
				});
				add = (
					<Dropdown
						placeholder='add monsters to...'
						options={waveOptions}
						onSelect={id => {
							const wave = this.props.encounter.waves.find(w => w.id === id) ?? null;
							this.props.chooseMonster(this.props.encounter, null, wave);
						}}
					/>
				);
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
						{add}
						<Expander text='waves'>
							<Note>
								<div className='section'>
									if your encounter is large or occurs in stages, you can split it into waves
								</div>
							</Note>
							<div>{waves}</div>
							<button onClick={() => this.props.addWave(this.props.encounter)}>add a new wave</button>
						</Expander>
						<button onClick={() => this.props.showMinisChecklist(this.props.encounter)}>miniatures checklist</button>
						<EncounterOptions
							encounter={this.props.encounter}
							parties={this.props.parties}
							adventures={this.props.adventures}
							cloneEncounter={(encounter, name) => this.props.cloneEncounter(encounter, name)}
							startEncounter={(partyID, encounterID) => this.props.startEncounter(partyID, encounterID)}
							deleteEncounter={encounter => this.props.deleteEncounter(encounter)}
						/>
						{templateOptions}
						<hr />
						<button onClick={() => this.props.goBack()}><CaretLeftOutlined style={{ fontSize: '10px' }} /> back to the list</button>
					</Col>
					<Col span={12} className='scrollable'>
						<GridPanel
							heading='encounter'
							content={this.getMonsterCards(null)}
						/>
						{waveSections}
					</Col>
					<Col span={6} className='scrollable'>
						<GridPanel
							heading='difficulty'
							content={[
								<DifficultyChartPanel
									key='diff'
									encounter={this.props.encounter}
									parties={this.props.parties}
									getMonster={id => this.props.getMonster(id)}
								/>
							]}
							columns={1}
						/>
						<GridPanel
							heading='notes'
							content={[
								<MarkdownEditor
									key='notes'
									text={this.props.encounter.notes}
									onChange={text => this.props.changeValue(this.props.encounter, 'notes', text)}
								/>,
								<button
									key='vc'
									onClick={() => {
										const vc = '**victory condition:** ' + Napoleon.getVictoryCondition(this.props.encounter, id => this.props.getMonster(id));
										this.props.changeValue(this.props.encounter, 'notes', vc);
									}}
								>
									set a random victory condition
								</button>
							]}
							columns={1}
						/>
					</Col>
				</Row>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='EncounterScreen' error={e} />;
		}
	}
}
