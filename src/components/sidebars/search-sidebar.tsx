import React from 'react';

import { Sherlock } from '../../utils/sherlock';

import { Adventure } from '../../models/adventure';
import { Encounter } from '../../models/encounter';
import { Map } from '../../models/map';
import { Monster, MonsterGroup } from '../../models/monster';
import { Party } from '../../models/party';

import { RenderError } from '../error';
import { Group } from '../controls/group';
import { Note } from '../controls/note';
import { Textbox } from '../controls/textbox';

interface Props {
	parties: Party[];
	library: MonsterGroup[];
	encounters: Encounter[];
	maps: Map[];
	adventures: Adventure[]
	openParty: (id: string) => void;
	openGroup: (id: string) => void;
	openEncounter: (id: string) => void;
	openMap: (id: string) => void;
	openAdventure: (id: string) => void;
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
								<Group key={comp.id}>
									<div className='section'>{comp.name}</div>
								</Group>
							);
						});
						pcs.push(
							<Group key={pc.id}>
								<div className='section'>{pc.name}</div>
								{companions}
							</Group>
						);
					});
					results.push(
						<Group key={party.id} onClick={() => this.props.openParty(party.id)}>
							<div className='section'>{party.name}</div>
							{pcs}
						</Group>
					);
				});

				this.props.library.filter(group => Sherlock.matchGroup(this.state.text, group)).forEach(group => {
					const monsters: JSX.Element[] = [];
					group.monsters.filter(monster => Sherlock.matchMonster(this.state.text, monster)).forEach(monster => {
						const traits: JSX.Element[] = [];
						monster.traits.filter(trait => Sherlock.matchTrait(this.state.text, trait)).forEach(trait => {
							traits.push(
								<Group key={trait.id}>
									<div className='section'>{trait.name}</div>
								</Group>
							);
						});
						monsters.push(
							<Group key={monster.id}>
								<div className='section'>{monster.name}</div>
								{traits}
							</Group>
						);
					});
					results.push(
						<Group key={group.id} onClick={() => this.props.openGroup(group.id)}>
							<div className='section'>{group.name}</div>
							{monsters}
						</Group>
					);
				});

				this.props.encounters.filter(encounter => Sherlock.matchEncounter(this.state.text, encounter, id => this.props.getMonster(id))).forEach(encounter => {
					const slots: JSX.Element[] = [];
					encounter.slots.filter(slot => Sherlock.matchEncounterSlot(this.state.text, slot, id => this.props.getMonster(id))).forEach(slot => {
						const monster = this.props.getMonster(slot.monsterID);
						slots.push(
							<Group key={slot.id}>
								<div className='section'>{monster ? monster.name : 'monster'}</div>
							</Group>
						);
					});
					const waves: JSX.Element[] = [];
					encounter.waves.filter(wave => Sherlock.matchEncounterWave(this.state.text, wave, id => this.props.getMonster(id))).forEach(wave => {
						const waveSlots: JSX.Element[] = [];
						wave.slots.filter(slot => Sherlock.matchEncounterSlot(this.state.text, slot, id => this.props.getMonster(id))).forEach(slot => {
							const monster = this.props.getMonster(slot.monsterID);
							waveSlots.push(
								<Group key={slot.id}>
									<div className='section'>{monster ? monster.name : 'monster'}</div>
								</Group>
							);
						});
						waves.push(
							<Group key={wave.id}>
								<div className='section'>{wave.name}</div>
								{waveSlots}
							</Group>
						);
					});
					results.push(
						<Group key={encounter.id} onClick={() => this.props.openEncounter(encounter.id)}>
							<div className='section'>{encounter.name}</div>
							{slots}
							{waves}
						</Group>
					);
				});

				this.props.maps.filter(map => Sherlock.matchMap(this.state.text, map)).forEach(map => {
					const areas: JSX.Element[] = [];
					map.areas.filter(area => Sherlock.matchMapArea(this.state.text, area)).forEach(area => {
						areas.push(
							<Group key={area.id}>
								<div className='section'>{area.name}</div>
							</Group>
						);
					});
					results.push(
						<Group key={map.id} onClick={() => this.props.openMap(map.id)}>
							<div className='section'>{map.name}</div>
							{areas}
						</Group>
					);
				});

				this.props.adventures.filter(adventure => Sherlock.matchAdventure(this.state.text, adventure)).forEach(adventure => {
					const scenes: JSX.Element[] = [];
					adventure.plot.scenes.filter(scene => Sherlock.matchScene(this.state.text, scene)).forEach(scene => {
						scenes.push(
							<Group key={scene.id}>
								<div className='section'>{scene.name}</div>
							</Group>
						);
					});
					results.push(
						<Group key={adventure.id} onClick={() => this.props.openAdventure(adventure.id)}>
							<div className='section'>{adventure.name}</div>
							{scenes}
						</Group>
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
		} catch (e) {
			console.error(e);
			return <RenderError context='SearchSidebar' error={e} />;
		}
	}
}
