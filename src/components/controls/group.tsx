import React from 'react';

import { RenderError } from '../error';

interface Props {
	onClick: (() => void) | null;
}

export class Group extends React.Component<Props> {
	public static defaultProps = {
		onClick: null
	};

	private onClick() {
		if (this.props.onClick) {
			this.props.onClick();
		}
	}

	public render() {
		try {
			if (this.props.onClick) {
				return (
					<div className='group-panel clickable' onClick={() => this.onClick()} role='button'>
						{this.props.children}
					</div>
				);
			}

			return (
				<div className='group-panel'>
					{this.props.children}
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='Group' error={e} />;
		}
	}
}
