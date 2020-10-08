import React from 'react';

import { Sherlock } from '../../utils/sherlock';

import { Encounter } from '../../models/encounter';
import { Map } from '../../models/map';
import { Monster, MonsterGroup } from '../../models/monster';
import { Party } from '../../models/party';

import { Textbox } from '../controls/textbox';
import { Note } from '../panels/note';

interface Props {
	parties: Party[];
	library: MonsterGroup[];
	encounters: Encounter[];
	maps: Map[];
	openParty: (id: string) => void;
	openGroup: (id: string) => void;
	openEncounter: (id: string) => void;
	openMap: (id: string) => void;
	getMonster: (id: string) => Monster | null;
}

interface State {
	text: string;
}

export class SearchSidebar extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			text: ''
		};
	}

	private setSearchTerm(text: string) {
		this.setState({
			text: text
		});
	}

	public render() {
		try {
			const results = [];
			if (this.state.text.length > 2) {
				this.props.parties.filter(party => Sherlock.matchParty(this.state.text, party)).forEach(party => {
					const pcs: JSX.Element[] = [];
					party.pcs.filter(pc => Sherlock.matchPC(this.state.text, pc)).forEach(pc => {
						const companions: JSX.Element[] = [];
						pc.companions.filter(comp => Sherlock.matchCompanion(this.state.text, comp)).forEach(comp => {
							companions.push(
								<div key={comp.id} className='group-panel'>
									<div className='section'>{comp.name}</div>
								</div>
							);
						});
						pcs.push(
							<div key={pc.id} className='group-panel'>
								<div className='section'>{pc.name}</div>
								{companions}
							</div>
						);
					});
					results.push(
						<div key={party.id} className='group-panel clickable' onClick={() => this.props.openParty(party.id)} role='button'>
							<div className='section'>{party.name}</div>
							{pcs}
						</div>
					);
				});

				this.props.library.filter(group => Sherlock.matchGroup(this.state.text, group)).forEach(group => {
					const monsters: JSX.Element[] = [];
					group.monsters.filter(monster => Sherlock.matchMonster(this.state.text, monster)).forEach(monster => {
						const traits: JSX.Element[] = [];
						monster.traits.filter(trait => Sherlock.matchTrait(this.state.text, trait)).forEach(trait => {
							traits.push(
								<div key={trait.id} className='group-panel'>
									<div className='section'>{trait.name}</div>
								</div>
							);
						});
						monsters.push(
							<div key={monster.id} className='group-panel'>
								<div className='section'>{monster.name}</div>
								{traits}
							</div>
						);
					});
					results.push(
						<div key={group.id} className='group-panel clickable' onClick={() => this.props.openGroup(group.id)} role='button'>
							<div className='section'>{group.name}</div>
							{monsters}
						</div>
					);
				});

				this.props.encounters.filter(encounter => Sherlock.matchEncounter(this.state.text, encounter, id => this.props.getMonster(id))).forEach(encounter => {
					const slots: JSX.Element[] = [];
					encounter.slots.filter(slot => Sherlock.matchEncounterSlot(this.state.text, slot, id => this.props.getMonster(id))).forEach(slot => {
						const monster = this.props.getMonster(slot.monsterID);
						slots.push(
							<div key={slot.id} className='group-panel'>
								<div className='section'>{monster ? monster.name : 'monster'}</div>
							</div>
						);
					});
					const waves: JSX.Element[] = [];
					encounter.waves.filter(wave => Sherlock.matchEncounterWave(this.state.text, wave, id => this.props.getMonster(id))).forEach(wave => {
						const waveSlots: JSX.Element[] = [];
						wave.slots.filter(slot => Sherlock.matchEncounterSlot(this.state.text, slot, id => this.props.getMonster(id))).forEach(slot => {
							const monster = this.props.getMonster(slot.monsterID);
							waveSlots.push(
								<div key={slot.id} className='group-panel'>
									<div className='section'>{monster ? monster.name : 'monster'}</div>
								</div>
							);
						});
						waves.push(
							<div key={wave.id} className='group-panel'>
								<div className='section'>{wave.name}</div>
								{waveSlots}
							</div>
						);
					});
					results.push(
						<div key={encounter.id} className='group-panel clickable' onClick={() => this.props.openEncounter(encounter.id)} role='button'>
							<div className='section'>{encounter.name}</div>
							{slots}
							{waves}
						</div>
					);
				});

				this.props.maps.filter(map => Sherlock.matchMap(this.state.text, map)).forEach(map => {
					const areas: JSX.Element[] = [];
					map.areas.filter(area => Sherlock.matchMapArea(this.state.text, area)).forEach(area => {
						areas.push(
							<div key={area.id} className='group-panel'>
								<div className='section'>map area</div>
							</div>
						);
					});
					results.push(
						<div key={map.id} className='group-panel clickable' onClick={() => this.props.openMap(map.id)} role='button'>
							<div className='section'>{map.name}</div>
							{areas}
						</div>
					);
				});

				if (results.length === 0) {
					results.push(
						<Note key='empty'>
							nothing found
						</Note>
					);
				}
			}

			return (
				<div className='sidebar-container'>
					<div className='sidebar-header'>
						<div className='heading'>search</div>
						<Textbox
							text={this.state.text}
							placeholder='enter your search term here'
							minLength={3}
							onChange={value => this.setSearchTerm(value)}
						/>
					</div>
					<div className='sidebar-content'>
						{results}
					</div>
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}
