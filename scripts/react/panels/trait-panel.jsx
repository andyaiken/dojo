class TraitPanel extends React.Component {
    render() {
        try {
            var details = (
                <div className="section">
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