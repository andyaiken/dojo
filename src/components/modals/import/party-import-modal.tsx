import { FileOutlined } from '@ant-design/icons';
import { Col, Row, Upload } from 'antd';
import React from 'react';

import { Hero } from '../../../utils/hero';
import { Utils } from '../../../utils/utils';

import { Party } from '../../../models/party';

import { PCStatblockCard } from '../../cards/pc-statblock-card';
import { Tabs } from '../../controls/tabs';
import { Textbox } from '../../controls/textbox';
import { GridPanel } from '../../panels/grid-panel';
import { Note } from '../../panels/note';

interface Props {
	party: Party;
}

interface State {
	view: 'paste' | 'upload';
	source: string;
	party: Party;
}

export class PartyImportModal extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			view: 'paste',
			source: '',
			party: props.party
		};
	}

	private setView(view: string) {
		this.setState({
			view: view as 'paste' | 'upload'
		});
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

	private readFile(file: File) {
		file.text().then(json => {
			const party: Party = JSON.parse(json);
			// Copy everything (except id) from this party into the state party
			Object.keys(party).forEach(key => {
				if (key !== 'id') {
					const value = (party as any)[key];
					(this.state.party as any)[key] = value;
				}
			});
			// Don't import any IDs or portraits
			this.state.party.pcs.forEach(pc => {
				pc.id = Utils.guid();
				pc.portrait = '';
			});
			this.setState({
				party: this.state.party
			});
		});
		return false;
	}

	public render() {
		try {
			const options = ['paste', 'upload'].map(o => ({ id: o, text: o}));

			let content = null;
			switch (this.state.view) {
				case 'paste':
					content = (
						<div>
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
						</div>
					);
					break;
				case 'upload':
					content = (
						<div>
							<Note>
								<div className='section'>
									select the file you want to upload
								</div>
							</Note>
							<Upload.Dragger accept='.party' showUploadList={false} beforeUpload={file => this.readFile(file)}>
								<p className='ant-upload-drag-icon'>
									<FileOutlined />
								</p>
								<p className='ant-upload-text'>
									click here, or drag a file here, to upload it
								</p>
							</Upload.Dragger>
						</div>
					);
					break;
			}

			return (
				<Row className='full-height'>
					<Col span={12} className='scrollable'>
						<Tabs options={options} selectedID={this.state.view} onSelect={id => this.setView(id)} />
						{content}
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
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}
