import React from 'react';

import { Utils } from '../../utils/utils';

import { Adventure } from '../../models/adventure';

import { ConfirmButton } from '../controls/confirm-button';

interface Props {
	adventure: Adventure;
	deleteAdventure: (adventure: Adventure) => void;
}

export class AdventureOptions extends React.Component<Props> {
	private export() {
		const filename = this.props.adventure.name + '.adventure';
		Utils.saveFile(filename, this.props.adventure);
	}

	public render() {
		return (
			<div>
				<button onClick={() => this.export()}>export adventure</button>
				<ConfirmButton onConfirm={() => this.props.deleteAdventure(this.props.adventure)}>delete adventure</ConfirmButton>
			</div>
		);
	}
}
