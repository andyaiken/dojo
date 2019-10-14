import React from 'react';

import Napoleon from '../../utils/napoleon';
import Utils from '../../utils/utils';

import { EncounterSlot, MonsterFilter } from '../../models/encounter';
import { Monster, MonsterGroup } from '../../models/monster-group';

import Factory from '../../utils/factory';
import MonsterCard from '../cards/monster-card';
import FilterPanel from '../panels/filter-panel';
import Note from '../panels/note';

interface Props {
    combatantSlots: EncounterSlot[];
    library: MonsterGroup[];
}

interface State {
    combatantSlots: EncounterSlot[];
    filter: MonsterFilter;
}

export default class AddCombatantsModal extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            combatantSlots: props.combatantSlots,
            filter: Factory.createMonsterFilter()
        };
    }

    private changeFilterValue(type: 'name' | 'challengeMin' | 'challengeMax' | 'category' | 'size', value: any) {
        // eslint-disable-next-line
        this.state.filter[type] = value as never;
        this.setState({
            filter: this.state.filter
        });
    }

    private nudgeFilterValue(type: 'challengeMin' | 'challengeMax', delta: number) {
        const value = Utils.nudgeChallenge(this.state.filter[type], delta);
        this.changeFilterValue(type, value);
    }

    private resetFilter() {
        this.setState({
            filter: Factory.createMonsterFilter()
        });
    }

    private matchMonster(monster: Monster) {
        return Napoleon.matchMonster(monster, this.state.filter);
    }

    private selectMonster(monster: Monster) {
        const slot = Factory.createEncounterSlot();
        slot.monsterGroupName = Utils.getMonsterGroup(monster, this.props.library).name;
        slot.monsterName = monster.name;
        this.state.combatantSlots.push(slot);
        this.state.combatantSlots.sort((a, b) => {
            if (a.monsterName < b.monsterName) { return -1; }
            if (a.monsterName > b.monsterName) { return 1; }
            return 0;
        });
        this.setState({
            combatantSlots: this.state.combatantSlots
        });
    }

    private deselectMonster(monster: Monster) {
        const group = Utils.getMonsterGroup(monster, this.props.library);
        const slot = this.state.combatantSlots.find(s => (s.monsterGroupName === group.name) && (s.monsterName === monster.name));
        if (slot) {
            const index = this.state.combatantSlots.indexOf(slot);
            this.state.combatantSlots.splice(index, 1);
            this.setState({
                combatantSlots: this.state.combatantSlots
            });
        }
    }

    private nudgeMonsterCount(slot: EncounterSlot, delta: number) {
        slot.count += delta;
        if (slot.count === 0) {
            const group = this.props.library.find(g => g.name === slot.monsterGroupName);
            if (group) {
                const monster = group.monsters.find(m => m.name === slot.monsterName);
                if (monster) {
                    this.deselectMonster(monster);
                }
            }
        } else {
            this.setState({
                combatantSlots: this.state.combatantSlots
            });
        }
    }

    public render() {
        try {
            const monsters: Monster[] = [];
            this.props.library.forEach(group => {
                group.monsters.forEach(monster => {
                    if (this.matchMonster(monster)) {
                        monsters.push(monster);
                    }
                });
            });
            monsters.sort((a, b) => {
                if (a.name < b.name) { return -1; }
                if (a.name > b.name) { return 1; }
                return 0;
            });
            const currentIDs = this.state.combatantSlots.map(slot => {
                const group = this.props.library.find(g => g.name === slot.monsterGroupName);
                if (group) {
                    const monster = group.monsters.find(m => m.name === slot.monsterName);
                    if (monster) {
                        return monster.id;
                    }
                }
                return null;
            }).filter(id => !!id);
            let allCombatants: JSX.Element | JSX.Element[] = monsters.filter(m => !currentIDs.includes(m.id)).map(m => {
                return (
                    <MonsterCard key={m.id} monster={m} mode='view candidate' selectMonster={monster => this.selectMonster(monster)} />
                );
            });
            if (allCombatants.length === 0) {
                allCombatants = (
                    <Note
                        content={(
                            <div className='section'>
                                there are no monsters that match the above criteria (or you have already selected them all)
                            </div>
                        )}
                    />
                );
            }

            const selectedCombatants: (JSX.Element | null)[] = this.state.combatantSlots.map(slot => {
                const group = this.props.library.find(g => g.name === slot.monsterGroupName);
                if (group) {
                    const monster = group.monsters.find(m => m.name === slot.monsterName);
                    if (monster) {
                        return (
                            <MonsterCard
                                key={monster.id}
                                monster={monster}
                                slot={slot}
                                mode='view candidate selected'
                                deselectMonster={m => this.deselectMonster(m)}
                                nudgeValue={(source, field, delta) => this.nudgeMonsterCount(slot, delta)}
                            />
                        );
                    }
                }
                return null;
            });

            return (
                    <div className='row' style={{ height: '100%' }}>
                        <div className='columns small-6 medium-6 large-6 scrollable'>
                            <div className='heading'>monsters in library</div>
                            <FilterPanel
                                filter={this.state.filter}
                                changeValue={(type, value) => this.changeFilterValue(type, value)}
                                nudgeValue={(type, delta) => this.nudgeFilterValue(type, delta)}
                                resetFilter={() => this.resetFilter()}
                            />
                            <div className='divider' />
                            {allCombatants}
                        </div>
                        <div className='columns small-6 medium-6 large-6 scrollable'>
                            <div className='heading'>selected monsters</div>
                            {selectedCombatants}
                        </div>
                    </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}