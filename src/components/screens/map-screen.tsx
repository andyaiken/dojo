import { CaretLeftOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import React from 'react';

import { Map } from '../../models/map';
import { Party } from '../../models/party';

import { Textbox } from '../controls/textbox';
import { MapOptions } from '../options/map-options';
import { MapPanel } from '../panels/map-panel';

interface Props {
	map: Map;
	parties: Party[];
	editMap: (map: Map) => void;
	cloneMap: (map: Map, name: string) => void;
	deleteMap: (map: Map) => void;
	startEncounter: (partyID: string, mapID: string) => void;
	startExploration: (partyID: string, mapID: string) => void;
	changeValue: (map: Map, field: string, value: string) => void;
	goBack: () => void;
}

interface State {
	selectedAreaID: string | null;
}

export class MapScreen extends React.Component<Props, State> {
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
					<Col span={6} className='scrollable sidebar sidebar-left'>
						<div className='section'>
							<div className='subheading'>map name</div>
							<Textbox
								text={this.props.map.name}
								placeholder='map name'
								onChange={value => this.props.changeValue(this.props.map, 'name', value)}
							/>
						</div>
						<hr/>
						<MapOptions
							map={this.props.map}
							parties={this.props.parties}
							editMap={map => this.props.editMap(map)}
							cloneMap={(map, name) => this.props.cloneMap(map, name)}
							startEncounter={(partyID, mapID) => this.props.startEncounter(partyID, mapID)}
							startExploration={(partyID, mapID) => this.props.startExploration(partyID, mapID)}
							deleteMap={map => this.props.deleteMap(map)}
						/>
						<hr />
						<button onClick={() => this.props.goBack()}><CaretLeftOutlined style={{ fontSize: '10px' }} /> back to the list</button>
					</Col>
					<Col span={18} className='scrollable both-ways'>
						<MapPanel
							map={this.props.map}
							mode={'combat'}
							viewport={viewport}
							showAreaNames={true}
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
