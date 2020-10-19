import React from 'react';

import { Comms, CommsDM } from '../../../utils/uhura';

import { Monster } from '../../../models/monster';

import { MonsterStatblockCard } from '../../cards/monster-statblock-card';
import { Checkbox } from '../../controls/checkbox';
import { Popout } from '../../panels/popout';

interface Props {
	monster: Monster | null;
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

	private getPlayerView() {
		if (this.state.playerViewOpen && this.props.monster) {
			return (
				<Popout title='Monster' onCloseWindow={() => this.setPlayerViewOpen(false)}>
					<div className='scrollable'>
						<MonsterStatblockCard monster={this.props.monster} />
					</div>
				</Popout>
			);
		}

		return null;
	}

	public render() {
		try {
			let statblock = null;
			if (this.props.monster) {
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
							onChecked={value => value ? CommsDM.shareMonster(this.props.monster as Monster) : CommsDM.shareNothing()}
						/>
						<hr/>
						<MonsterStatblockCard monster={this.props.monster} />
					</div>
				);
			}

			return (
				<div>
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
