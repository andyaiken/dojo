import { CaretLeftOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import React from 'react';

import { Comms, CommsDM } from '../../utils/uhura';
import { Utils } from '../../utils/utils';

import { Party, PC } from '../../models/party';

import { PCCard } from '../cards/pc-card';
import { ConfirmButton } from '../controls/confirm-button';
import { Textbox } from '../controls/textbox';
import { GridPanel } from '../panels/grid-panel';
import { Note } from '../panels/note';

interface Props {
	party: Party;
	goBack: () => void;
	removeParty: () => void;
	addPC: () => void;
	importPC: () => void;
	editPC: (pc: PC) => void;
	updatePC: (pc: PC) => void;
	removePC: (pc: PC) => void;
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

	private export(pc: PC) {
		const filename = pc.name + '.pc';
		Utils.saveFile(filename, pc);
	}

	public render() {
		try {
			const activePCs = this.props.party.pcs.filter(pc => pc.active);
			const activeCards: JSX.Element[] = [];
			activePCs.forEach(activePC => {
				activeCards.push(
					<PCCard
						pc={activePC}
						mode={'edit'}
						changeValue={(pc, type, value) => this.props.changeValue(pc, type, value)}
						editPC={pc => this.props.editPC(pc)}
						updatePC={pc => this.props.updatePC(pc)}
						exportPC={pc => this.export(pc)}
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
						mode={'edit'}
						changeValue={(pc, type, value) => this.props.changeValue(pc, type, value)}
						editPC={pc => this.props.editPC(pc)}
						updatePC={pc => this.props.updatePC(pc)}
						exportPC={pc => this.export(pc)}
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
						<PartyInfo
							party={this.props.party}
							goBack={() => this.props.goBack()}
							changeValue={(type, value) => this.props.changeValue(this.props.party, type, value)}
							addPC={() => this.props.addPC()}
							importPC={() => this.props.importPC()}
							showReference={party => this.props.showReference(party)}
							removeParty={() => this.props.removeParty()}
						/>
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

interface PartyInfoProps {
	party: Party;
	goBack: () => void;
	changeValue: (field: string, value: string) => void;
	addPC: () => void;
	importPC: () => void;
	showReference: (party: Party) => void;
	removeParty: () => void;
}

class PartyInfo extends React.Component<PartyInfoProps> {
	private export() {
		const filename = this.props.party.name + '.party';
		Utils.saveFile(filename, this.props.party);
	}

	public render() {
		try {
			return (
				<div>
					<div className='section'>
						<div className='subheading'>party name</div>
						<Textbox
							text={this.props.party.name}
							placeholder='party name'
							onChange={value => this.props.changeValue('name', value)}
						/>
					</div>
					<hr/>
					<div className='section'>
						<button onClick={() => this.props.addPC()}>add a new pc</button>
						<button onClick={() => this.props.importPC()}>import a pc</button>
						<button onClick={() => this.export()}>export party</button>
						<button onClick={() => this.props.showReference(this.props.party)}>show party reference</button>
						<ConfirmButton text='delete party' onConfirm={() => this.props.removeParty()} />
						<hr/>
						<button onClick={() => this.props.goBack()}><CaretLeftOutlined style={{ fontSize: '10px' }} /> back to the list</button>
					</div>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
