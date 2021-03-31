import React from 'react';

import { Adventure } from '../../models/adventure';

import { ConfirmButton } from '../controls/confirm-button';

interface Props {
	adventure: Adventure;
	deleteAdventure: (adventure: Adventure) => void;
}

export class AdventureOptions extends React.Component<Props> {
	public render() {
		return (
			<div>
				<ConfirmButton onConfirm={() => this.props.deleteAdventure(this.props.adventure)}>delete adventure</ConfirmButton>
			</div>
		);
	}
}
