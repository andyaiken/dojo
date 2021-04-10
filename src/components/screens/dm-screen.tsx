import { CopyOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import React from 'react';

import { Gygax } from '../../utils/gygax';
import { Shakespeare } from '../../utils/shakespeare';
import { Utils } from '../../utils/utils';

import { NPC } from '../../models/misc';
import { Party, PC } from '../../models/party';

import { RenderError } from '../error';
import { Conditional } from '../controls/conditional';
import { Dropdown } from '../controls/dropdown';
import { Group } from '../controls/group';
import { Selector } from '../controls/selector';
import { Tabs } from '../controls/tabs';
import { AwardsBreakdownPanel } from '../panels/awards-breakdown-panel';
import { PartyBreakdownPanel } from '../panels/party-breakdown-panel';
import { MarkdownReference } from '../sidebars/reference-sidebar';

interface Props {
	parties: Party[];
	showAwards: boolean;
	addAward: (awardID: string, awardee: Party | PC) => void;
	deleteAward: (awardID: string, awardee: Party | PC) => void;
}

interface State {
	leftView: string;
	rightView: string;
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
			rightView: 'party breakdown',
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
				const response = await fetch('/dojo/data/places.txt');
				const text = await response.text();
				Shakespeare.initModel([text]);
				while (items.length < 10) {
					items.push(Shakespeare.generateLine());
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
								<div className='section'><b>age:</b> {(this.state.npc as NPC).age}</div>
								<div className='section'><b>profession:</b> {(this.state.npc as NPC).profession}</div>
								<div className='section'><b>height:</b> {(this.state.npc as NPC).height}</div>
								<div className='section'><b>weight:</b> {(this.state.npc as NPC).weight}</div>
								<div className='section'><b>hair:</b> {(this.state.npc as NPC).hair}</div>
								<div className='section'><b>physical:</b> {(this.state.npc as NPC).physical}</div>
								<div className='section'><b>personality:</b> {(this.state.npc as NPC).mental}</div>
								<div className='section'><b>speech:</b> {(this.state.npc as NPC).speech}</div>
								<hr/>
								<div className='section'><b>trait:</b> {(this.state.npc as NPC).trait}</div>
								<div className='section'><b>ideal:</b> {(this.state.npc as NPC).ideal}</div>
								<div className='section'><b>bond:</b> {(this.state.npc as NPC).bond}</div>
								<div className='section'><b>flaw:</b> {(this.state.npc as NPC).flaw}</div>
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

	private getAwardsSection() {
		return (
			<div>
				{this.getPartyHeader()}
				<AwardsBreakdownPanel
					party={this.props.parties.find(p => p.id === this.state.selectedPartyID) ?? null}
					addAward={(id, awardee) => this.props.addAward(id, awardee)}
					deleteAward={(id, awardee) => this.props.deleteAward(id, awardee)}
				/>
			</div>
		);
	}

	public render() {
		try {
			const referenceTabs = Utils.arrayToItems(['skills', 'conditions', 'actions']);
			const partyTabs = ['party breakdown', 'generators'];
			if (this.props.showAwards) {
				partyTabs.push('awards');
			}

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
							selectedID={this.state.rightView}
							onSelect={view => this.setRightView(view)}
						/>
						<div className='scrollable' style={{ height: 'calc(100% - 52px)' }}>
							<Conditional display={this.state.rightView === 'party breakdown'}>
								{this.getPartyHeader()}
								<PartyBreakdownPanel
									party={this.props.parties.find(p => p.id === this.state.selectedPartyID) ?? null}
									showAwards={this.props.showAwards}
								/>
							</Conditional>
							<Conditional display={this.state.rightView === 'generators'}>
								{this.getGeneratorsSection()}
							</Conditional>
							<Conditional display={this.state.rightView === 'awards'}>
								{this.getAwardsSection()}
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
							<div className='section'>
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
