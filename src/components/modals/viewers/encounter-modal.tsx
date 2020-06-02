import React from 'react';
import Showdown from 'showdown';

import { Encounter, EncounterSlot } from '../../../models/encounter';
import { Monster } from '../../../models/monster-group';

import MonsterCard from '../../cards/monster-card';
import Expander from '../../controls/expander';

const showdown = new Showdown.Converter();
showdown.setOption('tables', true);

interface Props {
	encounter: Encounter;
	getMonster: (monsterName: string, groupName: string) => Monster | null;
}

export default class EncounterModal extends React.Component<Props> {
	private getSlots(id: string, name: string, slots: EncounterSlot[]) {
		return (
			<div key={id}>
				<div className='heading'>{name}</div>
				{slots.map(s => {
					const monsterName = s.monsterName + ((s.count > 1) ? (' (x' + s.count + ')') : '');
					const monster = this.props.getMonster(s.monsterName, s.monsterGroupName);
					if (monster) {
						return (
							<Expander key={s.id} text={monsterName}>
								<MonsterCard monster={monster}/>
							</Expander>
						);
					}

					return null;
				})}
			</div>
		);
	}

	public render() {
		try {
			const enc = this.getSlots(this.props.encounter.id, 'monsters', this.props.encounter.slots);
			const waves = this.props.encounter.waves.map(wave => this.getSlots(wave.id, wave.name, wave.slots));

			return (
				<div className='scrollable'>
					<div dangerouslySetInnerHTML={{ __html: showdown.makeHtml(this.props.encounter.notes) }} />
					{enc}
					{waves}
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}
