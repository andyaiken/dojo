import { CaretLeftOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import React from 'react';

import { Map } from '../../models/map';
import { Party } from '../../models/party';

import ConfirmButton from '../controls/confirm-button';
import Dropdown from '../controls/dropdown';
import Textbox from '../controls/textbox';
import GridPanel from '../panels/grid-panel';
import MapPanel from '../panels/map-panel';

interface Props {
	map: Map;
	parties: Party[];
	edit: (map: Map) => void;
	delete: (map: Map) => void;
	startExploration: (map: Map, partyID: string) => void;
	changeValue: (map: Map, field: string, value: string) => void;
	goBack: () => void;
}

export default class MapScreen extends React.Component<Props> {
	public render() {
		try {
			return (
				<Row className='full-height'>
					<Col xs={12} sm={12} md={8} lg={6} xl={4} className='scrollable sidebar sidebar-left'>
						<div className='section'>
							<div className='subheading'>map name</div>
							<Textbox
								text={this.props.map.name}
								placeholder='map name'
								onChange={value => this.props.changeValue(this.props.map, 'name', value)}
							/>
						</div>
						<hr/>
						<button onClick={() => this.props.edit(this.props.map)}>edit map</button>
						<Dropdown
							options={this.props.parties.map(p => ({ id: p.id, text: p.name }))}
							placeholder='start exploration with...'
							onSelect={id => this.props.startExploration(this.props.map, id)}
						/>
						<ConfirmButton text='delete map' onConfirm={() => this.props.delete(this.props.map)} />
						<hr />
						<div className='section'>
							<button onClick={() => this.props.goBack()}><CaretLeftOutlined style={{ fontSize: '10px' }} /> back to the list</button>
						</div>
					</Col>
					<Col xs={12} sm={12} md={16} lg={18} xl={20} className='scrollable both-ways'>
						<GridPanel
							heading={this.props.map.name}
							columns={1}
							content={[
								<MapPanel
									key={this.props.map.id}
									map={this.props.map}
									mode={'combat'}
								/>
							]}
						/>
					</Col>
				</Row>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}
