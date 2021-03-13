import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import React from 'react';

import { RenderError } from '../error';

interface Props {
	value: number | string | JSX.Element | JSX.Element[];
	label: string;
	upEnabled: boolean;
	downEnabled: boolean;
	disabled: boolean;
	factors: number[];
	onNudgeValue: (delta: number) => void;
}

export class NumberSpin extends React.Component<Props> {
	public static defaultProps = {
		label: null,
		upEnabled: true,
		downEnabled: true,
		disabled: false,
		factors: null
	};

	private click(e: React.MouseEvent, delta: number) {
		e.stopPropagation();
		this.props.onNudgeValue(delta);
	}

	private touchEnd(e: React.TouchEvent, delta: number) {
		e.preventDefault();
		e.stopPropagation();
		this.props.onNudgeValue(delta);
	}

	public render() {
		try {
			let minusStyle = 'spin-button';
			let valueStyle = 'info-value';
			let plusStyle = 'spin-button';
			if (!this.props.downEnabled) {
				minusStyle += ' disabled';
			}
			if (this.props.value === 0) {
				valueStyle += ' disabled';
			}
			if (!this.props.upEnabled) {
				plusStyle += ' disabled';
			}

			const minusBtns: JSX.Element[] = [];
			const plusBtns: JSX.Element[] = [];

			const factors = this.props.factors || [1];
			factors.forEach(factor => {
				minusBtns.push(
					<div
						key={'minus' + factor}
						className={factor === 1 ? minusStyle : minusStyle + ' multiple'}
						onTouchEnd={e => this.touchEnd(e, -1 * factor)}
						onClick={e => this.click(e, -1 * factor)}
						role='button'
					>
						{factor === 1 ? <MinusOutlined /> : <div>{factor}</div>}
					</div>
				);

				plusBtns.push(
					<div
						key={'plus' + factor}
						className={factor === 1 ? plusStyle : plusStyle + ' multiple'}
						onTouchEnd={e => this.touchEnd(e, +1 * factor)}
						onClick={e => this.click(e, +1 * factor)}
						role='button'
					>
						{factor === 1 ? <PlusOutlined /> : <div>{factor}</div>}
					</div>
				);
			});

			minusBtns.reverse();

			return (
				<div className={this.props.disabled ? 'number-spin disabled' : 'number-spin'}>
					{minusBtns}
					<div className='info'>
						<div className='info-label'>{this.props.label}</div>
						<div className={valueStyle}>{this.props.value}</div>
					</div>
					{plusBtns}
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='NumberSpin' error={e} />;
		}
	}
}
