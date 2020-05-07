import { Col, Row } from 'antd';
import React from 'react';

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
}

export default class MapDisplayModal extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            mapSize: 50,
            playerMapSize: 50,
            playerViewOpen: false
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
                combatants={[]}
            />
        );
    }

    public render() {
        try {
            return (
                <Row className='full-height'>
                    <Col span={8} className='scrollable sidebar sidebar-left'>
                        <div className='subheading'>options</div>
                        <NumberSpin
                            source={this.state}
                            name={'mapSize'}
                            display={() => 'zoom'}
                            nudgeValue={delta => this.nudgeMapSize(delta * 3)}
                        />
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
                    </Col>
                    <Col span={16} className='scrollable both-ways'>
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
