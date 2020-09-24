import { PlusCircleOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import React from 'react';

import { Gygax } from '../../utils/gygax';
import { Napoleon } from '../../utils/napoleon';

import { Encounter } from '../../models/encounter';
import { Monster, MonsterGroup } from '../../models/monster';

import { ConfirmButton } from '../controls/confirm-button';
import { Dropdown } from '../controls/dropdown';
import { Expander } from '../controls/expander';
import { Textbox } from '../controls/textbox';
import { PortraitPanel } from '../panels/portrait-panel';

interface Props {
	monster: Monster;
	mode: 'editable' | 'candidate';
	library: MonsterGroup[];
	encounters: Encounter[];
	// Library
	viewMonster: (monster: Monster) => void;
	editMonster: (monster: Monster) => void;
	removeMonster: (monster: Monster) => void;
	exportMonster: (monster: Monster) => void;
	cloneMonster: (monster: Monster, name: string) => void;
	moveToGroup: (monster: Monster, group: string) => void;
	selectMonster: (monster: Monster) => void;
}

interface State {
	cloneName: string;
}

export class MonsterCard extends React.Component<Props, State> {
	public static defaultProps = {
		mode: 'editable',
		library: null,
		encounters: null,
		viewMonster: null,
		editMonster: null,
		removeMonster: null,
		exportMonster: null,
		cloneMonster: null,
		moveToGroup: null,
		selectMonster: null
	};

	constructor(props: Props) {
		super(props);
		this.state = {
			cloneName: props.monster.name + ' copy'
		};
	}

	private setCloneName(cloneName: string) {
		this.setState({
			cloneName: cloneName
		});
	}

	private getTags() {
		const tags = [];

		let sizeAndType = (this.props.monster.size + ' ' + this.props.monster.category).toLowerCase();
		if (this.props.monster.tag) {
			sizeAndType += ' (' + this.props.monster.tag.toLowerCase() + ')';
		}
		tags.push(<Tag key='tag-main'>{sizeAndType}</Tag>);

		if (this.props.monster.alignment) {
			tags.push(<Tag key='tag-align'>{this.props.monster.alignment.toLowerCase()}</Tag>);
		}

		tags.push(<Tag key='tag-cr'>cr {Gygax.challenge(this.props.monster.challenge)}</Tag>);

		return tags;
	}

	private getButtons() {
		if (this.props.mode === 'editable') {
			const groupOptions: { id: string, text: string }[] = [];
			this.props.library.forEach(group => {
				if (group.monsters.indexOf(this.props.monster) === -1) {
					groupOptions.push({
						id: group.id,
						text: group.name
					});
				}
			});

			const inUse = this.props.encounters.some(enc => Napoleon.encounterHasMonster(enc, this.props.monster.id));

			return (
				<div>
					<hr/>
					<button onClick={() => this.props.viewMonster(this.props.monster)}>statblock</button>
					<button onClick={() => this.props.editMonster(this.props.monster)}>edit monster</button>
					<button onClick={() => this.props.exportMonster(this.props.monster)}>export monster</button>
					<Expander text='copy monster'>
						<Textbox
							text={this.state.cloneName}
							placeholder='monster name'
							onChange={value => this.setCloneName(value)}
						/>
						<button onClick={() => this.props.cloneMonster(this.props.monster, this.state.cloneName)}>create copy</button>
					</Expander>
					<Dropdown
						options={groupOptions}
						placeholder='move to group...'
						onSelect={optionID => this.props.moveToGroup(this.props.monster, optionID)}
					/>
					<ConfirmButton text='delete monster' disabled={inUse} onConfirm={() => this.props.removeMonster(this.props.monster)} />
				</div>
			);
		}

		return null;
	}

	private getIcon() {
		if (this.props.mode === 'candidate') {
			return (
				<PlusCircleOutlined onClick={() => this.props.selectMonster(this.props.monster)} />
			);
		}

		return null;
	}

	public render() {
		try {
			const name = this.props.monster.name || 'unnamed monster';

			return (
				<div className='card monster'>
					<div className='heading'>
						<div className='title' title={name}>
							{name}
						</div>
						{this.getIcon()}
					</div>
					<div className='card-content'>
						<PortraitPanel source={this.props.monster} />
						<div className='section centered'>
							{this.getTags()}
						</div>
						{this.getButtons()}
					</div>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
