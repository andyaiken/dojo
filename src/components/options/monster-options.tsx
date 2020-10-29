import React from 'react';

import { Napoleon } from '../../utils/napoleon';
import { Utils } from '../../utils/utils';

import { Encounter } from '../../models/encounter';
import { Monster, MonsterGroup } from '../../models/monster';

import { ConfirmButton } from '../controls/confirm-button';
import { Dropdown } from '../controls/dropdown';
import { Expander } from '../controls/expander';
import { Textbox } from '../controls/textbox';

interface Props {
	monster: Monster;
	library: MonsterGroup[];
	encounters: Encounter[];
	viewMonster: (monster: Monster) => void;
	editMonster: (monster: Monster) => void;
	deleteMonster: (monster: Monster) => void;
	cloneMonster: (monster: Monster, name: string) => void;
	moveToGroup: (monster: Monster, groupID: string) => void;
}

interface State {
	cloneName: string;
}

export class MonsterOptions extends React.Component<Props, State> {
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

	private export() {
		const filename = this.props.monster.name + '.monster';
		Utils.saveFile(filename, this.props.monster);
	}

	public render() {
		try {
			const groupOptions: { id: string, text: string }[] = [];
			this.props.library.forEach(group => {
				if (group.monsters.indexOf(this.props.monster) === -1) {
					groupOptions.push({
						id: group.id,
						text: group.name || 'unnamed group'
					});
				}
			});

			return (
				<div>
					<button onClick={() => this.props.viewMonster(this.props.monster)}>statblock</button>
					<button onClick={() => this.props.editMonster(this.props.monster)}>edit monster</button>
					<button onClick={() => this.export()}>export monster</button>
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
					<ConfirmButton
						text='delete monster'
						disabled={this.props.encounters.some(enc => Napoleon.encounterHasMonster(enc, this.props.monster.id))}
						onConfirm={() => this.props.deleteMonster(this.props.monster)}
					/>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
