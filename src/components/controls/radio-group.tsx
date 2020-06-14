import React from 'react';

interface Props {
	items: {
		id: string;
		text: string;
		info?: string;
		details?: JSX.Element | string;
		disabled?: boolean
	}[];
	selectedItemID: string | null;
	onSelect: (itemID: string) => void;
}

export default class RadioGroup extends React.Component<Props> {
	public render() {
		try {
			const content = this.props.items.map(item => {
				return (
					<RadioGroupItem
						key={item.id}
						item={item}
						selected={this.props.selectedItemID === item.id}
						onSelect={(itemID: string) => this.props.onSelect(itemID)}
					/>
				);
			});

			return (
				<div className='radio-group'>
					{content}
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}

interface RadioGroupItemProps {
	item: {
		id: string;
		text: string;
		info?: string;
		details?: JSX.Element | string;
		disabled?: boolean
	};
	selected: boolean;
	onSelect: (itemID: string) => void;
}

class RadioGroupItem extends React.Component<RadioGroupItemProps> {
	private click(e: React.MouseEvent) {
		e.stopPropagation();
		this.props.onSelect(this.props.item.id);
	}

	public render() {
		try {
			let style = 'radio-item';
			let details = null;

			if (this.props.selected) {
				style += ' selected';
				if (this.props.item.details) {
					details = (
						<div className='radio-item-details'>
							{this.props.item.details}
						</div>
					);
				}
			}

			if (this.props.item.disabled) {
				style += ' disabled';
			}

			return (
				<div className={style} onClick={e => this.click(e)}>
					<div className='radio-item-top'>
						<div className='radio-item-text'>{this.props.item.text}</div>
						<div className='radio-item-info'>{this.props.item.info}</div>
					</div>
					{details}
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}
