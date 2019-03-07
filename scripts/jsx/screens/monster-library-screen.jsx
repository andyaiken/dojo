class MonsterLibraryScreen extends React.Component {
    showMonsterGroup(group) {
        var result = match(this.props.filter, group.name);

        if (!result) {
            group.monsters.forEach(monster => {
                result = match(this.props.filter, monster.name) || result;
            });
        }

        return result;
    }

    render() {
        try {
            var help = null;
            if (this.props.showHelp) {
                help = (
                    <MonsterLibraryCard />
                );
            }
            
            var listItems = [];
            for (var n = 0; n !== this.props.library.length; ++n) {
                var group = this.props.library[n];
                if (this.showMonsterGroup(group)) {
                    listItems.push(
                        <MonsterGroupListItem
                            key={group.id}
                            group={group}
                            filter={this.props.filter}
                            selected={group === this.props.selection}
                            setSelection={group => this.props.selectMonsterGroup(group)}
                        />
                    );
                }
            };

            var cards = [];

            if (this.props.selection) {
                cards.push(
                    <div className="column" key="info">
                        <MonsterGroupCard
                            selection={this.props.selection}
                            filter={this.props.filter}
                            addMonster={name => this.props.addMonster(name)}
                            sortMonsters={() => this.props.sortMonsters()}
                            changeValue={(type, value) => this.props.changeValue(this.props.selection, type, value)}
                            removeMonsterGroup={() => this.props.removeMonsterGroup()}
                        />
                    </div>
                );

                var monsters = this.props.selection.monsters.filter(monster => {
                    return match(this.props.filter, monster.name);
                });

                if (monsters.length !== 0) {
                    monsters.forEach(monster => {
                        cards.push(
                            <div className="column" key={monster.id}>
                                <MonsterCard
                                    combatant={monster}
                                    mode={"view editable"}
                                    library={this.props.library}
                                    moveToGroup={(combatant, groupID) => this.props.moveToGroup(combatant, groupID)}
                                    changeValue={(combatant, type, value) => this.props.changeValue(combatant, type, value)}
                                    nudgeValue={(combatant, type, delta) => this.props.nudgeValue(combatant, type, delta)}
                                    removeCombatant={combatant => this.props.removeMonster(combatant)}
                                    editMonster={combatant => this.props.editMonster(combatant)}
                                    cloneMonster={(combatant, name) => this.props.cloneMonster(combatant, name)}
                                />
                            </div>
                        );
                    });
                } else {
                    cards.push(
                        <div className="column" key="empty">
                            <InfoCard getContent={() => <div className="section">no monsters</div>} />
                        </div>
                    );
                }
            }

            var name = null;
            if (this.props.selection) {
                name = this.props.selection.name;
                if (!name) {
                    name = "unnamed group";
                }
            }

            return (
                <div className="monster-library row collapse">
                    <div className="columns small-4 medium-4 large-3 scrollable list-column">
                        {help}
                        <button onClick={() => this.props.addMonsterGroup("new group")}>add a new monster group</button>
                        {listItems}
                    </div>
                    <div className="columns small-8 medium-8 large-9 scrollable">
                        <CardGroup
                            content={cards}
                            heading={name}
                            showClose={this.props.selection !== null}
                            close={() => this.props.selectMonsterGroup(null)}
                        />
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}