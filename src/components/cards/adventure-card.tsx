import React from 'react';

import { Adventure } from '../../models/adventure';

import { RenderError } from '../error';
import { Expander } from '../controls/expander';
import { AdventureOptions } from '../options/adventure-options';
import { PlotPanel } from '../panels/plot-panel';
import { MapPanel } from '../panels/map-panel';

interface Props {
	adventure: Adventure;
	openAdventure: (adventure: Adventure) => void;
	deleteAdventure: (adventure: Adventure) => void;
}

export class AdventureCard extends React.Component<Props> {
	private getContent() {
		if (this.props.adventure.plot.map) {
			return (
				<MapPanel
					map={this.props.adventure.plot.map}
				/>
			);
		}

		return (
			<PlotPanel
				plot={this.props.adventure.plot}
				mode='thumbnail'
			/>
		);
	}

	public render() {
		try {
			return (
				<div key={this.props.adventure.id} className='card adventure'>
					<div className='heading'>
						<div className='title'>
							{this.props.adventure.name || 'unnamed adventure'}
						</div>
					</div>
					<div className='card-content'>
						<div className='fixed-height'>
							{this.getContent()}
						</div>
						<hr/>
						<button onClick={() => this.props.openAdventure(this.props.adventure)}>open adventure</button>
						<Expander text='more options'>
							<AdventureOptions
								adventure={this.props.adventure}
								deleteAdventure={adventure => this.props.deleteAdventure(adventure)}
							/>
						</Expander>
					</div>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='AdventureCard' error={e} />;
		}
	}
}
