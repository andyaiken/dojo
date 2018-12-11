class CombatListItem extends React.Component {
    render() {
        try {
            var combatName = this.props.combat.name;
            if (!combatName) {
                combatName = "unnamed combat";
            }

            var map = null;
            if (this.props.combat.map) {
                map = (
                    <div>
                        <div className="divider"></div>
                        <MapPanel
                            map={this.props.combat.map}
                            mode="thumbnail"
                        />
                    </div>
                );
            }

            return (
                <div className={this.props.selected ? "list-item selected" : "list-item"} onClick={() => this.props.setSelection(this.props.combat)}>
                    <div className="heading">{combatName}</div>
                    <div className="text">{this.props.combat.timestamp}</div>
                    {map}
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}