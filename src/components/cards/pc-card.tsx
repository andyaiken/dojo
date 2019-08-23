import React from 'react';

import { Combat, COMBAT_TAGS, Combatant } from '../../models/combat';
import { Condition } from '../../models/condition';
import { PC } from '../../models/party';

import Checkbox from '../controls/checkbox';
import ConfirmButton from '../controls/confirm-button';
import ControlRow from '../controls/control-row';
import Expander from '../controls/expander';
import Radial from '../controls/radial';
import Selector from '../controls/selector';
import Spin from '../controls/spin';
import ConditionsPanel from '../panels/conditions-panel';

interface Props {
    combatant: PC | (PC & Combatant);
    mode: string;
    changeValue: (pc: any, field: string, value: any) => void;
    nudgeValue: (pc: any, field: string, delta: number) => void;
    removePC: (pc: PC) => void;
    editPC: (pc: PC) => void;
    // Combat
    combat: Combat;
    makeCurrent: (combatant: Combatant) => void;
    makeActive: (combatant: Combatant) => void;
    makeDefeated: (combatant: Combatant) => void;
    endTurn: (combatant: Combatant) => void;
    mapAdd: (combatant: Combatant) => void;
    mapMove: (combatant: Combatant, dir: string) => void;
    mapRemove: (combatant: Combatant) => void;
    removeCombatant: (combatant: Combatant) => void;
    addCondition: (combatant: Combatant) => void;
    editCondition: (combatant: Combatant, condition: Condition) => void;
    removeCondition: (combatant: Combatant, conditionID: string) => void;
    nudgeConditionValue: (condition: Condition, field: string, delta: number) => void;
    toggleTag: (combatant: Combatant, tag: string) => void;
}

interface State {
    combatMode: string;
}

export default class PCCard extends React.Component<Props, State> {
    public static defaultProps = {
        removePC: null,
        editPC: null,
        combat: null,
        makeCurrent: null,
        makeActive: null,
        makeDefeated: null,
        endTurn: null,
        mapAdd: null,
        mapMove: null,
        mapRemove: null,
        removeCombatant: null,
        addCondition: null,
        editCondition: null,
        removeCondition: null,
        nudgeConditionValue: null,
        toggleTag: null
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            combatMode: 'main'
        };
    }

    private setCombatMode(mode: string) {
        this.setState({
            combatMode: mode
        });
    }

    private getCombatControls() {
        const combatant = this.props.combatant as Combatant;

        const options = [];

        const combatModes = ['main', 'cond', 'map', 'adv'].map(m => {
            return {
                id: m,
                text: m
            };
        });
        if (this.props.mode.indexOf('tactical') === -1) {
            // No combat map, so remove the map option
            combatModes.splice(1, 1);
        }
        options.push(
            <Selector
                key='selector'
                options={combatModes}
                selectedID={this.state.combatMode}
                select={option => this.setCombatMode(option)}
            />
        );
        options.push(<div key='selector-sep' className='divider' />);

        switch (this.state.combatMode) {
            case 'main':
                if (!combatant.pending && combatant.active && !combatant.defeated) {
                    if (combatant.current) {
                        options.push(<button key='endTurn' onClick={() => this.props.endTurn(combatant)}>end turn</button>);
                        options.push(<button key='makeDefeated' onClick={() => this.props.makeDefeated(combatant)}>mark as defeated and end turn</button>);
                    } else {
                        options.push(<button key='makeCurrent' onClick={() => this.props.makeCurrent(combatant)}>start turn</button>);
                        options.push(<button key='makeDefeated' onClick={() => this.props.makeDefeated(combatant)}>mark as defeated</button>);
                    }
                }
                if (!combatant.pending && !combatant.active && combatant.defeated) {
                    options.push(<button key='makeActive' onClick={() => this.props.makeActive(combatant)}>mark as active</button>);
                }
                options.push(<div key='tag-sep' className='divider' />);
                options.push(
                    <ControlRow
                        key='tags'
                        controls={COMBAT_TAGS.map(tag =>
                            <Checkbox
                                key={tag}
                                label={tag}
                                display='button'
                                checked={combatant.tags.includes(tag)}
                                changeValue={value => this.props.toggleTag(combatant, tag)}
                            />
                        )}
                    />
                );
                break;
            case 'cond':
                options.push(
                    <div key='conditions'>
                        <ConditionsPanel
                            combatant={this.props.combatant as Combatant}
                            combat={this.props.combat}
                            addCondition={() => this.props.addCondition(this.props.combatant as Combatant)}
                            editCondition={condition => this.props.editCondition(this.props.combatant as Combatant, condition)}
                            removeCondition={conditionID => this.props.removeCondition(this.props.combatant as Combatant, conditionID)}
                            nudgeConditionValue={(condition, type, delta) => this.props.nudgeConditionValue(condition, type, delta)}
                        />
                    </div>
                );
                break;
            case 'map':
                if (this.props.mode.indexOf('on-map') !== -1) {
                    options.push(
                        <div key='mapMove' className='section centered'>
                            <Radial
                                direction='eight'
                                click={dir => this.props.mapMove(combatant, dir)}
                            />
                        </div>
                    );
                    options.push(<div key='move-sep' className='divider' />);
                    options.push(
                        <Spin
                            key='altitude'
                            source={this.props.combatant}
                            name='altitude'
                            label='altitude'
                            display={value => value + ' ft.'}
                            nudgeValue={delta => this.props.nudgeValue(this.props.combatant, 'altitude', delta * 5)}
                        />
                    );
                    let auraDetails = null;
                    if (combatant.aura.size > 0) {
                        const auraStyleOptions = [
                            {
                                id: 'square',
                                text: 'square'
                            },
                            {
                                id: 'rounded',
                                text: 'rounded'
                            },
                            {
                                id: 'circle',
                                text: 'circle'
                            }
                        ];
                        auraDetails = (
                            <div>
                                <Selector
                                    options={auraStyleOptions}
                                    selectedID={combatant.aura.style}
                                    select={optionID => this.props.changeValue(combatant.aura, 'style', optionID)}
                                />
                                <input
                                    type='color'
                                    value={combatant.aura.color}
                                    onChange={event => this.props.changeValue(combatant.aura, 'color', event.target.value)}
                                />
                            </div>
                        );
                    }
                    options.push(
                        <Expander
                            key='aura'
                            text='aura'
                            content={(
                                <div>
                                    <Spin
                                        source={combatant.aura}
                                        name='size'
                                        label='size'
                                        display={value => value + ' ft.'}
                                        nudgeValue={delta => this.props.nudgeValue(combatant.aura, 'size', delta * 5)}
                                    />
                                    {auraDetails}
                                </div>
                            )}
                        />
                    );
                    options.push(<button key='mapRemove' onClick={() => this.props.mapRemove(combatant)}>remove from map</button>);
                }
                if (this.props.mode.indexOf('off-map') !== -1) {
                    options.push(<button key='mapAdd' onClick={() => this.props.mapAdd(combatant)}>add to map</button>);
                }
                break;
            case 'adv':
                if (!combatant.current) {
                    options.push(<ConfirmButton key='remove' text='remove from encounter' callback={() => this.props.removeCombatant(combatant)} />);
                }
                if (!combatant.pending) {
                    options.push(
                        <Expander
                            key='init'
                            text='change initiative score'
                            content={(
                                <div>
                                    <Spin
                                        source={this.props.combatant}
                                        name='initiative'
                                        label='initiative'
                                        nudgeValue={delta => this.props.nudgeValue(this.props.combatant, 'initiative', delta)}
                                    />
                                </div>
                            )}
                        />
                    );
                }
                break;
        }

        return (
            <div>
                <div className='combat-options-panel'>
                    {options}
                </div>
                <div className='divider' />
            </div>
        );
    }

    public render() {
        try {
            const options = [];
            if (this.props.mode.indexOf('edit') !== -1) {
                options.push(<button key='edit' onClick={() => this.props.editPC(this.props.combatant)}>edit pc</button>);
                if (this.props.combatant.active) {
                    options.push(
                        <button key='toggle-active' onClick={() => this.props.changeValue(this.props.combatant, 'active', false)}>
                            mark pc as inactive
                        </button>
                    );
                } else {
                    options.push(
                        <button key='toggle-active' onClick={() => this.props.changeValue(this.props.combatant, 'active', true)}>
                            mark pc as active
                        </button>
                    );
                }
                options.push(<ConfirmButton key='remove' text='delete pc' callback={() => this.props.removePC(this.props.combatant)} />);
            }

            let combat = null;
            if (this.props.mode.indexOf('combat') !== -1) {
                combat = this.getCombatControls();
            }

            const desc = (this.props.combatant.race || 'unknown race')
                + ' ' + (this.props.combatant.classes || 'unknown class')
                + ', level ' + this.props.combatant.level;

            const name = (this.props.combatant as Combatant ? (this.props.combatant as Combatant).displayName : null)
                || this.props.combatant.name
                || 'unnamed pc';

            return (
                <div className='card pc'>
                    <div className='heading'>
                        <div className='title'>{name}</div>
                    </div>
                    <div className='card-content'>
                        <div className='stats'>
                            <div className='section centered lowercase'>
                                <i>{desc}</i>
                                <div style={{ display: this.props.combatant.url ? '' : 'none' }}>
                                    <a href={this.props.combatant.url} target='_blank' rel='noopener noreferrer'>d&d beyond sheet</a>
                                </div>
                            </div>
                            <div className='divider' />
                            {combat}
                            <div className='section subheading'>languages</div>
                            <div className='section'>
                                {this.props.combatant.languages || '-'}
                            </div>
                            <div className='section subheading'>passive skills</div>
                            <div className='section'>
                                <div><b>insight</b> {this.props.combatant.passiveInsight}</div>
                                <div><b>investigation</b> {this.props.combatant.passiveInvestigation}</div>
                                <div><b>perception</b> {this.props.combatant.passivePerception}</div>
                            </div>
                        </div>
                        <div style={{ display: options.length > 0 ? '' : 'none' }}>
                            <div className='divider' />
                            <div className='section'>
                                {options}
                            </div>
                        </div>
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}
