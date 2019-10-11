import React from 'react';

import { Map, MapFolio } from '../../models/map-folio';

import MapCard from '../cards/map-card';
import ConfirmButton from '../controls/confirm-button';
import MapFolioListItem from '../list-items/map-folio-list-item';
import CardGroup from '../panels/card-group';
import Note from '../panels/note';

interface Props {
    mapFolios: MapFolio[];
    selection: MapFolio | null;
    selectMapFolio: (mapFolio: MapFolio | null) => void;
    addMapFolio: () => void;
    removeMapFolio: () => void;
    addMap: () => void;
    editMap: (map: Map) => void;
    removeMap: (map: Map) => void;
    changeValue: (source: {}, field: string, value: any) => void;
}

export default class MapFoliosScreen extends React.Component<Props> {
    public render() {
        try {
            let leftColumn = null;
            if (this.props.selection) {
                leftColumn = (
                    <div>
                        <MapFolioInfo
                            selection={this.props.selection}
                            addMap={() => this.props.addMap()}
                            removeMapFolio={() => this.props.removeMapFolio()}
                            changeValue={(source, field, value) => this.props.changeValue(source, field, value)}
                        />
                        <div className='divider' />
                        <button onClick={() => this.props.selectMapFolio(null)}>&larr; back to list</button>
                    </div>
                );
            } else {
                let listItems = this.props.mapFolios.map(mapFolio => {
                    return (
                        <MapFolioListItem
                            key={mapFolio.id}
                            mapFolio={mapFolio}
                            setSelection={f => this.props.selectMapFolio(f)}
                        />
                    );
                });
                if (listItems.length === 0) {
                    listItems = [(
                        <Note
                            key='empty'
                            content={'you have not set up any tactical maps yet'}
                        />
                    )];
                }

                leftColumn = (
                    <div>
                        <button onClick={() => this.props.addMapFolio()}>add a new map folio</button>
                        <div className='divider' />
                        {listItems}
                    </div>
                );
            }

            let folio = null;
            if (this.props.selection) {
                const folioCards = [];

                this.props.selection.maps.forEach(m => {
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

                folio = (
                    <CardGroup
                        content={folioCards}
                        heading={this.props.selection.name || 'unnamed folio'}
                    />
                );
            }

            let watermark;
            if (!this.props.selection) {
                watermark = (
                    <div className='vertical-center-outer'>
                        <div className='vertical-center-middle'>
                            <div className='vertical-center-inner'>
                                <HelpCard mapFolios={this.props.mapFolios} />
                            </div>
                        </div>
                    </div>
                );
            }

            return (
                <div className='map-builder row collapse'>
                    <div className='columns small-4 medium-4 large-3 scrollable list-column'>
                        {leftColumn}
                    </div>
                    <div className='columns small-8 medium-8 large-9 scrollable'>
                        {folio}
                        {watermark}
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}

interface HelpCardProps {
    mapFolios: MapFolio[];
}

class HelpCard extends React.Component<HelpCardProps> {
    public render() {
        try {
            let action: JSX.Element | null = null;
            if (this.props.mapFolios.length === 0) {
                action = (
                    <div className='section'>to start a new folio, press the <b>add a new map folio</b> button</div>
                );
            } else {
                action = (
                    <div>
                        <div className='section'>on the left you will see a list of map folios</div>
                        <div className='section'>select a folio from the list to see the maps it contains</div>
                    </div>
                );
            }

            return (
                <Note
                    content={
                        <div>
                            <div className='section'>on this page you can set up folios containing tactical maps</div>
                            <div className='section'>when you have created a map you can use it in the combat manager</div>
                            <div className='divider'/>
                            {action}
                        </div>
                    }
                />
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}

interface MapFolioInfoProps {
    selection: MapFolio;
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
                            value={this.props.selection.name}
                            onChange={event => this.props.changeValue(this.props.selection, 'name', event.target.value)}
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
