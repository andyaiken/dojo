import React from 'react';

import { Combatant, Notification } from '../../models/combat';
import { Condition, ConditionDurationSaves } from '../../models/condition';
import { Monster, Trait } from '../../models/monster';

interface Props {
	notification: Notification;
	close: (notification: Notification, removeCondition: boolean) => void;
}

export default class CombatNotificationPanel extends React.Component<Props> {
	private success() {
		switch (this.props.notification.type) {
			case 'condition-save':
			case 'condition-end':
				const condition = this.props.notification.data as Condition;
				if (condition.duration) {
					if ((condition.duration.type === 'saves') || (condition.duration.type === 'rounds')) {
						// Reduce save by 1
						condition.duration.count -= 1;
						this.close(condition.duration.count === 0);
					}
				}
				break;
			case 'trait-recharge':
				// Mark trait as recharged
				const trait = this.props.notification.data as Trait;
				trait.uses = 0;
				this.close(false);
				break;
		}
	}

	private close(removeCondition: boolean) {
		this.props.close(this.props.notification, removeCondition);
	}

	public render() {
		try {
			const combatant = this.props.notification.combatant as (Combatant & Monster);
			const condition = this.props.notification.data as Condition;
			const trait = this.props.notification.data as Trait;

			const name = combatant.displayName || combatant.name || 'unnamed monster';
			switch (this.props.notification.type) {
				case 'condition-save':
					const duration = condition.duration as ConditionDurationSaves;
					let saveType = duration.saveType.toString();
					if (saveType !== 'death') {
						saveType = saveType.toUpperCase();
					}
					return (
						<div>
							<div className='section'>
								<b>{name}</b> must make a {saveType} save against dc {duration.saveDC}
							</div>
							<button onClick={() => this.success()}>success</button>
						</div>
					);
				case 'condition-end':
					return (
						<div>
							<div className='section'>
								<b>{name}</b> is no longer affected by condition <b>{condition.name}</b>
							</div>
						</div>
					);
				case 'trait-recharge':
					return (
						<div>
							<div className='section'>
								<b>{name}</b> can attempt to recharge <b>{trait.name}</b>
							</div>
							<div className='section'>
								{trait.usage}
							</div>
							<button onClick={() => this.success()}>recharge</button>
						</div>
					);
			}
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}
