class MonsterEditorModal extends React.Component {
    constructor() {
        super();
        this.state = {
            page: 'overview'
        };
    }

    setPage(page) {
        this.setState({
            page: page
        });
    }

    copyTrait(trait) {
        var copy = JSON.parse(JSON.stringify(trait));
        copy.id = guid();
        this.props.copyTrait(this.props.combatant, copy);
    }

    render() {
        try {
            var pages = [
                {
                    id: 'overview',
                    text: 'overview'
                },
                {
                    id: 'abilities',
                    text: 'abilities'
                },
                {
                    id: 'combat',
                    text: 'combat'
                },
                {
                    id: 'actions',
                    text: 'actions'
                },
            ];

            var content = null;
            switch (this.state.page) {
                case 'overview':
                    var categories = ["aberration", "beast", "celestial", "construct", "dragon", "elemental", "fey", "fiend", "giant", "humanoid", "monstrosity", "ooze", "plant", "undead"];
                    var catOptions = categories.map(cat => { return { id: cat, text: cat }; });
        
                    var sizes = ["tiny", "small", "medium", "large", "huge", "gargantuan"];
                    var sizeOptions = sizes.map(size => { return { id: size, text: size }; });

                    content = (
                        <div>
                            <div className="column two">
                                <div className="subheading">name</div>
                                <input type="text" value={this.props.combatant.name} onChange={event => this.props.changeValue(this.props.combatant, "name", event.target.value)} />
                                <div className="subheading">size</div>
                                <Dropdown
                                    options={sizeOptions}
                                    selectedID={this.props.combatant.size}
                                    select={optionID => this.props.changeTrait(this.props.combatant, "size", optionID)}
                                />
                                <div className="subheading">type</div>
                                <Dropdown
                                    options={catOptions}
                                    selectedID={this.props.combatant.category}
                                    select={optionID => this.props.changeTrait(this.props.combatant, "category", optionID)}
                                />
                                <div className="subheading">subtype</div>
                                <input type="text" value={this.props.combatant.tag} onChange={event => this.props.changeValue(this.props.combatant, "tag", event.target.value)} />
                                <div className="subheading">alignment</div>
                                <input type="text" value={this.props.combatant.alignment} onChange={event => this.props.changeValue(this.props.combatant, "alignment", event.target.value)} />
                            </div>
                            <div className="column-divider"></div>
                            <div className="column two">
                                <div className="subheading">challenge rating</div>
                                <Spin
                                    source={this.props.combatant}
                                    name="challenge"
                                    display={value => challenge(value)}
                                    nudgeValue={delta => this.props.nudgeValue(this.props.combatant, "challenge", delta)}
                                />
                                <div className="subheading">speed</div>
                                <input type="text" value={this.props.combatant.speed} onChange={event => this.props.changeValue(this.props.combatant, "speed", event.target.value)} />
                                <div className="subheading">senses</div>
                                <input type="text" value={this.props.combatant.senses} onChange={event => this.props.changeValue(this.props.combatant, "senses", event.target.value)} />
                                <div className="subheading">languages</div>
                                <input type="text" value={this.props.combatant.languages} onChange={event => this.props.changeValue(this.props.combatant, "languages", event.target.value)} />
                                <div className="subheading">equipment</div>
                                <input type="text" value={this.props.combatant.equipment} onChange={event => this.props.changeValue(this.props.combatant, "equipment", event.target.value)} />
                            </div>
                        </div>
                    );
                    break;
                case 'abilities':
                    content = (
                        <div>
                            <div className="column two">
                                <div className="subheading">ability scores</div>
                                <AbilityScorePanel
                                    edit={true}
                                    combatant={this.props.combatant}
                                    nudgeValue={(source, type, delta) => this.props.nudgeValue(source, type, delta)}
                                />
                            </div>
                            <div className="column-divider"></div>
                            <div className="column two">
                                <div className="subheading">saving throws</div>
                                <input type="text" value={this.props.combatant.savingThrows} onChange={event => this.props.changeValue(this.props.combatant, "savingThrows", event.target.value)} />
                                <div className="subheading">skills</div>
                                <input type="text" value={this.props.combatant.skills} onChange={event => this.props.changeValue(this.props.combatant, "skills", event.target.value)} />
                            </div>
                        </div>
                    );
                    break;
                case 'combat':
                    content = (
                        <div>
                            <div className="column two">
                                <div className="subheading">armor class</div>
                                <Spin
                                    source={this.props.combatant}
                                    name="ac"
                                    nudgeValue={delta => this.props.nudgeValue(this.props.combatant, "ac", delta)}
                                />
                                <div className="subheading">hit dice</div>
                                <Spin
                                    source={this.props.combatant}
                                    name="hitDice"
                                    nudgeValue={delta => this.props.nudgeValue(this.props.combatant, "hitDice", delta)}
                                />
                                <div className="divider"></div>
                                <div className="section centered">
                                    <div><b>hit points</b> {this.props.combatant.hpMax} ({this.props.combatant.hitDice}d{hitDieType(this.props.combatant.size)})</div>
                                </div>
                            </div>
                            <div className="column-divider"></div>
                            <div className="column two">
                                <div className="subheading">damage resistances</div>
                                <input type="text" value={this.props.combatant.damage.resist} onChange={event => this.props.changeValue(this.props.combatant, "damage.resist", event.target.value)} />
                                <div className="subheading">damage vulnerabilities</div>
                                <input type="text" value={this.props.combatant.damage.vulnerable} onChange={event => this.props.changeValue(this.props.combatant, "damage.vulnerable", event.target.value)} />
                                <div className="subheading">damage immunities</div>
                                <input type="text" value={this.props.combatant.damage.immune} onChange={event => this.props.changeValue(this.props.combatant, "damage.immune", event.target.value)} />
                                <div className="subheading">condition immunities</div>
                                <input type="text" value={this.props.combatant.conditionImmunities} onChange={event => this.props.changeValue(this.props.combatant, "conditionImmunities", event.target.value)} />
                            </div>
                        </div>
                    );
                    break;
                case 'actions':
                    content = (
                        <TraitsPanel
                            combatant={this.props.combatant}
                            edit={true}
                            addTrait={type => this.props.addTrait(this.props.combatant, type)}
                            removeTrait={trait => this.props.removeTrait(this.props.combatant, trait)}
                            changeTrait={(trait, type, value) => this.props.changeTrait(trait, type, value)}
                        />
                    );
                    break;
            }

            return (
                <div>
                    <div className="column three double">
                        <Selector
                            tabs={true}
                            options={pages}
                            selectedID={this.state.page}
                            select={optionID => this.setPage(optionID)}
                        />
                        {content}
                    </div>
                    <div className="column-divider"></div>
                    <div className="column three">
                        <MonsterListPanel
                            monster={this.props.combatant}
                            library={this.props.library}
                            mode={this.state.page}
                            copyTrait={trait => this.copyTrait(trait)}
                        />
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}