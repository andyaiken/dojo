import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Col, Row, Tag } from 'antd';
import React from 'react';

import Utils from '../../../utils/utils';

import Selector from '../../controls/selector';

interface Roll {
	sides: number;
	value: number;
}

interface RollResult {
	rolls: Roll[];
	constant: number;
	option: string;
}

interface Props {
	dice: { [sides: number]: number };
	constant: number;
	setDie: (sides: number, count: number) => void;
	setConstant: (value: number) => void;
	resetDice: () => void;
}

interface State {
	option: string;
	results: RollResult[];
}

export default class DieRollerTool extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			option: 'normal',
			results: []
		};
	}

	private rollDice() {
		const result: RollResult = {
			rolls: [],
			constant: this.props.constant,
			option: this.state.option
		};
		[4, 6, 8, 10, 12, 20, 100].forEach(sides => {
			const count = this.props.dice[sides];
			for (let n = 0; n !== count; ++n) {
				let value = Utils.dieRoll(sides);
				switch (result.option) {
					case 'advantage':
						value = Math.max(value, Utils.dieRoll(sides));
						break;
					case 'disadvantage':
						value = Math.min(value, Utils.dieRoll(sides));
						break;
				}
				result.rolls.push({
					sides: sides,
					value: value
				});
			}
		});
		this.state.results.unshift(result);

		this.setState({
			results: this.state.results
		});
	}

	private reset() {
		this.setState({
			option: 'normal'
		}, () => {
			this.props.resetDice();
		});
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

	private getDieTypeBox(sides: number) {
		const count = this.props.dice[sides];
		return (
			<div
				className={count > 0 ? 'die-type' : 'die-type none'}
				onClick={e => this.dieTypeClicked(e, sides, true && !e.ctrlKey)}
				onContextMenu={e => this.dieTypeClicked(e, sides, false)}
			>
				<div className='die-type-name'>d{sides}</div>
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
			>
				<div className='die-type-name'>+/-</div>
				<div className='die-type-value'>{count}</div>
			</div>
		);
	}

	private renderRoll(result: RollResult, resultIndex: number) {
		const rolls: JSX.Element[] = [];
		let sum = 0;
		result.rolls.forEach((roll, rollIndex) => {
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
				<Tag key={'d' + roll.sides + '.' + rollIndex} className={style}>
					d{roll.sides}: <b>{roll.value}</b>
				</Tag>
			);
			sum += roll.value;
		});
		if (result.constant !== 0) {
			const sign = (result.constant > 0) ? '+' : '-';
			rolls.push(
				<Tag key='constant'>
					{sign} <b>{Math.abs(result.constant)}</b>
				</Tag>
			);
			sum += result.constant;
		}

		const icon = (result.option === 'normal') ? null : <ExclamationCircleOutlined className={'roll-icon ' + result.option} title={result.option} />;

		return (
			<div key={resultIndex} className='die-roll group-panel'>
				<div className='rolls'>
					{rolls}
					{icon}
				</div>
				<div className='sum'>
					{sum}
				</div>
			</div>
		);
	}

	public render() {
		try {
			const results = this.state.results.map((result, resultIndex) => this.renderRoll(result, resultIndex));

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

			return (
				<div>
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
					<Selector
						options={['normal', 'advantage', 'disadvantage'].map(o => ({ id: o, text: o }))}
						selectedID={this.state.option}
						disabled={(total !== 1) || (this.props.dice[20] !== 1)}
						onSelect={id => this.setState({ option: id })}
					/>
					<Row gutter={10}>
						<Col span={12}>
							<button className={total > 0 ? '' : 'disabled'} onClick={() => this.rollDice()}>roll {expression}</button>
						</Col>
						<Col span={12}>
							<button className={total > 0 ? '' : 'disabled'} onClick={() => this.reset()}>reset</button>
						</Col>
					</Row>
					<hr/>
					{results}
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}
