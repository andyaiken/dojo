import React from 'react';

import { Exploration } from '../../models/map';

import { ExplorationOptions } from '../options/exploration-options';
import { MapPanel } from '../panels/map-panel';

interface Props {
	exploration: Exploration;
	resume: (exploration: Exploration) => void;
	delete: (exploration: Exploration) => void;
}

export class ExplorationCard extends React.Component<Props> {
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
							<MapPanel
								map={this.props.exploration.map}
								fog={this.props.exploration.fog}
								combatants={this.props.exploration.combatants}
							/>
						</div>
						<hr/>
						<ExplorationOptions
							exploration={this.props.exploration}
							resume={exploration => this.props.resume(exploration)}
							delete={exploration => this.props.delete(exploration)}
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
