import React from 'react';

import { Napoleon } from '../../utils/napoleon';

import { Expander } from '../controls/expander';
import { RadioGroup } from '../controls/radio-group';

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
					<button onClick={() => this.props.createEncounter()}>create a random encounter</button>
					<Expander text='use an encounter template'>
						<RadioGroup
							items={Napoleon.encounterTemplates().map(t => ({ id: t.name, text: t.name }))}
							onSelect={id => this.props.addEncounter(id)}
						/>
					</Expander>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
