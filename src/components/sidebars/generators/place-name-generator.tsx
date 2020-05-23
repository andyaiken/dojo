import { CopyOutlined } from '@ant-design/icons';
import React from 'react';

import Shakespeare from '../../../utils/shakespeare';

interface Props {
}

interface State {
	source: string | null;
	values: string[];
}

export default class PlaceNameTool extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			source: null,
			values: []
		};
	}

	private async fetchData() {
		const response = await fetch('/dojo/data/places.txt');
		const text = await response.text();
		this.setState({
			source: text
		});
	}

	private generate() {
		Shakespeare.initModel([this.state.source as string]);
		this.setState({
			values: Shakespeare.generate(10).map(l => l.line)
		});
	}

	public render() {
		try {
			if (!this.state.source) {
				this.fetchData();
			}

			const output = [];
			for (let n = 0; n !== this.state.values.length; ++n) {
				output.push(
					<GeneratedItem key={n} text={this.state.values[n]} />
				);
			}

			return (
				<div>
					<button onClick={() => this.generate()}>generate</button>
					{output.length > 0 ? <div className='divider' /> : null}
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
						<CopyOutlined title='copy' onClick={e => this.copy(e)} />
					</div>
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}
