import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import React from 'react';
import ReactMarkdown from 'react-markdown';

import { Utils } from '../../utils/utils';

import { RenderError } from '../error';
import { Selector } from '../controls/selector';

interface Props {
	view: string;
	setView: (view: string) => void;
}

export class ReferenceSidebar extends React.Component<Props> {
	public render() {
		try {
			let content = null;
			switch (this.props.view) {
				case 'skills':
					content = (
						<MarkdownReference key='skills' filename='/dojo/data/skills.md' />
					);
					break;
				case 'conditions':
					content = (
						<MarkdownReference key='conditions' filename='/dojo/data/conditions.md' />
					);
					break;
				case 'actions':
					content = (
						<MarkdownReference key='actions' filename='/dojo/data/actions.md' />
					);
					break;
			}

			return (
				<div className='sidebar-container'>
					<div className='sidebar-header'>
						<div className='heading'>reference</div>
						<Selector
							options={Utils.arrayToItems(['skills', 'conditions', 'actions'])}
							selectedID={this.props.view}
							onSelect={optionID => this.props.setView(optionID)}
						/>
					</div>
					<div className='sidebar-content'>
						{content}
					</div>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='ReferenceSidebar' error={e} />;
		}
	}
}

interface MarkdownReferenceProps {
	filename: string;
}

interface MarkdownReferenceState {
	source: string | null;
}

export class MarkdownReference extends React.Component<MarkdownReferenceProps, MarkdownReferenceState> {
	constructor(props: MarkdownReferenceProps) {
		super(props);

		this.state = {
			source: null
		};
	}

	public componentDidMount() {
		if (!this.state.source) {
			this.fetchData();
		}
	}

	private async fetchData() {
		const response = await fetch(this.props.filename);
		const text = await response.text();
		this.setState({
			source: text
		});
	}

	public render() {
		try {
			return (
				<Spin spinning={this.state.source === null} indicator={<LoadingOutlined style={{ fontSize: 20, marginTop: 100 }} />}>
					<ReactMarkdown>{this.state.source || ''}</ReactMarkdown>
				</Spin>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='MarkdownReference' error={e} />;
		}
	}
}
