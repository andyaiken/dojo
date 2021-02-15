import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import React from 'react';

import { DieRollResult } from '../../models/dice';

import { RenderError } from './error-boundary';

interface Props {
	result: DieRollResult;
}

export class DieRollResultPanel extends React.Component<Props> {
	public render() {
		try {
			const rolls: JSX.Element[] = [];
			let sum = 0;
			this.props.result.rolls.forEach(roll => {
				let style = '';
				if (roll.sides === 20) {
					if (roll.value === 1) {
						style = 'nat1';
					}
					if (roll.value === 20) {
						style = 'nat20';
					}
				}
				rolls.push(
					<Tag key={roll.id} className={style}>
						d{roll.sides}: <b>{roll.value}</b>
					</Tag>
				);
				sum += roll.value;
			});
			if (this.props.result.constant !== 0) {
				const sign = (this.props.result.constant > 0) ? '+' : '-';
				rolls.push(
					<Tag key='constant'>
						{sign} <b>{Math.abs(this.props.result.constant)}</b>
					</Tag>
				);
				sum += this.props.result.constant;
			}

			const icon = (this.props.result.mode === '') ? null : (
				<ExclamationCircleOutlined className={'roll-icon ' + this.props.result.mode} title={this.props.result.mode} />
			);

			return (
				<div className='die-roll-result group-panel'>
					<div className='rolls'>
						{rolls}
						{icon}
					</div>
					<div className='sum'>
						{sum}
					</div>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError error={e} />;
		}
	}
}
