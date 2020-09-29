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
import { GridPanel } from '../panels/grid-panel';
import { Note } from '../panels/note';

interface Props {
	party: Party;
	encounters: Encounter[];
	maps: Map[];
	goBack: () => void;
	removeParty: (party: Party) => void;
	addPC: () => void;
	importPC: () => void;
	editPC: (pc: PC) => void;
	updatePC: (pc: PC) => void;
	removePC: (pc: PC) => void;
	runEncounter: (partyID: string, encounterID: string) => void;
	explore: (partyID: string, mapID: string) => void;
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
						changeValue={(pc, type, value) => this.props.changeValue(pc, type, value)}
						editPC={pc => this.props.editPC(pc)}
						updatePC={pc => this.props.updatePC(pc)}
						removePC={pc => this.props.removePC(pc)}
					/>
				);
			});

			const inactivePCs = this.props.party.pcs.filter(pc => !pc.active);
			const inactiveCards: JSX.Element[] = [];
			inactivePCs.forEach(inactivePC => {
				inactiveCards.push(
					<PCCard
						pc={inactivePC}
						changeValue={(pc, type, value) => this.props.changeValue(pc, type, value)}
						editPC={pc => this.props.editPC(pc)}
						updatePC={pc => this.props.updatePC(pc)}
						removePC={pc => this.props.removePC(pc)}
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
							runEncounter={(partyID, encounterID) => this.props.runEncounter(partyID, encounterID)}
							explore={(partyID, mapID) => this.props.explore(partyID, mapID)}
							showReference={party => this.props.showReference(party)}
							delete={party => this.props.removeParty(party)}
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
			return <div className='render-error'/>;
		}
	}
}
