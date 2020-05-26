import { CloseOutlined, EditOutlined } from '@ant-design/icons';
import React from 'react';

import Factory from '../../utils/factory';
import Utils from '../../utils/utils';

import { Combatant } from '../../models/combat';
import { Condition, CONDITION_TYPES } from '../../models/condition';

import Dropdown from '../controls/dropdown';
import NumberSpin from '../controls/number-spin';

interface Props {
	combatants: Combatant[];
	allCombatants: Combatant[];
	inline: boolean;
	nudgeConditionValue: (condition: Condition, field: string, delta: number) => void;
	addCondition: () => void;
	quickAddCondition: (combatants: Combatant[], condition: Condition) => void;
	editCondition: (combatant: Combatant, condition: Condition) => void;
	removeCondition: (combatant: Combatant, condition: Condition) => void;
}

export default class ConditionsPanel extends React.Component<Props> {
	public render() {
		try {
			const conditions: JSX.Element[] = [];
			this.props.combatants.forEach(combatant => {
				combatant.conditions.forEach(condition => {
					conditions.push(
						<ConditionPanel
							key={condition.id}
							condition={condition}
							combatant={combatant}
							combatants={this.props.allCombatants}
							showCombatantName={this.props.combatants.length > 1}
							inline={this.props.inline}
							nudgeConditionValue={(c, type, delta) => this.props.nudgeConditionValue(c, type, delta)}
							editCondition={c => this.props.editCondition(combatant, c)}
							removeCondition={c => this.props.removeCondition(combatant, c)}
						/>
					);
				});
			});

			let add = null;
			if (this.props.inline) {
				const options = CONDITION_TYPES.map(c => ({ id: c, text: c }));
				add = (
					<Dropdown
						options={options}
						placeholder='add a condition...'
						onSelect={id => {
							const condition = Factory.createCondition();
							condition.name = id;
							this.props.quickAddCondition(this.props.combatants, condition);
						}}
					/>
				);
			} else {
				add = (
					<button onClick={() => this.props.addCondition()}>add a condition</button>
				);
			}

			return (
				<div className='section'>
					{conditions}
					{add}
				</div>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}

interface ConditionPanelProps {
	condition: Condition;
	combatant: Combatant;
	combatants: Combatant[];
	showCombatantName: boolean;
	inline: boolean;
	nudgeConditionValue: (condition: Condition, field: string, delta: number) => void;
	editCondition: (condition: Condition) => void;
	removeCondition: (condition: Condition) => void;
}

class ConditionPanel extends React.Component<ConditionPanelProps> {
	public render() {
		try {
			let name: string = this.props.condition.name || 'condition';
			if (this.props.condition.name === 'exhaustion') {
				name += ' (' + this.props.condition.level + ')';
			}
			if (this.props.showCombatantName) {
				name = this.props.combatant.displayName + ': ' + name;
			}

			let edit = null;
			if (!this.props.inline) {
				edit = (
					<EditOutlined title='edit' onClick={() => this.props.editCondition(this.props.condition)} />
				);
			}

			const remove = (
				<CloseOutlined title='remove' onClick={() => this.props.removeCondition(this.props.condition)} />
			);

			let duration = null;
			if (this.props.condition.duration !== null) {
				duration = (
					<div className='section'>
						<i>{Utils.conditionDurationText(this.props.condition, this.props.combatants)}</i>
					</div>
				);
			}

			const description = [];
			if (this.props.condition.name === 'exhaustion') {
				description.push(
					<div key='level' className='section'>
						<NumberSpin
							value={this.props.condition.level}
							label='level'
							downEnabled={this.props.condition.level > 1}
							upEnabled={this.props.condition.level < 6}
							onNudgeValue={delta => this.props.nudgeConditionValue(this.props.condition, 'level', delta)}
						/>
					</div>
				);
			}
			const text = Utils.conditionText(this.props.condition);
			for (let n = 0; n !== text.length; ++n) {
				description.push(<div key={n} className='section'>{text[n]}</div>);
			}

			return (
				<div className='group-panel condition-panel'>
					<div className='condition-heading'>
						<div className='condition-name'>{name}</div>
						<div className='condition-buttons'>
							{edit}
							{remove}
						</div>
					</div>
					{duration}
					{description}
				</div>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
