import { CaretLeftOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import React from 'react';

import Factory from '../../utils/factory';
import Frankenstein from '../../utils/frankenstein';
import Shakespeare from '../../utils/shakespeare';
import Utils from '../../utils/utils';

import { CATEGORY_TYPES, Monster, MonsterGroup, ROLE_TYPES, SIZE_TYPES } from '../../models/monster';

import MonsterCard from '../cards/monster-card';
import ConfirmButton from '../controls/confirm-button';
import Dropdown from '../controls/dropdown';
import Expander from '../controls/expander';
import NumberSpin from '../controls/number-spin';
import Textbox from '../controls/textbox';
import GridPanel from '../panels/grid-panel';
import Note from '../panels/note';

interface Props {
	monsterGroup: MonsterGroup;
	library: MonsterGroup[];
	goBack: () => void;
	removeMonsterGroup: () => void;
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

export default class MonsterGroupScreen extends React.Component<Props> {
	private export(monster: Monster) {
		const filename = monster.name + '.monster';
		Utils.saveFile(filename, monster);
	}

	public render() {
		try {
			const cards: JSX.Element[] = [];

			if (this.props.monsterGroup.monsters.length !== 0) {
				this.props.monsterGroup.monsters.forEach(m => {
					cards.push(
						<MonsterCard
							monster={m}
							mode={'editable'}
							library={this.props.library}
							moveToGroup={(monster, groupID) => this.props.moveToGroup(monster, groupID)}
							removeMonster={monster => this.props.removeMonster(monster)}
							viewMonster={monster => this.props.viewMonster(monster)}
							editMonster={monster => this.props.editMonster(monster)}
							exportMonster={monster => this.export(monster)}
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
					<Col xs={12} sm={12} md={8} lg={6} xl={4} className='scrollable sidebar sidebar-left'>
						<MonsterGroupInfo
							monsterGroup={this.props.monsterGroup}
							library={this.props.library}
							goBack={() => this.props.goBack()}
							addMonster={monster => this.props.addMonster(monster)}
							importMonster={() => this.props.importMonster()}
							changeValue={(type, value) => this.props.changeValue(this.props.monsterGroup, type, value)}
							removeMonsterGroup={() => this.props.removeMonsterGroup()}
							openDemographics={() => this.props.openDemographics(this.props.monsterGroup)}
						/>
					</Col>
					<Col xs={12} sm={12} md={16} lg={18} xl={20} className='scrollable'>
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

interface MonsterGroupInfoProps {
	monsterGroup: MonsterGroup;
	library: MonsterGroup[];
	goBack: () => void;
	changeValue: (field: string, value: string) => void;
	addMonster: (monster: Monster | null) => void;
	importMonster: () => void;
	removeMonsterGroup: () => void;
	openDemographics: () => void;
}

interface MonsterGroupInfoState {
	cr: number;
	type: string | null;
	size: string | null;
	role: string | null;
}

class MonsterGroupInfo extends React.Component<MonsterGroupInfoProps, MonsterGroupInfoState> {
	constructor(props: MonsterGroupInfoProps) {
		super(props);
		this.state = {
			cr: 1,
			type: null,
			size: null,
			role: null
		};
	}

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
			? Utils.challenge(challenge.min as number)
			: Utils.challenge(challenge.min) + ' - ' + Utils.challenge(challenge.max);

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

	private getGenerator() {
		const categoryOptions = CATEGORY_TYPES.map(c => ({ id: c, text: c }));
		const sizeOptions = SIZE_TYPES.map(s => ({ id: s, text: s }));
		const roleOptions = ROLE_TYPES.map(r => ({ id: r, text: r }));

		const monsters: Monster[] = [];
		this.props.library.forEach(group => {
			group.monsters.forEach(m => {
				let match = true;

				if (m.challenge !== this.state.cr) {
					match = false;
				}

				if (this.state.type && (m.category !== this.state.type)) {
					match = false;
				}

				if (this.state.size && (m.size !== this.state.size)) {
					match = false;
				}

				if (this.state.role && (m.role !== this.state.role)) {
					match = false;
				}

				if (match) {
					monsters.push(m);
				}
			});
		});

		return (
			<Expander text='create a random monster'>
				<NumberSpin
					label='cr'
					value={Utils.challenge(this.state.cr)}
					onNudgeValue={delta => this.setState({
						cr: Utils.nudgeChallenge(this.state.cr, delta)
					})}
				/>
				<Dropdown
					options={categoryOptions}
					selectedID={this.state.type}
					placeholder='any type'
					onSelect={id => this.setState({
						type: id
					})}
					onClear={() => this.setState({
						type: null
					})}
				/>
				<Dropdown
					options={sizeOptions}
					selectedID={this.state.size}
					placeholder='any size'
					onSelect={id => this.setState({
						size: id
					})}
					onClear={() => this.setState({
						size: null
					})}
				/>
				<Dropdown
					options={roleOptions}
					selectedID={this.state.role}
					placeholder='any role'
					onSelect={id => this.setState({
						role: id
					})}
					onClear={() => this.setState({
						role: null
					})}
				/>
				<hr/>
				<div className='section'>
					<Row>
						<Col span={16}>number of monsters:</Col>
						<Col span={8} className='statistic-value'>{monsters.length}</Col>
					</Row>
				</div>
				<hr/>
				<button
					className={monsters.length > 2 ? '' : 'disabled'}
					onClick={() => {
						const m = Factory.createMonster();
						m.name = Shakespeare.generateName(true);
						Frankenstein.spliceMonsters(m, monsters);
						this.props.addMonster(m);
					}}
				>
					create monster
				</button>
			</Expander>
		);
	}

	private export() {
		const filename = this.props.monsterGroup.name + '.monstergroup';
		Utils.saveFile(filename, this.props.monsterGroup);
	}

	public render() {
		try {
			return (
				<div>
					<div className='section'>
						<div className='subheading'>monster group name</div>
						<Textbox
							text={this.props.monsterGroup.name}
							placeholder='monster group name'
							onChange={value => this.props.changeValue('name', value)}
						/>
					</div>
					<hr/>
					{this.getSummary()}
					<hr/>
					<button onClick={() => this.props.addMonster(null)}>add a new monster</button>
					<button onClick={() => this.props.importMonster()}>import a monster</button>
					{this.getGenerator()}
					<button onClick={() => this.props.openDemographics()}>show demographics</button>
					<button onClick={() => this.export()}>export group</button>
					<ConfirmButton text='delete group' onConfirm={() => this.props.removeMonsterGroup()} />
					<hr/>
					<button onClick={() => this.props.goBack()}><CaretLeftOutlined style={{ fontSize: '10px' }} /> back to the list</button>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
