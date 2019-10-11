import React from 'react';

import { Combat } from '../../models/combat';

import MapPanel from '../panels/map-panel';

interface Props {
    combat: Combat;
    setSelection: (combat: Combat) => void;
}

export default class CombatListItem extends React.Component<Props> {
    public render() {
        try {
            let map = null;
            if (this.props.combat.map) {
                map = (
                    <MapPanel
                        map={this.props.combat.map}
                        mode='thumbnail'
                        size={10}
                        combatants={this.props.combat.combatants}
                    />
                );
            }

            return (
                <div className='list-item' onClick={() => this.props.setSelection(this.props.combat)}>
                    <div className='heading'>{this.props.combat.name || 'unnamed combat'}</div>
                    <div className='section'>paused at {this.props.combat.timestamp}</div>
                    {map}
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
