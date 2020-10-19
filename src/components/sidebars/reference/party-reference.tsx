import { Progress, Tag } from 'antd';
import React from 'react';

import { Shakespeare } from '../../../utils/shakespeare';
import { Streep } from '../../../utils/streep';

import { Party } from '../../../models/party';

import { AwardPanel } from '../../panels/award-panel';
import { Note } from '../../panels/note';

interface Props {
	party: Party | null;
}

export class PartyReference extends React.Component<Props> {
	public render() {
		try {
			if (!this.props.party) {
				return null;
			}

			const activePCs = this.props.party.pcs.filter(pc => pc.active);
			if (activePCs.length === 0) {
				return (
					<div className='section centered'>
						<i>no pcs</i>
					</div>
				);
			}

			const level = Math.round(activePCs.reduce((sum, current) => sum + current.level, 0) / activePCs.length);

			const known = Shakespeare.getKnownLanguages(activePCs);
			const knownLanguages = known.map(lang => {
				const speakers = activePCs.filter(pc => pc.languages.toLowerCase().includes(lang.toLowerCase()));
				const pcs = speakers.length === activePCs.length ? 'all pcs' : speakers.map(pc => pc.name).join(', ');
				const langName = Shakespeare.capitalise(lang);
				return (
					<div key={langName} className='table-row'>
						<div className='table-cell l'>{langName}</div>
						<div className='table-cell l'>{pcs}</div>
					</div>
				);
			});
			const unknown = Shakespeare.getAllLanguages()
				.map(lang => Shakespeare.capitalise(lang))
				.filter(lang => !known.includes(lang));
			let unknownLanguages = null;
			if (unknown.length > 0) {
				unknownLanguages = (
					<div className='section'>
						<b>unknown languages</b>: {unknown.join(', ')}
					</div>
				);
			}

			const insight: { min: number, max: number } = { min: Number.MAX_VALUE, max: Number.MIN_VALUE };
			const invest: { min: number, max: number } = { min: Number.MAX_VALUE, max: Number.MIN_VALUE };
			const percep: { min: number, max: number } = { min: Number.MAX_VALUE, max: Number.MIN_VALUE };

			activePCs.forEach(pc => {
				insight.min = Math.min(insight.min, pc.passiveInsight);
				insight.max = Math.max(insight.max, pc.passiveInsight);
				invest.min = Math.min(invest.min, pc.passiveInvestigation);
				invest.max = Math.max(invest.max, pc.passiveInvestigation);
				percep.min = Math.min(percep.min, pc.passivePerception);
				percep.max = Math.max(percep.max, pc.passivePerception);
			});

			const min = Math.min(insight.min, invest.min, percep.min);
			const max = Math.max(insight.max, invest.max, percep.max);

			const rows = [];
			for (let n = max; n >= min; --n) {
				const ins = activePCs.filter(pc => pc.passiveInsight === n).map(pc => pc.name).join(', ');
				const inv = activePCs.filter(pc => pc.passiveInvestigation === n).map(pc => pc.name).join(', ');
				const per = activePCs.filter(pc => pc.passivePerception === n).map(pc => pc.name).join(', ');
				rows.push(
					<div key={n} className='table-row'>
						<div className='table-cell l small'>{n}</div>
						<div className='table-cell l'>{ins}</div>
						<div className='table-cell l'>{inv}</div>
						<div className='table-cell l'>{per}</div>
					</div>
				);
			}

			const list = Streep.getAwards().filter(award => {
				let achieved = false;

				if (this.props.party?.awards.includes(award.id)) {
					achieved = true;
				}

				this.props.party?.pcs.forEach(pc => {
					if (pc.awards.includes(award.id)) {
						achieved = true;
					}
				});

				return achieved;
			}).map(award => {
				const awardees = [];
				if (this.props.party?.awards.includes(award.id)) {
					awardees.push(this.props.party.name || 'unnamed party');
				}
				this.props.party?.pcs.forEach(pc => {
					if (pc.awards.includes(award.id)) {
						awardees.push(pc.name || 'unnamed pc');
					}
				});
				let awardeesSection = null;
				if (awardees.length > 0) {
					awardeesSection = (
						<div>
							<hr/>
							<div className='section'>
								awarded to:
								{awardees.map(awardee => <Tag key={awardee}>{awardee}</Tag>)}
							</div>
						</div>
					);
				}
				return (
					<AwardPanel key={award.id} award={award}>
						{awardeesSection}
					</AwardPanel>
				);
			});
			let awards = (
				<Note>
					<p>no awards yet</p>
				</Note>
			);
			if (list.length > 0) {
				awards = (
					<div>
						{list}
					</div>
				);
			}

			return (
				<div>
					<div className='section subheading'>
						average level
					</div>
					<div className='section'>
						<Progress percent={level * 5} status='normal' format={() => level} />
					</div>
					<hr/>
					<div className='section subheading'>
						languages
					</div>
					<div className='table alternating'>
						<div className='table-row table-row-header'>
							<div className='table-cell l'>language</div>
							<div className='table-cell l'>spoken by</div>
						</div>
						{knownLanguages}
					</div>
					{unknownLanguages}
					<hr/>
					<div className='section subheading'>
						passive skills
					</div>
					<div className='table alternating'>
						<div className='table-row table-row-header'>
							<div className='table-cell l small' />
							<div className='table-cell l'>insight</div>
							<div className='table-cell l'>investigation</div>
							<div className='table-cell l'>perception</div>
						</div>
						{rows}
					</div>
					<Note>
						<p>remember that advantage / disadvantage grants +/- 5 to passive rolls</p>
					</Note>
					<hr/>
					<div className='section subheading'>
						awards
					</div>
					{awards}
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}
