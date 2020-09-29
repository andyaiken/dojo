import { CaretLeftOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import React from 'react';
import Showdown from 'showdown';

import { Encounter, EncounterSlot } from '../../models/encounter';
import { Monster } from '../../models/monster';
import { Party } from '../../models/party';

import { MonsterStatblockCard } from '../cards/monster-statblock-card';
import { Textbox } from '../controls/textbox';
import { EncounterOptions } from '../options/encounter-options';
import { GridPanel } from '../panels/grid-panel';
import { Note } from '../panels/note';

const showdown = new Showdown.Converter();
showdown.setOption('tables', true);

interface Props {
	encounter: Encounter;
	parties: Party[];
	edit: (encounter: Encounter) => void;
	clone: (encounter: Encounter, name: string) => void;
	delete: (encounter: Encounter) => void;
	run: (partyID: string, encounterID: string) => void;
	getMonster: (id: string) => Monster | null;
	changeValue: (encounter: Encounter, field: string, value: string) => void;
	goBack: () => void;
}

export class EncounterScreen extends React.Component<Props> {
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
								<MonsterStatblockCard key={s.id} monster={copy}/>
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
						<EncounterOptions
							encounter={this.props.encounter}
							parties={this.props.parties}
							edit={encounter => this.props.edit(encounter)}
							clone={(encounter, name) => this.props.clone(encounter, name)}
							run={(partyID, encounterID) => this.props.run(partyID, encounterID)}
							delete={encounter => this.props.delete(encounter)}
						/>
						<hr />
						<button onClick={() => this.props.goBack()}><CaretLeftOutlined style={{ fontSize: '10px' }} /> back to the list</button>
					</Col>
					<Col span={18} className='scrollable'>
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
