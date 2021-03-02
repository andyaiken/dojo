import { FileOutlined } from '@ant-design/icons';
import { Col, Row, Upload } from 'antd';
import React from 'react';

import { Adventure } from '../../../models/adventure';

import { RenderError } from '../../error';
import { Note } from '../../controls/note';
import { GridPanel } from '../../panels/grid-panel';
import { PlotPanel } from '../../panels/plot-panel';

interface Props {
	adventure: Adventure;
}

interface State {
	adventure: Adventure;
}

export class AdventureImportModal extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			adventure: props.adventure
		};
	}

	private readFile(file: File) {
		file.text().then(json => {
			const adventure: Adventure = JSON.parse(json);
			// Copy everything (except id) from this adventure into the state adventure
			Object.keys(adventure).forEach(key => {
				if (key !== 'id') {
					const value = (adventure as any)[key];
					(this.state.adventure as any)[key] = value;
				}
			});
			this.setState({
				adventure: this.state.adventure
			});
		});
		return false;
	}

	public render() {
		try {
			return (
				<Row className='full-height'>
					<Col span={12} className='scrollable'>
						<div>
							<Note>
								<div className='section'>
									select the file you want to upload
								</div>
							</Note>
							<Upload.Dragger accept='.adventure' showUploadList={false} beforeUpload={file => this.readFile(file)}>
								<p className='ant-upload-drag-icon'>
									<FileOutlined />
								</p>
								<p className='ant-upload-text'>
									click here, or drag a file here, to upload it
								</p>
							</Upload.Dragger>
						</div>
					</Col>
					<Col span={12} className='scrollable'>
						<GridPanel
							heading={this.state.adventure.name}
							columns={1}
							content={[<PlotPanel key='points' plot={this.state.adventure.plot} />]}
						/>
					</Col>
				</Row>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='AdventureImportModal' error={e} />;
		}
	}
}
