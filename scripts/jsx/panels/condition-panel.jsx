class ConditionPanel extends React.Component {
    setDurationType(type) {
        var duration = null;
        switch (type) {
            case "none":
                duration = null;
                break;
            case "saves":
                duration = {
                    type: type,
                    count: 1,
                    saveType: "str",
                    saveDC: 10,
                    point: "start"
                };
                break;
            case "combatant":
                duration = {
                    type: type,
                    point: "start",
                    combatantID: null
                };
                break;
            case "rounds":
                duration = {
                    type: type,
                    count: 1
                };
                break;
        }

        this.props.changeConditionValue(this.props.condition, "duration", duration);
    }

    getDurationContent() {
        var content = [];

        var options = [
            {
                id: "none",
                text: "until removed (default)"
            },
            {
                id: "saves",
                text: "until a successful save"
            },
            {
                id: "combatant",
                text: "until someone's next turn"
            },
            {
                id: "rounds",
                text: "for a number of rounds"
            },
        ];
        var duration = null;
        if (this.props.condition.duration) {
            switch (this.props.condition.duration.type) {
                case "saves":
                    var saveOptions = ["str", "dex", "con", "int", "wis", "cha", "death"].map(c => { return { id: c, text: c }; });
                    var pointOptions = ["start", "end"].map(c => { return { id: c, text: c }; });
                    duration = (
                        <div>
                            <div className="section">
                                <div className="subheading">number of saves required</div>
                                <Spin
                                    source={this.props.condition.duration}
                                    name="count"
                                    nudgeValue={delta => this.props.nudgeConditionValue(this.props.condition.duration, "count", delta)}
                                />
                            </div>
                            <div className="section">
                                <div className="subheading">type of save</div>
                                <Dropdown
                                    options={saveOptions}
                                    selectedID={this.props.condition.duration.saveType}
                                    select={optionID => this.props.changeConditionValue(this.props.condition.duration, "saveType", optionID)}
                                />
                            </div>
                            <div className="section">
                                <div className="subheading">save dc</div>
                                <Spin
                                    source={this.props.condition.duration}
                                    name="saveDC"
                                    nudgeValue={delta => this.props.nudgeConditionValue(this.props.condition.duration, "saveDC", delta)}
                                />
                            </div>
                            <div className="section">
                                <div className="subheading">start or end</div>
                                <Selector
                                    options={pointOptions}
                                    selectedID={this.props.condition.duration.point}
                                    select={optionID => this.props.changeConditionValue(this.props.condition.duration, "point", optionID)}
                                />
                            </div>
                        </div>
                    );
                    break;
                case "combatant":
                    var pointOptions = ["start", "end"].map(c => { return { id: c, text: c }; });
                    var combatantOptions = this.props.combat.combatants.map(c => { return { id: c.id, text: (c.displayName || c.name || "unnamed monster") }; });
                    duration = (
                        <div>
                            <div className="section">
                                <div className="subheading">start or end</div>
                                <Selector
                                    options={pointOptions}
                                    selectedID={this.props.condition.duration.point}
                                    select={optionID => this.props.changeConditionValue(this.props.condition.duration, "point", optionID)}
                                />
                            </div>
                            <div className="section">
                                <div className="subheading">combatant</div>
                                <Dropdown
                                    options={combatantOptions}
                                    selectedID={this.props.condition.duration.combatantID}
                                    select={optionID => this.props.changeConditionValue(this.props.condition.duration, "combatantID", optionID)}
                                />
                            </div>
                        </div>
                    );
                    break;
                case "rounds":
                    duration = (
                        <div>
                            <div className="section">
                                <div className="subheading">number of rounds</div>
                                <Spin
                                    source={this.props.condition.duration}
                                    name="count"
                                    nudgeValue={delta => this.props.nudgeConditionValue(this.props.condition.duration, "count", delta)}
                                />
                            </div>
                        </div>
                    );
                    break;
            };
        }
        content.push(
            <div key="duration" className="section">
                <div className="subheading">duration type</div>
                <Dropdown
                    options={options}
                    selectedID={this.props.condition.duration ? this.props.condition.duration.type : "none"}
                    select={optionID => this.setDurationType(optionID)}
                />
                {duration}
            </div>
        );

        return content;
    }

    getDetails() {
        var description = [];
        if (this.props.condition.type === "standard") {
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
        }
        if (this.props.condition.type === "standard") {
            var text = conditionText(this.props.condition);
            for (var n = 0; n !== text.length; ++n) {
                description.push(<div key={n} className="section">{text[n]}</div>);
            }
        }

        return (
            <div>
                {description}
                <div className="divider"></div>
                <button onClick={() => this.props.editCondition(this.props.condition)}>edit</button>
                <button onClick={() => this.props.removeCondition(this.props.condition.id)}>remove</button>
            </div>
        );
    }

    render() {
        try {
            var name = this.props.condition.name || "condition";
            if ((this.props.condition.type === "standard") && (this.props.condition.name === "exhaustion")) {
                name += " (" + this.props.condition.level + ")";
            }

            if (this.props.condition.duration !== null) {
                name += " " + conditionDurationText(this.props.condition, this.props.combat);
            }

            return (
                <Expander
                    text={name}
                    content={this.getDetails()}
                />
            );
        } catch (e) {
            console.error(e);
        }
    }
}