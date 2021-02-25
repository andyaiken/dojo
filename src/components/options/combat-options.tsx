import React from 'react';

import { Combat } from '../../models/combat';

import { ConfirmButton } from '../controls/confirm-button';

interface Props {
	combat: Combat;
	resumeCombat: (combat: Combat) => void;
	deleteCombat: (combat: Combat) => void;
}

export class CombatOptions extends React.Component<Props> {
	public render() {
		return (
			<div>
				<button onClick={() => this.props.resumeCombat(this.props.combat)}>resume combat</button>
				<ConfirmButton onConfirm={() => this.props.deleteCombat(this.props.combat)}>delete combat</ConfirmButton>
			</div>
		);
	}
}
