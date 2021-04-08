import { Col, Row } from 'antd';
import React from 'react';

import { Utils } from '../../utils/utils';

import { Party, PC } from '../../models/party';

import { RenderError } from '../error';
import { Conditional } from '../controls/conditional';
import { Dropdown } from '../controls/dropdown';
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
	referenceView: string;
	partyView: string;
	selectedPartyID: string | null;
}

export class DMScreen extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			referenceView: 'skills',
			partyView: 'party breakdown',
			selectedPartyID: props.parties.length === 1 ? props.parties[0].id : null
		};
	}

	private setReferenceView(view: string) {
		this.setState({
			referenceView: view
		});
	}

	private setPartyView(view: string) {
		this.setState({
			partyView: view
		});
	}

	private setSelectedPartyID(id: string | null) {
		this.setState({
			selectedPartyID: id
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
			const partyTabs = ['party breakdown'];
			if (this.props.showAwards) {
				partyTabs.push('awards');
			}

			return (
				<Row gutter={10} className='full-height'>
					<Col span={16} className='full-height'>
						<Tabs
							options={referenceTabs}
							selectedID={this.state.referenceView}
							onSelect={view => this.setReferenceView(view)}
						/>
						<div className='scrollable' style={{ height: 'calc(100% - 52px)' }}>
							<Conditional display={this.state.referenceView === 'skills'}>
								<MarkdownReference filename='/dojo/data/skills.md' />
							</Conditional>
							<Conditional display={this.state.referenceView === 'conditions'}>
								<MarkdownReference filename='/dojo/data/conditions.md' />
							</Conditional>
							<Conditional display={this.state.referenceView === 'actions'}>
								<MarkdownReference filename='/dojo/data/actions.md' />
							</Conditional>
						</div>
					</Col>
					<Col span={8} className='full-height'>
						<Tabs
							options={Utils.arrayToItems(partyTabs)}
							selectedID={this.state.partyView}
							onSelect={view => this.setPartyView(view)}
						/>
						<div className='scrollable' style={{ height: 'calc(100% - 52px)' }}>
							<Conditional display={this.state.partyView === 'party breakdown'}>
								{this.getPartyHeader()}
								<PartyBreakdownPanel
									party={this.props.parties.find(p => p.id === this.state.selectedPartyID) ?? null}
									showAwards={this.props.showAwards}
								/>
							</Conditional>
							<Conditional display={this.state.partyView === 'awards'}>
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
