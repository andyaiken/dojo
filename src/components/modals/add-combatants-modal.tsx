import React from 'react';

import Utils from '../../utils/utils';

import { EncounterSlot } from '../../models/encounter';
import { Monster, MonsterGroup } from '../../models/monster-group';

import FilterCard from '../cards/filter-card';
import MonsterCard from '../cards/monster-card';
import Note from '../panels/note';
import Factory from '../../utils/factory';

interface Props {
    combatantSlots: EncounterSlot[];
    library: MonsterGroup[];
}

interface State {
    combatantSlots: EncounterSlot[];
    filter: {
        name: string,
        challengeMin: number;
        challengeMax: number;
        category: string;
        size: string;
    };
}

export default class AddCombatantsModal extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            combatantSlots: props.combatantSlots,
            filter: {
                name: '',
                challengeMin: 0,
                challengeMax: 5,
                category: 'all types',
                size: 'all sizes'
            }
        };
    }

    private changeFilterValue(type: 'name' | 'challengeMin' | 'challengeMax' | 'category' | 'size', value: any) {
        // eslint-disable-next-line
        this.state.filter[type] = value;
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
            filter: {
                name: '',
                challengeMin: 0,
                challengeMax: 5,
                category: 'all types',
                size: 'all sizes'
            }
        });
    }

    private matchMonster(monster: Monster) {
        if (monster.challenge < this.state.filter.challengeMin) {
            return false;
        }

        if (monster.challenge > this.state.filter.challengeMax) {
            return false;
        }

        if (this.state.filter.name !== '') {
            if (!Utils.match(this.state.filter.name, monster.name)) {
                return false;
            }
        }

        if (this.state.filter.category !== 'all types') {
            if (monster.category !== this.state.filter.category) {
                return false;
            }
        }

        if (this.state.filter.size !== 'all sizes') {
            if (monster.size !== this.state.filter.size) {
                return false;
            }
        }

        return true;
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
                    <MonsterCard key={m.id} combatant={m} mode='view candidate' selectMonster={monster => this.selectMonster(monster)} />
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
                                combatant={monster}
                                slot={slot}
                                mode='view candidate selected'
                                deselectMonster={monster => this.deselectMonster(monster)}
                                nudgeValue={(source, field, delta) => this.nudgeMonsterCount(slot, delta)}
                            />
                        );
                    }
                }
                return null;
            });

            return (
                <div className='add-combatants-modal'>
                    <div className='row' style={{ height: '100%' }}>
                        <div className='columns small-6 medium-6 large-6 scrollable'>
                            <div className='heading'>all combatants</div>
                            <FilterCard
                                filter={this.state.filter}
                                changeValue={(type, value) => this.changeFilterValue(type, value)}
                                nudgeValue={(type, delta) => this.nudgeFilterValue(type, delta)}
                                resetFilter={() => this.resetFilter()}
                            />
                            <div className='divider' />
                            {allCombatants}
                        </div>
                        <div className='columns small-6 medium-6 large-6 scrollable'>
                            <div className='heading'>selected combatants</div>
                            {selectedCombatants}
                        </div>
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}
