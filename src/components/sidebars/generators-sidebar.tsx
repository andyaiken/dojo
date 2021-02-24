import { CopyOutlined } from '@ant-design/icons';
import React from 'react';

import { Shakespeare } from '../../utils/shakespeare';

import { NPC } from '../../models/misc';

import { RenderError } from '../error';
import { Selector } from '../controls/selector';

interface Props {
	view: string;
	npc: NPC | null;
	setView: (view: string) => void;
	generateNPC: () => void;
}

export class GeneratorsSidebar extends React.Component<Props> {
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
		} catch (e) {
			console.error(e);
			return <RenderError context='GeneratorsSidebar' error={e} />;
		}
	}
}

interface SimpleGeneratorProps {
	type: 'book' | 'name' | 'potion' | 'treasure';
}

interface SimpleGeneratorState {
	values: string[];
}

class SimpleGenerator extends React.Component<SimpleGeneratorProps, SimpleGeneratorState> {
	constructor(props: SimpleGeneratorProps) {
		super(props);
		this.state = {
			values: []
		};
	}

	private generate() {
		const values: string[] = [];
		while (values.length < 10) {
			let v = '';
			switch (this.props.type) {
				case 'book':
					v = Shakespeare.generateBookTitle();
					break;
				case 'name':
					v = Shakespeare.generateName();
					break;
				case 'potion':
					v = Shakespeare.generatePotion();
					break;
				case 'treasure':
					v = Shakespeare.generateTreasure();
					break;
			}
			if (!values.includes(v)) {
				values.push(v);
			}
		}
		values.sort();

		this.setState({
			values: values
		});
	}

	public render() {
		try {
			const values = [];
			for (let n = 0; n !== this.state.values.length; ++n) {
				values.push(
					<GeneratedItem key={n} text={this.state.values[n]} />
				);
			}

			return (
				<div>
					<button onClick={() => this.generate()}>generate</button>
					{values.length > 0 ? <hr/> : null}
					{values}
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='SimpleGenerator' error={e} />;
		}
	}
}

interface PlaceNameGeneratorProps {
}

interface PlaceNameGeneratorState {
	values: string[];
}

class PlaceNameGenerator extends React.Component<PlaceNameGeneratorProps, PlaceNameGeneratorState> {
	constructor(props: PlaceNameGeneratorProps) {
		super(props);

		this.state = {
			values: []
		};
	}

	private async generate() {
		const response = await fetch('/dojo/data/places.txt');
		const source = await response.text();
		Shakespeare.initModel([source]);
		const values = Shakespeare.generateLines(10);
		this.setState({
			values: values
		});
	}

	public render() {
		try {
			const output = [];
			for (let n = 0; n !== this.state.values.length; ++n) {
				output.push(
					<GeneratedItem key={n} text={this.state.values[n]} />
				);
			}

			return (
				<div>
					<button onClick={() => this.generate()}>generate</button>
					{output.length > 0 ? <hr/> : null}
					{output}
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='PlaceNameGenerator' error={e} />;
		}
	}
}

interface NPCGeneratorProps {
	npc: NPC | null;
	generateNPC: () => void;
}

class NPCGenerator extends React.Component<NPCGeneratorProps> {
	public render() {
		try {
			let item = null;
			if (this.props.npc) {
				item = (
					<div>
						<hr/>
						<div className='group-panel'>
							<div className='section'><b>age:</b> {this.props.npc.age}</div>
							<div className='section'><b>profession:</b> {this.props.npc.profession}</div>
							<div className='section'><b>height:</b> {this.props.npc.height}</div>
							<div className='section'><b>weight:</b> {this.props.npc.weight}</div>
							<div className='section'><b>hair:</b> {this.props.npc.hair}</div>
							<div className='section'><b>physical:</b> {this.props.npc.physical}</div>
							<div className='section'><b>personality:</b> {this.props.npc.mental}</div>
							<div className='section'><b>speech:</b> {this.props.npc.speech}</div>
							<hr/>
							<div className='section'><b>trait:</b> {this.props.npc.trait}</div>
							<div className='section'><b>ideal:</b> {this.props.npc.ideal}</div>
							<div className='section'><b>bond:</b> {this.props.npc.bond}</div>
							<div className='section'><b>flaw:</b> {this.props.npc.flaw}</div>
						</div>
					</div>
				);
			}

			return (
				<div>
					<button onClick={() => this.props.generateNPC()}>generate</button>
					{item}
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='NPCGenerator' error={e} />;
		}
	}
}

interface GeneratedItemProps {
	text: string;
}

class GeneratedItem extends React.Component<GeneratedItemProps> {
	private copy(e: React.MouseEvent) {
		e.stopPropagation();
		navigator.clipboard.writeText(this.props.text);
	}

	public render() {
		try {
			return (
				<div className='generated-item group-panel'>
					<div className='text-section'>
						{this.props.text.toLowerCase()}
					</div>
					<div className='icon-section'>
						<CopyOutlined title='copy to clipboard' onClick={e => this.copy(e)} />
					</div>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='GeneratedItem' error={e} />;
		}
	}
}
