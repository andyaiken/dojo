import React from 'react';

import { Napoleon } from '../../utils/napoleon';

import { Encounter, EncounterSlot } from '../../models/encounter';
import { Monster } from '../../models/monster';

import { RenderError } from '../error';

interface Props {
	encounter: Encounter;
	getMonster: (id: string) => Monster | null;
	onMonsterClicked: (monster: Monster) => void;
}

export class EncounterInfoPanel extends React.Component<Props> {
	public static defaultProps = {
		onMonsterClicked: null
	};

	private monsterClicked(e: React.MouseEvent, monster: Monster | null) {
		if (!!this.props.onMonsterClicked && !!monster) {
			e.stopPropagation();
			this.props.onMonsterClicked(monster);
		}
	}

	private getSlot(slot: EncounterSlot) {
		let monsterName = 'unknown monster';

		const monster = Napoleon.slotToMonster(slot, id => this.props.getMonster(id));
		if (monster) {
			monsterName = monster.name || 'unnamed monster';
		}

		if (!!this.props.onMonsterClicked) {
			return (
				<div key={slot.id} className='content-then-info encounter-slot clickable' onClick={e => this.monsterClicked(e, monster)} role='button'>
					<div className='content'>
						<div className='section'>
							{monsterName}
						</div>
					</div>
					<div className='info'>
						x{slot.count}
					</div>
				</div>
			);
		}

		return (
			<div key={slot.id} className='content-then-info encounter-slot'>
				<div className='content'>
					<div className='section'>
						{monsterName}
					</div>
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
