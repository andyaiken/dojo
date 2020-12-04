import { Slider, Tag } from 'antd';
import React from 'react';

import { Gygax } from '../../utils/gygax';

import { Encounter, EncounterSlot, EncounterWave } from '../../models/encounter';
import { Monster } from '../../models/monster';

import { ConfirmButton } from '../controls/confirm-button';
import { Dropdown } from '../controls/dropdown';
import { Expander } from '../controls/expander';
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
	moveToWave: (slot: EncounterSlot, count: number, wave: EncounterWave | null) => void;
	showStatblock: (monster: Monster) => void;
}

interface State {
	count: number;
}

export class EncounterSlotCard extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			count: props.slot.count
		};
	}

	private setCount(count: number) {
		this.setState({
			count: count
		});
	}

	private getMoveControl() {
		if (this.props.encounter.waves.length === 0) {
			return null;
		}

		let count = null;
		if (this.props.slot.count > 1) {
			count = (
				<Slider
					min={1}
					max={this.props.slot.count}
					value={this.state.count}
					tooltipVisible={false}
					onChange={(value: any) => this.setCount(value)}
				/>
			);
		}

		const waves = [];
		if (!this.props.encounter.slots.includes(this.props.slot)) {
			waves.push({ id: '', text: 'main encounter' });
		}
		this.props.encounter.waves.forEach(wave => {
			if (!wave.slots.includes(this.props.slot)) {
				waves.push({ id: wave.id, text: wave.name });
			}
		});

		let text = 'move to...';
		if (this.props.slot.count > 1) {
			text = (this.props.slot.count === this.state.count) ? 'move all to...' : 'move ' + this.state.count + ' to...';
		}

		return (
			<Expander text='move monster'>
				{count}
				<Dropdown
					options={waves}
					placeholder={text}
					onSelect={id => {
						const wave = this.props.encounter.waves.find(w => w.id === id) || null;
						this.props.moveToWave(this.props.slot, this.state.count, wave);
					}}
				/>
			</Expander>
		);
	}

	public render() {
		try {
			let name = 'monster';
			if (this.props.monster) {
				name = this.props.monster.name || 'unnamed monster';
			}
			if (this.props.slot.count > 1) {
				name += ' (x' + this.props.slot.count + ')';
			}

			const controls = (
				<div>
					<NumberSpin
						value={this.props.slot.count}
						label='number'
						downEnabled={this.props.slot.count > 1}
						onNudgeValue={delta => this.props.nudgeValue(this.props.slot, 'count', delta)}
					/>
					<Selector
						options={['foe', 'neutral', 'ally'].map(o => ({ id: o, text: o }))}
						selectedID={this.props.slot.faction}
						onSelect={id => this.props.changeValue(this.props.slot, 'faction', id)}
					/>
				</div>
			);

			if (!this.props.monster) {
				return (
					<div className={'card ' + this.props.slot.faction}>
						<div className='heading'>
							<div className='title'>
								{name}
							</div>
						</div>
						<div className='card-content'>
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
							<hr/>
							{controls}
							<hr/>
							<div className='section'>
								<button onClick={() => this.props.chooseMonster(this.props.slot)}>choose a monster</button>
								{this.getMoveControl()}
								<ConfirmButton text='remove from encounter' onConfirm={() => this.props.deleteEncounterSlot(this.props.slot)}/>
							</div>
						</div>
					</div>
				);
			}

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

			return (
				<div className={'card ' + this.props.slot.faction}>
					<div className='heading'>
						<div className='title'>
							{name}
						</div>
					</div>
					<div className='card-content'>
						<div className='stats'>
							<PortraitPanel source={this.props.monster} />
							<div className='section centered'>
								{tags}
							</div>
						</div>
						<hr/>
						{controls}
						<hr/>
						<div className='section'>
							<button onClick={() => this.props.showStatblock(this.props.monster as Monster)}>statblock</button>
							{this.getMoveControl()}
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
