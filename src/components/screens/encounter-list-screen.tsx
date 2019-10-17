import React from 'react';

import { Col, Row } from 'antd';

import Napoleon from '../../utils/napoleon';

import { Encounter, EncounterSlot } from '../../models/encounter';
import { Monster } from '../../models/monster-group';

import GridPanel from '../panels/grid-panel';
import Note from '../panels/note';

interface Props {
    encounters: Encounter[];
    addEncounter: () => void;
    selectEncounter: (encounter: Encounter) => void;
    getMonster: (monsterName: string, groupName: string) => Monster | null;
}

export default class EncounterListScreen extends React.Component<Props> {
    public render() {
        try {
            const listItems = this.props.encounters.map(e => (
                <ListItem
                    key={e.id}
                    encounter={e}
                    setSelection={encounter => this.props.selectEncounter(encounter)}
                    getMonster={(monsterName, groupName) => this.props.getMonster(monsterName, groupName)}
                />
            ));

            return (
                <Row className='full-height'>
                    <Col span={6} className='scrollable sidebar'>
                        <Note>
                            <div className='section'>on this page you can set up encounters</div>
                            <div className='section'>
                                when you have created an encounter you can add monsters to it, then gauge its difficulty for a party of pcs
                            </div>
                            <div className='section'>
                                when you have set up a party and an encounter you can then run the encounter in the combat manager
                            </div>
                            <div className='divider'/>
                            <div className='section'>on the right you will see a list of encounters that you have created</div>
                            <div className='section'>select an encounter from the list to add monsters to it</div>
                            <div className='divider'/>
                            <div className='section'>to start building an encounter, press the <b>create a new encounter</b> button</div>
                        </Note>
                        <button onClick={() => this.props.addEncounter()}>create a new encounter</button>
                    </Col>
                    <Col span={18} className='scrollable'>
                        <GridPanel heading='encounters' content={listItems} />
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
    encounter: Encounter;
    setSelection: (encounter: Encounter) => void;
    getMonster: (monsterName: string, groupName: string) => Monster | null;
}

class ListItem extends React.Component<ListItemProps> {
    private getText(slot: EncounterSlot) {
        let text = slot.monsterName || 'unnamed monster';
        if (slot.count > 1) {
            text += ' (x' + slot.count + ')';
        }
        return text;
    }

    public render() {
        try {
            const slots = this.props.encounter.slots.map(slot => (
                <div key={slot.id} className='section'>{this.getText(slot)}</div>
            ));
            if (slots.length === 0) {
                slots.push(<div key='empty' className='section'>no monsters</div>);
            }

            this.props.encounter.waves.forEach(wave => {
                slots.push(<div key={'name ' + wave.id} className='section subheading'>{wave.name || 'unnamed wave'}</div>);
                wave.slots.forEach(slot => {
                    slots.push(<div key={slot.id} className='section'>{this.getText(slot)}</div>);
                });
                if (slots.length === 0) {
                    slots.push(<div key={'empty ' + wave.id} className='section'>no monsters</div>);
                }
            });

            return (
                <div className='card encounter'>
                    <div className='heading'>
                        <div className='title'>
                            {this.props.encounter.name || 'unnamed encounter'}
                        </div>
                    </div>
                    <div className='card-content'>
                        <div className='grid'>
                            <div className='subheading'>monsters</div>
                            {slots}
                            <div className='subheading'>xp</div>
                            {Napoleon.getEncounterXP(this.props.encounter, this.props.getMonster)}
                        </div>
                        <div className='divider'/>
                        <button onClick={() => this.props.setSelection(this.props.encounter)}>open</button>
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
