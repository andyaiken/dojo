import { Col, InputNumber, Row } from 'antd';
import React from 'react';

import { Factory } from '../../utils/factory';
import { Gygax } from '../../utils/gygax';
import { Napoleon } from '../../utils/napoleon';

import { MonsterFilter } from '../../models/encounter';
import { Party } from '../../models/party';

import { RenderError } from '../error';
import { Dropdown } from '../controls/dropdown';
import { Note } from '../controls/note';
import { NumberSpin } from '../controls/number-spin';
import { Selector } from '../controls/selector';
import { FilterPanel } from '../panels/filter-panel';

interface Props {
	parties: Party[];
	data: {
		type: string;
		xp: number;
		partyID: string | null;
		difficulty: string;
		filter: MonsterFilter;
	};
	onUpdated: () => void;
}

interface State {
	data: {
		type: string;
		xp: number;
		partyID: string | null;
		difficulty: string;
		filter: MonsterFilter;
	};
}

export class RandomEncounterModal extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			data: props.data
		};
	}

	private setType(type: string) {
		const data = this.state.data;
		data.type = type;
		this.setState({
			data: data
		}, () => {
			this.props.onUpdated();
		});
	}

	private setXP(value: number) {
		const data = this.state.data;
		data.xp = Math.max(0, value);
		this.setState({
			data: data
		}, () => {
			this.props.onUpdated();
		});
	}

	private setParty(id: string) {
		const data = this.state.data;
		data.partyID = id;
		data.xp = this.calculateXP();
		this.setState({
			data: data
		}, () => {
			this.props.onUpdated();
		});
	}

	private setDifficulty(diff: string) {
		const data = this.state.data;
		data.difficulty = diff;
		data.xp = this.calculateXP();
		this.setState({
			data: data
		}, () => {
			this.props.onUpdated();
		});
	}

	private changeFilterValue(type: 'name' | 'challenge' | 'category' | 'size' | 'role', value: any) {
		const filter = this.state.data.filter as any;
		if (type === 'challenge') {
			filter.challengeMin = value[0];
			filter.challengeMax = value[1];
		} else {
			filter[type] = value;
		}

		const data = this.state.data;
		data.filter = filter;
		this.setState({
			data: data
		}, () => {
			this.props.onUpdated();
		});
	}

	private resetFilter() {
		const data = this.state.data;
		data.filter = Factory.createMonsterFilter();
		this.setState({
			data: data
		}, () => {
			this.props.onUpdated();
		});
	}

	private calculateXP() {
		let xp = 0;

		const party = this.props.parties.find(p => p.id === this.props.data.partyID);
		if (party) {
			const pcs = party.pcs.filter(pc => pc.active);
			pcs.forEach(pc => {
				xp += Gygax.pcExperience(pc.level, this.props.data.difficulty);
			});
		}

		return xp;
	}

	public render() {
		try {
			const monsters = Napoleon.getFilterDescription(this.state.data.filter);

			let info = null;
			let content = null;
			switch (this.state.data.type) {
				case 'xp':
					info = (
						<div className='section'>
							the encounter will be created by adding <b>random {monsters}</b> until it reaches <b>{this.state.data.xp} xp</b>
						</div>
					);
					content = (
						<div>
							<div className='section subheading'>xp value</div>
							<InputNumber
								value={this.state.data.xp}
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
				case 'party':
					info = (
						<div className='section'>
							the encounter will be created by adding <b>random {monsters}</b> until it reaches <b>{this.state.data.difficulty} difficulty</b>
						</div>
					);
					content = (
						<div>
							<div className='section subheading'>party</div>
							<Dropdown
								options={this.props.parties.map(p => ({ id: p.id, text: p.name || 'unnamed party' }))}
								selectedID={this.state.data.partyID}
								onSelect={id => this.setParty(id)}
							/>
							<div className='section subheading'>difficulty</div>
							<NumberSpin
								value={this.state.data.difficulty}
								downEnabled={this.state.data.difficulty !== 'easy'}
								upEnabled={this.state.data.difficulty !== 'deadly'}
								onNudgeValue={delta => this.setDifficulty(Gygax.nudgeDifficulty(this.state.data.difficulty, delta))}
							/>
						</div>
					);
					break;
			}

			return (
				<div className='scrollable padded'>
					<Note>
						{info}
					</Note>
					<Row gutter={10}>
						<Col span={12}>
							<div className='section heading'>method</div>
							<Selector
								options={[
									{
										id: 'xp',
										text: 'by xp value'
									},
									{
										id: 'party',
										text: 'by difficulty'
									}
								]}
								selectedID={this.state.data.type}
								onSelect={id => this.setType(id)}
							/>
							{content}
						</Col>
						<Col span={12}>
							<div className='section heading'>monsters</div>
							<FilterPanel
								filter={this.state.data.filter}
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
		} catch (e) {
			console.error(e);
			return <RenderError context='RandomEncounterModal' error={e} />;
		}
	}
}
