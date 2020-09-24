import React from 'react';

import { Combatant } from '../../models/combat';
import { Monster } from '../../models/monster';
import { PC } from '../../models/party';

import { MonsterStatblockCard } from '../cards/monster-statblock-card';
import { PCCard } from '../cards/pc-card';

interface Props {
	source: PC | Monster | (Combatant & PC) | (Combatant & Monster) | null;
}

export class StatBlockModal extends React.Component<Props> {
	public render() {
		try {
			if (!this.props.source) {
				return null;
			}

			let content = null;
			switch (this.props.source.type) {
				case 'pc':
					content = <PCCard pc={this.props.source as PC} />;
					break;
				case 'monster':
					content = <MonsterStatblockCard monster={this.props.source as Monster} />;
					break;
			}

			return (
				<div className='scrollable padded'>
					{content}
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}
