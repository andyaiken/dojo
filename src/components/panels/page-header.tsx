import { LeftCircleOutlined, RightCircleOutlined, SettingOutlined } from '@ant-design/icons';
import React from 'react';

import { RenderError } from '../error';

interface Props {
	breadcrumbs: {
		id: string,
		text: string;
		onClick: () => void;
	}[];
	sidebarVisible: boolean;
	onToggleSidebar: () => void;
	onToggleSettings: () => void;
}

export class PageHeader extends React.Component<Props> {
	public static defaultProps = {
		sidebarVisible: false,
		onToggleSidebar: null,
		onToggleSettings: null
	};

	public render() {
		try {
			const breadcrumbs = this.props.breadcrumbs.map(bc => {
				return (
					<div key={bc.id} className='breadcrumb' onClick={() => bc.onClick()} role='button'>
						{bc.text}
					</div>
				);
			});

			let icon = null;
			if (this.props.onToggleSidebar) {
				icon = <LeftCircleOutlined className='toggle' title='show sidebar' onClick={() => this.props.onToggleSidebar()} />;
				if (this.props.sidebarVisible) {
					icon = <RightCircleOutlined className='toggle' title='hide sidebar' onClick={() => this.props.onToggleSidebar()} />;
				}
			}
			if (this.props.onToggleSettings) {
				icon = <SettingOutlined className='toggle' title='settings' onClick={() => this.props.onToggleSettings()} />;
			}

			return (
				<div className='page-header'>
					<div className='app-title'>
						{breadcrumbs}
					</div>
					{icon}
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='PageHeader' error={e} />;
		}
	}
}
