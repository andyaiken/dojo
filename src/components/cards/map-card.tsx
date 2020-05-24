import { Col, Row } from 'antd';
import React from 'react';

import { Map } from '../../models/map';

import ConfirmButton from '../controls/confirm-button';
import MapPanel from '../panels/map-panel';

interface Props {
	map: Map;
	viewMap: (map: Map) => void;
	editMap: (map: Map) => void;
	removeMap: (map: Map) => void;
}

export default class MapCard extends React.Component<Props> {
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
						<hr/>
						<button onClick={() => this.props.viewMap(this.props.map)}>view map</button>
						<button onClick={() => this.props.editMap(this.props.map)}>edit map</button>
						<ConfirmButton text='delete map' onConfirm={() => this.props.removeMap(this.props.map)} />
					</div>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
