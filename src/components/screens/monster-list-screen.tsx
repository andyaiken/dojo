import React from 'react';

import { MonsterGroup } from '../../models/monster-group';

import Selector from '../controls/selector';
import CardGroup from '../panels/card-group';
import Note from '../panels/note';

interface Props {
    library: MonsterGroup[];
    selectMonsterGroup: (group: MonsterGroup) => void;
}

export default class MonsterListScreen extends React.Component<Props> {
    public render() {
        try {
            const listItems = this.props.library.map(group => (
                <ListItem
                    key={group.id}
                    group={group}
                    setSelection={grp => this.props.selectMonsterGroup(grp)}
                />
            ));

            return (
                <div className='screen row collapse'>
                    <div className='columns small-4 medium-4 large-3 scrollable left-column'>
                        <Note>
                            <div className='section'>you can maintain your menagerie of monsters here</div>
                            <div className='section'>you can then use these monsters to design combat encounters in the encounter builder</div>
                            <div className='divider'/>
                            <div className='section'>on the right you will see a list of monster groups</div>
                            <div className='section'>select a monster group from the list to see stat blocks for monsters in that group</div>
                            <div className='divider'/>
                            <div className='section'>to start adding monsters, press the <b>create a new monster group</b> button</div>
                        </Note>
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

interface ListItemState {
    view: string;
}

class ListItem extends React.Component<ListItemProps, ListItemState> {
    constructor(props: ListItemProps) {
        super(props);
        this.state = {
            view: 'monsters'
        };
    }

    private setView(view: string) {
        this.setState({
            view: view
        });
    }

    private getMonsters() {
        const monsters = this.props.group.monsters.map(m => (
            <div key={m.id} className='section'>
                {m.name || 'unnamed monster'}
            </div>
        ));
        if (monsters.length === 0) {
            monsters.push(<div key='empty' className='section'>no monsters</div>);
        }

        return (
            <div>
                <div className='subheading'>monsters</div>
                {monsters}
            </div>
        );
    }

    private getBreakdown() {
        // sizes
        // category
        // challenge range
        return '';
    }

    public render() {
        try {
            const options = ['monsters', 'breakdown'].map(item => {
                return { id: item, text: item };
            });

            let content = null;
            switch (this.state.view) {
                case 'monsters':
                    content = this.getMonsters();
                    break;
                case 'breakdown':
                    content = this.getBreakdown();
                    break;
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
                                <Selector
                                    options={options}
                                    selectedID={this.state.view}
                                    select={view => this.setView(view)}
                                />
                                {content}
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
