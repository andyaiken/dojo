import React from 'react';

import { Utils } from '../../utils/utils';

import { ConfirmButton } from '../controls/confirm-button';
import { Dropdown } from '../controls/dropdown';

import { Encounter } from '../../models/encounter';
import { Map } from '../../models/map';
import { Party } from '../../models/party';

interface Props {
	party: Party;
	encounters: Encounter[];
	maps: Map[];
	addPC: () => void;
	importPC: () => void;
	startEncounter: (partyID: string, encounterID: string) => void;
	startExploration: (paryID: string, mapID: string) => void;
	showReference: (party: Party) => void;
	deleteParty: (party: Party) => void;
}

export class PartyOptions extends React.Component<Props> {
	private export() {
		const filename = this.props.party.name + '.party';
		Utils.saveFile(filename, this.props.party);
	}

	public render() {
		try {
			let run = null;
			if (this.props.encounters.length > 0) {
				run = (
					<Dropdown
						options={this.props.encounters.map(p => ({ id: p.id, text: p.name }))}
						placeholder='start combat...'
						onSelect={encounterID => this.props.startEncounter(this.props.party.id, encounterID)}
					/>
				);
			}

			let explore = null;
			if (this.props.maps.length > 0) {
				explore = (
					<Dropdown
						options={this.props.maps.map(m => ({ id: m.id, text: m.name }))}
						placeholder='start exploration...'
						onSelect={mapID => this.props.startExploration(this.props.party.id, mapID)}
					/>
				);
			}

			return (
				<div>
					<button onClick={() => this.props.addPC()}>add a new pc</button>
					<button onClick={() => this.props.importPC()}>import a pc</button>
					<button onClick={() => this.export()}>export party</button>
					{run}
					{explore}
					<button onClick={() => this.props.showReference(this.props.party)}>show party reference</button>
					<ConfirmButton text='delete party' onConfirm={() => this.props.deleteParty(this.props.party)} />
				</div>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
