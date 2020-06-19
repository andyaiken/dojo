import { DownSquareTwoTone, LeftCircleOutlined, StarTwoTone, UpSquareTwoTone } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React from 'react';
import Showdown from 'showdown';

import Factory from '../../utils/factory';
import Mercator from '../../utils/mercator';
import Utils from '../../utils/utils';

import { Combatant } from '../../models/combat';
import { Map, MapItem, MapNote } from '../../models/map';
import { Monster } from '../../models/monster';
import { PC } from '../../models/party';

import NumberSpin from '../controls/number-spin';
import HitPointGauge from './hit-point-gauge';

const showdown = new Showdown.Converter();
showdown.setOption('tables', true);

interface Props {
	map: Map;
	mode: 'edit' | 'thumbnail' | 'combat' | 'combat-player';
	viewport: MapDimensions | null;
	paddingSquares: number;
	floatingItem: MapItem | null;
	combatants: Combatant[];
	showGrid: boolean;
	selectedItemIDs: string[];
	fog: { x: number, y: number }[];
	itemSelected: (itemID: string | null, ctrl: boolean) => void;
	gridSquareEntered: (x: number, y: number) => void;
	gridSquareClicked: (x: number, y: number) => void;
	gridRectangleSelected: (x1: number, y1: number, x2: number, y2: number) => void;
}

interface State {
	showControls: boolean;
	size: number;
	selectionStartSquare: {
		x: number,
		y: number
	} | null;
	selectionEndSquare: {
		x: number,
		y: number
	} | null;
}

interface MapDimensions {
	minX: number;
	maxX: number;
	minY: number;
	maxY: number;
}

interface MapItemStyle {
	left: string;
	top: string;
	width: string;
	height: string;
	borderRadius: string;
	backgroundSize: string;
	backgroundColor?: string;
	opacity?: string;
}

export default class MapPanel extends React.Component<Props, State> {
	public static defaultProps = {
		mode: 'thumbnail',
		viewport: null,
		paddingSquares: 0,
		floatingItem: null,
		combatants: [],
		showGrid: false,
		selectedItemIDs: [],
		fog: [],
		itemSelected: null,
		gridSquareEntered: null,
		gridSquareClicked: null,
		gridRectangleUpdated: null,
		gridRectangleSelected: null
	};

	constructor(props: Props) {
		super(props);

		this.state = {
			showControls: false,
			size: (props.mode === 'thumbnail') ? 15 : 45,
			selectionStartSquare: null,
			selectionEndSquare: null
		};
	}

	private gridSquareMouseDown(x: number, y: number) {
		this.setState({
			selectionStartSquare: {
				x: x,
				y: y
			},
			selectionEndSquare: null
		});
	}

	private gridSquareEntered(x: number, y: number) {
		if (this.state.selectionStartSquare) {
			this.setState({
				selectionEndSquare: {
					x: x,
					y: y
				}
			});
		} else {
			if (!!this.props.gridSquareEntered) {
				this.props.gridSquareEntered(x, y);
			}
		}
	}

	private gridSquareMouseUp(x: number, y: number) {
		if (this.state.selectionStartSquare) {
			const x1 = this.state.selectionStartSquare.x;
			const y1 = this.state.selectionStartSquare.y;
			this.setState({
				selectionStartSquare: null,
				selectionEndSquare: null
			}, () => {
				if ((x1 === x) && (y1 === y)) {
					if (!!this.props.gridSquareClicked) {
						this.props.gridSquareClicked(x, y);
					}
				} else {
					if (this.props.gridRectangleSelected) {
						const minX = Math.min(x1, x);
						const minY = Math.min(y1, y);
						const maxX = Math.max(x1, x);
						const maxY = Math.max(y1, y);
						this.props.gridRectangleSelected(minX, minY, maxX, maxY);
					}
				}
			});
		}
	}

	private isSelected(x: number, y: number) {
		if (this.state.selectionStartSquare && this.state.selectionEndSquare) {
			const minX = Math.min(this.state.selectionStartSquare.x, this.state.selectionEndSquare.x);
			const minY = Math.min(this.state.selectionStartSquare.y, this.state.selectionEndSquare.y);
			const maxX = Math.max(this.state.selectionStartSquare.x, this.state.selectionEndSquare.x);
			const maxY = Math.max(this.state.selectionStartSquare.y, this.state.selectionEndSquare.y);
			return ((x >= minX) && (x <= maxX) && (y >= minY) && (y <= maxY));
		}

		return false;
	}

	private toggleShowControls() {
		this.setState({
			showControls: !this.state.showControls
		});
	}

	private nudgeSize(delta: number) {
		const value = Math.max(this.state.size + delta, 3);
		this.setState({
			size: value
		});
	}

	private getMapDimensions(): MapDimensions | null {
		let dimensions: MapDimensions | null = this.props.viewport;

		if (!dimensions) {
			// We haven't been given a viewport, so show all the tiles

			const tiles = this.props.map.items.filter(i => {
				if (this.props.mode === 'edit') {
					return i.type === 'tile';
				}
				return true;
			});

			tiles.forEach(i => {
				if (!dimensions) {
					dimensions = {
						minX: i.x,
						maxX: i.x + i.width - 1,
						minY: i.y,
						maxY: i.y + i.height - 1
					};
				} else {
					dimensions.minX = Math.min(dimensions.minX, i.x);
					dimensions.maxX = Math.max(dimensions.maxX, i.x + i.width - 1);
					dimensions.minY = Math.min(dimensions.minY, i.y);
					dimensions.maxY = Math.max(dimensions.maxY, i.y + i.height - 1);
				}
			});
		}

		if (this.props.combatants) {
			this.props.combatants.filter(c => c.aura.radius > 0).forEach(c => {
				const mi = this.props.map.items.find(i => i.id === c.id);
				if (mi) {
					const sizeInSquares = c.aura.radius / 5;
					let miniSize = 1;
					const m = c as Combatant & Monster;
					if (m) {
						miniSize = Math.max(Utils.miniSize(m.size), 1);
					}
					const minX = mi.x - sizeInSquares;
					const maxX = mi.x + (miniSize - 1) + sizeInSquares;
					const minY = mi.y - sizeInSquares;
					const maxY = mi.y + (miniSize - 1) + sizeInSquares;

					if (dimensions) {
						dimensions.minX = Math.min(dimensions.minX, minX);
						dimensions.maxX = Math.max(dimensions.maxX, maxX);
						dimensions.minY = Math.min(dimensions.minY, minY);
						dimensions.maxY = Math.max(dimensions.maxY, maxY);
					}
				}
			});
		}

		if (!dimensions) {
			// The map is blank
			if (this.props.mode === 'thumbnail') {
				return null;
			}

			dimensions = {
				minX: 0,
				maxX: 0,
				minY: 0,
				maxY: 0
			};
		}

		// Apply the border
		dimensions.minX -= this.props.paddingSquares;
		dimensions.maxX += this.props.paddingSquares;
		dimensions.minY -= this.props.paddingSquares;
		dimensions.maxY += this.props.paddingSquares;

		return dimensions;
	}

	private getStyle(x: number, y: number, width: number, height: number, style: 'square' | 'rounded' | 'circle' | null, dim: MapDimensions): MapItemStyle {
		let offsetX = 0;
		let offsetY = 0;
		if (width < 1) {
			offsetX = (1 - width) / 2;
		}
		if (height < 1) {
			offsetY = (1 - height) / 2;
		}

		let radius = '0';
		switch (style) {
			case 'rounded':
				radius = this.state.size + 'px';
				break;
			case 'circle':
				radius = '50%';
				break;
		}

		return {
			left: 'calc(' + this.state.size + 'px * ' + (x + offsetX - dim.minX) + ')',
			top: 'calc(' + this.state.size + 'px * ' + (y + offsetY - dim.minY) + ')',
			width: 'calc((' + this.state.size + 'px * ' + width + ') + 1px)',
			height: 'calc((' + this.state.size + 'px * ' + height + ') + 1px)',
			borderRadius: radius,
			backgroundSize: this.state.size + 'px'
		};
	}

	private menuClick(e: React.MouseEvent) {
		e.stopPropagation();
		this.toggleShowControls();
	}

	public render() {
		try {
			const mapDimensions = this.getMapDimensions();
			if (!mapDimensions) {
				return (
					<div className='section centered'>(blank map)</div>
				);
			}

			let items: MapItem[] = [];
			items = items.concat(this.props.map.items);
			if (this.props.floatingItem) {
				items.push(this.props.floatingItem);
			}

			// Draw the map tiles
			const tiles = items
				.filter(i => i.type === 'tile')
				.map(i => {
					const tileStyle = this.getStyle(i.x, i.y, i.width, i.height, i.style, mapDimensions);
					return (
						<MapTile
							key={i.id}
							tile={i}
							note={this.props.mode !== 'combat-player' ? Mercator.getNote(this.props.map, i) : null}
							style={tileStyle}
							selectable={this.props.mode === 'edit'}
							selected={this.props.selectedItemIDs.includes(i.id)}
							select={(id, ctrl) => this.props.mode === 'edit' ? this.props.itemSelected(id, ctrl) : null}
						/>
					);
				});

			// Draw fog of war
			let fog: JSX.Element[] = [];
			if (this.props.mode !== 'edit') {
				fog = this.props.fog
					.map(f => {
						const fogStyle = this.getStyle(f.x, f.y, 1, 1, 'square', mapDimensions);
						return (
							<GridSquare
								key={f.x + ',' + f.y}
								x={f.x}
								y={f.y}
								style={fogStyle}
								mode='fog'
							/>
						);
					});
			}

			// Draw overlays
			let overlays: JSX.Element[] = [];
			if ((this.props.mode !== 'edit') && (this.props.mode !== 'thumbnail')) {
				overlays = items
					.filter(i => i.type === 'overlay')
					.map(i => {
						const overlayStyle = this.getStyle(i.x, i.y, i.width, i.height, i.style, mapDimensions);
						overlayStyle.backgroundColor = i.color + i.opacity.toString(16);
						return (
							<MapOverlay
								key={i.id}
								overlay={i}
								note={this.props.mode !== 'combat-player' ? Mercator.getNote(this.props.map, i) : null}
								style={overlayStyle}
								selected={this.props.selectedItemIDs.includes(i.id)}
								select={(id, ctrl) => this.props.itemSelected(id, ctrl)}
							/>
						);
					});
			}

			// Draw token auras
			let auras: JSX.Element[] = [];
			if ((this.props.mode !== 'edit') && (this.props.mode !== 'thumbnail')) {
				auras = this.props.combatants
					.filter(c => c.aura.radius > 0)
					.filter(c => c.showOnMap || (this.props.mode !== 'combat-player'))
					.map(c => {
						const mi = items.find(i => i.id === c.id);
						if (mi) {
							const sizeInSquares = c.aura.radius / 5;
							const miniSize = Math.max(Utils.miniSize(c.displaySize), 1);
							const dim = (sizeInSquares * 2) + miniSize;
							const auraStyle = this.getStyle(mi.x - sizeInSquares, mi.y - sizeInSquares, dim, dim, c.aura.style, mapDimensions);
							auraStyle.backgroundColor = c.aura.color;
							return (
								<div
									key={c.id + ' aura'}
									className={'aura'}
									style={auraStyle}
								/>
							);
						}
						return null;
					})
					.filter(mt => mt !== null) as JSX.Element[];
			}

			// Draw the tokens
			let tokens: JSX.Element[] = [];
			if (this.props.mode !== 'edit') {
				const mountIDs = this.props.combatants.map(c => c.mountID || '').filter(id => id !== '');
				tokens = items
					.filter(i => (i.type === 'monster') || (i.type === 'pc') || (i.type === 'companion') || (i.type === 'token'))
					.filter(i => !mountIDs.includes(i.id))
					.map(i => {
						let miniSize = Utils.miniSize(i.size);
						let note = Mercator.getNote(this.props.map, i);
						let isPC = false;
						const combatant = this.props.combatants.find(c => c.id === i.id);
						if (combatant) {
							let s = combatant.displaySize;
							if (combatant.mountID) {
								const mount = this.props.combatants.find(m => m.id === combatant.mountID);
								if (mount) {
									s = mount.displaySize;
								}
							}
							miniSize = Utils.miniSize(s);
							if (!note && combatant.note) {
								note = Factory.createMapNote();
								note.targetID = combatant.id;
								note.text = combatant.note;
							}
							isPC = (combatant.type === 'pc');
						}
						const tokenStyle = this.getStyle(i.x, i.y, miniSize, miniSize, 'circle', mapDimensions);
						return (
							<MapToken
								key={i.id}
								token={i}
								note={this.props.mode !== 'combat-player' ? note : null}
								combatant={combatant || null}
								style={tokenStyle}
								simple={this.props.mode === 'thumbnail'}
								showGauge={this.props.mode === 'combat'}
								showHidden={(this.props.mode === 'combat') || isPC}
								selectable={(this.props.mode === 'combat') || (this.props.mode === 'combat-player')}
								selected={this.props.selectedItemIDs.includes(i.id)}
								select={(id, ctrl) => this.props.itemSelected(id, ctrl)}
							/>
						);
					})
					.filter(mt => mt !== null) as JSX.Element[];
			}

			// Draw the grid
			const grid = [];
			if (this.props.showGrid) {
				for (let yGrid = mapDimensions.minY; yGrid !== mapDimensions.maxY + 1; ++yGrid) {
					for (let xGrid = mapDimensions.minX; xGrid !== mapDimensions.maxX + 1; ++xGrid) {
						const overlayStyle = this.getStyle(xGrid, yGrid, 1, 1, 'square', mapDimensions);
						grid.push(
							<GridSquare
								key={xGrid + ',' + yGrid}
								x={xGrid}
								y={yGrid}
								style={overlayStyle}
								mode={'cell'}
								selected={this.isSelected(xGrid, yGrid)}
								onMouseDown={(posX, posY) => this.gridSquareMouseDown(posX, posY)}
								onMouseUp={(posX, posY) => this.gridSquareMouseUp(posX, posY)}
								onMouseEnter={(posX, posY) => this.gridSquareEntered(posX, posY)}
							/>
						);
					}
				}
			}

			let controls = null;
			if (this.props.mode !== 'thumbnail') {
				if (this.state.showControls) {
					controls = (
						<div className='map-menu'>
							<LeftCircleOutlined className='menu-icon rotate' onClick={e => this.menuClick(e)} />
							<NumberSpin
								value='zoom'
								downEnabled={this.state.size > 3}
								onNudgeValue={delta => this.nudgeSize(delta * 3)}
							/>
						</div>
					);
				} else {
					controls = (
						<div className='map-menu'>
							<LeftCircleOutlined className='menu-icon' onClick={e => this.menuClick(e)} />
						</div>
					);
				}
			}

			const style = 'map-panel ' + this.props.mode;
			const mapWidth = 1 + mapDimensions.maxX - mapDimensions.minX;
			const mapHeight = 1 + mapDimensions.maxY - mapDimensions.minY;
			return (
				<div className={style} onClick={() => this.props.itemSelected ? this.props.itemSelected(null, false) : null}>
					<div className='grid' style={{ width: ((this.state.size * mapWidth) + 2) + 'px', height: ((this.state.size * mapHeight) + 2) + 'px' }}>
						{tiles}
						{fog}
						{overlays}
						{auras}
						{tokens}
						{grid}
					</div>
					{controls}
				</div>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}

interface GridSquareProps {
	x: number;
	y: number;
	style: MapItemStyle;
	mode: 'cell' | 'fog';
	selected: boolean;
	onMouseDown: (x: number, y: number) => void;
	onMouseUp: (x: number, y: number) => void;
	onMouseEnter: (x: number, y: number) => void;
	onDoubleClick: (x: number, y: number) => void;
}

class GridSquare extends React.Component<GridSquareProps> {
	public static defaultProps = {
		selected: false,
		onMouseDown: null,
		onMouseUp: null,
		onMouseEnter: null,
		onDoubleClick: null
	};

	private mouseDown(e: React.MouseEvent) {
		e.stopPropagation();
		if (this.props.onMouseDown) {
			this.props.onMouseDown(this.props.x, this.props.y);
		}
	}

	private mouseUp(e: React.MouseEvent) {
		e.stopPropagation();
		if (this.props.onMouseUp) {
			this.props.onMouseUp(this.props.x, this.props.y);
		}
	}

	private mouseEnter(e: React.MouseEvent) {
		e.stopPropagation();
		if (this.props.onMouseEnter) {
			this.props.onMouseEnter(this.props.x, this.props.y);
		}
	}

	private doubleClick(e: React.MouseEvent) {
		e.stopPropagation();
		if (this.props.onDoubleClick) {
			this.props.onDoubleClick(this.props.x, this.props.y);
		}
	}

	public render() {
		try {
			return (
				<div
					className={'grid-square ' + this.props.mode + (this.props.selected ? ' selected' : '')}
					style={this.props.style}
					onMouseDown={e => this.mouseDown(e)}
					onMouseUp={e => this.mouseUp(e)}
					onMouseEnter={e => this.mouseEnter(e)}
					onDoubleClick={e => this.doubleClick(e)}
				/>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}

interface MapTileProps {
	tile: MapItem;
	note: MapNote | null;
	style: MapItemStyle;
	selectable: boolean;
	selected: boolean;
	select: (tileID: string, ctrl: boolean) => void;
}

class MapTile extends React.Component<MapTileProps> {
	private select(e: React.MouseEvent) {
		if (this.props.selectable) {
			e.stopPropagation();
			this.props.select(this.props.tile.id, e.ctrlKey);
		}
	}

	private getNoteText() {
		if (this.props.note) {
			return this.props.note.text.trim();
		}

		return '';
	}

	public render() {
		try {
			let style = 'tile ' + this.props.tile.terrain;
			if (this.props.selected) {
				style += ' selected';
			}

			let customImage = null;
			if (this.props.tile.terrain === 'custom') {
				const data = window.localStorage.getItem('image-' + this.props.tile.customBackground);
				if (data) {
					const image = JSON.parse(data);
					customImage = (
						<img className='custom-image' alt='map tile' src={image.data} />
					);
				}
			}

			let content = null;
			if (this.props.tile.content) {
				switch (this.props.tile.content.type) {
					case 'doorway':
						switch (this.props.tile.content.style) {
							case 'single':
								switch (this.props.tile.content.orientation) {
									case 'horizontal':
										content = (
											<svg className='tile-content'>
												<line className='thick' x1='0' y1='50%' x2='100%' y2='50%' />
												<rect className='thin outline' x='10%' y='25%' width='80%' height='50%' />
											</svg>
										);
										break;
									case 'vertical':
										content = (
											<svg className='tile-content'>
												<line className='thick' x1='50%' y1='0' x2='50%' y2='100%' />
												<rect className='thin outline' x='25%' y='10%' width='50%' height='80%' />
											</svg>
										);
										break;
								}
								break;
							case 'double':
								switch (this.props.tile.content.orientation) {
									case 'horizontal':
										content = (
											<svg className='tile-content'>
												<line className='thick' x1='0' y1='50%' x2='100%' y2='50%' />
												<rect className='thin outline' x='10%' y='25%' width='80%' height='50%' />
												<line className='thin' x1='50%' y1='25%' x2='50%' y2='75%' />
											</svg>
										);
										break;
									case 'vertical':
										content = (
											<svg className='tile-content'>
												<line className='thick' x1='50%' y1='0' x2='50%' y2='100%' />
												<rect className='thin outline' x='25%' y='10%' width='50%' height='80%' />
												<line className='thin' x1='25%' y1='50%' x2='75%' y2='50%' />
											</svg>
										);
										break;
								}
								break;
							case 'arch':
								switch (this.props.tile.content.orientation) {
									case 'horizontal':
										content = (
											<svg className='tile-content'>
												<line className='thick' x1='0' y1='50%' x2='20%' y2='50%' />
												<line className='thick' x1='80%' y1='50%' x2='100%' y2='50%' />
												<line className='medium' x1='20%' y1='20%' x2='20%' y2='80%' />
												<line className='medium' x1='80%' y1='20%' x2='80%' y2='80%' />
											</svg>
										);
										break;
									case 'vertical':
										content = (
											<svg className='tile-content'>
												<line className='thick' x1='50%' y1='0' x2='50%' y2='20%' />
												<line className='thick' x1='50%' y1='80%' x2='50%' y2='100%' />
												<line className='medium' x1='20%' y1='20%' x2='80%' y2='20%' />
												<line className='medium' x1='20%' y1='80%' x2='80%' y2='80%' />
											</svg>
										);
										break;
								}
								break;
							case 'bars':
								switch (this.props.tile.content.orientation) {
									case 'horizontal':
										content = (
											<svg className='tile-content'>
												<circle className='thin filled' cx='10%' cy='50%' r='5%' />
												<circle className='thin filled' cx='30%' cy='50%' r='5%' />
												<circle className='thin filled' cx='50%' cy='50%' r='5%' />
												<circle className='thin filled' cx='70%' cy='50%' r='5%' />
												<circle className='thin filled' cx='90%' cy='50%' r='5%' />
											</svg>
										);
										break;
									case 'vertical':
										content = (
											<svg className='tile-content'>
												<circle className='thin filled' cx='50%' cy='10%' r='5%' />
												<circle className='thin filled' cx='50%' cy='30%' r='5%' />
												<circle className='thin filled' cx='50%' cy='50%' r='5%' />
												<circle className='thin filled' cx='50%' cy='70%' r='5%' />
												<circle className='thin filled' cx='50%' cy='90%' r='5%' />
											</svg>
										);
										break;
								}
								break;
						}
						break;
					case 'stairway':
						switch (this.props.tile.content.style) {
							case 'stairs':
								switch (this.props.tile.content.orientation) {
									case 'horizontal':
										content = (
											<svg className='tile-content'>
												<line className='thin' x1='0' y1='12.5%' x2='100%' y2='12.5%' />
												<line className='thin' x1='0' y1='25%' x2='100%' y2='25%' />
												<line className='thin' x1='0' y1='37.5%' x2='100%' y2='37.5%' />
												<line className='thin' x1='0' y1='50%' x2='100%' y2='50%' />
												<line className='thin' x1='0' y1='62.5%' x2='100%' y2='62.5%' />
												<line className='thin' x1='0' y1='75%' x2='100%' y2='75%' />
												<line className='thin' x1='0' y1='87.5%' x2='100%' y2='87.5%' />
											</svg>
										);
										break;
									case 'vertical':
										content = (
											<svg className='tile-content'>
												<line className='thin' x1='12.5%' y1='0' x2='12.5%' y2='100%' />
												<line className='thin' x1='25%' y1='0' x2='25%' y2='100%' />
												<line className='thin' x1='37.5%' y1='0' x2='37.5%' y2='100%' />
												<line className='thin' x1='50%' y1='0' x2='50%' y2='100%' />
												<line className='thin' x1='62.5%' y1='0' x2='62.5%' y2='100%' />
												<line className='thin' x1='75%' y1='0' x2='75%' y2='100%' />
												<line className='thin' x1='87.5%' y1='0' x2='87.5%' y2='100%' />
											</svg>
										);
										break;
								}
								break;
							case 'spiral':
								content = (
									<svg className='tile-content'>
										<ellipse className='thin outline' cx='50%' cy='50%' rx='40%' ry='40%' />
										<ellipse className='thin filled' cx='50%' cy='50%' rx='10%' ry='10%' />
										<line className='thin' x1='50%' y1='10%' x2='50%' y2='90%' />
										<line className='thin' x1='10%' y1='50%' x2='90%' y2='50%' />
										<line className='thin' x1='20%' y1='20%' x2='80%' y2='80%' />
										<line className='thin' x1='20%' y1='80%' x2='80%' y2='20%' />
									</svg>
								);
								break;
							case 'ladder':
								switch (this.props.tile.content.orientation) {
									case 'horizontal':
										content = (
											<svg className='tile-content'>
												<circle className='thin filled' cx='20%' cy='50%' r='7%' />
												<line className='thin' x1='20%' y1='50%' x2='80%' y2='50%' />
												<circle className='thin filled' cx='80%' cy='50%' r='7%' />
											</svg>
										);
										break;
									case 'vertical':
										content = (
											<svg className='tile-content'>
												<circle className='thin filled' cx='50%' cy='20%' r='7%' />
												<line className='thin' x1='50%' y1='20%' x2='50%' y2='80%' />
												<circle className='thin filled' cx='50%' cy='80%' r='7%' />
											</svg>
										);
										break;
								}
								break;
						}
						break;
				}
			}

			const tile = (
				<div
					className={style}
					style={this.props.style}
					onClick={e => this.select(e)}
				>
					{customImage}
					{content}
				</div>
			);

			const noteText = this.getNoteText();
			if (noteText) {
				return (
					<Tooltip placement='bottom' title={<div dangerouslySetInnerHTML={{ __html: showdown.makeHtml(noteText) }} />}>
						{tile}
					</Tooltip>
				);
			} else {
				return tile;
			}
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}

interface MapOverlayProps {
	overlay: MapItem;
	note: MapNote | null;
	style: MapItemStyle;
	selected: boolean;
	select: (tileID: string, ctrl: boolean) => void;
}

class MapOverlay extends React.Component<MapOverlayProps> {
	private select(e: React.MouseEvent) {
		e.stopPropagation();
		this.props.select(this.props.overlay.id, e.ctrlKey);
	}

	private getNoteText() {
		if (this.props.note) {
			return this.props.note.text.trim();
		}

		return '';
	}

	public render() {
		try {
			let style = 'overlay';
			if (this.props.selected) {
				style += ' selected';
			}

			const overlay = (
				<div
					className={style}
					style={this.props.style}
					onClick={e => this.select(e)}
				/>
			);

			const noteText = this.getNoteText();
			if (noteText) {
				return (
					<Tooltip placement='bottom' title={<div dangerouslySetInnerHTML={{ __html: showdown.makeHtml(noteText) }} />}>
						{overlay}
					</Tooltip>
				);
			} else {
				return overlay;
			}
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}

interface MapTokenProps {
	token: MapItem;
	note: MapNote | null;
	combatant: Combatant | null;
	style: MapItemStyle;
	simple: boolean;
	showGauge: boolean;
	showHidden: boolean;
	selectable: boolean;
	selected: boolean;
	select: (tokenID: string, ctrl: boolean) => void;
}

class MapToken extends React.Component<MapTokenProps> {
	private select(e: React.MouseEvent) {
		if (this.props.selectable) {
			e.stopPropagation();
			this.props.select(this.props.token.id, e.ctrlKey);
		}
	}

	private getNoteText() {
		let noteText = this.props.combatant ? '**' + this.props.combatant.displayName + '**' : '';

		if (this.props.combatant) {
			if (!this.props.combatant.showOnMap) {
				noteText += '\n\n';
				noteText += '**hidden**';
			}

			this.props.combatant.tags.forEach(tag => {
				noteText += '\n\n';
				noteText += '**' + Utils.getTagTitle(tag) + '**';
				noteText += '\n\n';
				noteText += '* ' + Utils.getTagDescription(tag);
			});

			this.props.combatant.conditions.forEach(condition => {
				noteText += '\n\n';
				noteText += '**' + condition.name + '**';
				Utils.conditionText(condition).forEach(txt => {
					noteText += '\n\n';
					noteText += '* ' + txt;
				});
			});
		}

		if (this.props.note && this.props.note.text) {
			noteText += '\n\n';
			noteText += this.props.note.text;
		}

		return noteText.trim();
	}

	public render() {
		try {
			let name = 'token';
			let style = 'token';

			if (this.props.selected) {
				style += ' selected';
			}

			if (this.props.combatant) {
				name = this.props.combatant.displayName || 'combatant';
				style += ' ' + this.props.combatant.faction;

				if (this.props.combatant.current) {
					style += ' current';
				}
				if (!this.props.combatant.showOnMap) {
					if (this.props.showHidden) {
						style += ' hidden';
					} else {
						return null;
					}
				}
			}

			let content = null;
			let hpGauge = null;
			let altitudeBadge = null;
			let conditionsBadge = null;
			if (this.props.combatant && !this.props.simple) {
				let src = '';
				const c = this.props.combatant as (Combatant & PC) | (Combatant & Monster);
				if (c && c.portrait) {
					const data = window.localStorage.getItem('image-' + c.portrait);
					if (data) {
						const image = JSON.parse(data);
						src = image.data;
					}
				}

				if (src) {
					content = (
						<img className='portrait' src={src} alt={name} />
					);
				} else {
					const inits = name.toUpperCase()
									.replace(/[^A-Z0-9 ]/, '')
									.split(' ')
									.map(s => s[0])
									.join('');
					content = (
						<div className='initials'>{inits}</div>
					);
				}

				if (this.props.combatant.type === 'monster' && this.props.showGauge) {
					const current = this.props.combatant.hpCurrent || 0;
					const max = this.props.combatant.hpMax || 0;
					if (current < max) {
						hpGauge = (
							<HitPointGauge combatant={this.props.combatant} />
						);
					}
				}

				if (this.props.combatant.altitude > 0) {
					altitudeBadge = (
						<div className='badge'>
							<UpSquareTwoTone twoToneColor='#3c78dc' />
						</div>
					);
				}

				if (this.props.combatant.altitude < 0) {
					altitudeBadge = (
						<div className='badge'>
							<DownSquareTwoTone twoToneColor='#3c78dc' />
						</div>
					);
				}

				let things = 0;
				if (this.props.combatant.conditions) {
					things += this.props.combatant.conditions.length;
				}
				if (this.props.combatant.tags) {
					things += this.props.combatant.tags
						.filter(t => !t.startsWith('engaged'))
						.length;
				}
				if (things > 0) {
					conditionsBadge = (
						<div className='conditions'>
							<StarTwoTone twoToneColor='#3c78dc' />
						</div>
					);
				}
			}

			const token = (
				<div
					className={style}
					style={this.props.style}
					onClick={e => this.select(e)}
				>
					{content}
					{hpGauge}
					{altitudeBadge}
					{conditionsBadge}
				</div>
			);

			const noteText = this.getNoteText();
			if (noteText) {
				return (
					<Tooltip placement='bottom' title={<div dangerouslySetInnerHTML={{ __html: showdown.makeHtml(noteText) }} />}>
						{token}
					</Tooltip>
				);
			} else {
				return token;
			}
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}
