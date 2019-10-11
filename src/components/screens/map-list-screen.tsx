import React from 'react';

import { MapFolio } from '../../models/map-folio';

import Note from '../panels/note';

interface Props {
    mapFolios: MapFolio[];
    selectMapFolio: (mapFolio: MapFolio) => void;
}

export default class MapListScreen extends React.Component<Props> {
    public render() {
        try {
            const listItems = this.props.mapFolios.map(mapFolio => {
                return (
                    <ListItem
                        key={mapFolio.id}
                        mapFolio={mapFolio}
                        setSelection={f => this.props.selectMapFolio(f)}
                    />
                );
            });
            if (listItems.length === 0) {
                listItems.push(
                    <Note
                        key='empty'
                        content={'you have not set up any tactical maps yet'}
                    />
                );
            }

            return (
                <div className='screen row collapse'>
                    <div className='columns small-4 medium-4 large-3 scrollable list-column'>
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

interface ListItemProps {
    mapFolio: MapFolio;
    setSelection: (mapFolio: MapFolio) => void;
}

class ListItem extends React.Component<ListItemProps> {
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
