import React from 'react';

import { Map } from '../../models/map';
import { Party } from '../../models/party';

import { RenderError } from '../error';
import { Expander } from '../controls/expander';
import { MapOptions } from '../options/map-options';
import { MapPanel } from '../panels/map-panel';
import { SavedImage } from '../../models/misc';

interface Props {
	map: Map;
	parties: Party[];
	images: SavedImage[];
	openMap: (map: Map) => void;
	cloneMap: (map: Map, name: string) => void;
	startEncounter: (partyID: string, mapID: string) => void;
	startExploration: (partyID: string, mapID: string) => void;
	deleteMap: (map: Map) => void;
}

export class MapCard extends React.Component<Props> {
	public render() {
		try {
			return (
				<div key={this.props.map.id} className='card map'>
					<div className='heading'>
						<div className='title'>
							{this.props.map.name || 'unnamed map'}
						</div>
					</div>
					<div className='card-content'>
						<div className='fixed-height'>
							<MapPanel
								map={this.props.map}
								images={this.props.images}
							/>
						</div>
						<hr/>
						<button onClick={() => this.props.openMap(this.props.map)}>open map</button>
						<Expander text='more options'>
							<MapOptions
								map={this.props.map}
								parties={this.props.parties}
								cloneMap={(map, name) => this.props.cloneMap(map, name)}
								startEncounter={(partyID, mapID) => this.props.startEncounter(partyID, mapID)}
								startExploration={(partyID, mapID) => this.props.startExploration(partyID, mapID)}
								deleteMap={map => this.props.deleteMap(map)}
							/>
						</Expander>
					</div>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='MapCard' error={e} />;
		}
	}
}
