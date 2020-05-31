import React from 'react';

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
	setDie: (sides: number, count: number) => void;
	setConstant: (value: number) => void;
	resetDice: () => void;
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
							setDie={(sides, count) => this.props.setDie(sides, count)}
							setConstant={value => this.props.setConstant(value)}
							resetDice={() => this.props.resetDice()}
						/>
					);
					break;
				case 'handout':
					content = (
						<HandoutTool />
					);
					break;
				case 'language':
					content = (
						<LanguageTool />
					);
					break;
				case 'oracle':
					content = (
						<OracleTool />
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
							itemsPerRow={4}
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
