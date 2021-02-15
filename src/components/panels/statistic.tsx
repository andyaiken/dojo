import React from 'react';

import { RenderError } from './error-boundary';

interface Props {
	label: string | JSX.Element;
	value: number | string | JSX.Element;
	prefix: number | string | JSX.Element | null;
	suffix: number | string | JSX.Element | null;
}

export class Statistic extends React.Component<Props> {
	public static defaultProps = {
		prefix: null,
		suffix: null
	};

	public render() {
		try {
			return (
				<div className='statistic'>
					<div className='statistic-prefix'>{this.props.prefix}</div>
					<div className='statistic-label'>{this.props.label}</div>
					<div className='statistic-value'>{this.props.value}</div>
					<div className='statistic-suffix'>{this.props.suffix}</div>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError error={e} />;
		}
	}
}
