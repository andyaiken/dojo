import { CopyOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import React from 'react';

import { Gygax } from '../../utils/gygax';
import { Shakespeare } from '../../utils/shakespeare';
import { Utils } from '../../utils/utils';

import { NPC } from '../../models/misc';
import { Party } from '../../models/party';

import { RenderError } from '../error';
import { Conditional } from '../controls/conditional';
import { Dropdown } from '../controls/dropdown';
import { Group } from '../controls/group';
import { Selector } from '../controls/selector';
import { Tabs } from '../controls/tabs';
import { PartyBreakdownPanel } from '../panels/party-breakdown-panel';
import { MarkdownReference } from '../sidebars/reference-sidebar';

interface Props {
	parties: Party[];
}

interface State {
	leftView: string;
	rightView: string | null;
	selectedPartyID: string | null;
	generatorType: string;
	generatedItems: string[];
	npc: NPC | null;
}

export class DMScreen extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			leftView: 'skills',
			rightView: null,
			selectedPartyID: props.parties.length === 1 ? props.parties[0].id : null,
			generatorType: 'names',
			generatedItems: [],
			npc: null
		};
	}

	private setLeftView(view: string) {
		this.setState({
			leftView: view
		});
	}

	private setRightView(view: string) {
		this.setState({
			rightView: view
		});
	}

	private setSelectedPartyID(id: string | null) {
		this.setState({
			selectedPartyID: id
		});
	}

	private setGeneratorType(generator: string) {
		this.setState({
			generatorType: generator
		});
	}

	private async generate() {
		const items = [];
		let npc = null;

		switch (this.state.generatorType) {
			case 'names':
				while (items.length < 10) {
					items.push(Shakespeare.generateName());
				}
				break;
			case 'potions':
				while (items.length < 10) {
					items.push(Shakespeare.generatePotion());
				}
				break;
			case 'treasure':
				while (items.length < 10) {
					items.push(Shakespeare.generateTreasure());
				}
				break;
			case 'place names':
				{
					const response = await fetch('/dojo/data/places.txt');
					const text = await response.text();
					Shakespeare.initModel([text]);
					while (items.length < 10) {
						items.push(Shakespeare.generateLine());
					}
				}
				break;
			case 'npc':
				npc = {
					age: Shakespeare.generateNPCAge(),
					profession: Shakespeare.generateNPCProfession(),
					height: Shakespeare.generateNPCHeight(),
					weight: Shakespeare.generateNPCWeight(),
					hair: Shakespeare.generateNPCHair(),
					physical: Shakespeare.generateNPCPhysical(),
					mental: Shakespeare.generateNPCMental(),
					speech: Shakespeare.generateNPCSpeech(),
					trait: Shakespeare.generateNPCTrait(),
					ideal: Shakespeare.generateNPCIdeal(),
					bond: Shakespeare.generateNPCBond(),
					flaw: Shakespeare.generateNPCFlaw()
				};
				break;
			case 'wild surge':
				items.push(Gygax.getWildSurge());
				break;
		}

		this.setState({
			generatedItems: items.sort(),
			npc: npc
		});
	}

	private getPartyHeader() {
		if (this.props.parties.length > 1) {
			return (
				<div>
					<Dropdown
						options={this.props.parties.map(p => ({ id: p.id, text: p.name || 'unnamed party' }))}
						placeholder='select a party...'
						selectedID={this.state.selectedPartyID}
						onSelect={id => this.setSelectedPartyID(id)}
						onClear={() => this.setSelectedPartyID(null)}
					/>
					<Conditional display={this.state.selectedPartyID !== null}>
						<hr/>
					</Conditional>
				</div>
			);
		} else if (this.props.parties.length === 1) {
			return (
				<div className='heading'>
					{this.props.parties[0].name || 'unnamed party'}
				</div>
			);
		}

		return null;
	}

	private getGeneratorsSection() {
		let content = null;

		switch (this.state.generatorType) {
			case 'npc':
				if (this.state.npc !== null) {
					content = (
						<div>
							<hr/>
							<Group>
								<div className='section large'><b>age:</b> {(this.state.npc as NPC).age}</div>
								<div className='section large'><b>profession:</b> {(this.state.npc as NPC).profession}</div>
								<div className='section large'><b>height:</b> {(this.state.npc as NPC).height}</div>
								<div className='section large'><b>weight:</b> {(this.state.npc as NPC).weight}</div>
								<div className='section large'><b>hair:</b> {(this.state.npc as NPC).hair}</div>
								<div className='section large'><b>physical:</b> {(this.state.npc as NPC).physical}</div>
								<div className='section large'><b>personality:</b> {(this.state.npc as NPC).mental}</div>
								<div className='section large'><b>speech:</b> {(this.state.npc as NPC).speech}</div>
								<hr/>
								<div className='section large'><b>trait:</b> {(this.state.npc as NPC).trait}</div>
								<div className='section large'><b>ideal:</b> {(this.state.npc as NPC).ideal}</div>
								<div className='section large'><b>bond:</b> {(this.state.npc as NPC).bond}</div>
								<div className='section large'><b>flaw:</b> {(this.state.npc as NPC).flaw}</div>
							</Group>
						</div>
					);
				}
				break;
			default:
				if (this.state.generatedItems.length > 0) {
					content = (
						<div>
							<hr/>
							{
								this.state.generatedItems.map((value, index) => (
									<GeneratedItem key={index} text={value} />
								))
							}
						</div>
					);
				}
				break;
		}

		return (
			<div>
				<div className='content-then-icons'>
					<div className='content'>
						<Selector
							options={Utils.arrayToItems(['names', 'potions', 'treasure', 'place names', 'npc', 'wild surge'])}
							selectedID={this.state.generatorType}
							itemsPerRow={3}
							onSelect={optionID => this.setGeneratorType(optionID)}
						/>
					</div>
					<div className='icons'>
						<ThunderboltOutlined title='generate' onClick={() => this.generate()} />
					</div>
				</div>
				{content}
			</div>
		);
	}

	public render() {
		try {
			const referenceTabs = Utils.arrayToItems(['skills', 'conditions', 'actions']);
			const partyTabs = [];
			if (this.props.parties.length > 0) {
				partyTabs.push('party breakdown');
			}
			partyTabs.push('generators');
			const selectedRight = this.state.rightView ?? partyTabs[0];

			return (
				<Row gutter={10} className='full-height'>
					<Col span={16} className='full-height'>
						<Tabs
							options={referenceTabs}
							selectedID={this.state.leftView}
							onSelect={view => this.setLeftView(view)}
						/>
						<div className='scrollable' style={{ height: 'calc(100% - 52px)' }}>
							<Conditional display={this.state.leftView === 'skills'}>
								<MarkdownReference filename='/dojo/data/skills.md' />
							</Conditional>
							<Conditional display={this.state.leftView === 'conditions'}>
								<MarkdownReference filename='/dojo/data/conditions.md' />
							</Conditional>
							<Conditional display={this.state.leftView === 'actions'}>
								<MarkdownReference filename='/dojo/data/actions.md' />
							</Conditional>
						</div>
					</Col>
					<Col span={8} className='full-height'>
						<Tabs
							options={Utils.arrayToItems(partyTabs)}
							selectedID={selectedRight}
							onSelect={view => this.setRightView(view)}
						/>
						<div className='scrollable' style={{ height: 'calc(100% - 52px)' }}>
							<Conditional display={selectedRight === 'party breakdown'}>
								<div>
									{this.getPartyHeader()}
								</div>
								<PartyBreakdownPanel
									party={this.props.parties.find(p => p.id === this.state.selectedPartyID) ?? null}
								/>
							</Conditional>
							<Conditional display={selectedRight === 'generators'}>
								{this.getGeneratorsSection()}
							</Conditional>
						</div>
					</Col>
				</Row>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='DMScreen' error={e} />;
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
				<Group>
					<div className='content-then-icons'>
						<div className='content'>
							<div className='section large'>
								{this.props.text.toLowerCase()}
							</div>
						</div>
						<div className='icons'>
							<CopyOutlined title='copy to clipboard' onClick={e => this.copy(e)} />
						</div>
					</div>
				</Group>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='GeneratedItem' error={e} />;
		}
	}
}
