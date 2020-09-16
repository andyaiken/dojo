import React from 'react';

import { DieRollResult } from '../../../models/dice';

import DieRollPanel from '../../panels/die-roll-panel';
import DieRollResultPanel from '../../panels/die-roll-result-panel';

interface Props {
	dice: { [sides: number]: number };
	constant: number;
	dieRolls: DieRollResult[];
	setDie: (sides: number, count: number) => void;
	setConstant: (value: number) => void;
	rollDice: (mode: '' | 'advantage' | 'disadvantage') => void;
	resetDice: () => void;
}

export default class DieRollerTool extends React.Component<Props> {
	public render() {
		try {
			const results = this.props.dieRolls.map(result => <DieRollResultPanel key={result.id} result={result} />);

			return (
				<div>
					<DieRollPanel
						dice={this.props.dice}
						constant={this.props.constant}
						setDie={(sides, count) => this.props.setDie(sides, count)}
						setConstant={value => this.props.setConstant(value)}
						resetDice={() => this.props.resetDice()}
						rollDice={mode => this.props.rollDice(mode)}
					/>
					<hr/>
					{results}
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}
