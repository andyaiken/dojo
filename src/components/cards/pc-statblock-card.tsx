import { Col, Row, Tag } from 'antd';
import React from 'react';

import { Streep } from '../../utils/streep';

import { Combatant } from '../../models/combat';
import { PC } from '../../models/party';

import { AwardPanel } from '../panels/award-panel';
import { PortraitPanel } from '../panels/portrait-panel';
import { Statistic } from '../panels/statistic';

interface Props {
	pc: PC | (PC & Combatant);
}

export class PCStatblockCard extends React.Component<Props> {
	public render() {
		try {
			let companions = null;
			if (this.props.pc.companions.length > 0) {
				const list = this.props.pc.companions.map(companion => (
					<div key={companion.id} className='group-panel'>
						{companion.name}
					</div>
				));

				companions = (
					<div>
						<div className='section subheading'>companions</div>
						{list}
					</div>
				);
			}

			let awards = null;
			if (this.props.pc.awards.length > 0) {
				const list = this.props.pc.awards.map(awardID => {
					const award = Streep.getAward(awardID);
					if (!award) {
						return null;
					}
					return (
						<AwardPanel key={award.id} award={award} />
					);
				});

				awards = (
					<div>
						<div className='section subheading'>awards</div>
						{list}
					</div>
				);
			}

			const name = (this.props.pc as Combatant ? (this.props.pc as Combatant).displayName : null)
				|| this.props.pc.name
				|| 'unnamed pc';

			return (
				<div className='card pc'>
					<div className='heading'>
						<div className='title' title={name}>
							{name}
						</div>
					</div>
					<div className='card-content'>
						<div className='stats'>
							<PortraitPanel source={this.props.pc} />
							<div className='section centered lowercase'>
								<Tag>{this.props.pc.race || 'unknown race'}</Tag>
								<Tag>{this.props.pc.classes || 'unknown class'}</Tag>
								<Tag>{'level ' + this.props.pc.level}</Tag>
							</div>
							<div className='section centered' style={{ display: this.props.pc.url ? '' : 'none' }}>
								<a href={this.props.pc.url} target='_blank' rel='noopener noreferrer'>d&amp;d beyond sheet</a>
							</div>
							<hr/>
							<div className='section subheading'>size</div>
							<div className='section'>
								{this.props.pc.size}
							</div>
							<div className='section subheading'>languages</div>
							<div className='section'>
								{this.props.pc.languages || '-'}
							</div>
							<hr/>
							<Row>
								<Col span={8}>
									<Statistic prefix='passive' label='insight' value={this.props.pc.passiveInsight} />
								</Col>
								<Col span={8}>
									<Statistic prefix='passive' label='investigation' value={this.props.pc.passiveInvestigation} />
								</Col>
								<Col span={8}>
									<Statistic prefix='passive' label='perception' value={this.props.pc.passivePerception} />
								</Col>
							</Row>
							{companions}
							{awards}
						</div>
					</div>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
