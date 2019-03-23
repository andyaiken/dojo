import React from 'react';

import { EncounterWave } from '../../models/encounter';

import ConfirmButton from '../controls/confirm-button';
import InfoCard from './info-card';

interface Props {
    wave: EncounterWave;
    changeValue: (wave: EncounterWave, field: string, value: string) => void;
    removeWave: (wave: EncounterWave) => void;
}

export default class WaveCard extends React.Component<Props> {
    render() {
        try {
            var heading = (
                <div className="heading">
                    <div className="title">wave</div>
                </div>
            );

            var content = (
                <div>
                    <div className="section">
                        <input type="text" placeholder="wave name" value={this.props.wave.name} onChange={event => this.props.changeValue(this.props.wave, "name", event.target.value)} />
                    </div>
                    <div className="divider"></div>
                    <div className="section">
                        <ConfirmButton text="delete wave" callback={() => this.props.removeWave(this.props.wave)} />
                    </div>
                </div>
            )

            return (
                <InfoCard getHeading={() => heading} getContent={() => content} />
            );
        } catch (e) {
            console.error(e);
        }
    };
}