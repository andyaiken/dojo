import React from 'react';

import { Encounter } from '../../models/encounter';
import { MonsterGroup } from '../../models/monster-group';
import { Party } from '../../models/party';

interface Props {
    view: string;
    blur: boolean;
    library: MonsterGroup[];
    parties: Party[];
    encounters: Encounter[];
    setView: (view: string) => void;
}

export default class Navbar extends React.Component<Props> {
    public render() {
        try {
            const partiesStyle = this.props.view === 'parties' ? 'navigator-item selected' : 'navigator-item';
            const libraryStyle = this.props.view === 'library' ? 'navigator-item selected' : 'navigator-item';
            var encounterStyle = this.props.view === 'encounter' ? 'navigator-item selected' : 'navigator-item';
            const mapStyle = this.props.view === 'maps' ? 'navigator-item selected' : 'navigator-item';
            var combatStyle = this.props.view === 'combat' ? 'navigator-item selected' : 'navigator-item';

            const encountersEnabled = this.props.library.length !== 0;
            const combatEnabled = (this.props.parties.length !== 0) && (this.props.encounters.length !== 0);
            if (!encountersEnabled) {
                encounterStyle += ' disabled';
            }
            if (!combatEnabled) {
                combatStyle += ' disabled';
            }

            return (
                <div className={this.props.blur ? 'navbar blur' : 'navbar'}>
                    <div className={partiesStyle} onClick={() => this.props.setView('parties')}>player characters</div>
                    <div className={libraryStyle} onClick={() => this.props.setView('library')}>monster library</div>
                    <div className={encounterStyle} onClick={() => encountersEnabled ? this.props.setView('encounter') : null}>encounter builder</div>
                    <div className={mapStyle} onClick={() => this.props.setView('maps')}>map folios</div>
                    <div className={combatStyle} onClick={() => combatEnabled ? this.props.setView('combat') : null}>combat manager</div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}
