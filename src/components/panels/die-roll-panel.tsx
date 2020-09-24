import { CloseCircleOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import React from 'react';

interface Props {
	dice: { [sides: number]: number };
	constant: number;
	setDie: (sides: number, count: number) => void;
	setConstant: (value: number) => void;
	resetDice: () => void;
	rollDice: (mode: '' | 'advantage' | 'disadvantage') => void;
}

export class DieRollPanel extends React.Component<Props> {
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
					<Col span={8}><button onClick={() => this.props.rollDice('')}>roll {expression}</button></Col>
					<Col span={8}><button onClick={() => this.props.rollDice('advantage')}>advantage</button></Col>
					<Col span={8}><button onClick={() => this.props.rollDice('disadvantage')}>disadvantage</button></Col>
				</Row>
			);
		} else {
			buttons = (
				<div>
					<button className={total > 0 ? '' : 'disabled'} onClick={() => this.props.rollDice('')}>roll {expression}</button>
				</div>
			);
		}

		return (
			<div className='die-roll-panel'>
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
				<hr/>
				<Row gutter={10} align='middle'>
					<Col span={22}>
						{buttons}
					</Col>
					<Col span={2} className='section centered'>
						<CloseCircleOutlined
							className={total > 0 ? 'die-reset-button' : 'die-reset-button disabled'}
							title='reset dice'
							onClick={() => this.props.resetDice()}
						/>
					</Col>
				</Row>
			</div>
		);
	}
}
