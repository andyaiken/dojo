import { CheckCircleOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import React from 'react';

import Utils from '../../utils/utils';

import { Combat, Combatant } from '../../models/combat';

import CombatCard from '../cards/combat-card';
import GridPanel from '../panels/grid-panel';
import Note from '../panels/note';

interface Props {
    combats: Combat[];
    hasPCs: boolean;
    hasMonsters: boolean;
    createCombat: () => void;
    resumeCombat: (combat: Combat) => void;
    deleteCombat: (combat: Combat) => void;
    openStatBlock: (combatant: Combatant) => void;
    setView: (view: string) => void;
}

export default class CombatListScreen extends React.Component<Props> {
    public render() {
        try {
            if (!this.props.hasPCs || !this.props.hasMonsters) {
                /* tslint:disable:max-line-length */
                return (
                    <Row align='middle' justify='center' className='scrollable'>
                        <Col xs={20} sm={18} md={16} lg={12} xl={10}>
                            <Note>
                                <div className='section'>
                                    this screen is for running combat encounters, but before you can do that you need to do these things first:
                                </div>
                                <ul>
                                    <li>
                                        <span className={this.props.hasPCs ? 'strikethrough' : ''}>
                                            define a party of pcs in the <button className='link' onClick={() => this.props.setView('parties')}>pcs screen</button>
                                        </span>
                                        {this.props.hasPCs ? <CheckCircleOutlined title='done' style={{ marginLeft: '5px' }}/> : null}
                                    </li>
                                    <li>
                                        <span className={this.props.hasMonsters ? 'strikethrough' : ''}>
                                            add some monsters in the <button className='link' onClick={() => this.props.setView('library')}>monsters screen</button>
                                        </span>
                                        {this.props.hasMonsters ? <CheckCircleOutlined title='done' style={{ marginLeft: '5px' }}/> : null}
                                    </li>
                                </ul>
                                <div className='divider'/>
                                <div className='section'>
                                    you probably want to design your encounter in the <button className='link' onClick={() => this.props.setView('encounters')}>encounters screen</button>, but you don't have to (you can generate a random encounter here instead)
                                </div>
                                <div className='divider'/>
                                <div className='section'>
                                    if you want to use a tactical map, you can either build one in the <button className='link' onClick={() => this.props.setView('maps')}>maps screen</button>, or you can generate a random one here
                                </div>
                            </Note>
                        </Col>
                    </Row>
                );
                /* tslint:enable:max-line-length */
            }

            const combats = this.props.combats;
            Utils.sort(combats);
            const listItems = combats.map(c => (
                <CombatCard
                    key={c.id}
                    combat={c}
                    resume={combat => this.props.resumeCombat(combat)}
                    delete={combat => this.props.deleteCombat(combat)}
                    openStatBlock={combatant => this.props.openStatBlock(combatant)}
                />
            ));

            return (
                <Row className='full-height'>
                    <Col xs={12} sm={12} md={8} lg={6} xl={4} className='scrollable sidebar sidebar-left'>
                        <Note>
                            <div className='section'>
                                here you can run a combat encounter by specifying a party and an encounter, and optionally a tactical map
                            </div>
                            <div className='divider' />
                            <div className='section'>on the right you will see a list of combats that you have paused</div>
                            <div className='section'>you can resume a paused combat by selecting it</div>
                            <div className='divider' />
                            <div className='section'>to start a combat encounter, press the <b>start a new combat</b> button</div>
                        </Note>
                        <button onClick={() => this.props.createCombat()}>start a new combat</button>
                    </Col>
                    <Col xs={12} sm={12} md={16} lg={18} xl={20} className='scrollable'>
                        <GridPanel heading='combats' content={listItems} />
                    </Col>
                </Row>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
