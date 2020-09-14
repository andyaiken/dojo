import { FileOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import React from 'react';

import { Comms, CommsDM } from '../../../utils/comms';

import Checkbox from '../../controls/checkbox';
import Selector from '../../controls/selector';
import Note from '../../panels/note';
import PDF from '../../panels/pdf';
import Popout from '../../panels/popout';

interface Props {
}

interface State {
	mode: string;
	filename: string | null;
	data: string | null;
	pageCount: number;
	page: number;
	playerViewOpen: boolean;
}

export default class HandoutTool extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			mode: 'image',
			filename: null,
			data: null,
			pageCount: 1,
			page: 1,
			playerViewOpen: false
		};
	}

	private setMode(mode: string) {
		this.setState({
			mode: mode
		});
	}

	private setPageCount(count: number) {
		this.setState({
			pageCount: count
		});
	}

	private nudgePage(delta: number) {
		let page = Math.max(1, this.state.page + delta);
		page = Math.min(this.state.pageCount, page);
		this.setState({
			page: page
		});
	}

	private readFile(file: File) {
		const reader = new FileReader();
		reader.onload = progress => {
			if (progress.target) {
				const data = progress.target.result as string;

				this.setState({
					filename: file.name,
					data: data
				});
			}
		};
		reader.readAsDataURL(file);
		return false;
	}

	private setPlayerViewOpen(open: boolean) {
		this.setState({
			playerViewOpen: open
		});
	}

	private clear() {
		if (Comms.data.shared.type === 'handout') {
			CommsDM.shareNothing();
		}

		this.setState({
			filename: null,
			data: null,
			playerViewOpen: false
		});
	}

	private getAccept() {
		switch (this.state.mode) {
			case 'image':
				return 'image/*';
			case 'audio':
				return 'audio/*';
			case 'video':
				return 'video/*';
			case 'pdf':
				return '.pdf';
		}

		return undefined;
	}

	private getDisplay() {
		switch (this.state.mode) {
			case 'image':
				return (
					<img
						className='nonselectable-image'
						src={this.state.data || ''}
						alt={this.state.filename || ''}
					/>
				);
			case 'audio':
				return (
					<audio controls={true}>
						<source src={this.state.data || ''} />
					</audio>
				);
			case 'video':
				return (
					<video controls={true}>
						<source src={this.state.data || ''} />
					</video>
				);
			case 'pdf':
				return (
					<PDF src={this.state.data || ''} />
				);
		}

		return null;
	}

	private getPlayerView() {
		if (this.state.playerViewOpen) {
			return (
				<Popout title='Handout' onCloseWindow={() => this.setPlayerViewOpen(false)}>
					{this.getDisplay()}
				</Popout>
			);
		}

		return null;
	}

	public render() {
		try {
			let content = null;
			if (this.state.data) {
				content = (
					<div>
						{this.getDisplay()}
						<hr/>
						<Checkbox
							label='share in player view'
							checked={this.state.playerViewOpen}
							onChecked={value => this.setPlayerViewOpen(value)}
						/>
						<Checkbox
							label='share in session'
							disabled={CommsDM.getState() !== 'started'}
							checked={Comms.data.shared.type === 'handout'}
							onChecked={value => value ? CommsDM.shareHandout(this.state.mode, this.state.filename as string, this.state.data as string) : CommsDM.shareNothing()}
						/>
						<hr/>
						<button onClick={() => this.clear()}>change handout</button>
					</div>
				);
			} else {
				content = (
					<div>
						<Note>
							<p>you can use this tool to select a file and show it to your players</p>
						</Note>
						<Selector
							options={['image', 'audio', 'video', 'pdf'].map(o => ({ id: o, text: o }))}
							selectedID={this.state.mode}
							onSelect={mode => this.setMode(mode)}
						/>
						<Upload.Dragger accept={this.getAccept()} showUploadList={false} beforeUpload={file => this.readFile(file)}>
							<p className='ant-upload-drag-icon'>
								<FileOutlined />
							</p>
							<p className='ant-upload-text'>
								click here, or drag a file here, to upload it
							</p>
						</Upload.Dragger>
					</div>
				);
			}

			return (
				<div>
					{content}
					{this.getPlayerView()}
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}
