import { FileOutlined } from '@ant-design/icons';
import { Col, Row, Upload } from 'antd';
import React from 'react';

import { Factory } from '../../../utils/factory';
import { Utils } from '../../../utils/utils';

import { Map } from '../../../models/map';

import { RenderError } from '../../error';
import { Note } from '../../controls/note';
import { NumberSpin } from '../../controls/number-spin';
import { Tabs } from '../../controls/tabs';
import { Textbox } from '../../controls/textbox';
import { MapPanel } from '../../panels/map-panel';
import { SavedImage } from '../../../models/misc';

interface Props {
	map: Map;
	images: SavedImage[];
	removeImage: (id: string) => void;
	addImage: (id: string, fileName: string, content: string) => void;
}

interface State {
	mode: string;
	map: Map;
	imageLink: string | null;
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

export class MapImportModal extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			mode: 'link',
			map: props.map,
			imageLink: null,
			imageID: null,
			size: 0,
			square: 0,
			imageDimensions: {
				width: 0,
				height: 0
			},
			mapDimensions: {
				width: 10,
				height: 10
			}
		};
	}

	private readFile(file: File) {
		const reader = new FileReader();
		reader.onload = progress => {
			if (progress.target) {
				const content = progress.target.result as string;

				if (this.state.imageID) {
					this.props.removeImage(this.state.imageID);
				}

				const id = Utils.guid();
				this.props.addImage(id, file.name, content);

				const img = new Image();
				img.onload = () => {
					// Assume a map will be 10 squares on its smallest side
					const square = Math.round(Math.min(img.width, img.height) / 10);
					this.setState({
						imageID: id,
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
						this.updateMap(file.name);
					});
				};
				img.src = content;
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

		if (this.state.imageLink) {
			const tile = Factory.createMapItem();
			tile.type = 'tile';
			tile.terrain = 'link';
			tile.customLink = this.state.imageLink;
			tile.width = this.state.mapDimensions.width;
			tile.height = this.state.mapDimensions.height;

			map.items = [tile];
		} else if (this.state.imageID) {
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
			switch (this.state.mode) {
				case 'link':
					content = (
						<div>
							<Note>
								<div className='section'>
									enter the address, name, and dimensions of the image you want to use
								</div>
							</Note>
							<div className='subheading'>address</div>
							<Textbox
								text={this.state.imageLink ?? ''}
								placeholder='https://...'
								onChange={value => this.setState({ imageLink: value }, () => this.updateMap(this.state.map.name))}
							/>
							<div className='subheading'>map name</div>
							<Textbox
								text={this.state.map.name}
								placeholder='map name'
								onChange={value => this.updateMap(value)}
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
					break;
				case 'upload':
					if (this.state.imageID) {
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
										changing the size of a map square, in pixels, will change the map&apos;s dimensions
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
					break;
			}

			return (
				<Row className='full-height'>
					<Col span={8} className='scrollable'>
						<Tabs options={Utils.arrayToItems(['link', 'upload'])} selectedID={this.state.mode} onSelect={mode => this.setState({ mode: mode })} />
						{content}
					</Col>
					<Col span={16} className='scrollable both-ways'>
						<MapPanel
							map={this.state.map}
							mode='edit'
							images={this.props.images}
							showGrid={true}
							gridSquareClicked={() => null}
						/>
					</Col>
				</Row>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='MapImportModal' error={e} />;
		}
	}
}
