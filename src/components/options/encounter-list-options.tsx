import React from 'react';

import { Napoleon } from '../../utils/napoleon';

import { Expander } from '../controls/expander';
import { RadioGroup } from '../controls/radio-group';

interface Props {
	addEncounter: (templateID: string | null) => void;
}

export class EncounterListOptions extends React.Component<Props> {
	public render() {
		try {
			return (
				<div>
					<button onClick={() => this.props.addEncounter(null)}>create a new encounter</button>
					<Expander text='use an encounter template'>
						<RadioGroup
							items={Napoleon.encounterTemplates().map(t => ({ id: t.name, text: t.name }))}
							selectedItemID={null}
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
