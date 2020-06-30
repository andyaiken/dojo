import { BookOutlined, BulbOutlined, InfoCircleOutlined, SearchOutlined, ToolOutlined } from '@ant-design/icons';
import React from 'react';

interface Props {
	view: string;
	sidebar: string | null;
	onSelectView: (view: string) => void;
	onSelectSidebar: (type: string | null) => void;
}

export default class PageFooter extends React.Component<Props> {
	public render() {
		try {
			const partiesStyle = this.props.view === 'parties' ? 'navigator-item pcs selected' : 'navigator-item pcs';
			const libraryStyle = this.props.view === 'library' ? 'navigator-item monsters selected' : 'navigator-item monsters';
			const encounterStyle = this.props.view === 'encounters' ? 'navigator-item encounters selected' : 'navigator-item encounters';
			const mapStyle = this.props.view === 'maps' ? 'navigator-item maps selected' : 'navigator-item maps';

			return (
				<div className='page-footer'>
					<div className={partiesStyle} onClick={() => this.props.onSelectView('parties')}>pcs</div>
					<div className={libraryStyle} onClick={() => this.props.onSelectView('library')}>monsters</div>
					<div className={encounterStyle} onClick={() => this.props.onSelectView('encounters')}>encounters</div>
					<div className={mapStyle} onClick={() => this.props.onSelectView('maps')}>maps</div>
					<div className='sidebar-icons'>
						<ToolOutlined
							className={this.props.sidebar === 'tools' ? 'sidebar-icon selected' : 'sidebar-icon'}
							title='tools'
							onClick={() => this.props.onSelectSidebar(this.props.sidebar === 'tools' ? null : 'tools')}
						/>
						<BulbOutlined
							className={this.props.sidebar === 'generators' ? 'sidebar-icon selected' : 'sidebar-icon'}
							title='generators'
							onClick={() => this.props.onSelectSidebar(this.props.sidebar === 'generators' ? null : 'generators')}
						/>
						<BookOutlined
							className={this.props.sidebar === 'reference' ? 'sidebar-icon selected' : 'sidebar-icon'}
							title='reference'
							onClick={() => this.props.onSelectSidebar(this.props.sidebar === 'reference' ? null : 'reference')}
						/>
						<SearchOutlined
							className={this.props.sidebar === 'search' ? 'sidebar-icon selected' : 'sidebar-icon'}
							title='search'
							onClick={() => this.props.onSelectSidebar(this.props.sidebar === 'search' ? null : 'search')}
						/>
						<InfoCircleOutlined
							className={this.props.sidebar === 'about' ? 'sidebar-icon selected' : 'sidebar-icon'}
							title='about'
							onClick={() => this.props.onSelectSidebar(this.props.sidebar === 'about' ? null : 'about')}
						/>
					</div>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
