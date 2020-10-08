import { Col, Row } from 'antd';
import React from 'react';

import { Factory } from '../../utils/factory';
import { Gygax } from '../../utils/gygax';
import { Napoleon } from '../../utils/napoleon';

import { Encounter, EncounterSlot, EncounterWave, MonsterFilter } from '../../models/encounter';
import { Monster, MonsterGroup } from '../../models/monster';

import { MonsterStatblockCard } from '../cards/monster-statblock-card';
import { RadioGroup } from '../controls/radio-group';
import { FilterPanel } from '../panels/filter-panel';
import { Note } from '../panels/note';

interface Props {
	encounter: Encounter;
	wave: EncounterWave | null;
	slot: EncounterSlot | null;
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
		this.state = {
			filter: Factory.createMonsterFilter()
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

			const list = this.props.wave ? this.props.wave.slots : this.props.encounter.slots;
			this.props.library.forEach(group => {
				group.monsters.forEach(monster => {
					// Ignore monsters that don't match the filter
					const matchFilter = Napoleon.matchMonster(monster, this.state.filter);

					// Ignore monsters that don't match the slot's role
					const matchRole = this.props.slot ? this.props.slot.roles.includes(monster.role) : true;

					// Ignore monsters that are already in the list
					const inList = list.some(s => s.monsterID === monster.id);

					if (matchFilter && matchRole && !inList) {
						monsters.push(monster);
					}
				});
			});

			monsters.sort((a, b) => {
				if (a.name < b.name) { return -1; }
				if (a.name > b.name) { return 1; }
				return 0;
			});

			const hasRoles = !!this.props.slot && (this.props.slot.roles.length > 0);

			let left = (
				<RadioGroup
					items={monsters.map(m => ({ id: m.id, text: m.name, info: 'cr ' + Gygax.challenge(m.challenge) }))}
					selectedItemID={this.props.monster ? this.props.monster.id : null}
					onSelect={id => this.props.setMonster(monsters.find(m => m.id === id) ?? null)}
				/>
			);
			if (monsters.length === 0) {
				const desc = Napoleon.getFilterDescription(this.state.filter);
				left = (
					<Note key='empty'>
						there are no monsters that meet the criteria <i>{desc}</i> (or they are all already part of the encounter)
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
			return <div className='render-error'/>;
		}
	}
}
