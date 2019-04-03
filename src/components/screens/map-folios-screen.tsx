import React from 'react';

import { Map, MapFolio } from '../../models/map-folio';

import InfoCard from '../cards/info-card';
import MapFoliosCard from '../cards/information/map-folios-card';
import MapCard from '../cards/map-card';
import MapFolioCard from '../cards/map-folio-card';
import MapFolioListItem from '../list-items/map-folio-list-item';
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
    public render() {
        try {
            let help = null;
            if (this.props.showHelp) {
                help = (
                    <MapFoliosCard mapFolios={this.props.mapFolios} />
                );
            }

            const folios = [];
            for (let n = 0; n !== this.props.mapFolios.length; ++n) {
                const mapFolio = this.props.mapFolios[n];
                folios.push(
                    <MapFolioListItem
                        key={mapFolio.id}
                        mapFolio={mapFolio}
                        selected={mapFolio === this.props.selection}
                        setSelection={this.props.selectMapFolio}
                    />
                );
            }

            let folio = null;
            if (this.props.selection) {
                const folioCards = [];

                folioCards.push(
                    <div className='column' key='info'>
                        <MapFolioCard
                            selection={this.props.selection}
                            addMap={this.props.addMap}
                            removeMapFolio={this.props.removeMapFolio}
                            changeValue={this.props.changeValue}
                        />
                    </div>
                );

                this.props.selection.maps.forEach(m => {
                    folioCards.push(
                        <div className='column' key={m.id}>
                            <MapCard
                                map={m}
                                editMap={this.props.editMap}
                                removeMap={this.props.removeMap}
                                changeValue={this.props.changeValue}
                            />
                        </div>
                    );
                });

                if (this.props.selection.maps.length === 0) {
                    folioCards.push(
                        <div className='column' key='empty'>
                            <InfoCard getContent={() => <div className='section'>no maps</div>} />
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
                        <button onClick={this.props.addMapFolio}>add a new map folio</button>
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
