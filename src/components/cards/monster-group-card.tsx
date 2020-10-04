import React from 'react';

import { Gygax } from '../../utils/gygax';

import { Monster, MonsterGroup } from '../../models/monster';

import { Expander } from '../controls/expander';
import { MonsterGroupOptions } from '../options/monster-group-options';
import { PortraitPanel } from '../panels/portrait-panel';

interface Props {
	group: MonsterGroup;
	library: MonsterGroup[];
	openMonsterGroup: (group: MonsterGroup) => void;
	addMonster: (monster: Monster | null) => void;
	importMonster: () => void;
	openDemographics: (group: MonsterGroup) => void;
	deleteMonsterGroup: (group: MonsterGroup) => void;
	openStatBlock: (monster: Monster) => void;
}

export class MonsterGroupCard extends React.Component<Props> {
	private getMonsters() {
		if (this.props.group.monsters.length === 0) {
			return (
				<div className='section'>no monsters</div>
			);
		}

		return this.props.group.monsters.map(m => (
			<div key={m.id} className='combatant-row' onClick={() => this.props.openStatBlock(m)} role='button'>
				<PortraitPanel source={m} inline={true}/>
				<div className='name'>{m.name || 'unnamed monster'}</div>
				<div className='value'>cr {Gygax.challenge(m.challenge)}</div>
			</div>
		));
	}

	public render() {
		try {
			return (
				<div className='card monster'>
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
								addMonster={monster => this.props.addMonster(monster)}
								importMonster={() => this.props.importMonster()}
								openDemographics={group => this.props.openDemographics(group)}
								deleteMonsterGroup={group => this.props.deleteMonsterGroup(group)}
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
