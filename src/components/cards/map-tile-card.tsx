import React from 'react';

import { DOORWAY_TYPES, MapItem, STAIRWAY_TYPES, TERRAIN_TYPES } from '../../models/map';

import { Dropdown } from '../controls/dropdown';
import { NumberSpin } from '../controls/number-spin';
import { Radial } from '../controls/radial';
import { RadioGroup } from '../controls/radio-group';
import { Selector } from '../controls/selector';

interface Props {
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

interface State {
	view: string;
}

export class MapTileCard extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			view: 'position'
		};
	}

	private setView(view: string) {
		this.setState({
			view: view
		});
	}

	private getPositionSection() {
		return (
			<div>
				<div className='subheading'>move</div>
				<Radial onClick={dir => this.props.moveMapTile(this.props.tile, dir)} />
				<div className='subheading'>size</div>
				<div className='section'>{this.props.tile.width * 5} ft x {this.props.tile.height * 5} ft</div>
				<div className='section'>
					<NumberSpin
						value={this.props.tile.width + ' sq'}
						label='width'
						downEnabled={this.props.tile.width > 1}
						onNudgeValue={delta => this.props.nudgeValue(this.props.tile, 'width', delta)}
					/>
					<NumberSpin
						value={this.props.tile.height + ' sq'}
						label='height'
						downEnabled={this.props.tile.height > 1}
						onNudgeValue={delta => this.props.nudgeValue(this.props.tile, 'height', delta)}
					/>
				</div>
				<hr/>
				<button onClick={() => this.props.bringToFront(this.props.tile)}>bring to front</button>
				<button onClick={() => this.props.sendToBack(this.props.tile)}>send to back</button>
			</div>
		);
	}

	private getStyleSection() {
		const terrainOptions = TERRAIN_TYPES.map(t => {
			return { id: t, text: t };
		});

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

		const styleOptions = ['square', 'rounded', 'circle'].map(t => {
			return { id: t, text: t };
		});

		return (
			<div>
				<div className='subheading'>terrain</div>
				<Dropdown
					options={terrainOptions}
					placeholder='select terrain'
					selectedID={this.props.tile.terrain ? this.props.tile.terrain : undefined}
					onSelect={optionID => this.props.changeValue(this.props.tile, 'terrain', optionID)}
				/>
				{customSection}
				<div className='subheading'>shape</div>
				<Selector
					options={styleOptions}
					selectedID={this.props.tile.style}
					onSelect={optionID => this.props.changeValue(this.props.tile, 'style', optionID)}
				/>
				<div className='subheading'>content</div>
				<RadioGroup
					items={[
						{ id: 'none', text: 'none' },
						{ id: 'doorway', text: 'doorway', details: (
							<div>
								<div><b>style</b></div>
								<Selector
									options={DOORWAY_TYPES.map(o => ({ id: o, text: o }))}
									itemsPerRow={2}
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
		);
	}

	public render() {
		try {
			const options = ['position', 'style'].map(option => {
				return { id: option, text: option };
			});

			let content = null;
			switch (this.state.view) {
				case 'position':
					content = this.getPositionSection();
					break;
				case 'style':
					content = this.getStyleSection();
					break;
			}

			return (
				<div className='card map'>
					<div className='heading'>
						<div className='title'>map tile</div>
					</div>
					<div className='card-content'>
						<Selector
							options={options}
							selectedID={this.state.view}
							onSelect={optionID => this.setView(optionID)}
						/>
						<hr/>
						{content}
						<hr/>
						<div className='section'>
							<button onClick={() => this.props.rotateMapTile(this.props.tile)}>rotate tile</button>
							<button onClick={() => this.props.cloneMapTile(this.props.tile)}>clone tile</button>
							<button onClick={() => this.props.deleteMapTile(this.props.tile)}>remove tile</button>
						</div>
					</div>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
