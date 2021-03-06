import { Col, Row, Tag } from 'antd';
import React from 'react';

import { Combatant } from '../../models/combat';
import { PC } from '../../models/party';

import { RenderError } from '../error';
import { Group } from '../controls/group';
import { Statistic } from '../controls/statistic';
import { PortraitPanel } from '../panels/portrait-panel';
import { Conditional } from '../controls/conditional';

interface Props {
	pc: PC | (PC & Combatant);
}

export class PCStatblockCard extends React.Component<Props> {
	public render() {
		try {
			let companions = null;
			if (this.props.pc.companions.length > 0) {
				const list = this.props.pc.companions.map(companion => (
					<Group key={companion.id}>
						{companion.name}
					</Group>
				));

				companions = (
					<div>
						<div className='section subheading'>companions</div>
						{list}
					</div>
				);
			}

			const name = (this.props.pc as Combatant ? (this.props.pc as Combatant).displayName : null)
				|| this.props.pc.name
				|| 'unnamed pc';

			return (
				<div key={this.props.pc.id} className='card pc'>
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
							<Conditional display={!!this.props.pc.url}>
								<div className='section centered'>
									<a href={this.props.pc.url} target='_blank' rel='noopener noreferrer'>d&amp;d beyond sheet</a>
								</div>
							</Conditional>
							<hr/>
							<div className='section subheading'>size</div>
							<div className='section'>
								{this.props.pc.size}
							</div>
							<div className='section subheading'>languages</div>
							<div className='section'>
								{this.props.pc.languages || 'none listed'}
							</div>
							<div className='section subheading'>darkvision</div>
							<div className='section'>
								{this.props.pc.darkvision > 0 ? this.props.pc.darkvision + ' ft' : 'none'}
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
						</div>
					</div>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='PCStatblockCard' error={e} />;
		}
	}
}
