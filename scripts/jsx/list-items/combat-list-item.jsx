class CombatListItem extends React.Component {
    render() {
        try {
            var combatName = this.props.combat.name;
            if (!combatName) {
                combatName = "unnamed combat";
            }

            return (
                <div className={this.props.selected ? "list-item selected" : "list-item"} onClick={() => this.props.setSelection(this.props.combat)}>
                    <div className="heading">{combatName}</div>
                    <div className="text">{this.props.combat.timestamp}</div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}