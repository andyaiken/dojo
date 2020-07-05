import { FileOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import React from 'react';

import Checkbox from '../../controls/checkbox';
import Note from '../../panels/note';
import Popout from '../../panels/popout';

interface Props {
}

interface State {
	filename: string | null;
	data: string | null;
	playerViewOpen: boolean;
}

export default class HandoutTool extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			filename: null,
			data: null,
			playerViewOpen: false
		};
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
		this.setState({
			filename: null,
			data: null,
			playerViewOpen: false
		});
	}

	private getPlayerView() {
		if (this.state.playerViewOpen) {
			return (
				<Popout title='Handout' onCloseWindow={() => this.setPlayerViewOpen(false)}>
					<img
						className='nonselectable-image'
						src={this.state.data || ''}
						alt={this.state.filename || ''}
					/>
				</Popout>
			);
		}

		return null;
	}

	public render() {
		try {
			let image = null;
			if (this.state.data) {
				image = (
					<div>
						<img
							className='nonselectable-image'
							src={this.state.data || ''}
							alt={this.state.filename || ''}
						/>
						<Checkbox
							label='show player view'
							checked={this.state.playerViewOpen}
							onChecked={value => this.setPlayerViewOpen(value)}
						/>
						<button onClick={() => this.clear()}>change handout</button>
					</div>
				);
			} else {
				image = (
					<div>
						<Note>
							<p>you can use this tool to select an image and show it to your players</p>
						</Note>
						<Upload.Dragger accept='image/*' showUploadList={false} beforeUpload={file => this.readFile(file)}>
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
					{image}
					{this.getPlayerView()}
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}
