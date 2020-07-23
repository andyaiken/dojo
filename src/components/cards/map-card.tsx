import React from 'react';

import { Map } from '../../models/map';
import { Party } from '../../models/party';

import ConfirmButton from '../controls/confirm-button';
import Dropdown from '../controls/dropdown';
import Expander from '../controls/expander';
import Textbox from '../controls/textbox';
import MapPanel from '../panels/map-panel';

interface Props {
	map: Map;
	parties: Party[];
	viewMap: (map: Map) => void;
	editMap: (map: Map) => void;
	cloneMap: (map: Map, name: string) => void;
	removeMap: (map: Map) => void;
	explore: (map: Map, partyID: string) => void;
}

interface State {
	cloneName: string;
}

export default class MapCard extends React.Component<Props, State> {
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
			let explore = null;
			if (this.props.parties.length > 0) {
				const options = this.props.parties.map(p => {
					return {
						id: p.id,
						text: p.name
					};
				});
				explore = (
					<Dropdown
						options={options}
						placeholder='start exploration with...'
						onSelect={partyID => this.props.explore(this.props.map, partyID)}
					/>
				);
			}

			return (
				<div className='card map'>
					<div className='heading'>
						<div className='title'>
							{this.props.map.name || 'unnamed map'}
						</div>
					</div>
					<div className='card-content'>
						<div className='fixed-height'>
							<MapPanel
								map={this.props.map}
								showAreaNames={true}
							/>
						</div>
						<hr/>
						<button onClick={() => this.props.viewMap(this.props.map)}>open map</button>
						<button onClick={() => this.props.editMap(this.props.map)}>edit map</button>
						<Expander text='copy map'>
							<Textbox
								text={this.state.cloneName}
								placeholder='map name'
								onChange={value => this.setCloneName(value)}
							/>
							<button onClick={() => this.props.cloneMap(this.props.map, this.state.cloneName)}>create copy</button>
						</Expander>
						{explore}
						<ConfirmButton text='delete map' onConfirm={() => this.props.removeMap(this.props.map)} />
					</div>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
