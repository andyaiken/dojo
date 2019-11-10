import React from 'react';

import { Col, Icon, Input, Row } from 'antd';

import Mercator from '../../utils/mercator';

import { Map, MapFolio } from '../../models/map-folio';

import ConfirmButton from '../controls/confirm-button';
import GridPanel from '../panels/grid-panel';
import MapPanel from '../panels/map-panel';
import Note from '../panels/note';

interface Props {
    mapFolio: MapFolio;
    goBack: () => void;
    removeMapFolio: () => void;
    addMap: () => void;
    addDungeonMap: () => void;
    addDelveMap: () => void;
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
                );
            });

            if (folioCards.length === 0) {
                folioCards.push(
                    <Note><div className='section'>there are no maps in this folio</div></Note>
                );
            }

            return (
                <Row className='full-height'>
                    <Col xs={12} sm={12} md={8} lg={6} xl={4} className='scrollable sidebar left'>
                        <MapFolioInfo
                            mapFolio={this.props.mapFolio}
                            goBack={() => this.props.goBack()}
                            addMap={() => this.props.addMap()}
                            addDungeonMap={() => this.props.addDungeonMap()}
                            addDelveMap={() => this.props.addDelveMap()}
                            removeMapFolio={() => this.props.removeMapFolio()}
                            changeValue={(source, field, value) => this.props.changeValue(source, field, value)}
                        />
                    </Col>
                    <Col xs={12} sm={12} md={16} lg={18} xl={20} className='scrollable'>
                        <GridPanel
                            content={folioCards}
                            heading={this.props.mapFolio.name || 'unnamed folio'}
                        />
                    </Col>
                </Row>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}

interface MapFolioInfoProps {
    mapFolio: MapFolio;
    goBack: () => void;
    changeValue: (source: MapFolio, field: string, value: string) => void;
    addMap: () => void;
    addDungeonMap: () => void;
    addDelveMap: () => void;
    removeMapFolio: () => void;
}

class MapFolioInfo extends React.Component<MapFolioInfoProps> {
    private getSummary() {
        if (this.props.mapFolio.maps.length === 0) {
            return (
                <div className='section centered'>
                    <i>no maps</i>
                </div>
            );
        }

        const size: { min: number | null, max: number | null } = { min: null, max: null };

        this.props.mapFolio.maps.forEach(map => {
            const mapSize = Mercator.mapSize(map);
            size.min = size.min === null ? mapSize : Math.min(size.min, mapSize);
            size.max = size.max === null ? mapSize : Math.max(size.max, mapSize);
        });

        const sizeSummary = size.min === size.max ? (size.min as number).toString() : size.min + ' - ' + size.max;

        return (
            <div className='group-panel'>
                <div className='section'>
                    <div className='subheading'>map size</div>
                </div>
                <div className='section'>
                    {sizeSummary} squares
                </div>
            </div>
        );
    }

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
                    {this.getSummary()}
                    <div className='divider' />
                    <div className='section'>
                        <button onClick={() => this.props.addMap()}>add a new blank map</button>
                        <button onClick={() => this.props.addDungeonMap()}>add a new dungeon map</button>
                        <button onClick={() => this.props.addDelveMap()}>add a new delve map</button>
                        <ConfirmButton text='delete folio' callback={() => this.props.removeMapFolio()} />
                        <div className='divider' />
                        <button onClick={() => this.props.goBack()}><Icon type='caret-left' style={{ fontSize: '10px' }} /> back to the list</button>
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
