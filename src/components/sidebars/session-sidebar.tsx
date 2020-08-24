import React from 'react';

import { MonsterGroup } from '../../models/monster';

import SessionPanel from '../panels/session-panel';

interface Props {
	library: MonsterGroup[];
}

export default class SessionSidebar extends React.Component<Props> {
	public render() {
		return (
			<div className='sidebar-container'>
				<div className='sidebar-content'>
					<SessionPanel
						user='dm'
						library={this.props.library}
					/>
				</div>
			</div>
		);
	}
}
