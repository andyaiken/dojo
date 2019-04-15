import React from 'react';

import Utils from '../../utils/utils';

import { Map, MapFolio } from '../../models/map-folio';

import MapCard from '../cards/map-card';
import MapFolioCard from '../cards/map-folio-card';
import MapFolioListItem from '../list-items/map-folio-list-item';
import CardGroup from '../panels/card-group';
import Readaloud from '../panels/readaloud';

interface Props {
    mapFolios: MapFolio[];
    selection: MapFolio | null;
    filter: string;
    showHelp: boolean;
    selectMapFolio: (mapFolio: MapFolio | null) => void;
    addMapFolio: () => void;
    removeMapFolio: () => void;
    addMap: () => void;
    editMap: (map: Map) => void;
    removeMap: (map: Map) => void;
    changeValue: (source: {}, field: string, value: any) => void;
}

export default class MapFoliosScreen extends React.Component<Props> {
    private showMapFolio(folio: MapFolio) {
        let result = Utils.match(this.props.filter, folio.name);

        if (!result) {
            folio.maps.forEach(map => {
                result = Utils.match(this.props.filter, map.name) || result;
            });
        }

        return result;
    }

    public render() {
        try {
            let help = null;
            if (this.props.showHelp) {
                help = (
                    <HelpCard mapFolios={this.props.mapFolios} />
                );
            }

            const folios = this.props.mapFolios.filter(f => this.showMapFolio(f)).map(mapFolio => {
                return (
                    <MapFolioListItem
                        key={mapFolio.id}
                        mapFolio={mapFolio}
                        filter={this.props.filter}
                        selected={mapFolio === this.props.selection}
                        setSelection={f => this.props.selectMapFolio(f)}
                    />
                );
            });

            let folio = null;
            if (this.props.selection) {
                const folioCards = [];

                folioCards.push(
                    <div className='column' key='info'>
                        <MapFolioCard
                            selection={this.props.selection}
                            filter={this.props.filter}
                            addMap={() => this.props.addMap()}
                            removeMapFolio={() => this.props.removeMapFolio()}
                            changeValue={(source, field, value) => this.props.changeValue(source, field, value)}
                        />
                    </div>
                );

                this.props.selection.maps.filter(m => Utils.match(this.props.filter, m.name)).forEach(m => {
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
                            <Readaloud content={<div className='section'>there are no maps in this folio</div>} />
                        </div>
                    );
                }

                folio = (
                    <div>
                        <CardGroup
                            content={folioCards}
                            heading={this.props.selection.name || 'unnamed folio'}
                            showClose={this.props.selection !== null}
                            close={() => this.props.selectMapFolio(null)}
                        />
                    </div>
                );
            }

            return (
                <div className='map-builder row collapse'>
                    <div className='columns small-4 medium-4 large-3 scrollable list-column'>
                        {help}
                        <button onClick={() => this.props.addMapFolio()}>add a new map folio</button>
                        {folios}
                    </div>
                    <div className='columns small-8 medium-8 large-9 scrollable'>
                        {folio}
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
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
                    <div className='section'>to start a new folio, press the button below</div>
                );
            } else {
                action = (
                    <div className='section'>select a map folio from the list to see the maps it contains</div>
                );
            }

            return (
                <Readaloud
                    content={
                        <div>
                            <div className='section'>on this page you can set up folios containing tactical maps</div>
                            <div className='section'>when you have created a map you can use it in encounters</div>
                            <div className='divider'/>
                            {action}
                        </div>
                    }
                />
            );
        } catch (ex) {
            console.error(ex);
        }
    }
}
