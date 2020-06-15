import React from 'react';

import { Monster } from '../../../models/monster';

import MonsterCard from '../../cards/monster-card';
import Dropdown from '../../controls/dropdown';

interface Props {
	selectedMonsterID: string | null;
	monsters: Monster[];
	selectMonsterID: (id: string) => void;
}

export default class MonsterReference extends React.Component<Props> {
	public render() {
		try {
			const monster = this.props.monsters.find(m => m.id === this.props.selectedMonsterID);

			let statblock = null;
			if (monster) {
				statblock = (
					<div>
						<hr/>
						<MonsterCard monster={monster} />
					</div>
				);
			}

			return (
				<div>
					<Dropdown
						options={this.props.monsters.map(p => ({ id: p.id, text: p.name }))}
						placeholder='select a monster...'
						selectedID={this.props.selectedMonsterID}
						onSelect={id => this.props.selectMonsterID(id)}
					/>
					{statblock}
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}
