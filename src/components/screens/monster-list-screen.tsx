import React from 'react';

import { MonsterGroup } from '../../models/monster-group';

import MonsterGroupListItem from '../list-items/monster-group-list-item';
import Note from '../panels/note';

interface Props {
    library: MonsterGroup[];
    selectMonsterGroup: (group: MonsterGroup) => void;
    addMonsterGroup: () => void;
}

export default class MonsterListScreen extends React.Component<Props> {
    public render() {
        try {
            let listItems = this.props.library.map(group => {
                return (
                    <MonsterGroupListItem
                        key={group.id}
                        group={group}
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

            return (
                <div className='screen row collapse'>
                    <div className='columns small-4 medium-4 large-3 scrollable list-column'>
                        <button onClick={() => this.props.addMonsterGroup()}>add a new monster group</button>
                        <div className='divider' />
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
