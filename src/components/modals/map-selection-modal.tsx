import React from 'react';

import { Map } from '../../models/map';

import { RenderError } from '../error';
import { Conditional } from '../controls/conditional';
import { Group } from '../controls/group';
import { Selector } from '../controls/selector';
import { MapPanel } from '../panels/map-panel';
import { Factory } from '../../utils/factory';
import { Mercator } from '../../utils/mercator';

interface Props {
	maps: Map[];
	onSelect: (map: Map) => void;
}

interface State {
	view: string;
	map: Map | null;
}

export class MapSelectionModal extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			view: 'generate',
			map: null
		};
	}

	private generateMap(type: string) {
		const map = Factory.createMap();
		Mercator.generate(type, map);
		this.setState({
			map: map
		});
	}

	public render() {
		try {
			const options = [{
				id: 'generate',
				text: 'generate a new map'
			}, {
				id: 'select',
				text: 'select an existing map'
			}];

			return (
				<div className='scrollable'>
					<Conditional display={this.props.maps.length > 0}>
						<div className='section heading'>which map do you want to use?</div>
						<Selector
							options={options}
							selectedID={this.state.view}
							onSelect={id => this.setState({ view: id })}
						/>
						<hr/>
					</Conditional>
					<Conditional display={this.state.view === 'generate'}>
						<Conditional display={this.state.map === null}>
							<button onClick={() => this.generateMap('dungeon')}>create a dungeon map</button>
							<button onClick={() => this.generateMap('delve')}>create a delve map</button>
						</Conditional>
						<Conditional display={this.state.map !== null}>
							<Group>
								<div className='section heading'>{this.state.map ? this.state.map.name || 'unnamed map' : ''}</div>
								<MapPanel
									map={this.state.map as Map}
									showAreaNames={true}
								/>
								<button onClick={() => this.props.onSelect(this.state.map as Map)}>select this map</button>
							</Group>
						</Conditional>
					</Conditional>
					<Conditional display={this.state.view === 'select'}>
						{
							this.props.maps.map(map => (
								<Group key={map.id}>
									<div className='section subheading'>{map.name || 'unnamed map'}</div>
									<MapPanel
										map={map}
										showAreaNames={true}
									/>
									<button onClick={() => this.props.onSelect(map)}>select this map</button>
								</Group>
							))
						}
					</Conditional>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='MapSelectionModal' error={e} />;
		}
	}
}
