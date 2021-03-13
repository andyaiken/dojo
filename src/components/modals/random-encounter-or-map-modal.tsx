import { Col, InputNumber, Row } from 'antd';
import React from 'react';

import { Factory } from '../../utils/factory';
import { Gygax } from '../../utils/gygax';
import { Napoleon } from '../../utils/napoleon';

import { MonsterFilter } from '../../models/encounter';
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
	mapData: RandomMapData | null;
	encounterData: RandomEncounterData | null;
	onUpdated: () => void;
}

interface State {
	mapData: RandomMapData | null;
	encounterData: RandomEncounterData | null;
}

export class RandomEncounterOrMapModal extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			mapData: props.mapData,
			encounterData: props.encounterData
		};
	}

	//#region  Map

	private getMapSection(data: RandomMapData) {
		return (
			<div>
				<Note>
					<div className='section'>
						the map will be created by adding tiles until there are <b>{data.areas}</b> rooms
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

	private setParty(id: string) {
		const data = this.state.encounterData as RandomEncounterData;
		data.partyID = id;
		data.xp = this.calculateXP(data);
		this.setState({
			encounterData: data
		}, () => {
			this.props.onUpdated();
		});
	}

	private setDifficulty(diff: string) {
		const data = this.state.encounterData as RandomEncounterData;
		data.difficulty = diff;
		data.xp = this.calculateXP(data);
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

	private calculateXP(data: RandomEncounterData) {
		let xp = 0;

		const party = this.props.parties.find(p => p.id === data.partyID);
		if (party) {
			xp = Napoleon.getXPForDifficulty(party, data.difficulty);
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
							options={this.props.parties.map(p => ({ id: p.id, text: p.name || 'unnamed party' }))}
							selectedID={data.partyID}
							onSelect={id => this.setParty(id)}
						/>
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
							min={1000}
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
			let encounter = null;
			if (this.state.encounterData) {
				encounter = this.getEncounterSection(this.state.encounterData);
			}

			let map = null;
			if (this.state.mapData) {
				map = this.getMapSection(this.state.mapData);
			}

			return (
				<div className='scrollable padded'>
					<Conditional display={!!this.state.mapData && !!this.state.encounterData}>
						<div className='heading'>for the map</div>
					</Conditional>
					{map}
					<Conditional display={!!this.state.mapData && !!this.state.encounterData}>
						<div className='heading'>for the encounters</div>
					</Conditional>
					{encounter}
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='RandomEncounterOrMapModal' error={e} />;
		}
	}
}
