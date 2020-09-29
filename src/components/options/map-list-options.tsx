import React from 'react';

import { Expander } from '../controls/expander';

interface Props {
	addMap: () => void;
	importMap: () => void;
	generateMap: (type: string) => void;
}

export class MapListOptions extends React.Component<Props> {
	public render() {
		return (
			<div>
				<button onClick={() => this.props.addMap()}>create a new map</button>
				<button onClick={() => this.props.importMap()}>import a map image</button>
				<Expander text='create a random map'>
					<button onClick={() => this.props.generateMap('dungeon')}>create a new dungeon map</button>
					<button onClick={() => this.props.generateMap('delve')}>create a new delve map</button>
				</Expander>
			</div>
		);
	}
}
