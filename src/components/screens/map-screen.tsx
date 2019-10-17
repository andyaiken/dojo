import React from 'react';

import { Input } from 'antd';

import { Map, MapFolio } from '../../models/map-folio';

import ConfirmButton from '../controls/confirm-button';
import GridPanel from '../panels/grid-panel';
import MapPanel from '../panels/map-panel';
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
                        <div className='card map'>
                            <div className='heading'>
                                <div className='title'>{m.name || 'unnamed map'}</div>
                            </div>
                            <div className='card-content'>
                                <div className='section'>
                                    <MapPanel
                                        map={m}
                                        mode='thumbnail'
                                        size={10}
                                    />
                                </div>
                                <div className='divider' />
                                <button onClick={() => this.props.editMap(m)}>edit map</button>
                                <ConfirmButton text='delete map' callback={() => this.props.removeMap(m)} />
                            </div>
                        </div>
                    </div>
                );
            });

            if (folioCards.length === 0) {
                folioCards.push(
                    <div className='column' key='empty'>
                        <Note><div className='section'>there are no maps in this folio</div></Note>
                    </div>
                );
            }

            return (
                <div className='screen row collapse'>
                    <div className='columns small-4 medium-4 large-3 scrollable sidebar'>
                        <MapFolioInfo
                            mapFolio={this.props.mapFolio}
                            addMap={() => this.props.addMap()}
                            removeMapFolio={() => this.props.removeMapFolio()}
                            changeValue={(source, field, value) => this.props.changeValue(source, field, value)}
                        />
                    </div>
                    <div className='columns small-8 medium-8 large-9 scrollable'>
                        <GridPanel
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
                        <Input
                            placeholder='map folio name'
                            value={this.props.mapFolio.name}
                            allowClear={true}
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
