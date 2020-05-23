import React from 'react';

import Shakespeare from '../../../utils/shakespeare';

interface Props {
}

interface State {
	description: string;
	physical: string;
	mental: string;
	speech: string;
}

export default class NPCTool extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			description: '',
			physical: '',
			mental: '',
			speech: ''
		};
	}

	private generate() {
		this.setState({
			description: Shakespeare.generateNPC(),
			physical: Shakespeare.generateNPCPhysical(),
			mental: Shakespeare.generateNPCMental(),
			speech: Shakespeare.generateNPCSpeech()
		});
	}

	public render() {
		try {
			let item = null;
			if (!!this.state.description) {
				item = (
					<div className='generated-item group-panel'>
						<div className='text-section'>
							<div><b>npc:</b> {this.state.description}</div>
							<div className='divider' />
							<div className='smaller'><b>physical:</b> {this.state.physical}</div>
							<div className='smaller'><b>personality:</b> {this.state.mental}</div>
							<div className='smaller'><b>speech:</b> {this.state.speech}</div>
						</div>
					</div>
				);
			}

			return (
				<div>
					<button onClick={() => this.generate()}>generate</button>
					{!!item ? <div className='divider' /> : null}
					{item}
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}
