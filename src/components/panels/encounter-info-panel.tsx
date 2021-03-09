import React from 'react';

import { Encounter, EncounterSlot } from '../../models/encounter';
import { Monster } from '../../models/monster';

import { RenderError } from '../error';

interface Props {
	encounter: Encounter;
	getMonster: (id: string) => Monster | null;
}

export class EncounterInfoPanel extends React.Component<Props> {
	private getMonsterName(id: string) {
		const monster = this.props.getMonster(id);
		if (monster) {
			return monster.name || 'unnamed monster';
		}

		return 'unknown monster';
	}

	private getSlot(slot: EncounterSlot) {
		return (
			<div key={slot.id} className='content-then-info'>
				<div className='content'>
					<div className='section'>{this.getMonsterName(slot.monsterID)}</div>
				</div>
				<div className='info'>
					x{slot.count}
				</div>
			</div>
		);
	}

	public render() {
		try {
			return (
				<div className='encounter-info-panel'>
					<div className='section subheading'>{this.props.encounter.name || 'unnamed encounter'}</div>
					{
						this.props.encounter.slots.map(slot => this.getSlot(slot))
					}
					{
						this.props.encounter.waves.map(wave => (
							<div key={wave.id}>
								<div className='section subheading'>{wave.name || 'unnamed wave'}</div>
								{
									wave.slots.map(waveSlot => this.getSlot(waveSlot))
								}
							</div>
						))
					}
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='EncounterInfoPanel' error={e} />;
		}
	}
}
