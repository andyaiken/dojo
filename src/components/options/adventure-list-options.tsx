import React from 'react';

interface Props {
	addAdventure: () => void;
	importAdventure: () => void;
}

export class AdventureListOptions extends React.Component<Props> {
	public render() {
		return (
			<div>
				<button onClick={() => this.props.addAdventure()}>add a new adventure</button>
				<button onClick={() => this.props.importAdventure()}>import an adventure</button>
			</div>
		);
	}
}
