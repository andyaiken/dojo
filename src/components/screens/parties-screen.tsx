import React from 'react';

import Utils from '../../utils/utils';

import { Party, PC } from '../../models/party';

import PCCard from '../cards/pc-card';
import ConfirmButton from '../controls/confirm-button';
import PartyListItem from '../list-items/party-list-item';
import CardGroup from '../panels/card-group';
import Note from '../panels/note';

interface Props {
    parties: Party[];
    selection: Party | null;
    filter: string;
    selectParty: (party: Party | null) => void;
    addParty: () => void;
    removeParty: () => void;
    addPC: () => void;
    editPC: (pc: PC) => void;
    removePC: (pc: PC) => void;
    sortPCs: () => void;
    changeValue: (source: any, field: string, value: any) => void;
    nudgeValue: (source: any, field: string, value: number) => void;
}

export default class PartiesScreen extends React.Component<Props> {
    private showParty(party: Party) {
        let result = Utils.match(this.props.filter, party.name);

        if (!result) {
            party.pcs.forEach(pc => {
                result = Utils.match(this.props.filter, pc.name) || result;
            });
        }

        return result;
    }

    public render() {
        try {
            let leftColumn = null;
            if (this.props.selection) {
                leftColumn = (
                    <div>
                        <PartyInfo
                            selection={this.props.selection}
                            filter={this.props.filter}
                            addPC={() => this.props.addPC()}
                            sortPCs={() => this.props.sortPCs()}
                            changeValue={(type, value) => this.props.changeValue(this.props.selection, type, value)}
                            removeParty={() => this.props.removeParty()}
                        />
                        <div className='divider' />
                        <button onClick={() => this.props.selectParty(null)}>&larr; back to list</button>
                    </div>
                );
            } else {
                let listItems = this.props.parties.filter(p => this.showParty(p)).map(p => {
                    return (
                        <PartyListItem
                            key={p.id}
                            party={p}
                            filter={this.props.filter}
                            selected={p === this.props.selection}
                            setSelection={party => this.props.selectParty(party)}
                        />
                    );
                });
                if (listItems.length === 0) {
                    listItems = [(
                        <Note
                            key='empty'
                            content={'you have not set up any parties yet'}
                        />
                    )];
                }

                leftColumn = (
                    <div>
                        <button onClick={() => this.props.addParty()}>add a new party</button>
                        <div className='divider' />
                        {listItems}
                    </div>
                );
            }

            const activeCards: JSX.Element[] = [];
            const inactiveCards: JSX.Element[] = [];

            if (this.props.selection) {
                const pcs = this.props.selection.pcs.filter(pc => {
                    return Utils.match(this.props.filter, pc.name);
                });

                const activePCs = pcs.filter(pc => pc.active);
                activePCs.forEach(activePC => {
                    activeCards.push(
                        <div className='column' key={activePC.id}>
                            <PCCard
                                combatant={activePC}
                                mode={'edit'}
                                changeValue={(pc, type, value) => this.props.changeValue(pc, type, value)}
                                nudgeValue={(pc, type, delta) => this.props.nudgeValue(pc, type, delta)}
                                editPC={pc => this.props.editPC(pc)}
                                removePC={pc => this.props.removePC(pc)}
                            />
                        </div>
                    );
                });

                const inactivePCs = pcs.filter(pc => !pc.active);
                inactivePCs.forEach(inactivePC => {
                    inactiveCards.push(
                        <div className='column' key={inactivePC.id}>
                            <PCCard
                                combatant={inactivePC}
                                mode={'edit'}
                                changeValue={(pc, type, value) => this.props.changeValue(pc, type, value)}
                                nudgeValue={(pc, type, delta) => this.props.nudgeValue(pc, type, delta)}
                                editPC={pc => this.props.editPC(pc)}
                                removePC={pc => this.props.removePC(pc)}
                            />
                        </div>
                    );
                });

                if (activePCs.length === 0) {
                    activeCards.push(
                        <div className='column' key='empty'>
                            <Note content={<div className='section'>there are no pcs in this party</div>} />
                        </div>
                    );
                }
            }

            let name;
            if (this.props.selection) {
                name = this.props.selection.name || 'unnamed party';
            }

            let watermark;
            if (!this.props.selection) {
                watermark = (
                    <div className='vertical-center-outer'>
                        <div className='vertical-center-middle'>
                            <div className='vertical-center-inner'>
                                <HelpCard parties={this.props.parties} />
                            </div>
                        </div>
                    </div>
                );
            }

            return (
                <div className='parties row collapse'>
                    <div className='columns small-4 medium-4 large-3 scrollable list-column'>
                        {leftColumn}
                    </div>
                    <div className='columns small-8 medium-8 large-9 scrollable'>
                        <CardGroup
                            content={activeCards}
                            heading={name}
                            hidden={!this.props.selection}
                        />
                        <CardGroup
                            content={inactiveCards}
                            heading='inactive pcs'
                            hidden={inactiveCards.length === 0}
                        />
                        {watermark}
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}

interface HelpCardProps {
    parties: Party[];
}

class HelpCard extends React.Component<HelpCardProps> {
    public render() {
        try {
            let action: JSX.Element | null = null;
            if (this.props.parties.length === 0) {
                action = (
                    <div className='section'>to start adding a party, press the <b>add a new party</b> button</div>
                );
            } else {
                action = (
                    <div>
                        <div className='section'>on the left you will see a list of parties that you have created</div>
                        <div className='section'>select a party from the list to see pc details</div>
                    </div>
                );
            }

            return (
                <Note
                    content={
                        <div>
                            <div className='section'>this page is where you can tell dojo all about your pcs</div>
                            <div className='section'>you can add a party for each of your gaming groups</div>
                            <div className='section'>when you have set up a party and an encounter you can run the encounter in the combat manager</div>
                            <div className='divider'/>
                            {action}
                        </div>
                    }
                />
            );
        } catch (ex) {
            console.error(ex);
        }
    }
}

interface PartyInfoProps {
    selection: Party;
    filter: string | null;
    changeValue: (field: string, value: string) => void;
    addPC: () => void;
    sortPCs: () => void;
    removeParty: () => void;
}

class PartyInfo extends React.Component<PartyInfoProps> {
    private getSummary() {
        const activePCs = this.props.selection.pcs.filter(pc => pc.active);
        if (activePCs.length === 0) {
            return null;
        }

        let languages = '';
        let insightSummary = '-';
        let investigationSummary = '-';
        let perceptionSummary = '-';

        languages = activePCs
            .map(pc => pc.languages)
            .join(', ')
            .split(/[ ,;]+/)
            .reduce((array: string[], value) => {
                if (array.indexOf(value) === -1) {
                    array.push(value);
                }
                return array;
            }, [])
            .sort((a, b) => {
                if (a === 'Common') {
                    return -1;
                }
                if (b === 'Common') {
                    return 1;
                }
                return a.localeCompare(b);
            })
            .join(', ');

        const insight: { min: number | null, max: number | null } = { min: null, max: null };
        const invest: { min: number | null, max: number | null } = { min: null, max: null };
        const percep: { min: number | null, max: number | null } = { min: null, max: null };

        activePCs.forEach(pc => {
            insight.min = insight.min === null ? pc.passiveInsight : Math.min(insight.min, pc.passiveInsight);
            insight.max = insight.max === null ? pc.passiveInsight : Math.max(insight.max, pc.passiveInsight);
            invest.min = invest.min === null ? pc.passiveInvestigation : Math.min(invest.min, pc.passiveInvestigation);
            invest.max = invest.max === null ? pc.passiveInvestigation : Math.max(invest.max, pc.passiveInvestigation);
            percep.min = percep.min === null ? pc.passivePerception : Math.min(percep.min, pc.passivePerception);
            percep.max = percep.max === null ? pc.passivePerception : Math.max(percep.max, pc.passivePerception);
        });

        insightSummary = insight.min === insight.max ? (insight.min as number).toString() : insight.min + ' - ' + insight.max;
        investigationSummary = invest.min === invest.max ? (invest.min as number).toString() : invest.min + ' - ' + invest.max;
        perceptionSummary = percep.min === percep.max ? (percep.min as number).toString() : percep.min + ' - ' + percep.max;

        return (
            <div className='list-item non-clickable'>
                <div className='section' style={{ display: languages !== '' ? 'block' : 'none' }}>
                    <div className='subheading'>party known languages</div>
                </div>
                <div className='section'>
                    {languages}
                </div>
                <div className='section'>
                    <div className='subheading'>party passive skills</div>
                </div>
                <div className='table'>
                    <div>
                        <div className='cell three'><b>insight</b></div>
                        <div className='cell three'><b>invest.</b></div>
                        <div className='cell three'><b>percep.</b></div>
                    </div>
                    <div>
                        <div className='cell three'>{insightSummary}</div>
                        <div className='cell three'>{investigationSummary}</div>
                        <div className='cell three'>{perceptionSummary}</div>
                    </div>
                </div>
            </div>
        );
    }

    public render() {
        try {
            return (
                <div>
                    <div className='section'>
                        <div className='subheading'>party name</div>
                        <input
                            type='text'
                            placeholder='party name'
                            value={this.props.selection.name}
                            disabled={!!this.props.filter}
                            onChange={event => this.props.changeValue('name', event.target.value)}
                        />
                    </div>
                    {this.getSummary()}
                    <div className='divider' />
                    <div className='section'>
                        <button className={this.props.filter ? 'disabled' : ''} onClick={() => this.props.addPC()}>add a new pc</button>
                        <button className={this.props.filter ? 'disabled' : ''} onClick={() => this.props.sortPCs()}>sort pcs</button>
                        <ConfirmButton text='delete party' callback={() => this.props.removeParty()} />
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}
