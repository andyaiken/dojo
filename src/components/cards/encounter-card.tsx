import React from 'react';
import ReactMarkdown from 'react-markdown';

import { Napoleon } from '../../utils/napoleon';

import { Adventure } from '../../models/adventure';
import { Encounter, EncounterSlot } from '../../models/encounter';
import { Monster } from '../../models/monster';
import { Party } from '../../models/party';

import { RenderError } from '../error';
import { Conditional } from '../controls/conditional';
import { Expander } from '../controls/expander';
import { EncounterOptions } from '../options/encounter-options';
import { PortraitPanel } from '../panels/portrait-panel';
import { Group } from '../controls/group';

interface Props {
	encounter: Encounter;
	parties: Party[];
	adventures: Adventure[];
	openEncounter: (encounter: Encounter) => void;
	cloneEncounter: (encounter: Encounter, name: string) => void;
	startEncounter: (partyID: string, encounterID: string) => void;
	deleteEncounter: (encounter: Encounter) => void;
	openStatBlock: (slot: EncounterSlot) => void;
	getMonster: (id: string) => Monster | null;
}

export class EncounterCard extends React.Component<Props> {
	private getText(slot: EncounterSlot) {
		let name = '';

		if (slot.monsterID !== '') {
			const monster = this.props.getMonster(slot.monsterID);
			if (monster && monster.name) {
				name = monster.name;
				const theme = this.props.getMonster(slot.monsterThemeID);
				if (theme && theme.name) {
					name += ' ' + theme.name;
				}
			}
			name = name || 'unnamed monster';
		} else {
			name = slot.roles.join(', ');
		}

		return name;
	}

	private getPortrait(slot: EncounterSlot) {
		const monster = this.props.getMonster(slot.monsterID);
		if (monster && monster.portrait) {
			return <PortraitPanel source={monster} inline={true} />;
		}

		return null;
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

		return !!str ? str : null;
	}

	public render() {
		try {
			const slots = this.props.encounter.slots.map(slot => (
				<Group key={slot.id} transparent={true} onClick={() => this.props.openStatBlock(slot)}>
					<div className='content-then-info'>
						<div className='content'>
							{this.getPortrait(slot)}
							{this.getText(slot)}
						</div>
						<div className='info'>
							{this.getValue(slot)}
						</div>
					</div>
				</Group>
			));
			if (slots.length === 0) {
				slots.push(<div key='empty' className='section'>no monsters</div>);
			}

			this.props.encounter.waves.forEach(wave => {
				slots.push(<div key={'name ' + wave.id} className='section subheading'>{wave.name || 'unnamed wave'}</div>);
				wave.slots.forEach(slot => {
					slots.push(
						<Group key={slot.id} transparent={true} onClick={() => this.props.openStatBlock(slot)}>
							<div className='content-then-info'>
								<div className='content'>
									{this.getPortrait(slot)}
									{this.getText(slot)}
								</div>
								<div className='info'>
									{this.getValue(slot)}
								</div>
							</div>
						</Group>
					);
				});
				if (slots.length === 0) {
					slots.push(<div key={'empty ' + wave.id} className='section'>no monsters</div>);
				}
			});

			return (
				<div key={this.props.encounter.id} className='card encounter'>
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
							{Napoleon.getEncounterXP(this.props.encounter, null, id => this.props.getMonster(id))}
							<Conditional display={!!this.props.encounter.notes}>
								<div className='subheading'>notes</div>
								<ReactMarkdown source={this.props.encounter.notes} />
							</Conditional>
						</div>
						<hr/>
						<button onClick={() => this.props.openEncounter(this.props.encounter)}>open encounter</button>
						<Expander text='more options'>
							<EncounterOptions
								encounter={this.props.encounter}
								parties={this.props.parties}
								adventures={this.props.adventures}
								cloneEncounter={(encounter, name) => this.props.cloneEncounter(encounter, name)}
								startEncounter={(partyID, encounterID) => this.props.startEncounter(partyID, encounterID)}
								deleteEncounter={encounter => this.props.deleteEncounter(encounter)}
							/>
						</Expander>
					</div>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='EncounterCard' error={e} />;
		}
	}
}
