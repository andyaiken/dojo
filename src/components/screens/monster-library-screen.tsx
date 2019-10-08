import React from 'react';

import Utils from '../../utils/utils';

import { Monster, MonsterGroup } from '../../models/monster-group';

import MonsterCard from '../cards/monster-card';
import ConfirmButton from '../controls/confirm-button';
import MonsterGroupListItem from '../list-items/monster-group-list-item';
import CardGroup from '../panels/card-group';
import Note from '../panels/note';

interface Props {
    library: MonsterGroup[];
    selection: MonsterGroup | null;
    filter: string;
    selectMonsterGroup: (group: MonsterGroup | null) => void;
    addMonsterGroup: () => void;
    removeMonsterGroup: () => void;
    addMonster: () => void;
    removeMonster: (monster: Monster) => void;
    editMonster: (monster: Monster) => void;
    cloneMonster: (monster: Monster, name: string) => void;
    sortMonsters: () => void;
    moveToGroup: (monster: Monster, groupID: string) => void;
    changeValue: (source: any, field: string, value: any) => void;
    nudgeValue: (source: any, field: string, value: number) => void;
}

export default class MonsterLibraryScreen extends React.Component<Props> {
    private showMonsterGroup(group: MonsterGroup) {
        let result = Utils.match(this.props.filter, group.name);

        if (!result) {
            group.monsters.forEach(monster => {
                result = Utils.match(this.props.filter, monster.name) || result;
            });
        }

        return result;
    }

    public render() {
        try {
            let leftColumn = null;
            if (this.props.selection) {
                leftColumn = (
                    <div>
                        <MonsterInfo
                            selection={this.props.selection}
                            filter={this.props.filter}
                            addMonster={() => this.props.addMonster()}
                            sortMonsters={() => this.props.sortMonsters()}
                            changeValue={(type, value) => this.props.changeValue(this.props.selection, type, value)}
                            removeMonsterGroup={() => this.props.removeMonsterGroup()}
                        />
                        <div className='divider' />
                        <button onClick={() => this.props.selectMonsterGroup(null)}>&larr; back to list</button>
                    </div>
                );
            } else {
                let listItems = this.props.library.filter(group => this.showMonsterGroup(group)).map(group => {
                    return (
                        <MonsterGroupListItem
                            key={group.id}
                            group={group}
                            filter={this.props.filter}
                            selected={group === this.props.selection}
                            setSelection={grp => this.props.selectMonsterGroup(grp)}
                        />
                    );
                });
                if (listItems.length === 0) {
                    listItems = [(
                        <Note
                            key='empty'
                            content={'you do not have any monsters in your library'}
                        />
                    )];
                }

                leftColumn = (
                    <div>
                        <button onClick={() => this.props.addMonsterGroup()}>add a new monster group</button>
                        <div className='divider' />
                        {listItems}
                    </div>
                );
            }

            const cards: JSX.Element[] = [];

            if (this.props.selection) {
                const monsters = this.props.selection.monsters.filter(monster => {
                    return Utils.match(this.props.filter, monster.name);
                });

                if (monsters.length !== 0) {
                    monsters.forEach(m => {
                        cards.push(
                            <div className='column' key={m.id}>
                                <MonsterCard
                                    combatant={m}
                                    mode={'view editable'}
                                    library={this.props.library}
                                    changeValue={(source, type, value) => this.props.changeValue(source, type, value)}
                                    nudgeValue={(source, type, delta) => this.props.nudgeValue(source, type, delta)}
                                    moveToGroup={(monster, groupID) => this.props.moveToGroup(monster, groupID)}
                                    removeMonster={monster => this.props.removeMonster(monster)}
                                    editMonster={monster => this.props.editMonster(monster)}
                                    cloneMonster={(monster, monsterName) => this.props.cloneMonster(monster, monsterName)}
                                />
                            </div>
                        );
                    });
                } else {
                    cards.push(
                        <div className='column' key='empty'>
                            <Note content={<div className='section'>there are no monsters in this group</div>} />
                        </div>
                    );
                }
            }

            let name;
            if (this.props.selection) {
                name = this.props.selection.name;
                if (!name) {
                    name = 'unnamed group';
                }
            }

            let watermark;
            if (!this.props.selection) {
                watermark = (
                    <div className='vertical-center-outer'>
                        <div className='vertical-center-middle'>
                            <div className='vertical-center-inner'>
                                <HelpCard library={this.props.library} />
                            </div>
                        </div>
                    </div>
                );
            }

            return (
                <div className='monster-library row collapse'>
                    <div className='columns small-4 medium-4 large-3 scrollable list-column'>
                        {leftColumn}
                    </div>
                    <div className='columns small-8 medium-8 large-9 scrollable'>
                        <CardGroup
                            content={cards}
                            heading={name}
                            hidden={!this.props.selection}
                        />
                        {watermark}
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}

interface HelpCardProps {
    library: MonsterGroup[];
}

class HelpCard extends React.Component<HelpCardProps> {
    public render() {
        let action: JSX.Element | null = null;
        if (this.props.library.length === 0) {
            action = (
                <div className='section'>to start adding monsters, press the <b>add a new monster group</b> button</div>
            );
        } else {
            action = (
                <div>
                    <div className='section'>on the left you will see a list of monster groups</div>
                    <div className='section'>select a monster group from the list to see stat blocks for monsters in that group</div>
                </div>
            );
        }

        return (
            <Note
                content={
                    <div>
                        <div className='section'>you can maintain your menagerie of monsters here</div>
                        <div className='section'>you can then use these monsters to design combat encounters in the encounter builder</div>
                        <div className='divider'/>
                        {action}
                    </div>
                }
            />
        );
    }
}

interface MonsterInfoProps {
    selection: MonsterGroup;
    filter: string | null;
    changeValue: (field: string, value: string) => void;
    addMonster: () => void;
    sortMonsters: () => void;
    removeMonsterGroup: () => void;
}

class MonsterInfo extends React.Component<MonsterInfoProps> {
    public render() {
        try {
            return (
                <div>
                    <div className='section'>
                        <div className='subheading'>monster group name</div>
                        <input
                            type='text'
                            placeholder='monster group name'
                            value={this.props.selection.name}
                            disabled={!!this.props.filter}
                            onChange={event => this.props.changeValue('name', event.target.value)}
                        />
                    </div>
                    <div className='divider' />
                    <div className='section'>
                        <button className={this.props.filter ? 'disabled' : ''} onClick={() => this.props.addMonster()}>add a new monster</button>
                        <button className={this.props.filter ? 'disabled' : ''} onClick={() => this.props.sortMonsters()}>sort monsters</button>
                        <ConfirmButton text='delete group' callback={() => this.props.removeMonsterGroup()} />
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}
