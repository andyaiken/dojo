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

            var activeCards = [];
            var inactiveCards = [];

            if (this.props.selection) {
                activeCards.push(
                    <div className="column" key="info">
                        <PartyCard
                            selection={this.props.selection}
                            addPC={name => this.props.addPC(name)}
                            sortPCs={() => this.props.sortPCs()}
                            changeValue={(type, value) => this.props.changeValue(this.props.selection, type, value)}
                            removeParty={() => this.props.removeParty()}
                        />
                    </div>
                );

                var activePCs = this.props.selection.pcs.filter(pc => pc.active);
                activePCs.forEach(pc => {
                    activeCards.push(
                        <div className="column" key={pc.id}>
                            <PCCard
                                combatant={pc}
                                mode={"edit"}
                                changeValue={(combatant, type, value) => this.props.changeValue(combatant, type, value)}
                                nudgeValue={(combatant, type, delta) => this.props.nudgeValue(combatant, type, delta)}
                                removeCombatant={combatant => this.props.removePC(combatant)}
                            />
                        </div>
                    );
                });

                var inactivePCs = this.props.selection.pcs.filter(pc => !pc.active);
                inactivePCs.forEach(pc => {
                    inactiveCards.push(
                        <div className="column" key={pc.id}>
                            <PCCard
                                combatant={pc}
                                mode={"edit"}
                                changeValue={(combatant, type, value) => this.props.changeValue(combatant, type, value)}
                                nudgeValue={(combatant, type, delta) => this.props.nudgeValue(combatant, type, delta)}
                                removeCombatant={combatant => this.props.removePC(combatant)}
                            />
                        </div>
                    );
                });

                if (activePCs.length === 0) {
                    activeCards.push(
                        <div className="column" key="empty">
                            <InfoCard getContent={() => <div className="section">no pcs</div>} />
                        </div>
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
                <div className="parties row collapse">
                    <div className="columns small-6 medium-4 large-3 scrollable">
                        {help}
                        <div className="group">
                            <button onClick={() => this.props.addParty("new party")}>add a new party</button>
                        </div>
                        {parties}
                    </div>
                    <div className="columns small-6 medium-8 large-9 scrollable">
                        <CardGroup
                            content={activeCards}
                            heading={name}
                            showClose={this.props.selection !== null}
                            close={() => this.props.selectParty(null)}
                        />
                        <CardGroup
                            content={inactiveCards}
                            heading="inactive pcs"
                            showClose={false}
                            hidden={inactiveCards.length === 0}
                        />
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}