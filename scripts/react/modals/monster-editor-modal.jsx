class MonsterEditorModal extends React.Component {
    constructor() {
        super();
        this.state = {
            page: "overview",
            showFilter: false,
            helpSection: "speed",
            filter: {
                size: true,
                type: true,
                subtype: false,
                alignment: false,
                challenge: true,
            }
        };
    }

    setPage(page) {
        var sections = this.getHelpOptionsForPage(page);
        this.setState({
            page: page,
            helpSection: sections[0]
        });
    }

    toggleFilter() {
        this.setState({
            showFilter: !this.state.showFilter
        });
    }

    setHelpSection(section) {
        this.setState({
            helpSection: section
        });
    }

    toggleMatch(type) {
        this.state.filter[type] = !this.state.filter[type];
        this.setState({
            filter: this.state.filter
        });
    }

    getHelpOptionsForPage(page) {
        switch (page) {
            case "overview":
                return ["speed", "senses", "languages", "equipment"];
            case "abilities":
                return ["str", "dex", "con", "int", "wis", "cha", "saves", "skills"];
            case "combat":
                return ["armor class", "hit dice", "resistances", "vulnerabilities", "immunities", "conditions"];
            case "actions":
                return ["traits", "actions", "legendary", "lair", "regional"];
        }

        return null;
    }

    getMonsters() {
        var monsters = [];
        this.props.library.forEach(group => {
            group.monsters.forEach(monster => {
                var match = true;

                if (this.props.combatant.id === monster.id) {
                    match = false;
                }

                if (this.state.filter.size && (this.props.combatant.size !== monster.size)) {
                    match = false;
                }

                if (this.state.filter.type && (this.props.combatant.category !== monster.category)) {
                    match = false;
                }

                if (this.state.filter.subtype && (this.props.combatant.tag !== monster.tag)) {
                    match = false;
                }

                if (this.state.filter.alignment && (this.props.combatant.alignment !== monster.alignment)) {
                    match = false;
                }

                if (this.state.filter.challenge && (this.props.combatant.challenge !== monster.challenge)) {
                    match = false;
                }

                if (match) {
                    monsters.push(monster);
                }
            })
        });

        return monsters;
    }

    getHelpSection(monsters) {
        switch (this.state.helpSection) {
            case "speed":
                return this.getValueSection("speed", "count", monsters);
            case "senses":
                return this.getValueSection("senses", "count", monsters);
            case "languages":
                return this.getValueSection("languages", "count", monsters);
            case "equipment":
                return this.getValueSection("equipment", "count", monsters);
            case "str":
                return this.getValueSection("str", "value", monsters.map(m => m.abilityScores));
            case "dex":
                return this.getValueSection("dex", "value", monsters.map(m => m.abilityScores));
            case "con":
                return this.getValueSection("con", "value", monsters.map(m => m.abilityScores));
            case "int":
                return this.getValueSection("int", "value", monsters.map(m => m.abilityScores));
            case "wis":
                return this.getValueSection("wis", "value", monsters.map(m => m.abilityScores));
            case "cha":
                return this.getValueSection("cha", "value", monsters.map(m => m.abilityScores));
            case "saves":
                return this.getValueSection("savingThrows", "count", monsters);
            case "skills":
                return this.getValueSection("skills", "count", monsters);
            case "armor class":
                return this.getValueSection("ac", "value", monsters);
            case "hit dice":
                return this.getValueSection("hitDice", "value", monsters);
            case "resistances":
                return this.getValueSection("resist", "count", monsters.map(m => m.damage));
            case "vulnerabilities":
                return this.getValueSection("vulnerable", "count", monsters.map(m => m.damage));
            case "immunities":
                return this.getValueSection("immune", "count", monsters.map(m => m.damage));
            case "conditions":
                return this.getValueSection("conditionImmunities", "count", monsters);
            case "traits":
                return this.getActionsSection("trait", monsters);
            case "actions":
                return this.getActionsSection("action", monsters);
            case "legendary":
                return this.getActionsSection("legendary", monsters);
            case "lair":
                return this.getActionsSection("lair", monsters);
            case "regional":
                return this.getActionsSection("regional", monsters);
        }

        return null;
    }

    getValueSection(field, sortBy, monsters) {
        var values = monsters
            .map(m => m[field])
            .filter(v => !!v);

        var distinct = [];
        if (sortBy === "value") {
            var min = null, max = null;
            values.forEach(v => {
                if ((min === null) || (v < min)) {
                    min = v;
                }
                if ((max === null) || (v > max)) {
                    max = v;
                }
            });
            if ((min !== null) && (max !== null)) {
                for (var n = min; n <= max; ++n) {
                    distinct.push({
                        value: n,
                        count: 0
                    });
                }
            }
        }
        values.forEach(v => {
            var current = distinct.find(d => d.value === v);
            if (current) {
                current.count += 1;
            } else {
                distinct.push({
                    value: v,
                    count: 1
                });
            }
        });

        if (distinct.length !== 0) {
            switch (sortBy) {
                case "value":
                    sortByValue(distinct);
                    break;
                case "count":
                    sortByCount(distinct);
                    break;
            }
    
            var valueSections = distinct.map(d => {
                var width = 100 * d.count / monsters.length;
                return (
                    <div className="row small-up-3 medium-up-3 large-up-3 value-list" key={distinct.indexOf(d)}>
                        <div className="column">
                            <div className="text-container">
                                {d.value}
                            </div>
                        </div>
                        <div className="column">
                            <div className="bar-container">
                                <div className="bar" style={{ width: width + "%" }}></div>
                            </div>
                        </div>
                        <div className="column">
                            <button onClick={() => this.props.changeValue(this.props.combatant, field, d.value)}>use this value</button>
                        </div>
                    </div>
                );
            });
    
            // TODO: Button to populate with a random value
            return (
                <div>
                    {valueSections}
                </div>
            );
        } else {
            return (
                <div className="no-values">
                    no values
                </div>
            );
        }
    }

    getActionsSection(type, monsters) {
        var actionType = null;
        switch (type) {
            case "trait":
                actionType = "traits";
                break;
            case "action":
                actionType = "actions";
                break;
            case "legendary":
                actionType = "legendary actions";
                break;
            case "lair":
                actionType = "lair actions";
                break;
            case "regional":
                actionType = "regional effects";
                break;
        }

        var min = null, max = null, count = null;
        monsters.forEach(m => {
            var n = m.traits.filter(t => t.type === type).length;
            if ((min === null) || (n < min)) {
                min = n;
            }
            if ((max === null) || (n > max)) {
                max = n;
            }
            count += n;
        });
        var avg = Math.round(count / monsters.length);

        if (count === 0) {
            return (
                <div className="action-count">
                    number of {actionType}: <b>0</b>
                </div>
            );
        } else {
            // TODO: Button to copy a random trait
            return (
                <div className="action-count">
                    number of {actionType}: <b>{min} - {max} (average {avg})</b>
                </div>
            );
        }
    }

    getFilterCard() {
        var buttons = [
            // TODO: Add explanation
            <ConfirmButton
                key="splice"
                text="gene splice"
                disabled={true}         // TODO: Disabled if fewer than 2 monsters
                callback={() => null}   // TODO: Gene splice
            />
        ];

        var filterContent = null;
        if (this.state.showFilter) {
            filterContent = (
                <div>
                    <Checkbox
                        label="match size"
                        checked={this.state.filter.size}
                        changeValue={value => this.toggleMatch("size")}
                    />
                    <Checkbox
                        label="match type"
                        checked={this.state.filter.type}
                        changeValue={value => this.toggleMatch("type")}
                    />
                    <Checkbox
                        label="match subtype"
                        checked={this.state.filter.subtype}
                        disabled={!this.props.combatant.tag}
                        changeValue={value => this.toggleMatch("subtype")}
                    />
                    <Checkbox
                        label="match alignment"
                        checked={this.state.filter.alignment}
                        disabled={!this.props.combatant.alignment}
                        changeValue={value => this.toggleMatch("alignment")}
                    />
                    <Checkbox
                        label="match challenge rating"
                        checked={this.state.filter.challenge}
                        changeValue={value => this.toggleMatch("challenge")}
                    />
                    {buttons}
                </div>
            );
        } else {
            filterContent = (
                <div>
                    {buttons}
                </div>
            );
        }

        return (
            <div className="section">
                <div className="card">
                    <div className="heading">
                        <div className="title">similar monsters</div>
                        <img className={this.state.showFilter ? "image rotate" : "image"} src="content/down-arrow.svg" onClick={() => this.toggleFilter()} />
                    </div>
                    <div className="card-content">
                        {filterContent}
                    </div>
                </div>
            </div>
        );
    }

    getMonsterCards(monsters) {
        var monsters = sort(monsters);
        var monsterCards = monsters.map(m => (
            <div className="section" key={m.id}>
                <MonsterCard
                    combatant={m}
                    mode={"template " + this.state.page}
                    copyTrait={trait => this.props.copyTrait(this.props.combatant, trait)}
                />
            </div>
        ));

        if (monsterCards.length === 0) {
            monsterCards.push(
                <div className="section centered" key="none">
                    no monsters to show
                </div>
            )
        }

        return monsterCards;
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

            var monsters = [];
            if (this.props.showMonsters) {
                monsters = this.getMonsters();
            }

            var content = null;
            var help = null;
            switch (this.state.page) {
                case 'overview':
                    var categories = ["aberration", "beast", "celestial", "construct", "dragon", "elemental", "fey", "fiend", "giant", "humanoid", "monstrosity", "ooze", "plant", "undead"];
                    var catOptions = categories.map(cat => { return { id: cat, text: cat }; });
        
                    var sizes = ["tiny", "small", "medium", "large", "huge", "gargantuan"];
                    var sizeOptions = sizes.map(size => { return { id: size, text: size }; });

                    content = (
                        <div className="row">
                            <div className="columns small-6 medium-6 large-6">
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
                            <div className="columns small-6 medium-6 large-6">
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
                        <div className="row">
                            <div className="columns small-6 medium-6 large-6">
                                <div className="subheading">ability scores</div>
                                <AbilityScorePanel
                                    edit={true}
                                    combatant={this.props.combatant}
                                    nudgeValue={(source, type, delta) => this.props.nudgeValue(source, type, delta)}
                                />
                            </div>
                            <div className="columns small-6 medium-6 large-6">
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
                        <div className="row">
                            <div className="columns small-6 medium-6 large-6">
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
                                    display={value => value + "d" + hitDieType(this.props.combatant.size)}
                                    nudgeValue={delta => this.props.nudgeValue(this.props.combatant, "hitDice", delta)}
                                />
                                <div className="subheading">hit points</div>
                                <div className="hp-value">{this.props.combatant.hpMax} hp</div>
                            </div>
                            <div className="columns small-6 medium-6 large-6">
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

            var help = null;
            if (this.props.showMonsters && (monsters.length > 1)) {
                var selector = null;
                if (this.getHelpOptionsForPage(this.state.page).length > 1) {
                    var options = this.getHelpOptionsForPage(this.state.page).map(s => {
                        return {
                            id: s,
                            text: s
                        };
                    });
                    selector = (
                        <Selector
                            tabs={false}
                            options={options}
                            selectedID={this.state.helpSection}
                            select={optionID => this.setHelpSection(optionID)}
                        />
                    );
                }

                help = (
                    <div className="monster-help">
                        <div className="subheading">information from similar monsters</div>
                        {selector}
                        {this.getHelpSection(monsters)}
                    </div>
                );
            }

            var monsterList = null;
            if (this.props.showMonsters) {
                monsterList = (
                    <div className="columns small-4 medium-4 large-4 scrollable">
                        {this.getFilterCard()}
                        {this.getMonsterCards(monsters)}
                    </div>
                );
            }

            return (
                <div className="row" style={{ height: "100%", margin: "0 -15px" }}>
                    <div className={this.props.showMonsters ? "columns small-8 medium-8 large-8 scrollable" : "columns small-12 medium-12 large-12 scrollable"} style={{ transition: "none" }}>
                        <Selector
                            tabs={true}
                            options={pages}
                            selectedID={this.state.page}
                            select={optionID => this.setPage(optionID)}
                        />
                        {content}
                        {help}
                    </div>
                    {monsterList}
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}