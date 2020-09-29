import React from 'react';

import { Combat } from '../../models/combat';

import { ConfirmButton } from '../controls/confirm-button';

interface Props {
	combat: Combat;
	resume: (combat: Combat) => void;
	delete: (combat: Combat) => void;
}

export class CombatOptions extends React.Component<Props> {
	public render() {
		return (
			<div>
				<button onClick={() => this.props.resume(this.props.combat)}>resume combat</button>
				<ConfirmButton text='delete combat' onConfirm={() => this.props.delete(this.props.combat)} />
			</div>
		);
	}
}
