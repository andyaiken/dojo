import { ArrowDownOutlined, ArrowLeftOutlined, ArrowRightOutlined, ArrowUpOutlined } from '@ant-design/icons';
import React from 'react';

interface Props {
	showToggle: boolean;
	disabled: boolean;
	onClick: (dir: string, step: number) => void;
}

interface State {
	step: number;
}

export class Radial extends React.Component<Props, State> {
	public static defaultProps = {
		showToggle: false,
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

	private toggleStep() {
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
					<div className='radial-toggle' role='button' onClick={() => this.toggleStep()}>
						{label}
					</div>
				);
			}

			return (
				<div className={style}>
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
			);

		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}
