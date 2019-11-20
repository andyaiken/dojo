import React from 'react';

import { Col, Input, Row } from 'antd';

import Hero from '../../utils/hero';

import { PC } from '../../models/party';

import PCCard from '../cards/pc-card';
import Note from '../panels/note';

interface Props {
    pc: PC;
}

interface State {
    source: string;
    pc: PC;
}

export default class PCUpdateModal extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            source: '',
            pc: props.pc
        };
    }

    private setSource(source: string) {
        this.setState({
            source: source
        });
    }

    private analyse() {
        Hero.importPC(this.state.source, this.state.pc);
        this.setState({
            pc: this.state.pc
        });
    }

    public render() {
        try {
            let url = this.state.pc.url;
            if (!url.endsWith('/')) {
                url += '/';
            }
            url += 'json';

            return (
                <Row className='full-height'>
                    <Col span={12} className='scrollable'>
                        <Note>
                            <div>go to the following link</div>
                            <div>
                                <a href={url} target='_blank' rel='noopener noreferrer'>
                                    {url}
                                </a>
                            </div>
                            <div>copy the data into the clipboard, paste it into the box below, and press the analyse button</div>
                        </Note>
                        <Input.TextArea
                            placeholder='paste data here'
                            rows={10}
                            value={this.state.source}
                            onChange={event => this.setSource(event.target.value)}
                        />
                        <button onClick={() => this.analyse()}>analyse</button>
                    </Col>
                    <Col span={12} className='scrollable'>
                        <PCCard pc={this.state.pc} mode='view' />
                    </Col>
                </Row>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}
