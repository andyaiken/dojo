class AbilityScorePanel extends React.Component {
    constructor() {
        super();
        this.state = {
            showAbilityScores: false
        };
    }

    toggleAbilityScores() {
        this.setState({
            showAbilityScores: !this.state.showAbilityScores
        })
    }

    render() {
        try {
            var result = null;

            if (this.props.edit) {
                result = (
                    <div className="section">
                        <div className="ability-scores">
                            <div className="ability-score">
                                <div className="spin">
                                    <div className="ability-spin toggle" onClick={() => this.props.nudgeValue("abilityScores.str", -1)}>
                                        <img className="image" src="content/minus.svg" />
                                    </div>
                                    <div className="ability-spin">
                                        <div className="ability-heading">str</div>
                                        <div className="ability-value">{this.props.combatant.abilityScores.str}</div>
                                    </div>
                                    <div className="ability-spin toggle" onClick={() => this.props.nudgeValue("abilityScores.str", +1)}>
                                        <img className="image" src="content/plus.svg" />
                                    </div>
                                </div>
                            </div>
                            <div className="ability-score">
                                <div className="spin">
                                    <div className="ability-spin toggle" onClick={() => this.props.nudgeValue("abilityScores.dex", -1)}>
                                        <img className="image" src="content/minus.svg" />
                                    </div>
                                    <div className="ability-spin">
                                        <div className="ability-heading">dex</div>
                                        <div className="ability-value">{this.props.combatant.abilityScores.dex}</div>
                                    </div>
                                    <div className="ability-spin toggle" onClick={() => this.props.nudgeValue("abilityScores.dex", +1)}>
                                        <img className="image" src="content/plus.svg" />
                                    </div>
                                </div>
                            </div>
                            <div className="ability-score">
                                <div className="spin">
                                    <div className="ability-spin toggle" onClick={() => this.props.nudgeValue("abilityScores.con", -1)}>
                                        <img className="image" src="content/minus.svg" />
                                    </div>
                                    <div className="ability-spin">
                                        <div className="ability-heading">con</div>
                                        <div className="ability-value">{this.props.combatant.abilityScores.con}</div>
                                    </div>
                                    <div className="ability-spin toggle" onClick={() => this.props.nudgeValue("abilityScores.con", +1)}>
                                        <img className="image" src="content/plus.svg" />
                                    </div>
                                </div>
                            </div>
                            <div className="ability-score">
                                <div className="spin">
                                    <div className="ability-spin toggle" onClick={() => this.props.nudgeValue("abilityScores.int", -1)}>
                                        <img className="image" src="content/minus.svg" />
                                    </div>
                                    <div className="ability-spin">
                                        <div className="ability-heading">int</div>
                                        <div className="ability-value">{this.props.combatant.abilityScores.int}</div>
                                    </div>
                                    <div className="ability-spin toggle" onClick={() => this.props.nudgeValue("abilityScores.int", +1)}>
                                        <img className="image" src="content/plus.svg" />
                                    </div>
                                </div>
                            </div>
                            <div className="ability-score">
                                <div className="spin">
                                    <div className="ability-spin toggle" onClick={() => this.props.nudgeValue("abilityScores.wis", -1)}>
                                        <img className="image" src="content/minus.svg" />
                                    </div>
                                    <div className="ability-spin">
                                        <div className="ability-heading">wis</div>
                                        <div className="ability-value">{this.props.combatant.abilityScores.wis}</div>
                                    </div>
                                    <div className="ability-spin toggle" onClick={() => this.props.nudgeValue("abilityScores.wis", +1)}>
                                        <img className="image" src="content/plus.svg" />
                                    </div>
                                </div>
                            </div>
                            <div className="ability-score">
                                <div className="spin">
                                    <div className="ability-spin toggle" onClick={() => this.props.nudgeValue("abilityScores.cha", -1)}>
                                        <img className="image" src="content/minus.svg" />
                                    </div>
                                    <div className="ability-spin">
                                        <div className="ability-heading">cha</div>
                                        <div className="ability-value">{this.props.combatant.abilityScores.cha}</div>
                                    </div>
                                    <div className="ability-spin toggle" onClick={() => this.props.nudgeValue("abilityScores.cha", +1)}>
                                        <img className="image" src="content/plus.svg" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            } else {
                result = (
                    <div className="section">
                        <div className="ability-scores toggle" onClick={() => this.toggleAbilityScores()}>
                            <div className="ability-score">
                                <div className="ability-heading">str</div>
                                <div className="ability-value">{this.state.showAbilityScores ? this.props.combatant.abilityScores.str : modifier(this.props.combatant.abilityScores.str)}</div>
                            </div>
                            <div className="ability-score">
                                <div className="ability-heading">dex</div>
                                <div className="ability-value">{this.state.showAbilityScores ? this.props.combatant.abilityScores.dex : modifier(this.props.combatant.abilityScores.dex)}</div>
                            </div>
                            <div className="ability-score">
                                <div className="ability-heading">con</div>
                                <div className="ability-value">{this.state.showAbilityScores ? this.props.combatant.abilityScores.con : modifier(this.props.combatant.abilityScores.con)}</div>
                            </div>
                            <div className="ability-score">
                                <div className="ability-heading">int</div>
                                <div className="ability-value">{this.state.showAbilityScores ? this.props.combatant.abilityScores.int : modifier(this.props.combatant.abilityScores.int)}</div>
                            </div>
                            <div className="ability-score">
                                <div className="ability-heading">wis</div>
                                <div className="ability-value">{this.state.showAbilityScores ? this.props.combatant.abilityScores.wis : modifier(this.props.combatant.abilityScores.wis)}</div>
                            </div>
                            <div className="ability-score">
                                <div className="ability-heading">cha</div>
                                <div className="ability-value">{this.state.showAbilityScores ? this.props.combatant.abilityScores.cha : modifier(this.props.combatant.abilityScores.cha)}</div>
                            </div>
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