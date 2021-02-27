import React from 'react';

import { RenderError } from '../error';

interface Props {
	display: boolean;
}

export class Conditional extends React.Component<Props> {
	public render() {
		try {
			if (this.props.display) {
				return (
					<div>
						{this.props.children}
					</div>
				);
			}

			return null;
		} catch (e) {
			console.error(e);
			return <RenderError context='Conditional' error={e} />;
		}
	}
}
