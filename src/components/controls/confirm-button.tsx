import { QuestionCircleOutlined } from '@ant-design/icons';
import { Popover } from 'antd';
import React from 'react';

interface Props {
	text: string | JSX.Element | JSX.Element[];
	prompt: string | JSX.Element | JSX.Element[];
	info: string | JSX.Element | JSX.Element[] | null;
	disabled: boolean;
	onConfirm: () => void;
}

interface State {
	visible: boolean;
}

export class ConfirmButton extends React.Component<Props, State> {
	public static defaultProps = {
		prompt: 'are you sure you want to do this?',
		info: null,
		disabled: false
	};

	constructor(props: Props) {
		super(props);

		this.state = {
			visible: false
		};
	}

	private onClick(e: React.MouseEvent) {
		e.stopPropagation();
		this.setState({
			visible: true
		});
	}

	private onClose(e: React.MouseEvent, confirm: boolean) {
		e.stopPropagation();
		if (confirm) {
			this.props.onConfirm();
		}
		this.setState({
			visible: false
		});
	}

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
							<button onClick={e => this.onClose(e, true)}>confirm</button>
							<button onClick={e => this.onClose(e, false)}>cancel</button>
						</div>
					)}
					trigger='click'
					visible={this.state.visible}
				>
					<button className={this.props.disabled ? 'danger disabled' : 'danger'} onClick={e => this.onClick(e)}>
						{this.props.text}
					</button>
				</Popover>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}
