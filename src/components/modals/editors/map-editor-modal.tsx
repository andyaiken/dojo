import { CaretLeftOutlined } from '@ant-design/icons';
import { Col, Drawer, Row } from 'antd';
import React from 'react';

import Factory from '../../../utils/factory';
import Mercator from '../../../utils/mercator';
import Utils from '../../../utils/utils';

import { Map, MapArea, MapItem } from '../../../models/map';

import MapAreaCard from '../../cards/map-area-card';
import MapTileCard from '../../cards/map-tile-card';
import ConfirmButton from '../../controls/confirm-button';
import Textbox from '../../controls/textbox';
import MapPanel from '../../panels/map-panel';
import Note from '../../panels/note';
import ImageSelectionModal from '../image-selection-modal';

interface Props {
	map: Map;
}

interface State {
	map: Map;
	selectedTileID: string | null;
	selectedAreaID: string | null;
	addingTile: boolean;
	addingArea: boolean;
	showImageSelection: boolean;
}

export default class MapEditorModal extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			map: props.map,
			selectedTileID: null,
			selectedAreaID: null,
			addingTile: false,
			addingArea: false,
			showImageSelection: false
		};
	}

	private setSelectedTileID(id: string | null) {
		this.setState({
			selectedTileID: id
		});
	}

	private setSelectedAreaID(id: string | null) {
		this.setState({
			selectedAreaID: id
		});
	}

	private toggleAddingTile() {
		this.setState({
			addingTile: !this.state.addingTile,
			addingArea: false
		});
	}

	private toggleAddingArea() {
		this.setState({
			addingTile: false,
			addingArea: !this.state.addingArea
		});
	}

	private toggleImageSelection() {
		this.setState({
			showImageSelection: !this.state.showImageSelection
		});
	}

	private rectangleSelected(x1: number, y1: number, x2: number, y2: number) {
		if (this.state.addingTile) {
			const tile = Factory.createMapItem();
			tile.x = x1;
			tile.y = y1;
			tile.width = x2 - x1 + 1;
			tile.height = y2 - y1 + 1;
			tile.terrain = 'default';
			this.state.map.items.push(tile);

			this.setState({
				map: this.state.map,
				selectedTileID: tile.id,
				selectedAreaID: null,
				addingTile: false,
				addingArea: false
			});
		}

		if (this.state.addingArea) {
			const area = Factory.createMapArea();
			area.name = 'new area';
			area.x = x1;
			area.y = y1;
			area.width = x2 - x1 + 1;
			area.height = y2 - y1 + 1;
			this.state.map.areas.push(area);
			Utils.sort(this.state.map.areas);

			this.setState({
				map: this.state.map,
				selectedTileID: null,
				selectedAreaID: area.id,
				addingTile: false,
				addingArea: false
			});
		}
	}

	private moveMapItem(item: MapItem | MapArea, dir: string) {
		switch (dir) {
			case 'N':
				item.y -= 1;
				break;
			case 'NE':
				item.x += 1;
				item.y -= 1;
				break;
			case 'E':
				item.x += 1;
				break;
			case 'SE':
				item.x += 1;
				item.y += 1;
				break;
			case 'S':
				item.y += 1;
				break;
			case 'SW':
				item.x -= 1;
				item.y += 1;
				break;
			case 'W':
				item.x -= 1;
				break;
			case 'NW':
				item.x -= 1;
				item.y -= 1;
				break;
			default:
				// Do nothing
				break;
		}

		this.setState({
			map: this.state.map
		});
	}

	private rotateMapItem(item: MapItem) {
		const tmp = item.width;
		item.width = item.height;
		item.height = tmp;

		const diff = Math.floor((item.width - item.height) / 2);
		item.x -= diff;
		item.y += diff;

		if (item.content) {
			item.content.orientation = item.content.orientation === 'horizontal' ? 'vertical' : 'horizontal';
		}

		this.setState({
			map: this.state.map,
			addingTile: this.state.addingTile
		});
	}

	private sendToBack(item: MapItem) {
		const index = this.state.map.items.indexOf(item);
		this.state.map.items.splice(index, 1);
		this.state.map.items.unshift(item);

		this.setState({
			map: this.state.map
		});
	}

	private bringToFront(item: MapItem) {
		const index = this.state.map.items.indexOf(item);
		this.state.map.items.splice(index, 1);
		this.state.map.items.push(item);

		this.setState({
			map: this.state.map
		});
	}

	private cloneMapItem(item: MapItem) {
		const copy = JSON.parse(JSON.stringify(item));
		copy.id = Utils.guid();
		copy.x += 1;
		copy.y += 1;
		this.state.map.items.push(copy);

		this.setState({
			map: this.state.map,
			selectedTileID: copy.id
		});
	}

	private removeMapItem(item: MapItem) {
		const index = this.state.map.items.indexOf(item);
		this.state.map.items.splice(index, 1);

		this.setState({
			map: this.state.map,
			selectedTileID: null
		});
	}

	private removeMapArea(area: MapArea) {
		const index = this.state.map.areas.indexOf(area);
		this.state.map.areas.splice(index, 1);

		this.setState({
			map: this.state.map,
			selectedAreaID: null
		});
	}

	private setCustomImage(id: string) {
		const item = this.state.map.items.find(i => i.id === this.state.selectedTileID);
		if (item) {
			this.changeValue(item, 'customBackground', id);
		}
	}

	private rotateMap() {
		Mercator.rotateMap(this.state.map);

		this.setState({
			map: this.state.map,
			addingTile: false
		});
	}

	private clearMapTiles() {
		const map = this.state.map;
		map.items = [];

		this.setState({
			map: map,
			selectedTileID: null,
			addingTile: false
		});
	}

	private clearMapAreas() {
		const map = this.state.map;
		map.areas = [];

		this.setState({
			map: map,
			selectedAreaID: null,
			addingArea: false
		});
	}

	private generate(type: string) {
		Mercator.generate(type, this.state.map);
		this.setState({
			map: this.state.map,
			addingTile: false
		});
	}

	private changeValue(source: any, field: string, value: any) {
		source[field] = value;

		Utils.sort(this.state.map.areas);

		this.setState({
			map: this.state.map,
			showImageSelection: false
		});
	}

	private nudgeValue(source: any, field: string, delta: number) {
		let value: number = source[field];
		value += delta;

		if ((field === 'width') || (field === 'height')) {
			value = Math.max(value, 1);
		}

		this.changeValue(source, field, value);
	}

	public render() {
		try {
			let sidebar = null;
			if (this.state.selectedTileID) {
				const item = this.state.map.items.find(i => i.id === this.state.selectedTileID);
				if (item) {
					sidebar = (
						<div>
							<MapTileCard
								tile={item}
								toggleImageSelection={() => this.toggleImageSelection()}
								changeValue={(source, field, value) => this.changeValue(source, field, value)}
								nudgeValue={(source, field, delta) => this.nudgeValue(source, field, delta)}
								move={(tile, dir) => this.moveMapItem(tile, dir)}
								clone={tile => this.cloneMapItem(tile)}
								remove={tile => this.removeMapItem(tile)}
								rotate={tile => this.rotateMapItem(tile)}
								sendToBack={tile => this.sendToBack(tile)}
								bringToFront={tile => this.bringToFront(tile)}
							/>
							<hr/>
							<button onClick={() => this.setSelectedTileID(null)}>
								<CaretLeftOutlined style={{ fontSize: '10px' }} /> back to the editor
							</button>
						</div>
					);
				}
			}

			if (this.state.selectedAreaID) {
				const area = this.state.map.areas.find(a => a.id === this.state.selectedAreaID);
				if (area) {
					sidebar = (
						<div>
							<MapAreaCard
								area={area}
								changeValue={(source, field, value) => this.changeValue(source, field, value)}
								nudgeValue={(source, field, delta) => this.nudgeValue(source, field, delta)}
								move={(a, dir) => this.moveMapItem(a, dir)}
								remove={a => this.removeMapArea(a)}
							/>
							<hr/>
							<button onClick={() => this.setSelectedAreaID(null)}>
								<CaretLeftOutlined style={{ fontSize: '10px' }} /> back to the editor
							</button>
						</div>
					);
				}
			}

			if (!sidebar) {
				let actions = null;
				if (this.state.addingTile) {
					actions = (
						<button onClick={() => this.toggleAddingTile()}>
							click and drag on the map to create a tile, or click here to cancel
						</button>
					);
				} else if (this.state.addingArea) {
					actions = (
						<button onClick={() => this.toggleAddingArea()}>
							click and drag on the map to create a map area, or click here to cancel
						</button>
					);
				} else {
					const areas = this.state.map.areas.map(a => (
						<div key={a.id} className='group-panel clickable' onClick={() => this.setSelectedAreaID(a.id)}>
							{a.name}
						</div>
					));
					actions = (
						<div>
							<button onClick={() => this.toggleAddingTile()}>add a map tile</button>
							<hr/>
							<button onClick={() => this.generate('room')}>add a random room</button>
							<button onClick={() => this.rotateMap()}>rotate the map</button>
							<ConfirmButton text='clear all tiles' onConfirm={() => this.clearMapTiles()} />
							<hr/>
							<div className='section subheading'>areas</div>
							{areas}
							<button onClick={() => this.toggleAddingArea()}>add a map area</button>
							<ConfirmButton text='clear all areas' onConfirm={() => this.clearMapAreas()} />
						</div>
					);
				}

				sidebar = (
					<div>
						<div className='subheading'>map name</div>
						<Textbox
							text={this.state.map.name}
							placeholder='map name'
							onChange={value => this.changeValue(this.state.map, 'name', value)}
						/>
						<hr/>
						<Note>
							<p>to add a new tile to the map, click on <b>add a map tile</b> below</p>
							<p>to edit an existing tile, click on it to select it</p>
						</Note>
						<hr/>
						{actions}
					</div>
				);
			}

			const selectedIDs = [];
			if (this.state.selectedTileID) {
				selectedIDs.push(this.state.selectedTileID);
			}
			if (this.state.selectedAreaID) {
				selectedIDs.push(this.state.selectedAreaID);
			}

			return (
				<Row className='full-height'>
					<Col span={6} className='scrollable sidebar sidebar-left'>
						{sidebar}
					</Col>
					<Col span={18} className='scrollable both-ways'>
						<MapPanel
							map={this.state.map}
							mode='edit'
							paddingSquares={5}
							selectedItemIDs={selectedIDs}
							showGrid={this.state.addingTile || this.state.addingArea}
							itemSelected={(id, ctrl) => {
								this.setSelectedTileID(id);
								this.setSelectedAreaID(null);
							}}
							areaSelected={id => this.setSelectedAreaID(id)}
							gridRectangleSelected={(x1, y1, x2, y2) => this.rectangleSelected(x1, y1, x2, y2)}
						/>
					</Col>
					<Drawer visible={this.state.showImageSelection} closable={false} onClose={() => this.toggleImageSelection()}>
						<ImageSelectionModal
							select={id => this.setCustomImage(id)}
							cancel={() => this.toggleImageSelection()}
						/>
					</Drawer>
				</Row>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
