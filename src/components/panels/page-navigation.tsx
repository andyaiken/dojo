import React from 'react';

import { Encounter } from '../../models/encounter';
import { MonsterGroup } from '../../models/monster-group';
import { Party } from '../../models/party';

interface Props {
    parties: Party[];
    library: MonsterGroup[];
    encounters: Encounter[];
    openParties: () => void;
    openLibrary: () => void;
    openEncounters: () => void;
    openMaps: () => void;
    openCombats: () => void;
}

export default class PageNavigation extends React.Component<Props> {
    public render() {
        try {
            const encountersEnabled = this.props.library.length !== 0;
            const combatEnabled = (this.props.parties.length !== 0) && (this.props.encounters.length !== 0);

            return (
                <div className='scrollable'>
                    <div className='nav-item' onClick={() => this.props.openParties()}>
                        player characters
                    </div>
                    <div className='nav-item' onClick={() => this.props.openLibrary()}>
                        monster library
                    </div>
                    <div className={encountersEnabled ? 'nav-item' : 'nav-item disabled'} onClick={() => this.props.openEncounters()}>
                        encounter builder
                    </div>
                    <div className='nav-item' onClick={() => this.props.openMaps()}>
                        map folios
                    </div>
                    <div className={combatEnabled ? 'nav-item' : 'nav-item disabled'} onClick={() => this.props.openCombats()}>
                        combat tracker
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
