import { CloseCircleOutlined, UserOutlined } from '@ant-design/icons';
import React from 'react';

import { Monster } from '../../models/monster-group';
import { PC } from '../../models/party';

interface Props {
	source: PC | Monster;
	inline: boolean;
	edit: () => void;
	clear: () => void;
}

export default class PortraitPanel extends React.Component<Props> {
	public static defaultProps = {
		inline: false,
		edit: null,
		clear: null
	};

	private getEditor() {
		let clearBtn = null;
		if (this.props.source.portrait) {
			clearBtn = (
				<CloseCircleOutlined className='clear' onClick={() => this.props.clear()} />
			);
		}

		let img = null;
		const data = localStorage.getItem('image-' + this.props.source.portrait);
		if (data) {
			const image = JSON.parse(data);
			img = (
				<img className='circle' src={image.data} alt='portrait' onClick={() => this.props.edit()} />
			);
		} else {
			img = (
				<UserOutlined className='circle' onClick={() => this.props.edit()} />
			);
		}

		return (
			<div className='portrait editing'>
				<div className='section centered'>
					{img}
					{clearBtn}
				</div>
			</div>
		);
	}

	private getDisplay() {
		if (!this.props.source.portrait) {
			return null;
		}

		const data = localStorage.getItem('image-' + this.props.source.portrait);
		if (!data) {
			return null;
		}

		const image = JSON.parse(data);
		if (!image.data) {
			return null;
		}

		let style = 'portrait';
		if (this.props.inline) {
			style += ' inline';
		} else {
			style += ' section centered';
		}

		return (
			<div className={style}>
				<img src={image.data} alt='portrait' />
			</div>
		);
	}

	public render() {
		try {
			return (this.props.edit !== null) ? this.getEditor() : this.getDisplay();
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
