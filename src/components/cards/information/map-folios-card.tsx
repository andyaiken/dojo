import React from 'react';

import { MapFolio } from '../../../models/map-folio';

import InfoCard from '../info-card';

interface Props {
    mapFolios: MapFolio[];
}

export default class MapFoliosCard extends React.Component<Props> {
    private getContent() {
        let action: JSX.Element | null = null;
        if (this.props.mapFolios.length === 0) {
            action = (
                <div className='section'>to start a new folio, press the button below</div>
            );
        } else {
            action = (
                <div className='section'>select a map folio from the list to see the maps it contains</div>
            );
        }

        return (
            <div>
                <div className='section'>on this page you can set up folios containing tactical maps</div>
                <div className='section'>when you have created a map you can use it in encounters</div>
                <div className='divider'/>
                {action}
            </div>
        );
    }

    public render() {
        try {
            return (
                <InfoCard getContent={() => this.getContent()} />
            );
        } catch (ex) {
            console.error(ex);
        }
    }
}
