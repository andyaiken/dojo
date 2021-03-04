import { CaretLeftOutlined, CaretRightOutlined, DeleteOutlined, VerticalAlignTopOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import React from 'react';

import { Utils } from '../../utils/utils';
import { Verne } from '../../utils/verne';

import { Adventure, Plot, Scene, SceneLink } from '../../models/adventure';

import { RenderError } from '../error';
import { ConfirmButton } from '../controls/confirm-button';
import { Dropdown } from '../controls/dropdown';
import { Group } from '../controls/group';
import { Textbox } from '../controls/textbox';
import { AdventureOptions } from '../options/adventure-options';
import { MarkdownEditor } from '../panels/markdown-editor';
import { PlotPanel } from '../panels/plot-panel';

interface Props {
	adventure: Adventure;
	goBack: () => void;
	addScene: (plot: Plot, sceneBefore: Scene | null, sceneAfter: Scene | null) => void;
	deleteScene: (plot: Plot, scene: Scene) => void;
	addLink: (scene: Scene, sceneID: string) => void;
	deleteLink: (scene: Scene, link: SceneLink) => void;
	deleteAdventure: (adventure: Adventure) => void;
	changeValue: (source: any, field: string, value: any) => void;
}

interface State {
	plot: Plot;
	breadcrumbs: { name: string, plot: Plot }[];
	selectedSceneID: string | null;
}

export class AdventureScreen extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			plot: props.adventure.plot,
			breadcrumbs: [{ name: props.adventure.name, plot: props.adventure.plot }],
			selectedSceneID: null
		};
	}

	private setSelectedScene(scene: Scene | null) {
		this.setState({
			selectedSceneID: scene ? scene.id : null
		});
	}

	private explore(scene: Scene) {
		const breadcrumbs = this.state.breadcrumbs;
		breadcrumbs.push({
			name: scene.name,
			plot: scene.plot
		});
		this.setState({
			plot: scene.plot,
			breadcrumbs: breadcrumbs
		});
	}

	private goUp() {
		if (this.state.breadcrumbs.length > 1) {
			const breadcrumbs = this.state.breadcrumbs.slice(0, this.state.breadcrumbs.length - 1);
			const last = breadcrumbs[breadcrumbs.length - 1];
			this.setState({
				plot: last.plot,
				breadcrumbs: breadcrumbs
			});
		}
	}

	private goToBreadcrumb(id: string) {
		const breadcrumb = this.state.breadcrumbs.find(bc => bc.plot.id === id);
		if (breadcrumb) {
			const index = this.state.breadcrumbs.indexOf(breadcrumb);
			const breadcrumbs = this.state.breadcrumbs.slice(0, index + 1);
			this.setState({
				plot: breadcrumb.plot,
				breadcrumbs: breadcrumbs
			});
		}
	}

	private getSidebar() {
		const scene = this.state.plot.scenes.find(s => s.id === this.state.selectedSceneID);
		if (scene) {
			const links = scene.links.map(link => {
				const target = this.state.plot.scenes.find(sc => sc.id === link.sceneID);
				if (target) {
					return (
						<Group key={link.id}>
							<div className='content-then-icons'>
								<div className='content'>
									<div className='section'>to <b>{target.name || 'unnamed scene'}</b></div>
									<Textbox placeholder='label' text={link.text} onChange={text => this.props.changeValue(link, 'text', text)} />
								</div>
								<div className='icons vertical'>
									<CaretRightOutlined title='go to' onClick={() => this.setSelectedScene(target)} />
									<ConfirmButton onConfirm={() => this.props.deleteLink(scene, link)}>
										<DeleteOutlined title='delete link' />
									</ConfirmButton>
								</div>
							</div>
						</Group>
					);
				}

				return null;
			});

			return (
				<div>
					<div className='section'>
						<div className='subheading'>scene title</div>
						<Textbox
							text={scene.name}
							placeholder='scene title'
							onChange={value => this.props.changeValue(scene, 'name', value)}
						/>
					</div>
					<hr/>
					<div className='section'>
						<div className='subheading'>content</div>
						<MarkdownEditor text={scene.content} onChange={value => this.props.changeValue(scene, 'content', value)} />
					</div>
					<hr/>
					<div className='section'>
						<div className='subheading'>links</div>
						{links}
						<Dropdown
							placeholder='select a scene to link to...'
							options={Utils.sort(Verne.getPotentialLinks(this.state.plot, scene)).map(s => ({ id: s.id, text: s.name || 'unnamed scene' }))}
							onSelect={id => this.props.addLink(scene, id)}
						/>
					</div>
					<hr/>
					<button className='disabled' onClick={() => null}>add an encounter</button>
					<ConfirmButton onConfirm={() => this.props.deleteScene(this.state.plot, scene)}>delete scene</ConfirmButton>
					<hr/>
					<button onClick={() => this.setSelectedScene(null)}><CaretLeftOutlined style={{ fontSize: '10px' }} /> back to the adventure</button>
				</div>
			);
		} else {
			return (
				<div>
					<div className='section'>
						<div className='subheading'>adventure name</div>
						<Textbox
							text={this.props.adventure.name}
							placeholder='adventure name'
							onChange={value => this.props.changeValue(this.props.adventure, 'name', value)}
						/>
					</div>
					<hr/>
					<button onClick={() => this.props.addScene(this.state.plot, null, null)}>add a scene</button>
					<button className='disabled' onClick={() => null}>add a map</button>
					<hr/>
					<AdventureOptions
						adventure={this.props.adventure}
						deleteAdventure={adventure => this.props.deleteAdventure(adventure)}
					/>
					<hr/>
					<button onClick={() => this.props.goBack()}><CaretLeftOutlined style={{ fontSize: '10px' }} /> back to the list</button>
				</div>
			);
		}
	}

	public render() {
		try {
			return (
				<Row className='full-height'>
					<Col span={6} className='scrollable sidebar sidebar-left'>
						{this.getSidebar()}
					</Col>
					<Col span={18} className='scrollable'>
						<div className='breadcrumb-bar'>
							<div className='content-then-icons'>
								<div className='content'>
									{
										this.state.breadcrumbs.map(bc => (
											<Group key={bc.plot.id} onClick={() => this.goToBreadcrumb(bc.plot.id)}>
												{bc.name || 'unnamed scene'}
											</Group>
										))
									}
								</div>
								<div className='icons'>
									<VerticalAlignTopOutlined className={this.props.adventure.plot.id === this.state.plot.id ? 'disabled' : ''} title='go up one level' onClick={() => this.goUp()} />
								</div>
							</div>
						</div>
						<PlotPanel
							plot={this.state.plot}
							selectedSceneID={this.state.selectedSceneID}
							selectScene={scene => this.setSelectedScene(scene)}
							exploreScene={scene => this.explore(scene)}
							addScene={(sceneBefore, sceneAfter) => this.props.addScene(this.state.plot, sceneBefore, sceneAfter)}
						/>
					</Col>
				</Row>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='AdventureScreen' error={e} />;
		}
	}
}
