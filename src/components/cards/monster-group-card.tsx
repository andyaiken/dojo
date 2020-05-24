import React from 'react';

import { Monster, MonsterGroup } from '../../models/monster-group';

import ConfirmButton from '../controls/confirm-button';
import PortraitPanel from '../panels/portrait-panel';

interface Props {
	group: MonsterGroup;
	open: (group: MonsterGroup) => void;
	delete: (group: MonsterGroup) => void;
	openStatBlock: (monster: Monster) => void;
}

export default class MonsterGroupCard extends React.Component<Props> {
	private getMonsters() {
		if (this.props.group.monsters.length === 0) {
			return (
				<div className='section'>no monsters</div>
			);
		}

		return this.props.group.monsters.map(m => (
			<div key={m.id} className='combatant-row' onClick={() => this.props.openStatBlock(m)}>
				<PortraitPanel source={m} inline={true}/>
				<div className='name'>{m.name || 'unnamed monster'}</div>
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
						<button onClick={() => this.props.open(this.props.group)}>open group</button>
						<ConfirmButton text='delete group' onConfirm={() => this.props.delete(this.props.group)} />
					</div>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
