import { PlusCircleOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import React from 'react';

import { Gygax } from '../../utils/gygax';

import { Monster } from '../../models/monster';

import { RenderError } from '../panels/error-boundary';
import { PortraitPanel } from '../panels/portrait-panel';

interface Props {
	monster: Monster;
	selectMonster: (monster: Monster) => void;
}

export class MonsterCandidateCard extends React.Component<Props> {
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
			const name = this.props.monster.name || 'unnamed monster';

			return (
				<div className='card monster'>
					<div className='heading'>
						<div className='title' title={name}>
							{name}
						</div>
						<PlusCircleOutlined onClick={() => this.props.selectMonster(this.props.monster)} />
					</div>
					<div className='card-content'>
						<PortraitPanel source={this.props.monster} />
						<div className='section centered'>
							{this.getTags()}
						</div>
					</div>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError error={e} />;
		}
	}
}
