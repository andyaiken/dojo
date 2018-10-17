class PartiesScreen extends React.Component {
    render() {
        try {
            var help = null;
            if (this.props.showHelp) {
                help = (
                    <PartiesCard parties={this.props.parties}/>
                );
            }

            var parties = [];
            for (var n = 0; n !== this.props.parties.length; ++n) {
                var party = this.props.parties[n];
                parties.push(
                    <PartyListItem
                        key={party.id}
                        party={party}
                        selected={party === this.props.selection}
                        setSelection={party => this.props.selectParty(party)}
                    />
                );
            };

            var cards = [];

            if (this.props.selection) {
                cards.push(
                    <PartyCard
                        key={"info"}
                        selection={this.props.selection}
                        addPC={name => this.props.addPC(name)}
                        sortPCs={() => this.props.sortPCs()}
                        changeValue={(type, value) => this.props.changeValue(this.props.selection, type, value)}
                        removeParty={() => this.props.removeParty()}
                    />
                );

                for (var index = 0; index !== this.props.selection.pcs.length; ++index) {
                    var pc = this.props.selection.pcs[index];
                    cards.push(
                        <PCCard
                            key={pc.id}
                            combatant={pc}
                            mode={"edit"}
                            changeValue={(combatant, type, value) => this.props.changeValue(combatant, type, value)}
                            nudgeValue={(combatant, type, delta) => this.props.nudgeValue(combatant, type, delta)}
                            removeCombatant={combatant => this.props.removePC(combatant)}
                        />
                    );
                }

                if (this.props.selection.pcs.length === 0) {
                    cards.push(
                        <InfoCard
                            key={"empty"}
                            getContent={() => <div className="section">no pcs</div>}
                        />
                    );
                }
            }

            var name = null;
            if (this.props.selection) {
                name = this.props.selection.name;
                if (!name) {
                    name = "unnamed party";
                }
            }

            return (
                <div className="parties">
                    <div className="left-pane scrollable">
                        {help}
                        <div className="group">
                            <button onClick={() => this.props.addParty("new party")}>add a new party</button>
                        </div>
                        {parties}
                    </div>
                    <div className="right-pane scrollable">
                        <CardGroup
                            content={cards}
                            heading={name}
                            showClose={this.props.selection !== null}
                            close={() => this.props.selectParty(null)}
                        />
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}