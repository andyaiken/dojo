class MonsterLibraryScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            filter: ""
        };
    }

    setFilter(filter) {
        this.setState({
            filter: filter
        });
    }

    showMonsterGroup(group) {
        var result = match(this.state.filter, group.name);

        if (!result) {
            group.monsters.forEach(monster => {
                result = match(this.state.filter, monster.name) || result;
            });
        }

        return result;
    }

    render() {
        try {
            var help = null;
            if (this.props.showHelp) {
                help = (
                    <MonsterLibraryCard
                        library={this.props.library}
                        addOpenGameContent={() => this.props.addOpenGameContent()}
                    />
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
                            filter={this.state.filter}
                            selected={group === this.props.selection}
                            setSelection={group => this.props.selectMonsterGroup(group)}
                        />
                    );
                }
            };

            var cards = [];

            if (this.props.selection) {
                cards.push(
                    <MonsterGroupCard
                        key={"info"}
                        selection={this.props.selection}
                        filter={this.state.filter}
                        addMonster={name => this.props.addMonster(name)}
                        sortMonsters={() => this.props.sortMonsters()}
                        changeValue={(type, value) => this.props.changeValue(this.props.selection, type, value)}
                        removeMonsterGroup={() => this.props.removeMonsterGroup()}
                    />
                );

                var monsters = this.props.selection.monsters.filter(monster => {
                    return match(this.state.filter, monster.name);
                });

                monsters.forEach(monster => {
                    cards.push(
                        <MonsterCard
                            key={monster.id}
                            combatant={monster}
                            mode={"view editable"}
                            library={this.props.library}
                            moveToGroup={(combatant, group) => this.props.moveToGroup(combatant, group)}
                            changeValue={(combatant, type, value) => this.props.changeValue(combatant, type, value)}
                            nudgeValue={(combatant, type, delta) => this.props.nudgeValue(combatant, type, delta)}
                            changeTrait={(trait, type, value) => this.props.changeValue(trait, type, value)}
                            addTrait={(combatant, type) => this.props.addTrait(combatant, type)}
                            removeTrait={(combatant, trait) => this.props.removeTrait(combatant, trait)}
                            removeCombatant={combatant => this.props.removeMonster(combatant)}
                            editMonster={combatant => this.props.editMonster(combatant)}
                            cloneMonster={combatant => this.props.cloneMonster(combatant)}
                        />
                    );
                });
                if (monsters.length === 0) {
                    cards.push(
                        <InfoCard
                            key={"empty"}
                            getContent={() => <div className="section">no monsters</div>}
                        />
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
                <div className="monster-library">
                    <div className="left-pane scrollable">
                        {help}
                        <div className="group">
                            <button onClick={() => this.props.addMonsterGroup("new group")}>add a new monster group</button>
                        </div>
                        <div className="group">
                            <input type="text" placeholder="filter" value={this.state.filter} onChange={event => this.setFilter(event.target.value)} />
                        </div>
                        {listItems}
                    </div>
                    <div className="right-pane scrollable">
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