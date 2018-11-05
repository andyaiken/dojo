class MonsterEditorModal extends React.Component {
    constructor() {
        super();
        this.state = {
            page: "overview",
            showMonsters: false,
            showFilter: false,
            helpSection: "speed",
            filter: {
                size: true,
                type: true,
                subtype: false,
                alignment: false,
                challenge: true,
                text: ""
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

    toggleMonsters() {
        this.setState({
            showMonsters: !this.state.showMonsters
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

    setFilterText(text) {
        this.state.filter.text = text;
        this.setState({
            filter: this.state.filter
        });
    }

    getHelpOptionsForPage(page) {
        switch (page) {
            case "overview":
                return ["speed", "senses", "languages", "equipment"];
            case "abilities":
                return ["ability scores", "saving throws", "skills"];
            case "combat":
                return ["armor class", "hit dice", "resistances", "vulnerabilities", "immunities", "conditions"];
            case "actions":
                return ["actions"];
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

                if (this.state.filter.text && (monster.name.toLowerCase().indexOf(this.state.filter.text.toLowerCase()) === -1)) {
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

    copyTrait(trait) {
        var copy = JSON.parse(JSON.stringify(trait));
        copy.id = guid();
        this.props.copyTrait(this.props.combatant, copy);
    }

    getHelpSection(monsters) {
        switch (this.state.helpSection) {
            case "speed":
                return this.getTextSection("speed", monsters);
            case "senses":
                return this.getTextSection("senses", monsters);
            case "languages":
                return this.getTextSection("languages", monsters);
            case "equipment":
                return this.getTextSection("equipment", monsters);
            case "ability scores":
                // TODO: Ability scores
                return (
                    null
                );
            case "saving throws":
                return this.getTextSection("savingThrows", monsters);
            case "skills":
                return this.getTextSection("skills", monsters);
            case "armor class":
                // TODO: AC
                return (
                    null
                );
            case "hit dice":
                // TODO: HD
                return (
                    null
                );
            case "resistances":
                return this.getTextSection("damage.resist", monsters);
            case "vulnerabilities":
                return this.getTextSection("damage.vulnerable", monsters);
            case "immunities":
                return this.getTextSection("damage.immune", monsters);
            case "conditions":
                return this.getTextSection("conditionImmunities", monsters);
            case "actions":
                // TODO: Traits and actions
                return (
                    null
                );
        }

        return null;
    }

    getTextSection(field, monsters) {
        var values = monsters
            .map(m => m[field])
            .filter(v => !!v);
        var distinct = [];
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
        sortByCount(distinct);
        var valueSections = distinct.map(d => {
            // TODO: Bar graph to show count
            return (
                <div className="row small-up-3 medium-up-3 large-up-3 value-list" key={distinct.indexOf(d)}>
                    <div className="column">
                        {d.value}
                    </div>
                    <div className="column">
                        x{d.count}
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
    }

    getFilterCard() {
        var filterContent = null;
        if (this.state.showFilter) {
            filterContent = (
                <div>
                    <input type="text" placeholder="filter" value={this.state.filter.text} onChange={event => this.setFilterText(event.target.value)} />
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
                </div>
            );
        } else {
            filterContent = (
                <input type="text" placeholder="filter" value={this.state.filter.text} onChange={event => this.setFilterText(event.target.value)} />
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
                    copyTrait={trait => this.copyTrait(trait)}
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
            if (this.state.showMonsters) {
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
            // TODO: Should only show the help section if there are > 1 monsters
            if (this.state.showMonsters) {
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
                    <div>
                        <div className="subheading">information from similar monsters</div>
                        {selector}
                        {this.getHelpSection(monsters)}
                    </div>
                );
            }

            var monsterList = null;
            if (this.state.showMonsters) {
                monsterList = (
                    <div className="columns small-4 medium-4 large-4 scrollable">
                        {this.getFilterCard()}
                        {this.getMonsterCards(monsters)}
                    </div>
                );
            }

            return (
                <div className="row" style={{ height: "100%", margin: "0 -15px" }}>
                    <div className={this.state.showMonsters ? "columns small-8 medium-8 large-8 scrollable" : "columns small-12 medium-12 large-12 scrollable"}>
                        <Selector
                            tabs={true}
                            options={pages}
                            selectedID={this.state.page}
                            select={optionID => this.setPage(optionID)}
                        />
                        {content}
                        <div className="divider"></div>
                        <Checkbox
                            label="show similar monsters"
                            checked={this.state.showMonsters}
                            changeValue={value => this.toggleMonsters()}
                        />
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