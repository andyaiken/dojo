import { TrophyTwoTone } from '@ant-design/icons';
import { Col, Row, Tag } from 'antd';
import React from 'react';

import { Award } from '../../models/party';

import { RenderError } from '../error';
import { Group } from '../controls/group';

interface AwardPanelProps {
	award: Award;
	children?: string | number | JSX.Element | null | (string | number | JSX.Element | null)[];
}

export class AwardPanel extends React.Component<AwardPanelProps> {
	public render() {
		try {
			return (
				<Group>
					<Row gutter={10} align='middle'>
						<Col span={4}>
							<TrophyTwoTone style={{ fontSize: '50px' }} twoToneColor='#d4af37' />
						</Col>
						<Col span={20}>
							<div className='content-then-info'>
								<div className='content'>
									<div className='section subheading'>{this.props.award.name.toLowerCase()}</div>
								</div>
								<div className='info'>
									<Tag>{this.props.award.category}</Tag>
								</div>
							</div>
							<div className='section'>{this.props.award.description.toLowerCase()}</div>
							{this.props.children}
						</Col>
					</Row>
				</Group>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='AwardPanel' error={e} />;
		}
	}
}
