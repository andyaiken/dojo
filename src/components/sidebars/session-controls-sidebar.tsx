import React from 'react';

import { Factory } from '../../utils/factory';
import { Gygax } from '../../utils/gygax';
import { Mercator } from '../../utils/mercator';
import { Napoleon } from '../../utils/napoleon';
import { Comms, CommsPlayer } from '../../utils/uhura';
import { Utils } from '../../utils/utils';

import { Combat, Combatant } from '../../models/combat';
import { Condition } from '../../models/condition';
import { Exploration, Map } from '../../models/map';
import { Options } from '../../models/misc';

import { Note } from '../controls/note';
import { CombatControlsPanel } from '../panels/combat-controls-panel';

interface Props {
	options: Options;
	addCondition: (combatants: Combatant[], allCombatants: Combatant[]) => void;
	editCondition: (combatant: Combatant, condition: Condition, allCombatants: Combatant[]) => void;
	toggleAddingToMap: () => void;
	onUpdated: () => void;
}

export class SessionControlsSidebar extends React.Component<Props> {
	private getContent() {
		if (CommsPlayer.getState() === 'connected') {
			if (Comms.data.options.allowControls) {
				let allCombatants: Combatant[] = [];
				let map: Map | null = null;
				let lighting: 'bright light' | 'dim light' | 'darkness' = 'bright light';

				if (Comms.data.shared.type === 'combat') {
					const combat = Comms.data.shared.data as Combat;
					allCombatants = combat.combatants;
					map = combat.map;
					lighting = combat.lighting;
				}
				if (Comms.data.shared.type === 'exploration') {
					const exploration = Comms.data.shared.data as Exploration;
					allCombatants = exploration.combatants;
					map = exploration.map;
					lighting = exploration.lighting;
				}

				const characterID = Comms.getCharacterID(Comms.getID());
				const current = allCombatants.find(c => c.id === characterID);
				if (!current) {
					return (
						<Note>
							<div className='section'>
								when you choose your character, you will be able to control it here
							</div>
						</Note>
					);
				}

				return (
					<CombatControlsPanel
						combatants={[current]}
						allCombatants={allCombatants}
						map={map}
						options={this.props.options}
						lighting={lighting}
						showTabs={false}
						// Main tab
						toggleTag={(combatants, tag) => {
							combatants.forEach(c => {
								if (c.tags.includes(tag)) {
									c.tags = c.tags.filter(t => t !== tag);
								} else {
									c.tags.push(tag);
								}
							});
							CommsPlayer.sendSharedUpdate();
							this.props.onUpdated();
						}}
						toggleCondition={(combatants, condition) => {
							combatants.forEach(c => {
								if (c.conditions.some(cnd => cnd.name === condition)) {
									c.conditions = c.conditions.filter(cnd => cnd.name !== condition);
								} else {
									const cnd = Factory.createCondition();
									cnd.name = condition;
									c.conditions.push(cnd);

									c.conditions = Utils.sort(c.conditions, [{ field: 'name', dir: 'asc' }]);
								}
							});
							CommsPlayer.sendSharedUpdate();
							this.props.onUpdated();
						}}
						toggleHidden={combatants => {
							combatants.forEach(c => c.showOnMap = !c.showOnMap);
							CommsPlayer.sendSharedUpdate();
							this.props.onUpdated();
						}}
						// Cond tab
						addCondition={combatants => this.props.addCondition(combatants, allCombatants)}
						editCondition={(combatant, condition) => this.props.editCondition(combatant, condition, allCombatants)}
						deleteCondition={(combatant, condition) => {
							combatant.conditions = combatant.conditions.filter(cnd => cnd.name !== condition.name);
							CommsPlayer.sendSharedUpdate();
							this.props.onUpdated();
						}}
						// Map tab
						mapAdd={() => this.props.toggleAddingToMap()}
						mapMove={(combatants, dir, step) => {
							const ids = combatants.map(c => c.id);
							Mercator.moveCombatants(ids, dir, allCombatants, map as Map, step);
							CommsPlayer.sendSharedUpdate();
							this.props.onUpdated();
						}}
						mapRemove={combatants => {
							const ids = combatants.map(c => c.id);
							const list = Napoleon.getMountsAndRiders(ids, allCombatants).map(c => c.id);
							ids.forEach(id => {
								if (!list.includes(id)) {
									list.push(id);
								}
							});
							list.forEach(id => Mercator.remove(map as Map, id));
							CommsPlayer.sendSharedUpdate();
							this.props.onUpdated();
						}}
						undoStep={combatant => {
							if (combatant.path && (combatant.path.length > 0)) {
								const item = (map as Map).items.find(i => i.id === combatant.id);
								if (item) {
									combatant.path = combatant.path.filter(p => !!p);
									const prev = combatant.path.pop();
									if (prev) {
										item.x = prev.x;
										item.y = prev.y;
										item.z = prev.z;
									}
									CommsPlayer.sendSharedUpdate();
									this.props.onUpdated();
								}
							}
						}}
						// Adv tab
						addCompanion={companion => {
							allCombatants.push(Napoleon.convertCompanionToCombatant(companion));
							Utils.sort(allCombatants, [{ field: 'displayName', dir: 'asc' }]);
							CommsPlayer.sendSharedUpdate();
							this.props.onUpdated();
						}}
						// General
						changeValue={(source, field, value) => {
							source[field] = value;
							CommsPlayer.sendSharedUpdate();
							this.props.onUpdated();
						}}
						nudgeValue={(source, field, delta) => {
							let value = null;
							switch (field) {
								case 'displaySize':
									value = Gygax.nudgeSize(source.displaySize, delta);
									break;
								default:
									value = source[field] + delta;
									break;
							}
							source[field] = value;
							if (Comms.data.shared.type === 'combat') {
								const combat = Comms.data.shared.data as Combat;
								Napoleon.sortCombatants(combat);
							}
							CommsPlayer.sendSharedUpdate();
							this.props.onUpdated();
						}}
					/>
				);
			} else {
				return (
					<Note>
						<div className='section'>
							you haven't been given control of your character
						</div>
					</Note>
				);
			}
		}

		return (
			<Note>
				<div className='section'>
					you're not connected
				</div>
			</Note>
		);
	}

	public render() {
		return (
			<div className='sidebar-container'>
				<div className='sidebar-header'>
					<div className='heading'>controls</div>
				</div>
				<div className='sidebar-content'>
					{this.getContent()}
				</div>
			</div>
		);
	}
}
