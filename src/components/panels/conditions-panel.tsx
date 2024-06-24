import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import React from 'react';

import { Gygax } from '../../utils/gygax';

import { Combatant } from '../../models/combat';
import { Condition } from '../../models/condition';

import { RenderError } from '../error';
import { Group } from '../controls/group';
import { NumberSpin } from '../controls/number-spin';
import { Conditional } from '../controls/conditional';
import { Napoleon } from '../../utils/napoleon';

interface Props {
	combatants: Combatant[];
	allCombatants: Combatant[];
	nudgeConditionValue: (condition: Condition, field: string, delta: number) => void;
	addCondition: () => void;
	editCondition: (combatant: Combatant, condition: Condition) => void;
	deleteCondition: (combatant: Combatant, condition: Condition) => void;
}

export class ConditionsPanel extends React.Component<Props> {
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
							deleteCondition={c => this.props.deleteCondition(combatant, c)}
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
			return <RenderError context='ConditionsPanel' error={e} />;
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
	deleteCondition: (condition: Condition) => void;
}

class ConditionPanel extends React.Component<ConditionPanelProps> {
	public render() {
		try {
			let name: string = this.props.condition.name || 'condition';
			if (name === 'custom') {
				name = this.props.condition.text || 'custom condition';
			}
			if (this.props.condition.name === 'exhaustion') {
				name += ' (' + this.props.condition.level + ')';
			}
			if (this.props.showCombatantName) {
				name = Napoleon.getCombatantName(this.props.combatant, this.props.combatants) + ': ' + name;
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
			if (this.props.condition.name !== 'custom') {
				const text = Gygax.conditionText(this.props.condition);
				for (let n = 0; n !== text.length; ++n) {
					description.push(<div key={n} className='section'>{text[n]}</div>);
				}
			}

			return (
				<Group>
					<div className='content-then-icons'>
						<div className='content'>
							<div className='subheading'>{name}</div>
							<Conditional display={this.props.condition.duration !== null}>
								<div className='section'>
									<i>{Gygax.conditionDurationText(this.props.condition, this.props.combatants)}</i>
								</div>
							</Conditional>
							{description}
						</div>
						<div className='icons vertical'>
							<EditOutlined title='edit' onClick={() => this.props.editCondition(this.props.condition)} />
							<DeleteOutlined title='remove' onClick={() => this.props.deleteCondition(this.props.condition)} />
						</div>
					</div>
				</Group>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='ConditionPanel' error={e} />;
		}
	}
}
