import { FileOutlined } from '@ant-design/icons';
import { notification, Upload } from 'antd';
import React from 'react';

import Sherlock from '../../utils/sherlock';
import Utils from '../../utils/utils';

import Textbox from '../controls/textbox';
import Note from '../panels/note';

interface Props {
	select: (id: string) => void;
	cancel: () => void;
}

interface State {
	images: SavedImage[];
	filter: string;
}

interface SavedImage {
	id: string;
	name: string;
	data: string;
}

export default class ImageSelectionModal extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			images: this.listImages(),
			filter: ''
		};
	}

	private listImages() {
		const images: SavedImage[] = [];
		for (let n = 0; n !== window.localStorage.length; ++n) {
			const key = window.localStorage.key(n);
			if (key && key.startsWith('image-')) {
				const data = window.localStorage.getItem(key);
				if (data) {
					const img = JSON.parse(data);
					images.push({
						id: img.id,
						name: img.name,
						data: img.data
					});
				}
			}
		}

		return Utils.sort(images, [{ field: 'name', dir: 'asc'}]);
	}

	private setFilter(text: string) {
		this.setState({
			filter: text
		});
	}

	private readFile(file: File) {
		const reader = new FileReader();
		reader.onload = progress => {
			if (progress.target) {
				const content = progress.target.result as string;
				const image = {
					id: Utils.guid(),
					name: file.name,
					data: content
				};

				try {
					const json = JSON.stringify(image);
					window.localStorage.setItem('image-' + image.id, json);

					this.setState({
						images: this.listImages()
					});
				} catch {
					// ERROR: Quota exceeded (probably)
					notification.open({
						message: 'can\'t upload this image',
						description: 'not enough storage space; try reducing the resolution or removing unused images'
					});
				}
			}
		};
		reader.readAsDataURL(file);
		return false;
	}

	public render() {
		try {
			const images = this.state.images
				.filter(img => Sherlock.match(this.state.filter, img.name))
				.map(img => (
					<div key={img.id} className='group-panel'>
						<div className='subheading'>{img.name}</div>
						<img
							className='section selectable-image'
							src={img.data}
							alt={img.name}
							onClick={() => this.props.select ? this.props.select(img.id) : null}
						/>
					</div>
				));

			if (images.length === 0) {
				images.push(
					<Note key='empty'>no images</Note>
				);
			}

			if (this.state.images.length > 0) {
				images.unshift(
					<Textbox
						key='search'
						text={this.state.filter}
						placeholder='search for an image'
						onChange={value => this.setFilter(value)}
					/>
				);
			}

			return (
				<div className='full-height'>
					<div className='drawer-header'><div className='app-title'>select image</div></div>
					<div className='drawer-content'>
						<div className='scrollable'>
							<div>
								<Upload.Dragger accept='image/*' showUploadList={false} beforeUpload={file => this.readFile(file)}>
									<p className='ant-upload-drag-icon'>
										<FileOutlined />
									</p>
									<p className='ant-upload-text'>
										click here, or drag a file here, to upload it
									</p>
								</Upload.Dragger>
							</div>
							{images}
						</div>
					</div>
					<div className='drawer-footer'>
						<button onClick={() => this.props.cancel ? this.props.cancel() : null}>cancel</button>
					</div>
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}
