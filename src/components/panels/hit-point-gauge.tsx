import React from 'react';

import { Combatant } from '../../models/combat';
import { Monster } from '../../models/monster-group';

interface Props {
    combatant: Combatant & Monster;
}

export default class HitPointGauge extends React.Component<Props> {
    public render() {
        try {
            const hpCurrent = this.props.combatant.hp || 0;
            const hpMax = this.props.combatant.hpMax + this.props.combatant.hpTemp;
            const hpBloodied = this.props.combatant.hpMax / 2;
            const hpWidth = 100 * Math.max(hpCurrent, 0) / hpMax;

            let style = '';
            if (hpCurrent >= this.props.combatant.hpMax) {
                style = 'bar unhurt';
            } else if (hpCurrent <= hpBloodied) {
                style = 'bar bloodied';
            } else {
                style = 'bar injured';
            }

            let hpTempBar = null;
            if (this.props.combatant.hpTemp > 0) {
                const hpTempWidth = 100 * Math.max(this.props.combatant.hpTemp, 0) / hpMax;
                hpTempBar = <div className='bar temp' style={{ width: hpTempWidth + '%' }} />;
            }

            return (
                <div className='hp-gauge'>
                    <div className={style} style={{ width: hpWidth + '%' }} />
                    {hpTempBar}
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}