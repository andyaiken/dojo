import React from 'react';

import SessionPanel from '../panels/session-panel';

export default class SessionSidebar extends React.Component {
	public render() {
		return (
			<div className='sidebar-container'>
				<div className='sidebar-content'>
					<SessionPanel
						type='dm'
					/>
				</div>
			</div>
		);
	}
}
