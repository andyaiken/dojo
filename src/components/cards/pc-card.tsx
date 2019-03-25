import React from 'react';

import { PC } from '../../models/party';
import { Combatant } from '../../models/combat';

import ConfirmButton from '../controls/confirm-button';
import Radial from '../controls/radial';
import Spin from '../controls/spin';

import arrow from '../../resources/images/down-arrow.svg';

interface Props {
    combatant: PC | (PC & Combatant);
    mode: string;
    changeValue: (pc: PC, field: string, value: any) => void;
    nudgeValue: (pc: PC, field: string, delta: number) => void;
    removePC: (pc: PC) => void;
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

interface State {
    showDetails: boolean;
}

export default class PCCard extends React.Component<Props, State> {
    public static defaultProps = {
        removePC: null,
        makeCurrent: null,
        makeActive: null,
        makeDefeated: null,
        endTurn: null,
        mapAdd: null,
        mapMove: null,
        mapRemove: null,
        removeCombatant: null
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            showDetails: false
        };
    }

    private toggleDetails() {
        this.setState({
            showDetails: !this.state.showDetails
        });
    }

    public render() {
        try {
            const options = [];
            if (this.props.mode.indexOf('edit') !== -1) {
                if (this.props.combatant.active) {
                    options.push(<button key='toggle-active' onClick={() => this.props.changeValue(this.props.combatant, 'active', false)}>mark inactive</button>);
                } else {
                    options.push(<button key='toggle-active' onClick={() => this.props.changeValue(this.props.combatant, 'active', true)}>mark active</button>);
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
                }
                if (!combatant.pending && !combatant.active && combatant.defeated) {
                    options.push(<button key='makeActive' onClick={() => this.props.makeActive(combatant)}>mark as active</button>);
                    options.push(<ConfirmButton key='remove' text='remove from encounter' callback={() => this.props.removeCombatant(combatant)} />);
                }
            }

            const commonStatBlock = (
                <div className='stats'>
                    <div className='section centered'>
                        <div className='lowercase'>
                            <i>
                                <span>{this.props.combatant.race || 'race'} {this.props.combatant.classes || 'class'}</span>,
                                <span>level {this.props.combatant.level}</span>
                            </i>
                        </div>
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
                    <div className='table'>
                        <div>
                            <div className='cell three'><b>insight</b></div>
                            <div className='cell three'><b>invest.</b></div>
                            <div className='cell three'><b>percep.</b></div>
                        </div>
                        <div>
                            <div className='cell three'>{this.props.combatant.passiveInsight}</div>
                            <div className='cell three'>{this.props.combatant.passiveInvestigation}</div>
                            <div className='cell three'>{this.props.combatant.passivePerception}</div>
                        </div>
                    </div>
                </div>
            );

            var stats = null;
            if (this.props.mode.indexOf('edit') !== -1) {
                if (this.state.showDetails) {
                    stats = (
                        <div className='edit'>
                            <div className='section'>
                                <div className='input-label' style={{ display: this.state.showDetails ? '' : 'none' }}>character name:</div>
                                <input type='text' value={this.props.combatant.name} onChange={event => this.props.changeValue(this.props.combatant, 'name', event.target.value)} />
                                <div className='input-label' style={{ display: this.state.showDetails ? '' : 'none' }}>player name:</div>
                                <input type='text' value={this.props.combatant.player} onChange={event => this.props.changeValue(this.props.combatant, 'player', event.target.value)} />
                                <div className='input-label'>race:</div>
                                <input type='text' value={this.props.combatant.race} onChange={event => this.props.changeValue(this.props.combatant, 'race', event.target.value)} />
                                <div className='input-label'>class:</div>
                                <input type='text' value={this.props.combatant.classes} onChange={event => this.props.changeValue(this.props.combatant, 'classes', event.target.value)} />
                                <div className='input-label'>level:</div>
                                <Spin
                                    source={this.props.combatant}
                                    name='level'
                                    nudgeValue={delta => this.props.nudgeValue(this.props.combatant, 'level', delta)}
                                />
                                <div className='input-label'>languages:</div>
                                <input type='text' value={this.props.combatant.languages} onChange={event => this.props.changeValue(this.props.combatant, 'languages', event.target.value)} />
                                <div className='input-label'>d&d beyond link:</div>
                                <input type='text' value={this.props.combatant.url} onChange={event => this.props.changeValue(this.props.combatant, 'url', event.target.value)} />
                            </div>
                            <div className='divider' />
                            <div className='section subheading'>passive skills</div>
                            <Spin
                                source={this.props.combatant}
                                name='passiveInsight'
                                label='insight'
                                nudgeValue={delta => this.props.nudgeValue(this.props.combatant, 'passiveInsight', delta)}
                            />
                            <Spin
                                source={this.props.combatant}
                                name='passiveInvestigation'
                                label='investigation'
                                nudgeValue={delta => this.props.nudgeValue(this.props.combatant, 'passiveInvestigation', delta)}
                            />
                            <Spin
                                source={this.props.combatant}
                                name='passivePerception'
                                label='perception'
                                nudgeValue={delta => this.props.nudgeValue(this.props.combatant, 'passivePerception', delta)}
                            />
                        </div>
                    );
                } else {
                    stats = commonStatBlock;
                }
            }
            if (this.props.mode.indexOf('combat') !== -1) {
                stats = commonStatBlock;
            }

            var toggle = null;
            if (this.props.mode.indexOf('combat') !== -1) {
                // Don't show toggle button for combatant
            } else {
                const imageStyle = this.state.showDetails ? 'image rotate' : 'image';
                toggle = <img className={imageStyle} src={arrow} alt='arrow' onClick={() => this.toggleDetails()} />;
            }

            return (
                <div className='card pc'>
                    <div className='heading'>
                        <div className='title'>{(this.props.combatant as Combatant ? (this.props.combatant as Combatant).displayName : null) || this.props.combatant.name || 'unnamed pc'}</div>
                        {toggle}
                    </div>
                    <div className='card-content'>
                        {stats}
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
