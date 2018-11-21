class ConditionPanel extends React.Component {
    setDurationType(type) {
        var duration = null;
        switch (type) {
            case "none":
                duration = null;
                break;
            case "save":
                duration = {
                    type: type,
                    count: 1,
                    saveType: "str"
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

    getView() {
        var details = [];

        var name = this.props.condition.name || "condition";
        if ((this.props.condition.type === "standard") && (this.props.condition.name === "exhausted")) {
            name += " (" + this.props.condition.level + ")";
        }

        if (this.props.condition.duration !== null) {
            switch (this.props.condition.duration.type) {
                case "save":
                    name += " until you make " + this.props.condition.duration.count + " " + this.props.condition.duration.saveType + " save(s)";
                    break;
                case "combatant":
                    var point = this.props.condition.duration.point;
                    var c = this.props.combat.combatants.find(c => c.id == this.props.condition.duration.combatantID);
                    var combatant = c ? c.name + "'s" : "someone's";
                    name += " until the " + point + " of " + combatant + " next turn";
                    break;
                case "rounds":
                    name += " for " + this.props.condition.duration.count + " round(s)";
                    break;
            }
        }
        details.push(<div key="name">{name}</div>);

        return <div>{details}</div>;
    }

    getEdit() {
        var details = [];
        
        if (this.props.condition.type === "standard") {
            var text = conditionText(this.props.condition);
            for (var n = 0; n !== text.length; ++n) {
                details.push(<div key={n} className="section">{text[n]}</div>);
            }
        }

        if (this.props.condition.name === "exhausted") {
            details.push(
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

        details.push(<div key="div" className="divider"></div>);

        var editCondition = [];
        var editDuration = [];

        var typeOptions = [
            {
                id: "standard",
                text: "standard"
            },
            {
                id: "custom",
                text: "custom"
            }
        ];
        editCondition.push(
            <div key="type" className="section">
                <div className="subheading">condition type</div>
                <Selector
                    options={typeOptions}
                    selectedID={this.props.condition.type}
                    select={optionID => this.props.changeConditionValue(this.props.condition, "type", optionID)}
                />
            </div>
        );

        if (this.props.condition.type === "standard") {
            var options = CONDITION_TYPES.map(c => { return { id: c, text: c }; });
            editCondition.push(
                <div key="standard" className="section">
                    <div className="subheading">standard conditions</div>
                    <Dropdown
                        options={options}
                        selectedID={this.props.condition.name}
                        select={optionID => this.props.changeConditionValue(this.props.condition, "name", optionID)}
                    />
                </div>
            );
        }

        if (this.props.condition.type === "custom") {
            editCondition.push(
                <div key="name" className="section">
                    <div className="subheading">custom condition text</div>
                    <input type="text" placeholder="name" value={this.props.condition.name} onChange={event => this.props.changeConditionValue(this.props.condition, "name", event.target.value)} />
                </div>
            );
        }

        var options = [
            {
                id: "none",
                text: "until removed (default)"
            },
            {
                id: "save",
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
                case "save":
                    var saveOptions = ["str", "dex", "con", "int", "wis", "cha", "death"].map(c => { return { id: c, text: c }; });
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
                            <div key="standard" className="section">
                                <div className="subheading">type of save</div>
                                <Dropdown
                                    options={saveOptions}
                                    selectedID={this.props.condition.duration.saveType}
                                    select={optionID => this.props.changeConditionValue(this.props.condition.duration, "saveType", optionID)}
                                />
                            </div>
                        </div>
                    );
                    break;
                case "combatant":
                    var pointOptions = ["start", "end"].map(c => { return { id: c, text: c }; });
                    var combatantOptions = this.props.combat.combatants.map(c => { return { id: c.id, text: c.name }; });
                    duration = (
                        <div>
                            <div key="standard" className="section">
                                <div className="subheading">start or end</div>
                                <Selector
                                    options={pointOptions}
                                    selectedID={this.props.condition.duration.point}
                                    select={optionID => this.props.changeConditionValue(this.props.condition.duration, "point", optionID)}
                                />
                            </div>
                            <div key="standard" className="section">
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
        editDuration.push(
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

        return (
            <div>
                {details}
                <Expander text="edit condition" content={editCondition} />
                <Expander text="edit duration" content={editDuration} />
                <ConfirmButton key="remove" text="remove condition" callback={() => this.props.removeCondition(this.props.condition.id)} />
            </div>
        );
    }

    render() {
        try {
            return (
                <Expander
                    text={this.getView()}
                    content={this.getEdit()}
                />
            );
        } catch (e) {
            console.error(e);
        }
    }
}