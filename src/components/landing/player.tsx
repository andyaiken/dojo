import { Col, Drawer, Row } from 'antd';
import React from 'react';

import { CommsPlayer } from '../../utils/comms';

import { PC } from '../../models/party';

import PCEditorModal from '../modals/editors/pc-editor-modal';
import StatBlockModal from '../modals/stat-block-modal';
import ErrorBoundary from '../panels/error-boundary';
import PageHeader from '../panels/page-header';
import SessionPanel from '../panels/session-panel';

interface Props {
}

interface State {
	drawer: any;
}

export default class Player extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			drawer: null
		};
	}

	private editPC(pc: PC) {
		const copy = JSON.parse(JSON.stringify(pc));
		this.setState({
			drawer: {
				type: 'pc',
				pc: copy
			}
		});
	}

	private savePC() {
		CommsPlayer.sendCharacter(this.state.drawer.pc);

		this.setState({
			drawer: null
		});
	}

	private closeDrawer() {
		this.setState({
			drawer: null
		});
	}

	private getDrawer() {
		let content = null;
		let header = null;
		let footer = null;
		const width = '50%';
		let closable = false;

		if (this.state.drawer) {
			switch (this.state.drawer.type) {
				case 'statblock':
					content = (
						<StatBlockModal
							source={this.state.drawer.source}
						/>
					);
					header = 'statblock';
					closable = true;
					break;
				case 'image':
					content = (
						<img className='nonselectable-image' src={this.state.drawer.data} alt='' />
					);
					header = 'image';
					closable = true;
					break;
				case 'pc':
					content = (
						<PCEditorModal
							pc={this.state.drawer.pc}
							library={[]}
						/>
					);
					header = 'pc editor';
					footer = (
						<Row gutter={20}>
							<Col span={12}>
								<button onClick={() => this.savePC()}>save changes</button>
							</Col>
							<Col span={12}>
								<button onClick={() => this.closeDrawer()}>discard changes</button>
							</Col>
						</Row>
					);
					break;
			}
		}

		return {
			content: content,
			header: header,
			footer: footer,
			width: width,
			closable: closable
		};
	}

	public render() {
		try {
			const drawer = this.getDrawer();

			const breadcrumbs = [{
				id: 'home',
				text: 'dojo - player',
				onClick: () => null
			}];

			return (
				<div className='dojo'>
					<div className='app'>
						<ErrorBoundary>
							<PageHeader
								breadcrumbs={breadcrumbs}
							/>
						</ErrorBoundary>
						<ErrorBoundary>
							<div className='page-content player'>
								<SessionPanel
									user='player'
									update={() => this.setState(this.state)}
									editPC={pc => this.editPC(pc)}
									openImage={data => this.setState({drawer: { type: 'image', data: data }})}
									openStatBlock={monster => this.setState({drawer: { type: 'statblock', source: monster }})}
								/>
							</div>
						</ErrorBoundary>
					</div>
					<ErrorBoundary>
						<Drawer
							closable={false}
							maskClosable={drawer.closable}
							width={drawer.width}
							visible={drawer.content !== null}
							onClose={() => this.closeDrawer()}
						>
							<div className='drawer-header'><div className='app-title'>{drawer.header}</div></div>
							<div className='drawer-content'>{drawer.content}</div>
							<div className='drawer-footer'>{drawer.footer}</div>
						</Drawer>
					</ErrorBoundary>
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}
