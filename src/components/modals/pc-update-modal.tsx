import { Col, Row } from 'antd';
import React from 'react';

import Hero from '../../utils/hero';

import { PC } from '../../models/party';

import PCCard from '../cards/pc-card';
import Textbox from '../controls/textbox';
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
                        <Textbox
                            text={this.state.source}
                            placeholder='paste data here'
                            minLines={10}
                            maxLines={10}
                            onChange={value => this.setSource(value)}
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
