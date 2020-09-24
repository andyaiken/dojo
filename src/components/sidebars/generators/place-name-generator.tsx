import { CopyOutlined } from '@ant-design/icons';
import React from 'react';

import { Shakespeare } from '../../../utils/shakespeare';

interface Props {
}

interface State {
	values: string[];
}

export class PlaceNameGenerator extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			values: []
		};
	}

	private async generate() {
		const response = await fetch('/dojo/data/places.txt');
		const source = await response.text();
		Shakespeare.initModel([source]);
		const values = Shakespeare.generateLines(10);
		this.setState({
			values: values
		});
	}

	public render() {
		try {
			const output = [];
			for (let n = 0; n !== this.state.values.length; ++n) {
				output.push(
					<GeneratedItem key={n} text={this.state.values[n]} />
				);
			}

			return (
				<div>
					<button onClick={() => this.generate()}>generate</button>
					{output.length > 0 ? <hr/> : null}
					{output}
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}

interface GeneratedItemProps {
	text: string;
}

class GeneratedItem extends React.Component<GeneratedItemProps> {
	private copy(e: React.MouseEvent) {
		e.stopPropagation();
		navigator.clipboard.writeText(this.props.text);
	}

	public render() {
		try {
			return (
				<div className='generated-item group-panel'>
					<div className='text-section'>
						{this.props.text.toLowerCase()}
					</div>
					<div className='icon-section'>
						<CopyOutlined title='copy to clipboard' onClick={e => this.copy(e)} />
					</div>
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}
