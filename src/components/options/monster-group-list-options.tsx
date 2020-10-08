import React from 'react';

interface Props {
	addMonsterGroup: () => void;
	importMonsterGroup: () => void;
	openDemographics: () => void;
}

export class MonsterGroupListOptions extends React.Component<Props> {
	public render() {
		return (
			<div>
				<button onClick={() => this.props.addMonsterGroup()}>add a new monster group</button>
				<button onClick={() => this.props.importMonsterGroup()}>import a monster group</button>
				<button onClick={() => this.props.openDemographics()}>show demographics</button>
			</div>
		);
	}
}
