import React from 'react';

import { Collapse, Icon } from 'antd';

import Utils from '../../utils/utils';

import { Combat, Combatant } from '../../models/combat';
import { Condition } from '../../models/condition';

import NumberSpin from '../controls/number-spin';

interface Props {
    combatant: Combatant;
    combat: Combat;
    nudgeConditionValue: (condition: Condition, field: string, delta: number) => void;
    addCondition: () => void;
    editCondition: (condition: Condition) => void;
    removeCondition: (conditionID: string) => void;
}

export default class ConditionsPanel extends React.Component<Props> {
    public render() {
        try {
            const conditions = [];
            if (this.props.combatant.conditions) {
                for (let n = 0; n !== this.props.combatant.conditions.length; ++n) {
                    const c = this.props.combatant.conditions[n];
                    conditions.push(
                        <ConditionPanel
                            key={n}
                            condition={c}
                            combat={this.props.combat}
                            nudgeConditionValue={(condition, type, delta) => this.props.nudgeConditionValue(condition, type, delta)}
                            editCondition={condition => this.props.editCondition(condition)}
                            removeCondition={conditionID => this.props.removeCondition(conditionID)}
                        />
                    );
                }
            }

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
    combat: Combat;
    nudgeConditionValue: (condition: Condition, field: string, delta: number) => void;
    editCondition: (condition: Condition) => void;
    removeCondition: (conditionID: string) => void;
}

class ConditionPanel extends React.Component<ConditionPanelProps> {
    public render() {
        try {
            let name: string = this.props.condition.name || 'condition';
            if (this.props.condition.name === 'exhaustion') {
                name += ' (' + this.props.condition.level + ')';
            }
            if ((this.props.condition.name === 'custom') && (this.props.condition.text !== null)) {
                name = this.props.condition.text;
            }

            if (this.props.condition.duration !== null) {
                name += ' ' + Utils.conditionDurationText(this.props.condition, this.props.combat);
            }

            const description = [];
            if (this.props.condition.name === 'exhaustion') {
                description.push(
                    <div key='level' className='section'>
                        <NumberSpin
                            source={this.props.condition}
                            name='level'
                            label='level'
                            nudgeValue={delta => this.props.nudgeConditionValue(this.props.condition, 'level', delta)}
                        />
                    </div>
                );
            }
            const text = Utils.conditionText(this.props.condition);
            for (let n = 0; n !== text.length; ++n) {
                description.push(<div key={n} className='section'>{text[n]}</div>);
            }

            return (
                <Collapse
                    bordered={false}
                    expandIcon={p => <Icon type='down-circle' rotate={p.isActive ? -180 : 0} />}
                    expandIconPosition={'right'}
                >
                    <Collapse.Panel key='one' header={name}>
                        {description}
                        <div className='divider' />
                        <button onClick={() => this.props.editCondition(this.props.condition)}>edit</button>
                        <button onClick={() => this.props.removeCondition(this.props.condition.id)}>remove</button>
                    </Collapse.Panel>
                </Collapse>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
