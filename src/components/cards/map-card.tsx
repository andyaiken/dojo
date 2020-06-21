import { Col, Row } from 'antd';
import React from 'react';

import { Map } from '../../models/map';
import { Party } from '../../models/party';

import ConfirmButton from '../controls/confirm-button';
import Dropdown from '../controls/dropdown';
import MapPanel from '../panels/map-panel';

interface Props {
	map: Map;
	parties: Party[];
	viewMap: (map: Map) => void;
	editMap: (map: Map) => void;
	removeMap: (map: Map) => void;
	explore: (map: Map, partyID: string) => void;
}

export default class MapCard extends React.Component<Props> {
	public render() {
		try {
			let explore = null;
			if (this.props.parties.length > 0) {
				const options = this.props.parties.map(p => {
					return {
						id: p.id,
						text: p.name
					};
				});
				explore = (
					<Dropdown
						options={options}
						placeholder='start exploration with...'
						onSelect={partyID => this.props.explore(this.props.map, partyID)}
					/>
				);
			}

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
								/>
							</Col>
						</Row>
						<hr/>
						<button onClick={() => this.props.viewMap(this.props.map)}>open map</button>
						<button onClick={() => this.props.editMap(this.props.map)}>edit map</button>
						{explore}
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
