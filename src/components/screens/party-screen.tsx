import { CaretLeftOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import React from 'react';

import { Comms, CommsDM } from '../../utils/uhura';

import { Encounter } from '../../models/encounter';
import { Map } from '../../models/map';
import { Party, PC } from '../../models/party';

import { PCCard } from '../cards/pc-card';
import { Textbox } from '../controls/textbox';
import { PartyOptions } from '../options/party-options';
import { RenderError } from '../panels/error-boundary';
import { GridPanel } from '../panels/grid-panel';
import { Note } from '../panels/note';

interface Props {
	party: Party;
	parties: Party[];
	encounters: Encounter[];
	maps: Map[];
	goBack: () => void;
	deleteParty: (party: Party) => void;
	addPC: () => void;
	importPC: () => void;
	editPC: (pc: PC) => void;
	updatePC: (pc: PC) => void;
	deletePC: (pc: PC) => void;
	clonePC: (pc: PC, name: string) => void;
	moveToParty: (pc: PC, partyID: string) => void;
	createEncounter: (partyID: string) => void;
	startEncounter: (partyID: string, encounterID: string) => void;
	startExploration: (partyID: string, mapID: string) => void;
	setLevel: (party: Party, level: number) => void;
	showReference: (party: Party) => void;
	changeValue: (source: any, field: string, value: any) => void;
	nudgeValue: (source: any, field: string, value: number) => void;
}

export class PartyScreen extends React.Component<Props> {
	public componentDidUpdate() {
		if (Comms.data.party) {
			CommsDM.sendPartyUpdate();
		}
	}

	public render() {
		try {
			const activePCs = this.props.party.pcs.filter(pc => pc.active);
			const activeCards: JSX.Element[] = [];
			activePCs.forEach(activePC => {
				activeCards.push(
					<PCCard
						pc={activePC}
						parties={this.props.parties}
						changeValue={(pc, type, value) => this.props.changeValue(pc, type, value)}
						editPC={pc => this.props.editPC(pc)}
						updatePC={pc => this.props.updatePC(pc)}
						deletePC={pc => this.props.deletePC(pc)}
						clonePC={(pc, name) => this.props.clonePC(pc, name)}
						moveToParty={(pc, partyID) => this.props.moveToParty(pc, partyID)}
					/>
				);
			});

			const inactivePCs = this.props.party.pcs.filter(pc => !pc.active);
			const inactiveCards: JSX.Element[] = [];
			inactivePCs.forEach(inactivePC => {
				inactiveCards.push(
					<PCCard
						pc={inactivePC}
						parties={this.props.parties}
						changeValue={(pc, type, value) => this.props.changeValue(pc, type, value)}
						editPC={pc => this.props.editPC(pc)}
						updatePC={pc => this.props.updatePC(pc)}
						deletePC={pc => this.props.deletePC(pc)}
						clonePC={(pc, name) => this.props.clonePC(pc, name)}
						moveToParty={(pc, partyID) => this.props.moveToParty(pc, partyID)}
					/>
				);
			});

			if (activePCs.length === 0) {
				activeCards.push(
					<Note><div className='section'>there are no pcs in this party</div></Note>
				);
			}

			return (
				<Row className='full-height'>
					<Col span={6} className='scrollable sidebar sidebar-left'>
						<div className='section'>
							<div className='subheading'>party name</div>
							<Textbox
								text={this.props.party.name}
								placeholder='party name'
								onChange={value => this.props.changeValue(this.props.party, 'name', value)}
							/>
						</div>
						<hr/>
						<PartyOptions
							party={this.props.party}
							encounters={this.props.encounters}
							maps={this.props.maps}
							addPC={() => this.props.addPC()}
							importPC={() => this.props.importPC()}
							createEncounter={partyID => this.props.createEncounter(partyID)}
							startEncounter={(partyID, encounterID) => this.props.startEncounter(partyID, encounterID)}
							startExploration={(partyID, mapID) => this.props.startExploration(partyID, mapID)}
							setLevel={(party, level) => this.props.setLevel(party, level)}
							showReference={party => this.props.showReference(party)}
							deleteParty={party => this.props.deleteParty(party)}
						/>
						<hr/>
						<button onClick={() => this.props.goBack()}><CaretLeftOutlined style={{ fontSize: '10px' }} /> back to the list</button>
					</Col>
					<Col span={18} className='scrollable'>
						<GridPanel
							content={activeCards}
							heading={this.props.party.name || 'unnamed party'}
						/>
						<GridPanel
							content={inactiveCards}
							heading='inactive pcs'
						/>
					</Col>
				</Row>
			);
		} catch (e) {
			console.error(e);
			return <RenderError error={e} />;
		}
	}
}
