import React from 'react';

import { Napoleon } from '../../utils/napoleon';

import { RenderError } from '../error';
import { Expander } from '../controls/expander';
import { Note } from '../controls/note';

interface Props {
	createEncounter: () => void;
	addEncounter: (templateID: string | null) => void;
}

export class EncounterListOptions extends React.Component<Props> {
	public render() {
		try {
			return (
				<div>
					<button onClick={() => this.props.addEncounter(null)}>add a new encounter</button>
					<Expander text='use an encounter template'>
						<Note>
							<div className='section'>
								these templates give you a good framework for creating an encounter
							</div>
						</Note>
						<div>
							{
								Napoleon.encounterTemplates().map(t => (
									<button key={t.name} onClick={() => this.props.addEncounter(t.name)}>{t.name}</button>
								))
							}
						</div>
					</Expander>
					<button onClick={() => this.props.createEncounter()}>generate a random encounter</button>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='EncounterListOptions' error={e} />;
		}
	}
}
