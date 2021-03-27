import { Progress } from 'antd';
import React from 'react';

import { Streep } from '../../utils/streep';
import { Comms } from '../../utils/uhura';
import { Utils } from '../../utils/utils';

import { RenderError } from '../error';
import { Expander } from '../controls/expander';
import { Note } from '../controls/note';
import { Selector } from '../controls/selector';
import { AwardPanel } from '../panels/award-panel';

interface Props {
}

interface State {
	selectedCategory: string | null;
}

export class AwardsPlayerSidebar extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			selectedCategory: null
		};
	}

	public setSelectedCategory(category: string | null) {
		this.setState({
			selectedCategory: (category === '') ? null : category
		});
	}

	public render() {
		try {
			if (!Comms.data.party) {
				return null;
			}

			const characterID = Comms.getCharacterID(Comms.getID());
			const pc = Comms.data.party.pcs.find(p => p.id === characterID);
			if (!pc) {
				return null;
			}

			const categoryOptions = Utils.arrayToItems(Streep.getCategories());
			categoryOptions.unshift({ id: '', text: 'all', disabled: false });

			const awards = Streep.getAwards().filter(award => (this.state.selectedCategory === null) || (award.category === this.state.selectedCategory));

			const awardsForMe = awards.filter(award => pc.awards.includes(award.id));
			const awardsForParty = awards.filter(award => Comms.data.party?.awards.includes(award.id));
			const otherAwards = awards.filter(award => !awardsForMe.includes(award) && !awardsForParty.includes(award));

			let forMeSection = (
				<Note>
					<div className='section'>no awards</div>
				</Note>
			);
			if (awardsForMe.length > 0) {
				forMeSection = (
					<div>
						{awardsForMe.map(award => <AwardPanel key={award.id} award={award} />)}
					</div>
				);
			}

			let forPartySection = (
				<Note>
					<div className='section'>no awards</div>
				</Note>
			);
			if (awardsForParty.length > 0) {
				forPartySection = (
					<div>
						{awardsForParty.map(award => <AwardPanel key={award.id} award={award} />)}
					</div>
				);
			}

			let otherSection = (
				<Note>
					<div className='section'>no awards</div>
				</Note>
			);
			if (otherAwards.length > 0) {
				otherSection = (
					<div>
						{otherAwards.map(award => <AwardPanel key={award.id} award={award} />)}
					</div>
				);
			}

			const achieved = awardsForMe.length + awardsForParty.length;
			const total = awards.length;

			return (
				<div className='sidebar-container'>
					<div className='sidebar-header'>
						<div className='heading'>awards</div>
						<Expander text='filter awards'>
							<Selector
								options={categoryOptions}
								selectedID={this.state.selectedCategory ?? ''}
								itemsPerRow={4}
								onSelect={category => this.setSelectedCategory(category)}
							/>
						</Expander>
					</div>
					<div className='sidebar-content'>
						<div className='section centered'>
							<Progress status='normal' percent={100 * achieved / total} type='circle' format={() => achieved + ' / ' + total} />
						</div>
						<hr/>
						<div className='subheading'>your awards</div>
						{forMeSection}
						<div className='subheading'>party awards</div>
						{forPartySection}
						<div className='subheading'>still to get</div>
						{otherSection}
					</div>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='AwardsPlayerSidebar' error={e} />;
		}
	}
}
