class MonsterEditorModal extends React.Component {
    constructor(props) {
        super();
        this.state = {
            monster: props.monster,
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

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Helper methods

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

                if (this.state.monster.id === monster.id) {
                    match = false;
                }

                if (this.state.filter.size && (this.state.monster.size !== monster.size)) {
                    match = false;
                }

                if (this.state.filter.type && (this.state.monster.category !== monster.category)) {
                    match = false;
                }

                if (this.state.filter.subtype && (this.state.monster.tag !== monster.tag)) {
                    match = false;
                }

                if (this.state.filter.alignment && (this.state.monster.alignment !== monster.alignment)) {
                    match = false;
                }

                if (this.state.filter.challenge && (this.state.monster.challenge !== monster.challenge)) {
                    match = false;
                }

                if (match) {
                    monsters.push(monster);
                }
            })
        });

        return monsters;
    }

    setRandomValue(field, monsters, notify) {
        var index = Math.floor(Math.random() * monsters.length);
        var m = monsters[index];

        var source = m;
        var value = null;
        var tokens = field.split(".");
        tokens.forEach(token => {
            if (token === tokens[tokens.length - 1]) {
                value = source[token];
            } else {
                source = source[token];
            }
        });

        this.changeValue(field, value, notify);
    }

    geneSplice(monsters) {
        [
            "speed",
            "senses",
            "languages",
            "equipment",
            "abilityScores.str",
            "abilityScores.dex",
            "abilityScores.con",
            "abilityScores.int",
            "abilityScores.wis",
            "abilityScores.cha",
            "savingThrows",
            "skills",
            "ac",
            "hitDice",
            "damage.resist",
            "damage.vulnerable",
            "damage.immune",
            "conditionImmunities"
        ].forEach(field => {
            this.setRandomValue(field, monsters, false);
        });

        TRAIT_TYPES.forEach(type => {
            // Clear current traits of this type
            var current = this.state.monster.traits.filter(t => t.type === type);
            current.forEach(c => {
                var index = this.state.monster.traits.findIndex(t => t === c);
                this.state.monster.traits.splice(index, 1);
            })

            // Get all traits of this type
            var traits = [];
            monsters.forEach(m => {
                m.traits.filter(t => t.type === type)
                    .forEach(t => traits.push(t));
            });

            // Collate by name
            var distinct = [];
            traits.forEach(t => {
                var current = distinct.find(d => d.trait.name === t.name);
                if (current) {
                    current.count += 1;
                } else {
                    distinct.push({
                        trait: t,
                        count: 1
                    });
                }
            });

            // If any are common to all monsters, copy them and remove from the candidates
            var addedIDs = [];
            distinct.filter(d => d.count === monsters.length)
                .forEach(d => {
                    this.copyTrait(d.trait);
                    addedIDs.push(d.trait.id);
                });
            addedIDs.forEach(id => {
                var index = distinct.findIndex(d => d.trait.id === id);
                distinct.splice(index, 1);
            });

            var avg = traits.length / monsters.length;
            while (this.state.monster.traits.filter(t => t.type === type).length < avg) {
                var index = Math.floor(Math.random() * distinct.length);
                var t = distinct[index].trait;
                this.copyTrait(t);
                distinct.splice(index, 1);
            }
        });

        this.setState({
            monster: this.state.monster
        });
    }

    addTrait(type) {
        var trait = {
            id: guid(),
            name: "New " + this.getActionTypeName(type).toLowerCase(),
            usage: "",
            type: type,
            text: ""
        }
        this.state.monster.traits.push(trait);
        this.setState({
            library: this.state.library
        });
    }

    addRandomTrait(type, monsters) {
        var traits = [];
        monsters.forEach(m => {
            m.traits.filter(t => t.type === type)
                .forEach(t => {
                    traits.push(t);
                });
        });

        var index = Math.floor(Math.random() * traits.length);
        var trait = traits[index];

        this.copyTrait(trait);
    }

    removeTrait(trait) {
        var index = this.state.monster.traits.indexOf(trait);
        this.state.monster.traits.splice(index, 1);
        this.setState({
            library: this.state.library
        });
    }

    getActionTypeName(type) {
        return traitType(type) + "s";
    }

    copyTrait(trait) {
        var copy = JSON.parse(JSON.stringify(trait));
        copy.id = guid();
        this.state.monster.traits.push(copy);
        this.setState({
            library: this.state.library
        });
    }

    nudgeValue(field, delta) {
        var source = this.state.monster;
        var value = null;
        var tokens = field.split(".");
        tokens.forEach(token => {
            if (token === tokens[tokens.length - 1]) {
                value = source[token];
            } else {
                source = source[token];
            }
        });

        var newValue = null;
        if (field === "challenge") {
            newValue = nudgeChallenge(value, delta);
        } else {
            newValue = value + delta;
        }

        this.changeValue(field, newValue);
    }

    changeValue(field, value, notify = true) {
        var source = this.state.monster;
        var tokens = field.split(".");
        tokens.forEach(token => {
            if (token === tokens[tokens.length - 1]) {
                source[token] = value;

                if (notify) {
                    this.setState({
                        monster: this.state.monster
                    });
                }
            } else {
                source = source[token];
            }
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // HTML render methods

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
                return this.getValueSection("abilityScores.str", "number", monsters);
            case "dex":
                return this.getValueSection("abilityScores.dex", "number", monsters);
            case "con":
                return this.getValueSection("abilityScores.con", "number", monsters);
            case "int":
                return this.getValueSection("abilityScores.int", "number", monsters);
            case "wis":
                return this.getValueSection("abilityScores.wis", "number", monsters);
            case "cha":
                return this.getValueSection("abilityScores.cha", "number", monsters);
            case "saves":
                return this.getValueSection("savingThrows", "text", monsters);
            case "skills":
                return this.getValueSection("skills", "text", monsters);
            case "armor class":
                return this.getValueSection("ac", "number", monsters);
            case "hit dice":
                return this.getValueSection("hitDice", "number", monsters);
            case "resistances":
                return this.getValueSection("damage.resist", "text", monsters);
            case "vulnerabilities":
                return this.getValueSection("damage.vulnerable", "text", monsters);
            case "immunities":
                return this.getValueSection("damage.immune", "text", monsters);
            case "conditions":
                return this.getValueSection("conditionImmunities", "text", monsters);
            case "actions":
                return this.getActionsSection(monsters);
        }

        return null;
    }

    getValueSection(field, dataType, monsters) {
        var values = monsters
            .map(m => {
                var tokens = field.split(".");
                var source = m;
                var value = null;
                tokens.forEach(token => {
                    if (token === tokens[tokens.length - 1]) {
                        value = source[token];
                    } else {
                        source = source[token];
                    }
                });
                if ((dataType === "text") && (value === "")) {
                    value = null;
                }
                return value;
            })
            .filter(v => v !== null);

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
                    value: "",
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
                        <button onClick={() => this.changeValue(field, d.value)}>use this value</button>
                    </div>
                </div>
            );
        });

        return (
            <div>
                {valueSections}
                <button onClick={() => this.setRandomValue(field, monsters, true)}>select random value</button>
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

        TRAIT_TYPES.forEach(type => {    
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

            rows.push(
                <div className="row small-up-4 medium-up-4 large-up-4 value-list" key={type}>
                    <div className="column">
                        <div className={count === 0 ? "text-container disabled" : "text-container"}>
                            {this.getActionTypeName(type)}
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
                    <div className="column">
                        <button className={count === 0 ? "disabled" : ""} onClick={() => this.addRandomTrait(type, monsters)}>add random</button>
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
                        label={"size " + this.state.monster.size}
                        checked={this.state.filter.size}
                        changeValue={value => this.toggleMatch("size")}
                    />
                    <Checkbox
                        label={"type " + this.state.monster.category}
                        checked={this.state.filter.type}
                        changeValue={value => this.toggleMatch("type")}
                    />
                    <Checkbox
                        label={this.state.monster.tag ? "subtype " + this.state.monster.tag : "subtype"}
                        checked={this.state.filter.subtype}
                        disabled={!this.state.monster.tag}
                        changeValue={value => this.toggleMatch("subtype")}
                    />
                    <Checkbox
                        label={this.state.monster.alignment ? "alignment " + this.state.monster.alignment : "alignment"}
                        checked={this.state.filter.alignment}
                        disabled={!this.state.monster.alignment}
                        changeValue={value => this.toggleMatch("alignment")}
                    />
                    <Checkbox
                        label={"challenge rating " + challenge(this.state.monster.challenge)}
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
                    copyTrait={trait => this.copyTrait(trait)}
                />
            </div>
        ));

        return monsterCards;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
                    var catOptions = CATEGORY_TYPES.map(cat => { return { id: cat, text: cat }; });
                    var sizeOptions = SIZE_TYPES.map(size => { return { id: size, text: size }; });

                    content = (
                        <div className="row">
                            <div className="columns small-6 medium-6 large-6">
                                <div className="subheading">name</div>
                                <input type="text" value={this.state.monster.name} onChange={event => this.changeValue("name", event.target.value)} />
                                <div className="subheading">size</div>
                                <Dropdown
                                    options={sizeOptions}
                                    selectedID={this.state.monster.size}
                                    select={optionID => this.changeTrait("size", optionID)}
                                />
                                <div className="subheading">type</div>
                                <Dropdown
                                    options={catOptions}
                                    selectedID={this.state.monster.category}
                                    select={optionID => this.changeValue("category", optionID)}
                                />
                                <div className="subheading">subtype</div>
                                <input type="text" value={this.state.monster.tag} onChange={event => this.changeValue("tag", event.target.value)} />
                                <div className="subheading">alignment</div>
                                <input type="text" value={this.state.monster.alignment} onChange={event => this.changeValue("alignment", event.target.value)} />
                            </div>
                            <div className="columns small-6 medium-6 large-6">
                                <div className="subheading">challenge rating</div>
                                <Spin
                                    source={this.state.monster}
                                    name="challenge"
                                    display={value => challenge(value)}
                                    nudgeValue={delta => this.nudgeValue("challenge", delta)}
                                />
                                <div className="subheading">speed</div>
                                <input type="text" value={this.state.monster.speed} onChange={event => this.changeValue("speed", event.target.value)} />
                                <div className="subheading">senses</div>
                                <input type="text" value={this.state.monster.senses} onChange={event => this.changeValue("senses", event.target.value)} />
                                <div className="subheading">languages</div>
                                <input type="text" value={this.state.monster.languages} onChange={event => this.changeValue("languages", event.target.value)} />
                                <div className="subheading">equipment</div>
                                <input type="text" value={this.state.monster.equipment} onChange={event => this.changeValue("equipment", event.target.value)} />
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
                                    combatant={this.state.monster}
                                    nudgeValue={(source, type, delta) => this.nudgeValue(source, type, delta)}
                                />
                            </div>
                            <div className="columns small-6 medium-6 large-6">
                                <div className="subheading">saving throws</div>
                                <input type="text" value={this.state.monster.savingThrows} onChange={event => this.changeValue("savingThrows", event.target.value)} />
                                <div className="subheading">skills</div>
                                <input type="text" value={this.state.monster.skills} onChange={event => this.changeValue("skills", event.target.value)} />
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
                                    source={this.state.monster}
                                    name="ac"
                                    nudgeValue={delta => this.nudgeValue("ac", delta)}
                                />
                                <div className="subheading">hit dice</div>
                                <Spin
                                    source={this.state.monster}
                                    name="hitDice"
                                    display={value => value + "d" + hitDieType(this.state.monster.size)}
                                    nudgeValue={delta => this.nudgeValue("hitDice", delta)}
                                />
                                <div className="subheading">hit points</div>
                                <div className="hp-value">{this.state.monster.hpMax} hp</div>
                            </div>
                            <div className="columns small-6 medium-6 large-6">
                                <div className="subheading">damage resistances</div>
                                <input type="text" value={this.state.monster.damage.resist} onChange={event => this.changeValue("damage.resist", event.target.value)} />
                                <div className="subheading">damage vulnerabilities</div>
                                <input type="text" value={this.state.monster.damage.vulnerable} onChange={event => this.changeValue("damage.vulnerable", event.target.value)} />
                                <div className="subheading">damage immunities</div>
                                <input type="text" value={this.state.monster.damage.immune} onChange={event => this.changeValue("damage.immune", event.target.value)} />
                                <div className="subheading">condition immunities</div>
                                <input type="text" value={this.state.monster.conditionImmunities} onChange={event => this.changeValue("conditionImmunities", event.target.value)} />
                            </div>
                        </div>
                    );
                    break;
                case 'actions':
                    content = (
                        <TraitsPanel
                            combatant={this.state.monster}
                            edit={true}
                            addTrait={type => this.addTrait(type)}
                            removeTrait={trait => this.removeTrait(trait)}
                            changeTrait={(trait, type, value) => this.changeTrait(trait, type, value)}
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