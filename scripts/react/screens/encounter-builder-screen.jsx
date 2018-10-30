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
                    <EncounterCard
                        key="info"
                        selection={this.props.selection}
                        parties={this.props.parties}
                        changeValue={(type, value) => this.props.changeValue(this.props.selection, type, value)}
                        removeEncounter={() => this.props.removeEncounter()}
                        getMonster={(monsterName, monsterGroupName) => this.props.getMonster(monsterName, monsterGroupName)}
                    />
                );

                this.props.selection.slots.forEach(slot => {
                    var monster = this.props.getMonster(slot.monsterName, slot.monsterGroupName);
                    if (monster) {
                        encounterCards.push(
                            <MonsterCard
                                key={monster.id}
                                combatant={monster}
                                slot={slot}
                                mode={"view encounter"}
                                nudgeValue={(slot, type, delta) => this.props.nudgeValue(slot, type, delta)}
                                removeEncounterSlot={slot => this.props.removeEncounterSlot(slot)}
                            />
                        );
                    } else {
                        var index = this.props.selection.slots.indexOf(slot);
                        var error = "unknown monster: " + slot.monsterName + " in group " + slot.monsterGroupName;
                        encounterCards.push(
                            <ErrorCard
                                key={index}
                                getContent={() => <div className="section">{error}</div>}
                            />
                        );
                    }
                });
                if (this.props.selection.slots.length === 0) {
                    encounterCards.push(
                        <InfoCard
                            key={"empty"}
                            getContent={() => <div className="section">no monsters</div>}
                        />
                    );
                }
            }

            var libraryCards = [];
            libraryCards.push(
                <FilterCard
                    key="filter"
                    filter={this.state.filter}
                    changeValue={(type, value) => this.changeFilterValue(type, value)}
                    nudgeValue={(type, delta) => this.nudgeFilterValue(type, delta)}
                    resetFilter={() => this.resetFilter()}
                />
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
                        <InfoCard
                            key={monster.id}
                            getHeading={() => <div className="heading">{title}</div>}
                            getContent={() => <div className="section">already in encounter</div>}
                        />
                    );
                } else {
                    libraryCards.push(
                        <MonsterCard
                            key={monster.id}
                            combatant={monster}
                            mode={"view encounter"}
                            addEncounterSlot={combatant => this.props.addEncounterSlot(combatant)}
                        />
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
                <div className="encounter-builder">
                    <div className="left-pane scrollable">
                        {help}
                        <div className="group">
                            <button onClick={() => this.props.addEncounter("new encounter")}>add a new encounter</button>
                        </div>
                        {encounters}
                    </div>
                    <div className="right-pane scrollable">
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