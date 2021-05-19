import React from 'react';

import { Comms, CommsPlayer } from '../../utils/uhura';

import { ConnectionsPanel, PlayerStatusPanel } from '../panels/session-panel';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {
}

export class SessionPlayerSidebar extends React.Component<Props> {
	private getContent() {
		if (CommsPlayer.getState() === 'connected') {
			return (
				<div>
					<PlayerStatusPanel/>
					<hr/>
					<ConnectionsPanel
						user='player'
						people={Comms.data.people}
						kick={() => null}
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
