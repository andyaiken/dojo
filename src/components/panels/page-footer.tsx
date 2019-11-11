import React from 'react';

import { Combat } from '../../models/combat';
import { Encounter } from '../../models/encounter';
import { MonsterGroup } from '../../models/monster-group';
import { Party } from '../../models/party';

interface Props {
    view: 'home' | 'parties' | 'library' | 'encounters' | 'maps' | 'combat';
    library: MonsterGroup[];
    parties: Party[];
    encounters: Encounter[];
    combats: Combat[];
    setView: (view: 'parties' | 'library' | 'encounters' | 'maps' | 'combat') => void;
}

export default class PageFooter extends React.Component<Props> {
    public render() {
        try {
            const partiesStyle = this.props.view === 'parties' ? 'navigator-item pcs selected' : 'navigator-item pcs';
            const libraryStyle = this.props.view === 'library' ? 'navigator-item monsters selected' : 'navigator-item monsters';
            let encounterStyle = this.props.view === 'encounters' ? 'navigator-item encounters selected' : 'navigator-item encounters';
            const mapStyle = this.props.view === 'maps' ? 'navigator-item maps selected' : 'navigator-item maps';
            let combatStyle = this.props.view === 'combat' ? 'navigator-item combat selected' : 'navigator-item combat';

            const encountersEnabled = this.props.library.length !== 0;
            const combatEnabled = (this.props.combats.length !== 0) || (this.props.parties.length !== 0);
            if (!encountersEnabled) {
                encounterStyle += ' disabled';
            }
            if (!combatEnabled) {
                combatStyle += ' disabled';
            }

            return (
                <div className='page-footer'>
                    <div className={partiesStyle} onClick={() => this.props.setView('parties')}>pcs</div>
                    <div className={libraryStyle} onClick={() => this.props.setView('library')}>monsters</div>
                    <div className={encounterStyle} onClick={() => this.props.setView('encounters')}>encounters</div>
                    <div className={mapStyle} onClick={() => this.props.setView('maps')}>maps</div>
                    <div className={combatStyle} onClick={() => this.props.setView('combat')}>combat</div>
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
