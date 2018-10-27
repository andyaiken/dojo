class TraitsPanel extends React.Component {
    render() {
        try {
            var traits = [];
            var actions = [];
            var legendaryActions = [];
            var lairActions = [];
            var regionalEffects = [];

            for (var n = 0; n != this.props.combatant.traits.length; ++n) {
                var action = this.props.combatant.traits[n];
                var heading = action.name;
                if (!heading) {
                    heading = "unnamed " + traitType(action.type);
                }
                if (action.usage) {
                    heading += " (" + action.usage + ")";
                }

                var item = null;
                if (this.props.edit) {
                    item = <TraitPanel
                        key={action.id}
                        trait={action}
                        changeTrait={(action, type, value) => this.props.changeTrait(action, type, value)}
                        removeTrait={action => this.props.removeTrait(action)} />
                } else {
                    item = (
                        <div key={action.id} className="section trait">
                            <b>{heading}</b> {action.text}
                        </div>
                    );
                }

                switch (action.type) {
                    case "trait":
                        traits.push(item);
                        break;
                    case "action":
                        actions.push(item);
                        break;
                    case "legendary":
                        legendaryActions.push(item);
                        break;
                    case "lair":
                        lairActions.push(item);
                        break;
                    case "regional":
                        regionalEffects.push(item);
                        break;
                }
            }

            if (this.props.edit) {
                traits.push(
                    <button key="add" onClick={() => this.props.addTrait("trait")}>add a new trait</button>
                );
                actions.push(
                    <button key="add" onClick={() => this.props.addTrait("action")}>add a new action</button>
                );
                legendaryActions.push(
                    <button key="add" onClick={() => this.props.addTrait("legendary")}>add a new legendary action</button>
                );
                lairActions.push(
                    <button key="add" onClick={() => this.props.addTrait("lair")}>add a new lair action</button>
                );
                regionalEffects.push(
                    <button key="add" onClick={() => this.props.addTrait("regional")}>add a new regional effect</button>
                );
            }

            return (
                <div>
                    <div style={{ display: traits.length > 0 ? "" : "none" }}>
                        <div className="section input-label">traits</div>
                        {traits}
                    </div>
                    <div style={{ display: actions.length > 0 ? "" : "none" }}>
                        <div className="section input-label">actions</div>
                        {actions}
                    </div>
                    <div style={{ display: legendaryActions.length > 0 ? "" : "none" }}>
                        <div className="section input-label">legendary actions</div>
                        {legendaryActions}
                    </div>
                    <div style={{ display: lairActions.length > 0 ? "" : "none" }}>
                        <div className="section input-label">lair actions</div>
                        {lairActions}
                    </div>
                    <div style={{ display: regionalEffects.length > 0 ? "" : "none" }}>
                        <div className="section input-label">regional effects</div>
                        {regionalEffects}
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    };
}