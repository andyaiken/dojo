import React from 'react';

import { Col, Row } from 'antd';

import Napoleon from '../../utils/napoleon';

import { Encounter, EncounterSlot } from '../../models/encounter';
import { Monster } from '../../models/monster-group';

import ConfirmButton from '../controls/confirm-button';
import GridPanel from '../panels/grid-panel';
import Note from '../panels/note';
import PortraitPanel from '../panels/portrait-panel';

interface Props {
    encounters: Encounter[];
    addEncounter: () => void;
    selectEncounter: (encounter: Encounter) => void;
    deleteEncounter: (encounter: Encounter) => void;
    getMonster: (monsterName: string, groupName: string) => Monster | null;
}

export default class EncounterListScreen extends React.Component<Props> {
    public render() {
        try {
            const listItems = this.props.encounters.map(e => (
                <ListItem
                    key={e.id}
                    encounter={e}
                    open={encounter => this.props.selectEncounter(encounter)}
                    delete={encounter => this.props.deleteEncounter(encounter)}
                    getMonster={(monsterName, groupName) => this.props.getMonster(monsterName, groupName)}
                />
            ));

            return (
                <Row className='full-height'>
                    <Col xs={12} sm={12} md={8} lg={6} xl={4} className='scrollable sidebar left'>
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
                    <Col xs={12} sm={12} md={16} lg={18} xl={20} className='scrollable'>
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
    open: (encounter: Encounter) => void;
    delete: (encounter: Encounter) => void;
    getMonster: (monsterName: string, groupName: string) => Monster | null;
}

class ListItem extends React.Component<ListItemProps> {
    private getText(slot: EncounterSlot) {
        let text = slot.monsterName || 'unnamed monster';
        if (slot.count > 1) {
            text += ' (x' + slot.count + ')';
        }
        return <div className='name'>{text}</div>;
    }

    private getPortrait(slot: EncounterSlot) {
        const monster = this.props.getMonster(slot.monsterName, slot.monsterGroupName);
        if (monster && monster.portrait) {
            return <PortraitPanel source={monster} inline={true} />;
        }

        return null;
    }

    public render() {
        try {
            const slots = this.props.encounter.slots.map(slot => (
                <div key={slot.id} className='monster-row'>
                    {this.getPortrait(slot)}
                    {this.getText(slot)}
                </div>
            ));
            if (slots.length === 0) {
                slots.push(<div key='empty' className='section'>no monsters</div>);
            }

            this.props.encounter.waves.forEach(wave => {
                slots.push(<div key={'name ' + wave.id} className='section subheading'>{wave.name || 'unnamed wave'}</div>);
                wave.slots.forEach(slot => {
                    slots.push(
                        <div key={slot.id} className='monster-row'>
                            {this.getPortrait(slot)}
                            {this.getText(slot)}
                        </div>
                    );
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
                        <div className='fixed-height'>
                            <div className='subheading'>monsters</div>
                            {slots}
                            <div className='subheading'>xp</div>
                            {Napoleon.getEncounterXP(this.props.encounter, this.props.getMonster)}
                        </div>
                        <div className='divider'/>
                        <button onClick={() => this.props.open(this.props.encounter)}>open</button>
                        <ConfirmButton text='delete' callback={() => this.props.delete(this.props.encounter)} />
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
