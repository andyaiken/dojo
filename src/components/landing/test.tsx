import { CloseCircleOutlined } from '@ant-design/icons';
import { notification } from 'antd';
import React from 'react';

import ErrorBoundary from '../panels/error-boundary';
import PageHeader from '../panels/page-header';

export default class Test extends React.Component {
	private testNotification() {
		notification.open({
			message: <div>MSG</div>,
			closeIcon: <CloseCircleOutlined />,
			duration: null
		});
	}

	public render() {
		return (
			<div className='dojo'>
				<div className='app'>
					<ErrorBoundary>
						<PageHeader
							breadcrumbs={[{
								id: 'home',
								text: 'dojo - test',
								onClick: () => null
							}]}
						/>
					</ErrorBoundary>
					<ErrorBoundary>
						<div className='page-content no-footer scrollable'>
							<p>this is a test page</p>
							<button onClick={() => this.testNotification()}>test notification</button>
						</div>
					</ErrorBoundary>
				</div>
			</div>
		);
	}
}
