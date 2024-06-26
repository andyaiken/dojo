import React from 'react';

import { Matisse } from '../../utils/matisse';

import { Combatant } from '../../models/combat';
import { Options } from '../../models/misc';
import { Monster } from '../../models/monster';
import { PC } from '../../models/party';

import { RenderError } from '../error';
import { MonsterStatblockCard } from '../cards/monster-statblock-card';
import { PCStatblockCard } from '../cards/pc-statblock-card';

interface Props {
	source: PC | Monster | (Combatant & PC) | (Combatant & Monster) | null;
	options: Options;
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
					content = <PCStatblockCard pc={this.props.source as PC} />;
					break;
				case 'monster':
					content = <MonsterStatblockCard monster={this.props.source as Monster} />;
					break;
			}

			let tools = null;
			if (this.props.source.type === 'monster') {
				tools = (
					<div>
						<button onClick={() => Matisse.takeScreenshot('statblock')}>export statblock image</button>
					</div>
				);
			}

			return (
				<div className='scrollable padded'>
					<div id='statblock'>
						{content}
					</div>
					{ tools !== null ? <hr/> : null }
					{tools}
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='StatBlockModal' error={e} />;
		}
	}
}
