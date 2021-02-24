import { QuestionCircleOutlined } from '@ant-design/icons';
import { Popover } from 'antd';
import React from 'react';

import { RenderError } from '../error';

interface Props {
	text: string | JSX.Element | JSX.Element[];
	prompt: string | JSX.Element | JSX.Element[];
	info: string | JSX.Element | JSX.Element[] | null;
	disabled: boolean;
	onConfirm: () => void;
}

export class ConfirmButton extends React.Component<Props> {
	public static defaultProps = {
		prompt: 'are you sure you want to do this?',
		info: null,
		disabled: false
	};

	public render() {
		try {
			return (
				<Popover
					content={(
						<div>
							<div className='section'>
								<QuestionCircleOutlined style={{ color: 'red' }} />
								<span style={{ marginLeft: '10px' }}>{this.props.prompt}</span>
							</div>
							{this.props.info}
							<hr/>
							<button onClick={() => this.props.onConfirm()}>confirm</button>
						</div>
					)}
					trigger='click'
					overlayClassName='confirm-tooltip'
				>
					<button className={this.props.disabled ? 'danger disabled' : 'danger'}>
						{this.props.text}
					</button>
				</Popover>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='ConfirmButton' error={e} />;
		}
	}
}
