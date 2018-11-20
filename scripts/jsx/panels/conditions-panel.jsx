class ConditionsPanel extends React.Component {
    addCondition() {
        this.props.addCondition({
            id: guid(),
            type: "standard",
            name: null,
            text: null,
            level: 1,
            duration: null
        });
    }

    render() {
        try {
            var conditions = [];
            for (var n = 0; n !== this.props.combatant.conditions.length; ++n) {
                var condition = this.props.combatant.conditions[n];
                conditions.push(
                    <ConditionPanel
                        key={n}
                        condition={condition}
                        nudgeConditionValue={(condition, type, delta) => this.props.nudgeConditionValue(condition, type, delta)}
                        changeConditionValue={(condition, type, value) => this.props.changeConditionValue(condition, type, value)}
                        removeCondition={conditionID => this.props.removeCondition(conditionID)}
                    />
                );
            }

            return (
                <div className="section">
                    {conditions}
                    <button onClick={() => this.addCondition()}>add a condition</button>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    };
}