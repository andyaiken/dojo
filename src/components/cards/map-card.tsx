import React from 'react';

import { Map } from '../../models/map';
import { Party } from '../../models/party';

import { Expander } from '../controls/expander';
import { MapOptions } from '../options/map-options';
import { MapPanel } from '../panels/map-panel';

interface Props {
	map: Map;
	parties: Party[];
	viewMap: (map: Map) => void;
	editMap: (map: Map) => void;
	cloneMap: (map: Map, name: string) => void;
	runEncounter: (partyID: string, mapID: string) => void;
	explore: (partyID: string, mapID: string) => void;
	removeMap: (map: Map) => void;
}

export class MapCard extends React.Component<Props> {
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
						<div className='fixed-height'>
							<MapPanel
								map={this.props.map}
								showAreaNames={true}
							/>
						</div>
						<hr/>
						<button onClick={() => this.props.viewMap(this.props.map)}>open map</button>
						<Expander text='more options'>
							<MapOptions
								map={this.props.map}
								parties={this.props.parties}
								edit={map => this.props.editMap(map)}
								clone={(map, name) => this.props.cloneMap(map, name)}
								startCombat={(partyID, mapID) => this.props.runEncounter(partyID, mapID)}
								startExploration={(partyID, mapID) => this.props.explore(partyID, mapID)}
								delete={map => this.props.removeMap(map)}
							/>
						</Expander>
					</div>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
