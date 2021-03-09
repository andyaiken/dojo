import { Col, Row } from 'antd';
import React from 'react';

import { Utils } from '../../utils/utils';

import { Adventure } from '../../models/adventure';

import { RenderError } from '../error';
import { AdventureCard } from '../cards/adventure-card';
import { Note } from '../controls/note';
import { AdventureListOptions } from '../options/adventure-list-options';
import { GridPanel } from '../panels/grid-panel';

interface Props {
	adventures: Adventure[];
	addAdventure: () => void;
	importAdventure: () => void;
	generateAdventure: () => void;
	openAdventure: (adventure: Adventure) => void;
	deleteAdventure: (adventure: Adventure) => void;
}

export class AdventureListScreen extends React.Component<Props> {
	public render() {
		try {
			const adventures = this.props.adventures;
			Utils.sort(adventures);
			const listItems = adventures.map(a => (
				<AdventureCard
					key={a.id}
					adventure={a}
					openAdventure={adventure => this.props.openAdventure(adventure)}
					deleteAdventure={adventure => this.props.deleteAdventure(adventure)}
				/>
			));

			return (
				<Row className='full-height'>
					<Col span={6} className='scrollable sidebar sidebar-left'>
						<Note>
							<div className='section'>this page is where you can plan your adventures</div>
							<hr/>
							<div className='section'>on the right you will see the adventures that you have created</div>
							<div className='section'>press an adventure's <b>open adventure</b> button to see its details</div>
							<hr/>
							<div className='section'>to get started creating an adventure, press the <b>add a new adventure</b> button</div>
						</Note>
						<AdventureListOptions
							addAdventure={() => this.props.addAdventure()}
							importAdventure={() => this.props.importAdventure()}
							generateAdventure={() => this.props.generateAdventure()}
						/>
					</Col>
					<Col span={18} className='scrollable'>
						<GridPanel heading='adventures' content={listItems} />
					</Col>
				</Row>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='AdventureListScreen' error={e} />;
		}
	}
}
