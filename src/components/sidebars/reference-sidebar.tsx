import React from 'react';

import { Monster } from '../../models/monster';
import { Party } from '../../models/party';

import Selector from '../controls/selector';
import MarkdownReference from './reference/markdown-reference';
import MonsterReference from './reference/monster-reference';
import PartyReference from './reference/party-reference';

interface Props {
	view: string;
	setView: (view: string) => void;
	// Party
	selectedPartyID: string | null;
	parties: Party[];
	selectPartyID: (id: string) => void;
	// Monster
	selectedMonsterID: string | null;
	monsters: Monster[];
	selectMonsterID: (id: string) => void;
}

export default class ReferenceSidebar extends React.Component<Props> {
	public render() {
		try {
			const options = [
				{
					id: 'skills',
					text: 'skills'
				},
				{
					id: 'conditions',
					text: 'conditions'
				},
				{
					id: 'actions',
					text: 'actions'
				},
				{
					id: 'party',
					text: 'party'
				},
				{
					id: 'monster',
					text: 'monster'
				}
			];

			let content = null;
			switch (this.props.view) {
				case 'skills':
					content = (
						<MarkdownReference key='skills' filename='/dojo/data/skills.md' />
					);
					break;
				case 'conditions':
					content = (
						<MarkdownReference key='conditions' filename='/dojo/data/conditions.md' />
					);
					break;
				case 'actions':
					content = (
						<MarkdownReference key='actions' filename='/dojo/data/actions.md' />
					);
					break;
				case 'party':
					content = (
						<PartyReference
							selectedPartyID={this.props.selectedPartyID}
							parties={this.props.parties}
							selectPartyID={id => this.props.selectPartyID(id)}
						/>
					);
					break;
				case 'monster':
					content = (
						<MonsterReference
							selectedMonsterID={this.props.selectedMonsterID}
							monsters={this.props.monsters}
							selectMonsterID={id => this.props.selectMonsterID(id)}
						/>
					);
					break;
			}

			return (
				<div className='sidebar-container'>
					<div className='sidebar-header'>
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
