import React from 'react';

import { Factory } from '../../utils/factory';
import { Gygax } from '../../utils/gygax';
import { Utils } from '../../utils/utils';

import { Encounter, MonsterFilter } from '../../models/encounter';
import { Map } from '../../models/map';
import { Party } from '../../models/party';

import { ConfirmButton } from '../controls/confirm-button';
import { Dropdown } from '../controls/dropdown';
import { Expander } from '../controls/expander';
import { NumberSpin } from '../controls/number-spin';
import { FilterPanel } from '../panels/filter-panel';

interface Props {
	party: Party;
	encounters: Encounter[];
	maps: Map[];
	addPC: () => void;
	importPC: () => void;
	createEncounter: (xp: number, filter: MonsterFilter) => void;
	startEncounter: (partyID: string, encounterID: string) => void;
	startExploration: (partyID: string, mapID: string) => void;
	setLevel: (party: Party, level: number) => void;
	showReference: (party: Party) => void;
	deleteParty: (party: Party) => void;
}

interface State {
	difficulty: string;
	filter: MonsterFilter;
}

export class PartyOptions extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			difficulty: 'medium',
			filter: Factory.createMonsterFilter()
		};
	}

	private setDifficulty(diff: string) {
		this.setState({
			difficulty: diff
		});
	}

	private export() {
		const filename = this.props.party.name + '.party';
		Utils.saveFile(filename, this.props.party);
	}

	private changeFilterValue(type: 'name' | 'challenge' | 'category' | 'size' | 'role', value: any) {
		const filter = this.state.filter as any;
		if (type === 'challenge') {
			filter.challengeMin = value[0];
			filter.challengeMax = value[1];
		} else {
			filter[type] = value;
		}

		this.setState({
			filter: filter
		});
	}

	private resetFilter() {
		this.setState({
			filter: Factory.createMonsterFilter()
		});
	}

	private getXP() {
		let xp = 0;

		const pcs = this.props.party.pcs.filter(pc => pc.active);
		pcs.forEach(pc => {
			xp += Gygax.pcExperience(pc.level, this.state.difficulty);
		});

		return xp;
	}

	public render() {
		try {
			const pcs = this.props.party.pcs.filter(pc => pc.active);
			const level = Math.round(pcs.reduce((sum, pc) => sum + pc.level, 0) / pcs.length);

			let run = null;
			if (this.props.encounters.length > 0) {
				run = (
					<Dropdown
						options={this.props.encounters.map(p => ({ id: p.id, text: p.name }))}
						placeholder='start combat...'
						onSelect={encounterID => this.props.startEncounter(this.props.party.id, encounterID)}
					/>
				);
			}

			let explore = null;
			if (this.props.maps.length > 0) {
				explore = (
					<Dropdown
						options={this.props.maps.map(m => ({ id: m.id, text: m.name }))}
						placeholder='start exploration...'
						onSelect={mapID => this.props.startExploration(this.props.party.id, mapID)}
					/>
				);
			}

			let create = null;
			if (this.props.party.pcs.length > 0) {
				create = (
					<Expander text='create a random encounter'>
						<p>
							create a random encounter for this party
						</p>
						<NumberSpin
							label='difficulty'
							value={this.state.difficulty}
							downEnabled={this.state.difficulty !== 'easy'}
							upEnabled={this.state.difficulty !== 'deadly'}
							onNudgeValue={delta => this.setDifficulty(Gygax.nudgeDifficulty(this.state.difficulty, delta))}
						/>
						<hr/>
						<FilterPanel
							filter={this.state.filter}
							prefix='use'
							showName={false}
							showRoles={false}
							changeValue={(type, value) => this.changeFilterValue(type, value)}
							resetFilter={() => this.resetFilter()}
						/>
						<hr/>
						<button onClick={() => this.props.createEncounter(this.getXP(), this.state.filter)}>build encounter</button>
					</Expander>
				);
			}

			return (
				<div>
					<button onClick={() => this.props.addPC()}>add a new pc</button>
					<button onClick={() => this.props.importPC()}>import a pc</button>
					<button onClick={() => this.export()}>export party</button>
					{run}
					{explore}
					{create}
					<button onClick={() => this.props.setLevel(this.props.party, level + 1)}>level up to {level + 1}</button>
					<button onClick={() => this.props.showReference(this.props.party)}>show party reference</button>
					<ConfirmButton text='delete party' onConfirm={() => this.props.deleteParty(this.props.party)} />
				</div>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
