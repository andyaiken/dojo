import React from 'react';

interface Props {
	options: { id: string; text: string; disabled?: boolean }[];
	selectedID: string | null;
	itemsPerRow: number;
	disabled: boolean;
	onSelect: (optionID: string) => void;
}

export default class Selector extends React.Component<Props> {
	public static defaultProps = {
		itemsPerRow: null,
		disabled: false
	};

	public render() {
		try {
			const itemsPerRow = this.props.itemsPerRow ? this.props.itemsPerRow : this.props.options.length;
			const rowCount = Math.ceil(this.props.options.length / itemsPerRow);
			const rowContents: JSX.Element[][] = [];
			for (let n = 0; n !== rowCount; ++n) {
				rowContents.push([]);
			}

			this.props.options.forEach(option => {
				const index = this.props.options.indexOf(option);
				const rowIndex = Math.floor(index / itemsPerRow);
				const row = rowContents[rowIndex];
				row.push(
					<SelectorOption
						key={option.id}
						option={option}
						selected={option.id === this.props.selectedID}
						onSelect={(optionID: string) => this.props.onSelect(optionID)}
					/>
				);
			});

			const rowSections = rowContents.map(row => {
				const index = rowContents.indexOf(row);
				return <div key={index} className='selector-row'>{row}</div>;
			});

			return (
				<div className={(this.props.disabled) ? 'selector disabled' : 'selector'}>
					{rowSections}
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
				<div key={this.props.option.id} className={style} title={this.props.option.text} onClick={e => this.click(e)}>
					{this.props.option.text}
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}
