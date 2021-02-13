import { ArrowUpOutlined, CaretDownOutlined, CaretUpOutlined, UndoOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import React from 'react';

interface Props {
	showToggle: boolean;
	undo: {
		enabled: boolean;
		text: JSX.Element;
		onUndo: () => void;
	} | null;
	altitude: {
		enabled: boolean;
		text: JSX.Element;
	} | null;
	disabled: boolean;
	onMove: (dir: string, step: number) => void;
}

interface State {
	step: number;
}

export class Radial extends React.Component<Props, State> {
	public static defaultProps = {
		showToggle: false,
		undo: null,
		altitude: null,
		disabled: false
	};

	constructor(props: Props) {
		super(props);
		this.state = {
			step: 1
		};
	}

	private click(e: React.MouseEvent, dir: string) {
		e.stopPropagation();
		this.props.onMove(dir, this.state.step);
	}

	private undo(e: React.MouseEvent) {
		e.stopPropagation();
		if (this.props.undo && this.props.undo.enabled) {
			this.props.undo.onUndo();
		}
	}

	private toggleStep(e: React.MouseEvent) {
		e.stopPropagation();
		this.setState({
			step: this.state.step === 1 ? 0.5 : 1
		});
	}

	public render() {
		try {
			let style = 'radial';
			if (this.props.disabled) {
				style += ' disabled';
			}

			let middle = null;
			if (this.props.showToggle) {
				const label = this.state.step !== 1 ? '½' : '';
				middle = (
					<div className='radial-toggle' role='button' onClick={e => this.toggleStep(e)}>
						{label}
					</div>
				);
			}

			let undo = null;
			if (this.props.undo) {
				let undoStyle = 'undo';
				if (!this.props.undo.enabled) {
					undoStyle += ' disabled';
				}
				undo = (
					<div className={undoStyle}>
						<UndoOutlined title='undo' onClick={e => this.undo(e)} />
						{this.props.undo.text}
					</div>
				);
			}

			let altitude = null;
			if (this.props.altitude) {
				let altStyle = 'altitude';
				if (!this.props.altitude.enabled) {
					altStyle += ' disabled';
				}
				altitude = (
					<div className={altStyle}>
						<CaretUpOutlined title='move up' onClick={e => this.click(e, 'UP')} />
						{this.props.altitude.text}
						<CaretDownOutlined title='move down' onClick={e => this.click(e, 'DOWN')} />
					</div>
				);
			}

			return (
				<div className={style}>
					<Row align='middle'>
						<Col span={8}>
							{undo}
						</Col>
						<Col span={8}>
							<div className='dial'>
								<div className='cells'>
									<div className='radial-cell'>
										<div className='radial-arrow radial-arrow-diag' onClick={e => this.click(e, 'NW')} role='button'>
											<ArrowUpOutlined rotate={-45} />
										</div>
									</div>
									<div className='radial-cell'>
										<div className='radial-arrow' onClick={e => this.click(e, 'N')} role='button'>
											<ArrowUpOutlined />
										</div>
									</div>
									<div className='radial-cell'>
										<div className='radial-arrow radial-arrow-diag' onClick={e => this.click(e, 'NE')} role='button'>
											<ArrowUpOutlined rotate={45} />
										</div>
									</div>
									<div className='radial-cell'>
										<div className='radial-arrow' onClick={e => this.click(e, 'W')} role='button'>
											<ArrowUpOutlined rotate={-90} />
										</div>
									</div>
									<div className='radial-cell'>
										{middle}
									</div>
									<div className='radial-cell'>
										<div className='radial-arrow' onClick={e => this.click(e, 'E')} role='button'>
											<ArrowUpOutlined rotate={90} />
										</div>
									</div>
									<div className='radial-cell'>
										<div className='radial-arrow radial-arrow-diag' onClick={e => this.click(e, 'SW')} role='button'>
											<ArrowUpOutlined rotate={-135} />
										</div>
									</div>
									<div className='radial-cell'>
										<div className='radial-arrow' onClick={e => this.click(e, 'S')} role='button'>
											<ArrowUpOutlined rotate={180} />
										</div>
									</div>
									<div className='radial-cell'>
										<div className='radial-arrow radial-arrow-diag' onClick={e => this.click(e, 'SE')} role='button'>
											<ArrowUpOutlined rotate={135} />
										</div>
									</div>
								</div>
							</div>
						</Col>
						<Col span={8}>
							{altitude}
						</Col>
					</Row>
				</div>
			);

		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}
