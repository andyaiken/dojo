import React from 'react';

import { Map } from '../../models/map';

import { RenderError } from '../error';
import { Group } from '../controls/group';
import { MapPanel } from '../panels/map-panel';

interface Props {
	maps: Map[];
	onSelect: (map: Map) => void;
}

export class MapSelectionModal extends React.Component<Props> {
	public render() {
		try {
			return (
				<div className='scrollable'>
					<div className='section heading'>which map do you want to use?</div>
					<hr/>
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
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='MapSelectionModal' error={e} />;
		}
	}
}
