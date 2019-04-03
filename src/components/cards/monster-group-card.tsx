import React from 'react';

import { MonsterGroup } from '../../models/monster-group';

import ConfirmButton from '../controls/confirm-button';
import InfoCard from './info-card';

interface Props {
    selection: MonsterGroup;
    filter: string | null;
    changeValue: (field: string, value: string) => void;
    addMonster: () => void;
    sortMonsters: () => void;
    removeMonsterGroup: () => void;
}

export default class MonsterGroupCard extends React.Component<Props> {
    public render() {
        try {
            const heading = (
                <div className='heading'>
                    <div className='title'>monster group</div>
                </div>
            );

            const content = (
                <div>
                    <div className='section'>
                        <input
                            type='text'
                            placeholder='group name'
                            value={this.props.selection.name}
                            disabled={!!this.props.filter}
                            onChange={event => this.props.changeValue('name', event.target.value)}
                        />
                    </div>
                    <div className='divider' />
                    <div className='section'>
                        <button className={this.props.filter ? 'disabled' : ''} onClick={this.props.addMonster}>add a new monster</button>
                        <button className={this.props.filter ? 'disabled' : ''} onClick={this.props.sortMonsters}>sort monsters</button>
                        <ConfirmButton text='delete group' callback={this.props.removeMonsterGroup} />
                    </div>
                </div>
            );

            return (
                <InfoCard getHeading={() => heading} getContent={() => content} />
            );
        } catch (e) {
            console.error(e);
        }
    }
}
