import React from 'react';

import { RenderError } from '../error';

interface Props {
	className: string | null;
	transparent: boolean;
	children?: string | number | JSX.Element | null | (string | number | JSX.Element | null)[];
	onClick: (() => void) | null;
}

export class Group extends React.Component<Props> {
	public static defaultProps = {
		className: null,
		transparent: false,
		onClick: null
	};

	private onClick() {
		if (this.props.onClick) {
			this.props.onClick();
		}
	}

	public render() {
		try {
			if (!this.props.children) {
				return null;
			}

			let style = 'group-panel';
			if (this.props.className) {
				style += ' ' + this.props.className;
			}
			if (this.props.transparent) {
				style += ' transparent';
			}

			if (this.props.onClick) {
				return (
					<div className={style + ' clickable'} onClick={() => this.onClick()} role='button'>
						{this.props.children}
					</div>
				);
			}

			return (
				<div className={style}>
					{this.props.children}
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='Group' error={e} />;
		}
	}
}
