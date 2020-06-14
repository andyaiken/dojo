import { FileOutlined } from '@ant-design/icons';
import { notification, Upload } from 'antd';
import React from 'react';

import Sherlock from '../../utils/sherlock';
import Utils from '../../utils/utils';

import { Combat } from '../../models/combat';
import { Map } from '../../models/map';
import { MonsterGroup } from '../../models/monster';
import { Party } from '../../models/party';

import Textbox from '../controls/textbox';
import Note from '../panels/note';

interface Props {
	parties: Party[];
	library: MonsterGroup[];
	maps: Map[];
	combats: Combat[];
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
	public static defaultProps = {
		parties: [],
		library: [],
		maps: [],
		combats: []
	};

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
					name:  file.name,
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

	private delete(id: string) {
		window.localStorage.removeItem('image-' + id);

		this.setState({
			images: this.listImages()
		});
	}

	public render() {
		try {
			const images = this.state.images
				.filter(img => Sherlock.match(this.state.filter, img.name))
				.map(img => {
					let deleteBtn = null;
					const data = this.props.parties.length + this.props.library.length + this.props.maps.length + this.props.combats.length;
					if (data > 0) {
						// Work out if the image is used in a PC, a monster, or a map tile
						let used = false;
						this.props.parties.forEach(party => {
							if (party.pcs.find(pc => pc.portrait === img.id)) {
								used = true;
							}
						});
						this.props.library.forEach(group => {
							if (group.monsters.find(monster => monster.portrait === img.id)) {
								used = true;
							}
						});
						this.props.maps.forEach(map => {
							if (map.items.find(mi => mi.customBackground === img.id)) {
								used = true;
							}
						});
						this.props.combats.forEach(combat => {
							if (combat.map && combat.map.items.find(mi => mi.customBackground === img.id)) {
								used = true;
							}
						});

						if (!used) {
							deleteBtn = (
								<div>
									<Note>not used ({Utils.toData(img.data.length)})</Note>
									<button onClick={() => this.delete(img.id)}>delete this image</button>
								</div>
							);
						}
					}

					return (
						<div key={img.id} className='group-panel'>
							<div className='subheading'>{img.name}</div>
							<img className='section selectable-image' src={img.data} alt={img.name} onClick={() => this.props.select(img.id)} />
							{deleteBtn}
						</div>
					);
				});

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
						<button onClick={() => this.props.cancel()}>cancel</button>
					</div>
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}
