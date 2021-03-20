import { Col, InputNumber, Row } from 'antd';
import React from 'react';

import { Factory } from '../../utils/factory';
import { Frankenstein } from '../../utils/frankenstein';
import { Gygax } from '../../utils/gygax';
import { Napoleon } from '../../utils/napoleon';

import { MonsterFilter } from '../../models/encounter';
import { CATEGORY_TYPES, MonsterGroup, ROLE_TYPES } from '../../models/monster';
import { Party } from '../../models/party';

import { RenderError } from '../error';
import { Checkbox } from '../controls/checkbox';
import { Conditional } from '../controls/conditional';
import { Dropdown } from '../controls/dropdown';
import { Note } from '../controls/note';
import { NumberSpin } from '../controls/number-spin';
import { RadioGroup } from '../controls/radio-group';
import { Selector } from '../controls/selector';
import { FilterPanel } from '../panels/filter-panel';

interface RandomMonsterData {
	cr: number;
	size: string | null;
	type: string | null;
	role: string | null;
}

interface RandomMapData {
	areas: number;
}

interface RandomEncounterData {
	type: string;
	xp: number;
	partyID: string | null;
	difficulty: string;
	template: string;
	filter: MonsterFilter;
}

interface Props {
	parties: Party[];
	library: MonsterGroup[];
	monsterData: RandomMonsterData | null;
	mapData: RandomMapData | null;
	encounterData: RandomEncounterData | null;
	onUpdated: () => void;
}

interface State {
	monsterData: RandomMonsterData | null;
	mapData: RandomMapData | null;
	encounterData: RandomEncounterData | null;
	customPartySize: number;
	customPartyLevel: number;
}

export class RandomGeneratorModal extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			monsterData: props.monsterData,
			mapData: props.mapData,
			encounterData: props.encounterData,
			customPartySize: 5,
			customPartyLevel: 1
		};
	}

	//#region Monster

	private getMonsterSection(data: RandomMonsterData) {
		const monsters = Frankenstein.filterMonsters(this.props.library, data.cr, data.size, data.type, data.role);

		let desc = 'challenge rating ' + Gygax.challenge(data.cr);
		if (data.size) {
			desc += ' ' + data.size;
		}
		if (data.type) {
			desc += ' ' + data.type;
		}
		if (data.role) {
			desc += ' (' + data.role + ')';
		}

		return (
			<div>
				<Note>
					<Conditional display={monsters.length >= 2}>
						<div className='section'>
							a <b>{desc}</b> monster will be created by splicing together <b>{monsters.length} existing monsters</b>
						</div>
					</Conditional>
					<Conditional display={monsters.length < 2}>
						<div className='section'>
							there are not enough <b>{desc}</b> monsters to splice together
						</div>
					</Conditional>
				</Note>
				<Row gutter={10}>
					<Col span={6}>
						<div className='subheading'>challenge rating</div>
						<NumberSpin
							value={Gygax.challenge(data.cr)}
							onNudgeValue={delta => {
								data.cr = Gygax.nudgeChallenge(data.cr, delta);
								this.setState({
									monsterData: data
								}, () => {
									this.props.onUpdated();
								});
							}}
						/>
					</Col>
					<Col span={6}>
						<div className='subheading'>size</div>
						<Checkbox
							label='specify the size'
							checked={data.size !== null}
							onChecked={checked => {
								data.size = checked ? 'medium' : null;
								this.setState({
									monsterData: data
								}, () => {
									this.props.onUpdated()
								});
							}}
						/>
						<Conditional display={data.size !== null}>
							<NumberSpin
								value={data.size as string}
								downEnabled={data.size !== 'tiny'}
								upEnabled={data.size !== 'gargantuan'}
								onNudgeValue={delta => {
									data.size = Gygax.nudgeSize(data.size as string, delta);
									this.setState({
										monsterData: data
									}, () => {
										this.props.onUpdated();
									});
								}}
							/>
						</Conditional>
					</Col>
					<Col span={6}>
						<div className='subheading'>type</div>
						<Checkbox
							label='specify the type'
							checked={data.type !== null}
							onChecked={checked => {
								data.type = checked ? 'humanoid' : null;
								this.setState({
									monsterData: data
								}, () => {
									this.props.onUpdated()
								});
							}}
						/>
						<Conditional display={data.type !== null}>
							<RadioGroup
								items={CATEGORY_TYPES.map(c => ({ id: c, text: c }))}
								selectedItemID={data.type}
								onSelect={id => {
									data.type = id;
									this.setState({
										monsterData: data
									}, () => {
										this.props.onUpdated();
									});
								}}
							/>
						</Conditional>
					</Col>
					<Col span={6}>
						<div className='subheading'>role</div>
						<Checkbox
							label='specify the role'
							checked={data.role !== null}
							onChecked={checked => {
								data.role = checked ? 'soldier' : null;
								this.setState({
									monsterData: data
								}, () => {
									this.props.onUpdated()
								});
							}}
						/>
						<Conditional display={data.role !== null}>
							<RadioGroup
								items={ROLE_TYPES.map(r => ({ id: r, text: r }))}
								selectedItemID={data.role}
								onSelect={id => {
									data.role = id;
									this.setState({
										monsterData: data
									}, () => {
										this.props.onUpdated();
									});
								}}
							/>
						</Conditional>
					</Col>
				</Row>
			</div>
		);
	}

	//#endregion

	//#region Map

	private getMapSection(data: RandomMapData) {
		return (
			<div>
				<Note>
					<div className='section'>
						the map will be created by adding tiles until there are <b>{data.areas} areas</b>
					</div>
				</Note>
				<NumberSpin
					label='areas'
					value={data.areas}
					downEnabled={data.areas > 1}
					onNudgeValue={delta => {
						data.areas += delta;
						this.setState({
							mapData: data
						}, () => {
							this.props.onUpdated();
						});
					}}
				/>
			</div>
		);
	}

	//#endregion

	//#region Encounter

	private setType(type: string) {
		const data = this.state.encounterData as RandomEncounterData;
		data.type = type;
		this.setState({
			encounterData: data
		}, () => {
			this.props.onUpdated();
		});
	}

	private setXP(value: number) {
		const data = this.state.encounterData as RandomEncounterData;
		data.xp = Math.max(0, value);
		this.setState({
			encounterData: data
		}, () => {
			this.props.onUpdated();
		});
	}

	private setParty(id: string | null, partySize: number, partyLevel: number) {
		const data = this.state.encounterData as RandomEncounterData;
		data.partyID = id;
		data.xp = this.calculateXP(data, partySize, partyLevel);
		this.setState({
			encounterData: data,
			customPartySize: partySize,
			customPartyLevel: partyLevel
		}, () => {
			this.props.onUpdated();
		});
	}

	private setDifficulty(diff: string) {
		const data = this.state.encounterData as RandomEncounterData;
		data.difficulty = diff;
		data.xp = this.calculateXP(data, this.state.customPartySize, this.state.customPartyLevel);
		this.setState({
			encounterData: data
		}, () => {
			this.props.onUpdated();
		});
	}

	private setTemplate(template: string) {
		const data = this.state.encounterData as RandomEncounterData;
		data.template = template;
		this.setState({
			encounterData: data
		}, () => {
			this.props.onUpdated();
		});
	}

	private changeFilterValue(type: 'name' | 'challenge' | 'category' | 'size' | 'role', value: any) {
		const data = this.state.encounterData as RandomEncounterData;

		const filter = data.filter as any;
		if (type === 'challenge') {
			filter.challengeMin = value[0];
			filter.challengeMax = value[1];
		} else {
			filter[type] = value;
		}

		data.filter = filter;
		this.setState({
			encounterData: data
		}, () => {
			this.props.onUpdated();
		});
	}

	private resetFilter() {
		const data = this.state.encounterData as RandomEncounterData;
		data.filter = Factory.createMonsterFilter();
		this.setState({
			encounterData: data
		}, () => {
			this.props.onUpdated();
		});
	}

	private calculateXP(data: RandomEncounterData, partySize: number, partyLevel: number) {
		let xp = 0;

		if (data.partyID === '') {
			// We're using a custom party
			const party = Factory.createParty();
			for (let n = 0; n !== partySize; ++n) {
				const pc = Factory.createPC();
				pc.level = partyLevel;
				party.pcs.push(pc);
			}
			xp = Napoleon.getXPForDifficulty(party, data.difficulty);
		} else {
			const party = this.props.parties.find(p => p.id === data.partyID);
			if (party) {
				xp = Napoleon.getXPForDifficulty(party, data.difficulty);
			}
		}

		return xp;
	}

	private getEncounterSection(data: RandomEncounterData) {
		const monsters = Napoleon.getFilterDescription(data.filter);

		let target = '';
		let content = null;
		switch (data.type) {
			case 'party':
				target =  data.difficulty + ' difficulty';
				content = (
					<div>
						<div className='section subheading'>party</div>
						<Dropdown
							placeholder='select party...'
							options={this.props.parties.map(p => ({ id: p.id, text: p.name || 'unnamed party' })).concat({ id: '', text: 'custom party' })}
							selectedID={data.partyID}
							onSelect={id => this.setParty(id, this.state.customPartySize, this.state.customPartyLevel)}
							onClear={() => this.setParty(null, this.state.customPartySize, this.state.customPartyLevel)}
						/>
						<Conditional display={data.partyID === ''}>
							<NumberSpin
								value={this.state.customPartySize}
								label='party size'
								downEnabled={this.state.customPartySize > 1}
								onNudgeValue={delta => this.setParty('', this.state.customPartySize + delta, this.state.customPartyLevel)}
							/>
							<NumberSpin
								value={this.state.customPartyLevel}
								label='party level'
								downEnabled={this.state.customPartyLevel > 1}
								upEnabled={this.state.customPartyLevel < 20}
								onNudgeValue={delta => this.setParty('', this.state.customPartySize, this.state.customPartyLevel + delta)}
							/>
						</Conditional>
						<div className='section subheading'>difficulty</div>
						<NumberSpin
							value={data.difficulty}
							downEnabled={data.difficulty !== 'easy'}
							upEnabled={data.difficulty !== 'deadly'}
							onNudgeValue={delta => this.setDifficulty(Gygax.nudgeDifficulty(data.difficulty, delta))}
						/>
					</div>
				);
				break;
			case 'xp':
				target = data.xp + ' xp';
				content = (
					<div>
						<div className='section subheading'>xp value</div>
						<InputNumber
							value={data.xp}
							min={100}
							step={1000}
							onChange={value => {
								const val = parseInt((value ?? 0).toString(), 10);
								this.setXP(val);
							}}
						/>
					</div>
				);
				break;
		}

		let info = null;
		if (data.template !== '') {
			const template = (data.template === 'random') ? 'a random template' : 'the ' + data.template + ' template';
			info = (
				<div className='section'>
					the encounter will be created by adding <b>random {monsters}</b> to <b>{template}</b> until it reaches <b>{target}</b>
				</div>
			);
		} else {
			info = (
				<div className='section'>
					the encounter will be created by adding <b>random {monsters}</b> until it reaches <b>{target}</b>
				</div>
			);
		}

		return (
			<div>
				<Note>
					{info}
				</Note>
				<Row gutter={10}>
					<Col span={8}>
						<div className='section subheading'>method</div>
						<Selector
							options={[
								{
									id: 'party',
									text: 'by difficulty'
								},
								{
									id: 'xp',
									text: 'by xp value'
								}
							]}
							selectedID={data.type}
							onSelect={id => this.setType(id)}
						/>
						{content}
					</Col>
					<Col span={8}>
						<div className='section subheading'>template</div>
						<Checkbox label='use an encounter template' checked={data.template !== ''} onChecked={value => this.setTemplate(value ? 'random' : '')}/>
						<Conditional display={data.template !== ''}>
							<Note>
								<div className='section'>select the template you would like to use</div>
							</Note>
							<RadioGroup
								items={
									Napoleon.encounterTemplates(true).map(t => ({
										id: t.name,
										text: t.name,
										details: (
											<div className='section'>
												<Conditional display={t.name === 'random'}>
													<div>a random template</div>
												</Conditional>
												{
													t.slots.map((s, index) => (
														<div key={index} className='content-then-info'>
															<div className='content'>{s.roles.join(' / ')}</div>
															<div className='info'>min {s.count}</div>
														</div>
													))
												}
											</div>
										)
									}))
								}
								selectedItemID={data.template}
								onSelect={template => this.setTemplate(template)}
							/>
						</Conditional>
					</Col>
					<Col span={8}>
						<div className='section subheading'>monsters</div>
						<FilterPanel
							filter={data.filter}
							prefix='use'
							showName={false}
							showRoles={false}
							changeValue={(type, value) => this.changeFilterValue(type, value)}
							resetFilter={() => this.resetFilter()}
						/>
					</Col>
				</Row>
			</div>
		);
	}

	//#endregion

	public render() {
		try {
			let monster = null;
			if (this.state.monsterData) {
				monster = this.getMonsterSection(this.state.monsterData);
			}

			let encounter = null;
			if (this.state.encounterData) {
				encounter = this.getEncounterSection(this.state.encounterData);
			}

			let map = null;
			if (this.state.mapData) {
				map = this.getMapSection(this.state.mapData);
			}

			const showHeaders = !!this.state.mapData && !!this.state.encounterData;

			return (
				<div className='scrollable padded'>
					{monster}
					<Conditional display={showHeaders}>
						<div className='heading'>for the map</div>
					</Conditional>
					{map}
					<Conditional display={showHeaders}>
						<div className='heading'>for the encounters</div>
					</Conditional>
					{encounter}
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='RandomGeneratorModal' error={e} />;
		}
	}
}
