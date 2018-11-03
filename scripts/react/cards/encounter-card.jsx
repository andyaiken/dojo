class EncounterCard extends React.Component {
    constructor() {
        super();
        this.state = {
            showDetails: false,
            partyID: null
        };
    }

    toggleDetails() {
        this.setState({
            showDetails: !this.state.showDetails
        })
    }

    selectParty(partyID) {
        this.setState({
            partyID: partyID
        });
    }

    render() {
        try {
            var heading = null;
            var content = null;

            if (this.props.selection) {
                var partyOptions = [];
                if (this.props.parties) {
                    for (var n = 0; n !== this.props.parties.length; ++n) {
                        var party = this.props.parties[n];
                        partyOptions.push({
                            id: party.id,
                            text: party.name
                        });
                    }
                }

                var monsterCount = 0;
                var monsterXp = 0;
                var adjustedXp = 0;
                var difficulty = "";
                var adjustedDifficulty = "";

                this.props.selection.slots.forEach(slot => {
                    monsterCount += slot.count;
                    var monster = this.props.getMonster(slot.monsterName, slot.monsterGroupName);
                    if (monster) {
                        monsterXp += experience(monster.challenge) * slot.count;
                    }
                });

                adjustedXp = monsterXp * experienceFactor(monsterCount);

                if (this.state.partyID) {
                    var selectedParty = this.props.parties.find(p => p.id === this.state.partyID);

                    var xpEasy = 0;
                    var xpMedium = 0;
                    var xpHard = 0;
                    var xpDeadly = 0;

                    for (var n = 0; n !== selectedParty.pcs.length; ++n) {
                        var pc = selectedParty.pcs[n];
                        xpEasy += pcExperience(pc.level, "easy");
                        xpMedium += pcExperience(pc.level, "medium");
                        xpHard += pcExperience(pc.level, "hard");
                        xpDeadly += pcExperience(pc.level, "deadly");
                    }

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

                        if ((selectedParty.pcs.length < 3) || (selectedParty.pcs.length > 5)) {
                            var small = selectedParty.pcs.length < 3;
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
                }

                var difficultySection = (
                    <div>
                        <div className="section">
                            <div className="subheading">difficulty</div>
                        </div>
                        <div style={{ display: this.props.parties.length !== 0 ? "" : "none" }}>
                            <Dropdown
                                options={partyOptions}
                                placeholder="select party..."
                                selectedID={this.state.partyID}
                                select={optionID => this.selectParty(optionID)}
                            />
                        </div>
                        <div className="table" style={{ display: this.state.partyID ? "" : "none" }}>
                            <div>
                                <div className="cell four"><b>easy</b></div>
                                <div className="cell four"><b>medium</b></div>
                                <div className="cell four"><b>hard</b></div>
                                <div className="cell four"><b>deadly</b></div>
                            </div>
                            <div>
                                <div className="cell four">{xpEasy}</div>
                                <div className="cell four">{xpMedium}</div>
                                <div className="cell four">{xpHard}</div>
                                <div className="cell four">{xpDeadly}</div>
                            </div>
                        </div>
                        <div className="section">
                            monsters
                            <div className="right">{monsterCount}</div>
                        </div>
                        <div className="section">
                            xp value
                            <div className="right">{monsterXp} xp</div>
                        </div>
                        <div className="section" style={{ display: monsterCount > 1 ? "" : "none" }}>
                            adjusted for number of monsters
                            <div className="right">{adjustedXp} xp</div>
                        </div>
                        <div className="section" style={{ display: difficulty ? "" : "none" }}>
                            difficulty
                            <div className="right">{difficulty}</div>
                        </div>
                        <div className="section" style={{ display: adjustedDifficulty ? "" : "none" }}>
                            adjusted for number of pcs
                            <div className="right">{adjustedDifficulty}</div>
                        </div>
                    </div>
                );

                var imageStyle = this.state.showDetails ? "image rotate" : "image";

                heading = (
                    <div className="heading">
                        <div className="title">encounter</div>
                        <img className={imageStyle} src="content/down-arrow.svg" onClick={() => this.toggleDetails()} />
                    </div>
                );

                content = (
                    <div>
                        <div className="section">
                            <input type="text" placeholder="encounter name" value={this.props.selection.name} onChange={event => this.props.changeValue("name", event.target.value)} />
                        </div>
                        <div style={{ display: this.state.showDetails ? "" : "none" }}>
                            <div className="divider"></div>
                            {difficultySection}
                        </div>
                        <div className="divider"></div>
                        <div className="section">
                            <ConfirmButton text="delete encounter" callback={() => this.props.removeEncounter()} />
                        </div>
                    </div>
                )
            }

            return (
                <InfoCard getHeading={() => heading} getContent={() => content} />
            );
        } catch (e) {
            console.error(e);
        }
    };
}