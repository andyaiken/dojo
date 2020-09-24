import React from 'react';

import { Comms, CommsPlayer } from '../../utils/uhura';

import { ConnectionsPanel, PlayerStatusPanel } from '../panels/session-panel';

interface Props {
	editPC: (id: string) => void;
}

export class SessionPlayerSidebar extends React.Component<Props> {
	private getContent() {
		if (CommsPlayer.getState() === 'connected') {
			return (
				<div>
					<PlayerStatusPanel
						editPC={id => this.props.editPC(id)}
					/>
					<hr/>
					<ConnectionsPanel
						user='player'
						people={Comms.data.people}
						kick={id => null}
					/>
				</div>
			);
		}

		return null;
	}

	public render() {
		return (
			<div className='sidebar-container'>
				<div className='sidebar-header'>
					<div className='heading'>session</div>
				</div>
				<div className='sidebar-content'>
					{this.getContent()}
				</div>
			</div>
		);
	}
}
