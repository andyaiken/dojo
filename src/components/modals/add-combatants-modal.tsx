import React from 'react';

import { Col, Row } from 'antd';

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

    private changeFilterValue(type: 'name' | 'challenge' | 'category' | 'size', value: any) {
        const filter = this.state.filter as any;
        if (type === 'challenge') {
            filter['challengeMin'] = value[0];
            filter['challengeMax'] = value[1];
        } else {
            filter[type] = value;
        }
        this.setState({
            filter: filter
        });
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
                    <Note>
                        <div className='section'>
                            there are no monsters that match the above criteria (or you have already selected them all)
                        </div>
                    </Note>
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
                <Row className='full-height'>
                    <Col span={12} className='scrollable'>
                        <div className='heading'>monsters in library</div>
                        <FilterPanel
                            filter={this.state.filter}
                            changeValue={(type, value) => this.changeFilterValue(type, value)}
                            resetFilter={() => this.resetFilter()}
                        />
                        <div className='divider' />
                        {allCombatants}
                    </Col>
                    <Col span={12} className='scrollable'>
                        <div className='heading'>selected monsters</div>
                        {selectedCombatants}
                    </Col>
                </Row>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
