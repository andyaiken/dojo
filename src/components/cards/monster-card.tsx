import { Tag } from 'antd';
import React from 'react';

import { Gygax } from '../../utils/gygax';

import { Encounter } from '../../models/encounter';
import { Monster, MonsterGroup } from '../../models/monster';

import { RenderError } from '../error';
import { MonsterOptions } from '../options/monster-options';
import { PortraitPanel } from '../panels/portrait-panel';

interface Props {
	monster: Monster;
	library: MonsterGroup[];
	encounters: Encounter[];
	viewMonster: (monster: Monster) => void;
	editMonster: (monster: Monster) => void;
	deleteMonster: (monster: Monster) => void;
	cloneMonster: (monster: Monster, name: string) => void;
	moveToGroup: (monster: Monster, groupID: string) => void;
	createEncounter: (id: string) => void;
}

export class MonsterCard extends React.Component<Props> {
	private getTags() {
		const tags = [];

		let sizeAndType = (this.props.monster.size + ' ' + this.props.monster.category).toLowerCase();
		if (this.props.monster.tag) {
			sizeAndType += ' (' + this.props.monster.tag.toLowerCase() + ')';
		}
		tags.push(<Tag key='tag-main'>{sizeAndType}</Tag>);

		if (this.props.monster.alignment) {
			tags.push(<Tag key='tag-align'>{this.props.monster.alignment.toLowerCase()}</Tag>);
		}

		tags.push(<Tag key='tag-cr'>cr {Gygax.challenge(this.props.monster.challenge)}</Tag>);

		return tags;
	}

	public render() {
		try {
			const monsterName = this.props.monster.name || 'unnamed monster';

			return (
				<div key={this.props.monster.id} className='card monster'>
					<div className='heading'>
						<div className='title' title={monsterName}>
							{monsterName}
						</div>
					</div>
					<div className='card-content'>
						<PortraitPanel source={this.props.monster} />
						<div className='section centered'>
							{this.getTags()}
						</div>
						<hr/>
						<MonsterOptions
							monster={this.props.monster}
							library={this.props.library}
							encounters={this.props.encounters}
							viewMonster={monster => this.props.viewMonster(monster)}
							editMonster={monster => this.props.editMonster(monster)}
							deleteMonster={monster => this.props.deleteMonster(monster)}
							cloneMonster={(monster, name) => this.props.cloneMonster(monster, name)}
							moveToGroup={(monster, groupID) => this.props.moveToGroup(monster, groupID)}
							createEncounter={monsterID => this.props.createEncounter(monsterID)}
						/>
					</div>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='MonsterCard' error={e} />;
		}
	}
}
