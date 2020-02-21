import React from 'react';

import { Monster } from '../../models/monster-group';

import MonsterCard from '../cards/monster-card';

interface Props {
    monster: Monster;
}

export default class MonsterInfoModal extends React.Component<Props> {
    public render() {
        try {
            return (
                <div className='scrollable' style={{ padding: '10px' }}>
                    <MonsterCard monster={this.props.monster} />
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}
