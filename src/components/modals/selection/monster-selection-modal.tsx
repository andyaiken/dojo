import { Col, Row } from 'antd';
import React from 'react';

import { Factory } from '../../../utils/factory';
import { Gygax } from '../../../utils/gygax';
import { Napoleon } from '../../../utils/napoleon';

import { EncounterSlot, MonsterFilter } from '../../../models/encounter';
import { Monster, MonsterGroup } from '../../../models/monster';

import { RenderError } from '../../error';
import { MonsterStatblockCard } from '../../cards/monster-statblock-card';
import { Note } from '../../controls/note';
import { RadioGroup } from '../../controls/radio-group';
import { FilterPanel } from '../../panels/filter-panel';

interface Props {
	slot: EncounterSlot | null;
	originalMonster: Monster | null;
	monster: Monster | null;
	library: MonsterGroup[];
	setMonster: (monster: Monster | null) => void;
}

interface State {
	filter: MonsterFilter;
}

export class MonsterSelectionModal extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		const filter = Factory.createMonsterFilter();
		if (props.originalMonster) {
			filter.category = props.originalMonster.category;
			filter.challengeMin = props.originalMonster.challenge;
			filter.challengeMax = props.originalMonster.challenge;
		}

		this.state = {
			filter: filter
		};
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
			const monsters: Monster[] = [];

			const hasRoles = !!this.props.slot && (this.props.slot.roles.length > 0);
			this.props.library.forEach(group => {
				group.monsters.forEach(monster => {
					// Ignore monsters that don't match the filter
					const matchFilter = Napoleon.matchMonster(monster, this.state.filter);

					// Ignore monsters that don't match the slot's role
					const matchRole = hasRoles ? (this.props.slot as EncounterSlot).roles.includes(monster.role) : true;

					if (matchFilter && matchRole) {
						monsters.push(monster);
					}
				});
			});

			monsters.sort((a, b) => {
				if (a.name < b.name) { return -1; }
				if (a.name > b.name) { return 1; }
				return 0;
			});

			let left = (
				<RadioGroup
					items={monsters.map(m => ({ id: m.id, text: m.name || 'unnamed monster', info: 'cr ' + Gygax.challenge(m.challenge) }))}
					selectedItemID={this.props.monster ? this.props.monster.id : null}
					onSelect={id => this.props.setMonster(monsters.find(m => m.id === id) ?? null)}
				/>
			);
			if (monsters.length === 0) {
				const desc = Napoleon.getFilterDescription(this.state.filter);
				left = (
					<Note key='empty'>
						there are no monsters that meet the criteria <i>{desc}</i>
					</Note>
				);
			}

			let right = (
				<Note>
					select a monster from the list at the left to see its statblock here
				</Note>
			);
			if (this.props.monster) {
				right = (
					<MonsterStatblockCard monster={this.props.monster as Monster} />
				);
			}

			return (
				<Row className='full-height'>
					<Col span={8} className='scrollable'>
						<div className='section'>
							<FilterPanel
								filter={this.state.filter}
								showRoles={!hasRoles}
								changeValue={(type, value) => this.changeFilterValue(type, value)}
								resetFilter={() => this.resetFilter()}
							/>
						</div>
						<hr/>
						{left}
					</Col>
					<Col span={16} className='scrollable'>
						{right}
					</Col>
				</Row>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='MonsterSelectionModal' error={e} />;
		}
	}
}
