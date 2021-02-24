import React from 'react';

import { Combat, Combatant } from '../../models/combat';
import { Monster } from '../../models/monster';
import { PC } from '../../models/party';

import { RenderError } from '../error';
import { CombatOptions } from '../options/combat-options';
import { MapPanel } from '../panels/map-panel';
import { PortraitPanel } from '../panels/portrait-panel';

interface Props {
	combat: Combat;
	resumeCombat: (combat: Combat) => void;
	deleteCombat: (combat: Combat) => void;
	openStatBlock: (combatant: Combatant) => void;
}

export class CombatCard extends React.Component<Props> {
	private getValue(combatant: Combatant) {
		switch (combatant.type) {
			case 'pc':
				return <div className='value'>pc</div>;
			case 'monster':
				const current = combatant.hpCurrent ?? 0;
				const max = combatant.hpMax ?? 0;
				const temp = combatant.hpTemp ?? 0;
				let str = current.toString();
				if (temp > 0) {
					str += '+' + temp;
				}
				if (current < max) {
					str += ' / ' + max;
				}
				return <div className='value'>{str} hp</div>;
		}

		return null;
	}

	public render() {
		try {
			let map = null;
			if (this.props.combat.map) {
				map = (
					<div className='section'>
						<MapPanel
							map={this.props.combat.map}
							fog={this.props.combat.fog}
							combatants={this.props.combat.combatants}
						/>
					</div>
				);
			}

			const list = this.props.combat.combatants
				.filter(c => c.active)
				.filter(c => c.type !== 'placeholder')
				.map(c => (
					<div key={c.id} className='combatant-row' onClick={() => this.props.openStatBlock(c)} role='button'>
						<PortraitPanel source={c as (Combatant & PC) | (Combatant & Monster)} inline={true}/>
						<div className='name'>{c.displayName}</div>
						{this.getValue(c)}
					</div>
				));

			return (
				<div className='card encounter'>
					<div className='heading'>
						<div className='title'>
							{this.props.combat.name || 'unnamed combat'}
						</div>
					</div>
					<div className='card-content'>
						<div className='fixed-height'>
							<div className='section'>paused at round {this.props.combat.round}</div>
							{map}
							<div className='subheading'>initiative order</div>
							{list}
						</div>
						<hr/>
						<CombatOptions
							combat={this.props.combat}
							resumeCombat={combat => this.props.resumeCombat(combat)}
							deleteCombat={combat => this.props.deleteCombat(combat)}
						/>
					</div>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='CombatCard' error={e} />;
		}
	}
}
