class CombatManagerScreen extends React.Component {
    createCard(combatant, isPlaceholder) {
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

                this.props.combat.combatants.forEach(combatant => {
                    if (combatant.current) {
                        current.push(
                            <div key={combatant.id}>
                                {this.createCard(combatant)}
                            </div>
                        );
                    }
                    if (combatant.pending && !combatant.active && !combatant.defeated) {
                        pending.push(
                            <div className="column column-block" key={combatant.id}>
                                {this.createCard(combatant, combatant => combatant.current)}
                            </div>
                        );
                    }
                    if (!combatant.pending && combatant.active && !combatant.defeated) {
                        active.push(
                            <div className="column column-block" key={combatant.id}>
                                {this.createCard(combatant, combatant => combatant.current)}
                            </div>
                        );
                    }
                    if (!combatant.pending && !combatant.active && combatant.defeated) {
                        defeated.push(
                            <div className="column column-block" key={combatant.id}>
                                {this.createCard(combatant, combatant => combatant.current)}
                            </div>
                        );
                    }
                });

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

                if (this.props.showHelp && (pending.length !== 0)) {
                    var help = (
                        <div className="column column-block" key="help">
                            <InfoCard
                                getContent={() =>
                                    <div>
                                        <div className="section">these pcs are not yet part of the encounter</div>
                                        <div className="section">set initiative on each pc, then add them to the encounter</div>
                                    </div>
                                }
                            />
                        </div>
                    );
                    pending = [].concat(help, pending);
                }

                if (this.props.showHelp && (current.length === 0)) {
                    var help = (
                        <div className="column column-block" key="help">
                            <InfoCard
                                getContent={() =>
                                    <div>
                                        <div className="section">to begin the encounter, press <b>start turn</b> on one of the stat blocks in this section</div>
                                        <div className="section">that stat block will then be displayed on the left</div>
                                    </div>
                                }
                            />
                        </div>
                    );
                    active = [].concat(help, active);
                }

                rightPaneContent = (
                    <div>
                        <CardGroup
                            heading="waiting for intiative to be entered"
                            content={pending}
                            hidden={pending.length === 0}
                            showToggle={true}
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
                            showToggle={true}
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
                            startEncounter={(partyID, encounterID) => this.props.startEncounter(partyID, encounterID)}
                        />
                        {combats}
                    </div>
                );
            }

            return (
                <div className="combat-manager row collapse">
                    <div className="columns small-6 medium-4 large-3 scrollable">
                        {leftPaneContent}
                    </div>
                    <div className="columns small-6 medium-8 large-9 scrollable">
                        {rightPaneContent}
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}