import React from 'react';

import { Napoleon } from '../../utils/napoleon';

import { Encounter } from '../../models/encounter';
import { MonsterGroup } from '../../models/monster';

import { RenderError } from '../error';
import { ConfirmButton } from '../controls/confirm-button';

interface Props {
	monsterGroup: MonsterGroup;
	library: MonsterGroup[];
	encounters: Encounter[];
	addMonster: () => void;
	importMonster: () => void;
	generateMonster: () => void;
	openDemographics: (group: MonsterGroup) => void;
	createEncounter: (monsterIDs: string[]) => void;
	deleteMonsterGroup: (group: MonsterGroup) => void;
}

export class MonsterGroupOptions extends React.Component<Props> {
	public render() {
		try {
			return (
				<div>
					<button onClick={() => this.props.addMonster()}>add a new monster</button>
					<button onClick={() => this.props.importMonster()}>import a monster</button>
					<button onClick={() => this.props.generateMonster()}>generate a random monster</button>
					<button onClick={() => this.props.openDemographics(this.props.monsterGroup)}>show demographics</button>
					<button onClick={() => this.props.createEncounter(this.props.monsterGroup.monsters.map(m => m.id))}>create an encounter</button>
					<ConfirmButton
						disabled={this.props.monsterGroup.monsters.some(monster => this.props.encounters.some(enc => Napoleon.encounterHasMonster(enc, monster.id)))}
						onConfirm={() => this.props.deleteMonsterGroup(this.props.monsterGroup)}
					>
						delete group
					</ConfirmButton>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='MonsterGroupOptions' error={e} />;
		}
	}
}
