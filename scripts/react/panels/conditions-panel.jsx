class ConditionsPanel extends React.Component {
    addCondition(condition) {
        this.props.addCondition({
            name: condition,
            level: 1
        });
    }

    render() {
        try {
            var conditions = [
                "blinded",
                "charmed",
                "deafened",
                "exhausted",
                "frightened",
                "grappled",
                "incapacitated",
                "invisible",
                "paralyzed",
                "petrified",
                "poisoned",
                "prone",
                "restrained",
                "stunned",
                "unconscious"
            ];
            var options = conditions.map(c => { return { id: c, text: c }; });

            var conditions = [];
            for (var n = 0; n != this.props.combatant.conditions.length; ++n) {
                var condition = this.props.combatant.conditions[n];
                conditions.push(
                    <ConditionPanel
                        key={n}
                        condition={condition}
                        nudgeConditionValue={(condition, type, delta) => this.props.nudgeConditionValue(condition, type, delta)}
                        removeCondition={condition => this.props.removeCondition(condition)}
                    />
                );
            }

            return (
                <div className="section">
                    {conditions}
                    <Dropdown
                        options={options}
                        select={optionID => this.addCondition(optionID)}
                    />
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    };
}