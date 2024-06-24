import { ArrowRightOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Col, Row, Tag } from 'antd';
import React from 'react';

import { Mercator } from '../../utils/mercator';
import { Utils } from '../../utils/utils';

import { Combatant } from '../../models/combat';
import { Condition } from '../../models/condition';
import { Map } from '../../models/map';
import { Options } from '../../models/misc';
import { Monster } from '../../models/monster';
import { Companion, PC } from '../../models/party';

import { RenderError } from '../error';
import { Conditional } from '../controls/conditional';
import { ConfirmButton } from '../controls/confirm-button';
import { Dropdown } from '../controls/dropdown';
import { Expander } from '../controls/expander';
import { Note } from '../controls/note';
import { NumberSpin } from '../controls/number-spin';
import { Selector } from '../controls/selector';
import { Tabs } from '../controls/tabs';
import { Textbox } from '../controls/textbox';
import { ConditionsPanel } from './conditions-panel';
import { MarkdownEditor } from './markdown-editor';
import { MovementPanel } from './movement-panel';
import { Napoleon } from '../../utils/napoleon';

interface Props {
	combatants: Combatant[];
	allCombatants: Combatant[];
	map: Map | null;
	options: Options;
	lighting: 'bright light' | 'dim light' | 'darkness';
	showTabs: boolean;
	defaultTab: string;
	// Main tab
	makeCurrent: (combatant: Combatant) => void;
	makeActive: (combatants: Combatant[]) => void;
	makeDefeated: (combatants: Combatant[]) => void;
	nextTurn: () => void;
	toggleTag: (combatants: Combatant[], tag: string) => void;
	toggleCondition: (combatants: Combatant[], condition: string) => void;
	toggleHidden: (combatants: Combatant[]) => void;
	// HP tab
	changeHP: (values: {id: string, hp: number, temp: number, damage: number}[]) => void;
	// Cond tab
	addCondition: (combatants: Combatant[]) => void;
	editCondition: (combatant: Combatant, condition: Condition) => void;
	deleteCondition: (combatant: Combatant, condition: Condition) => void;
	// Map tab
	mapAdd: (combatant: Combatant) => void;
	mapMove: (combatants: Combatant[], dir: string, step: number) => void;
	mapRemove: (combatants: Combatant[]) => void;
	undoStep: (combatant: Combatant) => void;
	// Adv tab
	removeCombatants: ((combatants: Combatant[]) => void) | null;
	addCompanion: (companion: Companion) => void;
	// General
	changeValue: (source: any, field: string, value: any) => void;
	nudgeValue: (source: any, field: string, delta: number) => void;
}

interface State {
	view: string;
	damageMode: string;
	value: number;
	damageMultipliers: { [id: string]: number };
}

export class CombatControlsPanel extends React.Component<Props, State> {
	public static defaultProps = {
		showTabs: true,
		defaultTab: 'main',
		makeCurrent: null,
		makeActive: null,
		makeDefeated: null,
		nextTurn: null,
		changeHP: null,
		removeCombatants: null
	};

	constructor(props: Props) {
		super(props);

		this.state = {
			view: props.defaultTab,
			damageMode: 'damage',
			value: 0,
			damageMultipliers: {}
		};
	}

	private nudgeValue(delta: number) {
		this.setState({
			value: Math.max(this.state.value + delta, 0)
		});
	}

	private setView(view: string) {
		this.setState({
			view: view
		});
	}

	private setDamageMultiplier(id: string, multiplier: number) {
		const multipliers = this.state.damageMultipliers;
		multipliers[id] = multiplier;
		this.setState({
			damageMultipliers: multipliers
		});
	}

	private heal() {
		if (this.props.changeHP === null) {
			return;
		}

		const value = this.state.value;

		this.setState({
			value: 0
		}, () => {
			const values: { id: string, hp: number, temp: number; damage: number }[] = [];
			this.props.combatants.forEach(combatant => {
				const hpMax = (combatant.hpMax ?? 0);

				let hp = (combatant.hpCurrent ?? 0) + value;
				hp = Math.min(hp, hpMax);

				values.push({
					id: combatant.id,
					hp: hp,
					temp: combatant.hpTemp ?? 0,
					damage: 0
				});
			});

			this.props.changeHP(values);
		});
	}

	private damage() {
		if (this.props.changeHP === null) {
			return;
		}

		const value = this.state.value;

		this.setState({
			value: 0
		}, () => {
			const values: { id: string, hp: number, temp: number; damage: number }[] = [];
			this.props.combatants.forEach(combatant => {
				const multiplier = this.state.damageMultipliers[combatant.id] ?? 1;

				let hp = combatant.hpCurrent ?? 0;
				let temp = combatant.hpTemp ?? 0;

				const totalDamage = Math.floor(value * multiplier);
				let damage = totalDamage;

				// Take damage off temp HP first
				const val = Math.min(damage, temp);
				damage -= val;
				temp -= val;

				// Take the rest off HP
				hp -= damage;
				hp = Math.max(hp, 0);

				values.push({
					id: combatant.id,
					hp: hp,
					temp: temp,
					damage: totalDamage
				});
			});

			this.props.changeHP(values);
		});
	}

	private addTempHP() {
		if (this.props.changeHP === null) {
			return;
		}

		const value = this.state.value;

		this.setState({
			value: 0
		}, () => {
			const values: { id: string, hp: number, temp: number; damage: number }[] = [];
			this.props.combatants.forEach(combatant => {
				values.push({
					id: combatant.id,
					hp: combatant.hpCurrent ?? 0,
					temp: Math.max(value, combatant.hpTemp ?? 0),
					damage: 0
				});
			});

			this.props.changeHP(values);
		});
	}

	private getDamageMultiplier(combatantID: string) {
		let selected = 'normal';
		const multiplier = this.state.damageMultipliers[combatantID] ?? 1;
		if (multiplier < 1) {
			selected = 'half';
		}
		if (multiplier > 1) {
			selected = 'double';
		}

		return (
			<Selector
				options={Utils.arrayToItems(['half', 'normal', 'double'])}
				selectedID={selected}
				onSelect={id => {
					let value = 1;
					if (id === 'half') {
						value = 0.5;
					}
					if (id === 'double') {
						value = 2;
					}
					this.setDamageMultiplier(combatantID, value);
				}}
			/>
		);
	}

	private getMainSection() {
		const actions: JSX.Element[] = [];
		const engaged: JSX.Element[] = [];
		const notes: JSX.Element[] = [];

		if (this.props.nextTurn && this.props.combatants.every(c => c.current)) {
			actions.push(<button key='endTurn' onClick={() => this.props.nextTurn()}>end turn</button>);
		}

		if (this.props.combatants.every(c => c.active)) {
			if (this.props.makeCurrent && this.props.makeDefeated) {
				if (this.props.combatants.every(c => c.current)) {
					actions.push(<button key='makeDefeated' onClick={() => this.props.makeDefeated(this.props.combatants)}>mark as defeated and end turn</button>);
				} else {
					if (this.props.combatants.length === 1) {
						const isMount = !!this.props.allCombatants.find(c => c.mountID === this.props.combatants[0].id);
						if (!isMount) {
							actions.push(<button key='makeCurrent' onClick={() => this.props.makeCurrent(this.props.combatants[0])}>start turn</button>);
						}
					}
					actions.push(<button key='makeDefeated' onClick={() => this.props.makeDefeated(this.props.combatants)}>mark as defeated</button>);
				}
			}

			if (this.props.combatants.every(c => c.type !== 'pc')) {
				const pcs = this.props.allCombatants.filter(c => c.type === 'pc');
				pcs.forEach(pc => {
					const name = Napoleon.getCombatantName(pc, []);
					const tag = 'engaged:' + name;
					engaged.push(
						<Tag.CheckableTag
							key={pc.id}
							checked={this.props.combatants.every(c => c.tags.includes(tag))}
							onChange={() => this.props.toggleTag(this.props.combatants, tag)}
						>
							{name}
						</Tag.CheckableTag>
					);
				});
			}
		}

		if (this.props.combatants.length === 1) {
			if (this.props.lighting !== 'bright light') {
				const c = this.props.combatants[0];
				if ((c.darkvision === 0) && (c.lightSource === null)) {
					notes.push(
						<Note key='light'>
							<div className='section'>
								{Napoleon.getCombatantName(c, [])} is in {this.props.lighting}, and has no darkvision or light source
							</div>
						</Note>
					);
				}
			}
		}

		if (this.props.makeActive && this.props.combatants.every(c => c.defeated)) {
			actions.push(<button key='makeActive' onClick={() => this.props.makeActive(this.props.combatants)}>mark as active</button>);
		}

		let actionSection = null;
		if (actions.length > 0) {
			actionSection = (
				<div>
					{actions}
					<hr/>
				</div>
			);
		}

		let engagedSection = null;
		if (engaged.length > 0) {
			engagedSection = (
				<div className='section'>
					<b>engaged with: </b>
					{engaged}
				</div>
			);
		}

		return (
			<div>
				{notes}
				{actionSection}
				<CombatantTags
					combatants={this.props.combatants}
					editable={true}
					toggleTag={(combatants, tag) => this.props.toggleTag(combatants, tag)}
					toggleCondition={(combatants, condition) => this.props.toggleCondition(combatants, condition)}
					toggleHidden={(combatants) => this.props.toggleHidden(combatants)}
				/>
				{engagedSection}
			</div>
		);
	}

	private getHPSection() {
		if (!this.props.combatants.every(c => c.type === 'monster')) {
			return null;
		}

		const modifiers = this.props.combatants.map(c => {
			const monster = c as Combatant & Monster;
			let resist = null;
			let vuln = null;
			let immune = null;
			let conc = null;
			if (monster.damage.resist) {
				resist = (
					<div className='section'>
						<b>resistances</b> {monster.damage.resist} {this.props.combatants.length > 1 ? <i> - {Napoleon.getCombatantName(c, [])}</i> : null}
					</div>
				);
			}
			if (monster.damage.vulnerable) {
				vuln = (
					<div className='section'>
						<b>vulnerabilities</b> {monster.damage.vulnerable} {this.props.combatants.length > 1 ? <i> - {Napoleon.getCombatantName(c, [])}</i> : null}
					</div>
				);
			}
			if (monster.damage.immune) {
				immune = (
					<div className='section'>
						<b>immunities</b> {monster.damage.immune} {this.props.combatants.length > 1 ? <i> - {Napoleon.getCombatantName(c, [])}</i> : null}
					</div>
				);
			}
			if (monster.tags.includes('conc')) {
				conc = (
					<div className='section'>
						{Napoleon.getCombatantName(monster, [])} is <b>concentrating</b>, and will need to make a check if they take damage
					</div>
				);
			}
			if (resist || vuln || immune || conc) {
				return (
					<Note key={c.id}>
						{resist}
						{vuln}
						{immune}
						{conc}
					</Note>
				);
			}
			return null;
		});

		let damageSection = null;
		if (this.props.combatants.length === 1) {
			const combatantID = this.props.combatants[0].id;

			let value: number | JSX.Element = this.state.value;
			if ((this.state.damageMode === 'damage') && (this.state.value > 0)) {
				const multiplier = this.state.damageMultipliers[combatantID] ?? 1;
				if (multiplier < 1) {
					// Halved
					value = (
						<div>{this.state.value} hp <ArrowRightOutlined className='inline-text'/> {Math.floor(this.state.value / 2)} hp</div>
					);
				}
				if (multiplier > 1) {
					// Doubled
					value = (
						<div>{this.state.value} hp <ArrowRightOutlined className='inline-text'/> {this.state.value * 2} hp</div>
					);
				}
			}

			damageSection = (
				<div>
					<Selector
						options={Utils.arrayToItems(['damage', 'healing', 'temp hp'])}
						selectedID={this.state.damageMode}
						onSelect={id => this.setState({ damageMode: id })}
					/>
					<div className='content-then-icons'>
						<div className='content'>
							<NumberSpin
								label={this.state.damageMode}
								value={value}
								factors={[1, 10]}
								downEnabled={this.state.value > 0}
								onNudgeValue={delta => this.nudgeValue(delta)}
							/>
							<Conditional display={this.state.damageMode === 'damage'}>
								{this.getDamageMultiplier(combatantID)}
							</Conditional>
						</div>
						<div className='icons'>
							<Conditional display={this.state.damageMode === 'damage'}>
								<CheckCircleOutlined className={this.state.value === 0 ? 'disabled' : ''} title='apply damage' onClick={() => this.damage()} />
							</Conditional>
							<Conditional display={this.state.damageMode === 'healing'}>
								<CheckCircleOutlined className={this.state.value === 0 ? 'disabled' : ''} title='apply healing' onClick={() => this.heal()} />
							</Conditional>
							<Conditional display={this.state.damageMode === 'temp hp'}>
								<CheckCircleOutlined className={this.state.value === 0 ? 'disabled' : ''} title='apply temp hp' onClick={() => this.addTempHP()} />
							</Conditional>
						</div>
					</div>
				</div>
			);
		} else {
			const degrees = this.props.combatants.map(c => {
				if (this.props.combatants.length === 1) {
					return (
						<div key={c.id}>
							{this.getDamageMultiplier(c.id)}
						</div>
					);
				}
				return (
					<Row key={c.id} align='middle' justify='center'>
						<Col span={8}>
							<div>{Napoleon.getCombatantName(c, [])}</div>
						</Col>
						<Col span={16}>
							{this.getDamageMultiplier(c.id)}
						</Col>
					</Row>
				);
			});
			damageSection = (
				<div>
					<NumberSpin
						value={this.state.value}
						label='damage'
						factors={[1, 10]}
						downEnabled={this.state.value > 0}
						onNudgeValue={delta => this.nudgeValue(delta)}
					/>
					{degrees}
					<button className={this.state.value === 0 ? 'disabled' : ''} onClick={() => this.damage()}>apply damage</button>
					<hr/>
					<Expander text='healing'>
						<div className='content-then-icons'>
							<div className='content'>
								<NumberSpin
									value={this.state.value}
									label='healing'
									factors={[1, 10]}
									downEnabled={this.state.value > 0}
									onNudgeValue={delta => this.nudgeValue(delta)}
								/>
							</div>
							<div className='icons'>
								<CheckCircleOutlined className={this.state.value === 0 ? 'disabled' : ''} title='apply healing' onClick={() => this.heal()} />
							</div>
						</div>
					</Expander>
				</div>
			)
		}

		let defeatedBtn = null;
		const atZero = this.props.combatants.filter(c => (c.hpCurrent != null) && (c.hpCurrent <= 0));
		if (atZero.length > 0) {
			const txt = (atZero.length === 1) && (atZero[0].current) ? 'mark as defeated and end turn' : 'mark as defeated';
			let names = null;
			if (this.props.combatants.length > 1) {
				names = (
					<ul>
						{atZero.map(c => <li key={c.id}>{Napoleon.getCombatantName(c, [])}</li>)}
					</ul>
				);
			}
			defeatedBtn = (
				<button onClick={() => this.props.makeDefeated(atZero)}>
					{txt}
					{names}
				</button>
			);
		}

		return (
			<div>
				{modifiers}
				{damageSection}
				{defeatedBtn}
			</div>
		);
	}

	private getConditionSection() {
		const conditionImmunities = this.props.combatants.map(c => {
			if (c.type !== 'monster') {
				return null;
			}

			const monster = c as Combatant & Monster;
			if (!monster.conditionImmunities) {
				return null;
			}

			return (
				<Note key={c.id}>
					<div className='section'>
						<b>immunities</b> {monster.conditionImmunities} {this.props.combatants.length > 1 ? <i> - {Napoleon.getCombatantName(c, [])}</i> : null}
					</div>
				</Note>
			);
		});

		const conditions = (
			<ConditionsPanel
				combatants={this.props.combatants}
				allCombatants={this.props.allCombatants}
				addCondition={() => this.props.addCondition(this.props.combatants)}
				editCondition={(combatant, condition) => this.props.editCondition(combatant, condition)}
				deleteCondition={(combatant, condition) => this.props.deleteCondition(combatant, condition)}
				nudgeConditionValue={(condition, type, delta) => this.props.nudgeValue(condition, type, delta)}
			/>
		);

		return (
			<div>
				{conditionImmunities}
				{conditions}
			</div>
		);
	}

	private getMapSection() {
		if (!this.props.map) {
			return null;
		}

		const allOnMap = this.props.combatants.every(c => {
			return this.props.map && this.props.map.items.find(i => i.id === c.id);
		});
		if (allOnMap) {
			let undo: { enabled: boolean, text: JSX.Element, onUndo: () => void } | null = null;
			let altitude: { enabled: boolean, text: JSX.Element } | null = null;
			let aura = null;
			let place = null;
			if (this.props.combatants.length === 1) {
				const combatant = this.props.combatants[0];
				const mi = this.props.map.items.find(i => i.id === combatant.id);
				if (mi) {
					if (combatant.path) {
						const d = Mercator.getDistance(mi, combatant.path, this.props.options.diagonals);
						undo = {
							enabled: combatant.path.length > 0,
							text: (
								<div className='section centered'>
									<b>{d * 5}</b> ft
								</div>
							),
							onUndo: () => this.props.undoStep(combatant)
						};
					}
					altitude = {
						enabled: true,
						text: (
							<div className='section centered'>
								<b>{mi.z * 5}</b> ft
							</div>
						)
					};
				}
				let auraDetails = null;
				if (combatant.aura.radius > 0) {
					auraDetails = (
						<div>
							<Selector
								options={Utils.arrayToItems(['square', 'rounded', 'circle'])}
								selectedID={combatant.aura.style}
								onSelect={optionID => this.props.changeValue(combatant.aura, 'style', optionID)}
							/>
							<input
								type='color'
								value={combatant.aura.color}
								onChange={event => this.props.changeValue(combatant.aura, 'color', event.target.value)}
							/>
							<button onClick={() => this.props.changeValue(combatant.aura, 'radius', 0)}>remove aura</button>
						</div>
					);
				}
				aura = (
					<Expander text='aura'>
						<NumberSpin
							value={combatant.aura.radius + ' ft.'}
							label='radius'
							downEnabled={combatant.aura.radius > 0}
							onNudgeValue={delta => this.props.nudgeValue(combatant.aura, 'radius', delta * 5)}
						/>
						{auraDetails}
					</Expander>
				);
				place = (
					<button onClick={() => this.props.mapAdd(combatant)}>place on a different square</button>
				);
			}

			return (
				<div>
					<MovementPanel
						showToggle={true}
						undo={undo}
						altitude={altitude}
						onMove={(dir, step) => this.props.mapMove(this.props.combatants, dir, step)}
					/>
					<hr/>
					{aura}
					{place}
					<button onClick={() => this.props.mapRemove(this.props.combatants)}>remove from the map</button>
				</div>
			);
		}

		if (this.props.combatants.length === 1) {
			return (
				<button key='mapAdd' onClick={() => this.props.mapAdd(this.props.combatants[0])}>add to the map</button>
			);
		}

		return null;
	}

	private getAdvancedSection() {
		let remove = null;
		if (this.props.removeCombatants && this.props.combatants.every(c => !c.current)) {
			remove = (
				<ConfirmButton
					onConfirm={() => {
						if (this.props.removeCombatants) {
							this.props.removeCombatants(this.props.combatants);
						}
					}}
				>
					remove from encounter
				</ConfirmButton>
			);
		}

		let changeName = null;
		let changeHP = null;
		let changeSize = null;
		let changeInit = null;
		let changeFaction = null;
		let changeDarkvision = null;
		let changeLight = null;
		let mountedCombat = null;
		let notes = null;
		if (this.props.combatants.length === 1) {
			const combatant = this.props.combatants[0];
			changeName = (
				<Expander text='name'>
					<Textbox
						text={combatant.displayName}
						onChange={value => this.props.changeValue(combatant, 'displayName', value)}
					/>
				</Expander>
			);

			if (combatant.type === 'monster') {
				const monster = combatant as Combatant & Monster;
				changeHP = (
					<Expander text='hit points'>
						<NumberSpin
							value={monster.hpCurrent ?? 0}
							label='hp'
							factors={[1, 10]}
							downEnabled={(monster.hpCurrent ?? 0) > 0}
							upEnabled={(monster.hpCurrent ?? 0) < (monster.hpMax ?? 0)}
							onNudgeValue={delta => this.props.nudgeValue(monster, 'hpCurrent', delta)}
						/>
						<NumberSpin
							value={monster.hpTemp ?? 0}
							label='temp hp'
							factors={[1, 10]}
							downEnabled={(monster.hpTemp ?? 0) > 0}
							onNudgeValue={delta => this.props.nudgeValue(monster, 'hpTemp', delta)}
						/>
					</Expander>
				);
			}

			changeSize = (
				<Expander text='size'>
					<NumberSpin
						value={combatant.displaySize}
						label='size'
						downEnabled={combatant.displaySize !== 'tiny'}
						upEnabled={combatant.displaySize !== 'gargantuan'}
						onNudgeValue={delta => this.props.nudgeValue(combatant, 'displaySize', delta)}
					/>
				</Expander>
			);

			if (!combatant.pending) {
				changeInit = (
					<Expander text='initiative score'>
						<NumberSpin
							value={combatant.initiative ?? 0}
							label='initiative'
							onNudgeValue={delta => this.props.nudgeValue(combatant, 'initiative', delta)}
						/>
					</Expander>
				);
			}

			changeFaction = (
				<Expander text='faction'>
					<Selector
						options={Utils.arrayToItems(['foe', 'neutral', 'ally'])}
						selectedID={combatant.faction}
						onSelect={id => this.props.changeValue(combatant, 'faction', id)}
					/>
				</Expander>
			);

			changeDarkvision = (
				<Expander text='vision'>
					<NumberSpin
						value={combatant.darkvision + ' ft'}
						label='darkvision'
						downEnabled={combatant.darkvision > 0}
						onNudgeValue={delta => this.props.nudgeValue(combatant, 'darkvision', delta * 10)}
					/>
				</Expander>
			);

			changeLight = (
				<Expander text='light source'>
					<Selector
						options={Utils.arrayToItems(['none', 'candle', 'torch', 'lantern', 'custom'])}
						selectedID={combatant.lightSource ? combatant.lightSource.name : 'none'}
						onSelect={id => {
							switch (id) {
								case 'none':
									this.props.changeValue(combatant, 'lightSource', null);
									break;
								case 'candle':
									this.props.changeValue(combatant, 'lightSource', { name: 'candle', bright: 5, dim: 10 });
									break;
								case 'torch':
									this.props.changeValue(combatant, 'lightSource', { name: 'torch', bright: 20, dim: 40 });
									break;
								case 'lantern':
									this.props.changeValue(combatant, 'lightSource', { name: 'lantern', bright: 30, dim: 60 });
									break;
								case 'custom':
									{
										const bright = combatant.lightSource ? combatant.lightSource.bright : 0;
										const dim = combatant.lightSource ? combatant.lightSource.dim : 0;
										this.props.changeValue(combatant, 'lightSource', { name: 'custom', bright: bright, dim: dim });
									}
									break;
							}
						}}
					/>
					<Conditional display={(combatant.lightSource !== null) && (combatant.lightSource.name === 'custom')}>
						<NumberSpin
							label='bright light radius'
							value={(combatant.lightSource ? combatant.lightSource.bright : 0) + ' ft'}
							downEnabled={(combatant.lightSource !== null) && (combatant.lightSource.bright > 0)}
							upEnabled={(combatant.lightSource !== null) && (combatant.lightSource.bright < combatant.lightSource.dim)}
							onNudgeValue={delta => this.props.nudgeValue(combatant.lightSource, 'bright', delta * 5)}
						/>
						<NumberSpin
							label='dim light radius'
							value={(combatant.lightSource ? combatant.lightSource.dim : 0) + ' ft'}
							downEnabled={(combatant.lightSource !== null) && (combatant.lightSource.dim > combatant.lightSource.bright)}
							onNudgeValue={delta => this.props.nudgeValue(combatant.lightSource, 'dim', delta * 5)}
						/>
					</Conditional>
				</Expander>
			);

			const rider = this.props.allCombatants.find(c => c.mountID === combatant.id);
			if (!rider) {
				const currentMountIDs = this.props.allCombatants
					.filter(c => c.id !== combatant.id)
					.filter(c => !!c.mountID).map(c => c.mountID);
				const mountOptions = this.props.allCombatants
					.filter(c => c.id !== combatant.id)				// Don't include me
					.filter(c => c.type !== 'placeholder')			// Don't include placeholders
					.filter(c => !c.mountID)						// Don't include anyone that's mounted
					.filter(c => !currentMountIDs.includes(c.id))	// Don't include anyone that is a mount for anyone else
					.map(c => ({ id: c.id, text: Napoleon.getCombatantName(c, []) }));
				Utils.sort(mountOptions, [{ field: 'text', dir: 'asc' }]);
				let mountSelector = null;
				if (mountOptions.length > 0) {
					mountSelector = (
						<div>
							<div className='subheading'>mounted on:</div>
							<Dropdown
								options={mountOptions}
								selectedID={combatant.mountID}
								onSelect={id => this.props.changeValue(combatant, 'mountID', id)}
								onClear={() => this.props.changeValue(combatant, 'mountID', null)}
							/>
						</div>
					);
				} else {
					mountSelector = (
						<Note>
							no mounts available
						</Note>
					);
				}
				let mountType = null;
				if (combatant.mountID) {
					mountType = (
						<div>
							<div className='subheading'>mount is:</div>
							<Selector
								options={Utils.arrayToItems(['controlled', 'independent'])}
								selectedID={combatant.mountType}
								onSelect={id => this.props.changeValue(combatant, 'mountType', id)}
							/>
						</div>
					);
				}
				mountedCombat = (
					<Expander text='mounted combat'>
						{mountSelector}
						{mountType}
					</Expander>
				);
			}

			notes = (
				<div>
					<hr/>
					<MarkdownEditor text={combatant.note} onChange={text => this.props.changeValue(combatant, 'note', text)} />
				</div>
			);
		}

		const companions: JSX.Element[] = [];
		this.props.combatants
			.filter(c => c.type === 'pc')
			.forEach(pc => {
				(pc as Combatant & PC).companions
					.filter(comp => !this.props.allCombatants.find(c => c.id === comp.id))
					.forEach(comp => {
						companions.push(
							<button key={comp.id} onClick={() => this.props.addCompanion(comp)}>add {comp.name}</button>
						);
					});
				});

		return (
			<div>
				{remove}
				{changeName}
				{changeHP}
				{changeSize}
				{changeInit}
				{changeFaction}
				{changeDarkvision}
				{changeLight}
				{mountedCombat}
				{companions}
				{notes}
			</div>
		);
	}

	public render() {
		try {
			const views = ['main', 'hp', 'cond', 'map', 'adv'];
			const controlledMounts = this.props.allCombatants
				.filter(c => !!c.mountID && (c.mountType === 'controlled'))
				.map(c => c.mountID || '');
			if (!this.props.map || this.props.combatants.some(c => controlledMounts.includes(c.id))) {
				// Either:
				// * No combat map
				// * Some selected combatants are controlled mounts
				// ... so remove the map option
				views.splice(3, 1);
			}
			if (!this.props.combatants.every(c => c.type === 'monster')) {
				// Not everything is a monster, so don't show the HP tab
				views.splice(1, 1);
			}

			if (!this.props.showTabs) {
				return (
					<div>
						{views.includes('main') ? this.getMainSection() : null}
						{views.includes('hp') ? (
							<div>
								<hr/>
								{this.getHPSection()}
							</div>
						) : null}
						{views.includes('cond') ? (
							<div>
								<hr/>
								{this.getConditionSection()}
							</div>
						) : null}
						{views.includes('map') ? (
							<div>
								<hr/>
								{this.getMapSection()}
							</div>
						) : null}
						{views.includes('adv') ? (
							<div>
								<hr/>
								<Expander text='advanced controls'>
									{this.getAdvancedSection()}
								</Expander>
							</div>
						) : null}
					</div>
				);
			}

			let currentView = this.state.view;
			if (!views.includes(currentView)) {
				currentView = views[0];
			}

			let content = null;
			switch (currentView) {
				case 'main':
					content = this.getMainSection();
					break;
				case 'hp':
					content = this.getHPSection();
					break;
				case 'cond':
					content = this.getConditionSection();
					break;
				case 'map':
					content = this.getMapSection();
					break;
				case 'adv':
					content = this.getAdvancedSection();
					break;
			}

			return (
				<div className='combat-controls'>
					<Tabs
						options={Utils.arrayToItems(views)}
						selectedID={currentView}
						onSelect={option => this.setView(option)}
					/>
					{content}
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='CombatControlsPanel' error={e} />;
		}
	}
}

interface CombatantTagsProps {
	combatants: Combatant[];
	editable: boolean;
	toggleTag: (combatants: Combatant[], tag: string) => void;
	toggleCondition: (combatants: Combatant[], condition: string) => void;
	toggleHidden: (combatants: Combatant[]) => void;
}

export class CombatantTags extends React.Component<CombatantTagsProps> {
	private createTag(name: string, checked: boolean, onChange: () => void) {
		if (!this.props.editable) {
			if (checked) {
				return (
					<Tag>
						{name}
					</Tag>
				);
			}

			return null;
		}

		return (
			<Tag.CheckableTag checked={checked} onChange={() => onChange()}>
				{name}
			</Tag.CheckableTag>
		);
	}

	public render() {
		try {
			return (
				<div className='section'>
					{this.createTag('bane', this.props.combatants.every(c => c.tags.includes('bane')), () => this.props.toggleTag(this.props.combatants, 'bane'))}
					{this.createTag('bless', this.props.combatants.every(c => c.tags.includes('bless')), () => this.props.toggleTag(this.props.combatants, 'bless'))}
					{this.createTag('concentrating', this.props.combatants.every(c => c.tags.includes('conc')), () => this.props.toggleTag(this.props.combatants, 'conc'))}
					{this.createTag('hidden', !this.props.combatants.every(c => c.showOnMap), () => this.props.toggleHidden(this.props.combatants))}
					{this.createTag('prone', this.props.combatants.every(c => c.conditions.some(condition => condition.name === 'prone')), () => this.props.toggleCondition(this.props.combatants, 'prone'))}
					{this.createTag('unconscious', this.props.combatants.every(c => c.conditions.some(condition => condition.name === 'unconscious')), () => this.props.toggleCondition(this.props.combatants, 'unconscious'))}
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='CombatantTags' error={e} />;
		}
	}
}
