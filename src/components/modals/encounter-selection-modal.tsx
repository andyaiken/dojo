import React from 'react';

import { Napoleon } from '../../utils/napoleon';

import { Encounter } from '../../models/encounter';
import { Monster } from '../../models/monster';
import { Party } from '../../models/party';

import { RenderError } from '../error';
import { Group } from '../controls/group';
import { EncounterInfoPanel } from '../panels/encounter-info-panel';

interface Props {
	encounters: Encounter[];
	party: Party | null;
	getMonster: (id: string) => Monster | null;
	onSelect: (encounter: Encounter) => void;
}

export class EncounterSelectionModal extends React.Component<Props> {
	private getEncounters() {
		const encounters: JSX.Element[] = [];

		this.props.encounters.forEach(encounter => {
			let diff = null;
			if (this.props.party) {
				const d = Napoleon.getEncounterDifficulty(encounter, null, this.props.party, this.props.getMonster);
				diff = 'diff-' + d.adjusted;
			}

			encounters.push(
				<Group key={encounter.id} className={diff} onClick={() => this.props.onSelect(encounter)}>
					<EncounterInfoPanel encounter={encounter} getMonster={id => this.props.getMonster(id)} />
				</Group>
			);
		});

		return encounters;
	}

	public render() {
		try {
			return (
				<div className='scrollable'>
					<div className='section heading'>which encounter do you want to use?</div>
					{this.getEncounters()}
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='EncounterSelectionModal' error={e} />;
		}
	}
}
