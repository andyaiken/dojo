import React from 'react';

import { Party } from '../../models/party';

import CardGroup from '../panels/card-group';
import Note from '../panels/note';

interface Props {
    parties: Party[];
    selectParty: (party: Party) => void;
}

export default class PartyListScreen extends React.Component<Props> {
    public render() {
        try {
            const listItems = this.props.parties.map(p => {
                return (
                    <ListItem
                        key={p.id}
                        party={p}
                        setSelection={party => this.props.selectParty(party)}
                    />
                );
            });

            return (
                <div className='screen row collapse'>
                    <div className='columns small-4 medium-4 large-3 scrollable left-column'>
                        <Note
                            content={
                                <div>
                                    <div className='section'>this page is where you can tell dojo all about your pcs</div>
                                    <div className='section'>you can add a party for each of your gaming groups</div>
                                    <div className='section'>when you have set up a party and an encounter you can run the encounter in the combat manager</div>
                                    <div className='divider'/>
                                    <div className='section'>on the right you will see a list of parties that you have created</div>
                                    <div className='section'>select a party from the list to see pc details</div>
                                    <div className='divider'/>
                                    <div className='section'>to start adding a party, press the <b>add a new party</b> button</div>
                                </div>
                            }
                        />
                    </div>
                    <div className='columns small-8 medium-8 large-9 scrollable'>
                        <CardGroup heading='parties' content={listItems} />
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}

interface ListItemProps {
    party: Party;
    setSelection: (party: Party) => void;
}

class ListItem extends React.Component<ListItemProps> {
    public render() {
        try {
            const pcs = [];
            for (let n = 0; n !== this.props.party.pcs.length; ++n) {
                const pc = this.props.party.pcs[n];
                let name = pc.name || 'unnamed pc';
                if (pc.player) {
                    name += ' (' + pc.player + ')';
                }
                pcs.push(<div key={pc.id} className='section'>{name}</div>);
            }
            if (pcs.length === 0) {
                pcs.push(<div key='empty' className='section'>no pcs</div>);
            }

            return (
                <div className='column'>
                    <div className='card pc'>
                        <div className='heading'>
                            <div className='title'>
                                {this.props.party.name || 'unnamed party'}
                            </div>
                        </div>
                        <div className='card-content'>
                            <div className='grid'>
                                <div className='subheading'>pcs</div>
                                {pcs}
                            </div>
                            <div className='divider'/>
                            <button onClick={() => this.props.setSelection(this.props.party)}>open</button>
                        </div>
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
