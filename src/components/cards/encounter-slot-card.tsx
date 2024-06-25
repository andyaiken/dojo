import { Slider, Tag } from 'antd';
import React from 'react';

import { Frankenstein } from '../../utils/frankenstein';
import { Gygax } from '../../utils/gygax';
import { Utils } from '../../utils/utils';

import { Encounter, EncounterSlot, EncounterWave } from '../../models/encounter';
import { Monster } from '../../models/monster';

import { RenderError } from '../error';
import { ConfirmButton } from '../controls/confirm-button';
import { Dropdown } from '../controls/dropdown';
import { Expander } from '../controls/expander';
import { Note } from '../controls/note';
import { NumberSpin } from '../controls/number-spin';
import { Selector } from '../controls/selector';
import { PortraitPanel } from '../panels/portrait-panel';

interface Props {
	slot: EncounterSlot;
	monster: Monster | null;
	theme: Monster | null;
	encounter: Encounter;
	changeValue: (source: any, field: string, value: any) => void;
	nudgeValue: (source: any, field: string, delta: number) => void;
	chooseMonster: (slot: EncounterSlot) => void;
	adjustSlot: (slot: EncounterSlot) => void;
	chooseRandomTheme: (slot: EncounterSlot) => void;
	splitTheme: (slot: EncounterSlot) => void;
	removeAdjustments: (slot: EncounterSlot) => void;
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
				<div>{count}</div>
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

	private getModifyControl() {
		return (
			<Expander text={this.props.slot.count === 1 ? 'modify this monster' : 'modify these monsters'}>
				<button onClick={() => this.props.adjustSlot(this.props.slot)}>
					modify monster
				</button>
				<hr/>
				<button onClick={() => this.props.chooseRandomTheme(this.props.slot)}>
					apply a random theme
				</button>
				<button className={(this.props.slot.monsterThemeID === '') && (this.props.slot.count > 1) ? '' : 'disabled'} onClick={() => this.props.splitTheme(this.props.slot)}>
					split into themed versions
				</button>
				<hr/>
				<button className={(this.props.slot.monsterThemeID !== '') || (this.props.slot.deltaCR !== 0) ? '' : 'disabled'} onClick={() => this.props.removeAdjustments(this.props.slot)}>
					remove adjustments
				</button>
			</Expander>
		);
	}

	public render() {
		try {
			let monster = this.props.monster;
			if (monster) {
				if (this.props.theme) {
					monster = Frankenstein.applyTheme(monster, this.props.theme);
				}
				if (this.props.slot.deltaCR) {
					monster = Frankenstein.adjustCR(monster, this.props.slot.deltaCR)
				}
			}

			let name = 'monster';
			if (monster) {
				name = monster.name || 'unnamed monster';
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
						options={Utils.arrayToItems(['foe', 'neutral', 'ally'])}
						selectedID={this.props.slot.faction}
						onSelect={id => this.props.changeValue(this.props.slot, 'faction', id)}
					/>
				</div>
			);

			if (!monster) {
				return (
					<div key={this.props.slot.id} className={'card ' + this.props.slot.faction}>
						<div className='heading'>
							<div className='title'>
								{name}
							</div>
						</div>
						<div className='card-content'>
							<Note>
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
								<ConfirmButton onConfirm={() => this.props.deleteEncounterSlot(this.props.slot)}>remove from encounter</ConfirmButton>
							</div>
						</div>
					</div>
				);
			}

			const tags = [];
			let sizeAndType = (monster.size + ' ' + monster.category).toLowerCase();
			if (monster.tag) {
				sizeAndType += ' (' + monster.tag.toLowerCase() + ')';
			}
			tags.push(<Tag key='tag-main'>{sizeAndType}</Tag>);
			if (monster.alignment) {
				tags.push(<Tag key='tag-align'>{monster.alignment.toLowerCase()}</Tag>);
			}
			tags.push(<Tag key='tag-cr'>cr {Gygax.challenge(monster.challenge)}</Tag>);

			return (
				<div key={this.props.slot.id} className={'card ' + this.props.slot.faction}>
					<div className='heading'>
						<div className='title'>
							{name}
						</div>
					</div>
					<div className='card-content'>
						<PortraitPanel source={monster} />
						<div className='section centered'>
							{tags}
						</div>
						<hr/>
						{controls}
						<hr/>
						<button onClick={() => this.props.showStatblock(monster as Monster)}>statblock</button>
						<button onClick={() => this.props.chooseMonster(this.props.slot)}>choose a different monster</button>
						{this.getMoveControl()}
						{this.getModifyControl()}
						<ConfirmButton onConfirm={() => this.props.deleteEncounterSlot(this.props.slot)}>remove from encounter</ConfirmButton>
					</div>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='EncounterSlotCard' error={e} />;
		}
	}
}
