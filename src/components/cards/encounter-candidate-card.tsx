import { Tag } from 'antd';
import React from 'react';

import Utils from '../../utils/utils';

import { Encounter } from '../../models/encounter';
import { Monster, MonsterGroup } from '../../models/monster';

import PortraitPanel from '../panels/portrait-panel';

interface Props {
	monster: Monster;
	encounter: Encounter;
	library: MonsterGroup[];
	viewMonster: (monster: Monster) => void;
	select: (monster: Monster) => void;
}

export default class EncounterCandidateCard extends React.Component<Props> {
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

		tags.push(<Tag key='tag-cr'>cr {Utils.challenge(this.props.monster.challenge)}</Tag>);

		return tags;
	}

	public render() {
		try {
			return (
				<div className='card monster'>
					<div className='heading'>
						<div className='title'>
							{this.props.monster.name || 'unnamed monster'}
						</div>
					</div>
					<div className='card-content'>
						<PortraitPanel source={this.props.monster} />
						<div className='section centered'>
							{this.getTags()}
						</div>
						<hr/>
						<div className='section'>
							<button onClick={() => this.props.viewMonster(this.props.monster)}>statblock</button>
							<button onClick={() => this.props.select(this.props.monster)}>select this monster</button>
						</div>
					</div>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
