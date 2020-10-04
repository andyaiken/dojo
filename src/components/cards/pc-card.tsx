import { Tag } from 'antd';
import React from 'react';

import { Combatant } from '../../models/combat';
import { PC } from '../../models/party';

import { PCOptions } from '../options/pc-options';
import { PortraitPanel } from '../panels/portrait-panel';

interface Props {
	pc: PC | (PC & Combatant);
	changeValue: (pc: any, field: string, value: any) => void;
	deletePC: (pc: PC) => void;
	editPC: (pc: PC) => void;
	updatePC: (pc: PC) => void;
}

export class PCCard extends React.Component<Props> {
	public render() {
		try {
			const name = (this.props.pc as Combatant ? (this.props.pc as Combatant).displayName : null)
				|| this.props.pc.name
				|| 'unnamed pc';

			return (
				<div className='card pc'>
					<div className='heading'>
						<div className='title' title={name}>
							{name}
						</div>
					</div>
					<div className='card-content'>
						<div className='stats'>
							<PortraitPanel source={this.props.pc} />
							<div className='section centered lowercase'>
								<Tag>{this.props.pc.race || 'unknown race'}</Tag>
								<Tag>{this.props.pc.classes || 'unknown class'}</Tag>
								<Tag>{'level ' + this.props.pc.level}</Tag>
							</div>
							<div className='section centered' style={{ display: this.props.pc.url ? '' : 'none' }}>
								<a href={this.props.pc.url} target='_blank' rel='noopener noreferrer'>d&amp;d beyond sheet</a>
							</div>
						</div>
						<hr/>
						<PCOptions
							pc={this.props.pc}
							editPC={pc => this.props.editPC(pc)}
							updatePC={pc => this.props.updatePC(pc)}
							removePC={pc => this.props.deletePC(pc)}
							changeValue={(source, field, value) => this.props.changeValue(source, field, value)}
						/>
					</div>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
