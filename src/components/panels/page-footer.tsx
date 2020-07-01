import { CloseCircleOutlined } from '@ant-design/icons';
import React from 'react';

interface Props {
	view: string;
	sidebar: string;
	onSelectView: (view: string) => void;
	onCloseSidebar: () => void;
}

export default class PageFooter extends React.Component<Props> {
	public render() {
		try {
			const partiesStyle = this.props.view === 'parties' ? 'navigator-item pcs selected' : 'navigator-item pcs';
			const libraryStyle = this.props.view === 'library' ? 'navigator-item monsters selected' : 'navigator-item monsters';
			const encounterStyle = this.props.view === 'encounters' ? 'navigator-item encounters selected' : 'navigator-item encounters';
			const mapStyle = this.props.view === 'maps' ? 'navigator-item maps selected' : 'navigator-item maps';

			let sidebar = null;
			if (this.props.sidebar) {
				sidebar = (
					<div className='sidebar-padding'>
						<CloseCircleOutlined onClick={() => this.props.onCloseSidebar()} />
					</div>
				);
			}

			return (
				<div className='page-footer'>
					<div className={partiesStyle} onClick={() => this.props.onSelectView('parties')}>pcs</div>
					<div className={libraryStyle} onClick={() => this.props.onSelectView('library')}>monsters</div>
					<div className={encounterStyle} onClick={() => this.props.onSelectView('encounters')}>encounters</div>
					<div className={mapStyle} onClick={() => this.props.onSelectView('maps')}>maps</div>
					{sidebar}
				</div>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
