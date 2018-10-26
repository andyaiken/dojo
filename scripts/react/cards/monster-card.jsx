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

    render() {
        try {
            var style = "card monster";
            if (this.props.mode.indexOf("editor") !== -1) {
                style += " wide";
            }

            var categories = ["aberration", "beast", "celestial", "construct", "dragon", "elemental", "fey", "fiend", "giant", "humanoid", "monstrosity", "ooze", "plant", "undead"];
            var catOptions = categories.map(cat => { return { id: cat, text: cat }; });

            var sizes = ["tiny", "small", "medium", "large", "huge", "gargantuan"];
            var sizeOptions = sizes.map(size => { return { id: size, text: size }; });

            var options = [];
            if (this.props.mode.indexOf("editor") !== -1) {
                // None
            }
            if (this.props.mode.indexOf("view") !== -1) {
                if (this.props.mode.indexOf("editable") !== -1) {
                    options.push(<button key="edit" onClick={() => this.props.editMonster(this.props.combatant)}>edit monster</button>);
                    options.push(<button key="clone" onClick={() => this.props.cloneMonster(this.props.combatant)}>clone monster</button>);

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
                            select={optionID => this.props.moveToGroup(this.props.combatant, optionID)}
                        />
                    );

                    options.push(<ConfirmButton key="remove" text="delete monster" callback={() => this.props.removeCombatant(this.props.combatant)} />);
                } else {
                    if (!this.props.slot) {
                        options.push(<button key="add" onClick={() => this.props.addEncounterSlot(this.props.combatant)}>add to encounter</button>);
                    } else {
                        options.push(<button key="remove" onClick={() => this.props.removeEncounterSlot(this.props.slot)}>remove from encounter</button>);
                    }
                }
            }
            if (this.props.mode.indexOf("combat") !== -1) {
                if (this.props.combatant.pending && !this.props.combatant.active && !this.props.combatant.defeated) {
                    options.push(<button key="makeAdd" onClick={() => this.props.makeActive(this.props.combatant)}>add to encounter</button>);
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
                }
            }

            var stats = null;
            if (this.props.mode.indexOf("editor") !== -1) {
                stats = (
                    <div className="stats">
                        <div className="section">
                            <div className="input-label">name:</div>
                            <input type="text" value={this.props.combatant.name} onChange={event => this.props.changeValue(this.props.combatant, "name", event.target.value)} />
                        </div>
                        <div className="column">
                            <div className="section">
                                <div className="input-label">size:</div>
                                <Dropdown
                                    options={sizeOptions}
                                    selectedID={this.props.combatant.size}
                                    select={optionID => this.props.changeTrait(this.props.combatant, "size", optionID)}
                                />
                            </div>
                        </div>
                        <div className="column-divider"></div>
                        <div className="column">
                            <div className="section">
                                <div className="input-label">category:</div>
                                <Dropdown
                                    options={catOptions}
                                    selectedID={this.props.combatant.category}
                                    select={optionID => this.props.changeTrait(this.props.combatant, "category", optionID)}
                                />
                            </div>
                        </div>
                        <div className="column-divider"></div>
                        <div className="column">
                            <div className="section">
                                <div className="input-label">tag:</div>
                                <input type="text" value={this.props.combatant.tag} onChange={event => this.props.changeValue(this.props.combatant, "tag", event.target.value)} />
                            </div>
                        </div>
                        <div className="divider"></div>
                        <AbilityScorePanel
                            edit={true}
                            combatant={this.props.combatant}
                            nudgeValue={(source, type, delta) => this.props.nudgeValue(source, type, delta)}
                        />
                        <div className="divider"></div>
                        <div className="column">
                            <div className="section">
                                <div className="input-label">alignment:</div>
                                <input type="text" value={this.props.combatant.alignment} onChange={event => this.props.changeValue(this.props.combatant, "alignment", event.target.value)} />
                                <div className="input-label">speed:</div>
                                <input type="text" value={this.props.combatant.speed} onChange={event => this.props.changeValue(this.props.combatant, "speed", event.target.value)} />
                                <div className="input-label">saving throws:</div>
                                <input type="text" value={this.props.combatant.savingThrows} onChange={event => this.props.changeValue(this.props.combatant, "savingThrows", event.target.value)} />
                                <div className="input-label">skills:</div>
                                <input type="text" value={this.props.combatant.skills} onChange={event => this.props.changeValue(this.props.combatant, "skills", event.target.value)} />
                                <div className="input-label">senses:</div>
                                <input type="text" value={this.props.combatant.senses} onChange={event => this.props.changeValue(this.props.combatant, "senses", event.target.value)} />
                                <div className="input-label">languages:</div>
                                <input type="text" value={this.props.combatant.languages} onChange={event => this.props.changeValue(this.props.combatant, "languages", event.target.value)} />
                                <div className="input-label">equipment:</div>
                                <input type="text" value={this.props.combatant.equipment} onChange={event => this.props.changeValue(this.props.combatant, "equipment", event.target.value)} />
                            </div>
                        </div>
                        <div className="column-divider"></div>
                        <div className="column">
                            <Spin
                                source={this.props.combatant}
                                name="challenge"
                                label="challenge"
                                display={value => challenge(value)}
                                nudgeValue={delta => this.props.nudgeValue(this.props.combatant, "challenge", delta)}
                            />
                            <Spin
                                source={this.props.combatant}
                                name="ac"
                                label="armor class"
                                nudgeValue={delta => this.props.nudgeValue(this.props.combatant, "ac", delta)}
                            />
                            <Spin
                                source={this.props.combatant}
                                name="hitDice"
                                label="hit dice"
                                nudgeValue={delta => this.props.nudgeValue(this.props.combatant, "hitDice", delta)}
                            />
                            <div className="section centered">
                                <div><b>hit points</b> {this.props.combatant.hpMax} ({this.props.combatant.hitDice}d{hitDieType(this.props.combatant.size)})</div>
                            </div>
                            <div className="divider"></div>
                            <div className="section">
                                <div className="input-label">damage resistances:</div>
                                <input type="text" value={this.props.combatant.damage.resist} onChange={event => this.props.changeValue(this.props.combatant, "damage.resist", event.target.value)} />
                                <div className="input-label">damage vulnerabilities:</div>
                                <input type="text" value={this.props.combatant.damage.vulnerable} onChange={event => this.props.changeValue(this.props.combatant, "damage.vulnerable", event.target.value)} />
                                <div className="input-label">damage immunities:</div>
                                <input type="text" value={this.props.combatant.damage.immune} onChange={event => this.props.changeValue(this.props.combatant, "damage.immune", event.target.value)} />
                                <div className="input-label">condition immunities:</div>
                                <input type="text" value={this.props.combatant.conditionImmunities} onChange={event => this.props.changeValue(this.props.combatant, "conditionImmunities", event.target.value)} />
                            </div>
                        </div>
                        <div className="column-divider"></div>
                        <div className="column">
                            <TraitsPanel
                                combatant={this.props.combatant}
                                edit={true}
                                addTrait={type => this.props.addTrait(this.props.combatant, type)}
                                removeTrait={trait => this.props.removeTrait(this.props.combatant, trait)}
                                changeTrait={(trait, type, value) => this.props.changeTrait(trait, type, value)}
                            />
                        </div>
                    </div>
                );
            }
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
                            <AbilityScorePanel combatant={this.props.combatant} />
                            <div className="divider"></div>
                            <div className="section">
                                <div style={{ display: this.props.combatant.hpMax !== "" ? "" : "none" }}>
                                    <b>hp</b> {this.props.combatant.hitDice !== "" ? this.props.combatant.hpMax + " (" + this.props.combatant.hitDice + "d" + hitDieType(this.props.combatant.size) + ")" : this.props.combatant.hpMax}
                                </div>
                                <div style={{ display: this.props.combatant.damage.immune !== "" ? "" : "none" }}>
                                    <b>damage immunity</b> {this.props.combatant.damage.immune}
                                </div>
                                <div style={{ display: this.props.combatant.damage.resist !== "" ? "" : "none" }}>
                                    <b>damage resistance</b> {this.props.combatant.damage.resist}
                                </div>
                                <div style={{ display: this.props.combatant.damage.vulnerable !== "" ? "" : "none" }}>
                                    <b>damage vulnerability</b> {this.props.combatant.damage.vulnerable}
                                </div>
                                <div style={{ display: this.props.combatant.conditionImmunities !== "" ? "" : "none" }}>
                                    <b>condition immunities</b> {this.props.combatant.conditionImmunities}
                                </div>
                            </div>
                            <div className="section">
                                <div style={{ display: this.props.combatant.speed !== "" ? "" : "none" }}>
                                    <b>speed</b> {this.props.combatant.speed}
                                </div>
                                <div style={{ display: this.props.combatant.savingThrows !== "" ? "" : "none" }}>
                                    <b>saving throws</b> {this.props.combatant.savingThrows}
                                </div>
                                <div style={{ display: this.props.combatant.skills !== "" ? "" : "none" }}>
                                    <b>skills</b> {this.props.combatant.skills}
                                </div>
                                <div style={{ display: this.props.combatant.senses !== "" ? "" : "none" }}>
                                    <b>senses</b> {this.props.combatant.senses}
                                </div>
                                <div style={{ display: this.props.combatant.languages !== "" ? "" : "none" }}>
                                    <b>languages</b> {this.props.combatant.languages}
                                </div>
                                <div style={{ display: this.props.combatant.equipment !== "" ? "" : "none" }}>
                                    <b>equipment</b> {this.props.combatant.equipment}
                                </div>
                            </div>
                            <TraitsPanel combatant={this.props.combatant} />
                        </div>
                    );
                }

                stats = (
                    <div className="stats">
                        <div className="section">
                            <div><i>{this.description()}</i></div>
                        </div>
                        <div className="section">
                            <div><b>challenge</b> {challenge(this.props.combatant.challenge)} ({experience(this.props.combatant.challenge)} xp)</div>
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
                        <HitPointGauge combatant={this.props.combatant} />
                        <div className="section key-stats">
                            <div className="key-stat toggle" onClick={() => this.toggleInit()}>
                                <div className="stat-heading">init</div>
                                <div className="stat-value">{this.props.combatant.initiative}</div>
                            </div>
                            <div className="key-stat">
                                <div className="stat-heading">ac</div>
                                <div className="stat-value">{this.props.combatant.ac}</div>
                            </div>
                            <div className="key-stat toggle" onClick={() => this.toggleHP()}>
                                <div className="stat-heading">hp</div>
                                <div className="stat-value">{hp}</div>
                            </div>
                        </div>
                        <div className="divider"></div>
                        <div style={{ display: this.state.showInit ? "" : "none" }}>
                            <Spin
                                source={this.props.combatant}
                                name="initiative"
                                label="initiative"
                                factors={[1, 5]}
                                nudgeValue={delta => this.props.nudgeValue(this.props.combatant, "initiative", delta)}
                            />
                            <div className="divider"></div>
                        </div>
                        <div style={{ display: this.state.showHP ? "" : "none" }}>
                            <Spin
                                source={this.props.combatant}
                                name="hp"
                                label="hit points"
                                factors={[1, 5]}
                                nudgeValue={delta => this.props.nudgeValue(this.props.combatant, "hp", delta)}
                            />
                            <Spin
                                source={this.props.combatant}
                                name="hpTemp"
                                label="temp hp"
                                factors={[1, 5]}
                                nudgeValue={delta => this.props.nudgeValue(this.props.combatant, "hpTemp", delta)}
                            />
                            <div className="section">
                                <div style={{ display: this.props.combatant.damage.immune !== "" ? "" : "none" }}>
                                    <b>damage immunity</b> {this.props.combatant.damage.immune}
                                </div>
                                <div style={{ display: this.props.combatant.damage.resist !== "" ? "" : "none" }}>
                                    <b>damage resistance</b> {this.props.combatant.damage.resist}
                                </div>
                                <div style={{ display: this.props.combatant.damage.vulnerable !== "" ? "" : "none" }}>
                                    <b>damage vulnerability</b> {this.props.combatant.damage.vulnerable}
                                </div>
                            </div>
                            <div className="divider"></div>
                        </div>
                        <AbilityScorePanel combatant={this.props.combatant} />
                        <div className="divider"></div>
                        <ConditionsPanel
                            combatant={this.props.combatant}
                            addCondition={condition => this.props.addCondition(this.props.combatant, condition)}
                            removeCondition={condition => this.props.removeCondition(this.props.combatant, condition)}
                            nudgeConditionValue={(condition, type, delta) => this.props.nudgeConditionValue(condition, type, delta)}
                        />
                        <div style={{ display: (this.state.showDetails || this.props.combatant.current) ? "" : "none" }}>
                            <div className="divider"></div>
                            <div className="section">
                                <div><i>{this.description()}</i></div>
                            </div>
                            <div className="section">
                                <div><b>challenge</b> {challenge(this.props.combatant.challenge)} ({experience(this.props.combatant.challenge)} xp)</div>
                                <div style={{ display: this.props.combatant.speed !== "" ? "" : "none" }}>
                                    <b>speed</b> {this.props.combatant.speed}
                                </div>
                                <div style={{ display: this.props.combatant.savingThrows !== "" ? "" : "none" }}>
                                    <b>saving throws</b> {this.props.combatant.savingThrows}
                                </div>
                                <div style={{ display: this.props.combatant.skills !== "" ? "" : "none" }}>
                                    <b>skills</b> {this.props.combatant.skills}
                                </div>
                                <div style={{ display: this.props.combatant.senses !== "" ? "" : "none" }}>
                                    <b>senses</b> {this.props.combatant.senses}
                                </div>
                                <div style={{ display: this.props.combatant.languages !== "" ? "" : "none" }}>
                                    <b>languages</b> {this.props.combatant.languages}
                                </div>
                                <div style={{ display: this.props.combatant.equipment !== "" ? "" : "none" }}>
                                    <b>equipment</b> {this.props.combatant.equipment}
                                </div>
                                <div style={{ display: this.props.combatant.conditionImmunities !== "" ? "" : "none" }}>
                                    <b>conditionImmunities</b> {this.props.combatant.conditionImmunities}
                                </div>
                            </div>
                            <TraitsPanel combatant={this.props.combatant} />
                        </div>
                    </div>
                );
            }

            var name = this.props.combatant.name;
            if (!name) {
                name = "unnamed monster";
            }
            if (this.props.mode.indexOf("editor") !== -1) {
                name = "monster editor"
            }

            var toggle = null;
            if ((this.props.mode.indexOf("editor") === -1) && !this.props.combatant.current) {
                var imageStyle = this.state.showDetails ? "image rotate" : "image";
                toggle = <img className={imageStyle} src="content/down-arrow.svg" onClick={() => this.toggleDetails()} />
            }
            if (this.props.mode.indexOf("editor") !== -1) {
                toggle = <img className="image" src="content/close-white.svg" onClick={() => this.props.closeEditor()} />
            }

            return (
                <div className={style}>
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