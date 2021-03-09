import React from 'react';

interface Props {
	addMap: () => void;
	importMap: () => void;
	generateMap: () => void;
}

export class MapListOptions extends React.Component<Props> {
	public render() {
		return (
			<div>
				<button onClick={() => this.props.addMap()}>add a new map</button>
				<button onClick={() => this.props.importMap()}>import a map image</button>
				<button onClick={() => this.props.generateMap()}>generate a random map</button>
			</div>
		);
	}
}
