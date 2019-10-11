import React from 'react';

import { MonsterGroup } from '../../models/monster-group';

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
            if (listItems.length === 0) {
                listItems.push(
                    <Note
                        key='empty'
                        content={'you do not have any monsters in your library'}
                    />
                );
            }

            return (
                <div className='screen row collapse'>
                    <div className='columns small-4 medium-4 large-3 scrollable list-column'>
                        {listItems}
                    </div>
                    <div className='columns small-8 medium-8 large-9 scrollable'>
                        <div className='vertical-center-outer'>
                            <div className='vertical-center-middle'>
                                <div className='vertical-center-inner'>
                                    <HelpCard library={this.props.library} />
                                </div>
                            </div>
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

interface HelpCardProps {
    library: MonsterGroup[];
}

class HelpCard extends React.Component<HelpCardProps> {
    public render() {
        try {
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
        } catch (ex) {
            console.error(ex);
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
                <div className='list-item' onClick={() => this.props.setSelection(this.props.group)}>
                    <div className='heading'>{this.props.group.name || 'unnamed group'}</div>
                    {monsters}
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
