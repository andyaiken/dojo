import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons';
import React from 'react';

import { Sidebar } from './page-sidebar';

interface Props {
	breadcrumbs: {
		id: string,
		text: string;
		onClick: () => void;
	}[];
	sidebar: Sidebar;
	onToggleSidebar: () => void;
}

export default class PageHeader extends React.Component<Props> {
	public render() {
		try {
			const breadcrumbs = this.props.breadcrumbs.map(bc => {
				return (
					<div key={bc.id} className='breadcrumb' onClick={() => bc.onClick()}>
						{bc.text}
					</div>
				);
			});

			let toggle = <LeftCircleOutlined className='toggle' title='show sidebar' onClick={() => this.props.onToggleSidebar()} />;
			if (this.props.sidebar.visible) {
				toggle = <RightCircleOutlined className='toggle' title='hide sidebar' onClick={() => this.props.onToggleSidebar()} />;
			}

			return (
				<div className='page-header'>
					<div className='app-title'>
						{breadcrumbs}
					</div>
					{toggle}
				</div>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
