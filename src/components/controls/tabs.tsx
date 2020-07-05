import React from 'react';

interface Props {
	options: { id: string; text: string; disabled?: boolean, display?: JSX.Element }[];
	selectedID: string | null;
	disabled: boolean;
	onSelect: (optionID: string) => void;
}

export default class Tabs extends React.Component<Props> {
	public static defaultProps = {
		disabled: false
	};

	public render() {
		try {
			const tabs = this.props.options.map(option => {
				return (
					<Tab
						key={option.id}
						option={option}
						selected={option.id === this.props.selectedID}
						onSelect={(optionID: string) => this.props.onSelect(optionID)}
					/>
				);
			});

			return (
				<div className={(this.props.disabled) ? 'tabs disabled' : 'tabs'}>
					{tabs}
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}

interface TabProps {
	option: { id: string; text: string; disabled?: boolean, display?: JSX.Element };
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

			let content = null;
			if (this.props.option.display) {
				content = this.props.option.display;
			} else {
				content = (
					<div>{this.props.option.text}</div>
				);
			}

			return (
				<div key={this.props.option.id} className={style} title={this.props.option.text} onClick={e => this.click(e)}>
					{content}
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}
