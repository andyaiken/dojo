import React from 'react';
import * as utils from '../../utils';
import Spin from '../controls/spin';
import Expander from '../controls/expander';

export default class ConditionPanel extends React.Component {
    render() {
        try {
            var name = this.props.condition.name || "condition";
            if (this.props.condition.name === "exhaustion") {
                name += " (" + this.props.condition.level + ")";
            }
            if (this.props.condition.name === "custom") {
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