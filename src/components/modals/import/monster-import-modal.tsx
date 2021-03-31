import { Col, Row } from 'antd';
import React from 'react';

import { Frankenstein } from '../../../utils/frankenstein';

import { Monster } from '../../../models/monster';

import { RenderError } from '../../error';
import { MonsterStatblockCard } from '../../cards/monster-statblock-card';
import { Note } from '../../controls/note';
import { Textbox } from '../../controls/textbox';

interface Props {
	monster: Monster;
}

interface State {
	source: string;
	monster: Monster;
}

export class MonsterImportModal extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			source: '',
			monster: props.monster
		};
	}

	private setSource(source: string) {
		this.setState({
			source: source
		});
	}

	private analyse() {
		Frankenstein.import(this.state.source, this.state.monster);
		this.setState({
			monster: this.state.monster
		});
	}

	public render() {
		try {
			return (
				<Row className='full-height'>
					<Col span={12} className='scrollable'>
						<Note>
							<div className='section'>
								go to the following link to find the monster you want to import
							</div>
							<div className='section'>
								<a href='https://www.dndbeyond.com/monsters' target='_blank' rel='noopener noreferrer'>
									https://www.dndbeyond.com/monsters
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
					<Col span={12} className='scrollable' style={{ padding: '5px' }}>
						<MonsterStatblockCard monster={this.state.monster} />
					</Col>
				</Row>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='MonsterImportModal' error={e} />;
		}
	}
}
