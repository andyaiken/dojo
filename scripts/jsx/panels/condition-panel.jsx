class ConditionPanel extends React.Component {
    constructor(props) {
        super();
        this.state = {
            mode: props.mode || "view"
        };
    }

    setMode(mode) {
        this.setState({
            mode: mode
        });
    }

    setConditionType(type) {
        // TODO
    }

    setStandardCondition(condition) {
        // TODO
    }

    setDurationType(type) {
        // TODO
    }

    getEdit() {
        var details = [];

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
        details.push(
            <div key="type" className="section">
                <Selector
                    options={typeOptions}
                    selectedID={this.props.condition.type}
                    select={optionID => this.setConditionType(optionID)}
                />
            </div>
        );

        if (this.props.condition.type === "standard") {
            var options = CONDITION_TYPES.map(c => { return { id: c, text: c }; });
            details.push(
                <div key="standard" className="section">
                    <Selector
                        options={options}
                        selectedID={this.props.condition.name}
                        itemsPerRow={3}
                        select={optionID => this.setStandardCondition(optionID)}
                    />
                </div>
            );
        }

        if ((this.props.condition.type === "standard") && (this.props.condition.name === "exhausted")) {
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

        if (this.props.condition.type === "custom") {
            details.push(
                <div key="name" className="section">
                    <input type="text" placeholder="name" value={this.props.condition.name} onChange={event => this.props.changeConditionValue(this.props.condition, "name", event.target.value)} />
                </div>
            );
            details.push(
                <div key="text" className="section">
                    <textarea placeholder="details" value={this.props.condition.text} onChange={event => this.props.changeConditionValue(this.props.condition, "text", event.target.value)} />
                </div>
            );
        }

        var options = [
            {
                id: "none",
                text: "none"
            },
            {
                id: "save",
                text: "until saved"
            },
            {
                id: "combatant",
                text: "next turn"
            },
            {
                id: "rounds",
                text: "number of rounds"
            },
        ];
        var duration = null;
        if (this.props.condition.duration) {
            switch (this.props.condition.duration.type) {
                case "save":
                    duration = (
                        <div>UNTIL [N] [TYPE] TURNS</div>
                    );
                    break;
                case "combatant":
                    duration = (
                        <div>UNTIL [START|END] of [X]'S NEXT TURN</div>
                    );
                    break;
                case "rounds":
                    duration = (
                        <div>FOR [N] ROUNDS</div>
                    );
                    break;
            };
        }
        details.push(
            <div key="duration" className="section">
                <Selector
                    options={options}
                    selectedID={this.props.condition.duration ? this.props.condition.duration.type : "none"}
                    select={optionID => this.setDurationType(optionID)}
                />
                {duration}
            </div>
        );

        details.push(
            <div key="remove" className="section">
                <div className="divider"></div>
                <button onClick={() => this.setMode("view")}>close</button>
                <ConfirmButton key="remove" text="remove condition" callback={() => this.props.removeCondition(this.props.condition.id)} />
            </div>
        );

        return details;
    }

    getView() {
        var details = [];

        // TODO: Allow custom conditions (with custom text)
        var text = conditionText(this.props.condition);
        for (var n = 0; n !== text.length; ++n) {
            details.push(<div key={n} className="section">{text[n]}</div>);
        }

        if (this.props.condition.duration !== null) {
            var duration = null;
            switch (this.props.condition.duration.type) {
                case "save":
                    duration = (
                        <div>until you make {this.props.condition.duration.turns} {this.props.condition.duration.savetype} saves</div>
                    );
                    break;
                case "combatant":
                    var point = this.props.condition.duration.point;
                    var combatant = this.props.condition.duration.combatantID ? "[COMBATANT]'s" : "my"; // TODO: Get combatant
                    duration = (
                        <div>until the {point} of {combatant} next turn</div>
                    );
                    break;
                case "turns":
                    duration = (
                        <div>for {this.props.condition.duration.turns} turns</div>
                    );
                    break;
            }
            details.push(
                <div key="duration" className="section centered">
                    <i>{duration}</i>
                </div>
            );
        }

        details.push(
            <div key="remove" className="section">
                <div className="divider"></div>
                <button onClick={() => this.setMode("edit")}>edit condition</button>
                <ConfirmButton key="remove" text="remove condition" callback={() => this.props.removeCondition(this.props.condition.id)} />
            </div>
        );

        return details;
    }

    render() {
        try {
            var content = null;
            switch (this.state.mode) {
                case "edit":
                    content = this.getEdit();
                    break;
                case "view":
                    content = this.getView();
                    break;
            }

            var name = this.props.condition.name || "unnamed condition";
            if (this.props.condition.name === "exhausted") {
                name += " (" + this.props.condition.level + ")";
            }
    
            return (
                <Expander
                    text={name}
                    content={content}
                />
            );
        } catch (e) {
            console.error(e);
        }
    }
}