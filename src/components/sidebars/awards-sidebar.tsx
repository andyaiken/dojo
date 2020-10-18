import React from 'react';

import { Sherlock } from '../../utils/sherlock';
import { Streep } from '../../utils/streep';
import { Utils } from '../../utils/utils';

import { Party, PC } from '../../models/party';

import { Dropdown } from '../controls/dropdown';
import { Expander } from '../controls/expander';
import { Selector } from '../controls/selector';
import { Textbox } from '../controls/textbox';
import { AwardManagementPanel } from '../panels/award-panel';
import { Note } from '../panels/note';

interface Props {
	parties: Party[];
	addAward: (awardID: string, awardee: Party | PC) => void;
	deleteAward: (awardID: string, awardee: Party | PC) => void;
}

interface State {
	text: string;
	selectedCategory: string | null;
	selectedPartyID: string | null;
}

export class AwardsSidebar extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			text: '',
			selectedCategory: null,
			selectedPartyID: null
		};
	}

	public setText(text: string) {
		this.setState({
			text: text
		});
	}

	public setSelectedCategory(category: string | null) {
		this.setState({
			selectedCategory: (category === '') ? null : category
		});
	}

	public setSelectedPartyID(id: string | null) {
		this.setState({
			selectedPartyID: id
		});
	}

	public render() {
		try {
			const categoryOptions = Streep.getCategories().map(o => ({ id: o, text: o }));
			categoryOptions.unshift({ id: '', text: 'all' });

			const awards = Streep.getAwards()
				.filter(award => Sherlock.matchAward(this.state.text, award))
				.filter(award => {
					if (this.state.selectedCategory === null) {
						return true;
					}

					return (award.category === this.state.selectedCategory);
				});
			Utils.sort(awards);

			const list = awards.map(award => {
				const party = this.props.parties.find(p => p.id === this.state.selectedPartyID) ?? null;
				return (
					<AwardManagementPanel
						key={award.id}
						award={award}
						party={party}
						addAward={(awardID, awardee) => this.props.addAward(awardID, awardee)}
						deleteAward={(awardID, awardee) =>  this.props.deleteAward(awardID, awardee)}
					/>
				);
			});
			if (list.length === 0) {
				list.push(
					<Note>
						<p>no awards</p>
					</Note>
				);
			}

			return (
				<div className='sidebar-container'>
					<div className='sidebar-header'>
						<div className='heading'>awards</div>
						<Expander text='filter awards'>
							<Textbox
								text={this.state.text}
								placeholder='search'
								noMargins={true}
								onChange={text => this.setText(text)}
							/>
							<Selector
								options={categoryOptions}
								selectedID={this.state.selectedCategory ?? ''}
								itemsPerRow={4}
								onSelect={category => this.setSelectedCategory(category)}
							/>
						</Expander>
						<Dropdown
							placeholder='select a party...'
							options={this.props.parties.map(p => ({ id: p.id, text: p.name || 'unnamed party' }))}
							selectedID={this.state.selectedPartyID}
							onSelect={id => this.setSelectedPartyID(id)}
							onClear={() => this.setSelectedPartyID(null)}
						/>
					</div>
					<div className='sidebar-content'>
						{list}
					</div>
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}
