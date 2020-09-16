import React from 'react';

import { DieRollResult } from '../../models/dice';
import { CardDraw, Handout } from '../../models/misc';

import Selector from '../controls/selector';
import DieRollerTool from './tools/die-roller-tool';
import HandoutTool from './tools/handout-tool';
import LanguageTool from './tools/language-tool';
import OracleTool from './tools/oracle-tool';

interface Props {
	view: string;
	setView: (view: string) => void;
	// Dice
	dice: { [sides: number]: number };
	constant: number;
	dieRolls: DieRollResult[];
	setDie: (sides: number, count: number) => void;
	setConstant: (value: number) => void;
	rollDice: (mode: '' | 'advantage' | 'disadvantage') => void;
	resetDice: () => void;
	// Handout
	handout: Handout | null;
	setHandout: (handout: Handout | null) => void;
	// Language
	languagePreset: string | null;
	selectedLanguages: string[];
	languageOutput: string[];
	selectLanguagePreset: (language: string) => void;
	addLanguage: (language: string) => void;
	removeLanguage: (language: string) => void;
	selectRandomLanguages: () => void;
	resetLanguages: () => void;
	generateLanguage: () => void;
	// Oracle
	draws: CardDraw[];
	drawCards: (count: number) => void;
}

export default class ToolsSidebar extends React.Component<Props> {
	public render() {
		try {
			const options = [
				{
					id: 'die',
					text: 'die roller'
				},
				{
					id: 'handout',
					text: 'handout'
				},
				{
					id: 'language',
					text: 'language'
				},
				{
					id: 'oracle',
					text: 'oracle'
				}
			];

			let content = null;
			switch (this.props.view) {
				case 'die':
					content = (
						<DieRollerTool
							dice={this.props.dice}
							constant={this.props.constant}
							dieRolls={this.props.dieRolls}
							setDie={(sides, count) => this.props.setDie(sides, count)}
							setConstant={value => this.props.setConstant(value)}
							rollDice={mode => this.props.rollDice(mode)}
							resetDice={() => this.props.resetDice()}
						/>
					);
					break;
				case 'handout':
					content = (
						<HandoutTool
							handout={this.props.handout}
							setHandout={handout => this.props.setHandout(handout)}
						/>
					);
					break;
				case 'language':
					content = (
						<LanguageTool
							languagePreset={this.props.languagePreset}
							selectedLanguages={this.props.selectedLanguages}
							output={this.props.languageOutput}
							selectLanguagePreset={preset => this.props.selectLanguagePreset(preset)}
							addLanguage={language => this.props.addLanguage(language)}
							removeLanguage={language => this.props.removeLanguage(language)}
							selectRandomLanguages={() => this.props.selectRandomLanguages()}
							resetLanguages={() => this.props.resetLanguages()}
							generateLanguage={() => this.props.generateLanguage()}
						/>
					);
					break;
				case 'oracle':
					content = (
						<OracleTool
							draws={this.props.draws}
							drawCards={count => this.props.drawCards(count)}
						/>
					);
					break;
			}

			return (
				<div className='sidebar-container'>
					<div className='sidebar-header'>
						<div className='heading'>tools</div>
						<Selector
							options={options}
							selectedID={this.props.view}
							onSelect={optionID => this.props.setView(optionID)}
						/>
					</div>
					<div className='sidebar-content'>
						{content}
					</div>
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}
