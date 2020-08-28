import React from 'react';

interface Props {
	tabs: {
		id: string,
		text: string,
		selected: boolean
	}[];
	onSelectView: (view: string) => void;
}

export default class PageFooter extends React.Component<Props> {
	public render() {
		try {
			const tabs = this.props.tabs.map(tab => (
				<div key={tab.id} className={tab.selected ? 'navigator-item selected' : 'navigator-item'} onClick={() => this.props.onSelectView(tab.id)}>
					{tab.text}
				</div>
			));

			return (
				<div className='page-footer'>
					{tabs}
				</div>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
