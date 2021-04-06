import { QuestionCircleOutlined } from '@ant-design/icons';
import { Popover } from 'antd';
import React from 'react';

import { RenderError } from '../error';

interface Props {
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

	private onConfirm() {
		this.setState({
			visible: false
		}, () => this.props.onConfirm());
	}

	public render() {
		try {
			let btn = null;
			const style = this.props.disabled ? 'confirm-button disabled' : 'confirm-button';
			if (typeof(this.props.children) === 'string') {
				btn = (
					<button className={style}>
						{this.props.children}
					</button>
				);
			} else {
				btn = (
					<div className={style}>
						{this.props.children}
					</div>
				);
			}

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
							<button onClick={() => this.onConfirm()}>confirm</button>
						</div>
					)}
					trigger='click'
					overlayClassName='confirm-tooltip'
					visible={this.state.visible}
					onVisibleChange={visible => this.setState({ visible: visible })}
				>
					{btn}
				</Popover>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='ConfirmButton' error={e} />;
		}
	}
}
