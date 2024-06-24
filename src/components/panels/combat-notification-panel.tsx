import { Col, Row } from 'antd';
import React from 'react';

import { Combatant, Notification } from '../../models/combat';
import { Condition, ConditionDurationSaves } from '../../models/condition';
import { Monster, Trait } from '../../models/monster';

import { RenderError } from '../error';
import { Napoleon } from '../../utils/napoleon';

interface Props {
	notification: Notification;
	openSidebar: () => void;
	close: (notification: Notification, removeCondition: boolean) => void;
}

export class CombatNotificationPanel extends React.Component<Props> {
	public static defaultProps = {
		openSidebar: null
	};

	private success() {
		switch (this.props.notification.type) {
			case 'condition-save':
			case 'condition-end':
				{
					const condition = this.props.notification.data as Condition;
					if (condition.duration) {
						if ((condition.duration.type === 'saves') || (condition.duration.type === 'rounds')) {
							// Reduce save by 1
							condition.duration.count -= 1;
							this.props.close(this.props.notification, condition.duration.count === 0);
						}
					}
				}
				break;
			case 'trait-recharge':
				{
					// Mark trait as recharged
					const trait = this.props.notification.data as Trait;
					trait.uses = 0;
					this.props.close(this.props.notification, false);
				}
				break;
		}
	}

	public render() {
		try {
			const name = Napoleon.getCombatantName(this.props.notification.combatant as Combatant, []);

			switch (this.props.notification.type) {
				case 'condition-save':
					{
						const saveCondition = this.props.notification.data as Condition;
						const saveConditionName = saveCondition.name === 'custom' ? saveCondition.text : saveCondition.name;
						const saveConditionDuration = saveCondition.duration as ConditionDurationSaves;
						let saveType = saveConditionDuration.saveType.toString();
						if (saveType !== 'death') {
							saveType = saveType.toUpperCase();
						}
						return (
							<div>
								<div className='section'>
									<b>{name}</b> (<i>{saveConditionName}</i>) must make a {saveType} save against dc {saveConditionDuration.saveDC}
								</div>
								<Row gutter={10}>
									<Col span={12}>
										<button onClick={() => this.success()}>success</button>
									</Col>
									<Col span={12}>
										<button onClick={() => this.props.close(this.props.notification, false)}>failure</button>
									</Col>
								</Row>
							</div>
						);
					}
				case 'condition-end':
					{
						const endCondition = this.props.notification.data as Condition;
						const endConditionName = endCondition.name === 'custom' ? endCondition.text : endCondition.name;
						return (
							<div>
								<div className='section'>
									<b>{name}</b> is no longer affected by condition <b>{endConditionName}</b>
								</div>
							</div>
						);
					}
				case 'trait-recharge':
					{
						const trait = this.props.notification.data as Trait;
						return (
							<div>
								<div className='section'>
									<b>{name}</b> can attempt to recharge <b>{trait.name}</b>
								</div>
								<div className='section'>
									{trait.usage}
								</div>
								<Row gutter={10}>
									<Col span={12}>
										<button onClick={() => this.success()}>recharge</button>
									</Col>
									<Col span={12}>
										<button onClick={() => this.props.openSidebar()}>roll 1d6</button>
									</Col>
								</Row>
							</div>
						);
					}
			}
		} catch (e) {
			console.error(e);
			return <RenderError context='CombatNotificationPanel' error={e} />;
		}
	}
}
