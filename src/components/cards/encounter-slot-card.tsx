import { Tag } from 'antd';
import React from 'react';

import Utils from '../../utils/utils';

import { Encounter, EncounterSlot } from '../../models/encounter';
import { Monster, MonsterGroup } from '../../models/monster';

import Dropdown from '../controls/dropdown';
import NumberSpin from '../controls/number-spin';
import Note from '../panels/note';
import PortraitPanel from '../panels/portrait-panel';

interface Props {
	slot: EncounterSlot;
	monster: Monster | null;
	encounter: Encounter;
	library: MonsterGroup[];
	nudgeValue: (source: any, field: string, delta: number) => void;
	select: (slot: EncounterSlot) => void;
	remove: (slot: EncounterSlot) => void;
	moveToWave: (slot: EncounterSlot, current: EncounterSlot[], waveID: string) => void;
	viewMonster: (monster: Monster) => void;
}

export default class EncounterSlotCard extends React.Component<Props> {
	public render() {
		try {
			let name = 'monster';
			let stats = null;
			const options = [];

			if (this.props.monster) {
				name = this.props.monster.name;

				const tags = [];
				let sizeAndType = (this.props.monster.size + ' ' + this.props.monster.category).toLowerCase();
				if (this.props.monster.tag) {
					sizeAndType += ' (' + this.props.monster.tag.toLowerCase() + ')';
				}
				tags.push(<Tag key='tag-main'>{sizeAndType}</Tag>);
				if (this.props.monster.alignment) {
					tags.push(<Tag key='tag-align'>{this.props.monster.alignment.toLowerCase()}</Tag>);
				}
				tags.push(<Tag key='tag-cr'>cr {Utils.challenge(this.props.monster.challenge)}</Tag>);

				stats = (
					<div className='stats'>
						<PortraitPanel source={this.props.monster} />
						<div className='section centered'>
							{tags}
						</div>
					</div>
				);

				options.push(
					<button key='view' onClick={() => this.props.viewMonster(this.props.monster as Monster)}>statblock</button>
				);
			} else {
				stats = (
					<Note white={true}>
						<div className='section'>
							this empty slot has been added because you are creating an encounter from a template
						</div>
						<div className='section'>
							when you press <b>choose a monster</b> you will be able to select a monster of this type:
						</div>
						<div className='section centered'>
							<b>{this.props.slot.roles.join(', ')}</b>
						</div>
					</Note>
				);

				options.push(
					<button key='select' onClick={() => this.props.select(this.props.slot)}>choose a monster</button>
				);
			}

			if (this.props.encounter.waves.length > 0) {
				let current = this.props.encounter.slots;
				const waves = [];
				if (!this.props.encounter.slots.includes(this.props.slot)) {
					waves.push({ id: '', text: 'main encounter' });
				}
				this.props.encounter.waves.forEach(wave => {
					if (wave.slots.includes(this.props.slot)) {
						current = wave.slots;
					} else {
						waves.push({ id: wave.id, text: wave.name });
					}
				});
				options.push(
					<Dropdown
						key='move'
						placeholder='move to...'
						options={waves}
						onSelect={id => this.props.moveToWave(this.props.slot, current, id)}
					/>
				);
			}

			options.push(
				<button key='remove' onClick={() => this.props.remove(this.props.slot)}>remove</button>
			);

			return (
				<div className='card monster'>
					<div className='heading'>
						<div className='title'>
							{name}
						</div>
					</div>
					<div className='card-content'>
						{stats}
						<hr/>
						<NumberSpin
							value={this.props.slot.count}
							label='count'
							downEnabled={this.props.slot.count > 1}
							onNudgeValue={delta => this.props.nudgeValue(this.props.slot, 'count', delta)}
						/>
						<hr/>
						<div className='section'>{options}</div>
					</div>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
