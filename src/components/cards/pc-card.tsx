import React from 'react';

import { Combatant } from '../../models/combat';
import { PC } from '../../models/party';

import ConfirmButton from '../controls/confirm-button';
import Expander from '../controls/expander';
import Radial from '../controls/radial';
import Spin from '../controls/spin';

import arrow from '../../resources/images/down-arrow.svg';

interface Props {
    combatant: PC | (PC & Combatant);
    mode: string;
    changeValue: (pc: PC, field: string, value: any) => void;
    nudgeValue: (pc: PC, field: string, delta: number) => void;
    removePC: (pc: PC) => void;
    editPC: (pc: PC) => void;
    // Combat
    makeCurrent: (combatant: Combatant) => void;
    makeActive: (combatant: Combatant) => void;
    makeDefeated: (combatant: Combatant) => void;
    endTurn: (combatant: Combatant) => void;
    mapAdd: (combatant: Combatant) => void;
    mapMove: (combatant: Combatant, dir: string) => void;
    mapRemove: (combatant: Combatant) => void;
    removeCombatant: (combatant: Combatant) => void;
}

export default class PCCard extends React.Component<Props> {
    public static defaultProps = {
        removePC: null,
        editPC: null,
        makeCurrent: null,
        makeActive: null,
        makeDefeated: null,
        endTurn: null,
        mapAdd: null,
        mapMove: null,
        mapRemove: null,
        removeCombatant: null
    };

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
            if (this.props.mode.indexOf('combat') !== -1) {
                const combatant = this.props.combatant as Combatant;

                if (this.props.mode.indexOf('tactical') !== -1) {
                    if (this.props.mode.indexOf('on-map') !== -1) {
                        options.push(
                            <div key='mapMove' className='section centered'>
                                <Radial
                                    direction='eight'
                                    click={dir => this.props.mapMove(combatant, dir)}
                                />
                            </div>
                        );
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
                        options.push(<button key='mapRemove' onClick={() => this.props.mapRemove(combatant)}>remove from map</button>);
                    }
                    if (this.props.mode.indexOf('off-map') !== -1) {
                        options.push(<button key='mapAdd' onClick={() => this.props.mapAdd(combatant)}>add to map</button>);
                    }
                    options.push(<div key='tactical-div' className='divider' />);
                }
                if (combatant.pending && !combatant.active && !combatant.defeated) {
                    options.push(<ConfirmButton key='remove' text='remove from encounter' callback={() => this.props.removeCombatant(combatant)} />);
                }
                if (!combatant.pending && combatant.active && !combatant.defeated) {
                    if (combatant.current) {
                        options.push(<button key='endTurn' onClick={() => this.props.endTurn(combatant)}>end turn</button>);
                        options.push(<button key='makeDefeated' onClick={() => this.props.makeDefeated(combatant)}>mark as defeated and end turn</button>);
                    } else {
                        options.push(<button key='makeCurrent' onClick={() => this.props.makeCurrent(combatant)}>start turn</button>);
                        options.push(<button key='makeDefeated' onClick={() => this.props.makeDefeated(combatant)}>mark as defeated</button>);
                        options.push(<ConfirmButton key='remove' text='remove from encounter' callback={() => this.props.removeCombatant(combatant)} />);
                    }
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
                if (!combatant.pending && !combatant.active && combatant.defeated) {
                    options.push(<button key='makeActive' onClick={() => this.props.makeActive(combatant)}>mark as active</button>);
                    options.push(<ConfirmButton key='remove' text='remove from encounter' callback={() => this.props.removeCombatant(combatant)} />);
                }
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
