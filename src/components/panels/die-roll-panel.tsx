import { CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Col, Row, Tag } from 'antd';
import React from 'react';

import { DieRollResult } from '../../models/dice';

import { RenderError } from '../error';
import { Group } from '../controls/group';

interface DieRollPanelProps {
	dice: { [sides: number]: number };
	constant: number;
	setDie: (sides: number, count: number) => void;
	setConstant: (value: number) => void;
	resetDice: () => void;
	rollDice: (expression: string, mode: '' | 'advantage' | 'disadvantage') => void;
}

export class DieRollPanel extends React.Component<DieRollPanelProps> {
	private getDieTypeBox(sides: number) {
		const count = this.props.dice[sides];
		return (
			<div
				className={count > 0 ? 'die-type' : 'die-type none'}
				onClick={e => this.dieTypeClicked(e, sides, true && !e.ctrlKey)}
				onContextMenu={e => this.dieTypeClicked(e, sides, false)}
				role='button'
			>
				<div className='die-type-name'>d{sides === 100 ? '%' : sides}</div>
				<div className='die-type-value'>{count}</div>
			</div>
		);
	}

	private getConstantBox() {
		const count = this.props.constant;
		return (
			<div
				className={count > 0 ? 'die-type' : 'die-type none'}
				onClick={e => this.dieTypeClicked(e, 0, true && !e.ctrlKey)}
				onContextMenu={e => this.dieTypeClicked(e, 0, false)}
				role='button'
			>
				<div className='die-type-name'>+/-</div>
				<div className='die-type-value'>{count}</div>
			</div>
		);
	}

	private dieTypeClicked(e: React.MouseEvent, sides: number, up: boolean) {
		e.preventDefault();

		if (sides === 0) {
			const value = this.props.constant + (up ? 1 : -1);
			this.props.setConstant(value);
		} else {
			const value = Math.max(this.props.dice[sides] + (up ? 1 : -1), 0);
			this.props.setDie(sides, value);
		}
	}

	public render() {
		try {
			const total = this.props.dice[4]
				+ this.props.dice[6]
				+ this.props.dice[8]
				+ this.props.dice[10]
				+ this.props.dice[12]
				+ this.props.dice[20]
				+ this.props.dice[100];

			let expression = '';
			[100, 20, 12, 10, 8, 6, 4].forEach(sides => {
				if (this.props.dice[sides] !== 0) {
					if (expression) {
						expression += ' + ';
					}
					expression += this.props.dice[sides] + 'd' + sides;
				}
			});
			if (this.props.constant !== 0) {
				if (expression) {
					if (this.props.constant > 0) {
						expression += ' + ';
					} else {
						expression += ' - ';
					}
				}
				expression += Math.abs(this.props.constant);
			}

			let buttons = null;
			if ((total === 1) && (this.props.dice[20] === 1)) {
				buttons = (
					<Row gutter={10}>
						<Col span={12}><button onClick={() => this.props.rollDice(expression, '')}>roll {expression}</button></Col>
						<Col span={6}><button onClick={() => this.props.rollDice(expression + ' (adv)', 'advantage')}>adv</button></Col>
						<Col span={6}><button onClick={() => this.props.rollDice(expression + ' (dis)', 'disadvantage')}>dis</button></Col>
					</Row>
				);
			} else {
				buttons = (
					<div>
						<button className={total > 0 ? '' : 'disabled'} onClick={() => this.props.rollDice(expression, '')}>roll {expression}</button>
					</div>
				);
			}

			return (
				<div className='die-roll-panel'>
					<div className='content-then-icons'>
						<div className='content'>
							<div className='die-types'>
								{this.getDieTypeBox(4)}
								{this.getDieTypeBox(6)}
								{this.getDieTypeBox(8)}
								{this.getDieTypeBox(10)}
								{this.getDieTypeBox(12)}
								{this.getDieTypeBox(20)}
								{this.getDieTypeBox(100)}
								{this.getConstantBox()}
							</div>
						</div>
						<div className='icons'>
							<CloseCircleOutlined
								className={total > 0 ? 'die-reset-button' : 'die-reset-button disabled'}
								title='reset dice'
								onClick={() => this.props.resetDice()}
							/>
						</div>
					</div>
					<hr/>
					{buttons}
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='DieRollPanel' error={e} />;
		}
	}
}

interface DieRollResultPanelProps {
	result: DieRollResult;
}

export class DieRollResultPanel extends React.Component<DieRollResultPanelProps> {
	public static defaultProps = {
		text: null
	};

	public render() {
		try {
			let heading = null;
			if (this.props.result.text) {
				heading = (
					<div className='section subheading'>
						{this.props.result.text}
					</div>
				);
			}

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
				<Group>
					<div className='die-roll-result'>
						<div className='info'>
							{heading}
							<div className='rolls'>
								{rolls}
								{icon}
							</div>
						</div>
						<div className='sum'>
							{sum}
						</div>
					</div>
				</Group>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='DieRollResultPanel' error={e} />;
		}
	}
}
