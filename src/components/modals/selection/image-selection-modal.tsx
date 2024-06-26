import { FileOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import React from 'react';

import { Sherlock } from '../../../utils/sherlock';
import { Utils } from '../../../utils/utils';

import { SavedImage } from '../../../models/misc';

import { RenderError } from '../../error';
import { Group } from '../../controls/group';
import { Note } from '../../controls/note';
import { Textbox } from '../../controls/textbox';

interface Props {
	images: SavedImage[];
	select: (id: string) => void;
	addImage: (id: string, fileName: string, content: string) => void;
}

interface State {
	filter: string;
}

export class ImageSelectionModal extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
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
				const content = progress.target.result as string;
				this.props.addImage(Utils.guid(), file.name, content);
			}
		};
		reader.readAsDataURL(file);
		return false;
	}

	public render() {
		try {
			const images = this.props.images
				.filter(img => Sherlock.match(this.state.filter, img.name))
				.map(img => (
					<Group key={img.id} onClick={() => this.props.select ? this.props.select(img.id) : null}>
						<div className='subheading'>{img.name}</div>
						<img
							className='section nonselectable-image'
							src={img.data}
							alt={img.name}
						/>
					</Group>
				));

			if (images.length === 0) {
				images.push(
					<Note key='empty'>
						<div className='section'>no images</div>
					</Note>
				);
			}

			if (this.props.images.length > 0) {
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
						</Upload.Dragger>
					</div>
					{images}
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='ImageSelectionModal' error={e} />;
		}
	}
}
