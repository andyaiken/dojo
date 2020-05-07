import { Col, Row } from 'antd';
import React from 'react';

import Mercator from '../../utils/mercator';

import { Map } from '../../models/map';

import Checkbox from '../controls/checkbox';
import NumberSpin from '../controls/number-spin';
import MapPanel from '../panels/map-panel';
import Popout from '../panels/popout';

interface Props {
    map: Map;
}

interface State {
    mapSize: number;
    playerMapSize: number;
    playerViewOpen: boolean;
    fog: { x: number, y: number }[];
}

export default class MapDisplayModal extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            mapSize: 50,
            playerMapSize: 50,
            playerViewOpen: false,
            fog: []
        };
    }

    private nudgeMapSize(value: number) {
        this.setState({
            mapSize: Math.max(this.state.mapSize + value, 3)
        });
    }

    private nudgePlayerMapSize(value: number) {
        this.setState({
            playerMapSize: Math.max(this.state.playerMapSize + value, 3)
        });
    }

    private setPlayerViewOpen(open: boolean) {
        this.setState({
            playerViewOpen: open
        });
    }

    private toggleFog(x: number, y: number) {
        const index = this.state.fog.findIndex(i => (i.x === x) && (i.y === y));
        if (index === -1) {
            this.state.fog.push({ x: x, y: y });
        } else {
            this.state.fog.splice(index, 1);
        }
        this.setState({
            fog: this.state.fog
        });
    }

    private fillFog() {
        const fog: { x: number, y: number }[] = [];
        const dims = Mercator.mapDimensions(this.props.map);
        if (dims) {
            for (let x = dims.minX; x <= dims.maxX; ++x) {
                for (let y = dims.minY; y <= dims.maxY; ++y) {
                    fog.push({ x: x, y: y });
                }
            }
            this.setState({
                fog: fog
            });
        }
    }

    private clearFog() {
        this.setState({
            fog: []
        });
    }

    private getPlayerView() {
        if (this.state.playerViewOpen) {
            return (
                <Popout title='Map' closeWindow={() => this.setPlayerViewOpen(false)}>
                    <div className='scrollable both-ways'>
                        {this.getMap(true)}
                    </div>
                </Popout>
            );
        }

        return null;
    }

    private getMap(playerView: boolean) {
        const mode = playerView ? 'combat-player' : 'combat';
        const size = playerView ? this.state.playerMapSize : this.state.mapSize;

        return (
            <MapPanel
                map={this.props.map}
                mode={mode}
                size={size}
                fog={this.state.fog}
                editFog={!playerView}
                gridSquareEntered={() => null}
                gridSquareClicked={(x, y) => playerView ? null : this.toggleFog(x, y)}
            />
        );
    }

    public render() {
        try {
            return (
                <Row className='full-height'>
                    <Col span={6} className='scrollable sidebar sidebar-left'>
                        <div className='section'>
                            <div className='subheading'>options</div>
                            <NumberSpin
                                source={this.state}
                                name={'mapSize'}
                                display={() => 'zoom'}
                                nudgeValue={delta => this.nudgeMapSize(delta * 3)}
                            />
                            <button onClick={() => this.fillFog()}>
                                fill fog of war
                            </button>
                            <button className={this.state.fog.length === 0 ? 'disabled' : ''} onClick={() => this.clearFog()}>
                                clear fog of war
                            </button>
                        </div>
                        <div className='section'>
                            <div className='subheading'>player view</div>
                            <Checkbox
                                label='show player view'
                                checked={this.state.playerViewOpen}
                                changeValue={value => this.setPlayerViewOpen(value)}
                            />
                            <NumberSpin
                                source={this.state}
                                name={'playerMapSize'}
                                display={() => 'zoom'}
                                nudgeValue={delta => this.nudgePlayerMapSize(delta * 3)}
                            />
                        </div>
                    </Col>
                    <Col span={18} className='scrollable both-ways'>
                        {this.getMap(false)}
                    </Col>
                    {this.getPlayerView()}
                </Row>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}
