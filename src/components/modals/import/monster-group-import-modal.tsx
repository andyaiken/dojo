import { FileOutlined } from '@ant-design/icons';
import { Col, Row, Upload } from 'antd';
import React from 'react';

import Utils from '../../../utils/utils';

import { MonsterGroup } from '../../../models/monster';

import MonsterStatblockCard from '../../cards/monster-statblock-card';
import GridPanel from '../../panels/grid-panel';
import Note from '../../panels/note';

interface Props {
	group: MonsterGroup;
}

interface State {
	group: MonsterGroup;
}

export default class MonsterGroupImportModal extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			group: props.group
		};
	}

	private readFile(file: File) {
		file.text().then(json => {
			const group: MonsterGroup = JSON.parse(json);
			// Copy everything (except id) from this group into the state group
			Object.keys(group).forEach(key => {
				if (key !== 'id') {
					const value = (group as any)[key];
					(this.state.group as any)[key] = value;
				}
			});
			// Don't import any IDs or portraits
			this.state.group.monsters.forEach(monster => {
				monster.id = Utils.guid();
				monster.portrait = '';
			});
			this.setState({
				group: this.state.group
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
							<Upload.Dragger accept='.monstergroup' showUploadList={false} beforeUpload={file => this.readFile(file)}>
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
							heading={this.props.group.name}
							columns={1}
							content={this.props.group.monsters.map(monster => <MonsterStatblockCard key={monster.id} monster={monster} />)}
						/>
					</Col>
				</Row>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}
