import { EnvironmentOutlined } from '@ant-design/icons';
import React from 'react';

import { Factory } from '../../utils/factory';
import { Gygax } from '../../utils/gygax';
import { Mercator } from '../../utils/mercator';
import { Napoleon } from '../../utils/napoleon';

import { Combatant, CombatSlotInfo } from '../../models/combat';
import { Map, MapItem } from '../../models/map';
import { Monster } from '../../models/monster';

import { Conditional } from '../controls/conditional';
import { Dropdown } from '../controls/dropdown';
import { Group } from '../controls/group';
import { Note } from '../controls/note';
import { MapPanel } from '../panels/map-panel';

interface Props {
	maps: Map[];
	map: Map | null;
	setMap: (map: Map | null) => void;
	areaID: string | null;
	setAreaID: (id: string | null) => void;
	lighting: 'bright light' | 'dim light' | 'darkness';
	setLighting: (lighting: string) => void;
	fog: { x: number, y: number }[];
	setFog: (fog: { x: number, y: number }[]) => void;
	slotInfo: CombatSlotInfo[];
	setSlotInfo: (slotInfo: CombatSlotInfo[]) => void;
	getMonster: (id: string) => Monster | null;
}

interface State {
	addingToMapID: string | null;
	editFog: boolean;
}

export class CombatMapModal extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			addingToMapID: null,
			editFog: false
		};
	}

	private setAddingToMapID(id: string | null) {
		this.setState({
			addingToMapID: id,
			editFog: false
		});
	}

	private toggleEditFog() {
		this.setState({
			addingToMapID: null,
			editFog: !this.state.editFog
		});
	}

	private gridSquareClicked(x: number, y: number) {
		if (this.state.addingToMapID) {
			this.props.slotInfo.forEach(csi => {
				csi.members.filter(csm => csm.id === this.state.addingToMapID).forEach(csm => {
					csm.location = {
						x: x,
						y: y,
						z: 0
					};
				});
			});
			this.setState({
				addingToMapID: null
			}, () => {
				this.props.setSlotInfo(this.props.slotInfo);
			})
		}

		if (this.state.editFog) {
			this.gridRectangleSelected(x, y, x, y);
		}
	}

	private gridRectangleSelected(x1: number, y1: number, x2: number, y2: number) {
		if (this.state.editFog) {
			const fog = this.props.fog;

			for (let x = x1; x <= x2; ++x) {
				for (let y = y1; y <= y2; ++y) {
					const index = fog.findIndex(i => (i.x === x) && (i.y === y));
					if (index === -1) {
						fog.push({ x: x, y: y });
					} else {
						fog.splice(index, 1);
					}
				}
			}

			this.props.setFog(fog);
		}
	}

	private fillFog() {
		const fog: { x: number, y: number }[] = [];
		const dims = Mercator.mapDimensions((this.props.map as Map).items);
		if (dims) {
			for (let x = dims.minX; x <= dims.maxX; ++x) {
				for (let y = dims.minY; y <= dims.maxY; ++y) {
					fog.push({ x: x, y: y });
				}
			}
			this.props.setFog(fog);
		}
	}

	private clearFog() {
		this.props.setFog([]);
	}

	private removeAll() {
		this.props.slotInfo.forEach(csi => {
			csi.members.forEach(csm => {
				csm.location = null;
			});
		});
		this.props.setSlotInfo(this.props.slotInfo);
	}

	private generateMap(areas: number) {
		const map = Factory.createMap();
		Mercator.generate(areas, map);
		this.props.setMap(map);
	}

	public render() {
		if (this.props.map === null) {
			let selector = null;
			if (this.props.maps.length > 0) {
				const options = this.props.maps.map(m => {
					return {
						id: m.id,
						text: m.name || 'unnamed map'
					};
				});
				selector = (
					<Dropdown
						options={options}
						placeholder='select a map'
						onSelect={id => {
							const mp = this.props.maps.find(m => m.id === id) || null;
							const copy = JSON.parse(JSON.stringify(mp));
							this.props.setMap(copy);
						}}
					/>
				);
			}

			return (
				<div className='scrollable'>
					<Note>
						<div className='section'>
							no map is currently selected
						</div>
						<div className='section'>
							this is fine - you don't have to use a map to run an encounter
						</div>
					</Note>
					{selector}
					<button onClick={() => this.generateMap(5)}>generate a random delve</button>
				</div>
			);
		}

		const notOnMap: JSX.Element[] = [];
		const combatants: Combatant[] = [];
		const mapItems: MapItem[] = [];

		this.props.slotInfo.forEach(csi => {
			csi.members.forEach(csm => {
				if (csm.location === null) {
					notOnMap.push(
						<Group key={csm.id}>
							<div className='content-then-icons'>
								<div className='content'>
								{csm.name}
								</div>
								<div className='icons'>
									<EnvironmentOutlined title='add to map' onClick={() => this.setAddingToMapID(csm.id)} />
								</div>
							</div>
						</Group>
					);
				} else {
					const monster = this.props.getMonster(csi.monsterID);
					if (monster) {
						const c = Napoleon.convertMonsterToCombatant(monster, 0, 0, csm.name, 'foe');
						combatants.push(c);

						const item = Factory.createMapItem();
						item.id = c.id;
						item.type = 'monster';
						const size = Gygax.miniSize(monster.size);
						item.height = size;
						item.width = size;
						item.depth = size;
						item.x = csm.location.x;
						item.y = csm.location.y;
						item.z = csm.location.z;
						mapItems.push(item);
					}
				}
			});
		});

		const map: Map = JSON.parse(JSON.stringify(this.props.map));
		map.items = map.items.concat(mapItems);

		return (
			<div className='scrollable both-ways'>
				<MapPanel
					map={map}
					mode='setup'
					features={{ highlight: false, editFog: this.state.editFog }}
					showGrid={(this.state.addingToMapID !== null) || this.state.editFog}
					combatants={combatants}
					selectedAreaID={this.props.areaID}
					fog={this.props.fog}
					lighting={this.props.lighting}
					areaSelected={id => this.props.setAreaID(id)}
					gridSquareClicked={(x, y) => this.gridSquareClicked(x, y)}
					gridRectangleSelected={(x1, y1, x2, y2) => this.gridRectangleSelected(x1, y1, x2, y2)}
					changeLighting={light => this.props.setLighting(light)}
					toggleFeature={feature => {
						switch (feature) {
							case 'editFog':
								this.toggleEditFog();
								break;
						}
					}}
					fillFog={() => this.fillFog()}
					clearFog={() => this.clearFog()}
				/>
				<hr/>
				<Conditional display={notOnMap.length > 0}>
					<Note>
						<div className='section'>
							you can add these monsters to the map by clicking on the <EnvironmentOutlined/> button and then clicking on a map square
						</div>
					</Note>
					{notOnMap}
				</Conditional>
				<Conditional display={notOnMap.length === 0}>
					<button onClick={() => this.removeAll()}>remove all from map</button>
				</Conditional>
			</div>
		);
	}
}
