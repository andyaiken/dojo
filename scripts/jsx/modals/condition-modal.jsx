class ConditionModal extends React.Component {
    constructor(props) {
        super();
        this.state = {
            condition: props.condition,
        };
    }

    setCondition(conditionType) {
        this.state.condition.type = "standard";
        this.state.condition.name = conditionType;
        this.state.condition.level = 1;

        this.setState({
            condition: this.state.condition
        });
    }

    setDuration(durationType) {
        var duration = null;

        switch (durationType) {
            case "saves":
                duration = {
                    type: "saves",
                    count: 1,
                    saveType: "str",
                    saveDC: 10,
                    point: "start"
                };
                break;
            case "combatant":
                duration = {
                    type: "combatant",
                    point: "start",
                    combatantID: null
                };
                break;
            case "rounds":
                duration = {
                    type: "rounds",
                    count: 1
                };
                break;
        }

        this.state.condition.duration = duration;
        this.setState({
            condition: this.state.condition
        });
    }

    changeValue(object, field, value) {
        object[field] = value;

        this.setState({
            condition: this.state.condition
        });
    }

    nudgeValue(object, field, delta) {
        var value = object[field] + delta;
        if (field === "level") {
            value = Math.max(value, 1);
            value = Math.min(value, 6);
        }
        if (field === "count") {
            value = Math.max(value, 1);
        }
        if (field === "saveDC") {
            value = Math.max(value, 0);
        }
        object[field] = value;

        this.setState({
            condition: this.state.condition
        });
    }

    render() {
        try {
            var conditions = CONDITION_TYPES.map(condition => {
                var controls = [];
                var description = [];
                if (condition === this.state.condition.name) {
                    if (condition === "exhaustion") {
                        controls.push(
                            <Spin
                                source={this.props.condition}
                                name="level"
                                label="exhaustion"
                                nudgeValue={delta => this.nudgeValue(this.props.condition, "level", delta)}
                            />
                        );
                    }
                    var text = conditionText(this.state.condition);
                    for (var n = 0; n !== text.length; ++n) {
                        description.push(<li key={n} className="section">{text[n]}</li>);
                    }
                }

                return {
                    id: condition,
                    text: condition,
                    details: (
                        <div key={condition}>
                            {controls}
                            <ul>
                                {description}
                            </ul>
                        </div>
                    )
                };
            });

            var saveOptions = ["str", "dex", "con", "int", "wis", "cha", "death"].map(c => { return { id: c, text: c }; });
            var pointOptions = ["start", "end"].map(c => { return { id: c, text: c }; });
            var combatantOptions = this.props.combat.combatants.map(c => { return { id: c.id, text: (c.displayName || c.name || "unnamed monster") }; });

            var durations = [
                {
                    id: "none",
                    text: "until removed (default)",
                    details: (
                        <div className="section">
                            <div>the condition persists until it is manually removed</div>
                        </div>
                    )
                },
                {
                    id: "saves",
                    text: "until a successful save",
                    details: (
                        <div>
                            <div className="section">
                                <div className="subheading">number of saves required</div>
                                <Spin
                                    source={this.props.condition.duration}
                                    name="count"
                                    nudgeValue={delta => this.nudgeValue(this.props.condition.duration, "count", delta)}
                                />
                            </div>
                            <div className="section">
                                <div className="subheading">save dc</div>
                                <Spin
                                    source={this.props.condition.duration}
                                    name="saveDC"
                                    nudgeValue={delta => this.nudgeValue(this.props.condition.duration, "saveDC", delta)}
                                />
                            </div>
                            <div className="section">
                                <div className="subheading">type of save</div>
                                <Dropdown
                                    options={saveOptions}
                                    selectedID={this.props.condition.duration ? this.props.condition.duration.saveType : null}
                                    select={optionID => this.changeValue(this.props.condition.duration, "saveType", optionID)}
                                />
                            </div>
                            <div className="section">
                                <div className="subheading">make the save at the start or end of the turn</div>
                                <Selector
                                    options={pointOptions}
                                    selectedID={this.props.condition.duration ? this.props.condition.duration.point : null}
                                    select={optionID => this.changeValue(this.props.condition.duration, "point", optionID)}
                                />
                            </div>
                        </div>
                    )
                },
                {
                    id: "combatant",
                    text: "until someone's next turn",
                    details: (
                        <div>
                            <div className="section">
                                <div className="subheading">combatant</div>
                                <Dropdown
                                    options={combatantOptions}
                                    selectedID={this.props.condition.duration ? this.props.condition.duration.combatantID : null}
                                    select={optionID => this.changeValue(this.props.condition.duration, "combatantID", optionID)}
                                />
                            </div>
                            <div className="section">
                                <div className="subheading">start or end of the turn</div>
                                <Selector
                                    options={pointOptions}
                                    selectedID={this.props.condition.duration ? this.props.condition.duration.point : null}
                                    select={optionID => this.changeValue(this.props.condition.duration, "point", optionID)}
                                />
                            </div>
                        </div>
                    )
                },
                {
                    id: "rounds",
                    text: "for a number of rounds",
                    details: (
                        <div>
                            <div className="section">
                                <div className="subheading">number of rounds</div>
                                <Spin
                                    source={this.props.condition.duration}
                                    name="count"
                                    nudgeValue={delta => this.nudgeValue(this.props.condition.duration, "count", delta)}
                                />
                            </div>
                        </div>
                    )
                }
            ];

            return (
                <div>
                    <div className="row">
                        <div className="columns small-6 medium-6 large-6 list-column">
                            <div className="heading">condition</div>
                            <RadioGroup
                                items={conditions}
                                selectedItemID={this.state.condition.name}
                                select={itemID => this.setCondition(itemID)}
                            />
                        </div>
                        <div className="columns small-6 medium-6 large-6 list-column">
                            <div className="heading">duration</div>
                            <RadioGroup
                                items={durations}
                                selectedItemID={this.state.condition.duration ? this.state.condition.duration.type : "none"}
                                select={itemID => this.setDuration(itemID)}
                            />
                        </div>
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}