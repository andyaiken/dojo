import React from 'react';

import { Combatant } from '../../models/combat';
import { Monster } from '../../models/monster-group';
import { PC } from '../../models/party';

import MonsterCard from '../cards/monster-card';
import PCCard from '../cards/pc-card';

interface Props {
    source: PC | Monster | (Combatant & PC) | (Combatant & Monster) | null;
}

export default class StatBlockModal extends React.Component<Props> {
    public render() {
        try {
            if (!this.props.source) {
                return null;
            }

            let content = null;
            switch (this.props.source.type) {
                case 'pc':
                    content = <PCCard pc={this.props.source as PC} mode='view' />;
                    break;
                case 'monster':
                    content = <MonsterCard monster={this.props.source as Monster} mode='full' />;
                    break;
            }

            return (
                <div className='scrollable' style={{ padding: '10px' }}>
                    {content}
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}
