import React from 'react';

import { MapFolio } from '../../models/map-folio';

import ConfirmButton from '../controls/confirm-button';
import InfoCard from './info-card';

interface Props {
    selection: MapFolio;
    changeValue: (source: MapFolio, field: string, value: string) => void;
    addMap: () => void;
    removeMapFolio: () => void;
}

export default class MapFolioCard extends React.Component<Props> {
    public render() {
        try {
            const heading = (
                <div className='heading'>
                    <div className='title'>map folio</div>
                </div>
            );

            const content = (
                <div>
                    <div className='section'>
                        <input type='text' placeholder='folio name' value={this.props.selection.name} onChange={event => this.props.changeValue(this.props.selection, 'name', event.target.value)} />
                    </div>
                    <div className='divider' />
                    <div className='section'>
                        <button onClick={() => this.props.addMap()}>add a new map</button>
                        <ConfirmButton text='delete folio' callback={() => this.props.removeMapFolio()} />
                    </div>
                </div>
            );

            return (
                <InfoCard getHeading={() => heading} getContent={() => content} />
            );
        } catch (e) {
            console.error(e);
        }
    }
}
