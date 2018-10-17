class TraitsPanel extends React.Component {
    render() {
        try {
            var result = null;

            if (this.props.edit) {
                var traits = [];
                for (var n = 0; n != this.props.combatant.traits.length; ++n) {
                    var trait = this.props.combatant.traits[n];
                    traits.push(
                        <TraitPanel
                            key={trait.id}
                            trait={trait}
                            changeTrait={(trait, type, value) => this.props.changeTrait(trait, type, value)}
                            removeTrait={trait => this.props.removeTrait(trait)} />
                    );
                }
                traits.push(
                    <button key="add" onClick={() => this.props.addTrait()}>add a new trait</button>
                );

                result = (
                    <div className="section">
                        {traits}
                    </div>
                );
            } else {
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

                    var item = (
                        <div key={action.id} className="section">
                            <b>{heading}</b> {action.text}
                        </div>
                    );

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

                result = (
                    <div>
                        <div style={{ display: traits.length > 0 ? "" : "none" }}>
                            <div className="section subheading">traits</div>
                            {traits}
                        </div>
                        <div style={{ display: actions.length > 0 ? "" : "none" }}>
                            <div className="section subheading">actions</div>
                            {actions}
                        </div>
                        <div style={{ display: legendaryActions.length > 0 ? "" : "none" }}>
                            <div className="section subheading">legendary actions</div>
                            {legendaryActions}
                        </div>
                        <div style={{ display: lairActions.length > 0 ? "" : "none" }}>
                            <div className="section subheading">lair actions</div>
                            {lairActions}
                        </div>
                        <div style={{ display: regionalEffects.length > 0 ? "" : "none" }}>
                            <div className="section subheading">regional effects</div>
                            {regionalEffects}
                        </div>
                    </div>
                );
            }

            return result;
        } catch (e) {
            console.error(e);
        }
    };
}