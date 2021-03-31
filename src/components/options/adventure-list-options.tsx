import React from 'react';

interface Props {
	addAdventure: () => void;
	generateAdventure: () => void;
}

export class AdventureListOptions extends React.Component<Props> {
	public render() {
		return (
			<div>
				<button onClick={() => this.props.addAdventure()}>add a new adventure</button>
				<button onClick={() => this.props.generateAdventure()}>generate a random dungeon adventure</button>
			</div>
		);
	}
}
