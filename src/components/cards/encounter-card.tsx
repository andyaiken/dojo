import React from 'react';

import { Napoleon } from '../../utils/napoleon';

import { Encounter, EncounterSlot } from '../../models/encounter';
import { Monster } from '../../models/monster';
import { Party } from '../../models/party';

import { Expander } from '../controls/expander';
import { EncounterOptions } from '../options/encounter-options';
import { PortraitPanel } from '../panels/portrait-panel';

interface Props {
	encounter: Encounter;
	parties: Party[];
	view: (encounter: Encounter) => void;
	edit: (encounter: Encounter) => void;
	clone: (encounter: Encounter, name: string) => void;
	run: (partyID: string, encounterID: string) => void;
	delete: (encounter: Encounter) => void;
	openStatBlock: (slot: EncounterSlot) => void;
	getMonster: (id: string) => Monster | null;
}

interface State {
	cloneName: string;
}

export class EncounterCard extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			cloneName: props.encounter.name + ' copy'
		};
	}

	private setCloneName(cloneName: string) {
		this.setState({
			cloneName: cloneName
		});
	}

	private getText(slot: EncounterSlot) {
		const name = slot.monsterName || slot.roles.join(', ') || 'unnamed monster';
		return <div className='name'>{name}</div>;
	}

	private getValue(slot: EncounterSlot) {
		let str = '';
		if (slot.count > 1) {
			if (str) {
				str += ' ';
			}
			str += 'x' + slot.count;
		}
		if (slot.faction !== 'foe') {
			if (str) {
				str += ' ';
			}
			str += '(' + slot.faction + ')';
		}
		if (str) {
			return <div className='value'>{str}</div>;
		}
		return null;
	}

	private getPortrait(slot: EncounterSlot) {
		const monster = this.props.getMonster(slot.monsterID);
		if (monster && monster.portrait) {
			return <PortraitPanel source={monster} inline={true} />;
		}

		return null;
	}

	public render() {
		try {
			const slots = this.props.encounter.slots.map(slot => (
				<div key={slot.id} className='combatant-row' onClick={() => this.props.openStatBlock(slot)} role='button'>
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
						<div key={slot.id} className='combatant-row' onClick={() => this.props.openStatBlock(slot)} role='button'>
							{this.getPortrait(slot)}
							{this.getText(slot)}
							{this.getValue(slot)}
						</div>
					);
				});
				if (slots.length === 0) {
					slots.push(<div key={'empty ' + wave.id} className='section'>no monsters</div>);
				}
			});

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
							{Napoleon.getEncounterXP(this.props.encounter, null, this.props.getMonster)}
						</div>
						<hr/>
						<button onClick={() => this.props.view(this.props.encounter)}>open encounter</button>
						<Expander text='more options'>
							<EncounterOptions
								encounter={this.props.encounter}
								parties={this.props.parties}
								edit={encounter => this.props.edit(encounter)}
								clone={(encounter, name) => this.props.clone(encounter, name)}
								run={(partyID, encounterID) => this.props.run(partyID, encounterID)}
								delete={encounter => this.props.delete(encounter)}
							/>
						</Expander>
					</div>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
