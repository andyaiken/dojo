import React from 'react';

import { Party } from '../../models/party';

import Note from '../panels/note';

interface Props {
    parties: Party[];
    selectParty: (party: Party) => void;
    addParty: () => void;
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
            if (listItems.length === 0) {
                listItems.push(
                    <Note
                        key='empty'
                        content={'you have not set up any parties yet'}
                    />
                );
            }

            return (
                <div className='screen row collapse'>
                    <div className='columns small-4 medium-4 large-3 scrollable list-column'>
                        <button onClick={() => this.props.addParty()}>add a new party</button>
                        <div className='divider' />
                        {listItems}
                    </div>
                    <div className='columns small-8 medium-8 large-9 scrollable'>
                        <div className='vertical-center-outer'>
                            <div className='vertical-center-middle'>
                                <div className='vertical-center-inner'>
                                    <HelpCard parties={this.props.parties} />
                                </div>
                            </div>
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
                <div className='list-item' onClick={() => this.props.setSelection(this.props.party)}>
                    <div className='heading'>{this.props.party.name || 'unnamed party'}</div>
                    {pcs}
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
