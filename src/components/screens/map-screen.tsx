import { CaretLeftOutlined, ReloadOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import React from 'react';

import { Factory } from '../../utils/factory';
import { Shakespeare } from '../../utils/shakespeare';

import { DOORWAY_TYPES, Map, MapArea, MapItem, STAIRWAY_TYPES, TERRAIN_TYPES } from '../../models/map';
import { Party } from '../../models/party';

import { ConfirmButton } from '../controls/confirm-button';
import { Expander } from '../controls/expander';
import { NumberSpin } from '../controls/number-spin';
import { Radial } from '../controls/radial';
import { RadioGroup } from '../controls/radio-group';
import { Selector } from '../controls/selector';
import { Textbox } from '../controls/textbox';
import { MapOptions } from '../options/map-options';
import { MapPanel } from '../panels/map-panel';
import { Note } from '../panels/note';

interface Props {
	map: Map;
	parties: Party[];
	cloneMap: (map: Map, name: string) => void;
	rotateMap: (map: Map) => void;
	deleteMap: (map: Map) => void;
	addMapTile: (map: Map, tile: MapItem) => void;
	selectMapTileImage: (map: Map, tile: MapItem) => void;
	moveMapTile: (map: Map, tile: MapItem, dir: string) => void;
	cloneMapTile: (map: Map, tile: MapItem) => void;
	rotateMapTile: (map: Map, tile: MapItem) => void;
	deleteMapTile: (map: Map, tile: MapItem) => void;
	clearMapTiles: (map: Map) => void;
	bringToFront: (map: Map, tile: MapItem) => void;
	sendToBack: (map: Map, tile: MapItem) => void;
	addMapArea: (map: Map, area: MapArea) => void;
	moveMapArea: (map: Map, area: MapArea, dir: string) => void;
	deleteMapArea: (map: Map, area: MapArea) => void;
	clearMapAreas: (map: Map) => void;
	generateRoom: (map: Map) => void;
	startEncounter: (partyID: string, mapID: string) => void;
	startExploration: (partyID: string, mapID: string) => void;
	changeValue: (source: any, field: string, value: string) => void;
	nudgeValue: (source: any, field: string, delta: number) => void;
	goBack: () => void;
}

interface State {
	view: string;
	selectedTileID: string | null;
	selectedAreaID: string | null;
	addingTile: boolean;
	addingArea: boolean;
}

export class MapScreen extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			view: 'map',
			selectedTileID: null,
			selectedAreaID: null,
			addingTile: false,
			addingArea: false
		};
	}

	private setView(view: string) {
		this.setState({
			view: view
		});
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

	private rectangleSelected(x1: number, y1: number, x2: number, y2: number) {
		if (this.state.addingTile) {
			const tile = Factory.createMapItem();
			tile.x = x1;
			tile.y = y1;
			tile.width = x2 - x1 + 1;
			tile.height = y2 - y1 + 1;
			tile.terrain = 'default';

			this.setState({
				selectedTileID: tile.id,
				selectedAreaID: null,
				addingTile: false,
				addingArea: false
			}, () => {
				this.props.addMapTile(this.props.map, tile);
			});
		}

		if (this.state.addingArea) {
			const area = Factory.createMapArea();
			area.x = x1;
			area.y = y1;
			area.width = x2 - x1 + 1;
			area.height = y2 - y1 + 1;

			this.setState({
				selectedTileID: null,
				selectedAreaID: area.id,
				addingTile: false,
				addingArea: false
			}, () => {
				this.props.addMapArea(this.props.map, area);
			});
		}
	}

	public render() {
		try {
			let sidebar = null;

			if (this.state.selectedTileID) {
				const item = this.props.map.items.find(i => i.id === this.state.selectedTileID);
				if (item) {
					sidebar = (
						<div>
							<MapTilePanel
								tile={item}
								toggleImageSelection={() => this.props.selectMapTileImage(this.props.map, item)}
								changeValue={(source, field, value) => this.props.changeValue(source, field, value)}
								nudgeValue={(source, field, delta) => this.props.nudgeValue(source, field, delta)}
								moveMapTile={(tile, dir) => this.props.moveMapTile(this.props.map, tile, dir)}
								cloneMapTile={tile => this.props.cloneMapTile(this.props.map, tile)}
								deleteMapTile={tile => this.props.deleteMapTile(this.props.map, tile)}
								rotateMapTile={tile => this.props.rotateMapTile(this.props.map, tile)}
								sendToBack={tile => this.props.sendToBack(this.props.map, tile)}
								bringToFront={tile => this.props.bringToFront(this.props.map, tile)}
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
				const area = this.props.map.areas.find(a => a.id === this.state.selectedAreaID);
				if (area) {
					sidebar = (
						<div>
							<MapAreaPanel
								area={area}
								changeValue={(source, field, value) => this.props.changeValue(source, field, value)}
								nudgeValue={(source, field, delta) => this.props.nudgeValue(source, field, delta)}
								moveMapArea={(a, dir) => this.props.moveMapArea(this.props.map, a, dir)}
								deleteMapArea={a => this.props.deleteMapArea(this.props.map, a)}
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
				const addTileText = this.state.addingTile ? 'click and drag on the map to create a tile, or click here to cancel' : 'add a map tile';
				const addAreaText = this.state.addingArea ? 'click and drag on the map to create a map area, or click here to cancel' : 'add a map area';
				const areas = this.props.map.areas.map(a => (
					<div key={a.id} className='group-panel clickable' onClick={() => this.setSelectedAreaID(a.id)} role='button'>
						{a.name}
					</div>
				));

				sidebar = (
					<div>
						<div className='section'>
							<div className='subheading'>map name</div>
							<Textbox
								text={this.props.map.name}
								placeholder='map name'
								onChange={value => this.props.changeValue(this.props.map, 'name', value)}
							/>
						</div>
						<Note>
							<p>maps are made out of map tiles, arranged together</p>
							<p>to add a new tile to the map, click on <b>add a map tile</b> below</p>
							<p>to edit an existing tile, click on it to select it</p>
							<hr/>
							<p>if your map is large, you might want to designate different areas (such as rooms in a dungeon, or floors of a building)</p>
							<p>to add a new area to the map, click on <b>add a map area</b> below</p>
							<p>to edit an existing area, click on it to select it</p>
						</Note>
						<div className='section'>
							<div className='subheading'>map tiles</div>
							<button onClick={() => this.toggleAddingTile()}>{addTileText}</button>
							<ConfirmButton text='clear all tiles' onConfirm={() => this.props.clearMapTiles(this.props.map)} />
						</div>
						<div className='section'>
							<div className='subheading'>map areas</div>
							{areas}
							<button onClick={() => this.toggleAddingArea()}>{addAreaText}</button>
							<ConfirmButton text='clear all areas' onConfirm={() => this.props.clearMapAreas(this.props.map)} />
						</div>
						<hr/>
						<button onClick={() => this.props.rotateMap(this.props.map)}>rotate map</button>
						<button onClick={() => this.props.generateRoom(this.props.map)}>add a random room</button>
						<hr/>
						<MapOptions
							map={this.props.map}
							parties={this.props.parties}
							cloneMap={(map, name) => this.props.cloneMap(map, name)}
							startEncounter={(partyID, mapID) => this.props.startEncounter(partyID, mapID)}
							startExploration={(partyID, mapID) => this.props.startExploration(partyID, mapID)}
							deleteMap={map => this.props.deleteMap(map)}
						/>
						<hr />
						<button onClick={() => this.props.goBack()}><CaretLeftOutlined style={{ fontSize: '10px' }} /> back to the list</button>
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
							map={this.props.map}
							mode='edit'
							paddingSquares={5}
							selectedItemIDs={selectedIDs}
							showGrid={this.state.addingTile || this.state.addingArea}
							showAreaNames={true}
							itemSelected={(id, ctrl) => {
								this.setSelectedTileID(id);
								this.setSelectedAreaID(null);
							}}
							areaSelected={id => this.setSelectedAreaID(id)}
							gridRectangleSelected={(x1, y1, x2, y2) => this.rectangleSelected(x1, y1, x2, y2)}
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

interface MapTileProps {
	tile: MapItem;
	toggleImageSelection: () => void;
	changeValue: (source: any, field: string, value: any) => void;
	nudgeValue: (source: any, field: string, delta: number) => void;
	moveMapTile: (tile: MapItem, dir: string) => void;
	cloneMapTile: (tile: MapItem) => void;
	deleteMapTile: (tile: MapItem) => void;
	rotateMapTile: (tile: MapItem) => void;
	sendToBack: (tile: MapItem) => void;
	bringToFront: (tile: MapItem) => void;
}

class MapTilePanel extends React.Component<MapTileProps> {
	public render() {
		try {
			let customSection = null;
			if (this.props.tile.terrain === 'custom') {
				customSection = (
					<div>
						<div className='subheading'>custom image</div>
						<button onClick={() => this.props.toggleImageSelection()}>select image</button>
						<button onClick={() => this.props.changeValue(this.props.tile, 'customBackground', '')}>clear image</button>
					</div>
				);
			}
			if (this.props.tile.terrain === 'link') {
				customSection = (
					<div>
						<div className='subheading'>link to custom image</div>
						<Textbox
							text={this.props.tile.customLink}
							placeholder='https://...'
							onChange={value => this.props.changeValue(this.props.tile, 'customLink', value)}
						/>
					</div>
				);
			}

			return (
				<div>
					<div className='heading'>
						<div className='title'>map tile</div>
					</div>
					<div>
						<div className='section'>
							<div className='subheading'>move</div>
							<Radial onClick={dir => this.props.moveMapTile(this.props.tile, dir)} />
						</div>
						<div className='section'>
							<div className='subheading'>size</div>
							<div className='section'>
								<NumberSpin
									value={this.props.tile.width + ' sq / ' + (this.props.tile.width * 5) + ' ft'}
									label='width'
									downEnabled={this.props.tile.width > 1}
									onNudgeValue={delta => this.props.nudgeValue(this.props.tile, 'width', delta)}
								/>
								<NumberSpin
									value={this.props.tile.height + ' sq / ' + (this.props.tile.height * 5) + ' ft'}
									label='height'
									downEnabled={this.props.tile.height > 1}
									onNudgeValue={delta => this.props.nudgeValue(this.props.tile, 'height', delta)}
								/>
							</div>
						</div>
						<hr/>
						<Expander text='advanced options'>
							<div className='section'>
								<div className='subheading'>terrain</div>
								<Selector
									options={TERRAIN_TYPES.map(t => ({ id: t, text: t }))}
									selectedID={this.props.tile.terrain}
									itemsPerRow={3}
									onSelect={optionID => this.props.changeValue(this.props.tile, 'terrain', optionID)}
								/>
								{customSection}
							</div>
							<div className='section'>
								<div className='subheading'>shape</div>
								<Selector
									options={['square', 'rounded', 'circle'].map(t => ({ id: t, text: t }))}
									selectedID={this.props.tile.style}
									onSelect={optionID => this.props.changeValue(this.props.tile, 'style', optionID)}
								/>
							</div>
							<div className='section'>
								<div className='subheading'>content</div>
								<RadioGroup
									items={[
										{ id: 'none', text: 'none' },
										{ id: 'doorway', text: 'doorway', details: (
											<div>
												<div><b>style</b></div>
												<Selector
													options={DOORWAY_TYPES.map(o => ({ id: o, text: o }))}
													selectedID={this.props.tile.content ? this.props.tile.content.style : null}
													onSelect={id => this.props.changeValue(this.props.tile.content, 'style', id)}
												/>
												<div><b>orientation</b></div>
												<Selector
													options={['horizontal', 'vertical'].map(o => ({ id: o, text: o }))}
													selectedID={this.props.tile.content ? this.props.tile.content.orientation : null}
													onSelect={id => this.props.changeValue(this.props.tile.content, 'orientation', id)}
												/>
											</div>
										) },
										{ id: 'stairway', text: 'stairway', details: (
											<div>
												<div><b>style</b></div>
												<Selector
													options={STAIRWAY_TYPES.map(o => ({ id: o, text: o }))}
													selectedID={this.props.tile.content ? this.props.tile.content.style : null}
													onSelect={id => this.props.changeValue(this.props.tile.content, 'style', id)}
												/>
												<div><b>orientation</b></div>
												<Selector
													options={['horizontal', 'vertical'].map(o => ({ id: o, text: o }))}
													selectedID={this.props.tile.content ? this.props.tile.content.orientation : null}
													onSelect={id => this.props.changeValue(this.props.tile.content, 'orientation', id)}
												/>
											</div>
										) }
									]}
									selectedItemID={this.props.tile.content ? this.props.tile.content.type : 'none'}
									onSelect={id => {
										let value = null;
										if (id !== 'none') {
											let defaultStyle = '';
											switch (id) {
												case 'doorway':
													defaultStyle = DOORWAY_TYPES[0];
													break;
												case 'stairway':
													defaultStyle = STAIRWAY_TYPES[0];
													break;
											}
											value = { type: id, orientation: 'horizontal', style: defaultStyle };
										}
										this.props.changeValue(this.props.tile, 'content', value);
									}}
								/>
							</div>
							<hr/>
							<button onClick={() => this.props.bringToFront(this.props.tile)}>bring to front</button>
							<button onClick={() => this.props.sendToBack(this.props.tile)}>send to back</button>
							<hr/>
							<button onClick={() => this.props.rotateMapTile(this.props.tile)}>rotate tile</button>
							<button onClick={() => this.props.cloneMapTile(this.props.tile)}>copy tile</button>
						</Expander>
						<hr/>
						<ConfirmButton text='delete tile' onConfirm={() => this.props.deleteMapTile(this.props.tile)}/>
					</div>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}

interface MapAreaProps {
	area: MapArea;
	changeValue: (area: MapArea, field: string, value: any) => void;
	nudgeValue: (area: MapArea, field: string, delta: number) => void;
	moveMapArea: (area: MapArea, dir: string) => void;
	deleteMapArea: (area: MapArea) => void;
}

class MapAreaPanel extends React.Component<MapAreaProps> {
	private randomName() {
		const name = Shakespeare.capitalise(Shakespeare.generateRoomName());
		this.props.changeValue(this.props.area, 'name', name);
	}

	public render() {
		try {
			return (
				<div>
					<div className='heading'>
						<div className='title'>map area</div>
					</div>
					<div>
						<div className='section'>
							<div className='subheading'>name</div>
							<div className='control-with-icons'>
								<Textbox
									text={this.props.area.name}
									onChange={value => this.props.changeValue(this.props.area, 'name', value)}
								/>
								<div className='icons'>
									<ReloadOutlined onClick={() => this.randomName()} title='generate a random name' />
								</div>
							</div>
						</div>
						<div className='section'>
							<div className='subheading'>move</div>
							<Radial onClick={dir => this.props.moveMapArea(this.props.area, dir)} />
						</div>
						<div className='section'>
							<div className='subheading'>size</div>
							<NumberSpin
								value={this.props.area.width + ' sq / ' + (this.props.area.width * 5) + ' ft'}
								label='width'
								downEnabled={this.props.area.width > 1}
								onNudgeValue={delta => this.props.nudgeValue(this.props.area, 'width', delta)}
							/>
							<NumberSpin
								value={this.props.area.height + ' sq  /' + (this.props.area.width * 5) + ' ft'}
								label='height'
								downEnabled={this.props.area.height > 1}
								onNudgeValue={delta => this.props.nudgeValue(this.props.area, 'height', delta)}
							/>
						</div>
						<div className='section'>
							<div className='subheading'>notes</div>
							<Textbox
								text={this.props.area.text}
								multiLine={true}
								onChange={value => this.props.changeValue(this.props.area, 'text', value)}
							/>
						</div>
						<hr/>
						<ConfirmButton text='delete area' onConfirm={() => this.props.deleteMapArea(this.props.area)}/>
					</div>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
