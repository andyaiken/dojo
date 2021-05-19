import React from 'react';

import { Frankenstein } from '../../utils/frankenstein';

import { Encounter, EncounterSlot } from '../../models/encounter';
import { Monster } from '../../models/monster';

import { RenderError } from '../error';
import { Group } from '../controls/group';
import { Note } from '../controls/note';

interface Props {
	encounter: Encounter;
	getMonster: (id: string) => Monster | null;
}

export class MinisChecklistModal extends React.Component<Props> {
	public render() {
		try {
			const slots: EncounterSlot[] = [];
			this.props.encounter.slots.forEach(slot => slots.push(slot));
			this.props.encounter.waves.forEach(wave => {
				wave.slots.forEach(slot => {
					const existing = slots.find(s => (s.monsterID === slot.monsterID) && (s.monsterThemeID === slot.monsterThemeID));
					if (existing) {
						existing.count += slot.count;
					} else {
						slots.push(slot);
					}
				});
			});

			const minis = slots.map(slot => {
				let monster = this.props.getMonster(slot.monsterID);
				if (monster) {
					if (slot.monsterThemeID) {
						const theme = this.props.getMonster(slot.monsterThemeID);
						if (theme) {
							monster = Frankenstein.applyTheme(monster, theme);
						}
					}
					if (slot.deltaCR) {
						monster = Frankenstein.adjustCR(monster, slot.deltaCR)
					}

					let type = monster.size + ' ' + monster.category;
					if (monster.tag) {
						type += ' (' + monster.tag + ')';
					}

					return (
						<Group key={slot.id}>
							<div className='heading'>{monster.name || 'unnamed monster'}</div>
							<div className='content-then-info'>
								<div className='content'>
									<div className='section'><b>type</b> {type.toLowerCase()}</div>
									<div className='section'><b>features</b> {monster.traits.map(t => t.name || 'unnamed feature').sort().join(', ').toLowerCase()}</div>
								</div>
								<div className='info'>
									<div className='subheading'>x {slot.count}</div>
								</div>
							</div>
						</Group>
					);
				}

				return null;
			});

			return (
				<div className='scrollable padded'>
					<Note>
						<div className='section'>use this list to help select the miniatures you&apos;ll need to run this encounter</div>
					</Note>
					{minis}
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='MinisChecklistModal' error={e} />;
		}
	}
}
