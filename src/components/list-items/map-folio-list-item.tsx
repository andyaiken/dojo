import React from 'react';

import { MapFolio } from '../../models/map-folio';

interface Props {
    mapFolio: MapFolio;
    setSelection: (mapFolio: MapFolio) => void;
}

export default class MapFolioListItem extends React.Component<Props> {
    public render() {
        try {
            const maps = [];
            for (let n = 0; n !== this.props.mapFolio.maps.length; ++n) {
                const map = this.props.mapFolio.maps[n];
                maps.push(<div key={map.id} className='section'>{map.name || 'unnamed map'}</div>);
            }
            if (maps.length === 0) {
                maps.push(<div key='empty' className='section'>no maps</div>);
            }

            return (
                <div className='list-item' onClick={() => this.props.setSelection(this.props.mapFolio)}>
                    <div className='heading'>{this.props.mapFolio.name || 'unnamed folio'}</div>
                    {maps}
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
