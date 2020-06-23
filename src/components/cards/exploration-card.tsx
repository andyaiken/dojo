import React from 'react';

import { Exploration } from '../../models/map';

import ConfirmButton from '../controls/confirm-button';
import MapPanel from '../panels/map-panel';

interface Props {
	exploration: Exploration;
	resume: (exploration: Exploration) => void;
	delete: (exploration: Exploration) => void;
}

export default class ExplorationCard extends React.Component<Props> {
	public render() {
		try {
			return (
				<div className='card map'>
					<div className='heading'>
						<div className='title'>
							{this.props.exploration.name || 'unnamed exploration'}
						</div>
					</div>
					<div className='card-content'>
						<div className='fixed-height'>
							<div className='section'>
								<MapPanel
									map={this.props.exploration.map}
									fog={this.props.exploration.fog}
									combatants={this.props.exploration.combatants}
								/>
							</div>
						</div>
						<hr/>
						<button onClick={() => this.props.resume(this.props.exploration)}>resume exploration</button>
						<ConfirmButton text='delete exploration' onConfirm={() => this.props.delete(this.props.exploration)} />
					</div>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
