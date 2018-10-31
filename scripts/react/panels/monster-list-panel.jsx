class MonsterListPanel extends React.Component {
    constructor() {
        super();
        this.state = {
            showFilter: false,
            matchSize: true,
            matchType: true,
            matchSubtype: false,
            matchAlignment: false,
            matchCR: true,
            filterText: ""
        };
    }

    toggleFilter() {
        this.setState({
            showFilter: !this.state.showFilter
        });
    }

    setMatchSize(match) {
        this.setState({
            matchSize: match
        });
    }

    setMatchType(match) {
        this.setState({
            matchType: match
        });
    }

    setMatchSubtype(match) {
        this.setState({
            matchSubtype: match
        });
    }

    setMatchAlignment(match) {
        this.setState({
            matchAlignment: match
        });
    }

    setMatchCR(match) {
        this.setState({
            matchCR: match
        });
    }

    setFilterText(text) {
        this.setState({
            filterText: text
        });
    }

    render() {
        try {
            var filterContent = null;
            if (this.state.showFilter) {
                var subtype = null;
                if (this.props.monster.tag) {
                    subtype = (
                        <Checkbox
                            label="match subtype"
                            checked={this.state.matchSubtype}
                            changeValue={value => this.setMatchSubtype(value)}
                        />
                    );
                }
                var alignment = null;
                if (this.props.monster.alignment) {
                    alignment = (
                        <Checkbox
                            label="match alignment"
                            checked={this.state.matchAlignment}
                            changeValue={value => this.setMatchAlignment(value)}
                        />
                    );
                }

                filterContent = (
                    <div>
                        <input type="text" placeholder="filter" value={this.state.filterText} onChange={event => this.setFilterText(event.target.value)} />
                        <Checkbox
                            label="match size"
                            checked={this.state.matchSize}
                            changeValue={value => this.setMatchSize(value)}
                        />
                        <Checkbox
                            label="match type"
                            checked={this.state.matchType}
                            changeValue={value => this.setMatchType(value)}
                        />
                        {subtype}
                        {alignment}
                        <Checkbox
                            label="match challenge rating"
                            checked={this.state.matchCR}
                            changeValue={value => this.setMatchCR(value)}
                        />
                    </div>
                );
            } else {
                filterContent = (
                    <input type="text" placeholder="name" value={this.state.filterText} onChange={event => this.setFilterText(event.target.value)} />
                );
            }

            var monsters = [];
            this.props.library.forEach(group => {
                group.monsters.forEach(monster => {
                    var match = true;

                    if (this.props.monster.id === monster.id) {
                        match = false;
                    }

                    if (this.state.filterText && (monster.name.toLowerCase().indexOf(this.state.filterText.toLowerCase()) === -1)) {
                        match = false;
                    }

                    if (this.state.matchSize && (this.props.monster.size !== monster.size)) {
                        match = false;
                    }

                    if (this.state.matchType && (this.props.monster.category !== monster.category)) {
                        match = false;
                    }

                    if (this.state.matchSubtype && (this.props.monster.tag !== monster.tag)) {
                        match = false;
                    }

                    if (this.state.matchAlignment && (this.props.monster.alignment !== monster.alignment)) {
                        match = false;
                    }

                    if (this.state.matchCR && (this.props.monster.challenge !== monster.challenge)) {
                        match = false;
                    }

                    if (match) {
                        monsters.push(monster);
                    }
                })
            });

            sort(monsters);

            var monsterCards = monsters.map(m => (
                <div className="section" key={m.id}>
                    <MonsterCard
                        combatant={m}
                        mode={"template " + this.props.mode}
                        copyTrait={trait => this.props.copyTrait(trait)}
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

            return (
                <div>
                    <div className="section">
                        <div className="card">
                            <div className="heading">
                                <div className="title">match creatures</div>
                                <img className={this.state.showFilter ? "image rotate" : "image"} src="content/down-arrow.svg" onClick={() => this.toggleFilter()} />
                            </div>
                            <div className="card-content">
                                {filterContent}
                            </div>
                        </div>
                    </div>
                    {monsterCards}
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    };
}