import React from 'react';

import Utils from '../../utils/utils';

import { Monster, MonsterGroup } from '../../models/monster-group';

import FilterCard from '../cards/filter-card';
import MonsterCard from '../cards/monster-card';
import Note from '../panels/note';

interface Props {
    combatants: Monster[];
    library: MonsterGroup[];
}

interface State {
    combatants: Monster[];
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
            combatants: props.combatants,
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
        this.state.combatants.push(monster);
        this.state.combatants.sort((a, b) => {
            if (a.name < b.name) { return -1; }
            if (a.name > b.name) { return 1; }
            return 0;
        });
        this.setState({
            combatants: this.state.combatants
        });
    }

    private deselectMonster(monster: Monster) {
        const index = this.state.combatants.indexOf(monster);
        this.state.combatants.splice(index, 1);
        this.setState({
            combatants: this.state.combatants
        });
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
            let allCombatants: JSX.Element | JSX.Element[] = monsters.filter(m => !this.state.combatants.includes(m)).map(m => {
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

            const selectedCombatants: JSX.Element | JSX.Element[] = this.state.combatants.map(c => {
                return (
                    <MonsterCard key={c.id} combatant={c} mode='view candidate selected' deselectMonster={monster => this.deselectMonster(monster)} />
                );
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
