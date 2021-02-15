import { CloseCircleOutlined, FileOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import React from 'react';

import { Monster } from '../../models/monster';
import { PC } from '../../models/party';

import { RenderError } from './error-boundary';

interface Props {
	source: PC | Monster;
	inline: boolean;
	setPortrait: (data: string) => void;
	clear: () => void;
}

export class PortraitPanel extends React.Component<Props> {
	public static defaultProps = {
		inline: false,
		setPortrait: null,
		clear: null
	};

	private readFile(file: File) {
		const reader = new FileReader();
		reader.onload = progress => {
			if (progress.target) {
				const content = progress.target.result as string;
				this.props.setPortrait(content);
			}
		};
		reader.readAsDataURL(file);
		return false;
	}

	private getEditor() {
		let img = null;
		let clearBtn = null;
		if (this.props.source.portrait !== '') {
			img = (
				<img className='circle' src={this.props.source.portrait} alt='portrait' />
			);
			clearBtn = (
				<CloseCircleOutlined className='clear' onClick={() => this.props.clear()} />
			);
		} else {
			img = (
				<div>
					<Upload.Dragger accept='image/*' showUploadList={false} beforeUpload={file => this.readFile(file)}>
						<p className='ant-upload-drag-icon'>
							<FileOutlined />
						</p>
						<p className='ant-upload-text'>
							click here, or drag a file here, to upload it
						</p>
						<p className='ant-upload-text'>
							try to upload small images if possible
						</p>
					</Upload.Dragger>
				</div>
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
		if (this.props.source.portrait === '') {
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
				<img className='circle' src={this.props.source.portrait} alt='portrait' />
			</div>
		);
	}

	public render() {
		try {
			return (this.props.setPortrait !== null) ? this.getEditor() : this.getDisplay();
		} catch (e) {
			console.error(e);
			return <RenderError error={e} />;
		}
	}
}
