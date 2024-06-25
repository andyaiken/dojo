import React from 'react';

import { RenderError } from '../error';

interface Props {
	display: boolean;
	children?: string | number | JSX.Element | null | (string | number | JSX.Element | null)[];
}

export class Conditional extends React.Component<Props> {
	public render() {
		try {
			if (this.props.display) {
				try {
					return (
						<div>
							{this.props.children}
						</div>
					);
				} catch {
					return null;
				}
			}

			return null;
		} catch (e) {
			console.error(e);
			return <RenderError context='Conditional' error={e} />;
		}
	}
}
