import React from 'react';

interface Props {
	breadcrumbs: {
		id: string,
		text: string;
		onClick: () => void;
	}[];
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
				</div>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
