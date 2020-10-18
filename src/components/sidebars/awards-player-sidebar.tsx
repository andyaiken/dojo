import React from 'react';

import { Streep } from '../../utils/streep';
import { Comms } from '../../utils/uhura';

import { AwardPanel } from '../panels/award-panel';
import { Note } from '../panels/note';

interface Props {
}

interface State {
}

export class AwardsPlayerSidebar extends React.Component<Props, State> {
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

			let forMe = (
				<Note>
					<p>no awards</p>
				</Note>
			);
			if (pc.awards.length > 0) {
				forMe = (
					<div>
						{pc.awards.map(awardID => {
							const award = Streep.getAward(awardID);
							if (!award) {
								return null;
							}
							return (
								<AwardPanel key={award.id} award={award} />
							);
						})}
					</div>
				);
			}

			let forParty = (
				<Note>
					<p>no awards</p>
				</Note>
			);
			if (pc.awards.length > 0) {
				forParty = (
					<div>
						{Comms.data.party.awards.map(awardID => {
							const award = Streep.getAward(awardID);
							if (!award) {
								return null;
							}
							return (
								<AwardPanel key={award.id} award={award} />
							);
						})}
					</div>
				);
			}

			const otherAwards = Streep.getAwards()
				.filter(award => !pc.awards.includes(award.id))
				.filter(award => !Comms.data.party?.awards.includes(award.id));
			let others = (
				<Note>
					<p>no awards</p>
				</Note>
			);
			if (otherAwards.length > 0) {
				others = (
					<div>
						{otherAwards.map(award => {
							return (
								<AwardPanel key={award.id} award={award} />
							);
						})}
					</div>
				);
			}

			return (
				<div className='sidebar-container'>
					<div className='sidebar-header'>
						<div className='heading'>awards</div>
					</div>
					<div className='sidebar-content'>
						<div className='subheading'>your awards</div>
						{forMe}
						<div className='subheading'>party awards</div>
						{forParty}
						<div className='subheading'>still to get</div>
						{others}
					</div>
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}
