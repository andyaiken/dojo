import React from 'react';

import { Combat, COMBAT_TAGS, Combatant } from '../../models/combat';
import { Condition } from '../../models/condition';
import { PC } from '../../models/party';

import Checkbox from '../controls/checkbox';
import ConfirmButton from '../controls/confirm-button';
import ControlRow from '../controls/control-row';
import Expander from '../controls/expander';
import NumberSpin from '../controls/number-spin';
import Radial from '../controls/radial';
import Selector from '../controls/selector';
import ConditionsPanel from '../panels/conditions-panel';
import PortraitPanel from '../panels/portrait-panel';

interface Props {
    pc: PC | (PC & Combatant);
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
        changeValue: null,
        nudgeValue: null,
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
        const combatant = this.props.pc as Combatant;

        const options = [];

        const combatModes = ['main', 'cond', 'map', 'adv'].map(m => {
            return {
                id: m,
                text: m
            };
        });
        if (this.props.mode.indexOf('tactical') === -1) {
            // No combat map, so remove the map option
            combatModes.splice(2, 1);
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
                if (combatant.pending && !combatant.active && !combatant.defeated) {
                    options.push(<div key='pending' className='section'>pending initiative entry</div>);
                }
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
                if (!combatant.pending && combatant.active && !combatant.defeated) {
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
                }
                break;
            case 'cond':
                options.push(
                    <div key='conditions'>
                        <ConditionsPanel
                            combatant={this.props.pc as Combatant}
                            combat={this.props.combat}
                            addCondition={() => this.props.addCondition(this.props.pc as Combatant)}
                            editCondition={condition => this.props.editCondition(this.props.pc as Combatant, condition)}
                            removeCondition={conditionID => this.props.removeCondition(this.props.pc as Combatant, conditionID)}
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
                        <NumberSpin
                            key='altitude'
                            source={this.props.pc}
                            name='altitude'
                            label='altitude'
                            display={value => value + ' ft.'}
                            nudgeValue={delta => this.props.nudgeValue(this.props.pc, 'altitude', delta * 5)}
                        />
                    );
                    let auraDetails = null;
                    if (combatant.aura.radius > 0) {
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
                        <Expander key='aura' text='aura'>
                            <NumberSpin
                                source={combatant.aura}
                                name='radius'
                                label='size'
                                display={value => value + ' ft.'}
                                nudgeValue={delta => this.props.nudgeValue(combatant.aura, 'radius', delta * 5)}
                            />
                            {auraDetails}
                        </Expander>
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
                        <Expander key='init' text='change initiative score'>
                            <NumberSpin
                                source={this.props.pc}
                                name='initiative'
                                label='initiative'
                                nudgeValue={delta => this.props.nudgeValue(this.props.pc, 'initiative', delta)}
                            />
                        </Expander>
                    );
                }
                options.push(
                    <Expander key='size' text='change size'>
                        <NumberSpin
                            source={this.props.pc}
                            name='displaySize'
                            label='size'
                            nudgeValue={delta => this.props.nudgeValue(this.props.pc, 'displaySize', delta)}
                        />
                    </Expander>
                );
                break;
        }

        return (
            <div>
                <div className='group-panel'>
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
                options.push(<button key='edit' onClick={() => this.props.editPC(this.props.pc)}>edit pc</button>);
                if (this.props.pc.active) {
                    options.push(
                        <button key='toggle-active' onClick={() => this.props.changeValue(this.props.pc, 'active', false)}>
                            mark pc as inactive
                        </button>
                    );
                } else {
                    options.push(
                        <button key='toggle-active' onClick={() => this.props.changeValue(this.props.pc, 'active', true)}>
                            mark pc as active
                        </button>
                    );
                }
                options.push(<ConfirmButton key='remove' text='delete pc' callback={() => this.props.removePC(this.props.pc)} />);
            }

            let combat = null;
            if (this.props.mode.indexOf('combat') !== -1) {
                combat = this.getCombatControls();
            }

            const desc = (this.props.pc.race || 'unknown race')
                + ' ' + (this.props.pc.classes || 'unknown class')
                + ', level ' + this.props.pc.level;

            let companions = null;
            if (this.props.pc.companions.length > 0) {
                companions = this.props.pc.companions.map(companion => (
                    <div key={companion.id}>{companion.name}</div>
                ));
            }

            const name = (this.props.pc as Combatant ? (this.props.pc as Combatant).displayName : null)
                || this.props.pc.name
                || 'unnamed pc';

            return (
                <div className='card pc'>
                    <div className='heading'>
                        <div className='title'>
                            {name}
                        </div>
                    </div>
                    <div className='card-content'>
                        <div className='stats'>
                            <PortraitPanel source={this.props.pc} />
                            <div className='section centered lowercase'>
                                <i>{desc}</i>
                                <div style={{ display: this.props.pc.url ? '' : 'none' }}>
                                    <a href={this.props.pc.url} target='_blank' rel='noopener noreferrer'>d&d beyond sheet</a>
                                </div>
                            </div>
                            <div className='divider' />
                            {combat}
                            <div className='section subheading'>languages</div>
                            <div className='section'>
                                {this.props.pc.languages || '-'}
                            </div>
                            <div className='section subheading'>passive skills</div>
                            <div className='section'>
                                <div><b>insight</b> {this.props.pc.passiveInsight}</div>
                                <div><b>investigation</b> {this.props.pc.passiveInvestigation}</div>
                                <div><b>perception</b> {this.props.pc.passivePerception}</div>
                            </div>
                        </div>
                        <div style={{ display: this.props.pc.companions.length > 0 ? '' : 'none' }}>
                            <div className='section subheading'>companions</div>
                            <div className='section'>
                                {companions}
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
            return <div className='render-error'/>;
        }
    }
}
