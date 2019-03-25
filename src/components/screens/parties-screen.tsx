import React from 'react';

import { Party, PC } from '../../models/party';

import InfoCard from '../cards/info-card';
import PartiesCard from '../cards/information/parties-card';
import PartyCard from '../cards/party-card';
import PCCard from '../cards/pc-card';
import PartyListItem from '../list-items/party-list-item';
import CardGroup from '../panels/card-group';

interface Props {
    parties: Party[];
    selection: Party | null;
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
    public render() {
        try {
            var help = null;
            if (this.props.showHelp) {
                help = (
                    <PartiesCard parties={this.props.parties}/>
                );
            }

            const parties = [];
            for (var n = 0; n !== this.props.parties.length; ++n) {
                const p = this.props.parties[n];
                parties.push(
                    <PartyListItem
                        key={p.id}
                        party={p}
                        selected={p === this.props.selection}
                        setSelection={party => this.props.selectParty(party)}
                    />
                );
            }

            const activeCards: JSX.Element[] = [];
            const inactiveCards: JSX.Element[] = [];

            if (this.props.selection) {
                activeCards.push(
                    <div className='column' key='info'>
                        <PartyCard
                            selection={this.props.selection}
                            addPC={() => this.props.addPC()}
                            sortPCs={() => this.props.sortPCs()}
                            changeValue={(type, value) => this.props.changeValue(this.props.selection, type, value)}
                            removeParty={() => this.props.removeParty()}
                        />
                    </div>
                );

                const activePCs = this.props.selection.pcs.filter(pc => pc.active);
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

                const inactivePCs = this.props.selection.pcs.filter(pc => !pc.active);
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
                            <InfoCard getContent={() => <div className='section'>no pcs</div>} />
                        </div>
                    );
                }
            }

            var name;
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
