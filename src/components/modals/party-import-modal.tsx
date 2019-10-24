import React from 'react';

import { Col, Input, Row } from 'antd';

import Hero from '../../utils/hero';

import { Party } from '../../models/party';

import PCCard from '../cards/pc-card';
import GridPanel from '../panels/grid-panel';
import Note from '../panels/note';

interface Props {
    party: Party;
}

interface State {
    source: string;
    party: Party;
}

export default class PartyImportModal extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            source: '',
            party: props.party
        };
    }

    private setSource(source: string) {
        this.setState({
            source: source
        });
    }

    private analyse() {
        Hero.import(this.state.source, this.state.party);
        this.setState({
            party: this.state.party
        });
    }

    public render() {
        try {
            return (
                <Row className='full-height'>
                    <Col span={12} className='scrollable'>
                        <Note>
                            <div>go to the following link to find the party you want to import</div>
                            <div>
                                <a href='https://www.dndbeyond.com/my-campaigns' target='_blank' rel='noopener noreferrer'>
                                    https://www.dndbeyond.com/my-campaigns
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
                    <Col span={12} className='scrollable'>
                        <GridPanel
                            heading={this.props.party.name}
                            columns={1}
                            content={this.props.party.pcs.map(pc => <PCCard key={pc.id} pc={pc} mode='view' />)}
                        />
                    </Col>
                </Row>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}
