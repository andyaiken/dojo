import React from 'react';

import { Map } from '../../models/map-folio';

import ConfirmButton from '../controls/confirm-button';
import MapPanel from '../panels/map-panel';

interface Props {
    map: Map;
    changeValue: (map: Map, field: string, value: string) => void;
    editMap: (map: Map) => void;
    removeMap: (map: Map) => void;
}

export default class MapCard extends React.Component<Props> {
    public render() {
        try {
            return (
                <div className='card map'>
                    <div className='heading'>
                        <div className='title'>{this.props.map.name || 'unnamed map'}</div>
                    </div>
                    <div className='card-content'>
                        <div className='section'>
                            <MapPanel
                                map={this.props.map}
                                mode='thumbnail'
                            />
                        </div>
                        <div className='divider' />
                        <button onClick={() => this.props.editMap(this.props.map)}>edit map</button>
                        <ConfirmButton text='delete map' callback={() => this.props.removeMap(this.props.map)} />
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}
