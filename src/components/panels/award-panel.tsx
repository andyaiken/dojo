import { CloseCircleOutlined, TrophyOutlined } from '@ant-design/icons';
import { Col, Row, Tag } from 'antd';
import React from 'react';

import { Award, Party, PC } from '../../models/party';
import { Dropdown } from '../controls/dropdown';

interface AwardPanelProps {
	award: Award;
	party: Party | null;
}

export class AwardPanel extends React.Component<AwardPanelProps> {
	public static defaultProps = {
		party: null
	};

	public render() {
		try {
			const list = [];
			if (this.props.party) {
				if (this.props.party.awards.includes(this.props.award.id)) {
					list.push(this.props.party.name || 'unnamed party');
				}
				this.props.party.pcs.forEach(pc => {
					if (pc.awards.includes(this.props.award.id)) {
						list.push(pc.name || 'unnamed pc');
					}
				});
			}
			const awarded = (list.length > 0) ? <div className='section'>awarded to: {list.join(', ')}</div> : null;

			return (
				<div className='group-panel'>
					<Row align='middle'>
						<Col span={4}>
							<TrophyOutlined style={{ fontSize: '40px' }} />
						</Col>
						<Col span={20}>
							<div className='section subheading'>{this.props.award.name.toLowerCase()}</div>
							<Tag>{this.props.award.category}</Tag>
							<div className='section'>{this.props.award.description.toLowerCase()}</div>
						</Col>
					</Row>
					{awarded}
				</div>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}

interface AwardManagementPanelProps {
	award: Award;
	party: Party | null;
	addAward: (awardID: string, awardee: Party | PC) => void;
	deleteAward: (awardID: string, awardee: Party | PC) => void;
}

export class AwardManagementPanel extends React.Component<AwardManagementPanelProps> {
	public render() {
		try {
			let party = null;
			if (this.props.party) {
				const awardees = [];
				if (this.props.party.awards.includes(this.props.award.id)) {
					awardees.push(
						<div key={this.props.party.id} className='group-panel control-with-icons'>
							<div>{this.props.party.name || 'unnamed party'}</div>
							<div className='icons'>
								<CloseCircleOutlined onClick={() => this.props.deleteAward(this.props.award.id, this.props.party as Party)} />
							</div>
						</div>
					);
				}
				const all = [{ id: this.props.party.id, text: this.props.party.name || 'unnamed party' }];
				this.props.party.pcs.filter(pc => pc.active).forEach(pc => {
					if (pc.awards.includes(this.props.award.id)) {
						awardees.push(
							<div key={pc.id} className='group-panel control-with-icons'>
								<div>{pc.name || 'unnamed pc'}</div>
								<div className='icons'>
									<CloseCircleOutlined onClick={() => this.props.deleteAward(this.props.award.id, pc)} />
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
									this.props.addAward(this.props.award.id, this.props.party);
								} else {
									const pc = this.props.party.pcs.find(p => p.id === id);
									if (pc) {
										this.props.addAward(this.props.award.id, pc);
									}
								}
							}}
						/>
					</div>
				);
			}

			return (
				<div className='group-panel'>
					<div className='section subheading'>{this.props.award.name.toLowerCase()}</div>
					<div className='section'>{this.props.award.description.toLowerCase()}</div>
					{party}
				</div>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
