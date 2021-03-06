import { Col, Row } from 'antd';
import React from 'react';

import { Hero } from '../../../utils/hero';

import { Party } from '../../../models/party';

import { RenderError } from '../../error';
import { PCStatblockCard } from '../../cards/pc-statblock-card';
import { Note } from '../../controls/note';
import { Textbox } from '../../controls/textbox';
import { GridPanel } from '../../panels/grid-panel';

interface Props {
	party: Party;
}

interface State {
	source: string;
	party: Party;
}

export class PartyImportModal extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			source: '',
			party: props.party
		};
	}

	private setSource(source: string) {
		this.setState({
			source: source
		});
	}

	private analyse() {
		Hero.importParty(this.state.source, this.state.party);
		this.setState({
			party: this.state.party
		});
	}

	public render() {
		try {
			return (
				<Row className='full-height'>
					<Col span={12} className='scrollable'>
						<Note>
							<div className='section'>
								go to the following link to find the party you want to import
							</div>
							<div className='section'>
								<a href='https://www.dndbeyond.com/my-campaigns' target='_blank' rel='noopener noreferrer'>
									https://www.dndbeyond.com/my-campaigns
								</a>
							</div>
							<div className='section'>
								then right-click on the page and select <b>view page source</b>
							</div>
							<div className='section'>
								copy the entire page source into the clipboard, paste it into the box below, and press the analyse button
							</div>
						</Note>
						<Textbox
							text={this.state.source}
							placeholder='paste page source here'
							multiLine={true}
							onChange={value => this.setSource(value)}
						/>
						<button onClick={() => this.analyse()}>analyse</button>
					</Col>
					<Col span={12} className='scrollable'>
						<GridPanel
							heading={this.props.party.name}
							columns={1}
							content={this.props.party.pcs.map(pc => <PCStatblockCard key={pc.id} pc={pc} />)}
						/>
					</Col>
				</Row>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='PartyImportModal' error={e} />;
		}
	}
}
