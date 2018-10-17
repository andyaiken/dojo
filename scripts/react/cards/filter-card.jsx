class FilterCard extends React.Component {
    constructor() {
        super();
        this.state = {
            showAll: false,
            categoryDropdownOpen: false,
            sizeDropdownOpen: false,
        };
    }

    toggleAll() {
        this.setState({
            showAll: !this.state.showAll
        })
    }

    selectCategory(category) {
        if (category) {
            this.setState({
                categoryDropdownOpen: false
            });
            this.props.changeValue("category", category);
        } else {
            this.setState({
                categoryDropdownOpen: !this.state.categoryDropdownOpen,
                sizeDropdownOpen: false
            });
        }
    }

    selectSize(size) {
        if (size) {
            this.setState({
                sizeDropdownOpen: false
            });
            this.props.changeValue("size", size);
        } else {
            this.setState({
                categoryDropdownOpen: false,
                sizeDropdownOpen: !this.state.sizeDropdownOpen
            });
        }
    }

    render() {
        try {
            var sizes = ["all sizes", "tiny", "small", "medium", "large", "huge", "gargantuan"];
            var sizeDropdownItems = [];
            sizes.forEach(size => {
                sizeDropdownItems.push(
                    <DropdownItem
                        key={size}
                        text={size}
                        item={size}
                        selected={this.props.filter.size === size}
                        onSelect={item => this.selectSize(item)} />
                )
            });

            var categories = ["all types", "aberration", "beast", "celestial", "construct", "dragon", "elemental", "fey", "fiend", "giant", "humanoid", "monstrosity", "ooze", "plant", "undead"];
            var categoryDropdownItems = [];
            categories.forEach(category => {
                categoryDropdownItems.push(
                    <DropdownItem
                        key={category}
                        text={category}
                        item={category}
                        selected={this.props.filter.category === category}
                        onSelect={item => this.selectCategory(item)} />
                )
            });

            var imageStyle = this.state.showAll ? "image rotate" : "image";

            var content = null;
            if (this.state.showAll) {
                content = (
                    <div>
                        <div className="section">
                            <input type="text" placeholder="name" value={this.props.filter.name} onChange={event => this.props.changeValue("name", event.target.value)} />
                        </div>
                        <div className="section">
                            <div className="spin">
                                <div className="spin-button wide toggle" onClick={() => this.props.nudgeValue("challengeMin", -1)}>
                                    <img className="image" src="content/minus.svg" />
                                </div>
                                <div className="spin-value">
                                    <div className="spin-label">min challege</div>
                                    <div className="spin-label">{challenge(this.props.filter.challengeMin)}</div>
                                </div>
                                <div className="spin-button wide toggle" onClick={() => this.props.nudgeValue("challengeMin", +1)}>
                                    <img className="image" src="content/plus.svg" />
                                </div>
                            </div>
                            <div className="spin">
                                <div className="spin-button wide toggle" onClick={() => this.props.nudgeValue("challengeMax", -1)}>
                                    <img className="image" src="content/minus.svg" />
                                </div>
                                <div className="spin-value">
                                    <div className="spin-label">max challege</div>
                                    <div className="spin-label">{challenge(this.props.filter.challengeMax)}</div>
                                </div>
                                <div className="spin-button wide toggle" onClick={() => this.props.nudgeValue("challengeMax", +1)}>
                                    <img className="image" src="content/plus.svg" />
                                </div>
                            </div>
                            <div className="dropdown">
                                <button className="dropdown-button" onClick={() => this.selectSize()}>
                                    <div className="title">{this.props.filter.size}</div>
                                    <img className="image" src="content/ellipsis.svg" />
                                </button>
                                <div className={this.state.sizeDropdownOpen ? "dropdown-content open" : "dropdown-content"}>
                                    {sizeDropdownItems}
                                </div>
                            </div>
                            <div className="dropdown">
                                <button className="dropdown-button" onClick={() => this.selectCategory()}>
                                    <div className="title">{this.props.filter.category}</div>
                                    <img className="image" src="content/ellipsis.svg" />
                                </button>
                                <div className={this.state.categoryDropdownOpen ? "dropdown-content open" : "dropdown-content"}>
                                    {categoryDropdownItems}
                                </div>
                            </div>
                        </div>
                        <div className="divider"></div>
                        <div className="section">
                            <button onClick={() => this.props.resetFilter()}>clear filter</button>
                        </div>
                    </div>
                );
            } else {
                var summary = "";
                if (this.props.filter.size !== "all sizes") {
                    summary += summary ? " " + this.props.filter.size : this.props.filter.size;
                }
                if (this.props.filter.category !== "all types") {
                    summary += summary ? " " + this.props.filter.category : this.props.filter.category;
                }
                summary += " monsters of cr " + challenge(this.props.filter.challengeMin) + " to " + challenge(this.props.filter.challengeMax);

                content = (
                    <div>
                        <div className="section">
                            <input type="text" placeholder="name" value={this.props.filter.name} onChange={event => this.props.changeValue("name", event.target.value)} />
                        </div>
                        <div className="section">showing {summary}</div>
                    </div>
                );
            }

            return (
                <div className="card">
                    <div className="heading">
                        <div className="title">filter</div>
                        <img className={imageStyle} src="content/down-arrow.svg" onClick={() => this.toggleAll()} />
                    </div>
                    <div className="card-content">
                        {content}
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}