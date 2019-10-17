import React from 'react';

import { Party, PC } from '../../models/party';

import GridPanel from '../panels/grid-panel';
import Note from '../panels/note';

interface Props {
    parties: Party[];
    addParty: () => void;
    selectParty: (party: Party) => void;
}

export default class PartyListScreen extends React.Component<Props> {
    public render() {
        try {
            const listItems = this.props.parties.map(p => (
                <ListItem
                    key={p.id}
                    party={p}
                    setSelection={party => this.props.selectParty(party)}
                />
            ));

            return (
                <div className='screen row collapse'>
                    <div className='columns small-4 medium-4 large-3 scrollable sidebar'>
                        <Note>
                            <div className='section'>this page is where you can tell dojo all about your pcs</div>
                            <div className='section'>you can add a party for each of your gaming groups</div>
                            <div className='section'>when you have set up a party and an encounter you can run the encounter in the combat manager</div>
                            <div className='divider'/>
                            <div className='section'>on the right you will see a list of parties that you have created</div>
                            <div className='section'>select a party from the list to see pc details</div>
                            <div className='divider'/>
                            <div className='section'>to start adding a party, press the <b>create a new party</b> button</div>
                        </Note>
                        <button onClick={() => this.props.addParty()}>create a new party</button>
                    </div>
                    <div className='columns small-8 medium-8 large-9 scrollable'>
                        <GridPanel heading='parties' content={listItems} />
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
    private getText(pc: PC) {
        let name = pc.name || 'unnamed pc';
        if (pc.player) {
            name += ' (' + pc.player + ')';
        }
        return name;
    }

    public render() {
        try {
            const pcs = this.props.party.pcs.filter(pc => pc.active).map(pc => (
                <div key={pc.id} className='section'>{this.getText(pc)}</div>
            ));
            if (pcs.length === 0) {
                pcs.push(<div key='empty' className='section'>no pcs</div>);
            }

            const inactive = this.props.party.pcs.filter(pc => !pc.active);
            if (inactive.length > 0) {
                pcs.push(
                    <div key='inactive' className='subheading'>inactive pcs</div>
                );
                inactive.forEach(pc => pcs.push(
                    <div key={pc.id} className='section'>{this.getText(pc)}</div>
                ));
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
