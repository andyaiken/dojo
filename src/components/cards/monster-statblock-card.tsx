import { MinusCircleOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import React from 'react';

import Frankenstein from '../../utils/frankenstein';
import Gygax from '../../utils/gygax';

import { Combatant } from '../../models/combat';
import { Encounter } from '../../models/encounter';
import { Monster, MonsterGroup, Trait } from '../../models/monster';

import AbilityScorePanel from '../panels/ability-score-panel';
import PortraitPanel from '../panels/portrait-panel';
import TraitsPanel from '../panels/traits-panel';

interface Props {
	monster: Monster | (Monster & Combatant);
	mode: 'full' | 'template';
	section: string;
	combat: boolean;
	showRollButtons: boolean;
	library: MonsterGroup[];
	encounters: Encounter[];
	copyTrait: (trait: Trait) => void;
	deselectMonster: (monster: Monster) => void;
	useTrait: (trait: Trait) => void;
	rechargeTrait: (trait: Trait) => void;
	onRollDice: (count: number, sides: number, constant: number) => void;
}

export default class MonsterStatblockCard extends React.Component<Props> {
	public static defaultProps = {
		mode: 'full',
		section: null,
		combat: false,
		showRollButtons: false,
		library: null,
		encounters: null,
		copyTrait: null,
		deselectMonster: null,
		useTrait: null,
		rechargeTrait: null,
		onRollDice: null
	};

	private getAC() {
		let value = this.props.monster.ac.toString();
		if (this.props.monster.acInfo) {
			value += ' (' + this.props.monster.acInfo + ')';
		}
		return value;
	}

	private getHP() {
		const combatant = this.props.monster as Monster & Combatant;
		if ((combatant.hpCurrent === null) || (combatant.hpCurrent === undefined)) {
			const hp = Frankenstein.getTypicalHP(this.props.monster);
			const str = Frankenstein.getTypicalHPString(this.props.monster);
			return hp + ' (' + str + ')';
		}

		const currentHP = combatant.hpCurrent ?? 0;
		const maxHP = combatant.hpMax ?? 0;
		const tempHP = combatant.hpTemp ?? 0;

		let current = currentHP.toString();
		if (tempHP > 0) {
			current += '+' + tempHP;
		}
		if ((maxHP > 0) && (currentHP !== maxHP)) {
			current += ' / ' + maxHP;
		}

		return current;
	}

	private statSection(text: string, value: string, showButtons: boolean = false) {
		if (!value) {
			return null;
		}

		let showText = true;
		let buttonSection = null;
		if (showButtons) {
			let remainingText = value;
			const buttons: JSX.Element[] = [];
			Array.from(value.matchAll(/([^,;:/]*)\s+([+-]?)\s*(\d+)/g))
				.forEach(exp => {
					const expression = exp[0];
					const sign = exp[2] || '+';
					const bonus = parseInt(exp[3], 10) * (sign === '+' ? 1 : -1);
					buttons.push(
						<button
							key={expression}
							className='link'
							onClick={() => this.props.onRollDice(1, 20, bonus)}
						>
							{expression}
						</button>
					);
					remainingText = remainingText.replace(expression, '');
				});
			showText = !!remainingText.match(/[a-zA-Z]/);
			buttonSection = (
				<div className='roll-buttons'>
					{buttons}
				</div>
			);
		}

		return (
			<div className='section'>
				<b>{text}</b> {showText ? value : null}
				{buttonSection}
			</div>
		);
	}

	private getTags() {
		const tags = [];

		let size = this.props.monster.size;
		const combatant = this.props.monster as Combatant;
		if (combatant) {
			size = combatant.displaySize || size;
		}
		let sizeAndType = (size + ' ' + this.props.monster.category).toLowerCase();
		if (this.props.monster.tag) {
			sizeAndType += ' (' + this.props.monster.tag.toLowerCase() + ')';
		}
		tags.push(<Tag key='tag-main'>{sizeAndType}</Tag>);

		if (this.props.monster.alignment) {
			tags.push(<Tag key='tag-align'>{this.props.monster.alignment.toLowerCase()}</Tag>);
		}

		tags.push(<Tag key='tag-cr'>cr {Gygax.challenge(this.props.monster.challenge)}</Tag>);

		return tags;
	}

	private getStats() {
		if (this.props.mode === 'template') {
			switch (this.props.section) {
				case 'overview':
					return (
						<div className='stats'>
							<PortraitPanel source={this.props.monster} />
							<div className='section centered'>
								{this.getTags()}
							</div>
							<hr/>
							{this.statSection('speed', this.props.monster.speed)}
							{this.statSection('senses', this.props.monster.senses)}
							{this.statSection('languages', this.props.monster.languages)}
							{this.statSection('equipment', this.props.monster.equipment)}
						</div>
					);
				case 'abilities':
					return (
						<div className='stats'>
							<div className='section'>
								<AbilityScorePanel combatant={this.props.monster} />
							</div>
							{this.statSection('saving throws', this.props.monster.savingThrows)}
							{this.statSection('skills', this.props.monster.skills)}
						</div>
					);
				case 'cbt-stats':
					return (
						<div className='stats'>
							{this.statSection('ac', this.getAC())}
							{this.statSection('hp', this.getHP())}
							{this.statSection('damage resistances', this.props.monster.damage.resist)}
							{this.statSection('damage vulnerabilities', this.props.monster.damage.vulnerable)}
							{this.statSection('damage immunities', this.props.monster.damage.immune)}
							{this.statSection('condition immunities', this.props.monster.conditionImmunities)}
						</div>
					);
				case 'actions':
					return (
						<TraitsPanel
							combatant={this.props.monster}
							mode='template'
							copyTrait={trait => this.props.copyTrait(trait)}
						/>
					);
			}
		}

		return (
			<div className='stats'>
				<PortraitPanel source={this.props.monster} />
				<div className='section centered'>
					{this.getTags()}
				</div>
				<hr/>
				<div className='section'>
					<AbilityScorePanel
						combatant={this.props.monster}
						showRollButtons={this.props.showRollButtons}
						onRollDice={(count, sides, constant) => this.props.onRollDice(count, sides, constant)}
					/>
				</div>
				{this.statSection('ac', this.getAC())}
				{this.statSection('hp', this.getHP())}
				{this.statSection('saving throws', this.props.monster.savingThrows, this.props.showRollButtons)}
				{this.statSection('skills', this.props.monster.skills, this.props.showRollButtons)}
				{this.statSection('speed', this.props.monster.speed)}
				{this.statSection('senses', this.props.monster.senses)}
				{this.statSection('damage resistances', this.props.monster.damage.resist)}
				{this.statSection('damage vulnerabilities', this.props.monster.damage.vulnerable)}
				{this.statSection('damage immunities', this.props.monster.damage.immune)}
				{this.statSection('condition immunities', this.props.monster.conditionImmunities)}
				{this.statSection('languages', this.props.monster.languages)}
				{this.statSection('equipment', this.props.monster.equipment)}
				<hr/>
				<TraitsPanel
					combatant={this.props.monster}
					mode={this.props.combat ? 'combat' : 'view'}
					showRollButtons={this.props.showRollButtons}
					useTrait={trait => this.props.useTrait(trait)}
					rechargeTrait={trait => this.props.rechargeTrait(trait)}
					onRollDice={(count, sides, constant) => this.props.onRollDice(count, sides, constant)}
				/>
			</div>
		);
	}

	private getIcon() {
		if (this.props.mode === 'template') {
			return (
				<MinusCircleOutlined onClick={() => this.props.deselectMonster(this.props.monster)} />
			);
		}

		return null;
	}

	public render() {
		try {
			const name = (this.props.monster as Combatant ? (this.props.monster as Combatant).displayName : null)
				|| this.props.monster.name
				|| 'unnamed monster';

			return (
				<div className='card monster'>
					<div className='heading'>
						<div className='title' title={name}>
							{name}
						</div>
						{this.getIcon()}
					</div>
					<div className='card-content'>
						{this.getStats()}
					</div>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
