class ConditionsPanel extends React.Component {
    constructor() {
        super();
        this.state = {
            conditionDropDown: false
        };
    }

    addCondition(condition) {
        if (condition) {
            this.props.addCondition({
                name: condition,
                level: 1
            });
            this.setState({
                conditionDropdownOpen: false
            });
        } else {
            this.setState({
                conditionDropdownOpen: !this.state.conditionDropdownOpen
            });
        }
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
            var conditionDropdownItems = [];
            conditions.forEach(condition => {
                conditionDropdownItems.push(
                    <DropdownItem
                        key={condition}
                        text={condition}
                        item={condition}
                        selected={false}
                        onSelect={item => this.addCondition(item)} />
                )
            });
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
                    <div className="dropdown">
                        <button className="dropdown-button" onClick={() => this.addCondition()}>
                            <div className="title">add condition</div>
                            <img className="image" src="content/ellipsis.svg" />
                        </button>
                        <div className={this.state.conditionDropdownOpen ? "dropdown-content open" : "dropdown-content"}>
                            {conditionDropdownItems}
                        </div>
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    };
}