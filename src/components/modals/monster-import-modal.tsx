import React from 'react';

import { Col, Input, Row } from 'antd';

import Frankenstein from '../../utils/frankenstein';

import { Monster } from '../../models/monster-group';

import MonsterCard from '../cards/monster-card';
import Note from '../panels/note';

interface Props {
    monster: Monster;
}

interface State {
    source: string;
    monster: Monster;
}

export default class MonsterImportModal extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            source: '',
            monster: props.monster
        };
    }

    private setSource(source: string) {
        this.setState({
            source: source
        });
    }

    private analyse() {
        Frankenstein.import(this.state.source, this.state.monster);
        this.setState({
            monster: this.state.monster
        });
    }

    public render() {
        try {
            return (
                <Row className='full-height'>
                    <Col span={12} className='scrollable'>
                        <div className='heading'>import monster</div>
                        <Note>
                            <div>go to the following link to find the monster you want to import</div>
                            <div>
                                <a href='https://www.dndbeyond.com/monsters' target='_blank' rel='noopener noreferrer'>
                                    https://www.dndbeyond.com/monsters
                                </a>
                            </div>
                            <div>then right-click on the page and select <b>view page source</b></div>
                            <div>copy the entire page source into the clipboard, paste it into the box below, and press the analyse button</div>
                        </Note>
                        <Input.TextArea
                            placeholder='paste page source here'
                            rows={10}
                            value={this.state.source}
                            onChange={event => this.setSource(event.target.value)}
                        />
                        <button onClick={() => this.analyse()}>analyse</button>
                    </Col>
                    <Col span={12} className='scrollable' style={{ padding: '5px' }}>
                        <MonsterCard monster={this.state.monster} mode='view full' />
                    </Col>
                </Row>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}
