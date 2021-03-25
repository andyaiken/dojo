import { StarFilled, StarOutlined, ToTopOutlined } from '@ant-design/icons';
import { Popover } from 'antd';
import React from 'react';
import ReactMarkdown from 'react-markdown';

import { Frankenstein } from '../../utils/frankenstein';
import { Gygax } from '../../utils/gygax';

import { Combatant } from '../../models/combat';
import { Monster, Trait, TRAIT_TYPES } from '../../models/monster';

import { RenderError } from '../error';
import { ConfirmButton } from '../controls/confirm-button';
import { Dropdown } from '../controls/dropdown';
import { Note } from '../controls/note';
import { Textbox } from '../controls/textbox';
import { MarkdownEditor } from './markdown-editor';

interface TraitsPanelProps {
	combatant: Monster | (Combatant & Monster);
	mode: 'view' | 'template' | 'combat' | 'legendary' | 'lair';
	showRollButtons: boolean;
	copyTrait: (trait: Trait) => void;
	useTrait: (trait: Trait) => void;
	rechargeTrait: (trait: Trait) => void;
	onRollDice: (text: string, count: number, sides: number, constant: number, mode: '' | 'advantage' | 'disadvantage') => void;
}

export class TraitsPanel extends React.Component<TraitsPanelProps> {
	public static defaultProps = {
		mode: 'view',
		showRollButtons: false,
		copyTrait: null,
		useTrait: null,
		rechargeTrait: null,
		onRollDice: null
	};

	private createSection(traitsByType: { [id: string]: JSX.Element[] }, type: string) {
		const traits = traitsByType[type];
		if (traits.length === 0) {
			return null;
		}

		let info = null;
		if ((this.props.mode === 'legendary') || (this.props.mode === 'lair')) {
			switch (type) {
				case 'legendary':
				case 'mythic':
					let count = null;
					let usage = null;
					if (this.props.combatant.legendaryActions > 0) {
						count = (
							<div>
								<div className='section'><b>{this.props.combatant.legendaryActions}</b> legendary actions per round</div>
								<hr/>
							</div>
						);
						if (this.props.mode === 'legendary') {
							let used = 0;
							this.props.combatant.traits.filter(t => ((t.type === 'legendary') || (t.type === 'mythic')) && (t.uses > 0)).forEach(t => {
								let value = 1;
								if (t.usage) {
									// Action usage might be: '[costs|counts as] N [legendary actions|actions]'
									const found = t.usage.toLowerCase().match(/\D*(\d*)\D*/);
									if (found) {
										value = parseInt(found[1], 10);
									}
								}
								used += value;
							});
							used = Math.min(used, this.props.combatant.legendaryActions);
							const unused = Math.max(this.props.combatant.legendaryActions - used, 0);
							const icons = [];
							for (let n = 0; n !== used; ++n) {
								icons.push(
									<StarFilled key={'used ' + n} />
								);
							}
							for (let n = 0; n !== unused; ++n) {
								icons.push(
									<StarOutlined key={'unused ' + n} />
								);
							}
							usage = (
								<div>
									<hr/>
									<div className='section centered legendary-usage'>
										{icons}
									</div>
								</div>
							);
						}
					}
					if (type === 'legendary') {
						info = (
							<Note>
								{count}
								<div className='section'>
									one legendary action can be used at the end of each other combatant's turn; spent actions are refreshed at the start of the monster's turn
								</div>
								{usage}
							</Note>
						);
					}
					if (type === 'mythic') {
						info = (
							<Note>
								<div className='section'>
									while the monster's mythic trait is active, the following can be used as legendary actions
								</div>
							</Note>
						);
					}
					break;
				case 'lair':
					info = (
						<Note>
							<div className='section'>
								one lair action can be taken each round on initiative 20
							</div>
						</Note>
					);
					break;
			}
		} else {
			if (type === 'legendary') {
				info = (
					<Note>
						<div className='section'>
							<b>{this.props.combatant.legendaryActions}</b> legendary actions per round
						</div>
					</Note>
				);
			}
			if (type === 'mythic') {
				info = (
					<Note>
						<div className='section'>
							while the monster's mythic trait is active, the following can be used as legendary actions
						</div>
					</Note>
				);
			}
		}

		return (
			<div>
				<div className='section subheading'>{Gygax.traitType(type, true)}</div>
				{info}
				{traits}
			</div>
		);
	}

	public render() {
		try {
			const traitsByType: { [id: string]: JSX.Element[] } = {};
			TRAIT_TYPES.forEach(type => {
				traitsByType[type] = this.props.combatant.traits.filter(t => t.type === type).map(trait => (
					<TraitPanel
						key={trait.id}
						trait={trait}
						mode={this.props.mode}
						showRollButtons={this.props.showRollButtons}
						copyTrait={action => this.props.copyTrait(action)}
						useTrait={action => this.props.useTrait(action)}
						rechargeTrait={action => this.props.rechargeTrait(action)}
						onRollDice={(text, count, sides, constant, mode) => this.props.onRollDice(text, count, sides, constant, mode)}
					/>
				));
			});

			if (this.props.combatant.traits.length === 0) {
				return (
					<div><i>no traits or actions</i></div>
				);
			}

			if (this.props.mode === 'combat') {
				return (
					<div>
						{this.createSection(traitsByType, 'trait')}
						{this.createSection(traitsByType, 'action')}
						{this.createSection(traitsByType, 'bonus')}
						{this.createSection(traitsByType, 'reaction')}
					</div>
				);
			}

			if (this.props.mode === 'legendary') {
				return (
					<div>
						{this.createSection(traitsByType, 'legendary')}
						{this.createSection(traitsByType, 'mythic')}
					</div>
				);
			}

			if (this.props.mode === 'lair') {
				return (
					<div>
						{this.createSection(traitsByType, 'lair')}
					</div>
				);
			}

			return (
				<div>
					{this.createSection(traitsByType, 'trait')}
					{this.createSection(traitsByType, 'action')}
					{this.createSection(traitsByType, 'bonus')}
					{this.createSection(traitsByType, 'reaction')}
					{this.createSection(traitsByType, 'legendary')}
					{this.createSection(traitsByType, 'mythic')}
					{this.createSection(traitsByType, 'lair')}
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='TraitsPanel' error={e} />;
		}
	}
}

interface TraitPanelProps {
	trait: Trait;
	mode: 'view' | 'template' | 'combat' | 'legendary' | 'lair';
	showRollButtons: boolean;
	copyTrait: (trait: Trait) => void;
	useTrait: (trait: Trait) => void;
	rechargeTrait: (trait: Trait) => void;
	onRollDice: (text: string, count: number, sides: number, constant: number, mode: '' | 'advantage' | 'disadvantage') => void;
}

export class TraitPanel extends React.Component<TraitPanelProps> {
	public static defaultProps = {
		mode: 'view',
		showRollButtons: false,
		copyTrait: null,
		useTrait: null,
		rechargeTrait: null,
		onRollDice: null
	};

	public render() {
		try {
			let maxUses = 0;
			let heading = this.props.trait.name || 'unnamed ' + Gygax.traitType(this.props.trait.type, false);

			if (this.props.trait.usage) {
				let used = '';
				if (this.props.trait.usage.toLowerCase().startsWith('recharge ')) {
					maxUses = 1;
					if (this.props.trait.uses > 0) {
						used = '; used';
					}
				}
				const found = this.props.trait.usage.toLowerCase().match(/(\d+)\s*\/\s*day/);
				if (found) {
					maxUses = parseInt(found[1], 10);
					if (this.props.trait.uses > 0) {
						used = '; used ' + this.props.trait.uses;
					}
				}
				heading += ' *(' + this.props.trait.usage + used + ')*';
			}
			if ((this.props.trait.type === 'legendary') || (this.props.trait.type === 'mythic')) {
				maxUses = 1;
				if (this.props.trait.uses > 0) {
					heading += ' *(used)*';
				}
			}
			const markdown = '**' + heading + '** ' + this.props.trait.text;

			switch (this.props.mode) {
				case 'view':
					return (
						<div key={this.props.trait.id} className='section trait'>
							<ReactMarkdown source={markdown} />
						</div>
					);
				case 'template':
					return (
						<div key={this.props.trait.id} className='section trait trait-template'>
							<ToTopOutlined className='trait-template-button' rotate={270} title='import' onClick={() => this.props.copyTrait(this.props.trait)} />
							<div className='trait-template-details'>
								<ReactMarkdown source={markdown} />
							</div>
						</div>
					);
				case 'combat':
				case 'legendary':
				case 'lair':
					let style = '';
					const buttons = [];
					if (maxUses > 0) {
						if (this.props.trait.uses >= maxUses) {
							style = 'strikethrough';
							buttons.push(
								<button key='use' className='link' onClick={() => this.props.rechargeTrait(this.props.trait)}>recharge</button>
							);
						} else {
							buttons.push(
								<button key='use' className='link' onClick={() => this.props.useTrait(this.props.trait)}>use</button>
							);
						}
					}
					if (this.props.showRollButtons) {
						Frankenstein.getToHitExpressions(this.props.trait)
							.forEach(exp => {
								buttons.push(
									<Popover
										key={exp.expression}
										content={(
											<div>
												<button onClick={e => this.props.onRollDice(this.props.trait.name, 1, 20, exp.bonus, 'advantage')}>adv</button>
												<button onClick={e => this.props.onRollDice(this.props.trait.name, 1, 20, exp.bonus, 'disadvantage')}>dis</button>
											</div>
										)}
										trigger='contextMenu'
									>
										<button
											className='link'
											onClick={() => this.props.onRollDice(this.props.trait.name, 1, 20, exp.bonus, '')}
										>
											{exp.expression}
										</button>
									</Popover>
								);
							});
						Frankenstein.getDiceExpressions(this.props.trait)
							.forEach(exp => {
								buttons.push(
									<button
										key={exp.expression}
										className='link'
										onClick={() => this.props.onRollDice(this.props.trait.name, exp.count, exp.sides, exp.bonus, '')}
									>
										{exp.expression}
									</button>
								);
							});
					}
					let buttonSection = null;
					if (buttons.length > 0) {
						buttonSection = (
							<div className='trait-buttons'>
								{buttons}
							</div>
						);
					}
					return (
						<div key={this.props.trait.id} className='section trait'>
							<div className={style}>
								<ReactMarkdown source={markdown} />
							</div>
							{buttonSection}
						</div>
					);
			}
		} catch (e) {
			console.error(e);
			return <RenderError context='TraitPanel' error={e} />;
		}
	}
}

interface TraitEditorPanelProps {
	trait: Trait;
	copyTrait: (trait: Trait) => void;
	deleteTrait: (trait: Trait) => void;
	changeValue: (trait: Trait, field: string, value: any) => void;
}

export class TraitEditorPanel extends React.Component<TraitEditorPanelProps> {
	public render() {
		try {
			return (
				<div key={this.props.trait.id} className='section'>
					<div className='subheading'>feature name</div>
					<Textbox
						text={this.props.trait.name}
						onChange={value => this.props.changeValue(this.props.trait, 'name', value)}
					/>
					<div className='subheading'>usage</div>
					<Textbox
						text={this.props.trait.usage}
						onChange={value => this.props.changeValue(this.props.trait, 'usage', value)}
					/>
					<div className='subheading'>details</div>
					<MarkdownEditor text={this.props.trait.text} onChange={text => this.props.changeValue(this.props.trait, 'text', text)} />
					<hr/>
					<Dropdown
						placeholder='move to...'
						options={TRAIT_TYPES.map(t => ({ id: t, text: Gygax.traitType(t, true), disabled: this.props.trait.type === t }))}
						onSelect={id => this.props.changeValue(this.props.trait, 'type', id)}
					/>
					<hr/>
					<button onClick={() => this.props.copyTrait(this.props.trait)}>create a copy of this feature</button>
					<ConfirmButton onConfirm={() => this.props.deleteTrait(this.props.trait)}>delete this feature</ConfirmButton>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='TraitEditorPanel' error={e} />;
		}
	}
}
