import { TrophyTwoTone } from '@ant-design/icons';
import { Col, Row, Tag } from 'antd';
import React from 'react';

import { Award } from '../../models/party';

interface AwardPanelProps {
	award: Award;
}

export class AwardPanel extends React.Component<AwardPanelProps> {
	public render() {
		try {
			return (
				<div className='group-panel'>
					<Row gutter={10} align='middle'>
						<Col span={4}>
							<TrophyTwoTone style={{ fontSize: '50px' }} twoToneColor='#d4af37' />
						</Col>
						<Col span={20}>
							<div className='section subheading'>{this.props.award.name.toLowerCase()}</div>
							<Tag>{this.props.award.category}</Tag>
							<div className='section'>{this.props.award.description.toLowerCase()}</div>
							{this.props.children}
						</Col>
					</Row>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
