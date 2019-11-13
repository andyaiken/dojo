import React from 'react';

import { Col, Collapse, Icon, Row } from 'antd';

import { Map } from '../../models/map';

import ConfirmButton from '../controls/confirm-button';
import GridPanel from '../panels/grid-panel';
import MapPanel from '../panels/map-panel';
import Note from '../panels/note';

interface Props {
    maps: Map[];
    addMap: () => void;
    generateMap: (type: string) => void;
    editMap: (map: Map) => void;
    deleteMap: (map: Map) => void;
}

export default class MapListScreen extends React.Component<Props> {
    public render() {
        try {
            const listItems = this.props.maps.map(map => (
                <ListItem
                    key={map.id}
                    map={map}
                    editMap={m => this.props.editMap(m)}
                    removeMap={m => this.props.deleteMap(m)}
                />
            ));

            return (
                <Row className='full-height'>
                    <Col xs={12} sm={12} md={8} lg={6} xl={4} className='scrollable sidebar left'>
                        <Note>
                            <div className='section'>on this page you can set up tactical maps</div>
                            <div className='section'>when you have created a map you can use it in the combat manager</div>
                            <div className='divider'/>
                            <div className='section'>on the right you will see a list of maps</div>
                            <div className='divider'/>
                            <div className='section'>to start a new map, press the <b>create a new map</b> button</div>
                        </Note>
                        <button onClick={() => this.props.addMap()}>create a new map</button>
                        <Collapse
                            bordered={false}
                            expandIcon={p => <Icon type='down-circle' rotate={p.isActive ? -180 : 0} />}
                            expandIconPosition={'right'}
                        >
                            <Collapse.Panel key='one' header='map generator'>
                                <button onClick={() => this.props.generateMap('dungeon')}>create a new dungeon map</button>
                                <button onClick={() => this.props.generateMap('delve')}>create a new delve map</button>
                            </Collapse.Panel>
                        </Collapse>
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
                        <div className='fixed-height'>
                            <div className='section'>
                                <MapPanel
                                    map={this.props.map}
                                    mode='thumbnail'
                                    size={12}
                                />
                            </div>
                        </div>
                        <div className='divider'/>
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
