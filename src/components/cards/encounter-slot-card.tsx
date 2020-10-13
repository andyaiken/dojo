import { Tag } from 'antd';
import React from 'react';

import { Gygax } from '../../utils/gygax';

import { Encounter, EncounterSlot, EncounterWave } from '../../models/encounter';
import { Monster } from '../../models/monster';

import { ConfirmButton } from '../controls/confirm-button';
import { Dropdown } from '../controls/dropdown';
import { NumberSpin } from '../controls/number-spin';
import { Selector } from '../controls/selector';
import { Note } from '../panels/note';
import { PortraitPanel } from '../panels/portrait-panel';

interface Props {
	slot: EncounterSlot;
	monster: Monster | null;
	encounter: Encounter;
	changeValue: (source: any, field: string, value: any) => void;
	nudgeValue: (source: any, field: string, delta: number) => void;
	chooseMonster: (slot: EncounterSlot) => void;
	deleteEncounterSlot: (slot: EncounterSlot) => void;
	moveToWave: (slot: EncounterSlot, wave: EncounterWave | null) => void;
	showStatblock: (monster: Monster) => void;
}

export class EncounterSlotCard extends React.Component<Props> {
	public render() {
		try {
			let name = 'monster';
			let stats = null;
			const options = [];

			if (this.props.monster) {
				name = this.props.monster.name || 'unnamed monster';

				const tags = [];
				let sizeAndType = (this.props.monster.size + ' ' + this.props.monster.category).toLowerCase();
				if (this.props.monster.tag) {
					sizeAndType += ' (' + this.props.monster.tag.toLowerCase() + ')';
				}
				tags.push(<Tag key='tag-main'>{sizeAndType}</Tag>);
				if (this.props.monster.alignment) {
					tags.push(<Tag key='tag-align'>{this.props.monster.alignment.toLowerCase()}</Tag>);
				}
				tags.push(<Tag key='tag-cr'>cr {Gygax.challenge(this.props.monster.challenge)}</Tag>);

				stats = (
					<div className='stats'>
						<PortraitPanel source={this.props.monster} />
						<div className='section centered'>
							{tags}
						</div>
					</div>
				);

				options.push(
					<button key='view' onClick={() => this.props.showStatblock(this.props.monster as Monster)}>statblock</button>
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
					<button key='select' onClick={() => this.props.chooseMonster(this.props.slot)}>choose a monster</button>
				);
			}

			if (this.props.encounter.waves.length > 0) {
				const waves = [];
				if (!this.props.encounter.slots.includes(this.props.slot)) {
					waves.push({ id: '', text: 'main encounter' });
				}
				this.props.encounter.waves.forEach(wave => {
					if (!wave.slots.includes(this.props.slot)) {
						waves.push({ id: wave.id, text: wave.name });
					}
				});
				options.push(
					<Dropdown
						key='move'
						placeholder='move to...'
						options={waves}
						onSelect={id => {
							const wave = this.props.encounter.waves.find(w => w.id === id) || null;
							this.props.moveToWave(this.props.slot, wave);
						}}
					/>
				);
			}

			return (
				<div className={'card ' + this.props.slot.faction}>
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
						<div className='section'>
							{options}
							<Selector
								options={['foe', 'neutral', 'ally'].map(o => ({ id: o, text: o }))}
								selectedID={this.props.slot.faction}
								onSelect={id => this.props.changeValue(this.props.slot, 'faction', id)}
							/>
							<ConfirmButton text='remove from encounter' onConfirm={() => this.props.deleteEncounterSlot(this.props.slot)}/>
						</div>
					</div>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
