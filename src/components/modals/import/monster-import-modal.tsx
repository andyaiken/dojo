import { FileOutlined } from '@ant-design/icons';
import { Col, Row, Upload } from 'antd';
import React from 'react';

import { Frankenstein } from '../../../utils/frankenstein';

import { Monster } from '../../../models/monster';

import { RenderError } from '../../error';
import { MonsterStatblockCard } from '../../cards/monster-statblock-card';
import { Note } from '../../controls/note';
import { Tabs } from '../../controls/tabs';
import { Textbox } from '../../controls/textbox';

interface Props {
	monster: Monster;
}

interface State {
	view: 'paste' | 'upload';
	source: string;
	monster: Monster;
}

export class MonsterImportModal extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			view: 'paste',
			source: '',
			monster: props.monster
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
		Frankenstein.import(this.state.source, this.state.monster);
		this.setState({
			monster: this.state.monster
		});
	}

	private readFile(file: File) {
		file.text().then(json => {
			const monster: Monster = JSON.parse(json);
			// Copy everything (except id and portrait) from this monster into the state monster
			Object.keys(monster).forEach(key => {
				if ((key !== 'id') && (key !== 'portrait')) {
					const value = (monster as any)[key];
					(this.state.monster as any)[key] = value;
				}
			});
			this.setState({
				monster: this.state.monster
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
							<Upload.Dragger accept='.monster' showUploadList={false} beforeUpload={file => this.readFile(file)}>
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
