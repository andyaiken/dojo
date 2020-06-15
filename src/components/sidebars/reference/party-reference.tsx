import React from 'react';

import { Party } from '../../../models/party';

import Dropdown from '../../controls/dropdown';

interface Props {
	selectedPartyID: string | null;
	parties: Party[];
	selectPartyID: (id: string) => void;
}

export default class PartyReference extends React.Component<Props> {
	private getSummary() {
		const party = this.props.parties.find(p => p.id === this.props.selectedPartyID);
		if (!party) {
			return null;
		}

		const activePCs = party.pcs.filter(pc => pc.active);
		if (activePCs.length === 0) {
			return (
				<div className='section centered'>
					<i>no pcs</i>
				</div>
			);
		}

		const level = Math.round(activePCs.reduce((sum, current) => sum + current.level, 0) / activePCs.length);

		const languages = activePCs
			.map(pc => pc.languages.toLowerCase())
			.join(', ')
			.split(/[ ,;.:]+/)
			.reduce((array: string[], value) => {
				if (array.indexOf(value) === -1) {
					array.push(value);
				}
				return array;
			}, [])
			.sort((a, b) => {
				if (a === 'common') {
					return -1;
				}
				if (b === 'common') {
					return 1;
				}
				return a.localeCompare(b);
			})
			.map(lang => {
				const speakers = activePCs.filter(pc => pc.languages.toLowerCase().includes(lang));
				const pcs = speakers.length === activePCs.length ? 'all pcs' : speakers.map(pc => pc.name).join(', ');
				const langName = lang[0].toUpperCase() + lang.substr(1);
				return (
					<div key={langName} className='table-row'>
						<div className='table-cell l'>{langName}</div>
						<div className='table-cell l'>{pcs}</div>
					</div>
				);
			});

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
					<div className='table-cell small l'>{n}</div>
					<div className='table-cell'>{ins}</div>
					<div className='table-cell'>{inv}</div>
					<div className='table-cell'>{per}</div>
				</div>
			);
		}

		return (
			<div>
				<hr/>
				<div className='section subheading'>
					average level
				</div>
				<div className='section'>
					{level}
				</div>
				<div className='section subheading'>
					languages
				</div>
				<div className='table alternating'>
					{languages}
				</div>
				<div className='section subheading'>
					passive skills
				</div>
				<div className='table alternating'>
					<div className='table-row'>
						<div className='table-cell small l' />
						<div className='table-cell'><b>insight</b></div>
						<div className='table-cell'><b>invest.</b></div>
						<div className='table-cell'><b>percep.</b></div>
					</div>
					{rows}
				</div>
			</div>
		);
	}

	public render() {
		try {
			return (
				<div>
					<Dropdown
						options={this.props.parties.map(p => ({ id: p.id, text: p.name }))}
						placeholder='select a party...'
						selectedID={this.props.selectedPartyID}
						onSelect={id => this.props.selectPartyID(id)}
					/>
					{this.getSummary()}
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}
