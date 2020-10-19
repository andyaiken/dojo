import React from 'react';

import { Sherlock } from '../../../utils/sherlock';
import { Streep } from '../../../utils/streep';

import { Party, PC } from '../../../models/party';

import { AwardManagementPanel } from '../../panels/award-panel';
import { Note } from '../../panels/note';

interface Props {
	filterText: string;
	filterCategory: string | null;
	party: Party | null;
	addAward: (awardID: string, awardee: Party | PC) => void;
	deleteAward: (awardID: string, awardee: Party | PC) => void;
}

export class AwardsReference extends React.Component<Props> {
	public render() {
		try {
			const awards = Streep.getAwards()
				.filter(award => Sherlock.matchAward(this.props.filterText, award))
				.filter(award => (this.props.filterCategory === null) || (award.category === this.props.filterCategory));

			if (awards.length === 0) {
				return (
					<Note>
						<p>no awards</p>
					</Note>
				);
			}

			const list = awards.map(award => {
				return (
					<AwardManagementPanel
						key={award.id}
						award={award}
						party={this.props.party}
						addAward={(awardID, awardee) => this.props.addAward(awardID, awardee)}
						deleteAward={(awardID, awardee) =>  this.props.deleteAward(awardID, awardee)}
					/>
				);
			});

			return (
				<div>
					{list}
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}
