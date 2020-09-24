import { CheckCircleOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import React from 'react';

import { Napoleon } from '../../utils/napoleon';
import { Utils } from '../../utils/utils';

import { Combat, Combatant } from '../../models/combat';
import { Encounter, EncounterSlot } from '../../models/encounter';
import { Monster } from '../../models/monster';
import { Party } from '../../models/party';

import { CombatCard } from '../cards/combat-card';
import { EncounterCard } from '../cards/encounter-card';
import { Expander } from '../controls/expander';
import { RadioGroup } from '../controls/radio-group';
import { GridPanel } from '../panels/grid-panel';
import { Note } from '../panels/note';

interface Props {
	encounters: Encounter[];
	combats: Combat[];
	parties: Party[];
	hasMonsters: boolean;
	addEncounter: (templateID: string | null) => void;
	viewEncounter: (encounter: Encounter) => void;
	editEncounter: (encounter: Encounter) => void;
	cloneEncounter: (encounter: Encounter, name: string) => void;
	deleteEncounter: (encounter: Encounter) => void;
	runEncounter: (encounter: Encounter, partyID: string) => void;
	getMonster: (id: string) => Monster | null;
	setView: (view: string) => void;
	openStatBlock: (monster: Monster | Combatant) => void;
	resumeCombat: (combat: Combat) => void;
	deleteCombat: (combat: Combat) => void;
}

export class EncounterListScreen extends React.Component<Props> {
	private openStatBlock(slot: EncounterSlot) {
		const monster = this.props.getMonster(slot.monsterID);
		if (monster) {
			this.props.openStatBlock(monster);
		}
	}

	public render() {
		try {
			if (!this.props.hasMonsters) {
				return (
					<Row align='middle' justify='center' className='scrollable'>
						<div style={{ width: '400px' }}>
							<Note>
								<div className='section'>
									this screen is for building encounters, but before you can do that you need to do these things first:
								</div>
								<ul>
									<li>
										<span className={this.props.hasMonsters ? 'strikethrough' : ''}>
											add some monsters in the <button className='link' onClick={() => this.props.setView('library')}>monsters screen</button>
										</span>
										{this.props.hasMonsters ? <CheckCircleOutlined title='done' style={{ marginLeft: '5px' }}/> : null}
									</li>
								</ul>
							</Note>
						</div>
					</Row>
				);
			}

			const combats = this.props.combats;
			Utils.sort(combats);
			const combatItems = combats.map(c => (
				<CombatCard
					key={c.id}
					combat={c}
					resume={combat => this.props.resumeCombat(combat)}
					delete={combat => this.props.deleteCombat(combat)}
					openStatBlock={combatant => this.props.openStatBlock(combatant)}
				/>
			));

			const encounters = this.props.encounters;
			Utils.sort(encounters);
			const encounterItems = encounters.map(e => (
				<EncounterCard
					key={e.id}
					encounter={e}
					parties={this.props.parties}
					view={encounter => this.props.viewEncounter(encounter)}
					edit={encounter => this.props.editEncounter(encounter)}
					delete={encounter => this.props.deleteEncounter(encounter)}
					clone={(encounter, name) => this.props.cloneEncounter(encounter, name)}
					run={(encounter, partyID) => this.props.runEncounter(encounter, partyID)}
					openStatBlock={slot => this.openStatBlock(slot)}
					getMonster={id => this.props.getMonster(id)}
				/>
			));

			return (
				<Row className='full-height'>
					<Col span={6} className='scrollable sidebar sidebar-left'>
						<Note>
							<div className='section'>on this page you can set up encounters</div>
							<div className='section'>
								when you have created an encounter you can add monsters to it, then gauge its difficulty for a party of pcs
							</div>
							<div className='section'>
								when you have set up a party and an encounter you can then run the encounter
							</div>
							<hr/>
							<div className='section'>on the right you will see the encounters that you have created</div>
							<div className='section'>select an encounter from the list to add monsters to it</div>
							<hr/>
							<div className='section'>to start building an encounter, press the <b>create a new encounter</b> button</div>
						</Note>
						<button onClick={() => this.props.addEncounter(null)}>create a new encounter</button>
						<Expander text='use an encounter template'>
							<RadioGroup
								items={Napoleon.encounterTemplates().map(t => ({ id: t.name, text: t.name }))}
								selectedItemID={null}
								onSelect={id => this.props.addEncounter(id)}
							/>
						</Expander>
					</Col>
					<Col span={18} className='scrollable'>
						<GridPanel heading='in progress' content={combatItems} />
						<GridPanel heading='encounters' content={encounterItems} />
					</Col>
				</Row>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
