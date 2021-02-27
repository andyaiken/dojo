import { BulbOutlined, CloudOutlined, DeleteOutlined, DownSquareTwoTone, EnvironmentOutlined, ExpandOutlined, StarTwoTone, UpSquareTwoTone, ZoomInOutlined } from '@ant-design/icons';
import { Popover, Progress } from 'antd';
import React from 'react';
import ReactMarkdown from 'react-markdown';

import { Gygax } from '../../utils/gygax';
import { Matisse } from '../../utils/matisse';
import { Mercator } from '../../utils/mercator';
import { Comms } from '../../utils/uhura';

import { Combatant } from '../../models/combat';
import { Condition } from '../../models/condition';
import { Map, MapDimensions, MapItem } from '../../models/map';
import { Options } from '../../models/misc';
import { Monster } from '../../models/monster';
import { PC } from '../../models/party';

import { RenderError } from '../error';
import { Checkbox } from '../controls/checkbox';
import { Conditional } from '../controls/conditional';
import { Group } from '../controls/group';
import { Note } from '../controls/note';
import { NumberSpin } from '../controls/number-spin';
import { RadioGroup } from '../controls/radio-group';
import { CombatantTags } from './combat-controls-panel';

interface Props {
	map: Map;
	mode: 'edit' | 'thumbnail' | 'combat' | 'combat-player';
	features: {
		highlight: boolean;
		editFog: boolean;
	};
	options: Options | null;
	viewport: MapDimensions | null;
	paddingSquares: number;
	combatants: Combatant[];
	showGrid: boolean;
	showAreaNames: boolean;
	selectedItemIDs: string[];
	fog: { x: number, y: number }[];
	lighting: 'bright light' | 'dim light' | 'darkness';
	focussedSquare: { x: number, y: number } | null;
	itemSelected: (itemID: string | null, ctrl: boolean) => void;
	itemRemove: (itemID: string) => void;
	conditionRemove: (combatant: Combatant, condition: Condition) => void;
	toggleTag: (combatants: Combatant[], tag: string) => void;
	toggleCondition: (combatants: Combatant[], condition: string) => void;
	toggleHidden: (combatants: Combatant[]) => void;
	areaSelected: (areaID: string | null) => void;
	gridSquareEntered: (x: number, y: number) => void;
	gridSquareClicked: (x: number, y: number) => void;
	gridRectangleSelected: (x1: number, y1: number, x2: number, y2: number) => void;
	changeLighting: (light: string) => void;
	toggleFeature: (feature: string) => void;
	fillFog: () => void;
	clearFog: () => void;
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
	fontSize?: string;
	opacity?: string;
}

export class MapPanel extends React.Component<Props, State> {
	public static defaultProps = {
		mode: 'thumbnail',
		features: {
			highlight: false,
			editFog: false
		},
		options: null,
		viewport: null,
		paddingSquares: 0,
		combatants: [],
		showGrid: false,
		showAreaNames: false,
		selectedItemIDs: [],
		fog: [],
		lighting: 'bright light',
		focussedSquare: null,
		itemSelected: null,
		itemMove: null,
		itemRemove: null,
		conditionRemove: null,
		toggleTag: null,
		toggleCondition: null,
		toggleHidden: null,
		areaSelected: null,
		gridSquareEntered: null,
		gridSquareClicked: null,
		gridRectangleUpdated: null,
		gridRectangleSelected: null,
		changeLighting: null,
		toggleFeature: null,
		fillFog: null,
		clearFog: null
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
			width: 'calc(' + this.state.size + 'px * ' + width + ')',
			height: 'calc(' + this.state.size + 'px * ' + height + ')',
			borderRadius: radius,
			backgroundSize: this.state.size + 'px'
		};
	}

	//#region Rendering

	private getControls() {
		if (this.props.mode !== 'thumbnail') {
			const controls = [];

			if ((this.props.mode === 'combat') && (this.props.map.areas.length > 0)) {
				const areas = [{ id: '', text: 'whole map' }];
				this.props.map.areas.forEach(a => {
					areas.push({ id: a.id, text: a.name || 'unnamed area' });
				});
				controls.push(
					<Popover
						key='areas'
						content={(
							<RadioGroup
								items={areas}
								onSelect={id => this.props.areaSelected(id)}
							/>
						)}
						trigger='hover'
						placement='bottom'
						overlayClassName='map-control-tooltip'
					>
						<ExpandOutlined title='areas' />
					</Popover>
				);
			}

			controls.push(
				<Popover
					key='zoom'
					content={(
						<NumberSpin
							value='zoom'
							downEnabled={this.state.size > 3}
							onNudgeValue={delta => this.setState({ size: Math.max(this.state.size + (delta * 3), 3) })}
						/>
					)}
					trigger='hover'
					placement='bottom'
					overlayClassName='map-control-tooltip'
				>
					<ZoomInOutlined title='zoom' />
				</Popover>
			);

			if (this.props.mode === 'combat') {
				controls.push(
					<Popover
						key='light'
						content={(
							<NumberSpin
								value={this.props.lighting}
								downEnabled={this.props.lighting !== 'darkness'}
								upEnabled={this.props.lighting !== 'bright light'}
								onNudgeValue={delta => this.props.changeLighting(Gygax.nudgeLighting(this.props.lighting, delta))}
							/>
						)}
						trigger='hover'
						placement='bottom'
						overlayClassName='map-control-tooltip'
					>
						<BulbOutlined title='lighting' />
					</Popover>
				);

				controls.push(
					<Popover
						key='highlight'
						content={(
							<div>
								<Checkbox
									label='highlight map square'
									checked={this.props.features.highlight}
									onChecked={() => this.props.toggleFeature('highlight')}
								/>
								<Conditional display={this.props.features.highlight}>
									<Note>
										<div className='section'>
											use your mouse to indicate a square on the map
										</div>
										<div className='section'>
											that square will be highlighted on the shared map as well
										</div>
									</Note>
								</Conditional>
							</div>
						)}
						trigger='hover'
						placement='bottom'
						overlayClassName='map-control-tooltip'
					>
						<EnvironmentOutlined title='highlight map square' className={this.props.features.highlight ? 'selected' : ''} />
					</Popover>
				);

				controls.push(
					<Popover
						key='fog'
						content={(
							<div>
								<Checkbox
									label='edit fog of war'
									checked={this.props.features.editFog}
									onChecked={() => this.props.toggleFeature('editFog')}
								/>
								<Conditional display={this.props.features.editFog}>
									<Note>
										<div className='section'>
											click on map squares to turn fog of war on and off
										</div>
										<div className='section'>
											you can also click and drag to select an area
										</div>
									</Note>
									<button onClick={() => this.props.fillFog()}>
										fill fog of war
									</button>
									<button onClick={() => this.props.clearFog()} className={this.props.fog.length === 0 ? 'disabled' : ''}>
										clear fog of war
									</button>
								</Conditional>
							</div>
						)}
						trigger='hover'
						placement='bottom'
						overlayClassName='map-control-tooltip'
					>
						<CloudOutlined title='fog of war' className={this.props.features.editFog ? 'selected' : ''} />
					</Popover>
				);
			}

			return (
				<div className='map-menu'>
					{controls}
				</div>
			);
		}

		return null;
	}

	private getAreas(dimensions: MapDimensions) {
		if ((this.props.mode === 'edit') || (this.props.mode === 'combat')) {
			return this.props.map.areas.map(a => (
				<Area
					key={a.id}
					style={this.getStyle(a.x, a.y, a.width, a.height, 'square', dimensions)}
					selected={this.props.selectedItemIDs.includes(a.id)}
				/>
			));
		}

		return null;
	}

	private getTiles(dimensions: MapDimensions) {
		return this.props.map.items
			.filter(i => i.type === 'tile')
			.map(i => (
				<Tile
					key={i.id}
					tile={i}
					style={this.getStyle(i.x, i.y, i.width, i.height, i.style, dimensions)}
					selectable={this.props.mode === 'edit'}
					selected={this.props.selectedItemIDs.includes(i.id)}
					select={(id, ctrl) => this.props.mode === 'edit' ? this.props.itemSelected(id, ctrl) : null}
				/>
			));
	}

	private getAreaNames(dimensions: MapDimensions) {
		if (this.props.showAreaNames) {
			return this.props.map.areas.map(area => (
				<div
					key={area.id + ' name'}
					className='map-area-name'
					style={this.getStyle(area.x, area.y, area.width, area.height, null, dimensions)}
				>
					{area.name}
				</div>
			));
		}

		return null;
	}

	private getOverlays(dimensions: MapDimensions) {
		if ((this.props.mode !== 'edit') && (this.props.mode !== 'thumbnail')) {
			return this.props.map.items
				.filter(i => i.type === 'overlay')
				.map(i => {
					const overlayStyle = this.getStyle(i.x, i.y, i.width, i.height, i.style, dimensions);
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

		return null;
	}

	private getAuras(dimensions: MapDimensions) {
		if ((this.props.mode !== 'edit') && (this.props.mode !== 'thumbnail')) {
			return this.props.combatants
				.filter(c => c.aura.radius > 0)
				.filter(c => c.showOnMap || (this.props.mode !== 'combat-player'))
				.map(c => {
					const mi = this.props.map.items.find(i => i.id === c.id);
					if (mi) {
						const sizeInSquares = c.aura.radius / 5;
						const dim = (sizeInSquares * 2) + Math.max(Gygax.miniSize(c.displaySize), 1);
						const auraStyle = this.getStyle(mi.x - sizeInSquares, mi.y - sizeInSquares, dim, dim, c.aura.style, dimensions);
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
				});
		}

		return null;
	}

	private getSteps(dimensions: MapDimensions) {
		if ((this.props.mode === 'combat') || (this.props.mode === 'combat-player')) {
			const steps: (JSX.Element | null)[] = [];

			this.props.map.items.forEach(i => {
				const combatant = this.props.combatants.find(c => c.id === i.id);
				if (combatant && combatant.path && (combatant.path.length > 0)) {
					try {
						let s = combatant.displaySize;
						if (combatant.mountID) {
							const mount = this.props.combatants.find(m => m.id === combatant.mountID);
							if (mount) {
								s = mount.displaySize;
							}
						}
						const miniSize = Gygax.miniSize(s);

						combatant.path.forEach((step, index) => {
							steps.push(
								<GridSquare
									key={combatant.id + '-step-' + index}
									x={step.x}
									y={step.y}
									style={this.getStyle(step.x, step.y, miniSize, miniSize, 'circle', dimensions)}
									mode='step'
								/>
							);
						});
					} catch (e) {
						console.error('drawing steps');
						console.error('path is ' + combatant.path);
						console.error(e);
					}
				}
			});

			return steps;
		}

		return null;
	}

	private getDistances(dimensions: MapDimensions) {
		if ((this.props.mode === 'combat') || (this.props.mode === 'combat-player')) {
			const distances: (JSX.Element | null)[] = [];

			this.props.map.items.forEach(i => {
				const combatant = this.props.combatants.find(c => c.id === i.id);
				if (combatant && combatant.path && (combatant.path.length > 0)) {
					try {
						let s = combatant.displaySize;
						if (combatant.mountID) {
							const mount = this.props.combatants.find(m => m.id === combatant.mountID);
							if (mount) {
								s = mount.displaySize;
							}
						}
						const miniSize = Gygax.miniSize(s);

						const d = Mercator.getDistance(i, combatant.path, this.props.options ? this.props.options.diagonals : '');
						const firstStep = combatant.path[0];
						const firstStepStyle = this.getStyle(firstStep.x, firstStep.y, miniSize, miniSize, 'circle', dimensions);
						firstStepStyle.fontSize = (miniSize * this.state.size / 5) + 'px';
						distances.push(
							<GridSquare
								key={combatant.id + '-distance'}
								x={firstStep.x}
								y={firstStep.y}
								style={firstStepStyle}
								mode='step'
								content={(d * 5) + ' ft'}
							/>
						);
					} catch (e) {
						console.error('drawing distances');
						console.error('path is ' + combatant.path);
						console.error(e);
					}
				}
			});

			return distances;
		}

		return null;
	}

	private getTokens(dimensions: MapDimensions) {
		if (this.props.mode !== 'edit') {
			const tokens: (JSX.Element | null)[] = [];

			// Find the active token
			let activeToken: MapItem | null = null;
			const characterID = Comms.getCharacterID(Comms.getID());
			if (characterID) {
				// The active token is my character's token
				activeToken = this.props.map.items.find(i => i.id === characterID) || null;
			} else {
				// The active token is the initiative holder
				const combatant = this.props.combatants.find(c => c.current);
				if (combatant) {
					activeToken = this.props.map.items.find(i => i.id === combatant.id) || null;
				}
			}

			const mountIDs = this.props.combatants.map(c => c.mountID || '').filter(id => id !== '');
			this.props.map.items
				.filter(i => (i.type === 'monster') || (i.type === 'pc') || (i.type === 'companion') || (i.type === 'token'))
				.filter(i => !mountIDs.includes(i.id))
				.sort((a, b) => {
					const combatantA = this.props.combatants.find(c => c.id === a.id);
					const combatantB = this.props.combatants.find(c => c.id === b.id);
					const sizeA = combatantA ? combatantA.displaySize : a.size;
					const sizeB = combatantB ? combatantB.displaySize : b.size;
					return Gygax.miniSize(sizeB) - Gygax.miniSize(sizeA);
				})
				.forEach(i => {
					let miniSize = Gygax.miniSize(i.size);
					let isPC = false;
					let isMe = false;
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
						isMe = (combatant.id === Comms.getCharacterID(Comms.getID())) && Comms.data.options.allowControls;
					}
					const tokenStyle = this.getStyle(i.x, i.y, miniSize, miniSize, 'circle', dimensions);
					tokenStyle.fontSize = (miniSize * this.state.size / 4) + 'px';
					tokens.push(
						<MapToken
							key={i.id}
							token={i}
							combatant={combatant || null}
							activeToken={activeToken}
							style={tokenStyle}
							width={miniSize * this.state.size}
							simple={this.props.mode === 'thumbnail'}
							showGauge={this.props.mode === 'combat'}
							showHidden={(this.props.mode === 'combat') || isPC}
							selectable={this.props.mode === 'combat' || ((this.props.mode === 'combat-player') && isMe)}
							selected={this.props.selectedItemIDs.includes(i.id)}
							select={(id, ctrl) => this.props.itemSelected(id, ctrl)}
							remove={id => this.props.itemRemove(id)}
							conditionRemove={(c, condition) => this.props.conditionRemove(c, condition)}
							toggleTag={(combatants, tag) => this.props.toggleTag(combatants, tag)}
							toggleCondition={(combatants, condition) => this.props.toggleCondition(combatants, condition)}
							toggleHidden={(combatants) => this.props.toggleHidden(combatants)}
						/>
					);
				});

			return tokens;
		}

		return null;
	}

	private getFog(dimensions: MapDimensions) {
		if (this.props.mode !== 'edit') {
			return this.props.fog.map(f => (
				<GridSquare
					key={'fog ' + f.x + ',' + f.y}
					x={f.x}
					y={f.y}
					style={this.getStyle(f.x, f.y, 1, 1, 'square', dimensions)}
					mode='fog'
				/>
			));
		}

		return null;
	}

	private getLighting(dimensions: MapDimensions) {
		if (this.props.lighting !== 'bright light') {
			const actors: Combatant[] = [];
			if (this.props.mode === 'combat') {
				this.props.combatants.filter(c => c.current).forEach(c => actors.push(c));
				this.props.combatants.filter(c => this.props.selectedItemIDs.includes(c.id)).forEach(c => actors.push(c));
			}
			if (this.props.mode === 'combat-player') {
				this.props.combatants.filter(c => (c.type === 'pc') && this.props.selectedItemIDs.includes(c.id)).forEach(c => actors.push(c));
			}

			const lighting: (JSX.Element | null)[] = [];
			for (let x = dimensions.minX; x <= dimensions.maxX; ++x) {
				for (let y = dimensions.minY; y <= dimensions.maxY; ++y) {
					let level = this.props.lighting as 'bright light' | 'dim light' | 'darkness';
					this.props.combatants.filter(combatant => combatant.lightSource !== null).forEach(combatant => {
						const item = this.props.map.items.find(i => i.id === combatant.id);
						if (item) {
							const dist = Mercator.calculateDistance(item, x, y);
							if (combatant.lightSource && (combatant.lightSource.dim >= dist)) {
								if (level === 'darkness') {
									level = 'dim light';
								}
							}
							if (combatant.lightSource && (combatant.lightSource.bright >= dist)) {
								level = 'bright light';
							}
						}
					});
					actors.filter(combatant => combatant.darkvision > 0).forEach(combatant => {
						// Can this actor see this square?
						const item = this.props.map.items.find(i => i.id === combatant.id);
						if (item) {
							const dist = Mercator.calculateDistance(item, x, y);
							if (combatant.darkvision >= dist) {
								if (level === 'dim light') {
									level = 'bright light';
								} else if (level === 'darkness') {
									level = 'dim light';
								}
							}
						}
					});
					if (level !== 'bright light') {
						lighting.push(
							<GridSquare
								key={'light ' + x + ',' + y}
								x={x}
								y={y}
								style={this.getStyle(x, y, 1, 1, 'square', dimensions)}
								mode={'light ' + level.replaceAll(' ', '-')}
							/>
						);
					}
				}
			}

			return lighting;
		}

		return null;
	}

	private getGrid(dimensions: MapDimensions) {
		if (this.props.showGrid) {
			const grid: (JSX.Element | null)[] = [];

			for (let yGrid = dimensions.minY; yGrid !== dimensions.maxY + 1; ++yGrid) {
				for (let xGrid = dimensions.minX; xGrid !== dimensions.maxX + 1; ++xGrid) {
					grid.push(
						<GridSquare
							key={xGrid + ',' + yGrid}
							x={xGrid}
							y={yGrid}
							style={this.getStyle(xGrid, yGrid, 1, 1, 'square', dimensions)}
							selected={this.isSelected(xGrid, yGrid)}
							onMouseDown={(posX, posY) => this.gridSquareMouseDown(posX, posY)}
							onMouseUp={(posX, posY) => this.gridSquareMouseUp(posX, posY)}
							onMouseEnter={(posX, posY) => this.gridSquareEntered(posX, posY)}
						/>
					);
				}
			}

			return grid;
		}

		return null;
	}

	private getFocus(dimensions: MapDimensions) {
		if (this.props.focussedSquare) {
			return (
				<div
					className='grid-focus'
					style={this.getStyle(this.props.focussedSquare.x - 1, this.props.focussedSquare.y - 1, 3, 3, 'circle', dimensions)}
				/>
			);
		}

		return null;
	}

	//#endregion

	public render() {
		try {
			const mapDimensions = this.getMapDimensions();
			if (!mapDimensions) {
				return (
					<div className='section centered'>(blank map)</div>
				);
			}

			const squareWidth = 1 + mapDimensions.maxX - mapDimensions.minX;
			const squareHeight = 1 + mapDimensions.maxY - mapDimensions.minY;
			const mapWidth = (this.state.size * squareWidth) + 2;
			let mapHeight = (this.state.size * squareHeight) + 2;
			if (this.props.mode !== 'thumbnail') {
				// Allow for map controls
				mapHeight += 42;
			}

			return (
				<div
					className={'map-panel ' + this.props.mode}
					style={{ width: mapWidth + 'px', height: mapHeight + 'px' }}
					onClick={() => this.props.itemSelected ? this.props.itemSelected(null, false) : null}
					role='button'
				>
					{this.getControls()}
					<div className='grid'>
						{this.getAreas(mapDimensions)}
						{this.getTiles(mapDimensions)}
						{this.getAreaNames(mapDimensions)}
						{this.getOverlays(mapDimensions)}
						{this.getAuras(mapDimensions)}
						{this.getSteps(mapDimensions)}
						{this.getDistances(mapDimensions)}
						{this.getTokens(mapDimensions)}
						{this.getFog(mapDimensions)}
						{this.getLighting(mapDimensions)}
						{this.getGrid(mapDimensions)}
						{this.getFocus(mapDimensions)}
					</div>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='MapPanel' error={e} />;
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
		} catch (e) {
			console.error(e);
			return <RenderError context='Area' error={e} />;
		}
	}
}

interface GridSquareProps {
	x: number;
	y: number;
	style: MapItemStyle;
	mode: string;
	selected: boolean;
	content: string | JSX.Element | null;
	onMouseDown: (x: number, y: number) => void;
	onMouseUp: (x: number, y: number) => void;
	onMouseEnter: (x: number, y: number) => void;
	onDoubleClick: (x: number, y: number) => void;
}

class GridSquare extends React.Component<GridSquareProps> {
	public static defaultProps = {
		mode: 'cell',
		selected: false,
		content: null,
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
			let content = null;
			if (this.props.content) {
				content = (
					<div className='content' style={{ fontSize: this.props.style.fontSize }}>{this.props.content}</div>
				);
			}

			return (
				<div
					className={'grid-square ' + this.props.mode + (this.props.selected ? ' selected' : '')}
					style={this.props.style}
					onMouseDown={e => this.mouseDown(e)}
					onMouseUp={e => this.mouseUp(e)}
					onMouseEnter={e => this.mouseEnter(e)}
					onDoubleClick={e => this.doubleClick(e)}
					role='button'
				>
					{content}
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='GridSquare' error={e} />;
		}
	}
}

interface TileProps {
	tile: MapItem;
	style: MapItemStyle;
	selectable: boolean;
	selected: boolean;
	select: (tileID: string, ctrl: boolean) => void;
}

class Tile extends React.Component<TileProps> {
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
			if (this.props.tile.terrain === 'link') {
				customImage = (
					<img className='custom-image' alt='map tile' src={this.props.tile.customLink} />
				);
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
		} catch (e) {
			console.error(e);
			return <RenderError context='Tile' error={e} />;
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
		} catch (e) {
			console.error(e);
			return <RenderError context='MapOverlay' error={e} />;
		}
	}
}

interface MapTokenProps {
	token: MapItem;
	combatant: Combatant | null;
	activeToken: MapItem | null;
	style: MapItemStyle;
	width: number;
	simple: boolean;
	showGauge: boolean;
	showHidden: boolean;
	selectable: boolean;
	selected: boolean;
	select: (tokenID: string, ctrl: boolean) => void;
	remove: (tokenID: string) => void;
	conditionRemove: (combatant: Combatant, condition: Condition) => void;
	toggleTag: (combatants: Combatant[], tag: string) => void;
	toggleCondition: (combatants: Combatant[], condition: string) => void;
	toggleHidden: (combatants: Combatant[]) => void;
}

interface MapTokenState {
	hovered: boolean;
	clicked: boolean;
}

class MapToken extends React.Component<MapTokenProps, MapTokenState> {
	constructor(props: MapTokenProps) {
		super(props);
		this.state = {
			hovered: false,
			clicked: false
		};
	}

	private handleHoverChange(visible: boolean) {
		this.setState({
			hovered: visible,
			clicked: false
		});
	}

	private handleClickChange(visible: boolean) {
		this.setState({
			hovered: false,
			clicked: visible
		});
	}

	private select(e: React.MouseEvent) {
		if (this.props.selectable) {
			e.stopPropagation();
			this.props.select(this.props.token.id, e.ctrlKey);
		}
	}

	private getPopoverContent(clicked: boolean) {
		let name = 'token';
		let tags = null;
		const info: JSX.Element[] = [];

		if (this.props.activeToken && (this.props.activeToken.id !== this.props.token.id)) {
			info.push(
				<div key='distance' className='section'>
					{Mercator.getDistanceBetweenItems(this.props.token, this.props.activeToken) * 5} ft away
				</div>
			);
		}

		if (this.props.combatant) {
			name = this.props.combatant.displayName || 'unnamed combatant';

			tags = (
				<CombatantTags
					combatants={[this.props.combatant]}
					editable={clicked}
					toggleTag={(combatants, tag) => this.props.toggleTag(combatants, tag)}
					toggleCondition={(combatants, condition) => this.props.toggleCondition(combatants, condition)}
					toggleHidden={(combatants) => this.props.toggleHidden(combatants)}
				/>
			);

			if (this.props.token.z !== 0) {
				info.push(
					<div key='altitude' className='section'>altitude: {Math.abs(this.props.token.z * 5)} ft {this.props.token.z > 0 ? 'up' : 'down'}</div>
				);
			}

			if (clicked) {
				// Allow conditions to be removed
				this.props.combatant.conditions.filter(condition => (condition.name !== 'prone') && (condition.name !== 'unconscious')).forEach(condition => {
					info.push(
						<div key={condition.id} className='content-then-icons'>
							<div className='content'>
								<Group>
									{condition.name}
								</Group>
							</div>
							<div className='icons'>
								<DeleteOutlined onClick={() => this.props.conditionRemove(this.props.combatant as Combatant, condition)} />
							</div>
						</div>
					);
				});
			} else {
				// List condition names
				const names = this.props.combatant.conditions
					.map(condition => condition.name)
					.filter(n => (n !== 'prone') && (n !== 'unconscious') && (n !== 'custom'))
					.join(', ');
				if (names !== '') {
					info.push(
						<div key='conditions' className='section'>{names}</div>
					);
				}

				// List custom condition details
				const custom = this.props.combatant.conditions.find(c => c.name === 'custom');
				if (custom) {
					Gygax.conditionText(custom).forEach((txt, index) => {
						info.push(
							<div key={custom.id + '-' + index} className='section'>{txt}</div>
						);
					});
				}
			}

			if (this.props.combatant.note) {
				info.push(
					<div key='note' className='section'>
						<ReactMarkdown source={this.props.combatant.note} />
					</div>
				);
			}
		}

		if (clicked) {
			info.push(
				<button key='remove' onClick={() => this.props.remove(this.props.token.id)}>remove from the map</button>
			);
		}

		return (
			<div>
				<div key='name' className='section centered'><b>{name}</b></div>
				{tags}
				{info.length > 0 ? <hr/> : null}
				{info}
			</div>
		);
	}

	public render() {
		try {
			let name = 'token';
			let style = 'token';

			if (this.props.selected) {
				style += ' selected';
			}

			if (this.props.simple) {
				style += ' not-interactive';
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
						let color = 'orange';
						if (current >= max) {
							color = 'green';
						} else if (current <= (max / 2)) {
							color = 'crimson';
						}
						hpGauge = (
							<Progress
								type='circle'
								status='normal'
								strokeColor={color}
								showInfo={false}
								percent={100 * current / max}
								width={this.props.width - 3}
							/>
						);
					}
				}

				if (this.props.token.z > 0) {
					altitudeBadge = (
						<div className='badge'>
							<UpSquareTwoTone twoToneColor='#3c78dc' />
						</div>
					);
				}

				if (this.props.token.z < 0) {
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

			if (!this.props.selectable) {
				return (
					<Popover
						content={this.getPopoverContent(false)}
						trigger='hover'
						placement='bottom'
						overlayClassName='map-hover-tooltip'
					>
						{token}
					</Popover>
				);
			}

			return (
				<Popover
					content={this.getPopoverContent(false)}
					trigger='hover'
					placement='bottom'
					overlayClassName='map-hover-tooltip'
					visible={this.state.hovered}
					onVisibleChange={value => this.handleHoverChange(value)}
				>
					<Popover
						content={this.getPopoverContent(true)}
						trigger='contextMenu'
						placement='bottom'
						overlayClassName='map-click-tooltip'
						visible={this.state.clicked}
						onVisibleChange={value => this.handleClickChange(value)}
					>
						{token}
					</Popover>
				</Popover>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='MapToken' error={e} />;
		}
	}
}
