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
                    <div>
                        <Spin
                            source={this.props.combatant.abilityScores}
                            name="str"
                            label="strength"
                            nudgeValue={delta => this.props.nudgeValue(this.props.combatant, "abilityScores.str", delta)}
                        />
                        <Spin
                            source={this.props.combatant.abilityScores}
                            name="dex"
                            label="dexterity"
                            nudgeValue={delta => this.props.nudgeValue(this.props.combatant, "abilityScores.dex", delta)}
                        />
                        <Spin
                            source={this.props.combatant.abilityScores}
                            name="con"
                            label="constitution"
                            nudgeValue={delta => this.props.nudgeValue(this.props.combatant, "abilityScores.con", delta)}
                        />
                        <Spin
                            source={this.props.combatant.abilityScores}
                            name="int"
                            label="intelligence"
                            nudgeValue={delta => this.props.nudgeValue(this.props.combatant, "abilityScores.int", delta)}
                        />
                        <Spin
                            source={this.props.combatant.abilityScores}
                            name="wis"
                            label="wisdom"
                            nudgeValue={delta => this.props.nudgeValue(this.props.combatant, "abilityScores.wis", delta)}
                        />
                        <Spin
                            source={this.props.combatant.abilityScores}
                            name="cha"
                            label="charisma"
                            nudgeValue={delta => this.props.nudgeValue(this.props.combatant, "abilityScores.cha", delta)}
                        />
                    </div>
                );
            } else {
                result = (
                    <div className="ability-scores" onClick={() => this.toggleAbilityScores()}>
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
                );
            }

            return result;
        } catch (e) {
            console.error(e);
        }
    };
}