import { MinusCircleOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import React from 'react';

import { Frankenstein } from '../../utils/frankenstein';
import { Gygax } from '../../utils/gygax';

import { Monster, Trait } from '../../models/monster';

import { AbilityScorePanel } from '../panels/ability-score-panel';
import { PortraitPanel } from '../panels/portrait-panel';
import { TraitsPanel } from '../panels/traits-panel';

interface Props {
	monster: Monster;
	section: string;
	copyTrait: (trait: Trait) => void;
	deselectMonster: (monster: Monster) => void;
	showMonster: (monster: Monster) => void;
}

export class MonsterTemplateCard extends React.Component<Props> {
	private getAC() {
		let value = this.props.monster.ac.toString();
		if (this.props.monster.acInfo) {
			value += ' (' + this.props.monster.acInfo + ')';
		}
		return value;
	}

	private getHP() {
		const hp = Frankenstein.getTypicalHP(this.props.monster);
		const str = Frankenstein.getTypicalHPString(this.props.monster);
		return hp + ' (' + str + ')';
	}

	private statSection(text: string, value: string) {
		if (!value) {
			return null;
		}

		return (
			<div className='section'>
				<b>{text}</b> {value}
			</div>
		);
	}

	private getTags() {
		const tags = [];

		let sizeAndType = (this.props.monster.size + ' ' + this.props.monster.category).toLowerCase();
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
		switch (this.props.section) {
			case 'overview':
				return (
					<div>
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
					<div>
						<div className='section'>
							<AbilityScorePanel combatant={this.props.monster} />
						</div>
						{this.statSection('saving throws', this.props.monster.savingThrows)}
						{this.statSection('skills', this.props.monster.skills)}
					</div>
				);
			case 'combat':
				return (
					<div>
						{this.statSection('ac', this.getAC())}
						{this.statSection('hp', this.getHP())}
						{this.statSection('damage resistances', this.props.monster.damage.resist)}
						{this.statSection('damage vulnerabilities', this.props.monster.damage.vulnerable)}
						{this.statSection('damage immunities', this.props.monster.damage.immune)}
						{this.statSection('condition immunities', this.props.monster.conditionImmunities)}
					</div>
				);
			case 'features':
				return (
					<TraitsPanel
						combatant={this.props.monster}
						mode='template'
						copyTrait={trait => this.props.copyTrait(trait)}
					/>
				);
		}
	}

	public render() {
		const name = this.props.monster.name || 'unnamed monster';

		try {
			return (
				<div className='card monster'>
					<div className='heading'>
						<div className='title' title={name}>
							{name}
						</div>
						<MinusCircleOutlined onClick={() => this.props.deselectMonster(this.props.monster)} />
					</div>
					<div className='card-content'>
						{this.getStats()}
						<hr/>
						<button onClick={() => this.props.showMonster(this.props.monster)}>show full statblock</button>
					</div>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}