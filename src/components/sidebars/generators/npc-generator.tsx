import React from 'react';

import { NPC } from '../../../models/misc';

interface Props {
	npc: NPC | null;
	generateNPC: () => void;
}

export default class NPCTool extends React.Component<Props> {
	public render() {
		try {
			let item = null;
			if (this.props.npc) {
				item = (
					<div>
						<hr/>
						<div className='group-panel'>
							<div className='section'><b>age:</b> {this.props.npc.age}</div>
							<div className='section'><b>profession:</b> {this.props.npc.profession}</div>
							<div className='section'><b>height:</b> {this.props.npc.height}</div>
							<div className='section'><b>weight:</b> {this.props.npc.weight}</div>
							<div className='section'><b>hair:</b> {this.props.npc.hair}</div>
							<div className='section'><b>physical:</b> {this.props.npc.physical}</div>
							<div className='section'><b>personality:</b> {this.props.npc.mental}</div>
							<div className='section'><b>speech:</b> {this.props.npc.speech}</div>
							<hr/>
							<div className='section'><b>trait:</b> {this.props.npc.trait}</div>
							<div className='section'><b>ideal:</b> {this.props.npc.ideal}</div>
							<div className='section'><b>bond:</b> {this.props.npc.bond}</div>
							<div className='section'><b>flaw:</b> {this.props.npc.flaw}</div>
						</div>
					</div>
				);
			}

			return (
				<div>
					<button onClick={() => this.props.generateNPC()}>generate</button>
					{item}
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}
