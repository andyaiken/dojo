import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons';
import React from 'react';

interface Props {
	breadcrumbs: {
		id: string,
		text: string;
		onClick: () => void;
	}[];
	sidebarVisible: boolean;
	onToggleSidebar: () => void;
}

export default class PageHeader extends React.Component<Props> {
	public static defaultProps = {
		sidebarVisible: false,
		onToggleSidebar: null
	};

	public render() {
		try {
			const breadcrumbs = this.props.breadcrumbs.map(bc => {
				return (
					<div key={bc.id} className='breadcrumb' onClick={() => bc.onClick()}>
						{bc.text}
					</div>
				);
			});

			let toggle = null;
			if (this.props.onToggleSidebar) {
				toggle = <LeftCircleOutlined className='toggle' title='show sidebar' onClick={() => this.props.onToggleSidebar()} />;
				if (this.props.sidebarVisible) {
					toggle = <RightCircleOutlined className='toggle' title='hide sidebar' onClick={() => this.props.onToggleSidebar()} />;
				}
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
