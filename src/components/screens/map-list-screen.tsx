import { Col, Row } from 'antd';
import React from 'react';

import { Utils } from '../../utils/utils';

import { Exploration, Map } from '../../models/map';
import { Party } from '../../models/party';

import { RenderError } from '../error';
import { ExplorationCard } from '../cards/exploration-card';
import { MapCard } from '../cards/map-card';
import { Note } from '../controls/note';
import { MapListOptions } from '../options/map-list-options';
import { GridPanel } from '../panels/grid-panel';

interface Props {
	maps: Map[];
	parties: Party[];
	explorations: Exploration[];
	addMap: () => void;
	importMap: () => void;
	generateMap: (type: string) => void;
	openMap: (map: Map) => void;
	cloneMap: (map: Map, name: string) => void;
	deleteMap: (map: Map) => void;
	startEncounter: (partyID: string, mapID: string) => void;
	startExploration: (partyID: string, mapID: string) => void;
	resumeExploration: (exploration: Exploration) => void;
	deleteExploration: (exploration: Exploration) => void;
}

export class MapListScreen extends React.Component<Props> {
	public render() {
		try {
			const explorations = this.props.explorations;
			Utils.sort(explorations);
			const explorationItems = explorations.map(exploration => (
				<ExplorationCard
					key={exploration.id}
					exploration={exploration}
					resumeExploration={ex => this.props.resumeExploration(ex)}
					deleteExploration={ex => this.props.deleteExploration(ex)}
				/>
			));

			const maps = this.props.maps;
			Utils.sort(maps);
			const mapItems = maps.map(map => (
				<MapCard
					key={map.id}
					map={map}
					parties={this.props.parties}
					openMap={m => this.props.openMap(m)}
					cloneMap={(m, name) => this.props.cloneMap(m, name)}
					deleteMap={m => this.props.deleteMap(m)}
					startEncounter={(partyID, encounterID) => this.props.startEncounter(partyID, encounterID)}
					startExploration={(m, partyID) => this.props.startExploration(m, partyID)}
				/>
			));

			return (
				<Row className='full-height'>
					<Col span={6} className='scrollable sidebar sidebar-left'>
						<Note>
							<div className='section'>on this page you can set up tactical maps</div>
							<div className='section'>when you have created a map you can explore it with a party of pcs, or use it in the combat manager</div>
							<hr/>
							<div className='section'>on the right you will see the maps you have created</div>
							<hr/>
							<div className='section'>to design a new map, press the <b>add a new map</b> button</div>
						</Note>
						<MapListOptions
							addMap={() => this.props.addMap()}
							importMap={() => this.props.importMap()}
							generateMap={type => this.props.generateMap(type)}
						/>
					</Col>
					<Col span={18} className='scrollable'>
						<GridPanel heading='in progress' content={explorationItems} />
						<GridPanel heading='maps' content={mapItems} />
					</Col>
				</Row>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='MapListScreen' error={e} />;
		}
	}
}
