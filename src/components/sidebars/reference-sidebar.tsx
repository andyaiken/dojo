import { CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { Col, Progress, Row, Spin, Tag } from 'antd';
import React from 'react';
import ReactMarkdown from 'react-markdown';

import { Shakespeare } from '../../utils/shakespeare';
import { Sherlock } from '../../utils/sherlock';
import { Streep } from '../../utils/streep';
import { Comms, CommsDM } from '../../utils/uhura';

import { Monster } from '../../models/monster';
import { Award, Party, PC } from '../../models/party';

import { RenderError } from '../error';
import { MonsterStatblockCard } from '../cards/monster-statblock-card';
import { Checkbox } from '../controls/checkbox';
import { Dropdown } from '../controls/dropdown';
import { Expander } from '../controls/expander';
import { Group } from '../controls/group';
import { Note } from '../controls/note';
import { Selector } from '../controls/selector';
import { Textbox } from '../controls/textbox';
import { AwardPanel } from '../panels/award-panel';
import { Popout } from '../panels/popout';

interface Props {
	view: string;
	setView: (view: string) => void;
	// Party
	selectedPartyID: string | null;
	parties: Party[];
	selectPartyID: (id: string | null) => void;
	// Monster
	selectedMonsterID: string | null;
	monsters: Monster[];
	selectMonsterID: (id: string | null) => void;
	// Awards
	showAwards: boolean;
	addAward: (awardID: string, awardee: Party | PC) => void;
	deleteAward: (awardID: string, awardee: Party | PC) => void;
}

interface State {
	awardText: string;
	awardCategory: string | null;
	showPending: boolean;
	showGranted: boolean;
}

export class ReferenceSidebar extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			awardText: '',
			awardCategory: null,
			showPending: true,
			showGranted: true
		};
	}

	private setAwardText(text: string) {
		this.setState({
			awardText: text
		});
	}

	private setAwardCategory(category: string | null) {
		this.setState({
			awardCategory: (category === '') ? null : category
		});
	}

	private setShowPending(show: boolean) {
		this.setState({
			showPending: show
		});
	}

	private setShowGranted(show: boolean) {
		this.setState({
			showGranted: show
		});
	}

	public render() {
		try {
			const options = [
				{
					id: 'skills',
					text: 'skills'
				},
				{
					id: 'conditions',
					text: 'conditions'
				},
				{
					id: 'actions',
					text: 'actions'
				}
			];

			if (this.props.parties.length > 0) {
				options.push({ id: 'party', text: 'party' });
			}

			if (this.props.monsters.length > 0) {
				options.push({ id: 'monster', text: 'monster' });
			}

			if (this.props.showAwards) {
				options.push({ id: 'awards', text: 'awards' });
			}

			let header = null;
			let content = null;
			switch (this.props.view) {
				case 'skills':
					content = (
						<MarkdownReference key='skills' filename='/dojo/data/skills.md' />
					);
					break;
				case 'conditions':
					content = (
						<MarkdownReference key='conditions' filename='/dojo/data/conditions.md' />
					);
					break;
				case 'actions':
					content = (
						<MarkdownReference key='actions' filename='/dojo/data/actions.md' />
					);
					break;
				case 'party':
					if (this.props.parties.length > 1) {
						header = (
							<Dropdown
								options={this.props.parties.map(p => ({ id: p.id, text: p.name || 'unnamed party' }))}
								placeholder='select a party...'
								selectedID={this.props.selectedPartyID}
								onSelect={id => this.props.selectPartyID(id)}
							/>
						);
						content = (
							<PartyReference
								party={this.props.parties.find(p => p.id === this.props.selectedPartyID) ?? null}
							/>
						);
					} else if (this.props.parties.length === 1) {
						header = (
							<div className='section heading'>
								{this.props.parties[0].name || 'unnamed party'}
							</div>
						);
						content = (
							<PartyReference
								party={this.props.parties[0]}
							/>
						);
					}
					break;
				case 'monster':
					header = (
						<Dropdown
							options={this.props.monsters.map(p => ({ id: p.id, text: p.name }))}
							placeholder='select a monster...'
							selectedID={this.props.selectedMonsterID}
							onSelect={id => this.props.selectMonsterID(id)}
							onClear={() => this.props.selectMonsterID(null)}
						/>
					);
					content = (
						<MonsterReference
							monster={this.props.monsters.find(m => m.id === this.props.selectedMonsterID) ?? null}
						/>
					);
					break;
				case 'awards':
					const categoryOptions = Streep.getCategories().map(o => ({ id: o, text: o }));
					categoryOptions.unshift({ id: '', text: 'all' });

					let awards = Streep.getAwards();

					let optionsSection = null;
					let selectionSection = null;
					let gaugeSection = null;

					let party = null;
					if (this.props.parties.length === 1) {
						party = this.props.parties[0];
					}
					if (this.props.parties.length > 1) {
						party = this.props.parties.find(p => p.id === this.props.selectedPartyID);
						selectionSection = (
							<Expander text='granting awards'>
								<Note>
									<div className='section'>
										to grant any of these awards, you need to select a party
									</div>
								</Note>
								<Dropdown
									placeholder='select a party...'
									options={this.props.parties.map(p => ({ id: p.id, text: p.name || 'unnamed party' }))}
									selectedID={this.props.selectedPartyID}
									onSelect={id => this.props.selectPartyID(id)}
								/>
							</Expander>
						);
					}
					if (party) {
						const ids = ([] as string[]).concat(party.awards);
						party.pcs.forEach(pc => {
							ids.concat(pc.awards);
						});
						awards = awards
							.filter(award => {
								const granted = ids.includes(award.id);
								if (this.state.showGranted && granted) {
									return true;
								}
								if (this.state.showPending && !granted) {
									return true;
								}
								return false;
							})
							.filter(award => {
								if (this.state.awardText !== '') {
									if (!Sherlock.matchAward(this.state.awardText, award)) {
										return false;
									}
								}
								if (this.state.awardCategory) {
									if (award.category !== this.state.awardCategory) {
										return false;
									}
								}
								return true;
							});
						if (awards.length > 0) {
							const achieved = awards.filter(award => ids.includes(award.id));
							gaugeSection = (
								<div className='section centered'>
									<Progress status='normal' percent={100 * achieved.length / awards.length} type='circle' format={() => achieved.length + ' / ' + awards.length} />
									<hr/>
								</div>
							);
						}
						optionsSection = (
							<Row gutter={10}>
								<Col span={12}>
									<Checkbox
										label='pending awards'
										checked={this.state.showPending}
										onChecked={value => this.setShowPending(value)}
									/>
								</Col>
								<Col span={12}>
									<Checkbox
										label='granted awards'
										checked={this.state.showGranted}
										onChecked={value => this.setShowGranted(value)}
									/>
								</Col>
							</Row>
						);
					}
					header = (
						<div>
							<Expander text='filter awards'>
								<Textbox
									text={this.state.awardText}
									placeholder='search'
									noMargins={true}
									onChange={text => this.setAwardText(text)}
								/>
								<Selector
									options={categoryOptions}
									selectedID={this.state.awardCategory ?? ''}
									itemsPerRow={4}
									onSelect={category => this.setAwardCategory(category)}
								/>
								{optionsSection}
							</Expander>
							{selectionSection}
						</div>
					);
					content = (
						<div>
							{gaugeSection}
							<AwardsReference
								awards={awards}
								party={this.props.parties.find(p => p.id === this.props.selectedPartyID) ?? null}
								addAward={(id, awardee) => this.props.addAward(id, awardee)}
								deleteAward={(id, awardee) => this.props.deleteAward(id, awardee)}
							/>
						</div>
					);
					break;
			}

			return (
				<div className='sidebar-container'>
					<div className='sidebar-header'>
						<div className='heading'>reference</div>
						<Selector
							options={options}
							selectedID={this.props.view}
							itemsPerRow={options.length === 6 ? 3 : options.length}
							onSelect={optionID => this.props.setView(optionID)}
						/>
						{header}
					</div>
					<div className='sidebar-content'>
						{content}
					</div>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='ReferenceSidebar' error={e} />;
		}
	}
}

interface MarkdownReferenceProps {
	filename: string;
}

interface MarkdownReferenceState {
	source: string | null;
}

class MarkdownReference extends React.Component<MarkdownReferenceProps, MarkdownReferenceState> {
	constructor(props: MarkdownReferenceProps) {
		super(props);

		this.state = {
			source: null
		};
	}

	private async fetchData() {
		const response = await fetch(this.props.filename);
		const text = await response.text();
		this.setState({
			source: text
		});
	}

	public render() {
		try {
			if (!this.state.source) {
				this.fetchData();
			}

			return (
				<Spin spinning={this.state.source === null} indicator={<LoadingOutlined style={{ fontSize: 20, marginTop: 100 }} />}>
					<ReactMarkdown source={this.state.source || ''} />
				</Spin>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='MarkdownReference' error={e} />;
		}
	}
}

interface PartyReferenceProps {
	party: Party | null;
}

class PartyReference extends React.Component<PartyReferenceProps> {
	public render() {
		try {
			if (!this.props.party) {
				return null;
			}

			const activePCs = this.props.party.pcs.filter(pc => pc.active);
			if (activePCs.length === 0) {
				return (
					<div className='section centered'>
						<i>no pcs</i>
					</div>
				);
			}

			const level = Math.round(activePCs.reduce((sum, current) => sum + current.level, 0) / activePCs.length);

			const known = Shakespeare.getKnownLanguages(activePCs);
			const knownRows = known.map(lang => {
				const speakers = activePCs.filter(pc => pc.languages.toLowerCase().includes(lang.toLowerCase()));
				const pcs = speakers.length === activePCs.length ? 'all pcs' : speakers.map(pc => pc.name).join(', ');
				const langName = Shakespeare.capitalise(lang);
				return (
					<div key={langName} className='table-row'>
						<div className='table-cell l'>{langName}</div>
						<div className='table-cell l'>{pcs}</div>
					</div>
				);
			});
			const unknown = Shakespeare.getAllLanguages()
				.map(lang => Shakespeare.capitalise(lang))
				.filter(lang => !known.includes(lang));
			let unknownRow = null;
			if (unknown.length > 0) {
				unknownRow = (
					<div className='section'>
						<b>unknown languages</b>: {unknown.join(', ')}
					</div>
				);
			}

			const dvRanges = activePCs
				.map(pc => pc.darkvision)
				.reduce((array: number[], value) => {
					if (array.indexOf(value) === -1) {
						array.push(value);
					}
					return array;
				}, [])
				.sort();
			const dvRows = dvRanges.map(range => {
				const rangePCs = activePCs.filter(pc => pc.darkvision === range);
				const pcs = rangePCs.length === activePCs.length ? 'all pcs' : rangePCs.map(pc => pc.name).join(', ');
				return (
					<div key={range} className='table-row'>
						<div className='table-cell l small'>{range > 0 ? range + ' ft' : 'none'}</div>
						<div className='table-cell l'>{pcs}</div>
					</div>
				);
			});

			const insight: { min: number, max: number } = { min: Number.MAX_VALUE, max: Number.MIN_VALUE };
			const invest: { min: number, max: number } = { min: Number.MAX_VALUE, max: Number.MIN_VALUE };
			const percep: { min: number, max: number } = { min: Number.MAX_VALUE, max: Number.MIN_VALUE };

			activePCs.forEach(pc => {
				insight.min = Math.min(insight.min, pc.passiveInsight);
				insight.max = Math.max(insight.max, pc.passiveInsight);
				invest.min = Math.min(invest.min, pc.passiveInvestigation);
				invest.max = Math.max(invest.max, pc.passiveInvestigation);
				percep.min = Math.min(percep.min, pc.passivePerception);
				percep.max = Math.max(percep.max, pc.passivePerception);
			});

			const min = Math.min(insight.min, invest.min, percep.min);
			const max = Math.max(insight.max, invest.max, percep.max);

			const rows = [];
			for (let n = max; n >= min; --n) {
				const ins = activePCs.filter(pc => pc.passiveInsight === n).map(pc => pc.name).join(', ');
				const inv = activePCs.filter(pc => pc.passiveInvestigation === n).map(pc => pc.name).join(', ');
				const per = activePCs.filter(pc => pc.passivePerception === n).map(pc => pc.name).join(', ');
				rows.push(
					<div key={n} className='table-row'>
						<div className='table-cell l small'>{n}</div>
						<div className='table-cell l'>{ins}</div>
						<div className='table-cell l'>{inv}</div>
						<div className='table-cell l'>{per}</div>
					</div>
				);
			}

			const list = Streep.getAwards().filter(award => {
				let achieved = false;

				if (this.props.party?.awards.includes(award.id)) {
					achieved = true;
				}

				this.props.party?.pcs.forEach(pc => {
					if (pc.awards.includes(award.id)) {
						achieved = true;
					}
				});

				return achieved;
			}).map(award => {
				const awardees = [];
				if (this.props.party?.awards.includes(award.id)) {
					awardees.push(this.props.party.name || 'unnamed party');
				}
				this.props.party?.pcs.forEach(pc => {
					if (pc.awards.includes(award.id)) {
						awardees.push(pc.name || 'unnamed pc');
					}
				});
				let awardeesSection = null;
				if (awardees.length > 0) {
					awardeesSection = (
						<div>
							<hr/>
							<div className='section'>
								awarded to:
								{awardees.map(awardee => <Tag key={awardee}>{awardee}</Tag>)}
							</div>
						</div>
					);
				}
				return (
					<AwardPanel key={award.id} award={award}>
						{awardeesSection}
					</AwardPanel>
				);
			});
			let awards = (
				<Note>
					<div className='section'>
						no awards yet
					</div>
				</Note>
			);
			if (list.length > 0) {
				awards = (
					<div>
						{list}
					</div>
				);
			}

			return (
				<div>
					<div className='section subheading'>
						average level
					</div>
					<div className='section'>
						<Progress status='normal' percent={level * 5} format={() => level} />
					</div>
					<hr/>
					<div className='section subheading'>
						languages
					</div>
					<div className='table alternating'>
						<div className='table-row table-row-header'>
							<div className='table-cell l'>language</div>
							<div className='table-cell l'>spoken by</div>
						</div>
						{knownRows}
					</div>
					{unknownRow}
					<hr/>
					<div className='section subheading'>
						darkvision
					</div>
					<div className='table alternating'>
						<div className='table-row table-row-header'>
							<div className='table-cell l small'>range</div>
							<div className='table-cell l'>pcs</div>
						</div>
						{dvRows}
					</div>
					<hr/>
					<div className='section subheading'>
						passive skills
					</div>
					<div className='table alternating'>
						<div className='table-row table-row-header'>
							<div className='table-cell l small' />
							<div className='table-cell l'>insight</div>
							<div className='table-cell l'>investigation</div>
							<div className='table-cell l'>perception</div>
						</div>
						{rows}
					</div>
					<Note>
						<div className='section'>
							remember that advantage / disadvantage grants +/- 5 to passive rolls
						</div>
					</Note>
					<hr/>
					<div className='section subheading'>
						awards
					</div>
					{awards}
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='PartyReference' error={e} />;
		}
	}
}

interface MonsterReferenceProps {
	monster: Monster | null;
}

interface MonsterReferenceState {
	playerViewOpen: boolean;
}

class MonsterReference extends React.Component<MonsterReferenceProps, MonsterReferenceState> {
	constructor(props: MonsterReferenceProps) {
		super(props);

		this.state = {
			playerViewOpen: false
		};
	}

	private setPlayerViewOpen(open: boolean) {
		this.setState({
			playerViewOpen: open
		});
	}

	private getPlayerView() {
		if (this.state.playerViewOpen && this.props.monster) {
			return (
				<Popout title='Monster' onCloseWindow={() => this.setPlayerViewOpen(false)}>
					<div className='scrollable'>
						<MonsterStatblockCard monster={this.props.monster} />
					</div>
				</Popout>
			);
		}

		return null;
	}

	public render() {
		try {
			let statblock = null;
			if (this.props.monster) {
				statblock = (
					<div>
						<Checkbox
							label='share in player view'
							checked={this.state.playerViewOpen}
							onChecked={value => this.setPlayerViewOpen(value)}
						/>
						<Checkbox
							label='share in session'
							disabled={CommsDM.getState() !== 'started'}
							checked={Comms.data.shared.type === 'monster'}
							onChecked={value => value ? CommsDM.shareMonster(this.props.monster as Monster) : CommsDM.shareNothing()}
						/>
						<hr/>
						<MonsterStatblockCard monster={this.props.monster} />
					</div>
				);
			}

			return (
				<div>
					{statblock}
					{this.getPlayerView()}
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='MonsterReference' error={e} />;
		}
	}
}

interface AwardsReferenceProps {
	awards: Award[];
	party: Party | null;
	addAward: (awardID: string, awardee: Party | PC) => void;
	deleteAward: (awardID: string, awardee: Party | PC) => void;
}

class AwardsReference extends React.Component<AwardsReferenceProps> {
	public render() {
		try {
			if (this.props.awards.length === 0) {
				return (
					<Note>
						<div className='section'>
							no awards
						</div>
					</Note>
				);
			}

			const list = this.props.awards.map(award => {
				let party = null;
				if (this.props.party) {
					const awardees = [];
					if (this.props.party.awards.includes(award.id)) {
						awardees.push(
							<Group key={this.props.party.id}>
								<div className='content-then-icons'>
									<div className='content'>
										<div className='section'>
											{this.props.party.name || 'unnamed party'}
										</div>
									</div>
									<div className='icons'>
										<CloseCircleOutlined onClick={() => this.props.deleteAward(award.id, this.props.party as Party)} />
									</div>
								</div>
							</Group>
						);
					}
					const all = [{ id: this.props.party.id, text: this.props.party.name || 'unnamed party' }];
					this.props.party.pcs.filter(pc => pc.active).forEach(pc => {
						if (pc.awards.includes(award.id)) {
							awardees.push(
								<Group key={pc.id}>
									<div className='content-then-icons'>
										<div className='content'>
											<div className='section'>
												{pc.name || 'unnamed pc'}
											</div>
										</div>
										<div className='icons'>
											<CloseCircleOutlined onClick={() => this.props.deleteAward(award.id, pc)} />
										</div>
									</div>
								</Group>
							);
						}
						all.push({ id: pc.id, text: pc.name || 'unnamed pc' });
					});

					party = (
						<div>
							<hr/>
							{awardees}
							<Dropdown
								placeholder='award to...'
								options={all}
								onSelect={id => {
									if (!this.props.party) {
										return;
									}

									if (id === this.props.party.id) {
										this.props.addAward(award.id, this.props.party);
									} else {
										const pc = this.props.party.pcs.find(p => p.id === id);
										if (pc) {
											this.props.addAward(award.id, pc);
										}
									}
								}}
							/>
						</div>
					);
				}

				return (
					<AwardPanel key={award.id} award={award}>
						{party}
					</AwardPanel>
				);
			});

			return (
				<div>
					{list}
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='AwardsReference' error={e} />;
		}
	}
}
