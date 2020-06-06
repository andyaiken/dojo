import React from 'react';

import { Encounter } from '../../models/encounter';
import { Party, PC } from '../../models/party';

import ConfirmButton from '../controls/confirm-button';
import Dropdown from '../controls/dropdown';
import PortraitPanel from '../panels/portrait-panel';

interface Props {
	party: Party;
	encounters: Encounter[];
	open: (party: Party) => void;
	delete: (party: Party) => void;
	runEncounter: (party: Party, encounterID: string) => void;
	openStatBlock: (pc: PC) => void;
}

export default class PartyCard extends React.Component<Props> {
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
			<div key={pc.id} className={pc.active ? 'combatant-row' : 'combatant-row inactive'} onClick={() => this.props.openStatBlock(pc)}>
				<PortraitPanel source={pc} inline={true}/>
				<div className='name'>{this.getText(pc)}</div>
				<div className='value'>lvl {pc.level}</div>
			</div>
		));
	}

	public render() {
		try {
			let run = null;
			if (this.props.encounters.length > 0) {
				const options = this.props.encounters.map(enc => {
					return {
						id: enc.id,
						text: enc.name
					};
				});
				run = (
					<Dropdown
						options={options}
						placeholder='start combat...'
						onSelect={encounterID => this.props.runEncounter(this.props.party, encounterID)}
					/>
				);
			}

			return (
				<div className='card pc'>
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
						<button onClick={() => this.props.open(this.props.party)}>open party</button>
						{run}
						<ConfirmButton text='delete party' onConfirm={() => this.props.delete(this.props.party)} />
					</div>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
