import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import React from 'react';

interface Props {
	value: number | string | JSX.Element | JSX.Element[];
	label: string;
	upEnabled: boolean;
	downEnabled: boolean;
	disabled: boolean;
	factors: number[];
	onNudgeValue: (delta: number) => void;
}

export default class NumberSpin extends React.Component<Props> {
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
			let valueStyle = 'info-value';
			if (this.props.value === 0) {
				valueStyle += ' disabled';
			}

			const minusBtns: JSX.Element[] = [];
			const plusBtns: JSX.Element[] = [];

			const factors = this.props.factors || [1];
			factors.forEach(factor => {
				minusBtns.push(
					<div
						key={'minus' + factor}
						className={factor === 1 ? 'spin-button' : 'spin-button multiple'}
						onTouchEnd={e => this.touchEnd(e, -1 * factor)}
						onClick={e => this.click(e, -1 * factor)}
					>
						{factor === 1 ? <MinusOutlined /> : <div>{factor}</div>}
					</div>
				);

				plusBtns.push(
					<div
						key={'plus' + factor}
						className={factor === 1 ? 'spin-button' : 'spin-button multiple'}
						onTouchEnd={e => this.touchEnd(e, +1 * factor)}
						onClick={e => this.click(e, +1 * factor)}
					>
						{factor === 1 ? <PlusOutlined /> : <div>{factor}</div>}
					</div>
				);
			});

			minusBtns.reverse();

			let minusStyle = 'minus';
			let plusStyle = 'plus';
			if (!this.props.downEnabled) {
				minusStyle += ' disabled';
			}
			if (!this.props.upEnabled) {
				plusStyle += ' disabled';
			}

			return (
				<div className={this.props.disabled ? 'number-spin disabled' : 'number-spin'}>
					<div className={minusStyle}>
						{minusBtns}
					</div>
					<div className='info' style={{ width: 'calc(100% - ' + (60 * factors.length) + 'px)' }}>
						<div className='info-label'>{this.props.label}</div>
						<div className={valueStyle}>{this.props.value}</div>
					</div>
					<div className={plusStyle}>
						{plusBtns}
					</div>
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}
