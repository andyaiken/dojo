import { Col, Row } from 'antd';
import React from 'react';

import { Hero } from '../../../utils/hero';

import { PC } from '../../../models/party';

import { RenderError } from '../../error';
import { PCStatblockCard } from '../../cards/pc-statblock-card';
import { Note } from '../../controls/note';
import { Textbox } from '../../controls/textbox';

interface Props {
	pc: PC;
}

interface State {
	source: string;
	pc: PC;
}

export class PCImportModal extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			source: '',
			pc: props.pc
		};
	}

	private setSource(source: string) {
		this.setState({
			source: source
		});
	}

	private analyse() {
		Hero.importPC(this.state.source, this.state.pc);
		this.setState({
			pc: this.state.pc
		});
	}

	public render() {
		try {
			return (
				<Row className='full-height'>
					<Col span={12} className='scrollable'>
						<Note>
							<div className='section'>
								go to the following link to find the pc you want to import
							</div>
							<div className='section'>
								<a href='https://www.dndbeyond.com/' target='_blank' rel='noopener noreferrer'>
									https://www.dndbeyond.com/
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
						<PCStatblockCard pc={this.state.pc} />
					</Col>
				</Row>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='PCImportModal' error={e} />;
		}
	}
}
