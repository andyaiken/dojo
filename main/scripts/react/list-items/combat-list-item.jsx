class CombatListItem extends React.Component {
    render() {
        try {
            var combatName = this.props.combat.name;
            if (!combatName) {
                combatName = "unnamed combat";
            }

            var style = this.props.selected ? "list-item selected" : "list-item";

            return (
                <div className="group">
                    <div className={style} onClick={() => this.props.setSelection(this.props.combat)}>
                        <div className="heading">{combatName}</div>
                        <div className="text">{this.props.combat.timestamp}</div>
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}