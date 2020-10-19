import React from 'react';

import { Streep } from '../../utils/streep';

import { Monster } from '../../models/monster';
import { Party, PC } from '../../models/party';

import { Dropdown } from '../controls/dropdown';
import { Expander } from '../controls/expander';
import { Selector } from '../controls/selector';
import { Textbox } from '../controls/textbox';
import { Note } from '../panels/note';
import { AwardsReference } from './reference/awards-reference';
import { MarkdownReference } from './reference/markdown-reference';
import { MonsterReference } from './reference/monster-reference';
import { PartyReference } from './reference/party-reference';

interface Props {
	view: string;
	setView: (view: string) => void;
	// Party
	selectedPartyID: string | null;
	parties: Party[];
	selectPartyID: (id: string | null) => void;
	// Monster
	selectedMonsterID: string | null;
	monsters: Monster[];
	selectMonsterID: (id: string | null) => void;
	// Awards
	showAwards: boolean;
	addAward: (awardID: string, awardee: Party | PC) => void;
	deleteAward: (awardID: string, awardee: Party | PC) => void;
}

interface State {
	awardText: string;
	awardCategory: string | null;
	awardPartyID: string | null;
}

export class ReferenceSidebar extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			awardText: '',
			awardCategory: null,
			awardPartyID: null
		};
	}

	public setAwardText(text: string) {
		this.setState({
			awardText: text
		});
	}

	public setAwardCategory(category: string | null) {
		this.setState({
			awardCategory: (category === '') ? null : category
		});
	}

	public setAwardPartyID(id: string | null) {
		this.setState({
			awardPartyID: id
		});
	}

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
				}
			];

			if (this.props.parties.length > 0) {
				options.push({ id: 'party', text: 'party' });
			}

			if (this.props.monsters.length > 0) {
				options.push({ id: 'monster', text: 'monster' });
			}

			if (this.props.showAwards) {
				options.push({ id: 'awards', text: 'awards' });
			}

			const count = options.length === 6 ? 3 : 6;

			let header = null;
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
					header = (
						<Dropdown
							options={this.props.parties.map(p => ({ id: p.id, text: p.name }))}
							placeholder='select a party...'
							selectedID={this.props.selectedPartyID}
							onSelect={id => this.props.selectPartyID(id)}
							onClear={() => this.props.selectPartyID(null)}
						/>
					);
					content = (
						<PartyReference
							party={this.props.parties.find(p => p.id === this.props.selectedPartyID) ?? null}
						/>
					);
					break;
				case 'monster':
					header = (
						<Dropdown
							options={this.props.monsters.map(p => ({ id: p.id, text: p.name }))}
							placeholder='select a monster...'
							selectedID={this.props.selectedMonsterID}
							onSelect={id => this.props.selectMonsterID(id)}
							onClear={() => this.props.selectMonsterID(null)}
						/>
					);
					content = (
						<MonsterReference
							monster={this.props.monsters.find(m => m.id === this.props.selectedMonsterID) ?? null}
						/>
					);
					break;
				case 'awards':
					const categoryOptions = Streep.getCategories().map(o => ({ id: o, text: o }));
					categoryOptions.unshift({ id: '', text: 'all' });
					header = (
						<div>
							<Expander text='filter awards'>
								<Textbox
									text={this.state.awardText}
									placeholder='search'
									noMargins={true}
									onChange={text => this.setAwardText(text)}
								/>
								<Selector
									options={categoryOptions}
									selectedID={this.state.awardCategory ?? ''}
									itemsPerRow={4}
									onSelect={category => this.setAwardCategory(category)}
								/>
							</Expander>
							<Expander text='granting awards'>
								<Note>
									<p>to grant any of these awards, you need to select a party</p>
								</Note>
								<Dropdown
									placeholder='select a party...'
									options={this.props.parties.map(p => ({ id: p.id, text: p.name || 'unnamed party' }))}
									selectedID={this.state.awardPartyID}
									onSelect={id => this.setAwardPartyID(id)}
									onClear={() => this.setAwardPartyID(null)}
								/>
							</Expander>
						</div>
					);
					content = (
						<AwardsReference
							filterText={this.state.awardText}
							filterCategory={this.state.awardCategory}
							party={this.props.parties.find(p => p.id === this.state.awardPartyID) ?? null}
							addAward={(id, awardee) => this.props.addAward(id, awardee)}
							deleteAward={(id, awardee) => this.props.deleteAward(id, awardee)}
						/>
					);
					break;
			}

			return (
				<div className='sidebar-container'>
					<div className='sidebar-header'>
						<div className='heading'>reference</div>
						<Selector
							options={options}
							selectedID={this.props.view}
							itemsPerRow={count}
							onSelect={optionID => this.props.setView(optionID)}
						/>
						{header}
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
