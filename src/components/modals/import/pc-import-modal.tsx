import { FileOutlined } from '@ant-design/icons';
import { Col, Row, Upload } from 'antd';
import React from 'react';

import { Hero } from '../../../utils/hero';
import { Utils } from '../../../utils/utils';

import { PC } from '../../../models/party';

import { RenderError } from '../../error';
import { PCStatblockCard } from '../../cards/pc-statblock-card';
import { Note } from '../../controls/note';
import { Tabs } from '../../controls/tabs';
import { Textbox } from '../../controls/textbox';

interface Props {
	pc: PC;
}

interface State {
	view: 'paste' | 'upload';
	source: string;
	pc: PC;
}

export class PCImportModal extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			view: 'paste',
			source: '',
			pc: props.pc
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
		Hero.importPC(this.state.source, this.state.pc);
		this.setState({
			pc: this.state.pc
		});
	}

	private readFile(file: File) {
		file.text().then(json => {
			const pc: PC = JSON.parse(json);
			// Copy everything (except id and portrait) from this pc into the state pc
			Object.keys(pc).forEach(key => {
				if ((key !== 'id') && (key !== 'portrait')) {
					const value = (pc as any)[key];
					(this.state.pc as any)[key] = value;
				}
			});
			this.setState({
				pc: this.state.pc
			});
		});
		return false;
	}

	public render() {
		try {
			let content = null;
			switch (this.state.view) {
				case 'paste':
					let note = null;
					let url = this.state.pc.url;
					if (url !== '') {
						if (!url.endsWith('/')) {
							url += '/';
						}
						url += 'json';

						note = (
							<Note>
								<div className='section'>
									go to the following link
								</div>
								<div className='section'>
									<a href={url} target='_blank' rel='noopener noreferrer'>
										{url}
									</a>
								</div>
								<div className='section'>
									copy the data into the clipboard, paste it into the box below, and press the analyse button
								</div>
							</Note>
						);
					} else {
						note = (
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
						);
					}
					content = (
						<div>
							{note}
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
							<Upload.Dragger accept='.pc' showUploadList={false} beforeUpload={file => this.readFile(file)}>
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
						<Tabs options={Utils.arrayToItems(['paste', 'upload'])} selectedID={this.state.view} onSelect={id => this.setView(id)} />
						{content}
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
