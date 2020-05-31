import React from 'react';

import Napoleon from '../../utils/napoleon';

import { Encounter, EncounterSlot } from '../../models/encounter';
import { Monster } from '../../models/monster-group';
import { Party } from '../../models/party';

import ConfirmButton from '../controls/confirm-button';
import Dropdown from '../controls/dropdown';
import PortraitPanel from '../panels/portrait-panel';

interface Props {
	encounter: Encounter;
	parties: Party[];
	view: (encounter: Encounter) => void;
	edit: (encounter: Encounter) => void;
	delete: (encounter: Encounter) => void;
	run: (encounter: Encounter, partyID: string) => void;
	openStatBlock: (slot: EncounterSlot) => void;
	getMonster: (monsterName: string, groupName: string) => Monster | null;
}

export default class EncounterCard extends React.Component<Props> {
	private getText(slot: EncounterSlot) {
		return <div className='name'>{slot.monsterName || 'unnamed monster'}</div>;
	}

	private getValue(slot: EncounterSlot) {
		if (slot.count > 1) {
			return <div className='value'>x{slot.count}</div>;
		}
		return null;
	}

	private getPortrait(slot: EncounterSlot) {
		const monster = this.props.getMonster(slot.monsterName, slot.monsterGroupName);
		if (monster && monster.portrait) {
			return <PortraitPanel source={monster} inline={true} />;
		}

		return null;
	}

	public render() {
		try {
			const slots = this.props.encounter.slots.map(slot => (
				<div key={slot.id} className='combatant-row' onClick={() => this.props.openStatBlock(slot)}>
					{this.getPortrait(slot)}
					{this.getText(slot)}
					{this.getValue(slot)}
				</div>
			));
			if (slots.length === 0) {
				slots.push(<div key='empty' className='section'>no monsters</div>);
			}

			this.props.encounter.waves.forEach(wave => {
				slots.push(<div key={'name ' + wave.id} className='section subheading'>{wave.name || 'unnamed wave'}</div>);
				wave.slots.forEach(slot => {
					slots.push(
						<div key={slot.id} className='combatant-row' onClick={() => this.props.openStatBlock(slot)}>
							{this.getPortrait(slot)}
							{this.getValue(slot)}
						</div>
					);
				});
				if (slots.length === 0) {
					slots.push(<div key={'empty ' + wave.id} className='section'>no monsters</div>);
				}
			});

			let run = null;
			if (this.props.parties.length > 0) {
				const options = this.props.parties.map(p => {
					return {
						id: p.id,
						text: p.name
					};
				});
				run = (
					<Dropdown
						options={options}
						placeholder='start encounter with...'
						onSelect={partyID => this.props.run(this.props.encounter, partyID)}
					/>
				);
			}

			return (
				<div className='card encounter'>
					<div className='heading'>
						<div className='title'>
							{this.props.encounter.name || 'unnamed encounter'}
						</div>
					</div>
					<div className='card-content'>
						<div className='fixed-height'>
							<div className='subheading'>monsters</div>
							{slots}
							<div className='subheading'>xp</div>
							{Napoleon.getEncounterXP(this.props.encounter, this.props.getMonster)}
						</div>
						<hr/>
						<button onClick={() => this.props.view(this.props.encounter)}>open encounter</button>
						{run}
						<button onClick={() => this.props.edit(this.props.encounter)}>edit encounter</button>
						<ConfirmButton text='delete encounter' onConfirm={() => this.props.delete(this.props.encounter)} />
					</div>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
