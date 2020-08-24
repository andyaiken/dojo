import React from 'react';

import ErrorBoundary from '../panels/error-boundary';
import PageHeader from '../panels/page-header';
import SessionPanel from '../panels/session-panel';

export default class Player extends React.Component {
	public render() {
		try {
			const breadcrumbs = [{
				id: 'home',
				text: 'dojo - player',
				onClick: () => null
			}];

			return (
				<div className='dojo'>
					<div className='app'>
						<ErrorBoundary>
							<PageHeader
								breadcrumbs={breadcrumbs}
							/>
						</ErrorBoundary>
						<ErrorBoundary>
							<div className='page-content player'>
								<SessionPanel
									user='player'
								/>
							</div>
						</ErrorBoundary>
					</div>
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}
