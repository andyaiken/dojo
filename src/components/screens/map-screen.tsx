import { CaretLeftOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import React from 'react';

import { Factory } from '../../utils/factory';
import { Matisse } from '../../utils/matisse';
import { Mercator } from '../../utils/mercator';
import { Shakespeare } from '../../utils/shakespeare';
import { Utils } from '../../utils/utils';

import { Map, MapArea, MapItem, MapLightSource, MapWall, TERRAIN_TYPES } from '../../models/map';
import { Party } from '../../models/party';

import { RenderError } from '../error';
import { Conditional } from '../controls/conditional';
import { ConfirmButton } from '../controls/confirm-button';
import { Expander } from '../controls/expander';
import { Group } from '../controls/group';
import { Note } from '../controls/note';
import { NumberSpin } from '../controls/number-spin';
import { RadioGroup } from '../controls/radio-group';
import { Selector } from '../controls/selector';
import { Tabs } from '../controls/tabs';
import { Textbox } from '../controls/textbox';
import { MapOptions } from '../options/map-options';
import { MapPanel } from '../panels/map-panel';
import { MarkdownEditor } from '../panels/markdown-editor';
import { MovementPanel } from '../panels/movement-panel';
import { Checkbox } from '../controls/checkbox';

interface Props {
	map: Map;
	parties: Party[];
	cloneMap: (map: Map, name: string) => void;
	rotateMap: (map: Map) => void;
	deleteMap: (map: Map) => void;
	addMapTile: (map: Map, tile: MapItem) => void;
	selectMapTileImage: (map: Map, tile: MapItem) => void;
	moveMapTile: (map: Map, tile: MapItem, dir: string, step: number) => void;
	cloneMapTile: (map: Map, tile: MapItem) => void;
	rotateMapTile: (map: Map, tile: MapItem) => void;
	deleteMapTile: (map: Map, tile: MapItem) => void;
	clearMapTiles: (map: Map) => void;
	bringToFront: (map: Map, tile: MapItem) => void;
	sendToBack: (map: Map, tile: MapItem) => void;
	addMapWall: (map: Map, wall: MapWall) => void;
	moveMapWall: (map: Map, wall: MapWall, dir: string, step: number) => void;
	nudgeWallLength: (map: Map, wall: MapWall, delta: number) => void;
	deleteMapWall: (map: Map, wall: MapWall) => void;
	fillInMapWalls: (map: Map) => void;
	clearMapWalls: (map: Map) => void;
	addMapArea: (map: Map, area: MapArea) => void;
	moveMapArea: (map: Map, area: MapArea, dir: string, step: number) => void;
	deleteMapArea: (map: Map, area: MapArea) => void;
	clearMapAreas: (map: Map) => void;
	addMapLightSource: (map: Map, ls: MapLightSource) => void;
	deleteMapLightSource: (map: Map, ls: MapLightSource) => void;
	changeLightSource: (ls: MapLightSource, name: string, bright: number, dim: number) => void;
	generateRoom: (map: Map) => void;
	startEncounter: (partyID: string, mapID: string, lighting: string) => void;
	startExploration: (partyID: string, mapID: string, lighting: string) => void;
	changeValue: (source: any, field: string, value: string) => void;
	nudgeValue: (source: any, field: string, delta: number) => void;
	goBack: () => void;
}

interface State {
	sidebarView: string;
	lighting: string;
	selectedTileID: string | null;
	selectedWallID: string | null;
	selectedAreaID: string | null;
	addingTile: boolean;
	addingWall: boolean;
	addingArea: boolean;
	addingLightSource: boolean;
}

export class MapScreen extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			sidebarView: 'tiles',
			lighting: 'bright light',
			selectedTileID: null,
			selectedWallID: null,
			selectedAreaID: null,
			addingTile: false,
			addingWall: false,
			addingArea: false,
			addingLightSource: false
		};
	}

	private setSidebarView(view: string) {
		this.setState({
			sidebarView: view
		});
	}

	private setLighting(lighting: string) {
		this.setState({
			lighting: lighting
		});
	}

	private setSelectedTileID(id: string | null) {
		this.setState({
			selectedTileID: id,
			selectedWallID: null,
			selectedAreaID: null
		});
	}

	private setSelectedWallID(id: string | null) {
		this.setState({
			selectedTileID: null,
			selectedWallID: id,
			selectedAreaID: null
		});
	}

	private setSelectedAreaID(id: string | null) {
		this.setState({
			selectedTileID: null,
			selectedWallID: null,
			selectedAreaID: id
		});
	}

	private toggleAddingTile() {
		this.setState({
			addingTile: !this.state.addingTile,
			addingWall: false,
			addingArea: false,
			addingLightSource: false
		});
	}

	private toggleAddingWall() {
		this.setState({
			addingTile: false,
			addingWall: !this.state.addingWall,
			addingArea: false,
			addingLightSource: false
		});
	}

	private toggleAddingArea() {
		this.setState({
			addingTile: false,
			addingWall: false,
			addingArea: !this.state.addingArea,
			addingLightSource: false
		});
	}

	private toggleAddingLightSource() {
		this.setState({
			addingTile: false,
			addingWall: false,
			addingArea: false,
			addingLightSource: !this.state.addingLightSource
		});
	}

	private gridSquareClicked(x: number, y: number) {
		if (this.state.addingLightSource) {
			this.setState({
				addingLightSource: false
			}, () => {
				const ls = Factory.createMapLightSource();
				ls.x = x;
				ls.y = y;
				this.props.addMapLightSource(this.props.map, ls);
			});
		}
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
				addingTile: false
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
				selectedAreaID: area.id,
				addingArea: false
			}, () => {
				this.props.addMapArea(this.props.map, area);
			});
		}
	}

	private verticesSelected(x1: number, y1: number, x2: number, y2: number) {
		if (this.state.addingWall) {
			const wall = Factory.createMapWall();
			wall.pointA = {
				x: x1,
				y: y1,
				z: 0
			};
			wall.pointB = {
				x: x2,
				y: y2,
				z: 0
			};

			this.setState({
				selectedWallID: wall.id,
				addingWall: false
			}, () => {
				this.props.addMapWall(this.props.map, wall);
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
								moveMapTile={(tile, dir, step) => this.props.moveMapTile(this.props.map, tile, dir, step)}
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

			if (this.state.selectedWallID) {
				const wall = this.props.map.walls.find(w => w.id === this.state.selectedWallID);
				if (wall) {
					sidebar = (
						<div>
							<MapWallPanel
								wall={wall}
								changeValue={(source, field, value) => this.props.changeValue(source, field, value)}
								nudgeWallLength={(w, delta) => this.props.nudgeWallLength(this.props.map, w, delta)}
								moveMapWall={(w, dir, step) => this.props.moveMapWall(this.props.map, w, dir, step)}
								deleteMapWall={w => this.props.deleteMapWall(this.props.map, w)}
							/>
							<hr/>
							<button onClick={() => this.setSelectedTileID(null)}>
								<CaretLeftOutlined style={{ fontSize: '10px' }} /> back to the editor
							</button>
						</div>
					);
				}
			}

			if (!sidebar) {
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
						<hr/>
						<Tabs
							options={Utils.arrayToItems(['tiles', 'walls', 'areas'])}
							selectedID={this.state.sidebarView}
							onSelect={view => this.setSidebarView(view)}
						/>
						<Conditional display={this.state.sidebarView === 'tiles'}>
							<Group transparent={true}>
								<Conditional display={this.props.map.items.length === 0}>
									<Note>
										<div className='section'>
											maps are made out of map tiles, arranged together
										</div>
										<div className='section'>
											to add a new tile to the map, click on <b>add a map tile</b> below
										</div>
										<div className='section'>
											to edit an existing tile, click on it to select it
										</div>
									</Note>
								</Conditional>
								<button onClick={() => this.toggleAddingTile()}>
									{this.state.addingTile ? 'click and drag on the map to select a rectangle, or click here to cancel' : 'add a map tile'}
								</button>
								<ConfirmButton onConfirm={() => this.props.clearMapTiles(this.props.map)}>clear all tiles</ConfirmButton>
							</Group>
						</Conditional>
						<Conditional display={this.state.sidebarView === 'walls'}>
							<Group transparent={true}>
								<Conditional display={this.props.map.walls.length === 0}>
									<Note>
										<div className='section'>
											tiles usually need walls around them
										</div>
										<div className='section'>
											to add a new wall to the map, click on <b>add a wall</b> below
										</div>
										<div className='section'>
											to edit an existing wall, click on it to select it
										</div>
									</Note>
								</Conditional>
								<button onClick={() => this.toggleAddingWall()}>
									{this.state.addingWall ? 'click and drag a corner circle on the map, or click here to cancel' : 'add a wall'}
								</button>
								<Conditional display={this.props.map.walls.length === 0}>
									<button onClick={() => this.props.fillInMapWalls(this.props.map)}>add walls around tiles</button>
								</Conditional>
								<ConfirmButton onConfirm={() => this.props.clearMapWalls(this.props.map)}>clear all walls</ConfirmButton>
							</Group>
						</Conditional>
						<Conditional display={this.state.sidebarView === 'areas'}>
							<Group transparent={true}>
								<Conditional display={this.props.map.areas.length === 0}>
									<Note>
										<div className='section'>
											if your map is large, you might want to designate different areas (such as rooms in a dungeon, or floors of a building)
										</div>
										<div className='section'>
											to add a new area to the map, click on <b>add a map area</b> below
										</div>
										<div className='section'>
											to edit an existing area, click on it to select it
										</div>
									</Note>
								</Conditional>
								<div>
									{
										this.props.map.areas.map(area => (
											<div key={area.id} onMouseEnter={() => this.setSelectedAreaID(area.id)} onMouseLeave={() => this.setSelectedAreaID(null)}>
												<Expander text={area.name || 'unnamed area'}>
													<MapAreaPanel
														area={area}
														changeValue={(source, field, value) => this.props.changeValue(source, field, value)}
														nudgeValue={(source, field, delta) => this.props.nudgeValue(source, field, delta)}
														moveMapArea={(a, dir, step) => this.props.moveMapArea(this.props.map, a, dir, step)}
														deleteMapArea={a => this.props.deleteMapArea(this.props.map, a)}
													/>
												</Expander>
											</div>
										))
									}
								</div>
								<hr/>
								<button onClick={() => this.toggleAddingArea()}>
									{this.state.addingArea ? 'click and drag on the map to create a map area, or click here to cancel' : 'add a map area'}
								</button>
								<ConfirmButton onConfirm={() => this.props.clearMapAreas(this.props.map)}>clear all areas</ConfirmButton>
							</Group>
						</Conditional>
						<hr/>
						<button onClick={() => this.props.rotateMap(this.props.map)}>rotate the map</button>
						<button onClick={() => this.props.generateRoom(this.props.map)}>add a random room</button>
						<button onClick={() => Matisse.takeScreenshot(this.props.map.id)}>export map image</button>
						<MapOptions
							map={this.props.map}
							parties={this.props.parties}
							cloneMap={(map, name) => this.props.cloneMap(map, name)}
							startEncounter={(partyID, mapID) => this.props.startEncounter(partyID, mapID, this.state.lighting)}
							startExploration={(partyID, mapID) => this.props.startExploration(partyID, mapID, this.state.lighting)}
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
			if (this.state.selectedWallID) {
				selectedIDs.push(this.state.selectedWallID);
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
							features={{ highlight: false, editFog: false, lightSource: this.state.addingLightSource }}
							paddingSquares={this.state.addingTile ? 5 : 0}
							selectedItemIDs={selectedIDs}
							showGrid={this.state.addingTile || this.state.addingArea || this.state.addingLightSource}
							showWallVertices={this.state.addingWall}
							showAreaNames={true}
							lighting={this.state.lighting as 'bright light' | 'dim light' | 'darkness'}
							itemSelected={id => this.setSelectedTileID(id)}
							wallSelected={id => this.setSelectedWallID(id)}
							areaSelected={id => this.setSelectedAreaID(id)}
							gridSquareClicked={(x, y) => this.gridSquareClicked(x, y)}
							gridRectangleSelected={(x1, y1, x2, y2) => this.rectangleSelected(x1, y1, x2, y2)}
							verticesSelected={(x1, y1, x2, y2) => this.verticesSelected(x1, y1, x2, y2)}
							changeLighting={lighting => this.setLighting(lighting)}
							changeLightSource={(ls, name, bright, dim) => this.props.changeLightSource(ls, name, bright, dim)}
							removeLightSource={ls => this.props.deleteMapLightSource(this.props.map, ls)}
							toggleFeature={feature => {
								switch (feature) {
									case 'lightSource':
										this.toggleAddingLightSource();
										break;
								}
							}}
							changeValue={(source, field, value) => this.props.changeValue(source, field, value)}
						/>
					</Col>
				</Row>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='MapScreen' error={e} />;
		}
	}
}

interface MapTileProps {
	tile: MapItem;
	toggleImageSelection: () => void;
	changeValue: (source: any, field: string, value: any) => void;
	nudgeValue: (source: any, field: string, delta: number) => void;
	moveMapTile: (tile: MapItem, dir: string, step: number) => void;
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
						<MovementPanel onMove={(dir, step) => this.props.moveMapTile(this.props.tile, dir, step)} />
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
									options={Utils.arrayToItems(TERRAIN_TYPES)}
									selectedID={this.props.tile.terrain}
									itemsPerRow={3}
									onSelect={optionID => this.props.changeValue(this.props.tile, 'terrain', optionID)}
								/>
								{customSection}
							</div>
							<div className='section'>
								<div className='subheading'>shape</div>
								<Selector
									options={Utils.arrayToItems(['square', 'rounded', 'circle'])}
									selectedID={this.props.tile.style}
									onSelect={optionID => this.props.changeValue(this.props.tile, 'style', optionID)}
								/>
							</div>
							<div className='section'>
								<div className='subheading'>content</div>
								<RadioGroup
									items={[
										{ id: 'none', text: 'none' },
										{ id: 'stairway', text: 'stairway', details: (
											<div>
												<div><b>style</b></div>
												<Selector
													options={Utils.arrayToItems(['stairs', 'spiral', 'ladder'])}
													selectedID={this.props.tile.content ? this.props.tile.content.style : null}
													onSelect={id => this.props.changeValue(this.props.tile.content, 'style', id)}
												/>
												<div><b>orientation</b></div>
												<Selector
													options={Utils.arrayToItems(['horizontal', 'vertical'])}
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
												case 'stairway':
													defaultStyle = 'stairs';
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
						<ConfirmButton onConfirm={() => this.props.deleteMapTile(this.props.tile)}>delete tile</ConfirmButton>
					</div>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='MapTilePanel' error={e} />;
		}
	}
}

interface MapWallProps {
	wall: MapWall;
	changeValue: (source: any, field: string, value: any) => void;
	nudgeWallLength: (wall: MapWall, delta: number) => void;
	moveMapWall: (wall: MapWall, dir: string, step: number) => void;
	deleteMapWall: (wall: MapWall) => void;
}

class MapWallPanel extends React.Component<MapWallProps> {
	public render() {
		try {
			const length = Mercator.getWallLength(this.props.wall);

			return (
				<div>
					<div className='heading'>
						<div className='title'>map wall</div>
					</div>
					<div>
						<MovementPanel onMove={(dir, step) => this.props.moveMapWall(this.props.wall, dir, step)} />
						<div className='section'>
						<div className='subheading'>size</div>
							<div className='section'>
								<NumberSpin
									value={length + ' sq / ' + (length * 5) + ' ft'}
									label='length'
									downEnabled={length > 1}
									onNudgeValue={delta => this.props.nudgeWallLength(this.props.wall, delta)}
								/>
							</div>
							<div className='subheading'>details</div>
							<Checkbox
								label='this is a doorway'
								checked={this.props.wall.display !== 'wall'}
								onChecked={checked => this.props.changeValue(this.props.wall, 'display', (checked ? 'door' : 'wall'))}
							/>
							<Conditional display={this.props.wall.display === 'wall'}>
								<Checkbox
									label='blocks movement'
									checked={this.props.wall.blocksMovement}
									onChecked={checked => this.props.changeValue(this.props.wall, 'blocksMovement', checked)}
								/>
							</Conditional>
							<Conditional display={this.props.wall.display !== 'wall'}>
								<Selector
									options={Utils.arrayToItems(['door', 'double-door', 'bars'])}
									selectedID={this.props.wall.display}
									onSelect={id => this.props.changeValue(this.props.wall, 'display', id)}
								/>
								<Selector
									options={Utils.arrayToItems(['open', 'closed'])}
									selectedID={this.props.wall.blocksMovement ? 'closed' : 'open'}
									onSelect={value => this.props.changeValue(this.props.wall, 'blocksMovement', (value === 'closed'))}
								/>
								<Checkbox
									label='blocks line-of-sight'
									checked={this.props.wall.blocksLineOfSight}
									onChecked={checked => this.props.changeValue(this.props.wall, 'blocksLineOfSight', checked)}
								/>
								<Checkbox
									label='concealed'
									checked={this.props.wall.isConcealed}
									onChecked={checked => this.props.changeValue(this.props.wall, 'isConcealed', checked)}
								/>
							</Conditional>
						</div>
						<hr/>
						<ConfirmButton onConfirm={() => this.props.deleteMapWall(this.props.wall)}>delete wall</ConfirmButton>
					</div>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='MapTilePanel' error={e} />;
		}
	}
}

interface MapAreaProps {
	area: MapArea;
	changeValue: (area: MapArea, field: string, value: any) => void;
	nudgeValue: (area: MapArea, field: string, delta: number) => void;
	moveMapArea: (area: MapArea, dir: string, step: number) => void;
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
					<div className='subheading'>name</div>
					<div className='content-then-icons'>
						<div className='content'>
							<Textbox
								text={this.props.area.name}
								onChange={value => this.props.changeValue(this.props.area, 'name', value)}
							/>
						</div>
						<div className='icons'>
							<ThunderboltOutlined onClick={() => this.randomName()} title='generate a random name' />
						</div>
					</div>
					<div className='subheading'>move</div>
					<MovementPanel onMove={(dir, step) => this.props.moveMapArea(this.props.area, dir, step)} />
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
					<hr/>
					<Expander text='notes'>
						<MarkdownEditor text={this.props.area.text} onChange={text => this.props.changeValue(this.props.area, 'text', text)} />
						<button
							onClick={() => {
								const desc = Shakespeare.generateRoomDescription();
								this.props.changeValue(this.props.area, 'text', desc);
							}}
						>
							set a random description
						</button>
					</Expander>
					<hr/>
					<ConfirmButton onConfirm={() => this.props.deleteMapArea(this.props.area)}>delete area</ConfirmButton>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='MapAreaPanel' error={e} />;
		}
	}
}
