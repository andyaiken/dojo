import { ExportOutlined } from '@ant-design/icons';
import React from 'react';

import { Verne } from '../../utils/verne';

import { Adventure } from '../../models/adventure';
import { Encounter } from '../../models/encounter';
import { Party } from '../../models/party';

import { RenderError } from '../error';
import { ConfirmButton } from '../controls/confirm-button';
import { Dropdown } from '../controls/dropdown';
import { Expander } from '../controls/expander';
import { Textbox } from '../controls/textbox';

interface Props {
	encounter: Encounter;
	parties: Party[];
	adventures: Adventure[];
	cloneEncounter: (encounter: Encounter, name: string) => void;
	startEncounter: (partyID: string, encounterID: string) => void;
	deleteEncounter: (encounter: Encounter) => void;
}

interface State {
	cloneName: string;
}

export class EncounterOptions extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			cloneName: props.encounter.name + ' copy'
		};
	}

	private setCloneName(cloneName: string) {
		this.setState({
			cloneName: cloneName
		});
	}

	public render() {
		try {
			let run = null;
			if (this.props.parties.length === 1) {
				run = (
					<button onClick={() => this.props.startEncounter(this.props.parties[0].id, this.props.encounter.id)}>
						start combat
					</button>
				);
			}
			if (this.props.parties.length > 1) {
				run = (
					<Dropdown
						options={this.props.parties.map(p => ({ id: p.id, text: p.name || 'unnamed party' }))}
						placeholder='start combat with...'
						onSelect={partyID => this.props.startEncounter(partyID, this.props.encounter.id)}
					/>
				);
			}

			return (
				<div>
					<Expander text='copy encounter'>
						<div className='content-then-icons'>
							<div className='content'>
								<Textbox
									text={this.state.cloneName}
									placeholder='name of copy'
									onChange={value => this.setCloneName(value)}
								/>
							</div>
							<div className='icons'>
								<ExportOutlined
									title='create copy'
									className={this.state.cloneName === '' ? 'disabled' : ''}
									onClick={() => this.props.cloneEncounter(this.props.encounter, this.state.cloneName)}
								/>
							</div>
						</div>
					</Expander>
					{run}
					<ConfirmButton
						disabled={
							this.props.adventures.some(adventure => Verne.getScenes(adventure.plot).some(scene => scene.resources.some(r => (r.type === 'encounter') && (r.content === this.props.encounter.id))))
						}
						onConfirm={() => this.props.deleteEncounter(this.props.encounter)}
					>
						delete encounter
					</ConfirmButton>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='EncounterOptions' error={e} />;
		}
	}
}
