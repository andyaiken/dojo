import React from 'react';

import { MonsterGroup } from '../../models/monster-group';

import CardGroup from '../panels/card-group';
import Note from '../panels/note';

interface Props {
    library: MonsterGroup[];
    selectMonsterGroup: (group: MonsterGroup) => void;
}

export default class MonsterListScreen extends React.Component<Props> {
    public render() {
        try {
            const listItems = this.props.library.map(group => {
                return (
                    <ListItem
                        key={group.id}
                        group={group}
                        setSelection={grp => this.props.selectMonsterGroup(grp)}
                    />
                );
            });

            return (
                <div className='screen row collapse'>
                    <div className='columns small-4 medium-4 large-3 scrollable left-column'>
                        <Note
                            content={
                                <div>
                                    <div className='section'>you can maintain your menagerie of monsters here</div>
                                    <div className='section'>you can then use these monsters to design combat encounters in the encounter builder</div>
                                    <div className='divider'/>
                                    <div className='section'>on the right you will see a list of monster groups</div>
                                    <div className='section'>select a monster group from the list to see stat blocks for monsters in that group</div>
                                    <div className='divider'/>
                                    <div className='section'>to start adding monsters, press the <b>add a new monster group</b> button</div>
                                </div>
                            }
                        />
                    </div>
                    <div className='columns small-8 medium-8 large-9 scrollable'>
                        <CardGroup heading='monster groups' content={listItems} />
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}

interface ListItemProps {
    group: MonsterGroup;
    setSelection: (group: MonsterGroup) => void;
}

class ListItem extends React.Component<ListItemProps> {
    public render() {
        try {
            const monsters = [];
            for (let n = 0; n !== this.props.group.monsters.length; ++n) {
                const monster = this.props.group.monsters[n];
                monsters.push(<div key={monster.id} className='section'>{monster.name || 'unnamed monster'}</div>);
            }
            if (monsters.length === 0) {
                monsters.push(<div key='empty' className='section'>no monsters</div>);
            }

            return (
                <div className='column'>
                    <div className='card monster'>
                        <div className='heading'>
                            <div className='title'>
                                {this.props.group.name || 'unnamed group'}
                            </div>
                        </div>
                        <div className='card-content'>
                            <div className='grid'>
                                <div className='subheading'>monsters</div>
                                {monsters}
                            </div>
                            <div className='divider'/>
                            <button onClick={() => this.props.setSelection(this.props.group)}>open</button>
                        </div>
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
