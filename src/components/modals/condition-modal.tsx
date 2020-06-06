import { Col, Row } from 'antd';
import React from 'react';

import Factory from '../../utils/factory';
import Utils from '../../utils/utils';

import { Combatant } from '../../models/combat';
import { Condition, CONDITION_TYPES, ConditionDurationCombatant, ConditionDurationRounds, ConditionDurationSaves } from '../../models/condition';
import { Monster } from '../../models/monster';
import { PC } from '../../models/party';

import Dropdown from '../controls/dropdown';
import NumberSpin from '../controls/number-spin';
import RadioGroup from '../controls/radio-group';
import Selector from '../controls/selector';

interface Props {
	condition: Condition;
	combatants: Combatant[];
	allCombatants: Combatant[];
}

interface State {
	condition: Condition;
}

export default class ConditionModal extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			condition: props.condition
		};
	}

	private setCondition(conditionName: string) {
		if (this.state.condition.name !== conditionName) {
			const c = this.state.condition;
			c.name = conditionName;
			c.level = 1;
			c.text = '';

			this.setState({
				condition: c
			});
		}
	}

	private setDuration(durationType: 'saves' | 'combatant' | 'rounds') {
		let duration = null;

		switch (durationType) {
			case 'saves':
				duration = Factory.createConditionDurationSaves();
				break;
			case 'combatant':
				duration = Factory.createConditionDurationCombatant();
				break;
			case 'rounds':
				duration = Factory.createConditionDurationRounds();
				break;
			default:
				// Do nothing
				break;
		}

		const c = this.state.condition;
		c.duration = duration;
		this.setState({
			condition: c
		});
	}

	private changeValue(object: any, field: string, value: any) {
		object[field] = value;

		this.setState({
			condition: this.state.condition
		});
	}

	private nudgeValue(object: any, field: string, delta: number) {
		let value = object[field] + delta;
		if (field === 'level') {
			value = Math.max(value, 1);
			value = Math.min(value, 6);
		}
		if (field === 'count') {
			value = Math.max(value, 1);
		}
		if (field === 'saveDC') {
			value = Math.max(value, 0);
		}
		object[field] = value;

		this.setState({
			condition: this.state.condition
		});
	}

	public render() {
		try {
			const conditions = CONDITION_TYPES.map(condition => {
				const controls = [];
				const description = [];
				if (condition === this.state.condition.name) {
					if (condition === 'exhaustion') {
						controls.push(
							<NumberSpin
								key='exhaustion-spin'
								value={this.props.condition.level}
								label='exhaustion'
								downEnabled={this.props.condition.level > 1}
								upEnabled={this.props.condition.level < 6}
								onNudgeValue={delta => this.nudgeValue(this.props.condition, 'level', delta)}
							/>
						);
					}
					const text = Utils.conditionText(this.state.condition);
					for (let n = 0; n !== text.length; ++n) {
						description.push(<li key={n} className='section'>{text[n]}</li>);
					}
				}

				const disabled = this.props.combatants
					.filter(combatant => combatant.type === 'monster')
					.some(combatant => {
						const c = combatant as Combatant & Monster;
						if (!c) {
							return false;
						}
						return c.conditionImmunities.indexOf(condition) !== -1;
					});

				return {
					id: condition,
					text: condition,
					details: (
						<div key={condition}>
							{controls}
							<ul>
								{description}
							</ul>
						</div>
					),
					disabled: disabled
				};
			});

			const saveOptions = ['str', 'dex', 'con', 'int', 'wis', 'cha', 'death'].map(c => ({ id: c, text: c }));
			const pointOptions = [
				{
					id: 'start',
					text: 'start of turn'
				},
				{
					id: 'end',
					text: 'end of turn'
				}
			];
			const combatantOptions = this.props.allCombatants
				.filter(combatant => combatant.type !== 'placeholder')
				.map(combatant => {
					const c = combatant as (Combatant & PC) | (Combatant & Monster);
					return {
						id: c.id,
						text: (c.displayName || c.name || 'unnamed monster')
					};
				});
			Utils.sort(combatantOptions, [{ field: 'text', dir: 'asc' }]);

			const durations = [
				{
					id: 'none',
					text: 'until removed (default)',
					details: (
						<div className='section'>
							<div>the condition persists until it is manually removed</div>
						</div>
					)
				},
				{
					id: 'saves',
					text: 'until a successful save',
					details: (
						<div>
							<div className='section'>
								<div className='subheading'>number of saves required</div>
								<NumberSpin
									value={
										(this.props.condition.duration as ConditionDurationSaves)
										? (this.props.condition.duration as ConditionDurationSaves).count
										: ''
									}
									downEnabled={
										(this.props.condition.duration as ConditionDurationSaves)
										? (this.props.condition.duration as ConditionDurationSaves).count > 1
										: false
									}
									onNudgeValue={delta => this.nudgeValue(this.props.condition.duration, 'count', delta)}
								/>
							</div>
							<div className='section'>
								<div className='subheading'>save dc</div>
								<NumberSpin
									value={
										(this.props.condition.duration as ConditionDurationSaves)
										? 'dc ' + (this.props.condition.duration as ConditionDurationSaves).saveDC
										: ''
									}
									downEnabled={
										(this.props.condition.duration as ConditionDurationSaves)
										? (this.props.condition.duration as ConditionDurationSaves).saveDC > 0
										: false
									}
									onNudgeValue={delta => this.nudgeValue(this.props.condition.duration, 'saveDC', delta)}
								/>
							</div>
							<div className='section'>
								<div className='subheading'>type of save</div>
								<Selector
									options={saveOptions}
									selectedID={
										(this.props.condition.duration as ConditionDurationSaves)
										? (this.props.condition.duration as ConditionDurationSaves).saveType
										: null
									}
									onSelect={optionID => this.changeValue(this.props.condition.duration, 'saveType', optionID)}
								/>
							</div>
							<div className='section'>
								<div className='subheading'>make the save at the start or end of the turn</div>
								<Selector
									options={pointOptions}
									selectedID={
										(this.props.condition.duration as ConditionDurationSaves)
										? (this.props.condition.duration as ConditionDurationSaves).point
										: null
									}
									onSelect={optionID => this.changeValue(this.props.condition.duration, 'point', optionID)}
								/>
							</div>
						</div>
					)
				},
				{
					id: 'combatant',
					text: 'until someone\'s next turn',
					details: (
						<div>
							<div className='section'>
								<div className='subheading'>start or end of the turn</div>
								<Selector
									options={pointOptions}
									selectedID={
										(this.props.condition.duration as ConditionDurationCombatant)
										? (this.props.condition.duration as ConditionDurationCombatant).point
										: null
									}
									onSelect={optionID => this.changeValue(this.props.condition.duration, 'point', optionID)}
								/>
							</div>
							<div className='section'>
								<div className='subheading'>combatant</div>
								<Dropdown
									options={combatantOptions}
									selectedID={
										(this.props.condition.duration as ConditionDurationCombatant)
										? (this.props.condition.duration as ConditionDurationCombatant).combatantID || undefined
										: undefined
									}
									onSelect={optionID => this.changeValue(this.props.condition.duration, 'combatantID', optionID)}
								/>
							</div>
						</div>
					)
				},
				{
					id: 'rounds',
					text: 'for a number of rounds',
					details: (
						<div>
							<div className='section'>
								<div className='subheading'>number of rounds</div>
								<NumberSpin
									value={
										(this.props.condition.duration as ConditionDurationRounds)
										? (this.props.condition.duration as ConditionDurationRounds).count
										: ''
									}
									downEnabled={
										(this.props.condition.duration as ConditionDurationRounds)
										? (this.props.condition.duration as ConditionDurationRounds).count > 1
										: false
									}
									onNudgeValue={delta => this.nudgeValue(this.props.condition.duration, 'count', delta)}
								/>
							</div>
						</div>
					)
				}
			];

			return (
				<Row className='full-height'>
					<Col span={12} className='scrollable'>
						<div className='heading'>condition</div>
						<RadioGroup
							items={conditions}
							selectedItemID={this.state.condition.name}
							onSelect={itemID => this.setCondition(itemID)}
						/>
					</Col>
					<Col span={12} className='scrollable'>
						<div className='heading'>duration</div>
						<RadioGroup
							items={durations}
							selectedItemID={this.state.condition.duration ? this.state.condition.duration.type : 'none'}
							onSelect={itemID => this.setDuration(itemID as 'saves' | 'combatant' | 'rounds')}
						/>
					</Col>
				</Row>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
