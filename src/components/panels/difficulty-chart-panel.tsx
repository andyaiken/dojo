import { Col, Row } from 'antd';
import React from 'react';

import { Factory } from '../../utils/factory';
import { Napoleon } from '../../utils/napoleon';

import { Encounter } from '../../models/encounter';
import { Monster } from '../../models/monster';
import { Party } from '../../models/party';

import { RenderError } from '../error';
import { Conditional } from '../controls/conditional';
import { Dropdown } from '../controls/dropdown';
import { NumberSpin } from '../controls/number-spin';

interface Props {
	encounter: Encounter;
	parties: Party[];
	party: Party | null;
	getMonster: (id: string) => Monster | null;
}

interface State {
	selectedPartyID: string | null;
	selectedWaveID: string | null;
	customPartySize: number;
	customPartyLevel: number;
}

export class DifficultyChartPanel extends React.Component<Props, State> {
	public static defaultProps = {
		parties: [],
		party: null
	};

	constructor(props: Props) {
		super(props);

		let party = props.party;
		if (!party) {
			if (props.parties.length === 1) {
				party = props.parties[0];
			}
		}

		this.state = {
			selectedPartyID: party ? party.id : null,
			selectedWaveID: null,
			customPartySize: 5,
			customPartyLevel: 1
		};
	}

	private selectParty(partyID: string | null) {
		this.setState({
			selectedPartyID: partyID
		});
	}

	private setWave(waveID: string | null) {
		this.setState({
			selectedWaveID: waveID
		});
	}

	public render() {
		try {
			const monsterCount = Napoleon.getMonsterCount(this.props.encounter, this.state.selectedWaveID);
			const monsterXP = Napoleon.getEncounterXP(this.props.encounter, this.state.selectedWaveID, this.props.getMonster);
			const adjustedXP = Napoleon.getAdjustedEncounterXP(this.props.encounter, this.state.selectedWaveID, this.props.getMonster);

			let waveSelection = null;
			if (this.props.encounter.waves.length > 0) {
				const options = [
					{ id: this.props.encounter.id, text: 'encounter' }
				];
				this.props.encounter.waves.forEach(wave => {
					options.push({ id: wave.id, text: wave.name || 'unnamed wave' });
				});
				waveSelection = (
					<div>
						<hr/>
						<Dropdown
							placeholder='encounter plus all waves'
							options={options}
							selectedID={this.state.selectedWaveID}
							onSelect={id => this.setWave(id)}
							onClear={() => this.setWave(null)}
						/>
					</div>
				);
			}

			const basicData = (
				<div>
					{waveSelection}
					<hr/>
					<div className='section'>
						<Row>
							<Col span={16}>xp for these monsters</Col>
							<Col span={8} className='right-value'>{monsterXP} xp</Col>
						</Row>
					</div>
					<Conditional display={adjustedXP !== monsterXP}>
						<div className='section'>
							<Row>
								<Col span={16}>effective xp for {monsterCount} monster(s)</Col>
								<Col span={8} className='right-value'>{adjustedXP} xp</Col>
							</Row>
						</div>
					</Conditional>
				</div>
			);

			let party: Party | null = this.props.party;
			if (party === null) {
				if (this.state.selectedPartyID === 'custom') {
					party = Factory.createParty();
					for (let n = 0; n !== this.state.customPartySize; ++n) {
						const pc = Factory.createPC();
						pc.level = this.state.customPartyLevel;
						party.pcs.push(pc);
					}
				} else {
					party = this.props.parties.find(p => p.id === this.state.selectedPartyID) ?? null;
				}
			}

			let xpThresholds;
			let diffSection;
			if (party) {
				const thresholds = Napoleon.getEncounterThresholds(party);
				const difficulty = Napoleon.getEncounterDifficulty(this.props.encounter, this.state.selectedWaveID, party, this.props.getMonster);

				xpThresholds = (
					<div className='table'>
						<div className='table-row'>
							<div className='table-cell easy'><b>easy</b></div>
							<div className='table-cell medium'><b>medium</b></div>
							<div className='table-cell hard'><b>hard</b></div>
							<div className='table-cell deadly'><b>deadly</b></div>
						</div>
						<div className='table-row'>
							<div className='table-cell'>{thresholds.easy} xp</div>
							<div className='table-cell'>{thresholds.medium} xp</div>
							<div className='table-cell'>{thresholds.hard} xp</div>
							<div className='table-cell'>{thresholds.deadly} xp</div>
						</div>
					</div>
				);

				const getLeft = (xp: number) => {
					const max = Math.max(adjustedXP, (thresholds.deadly * 1.2));
					return (100 * xp) / max;
				};

				const getRight = (xp: number) => {
					return 100 - getLeft(xp);
				};

				diffSection = (
					<div>
						<div className='difficulty-gauge'>
							<div className='bar-container'>
								<div className='bar trivial' style={{ left: '0', right: getRight(thresholds.easy) + '%' }} />
							</div>
							<div className='bar-container'>
								<div className='bar easy' style={{ left: getLeft(thresholds.easy) + '%', right: getRight(thresholds.medium) + '%' }} />
							</div>
							<div className='bar-container'>
								<div className='bar medium' style={{ left: getLeft(thresholds.medium) + '%', right: getRight(thresholds.hard) + '%' }} />
							</div>
							<div className='bar-container'>
								<div className='bar hard' style={{ left: getLeft(thresholds.hard) + '%', right: getRight(thresholds.deadly) + '%' }} />
							</div>
							<div className='bar-container'>
								<div className='bar deadly' style={{ left: getLeft(thresholds.deadly) + '%', right: '0' }} />
							</div>
							<div className='encounter-container'>
								<div className='encounter' style={{ left: (getLeft(adjustedXP) - 0.5) + '%' }} />
							</div>
						</div>
						{basicData}
						<div className='section'>
							<Row>
								<Col span={16}>difficulty for this party</Col>
								<Col span={8} className='right-value'>{Napoleon.getDifficultyDescription(difficulty.basic)}</Col>
							</Row>
						</div>
						<Conditional display={difficulty.adjusted !== difficulty.basic}>
							<div className='section'>
								<Row>
									<Col span={16}>effective difficulty for {party.pcs.filter(pc => pc.active).length} pc(s)</Col>
									<Col span={8} className='right-value'>{Napoleon.getDifficultyDescription(difficulty.adjusted)}</Col>
								</Row>
							</div>
						</Conditional>
					</div>
				);
			} else {
				diffSection = basicData;
			}

			if (!this.props.party) {
				const partyOptions = this.props.parties.map(p => ({ id: p.id, text: p.name || 'unnamed party' }));
				partyOptions.push({
					id: 'custom',
					text: 'custom party'
				});

				let customPartySection = null;
				if (this.state.selectedPartyID === 'custom') {
					customPartySection = (
						<div>
							<NumberSpin
								value={this.state.customPartySize}
								label='party size'
								downEnabled={this.state.customPartySize > 1}
								onNudgeValue={delta => this.setState({ customPartySize: this.state.customPartySize + delta })}
							/>
							<NumberSpin
								value={this.state.customPartyLevel}
								label='party level'
								downEnabled={this.state.customPartyLevel > 1}
								upEnabled={this.state.customPartyLevel < 20}
								onNudgeValue={delta => this.setState({ customPartyLevel: this.state.customPartyLevel + delta })}
							/>
						</div>
					);
				}

				return (
					<div>
						<Dropdown
							options={partyOptions}
							placeholder='select party...'
							selectedID={this.state.selectedPartyID}
							onSelect={optionID => this.selectParty(optionID)}
							onClear={() => this.selectParty(null)}
						/>
						{customPartySection}
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
		} catch (e) {
			console.error(e);
			return <RenderError context='DifficultyChartPanel' error={e} />;
		}
	}
}
