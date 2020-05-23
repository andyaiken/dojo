import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import React from 'react';

import Selector from '../controls/selector';

import Showdown from 'showdown';
const showdown = new Showdown.Converter();
showdown.setOption('tables', true);

interface Props {
}

interface State {
	view: string;
}

export default class ReferenceSidebar extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			view: 'skills'
		};
	}

	private setView(view: string) {
		this.setState({
			view: view
		});
	}

	public render() {
		try {
			const options = [
				{
					id: 'skills',
					text: 'skills'
				},
				{
					id: 'conditions',
					text: 'conditions'
				},
				{
					id: 'actions',
					text: 'actions'
				}
			];

			let content = null;
			switch (this.state.view) {
				case 'skills':
					content = (
						<ReferenceContentPanel key='skills' filename='/dojo/data/skills.md' />
					);
					break;
				case 'conditions':
					content = (
						<ReferenceContentPanel key='conditions' filename='/dojo/data/conditions.md' />
					);
					break;
				case 'actions':
					content = (
						<ReferenceContentPanel key='actions' filename='/dojo/data/actions.md' />
					);
					break;
			}

			return (
				<div className='sidebar-container'>
					<div className='sidebar-header'>
						<div className='heading'>reference</div>
						<Selector
							options={options}
							selectedID={this.state.view}
							itemsPerRow={3}
							onSelect={optionID => this.setView(optionID)}
						/>
					</div>
					<div className='sidebar-content'>
						{content}
					</div>
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}

interface ReferenceContentPanelProps {
	filename: string;
}

interface ReferenceContentPanelState {
	source: string | null;
}

class ReferenceContentPanel extends React.Component<ReferenceContentPanelProps, ReferenceContentPanelState> {
	constructor(props: ReferenceContentPanelProps) {
		super(props);

		this.state = {
			source: null
		};
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
			if (!this.state.source) {
				this.fetchData();
			}

			return (
				<Spin spinning={this.state.source === null} indicator={<LoadingOutlined style={{ fontSize: 20, marginTop: 100 }} />}>
					<div dangerouslySetInnerHTML={{ __html: showdown.makeHtml(this.state.source || '') }} />
				</Spin>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}
