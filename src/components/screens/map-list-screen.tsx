import { Col, Row } from 'antd';
import React from 'react';

import Utils from '../../utils/utils';

import { Map } from '../../models/map';

import ConfirmButton from '../controls/confirm-button';
import Expander from '../controls/expander';
import GridPanel from '../panels/grid-panel';
import MapPanel from '../panels/map-panel';
import Note from '../panels/note';

interface Props {
    maps: Map[];
    addMap: () => void;
    generateMap: (type: string) => void;
    viewMap: (map: Map) => void;
    editMap: (map: Map) => void;
    deleteMap: (map: Map) => void;
}

export default class MapListScreen extends React.Component<Props> {
    public render() {
        try {
            const maps = this.props.maps;
            Utils.sort(maps);
            const listItems = maps.map(map => (
                <ListItem
                    key={map.id}
                    map={map}
                    viewMap={m => this.props.viewMap(m)}
                    editMap={m => this.props.editMap(m)}
                    removeMap={m => this.props.deleteMap(m)}
                />
            ));

            return (
                <Row className='full-height'>
                    <Col xs={12} sm={12} md={8} lg={6} xl={4} className='scrollable sidebar sidebar-left'>
                        <Note>
                            <div className='section'>on this page you can set up tactical maps</div>
                            <div className='section'>when you have created a map you can use it in the combat manager</div>
                            <div className='divider'/>
                            <div className='section'>on the right you will see a list of maps</div>
                            <div className='divider'/>
                            <div className='section'>to start a new map, press the <b>create a new map</b> button</div>
                        </Note>
                        <button onClick={() => this.props.addMap()}>create a new map</button>
                        <Expander text='map generator'>
                            <button onClick={() => this.props.generateMap('dungeon')}>create a new dungeon map</button>
                            <button onClick={() => this.props.generateMap('delve')}>create a new delve map</button>
                        </Expander>
                    </Col>
                    <Col xs={12} sm={12} md={16} lg={18} xl={20} className='scrollable'>
                        <GridPanel heading='maps' content={listItems} />
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
    map: Map;
    viewMap: (map: Map) => void;
    editMap: (map: Map) => void;
    removeMap: (map: Map) => void;
}

class ListItem extends React.Component<ListItemProps> {
    public render() {
        try {
            return (
                <div className='card map'>
                    <div className='heading'>
                        <div className='title'>
                            {this.props.map.name || 'unnamed map'}
                        </div>
                    </div>
                    <div className='card-content'>
                        <Row align='middle' justify='center' className='fixed-height'>
                            <Col span={24}>
                                <MapPanel
                                    map={this.props.map}
                                    mode='thumbnail'
                                    size={12}
                                />
                            </Col>
                        </Row>
                        <div className='divider'/>
                        <button onClick={() => this.props.viewMap(this.props.map)}>view map</button>
                        <button onClick={() => this.props.editMap(this.props.map)}>edit map</button>
                        <ConfirmButton text='delete map' callback={() => this.props.removeMap(this.props.map)} />
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
