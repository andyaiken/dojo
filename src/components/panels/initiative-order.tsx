import React from 'react';

import { Napoleon } from '../../utils/napoleon';

import { Combat, Combatant } from '../../models/combat';

import { InitiativeEntry } from './initiative-entry';

interface Props {
	combat: Combat;
	playerView: boolean;
	selectedText: string;
	showDefeated: boolean;
	help: JSX.Element | null;
	selectedItemIDs: string[];
	toggleItemSelection: (id: string, ctrl: boolean) => void;
}

export class InitiativeOrder extends React.Component<Props> {
	private orderCombatants(list: Combatant[]) {
		const current = list.find(c => c.current);
		if (current) {
			const index = list.indexOf(current);
			if (index !== 0) {
				const all: (Combatant | string)[] = [...list];
				const first = all.splice(index);
				return first.concat(['top of the round']).concat(all);
			}
		}

		return list;
	}

	private createCombatantRow(combatant: Combatant | string) {
		if (typeof combatant === 'string') {
			return (
				<div key={combatant} className='section init-separator'>{combatant}</div>
			);
		}

		let selected = this.props.selectedItemIDs.includes(combatant.id);
		// If we're in player view, and there's no map, don't show selection
		if (this.props.playerView && !this.props.combat.map) {
			selected = false;
		}

		return (
			<InitiativeEntry
				key={combatant.id}
				combatant={combatant}
				playerView={this.props.playerView}
				selectedText={this.props.selectedText}
				combat={this.props.combat}
				selected={selected}
				select={(c, ctrl) => this.props.toggleItemSelection(c.id, ctrl)}
			/>
		);
	}

	public render() {
		const combatants = Napoleon.getActiveCombatants(this.props.combat, this.props.playerView, this.props.showDefeated);
		const rows = this.orderCombatants(combatants)
			.map(c => this.createCombatantRow(c));

		return (
			<div>
				{this.props.help}
				{rows}
			</div>
		);
	}
}
