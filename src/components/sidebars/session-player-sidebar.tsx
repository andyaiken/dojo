import React from 'react';

import { Comms, CommsPlayer } from '../../utils/comms';

import Note from '../panels/note';
import { ConnectionsPanel, PlayerStatusPanel } from '../panels/session-panel';

interface Props {
	editPC: (id: string) => void;
}

export default class SessionPlayerSidebar extends React.Component<Props> {
	private getContent() {
		switch (CommsPlayer.getState()) {
			case 'not connected':
			case 'connecting':
				return this.getNotConnectedContent();
			case 'connected':
				return this.getConnectedContent();
		}
	}

	private getNotConnectedContent() {
		return (
			<Note>
				<p>not connected</p>
			</Note>
		);
	}

	private getConnectedContent() {
		return (
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

	public render() {
		return (
			<div className='sidebar-container'>
				<div className='sidebar-content'>
					{this.getContent()}
				</div>
			</div>
		);
	}
}
