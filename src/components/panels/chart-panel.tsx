import React from 'react';

import { RenderError } from '../error';

interface Props {
	data: { text: string, value: number }[];
	collapse: boolean;
	onFormatValue: (value: number) => string;
}

export class ChartPanel extends React.Component<Props> {
	public static defaultProps = {
		collapse: false,
		onFormatValue: (value: number) => value.toString()
	};

	public render() {
		try {
			if (this.props.data.length === 0) {
				return null;
			}

			const max = Math.max(...this.props.data.map(d => d.value));

			let data;
			if (this.props.collapse) {
				data = this.props.data.filter(d => d.value > 0);
			} else {
				const first = this.props.data.find(d => d.value > 0);
				this.props.data.reverse();
				const last = this.props.data.find(d => d.value > 0);
				this.props.data.reverse();
				const start = first ? this.props.data.indexOf(first) : 0;
				const end = last ? this.props.data.indexOf(last) : this.props.data.length - 1;
				data = this.props.data.slice(start, end + 1);
			}

			const bars = data.map(d => (
				<div key={d.text} className='bar-container'>
					<div
						className='bar'
						style={{
							width: 'calc((100% - 1px) * ' + d.value + ' / ' + max + ')'
						}}
					>
						<div className='label'>{d.text}: {this.props.onFormatValue(d.value)}</div>
					</div>
				</div>
			));

			return (
				<div className='plot'>{bars}</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='ChartPanel' error={e} />;
		}
	}
}
