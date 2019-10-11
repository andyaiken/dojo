import React from 'react';

import { MonsterGroup } from '../../models/monster-group';

interface Props {
    group: MonsterGroup;
    setSelection: (group: MonsterGroup) => void;
}

export default class MonsterGroupListItem extends React.Component<Props> {
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
