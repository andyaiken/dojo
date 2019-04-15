import React from 'react';

import { Encounter } from '../../models/encounter';
import { Monster } from '../../models/monster-group';
import { Party } from '../../models/party';

import ConfirmButton from '../controls/confirm-button';
import Dropdown from '../controls/dropdown';
import DifficultyChartPanel from '../panels/difficulty-chart-panel';
import InfoCard from './info-card';

import arrow from '../../resources/images/down-arrow.svg';

interface Props {
    selection: Encounter;
    parties: Party[];
    filter: string;
    changeValue: (field: string, value: string) => void;
    addWave: () => void;
    removeEncounter: () => void;
    getMonster: (monsterName: string, groupName: string) => Monster | null;
}

interface State {
    showDetails: boolean;
    party: Party | null;
}

export default class EncounterCard extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            showDetails: false,
            party: null
        };
    }

    private toggleDetails() {
        this.setState({
            showDetails: !this.state.showDetails
        });
    }

    private selectParty(partyID: string) {
        const party = this.props.parties.find(p => p.id === partyID);
        this.setState({
            party: party as Party
        });
    }

    public render() {
        try {
            const partyOptions = [];
            if (this.props.parties) {
                for (let n = 0; n !== this.props.parties.length; ++n) {
                    const party = this.props.parties[n];
                    partyOptions.push({
                        id: party.id,
                        text: party.name
                    });
                }
            }

            const difficultySection = (
                <div>
                    <Dropdown
                        options={partyOptions}
                        placeholder='select party...'
                        selectedID={this.state.party ? this.state.party.id : undefined}
                        select={optionID => this.selectParty(optionID)}
                    />
                    <DifficultyChartPanel
                        encounter={this.props.selection}
                        party={this.state.party}
                        getMonster={(monsterName, monsterGroupName) => this.props.getMonster(monsterName, monsterGroupName)}
                    />
                </div>
            );

            const imageStyle = this.state.showDetails ? 'image rotate' : 'image';

            const heading = (
                <div className='heading'>
                    <div className='title'>encounter</div>
                    <img className={imageStyle} src={arrow} alt='arrow' onClick={() => this.toggleDetails()} />
                </div>
            );

            const content = (
                <div>
                    <div className='section'>
                        <input
                            type='text'
                            placeholder='encounter name'
                            value={this.props.selection.name}
                            disabled={!!this.props.filter}
                            onChange={event => this.props.changeValue('name', event.target.value)}
                        />
                    </div>
                    <div style={{ display: this.state.showDetails ? '' : 'none' }}>
                        <div className='divider' />
                        {difficultySection}
                    </div>
                    <div className='divider' />
                    <div className='section'>
                        <button className={this.props.filter ? 'disabled' : ''} onClick={() => this.props.addWave()}>add a new wave</button>
                        <ConfirmButton text='delete encounter' callback={() => this.props.removeEncounter()} />
                    </div>
                </div>
            );

            return (
                <InfoCard heading={heading} content={content} />
            );
        } catch (e) {
            console.error(e);
        }
    }
}
