class CombatStartPanel extends React.Component {
    constructor() {
        super();
        this.state = {
            partyID: null,
            encounterID: null
        };
    }

    selectParty(partyID) {
        this.setState({
            partyID: partyID
        });
    }

    selectEncounter(encounterID) {
        this.setState({
            encounterID: encounterID
        });
    }

    startEncounter() {
        if (this.state.partyID && this.state.encounterID) {
            this.props.startEncounter(this.state.partyID, this.state.encounterID);
        }
    }

    render() {
        try {
            var items = [];

            if (this.props.parties.length === 0) {
                items.push(<div key="no-parties" className="text">you have not defined any pcs</div>);
            } else {
                var partyOptions = [];
                for (var n = 0; n !== this.props.parties.length; ++n) {
                    var party = this.props.parties[n];
                    var partyName = party.name;
                    if (!partyName) {
                        partyName = "unnamed party";
                    }
                    partyOptions.push({
                        id: party.id,
                        text: partyName
                    });
                }

                var partyName = "select party";
                var partyContent = null;
                if (this.state.partyID) {
                    var selectedParty = this.props.parties.find(p => p.id === this.state.partyID);
                    partyName = selectedParty.name;
                    if (!partyName) {
                        partyName = "unnamed party";
                    }
                    var pcs = [];
                    for (var n = 0; n !== selectedParty.pcs.length; ++n) {
                        var pc = selectedParty.pcs[n];
                        var name = pc.name;
                        if (!name) {
                            name = "unnamed pc";
                        }
                        pcs.push(<li key={pc.id}>{name}</li>);
                    };
                    if (pcs.length === 0) {
                        pcs.push(<li key={"empty"}>no pcs</li>);
                    }
                    partyContent = (
                        <ul>{pcs}</ul>
                    );
                }
                items.push(
                    <Dropdown
                        key="party-dropdown"
                        options={partyOptions}
                        selectedID={this.state.partyId}
                        select={optionID => this.selectParty(optionID)}
                    />
                );
                items.push(
                    <div key="party" className="">
                        {partyContent}
                    </div>
                );
            }

            if (this.props.encounters.length === 0) {
                items.push(<div key="no-encounters" className="text">you have not built any encounters</div>);
            } else {
                var encounterOptions = [];
                for (var n = 0; n !== this.props.encounters.length; ++n) {
                    var encounter = this.props.encounters[n];
                    var encounterName = encounter.name;
                    if (!encounterName) {
                        encounterName = "unnamed encounter";
                    }
                    encounterOptions.push({
                        id: encounter.id,
                        text: encounterName
                    });
                }

                var encounterName = "select encounter";
                var encounterContent = null;
                if (this.state.encounterID) {
                    var selectedEncounter = this.props.encounters.find(e => e.id === this.state.encounterID);
                    encounterName = selectedEncounter.name;
                    if (!encounterName) {
                        encounterName = "unnamed encounter";
                    }
                    var monsters = [];
                    for (var n = 0; n !== selectedEncounter.slots.length; ++n) {
                        var slot = selectedEncounter.slots[n];
                        var name = slot.monsterName;
                        if (!name) {
                            name = "unnamed monster";
                        }
                        if (slot.count > 1) {
                            name += " x" + slot.count;
                        }
                        monsters.push(<li key={slot.id}>{name}</li>);
                    };
                    if (monsters.length === 0) {
                        monsters.push(<li key={"empty"}>no monsters</li>);
                    }
                    encounterContent = (
                        <ul>{monsters}</ul>
                    );
                }
                items.push(
                    <Dropdown
                        key="encounter-dropdown"
                        options={encounterOptions}
                        selectedID={this.state.encounterID}
                        select={optionID => this.selectEncounter(optionID)}
                    />
                );
                items.push(
                    <div key="encounter" className="">
                        {encounterContent}
                    </div>
                );
            }

            items.push(<div key="start-div" className="divider"></div>);
            items.push(<button key="start" className={this.state.partyID && this.state.encounterID ? "" : "disabled"} onClick={() => this.startEncounter()}>start encounter</button>);

            return (
                <div className="group options-group">
                    {items}
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}