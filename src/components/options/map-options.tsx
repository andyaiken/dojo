import React from 'react';

import { Map } from '../../models/map';
import { Party } from '../../models/party';

import { ConfirmButton } from '../controls/confirm-button';
import { Dropdown } from '../controls/dropdown';
import { Expander } from '../controls/expander';
import { Textbox } from '../controls/textbox';

interface Props {
	map: Map;
	parties: Party[];
	edit: (map: Map) => void;
	clone: (map: Map, name: string) => void;
	startCombat: (partyID: string, mapID: string) => void;
	startExploration: (partyID: string, mapID: string) => void;
	delete: (map: Map) => void;
}

interface State {
	cloneName: string;
}

export class MapOptions extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			cloneName: props.map.name + ' copy'
		};
	}

	private setCloneName(cloneName: string) {
		this.setState({
			cloneName: cloneName
		});
	}

	public render() {
		try {
			let combat = null;
			let exploration = null;
			if (this.props.parties.length > 0) {
				combat = (
					<Dropdown
						options={this.props.parties.map(p => ({ id: p.id, text: p.name }))}
						placeholder='start combat with...'
						onSelect={id => this.props.startCombat(id, this.props.map.id)}
					/>
				);

				exploration = (
					<Dropdown
						options={this.props.parties.map(p => ({ id: p.id, text: p.name }))}
						placeholder='start exploration with...'
						onSelect={id => this.props.startExploration(id, this.props.map.id)}
					/>
				);
			}

			return (
				<div>
					<button onClick={() => this.props.edit(this.props.map)}>edit map</button>
					<Expander text='copy map'>
						<Textbox
							text={this.state.cloneName}
							placeholder='map name'
							onChange={value => this.setCloneName(value)}
						/>
						<button onClick={() => this.props.clone(this.props.map, this.state.cloneName)}>create copy</button>
					</Expander>
					{combat}
					{exploration}
					<ConfirmButton text='delete map' onConfirm={() => this.props.delete(this.props.map)} />
				</div>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
