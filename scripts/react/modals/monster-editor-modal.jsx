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

    setRandomValue(field, monsters, source) {
        var index = Math.floor(Math.random() * monsters.length);
        var m = monsters[index];
        var src = source ? m[source] : m;
        var value = src[field];
        this.changeValue(field, source, value);
        // TODO: Notify that something has changed
    }

    geneSplice(monsters) {
        // TODO: Gene splice

        // Take random values for all fields from the source monsters
        // For traits, if there are any which are common to all, take them; then fill with other random items

        var fields = [
            {
                field: "speed",
                source: null
            },
            {
                field: "senses",
                source: null
            },
            {
                field: "languages",
                source: null
            },
            {
                field: "equipment",
                source: null
            },
            {
                field: "str",
                source: "abilityScores"
            },
            {
                field: "dex",
                source: "abilityScores"
            },
            {
                field: "con",
                source: "abilityScores"
            },
            {
                field: "int",
                source: "abilityScores"
            },
            {
                field: "wis",
                source: "abilityScores"
            },
            {
                field: "cha",
                source: "abilityScores"
            },
            {
                field: "savingThrows",
                source: null
            },
            {
                field: "skills",
                source: null
            },
            {
                field: "ac",
                source: null
            },
            {
                field: "hitDice",
                source: null
            },
            {
                field: "resist",
                source: "damage"
            },
            {
                field: "vulnerable",
                source: "damage"
            },
            {
                field: "immune",
                source: "damage"
            },
            {
                field: "conditionImmunities",
                source: null
            }
        ];

        fields.forEach(f => {
            var index = Math.floor(Math.random() * monsters.length);
            var m = monsters[index];
            var src = f.source ? m[f.source] : m;
            var value = src[f.field];
            this.changeValue(f.field, f.source, value);
        });

        // TODO: Notify that something has changed
    }

    changeValue(field, source, value) {
        var target = source ? this.props.combatant[source] : this.props.combatant;
        target[field] = value;
    }

    getHelpSection(monsters) {
        switch (this.state.helpSection) {
            case "speed":
                return this.getValueSection("speed", "text", monsters);
            case "senses":
                return this.getValueSection("senses", "text", monsters);
            case "languages":
                return this.getValueSection("languages", "text", monsters);
            case "equipment":
                return this.getValueSection("equipment", "text", monsters);
            case "str":
                return this.getValueSection("str", "number", monsters, "abilityScores");
            case "dex":
                return this.getValueSection("dex", "number", monsters, "abilityScores");
            case "con":
                return this.getValueSection("con", "number", monsters, "abilityScores");
            case "int":
                return this.getValueSection("int", "number", monsters, "abilityScores");
            case "wis":
                return this.getValueSection("wis", "number", monsters, "abilityScores");
            case "cha":
                return this.getValueSection("cha", "number", monsters, "abilityScores");
            case "saves":
                return this.getValueSection("savingThrows", "text", monsters);
            case "skills":
                return this.getValueSection("skills", "text", monsters);
            case "armor class":
                return this.getValueSection("ac", "number", monsters);
            case "hit dice":
                return this.getValueSection("hitDice", "number", monsters);
            case "resistances":
                return this.getValueSection("resist", "text", monsters, "damage");
            case "vulnerabilities":
                return this.getValueSection("vulnerable", "text", monsters, "damage");
            case "immunities":
                return this.getValueSection("immune", "text", monsters, "damage");
            case "conditions":
                return this.getValueSection("conditionImmunities", "text", monsters);
            case "actions":
                return this.getActionsSection(monsters);
        }

        return null;
    }

    getValueSection(field, dataType, monsters, source) {
        var values = monsters
            .map(m => source ? m[source] : m)
            .map(m => m[field])
            .filter(v => !!v);

        var distinct = [];
        if (dataType === "number") {
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

        switch (dataType) {
            case "number":
                sortByValue(distinct);
                break;
            case "text":
                sortByCount(distinct);
                break;
        }

        if (dataType === "text") {
            var count = monsters.length - values.length;
            if (count !== 0) {
                distinct.push({
                    value: null,
                    count: monsters.length - values.length
                });
            }
        }

        var valueSections = distinct.map(d => {
            var width = 100 * d.count / monsters.length;
            return (
                <div className="row small-up-3 medium-up-3 large-up-3 value-list" key={distinct.indexOf(d)}>
                    <div className="column">
                        <div className="text-container">
                            {d.value || "(none specified)"}
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
                <button onClick={() => this.setRandomValue(field, monsters, source)}>select random value</button>
            </div>
        );
    }

    getActionsSection(monsters) {
        var rows = [];
        rows.push(
            <div className="row small-up-3 medium-up-3 large-up-3 value-list" key="header">
                <div className="column">
                    <div className="text-container">
                        <b>type</b>
                    </div>
                </div>
                <div className="column">
                    <div className="text-container number">
                        <b>average number</b>
                    </div>
                </div>
                <div className="column">
                    <div className="text-container number">
                        <b>min - max</b>
                    </div>
                </div>
            </div>
        );

        ["trait", "action", "legendary", "lair", "regional"].forEach(type => {
            var actionName = null;
            switch (type) {
                case "trait":
                    actionName = "traits";
                    break;
                case "action":
                    actionName = "actions";
                    break;
                case "legendary":
                    actionName = "legendary actions";
                    break;
                case "lair":
                    actionName = "lair actions";
                    break;
                case "regional":
                    actionName = "regional effects";
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

            // TODO: Button to copy a random trait

            rows.push(
                <div className="row small-up-3 medium-up-3 large-up-3 value-list" key={type}>
                    <div className="column">
                        <div className={count === 0 ? "text-container disabled" : "text-container"}>
                            {actionName}
                        </div>
                    </div>
                    <div className="column">
                        <div className={count === 0 ? "text-container number disabled" : "text-container number"}>
                            {avg}
                        </div>
                    </div>
                    <div className="column">
                        <div className={count === 0 ? "text-container number disabled" : "text-container number"}>
                            {min} - {max}
                        </div>
                    </div>
                </div>
            );
        });

        return (
            <div>
                {rows}
            </div>
        );
    }

    getFilterCard(monsters) {
        var similar = (
            <div className="section">
                {monsters.length} similar monsters
            </div>
        );

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
                    <div className="divider"></div>
                    <button className={monsters.length < 2 ? "disabled" : ""} onClick={() => this.geneSplice(monsters)}>build random monster</button>
                    <div className="divider"></div>
                    {similar}
                </div>
            );
        } else {
            filterContent = (
                <div>
                    {similar}
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
                        {this.getFilterCard(monsters)}
                        {this.getMonsterCards(monsters)}
                    </div>
                );
            }

            return (
                <div className="row" style={{ height: "100%", margin: "0 -15px" }}>
                    <div className={this.props.showMonsters ? "columns small-8 medium-8 large-8 scrollable" : "columns small-12 medium-12 large-12 scrollable"} style={{ transition: "none" }}>
                        <div className="section">
                            <Selector
                                tabs={true}
                                options={pages}
                                selectedID={this.state.page}
                                select={optionID => this.setPage(optionID)}
                            />
                            {content}
                            {help}
                        </div>
                    </div>
                    {monsterList}
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}