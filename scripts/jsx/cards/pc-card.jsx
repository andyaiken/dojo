class PCCard extends React.Component {
    constructor() {
        super();
        this.state = {
            showInit: false,
            showDetails: false
        };
    }

    toggleInit() {
        this.setState({
            showInit: !this.state.showInit
        })
    }

    toggleDetails() {
        this.setState({
            showDetails: !this.state.showDetails
        })
    }

    render() {
        try {
            var options = [];
            if (this.props.mode.indexOf("edit") !== -1) {
                if (this.props.combatant.active) {
                    options.push(<button key="toggle-active" onClick={() => this.props.changeValue(this.props.combatant, "active", false)}>mark inactive</button>);
                } else {
                    options.push(<button key="toggle-active" onClick={() => this.props.changeValue(this.props.combatant, "active", true)}>mark active</button>);
                }
                options.push(<ConfirmButton key="remove" text="delete pc" callback={() => this.props.removeCombatant(this.props.combatant)} />);
            }
            if (this.props.mode.indexOf("combat") !== -1) {
                if (this.props.combatant.pending && !this.props.combatant.active && !this.props.combatant.defeated) {
                    options.push(<button key="makeAdd" onClick={() => this.props.makeActive(this.props.combatant)}>add to encounter</button>);
                    options.push(<ConfirmButton key="remove" text="remove from encounter" callback={() => this.props.removeCombatant(this.props.combatant)} />);
                }
                if (!this.props.combatant.pending && this.props.combatant.active && !this.props.combatant.defeated) {
                    if (this.props.combatant.current) {
                        options.push(<button key="endTurn" onClick={() => this.props.endTurn(this.props.combatant)}>end turn</button>);
                        options.push(<button key="makeDefeated" onClick={() => this.props.makeDefeated(this.props.combatant)}>mark as defeated and end turn</button>);
                    } else {
                        options.push(<button key="makeCurrent" onClick={() => this.props.makeCurrent(this.props.combatant)}>start turn</button>);
                        options.push(<button key="makeDefeated" onClick={() => this.props.makeDefeated(this.props.combatant)}>mark as defeated</button>);
                        options.push(<ConfirmButton key="remove" text="remove from encounter" callback={() => this.props.removeCombatant(this.props.combatant)} />);
                    }
                }
                if (!this.props.combatant.pending && !this.props.combatant.active && this.props.combatant.defeated) {
                    options.push(<button key="makeActive" onClick={() => this.props.makeActive(this.props.combatant)}>mark as active</button>);
                    options.push(<ConfirmButton key="remove" text="remove from encounter" callback={() => this.props.removeCombatant(this.props.combatant)} />);
                }
            }

            var stats = null;
            if (this.props.mode.indexOf("edit") !== -1) {
                stats = (
                    <div className="stats">
                        <div className="section">
                            <div className="input-label" style={{ display: this.state.showDetails ? "" : "none" }}>character name:</div>
                            <input type="text" value={this.props.combatant.name} onChange={event => this.props.changeValue(this.props.combatant, "name", event.target.value)} />
                            <div className="input-label" style={{ display: this.state.showDetails ? "" : "none" }}>player name:</div>
                            <input type="text" value={this.props.combatant.player} onChange={event => this.props.changeValue(this.props.combatant, "player", event.target.value)} />
                        </div>
                        <div style={{ display: this.state.showDetails ? "none" : "" }}>
                            <div className="divider"></div>
                            <div className="section centered">
                                <div className="lowercase">level {this.props.combatant.level} {this.props.combatant.race || 'race'} {this.props.combatant.classes || 'class'}</div>
                                <div style={{ display: this.props.combatant.url ? "" : "none" }}>
                                    <a href={this.props.combatant.url} target="_blank">d&d beyond sheet</a>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: this.state.showDetails ? "" : "none" }}>
                            <div className="divider"></div>
                            <div className="section">
                                <div className="input-label">race:</div>
                                <input type="text" value={this.props.combatant.race} onChange={event => this.props.changeValue(this.props.combatant, "race", event.target.value)} />
                                <div className="input-label">class:</div>
                                <input type="text" value={this.props.combatant.classes} onChange={event => this.props.changeValue(this.props.combatant, "classes", event.target.value)} />
                                <div className="input-label">background:</div>
                                <input type="text" value={this.props.combatant.background} onChange={event => this.props.changeValue(this.props.combatant, "background", event.target.value)} />
                            </div>
                            <div className="divider"></div>
                            <Spin
                                source={this.props.combatant}
                                name="level"
                                label="level"
                                nudgeValue={delta => this.props.nudgeValue(this.props.combatant, "level", delta)}
                            />
                            <div className="divider"></div>
                            <div className="section">
                                <div className="input-label">languages:</div>
                                <input type="text" value={this.props.combatant.languages} onChange={event => this.props.changeValue(this.props.combatant, "languages", event.target.value)} />
                            </div>
                            <div className="divider"></div>
                            <div className="section">
                            <div className="input-label">d&d beyond link:</div>
                                <input type="text" value={this.props.combatant.url} onChange={event => this.props.changeValue(this.props.combatant, "url", event.target.value)} />
                            </div>
                            <div className="divider"></div>
                            <div className="section subheading">passive skills</div>
                            <Spin
                                source={this.props.combatant}
                                name="passiveInsight"
                                label="insight"
                                nudgeValue={delta => this.props.nudgeValue(this.props.combatant, "passiveInsight", delta)}
                            />
                            <Spin
                                source={this.props.combatant}
                                name="passiveInvestigation"
                                label="investigation"
                                nudgeValue={delta => this.props.nudgeValue(this.props.combatant, "passiveInvestigation", delta)}
                            />
                            <Spin
                                source={this.props.combatant}
                                name="passivePerception"
                                label="perception"
                                nudgeValue={delta => this.props.nudgeValue(this.props.combatant, "passivePerception", delta)}
                            />
                        </div>
                    </div>
                );
            }
            if (this.props.mode.indexOf("combat") !== -1) {
                stats = (
                    <div className="stats">
                        <div className="section key-stats">
                            <div className="key-stat editable" onClick={() => this.toggleInit()}>
                                <div className="stat-heading">init</div>
                                <div className="stat-value">{this.props.combatant.initiative}</div>
                            </div>
                            <div className="key-stat wide">
                                <div className="stat-heading">player</div>
                                <div className="stat-value">{this.props.combatant.player ? this.props.combatant.player : "-"}</div>
                            </div>
                        </div>
                        <div style={{ display: this.state.showInit ? "" : "none" }}>
                            <Spin
                                source={this.props.combatant}
                                name="initiative"
                                label="initiative"
                                factors={[1, 5, 10]}
                                nudgeValue={delta => this.props.nudgeValue(this.props.combatant, "initiative", delta)}
                            />
                        </div>
                        <div className="divider"></div>
                        <div className="section centered">
                            <div className="lowercase">level {this.props.combatant.level} {this.props.combatant.race || 'race'} {this.props.combatant.classes || 'class'}</div>
                            <div style={{ display: this.props.combatant.url ? "" : "none" }}>
                                <a href={this.props.combatant.url} target="_blank">d&d beyond sheet</a>
                            </div>
                        </div>
                        <div style={{ display: (this.state.showDetails || this.props.combatant.current) ? "" : "none" }}>
                            <div className="divider"></div>
                            <div className="section subheading">languages</div>
                            <div className="section">
                                    {this.props.combatant.languages || "-"}
                            </div>
                            <div className="section subheading">passive skills</div>
                            <div className="table">
                                <div>
                                    <div className="cell three"><b>insight</b></div>
                                    <div className="cell three"><b>invest.</b></div>
                                    <div className="cell three"><b>percep.</b></div>
                                </div>
                                <div>
                                    <div className="cell three">{this.props.combatant.passiveInsight}</div>
                                    <div className="cell three">{this.props.combatant.passiveInvestigation}</div>
                                    <div className="cell three">{this.props.combatant.passivePerception}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }

            var toggle = null;
            if (!this.props.combatant.current) {
                var imageStyle = this.state.showDetails ? "image rotate" : "image";
                toggle = <img className={imageStyle} src="resources/images/down-arrow.svg" onClick={() => this.toggleDetails()} />
            }

            return (
                <div className="card pc">
                    <div className="heading">
                        <div className="title">{this.props.combatant.displayName || this.props.combatant.name || "unnamed pc"}</div>
                        {toggle}
                    </div>
                    <div className="card-content">
                        {stats}
                        <div style={{ display: options.length > 0 ? "" : "none" }}>
                            <div className="divider"></div>
                            <div className="section">
                                {options}
                            </div>
                        </div>
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}