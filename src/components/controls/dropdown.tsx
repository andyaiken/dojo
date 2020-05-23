import { CloseCircleOutlined, EllipsisOutlined } from '@ant-design/icons';
import React from 'react';

import Sherlock from '../../utils/sherlock';

import Textbox from './textbox';

interface Props {
	options: { id: string; text: string; disabled?: boolean }[];
	selectedID: string | null;
	placeholder: string;
	disabled: boolean;
	onSelect: (optionID: string) => void;
	onClear: () => void;
}

interface State {
	open: boolean;
	filterText: string;
}

export default class Dropdown extends React.Component<Props, State> {
	public static defaultProps = {
		selectedID: null,
		placeholder: 'select...',
		disabled: false,
		onClear: null
	};

	constructor(props: Props) {
		super(props);

		this.state = {
			open: false,
			filterText: ''
		};
	}

	private toggleOpen(e: React.MouseEvent) {
		e.stopPropagation();
		this.setState({
			open: !this.state.open
		});
	}

	private setFilterText(text: string) {
		this.setState({
			filterText: text
		});
	}

	private select(optionID: string) {
		this.setState({
			open: false
		});
		this.props.onSelect(optionID);
	}

	private clear(e: React.MouseEvent) {
		e.stopPropagation();
		this.props.onClear();
	}

	public render() {
		try {
			if (this.props.options.length === 0) {
				return null;
			}

			let style = this.props.disabled ? 'dropdown disabled' : 'dropdown';
			const content = [];

			let option: { id: string; text: string; disabled?: boolean } | undefined;
			if (this.props.selectedID) {
				option = this.props.options.find(o => o.id === this.props.selectedID);
			}

			const canClear = option && this.props.onClear;
			content.push(
				<div key='selection' className='dropdown-top' title={option ? option.text : this.props.placeholder}>
					<div className='item-text'>{option ? option.text : this.props.placeholder}</div>
					{canClear ? <CloseCircleOutlined onClick={e => this.clear(e)} /> : <EllipsisOutlined />}
				</div>
			);

			if (this.state.open) {
				style += ' open';

				let filter = null;
				if (this.props.options.length > 20) {
					filter = (
						<div className='dropdown-filter' onClick={e => e.stopPropagation()}>
							<Textbox
								text={this.state.filterText}
								placeholder='search this list...'
								onChange={value => this.setFilterText(value)}
							/>
						</div>
					);
				}

				const items = this.props.options.map(o => {
					if (o.text === null) {
						return <div key={o.id} className='divider' />;
					} else {
						const matches = Sherlock.match(this.state.filterText, o.text);
						if (!matches) {
							return null;
						}

						return (
							<DropdownOption
								key={o.id}
								option={o}
								selected={o.id === this.props.selectedID}
								select={optionID => this.select(optionID)}
							/>
						);
					}
				}).filter(item => !!item);

				content.push(
					<div key='options' className='dropdown-options'>
						{filter}
						{items}
					</div>
				);
			}

			return (
				<div className={style} onClick={e => this.toggleOpen(e)}>
					{content}
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}

interface DropdownOptionProps {
	option: { id: string; text: string; disabled?: boolean };
	selected: boolean;
	select: (optionID: string) => void;
}

class DropdownOption extends React.Component<DropdownOptionProps> {
	private click(e: React.MouseEvent) {
		e.stopPropagation();
		if (!this.props.option.disabled) {
			this.props.select(this.props.option.id);
		}
	}

	public render() {
		try {
			let style = 'dropdown-option';
			if (this.props.selected) {
				style += ' selected';
			}
			if (this.props.option.disabled) {
				style += ' disabled';
			}

			return (
				<div className={style} title={this.props.option.text} onClick={e => this.click(e)}>
					{this.props.option.text}
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}
