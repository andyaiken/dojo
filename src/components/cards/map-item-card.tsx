import { Slider } from 'antd';
import React from 'react';

import { Utils } from '../../utils/utils';

import { MapItem } from '../../models/map';

import { RenderError } from '../error';
import { Conditional } from '../controls/conditional';
import { NumberSpin } from '../controls/number-spin';
import { Selector } from '../controls/selector';
import { MovementPanel } from '../panels/movement-panel';

interface Props {
	item: MapItem;
	moveMapItem: (item: MapItem, dir: string, step: number) => void;
	deleteMapItem: (item: MapItem) => void;
	changeValue: (source: any, field: string, value: any) => void;
	nudgeValue: (source: any, field: string, delta: number) => void;
}

export class MapItemCard extends React.Component<Props> {
	public render() {
		try {
			return (
				<div key={this.props.item.id} className='card map'>
					<div className='heading'>
						<div className='title'>map item</div>
					</div>
					<div className='card-content'>
						<div className='subheading'>type</div>
						<Selector
							options={Utils.arrayToItems(['overlay', 'token'])}
							selectedID={this.props.item.type}
							onSelect={optionID => this.props.changeValue(this.props.item, 'type', optionID)}
						/>
						<div className='subheading'>move</div>
						<MovementPanel showToggle={true} onMove={(dir, step) => this.props.moveMapItem(this.props.item, dir, step)} />
						<Conditional display={this.props.item.type === 'overlay'}>
							<div className='subheading'>size</div>
							<div className='section'>
								<NumberSpin
									value={this.props.item.width + ' sq / ' + (this.props.item.width * 5) + ' ft'}
									label='width'
									downEnabled={this.props.item.width > 1}
									onNudgeValue={delta => this.props.nudgeValue(this.props.item, 'width', delta)}
								/>
								<NumberSpin
									value={this.props.item.height + ' sq / ' + (this.props.item.height * 5) + ' ft'}
									label='height'
									downEnabled={this.props.item.height > 1}
									onNudgeValue={delta => this.props.nudgeValue(this.props.item, 'height', delta)}
								/>
							</div>
						</Conditional>
						<Conditional display={this.props.item.type === 'overlay'}>
							<div className='subheading'>shape</div>
							<Selector
								options={Utils.arrayToItems(['square', 'rounded', 'circle'])}
								selectedID={this.props.item.style}
								onSelect={optionID => this.props.changeValue(this.props.item, 'style', optionID)}
							/>
							<div className='subheading'>color</div>
							<input
								type='color'
								value={this.props.item.color}
								onChange={event => this.props.changeValue(this.props.item, 'color', event.target.value)}
							/>
							<div className='subheading'>opacity</div>
							<Slider
								min={0}
								max={255}
								value={this.props.item.opacity}
								tooltipVisible={false}
								onChange={(value: any) => this.props.changeValue(this.props.item, 'opacity', value)}
							/>
						</Conditional>
						<Conditional display={this.props.item.type === 'token'}>
							<div className='subheading'>size</div>
							<NumberSpin
								value={this.props.item.size}
								downEnabled={this.props.item.size !== 'tiny'}
								upEnabled={this.props.item.size !== 'gargantuan'}
								onNudgeValue={delta => this.props.nudgeValue(this.props.item, 'size', delta)}
							/>
						</Conditional>
						<hr/>
						<div className='section'>
							<button onClick={() => this.props.deleteMapItem(this.props.item)}>remove from the map</button>
						</div>
					</div>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='MapItemCard' error={e} />;
		}
	}
}
