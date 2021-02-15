import { Progress } from 'antd';
import React from 'react';

import { Streep } from '../../utils/streep';
import { Comms } from '../../utils/uhura';

import { Expander } from '../controls/expander';
import { Selector } from '../controls/selector';
import { AwardPanel } from '../panels/award-panel';
import { RenderError } from '../panels/error-boundary';
import { Note } from '../panels/note';

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

			const categoryOptions = Streep.getCategories().map(o => ({ id: o, text: o }));
			categoryOptions.unshift({ id: '', text: 'all' });

			const awards = Streep.getAwards().filter(award => (this.state.selectedCategory === null) || (award.category === this.state.selectedCategory));

			const awardsForMe = awards.filter(award => pc.awards.includes(award.id));
			const awardsForParty = awards.filter(award => Comms.data.party?.awards.includes(award.id));
			const otherAwards = awards.filter(award => !awardsForMe.includes(award) && !awardsForParty.includes(award));

			let forMeSection = (
				<Note>
					<p>no awards</p>
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
					<p>no awards</p>
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
					<p>no awards</p>
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
			return <RenderError error={e} />;
		}
	}
}
