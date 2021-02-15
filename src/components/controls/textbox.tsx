import React from 'react';
import { DebounceInput } from 'react-debounce-input';

import { RenderError } from '../panels/error-boundary';

interface Props {
	text: string;
	placeholder: string;
	multiLine: boolean;
	minLength: number;
	disabled: boolean;
	debounce: boolean;
	noMargins: boolean;
	onChange: (value: string) => void;
	onPressEnter: () => void;
}

export class Textbox extends React.Component<Props> {
	public static defaultProps = {
		placeholder: '',
		multiLine: false,
		minLength: 0,
		disabled: false,
		debounce: true,
		noMargins: false,
		onPressEnter: null
	};

	private keyDown(e: React.KeyboardEvent) {
		if ((e.key === 'Enter') && (this.props.onPressEnter)) {
			this.props.onPressEnter();
		}
	}

	public render() {
		try {
			let style = '';
			if (this.props.disabled) {
				style = 'disabled';
			}
			if (this.props.noMargins) {
				style += ' no-margins';
			}

			if (this.props.multiLine) {
				return (
					<DebounceInput
						element={'textarea'}
						minLength={this.props.minLength}
						debounceTimeout={this.props.debounce ? 500 : 100}
						className={style}
						value={this.props.text}
						placeholder={this.props.placeholder}
						rows={5}
						onChange={event => this.props.onChange(event.target.value)}
					/>
				);
			}

			return (
				<DebounceInput
					minLength={this.props.minLength}
					debounceTimeout={this.props.debounce ? 500 : 100}
					className={style}
					value={this.props.text}
					placeholder={this.props.placeholder}
					onChange={event => this.props.onChange(event.target.value)}
					onKeyDown={e => this.keyDown(e)}
				/>
			);
		} catch (e) {
			console.error(e);
			return <RenderError error={e} />;
		}
	}
}
