import { Col, Row } from 'antd';
import React from 'react';

import Frankenstein from '../../utils/frankenstein';

import { Monster } from '../../models/monster-group';

import MonsterCard from '../cards/monster-card';
import Textbox from '../controls/textbox';
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
                        <Note>
                            <div className='section'>
                                go to the following link to find the monster you want to import
                            </div>
                            <div className='section'>
                                <a href='https://www.dndbeyond.com/monsters' target='_blank' rel='noopener noreferrer'>
                                    https://www.dndbeyond.com/monsters
                                </a>
                            </div>
                            <div className='section'>
                                then right-click on the page and select <b>view page source</b>
                            </div>
                            <div className='section'>
                                copy the entire page source into the clipboard, paste it into the box below, and press the analyse button
                            </div>
                        </Note>
                        <Textbox
                            text={this.state.source}
                            placeholder='paste page source here'
                            minLines={10}
                            maxLines={10}
                            onChange={value => this.setSource(value)}
                        />
                        <button onClick={() => this.analyse()}>analyse</button>
                    </Col>
                    <Col span={12} className='scrollable' style={{ padding: '5px' }}>
                        <MonsterCard monster={this.state.monster} />
                    </Col>
                </Row>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}
