import { CaretLeftOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import React from 'react';

import { Gygax } from '../../utils/gygax';

import { Encounter } from '../../models/encounter';
import { Monster, MonsterGroup } from '../../models/monster';

import { MonsterCard } from '../cards/monster-card';
import { Textbox } from '../controls/textbox';
import { MonsterGroupOptions } from '../options/monster-group-options';
import { GridPanel } from '../panels/grid-panel';
import { Note } from '../panels/note';

interface Props {
	monsterGroup: MonsterGroup;
	library: MonsterGroup[];
	encounters: Encounter[];
	goBack: () => void;
	removeMonsterGroup: (group: MonsterGroup) => void;
	openDemographics: (group: MonsterGroup) => void;
	addMonster: (monster: Monster | null) => void;
	importMonster: () => void;
	removeMonster: (monster: Monster) => void;
	viewMonster: (monster: Monster) => void;
	editMonster: (monster: Monster) => void;
	cloneMonster: (monster: Monster, name: string) => void;
	moveToGroup: (monster: Monster, groupID: string) => void;
	changeValue: (source: any, field: string, value: any) => void;
	nudgeValue: (source: any, field: string, value: number) => void;
}

export class MonsterGroupScreen extends React.Component<Props> {
	private getSummary() {
		if (this.props.monsterGroup.monsters.length === 0) {
			return (
				<div className='section centered'>
					<i>no monsters</i>
				</div>
			);
		}

		const challenge: { min: number, max: number } = { min: 30, max: 0 };

		this.props.monsterGroup.monsters.forEach(monster => {
			challenge.min = Math.min(challenge.min, monster.challenge);
			challenge.max = Math.max(challenge.max, monster.challenge);
		});

		const challengeSummary = challenge.min === challenge.max
			? Gygax.challenge(challenge.min as number)
			: Gygax.challenge(challenge.min) + ' - ' + Gygax.challenge(challenge.max);

		return (
			<div className='group-panel'>
				<div className='section'>
					<div className='subheading'>monsters</div>
				</div>
				<div className='section'>
					{this.props.monsterGroup.monsters.length}
				</div>
				<div className='section'>
					<div className='subheading'>challenge rating</div>
				</div>
				<div className='section'>
					{challengeSummary}
				</div>
			</div>
		);
	}

	public render() {
		try {
			const cards: JSX.Element[] = [];

			if (this.props.monsterGroup.monsters.length !== 0) {
				this.props.monsterGroup.monsters.forEach(m => {
					cards.push(
						<MonsterCard
							monster={m}
							library={this.props.library}
							encounters={this.props.encounters}
							moveToGroup={(monster, groupID) => this.props.moveToGroup(monster, groupID)}
							removeMonster={monster => this.props.removeMonster(monster)}
							viewMonster={monster => this.props.viewMonster(monster)}
							editMonster={monster => this.props.editMonster(monster)}
							cloneMonster={(monster, monsterName) => this.props.cloneMonster(monster, monsterName)}
						/>
					);
				});
			} else {
				cards.push(
					<Note><div className='section'>there are no monsters in this group</div></Note>
				);
			}

			return (
				<Row className='full-height'>
					<Col span={6} className='scrollable sidebar sidebar-left'>
						<div className='section'>
							<div className='subheading'>monster group name</div>
							<Textbox
								text={this.props.monsterGroup.name}
								placeholder='monster group name'
								onChange={value => this.props.changeValue(this.props.monsterGroup, 'name', value)}
							/>
						</div>
						<hr/>
						{this.getSummary()}
						<hr/>
						<MonsterGroupOptions
							monsterGroup={this.props.monsterGroup}
							library={this.props.library}
							addMonster={monster => this.props.addMonster(monster)}
							importMonster={() => this.props.importMonster()}
							openDemographics={group => this.props.openDemographics(group)}
							removeMonsterGroup={group => this.props.removeMonsterGroup(group)}
						/>
						<hr/>
						<button onClick={() => this.props.goBack()}><CaretLeftOutlined style={{ fontSize: '10px' }} /> back to the list</button>
					</Col>
					<Col span={18} className='scrollable'>
						<GridPanel
							content={cards}
							heading={this.props.monsterGroup.name || 'unnamed group'}
						/>
					</Col>
				</Row>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
