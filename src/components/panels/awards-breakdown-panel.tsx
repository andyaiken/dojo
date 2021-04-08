import { CloseCircleOutlined } from '@ant-design/icons';
import { Col, Progress, Row } from 'antd';
import React from 'react';

import { Sherlock } from '../../utils/sherlock';
import { Streep } from '../../utils/streep';
import { Utils } from '../../utils/utils';

import { Party, PC } from '../../models/party';

import { RenderError } from '../error';
import { Checkbox } from '../controls/checkbox';
import { Conditional } from '../controls/conditional';
import { Dropdown } from '../controls/dropdown';
import { Expander } from '../controls/expander';
import { Group } from '../controls/group';
import { Note } from '../controls/note';
import { Selector } from '../controls/selector';
import { Textbox } from '../controls/textbox';
import { AwardPanel } from './award-panel';

interface Props {
	party: Party | null;
	addAward: (awardID: string, awardee: Party | PC) => void;
	deleteAward: (awardID: string, awardee: Party | PC) => void;
}

interface State {
	awardText: string;
	awardCategory: string | null;
	showPending: boolean;
	showGranted: boolean;
}

export class AwardsBreakdownPanel extends React.Component<Props, State> {
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
			const categoryOptions = Utils.arrayToItems(Streep.getCategories());
			categoryOptions.unshift({ id: '', text: 'all', disabled: false });

			let awards = Streep.getAwards();

			let gaugeSection = null;
			if (this.props.party) {
				const ids = ([] as string[]).concat(this.props.party.awards);
				this.props.party.pcs.forEach(pc => {
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
			}

			const list = awards.map(award => {
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

			if (awards.length === 0) {
				list.push(
					<Note>
						<div className='section'>
							no awards
						</div>
					</Note>
				);
			}

			return (
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
						<Conditional display={this.props.party !== null}>
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
						</Conditional>
					</Expander>
					{gaugeSection}
					{list}
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='AwardsBreakdownPanel' error={e} />;
		}
	}
}
