import { DeleteOutlined, InfoCircleOutlined, MenuOutlined, PlusCircleOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Col, Drawer, Popover, Row } from 'antd';
import React from 'react';
import { List } from 'react-movable';

import { Factory } from '../../../utils/factory';
import { Frankenstein } from '../../../utils/frankenstein';
import { Gygax } from '../../../utils/gygax';
import { Matisse } from '../../../utils/matisse';
import { Napoleon } from '../../../utils/napoleon';
import { Shakespeare } from '../../../utils/shakespeare';
import { Sherlock } from '../../../utils/sherlock';
import { Utils } from '../../../utils/utils';

import { MonsterFilter } from '../../../models/encounter';
import { Options } from '../../../models/misc';
import { CATEGORY_TYPES, Monster, MonsterGroup, Trait, TRAIT_TYPES } from '../../../models/monster';

import { RenderError } from '../../error';
import { MonsterStatblockCard } from '../../cards/monster-statblock-card';
import { MonsterTemplateCard } from '../../cards/monster-template-card';
import { Checkbox } from '../../controls/checkbox';
import { Conditional } from '../../controls/conditional';
import { Expander } from '../../controls/expander';
import { Group } from '../../controls/group';
import { Note } from '../../controls/note';
import { NumberSpin } from '../../controls/number-spin';
import { Selector } from '../../controls/selector';
import { Tabs } from '../../controls/tabs';
import { Textbox } from '../../controls/textbox';
import { FilterPanel } from '../../panels/filter-panel';
import { PortraitPanel } from '../../panels/portrait-panel';
import { TraitEditorPanel, TraitPanel } from '../../panels/traits-panel';

interface Props {
	monster: Monster;
	library: MonsterGroup[];
	options: Options;
}

interface State {
	monster: Monster;
	page: string;
	selectedTraitID: string | null;
	sidebarView: string;
	helpSection: string;
	similarFilter: {
		size: boolean,
		type: boolean,
		subtype: boolean,
		role: boolean,
		alignment: boolean,
		challenge: boolean
	};
	addingToScratchpad: boolean;
	scratchpadAddMode: string;
	scratchpadFilter: MonsterFilter;
	scratchpadList: Monster[];
	inspectedMonster: Monster | null;
}

export class MonsterEditorModal extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			monster: props.monster,
			page: 'overview',
			selectedTraitID: null,
			sidebarView: 'statblock',
			helpSection: 'type',
			similarFilter: {
				size: true,
				type: true,
				subtype: false,
				role: false,
				alignment: false,
				challenge: true
			},
			addingToScratchpad: false,
			scratchpadAddMode: 'similar',
			scratchpadFilter: Factory.createMonsterFilter(),
			scratchpadList: [],
			inspectedMonster: null
		};
	}

	private setPage(page: string) {
		const sections = this.getHelpOptionsForPage(page);
		this.setState({
			page: page,
			helpSection: sections[0]
		});
	}

	private recalculateRole() {
		const monster = this.state.monster;
		monster.role = Frankenstein.getRole(monster);
	}

	private addTrait(type: 'trait' | 'action' | 'bonus' | 'reaction' | 'legendary' | 'mythic' | 'lair') {
		const trait = Frankenstein.addTrait(this.state.monster, type);
		this.recalculateRole();
		this.setState({
			monster: this.state.monster,
			selectedTraitID: trait.id
		});
	}

	private moveTrait(trait: Trait, moveBefore: Trait) {
		const oldIndex = this.state.monster.traits.indexOf(trait);
		const newIndex = this.state.monster.traits.indexOf(moveBefore);
		Frankenstein.moveTrait(this.state.monster, oldIndex, newIndex);
		this.recalculateRole();
		this.setState({
			monster: this.state.monster,
			page: 'features'
		});
	}

	private copyTrait(trait: Trait, sourceMonster: Monster | null) {
		const newTrait = Frankenstein.copyTrait(trait, this.state.monster, sourceMonster);
		this.recalculateRole();
		this.setState({
			monster: this.state.monster,
			page: 'features',
			selectedTraitID: newTrait.id
		});
	}

	private changeTrait(trait: Trait, field: string, value: any) {
		(trait as any)[field] = value;
		this.recalculateRole();
		this.setState({
			monster: this.state.monster,
			page: 'features'
		});
	}

	private deleteTrait(trait: Trait) {
		Frankenstein.removeTrait(this.state.monster, trait);
		this.recalculateRole();
		this.setState({
			monster: this.state.monster,
			page: 'features',
			selectedTraitID: null
		});
	}

	private applyTheme(monster: Monster) {
		this.setState({
			monster: Frankenstein.applyTheme(this.state.monster, monster)
		});
	}

	private changeValue(field: string, value: any) {
		Frankenstein.changeValue(this.state.monster, field, value);
		this.recalculateRole();
		this.setState({
			monster: this.state.monster
		});
	}

	private nudgeValue(field: string, delta: number) {
		Frankenstein.nudgeValue(this.state.monster, field, delta);
		this.recalculateRole();
		this.setState({
			monster: this.state.monster
		});
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Scratchpad

	private setHelpSection(section: string) {
		this.setState({
			helpSection: section
		});
	}

	private toggleMatch(type: 'size' | 'type' | 'subtype' | 'role' | 'alignment' | 'challenge') {
		const filter = this.state.similarFilter;
		filter[type] = !filter[type];
		this.setState({
			similarFilter: filter
		});
	}

	private addToScratchpad(monster: Monster) {
		const list = this.state.scratchpadList;
		list.push(monster);
		Utils.sort(list);
		this.setState({
			scratchpadList: list
		});
	}

	private removeFromScratchpad(monster: Monster) {
		const index = this.state.scratchpadList.indexOf(monster);
		this.state.scratchpadList.splice(index, 1);
		this.setState({
			scratchpadList: this.state.scratchpadList
		});
	}

	private addAllToScratchpad(monsters: Monster[]) {
		const list = this.state.scratchpadList;
		monsters.forEach(m => list.push(m));
		Utils.sort(list);
		this.setState({
			scratchpadList: list
		});
	}

	private clearScratchpad() {
		this.setState({
			scratchpadList: []
		});
	}

	private spliceMonsters() {
		Frankenstein.spliceMonsters(this.state.monster, this.state.scratchpadList);
		this.recalculateRole();
		this.setState({
			monster: this.state.monster
		});
	}

	private getHelpOptionsForPage(page: string) {
		switch (page) {
			case 'overview':
				return ['type', 'subtype', 'align', 'challenge', 'size', 'speed', 'lang'];
			case 'abilities':
				return ['str', 'dex', 'con', 'int', 'wis', 'cha', 'saves', 'skills', 'senses'];
			case 'combat':
				return ['armor class', 'hit dice', 'resist', 'vulnerable', 'immune', 'conditions'];
			case 'features':
				return ['features'];
		}

		return [];
	}

	private getSimilarMonsters() {
		const monsters: Monster[] = [];
		this.props.library.forEach(group => {
			group.monsters.forEach(monster => {
				let match = true;

				if (this.state.monster.id === monster.id) {
					match = false;
				}

				if (this.state.similarFilter.size && (this.state.monster.size !== monster.size)) {
					match = false;
				}

				if (this.state.similarFilter.type && (this.state.monster.category !== monster.category)) {
					match = false;
				}

				if (this.state.similarFilter.subtype && (this.state.monster.tag !== monster.tag)) {
					match = false;
				}

				if (this.state.similarFilter.role && (this.state.monster.role !== monster.role)) {
					match = false;
				}

				if (this.state.similarFilter.alignment && (this.state.monster.alignment !== monster.alignment)) {
					match = false;
				}

				if (this.state.similarFilter.challenge && (this.state.monster.challenge !== monster.challenge)) {
					match = false;
				}

				if (match) {
					monsters.push(monster);
				}
			});
		});

		return monsters;
	}

	private setRandomValue(field: string) {
		Frankenstein.setRandomValue(this.state.monster, field, this.state.scratchpadList);
		this.recalculateRole();
		this.setState({
			monster: this.state.monster
		});
	}

	private addRandomTrait(type: string) {
		Frankenstein.addRandomTrait(this.state.monster, type, this.state.scratchpadList);
		this.recalculateRole();
		this.setState({
			monster: this.state.monster
		});
	}

	private changeFilterValue(type: 'name' | 'challenge' | 'category' | 'size' | 'role', value: any) {
		const filter = this.state.scratchpadFilter as any;
		if (type === 'challenge') {
			filter.challengeMin = value[0];
			filter.challengeMax = value[1];
		} else {
			filter[type] = value;
		}
		this.setState({
			scratchpadFilter: filter
		});
	}

	private resetFilter() {
		this.setState({
			scratchpadFilter: Factory.createMonsterFilter()
		});
	}

	private matchMonster(monster: Monster) {
		return Napoleon.matchMonster(monster, this.state.scratchpadFilter);
	}

	private getHelpSection() {
		switch (this.state.helpSection) {
			case 'type':
				return this.getValueSection('category', 'text', this.state.monster.category);
			case 'subtype':
				return this.getValueSection('tag', 'text', this.state.monster.tag);
			case 'align':
				return this.getValueSection('alignment', 'text', this.state.monster.alignment);
			case 'challenge':
				return this.getValueSection('challenge', 'number', this.state.monster.challenge);
			case 'size':
				return this.getValueSection('size', 'text', this.state.monster.size);
			case 'speed':
				return this.getValueSection('speed', 'text', this.state.monster.speed);
			case 'lang':
				return this.getValueSection('languages', 'text', this.state.monster.languages);
			case 'str':
				return this.getValueSection('abilityScores.str', 'number', this.state.monster.abilityScores.str);
			case 'dex':
				return this.getValueSection('abilityScores.dex', 'number', this.state.monster.abilityScores.dex);
			case 'con':
				return this.getValueSection('abilityScores.con', 'number', this.state.monster.abilityScores.con);
			case 'int':
				return this.getValueSection('abilityScores.int', 'number', this.state.monster.abilityScores.int);
			case 'wis':
				return this.getValueSection('abilityScores.wis', 'number', this.state.monster.abilityScores.wis);
			case 'cha':
				return this.getValueSection('abilityScores.cha', 'number', this.state.monster.abilityScores.cha);
			case 'saves':
				return this.getValueSection('savingThrows', 'text', this.state.monster.savingThrows);
			case 'skills':
				return this.getValueSection('skills', 'text', this.state.monster.skills);
			case 'senses':
				return this.getValueSection('senses', 'text', this.state.monster.senses);
			case 'armor class':
				return this.getValueSection('ac', 'number', this.state.monster.ac);
			case 'hit dice':
				return this.getValueSection('hitDice', 'number', this.state.monster.hitDice);
			case 'resist':
				return this.getValueSection('damage.resist', 'text', this.state.monster.damage.resist);
			case 'vulnerable':
				return this.getValueSection('damage.vulnerable', 'text', this.state.monster.damage.vulnerable);
			case 'immune':
				return this.getValueSection('damage.immune', 'text', this.state.monster.damage.immune);
			case 'conditions':
				return this.getValueSection('conditionImmunities', 'text', this.state.monster.conditionImmunities);
			case 'features':
				return this.getFeaturesSection();
			default:
				return null;
		}
	}

	private getValueSection(field: string, dataType: 'text' | 'number', currentValue: any) {
		const values: any[] = this.state.scratchpadList
			.map(m => {
				const tokens = field.split('.');
				let source: any = m;
				let value = null;
				tokens.forEach(tkn => {
					if (tkn === tokens[tokens.length - 1]) {
						value = source[tkn];
					} else {
						source = source[tkn];
					}
				});
				if ((dataType === 'text') && (value === '')) {
					value = null;
				}
				return value;
			})
			.filter(v => v !== null);

		const distinct: { value: any, count: number }[] = [];
		if (dataType === 'number') {
			let min: number | null = null;
			let max: number | null = null;
			values.forEach(v => {
				if ((min === null) || (v < min)) {
					min = v;
				}
				if ((max === null) || (v > max)) {
					max = v;
				}
			});
			if ((min !== null) && (max !== null)) {
				for (let n = min; n <= max; ++n) {
					distinct.push({
						value: n,
						count: 0
					});
				}
			}
		}
		values.forEach(v => {
			const current = distinct.find(d => d.value === v);
			if (current) {
				current.count += 1;
			} else {
				distinct.push({
					value: v,
					count: 1
				});
			}
		});

		switch (dataType) {
			case 'number':
				Utils.sort(distinct, [{ field: 'value', dir: 'asc' }]);
				break;
			case 'text':
				Utils.sort(distinct, [{ field: 'count', dir: 'desc' }, { field: 'value', dir: 'asc' }]);
				break;
			default:
				// Do nothing
				break;
		}

		if (dataType === 'text') {
			const count = this.state.scratchpadList.length - values.length;
			if (count !== 0) {
				distinct.push({
					value: '',
					count: this.state.scratchpadList.length - values.length
				});
			}
		}

		const valueSections = distinct.map((d, index) => {
			let style = 'value-list';
			if (d.value === currentValue) {
				style += ' current-value';
			}
			const width = 100 * d.count / this.state.scratchpadList.length;
			return (
				<Row key={index} className={style} gutter={10} align='middle'>
					<Col span={8} className='text-container'>
						{d.value || '(none specified)'}
					</Col>
					<Col span={8} className='bar-container'>
						<div className='bar' style={{ width: width + '%' }} />
					</Col>
					<Col span={8}>
						<button onClick={() => this.changeValue(field, d.value)}>use this value</button>
					</Col>
				</Row>
			);
		});

		return (
			<div>
				{valueSections}
			</div>
		);
	}

	private getFeaturesSection() {
		const rows = [];
		rows.push(
			<Row key='header' className='value-list' gutter={10} align='middle'>
				<Col span={8} className='text-container'>
					<b>type</b>
				</Col>
				<Col span={4} className='text-container number'>
					<b>avg</b>
				</Col>
				<Col span={4} className='text-container number'>
					<b>min - max</b>
				</Col>
			</Row>
		);

		TRAIT_TYPES.forEach(type => {
			let min: number | null = null;
			let max: number | null = null;
			let count = 0;
			this.state.scratchpadList.forEach(m => {
				const n = m.traits.filter(t => t.type === type).length;
				if ((min === null) || (n < min)) {
					min = n;
				}
				if ((max === null) || (n > max)) {
					max = n;
				}
				count += n;
			});
			const avg = Math.round(count / this.state.scratchpadList.length);

			rows.push(
				<Row key={type} className='value-list' gutter={10} align='middle'>
					<Col span={8} className={count === 0 ? 'text-container disabled' : 'text-container'}>
						{Gygax.traitType(type, true)}
					</Col>
					<Col span={4} className={count === 0 ? 'text-container number disabled' : 'text-container number'}>
						{avg}
					</Col>
					<Col span={4} className={count === 0 ? 'text-container number disabled' : 'text-container number'}>
						{min} - {max}
					</Col>
					<Col span={8}>
						<button className={count === 0 ? 'disabled' : ''} onClick={() => this.addRandomTrait(type)}>add random</button>
					</Col>
				</Row>
			);
		});

		return (
			<div>
				{rows}
			</div>
		);
	}

	private getScratchpad() {
		let content = null;

		if (this.state.scratchpadList.length > 0) {
			const list = Utils.sort(this.state.scratchpadList).map(m => (
				<div className='content-then-icons' key={m.id}>
					<div className='content'>
						<MonsterTemplateCard
							monster={m}
							section={this.state.page}
							copyTrait={trait => this.copyTrait(trait, m)}
						/>
					</div>
					<div className='icons vertical'>
						<InfoCircleOutlined title='show statblock' onClick={() => this.setState({ inspectedMonster: m })} />
						<DeleteOutlined title='remove monster' onClick={() => this.removeFromScratchpad(m)} />
					</div>
				</div>
			));

			let selector = null;
			if (this.getHelpOptionsForPage(this.state.page).length > 1) {
				selector = (
					<div>
						<Note>
							<div className='section'>
								select one of the following fields to see its values from your scratchpad monsters
							</div>
							<div className='section'>
								you can also press the <ThunderboltOutlined/> button beside a field to select a random value for that field
							</div>
						</Note>
						<Selector
							options={Utils.arrayToItems(this.getHelpOptionsForPage(this.state.page))}
							selectedID={this.state.helpSection}
							onSelect={optionID => this.setHelpSection(optionID)}
						/>
					</div>
				);
			}

			content = (
				<div>
					<Expander text='scratchpad monsters'>
						<Row gutter={10}>
							<Col span={12}>
								<button
									onClick={() => this.setState({ addingToScratchpad: true })}
								>
									add monsters to list
								</button>
							</Col>
							<Col span={12}>
								<button
									className={this.state.scratchpadList.length === 0 ? 'disabled' : ''}
									onClick={() => this.clearScratchpad()}
								>
									clear list
								</button>
							</Col>
						</Row>
						{list}
					</Expander>
					<div className='monster-help'>
						{selector}
						{this.getHelpSection()}
					</div>
				</div>
			);
		} else {
			content = (
				<button onClick={() => this.setState({ addingToScratchpad: true })}>
					add monsters to your scratchpad
				</button>
			);
		}

		return (
			<div>
				<Note>
					<div className='section'>
						this is your <b>scratchpad</b>; you can add monsters to it to see their combined statistics
					</div>
					<div className='section'>
						you might find this useful if, for example, you want your monster to have similar abilities to other monsters
					</div>
					<Conditional display={this.state.scratchpadList.length >= 2}>
						<div className='section'>
							you can also <button className='link' onClick={() => this.spliceMonsters()}>splice these monsters together</button> to create a unique hyrid monster
						</div>
					</Conditional>
				</Note>
				{content}
			</div>
		);
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	private getContent() {
		switch (this.state.page) {
			case 'overview':
				return (
					<OverviewTab
						monster={this.state.monster}
						allowRandomize={this.state.scratchpadList.length > 0}
						changeValue={(field, value) => this.changeValue(field, value)}
						nudgeValue={(field, delta) => this.nudgeValue(field, delta)}
						randomValue={field => this.setRandomValue(field)}
					/>
				);
			case 'abilities':
				return (
					<AbilitiesTab
						monster={this.state.monster}
						allowRandomize={this.state.scratchpadList.length > 0}
						changeValue={(field, value) => this.changeValue(field, value)}
						nudgeValue={(field, delta) => this.nudgeValue(field, delta)}
						randomValue={field => this.setRandomValue(field)}
					/>
				);
			case 'combat':
				return (
					<CombatTab
						monster={this.state.monster}
						allowRandomize={this.state.scratchpadList.length > 0}
						changeValue={(field, value) => this.changeValue(field, value)}
						nudgeValue={(field, delta) => this.nudgeValue(field, delta)}
						randomValue={field => this.setRandomValue(field)}
					/>
				);
			case 'features':
				return (
					<FeaturesTab
						monster={this.state.monster}
						selectedTraitID={this.state.selectedTraitID}
						addTrait={type => this.addTrait(type)}
						copyTrait={trait => this.copyTrait(trait, null)}
						moveTrait={(trait, moveBefore) => this.moveTrait(trait, moveBefore)}
						deleteTrait={trait => this.deleteTrait(trait)}
						selectTrait={trait => this.setState({ selectedTraitID: trait.id })}
						changeValue={(trait, type, value) => this.changeTrait(trait, type, value)}
					/>
				);
		}

		return null;
	}

	private getSidebar() {
		switch (this.state.sidebarView) {
			case 'statblock':
				return (
					<div>
						<MonsterStatblockCard monster={this.state.monster} />
						<hr/>
						<button onClick={() => Matisse.takeScreenshot('statblock')}>export statblock image</button>
					</div>
				);
			case 'guidelines':
				return (
					<GuidelinesPanel monster={this.state.monster} />
				);
			case 'scratchpad':
				return this.getScratchpad();
			case 'features':
				return (
					<FeatureBrowser
						monster={this.state.monster}
						library={this.props.library}
						importTrait={(trait, sourceMonster) => this.copyTrait(trait, sourceMonster)}
					/>
				);
		}

		return null;
	}

	private getDrawer() {
		const drawer: {
			visible: boolean,
			title: string
			content: JSX.Element | null,
			footer: JSX.Element | null,
			onClose: () => void
		} = {
			visible: false,
			title: 'drawer',
			content: null,
			footer: null,
			onClose: () => null
		};

		drawer.footer = (
			<button onClick={() => drawer.onClose()}>close</button>
		);

		if (this.state.inspectedMonster) {
			drawer.visible = true;
			drawer.title = 'monster';
			drawer.content = (
				<div className='scrollable padded'>
					<MonsterStatblockCard monster={this.state.inspectedMonster as Monster} />
					<hr/>
					<button onClick={() => Matisse.takeScreenshot('statblock')}>export statblock image</button>
					<button onClick={() => this.applyTheme(this.state.inspectedMonster as Monster)}>apply this monster as a theme</button>
				</div>
			);
			drawer.onClose = () => {
				this.setState({
					inspectedMonster: null
				});
			};
		}

		if (this.state.addingToScratchpad) {
			const sidebarOptions = [
				{
					id: 'similar',
					text: 'similar monsters'
				},
				{
					id: 'all',
					text: 'all monsters'
				}
			];

			let sidebarContent = null;
			switch (this.state.scratchpadAddMode) {
				case 'similar':
					sidebarContent = (
						<Expander text='similarity criteria'>
							<Checkbox
								label={'size ' + this.state.monster.size}
								checked={this.state.similarFilter.size}
								onChecked={value => this.toggleMatch('size')}
							/>
							<Checkbox
								label={'type ' + this.state.monster.category}
								checked={this.state.similarFilter.type}
								onChecked={value => this.toggleMatch('type')}
							/>
							<Checkbox
								label={this.state.monster.tag ? 'subtype ' + this.state.monster.tag : 'subtype'}
								checked={this.state.similarFilter.subtype}
								disabled={!this.state.monster.tag}
								onChecked={value => this.toggleMatch('subtype')}
							/>
							<Checkbox
								label={this.state.monster.role ? 'role ' + this.state.monster.role : 'role'}
								checked={this.state.similarFilter.role}
								disabled={!this.state.monster.role}
								onChecked={value => this.toggleMatch('role')}
							/>
							<Checkbox
								label={this.state.monster.alignment ? 'alignment ' + this.state.monster.alignment : 'alignment'}
								checked={this.state.similarFilter.alignment}
								disabled={!this.state.monster.alignment}
								onChecked={value => this.toggleMatch('alignment')}
							/>
							<Checkbox
								label={'challenge rating ' + Gygax.challenge(this.state.monster.challenge)}
								checked={this.state.similarFilter.challenge}
								onChecked={value => this.toggleMatch('challenge')}
							/>
						</Expander>
					);
					break;
				case 'all':
					sidebarContent = (
						<FilterPanel
							filter={this.state.scratchpadFilter}
							changeValue={(type, value) => this.changeFilterValue(type, value)}
							resetFilter={() => this.resetFilter()}
						/>
					);
					break;
			}

			let monsters: Monster[] = [];
			switch (this.state.scratchpadAddMode) {
				case 'similar':
					monsters = this.getSimilarMonsters();
					break;
				case 'all':
					this.props.library.forEach(group => {
						group.monsters.forEach(m => {
							if (!monsters.includes(m) && this.matchMonster(m)) {
								monsters.push(m);
							}
						});
					});
					break;
			}

			let emptyListNote = null;
			monsters = monsters.filter(m => !this.state.scratchpadList.find(lm => lm.id === m.id));
			if (monsters.length === 0) {
				emptyListNote = (
					<Note>
						<div className='section'>
							there are no monsters in your library which match the above criteria (or they are all in your scratchpad already)
						</div>
					</Note>
				);
			}

			drawer.visible = true;
			drawer.title = 'add to scratchpad';
			drawer.content = (
				<div className='scrollable padded'>
					<Tabs
						options={sidebarOptions}
						selectedID={this.state.scratchpadAddMode}
						onSelect={optionID => this.setState({scratchpadAddMode: optionID})}
					/>
					{sidebarContent}
					<button
						className={monsters.length === 0 ? 'disabled' : ''}
						onClick={() => this.addAllToScratchpad(monsters)}
					>
						add all to scratchpad
					</button>
					<hr/>
					{
						Utils.sort(monsters).map(m => (
							<Group key={m.id}>
								<div className='content-then-icons'>
									<div className='content'>
										<div>{m.name || 'unnamed monster'}</div>
									</div>
									<div className='icons'>
										<PlusCircleOutlined title='add monster' onClick={() => this.addToScratchpad(m)} />
									</div>
								</div>
							</Group>
						))
					}
					{emptyListNote}
				</div>
			);
			drawer.onClose = () => {
				this.setState({
					addingToScratchpad: false
				});
			};
		}

		return drawer;
	}

	public render() {
		try {
			const drawer = this.getDrawer();

			return (
				<Row className='full-height'>
					<Col span={12} className='scrollable'>
						<Tabs
							options={Utils.arrayToItems(['overview', 'abilities', 'combat', 'features'])}
							selectedID={this.state.page}
							onSelect={optionID => this.setPage(optionID)}
						/>
						{this.getContent()}
					</Col>
					<Col span={12} className='scrollable sidebar sidebar-right'>
						<Tabs
							options={Utils.arrayToItems(['statblock', 'guidelines', 'scratchpad', 'features'])}
							selectedID={this.state.sidebarView}
							onSelect={option => this.setState({ sidebarView: option })}
						/>
						{this.getSidebar()}
					</Col>
					<Drawer
						className={this.props.options.theme}
						closable={false}
						maskClosable={true}
						width='30%'
						visible={drawer.visible}
						onClose={() => drawer.onClose()}
					>
						<div className='drawer-header'><div className='app-title'>{drawer.title}</div></div>
						<div className='drawer-content'>{drawer.content}</div>
						<div className='drawer-footer'>{drawer.footer}</div>
					</Drawer>
				</Row>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='MonsterEditorModal' error={e} />;
		}
	}
}

interface OverviewTabProps {
	monster: Monster;
	allowRandomize: boolean;
	changeValue: (field: string, value: any) => void;
	nudgeValue: (field: string, delta: number) => void;
	randomValue: (field: string) => void;
}

class OverviewTab extends React.Component<OverviewTabProps> {
	private randomName() {
		const name = Shakespeare.capitalise(Shakespeare.generateName());
		this.props.changeValue('name', name);
	}

	public render() {
		try {
			return (
				<Row gutter={10} key='overview'>
					<Col span={24}>
						<div className='subheading'>name</div>
						<div className='content-then-icons'>
							<div className='content'>
								<Textbox
									text={this.props.monster.name}
									onChange={value => this.props.changeValue('name', value)}
								/>
							</div>
							<div className='icons'>
								<ThunderboltOutlined onClick={() => this.randomName()} title='generate a random name' />
							</div>
						</div>
						<div className='subheading'>type</div>
						<FieldPanel allowRandomize={this.props.allowRandomize} onRandomize={() => this.props.randomValue('category')}>
							<Selector
								options={Utils.arrayToItems(CATEGORY_TYPES)}
								selectedID={this.props.monster.category}
								itemsPerRow={5}
								onSelect={optionID => this.props.changeValue('category', optionID)}
							/>
						</FieldPanel>
					</Col>
					<Col span={12}>
						<div className='subheading'>subtype</div>
						<FieldPanel allowRandomize={this.props.allowRandomize} onRandomize={() => this.props.randomValue('tag')}>
							<Textbox
								text={this.props.monster.tag}
								placeholder='none'
								onChange={value => this.props.changeValue('tag', value)}
							/>
						</FieldPanel>
						<div className='subheading'>size</div>
						<FieldPanel allowRandomize={this.props.allowRandomize} onRandomize={() => this.props.randomValue('size')}>
							<NumberSpin
								value={this.props.monster.size}
								downEnabled={this.props.monster.size !== 'tiny'}
								upEnabled={this.props.monster.size !== 'gargantuan'}
								onNudgeValue={delta => this.props.nudgeValue('size', delta)}
							/>
						</FieldPanel>
						<div className='subheading'>alignment</div>
						<FieldPanel allowRandomize={this.props.allowRandomize} onRandomize={() => this.props.randomValue('alignment')}>
							<Textbox
								text={this.props.monster.alignment}
								onChange={value => this.props.changeValue('alignment', value)}
							/>
						</FieldPanel>
						<div className='subheading'>challenge rating</div>
						<FieldPanel allowRandomize={this.props.allowRandomize} onRandomize={() => this.props.randomValue('challenge')}>
							<NumberSpin
								value={Gygax.challenge(this.props.monster.challenge)}
								downEnabled={this.props.monster.challenge > 0}
								onNudgeValue={delta => this.props.nudgeValue('challenge', delta)}
							/>
						</FieldPanel>
					</Col>
					<Col span={12}>
						<div className='subheading'>
							speed
							&nbsp;
							<Popover
								content={(
									<div>
										<div className='section'>
											this can include special movement modes, which are:
										</div>
										<ul>
											<li>burrow speed</li>
											<li>climb speed</li>
											<li>fly speed (which might include the ability to hover)</li>
											<li>swim speed</li>
										</ul>
									</div>
								)}
							>
								<InfoCircleOutlined />
							</Popover>
						</div>
						<FieldPanel allowRandomize={this.props.allowRandomize} onRandomize={() => this.props.randomValue('speed')}>
							<Textbox
								text={this.props.monster.speed}
								onChange={value => this.props.changeValue('speed', value)}
							/>
						</FieldPanel>
						<div className='subheading'>languages</div>
						<FieldPanel allowRandomize={this.props.allowRandomize} onRandomize={() => this.props.randomValue('languages')}>
							<Textbox
								text={this.props.monster.languages}
								onChange={value => this.props.changeValue('languages', value)}
							/>
						</FieldPanel>
						<div className='subheading'>portrait</div>
						<PortraitPanel
							source={this.props.monster}
							setPortrait={data => this.props.changeValue('portrait', data)}
							clear={() => this.props.changeValue('portrait', '')}
						/>
					</Col>
				</Row>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='OverviewTab' error={e} />;
		}
	}
}

interface AbilitiesTabProps {
	monster: Monster;
	allowRandomize: boolean;
	changeValue: (field: string, value: any) => void;
	nudgeValue: (field: string, delta: number) => void;
	randomValue: (field: string) => void;
}

class AbilitiesTab extends React.Component<AbilitiesTabProps> {
	public render() {
		try {
			const challenge = Gygax.challenge(this.props.monster.challenge);
			const prof = Gygax.proficiency(this.props.monster.challenge);

			return (
				<Row gutter={10} key='abilities'>
					<Col span={12}>
						<div className='subheading'>strength</div>
						<FieldPanel allowRandomize={this.props.allowRandomize} onRandomize={() => this.props.randomValue('abilityScores.str')}>
							<NumberSpin
								value={this.props.monster.abilityScores.str + ' (' + Gygax.modifier(this.props.monster.abilityScores.str) + ')'}
								downEnabled={this.props.monster.abilityScores.str > 0}
								onNudgeValue={delta => this.props.nudgeValue('abilityScores.str', delta)}
							/>
						</FieldPanel>
						<div className='subheading'>dexterity</div>
						<FieldPanel allowRandomize={this.props.allowRandomize} onRandomize={() => this.props.randomValue('abilityScores.dex')}>
							<NumberSpin
								value={this.props.monster.abilityScores.dex + ' (' + Gygax.modifier(this.props.monster.abilityScores.dex) + ')'}
								downEnabled={this.props.monster.abilityScores.dex > 0}
								onNudgeValue={delta => this.props.nudgeValue('abilityScores.dex', delta)}
							/>
						</FieldPanel>
						<div className='subheading'>constitution</div>
						<FieldPanel allowRandomize={this.props.allowRandomize} onRandomize={() => this.props.randomValue('abilityScores.con')}>
							<NumberSpin
								value={this.props.monster.abilityScores.con + ' (' + Gygax.modifier(this.props.monster.abilityScores.con) + ')'}
								downEnabled={this.props.monster.abilityScores.con > 0}
								onNudgeValue={delta => this.props.nudgeValue('abilityScores.con', delta)}
							/>
						</FieldPanel>
						<div className='subheading'>intelligence</div>
						<FieldPanel allowRandomize={this.props.allowRandomize} onRandomize={() => this.props.randomValue('abilityScores.int')}>
							<NumberSpin
								value={this.props.monster.abilityScores.int + ' (' + Gygax.modifier(this.props.monster.abilityScores.int) + ')'}
								downEnabled={this.props.monster.abilityScores.int > 0}
								onNudgeValue={delta => this.props.nudgeValue('abilityScores.int', delta)}
							/>
						</FieldPanel>
						<div className='subheading'>wisdom</div>
						<FieldPanel allowRandomize={this.props.allowRandomize} onRandomize={() => this.props.randomValue('abilityScores.wis')}>
							<NumberSpin
								value={this.props.monster.abilityScores.wis + ' (' + Gygax.modifier(this.props.monster.abilityScores.wis) + ')'}
								downEnabled={this.props.monster.abilityScores.wis > 0}
								onNudgeValue={delta => this.props.nudgeValue('abilityScores.wis', delta)}
							/>
						</FieldPanel>
						<div className='subheading'>charisma</div>
						<FieldPanel allowRandomize={this.props.allowRandomize} onRandomize={() => this.props.randomValue('abilityScores.cha')}>
							<NumberSpin
								value={this.props.monster.abilityScores.cha + ' (' + Gygax.modifier(this.props.monster.abilityScores.cha) + ')'}
								downEnabled={this.props.monster.abilityScores.cha > 0}
								onNudgeValue={delta => this.props.nudgeValue('abilityScores.cha', delta)}
							/>
						</FieldPanel>
					</Col>
					<Col span={12}>
						<Note>
							<div className='section'>
								for skills and saving throws, remember that the proficiency bonus for a <b>cr {challenge}</b> monster is <b>+{prof}</b>
							</div>
						</Note>
						<div className='subheading'>saving throws</div>
						<FieldPanel allowRandomize={this.props.allowRandomize} onRandomize={() => this.props.randomValue('savingThrows')}>
							<Textbox
								text={this.props.monster.savingThrows}
								onChange={value => this.props.changeValue('savingThrows', value)}
							/>
						</FieldPanel>
						<div className='subheading'>skills</div>
						<FieldPanel allowRandomize={this.props.allowRandomize} onRandomize={() => this.props.randomValue('skills')}>
							<Textbox
								text={this.props.monster.skills}
								onChange={value => this.props.changeValue('skills', value)}
							/>
						</FieldPanel>
						<div className='subheading'>
							senses
							&nbsp;
							<Popover
								content={(
									<div>
										<div className='section'>
											this should include the monster's passive perception and the range of any special senses, which are:
										</div>
										<ul>
											<li>blindsight</li>
											<li>darkvision</li>
											<li>tremorsense</li>
											<li>truesight</li>
										</ul>
									</div>
								)}
							>
								<InfoCircleOutlined/>
							</Popover>
						</div>
						<FieldPanel allowRandomize={this.props.allowRandomize} onRandomize={() => this.props.randomValue('senses')}>
							<Textbox
								text={this.props.monster.senses}
								onChange={value => this.props.changeValue('senses', value)}
							/>
						</FieldPanel>
					</Col>
				</Row>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='AbilitiesTab' error={e} />;
		}
	}
}

interface CombatTabProps {
	monster: Monster;
	allowRandomize: boolean;
	changeValue: (field: string, value: any) => void;
	nudgeValue: (field: string, delta: number) => void;
	randomValue: (field: string) => void;
}

class CombatTab extends React.Component<CombatTabProps> {
	public render() {
		try {
			return (
				<Row gutter={10} key='combat'>
					<Col span={12}>
						<div className='subheading'>armor class</div>
						<FieldPanel allowRandomize={this.props.allowRandomize} onRandomize={() => this.props.randomValue('ac')}>
							<NumberSpin
								value={this.props.monster.ac}
								downEnabled={this.props.monster.ac > 0}
								onNudgeValue={delta => this.props.nudgeValue('ac', delta)}
							/>
						</FieldPanel>
						<div className='subheading'>armor type</div>
						<FieldPanel allowRandomize={this.props.allowRandomize} onRandomize={() => this.props.randomValue('acInfo')}>
							<Textbox
								text={this.props.monster.acInfo}
								onChange={value => this.props.changeValue('acInfo', value)}
							/>
						</FieldPanel>
						<div className='subheading'>hit dice</div>
						<FieldPanel allowRandomize={this.props.allowRandomize} onRandomize={() => this.props.randomValue('hitDice')}>
							<NumberSpin
								value={this.props.monster.hitDice + 'd' + Gygax.hitDieType(this.props.monster.size)}
								downEnabled={this.props.monster.hitDice > 1}
								onNudgeValue={delta => this.props.nudgeValue('hitDice', delta)}
							/>
						</FieldPanel>
						<Note>
							<div className='section'>
								to calculate hit points, the die type is based on the monster's size, and the die roll is modified by the monster's constitution modifier
							</div>
							<hr/>
							<div className='hp-value'>
								{Frankenstein.getTypicalHP(this.props.monster) + ' hp (' + Frankenstein.getTypicalHPString(this.props.monster) + ')'}
							</div>
						</Note>
					</Col>
					<Col span={12}>
						<div className='subheading'>damage resistances</div>
						<FieldPanel allowRandomize={this.props.allowRandomize} onRandomize={() => this.props.randomValue('damage.resist')}>
							<Textbox
								text={this.props.monster.damage.resist}
								onChange={value => this.props.changeValue('damage.resist', value)}
							/>
						</FieldPanel>
						<div className='subheading'>damage vulnerabilities</div>
						<FieldPanel allowRandomize={this.props.allowRandomize} onRandomize={() => this.props.randomValue('damage.vulnerable')}>
							<Textbox
								text={this.props.monster.damage.vulnerable}
								onChange={value => this.props.changeValue('damage.vulnerable', value)}
							/>
						</FieldPanel>
						<div className='subheading'>damage immunities</div>
						<FieldPanel allowRandomize={this.props.allowRandomize} onRandomize={() => this.props.randomValue('damage.immune')}>
							<Textbox
								text={this.props.monster.damage.immune}
								onChange={value => this.props.changeValue('damage.immune', value)}
							/>
						</FieldPanel>
						<div className='subheading'>condition immunities</div>
						<FieldPanel allowRandomize={this.props.allowRandomize} onRandomize={() => this.props.randomValue('conditionImmunities')}>
							<Textbox
								text={this.props.monster.conditionImmunities}
								onChange={value => this.props.changeValue('conditionImmunities', value)}
							/>
						</FieldPanel>
						<div className='subheading'>legendary actions</div>
						<FieldPanel allowRandomize={this.props.allowRandomize} onRandomize={() => this.props.randomValue('legendaryActions')}>
							<NumberSpin
								value={this.props.monster.legendaryActions}
								downEnabled={this.props.monster.legendaryActions > 0}
								onNudgeValue={delta => this.props.nudgeValue('legendaryActions', delta)}
							/>
						</FieldPanel>
					</Col>
				</Row>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='CombatTab' error={e} />;
		}
	}
}

interface FeaturesTabProps {
	monster: Monster;
	selectedTraitID: string | null;
	addTrait: (traitType: 'trait' | 'action' | 'bonus' | 'reaction' | 'legendary' | 'mythic' | 'lair') => void;
	copyTrait: (trait: Trait) => void;
	moveTrait: (trait: Trait, moveBefore: Trait) => void;
	deleteTrait: (trait: Trait) => void;
	selectTrait: (trait: Trait) => void;
	changeValue: (trait: Trait, field: string, value: any) => void;
}

class FeaturesTab extends React.Component<FeaturesTabProps> {
	private createSection(traitsByType: { [id: string]: Trait[] }, type: string) {
		const traits = traitsByType[type];

		return (
			<div>
				<div className='trait-header-bar'>
					<div className='content-then-icons'>
						<div className='content'>
							<div className='subheading'>
								{Gygax.traitType(type, true)}
							</div>
						</div>
						<div className='icons'>
							<PlusCircleOutlined
								title='add'
								onClick={() => this.props.addTrait(type as 'trait' | 'action' | 'bonus' | 'reaction' | 'legendary' | 'mythic' | 'lair')}
							/>
						</div>
					</div>
				</div>
				<List
					values={traits}
					lockVertically={true}
					onChange={({ oldIndex, newIndex }) => this.props.moveTrait(traits[oldIndex], traits[newIndex])}
					renderList={({ children, props }) => <div {...props}>{children}</div>}
					renderItem={({ value, props, isDragged }) => (
						<div {...props} className={isDragged ? 'dragged' : ''}>
							<TraitBarPanel
								key={value.id}
								trait={value}
								isSelected={value.id === this.props.selectedTraitID}
								select={trait => this.props.selectTrait(trait)}
							/>
						</div>
					)}
				/>
			</div>
		);
	}

	public render() {
		try {
			const options: { id: string, text: string }[] = [];
			const traitsByType: { [id: string]: Trait[] } = {};

			TRAIT_TYPES.forEach(type => {
				options.push({ id: type, text: Gygax.traitType(type, false) });
				traitsByType[type] = this.props.monster.traits.filter(t => t.type === type);
			});

			const selectedTrait = this.props.monster.traits.find(t => t.id === this.props.selectedTraitID);
			let selection = null;
			if (selectedTrait) {
				selection = (
					<TraitEditorPanel
						trait={selectedTrait}
						copyTrait={trait => this.props.copyTrait(trait)}
						deleteTrait={trait => this.props.deleteTrait(trait)}
						changeValue={(trait, type, value) => this.props.changeValue(trait, type, value)}
					/>
				);
			} else {
				selection = (
					<Note>select one of the features from the column to the left to edit its details here</Note>
				);
			}

			return (
				<Row gutter={10}>
					<Col span={8}>
						{this.createSection(traitsByType, 'trait')}
						{this.createSection(traitsByType, 'action')}
						{this.createSection(traitsByType, 'bonus')}
						{this.createSection(traitsByType, 'reaction')}
						{this.createSection(traitsByType, 'legendary')}
						{this.createSection(traitsByType, 'mythic')}
						{this.createSection(traitsByType, 'lair')}
					</Col>
					<Col span={16}>
						{selection}
					</Col>
				</Row>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='FeaturesTab' error={e} />;
		}
	}
}

interface FieldPanelProps {
	allowRandomize: boolean;
	onRandomize: () => void;
}

class FieldPanel extends React.Component<FieldPanelProps> {
	public render() {
		try {
			if (this.props.allowRandomize) {
				return (
					<div className='content-then-icons'>
						<div className='content'>
							{this.props.children}
						</div>
						<div className='icons'>
							<ThunderboltOutlined title='use a value from your scratchpad' onClick={() => this.props.onRandomize()} />
						</div>
					</div>
				);
			}

			return this.props.children;
		} catch (e) {
			console.error(e);
			return <RenderError context='FieldPanel' error={e} />;
		}
	}
}

interface TraitBarProps {
	trait: Trait;
	isSelected: boolean;
	select: (trait: Trait) => void;
}

class TraitBarPanel extends React.Component<TraitBarProps> {
	public render() {
		try {
			return (
				<Group className={this.props.isSelected ? 'trait-bar selected' : 'trait-bar'} onClick={() => this.props.select(this.props.trait)}>
					<div className='content-then-icons'>
						<div className='content'>
							{this.props.trait.name || 'unnamed ' + Gygax.traitType(this.props.trait.type, false)}
						</div>
						<div className='icons'>
							<MenuOutlined className='grabber' title='drag to reorder' data-movable-handle={true} />
						</div>
					</div>
				</Group>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='TraitBarPanel' error={e} />;
		}
	}
}

interface GuidelinesPanelProps {
	monster: Monster;
}

class GuidelinesPanel extends React.Component<GuidelinesPanelProps> {
	public render() {
		try {
			const details = Gygax.challengeDetails();

			let hpMultiplier = 1;
			if (this.props.monster.damage.immune) {
				if (this.props.monster.challenge < 11) {
					hpMultiplier = 2;
				} else if (this.props.monster.challenge < 17) {
					hpMultiplier = 1.5;
				} else {
					hpMultiplier = 1.25;
				}
			} else if (this.props.monster.damage.resist) {
				if (this.props.monster.challenge < 5) {
					hpMultiplier = 2;
				} else if (this.props.monster.challenge < 11) {
					hpMultiplier = 1.5;
				} else if (this.props.monster.challenge < 17) {
					hpMultiplier = 1.25;
				} else {
					hpMultiplier = 1;
				}
			}
			const hp = Frankenstein.getTypicalHP(this.props.monster) * hpMultiplier;

			let saves: number[] = [];
			let attacks: number[] = [];
			this.props.monster.traits.forEach(t => {
				attacks = attacks.concat(Frankenstein.getToHitExpressions(t).map(exp => exp.bonus));
				saves = saves.concat(Frankenstein.getSaveExpressions(t).map(exp => exp.dc));
			});
			const attackMin = Math.min(...attacks);
			const attackMax = Math.max(...attacks);
			const saveMin = Math.min(...saves);
			const saveMax = Math.max(...saves);

			return (
				<div>
					<Note>
						<div className='section'>
							this table shows typical values for certain stats (ac, hp, etc) for a given challenge rating
						</div>
						<div className='section'>
							to gauge a monster's cr, take the average of its defensive cr (from ac and hp) and offensive cr (from attack bonus, save dc, and damage per round)
						</div>
					</Note>
					<div className='table alternating'>
						<Row className='table-row table-row-header'>
							<Col span={4} className='table-cell'>
								cr
							</Col>
							<Col span={4} className='table-cell'>
								ac
							</Col>
							<Col span={4} className='table-cell'>
								effective hp
							</Col>
							<Col span={4} className='table-cell'>
								attack bonus
							</Col>
							<Col span={4} className='table-cell'>
								save dc
							</Col>
							<Col span={4} className='table-cell'>
								dmg / rnd
							</Col>
						</Row>
						{details.map(data => {
							const matchCR = data.cr === this.props.monster.challenge;
							const matchAC = data.ac === this.props.monster.ac;
							const matchHP = (data.hpMin <= hp) && (data.hpMax >= hp);
							const matchAttack = (attackMin <= data.attack) && (attackMax >= data.attack);
							const matchSave = (saveMin <= data.save) && (saveMax >= data.save);
							return (
								<Row key={data.cr} className='table-row'>
									<Col span={4} className={matchCR ? 'table-cell table-cell-highlight' : 'table-cell'}>
										{Gygax.challenge(data.cr)}
									</Col>
									<Col span={4} className={matchAC ? 'table-cell table-cell-highlight' : 'table-cell'}>
										{data.ac}
									</Col>
									<Col span={4} className={matchHP ? 'table-cell table-cell-highlight' : 'table-cell'}>
										{data.hpMin} - {data.hpMax}
									</Col>
									<Col span={4} className={matchAttack ? 'table-cell table-cell-highlight' : 'table-cell'}>
										+{data.attack}
									</Col>
									<Col span={4} className={matchSave ? 'table-cell table-cell-highlight' : 'table-cell'}>
										{data.save}
									</Col>
									<Col span={4} className='table-cell'>
										{data.dmgMin} - {data.dmgMax}
									</Col>
								</Row>
							);
						})}
					</div>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='GuidelinesPanel' error={e} />;
		}
	}
}

interface FeatureBrowserProps {
	monster: Monster;
	library: MonsterGroup[];
	importTrait: (trait: Trait, sourceMonster: Monster) => void;
}

interface FeatureBrowserState {
	mode: string;
	query: string;
	randomTraits: { trait: Trait, monster: Monster }[];
}

class FeatureBrowser extends React.Component<FeatureBrowserProps, FeatureBrowserState> {
	constructor(props: FeatureBrowserProps) {
		super(props);
		this.state = {
			mode: 'search',
			query: '',
			randomTraits: []
		};
	}

	private chooseRandomTraits() {
		const traits: { name: string, trait: Trait, monster: Monster }[] = [];
		this.props.library.forEach(group => {
			group.monsters.forEach(m => {
				if (m.id !== this.props.monster.id) {
					m.traits.forEach(t => {
						traits.push({ name: t.name, trait: t, monster: m });
					});
				}
			});
		});

		const selected = [];
		while (selected.length < 10) {
			const index = Utils.randomNumber(traits.length);
			selected.push(traits[index]);
			traits.splice(index, 1);
		}
		Utils.sort(selected);

		this.setState({
			randomTraits: selected
		});
	}

	private getSearchSection() {
		const traits: { name: string, trait: Trait, monster: Monster }[] = [];
		if (this.state.query.length >= 2) {
			this.props.library.forEach(group => {
				group.monsters.forEach(m => {
					if (m.id !== this.props.monster.id) {
						m.traits.forEach(t => {
							if (Sherlock.matchTrait(this.state.query, t)) {
								traits.push({ name: t.name, trait: t, monster: m });
							}
						});
					}
				});
			});

			Utils.sort(traits);
		}

		let featuresSection = null;
		if (this.state.query !== '') {
			if (traits.length === 0) {
				featuresSection = (
					<Note>
						<div className='section'>
							no features found
						</div>
					</Note>
				);
			} else {
				const traitsByType: { [id: string]: JSX.Element[] } = {};
				TRAIT_TYPES.forEach(type => {
					traitsByType[type] = traits.filter(t => t.trait.type === type).map(trait => (
						<div className='card monster' key={trait.trait.id}>
							<TraitPanel trait={trait.trait} mode='template' copyTrait={t => this.props.importTrait(t, trait.monster)} />
						</div>
					));
				});

				featuresSection = TRAIT_TYPES.map(type => {
					if (traitsByType[type].length > 0) {
						return (
							<div key={type}>
								<div className='subheading'>{Gygax.traitType(type, true)}</div>
								{traitsByType[type]}
							</div>
						);
					} else {
						return null;
					}
				});
			}
		}

		return (
			<div>
				<Textbox
					text={this.state.query}
					placeholder='search for features...'
					onChange={text => this.setState({ query: text })}
				/>
				{featuresSection ? <hr/> : null}
				{featuresSection}
			</div>
		);
	}

	private getRandomSection() {
		const traitsByType: { [id: string]: JSX.Element[] } = {};
		TRAIT_TYPES.forEach(type => {
			traitsByType[type] = this.state.randomTraits.filter(t => t.trait.type === type).map(trait => (
				<div className='card monster' key={trait.trait.id}>
					<TraitPanel
						trait={trait.trait}
						mode='template'
						copyTrait={t => this.props.importTrait(trait.trait, trait.monster)}
					/>
				</div>
			));
		});

		const featuresSection = TRAIT_TYPES.map(type => {
			if (traitsByType[type].length > 0) {
				return (
					<div key={type}>
						<div className='subheading'>{Gygax.traitType(type, true)}</div>
						{traitsByType[type]}
					</div>
				);
			} else {
				return null;
			}
		});

		return (
			<div>
				<button onClick={() => this.chooseRandomTraits()}>select random features</button>
				{featuresSection}
			</div>
		);
	}

	public render() {
		try {
			let content = null;
			switch (this.state.mode) {
				case 'search':
					content = this.getSearchSection();
					break;
				case 'random':
					content = this.getRandomSection();
					break;
			}

			return (
				<div>
					<Note>
						<div className='section'>
							here you can look for features from other monsters in your library, either for inspiration or to copy directly into your monster
						</div>
					</Note>
					<Selector
						options={['search', 'random'].map(o => ({ id: o, text: o }))}
						selectedID={this.state.mode}
						onSelect={mode => this.setState({ mode: mode })}
					/>
					{content}
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='FeatureBrowser' error={e} />;
		}
	}
}
