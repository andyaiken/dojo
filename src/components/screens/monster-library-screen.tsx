import React from 'react';

import * as utils from '../../utils';

import { MonsterGroup, Monster } from '../../models/models';

import MonsterLibraryCard from '../cards/information/monster-library-card';
import MonsterGroupListItem from '../list-items/monster-group-list-item';
import MonsterGroupCard from '../cards/monster-group-card';
import MonsterCard from '../cards/monster-card';
import InfoCard from '../cards/info-card';
import CardGroup from '../panels/card-group';

interface Props {
    library: MonsterGroup[];
    selection: MonsterGroup | null;
    showHelp: boolean;
    filter: string;
    selectMonsterGroup: (group: MonsterGroup | null) => void;
    addMonsterGroup: (name: string) => void;
    removeMonsterGroup: () => void;
    addMonster: (name: string) => void;
    removeMonster: (monster: Monster) => void;
    editMonster: (monster: Monster) => void;
    cloneMonster: (monster: Monster, name: string) => void;
    sortMonsters: () => void;
    moveToGroup: (monster: Monster, groupID: string) => void;
    changeValue: (source: any, field: string, value: any) => void;
    nudgeValue: (source: any, field: string, value: number) => void;
}

export default class MonsterLibraryScreen extends React.Component<Props> {
    showMonsterGroup(group: MonsterGroup) {
        var result = utils.match(this.props.filter, group.name);

        if (!result) {
            group.monsters.forEach(monster => {
                result = utils.match(this.props.filter, monster.name) || result;
            });
        }

        return result;
    }

    render() {
        try {
            var help = null;
            if (this.props.showHelp) {
                help = (
                    <MonsterLibraryCard />
                );
            }
            
            var listItems = [];
            for (var n = 0; n !== this.props.library.length; ++n) {
                var group = this.props.library[n];
                if (this.showMonsterGroup(group)) {
                    listItems.push(
                        <MonsterGroupListItem
                            key={group.id}
                            group={group}
                            filter={this.props.filter}
                            selected={group === this.props.selection}
                            setSelection={group => this.props.selectMonsterGroup(group)}
                        />
                    );
                }
            };

            var cards = [];

            if (this.props.selection) {
                cards.push(
                    <div className="column" key="info">
                        <MonsterGroupCard
                            selection={this.props.selection}
                            filter={this.props.filter}
                            addMonster={name => this.props.addMonster(name)}
                            sortMonsters={() => this.props.sortMonsters()}
                            changeValue={(type, value) => this.props.changeValue(this.props.selection, type, value)}
                            removeMonsterGroup={() => this.props.removeMonsterGroup()}
                        />
                    </div>
                );

                var monsters = this.props.selection.monsters.filter(monster => {
                    return utils.match(this.props.filter, monster.name);
                });

                if (monsters.length !== 0) {
                    monsters.forEach(monster => {
                        cards.push(
                            <div className="column" key={monster.id}>
                                <MonsterCard
                                    combatant={monster}
                                    mode={"view editable"}
                                    library={this.props.library}
                                    changeValue={(monster, type, value) => this.props.changeValue(monster, type, value)}
                                    nudgeValue={(monster, type, delta) => this.props.nudgeValue(monster, type, delta)}
                                    moveToGroup={(monster, groupID) => this.props.moveToGroup(monster, groupID)}
                                    removeMonster={monster => this.props.removeMonster(monster)}
                                    editMonster={monster => this.props.editMonster(monster)}
                                    cloneMonster={(monster, name) => this.props.cloneMonster(monster, name)}
                                />
                            </div>
                        );
                    });
                } else {
                    cards.push(
                        <div className="column" key="empty">
                            <InfoCard getContent={() => <div className="section">no monsters</div>} />
                        </div>
                    );
                }
            }

            var name = undefined;
            if (this.props.selection) {
                name = this.props.selection.name;
                if (!name) {
                    name = "unnamed group";
                }
            }

            return (
                <div className="monster-library row collapse">
                    <div className="columns small-4 medium-4 large-3 scrollable list-column">
                        {help}
                        <button onClick={() => this.props.addMonsterGroup("new group")}>add a new monster group</button>
                        {listItems}
                    </div>
                    <div className="columns small-8 medium-8 large-9 scrollable">
                        <CardGroup
                            content={cards}
                            heading={name}
                            showClose={this.props.selection !== null}
                            close={() => this.props.selectMonsterGroup(null)}
                        />
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}