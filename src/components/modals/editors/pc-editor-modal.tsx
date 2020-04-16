import { Col, Drawer, Row } from 'antd';
import React from 'react';

import Factory from '../../../utils/factory';
import Utils from '../../../utils/utils';

import { Map } from '../../../models/map';
import { MonsterGroup } from '../../../models/monster-group';
import { Party, PC } from '../../../models/party';

import NumberSpin from '../../controls/number-spin';
import Textbox from '../../controls/textbox';
import PortraitPanel from '../../panels/portrait-panel';
import ImageSelectionModal from '../image-selection-modal';

interface Props {
    pc: PC;
    parties: Party[];
    library: MonsterGroup[];
    maps: Map[];
}

interface State {
    pc: PC;
    showImageSelection: boolean;
}

export default class PCEditorModal extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            pc: props.pc,
            showImageSelection: false
        };
    }

    private toggleImageSelection() {
        this.setState({
            showImageSelection: !this.state.showImageSelection
        });
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
        const pc = this.state.pc;
        pc.companions = this.state.pc.companions.filter(c => c.id !== id);
        this.setState({
            pc: pc
        });
    }

    private changeValue(source: any, field: string, value: any) {
        source[field] = value;

        this.setState({
            pc: this.state.pc,
            showImageSelection: false
        });
    }

    private nudgeValue(source: any, field: string, delta: number) {
        const value = source[field];

        let newValue;
        switch (field) {
            case 'size':
                newValue = Utils.nudgeSize(value, delta);
                break;
            default:
                newValue = (value ? value : 0) + delta;
                break;
        }

        this.changeValue(source, field, newValue);
    }

    public render() {
        try {
            const companions = this.state.pc.companions.map(comp => (
                <Row gutter={10} className='companion' key={comp.id}>
                    <Col span={16}>
                        <Textbox
                            text={comp.name}
                            onChange={value => this.changeValue(comp, 'name', value)}
                        />
                    </Col>
                    <Col span={8}>
                        <button onClick={() => this.removeCompanion(comp.id)}>delete</button>
                    </Col>
                </Row>
            ));

            if (companions.length === 0) {
                companions.push(
                    <div className='section' key='empty'>
                        <i>no companions (pets, retainers, mounts, etc)</i>
                    </div>
                );
            }

            return (
                <Row className='full-height'>
                    <Col span={12} className='scrollable'>
                        <div className='subheading'>character name:</div>
                        <Textbox
                            text={this.state.pc.name}
                            onChange={value => this.changeValue(this.state.pc, 'name', value)}
                        />
                        <div className='subheading'>player name:</div>
                        <Textbox
                            text={this.state.pc.player}
                            onChange={value => this.changeValue(this.state.pc, 'player', value)}
                        />
                        <div className='subheading'>size</div>
                        <NumberSpin
                            source={this.state.pc}
                            name='size'
                            nudgeValue={delta => this.nudgeValue(this.state.pc, 'size', delta)}
                        />
                        <div className='subheading'>race:</div>
                        <Textbox
                            text={this.state.pc.race}
                            onChange={value => this.changeValue(this.state.pc, 'race', value)}
                        />
                        <div className='subheading'>class:</div>
                        <Textbox
                            text={this.state.pc.classes}
                            onChange={value => this.changeValue(this.state.pc, 'classes', value)}
                        />
                        <div className='subheading'>level:</div>
                        <NumberSpin
                            source={this.state.pc}
                            name='level'
                            nudgeValue={delta => this.nudgeValue(this.state.pc, 'level', delta)}
                        />
                        <div className='subheading'>passive skills</div>
                        <NumberSpin
                            source={this.state.pc}
                            name='passiveInsight'
                            label='insight'
                            nudgeValue={delta => this.nudgeValue(this.state.pc, 'passiveInsight', delta)}
                        />
                        <NumberSpin
                            source={this.state.pc}
                            name='passiveInvestigation'
                            label='investigation'
                            nudgeValue={delta => this.nudgeValue(this.state.pc, 'passiveInvestigation', delta)}
                        />
                        <NumberSpin
                            source={this.state.pc}
                            name='passivePerception'
                            label='perception'
                            nudgeValue={delta => this.nudgeValue(this.state.pc, 'passivePerception', delta)}
                        />
                    </Col>
                    <Col span={12} className='scrollable'>
                        <div className='subheading'>languages:</div>
                        <Textbox
                            text={this.state.pc.languages}
                            onChange={value => this.changeValue(this.state.pc, 'languages', value)}
                        />
                        <div className='subheading'>d&d beyond link:</div>
                        <Textbox
                            text={this.state.pc.url}
                            placeholder='https://ddb.ac/characters/...'
                            onChange={value => this.changeValue(this.state.pc, 'url', value)}
                        />
                        <div className='subheading'>portrait</div>
                        <PortraitPanel
                            source={this.state.pc}
                            edit={() => this.toggleImageSelection()}
                            clear={() => this.changeValue(this.state.pc, 'portrait', '')}
                        />
                        <div className='subheading'>companions:</div>
                        {companions}
                        <button onClick={() => this.addCompanion()}>add a new companion</button>
                    </Col>
                    <Drawer visible={this.state.showImageSelection} closable={false} onClose={() => this.toggleImageSelection()}>
                        <ImageSelectionModal
                            parties={this.props.parties}
                            library={this.props.library}
                            maps={this.props.maps}
                            select={id => this.changeValue(this.state.pc, 'portrait', id)}
                            cancel={() => this.toggleImageSelection()}
                        />
                    </Drawer>
                </Row>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
