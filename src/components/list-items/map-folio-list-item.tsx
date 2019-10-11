import React from 'react';

import Utils from '../../utils/utils';

import { MapFolio } from '../../models/map-folio';

interface Props {
    mapFolio: MapFolio;
    selected: boolean;
    filter: string;
    setSelection: (mapFolio: MapFolio) => void;
}

export default class MapFolioListItem extends React.Component<Props> {
    public render() {
        try {
            const matchFolio = Utils.match(this.props.filter, this.props.mapFolio.name);

            const maps = [];
            for (let n = 0; n !== this.props.mapFolio.maps.length; ++n) {
                const map = this.props.mapFolio.maps[n];
                const name = map.name || 'unnamed map';
                if (matchFolio || Utils.match(this.props.filter, name)) {
                    maps.push(<div key={map.id} className='section'>{name}</div>);
                }
            }
            if (maps.length === 0) {
                maps.push(<div key='empty' className='section'>no maps</div>);
            }

            return (
                <div className={this.props.selected ? 'list-item selected' : 'list-item'} onClick={() => this.props.setSelection(this.props.mapFolio)}>
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
