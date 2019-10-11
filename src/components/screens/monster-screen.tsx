import React from 'react';

import { Monster, MonsterGroup } from '../../models/monster-group';

import MonsterCard from '../cards/monster-card';
import ConfirmButton from '../controls/confirm-button';
import CardGroup from '../panels/card-group';
import Note from '../panels/note';

interface Props {
    monsterGroup: MonsterGroup;
    library: MonsterGroup[];
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

export default class MonsterScreen extends React.Component<Props> {
    public render() {
        try {
            const cards: JSX.Element[] = [];

            if (this.props.monsterGroup.monsters.length !== 0) {
                this.props.monsterGroup.monsters.forEach(m => {
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

            return (
                <div className='screen row collapse'>
                    <div className='columns small-4 medium-4 large-3 scrollable list-column'>
                        <MonsterInfo
                            monsterGroup={this.props.monsterGroup}
                            addMonster={() => this.props.addMonster()}
                            sortMonsters={() => this.props.sortMonsters()}
                            changeValue={(type, value) => this.props.changeValue(this.props.monsterGroup, type, value)}
                            removeMonsterGroup={() => this.props.removeMonsterGroup()}
                        />
                    </div>
                    <div className='columns small-8 medium-8 large-9 scrollable'>
                        <CardGroup
                            content={cards}
                            heading={this.props.monsterGroup.name || 'unnamed group'}
                        />
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}

interface MonsterInfoProps {
    monsterGroup: MonsterGroup;
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
                            value={this.props.monsterGroup.name}
                            onChange={event => this.props.changeValue('name', event.target.value)}
                        />
                    </div>
                    <div className='divider' />
                    <div className='section'>
                        <button onClick={() => this.props.addMonster()}>add a new monster</button>
                        <button onClick={() => this.props.sortMonsters()}>sort monsters</button>
                        <ConfirmButton text='delete group' callback={() => this.props.removeMonsterGroup()} />
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
