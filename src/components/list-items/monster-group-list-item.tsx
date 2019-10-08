import React from 'react';

import Utils from '../../utils/utils';

import { MonsterGroup } from '../../models/monster-group';

interface Props {
    group: MonsterGroup;
    selected: boolean;
    filter: string;
    setSelection: (group: MonsterGroup) => void;
}

export default class MonsterGroupListItem extends React.Component<Props> {
    public render() {
        try {
            const matchGroup = Utils.match(this.props.filter, this.props.group.name);

            const monsters = [];
            for (let n = 0; n !== this.props.group.monsters.length; ++n) {
                const monster = this.props.group.monsters[n];
                const name = monster.name || 'unnamed monster';
                if (matchGroup || Utils.match(this.props.filter, name)) {
                    monsters.push(<div key={monster.id} className='section'>{name}</div>);
                }
            }
            if (monsters.length === 0) {
                monsters.push(<div key='empty' className='section'>no monsters</div>);
            }

            return (
                <div className={this.props.selected ? 'list-item selected' : 'list-item'} onClick={() => this.props.setSelection(this.props.group)}>
                    <div className='heading'>{this.props.group.name || 'unnamed group'}</div>
                    {monsters}
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}
