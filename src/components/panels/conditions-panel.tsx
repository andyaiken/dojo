import React from 'react';

import * as utils from '../../utils';

import { Combatant, Condition, Combat } from '../../models/models';

import Spin from '../controls/spin';
import Expander from '../controls/expander';

interface Props {
    combatant: Combatant;
    combat: Combat;
    nudgeConditionValue: (condition: Condition, field: string, delta: number) => void;
    addCondition: () => void;
    editCondition: (condition: Condition) => void;
    removeCondition: (conditionID: string) => void;
}

export default class ConditionsPanel extends React.Component<Props> {
    render() {
        try {
            var conditions = [];
            if (this.props.combatant.conditions) {
                for (var n = 0; n !== this.props.combatant.conditions.length; ++n) {
                    var condition = this.props.combatant.conditions[n];
                    conditions.push(
                        <ConditionPanel
                            key={n}
                            condition={condition}
                            combat={this.props.combat}
                            nudgeConditionValue={(condition, type, delta) => this.props.nudgeConditionValue(condition, type, delta)}
                            editCondition={condition => this.props.editCondition(condition)}
                            removeCondition={conditionID => this.props.removeCondition(conditionID)}
                        />
                    );
                }
            }

            return (
                <div className="section">
                    {conditions}
                    <button onClick={() => this.props.addCondition()}>add a condition</button>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    };
}

interface ConditionPanelProps {
    condition: Condition;
    combat: Combat;
    nudgeConditionValue: (condition: Condition, field: string, delta: number) => void;
    editCondition: (condition: Condition) => void;
    removeCondition: (conditionID: string) => void;
}

class ConditionPanel extends React.Component<ConditionPanelProps> {
    render() {
        try {
            var name: string = this.props.condition.name || "condition";
            if (this.props.condition.name === "exhaustion") {
                name += " (" + this.props.condition.level + ")";
            }
            if ((this.props.condition.name === "custom") && (this.props.condition.text !== null)) {
                name = this.props.condition.text;
            }

            if (this.props.condition.duration !== null) {
                name += " " + utils.conditionDurationText(this.props.condition, this.props.combat);
            }

            var description = [];
            if (this.props.condition.name === "exhaustion") {
                description.push(
                    <div key="level" className="section">
                        <Spin
                            source={this.props.condition}
                            name="level"
                            label="level"
                            nudgeValue={delta => this.props.nudgeConditionValue(this.props.condition, "level", delta)}
                        />
                    </div>
                );
            }
            var text = utils.conditionText(this.props.condition);
            for (var n = 0; n !== text.length; ++n) {
                description.push(<div key={n} className="section">{text[n]}</div>);
            }

            return (
                <Expander
                    text={name}
                    content={(
                        <div>
                            {description}
                            <div className="divider"></div>
                            <button onClick={() => this.props.editCondition(this.props.condition)}>edit</button>
                            <button onClick={() => this.props.removeCondition(this.props.condition.id)}>remove</button>
                        </div>
                    )}
                />
            );
        } catch (e) {
            console.error(e);
        }
    }
}