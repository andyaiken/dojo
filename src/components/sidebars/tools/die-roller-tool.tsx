import React from 'react';

import Gygax from '../../../utils/gygax';

import { DieRollResult } from '../../../models/dice';

import DieRollPanel from '../../panels/die-roll-panel';
import DieRollResultPanel from '../../panels/die-roll-result-panel';

interface Props {
	dice: { [sides: number]: number };
	constant: number;
	setDie: (sides: number, count: number) => void;
	setConstant: (value: number) => void;
	resetDice: () => void;
}

interface State {
	results: DieRollResult[];
}

export default class DieRollerTool extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			results: []
		};
	}

	private rollDice(mode: '' | 'advantage' | 'disadvantage') {
		const result = Gygax.rollDice(this.props.dice, this.props.constant, mode);
		this.state.results.unshift(result);
		this.setState({
			results: this.state.results
		});
	}

	public render() {
		try {
			const results = this.state.results.map(result => <DieRollResultPanel key={result.id} result={result} />);

			return (
				<div>
					<DieRollPanel
						dice={this.props.dice}
						constant={this.props.constant}
						setDie={(sides, count) => this.props.setDie(sides, count)}
						setConstant={value => this.props.setConstant(value)}
						resetDice={() => this.props.resetDice()}
						rollDice={mode => this.rollDice(mode)}
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
