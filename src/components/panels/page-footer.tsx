import React from 'react';

import { RenderError } from '../error';

interface Props {
	tabs: {
		id: string,
		text: string,
		selected: boolean,
		onSelect: () => void
	}[];
	shortcuts: JSX.Element[];
}

export class PageFooter extends React.Component<Props> {
	public static defaultProps = {
		tabs: [],
		shortcuts: []
	};

	public render() {
		try {
			const content = this.props.shortcuts.concat(this.props.tabs.map(tab => (
				<div key={tab.id} className={tab.selected ? 'navigator-item selected' : 'navigator-item'} onClick={() => tab.onSelect()} role='button'>
					{tab.text}
				</div>
			)));

			return (
				<div className='page-footer'>
					{content}
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='PageFooter' error={e} />;
		}
	}
}
