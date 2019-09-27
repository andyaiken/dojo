import React from 'react';

import Frankenstein from '../../utils/frankenstein';
import Utils from '../../utils/utils';

import { Monster, MonsterGroup } from '../../models/monster-group';

import MonsterCard from '../cards/monster-card';
import FilterPanel from '../panels/filter-panel';
import Note from '../panels/note';

interface Props {
    monster: Monster;
    library: MonsterGroup[];
}

interface State {
    monster: Monster;
    filter: {
        name: string,
        challengeMin: number;
        challengeMax: number;
        category: string;
        size: string;
    };
    selectedMonsters: Monster[];
}

export default class RandomMonsterModal extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            monster: this.props.monster,
            filter: {
                name: '',
                challengeMin: 0,
                challengeMax: 5,
                category: 'all types',
                size: 'all sizes'
            },
            selectedMonsters: []
        };
    }

    private generateMonster() {
        Frankenstein.spliceMonsters(this.state.monster, this.state.selectedMonsters);
        this.setState({
            monster: this.state.monster
        });
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
        this.state.selectedMonsters.push(monster);
        this.state.selectedMonsters.sort((a, b) => {
            if (a.name < b.name) { return -1; }
            if (a.name > b.name) { return 1; }
            return 0;
        });
        this.setState({
            selectedMonsters: this.state.selectedMonsters
        });
    }

    private deselectMonster(monster: Monster) {
        const index = this.state.selectedMonsters.indexOf(monster);
        this.state.selectedMonsters.splice(index, 1);
        this.setState({
            selectedMonsters: this.state.selectedMonsters
        });
    }

    private selectAll() {
        this.props.library.forEach(group => {
            group.monsters.forEach(monster => {
                if (this.matchMonster(monster)) {
                    this.state.selectedMonsters.push(monster);
                }
            });
        });
        this.state.selectedMonsters.sort((a, b) => {
            if (a.name < b.name) { return -1; }
            if (a.name > b.name) { return 1; }
            return 0;
        });
        this.setState({
            selectedMonsters: this.state.selectedMonsters
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
            let allMonsters: JSX.Element | JSX.Element[] = monsters.filter(m => !this.state.selectedMonsters.includes(m)).map(m => {
                return (
                    <MonsterCard key={m.id} combatant={m} mode='view candidate' selectMonster={monster => this.selectMonster(monster)} />
                );
            });
            if (allMonsters.length === 0) {
                allMonsters = (
                    <Note
                        content={(
                            <div className='section'>
                                there are no monsters that match the above criteria (or you have already selected them all)
                            </div>
                        )}
                    />
                );
            }

            const selectedMonsters: JSX.Element | JSX.Element[] = this.state.selectedMonsters.map(m => {
                return (
                    <MonsterCard key={m.id} combatant={m} mode='view candidate selected' deselectMonster={monster => this.deselectMonster(monster)} />
                );
            });
            let selectedMonstersInfo = null;
            if (selectedMonsters.length < 2) {
                selectedMonstersInfo = (
                    <Note
                        content={(
                            <div>
                                <div className='section'>
                                    in order to generate a random monster, select at least two source monsters from the list on the left
                                </div>
                                <button onClick={() => this.selectAll()}>select all monsters</button>
                            </div>
                        )}
                    />
                );
            }

            return (
                <div className='random-monster-modal'>
                    <div className='row' style={{ height: '100%' }}>
                        <div className='columns small-4 medium-4 large-4 scrollable'>
                            <div className='heading'>all monsters</div>
                            <FilterPanel
                                filter={this.state.filter}
                                changeValue={(type, value) => this.changeFilterValue(type, value)}
                                nudgeValue={(type, delta) => this.nudgeFilterValue(type, delta)}
                                resetFilter={() => this.resetFilter()}
                            />
                            <div className='divider' />
                            {allMonsters}
                        </div>
                        <div className='columns small-4 medium-4 large-4 scrollable'>
                            <div className='heading'>selected monsters</div>
                            <button
                                className={this.state.selectedMonsters.length < 2 ? 'disabled' : ''}
                                onClick={() => this.generateMonster()}
                            >
                                randomly generate monster
                            </button>
                            <div className='divider' />
                            {selectedMonstersInfo}
                            {selectedMonsters}
                        </div>
                        <div className='columns small-4 medium-4 large-4 scrollable'>
                            <div className='heading'>output</div>
                            <MonsterCard
                                combatant={this.state.monster}
                                mode='view generated'
                            />
                        </div>
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}
