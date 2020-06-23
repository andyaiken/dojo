import { Col, Row } from 'antd';
import React from 'react';

import Utils from '../../utils/utils';

import { Exploration, Map } from '../../models/map';
import { Party } from '../../models/party';

import ExplorationCard from '../cards/exploration-card';
import MapCard from '../cards/map-card';
import Expander from '../controls/expander';
import GridPanel from '../panels/grid-panel';
import Note from '../panels/note';

interface Props {
	maps: Map[];
	parties: Party[];
	explorations: Exploration[];
	addMap: () => void;
	importMap: () => void;
	generateMap: (type: string) => void;
	viewMap: (map: Map) => void;
	editMap: (map: Map) => void;
	deleteMap: (map: Map) => void;
	explore: (map: Map, partyID: string) => void;
	resumeExploration: (exploration: Exploration) => void;
	deleteExploration: (exploration: Exploration) => void;
}

export default class MapListScreen extends React.Component<Props> {
	public render() {
		try {
			const explorations = this.props.explorations;
			Utils.sort(explorations);
			const explorationItems = explorations.map(exploration => (
				<ExplorationCard
					key={exploration.id}
					exploration={exploration}
					resume={ex => this.props.resumeExploration(ex)}
					delete={ex => this.props.deleteExploration(ex)}
				/>
			));

			const maps = this.props.maps;
			Utils.sort(maps);
			const mapItems = maps.map(map => (
				<MapCard
					key={map.id}
					map={map}
					parties={this.props.parties}
					viewMap={m => this.props.viewMap(m)}
					editMap={m => this.props.editMap(m)}
					removeMap={m => this.props.deleteMap(m)}
					explore={(m, partyID) => this.props.explore(m, partyID)}
				/>
			));

			return (
				<Row className='full-height'>
					<Col xs={12} sm={12} md={8} lg={6} xl={4} className='scrollable sidebar sidebar-left'>
						<Note>
							<div className='section'>on this page you can set up tactical maps</div>
							<div className='section'>when you have created a map you can explore it with a party of pcs, or use it in the combat manager</div>
							<hr/>
							<div className='section'>on the right you will see a list of maps</div>
							<hr/>
							<div className='section'>to design a new map, press the <b>create a new map</b> button</div>
						</Note>
						<button onClick={() => this.props.addMap()}>create a new map</button>
						<button onClick={() => this.props.importMap()}>import a map image</button>
						<Expander text='create a random map'>
							<button onClick={() => this.props.generateMap('dungeon')}>create a new dungeon map</button>
							<button onClick={() => this.props.generateMap('delve')}>create a new delve map</button>
						</Expander>
					</Col>
					<Col xs={12} sm={12} md={16} lg={18} xl={20} className='scrollable'>
						<GridPanel heading='in progress' content={explorationItems} />
						<GridPanel heading='maps' content={mapItems} />
					</Col>
				</Row>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
