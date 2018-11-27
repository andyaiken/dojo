class ConditionsPanel extends React.Component {
    addCondition(condition) {
        this.props.addCondition({
            id: guid(),
            type: condition ? "standard" : "custom",
            name: condition || "custom condition",
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
                        combat={this.props.combat}
                        nudgeConditionValue={(condition, type, delta) => this.props.nudgeConditionValue(condition, type, delta)}
                        changeConditionValue={(condition, type, value) => this.props.changeConditionValue(condition, type, value)}
                        removeCondition={conditionID => this.props.removeCondition(conditionID)}
                    />
                );
            }

            var conditionOptions = [
                {
                    id: null,
                    text: "custom condition"
                },
                {
                    id: "div",
                    text: null,
                    disabled: true
                }
            ].concat(CONDITION_TYPES.map(c => {
                return { id: c, text: c};
            }));

            return (
                <div className="section">
                    {conditions}
                    <Dropdown
                        options={conditionOptions}
                        placeholder="add a condition"
                        select={optionID => this.addCondition(optionID)}
                    />
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    };
}