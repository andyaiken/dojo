import React from 'react';

import { Col, Row } from 'antd';

import { Combat } from '../../models/combat';

import ConfirmButton from '../controls/confirm-button';
import GridPanel from '../panels/grid-panel';
import MapPanel from '../panels/map-panel';
import Note from '../panels/note';

interface Props {
    combats: Combat[];
    createCombat: () => void;
    resumeCombat: (combat: Combat) => void;
    deleteCombat: (combat: Combat) => void;
}

export default class CombatListScreen extends React.Component<Props> {
    public render() {
        try {
            const listItems = this.props.combats.map(c => (
                <ListItem
                    key={c.id}
                    combat={c}
                    resume={combat => this.props.resumeCombat(combat)}
                    delete={combat => this.props.deleteCombat(combat)}
                />
            ));

            return (
                <Row className='full-height'>
                    <Col span={6} className='scrollable sidebar left'>
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
                    <Col span={18} className='scrollable'>
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

interface ListItemProps {
    combat: Combat;
    resume: (combat: Combat) => void;
    delete: (combat: Combat) => void;
}

class ListItem extends React.Component<ListItemProps> {
    public render() {
        try {
            let map = null;
            if (this.props.combat.map) {
                map = (
                    <MapPanel
                        map={this.props.combat.map}
                        mode='thumbnail'
                        size={10}
                        combatants={this.props.combat.combatants}
                    />
                );
            }

            return (
                <div className='card combat'>
                    <div className='heading'>
                        <div className='title'>
                            {this.props.combat.name || 'unnamed combat'}
                        </div>
                    </div>
                    <div className='card-content'>
                        <div className='grid'>
                            <div className='section'>paused at {this.props.combat.timestamp}</div>
                            {map}
                        </div>
                        <div className='divider'/>
                        <button onClick={() => this.props.resume(this.props.combat)}>resume</button>
                        <ConfirmButton text='delete' callback={() => this.props.delete(this.props.combat)} />
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
