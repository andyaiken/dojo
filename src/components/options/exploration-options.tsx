import React from 'react';

import { Exploration } from '../../models/map';

import { ConfirmButton } from '../controls/confirm-button';

interface Props {
	exploration: Exploration;
	resume: (exploration: Exploration) => void;
	delete: (exploration: Exploration) => void;
}

export class ExplorationOptions extends React.Component<Props> {
	public render() {
		return (
			<div>
				<button onClick={() => this.props.resume(this.props.exploration)}>resume exploration</button>
				<ConfirmButton text='delete exploration' onConfirm={() => this.props.delete(this.props.exploration)} />
			</div>
		);
	}
}
