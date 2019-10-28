import React from 'react';

import { Icon } from 'antd';

import { Combat } from '../../models/combat';
import { Encounter } from '../../models/encounter';
import { MapFolio } from '../../models/map-folio';
import { MonsterGroup } from '../../models/monster-group';
import { Party } from '../../models/party';

interface Props {
    parties: Party[];
    library: MonsterGroup[];
    encounters: Encounter[];
    maps: MapFolio[];
    combats: Combat[];
    openParty: (id: string | null) => void;
    openMonsterGroup: (id: string | null) => void;
    openEncounter: (id: string | null) => void;
    openMapFolio: (id: string | null) => void;
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
            const combatEnabled = (this.props.combats.length !== 0) || ((this.props.parties.length !== 0) && (this.props.encounters.length !== 0));

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
                <div key={map.id} className='nav-subitem' onClick={() => this.props.openMapFolio(map.id)}>{map.name}</div>
            ));

            const combats = this.props.combats.map(combat => (
                <div key={combat.id} className='nav-subitem' onClick={() => this.props.openCombat(combat.id)}>{combat.name}</div>
            ));

            return (
                <div className='scrollable'>
                    <div className='nav-item'>
                        <div className='text' onClick={() => this.props.openParty(null)}>pcs</div>
                        <Icon type='down-circle' className={this.state.showParties ? 'toggle open' : 'toggle'} onClick={() => this.open('parties')} />
                    </div>
                    {this.state.showParties ? parties : null}
                    <div className='nav-item'>
                        <div className='text' onClick={() => this.props.openMonsterGroup(null)}>monsters</div>
                        <Icon type='down-circle' className={this.state.showGroups ? 'toggle open' : 'toggle'} onClick={() => this.open('groups')} />
                    </div>
                    {this.state.showGroups ? groups : null}
                    <div className={encountersEnabled ? 'nav-item' : 'nav-item disabled'}>
                        <div className='text' onClick={() => this.props.openEncounter(null)}>encounters</div>
                        <Icon type='down-circle' className={this.state.showEncounters ? 'toggle open' : 'toggle'} onClick={() => this.open('encounters')} />
                    </div>
                    {this.state.showEncounters ? encounters : null}
                    <div className='nav-item'>
                        <div className='text' onClick={() => this.props.openMapFolio(null)}>maps</div>
                        <Icon type='down-circle' className={this.state.showMaps ? 'toggle open' : 'toggle'} onClick={() => this.open('maps')} />
                    </div>
                    {this.state.showMaps ? maps : null}
                    <div className={combatEnabled ? 'nav-item' : 'nav-item disabled'}>
                        <div className='text' onClick={() => this.props.openCombat(null)}>combat</div>
                        <Icon type='down-circle' className={this.state.showCombats ? 'toggle open' : 'toggle'} onClick={() => this.open('combats')} />
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
