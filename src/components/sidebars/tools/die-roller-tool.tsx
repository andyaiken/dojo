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
	option: string;
}

interface Props {
}

interface State {
	dice: { [sides: number]: number };
	option: string;
	results: RollResult[];
}

export default class DieRollerTool extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		const dice: { [sides: number]: number } = {};
		dice[4] = 0;
		dice[6] = 0;
		dice[8] = 0;
		dice[10] = 0;
		dice[12] = 0;
		dice[20] = 0;
		dice[100] = 0;

		this.state = {
			dice: dice,
			option: 'normal',
			results: []
		};
	}

	private rollDice() {
		const result: RollResult = {
			rolls: [],
			option: this.state.option
		};
		[4, 6, 8, 10, 12, 20, 100].forEach(sides => {
			const count = this.state.dice[sides];
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

		const dice: { [sides: number]: number } = {};
		dice[4] = 0;
		dice[6] = 0;
		dice[8] = 0;
		dice[10] = 0;
		dice[12] = 0;
		dice[20] = 0;
		dice[100] = 0;

		this.setState({
			dice: dice,
			option: 'normal',
			results: this.state.results
		});
	}

	private reset() {
		const dice: { [sides: number]: number } = {};
		dice[4] = 0;
		dice[6] = 0;
		dice[8] = 0;
		dice[10] = 0;
		dice[12] = 0;
		dice[20] = 0;
		dice[100] = 0;

		this.setState({
			dice: dice,
			option: 'normal'
		});
	}

	private dieTypeClicked(e: React.MouseEvent, sides: number, up: boolean) {
		e.preventDefault();

		const dice = this.state.dice;
		dice[sides] = Math.max(dice[sides] + (up ? 1 : -1), 0);

		this.setState({
			dice: dice
		});
	}

	private getDieTypeBox(sides: number) {
		const count = this.state.dice[sides];
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

	private renderRoll(result: RollResult, resultIndex: number) {
		const rolls: JSX.Element[] = [];
		let sum = 0;
		result.rolls.forEach((roll, rollIndex) => {
			rolls.push(
				<Tag key={'d' + roll.sides + '.' + rollIndex}>
					d{roll.sides}: <b>{roll.value}</b>
				</Tag>
			);
			sum += roll.value;
		});

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

			const total = this.state.dice[4]
				+ this.state.dice[6]
				+ this.state.dice[8]
				+ this.state.dice[10]
				+ this.state.dice[12]
				+ this.state.dice[20]
				+ this.state.dice[100];

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
					</div>
					<hr/>
					<Selector
						options={['normal', 'advantage', 'disadvantage'].map(o => ({ id: o, text: o }))}
						selectedID={this.state.option}
						disabled={(total !== 1) || (this.state.dice[20] !== 1)}
						onSelect={id => this.setState({ option: id })}
					/>
					<Row gutter={10}>
						<Col span={12}>
							<button className={total > 0 ? '' : 'disabled'} onClick={() => this.rollDice()}>roll dice</button>
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
