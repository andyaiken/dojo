import React from 'react';

import { Utils } from '../../utils/utils';

import { Encounter } from '../../models/encounter';
import { Map } from '../../models/map';
import { Party } from '../../models/party';

import { RenderError } from '../error';
import { ConfirmButton } from '../controls/confirm-button';
import { Dropdown } from '../controls/dropdown';

interface Props {
	party: Party;
	encounters: Encounter[];
	maps: Map[];
	addPC: () => void;
	importPC: () => void;
	createEncounter: (partyID: string) => void;
	startEncounter: (partyID: string, encounterID: string) => void;
	startExploration: (partyID: string, mapID: string) => void;
	setLevel: (party: Party, level: number) => void;
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
			const pcs = this.props.party.pcs.filter(pc => pc.active);

			let run = null;
			if (this.props.encounters.length === 1) {
				run = (
					<button onClick={() => this.props.startEncounter(this.props.party.id, this.props.encounters[0].id)}>
						start combat
					</button>
				);
			}
			if (this.props.encounters.length > 1) {
				run = (
					<Dropdown
						options={this.props.encounters.map(enc => ({ id: enc.id, text: enc.name || 'unnamed encounter' }))}
						placeholder='start combat...'
						onSelect={encounterID => this.props.startEncounter(this.props.party.id, encounterID)}
					/>
				);
			}

			let explore = null;
			if (this.props.maps.length === 1) {
				explore = (
					<button onClick={() => this.props.startExploration(this.props.party.id, this.props.maps[0].id)}>
						start exploration
					</button>
				);
			}
			if (this.props.maps.length > 1) {
				explore = (
					<Dropdown
						options={this.props.maps.map(m => ({ id: m.id, text: m.name || 'unnamed map' }))}
						placeholder='start exploration...'
						onSelect={mapID => this.props.startExploration(this.props.party.id, mapID)}
					/>
				);
			}

			let create = null;
			if (this.props.party.pcs.length > 0) {
				create = (
					<button onClick={() => this.props.createEncounter(this.props.party.id)}>create a random encounter</button>
				);
			}

			let levelUp = null;
			if (this.props.party.pcs.length > 0) {
				const level = Math.round(pcs.reduce((sum, pc) => sum + pc.level, 0) / pcs.length);
				levelUp = (
					<button onClick={() => this.props.setLevel(this.props.party, level + 1)}>level up to {level + 1}</button>
				);
			}

			return (
				<div>
					<button onClick={() => this.props.addPC()}>add a new pc</button>
					<button onClick={() => this.props.importPC()}>import a pc</button>
					<button onClick={() => this.export()}>export party</button>
					{run}
					{explore}
					{create}
					{levelUp}
					<button onClick={() => this.props.showReference(this.props.party)}>show party reference</button>
					<ConfirmButton onConfirm={() => this.props.deleteParty(this.props.party)}>delete party</ConfirmButton>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='PartyOptions' error={e} />;
		}
	}
}
