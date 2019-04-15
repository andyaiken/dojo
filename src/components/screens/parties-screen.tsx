import React from 'react';

import Utils from '../../utils/utils';

import { Party, PC } from '../../models/party';

import PartyCard from '../cards/party-card';
import PCCard from '../cards/pc-card';
import PartyListItem from '../list-items/party-list-item';
import CardGroup from '../panels/card-group';
import Note from '../panels/note';

interface Props {
    parties: Party[];
    selection: Party | null;
    filter: string;
    showHelp: boolean;
    selectParty: (party: Party | null) => void;
    addParty: () => void;
    removeParty: () => void;
    addPC: () => void;
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
            let help = null;
            if (this.props.showHelp) {
                help = (
                    <HelpCard parties={this.props.parties}/>
                );
            }

            const parties = this.props.parties.filter(p => this.showParty(p)).map(p => {
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

            const activeCards: JSX.Element[] = [];
            const inactiveCards: JSX.Element[] = [];

            if (this.props.selection) {
                activeCards.push(
                    <div className='column' key='info'>
                        <PartyCard
                            selection={this.props.selection}
                            filter={this.props.filter}
                            addPC={() => this.props.addPC()}
                            sortPCs={() => this.props.sortPCs()}
                            changeValue={(type, value) => this.props.changeValue(this.props.selection, type, value)}
                            removeParty={() => this.props.removeParty()}
                        />
                    </div>
                );

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

            return (
                <div className='parties row collapse'>
                    <div className='columns small-4 medium-4 large-3 scrollable list-column'>
                        {help}
                        <button onClick={() => this.props.addParty()}>add a new party</button>
                        {parties}
                    </div>
                    <div className='columns small-8 medium-8 large-9 scrollable'>
                        <CardGroup
                            content={activeCards}
                            heading={name}
                            showClose={this.props.selection !== null}
                            close={() => this.props.selectParty(null)}
                            hidden={!this.props.selection}
                        />
                        <CardGroup
                            content={inactiveCards}
                            heading='inactive pcs'
                            showClose={false}
                            hidden={inactiveCards.length === 0}
                        />
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
                    <div className='section'>to start adding a party, press the button below</div>
                );
            } else {
                action = (
                    <div className='section'>select a party from the list to see pc details</div>
                );
            }

            return (
                <Note
                    content={
                        <div>
                            <div className='section'>this page is where you can tell dojo all about your pcs</div>
                            <div className='section'>you can add a party for each of your gaming groups</div>
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
