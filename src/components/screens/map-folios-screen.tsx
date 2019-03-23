import React from 'react';

import { MapFolio, Map } from '../../models/map-folio';

import MapFoliosCard from '../cards/information/map-folios-card';
import MapFolioListItem from '../list-items/map-folio-list-item';
import MapFolioCard from '../cards/map-folio-card';
import MapCard from '../cards/map-card';
import InfoCard from '../cards/info-card';
import CardGroup from '../panels/card-group';

interface Props {
    mapFolios: MapFolio[];
    selection: MapFolio | null;
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
    render() {
        try {
            var help = null;
            if (this.props.showHelp) {
                help = (
                    <MapFoliosCard mapFolios={this.props.mapFolios} />
                );
            }

            var folios = [];
            for (var n = 0; n !== this.props.mapFolios.length; ++n) {
                var mapFolio = this.props.mapFolios[n];
                folios.push(
                    <MapFolioListItem
                        key={mapFolio.id}
                        mapFolio={mapFolio}
                        selected={mapFolio === this.props.selection}
                        setSelection={mapFolio => this.props.selectMapFolio(mapFolio)}
                    />
                );
            };

            var folio = null;
            if (this.props.selection) {
                var folioCards = [];

                folioCards.push(
                    <div className="column" key="info">
                        <MapFolioCard
                            selection={this.props.selection}
                            addMap={() => this.props.addMap()}
                            removeMapFolio={() => this.props.removeMapFolio()}
                            changeValue={(source, field, value) => this.props.changeValue(source, field, value)}
                        />
                    </div>
                );

                this.props.selection.maps.forEach(map => {
                    folioCards.push(
                        <div className="column" key={map.id}>
                            <MapCard
                                map={map}
                                editMap={map => this.props.editMap(map)}
                                removeMap={map => this.props.removeMap(map)}
                                changeValue={(source, type, value) => this.props.changeValue(source, type, value)}
                            />
                        </div>
                    );
                });

                if (this.props.selection.maps.length === 0) {
                    folioCards.push(
                        <div className="column" key="empty">
                            <InfoCard getContent={() => <div className="section">no maps</div>} />
                        </div>
                    );
                }

                folio = (
                    <div>
                        <CardGroup
                            content={folioCards}
                            heading={this.props.selection.name || "unnamed folio"}
                            showClose={this.props.selection !== null}
                            close={() => this.props.selectMapFolio(null)}
                        />
                    </div>
                );
            }

            return (
                <div className="map-builder row collapse">
                    <div className="columns small-4 medium-4 large-3 scrollable list-column">
                        {help}
                        <button onClick={() => this.props.addMapFolio()}>add a new map folio</button>
                        {folios}
                    </div>
                    <div className="columns small-8 medium-8 large-9 scrollable">
                        {folio}
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}