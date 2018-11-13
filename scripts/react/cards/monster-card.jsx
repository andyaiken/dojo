class MonsterCard extends React.Component {
    constructor() {
        super();
        this.state = {
            showInit: false,
            showHP: false,
            showDetails: false
        };
    }

    toggleInit() {
        this.setState({
            showInit: !this.state.showInit,
            showHP: false
        })
    }

    toggleHP() {
        this.setState({
            showInit: false,
            showHP: !this.state.showHP
        })
    }

    toggleDetails() {
        this.setState({
            showDetails: !this.state.showDetails
        })
    }

    description() {
        var category = this.props.combatant.category;
        if (this.props.combatant.tag) {
            category += " (" + this.props.combatant.tag + ")";
        }
        var description = this.props.combatant.size + " " + category;
        if (this.props.combatant.alignment) {
            description += ", " + this.props.combatant.alignment;
        }
        return description.toLowerCase();
    }

    rename() {
        // TODO: Toggle
    }

    render() {
        try {
            var options = [];
            if (this.props.mode.indexOf("no-buttons") === -1) {
                if (this.props.mode.indexOf("view") !== -1) {
                    if (this.props.mode.indexOf("editable") !== -1) {
                        options.push(<button key="edit" onClick={() => this.props.editMonster(this.props.combatant)}>edit monster</button>);
                        options.push(<button key="clone" onClick={() => this.props.cloneMonster(this.props.combatant)}>create a copy</button>);

                        var groupOptions = [];
                        this.props.library.forEach(group => {
                            if (group.monsters.indexOf(this.props.combatant) === -1) {
                                groupOptions.push({
                                    id: group.id,
                                    text: group.name
                                });
                            }
                        });
                        options.push(
                            <Dropdown
                                key="move"
                                options={groupOptions}
                                placeholder="move to group..."
                                select={optionID => this.props.moveToGroup(this.props.combatant, optionID)}
                            />
                        );

                        options.push(<ConfirmButton key="remove" text="delete monster" callback={() => this.props.removeCombatant(this.props.combatant)} />);
                    }
                    if (this.props.mode.indexOf("encounter") !== -1) {
                        if (!this.props.slot) {
                            options.push(<button key="add" onClick={() => this.props.addEncounterSlot(this.props.combatant)}>add to encounter</button>);
                        } else {
                            options.push(<button key="remove" onClick={() => this.props.removeEncounterSlot(this.props.slot)}>remove from encounter</button>);
                        }
                    }
                }
                if (this.props.mode.indexOf("combat") !== -1) {
                    options.push(
                        <Expander
                            key="rename"
                            text="change name"
                            content={(
                                <div>
                                    <input type="text" value={this.props.combatant.displayName} onChange={event => this.props.changeValue(this.props.combatant, "displayName", event.target.value)} />
                                </div>
                            )}
                        />
                    );
                    options.push(<div key="div" className="divider"></div>);
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
                if (this.props.mode.indexOf("template") !== -1) {
                    // None
                }
            }

            var stats = null;
            if (this.props.mode.indexOf("view") !== -1) {
                var slotSection = null;
                if (this.props.slot) {
                    slotSection = (
                        <div>
                            <div className="divider"></div>
                            <Spin
                                source={this.props.slot}
                                name="count"
                                label="count"
                                nudgeValue={delta => this.props.nudgeValue(this.props.slot, "count", delta)}
                            />
                        </div>
                    );
                }

                var details = null;
                if (this.state.showDetails) {
                    details = (
                        <div>
                            <div className="divider"></div>
                            <div className="section">
                                <b>ac</b> {this.props.combatant.ac}
                            </div>
                            <div className="section" style={{ display: this.props.combatant.hpMax !== "" ? "" : "none" }}>
                                <b>hp</b> {this.props.combatant.hitDice !== "" ? this.props.combatant.hpMax + " (" + this.props.combatant.hitDice + "d" + hitDieType(this.props.combatant.size) + ")" : this.props.combatant.hpMax}
                            </div>
                            <div className="section" style={{ display: this.props.combatant.speed !== "" ? "" : "none" }}>
                                <b>speed</b> {this.props.combatant.speed}
                            </div>
                            <div className="section">
                                <AbilityScorePanel combatant={this.props.combatant} />
                            </div>
                            <div className="section" style={{ display: this.props.combatant.savingThrows !== "" ? "" : "none" }}>
                                <b>saving throws</b> {this.props.combatant.savingThrows}
                            </div>
                            <div className="section" style={{ display: this.props.combatant.skills !== "" ? "" : "none" }}>
                                <b>skills</b> {this.props.combatant.skills}
                            </div>
                            <div className="section" style={{ display: this.props.combatant.damage.resist !== "" ? "" : "none" }}>
                                <b>damage resistances</b> {this.props.combatant.damage.resist}
                            </div>
                            <div className="section" style={{ display: this.props.combatant.damage.vulnerable !== "" ? "" : "none" }}>
                                <b>damage vulnerabilities</b> {this.props.combatant.damage.vulnerable}
                            </div>
                            <div className="section" style={{ display: this.props.combatant.damage.immune !== "" ? "" : "none" }}>
                                <b>damage immunities</b> {this.props.combatant.damage.immune}
                            </div>
                            <div className="section" style={{ display: this.props.combatant.conditionImmunities !== "" ? "" : "none" }}>
                                <b>condition immunities</b> {this.props.combatant.conditionImmunities}
                            </div>
                            <div className="section" style={{ display: this.props.combatant.senses !== "" ? "" : "none" }}>
                                <b>senses</b> {this.props.combatant.senses}
                            </div>
                            <div className="section" style={{ display: this.props.combatant.languages !== "" ? "" : "none" }}>
                                <b>languages</b> {this.props.combatant.languages}
                            </div>
                            <div className="section" style={{ display: this.props.combatant.equipment !== "" ? "" : "none" }}>
                                <b>equipment</b> {this.props.combatant.equipment}
                            </div>
                            <div className="section">
                                <b>challenge</b> {challenge(this.props.combatant.challenge)} ({experience(this.props.combatant.challenge)} xp)
                            </div>
                            <div className="divider"></div>
                            <TraitsPanel combatant={this.props.combatant} />
                        </div>
                    );
                }

                stats = (
                    <div className="stats">
                        <div className="section centered">
                            <div><i>{this.description()}</i></div>
                        </div>
                        {slotSection}
                        {details}
                    </div>
                );
            }
            if (this.props.mode.indexOf("combat") !== -1) {
                var hp = this.props.combatant.hp;
                if (this.props.combatant.hpTemp > 0) {
                    hp += " + " + this.props.combatant.hpTemp;
                }

                stats = (
                    <div className="stats">
                        {!this.props.combatant.pending ? <HitPointGauge combatant={this.props.combatant} /> : null}
                        <div className="section key-stats">
                            <div className="key-stat editable" onClick={() => this.toggleInit()}>
                                <div className="stat-heading">init</div>
                                <div className="stat-value">{this.props.combatant.initiative}</div>
                            </div>
                            <div className="key-stat">
                                <div className="stat-heading">ac</div>
                                <div className="stat-value">{this.props.combatant.ac}</div>
                            </div>
                            <div className="key-stat editable" onClick={() => this.toggleHP()}>
                                <div className="stat-heading">hp</div>
                                <div className="stat-value">{hp}</div>
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
                        <div style={{ display: this.state.showHP ? "" : "none" }}>
                            <Spin
                                source={this.props.combatant}
                                name="hp"
                                label="hit points"
                                factors={[1, 5, 10]}
                                nudgeValue={delta => this.props.nudgeValue(this.props.combatant, "hp", delta)}
                            />
                            <Spin
                                source={this.props.combatant}
                                name="hpTemp"
                                label="temp hp"
                                factors={[1, 5, 10]}
                                nudgeValue={delta => this.props.nudgeValue(this.props.combatant, "hpTemp", delta)}
                            />
                            <div className="section" style={{ display: this.props.combatant.damage.resist !== "" ? "" : "none" }}>
                                <b>damage resistances</b> {this.props.combatant.damage.resist}
                            </div>
                            <div className="section" style={{ display: this.props.combatant.damage.vulnerable !== "" ? "" : "none" }}>
                                <b>damage vulnerabilities</b> {this.props.combatant.damage.vulnerable}
                            </div>
                            <div className="section" style={{ display: this.props.combatant.damage.immune !== "" ? "" : "none" }}>
                                <b>damage immunities</b> {this.props.combatant.damage.immune}
                            </div>
                        </div>
                        <div className="divider"></div>
                        <ConditionsPanel
                            combatant={this.props.combatant}
                            addCondition={condition => this.props.addCondition(this.props.combatant, condition)}
                            removeCondition={condition => this.props.removeCondition(this.props.combatant, condition)}
                            nudgeConditionValue={(condition, type, delta) => this.props.nudgeConditionValue(condition, type, delta)}
                        />
                        <div className="section" style={{ display: this.props.combatant.conditionImmunities !== "" ? "" : "none" }}>
                            <b>condition immunities</b> {this.props.combatant.conditionImmunities}
                        </div>
                        <div style={{ display: (this.state.showDetails || this.props.combatant.current) ? "" : "none" }}>
                            <div className="divider"></div>
                            <div className="section centered">
                                <div><i>{this.description()}</i></div>
                            </div>
                            <div className="section">
                                <AbilityScorePanel combatant={this.props.combatant} />
                            </div>
                            <div className="section" style={{ display: this.props.combatant.savingThrows !== "" ? "" : "none" }}>
                                <b>saving throws</b> {this.props.combatant.savingThrows}
                            </div>
                            <div className="section" style={{ display: this.props.combatant.skills !== "" ? "" : "none" }}>
                                <b>skills</b> {this.props.combatant.skills}
                            </div>
                            <div className="section" style={{ display: this.props.combatant.speed !== "" ? "" : "none" }}>
                                <b>speed</b> {this.props.combatant.speed}
                            </div>
                            <div className="section" style={{ display: this.props.combatant.senses !== "" ? "" : "none" }}>
                                <b>senses</b> {this.props.combatant.senses}
                            </div>
                            <div className="section" style={{ display: this.props.combatant.languages !== "" ? "" : "none" }}>
                                <b>languages</b> {this.props.combatant.languages}
                            </div>
                            <div className="section" style={{ display: this.props.combatant.equipment !== "" ? "" : "none" }}>
                                <b>equipment</b> {this.props.combatant.equipment}
                            </div>
                            <div className="section">
                                <b>challenge</b> {challenge(this.props.combatant.challenge)} ({experience(this.props.combatant.challenge)} xp)
                            </div>
                            <div className="divider"></div>
                            <TraitsPanel combatant={this.props.combatant} />
                        </div>
                    </div>
                );
            }
            if (this.props.mode.indexOf("template") !== -1) {
                if (this.props.mode.indexOf("overview") !== -1) {
                    stats = (
                        <div>
                            <div className="section">
                                <div>{this.description()}</div>
                            </div>
                            <div className="section">
                                <div><b>challenge</b> {challenge(this.props.combatant.challenge)} ({experience(this.props.combatant.challenge)} xp)</div>
                            </div>
                            <div className="section">
                                <b>speed</b> {this.props.combatant.speed || "-"}
                            </div>
                            <div className="section">
                                <b>senses</b> {this.props.combatant.senses || "-"}
                            </div>
                            <div className="section">
                                <b>languages</b> {this.props.combatant.languages || "-"}
                            </div>
                            <div className="section">
                                <b>equipment</b> {this.props.combatant.equipment || "-"}
                            </div>
                        </div>
                    );
                }
                if (this.props.mode.indexOf("abilities") !== -1) {
                    stats = (
                        <div>
                            <div className="section">
                                <AbilityScorePanel combatant={this.props.combatant} />
                            </div>
                            <div className="section">
                                <b>saving throws</b> {this.props.combatant.savingThrows || "-"}
                            </div>
                            <div className="section">
                                <b>skills</b> {this.props.combatant.skills || "-"}
                            </div>
                        </div>
                    );
                }
                if (this.props.mode.indexOf("combat") !== -1) {
                    stats = (
                        <div>
                            <div className="section">
                                <b>ac</b> {this.props.combatant.ac}
                            </div>
                            <div className="section">
                                <b>hp</b> {this.props.combatant.hitDice !== "" ? this.props.combatant.hpMax + " (" + this.props.combatant.hitDice + "d" + hitDieType(this.props.combatant.size) + ")" : this.props.combatant.hpMax}
                            </div>
                            <div className="section">
                                <b>damage immunity</b> {this.props.combatant.damage.immune || "-"}
                            </div>
                            <div className="section">
                                <b>damage resistance</b> {this.props.combatant.damage.resist || "-"}
                            </div>
                            <div className="section">
                                <b>damage vulnerability</b> {this.props.combatant.damage.vulnerable || "-"}
                            </div>
                            <div className="section">
                                <b>condition immunities</b> {this.props.combatant.conditionImmunities || "-"}
                            </div>
                        </div>
                    );
                }
                if (this.props.mode.indexOf("actions") !== -1) {
                    stats = (
                        <TraitsPanel
                            combatant={this.props.combatant}
                            template={true}
                            copyTrait={trait => this.props.copyTrait(trait)}
                        />
                    );
                }
            }

            var toggle = null;
            if ((this.props.mode.indexOf("combat") !== -1) && this.props.combatant.current) {
                // Don't show toggle button for current combatant
            } else if (this.props.mode.indexOf("template") !== -1) {
                // Don't show toggle button for template
            } else {
                var imageStyle = this.state.showDetails ? "image rotate" : "image";
                toggle = <img className={imageStyle} src="content/down-arrow.svg" onClick={() => this.toggleDetails()} />
            }

            return (
                <div className="card monster">
                    <div className="heading">
                        <div className="title">{this.props.combatant.displayName || this.props.combatant.name || "unnamed monster"}</div>
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