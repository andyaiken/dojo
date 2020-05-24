import { Col, Row } from 'antd';
import React from 'react';

import Utils from '../../utils/utils';

import { Party, PC } from '../../models/party';

import PartyCard from '../cards/party-card';
import GridPanel from '../panels/grid-panel';
import Note from '../panels/note';

interface Props {
	parties: Party[];
	addParty: () => void;
	importParty: () => void;
	selectParty: (party: Party) => void;
	deleteParty: (party: Party) => void;
	openStatBlock: (pc: PC) => void;
}

export default class PartyListScreen extends React.Component<Props> {
	public render() {
		try {
			const parties = this.props.parties;
			Utils.sort(parties);
			const listItems = parties.map(p => (
				<PartyCard
					key={p.id}
					party={p}
					open={party => this.props.selectParty(party)}
					delete={party => this.props.deleteParty(party)}
					openStatBlock={pc => this.props.openStatBlock(pc)}
				/>
			));

			return (
				<Row className='full-height'>
					<Col xs={12} sm={12} md={8} lg={6} xl={4} className='scrollable sidebar sidebar-left'>
						<Note>
							<div className='section'>this page is where you can tell dojo all about your pcs</div>
							<div className='section'>you can add a party for each of your gaming groups</div>
							<div className='section'>when you have set up a party and an encounter you can run the encounter in the combat manager</div>
							<hr/>
							<div className='section'>on the right you will see a list of parties that you have created</div>
							<div className='section'>select a party from the list to see pc details</div>
							<hr/>
							<div className='section'>to start adding a party, press the <b>create a new party</b> button</div>
						</Note>
						<button onClick={() => this.props.addParty()}>create a new party</button>
						<button onClick={() => this.props.importParty()}>import a party</button>
					</Col>
					<Col xs={12} sm={12} md={16} lg={18} xl={20} className='scrollable'>
						<GridPanel heading='parties' content={listItems} />
					</Col>
				</Row>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
