import { CaretLeftOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import React from 'react';
import Showdown from 'showdown';

import { Encounter, EncounterSlot } from '../../models/encounter';
import { Monster } from '../../models/monster';
import { Party } from '../../models/party';

import MonsterCard from '../cards/monster-card';
import ConfirmButton from '../controls/confirm-button';
import Dropdown from '../controls/dropdown';
import Textbox from '../controls/textbox';
import GridPanel from '../panels/grid-panel';
import Note from '../panels/note';

const showdown = new Showdown.Converter();
showdown.setOption('tables', true);

interface Props {
	encounter: Encounter;
	parties: Party[];
	edit: (encounter: Encounter) => void;
	delete: (encounter: Encounter) => void;
	run: (encounter: Encounter, partyID: string) => void;
	getMonster: (id: string) => Monster | null;
	changeValue: (encounter: Encounter, field: string, value: string) => void;
	goBack: () => void;
}

export default class EncounterScreen extends React.Component<Props> {
	private getSlots(id: string, name: string, slots: EncounterSlot[]) {
		const filledSlots = slots.filter(s => s.monsterName !== '');
		if (filledSlots.length === 0) {
			return <Note>no monsters</Note>;
		}

		return (
			<GridPanel
				key={id}
				heading={name}
				columns={2}
				content={
					filledSlots.map(s => {
						const monster = this.props.getMonster(s.monsterID);
						if (monster) {
							const copy: Monster = JSON.parse(JSON.stringify(monster));
							if (s.count > 1) {
								copy.name += ' x' + s.count;
							}
							if (s.faction !== 'foe') {
								copy.name += ' (' + s.faction + ')';
							}
							return (
								<MonsterCard key={s.id} monster={copy}/>
							);
						}

						return null;
					})
				}
			/>
		);
	}

	public render() {
		try {
			return (
				<Row className='full-height'>
					<Col xs={12} sm={12} md={8} lg={6} xl={4} className='scrollable sidebar sidebar-left'>
						<EncounterInfo
							encounter={this.props.encounter}
							parties={this.props.parties}
							edit={enc => this.props.edit(enc)}
							delete={enc => this.props.delete(enc)}
							run={(enc, partyID) => this.props.run(enc, partyID)}
							changeValue={(encounter, field, value) => this.props.changeValue(encounter, field, value)}
							goBack={() => this.props.goBack()}
						/>
					</Col>
					<Col xs={12} sm={12} md={16} lg={18} xl={20} className='scrollable'>
						<div dangerouslySetInnerHTML={{ __html: showdown.makeHtml(this.props.encounter.notes) }} />
						{this.getSlots(this.props.encounter.id, this.props.encounter.name ?? 'unnamed encounter', this.props.encounter.slots)}
						{this.props.encounter.waves.map(wave => this.getSlots(wave.id, wave.name ?? 'wave', wave.slots))}
					</Col>
				</Row>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}

interface EncounterInfoProps {
	encounter: Encounter;
	parties: Party[];
	edit: (encounter: Encounter) => void;
	delete: (encounter: Encounter) => void;
	run: (encounter: Encounter, partyID: string) => void;
	changeValue: (encounter: Encounter, field: string, value: string) => void;
	goBack: () => void;
}

class EncounterInfo extends React.Component<EncounterInfoProps> {
	public render() {
		try {
			let run = null;
			if (this.props.parties.length > 0) {
				run = (
					<Dropdown
						options={this.props.parties.map(p => ({ id: p.id, text: p.name }))}
						placeholder='start combat with...'
						onSelect={partyID => this.props.run(this.props.encounter, partyID)}
					/>
				);
			}

			return (
				<div>
					<div className='section'>
						<div className='subheading'>encounter name</div>
						<Textbox
							text={this.props.encounter.name}
							placeholder='encounter name'
							onChange={value => this.props.changeValue(this.props.encounter, 'name', value)}
						/>
					</div>
					<hr />
					<button onClick={() => this.props.edit(this.props.encounter)}>edit encounter</button>
					{run}
					<ConfirmButton text='delete encounter' onConfirm={() => this.props.delete(this.props.encounter)} />
					<hr />
					<div className='section'>
						<button onClick={() => this.props.goBack()}><CaretLeftOutlined style={{ fontSize: '10px' }} /> back to the list</button>
					</div>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
