import { ExportOutlined } from '@ant-design/icons';
import React from 'react';

import { Map } from '../../models/map';
import { Party } from '../../models/party';

import { RenderError } from '../error';
import { ConfirmButton } from '../controls/confirm-button';
import { Dropdown } from '../controls/dropdown';
import { Expander } from '../controls/expander';
import { Textbox } from '../controls/textbox';

interface Props {
	map: Map;
	parties: Party[];
	cloneMap: (map: Map, name: string) => void;
	deleteMap: (map: Map) => void;
	startEncounter: (partyID: string, mapID: string) => void;
	startExploration: (partyID: string, mapID: string) => void;
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
			if (this.props.parties.length === 1) {
				combat = (
					<button onClick={() => this.props.startEncounter(this.props.parties[0].id, this.props.map.id)}>
						start combat
					</button>
				);

				exploration = (
					<button onClick={() => this.props.startExploration(this.props.parties[0].id, this.props.map.id)}>
						start exploration
					</button>
				);
			}
			if (this.props.parties.length > 1) {
				combat = (
					<Dropdown
						options={this.props.parties.map(p => ({ id: p.id, text: p.name || 'unnamed party' }))}
						placeholder='start combat with...'
						onSelect={id => this.props.startEncounter(id, this.props.map.id)}
					/>
				);

				exploration = (
					<Dropdown
						options={this.props.parties.map(p => ({ id: p.id, text: p.name || 'unnamed party' }))}
						placeholder='start exploration with...'
						onSelect={id => this.props.startExploration(id, this.props.map.id)}
					/>
				);
			}

			return (
				<div>
					<Expander text='copy map'>
						<div className='content-then-icons'>
							<div className='content'>
								<Textbox
									text={this.state.cloneName}
									placeholder='name of copy'
									onChange={value => this.setCloneName(value)}
								/>
							</div>
							<div className='icons'>
								<ExportOutlined
									title='create copy'
									className={this.state.cloneName === '' ? 'disabled' : ''}
									onClick={() => this.props.cloneMap(this.props.map, this.state.cloneName)}
								/>
							</div>
						</div>
					</Expander>
					{combat}
					{exploration}
					<ConfirmButton onConfirm={() => this.props.deleteMap(this.props.map)}>delete map</ConfirmButton>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='MapOptions' error={e} />;
		}
	}
}
