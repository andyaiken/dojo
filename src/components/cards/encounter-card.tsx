import React from 'react';

import { Encounter, Party, Monster } from '../../models/models';

import Dropdown from '../controls/dropdown';
import DifficultyChartPanel from '../panels/difficulty-chart-panel';
import ConfirmButton from '../controls/confirm-button';
import InfoCard from './info-card';

import arrow from "../../resources/images/down-arrow.svg";

interface Props {
    selection: Encounter;
    parties: Party[];
    changeValue: (field: string, value: string) => void;
    addWave: () => void;
    removeEncounter: () => void;
    getMonster: (monsterName: string, groupName: string) => Monster;
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

    toggleDetails() {
        this.setState({
            showDetails: !this.state.showDetails
        })
    }

    selectParty(partyID: string) {
        var party = this.props.parties.find(p => p.id === partyID);
        this.setState({
            party: party as Party
        });
    }

    render() {
        try {
            var partyOptions = [];
            if (this.props.parties) {
                for (var n = 0; n !== this.props.parties.length; ++n) {
                    var party = this.props.parties[n];
                    partyOptions.push({
                        id: party.id,
                        text: party.name
                    });
                }
            }

            var difficultySection = (
                <div>
                    <Dropdown
                        options={partyOptions}
                        placeholder="select party..."
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

            var imageStyle = this.state.showDetails ? "image rotate" : "image";

            var heading = (
                <div className="heading">
                    <div className="title">encounter</div>
                    <img className={imageStyle} src={arrow} alt="arrow" onClick={() => this.toggleDetails()} />
                </div>
            );

            var content = (
                <div>
                    <div className="section">
                        <input type="text" placeholder="encounter name" value={this.props.selection.name} onChange={event => this.props.changeValue("name", event.target.value)} />
                    </div>
                    <div style={{ display: this.state.showDetails ? "" : "none" }}>
                        <div className="divider"></div>
                        {difficultySection}
                    </div>
                    <div className="divider"></div>
                    <div className="section">
                        <button onClick={() => this.props.addWave()}>add a new wave</button>
                        <ConfirmButton text="delete encounter" callback={() => this.props.removeEncounter()} />
                    </div>
                </div>
            );

            return (
                <InfoCard getHeading={() => heading} getContent={() => content} />
            );
        } catch (e) {
            console.error(e);
        }
    };
}