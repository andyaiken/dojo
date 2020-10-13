import { Col, Row } from 'antd';
import React from 'react';

import { Factory } from '../../utils/factory';
import { Frankenstein } from '../../utils/frankenstein';
import { Gygax } from '../../utils/gygax';
import { Napoleon } from '../../utils/napoleon';
import { Shakespeare } from '../../utils/shakespeare';
import { Utils } from '../../utils/utils';

import { Encounter } from '../../models/encounter';
import { CATEGORY_TYPES, Monster, MonsterGroup, ROLE_TYPES, SIZE_TYPES } from '../../models/monster';

import { ConfirmButton } from '../controls/confirm-button';
import { Dropdown } from '../controls/dropdown';
import { Expander } from '../controls/expander';
import { NumberSpin } from '../controls/number-spin';
import { Note } from '../panels/note';

interface Props {
	monsterGroup: MonsterGroup;
	library: MonsterGroup[];
	encounters: Encounter[];
	addMonster: (monster: Monster | null) => void;
	importMonster: () => void;
	openDemographics: (group: MonsterGroup) => void;
	deleteMonsterGroup: (group: MonsterGroup) => void;
}

interface State {
	cr: number;
	size: string | null;
	type: string | null;
	role: string | null;
}

export class MonsterGroupOptions extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		const cr = Math.round(props.monsterGroup.monsters.map(m => m.challenge).reduce((a, b) => a + b, 0) / props.monsterGroup.monsters.length);
		const sizes = props.monsterGroup.monsters.map(m => m.size).filter((value, index, array) => array.indexOf(value) === index);
		const types = props.monsterGroup.monsters.map(m => m.category).filter((value, index, array) => array.indexOf(value) === index);
		const roles = props.monsterGroup.monsters.map(m => m.role).filter((value, index, array) => array.indexOf(value) === index);

		this.state = {
			cr: cr,
			size: sizes.length === 1 ? sizes[0] : null,
			type: types.length === 1 ? types[0] : null,
			role: roles.length === 1 ? roles[0] : null
		};
	}

	private export() {
		const filename = this.props.monsterGroup.name + '.monstergroup';
		Utils.saveFile(filename, this.props.monsterGroup);
	}

	public render() {
		try {
			const sizeOptions = SIZE_TYPES.map(s => ({ id: s, text: s }));
			const categoryOptions = CATEGORY_TYPES.map(c => ({ id: c, text: c }));
			const roleOptions = ROLE_TYPES.map(r => ({ id: r, text: r }));

			const monsters: Monster[] = [];
			this.props.library.forEach(group => {
				group.monsters.forEach(m => {
					let match = true;

					const diff = Math.abs(m.challenge - this.state.cr);
					if (diff > 1) {
						match = false;
					}

					if (this.state.size && (m.size !== this.state.size)) {
						match = false;
					}

					if (this.state.type && (m.category !== this.state.type)) {
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
				<div>
					<button onClick={() => this.props.addMonster(null)}>add a new monster</button>
					<button onClick={() => this.props.importMonster()}>import a monster</button>
					<Expander text='create a random monster'>
						<Note>
							<p>create a random monster using existing monsters as templates</p>
							<p>use the parameters below to specify the sort of monster you want to create</p>
						</Note>
						<NumberSpin
							label='cr'
							value={Gygax.challenge(this.state.cr)}
							onNudgeValue={delta => this.setState({
								cr: Gygax.nudgeChallenge(this.state.cr, delta)
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
								<Col span={8} className='right-value'>{monsters.length}</Col>
							</Row>
						</div>
						<hr/>
						<button
							className={monsters.length > 2 ? '' : 'disabled'}
							onClick={() => {
								const m = Factory.createMonster();
								m.name = Shakespeare.capitalise(Shakespeare.generateName());
								Frankenstein.spliceMonsters(m, monsters);
								this.props.addMonster(m);
							}}
						>
							create monster
						</button>
					</Expander>
					<button onClick={() => this.props.openDemographics(this.props.monsterGroup)}>show demographics</button>
					<button onClick={() => this.export()}>export group</button>
					<ConfirmButton
						text='delete group'
						disabled={this.props.monsterGroup.monsters.some(monster => this.props.encounters.some(enc => Napoleon.encounterHasMonster(enc, monster.id)))}
						onConfirm={() => this.props.deleteMonsterGroup(this.props.monsterGroup)}
					/>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
