import React from 'react';

interface Props {
	options: { id: string; text: string; disabled?: boolean }[];
	selectedID: string | null;
	itemsPerRow: number;
	disabled: boolean;
	onSelect: (optionID: string) => void;
}

export class Selector extends React.Component<Props> {
	public static defaultProps = {
		itemsPerRow: null,
		disabled: false
	};

	public render() {
		try {
			if (this.props.options.length === 0) {
				return null;
			}

			const itemsPerRow = this.props.itemsPerRow ?? this.props.options.length;
			const options = this.props.options.map(option => (
				<SelectorOption
					key={option.id}
					option={option}
					width={100 / itemsPerRow}
					selected={option.id === this.props.selectedID}
					onSelect={(optionID: string) => this.props.onSelect(optionID)}
				/>
			));

			return (
				<div className={(this.props.disabled) ? 'selector disabled' : 'selector'}>
					{options}
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}

interface SelectorOptionProps {
	option: { id: string; text: string; disabled?: boolean };
	width: number;
	selected: boolean;
	onSelect: (optionID: string) => void;
}

class SelectorOption extends React.Component<SelectorOptionProps> {
	private click(e: React.MouseEvent) {
		e.stopPropagation();
		if (!this.props.option.disabled) {
			this.props.onSelect(this.props.option.id);
		}
	}

	public render() {
		try {
			let style = 'option';
			if (this.props.selected) {
				style += ' selected';
			}
			if (this.props.option.disabled) {
				style += ' disabled';
			}

			return (
				<div key={this.props.option.id} className={style} style={{ flex: '0 0 ' + this.props.width + '%' }} title={this.props.option.text} onClick={e => this.click(e)} role='button'>
					{this.props.option.text}
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}
