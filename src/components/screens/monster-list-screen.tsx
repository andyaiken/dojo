import React from 'react';

import { Col, Row } from 'antd';

import Utils from '../../utils/utils';

import { CATEGORY_TYPES, MonsterGroup, SIZE_TYPES } from '../../models/monster-group';

import Selector from '../controls/selector';
import GridPanel from '../panels/grid-panel';
import Note from '../panels/note';

interface Props {
    library: MonsterGroup[];
    addMonsterGroup: () => void;
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
                <Row className='full-height'>
                    <Col span={6} className='scrollable sidebar'>
                        <Note>
                            <div className='section'>you can maintain your menagerie of monsters here</div>
                            <div className='section'>you can then use these monsters to design combat encounters in the encounter builder</div>
                            <div className='divider'/>
                            <div className='section'>on the right you will see a list of monster groups</div>
                            <div className='section'>select a monster group from the list to see stat blocks for monsters in that group</div>
                            <div className='divider'/>
                            <div className='section'>to start adding monsters, press the <b>create a new monster group</b> button</div>
                        </Note>
                        <button onClick={() => this.props.addMonsterGroup()}>create a new monster group</button>
                    </Col>
                    <Col span={18} className='scrollable'>
                        <GridPanel heading='monster groups' content={listItems} />
                    </Col>
                </Row>
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
        const sizes: JSX.Element[] = [];
        SIZE_TYPES.forEach(size => {
            const count = this.props.group.monsters.filter(m => m.size === size).length;
            if (count > 0) {
                const pc = Math.round(100 * count / this.props.group.monsters.length);
                sizes.push(this.getBar(size, pc));
            }
        });
        if (sizes.length === 0) {
            sizes.push(<div key='empty'>none</div>);
        }

        const categories: JSX.Element[] = [];
        CATEGORY_TYPES.forEach(cat => {
            const count = this.props.group.monsters.filter(m => m.category === cat).length;
            if (count > 0) {
                const pc = Math.round(100 * count / this.props.group.monsters.length);
                categories.push(this.getBar(cat, pc));
            }
        });
        if (categories.length === 0) {
            categories.push(<div key='empty'>none</div>);
        }

        const challengeRatings = [
            0, 0.125, 0.25, 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30
        ];
        const crs: JSX.Element[] = [];
        challengeRatings.forEach(rating => {
            const count = this.props.group.monsters.filter(m => m.challenge === rating).length;
            if (count > 0) {
                const pc = Math.round(100 * count / this.props.group.monsters.length);
                crs.push(this.getBar(Utils.challenge(rating), pc));
            }
        });
        if (crs.length === 0) {
            crs.push(<div key='empty'>none</div>);
        }

        return (
            <div>
                <div className='subheading'>size</div>
                {sizes}
                <div className='subheading'>category</div>
                {categories}
                <div className='subheading'>challenge rating</div>
                {crs}
            </div>
        );
    }

    private getBar(text: string, value: number) {
        const width = value + '%';
        return (
            <div key={text} className='breakdown-bar'>
                <div className='bar-text'>{text}</div>
                <div className='bar-value-container'>
                    <div className='bar-value' style={{ width: width }} />
                </div>
            </div>
        );
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
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
