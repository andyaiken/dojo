import { ArrowDownOutlined, ArrowLeftOutlined, ArrowRightOutlined, ArrowUpOutlined, CaretDownOutlined, CaretUpOutlined, UndoOutlined } from '@ant-design/icons';
import React from 'react';

interface Props {
	showToggle: boolean;
	showAltitude: boolean;
	undo: {
		enabled: boolean;
		onUndo: () => void;
	} | null;
	disabled: boolean;
	onClick: (dir: string, step: number) => void;
}

interface State {
	step: number;
}

export class Radial extends React.Component<Props, State> {
	public static defaultProps = {
		showToggle: false,
		showAltitude: false,
		undo: null,
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
		this.props.onClick(dir, this.state.step);
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
				undo = (
					<div className='undo'>
						<UndoOutlined className={this.props.undo.enabled ? '' : 'disabled'} title='undo' onClick={e => this.undo(e)} />
					</div>
				);
			}

			let altitude = null;
			if (this.props.showAltitude) {
				altitude = (
					<div className='altitude'>
						<CaretUpOutlined title='move up' onClick={e => this.click(e, 'UP')} />
						<hr style={{ width: '30px', margin: '5px 0' }} />
						<CaretDownOutlined title='move down' onClick={e => this.click(e, 'DOWN')} />
					</div>
				);
			}

			return (
				<div className={style}>
					{undo}
					<div className='dial'>
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
								<ArrowLeftOutlined />
							</div>
						</div>
						<div className='radial-cell'>
							{middle}
						</div>
						<div className='radial-cell'>
							<div className='radial-arrow' onClick={e => this.click(e, 'E')} role='button'>
								<ArrowRightOutlined />
							</div>
						</div>
						<div className='radial-cell'>
							<div className='radial-arrow radial-arrow-diag' onClick={e => this.click(e, 'SW')} role='button'>
								<ArrowDownOutlined rotate={45} />
							</div>
						</div>
						<div className='radial-cell'>
							<div className='radial-arrow' onClick={e => this.click(e, 'S')} role='button'>
								<ArrowDownOutlined />
							</div>
						</div>
						<div className='radial-cell'>
							<div className='radial-arrow radial-arrow-diag' onClick={e => this.click(e, 'SE')} role='button'>
								<ArrowDownOutlined rotate={-45} />
							</div>
						</div>
					</div>
					{altitude}
				</div>
			);

		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}
