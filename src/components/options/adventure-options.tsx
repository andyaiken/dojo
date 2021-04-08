import React from 'react';

import { Adventure } from '../../models/adventure';
import { Map } from '../../models/map';
import { Party } from '../../models/party';

import { ConfirmButton } from '../controls/confirm-button';
import { Dropdown } from '../controls/dropdown';

interface Props {
	adventure: Adventure;
	parties: Party[];
	exploreMap: (map: Map, partyID: string) => void;
	deleteAdventure: (adventure: Adventure) => void;
}

export class AdventureOptions extends React.Component<Props> {
	public render() {
		let explore = null;
		if (this.props.parties.length === 1) {
			explore = (
				<button onClick={() => this.props.exploreMap(this.props.adventure.plot.map as Map, this.props.parties[0].id)}>explore the map</button>
			)
		}
		if (this.props.parties.length > 1) {
			explore = (
				<Dropdown
					placeholder='explore the map with...'
					options={this.props.parties.map(p => ({ id: p.id, text: p.name || 'unnamed party' }))}
					onSelect={id => this.props.exploreMap(this.props.adventure.plot.map as Map, id)}
				/>
			);
		}

		return (
			<div>
				{explore}
				<ConfirmButton onConfirm={() => this.props.deleteAdventure(this.props.adventure)}>delete adventure</ConfirmButton>
			</div>
		);
	}
}
