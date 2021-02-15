import React from 'react';

import { RenderError } from '../panels/error-boundary';

interface Props {
	label: string;
	checked: boolean;
	disabled: boolean;
	onChecked: (value: boolean) => void;
}

export class Checkbox extends React.Component<Props> {
	public static defaultProps = {
		disabled: false
	};

	private click(e: React.MouseEvent) {
		e.stopPropagation();
		this.props.onChecked(!this.props.checked);
	}

	public render() {
		try {
			let style = 'checkbox';
			if (this.props.checked) {
				style += ' checked';
			}
			if (this.props.disabled) {
				style += ' disabled';
			}

			const toggle = (
				<div className='toggle-container'>
					<div className='toggle'/>
				</div>
			);

			return (
				<div className={style} onClick={e => this.click(e)} role='button'>
					<div className='checkbox-label'>{this.props.label}</div>
					{toggle}
				</div>
			);

		} catch (e) {
			console.error(e);
			return <RenderError error={e} />;
		}
	}
}
