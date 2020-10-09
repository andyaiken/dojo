import React from 'react';

import { Utils } from '../../utils/utils';

import { PC } from '../../models/party';

import { ConfirmButton } from '../controls/confirm-button';

interface Props {
	pc: PC;
	editPC: (pc: PC) => void;
	updatePC: (pc: PC) => void;
	removePC: (pc: PC) => void;
	changeValue: (source: any, field: string, value: any) => void;
}

export class PCOptions extends React.Component<Props> {
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

			return (
				<div>
					<button key='edit' onClick={() => this.props.editPC(this.props.pc)}>edit pc</button>
					{update}
					<button key='export' onClick={() => this.export(this.props.pc)}>export pc</button>
					{active}
					<ConfirmButton text='delete pc' onConfirm={() => this.props.removePC(this.props.pc)} />
				</div>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
