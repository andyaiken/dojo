import React from 'react';

import { Map, MapFolio } from '../../models/map-folio';

import MapCard from '../cards/map-card';
import ConfirmButton from '../controls/confirm-button';
import CardGroup from '../panels/card-group';
import Note from '../panels/note';

interface Props {
    mapFolio: MapFolio;
    removeMapFolio: () => void;
    addMap: () => void;
    editMap: (map: Map) => void;
    removeMap: (map: Map) => void;
    changeValue: (source: {}, field: string, value: any) => void;
}

export default class MapScreen extends React.Component<Props> {
    public render() {
        try {
            const folioCards = [];

            this.props.mapFolio.maps.forEach(m => {
                folioCards.push(
                    <div className='column' key={m.id}>
                        <MapCard
                            map={m}
                            editMap={map => this.props.editMap(map)}
                            removeMap={map => this.props.removeMap(map)}
                            changeValue={(source, type, value) => this.props.changeValue(source, type, value)}
                        />
                    </div>
                );
            });

            if (folioCards.length === 0) {
                folioCards.push(
                    <div className='column' key='empty'>
                        <Note content={<div className='section'>there are no maps in this folio</div>} />
                    </div>
                );
            }

            return (
                <div className='screen row collapse'>
                    <div className='columns small-4 medium-4 large-3 scrollable list-column'>
                        <MapFolioInfo
                            mapFolio={this.props.mapFolio}
                            addMap={() => this.props.addMap()}
                            removeMapFolio={() => this.props.removeMapFolio()}
                            changeValue={(source, field, value) => this.props.changeValue(source, field, value)}
                        />
                    </div>
                    <div className='columns small-8 medium-8 large-9 scrollable'>
                        <CardGroup
                            content={folioCards}
                            heading={this.props.mapFolio.name || 'unnamed folio'}
                        />
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}

interface MapFolioInfoProps {
    mapFolio: MapFolio;
    changeValue: (source: MapFolio, field: string, value: string) => void;
    addMap: () => void;
    removeMapFolio: () => void;
}

class MapFolioInfo extends React.Component<MapFolioInfoProps> {
    public render() {
        try {
            return (
                <div>
                    <div className='section'>
                        <div className='subheading'>map folio name</div>
                        <input
                            type='text'
                            placeholder='map folio name'
                            value={this.props.mapFolio.name}
                            onChange={event => this.props.changeValue(this.props.mapFolio, 'name', event.target.value)}
                        />
                    </div>
                    <div className='divider' />
                    <div className='section'>
                        <button onClick={() => this.props.addMap()}>add a new map</button>
                        <ConfirmButton text='delete folio' callback={() => this.props.removeMapFolio()} />
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
