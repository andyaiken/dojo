import { InputNumber } from 'antd';
import React from 'react';

import { Factory } from '../../utils/factory';
import { Napoleon } from '../../utils/napoleon';

import { MonsterFilter } from '../../models/encounter';

import { Expander } from '../controls/expander';
import { RadioGroup } from '../controls/radio-group';
import { FilterPanel } from '../panels/filter-panel';

interface Props {
	createEncounter: (xp: number, filter: MonsterFilter) => void;
	addEncounter: (templateID: string | null) => void;
}

interface State {
	xp: number;
	filter: MonsterFilter;
}

export class EncounterListOptions extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			xp: 1000,
			filter: Factory.createMonsterFilter()
		};
	}

	private setXP(value: number) {
		this.setState({
			xp: Math.max(0, value)
		});
	}

	private changeFilterValue(type: 'name' | 'challenge' | 'category' | 'size' | 'role', value: any) {
		const filter = this.state.filter as any;
		if (type === 'challenge') {
			filter.challengeMin = value[0];
			filter.challengeMax = value[1];
		} else {
			filter[type] = value;
		}

		this.setState({
			filter: filter
		});
	}

	private resetFilter() {
		this.setState({
			filter: Factory.createMonsterFilter()
		});
	}

	public render() {
		try {
			return (
				<div>
					<button onClick={() => this.props.addEncounter(null)}>create a new encounter</button>
					<Expander text='build a random encounter'>
						<p>
							add random monsters to this encounter until its (effective) xp value is at least the following value
						</p>
						<InputNumber
							value={this.state.xp}
							min={0}
							step={1000}
							onChange={value => {
								const val = parseInt((value ?? 0).toString(), 10);
								this.setXP(val);
							}}
						/>
						<hr/>
						<FilterPanel
							filter={this.state.filter}
							prefix='use'
							showName={false}
							showRoles={false}
							changeValue={(type, value) => this.changeFilterValue(type, value)}
							resetFilter={() => this.resetFilter()}
						/>
						<hr/>
						<button onClick={() => this.props.createEncounter(this.state.xp, this.state.filter)}>build encounter</button>
					</Expander>
					<Expander text='use an encounter template'>
						<RadioGroup
							items={Napoleon.encounterTemplates().map(t => ({ id: t.name, text: t.name }))}
							selectedItemID={null}
							onSelect={id => this.props.addEncounter(id)}
						/>
					</Expander>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
