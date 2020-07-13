import { CaretLeftOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import React from 'react';

import { Map } from '../../models/map';
import { Party } from '../../models/party';

import ConfirmButton from '../controls/confirm-button';
import Dropdown from '../controls/dropdown';
import Textbox from '../controls/textbox';
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

interface State {
	selectedAreaID: string | null;
}

export default class MapScreen extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			selectedAreaID: null
		};
	}

	private setSelectedAreaID(id: string | null) {
		this.setState({
			selectedAreaID: id
		});
	}

	public render() {
		try {
			let viewport = null;
			if (this.state.selectedAreaID) {
				const area = this.props.map.areas.find(a => a.id === this.state.selectedAreaID);
				if (area) {
					viewport = {
						minX: area.x,
						minY: area.y,
						maxX: area.x + area.width - 1,
						maxY: area.y + area.height - 1
					};
				}
			}

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
						<MapPanel
							map={this.props.map}
							mode={'combat'}
							viewport={viewport}
							areaSelected={id => this.setSelectedAreaID(id)}
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
