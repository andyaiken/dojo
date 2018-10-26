class TraitPanel extends React.Component {
    constructor() {
        super();
        this.state = {
            dropdownOpen: false
        };
    }

    selectType(type) {
        if (type) {
            this.props.changeTrait(this.props.trait, "type", type);
            this.setState({
                dropdownOpen: false
            });
        } else {
            this.setState({
                dropdownOpen: !this.state.dropdownOpen
            });
        }
    }

    render() {
        try {
            var dropdownItems = [];
            var types = ["trait", "action", "legendary", "lair", "regional"];
            for (var n = 0; n !== types.length; ++n) {
                var type = types[n];
                dropdownItems.push(
                    <DropdownItem
                        key={n}
                        text={traitType(type)}
                        item={type}
                        selected={this.props.trait.type === type}
                        onSelect={item => this.selectType(item)} />
                );
            }

            var details = (
                <div className="section">
                    <div className="dropdown">
                        <button className="dropdown-button" onClick={() => this.selectType()}>
                            <div className="title">{traitType(this.props.trait.type)}</div>
                            <img className="image" src="content/ellipsis.svg" />
                        </button>
                        <div className={this.state.dropdownOpen ? "dropdown-content open" : "dropdown-content"}>
                            {dropdownItems}
                        </div>
                    </div>
                    <input type="text" placeholder="name" value={this.props.trait.name} onChange={event => this.props.changeTrait(this.props.trait, "name", event.target.value)} />
                    <input type="text" placeholder="usage" value={this.props.trait.usage} onChange={event => this.props.changeTrait(this.props.trait, "usage", event.target.value)} />
                    <textarea placeholder="details" value={this.props.trait.text} onChange={event => this.props.changeTrait(this.props.trait, "text", event.target.value)} />
                    <div className="divider"></div>
                    <ConfirmButton text="delete" callback={() => this.props.removeTrait(this.props.trait)} />
                </div>
            );

            return (
                <Expander text={this.props.trait.name || "unnamed trait"} content={details} />
            );
        } catch (e) {
            console.error(e);
        }
    }
}