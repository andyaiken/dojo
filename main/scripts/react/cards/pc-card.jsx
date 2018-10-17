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
                options.push(<ConfirmButton key="remove" text="delete pc" callback={() => this.props.removeCombatant(this.props.combatant)} />);
            }
            if (this.props.mode.indexOf("combat") !== -1) {
                if (this.props.combatant.initiative !== null && !this.props.combatant.active) {
                    options.push(<button key="makeActive" onClick={() => this.props.makeActive(this.props.combatant)}>add to encounter</button>);
                }
                if (this.props.combatant.active && !this.props.combatant.current) {
                    options.push(<button key="makeCurrent" onClick={() => this.props.makeCurrent(this.props.combatant)}>start turn</button>);
                }
                if (this.props.combatant.current) {
                    options.push(<button key="endTurn" onClick={() => this.props.endTurn(this.props.combatant)}>end turn</button>);
                } else {
                    options.push(<ConfirmButton key="remove" text="remove from encounter" callback={() => this.props.removeCombatant(this.props.combatant)} />);
                }
            }

            var stats = null;
            if (this.props.mode.indexOf("edit") !== -1) {
                stats = (
                    <div className="stats">
                        <div className="section">
                            <input type="text" placeholder="character name" value={this.props.combatant.name} onChange={event => this.props.changeValue(this.props.combatant, "name", event.target.value)} />
                            <input type="text" placeholder="player name" value={this.props.combatant.player} onChange={event => this.props.changeValue(this.props.combatant, "player", event.target.value)} />
                        </div>
                        <div style={{ display: this.state.showDetails ? "none" : "" }}>
                            <div className="divider"></div>
                            <div className="section centered">
                                <div>level {this.props.combatant.level} {this.props.combatant.race || 'race'} {this.props.combatant.classes || 'class'}</div>
                                <div style={{ display: this.props.combatant.url ? "" : "none" }}>
                                    <a href={this.props.combatant.url} target="_blank">d&d beyond character sheet</a>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: this.state.showDetails ? "" : "none" }}>
                            <div className="divider"></div>
                            <div className="section">
                                <input type="text" placeholder="race" value={this.props.combatant.race} onChange={event => this.props.changeValue(this.props.combatant, "race", event.target.value)} />
                                <input type="text" placeholder="class" value={this.props.combatant.classes} onChange={event => this.props.changeValue(this.props.combatant, "classes", event.target.value)} />
                                <input type="text" placeholder="background" value={this.props.combatant.background} onChange={event => this.props.changeValue(this.props.combatant, "background", event.target.value)} />
                            </div>
                            <div className="divider"></div>
                            <div className="section spin">
                                <div className="spin-button toggle" onClick={() => this.props.nudgeValue(this.props.combatant, "level", -5)}>
                                    <img className="image" src="content/minus.svg" />
                                    <span className="spin-delta">5</span>
                                </div>
                                <div className="spin-button toggle" onClick={() => this.props.nudgeValue(this.props.combatant, "level", -1)}>
                                    <img className="image" src="content/minus.svg" />
                                    <span className="spin-delta">1</span>
                                </div>
                                <div className="spin-value">
                                    <div className="spin-label">level</div>
                                    <div className="spin-label">{this.props.combatant.level}</div>
                                </div>
                                <div className="spin-button toggle" onClick={() => this.props.nudgeValue(this.props.combatant, "level", +1)}>
                                    <img className="image" src="content/plus.svg" />
                                    <span className="spin-delta">1</span>
                                </div>
                                <div className="spin-button toggle" onClick={() => this.props.nudgeValue(this.props.combatant, "level", +5)}>
                                    <img className="image" src="content/plus.svg" />
                                    <span className="spin-delta">5</span>
                                </div>
                            </div>
                            <div className="divider"></div>
                            <div className="section">
                                <input type="text" placeholder="languages" value={this.props.combatant.languages} onChange={event => this.props.changeValue(this.props.combatant, "languages", event.target.value)} />
                            </div>
                            <div className="divider"></div>
                            <div className="section">
                                <input type="text" placeholder="d&d beyond link" value={this.props.combatant.url} onChange={event => this.props.changeValue(this.props.combatant, "url", event.target.value)} />
                            </div>
                            <div className="divider"></div>
                            <div className="section subheading">passive skills</div>
                            <div className="section spin">
                                <div className="spin-button toggle" onClick={() => this.props.nudgeValue(this.props.combatant, "passiveInsight", -5)}>
                                    <img className="image" src="content/minus.svg" />
                                    <span className="spin-delta">5</span>
                                </div>
                                <div className="spin-button toggle" onClick={() => this.props.nudgeValue(this.props.combatant, "passiveInsight", -1)}>
                                    <img className="image" src="content/minus.svg" />
                                    <span className="spin-delta">1</span>
                                </div>
                                <div className="spin-value">
                                    <div className="spin-label">insight</div>
                                    <div className="spin-label">{this.props.combatant.passiveInsight}</div>
                                </div>
                                <div className="spin-button toggle" onClick={() => this.props.nudgeValue(this.props.combatant, "passiveInsight", +1)}>
                                    <img className="image" src="content/plus.svg" />
                                    <span className="spin-delta">1</span>
                                </div>
                                <div className="spin-button toggle" onClick={() => this.props.nudgeValue(this.props.combatant, "passiveInsight", +5)}>
                                    <img className="image" src="content/plus.svg" />
                                    <span className="spin-delta">5</span>
                                </div>
                            </div>
                            <div className="section spin">
                                <div className="spin-button toggle" onClick={() => this.props.nudgeValue(this.props.combatant, "passiveInvestigation", -5)}>
                                    <img className="image" src="content/minus.svg" />
                                    <span className="spin-delta">5</span>
                                </div>
                                <div className="spin-button toggle" onClick={() => this.props.nudgeValue(this.props.combatant, "passiveInvestigation", -1)}>
                                    <img className="image" src="content/minus.svg" />
                                    <span className="spin-delta">1</span>
                                </div>
                                <div className="spin-value">
                                    <div className="spin-label">investigation</div>
                                    <div className="spin-label">{this.props.combatant.passiveInvestigation}</div>
                                </div>
                                <div className="spin-button toggle" onClick={() => this.props.nudgeValue(this.props.combatant, "passiveInvestigation", +1)}>
                                    <img className="image" src="content/plus.svg" />
                                    <span className="spin-delta">1</span>
                                </div>
                                <div className="spin-button toggle" onClick={() => this.props.nudgeValue(this.props.combatant, "passiveInvestigation", +5)}>
                                    <img className="image" src="content/plus.svg" />
                                    <span className="spin-delta">5</span>
                                </div>
                            </div>
                            <div className="section spin">
                                <div className="spin-button toggle" onClick={() => this.props.nudgeValue(this.props.combatant, "passivePerception", -5)}>
                                    <img className="image" src="content/minus.svg" />
                                    <span className="spin-delta">5</span>
                                </div>
                                <div className="spin-button toggle" onClick={() => this.props.nudgeValue(this.props.combatant, "passivePerception", -1)}>
                                    <img className="image" src="content/minus.svg" />
                                    <span className="spin-delta">1</span>
                                </div>
                                <div className="spin-value">
                                    <div className="spin-label">perception</div>
                                    <div className="spin-label">{this.props.combatant.passivePerception}</div>
                                </div>
                                <div className="spin-button toggle" onClick={() => this.props.nudgeValue(this.props.combatant, "passivePerception", +1)}>
                                    <img className="image" src="content/plus.svg" />
                                    <span className="spin-delta">1</span>
                                </div>
                                <div className="spin-button toggle" onClick={() => this.props.nudgeValue(this.props.combatant, "passivePerception", +5)}>
                                    <img className="image" src="content/plus.svg" />
                                    <span className="spin-delta">5</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
            if (this.props.mode.indexOf("combat") !== -1) {
                stats = (
                    <div className="stats">
                        <div className="section key-stats">
                            <div className="key-stat toggle" onClick={() => this.toggleInit()}>
                                <div className="stat-heading">init</div>
                                <div className="stat-value">{this.props.combatant.initiative}</div>
                            </div>
                            <div className="key-stat wide">
                                <div className="stat-heading">player</div>
                                <div className="stat-value">{this.props.combatant.player ? this.props.combatant.player : "-"}</div>
                            </div>
                        </div>
                        <div style={{ display: this.state.showInit ? "" : "none" }}>
                            <div className="divider"></div>
                            <div className="section spin">
                                <div className="spin-button toggle" onClick={() => this.props.nudgeValue(this.props.combatant, "initiative", -5)}>
                                    <img className="image" src="content/minus.svg" />
                                    <span className="spin-delta">5</span>
                                </div>
                                <div className="spin-button toggle" onClick={() => this.props.nudgeValue(this.props.combatant, "initiative", -1)}>
                                    <img className="image" src="content/minus.svg" />
                                    <span className="spin-delta">1</span>
                                </div>
                                <div className="spin-value">
                                    <div className="spin-label">initiative</div>
                                    <div className="spin-label">{this.props.combatant.initiative}</div>
                                </div>
                                <div className="spin-button toggle" onClick={() => this.props.nudgeValue(this.props.combatant, "initiative", +1)}>
                                    <img className="image" src="content/plus.svg" />
                                    <span className="spin-delta">1</span>
                                </div>
                                <div className="spin-button toggle" onClick={() => this.props.nudgeValue(this.props.combatant, "initiative", +5)}>
                                    <img className="image" src="content/plus.svg" />
                                    <span className="spin-delta">5</span>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: (this.state.showDetails || this.props.combatant.current) ? "" : "none" }}>
                            <div className="divider"></div>
                            <div className="section">
                                <div style={{ display: this.props.combatant.race ? "" : "none" }}>
                                    <b>race</b> {this.props.combatant.race}
                                </div>
                                <div style={{ display: this.props.combatant.classes ? "" : "none" }}>
                                    <b>class</b> {this.props.combatant.classes}
                                </div>
                                <div style={{ display: this.props.combatant.background ? "" : "none" }}>
                                    <b>background</b> {this.props.combatant.background}
                                </div>
                                <div>
                                    <b>level</b> {this.props.combatant.level}
                                </div>
                            </div>
                            <div className="section">
                                <div style={{ display: this.props.combatant.languages ? "" : "none" }}>
                                    <b>languages</b> {this.props.combatant.languages}
                                </div>
                            </div>
                            <div className="section">
                                <div>
                                    <b>passive insight</b> {this.props.combatant.passiveInsight}
                                </div>
                                <div>
                                    <b>passive investigation</b> {this.props.combatant.passiveInvestigation}
                                </div>
                                <div>
                                    <b>passive perception</b> {this.props.combatant.passivePerception}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }

            var name = this.props.combatant.name;
            if (!name) {
                name = "unnamed pc";
            }

            var toggle = null;
            if (!this.props.combatant.current) {
                var imageStyle = this.state.showDetails ? "image rotate" : "image";
                toggle = <img className={imageStyle} src="content/down-arrow.svg" onClick={() => this.toggleDetails()} />
            }

            return (
                <div className="card pc">
                    <div className="heading">
                        <div className="title">{name}</div>
                        {toggle}
                    </div>
                    <div className="card-content">
                        {stats}
                        <div style={{ display: options.length > 0 ? "" : "none" }}>
                            <div className="divider"></div>
                            <div className="section">{options}</div>
                        </div>
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}