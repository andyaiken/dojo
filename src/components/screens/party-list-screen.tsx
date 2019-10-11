import React from 'react';

import { Party } from '../../models/party';

import PartyListItem from '../list-items/party-list-item';
import Note from '../panels/note';

interface Props {
    parties: Party[];
    selectParty: (party: Party) => void;
    addParty: () => void;
}

export default class PartyListScreen extends React.Component<Props> {
    public render() {
        try {
            let listItems = this.props.parties.map(p => {
                return (
                    <PartyListItem
                        key={p.id}
                        party={p}
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
