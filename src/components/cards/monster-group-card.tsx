import React from 'react';

import { Gygax } from '../../utils/gygax';

import { Encounter } from '../../models/encounter';
import { Monster, MonsterGroup } from '../../models/monster';

import { RenderError } from '../error';
import { Expander } from '../controls/expander';
import { Group } from '../controls/group';
import { MonsterGroupOptions } from '../options/monster-group-options';
import { PortraitPanel } from '../panels/portrait-panel';

interface Props {
	group: MonsterGroup;
	library: MonsterGroup[];
	encounters: Encounter[];
	openMonsterGroup: (group: MonsterGroup) => void;
	addMonster: () => void;
	importMonster: () => void;
	generateMonster: () => void;
	openDemographics: (group: MonsterGroup) => void;
	deleteMonsterGroup: (group: MonsterGroup) => void;
	openStatBlock: (monster: Monster) => void;
	createEncounter: (monsterIDs: string[]) => void;
}

export class MonsterGroupCard extends React.Component<Props> {
	private getMonsters() {
		if (this.props.group.monsters.length === 0) {
			return (
				<div className='section'>no monsters</div>
			);
		}

		return this.props.group.monsters.map(m => (
			<Group key={m.id} transparent={true} onClick={() => this.props.openStatBlock(m)}>
				<div className='content-then-info'>
					<div className='content'>
						<PortraitPanel source={m} inline={true}/>
						{m.name || 'unnamed monster'}
					</div>
					<div className='info'>
						cr {Gygax.challenge(m.challenge)}
					</div>
				</div>
			</Group>
		));
	}

	public render() {
		try {
			return (
				<div key={this.props.group.id} className='card monster'>
					<div className='heading'>
						<div className='title'>
							{this.props.group.name || 'unnamed group'}
						</div>
					</div>
					<div className='card-content'>
						<div className='fixed-height'>
							{this.getMonsters()}
						</div>
						<hr/>
						<button onClick={() => this.props.openMonsterGroup(this.props.group)}>open group</button>
						<Expander text='more options'>
							<MonsterGroupOptions
								monsterGroup={this.props.group}
								library={this.props.library}
								encounters={this.props.encounters}
								addMonster={() => this.props.addMonster()}
								importMonster={() => this.props.importMonster()}
								generateMonster={() => this.props.generateMonster()}
								openDemographics={group => this.props.openDemographics(group)}
								createEncounter={monsterIDs => this.props.createEncounter(monsterIDs)}
								deleteMonsterGroup={group => this.props.deleteMonsterGroup(group)}
							/>
						</Expander>
					</div>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='MonsterGroupCard' error={e} />;
		}
	}
}
