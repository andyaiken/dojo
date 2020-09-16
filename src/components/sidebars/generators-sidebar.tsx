import React from 'react';

import { NPC } from '../../models/misc';

import Selector from '../controls/selector';
import NPCGenerator from './generators/npc-generator';
import PlaceNameGenerator from './generators/place-name-generator';
import SimpleGenerator from './generators/simple-generator';

interface Props {
	view: string;
	npc: NPC | null;
	setView: (view: string) => void;
	generateNPC: () => void;
}

export default class GeneratorsSidebar extends React.Component<Props> {
	public render() {
		try {
			const options = [
				{
					id: 'name',
					text: 'names'
				},
				{
					id: 'book',
					text: 'book titles'
				},
				{
					id: 'potion',
					text: 'potions'
				},
				{
					id: 'treasure',
					text: 'treasures'
				},
				{
					id: 'place',
					text: 'place names'
				},
				{
					id: 'npc',
					text: 'npc'
				}
			];

			let content = null;
			switch (this.props.view) {
				case 'name':
					content = (
						<SimpleGenerator key='name' type='name' />
					);
					break;
				case 'book':
					content = (
						<SimpleGenerator key='book' type='book' />
					);
					break;
				case 'potion':
					content = (
						<SimpleGenerator key='potion' type='potion' />
					);
					break;
				case 'treasure':
					content = (
						<SimpleGenerator key='treasure' type='treasure' />
					);
					break;
				case 'place':
					content = (
						<PlaceNameGenerator />
					);
					break;
				case 'npc':
					content = (
						<NPCGenerator
							npc={this.props.npc}
							generateNPC={() => this.props.generateNPC()}
						/>
					);
					break;
			}

			return (
				<div className='sidebar-container'>
					<div className='sidebar-header'>
						<div className='heading'>generators</div>
						<Selector
							options={options}
							selectedID={this.props.view}
							itemsPerRow={3}
							onSelect={optionID => this.props.setView(optionID)}
						/>
					</div>
					<div className='sidebar-content'>
						{content}
					</div>
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}
