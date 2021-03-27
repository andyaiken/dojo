import React from 'react';

import { RenderError } from '../error';

interface Props {
	options: { id: string; text: string; disabled?: boolean }[];
	selectedID: string | null;
	disabled: boolean;
	onSelect: (optionID: string) => void;
}

export class Tabs extends React.Component<Props> {
	public static defaultProps = {
		disabled: false
	};

	public render() {
		try {
			if (this.props.options.length === 0) {
				return null;
			}

			return (
				<div className={(this.props.disabled) ? 'tabs disabled' : 'tabs'}>
					{
						this.props.options.map(option => (
							<Tab
								key={option.id}
								option={option}
								selected={option.id === this.props.selectedID}
								onSelect={(optionID: string) => this.props.onSelect(optionID)}
							/>
						))
					}
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='Tabs' error={e} />;
		}
	}
}

interface TabProps {
	option: { id: string; text: string; disabled?: boolean };
	selected: boolean;
	onSelect: (optionID: string) => void;
}

class Tab extends React.Component<TabProps> {
	private click(e: React.MouseEvent) {
		e.stopPropagation();
		if (!this.props.option.disabled) {
			this.props.onSelect(this.props.option.id);
		}
	}

	public render() {
		try {
			let style = 'tab';
			if (this.props.selected) {
				style += ' selected';
			}
			if (this.props.option.disabled) {
				style += ' disabled';
			}

			return (
				<div key={this.props.option.id} className={style} title={this.props.option.text} onClick={e => this.click(e)} role='button'>
					{this.props.option.text}
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='Tab' error={e} />;
		}
	}
}
