import { InfoCircleOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import React from 'react';

import Utils from '../../utils/utils';

import { Party, PC } from '../../models/party';

import ConfirmButton from '../controls/confirm-button';
import GridPanel from '../panels/grid-panel';
import Note from '../panels/note';
import PortraitPanel from '../panels/portrait-panel';

interface Props {
    parties: Party[];
    addParty: () => void;
    importParty: () => void;
    selectParty: (party: Party) => void;
    deleteParty: (party: Party) => void;
    openStatBlock: (pc: PC) => void;
}

export default class PartyListScreen extends React.Component<Props> {
    public render() {
        try {
            const parties = this.props.parties;
            Utils.sort(parties);
            const listItems = parties.map(p => (
                <ListItem
                    key={p.id}
                    party={p}
                    open={party => this.props.selectParty(party)}
                    delete={party => this.props.deleteParty(party)}
                    openStatBlock={pc => this.props.openStatBlock(pc)}
                />
            ));

            return (
                <Row className='full-height'>
                    <Col xs={12} sm={12} md={8} lg={6} xl={4} className='scrollable sidebar sidebar-left'>
                        <Note>
                            <div className='section'>this page is where you can tell dojo all about your pcs</div>
                            <div className='section'>you can add a party for each of your gaming groups</div>
                            <div className='section'>when you have set up a party and an encounter you can run the encounter in the combat manager</div>
                            <div className='divider'/>
                            <div className='section'>on the right you will see a list of parties that you have created</div>
                            <div className='section'>select a party from the list to see pc details</div>
                            <div className='divider'/>
                            <div className='section'>to start adding a party, press the <b>create a new party</b> button</div>
                        </Note>
                        <button onClick={() => this.props.addParty()}>create a new party</button>
                        <button onClick={() => this.props.importParty()}>import a party</button>
                    </Col>
                    <Col xs={12} sm={12} md={16} lg={18} xl={20} className='scrollable'>
                        <GridPanel heading='parties' content={listItems} />
                    </Col>
                </Row>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}

interface ListItemProps {
    party: Party;
    open: (party: Party) => void;
    delete: (party: Party) => void;
    openStatBlock: (pc: PC) => void;
}

class ListItem extends React.Component<ListItemProps> {
    private getText(pc: PC) {
        let name = pc.name || 'unnamed pc';
        if (pc.player) {
            name += ' (' + pc.player + ')';
        }
        return name;
    }

    public render() {
        try {
            const pcs = this.props.party.pcs.filter(pc => pc.active).map(pc => (
                <div key={pc.id} className='combatant-row'>
                    <PortraitPanel source={pc} inline={true}/>
                    <div className='name'>{this.getText(pc)}</div>
                    <InfoCircleOutlined className='info-icon' onClick={() => this.props.openStatBlock(pc)} />
                </div>
            ));
            if (pcs.length === 0) {
                pcs.push(<div key='empty' className='section'>no pcs</div>);
            }

            const inactive = this.props.party.pcs.filter(pc => !pc.active);
            if (inactive.length > 0) {
                pcs.push(
                    <div key='inactive' className='subheading'>inactive pcs</div>
                );
                inactive.forEach(pc => pcs.push(
                    <div key={pc.id} className='combatant-row'>
                        <PortraitPanel source={pc} inline={true}/>
                        <div className='name'>{this.getText(pc)}</div>
                        <InfoCircleOutlined className='info-icon' onClick={() => this.props.openStatBlock(pc)} />
                    </div>
                ));
            }

            return (
                <div className='card pc'>
                    <div className='heading'>
                        <div className='title'>
                            {this.props.party.name || 'unnamed party'}
                        </div>
                    </div>
                    <div className='card-content'>
                        <div className='fixed-height'>
                            <div className='subheading'>pcs</div>
                            {pcs}
                        </div>
                        <div className='divider'/>
                        <button onClick={() => this.props.open(this.props.party)}>open party</button>
                        <ConfirmButton text='delete party' callback={() => this.props.delete(this.props.party)} />
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
