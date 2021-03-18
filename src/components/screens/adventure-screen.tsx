import { CaretLeftOutlined, CaretRightOutlined, DeleteOutlined, EditOutlined, VerticalAlignTopOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import React from 'react';

import { Factory } from '../../utils/factory';
import { Napoleon } from '../../utils/napoleon';
import { Utils } from '../../utils/utils';
import { Verne } from '../../utils/verne';

import { Adventure, Plot, Scene, SceneLink } from '../../models/adventure';
import { Encounter } from '../../models/encounter';
import { Map } from '../../models/map';
import { Monster } from '../../models/monster';
import { Party } from '../../models/party';

import { RenderError } from '../error';
import { Conditional } from '../controls/conditional';
import { ConfirmButton } from '../controls/confirm-button';
import { Dropdown } from '../controls/dropdown';
import { Expander } from '../controls/expander';
import { Group } from '../controls/group';
import { Note } from '../controls/note';
import { NumberSpin } from '../controls/number-spin';
import { Tabs } from '../controls/tabs';
import { Textbox } from '../controls/textbox';
import { AdventureOptions } from '../options/adventure-options';
import { EncounterInfoPanel } from '../panels/encounter-info-panel';
import { MarkdownEditor } from '../panels/markdown-editor';
import { MapPanel } from '../panels/map-panel';
import { PlotPanel } from '../panels/plot-panel';

interface Props {
	adventure: Adventure;
	parties: Party[];
	encounters: Encounter[];
	maps: Map[];
	goBack: () => void;
	addScene: (plot: Plot, sceneBefore: Scene | null, sceneAfter: Scene | null) => void;
	moveScene: (plot: Plot, scene: Scene, dir: 'left' | 'right') => void;
	deleteScene: (plot: Plot, scene: Scene) => void;
	addLink: (scene: Scene, sceneID: string) => void;
	deleteLink: (scene: Scene, link: SceneLink) => void;
	deleteAdventure: (adventure: Adventure) => void;
	addMapToPlot: (plot: Plot, random: boolean) => void;
	removeMapFromPlot: (plot: Plot) => void;
	addEncounterToScene: (scene: Scene, party: Party | null, random: boolean) => void;
	removeEncounterFromScene: (scene: Scene, encounterID: string) => void;
	openEncounter: (encounter: Encounter) => void;
	runEncounter: (encounter: Encounter) => void;
	runEncounterWithMap: (encounter: Encounter, map: Map, areaID: string) => void;
	rotateMap: (plot: Plot) => void;
	showNotes: (scene: Scene) => void;
	showMonster: (monster: Monster) => void;
	getMonster: (id: string) => Monster | null;
	changeValue: (source: any, field: string, value: any) => void;
}

interface State {
	plot: Plot;
	view: string;
	breadcrumbs: { name: string, plot: Plot }[];
	selectedSceneID: string | null;
	selectedPartyID: string | null;
	customPartySize: number;
	customPartyLevel: number;
}

export class AdventureScreen extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			plot: props.adventure.plot,
			view: 'content',
			breadcrumbs: [{ name: props.adventure.name || 'adventure', plot: props.adventure.plot }],
			selectedSceneID: null,
			selectedPartyID: null,
			customPartySize: 5,
			customPartyLevel: 1
		};
	}

	private setView(view: string) {
		this.setState({
			view: view
		});
	}

	private setSelectedSceneID(sceneID: string | null) {
		this.setState({
			selectedSceneID: sceneID
		});
	}

	private setSelectedPartyID(partyID: string | null) {
		this.setState({
			selectedPartyID: partyID
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
			breadcrumbs: breadcrumbs,
			selectedSceneID: null
		});
	}

	private goUp() {
		if (this.state.breadcrumbs.length > 1) {
			const breadcrumbs = this.state.breadcrumbs.slice(0, this.state.breadcrumbs.length - 1);
			const last = breadcrumbs[breadcrumbs.length - 1];
			this.setState({
				plot: last.plot,
				breadcrumbs: breadcrumbs,
				selectedSceneID: null
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
				breadcrumbs: breadcrumbs,
				selectedSceneID: null
			});
		}
	}

	private runEncounter(encounter: Encounter, scene: Scene) {
		if (this.state.plot.map) {
			this.props.runEncounterWithMap(encounter, this.state.plot.map, scene.id);
		} else {
			this.props.runEncounter(encounter);
		}
	}

	private canMoveScene(scene: Scene, dir: 'left' | 'right') {
		return Verne.canMoveScene(this.state.plot, scene, dir);
	}

	private moveScene(scene: Scene, dir: 'left' | 'right') {
		this.props.moveScene(this.state.plot, scene, dir);
	}

	private getParty() {
		let party: Party | null = null;

		if (this.state.selectedPartyID !== null) {
			if (this.state.selectedPartyID === 'custom') {
				party = Factory.createParty();
				for (let n = 0; n !== this.state.customPartySize; ++n) {
					const pc = Factory.createPC();
					pc.level = this.state.customPartyLevel;
					party.pcs.push(pc);
				}
			} else {
				party = this.props.parties.find(p => p.id === this.state.selectedPartyID) || null;
			}
		}

		return party;
	}

	private getEncounters(scene: Scene) {
		const party = this.getParty();

		const encounters: JSX.Element[] = [];

		scene.encounterIDs.forEach(encounterID => {
			const encounter = this.props.encounters.find(enc => enc.id === encounterID);
			if (encounter) {
				let diff = null;
				if (party) {
					const d = Napoleon.getEncounterDifficulty(encounter, null, party, this.props.getMonster);
					diff = 'diff-' + Math.min(4, d.adjusted);
				}

				encounters.push(
					<Group key={encounter.id} className={diff}>
						<div className='content-then-icons'>
							<div className='content'>
								<EncounterInfoPanel
									encounter={encounter}
									getMonster={id => this.props.getMonster(id)}
									onMonsterClicked={monster => this.props.showMonster(monster)}
								/>
							</div>
							<div className='icons vertical'>
								<EditOutlined title='edit encounter' onClick={() => this.props.openEncounter(encounter)} />
								<CaretRightOutlined title='run encounter' onClick={() => this.runEncounter(encounter, scene)} />
								<ConfirmButton onConfirm={() => this.props.removeEncounterFromScene(scene, encounter.id)}>
									<DeleteOutlined title='remove from scene' />
								</ConfirmButton>
							</div>
						</div>
					</Group>
				);
			}
		});

		return encounters;
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
									<CaretRightOutlined title='go to' onClick={() => this.setSelectedSceneID(target.id)} />
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

			let options = ['content', 'links', 'encounters'].map(o => ({ id: o, text: o }));
			if (this.state.plot.map) {
				options = options.filter(o => o.id !== 'links');
			}
			if (this.state.plot.scenes.length < 2) {
				options = options.filter(o => o.id !== 'links');
			}

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
					<Tabs
						options={options}
						selectedID={this.state.view}
						onSelect={view => this.setView(view)}
					/>
					<Conditional display={this.state.view === 'content'}>
						<MarkdownEditor text={scene.content} onChange={value => this.props.changeValue(scene, 'content', value)} />
					</Conditional>
					<Conditional display={this.state.view === 'links'}>
						<Conditional display={this.state.plot.map === null}>
							{links}
							<Dropdown
								placeholder='select a scene to link to...'
								options={Utils.sort(Verne.getPotentialLinks(this.state.plot, scene)).map(s => ({ id: s.id, text: s.name || 'unnamed scene' }))}
								onSelect={id => this.props.addLink(scene, id)}
							/>
						</Conditional>
						<Conditional display={this.state.plot.map !== null}>
							<Note>
								<div className='section'>
									links aren't needed between map areas
								</div>
							</Note>
						</Conditional>
					</Conditional>
					<Conditional display={this.state.view === 'encounters'}>
						{this.getEncounters(scene)}
						<Conditional display={this.props.encounters.length > 0}>
							<button onClick={() => this.props.addEncounterToScene(scene, this.getParty(), false)}>link an encounter</button>
						</Conditional>
						<button onClick={() => this.props.addEncounterToScene(scene, this.getParty(), true)}>link a new random encounter</button>
					</Conditional>
					<Conditional display={this.state.plot.map === null}>
						<hr/>
						<Row gutter={10}>
							<Col span={12}>
								<button className={this.canMoveScene(scene, 'left') ? '' : 'disabled'} onClick={() => this.moveScene(scene, 'left')}>move left</button>
							</Col>
							<Col span={12}>
								<button className={this.canMoveScene(scene, 'right') ? '' : 'disabled'} onClick={() => this.moveScene(scene, 'right')}>move right</button>
							</Col>
						</Row>
						<hr/>
						<button onClick={() => this.explore(scene)}>explore scene</button>
						<ConfirmButton onConfirm={() => this.props.deleteScene(this.state.plot, scene)}>delete scene</ConfirmButton>
					</Conditional>
					<hr/>
					<button onClick={() => this.setSelectedSceneID(null)}><CaretLeftOutlined style={{ fontSize: '10px' }} /> back to the adventure</button>
				</div>
			);
		} else {
			const partyOptions = this.props.parties.map(p => ({ id: p.id, text: p.name || 'unnamed party' }));
			partyOptions.push({
				id: 'custom',
				text: 'custom party'
			});

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
					<Conditional display={this.props.adventure.plot.scenes.length === 0}>
						<Note>
							<div className='section'>
								an adventure is made up of scenes which are linked together like a flowchart
							</div>
							<div className='section'>
								press <b>add a scene</b> to add your first scene to this adventure
							</div>
							<Conditional display={this.state.plot.scenes.length === 0}>
								<div className='section'>
									alternatively, you can <b>use a map</b> to create scenes for each of its areas; this is handy if you're designing a dungeon crawl
								</div>
							</Conditional>
						</Note>
					</Conditional>
					<Conditional display={this.state.plot.map === null}>
						<button onClick={() => this.props.addScene(this.state.plot, null, null)}>add a scene</button>
					</Conditional>
					<Conditional display={this.state.plot.map !== null}>
						<button onClick={() => this.props.rotateMap(this.state.plot)}>rotate the map</button>
						<button onClick={() => this.props.removeMapFromPlot(this.state.plot)}>remove the map</button>
					</Conditional>
					<Conditional display={this.state.plot.scenes.length === 0}>
						<Expander text='use a map'>
							<button className={this.props.maps.length === 0 ? 'disabled' : ''} onClick={() => this.props.addMapToPlot(this.state.plot, false)}>use an existing map</button>
							<button onClick={() => this.props.addMapToPlot(this.state.plot, true)}>use a new random map</button>
						</Expander>
					</Conditional>
					<hr/>
					<Expander text='highlight difficulty'>
						<Note>
							<div className='section'>
								select a party to show the difficulty of the encounters in this adventure
							</div>
						</Note>
						<Dropdown
							placeholder='select a party...'
							options={partyOptions}
							selectedID={this.state.selectedPartyID}
							onSelect={id => this.setSelectedPartyID(id)}
							onClear={() => this.setSelectedPartyID(null)}
						/>
						<Conditional display={this.state.selectedPartyID === 'custom'}>
							<NumberSpin
								value={this.state.customPartySize}
								label='party size'
								downEnabled={this.state.customPartySize > 1}
								onNudgeValue={delta => this.setState({ customPartySize: this.state.customPartySize + delta })}
							/>
							<NumberSpin
								value={this.state.customPartyLevel}
								label='party level'
								downEnabled={this.state.customPartyLevel > 1}
								upEnabled={this.state.customPartyLevel < 20}
								onNudgeValue={delta => this.setState({ customPartyLevel: this.state.customPartyLevel + delta })}
							/>
						</Conditional>
					</Expander>
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

	private getContent() {
		const sceneClassNames: { id: string, className: string }[] = [];
		if (this.state.selectedPartyID !== null) {
			const party = this.getParty();
			if (party) {
				this.state.plot.scenes.forEach(scene => {
					const encounterIDs = Verne.getEncounterIDs(scene);
					encounterIDs.forEach(id => {
						const encounter = this.props.encounters.find(e => e.id === id);
						if (encounter) {
							const diff = Napoleon.getEncounterDifficulty(encounter, null, party as Party, this.props.getMonster);
							sceneClassNames.push({
								id: scene.id,
								className: 'diff-' + Math.min(4, diff.adjusted)
							});
						}
					});
				});
			}
		}

		if (this.state.plot.map) {
			return (
				<MapPanel
					map={this.state.plot.map}
					mode='interactive-plot'
					showAreaNames={true}
					areaClassNames={sceneClassNames}
					selectedItemIDs={this.state.selectedSceneID ? [this.state.selectedSceneID] : []}
					areaClicked={area => this.setSelectedSceneID(area.id)}
					itemSelected={() => this.setSelectedSceneID(null)}
				/>
			);
		}

		return (
			<PlotPanel
				plot={this.state.plot}
				sceneClassNames={sceneClassNames}
				selectedSceneID={this.state.selectedSceneID}
				selectSceneID={sceneID => this.setSelectedSceneID(sceneID)}
				showNotes={scene => this.props.showNotes(scene)}
				exploreScene={scene => this.explore(scene)}
				addScene={(sceneBefore, sceneAfter) => this.props.addScene(this.state.plot, sceneBefore, sceneAfter)}
			/>
		);
	}

	public render() {
		try {
			return (
				<Row className='full-height'>
					<Col span={6} className='scrollable sidebar sidebar-left'>
						{this.getSidebar()}
					</Col>
					<Col span={18} className='scrollable both-ways'>
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
									<VerticalAlignTopOutlined
										className={this.props.adventure.plot.id === this.state.plot.id ? 'disabled' : ''}
										title='go up one level'
										onClick={() => this.goUp()}
									/>
								</div>
							</div>
						</div>
						{this.getContent()}
					</Col>
				</Row>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='AdventureScreen' error={e} />;
		}
	}
}