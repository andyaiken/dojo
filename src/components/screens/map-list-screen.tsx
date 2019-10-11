import React from 'react';

import { MapFolio } from '../../models/map-folio';

import MapFolioListItem from '../list-items/map-folio-list-item';
import Note from '../panels/note';

interface Props {
    mapFolios: MapFolio[];
    selectMapFolio: (mapFolio: MapFolio) => void;
    addMapFolio: () => void;
}

export default class MapListScreen extends React.Component<Props> {
    public render() {
        try {
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

            return (
                <div className='screen row collapse'>
                    <div className='columns small-4 medium-4 large-3 scrollable list-column'>
                        <button onClick={() => this.props.addMapFolio()}>add a new map folio</button>
                        <div className='divider' />
                        {listItems}
                    </div>
                    <div className='columns small-8 medium-8 large-9 scrollable'>
                        <div className='vertical-center-outer'>
                            <div className='vertical-center-middle'>
                                <div className='vertical-center-inner'>
                                    <HelpCard mapFolios={this.props.mapFolios} />
                                </div>
                            </div>
                        </div>
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
