import React from 'react';
import ConditionPanel from './condition-panel';

export default class ConditionsPanel extends React.Component {
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
                            changeConditionValue={(condition, type, value) => this.props.changeConditionValue(condition, type, value)}
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