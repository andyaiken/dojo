import React from 'react';

export default class HitPointGauge extends React.Component {
    render() {
        try {
            var hpMax = this.props.combatant.hpMax + this.props.combatant.hpTemp;
            var hpBloodied = this.props.combatant.hpMax / 2;
            var hpWidth = 100 * Math.max(this.props.combatant.hp, 0) / hpMax;

            var style = "";
            if (this.props.combatant.hp >= this.props.combatant.hpMax) {
                style = "bar unhurt";
            } else if (this.props.combatant.hp <= hpBloodied) {
                style = "bar bloodied";
            } else {
                style = "bar injured";
            }

            var hpTempBar = null;
            if (this.props.combatant.hpTemp > 0) {
                var hpTempWidth = 100 * Math.max(this.props.combatant.hpTemp, 0) / hpMax;
                hpTempBar = <div className="bar temp" style={{ width: hpTempWidth + "%" }}></div>
            }

            return (
                <div className="hp-gauge">
                    <div className={style} style={{ width: hpWidth + "%" }}></div>
                    {hpTempBar}
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    };
}