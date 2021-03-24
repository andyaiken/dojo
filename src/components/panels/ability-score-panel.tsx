import { Popover } from 'antd';
import React from 'react';

import { Gygax } from '../../utils/gygax';

import { Monster } from '../../models/monster';

import { RenderError } from '../error';

interface Props {
	combatant: Monster;
	showRollButtons: boolean;
	onRollDice: (text: string, count: number, sides: number, constant: number, mode: '' | 'advantage' | 'disadvantage') => void;
}

interface State {
	showAbilityScores: boolean;
}

export class AbilityScorePanel extends React.Component<Props, State> {
	public static defaultProps = {
		showRollButtons: false,
		onRollDice: null
	};

	constructor(props: Props) {
		super(props);
		this.state = {
			showAbilityScores: false
		};
	}

	private toggleAbilityScores() {
		this.setState({
			showAbilityScores: !this.state.showAbilityScores
		});
	}

	private roll(e: React.MouseEvent, ability: 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha', mode: '' | 'advantage' | 'disadvantage') {
		e.stopPropagation();

		let abilityName = '';
		switch (ability) {
			case 'str':
				abilityName = 'strength';
				break;
			case 'dex':
				abilityName = 'dexterity';
				break;
			case 'con':
				abilityName = 'constitution';
				break;
			case 'int':
				abilityName = 'intelligence';
				break;
			case 'wis':
				abilityName = 'wisdom';
				break;
			case 'cha':
				abilityName = 'charisma';
				break;
		}

		const score = this.props.combatant.abilityScores[ability];
		const constant = Gygax.modifierValue(score);
		this.props.onRollDice(abilityName, 1, 20, constant, mode);
	}

	private getAbilityScore(ability: 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha') {
		const score = this.props.combatant.abilityScores[ability];
		const mod = Gygax.modifier(score);

		const content = (
			<div>
				<div className='ability-heading'>
					{ability}
				</div>
				<div className='ability-value'>
					<div>{this.state.showAbilityScores ? score : mod}</div>
				</div>
			</div>
		);

		if (this.props.showRollButtons) {
			return (
				<Popover
					content={(
						<div>
							<button onClick={e => this.roll(e, ability, 'advantage')}>adv</button>
							<button onClick={e => this.roll(e, ability, 'disadvantage')}>dis</button>
						</div>
					)}
					trigger='contextMenu'
				>
					<div className='ability-score link' onClick={e => this.roll(e, ability, '')} role='button'>
						{content}
					</div>
				</Popover>
			);
		} else {
			return (
				<div className='ability-score'>
					{content}
				</div>
			);
		}
	}

	public render() {
		try {
			return (
				<div className='ability-scores' onClick={() => this.toggleAbilityScores()} role='button'>
					{this.getAbilityScore('str')}
					{this.getAbilityScore('dex')}
					{this.getAbilityScore('con')}
					{this.getAbilityScore('int')}
					{this.getAbilityScore('wis')}
					{this.getAbilityScore('cha')}
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='AbilityScorePanel' error={e} />;
		}
	}
}
