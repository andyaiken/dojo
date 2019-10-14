import React from 'react';

import Factory from '../../utils/factory';

import { PC } from '../../models/party';

import PCCard from '../cards/pc-card';
import Spin from '../controls/spin';
import PortraitPanel from '../panels/portrait-panel';

interface Props {
    pc: PC;
}

interface State {
    pc: PC;
}

export default class PCEditorModal extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            pc: props.pc
        };
    }

    private addCompanion() {
        const companion = Factory.createCompanion();
        companion.name = 'new companion';
        this.state.pc.companions.push(companion);
        this.setState({
            pc: this.state.pc
        });
    }

    private removeCompanion(id: string) {
        // eslint-disable-next-line
        this.state.pc.companions = this.state.pc.companions.filter(c => c.id !== id);
        this.setState({
            pc: this.state.pc
        });
    }

    private changeValue(source: any, field: string, value: any) {
        source[field] = value;

        this.setState({
            pc: this.state.pc
        });
    }

    private nudgeValue(source: any, field: string, delta: number) {
        const value = source[field] + delta;
        this.changeValue(source, field, value);
    }

    public render() {
        try {
            const companions = this.state.pc.companions.map(comp => (
                <div className='row companion' key={comp.id}>
                    <div className='columns small-12 medium-8 large-8'>
                        <input
                            type='text'
                            value={comp.name}
                            onChange={event => this.changeValue(comp, 'name', event.target.value)}
                        />
                    </div>
                    <div className='columns small-12 medium-4 large-4'>
                        <button onClick={() => this.removeCompanion(comp.id)}>delete</button>
                    </div>
                </div>
            ));

            if (companions.length === 0) {
                companions.push(
                    <div className='section' key='empty'>
                        <i>no companions (pets, retainers, mounts, etc)</i>
                    </div>
                );
            }

            return (
                <div className='row' style={{ height: '100%' }}>
                    <div className='columns small-8 medium-8 large-8 scrollable'>
                        <div className='row section'>
                            <div className='columns small-12 medium-6 large-6'>
                                <div className='subheading'>character name:</div>
                                <input
                                    type='text'
                                    value={this.state.pc.name}
                                    onChange={event => this.changeValue(this.state.pc, 'name', event.target.value)}
                                />
                                <div className='subheading'>player name:</div>
                                <input
                                    type='text'
                                    value={this.state.pc.player}
                                    onChange={event => this.changeValue(this.state.pc, 'player', event.target.value)}
                                />
                                <div className='subheading'>race:</div>
                                <input
                                    type='text'
                                    value={this.state.pc.race}
                                    onChange={event => this.changeValue(this.state.pc, 'race', event.target.value)}
                                />
                                <div className='subheading'>class:</div>
                                <input
                                    type='text'
                                    value={this.state.pc.classes}
                                    onChange={event => this.changeValue(this.state.pc, 'classes', event.target.value)}
                                />
                                <div className='subheading'>level:</div>
                                <Spin
                                    source={this.state.pc}
                                    name='level'
                                    nudgeValue={delta => this.nudgeValue(this.state.pc, 'level', delta)}
                                />
                                <div className='subheading'>passive skills</div>
                                <Spin
                                    source={this.state.pc}
                                    name='passiveInsight'
                                    label='insight'
                                    nudgeValue={delta => this.nudgeValue(this.state.pc, 'passiveInsight', delta)}
                                />
                                <Spin
                                    source={this.state.pc}
                                    name='passiveInvestigation'
                                    label='investigation'
                                    nudgeValue={delta => this.nudgeValue(this.state.pc, 'passiveInvestigation', delta)}
                                />
                                <Spin
                                    source={this.state.pc}
                                    name='passivePerception'
                                    label='perception'
                                    nudgeValue={delta => this.nudgeValue(this.state.pc, 'passivePerception', delta)}
                                />
                            </div>
                            <div className='columns small-12 medium-6 large-6 scrollable'>
                                <div className='subheading'>languages:</div>
                                <input
                                    type='text'
                                    value={this.state.pc.languages}
                                    onChange={event => this.changeValue(this.state.pc, 'languages', event.target.value)}
                                />
                                <div className='subheading'>d&d beyond link:</div>
                                <input
                                    type='text'
                                    value={this.state.pc.url}
                                    placeholder='https://ddb.ac/characters/...'
                                    onChange={event => this.changeValue(this.state.pc, 'url', event.target.value)}
                                />
                                <div className='subheading'>portrait</div>
                                <PortraitPanel source={this.state.pc} setValue={value => this.changeValue(this.state.pc, 'portrait', value)} />
                                <div className='subheading'>companions:</div>
                                {companions}
                                <button onClick={() => this.addCompanion()}>add a new companion</button>
                            </div>
                        </div>
                    </div>
                    <div className='columns small-4 medium-4 large-4 scrollable' style={{ paddingTop: '15px', paddingBottom: '15px' }}>
                        <PCCard
                            pc={this.state.pc}
                            mode='view'
                        />
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
