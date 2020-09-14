import React from 'react';

import { Comms, CommsPlayer } from '../../utils/comms';

import Note from '../panels/note';
import { ConnectionsPanel, PlayerStatusPanel } from '../panels/session-panel';

interface Props {
	editPC: (id: string) => void;
}

export default class SessionPlayerSidebar extends React.Component<Props> {
	public render() {
		let content = (
			<Note>
				<p>when you are connected, this sidebar will allow you to manage your presence</p>
			</Note>
		);

		if (CommsPlayer.getState() === 'connected') {
			content = (
				<div>
					<Note>
						<p>the following people are connected</p>
					</Note>
					<ConnectionsPanel
						user='player'
						people={Comms.data.people}
						kick={id => null}
					/>
					<hr/>
					<PlayerStatusPanel
						editPC={id => this.props.editPC(id)}
					/>
				</div>
			);
		}

		return (
			<div className='sidebar-container'>
				<div className='sidebar-content'>
					{content}
				</div>
			</div>
		);
	}
}
