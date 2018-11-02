class EncounterBuilderScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            filter: {
                name: "",
                challengeMin: 0,
                challengeMax: 5,
                category: "all types",
                size: "all sizes"
            }
        };
    }

    inEncounter(monster) {
        var result = false;

        var group = getMonsterGroup(monster, this.props.library);

        this.props.selection.slots.forEach(slot => {
            if ((slot.monsterGroupName === group.name) && (slot.monsterName === monster.name)) {
                result = true;
            }
        });

        return result;
    }

    matchMonster(monster) {
        if (monster.challenge < this.state.filter.challengeMin) {
            return false;
        }

        if (monster.challenge > this.state.filter.challengeMax) {
            return false;
        }

        if (this.state.filter.name !== "") {
            if (!match(this.state.filter.name, monster.name)) {
                return false;
            }
        }

        if (this.state.filter.category !== "all types") {
            if (monster.category !== this.state.filter.category) {
                return false;
            }
        }

        if (this.state.filter.size !== "all sizes") {
            if (monster.size !== this.state.filter.size) {
                return false;
            }
        }

        return true;
    }

    changeFilterValue(type, value) {
        this.state.filter[type] = value;
        this.setState({
            filter: this.state.filter
        });
    }

    nudgeFilterValue(type, delta) {
        var value = nudgeChallenge(this.state.filter[type], delta);
        this.changeFilterValue(type, value);
    }

    resetFilter() {
        this.setState({
            filter: {
                name: "",
                challengeMin: 0,
                challengeMax: 5,
                category: "all types",
                size: "all sizes"
            }
        });
    }

    render() {
        try {
            var help = null;
            if (this.props.showHelp) {
                help = (
                    <EncounterBuilderCard encounters={this.props.encounters} />
                );
            }

            var encounters = [];
            for (var n = 0; n !== this.props.encounters.length; ++n) {
                var encounter = this.props.encounters[n];
                encounters.push(
                    <EncounterListItem
                        key={encounter.id}
                        encounter={encounter}
                        selected={encounter === this.props.selection}
                        setSelection={encounter => this.props.selectEncounter(encounter)}
                    />
                );
            };

            var encounterCards = [];

            if (this.props.selection) {
                encounterCards.push(
                    <div className="column column-block" key="info">
                        <EncounterCard
                            selection={this.props.selection}
                            parties={this.props.parties}
                            changeValue={(type, value) => this.props.changeValue(this.props.selection, type, value)}
                            removeEncounter={() => this.props.removeEncounter()}
                            getMonster={(monsterName, monsterGroupName) => this.props.getMonster(monsterName, monsterGroupName)}
                        />
                    </div>
                );

                this.props.selection.slots.forEach(slot => {
                    var monster = this.props.getMonster(slot.monsterName, slot.monsterGroupName);
                    if (monster) {
                        encounterCards.push(
                            <div className="column column-block" key={monster.id}>
                                <MonsterCard
                                    combatant={monster}
                                    slot={slot}
                                    mode={"view encounter"}
                                    nudgeValue={(slot, type, delta) => this.props.nudgeValue(slot, type, delta)}
                                    removeEncounterSlot={slot => this.props.removeEncounterSlot(slot)}
                                />
                            </div>
                        );
                    } else {
                        var index = this.props.selection.slots.indexOf(slot);
                        var error = "unknown monster: " + slot.monsterName + " in group " + slot.monsterGroupName;
                        encounterCards.push(
                            <div className="column column-block" key={index}>
                                <ErrorCard getContent={() => <div className="section">{error}</div>} />
                            </div>
                        );
                    }
                });
                if (this.props.selection.slots.length === 0) {
                    encounterCards.push(
                        <div className="column column-block" key="empty">
                            <InfoCard getContent={() => <div className="section">no monsters</div>} />
                        </div>
                    );
                }
            }

            var libraryCards = [];
            libraryCards.push(
                <div className="column column-block" key="filter">
                    <FilterCard
                        filter={this.state.filter}
                        changeValue={(type, value) => this.changeFilterValue(type, value)}
                        nudgeValue={(type, delta) => this.nudgeFilterValue(type, delta)}
                        resetFilter={() => this.resetFilter()}
                    />
                </div>
            );

            var monsters = [];
            if (this.props.selection) {
                this.props.library.forEach(group => {
                    group.monsters.forEach(monster => {
                        if (this.matchMonster(monster)) {
                            monsters.push(monster);
                        }
                    });
                });
                monsters.sort((a, b) => {
                    if (a.name < b.name) return -1;
                    if (a.name > b.name) return 1;
                    return 0;
                });
            }
            monsters.forEach(monster => {
                if (this.inEncounter(monster)) {
                    var title = monster.name;
                    libraryCards.push(
                        <div className="column column-block" key={monster.id}>
                            <InfoCard
                                getHeading={() => <div className="heading">{title}</div>}
                                getContent={() => <div className="section">already in encounter</div>}
                            />
                        </div>
                    );
                } else {
                    libraryCards.push(
                        <div className="column column-block" key={monster.id}>
                            <MonsterCard
                                key={monster.id}
                                combatant={monster}
                                mode={"view encounter"}
                                addEncounterSlot={combatant => this.props.addEncounterSlot(combatant)}
                            />
                        </div>
                    );
                }
            });

            var name = null;
            if (this.props.selection) {
                name = this.props.selection.name;
                if (!name) {
                    name = "unnamed encounter";
                }
            }

            return (
                <div className="encounter-builder row collapse">
                    <div className="columns small-6 medium-4 large-2 scrollable">
                        {help}
                        <div className="group">
                            <button onClick={() => this.props.addEncounter("new encounter")}>add a new encounter</button>
                        </div>
                        {encounters}
                    </div>
                    <div className="columns small-6 medium-8 large-10 scrollable">
                        <CardGroup
                            content={encounterCards}
                            heading={name}
                            showClose={this.props.selection !== null}
                            close={() => this.props.selectEncounter(null)}
                        />
                        <CardGroup
                            heading="monster library"
                            content={libraryCards}
                            hidden={!this.props.selection}
                            showToggle={true}
                        />
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}