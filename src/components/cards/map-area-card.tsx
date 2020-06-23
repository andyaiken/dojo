import React from 'react';

import { MapArea } from '../../models/map';
import NumberSpin from '../controls/number-spin';
import Radial from '../controls/radial';
import Textbox from '../controls/textbox';

interface Props {
	area: MapArea;
	changeValue: (area: MapArea, field: string, value: any) => void;
	nudgeValue: (area: MapArea, field: string, delta: number) => void;
	move: (area: MapArea, dir: string) => void;
	remove: (area: MapArea) => void;
}

export default class MapAreaCard extends React.Component<Props> {
	public render() {
		try {
			return (
				<div className='card map'>
					<div className='heading'>
						<div className='title'>map area</div>
					</div>
					<div className='card-content'>
						<div className='section subheading'>area name</div>
						<Textbox
							text={this.props.area.name}
							placeholder='area name'
							onChange={value => this.props.changeValue(this.props.area, 'name', value)}
						/>
						<div className='section subheading'>notes</div>
						<Textbox
							text={this.props.area.text}
							multiLine={true}
							onChange={value => this.props.changeValue(this.props.area, 'text', value)}
						/>
						<div className='subheading'>move</div>
						<Radial onClick={dir => this.props.move(this.props.area, dir)} />
						<div className='subheading'>size</div>
						<div className='section'>{this.props.area.width * 5} ft x {this.props.area.height * 5} ft</div>
						<div className='section'>
							<NumberSpin
								value={this.props.area.width + ' sq'}
								label='width'
								downEnabled={this.props.area.width > 1}
								onNudgeValue={delta => this.props.nudgeValue(this.props.area, 'width', delta)}
							/>
							<NumberSpin
								value={this.props.area.height + ' sq'}
								label='height'
								downEnabled={this.props.area.height > 1}
								onNudgeValue={delta => this.props.nudgeValue(this.props.area, 'height', delta)}
							/>
						</div>
						<hr/>
						<div className='section'>
							<button onClick={() => this.props.remove(this.props.area)}>remove area</button>
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
