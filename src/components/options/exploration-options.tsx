import React from 'react';

import { Exploration } from '../../models/map';

import { ConfirmButton } from '../controls/confirm-button';

interface Props {
	exploration: Exploration;
	resumeExploration: (exploration: Exploration) => void;
	deleteExploration: (exploration: Exploration) => void;
}

export class ExplorationOptions extends React.Component<Props> {
	public render() {
		return (
			<div>
				<button onClick={() => this.props.resumeExploration(this.props.exploration)}>resume exploration</button>
				<ConfirmButton onConfirm={() => this.props.deleteExploration(this.props.exploration)}>delete exploration</ConfirmButton>
			</div>
		);
	}
}
