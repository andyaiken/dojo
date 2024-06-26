import React from 'react';

import { Exploration } from '../../models/map';
import { SavedImage } from '../../models/misc';

import { RenderError } from '../error';
import { ExplorationOptions } from '../options/exploration-options';
import { MapPanel } from '../panels/map-panel';

interface Props {
	exploration: Exploration;
	images: SavedImage[]
	resumeExploration: (exploration: Exploration) => void;
	deleteExploration: (exploration: Exploration) => void;
}

export class ExplorationCard extends React.Component<Props> {
	public render() {
		try {
			return (
				<div key={this.props.exploration.id} className='card map'>
					<div className='heading'>
						<div className='title'>
							{this.props.exploration.name || 'unnamed exploration'}
						</div>
					</div>
					<div className='card-content'>
						<div className='fixed-height'>
							<MapPanel
								map={this.props.exploration.map}
								images={this.props.images}
								fog={this.props.exploration.fog}
								combatants={this.props.exploration.combatants}
							/>
						</div>
						<hr/>
						<ExplorationOptions
							exploration={this.props.exploration}
							resumeExploration={exploration => this.props.resumeExploration(exploration)}
							deleteExploration={exploration => this.props.deleteExploration(exploration)}
						/>
					</div>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='ExplorationCard' error={e} />;
		}
	}
}
