import { DownSquareTwoTone, StarTwoTone, UpSquareTwoTone } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React from 'react';
import Showdown from 'showdown';

import { Gygax } from '../../utils/gygax';
import { Matisse } from '../../utils/matisse';

import { Combatant } from '../../models/combat';
import { Map, MapArea, MapDimensions, MapItem } from '../../models/map';
import { Monster } from '../../models/monster';
import { PC } from '../../models/party';

import { Dropdown } from '../controls/dropdown';
import { NumberSpin } from '../controls/number-spin';
import { HitPointGauge } from './hit-point-gauge';

const showdown = new Showdown.Converter();
showdown.setOption('tables', true);

interface Props {
	map: Map;
	mode: 'edit' | 'thumbnail' | 'combat' | 'combat-player';
	viewport: MapDimensions | null;
	paddingSquares: number;
	combatants: Combatant[];
	showGrid: boolean;
	showAreaNames: boolean;
	selectedItemIDs: string[];
	fog: { x: number, y: number }[];
	focussedSquare: { x: number, y: number } | null;
	itemSelected: (itemID: string | null, ctrl: boolean) => void;
	areaSelected: (areaID: string | null) => void;
	gridSquareEntered: (x: number, y: number) => void;
	gridSquareClicked: (x: number, y: number) => void;
	gridRectangleSelected: (x1: number, y1: number, x2: number, y2: number) => void;
}

interface State {
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

export class MapPanel extends React.Component<Props, State> {
	public static defaultProps = {
		mode: 'thumbnail',
		viewport: null,
		paddingSquares: 0,
		combatants: [],
		showGrid: false,
		showAreaNames: false,
		selectedItemIDs: [],
		fog: [],
		focussedSquare: null,
		itemSelected: null,
		areaSelected: null,
		gridSquareEntered: null,
		gridSquareClicked: null,
		gridRectangleUpdated: null,
		gridRectangleSelected: null
	};

	constructor(props: Props) {
		super(props);

		this.state = {
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

			this.props.map.areas.forEach(a => {
				if (dimensions) {
					dimensions.minX = Math.min(dimensions.minX, a.x);
					dimensions.maxX = Math.max(dimensions.maxX, a.x + a.width - 1);
					dimensions.minY = Math.min(dimensions.minY, a.y);
					dimensions.maxY = Math.max(dimensions.maxY, a.y + a.height - 1);
				}
			});

			this.props.combatants.filter(c => c.aura.radius > 0).forEach(c => {
				const mi = this.props.map.items.find(i => i.id === c.id);
				if (mi) {
					const sizeInSquares = c.aura.radius / 5;
					let miniSize = 1;
					const m = c as Combatant & Monster;
					if (m) {
						miniSize = Math.max(Gygax.miniSize(m.size), 1);
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

		if ((this.props.mode === 'thumbnail') || (this.props.mode === 'combat-player')) {
			// Invert the fog
			const visible: { x: number, y: number }[] = [];
			for (let x = dimensions.minX; x <= dimensions.maxX; ++x) {
				for (let y = dimensions.minY; y <= dimensions.maxY; ++y) {
					if (!this.props.fog.find(f => (f.x === x) && (f.y === y))) {
						visible.push({ x: x, y: y });
					}
				}
			}
			if (visible.length > 0) {
				const xs = visible.map(f => f.x);
				const ys = visible.map(f => f.y);
				dimensions = {
					minX: Math.min(...xs),
					maxX: Math.max(...xs),
					minY: Math.min(...ys),
					maxY: Math.max(...ys)
				};
			}
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

	public render() {
		try {
			let controls = null;
			if (this.props.mode !== 'thumbnail') {
				controls = (
					<Controls
						mapSize={this.state.size}
						setMapSize={size => this.setState({ size: size })}
						showAreas={(this.props.mode === 'combat') && (this.props.map.areas.length > 0)}
						areas={this.props.map.areas}
						selectArea={id => this.props.areaSelected(id)}
					/>
				);
			}

			const mapDimensions = this.getMapDimensions();
			if (!mapDimensions) {
				return (
					<div className='section centered'>(blank map)</div>
				);
			}

			// Draw the map areas
			let areas: JSX.Element[] = [];
			if ((this.props.mode === 'edit') || (this.props.mode === 'combat')) {
				areas = this.props.map.areas
					.map(a => {
						const areaStyle = this.getStyle(a.x, a.y, a.width, a.height, 'square', mapDimensions);
						return (
							<Area
								key={a.id}
								style={areaStyle}
								selected={this.props.selectedItemIDs.includes(a.id)}
							/>
						);
					});
			}

			// Draw the map tiles
			const tiles = this.props.map.items
				.filter(i => i.type === 'tile')
				.map(i => {
					const tileStyle = this.getStyle(i.x, i.y, i.width, i.height, i.style, mapDimensions);
					return (
						<MapTile
							key={i.id}
							tile={i}
							style={tileStyle}
							selectable={this.props.mode === 'edit'}
							selected={this.props.selectedItemIDs.includes(i.id)}
							select={(id, ctrl) => this.props.mode === 'edit' ? this.props.itemSelected(id, ctrl) : null}
						/>
					);
				});

			// Draw area names
			let areaNames: JSX.Element[] = [];
			if (this.props.showAreaNames) {
				areaNames = this.props.map.areas.map(area => {
					const areaStyle = this.getStyle(area.x, area.y, area.width, area.height, null, mapDimensions);
					return (
						<div key={area.id + ' name'} className='map-area-name' style={areaStyle}>
							{area.name}
						</div>
					);
				});
			}

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
				overlays = this.props.map.items
					.filter(i => i.type === 'overlay')
					.map(i => {
						const overlayStyle = this.getStyle(i.x, i.y, i.width, i.height, i.style, mapDimensions);
						overlayStyle.backgroundColor = i.color + i.opacity.toString(16);
						return (
							<MapOverlay
								key={i.id}
								overlay={i}
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
						const mi = this.props.map.items.find(i => i.id === c.id);
						if (mi) {
							const sizeInSquares = c.aura.radius / 5;
							const miniSize = Math.max(Gygax.miniSize(c.displaySize), 1);
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
				tokens = this.props.map.items
					.filter(i => (i.type === 'monster') || (i.type === 'pc') || (i.type === 'companion') || (i.type === 'token'))
					.filter(i => !mountIDs.includes(i.id))
					.sort((a, b) => {
						const combatantA = this.props.combatants.find(c => c.id === a.id);
						const combatantB = this.props.combatants.find(c => c.id === b.id);
						const sizeA = combatantA ? combatantA.displaySize : a.size;
						const sizeB = combatantB ? combatantB.displaySize : b.size;
						return Gygax.miniSize(sizeB) - Gygax.miniSize(sizeA);
					})
					.map(i => {
						let miniSize = Gygax.miniSize(i.size);
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
							miniSize = Gygax.miniSize(s);
							isPC = (combatant.type === 'pc');
						}
						const tokenStyle = this.getStyle(i.x, i.y, miniSize, miniSize, 'circle', mapDimensions);
						return (
							<MapToken
								key={i.id}
								token={i}
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
					});
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

			let focus = null;
			if (this.props.focussedSquare) {
				const focusStyle = this.getStyle(this.props.focussedSquare.x - 1, this.props.focussedSquare.y - 1, 3, 3, 'circle', mapDimensions);
				focus = (
					<div className='grid-focus' style={focusStyle} />
				);
			}

			const style = 'map-panel ' + this.props.mode;
			const squareWidth = 1 + mapDimensions.maxX - mapDimensions.minX;
			const squareHeight = 1 + mapDimensions.maxY - mapDimensions.minY;
			const mapWidth = (this.state.size * squareWidth) + 2;
			let mapHeight = (this.state.size * squareHeight) + 2;
			if (controls) {
				mapHeight += 42;
			}
			return (
				<div
					className={style}
					style={{ width: mapWidth + 'px', height: mapHeight + 'px' }}
					onClick={() => this.props.itemSelected ? this.props.itemSelected(null, false) : null}
					role='button'
				>
					{controls}
					<div className='grid'>
						{areas}
						{tiles}
						{areaNames}
						{fog}
						{overlays}
						{auras}
						{tokens}
						{grid}
						{focus}
					</div>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}

interface ControlsProps {
	mapSize: number;
	setMapSize: (size: number) => void;
	showAreas: boolean;
	areas: MapArea[];
	selectArea: (id: string | null) => void;
}

class Controls extends React.Component<ControlsProps> {
	private nudgeSize(delta: number) {
		const value = Math.max(this.props.mapSize + delta, 3);
		this.props.setMapSize(value);
	}

	public render() {
		try {
			const controls = [];

			controls.push(
				<NumberSpin
					key='zoom'
					value='zoom'
					downEnabled={this.props.mapSize > 3}
					onNudgeValue={delta => this.nudgeSize(delta * 3)}
				/>
			);

			if (this.props.showAreas) {
				const areas = [{ id: '', text: 'whole map' }];
				this.props.areas.forEach(a => {
					areas.push({ id: a.id, text: a.name });
				});
				controls.push(
					<Dropdown
						key='areas'
						options={areas}
						placeholder='select a map area...'
						onSelect={id => this.props.selectArea(id)}
					/>
				);
			}

			return (
				<div className='map-menu'>
					{controls}
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}

interface AreaProps {
	style: MapItemStyle;
	selected: boolean;
}

class Area extends React.Component<AreaProps> {
	public render() {
		try {
			let style = 'map-area';
			if (this.props.selected) {
				style += ' selected';
			}
			return (
				<div
					className={style}
					style={this.props.style}
				/>
			);
		} catch (ex) {
			console.error(ex);
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
					role='button'
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

	public render() {
		try {
			let style = 'tile ' + this.props.tile.terrain;
			if (this.props.selected) {
				style += ' selected';
			}

			let customImage = null;
			if (this.props.tile.terrain === 'custom') {
				const image = Matisse.getImage(this.props.tile.customBackground);
				if (image) {
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

			return (
				<div
					className={style}
					style={this.props.style}
					onClick={e => this.select(e)}
					role='button'
				>
					{customImage}
					{content}
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}

interface MapOverlayProps {
	overlay: MapItem;
	style: MapItemStyle;
	selected: boolean;
	select: (tileID: string, ctrl: boolean) => void;
}

class MapOverlay extends React.Component<MapOverlayProps> {
	private select(e: React.MouseEvent) {
		e.stopPropagation();
		this.props.select(this.props.overlay.id, e.ctrlKey);
	}

	public render() {
		try {
			let style = 'overlay';
			if (this.props.selected) {
				style += ' selected';
			}

			return (
				<div
					className={style}
					style={this.props.style}
					onClick={e => this.select(e)}
					role='button'
				/>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}

interface MapTokenProps {
	token: MapItem;
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

			if (this.props.combatant.altitude !== 0) {
				noteText += '\n\n';
				noteText += '**altitude**: ' + Math.abs(this.props.combatant.altitude) + ' ft ' + (this.props.combatant.altitude > 0 ? 'up' : 'down');
			}

			this.props.combatant.tags.forEach(tag => {
				noteText += '\n\n';
				noteText += '**' + Gygax.getTagTitle(tag) + '**';
				noteText += '\n\n';
				noteText += '* ' + Gygax.getTagDescription(tag);
			});

			this.props.combatant.conditions.forEach(condition => {
				if (condition.name === 'custom') {
					Gygax.conditionText(condition).forEach(txt => {
						noteText += '\n\n';
						noteText += '* ' + txt;
					});
				} else {
					noteText += '\n\n';
					noteText += '* ' + condition.name;
				}
			});

			if (this.props.combatant.note) {
				noteText += '\n\n';
				noteText += this.props.combatant.note;
			}
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
				const c = this.props.combatant as (Combatant & PC) | (Combatant & Monster);
				if (c && c.portrait) {
					content = (
						<img className='portrait' src={c.portrait} alt={name} />
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
					role='button'
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
