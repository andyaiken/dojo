class CombatStartPanel extends React.Component {
    constructor() {
        super();
        this.state = {
            partyDropdownOpen: false,
            party: null,
            encounterDropdownOpen: false,
            encounter: null
        };
    }

    selectParty(party) {
        if (party) {
            this.setState({
                partyDropdownOpen: false,
                party: party
            });
        } else {
            this.setState({
                partyDropdownOpen: !this.state.partyDropdownOpen,
                encounterDropdownOpen: false
            });
        }
    }

    selectEncounter(encounter) {
        if (encounter) {
            this.setState({
                encounterDropdownOpen: false,
                encounter: encounter
            });
        } else {
            this.setState({
                partyDropdownOpen: false,
                encounterDropdownOpen: !this.state.encounterDropdownOpen
            });
        }
    }

    startEncounter() {
        if (this.state.party && this.state.encounter) {
            this.props.startEncounter(this.state.party, this.state.encounter);
        }
    }

    render() {
        try {
            var items = [];

            if (this.props.parties.length === 0) {
                items.push(<div key="no-parties" className="text">you have not defined any pcs</div>);
            } else {
                var partyDropdownItems = [];
                for (var n = 0; n !== this.props.parties.length; ++n) {
                    var party = this.props.parties[n];
                    var partyName = party.name;
                    if (!partyName) {
                        partyName = "unnamed party";
                    }
                    partyDropdownItems.push(
                        <DropdownItem
                            key={party.id}
                            text={partyName}
                            item={party}
                            selected={this.state.party === party}
                            onSelect={item => this.selectParty(item)} />
                    );
                }

                var partyName = "select party";
                var partyContent = null;
                if (this.state.party) {
                    partyName = this.state.party.name;
                    if (!partyName) {
                        partyName = "unnamed party";
                    }
                    var pcs = [];
                    for (var n = 0; n !== this.state.party.pcs.length; ++n) {
                        var pc = this.state.party.pcs[n];
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
                    <div key="partySelect" className="dropdown">
                        <button className="dropdown-button" onClick={() => this.selectParty()}>
                            <div className="title">{partyName}</div>
                            <img className="image" src="content/ellipsis.svg" />
                        </button>
                        <div className={this.state.partyDropdownOpen ? "dropdown-content open" : "dropdown-content"}>
                            {partyDropdownItems}
                        </div>
                    </div>
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
                var encounterDropdownItems = [];
                for (var n = 0; n !== this.props.encounters.length; ++n) {
                    var encounter = this.props.encounters[n];
                    var encounterName = encounter.name;
                    if (!encounterName) {
                        encounterName = "unnamed encounter";
                    }
                    encounterDropdownItems.push(
                        <DropdownItem
                            key={encounter.id}
                            text={encounterName}
                            item={encounter}
                            selected={this.state.encounter === encounter}
                            onSelect={item => this.selectEncounter(item)} />
                    );
                }

                var encounterName = "select encounter";
                var encounterContent = null;
                if (this.state.encounter) {
                    encounterName = this.state.encounter.name;
                    if (!encounterName) {
                        encounterName = "unnamed encounter";
                    }
                    var monsters = [];
                    for (var n = 0; n !== this.state.encounter.slots.length; ++n) {
                        var slot = this.state.encounter.slots[n];
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
                    <div key="encounterSelect" className="dropdown">
                        <button className="dropdown-button" onClick={() => this.selectEncounter()}>
                            <div className="title">{encounterName}</div>
                            <img className="image" src="content/ellipsis.svg" />
                        </button>
                        <div className={this.state.encounterDropdownOpen ? "dropdown-content open" : "dropdown-content"}>
                            {encounterDropdownItems}
                        </div>
                    </div>
                );
                items.push(
                    <div key="encounter" className="">
                        {encounterContent}
                    </div>
                );
            }

            items.push(<div key="start-div" className="divider"></div>);
            items.push(<button key="start" className={this.state.party && this.state.encounter ? "" : "disabled"} onClick={() => this.startEncounter()}>start encounter</button>);

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