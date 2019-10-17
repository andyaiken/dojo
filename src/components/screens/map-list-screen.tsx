import React from 'react';

import { Col, Row } from 'antd';

import { MapFolio } from '../../models/map-folio';

import GridPanel from '../panels/grid-panel';
import MapPanel from '../panels/map-panel';
import Note from '../panels/note';

interface Props {
    mapFolios: MapFolio[];
    addMapFolio: () => void;
    selectMapFolio: (mapFolio: MapFolio) => void;
}

export default class MapListScreen extends React.Component<Props> {
    public render() {
        try {
            const listItems = this.props.mapFolios.map(mapFolio => (
                <ListItem
                    key={mapFolio.id}
                    mapFolio={mapFolio}
                    setSelection={f => this.props.selectMapFolio(f)}
                />
            ));

            return (
                <Row className='full-height'>
                    <Col span={6} className='scrollable sidebar'>
                        <Note>
                            <div className='section'>on this page you can set up folios containing tactical maps</div>
                            <div className='section'>when you have created a map you can use it in the combat manager</div>
                            <div className='divider'/>
                            <div className='section'>on the right you will see a list of map folios</div>
                            <div className='section'>select a folio from the list to see the maps it contains</div>
                            <div className='divider'/>
                            <div className='section'>to start a new folio, press the <b>create a new map folio</b> button</div>
                        </Note>
                        <button onClick={() => this.props.addMapFolio()}>create a new map folio</button>
                    </Col>
                    <Col span={18} className='scrollable'>
                        <GridPanel heading='map folios' content={listItems} />
                    </Col>
                </Row>
            );
        } catch (e) {
            console.error(e);
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
            const maps = this.props.mapFolio.maps.map(map => (
                <div key={map.id}>
                    <div className='section'>{map.name || 'unnamed map'}</div>
                    <MapPanel
                        map={map}
                        mode='thumbnail'
                        size={5}
                    />
                </div>
            ));
            if (maps.length === 0) {
                maps.push(<div key='empty' className='section'>no maps</div>);
            }

            return (
                <div className='card map'>
                    <div className='heading'>
                        <div className='title'>
                            {this.props.mapFolio.name || 'unnamed folio'}
                        </div>
                    </div>
                    <div className='card-content'>
                        <div className='grid'>
                            <div className='subheading'>maps</div>
                            {maps}
                        </div>
                        <div className='divider'/>
                        <button onClick={() => this.props.setSelection(this.props.mapFolio)}>open</button>
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
