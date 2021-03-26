import React from 'react';

import { Encounter } from '../../models/encounter';
import { Map } from '../../models/map';
import { Party, PC } from '../../models/party';

import { RenderError } from '../error';
import { Expander } from '../controls/expander';
import { PartyOptions } from '../options/party-options';
import { PortraitPanel } from '../panels/portrait-panel';
import { Group } from '../controls/group';

interface Props {
	party: Party;
	encounters: Encounter[];
	maps: Map[];
	openParty: (party: Party) => void;
	addPC: () => void;
	importPC: () => void;
	createEncounter: (partyID: string) => void;
	startEncounter: (partyID: string, encounterID: string) => void;
	startExploration: (partyID: string, mapID: string) => void;
	setLevel: (party: Party, level: number) => void;
	showReference: (party: Party) => void;
	openStatBlock: (pc: PC) => void;
	deleteParty: (party: Party) => void;
}

export class PartyCard extends React.Component<Props> {
	private getText(pc: PC) {
		let name = pc.name || 'unnamed pc';
		if (pc.player) {
			name += ' (' + pc.player + ')';
		}
		return name;
	}

	private getPCs() {
		if (this.props.party.pcs.length === 0) {
			return (
				<div className='section'>no pcs</div>
			);
		}

		return this.props.party.pcs.map(pc => (
			<Group key={pc.id} transparent={true} onClick={() => this.props.openStatBlock(pc)}>
				<div className='content-then-info'>
					<div className={pc.active ? 'content' : 'content strikethrough'}>
						<PortraitPanel source={pc} inline={true}/>
						{this.getText(pc)}
					</div>
					<div className='info'>
						lvl {pc.level}
					</div>
				</div>
			</Group>
		));
	}

	public render() {
		try {
			return (
				<div key={this.props.party.id} className='card pc'>
					<div className='heading'>
						<div className='title'>
							{this.props.party.name || 'unnamed party'}
						</div>
					</div>
					<div className='card-content'>
						<div className='fixed-height'>
							{this.getPCs()}
						</div>
						<hr/>
						<button onClick={() => this.props.openParty(this.props.party)}>open party</button>
						<Expander text='more options'>
							<PartyOptions
								party={this.props.party}
								encounters={this.props.encounters}
								maps={this.props.maps}
								addPC={() => this.props.addPC()}
								importPC={() => this.props.importPC()}
								createEncounter={partyID => this.props.createEncounter(partyID)}
								startEncounter={(partyID, encounterID) => this.props.startEncounter(partyID, encounterID)}
								startExploration={(partyID, mapID) => this.props.startExploration(partyID, mapID)}
								setLevel={(party, level) => this.props.setLevel(party, level)}
								showReference={party => this.props.showReference(party)}
								deleteParty={party => this.props.deleteParty(party)}
							/>
						</Expander>
					</div>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='PartyCard' error={e} />;
		}
	}
}
