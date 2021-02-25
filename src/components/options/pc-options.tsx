import { ExportOutlined } from '@ant-design/icons';
import React from 'react';

import { Utils } from '../../utils/utils';

import { Party, PC } from '../../models/party';

import { RenderError } from '../error';
import { ConfirmButton } from '../controls/confirm-button';
import { Dropdown } from '../controls/dropdown';
import { Expander } from '../controls/expander';
import { Textbox } from '../controls/textbox';

interface Props {
	pc: PC;
	parties: Party[];
	editPC: (pc: PC) => void;
	updatePC: (pc: PC) => void;
	removePC: (pc: PC) => void;
	clonePC: (pc: PC, name: string) => void;
	moveToParty: (pc: PC, partyID: string) => void;
	changeValue: (source: any, field: string, value: any) => void;
}

interface State {
	cloneName: string;
}

export class PCOptions extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			cloneName: props.pc.name + ' copy'
		};
	}

	private setCloneName(cloneName: string) {
		this.setState({
			cloneName: cloneName
		});
	}

	private export(pc: PC) {
		const filename = pc.name + '.pc';
		Utils.saveFile(filename, pc);
	}

	public render() {
		try {
			let update = null;
			if (this.props.pc.url) {
				update = (<button onClick={() => this.props.updatePC(this.props.pc)}>update pc from d&amp;d beyond</button>);
			}

			let active = null;
			if (this.props.pc.active) {
				active = (
					<button key='toggle-active' onClick={() => this.props.changeValue(this.props.pc, 'active', false)}>
						mark pc as inactive
					</button>
				);
			} else {
				active = (
					<button key='toggle-active' onClick={() => this.props.changeValue(this.props.pc, 'active', true)}>
						mark pc as active
					</button>
				);
			}

			const partyOptions: { id: string, text: string }[] = [];
			this.props.parties.forEach(party => {
				if (party.pcs.indexOf(this.props.pc) === -1) {
					partyOptions.push({
						id: party.id,
						text: party.name || 'unnamed party'
					});
				}
			});

			return (
				<div>
					<button key='edit' onClick={() => this.props.editPC(this.props.pc)}>edit pc</button>
					{update}
					{active}
					<button key='export' onClick={() => this.export(this.props.pc)}>export pc</button>
					<Expander text='copy pc'>
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
									onClick={() => this.props.clonePC(this.props.pc, this.state.cloneName)}
								/>
							</div>
						</div>
					</Expander>
					<Dropdown
						options={partyOptions}
						placeholder='move to party...'
						onSelect={optionID => this.props.moveToParty(this.props.pc, optionID)}
					/>
					<ConfirmButton onConfirm={() => this.props.removePC(this.props.pc)}>delete pc</ConfirmButton>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='PCOptions' error={e} />;
		}
	}
}
