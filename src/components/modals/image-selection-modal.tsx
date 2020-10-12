import { CloseCircleOutlined, FileOutlined } from '@ant-design/icons';
import { notification, Upload } from 'antd';
import React from 'react';

import { Matisse } from '../../utils/matisse';
import { Sherlock } from '../../utils/sherlock';
import { Utils } from '../../utils/utils';

import { SavedImage } from '../../models/misc';

import { Textbox } from '../controls/textbox';
import { Note } from '../panels/note';

interface Props {
	select: (id: string) => void;
}

interface State {
	images: SavedImage[];
	filter: string;
}

export class ImageSelectionModal extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			images: Matisse.allImages(),
			filter: ''
		};
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
				try {
					const content = progress.target.result as string;
					Matisse.saveImage(Utils.guid(), file.name, content);
					this.setState({
						images: Matisse.allImages()
					});
				} catch {
					// ERROR: Quota exceeded (probably)
					notification.open({
						message: 'can\'t upload this image',
						description: 'not enough storage space; try reducing the resolution or removing unused images',
						closeIcon: <CloseCircleOutlined />,
						duration: 5
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
				<div className='scrollable'>
					<div>
						<Upload.Dragger accept='image/*' showUploadList={false} beforeUpload={file => this.readFile(file)}>
							<p className='ant-upload-drag-icon'>
								<FileOutlined />
							</p>
							<p className='ant-upload-text'>
								click here, or drag a file here, to upload it
							</p>
							<p className='ant-upload-text'>
								try to upload small images if possible
							</p>
						</Upload.Dragger>
					</div>
					{images}
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}
