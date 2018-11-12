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
            var pcs = selectedParty.pcs.filter(pc => pc.active).map(pc => <li key={pc.id}>{pc.name || "unnamed pc"}</li>);
            if (pcs.length === 0) {
                pcs.push(
                    <li key={"empty"}>no pcs</li>
                );
            }
            partyContent = (
                <div>
                    <ul>{pcs}</ul>
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
            encounterContent = (
                <div>
                    <ul>{monsters}</ul>
                    <div className="subheading">initiative</div>
                    <Selector
                        options={initOptions}
                        selectedID={this.state.combat.encounterInitMode}
                        select={optionID => this.setEncounterInitMode(optionID)}
                    />
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

    render() {
        try {
            return (
                <div className="row" style={{ height: "100%", margin: "0 -15px" }}>
                    <div className="column small-6 medium-6 large-6 scrollable">
                        {this.getPartySection()}
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