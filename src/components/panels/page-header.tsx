import { BookOutlined, BulbOutlined, InfoCircleOutlined, SearchOutlined, ToolOutlined } from '@ant-design/icons';
import React from 'react';

interface Props {
	breadcrumbs: {
		id: string,
		text: string;
		onClick: () => void;
	}[];
	sidebar: string | null;
	onSelectSidebar: (type: string | null) => void;
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

			return (
				<div className='page-header'>
					<div className='app-title'>
						{breadcrumbs}
					</div>
					<ToolOutlined
						className={this.props.sidebar === 'tools' ? 'title-bar-icon selected' : 'title-bar-icon'}
						title='tools'
						onClick={() => this.props.onSelectSidebar(this.props.sidebar === 'tools' ? null : 'tools')}
					/>
					<BulbOutlined
						className={this.props.sidebar === 'generators' ? 'title-bar-icon selected' : 'title-bar-icon'}
						title='generators'
						onClick={() => this.props.onSelectSidebar(this.props.sidebar === 'generators' ? null : 'generators')}
					/>
					<BookOutlined
						className={this.props.sidebar === 'reference' ? 'title-bar-icon selected' : 'title-bar-icon'}
						title='reference'
						onClick={() => this.props.onSelectSidebar(this.props.sidebar === 'reference' ? null : 'reference')}
					/>
					<SearchOutlined
						className={this.props.sidebar === 'search' ? 'title-bar-icon selected' : 'title-bar-icon'}
						title='search'
						onClick={() => this.props.onSelectSidebar(this.props.sidebar === 'search' ? null : 'search')}
					/>
					<InfoCircleOutlined
						className={this.props.sidebar === 'about' ? 'title-bar-icon selected' : 'title-bar-icon'}
						title='about'
						onClick={() => this.props.onSelectSidebar(this.props.sidebar === 'about' ? null : 'about')}
					/>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
