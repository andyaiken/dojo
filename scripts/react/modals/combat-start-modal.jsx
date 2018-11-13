class CombatStartModal extends React.Component {
    constructor(props) {
        super();

        this.state = {
            combat: props.combat
        }
    }

    setParty(partyID) {
        this.state.combat.partyID = partyID;
        this.setState({
            combat: this.state.combat
        }, () => this.props.notify());
    }

    setEncounter(encounterID) {
        this.state.combat.encounterID = encounterID;
        var enc = this.props.encounters.find(enc => enc.id === encounterID);
        this.state.combat.monsterNames = getMonsterNames(enc);
        this.setState({
            combat: this.state.combat
        }, () => this.props.notify());
    }

    setPartyInitMode(mode) {
        this.state.combat.partyInitMode = mode;
        this.setState({
            combat: this.state.combat
        });
    }

    setEncounterInitMode(mode) {
        this.state.combat.encounterInitMode = mode;
        this.setState({
            combat: this.state.combat
        });
    }

    changeName(slotID, index, name) {
        var slot = this.state.combat.monsterNames.find(s => s.id === slotID);
        if (slot) {
            slot.names[index] = name;
            this.setState({
                combat: this.state.combat
            });
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    getPartySection() {
        if (this.props.parties.length === 0) {
            return (
                <div className="text">you have not defined any pcs</div>
            )
        }

        var partyOptions = this.props.parties.map(party => {
            return {
                id: party.id,
                text: party.name || "unnamed party"
            }
        });

        var partyContent = null;
        if (this.state.combat.partyID) {
            var selectedParty = this.props.parties.find(p => p.id === this.state.combat.partyID);
            var pcs = selectedParty.pcs.filter(pc => pc.active);

            var pcSections = pcs.map(pc => <li key={pc.id}>{pc.name || "unnamed pc"}</li>);
            if (pcSections.length === 0) {
                pcSections.push(
                    <li key={"empty"}>no pcs</li>
                );
            }
    
            partyContent = (
                <div>
                    <ul>{pcSections}</ul>
                </div>
            );
        }

        return (
            <div>
                <div className="heading">party</div>
                <Dropdown
                    options={partyOptions}
                    placeholder="select party..."
                    selectedID={this.state.combat.partyID}
                    select={optionID => this.setParty(optionID)}
                />
                {partyContent}
            </div>
        );
    }

    getDifficultySection() {
        if (!this.state.combat.partyID || !this.state.combat.encounterID) {
            return (
                <div>
                    <div className="subheading">encounter difficulty</div>
                    <div className="section">select an encounter on the right to see difficulty information</div>
                </div>
            );
        }

        var selectedEncounter = this.props.encounters.find(e => e.id === this.state.combat.encounterID);
        var selectedParty = this.props.parties.find(p => p.id === this.state.combat.partyID);

        var monsterCount = 0;
        var monsterXp = 0;
        selectedEncounter.slots.forEach(slot => {
            monsterCount += slot.count;
            var monster = this.props.getMonster(slot.monsterName, slot.monsterGroupName);
            if (monster) {
                monsterXp += experience(monster.challenge) * slot.count;
            }
        });

        var adjustedXp = monsterXp * experienceFactor(monsterCount);

        var xpEasy = 0;
        var xpMedium = 0;
        var xpHard = 0;
        var xpDeadly = 0;

        var pcs = selectedParty.pcs.filter(pc => pc.active);
        pcs.forEach(pc => {
            xpEasy += pcExperience(pc.level, "easy");
            xpMedium += pcExperience(pc.level, "medium");
            xpHard += pcExperience(pc.level, "hard");
            xpDeadly += pcExperience(pc.level, "deadly");
        });
    
        var difficulty = null;
        var adjustedDifficulty = null;
        if (adjustedXp > 0) {
            difficulty = "trivial";
            if (adjustedXp >= xpEasy) {
                difficulty = "easy";
            }
            if (adjustedXp >= xpMedium) {
                difficulty = "medium";
            }
            if (adjustedXp >= xpHard) {
                difficulty = "hard";
            }
            if (adjustedXp >= xpDeadly) {
                difficulty = "deadly";
            }

            if ((pcs.length < 3) || (pcs.length > 5)) {
                var small = pcs.length < 3;
                switch (difficulty) {
                    case "trivial":
                        adjustedDifficulty = small ? "easy" : "trivial";
                        break;
                    case "easy":
                        adjustedDifficulty = small ? "medium" : "trivial";
                        break;
                    case "medium":
                        adjustedDifficulty = small ? "hard" : "easy";
                        break;
                    case "hard":
                        adjustedDifficulty = small ? "deadly" : "medium";
                        break;
                    case "deadly":
                        adjustedDifficulty = small ? "deadly" : "hard";
                        break;
                }
            }
        }

        return (
            <div>
                <div className="subheading">xp thresholds for this party</div>
                <div className="table">
                    <div>
                        <div className="cell four"><b>easy</b></div>
                        <div className="cell four"><b>medium</b></div>
                        <div className="cell four"><b>hard</b></div>
                        <div className="cell four"><b>deadly</b></div>
                    </div>
                    <div>
                        <div className="cell four">{xpEasy} xp</div>
                        <div className="cell four">{xpMedium} xp</div>
                        <div className="cell four">{xpHard} xp</div>
                        <div className="cell four">{xpDeadly} xp</div>
                    </div>
                </div>
                <div className="subheading">encounter xp value</div>
                <div className="section">
                    xp for this encounter
                    <div className="right">{monsterXp} xp</div>
                </div>
                <div className="section">
                    effective xp for number of monsters ({monsterCount})
                    <div className="right">{adjustedXp || monsterXp} xp</div>
                </div>
                <div className="subheading">encounter difficulty</div>
                <div className="section">
                    difficulty for this party
                    <div className="right">{difficulty}</div>
                </div>
                <div className="section">
                    effective difficulty for number of pcs ({pcs.length})
                    <div className="right"><b>{adjustedDifficulty || difficulty}</b></div>
                </div>
            </div>
        );
    }

    getEncounterSection() {
        if (this.props.encounters.length === 0) {
            return (
                <div key="no-encounters" className="text">you have not built any encounters</div>
            );
        }

        var encounterOptions = this.props.encounters.map(encounter => {
            return {
                id: encounter.id,
                text: encounter.name || "unnamed encounter"
            }
        });

        var encounterContent = null;
        if (this.state.combat.encounterID) {
            var selectedEncounter = this.props.encounters.find(e => e.id === this.state.combat.encounterID);
            var monsters = selectedEncounter.slots.map(slot => {
                var name = slot.monsterName || "unnamed monster";
                if (slot.count > 1) {
                    name += " x" + slot.count;
                }
                return (
                    <li key={slot.id}>{name}</li>
                );
            });
            if (monsters.length === 0) {
                monsters.push(
                    <li key={"empty"}>no monsters</li>
                );
            }
            var initOptions = [
                {
                    id: "manual",
                    text: "enter manually"
                },
                {
                    id: "individual",
                    text: "roll individually"
                },
                {
                    id: "group",
                    text: "roll in groups"
                }
            ]
            var names = this.state.combat.monsterNames.map(slotNames => {
                var slot = selectedEncounter.slots.find(s => s.id === slotNames.id);
                var inputs = [];
                for (var n = 0; n !== slotNames.names.length; ++n) {
                    inputs.push(
                        <div key={n}>
                            <MonsterName
                                value={slotNames.names[n]}
                                slotID={slot.id}
                                index={n}
                                changeName={(slotID, index, value) => this.changeName(slotID, index, value)}
                            />
                        </div>
                    );
                }
                return (
                    <div key={slotNames.id} className="row">
                        <div className="column small-6 medium-6 large-6">
                            <div className="section">{slot.monsterName}</div>
                        </div>
                        <div className="column small-6 medium-6 large-6">
                            {inputs}
                        </div>
                    </div>
                );
            });

            encounterContent = (
                <div>
                    <ul>{monsters}</ul>
                    <div className="subheading">initiative</div>
                    <Selector
                        options={initOptions}
                        selectedID={this.state.combat.encounterInitMode}
                        select={optionID => this.setEncounterInitMode(optionID)}
                    />
                    <div className="subheading">names</div>
                    <div>{names}</div>
                </div>
            );
        }

        return (
            <div>
                <div className="heading">encounter</div>
                <Dropdown
                    options={encounterOptions}
                    placeholder="select encounter..."
                    selectedID={this.state.combat.encounterID}
                    select={optionID => this.setEncounter(optionID)}
                />
                {encounterContent}
            </div>
        )
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    render() {
        try {
            return (
                <div className="row" style={{ height: "100%", margin: "0 -15px" }}>
                    <div className="column small-6 medium-6 large-6 scrollable">
                        {this.getPartySection()}
                        {this.getDifficultySection()}
                    </div>
                    <div className="column small-6 medium-6 large-6 scrollable">
                        {this.getEncounterSection()}
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}

class MonsterName extends React.Component {
    render() {
        return (
            <input type="text" value={this.props.value} onChange={event => this.props.changeName(this.props.slotID, this.props.index, event.target.value)} />
        )
    }
}