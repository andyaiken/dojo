import React from 'react';

import { Napoleon } from '../../utils/napoleon';

import { Combatant } from '../../models/combat';

import { RenderError } from '../error';

interface Props {
	combatant: Combatant;
}

export class HitPointGauge extends React.Component<Props> {
	public render() {
		try {
			const hpCurrent = this.props.combatant.hpCurrent || 0;
			const hpMax = this.props.combatant.hpMax || 0;
			const hpTemp = this.props.combatant.hpTemp || 0;
			const hpWidth = 100 * Math.max(hpCurrent, 0) / (hpMax + hpTemp);

			const style = 'bar ' + Napoleon.getCombatantState(this.props.combatant);

			let hpTempBar = null;
			if ((this.props.combatant.hpTemp !== null) && (this.props.combatant.hpTemp > 0)) {
				const hpTempWidth = 100 * Math.max(this.props.combatant.hpTemp, 0) / (hpMax + hpTemp);
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
			return <RenderError context='HitPointGauge' error={e} />;
		}
	}
}
