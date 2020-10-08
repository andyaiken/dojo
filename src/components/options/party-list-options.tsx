import React from 'react';

interface Props {
	addParty: () => void;
	importParty: () => void;
}

export class PartyListOptions extends React.Component<Props> {
	public render() {
		return (
			<div>
				<button onClick={() => this.props.addParty()}>add a new party</button>
				<button onClick={() => this.props.importParty()}>import a party</button>
			</div>
		);
	}
}
