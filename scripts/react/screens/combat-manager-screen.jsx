class CombatManagerScreen extends React.Component {
    createCard(index, combatant, isPlaceholder) {
        if (isPlaceholder && isPlaceholder(combatant)) {
            return (
                <InfoCard
                    key={combatant.id}
                    getHeading={() => <div className="heading">{combatant.name}</div>}
                    getContent={() => <div className="section">current turn</div>}
                />
            );
        }

        switch (combatant.type) {
            case "pc":
                return (
                    <PCCard
                        key={combatant.id}
                        combatant={combatant}
                        mode={"combat"}
                        changeValue={(combatant, type, value) => this.props.changeValue(combatant, type, value)}
                        nudgeValue={(combatant, type, delta) => this.props.nudgeValue(combatant, type, delta)}
                        makeCurrent={combatant => this.props.makeCurrent(combatant)}
                        makeActive={combatant => this.props.makeActive(combatant)}
                        makeDefeated={combatant => this.props.makeDefeated(combatant)}
                        removeCombatant={combatant => this.props.removeCombatant(combatant)}
                        endTurn={combatant => this.props.endTurn(combatant)}
                    />
                );
            case "monster":
                return (
                    <MonsterCard
                        key={combatant.id}
                        combatant={combatant}
                        mode={"combat"}
                        changeValue={(combatant, type, value) => this.props.changeValue(combatant, type, value)}
                        nudgeValue={(combatant, type, delta) => this.props.nudgeValue(combatant, type, delta)}
                        makeCurrent={combatant => this.props.makeCurrent(combatant)}
                        makeActive={combatant => this.props.makeActive(combatant)}
                        makeDefeated={combatant => this.props.makeDefeated(combatant)}
                        removeCombatant={combatant => this.props.removeCombatant(combatant)}
                        addCondition={(combatant, condition) => this.props.addCondition(combatant, condition)}
                        removeCondition={(combatant, condition) => this.props.removeCondition(combatant, condition)}
                        nudgeConditionValue={(condition, type, delta) => this.props.nudgeValue(condition, type, delta)}
                        endTurn={(combatant) => this.props.endTurn(combatant)}
                    />
                );
            default:
                return null;
        }
    }

    render() {
        try {
            var leftPaneContent = null;
            var rightPaneContent = null;

            if (this.props.combat) {
                var current = [];
                var active = [];
                var pending = [];
                var defeated = [];

                for (var index = 0; index !== this.props.combat.combatants.length; ++index) {
                    var combatant = this.props.combat.combatants[index];
                    if (combatant.current) {
                        current.push(this.createCard(index, combatant));
                    }
                    if (combatant.pending && !combatant.active && !combatant.defeated) {
                        pending.push(this.createCard(index, combatant, combatant => combatant.current));
                    }
                    if (!combatant.pending && combatant.active && !combatant.defeated) {
                        active.push(this.createCard(index, combatant, combatant => combatant.current));
                    }
                    if (!combatant.pending && !combatant.active && combatant.defeated) {
                        defeated.push(this.createCard(index, combatant, combatant => combatant.current));
                    }
                }

                if (this.props.showHelp && (pending.length !== 0)) {
                    var help = (
                        <InfoCard
                            key="help"
                            getContent={() =>
                                <div>
                                    <div className="section">these pcs are not yet part of the encounter</div>
                                    <div className="section">set initiative on each pc, then add them to the encounter</div>
                                </div>
                            }
                        />
                    );
                    pending = [].concat(help, pending);
                }

                if (this.props.showHelp && (current.length === 0)) {
                    var help = (
                        <InfoCard
                            key="help"
                            getContent={() =>
                                <div>
                                    <div className="section">to begin the encounter, press <b>start turn</b> on one of the stat blocks in this section</div>
                                    <div className="section">that stat block will then be displayed on the left</div>
                                </div>
                            }
                        />
                    );
                    active = [].concat(help, active);
                }

                if (current.length === 0) {
                    current.push(
                        <InfoCard
                            key="current"
                            getContent={() =>
                                <div className="section">the current initiative holder will be displayed here</div>
                            }
                        />
                    );
                }

                leftPaneContent = (
                    <CardGroup
                        heading="current turn"
                        content={current}
                        hidden={current.length === 0}
                    />
                );
                rightPaneContent = (
                    <div>
                        <CardGroup
                            heading="waiting for intiative to be entered"
                            content={pending}
                            hidden={pending.length === 0}
                        />
                        <CardGroup
                            heading="active combatants"
                            content={active}
                            hidden={active.length === 0}
                        />
                        <CardGroup
                            heading="defeated"
                            content={defeated}
                            hidden={defeated.length === 0}
                        />
                    </div>
                );
            } else {
                var help = null;
                if (this.props.showHelp) {
                    help = (
                        <CombatManagerCard />
                    );
                }

                var combats = [];
                this.props.combats.forEach(combat => {
                    combats.push(
                        <CombatListItem
                            key={combat.id}
                            combat={combat}
                            setSelection={combat => this.props.resumeEncounter(combat)}
                        />
                    );
                });

                leftPaneContent = (
                    <div>
                        {help}
                        <CombatStartPanel
                            parties={this.props.parties}
                            encounters={this.props.encounters}
                            startEncounter={(party, encounter) => this.props.startEncounter(party, encounter)}
                        />
                        {combats}
                    </div>
                );
            }

            return (
                <div className="combat-manager">
                    <div className="left-pane scrollable">
                        {leftPaneContent}
                    </div>
                    <div className="right-pane scrollable">
                        {rightPaneContent}
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}