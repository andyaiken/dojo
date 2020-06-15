import { Col, Row } from 'antd';
import React from 'react';

import Napoleon from '../../utils/napoleon';
import Utils from '../../utils/utils';

import { Encounter } from '../../models/encounter';
import { Monster } from '../../models/monster';
import { Party } from '../../models/party';

import Dropdown from '../controls/dropdown';

interface Props {
	encounter: Encounter;
	parties: Party[];
	party: Party | null;
	getMonster: (monsterName: string, groupName: string) => Monster | null;
}

interface State {
	selectedPartyID: string | null;
}

export default class DifficultyChartPanel extends React.Component<Props, State> {
	public static defaultProps = {
		party: null
	};

	constructor(props: Props) {
		super(props);
		this.state = {
			selectedPartyID: props.party ? props.party.id : null
		};
	}

	private selectParty(partyID: string | null) {
		this.setState({
			selectedPartyID: partyID
		});
	}

	public render() {
		try {
			const monsterCount = Napoleon.getMonsterCount(this.props.encounter);
			const monsterXP = Napoleon.getEncounterXP(this.props.encounter, this.props.getMonster);
			const adjustedXP = Napoleon.getAdjustedEncounterXP(this.props.encounter, this.props.getMonster);

			const basicData = (
				<div>
					<hr/>
					<div className='section'>
						<Row>
							<Col span={16}>xp for this encounter</Col>
							<Col span={8} className='statistic-value'>{monsterXP} xp</Col>
						</Row>
					</div>
					<div className='section' style={{ display: (adjustedXP === monsterXP) ? 'none' : ''}}>
						<Row>
							<Col span={16}>effective xp for {monsterCount} monster(s)</Col>
							<Col span={8} className='statistic-value'>{adjustedXP} xp</Col>
						</Row>
					</div>
				</div>
			);

			let xpThresholds;
			let diffSection;
			const party = this.props.parties.find(p => p.id === this.state.selectedPartyID);
			if (party) {
				let xpEasy = 0;
				let xpMedium = 0;
				let xpHard = 0;
				let xpDeadly = 0;

				const pcs = party.pcs.filter(pc => pc.active);
				pcs.forEach(pc => {
					xpEasy += Utils.pcExperience(pc.level, 'easy');
					xpMedium += Utils.pcExperience(pc.level, 'medium');
					xpHard += Utils.pcExperience(pc.level, 'hard');
					xpDeadly += Utils.pcExperience(pc.level, 'deadly');
				});

				let difficulty = 'trivial';
				let adjustedDifficulty = 'trivial';
				if (adjustedXP > 0) {
					if (adjustedXP >= xpEasy) {
						difficulty = 'easy';
						adjustedDifficulty = 'easy';
					}
					if (adjustedXP >= xpMedium) {
						difficulty = 'medium';
						adjustedDifficulty = 'medium';
					}
					if (adjustedXP >= xpHard) {
						difficulty = 'hard';
						adjustedDifficulty = 'hard';
					}
					if (adjustedXP >= xpDeadly) {
						difficulty = 'deadly';
						adjustedDifficulty = 'deadly';
					}
					if ((xpDeadly > 0) && (adjustedXP >= (xpDeadly * 10))) {
						difficulty = 'tpk';
						adjustedDifficulty = 'tpk';
					}
					if ((xpDeadly > 0) && (adjustedXP >= (xpDeadly * 100))) {
						difficulty = 'dm with a grudge';
						adjustedDifficulty = 'dm with a grudge';
					}
					if ((xpDeadly > 0) && (adjustedXP >= (xpDeadly * 1000))) {
						difficulty = 'now you\'re just being silly';
						adjustedDifficulty = 'now you\'re just being silly';
					}

					if ((pcs.length < 3) || (pcs.length > 5)) {
						const small = pcs.length < 3;
						switch (difficulty) {
							case 'trivial':
								adjustedDifficulty = small ? 'easy' : 'trivial';
								break;
							case 'easy':
								adjustedDifficulty = small ? 'medium' : 'trivial';
								break;
							case 'medium':
								adjustedDifficulty = small ? 'hard' : 'easy';
								break;
							case 'hard':
								adjustedDifficulty = small ? 'deadly' : 'medium';
								break;
							case 'deadly':
								adjustedDifficulty = small ? 'deadly' : 'hard';
								break;
							default:
								adjustedDifficulty = '';
								break;
						}
					}
				}

				xpThresholds = (
					<div className='table'>
						<div className='table-row'>
							<div className='table-cell easy'><b>easy</b></div>
							<div className='table-cell medium'><b>medium</b></div>
							<div className='table-cell hard'><b>hard</b></div>
							<div className='table-cell deadly'><b>deadly</b></div>
						</div>
						<div className='table-row'>
							<div className='table-cell'>{xpEasy} xp</div>
							<div className='table-cell'>{xpMedium} xp</div>
							<div className='table-cell'>{xpHard} xp</div>
							<div className='table-cell'>{xpDeadly} xp</div>
						</div>
					</div>
				);

				const getLeft = (xp: number) => {
					const max = Math.max(adjustedXP, (xpDeadly * 1.2));
					return (100 * xp) / max;
				};

				const getRight = (xp: number) => {
					return 100 - getLeft(xp);
				};

				diffSection = (
					<div>
						<div className='difficulty-gauge'>
							<div className='bar-container'>
								<div className='bar trivial' style={{ left: '0', right: getRight(xpEasy) + '%' }} />
							</div>
							<div className='bar-container'>
								<div className='bar easy' style={{ left: getLeft(xpEasy) + '%', right: getRight(xpMedium) + '%' }} />
							</div>
							<div className='bar-container'>
								<div className='bar medium' style={{ left: getLeft(xpMedium) + '%', right: getRight(xpHard) + '%' }} />
							</div>
							<div className='bar-container'>
								<div className='bar hard' style={{ left: getLeft(xpHard) + '%', right: getRight(xpDeadly) + '%' }} />
							</div>
							<div className='bar-container'>
								<div className='bar deadly' style={{ left: getLeft(xpDeadly) + '%', right: '0' }} />
							</div>
							<div className='encounter-container'>
								<div className='encounter' style={{ left: (getLeft(adjustedXP) - 0.5) + '%' }} />
							</div>
						</div>
						{basicData}
						<div className='section'>
							<Row>
								<Col span={16}>difficulty for this party</Col>
								<Col span={8} className='statistic-value'>{difficulty}</Col>
							</Row>
						</div>
						<div className='section' style={{ display: (adjustedDifficulty === difficulty) ? 'none' : ''}}>
							<Row>
								<Col span={16}>effective difficulty for {pcs.length} pc(s)</Col>
								<Col span={8} className='statistic-value'>{adjustedDifficulty}</Col>
							</Row>
						</div>
					</div>
				);
			} else {
				diffSection = basicData;
			}

			let partySelection = null;
			if (!this.props.party) {
				const partyOptions = [];
				if (this.props.parties) {
					for (let n = 0; n !== this.props.parties.length; ++n) {
						const p = this.props.parties[n];
						partyOptions.push({
							id: p.id,
							text: p.name
						});
					}
				}

				partySelection = (
					<Dropdown
						options={partyOptions}
						placeholder='select party...'
						selectedID={this.state.selectedPartyID ? this.state.selectedPartyID : undefined}
						onSelect={optionID => this.selectParty(optionID)}
						onClear={() => this.selectParty(null)}
					/>
				);
			}

			if (partySelection) {
				return (
					<div className='group-panel'>
						<div className='subheading'>difficulty</div>
						{partySelection}
						{xpThresholds}
						{diffSection}
					</div>
				);
			}

			return (
				<div>
					{xpThresholds}
					{diffSection}
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}
