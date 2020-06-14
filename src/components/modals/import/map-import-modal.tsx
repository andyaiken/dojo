import { FileOutlined } from '@ant-design/icons';
import { Col, notification, Row, Upload } from 'antd';
import React from 'react';

import Factory from '../../../utils/factory';
import Utils from '../../../utils/utils';

import { Map } from '../../../models/map';

import NumberSpin from '../../controls/number-spin';
import Textbox from '../../controls/textbox';
import MapPanel from '../../panels/map-panel';
import Note from '../../panels/note';

interface Props {
	map: Map;
}

interface State {
	map: Map;
	imageID: string | null;
	size: number;
	square: number;
	imageDimensions: {
		width: number,
		height: number;
	};
	mapDimensions: {
		width: number,
		height: number;
	};
}

export default class MapImportModal extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			map: props.map,
			imageID: null,
			size: 0,
			square: 0,
			imageDimensions: {
				width: 0,
				height: 0
			},
			mapDimensions: {
				width: 0,
				height: 0
			}
		};
	}

	private readFile(file: File) {
		const reader = new FileReader();
		reader.onload = progress => {
			if (progress.target) {
				const content = progress.target.result as string;

				if (this.state.imageID) {
					// Remove previous image from localStorage
					window.localStorage.removeItem('image-' + this.state.imageID);
				}

				try {
					const image = {
						id: Utils.guid(),
						name:  file.name,
						data: content
					};
					const json = JSON.stringify(image);
					window.localStorage.setItem('image-' + image.id, json);

					const img = new Image();
					img.onload = () => {
						// Assume a map will be 10 squares on its smallest side
						const square = Math.round(Math.min(img.width, img.height) / 10);
						this.setState({
							imageID: image.id,
							size: content.length,
							square: square,
							imageDimensions: {
								width: img.width,
								height: img.height
							},
							mapDimensions: {
								width: Math.round(img.width / square),
								height: Math.round(img.height / square)
							}
						}, () => {
							this.updateMap(image.name);
						});
					};
					img.src = content;
				} catch {
					// ERROR: Quota exceeded (probably)
					notification.open({
						message: 'can\'t upload this image',
						description: 'not enough storage space for this image ('
							+ Utils.toData(content.length)
							+ '); try reducing the resolution or removing unused images'
					});
				}
			}
		};
		reader.readAsDataURL(file);
		return false;
	}

	private nudgeSquare(delta: number) {
		const square = Math.max(0, this.state.square + delta);

		this.setState({
			square: square,
			mapDimensions: {
				width: Math.round(this.state.imageDimensions.width / square),
				height: Math.round(this.state.imageDimensions.height / square)
			}
		}, () => {
			this.updateMap(null);
		});
	}

	private nudgeWidth(delta: number) {
		const width = Math.max(0, this.state.mapDimensions.width + delta);
		this.setState({
			mapDimensions: {
				width: width,
				height: this.state.mapDimensions.height
			}
		}, () => {
			this.updateMap(null);
		});
	}

	private nudgeHeight(delta: number) {
		const height = Math.max(0, this.state.mapDimensions.height + delta);
		this.setState({
			mapDimensions: {
				width: this.state.mapDimensions.width,
				height: height
			}
		}, () => {
			this.updateMap(null);
		});
	}

	private updateMap(name: string | null) {
		const map = this.state.map;
		if (name) {
			map.name = name;
		}
		if (this.state.imageID) {
			const tile = Factory.createMapItem();
			tile.type = 'tile';
			tile.terrain = 'custom';
			tile.customBackground = this.state.imageID;
			tile.width = this.state.mapDimensions.width;
			tile.height = this.state.mapDimensions.height;

			map.items = [tile];
		} else {
			map.items = [];
		}

		this.setState({
			map: map
		});
	}

	public render() {
		try {
			let content = null;
			if (this.state.imageID && this.state.imageDimensions) {
				content = (
					<div>
						<Note>
							<div className='section'>
								this image is {Utils.toData(this.state.size)}
							</div>
							<div className='section'>
								set the name and dimensions of this map image
							</div>
							<div className='section'>
								changing the size of a map square, in pixels, will change the map's dimensions
							</div>
							<div className='section'>
								you can then fine-tune the exact width and height of the map
							</div>
						</Note>
						<div className='subheading'>map name</div>
						<Textbox
							text={this.state.map.name}
							placeholder='map name'
							onChange={value => this.updateMap(value)}
						/>
						<div className='subheading'>map square size</div>
						<NumberSpin
							value={this.state.square + ' px'}
							label='square size'
							factors={[1, 10]}
							downEnabled={this.state.square > 1}
							onNudgeValue={delta => this.nudgeSquare(delta)}
						/>
						<div className='subheading'>map dimensions</div>
						<NumberSpin
							value={this.state.mapDimensions.width + ' sq'}
							label='width'
							downEnabled={this.state.mapDimensions.width > 1}
							onNudgeValue={delta => this.nudgeWidth(delta)}
						/>
						<NumberSpin
							value={this.state.mapDimensions.height + ' sq'}
							label='height'
							downEnabled={this.state.mapDimensions.height > 1}
							onNudgeValue={delta => this.nudgeHeight(delta)}
						/>
					</div>
				);
			} else {
				content = (
					<div>
						<Note>
							<div className='section'>
								select the file you want to upload
							</div>
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
				<Row className='full-height'>
					<Col span={8} className='scrollable'>
						{content}
					</Col>
					<Col span={16} className='scrollable both-ways'>
						<MapPanel
							map={this.state.map}
							mode='edit'
							showGrid={true}
							gridSquareClicked={(x, y) => null}
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
