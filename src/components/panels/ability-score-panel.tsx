import React from 'react';

import Utils from '../../utils/utils';

import { Monster } from '../../models/monster-group';

import Spin from '../controls/spin';

interface Props {
    combatant: Monster;
    edit: boolean;
    nudgeValue: (combatant: Monster, field: string, delta: number) => void;
}

interface State {
    showAbilityScores: boolean;
}

export default class AbilityScorePanel extends React.Component<Props, State> {
    public static defaultProps = {
        edit: null,
        nudgeValue: null
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            showAbilityScores: false
        };
    }

    private toggleAbilityScores() {
        this.setState({
            showAbilityScores: !this.state.showAbilityScores
        });
    }

    public render() {
        try {
            let result = null;

            if (this.props.edit) {
                result = (
                    <div>
                        <Spin
                            source={this.props.combatant.abilityScores}
                            name='str'
                            label='strength'
                            nudgeValue={(delta: number) => this.props.nudgeValue(this.props.combatant, 'abilityScores.str', delta)}
                        />
                        <Spin
                            source={this.props.combatant.abilityScores}
                            name='dex'
                            label='dexterity'
                            nudgeValue={(delta: number) => this.props.nudgeValue(this.props.combatant, 'abilityScores.dex', delta)}
                        />
                        <Spin
                            source={this.props.combatant.abilityScores}
                            name='con'
                            label='constitution'
                            nudgeValue={(delta: number) => this.props.nudgeValue(this.props.combatant, 'abilityScores.con', delta)}
                        />
                        <Spin
                            source={this.props.combatant.abilityScores}
                            name='int'
                            label='intelligence'
                            nudgeValue={(delta: number) => this.props.nudgeValue(this.props.combatant, 'abilityScores.int', delta)}
                        />
                        <Spin
                            source={this.props.combatant.abilityScores}
                            name='wis'
                            label='wisdom'
                            nudgeValue={(delta: number) => this.props.nudgeValue(this.props.combatant, 'abilityScores.wis', delta)}
                        />
                        <Spin
                            source={this.props.combatant.abilityScores}
                            name='cha'
                            label='charisma'
                            nudgeValue={(delta: number) => this.props.nudgeValue(this.props.combatant, 'abilityScores.cha', delta)}
                        />
                    </div>
                );
            } else {
                result = (
                    <div className='ability-scores' onClick={() => this.toggleAbilityScores()}>
                        <div className='ability-score'>
                            <div className='ability-heading'>str</div>
                            <div className='ability-value'>
                                {
                                    this.state.showAbilityScores
                                    ? this.props.combatant.abilityScores.str
                                    : Utils.modifier(this.props.combatant.abilityScores.str)
                                }
                            </div>
                        </div>
                        <div className='ability-score'>
                            <div className='ability-heading'>dex</div>
                            <div className='ability-value'>
                                {
                                    this.state.showAbilityScores
                                    ? this.props.combatant.abilityScores.dex
                                    : Utils.modifier(this.props.combatant.abilityScores.dex)
                                }
                            </div>
                        </div>
                        <div className='ability-score'>
                            <div className='ability-heading'>con</div>
                            <div className='ability-value'>
                                {
                                    this.state.showAbilityScores
                                    ? this.props.combatant.abilityScores.con
                                    : Utils.modifier(this.props.combatant.abilityScores.con)
                                }
                            </div>
                        </div>
                        <div className='ability-score'>
                            <div className='ability-heading'>int</div>
                            <div className='ability-value'>
                                {
                                    this.state.showAbilityScores
                                    ? this.props.combatant.abilityScores.int
                                    : Utils.modifier(this.props.combatant.abilityScores.int)
                                }
                            </div>
                        </div>
                        <div className='ability-score'>
                            <div className='ability-heading'>wis</div>
                            <div className='ability-value'>
                                {
                                    this.state.showAbilityScores
                                    ? this.props.combatant.abilityScores.wis
                                    : Utils.modifier(this.props.combatant.abilityScores.wis)
                                }
                            </div>
                        </div>
                        <div className='ability-score'>
                            <div className='ability-heading'>cha</div>
                            <div className='ability-value'>
                                {
                                    this.state.showAbilityScores
                                    ? this.props.combatant.abilityScores.cha
                                    : Utils.modifier(this.props.combatant.abilityScores.cha)
                                }
                            </div>
                        </div>
                    </div>
                );
            }

            return result;
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
