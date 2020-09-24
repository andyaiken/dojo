import React from 'react';

import { Comms, CommsDM } from '../../../utils/uhura';

import { Monster } from '../../../models/monster';

import { MonsterStatblockCard } from '../../cards/monster-statblock-card';
import { Checkbox } from '../../controls/checkbox';
import { Dropdown } from '../../controls/dropdown';
import { Popout } from '../../panels/popout';

interface Props {
	selectedMonsterID: string | null;
	monsters: Monster[];
	selectMonsterID: (id: string | null) => void;
}

interface State {
	playerViewOpen: boolean;
}

export class MonsterReference extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			playerViewOpen: false
		};
	}

	private setPlayerViewOpen(open: boolean) {
		this.setState({
			playerViewOpen: open
		});
	}

	private clear() {
		if (Comms.data.shared.type === 'monster') {
			CommsDM.shareNothing();
		}

		this.setState({
			playerViewOpen: false
		}, () => {
			this.props.selectMonsterID(null);
		});
	}

	private getPlayerView() {
		const monster = this.props.monsters.find(m => m.id === this.props.selectedMonsterID);
		if (this.state.playerViewOpen && monster) {
			return (
				<Popout title='Monster' onCloseWindow={() => this.setPlayerViewOpen(false)}>
					<div className='scrollable'>
						<MonsterStatblockCard monster={monster} />
					</div>
				</Popout>
			);
		}

		return null;
	}

	public render() {
		try {
			const monster = this.props.monsters.find(m => m.id === this.props.selectedMonsterID);

			let statblock = null;
			if (monster) {
				statblock = (
					<div>
						<Checkbox
							label='share in player view'
							checked={this.state.playerViewOpen}
							onChecked={value => this.setPlayerViewOpen(value)}
						/>
						<Checkbox
							label='share in session'
							disabled={CommsDM.getState() !== 'started'}
							checked={Comms.data.shared.type === 'monster'}
							onChecked={value => value ? CommsDM.shareMonster(monster) : CommsDM.shareNothing()}
						/>
						<hr/>
						<MonsterStatblockCard monster={monster} />
					</div>
				);
			}

			return (
				<div>
					<Dropdown
						options={this.props.monsters.map(p => ({ id: p.id, text: p.name }))}
						placeholder='select a monster...'
						selectedID={this.props.selectedMonsterID}
						onSelect={id => this.props.selectMonsterID(id)}
						onClear={() => this.clear()}
					/>
					{statblock}
					{this.getPlayerView()}
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}
