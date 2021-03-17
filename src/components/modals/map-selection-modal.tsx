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
	private getMaps() {
		const maps: JSX.Element[] = [];

		this.props.maps.forEach(map => {
			maps.push(
				<Group key={map.id} onClick={() => this.props.onSelect(map)}>
					<div className='section subheading'>{map.name || 'unnamed map'}</div>
					<MapPanel
						map={map}
						showAreaNames={true}
					/>
				</Group>
			);
		});

		return maps;
	}

	public render() {
		try {
			return (
				<div className='scrollable'>
					<div className='section heading'>which map do you want to use?</div>
					{this.getMaps()}
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='MapSelectionModal' error={e} />;
		}
	}
}
