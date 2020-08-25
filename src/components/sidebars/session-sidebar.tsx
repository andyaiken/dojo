import React from 'react';

import { Monster, MonsterGroup } from '../../models/monster';
import { Party } from '../../models/party';

import SessionPanel from '../panels/session-panel';

interface Props {
	parties: Party[];
	library: MonsterGroup[];
	update: () => void;
	openImage: (data: string) => void;
	openStatBlock: (monster: Monster) => void;
}

export default class SessionSidebar extends React.Component<Props> {
	public render() {
		return (
			<div className='sidebar-container'>
				<div className='sidebar-content'>
					<SessionPanel
						user='dm'
						parties={this.props.parties}
						library={this.props.library}
						update={() => this.props.update()}
						openImage={data => this.props.openImage(data)}
						openStatBlock={monster => this.props.openStatBlock(monster)}
					/>
				</div>
			</div>
		);
	}
}
