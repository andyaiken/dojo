import React from 'react';

import { Encounter } from '../../models/encounter';
import { MonsterGroup } from '../../models/monster-group';
import { Party } from '../../models/party';

interface Props {
    view: 'home' | 'parties' | 'library' | 'encounters' | 'maps' | 'combat';
    library: MonsterGroup[];
    parties: Party[];
    encounters: Encounter[];
    setView: (view: 'home' | 'parties' | 'library' | 'encounters' | 'maps' | 'combat') => void;
}

export default class PageFooter extends React.Component<Props> {
    public render() {
        try {
            const partiesStyle = this.props.view === 'parties' ? 'navigator-item selected' : 'navigator-item';
            const libraryStyle = this.props.view === 'library' ? 'navigator-item selected' : 'navigator-item';
            let encounterStyle = this.props.view === 'encounters' ? 'navigator-item selected' : 'navigator-item';
            const mapStyle = this.props.view === 'maps' ? 'navigator-item selected' : 'navigator-item';
            let combatStyle = this.props.view === 'combat' ? 'navigator-item selected' : 'navigator-item';

            const encountersEnabled = this.props.library.length !== 0;
            const combatEnabled = (this.props.parties.length !== 0) && (this.props.encounters.length !== 0);
            if (!encountersEnabled) {
                encounterStyle += ' disabled';
            }
            if (!combatEnabled) {
                combatStyle += ' disabled';
            }

            return (
                <div className='page-footer'>
                    <div className={partiesStyle} onClick={() => this.props.setView('parties')}>player characters</div>
                    <div className={libraryStyle} onClick={() => this.props.setView('library')}>monster library</div>
                    <div className={encounterStyle} onClick={() => encountersEnabled ? this.props.setView('encounters') : null}>encounter builder</div>
                    <div className={mapStyle} onClick={() => this.props.setView('maps')}>map folios</div>
                    <div className={combatStyle} onClick={() => combatEnabled ? this.props.setView('combat') : null}>combat manager</div>
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
