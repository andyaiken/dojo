import React from 'react';

import { Encounter } from '../../models/encounter';
import { Monster } from '../../models/monster';

import { RenderError } from '../error';
import { Group } from '../controls/group';
import { EncounterInfoPanel } from '../panels/encounter-info-panel';

interface Props {
	encounters: Encounter[];
	getMonster: (id: string) => Monster | null;
	onSelect: (encounter: Encounter) => void;
}

export class EncounterSelectionModal extends React.Component<Props> {
	public render() {
		try {
			return (
				<div className='scrollable'>
					<div className='section heading'>which encounter do you want to use?</div>
					<hr/>
					{
						this.props.encounters.map(encounter => (
							<Group key={encounter.id}>
								<EncounterInfoPanel encounter={encounter} getMonster={id => this.props.getMonster(id)} />
								<button onClick={() => this.props.onSelect(encounter)}>select this encounter</button>
							</Group>
						))
					}
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='EncounterSelectionModal' error={e} />;
		}
	}
}
