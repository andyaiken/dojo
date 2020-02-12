import React from 'react';

import { Col, Icon, Row } from 'antd';

import Utils from '../../utils/utils';

import { CATEGORY_TYPES, MonsterGroup, SIZE_TYPES } from '../../models/monster-group';

import Checkbox from '../controls/checkbox';
import ConfirmButton from '../controls/confirm-button';
import ChartPanel from '../panels/chart-panel';
import GridPanel from '../panels/grid-panel';
import Note from '../panels/note';
import PortraitPanel from '../panels/portrait-panel';
import Readaloud from '../panels/readaloud';

interface Props {
    library: MonsterGroup[];
    hasMonsters: boolean;
    addMonsterGroup: () => void;
    selectMonsterGroup: (group: MonsterGroup) => void;
    deleteMonsterGroup: (group: MonsterGroup) => void;
    addOpenGameContent: () => void;
    openStatBlock: (groupName: string, monsterName: string) => void;
}

export default class MonsterListScreen extends React.Component<Props> {
    public render() {
        try {
            if (!this.props.hasMonsters) {
                /* tslint:disable:max-line-length */
                return (
                    <Row type='flex' justify='center' align='middle' className='scrollable'>
                        <Col xs={20} sm={18} md={16} lg={12} xl={10}>
                            <Readaloud>
                                <div className='section'>
                                    to kickstart your monster collection, let's import all the monsters from the <a href='http://dnd.wizards.com/articles/features/systems-reference-document-srd' target='_blank' rel='noopener noreferrer'>d&amp;d system reference document</a>
                                </div>
                                <div className='divider' />
                                <button onClick={() => this.props.addOpenGameContent()}>import monsters</button>
                            </Readaloud>
                        </Col>
                    </Row>
                );
                /* tslint:enable:max-line-length */
            }

            const listItems = this.props.library.map(group => (
                <ListItem
                    key={group.id}
                    group={group}
                    open={grp => this.props.selectMonsterGroup(grp)}
                    delete={grp => this.props.deleteMonsterGroup(grp)}
                    openStatBlock={(groupName, monsterName) => this.props.openStatBlock(groupName, monsterName)}
                />
            ));

            return (
                <Row className='full-height'>
                    <Col xs={12} sm={12} md={8} lg={6} xl={4} className='scrollable sidebar left'>
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
                    <Col xs={12} sm={12} md={16} lg={18} xl={20} className='scrollable'>
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
    open: (group: MonsterGroup) => void;
    delete: (group: MonsterGroup) => void;
    openStatBlock: (groupName: string, monsterName: string) => void;
}

interface ListItemState {
    showBreakdown: boolean;
}

class ListItem extends React.Component<ListItemProps, ListItemState> {
    constructor(props: ListItemProps) {
        super(props);
        this.state = {
            showBreakdown: false
        };
    }

    private toggleBreakdown() {
        this.setState({
            showBreakdown: !this.state.showBreakdown
        });
    }

    private getMonsters() {
        const monsters = this.props.group.monsters.map(m => (
            <div key={m.id} className='combatant-row'>
                <PortraitPanel source={m} inline={true}/>
                <div className='name'>{m.name || 'unnamed monster'}</div>
                <Icon className='info-icon' type='info-circle' onClick={() => this.props.openStatBlock(this.props.group.name, m.name)} />
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
        if (this.props.group.monsters.length === 0) {
            return <div className='section'>no monsters</div>;
        }

        const sizeData = SIZE_TYPES.map(size => {
            return {
                text: size,
                value: this.props.group.monsters.filter(monster => monster.size === size).length
            };
        });

        const categoryData = CATEGORY_TYPES.map(cat => {
            return {
                text: cat,
                value: this.props.group.monsters.filter(monster => monster.category === cat).length
            };
        });

        const challengeData = [
            0, 0.125, 0.25, 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30
        ].map(cr => {
            return {
                text: 'cr ' + Utils.challenge(cr),
                value: this.props.group.monsters.filter(monster => monster.challenge === cr).length
            };
        });

        return (
            <div>
                <div className='subheading'>size</div>
                <ChartPanel data={sizeData} />
                <div className='subheading'>category</div>
                <ChartPanel data={categoryData} collapse={true} />
                <div className='subheading'>challenge rating</div>
                <ChartPanel data={challengeData} />
            </div>
        );
    }

    public render() {
        try {
            return (
                <div className='card monster'>
                    <div className='heading'>
                        <div className='title'>
                            {this.props.group.name || 'unnamed group'}
                        </div>
                    </div>
                    <div className='card-content'>
                        <div className='fixed-height'>
                            {this.state.showBreakdown ? this.getBreakdown() : this.getMonsters()}
                        </div>
                        <div className='divider'/>
                        <button onClick={() => this.props.open(this.props.group)}>open</button>
                        <Checkbox label='breakdown' checked={this.state.showBreakdown} changeValue={() => this.toggleBreakdown()} />
                        <ConfirmButton text='delete' callback={() => this.props.delete(this.props.group)} />
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
