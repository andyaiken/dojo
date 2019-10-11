import React from 'react';

import { Encounter } from '../../models/encounter';

import EncounterListItem from '../list-items/encounter-list-item';
import Note from '../panels/note';

interface Props {
    encounters: Encounter[];
    selectEncounter: (encounter: Encounter) => void;
    addEncounter: () => void;
}

export default class EncounterListScreen extends React.Component<Props> {
    public render() {
        try {
            let listItems = this.props.encounters.map(e => {
                return (
                    <EncounterListItem
                        key={e.id}
                        encounter={e}
                        setSelection={encounter => this.props.selectEncounter(encounter)}
                    />
                );
            });
            if (listItems.length === 0) {
                listItems = [(
                    <Note
                        key='empty'
                        content={'you have not defined any encounters yet'}
                    />
                )];
            }

            return (
                <div className='screen row collapse'>
                    <div className='columns small-4 medium-4 large-3 scrollable list-column'>
                        <button onClick={() => this.props.addEncounter()}>add a new encounter</button>
                        <div className='divider' />
                        {listItems}
                    </div>
                    <div className='columns small-8 medium-8 large-9 scrollable'>
                        <div className='vertical-center-outer'>
                            <div className='vertical-center-middle'>
                                <div className='vertical-center-inner'>
                                    <HelpCard encounters={this.props.encounters} />
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
    encounters: Encounter[];
}

class HelpCard extends React.Component<HelpCardProps> {
    public render() {
        try {
            let action: JSX.Element | null = null;
            if (this.props.encounters.length === 0) {
                action = (
                    <div className='section'>to start building an encounter, press the <b>add a new encounter</b> button</div>
                );
            } else {
                action = (
                    <div>
                        <div className='section'>on the left you will see a list of encounters that you have created</div>
                        <div className='section'>select an encounter from the list to add monsters to it</div>
                    </div>
                );
            }

            return (
                <Note
                    content={
                        <div>
                            <div className='section'>on this page you can set up encounters</div>
                            <div className='section'>
                                when you have created an encounter you can add monsters to it, then gauge its difficulty for a party of pcs
                            </div>
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
