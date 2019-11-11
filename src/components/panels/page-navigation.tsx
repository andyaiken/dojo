import React from 'react';

import { Icon } from 'antd';

import { Combat } from '../../models/combat';
import { Encounter } from '../../models/encounter';
import { Map } from '../../models/map';
import { MonsterGroup } from '../../models/monster-group';
import { Party } from '../../models/party';

interface Props {
    parties: Party[];
    library: MonsterGroup[];
    encounters: Encounter[];
    maps: Map[];
    combats: Combat[];
    openParty: (id: string | null) => void;
    openMonsterGroup: (id: string | null) => void;
    openEncounter: (id: string | null) => void;
    openMap: (id: string | null) => void;
    openCombat: (id: string | null) => void;
}

interface State {
    showParties: boolean;
    showGroups: boolean;
    showEncounters: boolean;
    showMaps: boolean;
    showCombats: boolean;
}

export default class PageNavigation extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            showParties: false,
            showGroups: false,
            showEncounters: false,
            showMaps: false,
            showCombats: false
        };
    }

    private open(view: string) {
        this.setState({
            showParties: (view === 'parties') && !this.state.showParties,
            showGroups: (view === 'groups') && !this.state.showGroups,
            showEncounters: (view === 'encounters') && !this.state.showEncounters,
            showMaps: (view === 'maps') && !this.state.showMaps,
            showCombats: (view === 'combats') && !this.state.showCombats
        });
    }

    public render() {
        try {
            const encountersEnabled = this.props.library.length !== 0;
            const combatEnabled = (this.props.combats.length !== 0) || (this.props.parties.length !== 0);

            const parties = this.props.parties.map(party => (
                <div key={party.id} className='nav-subitem' onClick={() => this.props.openParty(party.id)}>{party.name}</div>
            ));

            const groups = this.props.library.map(group => (
                <div key={group.id} className='nav-subitem' onClick={() => this.props.openMonsterGroup(group.id)}>{group.name}</div>
            ));

            const encounters = this.props.encounters.map(encounter => (
                <div key={encounter.id} className='nav-subitem' onClick={() => this.props.openEncounter(encounter.id)}>{encounter.name}</div>
            ));

            const maps = this.props.maps.map(map => (
                <div key={map.id} className='nav-subitem' onClick={() => this.props.openMap(map.id)}>{map.name}</div>
            ));

            const combats = this.props.combats.map(combat => (
                <div key={combat.id} className='nav-subitem' onClick={() => this.props.openCombat(combat.id)}>{combat.name}</div>
            ));

            let openParties = null;
            if (this.props.parties.length > 0) {
                openParties = (
                    <Icon
                        type='down-circle'
                        className={this.state.showParties ? 'toggle open' : 'toggle'}
                        onClick={() => this.open('parties')}
                    />
                );
            }

            let openGroups = null;
            if (this.props.library.length > 0) {
                openGroups = (
                    <Icon
                        type='down-circle'
                        className={this.state.showGroups ? 'toggle open' : 'toggle'}
                        onClick={() => this.open('groups')}
                    />
                );
            }

            let openEncounters = null;
            if (this.props.encounters.length > 0) {
                openEncounters = (
                    <Icon
                        type='down-circle'
                        className={this.state.showEncounters ? 'toggle open' : 'toggle'}
                        onClick={() => this.open('encounters')}
                    />
                );
            }

            let openMaps = null;
            if (this.props.maps.length > 0) {
                openMaps = (
                    <Icon
                        type='down-circle'
                        className={this.state.showMaps ? 'toggle open' : 'toggle'}
                        onClick={() => this.open('maps')}
                    />
                );
            }

            let openCombats = null;
            if (this.props.combats.length > 0) {
                openCombats = (
                    <Icon
                        type='down-circle'
                        className={this.state.showCombats ? 'toggle open' : 'toggle'}
                        onClick={() => this.open('combats')}
                    />
                );
            }

            return (
                <div className='scrollable'>
                    <div className='nav-item'>
                        <div className='text' onClick={() => this.props.openParty(null)}>pcs</div>
                        {openParties}
                    </div>
                    {this.state.showParties ? parties : null}
                    <div className='nav-item'>
                        <div className='text' onClick={() => this.props.openMonsterGroup(null)}>monsters</div>
                        {openGroups}
                    </div>
                    {this.state.showGroups ? groups : null}
                    <div className={encountersEnabled ? 'nav-item' : 'nav-item disabled'}>
                        <div className='text' onClick={() => this.props.openEncounter(null)}>encounters</div>
                        {openEncounters}
                    </div>
                    {this.state.showEncounters ? encounters : null}
                    <div className='nav-item'>
                        <div className='text' onClick={() => this.props.openMap(null)}>maps</div>
                        {openMaps}
                    </div>
                    {this.state.showMaps ? maps : null}
                    <div className={combatEnabled ? 'nav-item' : 'nav-item disabled'}>
                        <div className='text' onClick={() => this.props.openCombat(null)}>combat</div>
                        {openCombats}
                    </div>
                    {this.state.showCombats ? combats : null}
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
