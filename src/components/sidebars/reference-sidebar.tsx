import { CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { Col, Progress, Row, Spin, Tag } from 'antd';
import React from 'react';
import Showdown from 'showdown';

import { Shakespeare } from '../../utils/shakespeare';
import { Sherlock } from '../../utils/sherlock';
import { Streep } from '../../utils/streep';
import { Comms, CommsDM } from '../../utils/uhura';

import { Monster } from '../../models/monster';
import { Award, Party, PC } from '../../models/party';

import { MonsterStatblockCard } from '../cards/monster-statblock-card';
import { Checkbox } from '../controls/checkbox';
import { Dropdown } from '../controls/dropdown';
import { Expander } from '../controls/expander';
import { Selector } from '../controls/selector';
import { Textbox } from '../controls/textbox';
import { AwardPanel } from '../panels/award-panel';
import { Note } from '../panels/note';
import { Popout } from '../panels/popout';

const showdown = new Showdown.Converter();
showdown.setOption('tables', true);

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
	awardPartyID: string | null;
}

export class ReferenceSidebar extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			awardText: '',
			awardCategory: null,
			showPending: true,
			showGranted: true,
			awardPartyID: null
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

	private setAwardPartyID(id: string | null) {
		this.setState({
			awardPartyID: id
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

			const count = options.length === 6 ? 3 : 6;

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
					header = (
						<Dropdown
							options={this.props.parties.map(p => ({ id: p.id, text: p.name }))}
							placeholder='select a party...'
							selectedID={this.props.selectedPartyID}
							onSelect={id => this.props.selectPartyID(id)}
							onClear={() => this.props.selectPartyID(null)}
						/>
					);
					content = (
						<PartyReference
							party={this.props.parties.find(p => p.id === this.props.selectedPartyID) ?? null}
						/>
					);
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
					let infoSection: JSX.Element | null = (
						<Note>
							<p>to grant any of these awards, you need to select a party</p>
						</Note>
					);
					let grantedSection = null;
					if (this.state.awardPartyID) {
						const party = this.props.parties.find(p => p.id === this.state.awardPartyID);
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
								infoSection = (
									<div className='section centered'>
										<Progress status='normal' percent={100 * achieved.length / awards.length} type='circle' format={() => achieved.length + ' / ' + awards.length} />
									</div>
								);
							} else {
								infoSection = null;
							}
							grantedSection = (
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
								{grantedSection}
							</Expander>
							<Expander text='granting awards'>
								{infoSection}
								<Dropdown
									placeholder='select a party...'
									options={this.props.parties.map(p => ({ id: p.id, text: p.name || 'unnamed party' }))}
									selectedID={this.state.awardPartyID}
									onSelect={id => this.setAwardPartyID(id)}
									onClear={() => this.setAwardPartyID(null)}
								/>
							</Expander>
						</div>
					);
					content = (
						<AwardsReference
							awards={awards}
							party={this.props.parties.find(p => p.id === this.state.awardPartyID) ?? null}
							addAward={(id, awardee) => this.props.addAward(id, awardee)}
							deleteAward={(id, awardee) => this.props.deleteAward(id, awardee)}
						/>
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
							itemsPerRow={count}
							onSelect={optionID => this.props.setView(optionID)}
						/>
						{header}
					</div>
					<div className='sidebar-content'>
						{content}
					</div>
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
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
					<div dangerouslySetInnerHTML={{ __html: showdown.makeHtml(this.state.source || '') }} />
				</Spin>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
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
			const knownLanguages = known.map(lang => {
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
			let unknownLanguages = null;
			if (unknown.length > 0) {
				unknownLanguages = (
					<div className='section'>
						<b>unknown languages</b>: {unknown.join(', ')}
					</div>
				);
			}

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
					<p>no awards yet</p>
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
						{knownLanguages}
					</div>
					{unknownLanguages}
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
						<p>remember that advantage / disadvantage grants +/- 5 to passive rolls</p>
					</Note>
					<hr/>
					<div className='section subheading'>
						awards
					</div>
					{awards}
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
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
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
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
						<p>no awards</p>
					</Note>
				);
			}

			const list = this.props.awards.map(award => {
				let party = null;
				if (this.props.party) {
					const awardees = [];
					if (this.props.party.awards.includes(award.id)) {
						awardees.push(
							<div key={this.props.party.id} className='group-panel control-with-icons'>
								<div>{this.props.party.name || 'unnamed party'}</div>
								<div className='icons'>
									<CloseCircleOutlined onClick={() => this.props.deleteAward(award.id, this.props.party as Party)} />
								</div>
							</div>
						);
					}
					const all = [{ id: this.props.party.id, text: this.props.party.name || 'unnamed party' }];
					this.props.party.pcs.filter(pc => pc.active).forEach(pc => {
						if (pc.awards.includes(award.id)) {
							awardees.push(
								<div key={pc.id} className='group-panel control-with-icons'>
									<div>{pc.name || 'unnamed pc'}</div>
									<div className='icons'>
										<CloseCircleOutlined onClick={() => this.props.deleteAward(award.id, pc)} />
									</div>
								</div>
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
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}
