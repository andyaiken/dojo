import { CloseOutlined, EditOutlined } from '@ant-design/icons';
import React from 'react';

import Gygax from '../../utils/gygax';

import { Combatant } from '../../models/combat';
import { Condition } from '../../models/condition';

import NumberSpin from '../controls/number-spin';

interface Props {
	combatants: Combatant[];
	allCombatants: Combatant[];
	nudgeConditionValue: (condition: Condition, field: string, delta: number) => void;
	addCondition: () => void;
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
							nudgeConditionValue={(c, type, delta) => this.props.nudgeConditionValue(c, type, delta)}
							editCondition={c => this.props.editCondition(combatant, c)}
							removeCondition={c => this.props.removeCondition(combatant, c)}
						/>
					);
				});
			});

			return (
				<div className='section'>
					{conditions}
					<button onClick={() => this.props.addCondition()}>add a condition</button>
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

			let duration = null;
			if (this.props.condition.duration !== null) {
				duration = (
					<div className='section'>
						<i>{Gygax.conditionDurationText(this.props.condition, this.props.combatants)}</i>
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
			const text = Gygax.conditionText(this.props.condition);
			for (let n = 0; n !== text.length; ++n) {
				description.push(<div key={n} className='section'>{text[n]}</div>);
			}

			return (
				<div className='group-panel condition-panel'>
					<div className='condition-heading'>
						<div className='condition-name'>{name}</div>
						<div className='condition-buttons'>
							<EditOutlined title='edit' onClick={() => this.props.editCondition(this.props.condition)} />
							<CloseOutlined title='remove' onClick={() => this.props.removeCondition(this.props.condition)} />
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
