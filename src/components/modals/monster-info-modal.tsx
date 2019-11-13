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
                <div className='scrollable'>
                    <MonsterCard monster={this.props.monster} mode='view full'/>
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}
