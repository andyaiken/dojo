import { VerticalAlignBottomOutlined } from '@ant-design/icons';
import { Popover } from 'antd';
import React from 'react';

import { Verne } from '../../utils/verne';

import { Plot, Scene } from '../../models/adventure';

import { RenderError } from '../error';

interface Props {
	plot: Plot;
	mode: 'thumbnail' | 'editor';
	selectedSceneID: string | null;
	selectSceneID: (sceneID: string | null) => void;
	exploreScene: (scene: Scene) => void;
	addScene: (sceneBefore: Scene | null, sceneAfter: Scene | null) => void;
}

export class PlotPanel extends React.Component<Props> {
	public static defaultProps = {
		mode: 'editor',
		selectedSceneID: null,
		selectSceneID: () => null,
		exploreScene: (scene: Scene) => null,
		addScene: (before: Scene | null, after: Scene | null) => null
	};

	public render() {
		try {
			const rowHeight = this.props.mode === 'editor' ? 240 : 30;

			const rows = Verne.getRows(this.props.plot);
			const height = (rowHeight * Math.max(1, rows.length)) + 'px';

			const positions: { [id: string]: { x: number, y: number } } = {};

			const scenes: JSX.Element[] = [];
			rows.forEach((row, rowIndex) => {
				const y = rowHeight * rowIndex;
				const sectionWidth = 100 / ((row.length * 2) + 1);
				row.forEach((scene, sceneIndex) => {
					const x = sectionWidth * ((sceneIndex * 2) + 1)
					positions[scene.id] = { x: x + (sectionWidth / 2), y: y + (rowHeight / 2) };
					scenes.push(
						<foreignObject
							key={scene.id}
							className='scene-panel-container'
							x={x + '%'}
							y={y}
							width={sectionWidth + '%'}
							height={rowHeight}
						>
							<ScenePanel
								scene={scene}
								mode={this.props.mode}
								selected={scene.id === this.props.selectedSceneID}
								onSelect={() => this.props.selectSceneID(scene.id)}
								onExplore={() => this.props.exploreScene(scene)}
								addSceneBefore={() => this.props.addScene(null, scene)}
								addSceneAfter={() => this.props.addScene(scene, null)}
							/>
						</foreignObject>
					)
				});
			});
			if (scenes.length === 0) {
				scenes.push(
					<foreignObject
						key='empty'
						className='empty'
						x={0}
						y={0}
						width={'100%'}
						height={rowHeight}
					>
						<div className='section centered'>(no scenes)</div>
					</foreignObject>
				);
			}

			const links: JSX.Element[] = [];
			const linkLabels: JSX.Element[] = [];
			this.props.plot.scenes.forEach(scene => {
				scene.links.forEach(link => {
					const fromPosition = positions[scene.id];
					const toPosition = positions[link.sceneID];

					const fromY = fromPosition.y;
					const toY = toPosition.y;

					let style = 'scene-link';
					if ((scene.id === this.props.selectedSceneID) || (link.sceneID === this.props.selectedSceneID)) {
						style += ' selected';
					}

					links.push(
						<line
							key={link.id}
							className={style}
							x1={fromPosition.x + '%'}
							y1={fromY}
							x2={toPosition.x + '%'}
							y2={toY}
						/>
					);

					if (link.text && (this.props.mode === 'editor')) {
						let minX = Math.min(fromPosition.x, toPosition.x);
						let maxX = Math.max(fromPosition.x, toPosition.x);
						if (minX === maxX) {
							minX -= 10;
							maxX += 10;
						}

						linkLabels.push(
							<foreignObject
								key={link.id + '-label'}
								className='link-label-container'
								x={minX + '%'}
								y={fromY}
								width={(maxX - minX) + '%'}
								height={toY - fromY}
							>
								<div className='link-label'>{link.text}</div>
							</foreignObject>
						)
					}
				});
			});

			return (
				<svg className={'plot-panel ' + this.props.mode} style={{ height: height }} onClick={() => this.props.selectSceneID(null)}>
					{links}
					{linkLabels}
					{scenes}
				</svg>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='PlotPanel' error={e} />;
		}
	}
}

interface ScenePanelProps {
	scene: Scene;
	mode: 'thumbnail' | 'editor';
	selected: boolean;
	onSelect: () => void;
	onExplore: () => void;
	addSceneBefore: () => void;
	addSceneAfter: () => void;
}

class ScenePanel extends React.Component<ScenePanelProps> {
	private onClick(e: React.MouseEvent) {
		e.stopPropagation();
		this.props.onSelect();
	}

	private onExplore(e: React.MouseEvent) {
		e.stopPropagation();
		this.props.onExplore();
	}

	private getPopover() {
		return (
			<div>
				<button onClick={() => this.props.addSceneBefore()}>add a new scene before this</button>
				<button onClick={() => this.props.addSceneAfter()}>add a new scene after this</button>
			</div>
		);
	}

	public render() {
		try {
			if (this.props.mode === 'thumbnail') {
				return (
					<div className='scene-panel' />
				);
			}

			let style = 'scene-panel';
			if (this.props.selected) {
				style += ' selected';
			}

			return (
				<Popover
					content={this.getPopover()}
					trigger='contextMenu'
					placement='bottom'
					overlayClassName='scene-tooltip'
				>
					<div className={style} onClick={e => this.onClick(e)} role='button'>
						<div className='text-container'>
							<div className='content-then-icons'>
								<div className='content'>
									<div className='scene-name'>{this.props.scene.name || 'unnamed scene'}</div>
								</div>
								<div className='icons vertical'>
									<VerticalAlignBottomOutlined title='explore' onClick={e => this.onExplore(e)} />
								</div>
							</div>
						</div>
					</div>
				</Popover>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='ScenePanel' error={e} />;
		}
	}
}
