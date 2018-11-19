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

    getMonsterCards(slots, waveID) {
        var cards = [];

        slots.forEach(slot => {
            var monster = this.props.getMonster(slot.monsterName, slot.monsterGroupName);
            if (monster) {
                cards.push(
                    <div className="column" key={monster.id}>
                        <MonsterCard
                            combatant={monster}
                            slot={slot}
                            encounter={this.props.selection}
                            mode={"view encounter"}
                            nudgeValue={(slot, type, delta) => this.props.nudgeValue(slot, type, delta)}
                            removeEncounterSlot={slot => this.props.removeEncounterSlot(slot, waveID)}
                        />
                    </div>
                );
            } else {
                var index = slots.indexOf(slot);
                var error = "unknown monster: " + slot.monsterName + " in group " + slot.monsterGroupName;
                cards.push(
                    <div className="column" key={index}>
                        <ErrorCard
                            getContent={() => <div className="section">{error}</div>}
                        />
                    </div>
                );
            }
        });

        if (slots.length === 0) {
            cards.push(
                <div className="column" key="empty">
                    <InfoCard getContent={() => <div className="section">no monsters</div>} />
                </div>
            );
        }

        return cards;
    }

    getLibrarySection() {
        if (!this.props.selection) {
            return null;
        }

        var libraryCards = [];
        libraryCards.push(
            <div className="column" key="filter">
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
            // TODO: Add a note if the monster is already in the encounter or one of its waves
            
            libraryCards.push(
                <div className="column" key={monster.id}>
                    <MonsterCard
                        key={monster.id}
                        combatant={monster}
                        encounter={this.props.selection}
                        library={this.props.library}
                        mode={"view encounter"}
                        addEncounterSlot={(combatant, waveID) => this.props.addEncounterSlot(combatant, waveID)}
                    />
                </div>
            );
        });

        return (
            <CardGroup
                heading="monster library"
                content={libraryCards}
                showToggle={true}
            />
        );
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

            var encounterName = null;
            var encounterCards = [];
            var waves = [];

            if (this.props.selection) {
                encounterName = this.props.selection.name || "unnamed encounter";

                encounterCards.push(
                    <div className="column" key="info">
                        <EncounterCard
                            selection={this.props.selection}
                            parties={this.props.parties}
                            changeValue={(type, value) => this.props.changeValue(this.props.selection, type, value)}
                            addWave={() => this.props.addWave()}
                            removeEncounter={() => this.props.removeEncounter()}
                            getMonster={(monsterName, monsterGroupName) => this.props.getMonster(monsterName, monsterGroupName)}
                        />
                    </div>
                );

                this.getMonsterCards(this.props.selection.slots, null)
                    .forEach(card => encounterCards.push(card));
                    
                waves = this.props.selection.waves.map(wave => {
                    var waveCards = [];
                    waveCards.push(
                        <div className="column" key="info">
                            <WaveCard
                                wave={wave}
                                removeWave={wave => this.props.removeWave(wave)}
                                changeValue={(wave, field, value) => this.props.changeValue(wave, field, value)}
                            />
                        </div>
                    );

                    this.getMonsterCards(wave.slots, wave.id)
                        .forEach(card => waveCards.push(card));

                    return (
                        <CardGroup
                            key={wave.id}
                            heading={wave.name || "unnamed wave"}
                            content={waveCards}
                            showToggle={true}
                        />
                    );
                });
            }

            return (
                <div className="encounter-builder row collapse">
                    <div className="columns small-6 medium-4 large-3 scrollable">
                        {help}
                        <div className="group">
                            <button onClick={() => this.props.addEncounter("new encounter")}>add a new encounter</button>
                        </div>
                        {encounters}
                    </div>
                    <div className="columns small-6 medium-8 large-9 scrollable">
                        <CardGroup
                            content={encounterCards}
                            heading={encounterName}
                            showClose={this.props.selection !== null}
                            close={() => this.props.selectEncounter(null)}
                        />
                        {waves}
                        {this.getLibrarySection()}
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}