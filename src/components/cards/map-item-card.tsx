import { Slider } from 'antd';
import React from 'react';

import { MapItem } from '../../models/map';

import NumberSpin from '../controls/number-spin';
import Radial from '../controls/radial';
import Selector from '../controls/selector';

interface Props {
	item: MapItem;
	move: (item: MapItem, dir: string) => void;
	remove: (item: MapItem) => void;
	changeValue: (source: any, field: string, value: any) => void;
	nudgeValue: (source: any, field: string, delta: number) => void;
}

interface State {
	view: string;
}

export default class MapItemCard extends React.Component<Props, State> {
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
				<Radial onClick={dir => this.props.move(this.props.item, dir)} />
				<div style={{ display: this.props.item.type === 'overlay' ? 'block' : 'none' }}>
					<div className='subheading'>size</div>
					<div className='section'>
						<NumberSpin
							value={this.props.item.width + ' sq'}
							label='width'
							downEnabled={this.props.item.width > 1}
							onNudgeValue={delta => this.props.nudgeValue(this.props.item, 'width', delta)}
						/>
						<NumberSpin
							value={this.props.item.height + ' sq'}
							label='height'
							downEnabled={this.props.item.height > 1}
							onNudgeValue={delta => this.props.nudgeValue(this.props.item, 'height', delta)}
						/>
					</div>
				</div>
			</div>
		);
	}

	private getStyleSection() {
		const typeOptions = ['overlay', 'token'].map(t => {
			return { id: t, text: t };
		});

		const styleOptions = ['square', 'rounded', 'circle'].map(t => {
			return { id: t, text: t };
		});

		return (
			<div>
				<div className='subheading'>type</div>
				<Selector
					options={typeOptions}
					selectedID={this.props.item.type}
					onSelect={optionID => this.props.changeValue(this.props.item, 'type', optionID)}
				/>
				<div style={{ display: this.props.item.type === 'overlay' ? 'block' : 'none' }}>
					<div className='subheading'>shape</div>
					<Selector
						options={styleOptions}
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
				</div>
				<div style={{ display: this.props.item.type === 'token' ? 'block' : 'none' }}>
					<div className='subheading'>size</div>
					<NumberSpin
						value={this.props.item.size}
						downEnabled={this.props.item.size !== 'tiny'}
						upEnabled={this.props.item.size !== 'gargantuan'}
						onNudgeValue={delta => this.props.nudgeValue(this.props.item, 'size', delta)}
					/>
				</div>
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
				<div className='card map' key='selected'>
					<div className='heading'>
						<div className='title'>map item</div>
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
							<button onClick={() => this.props.remove(this.props.item)}>remove from the map</button>
						</div>
					</div>
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}
