import { CopyOutlined } from '@ant-design/icons';
import React from 'react';

import { Comms, CommsDM } from '../../utils/uhura';
import { Utils } from '../../utils/utils';

import { Combat } from '../../models/combat';
import { Exploration } from '../../models/map';
import { Monster } from '../../models/monster';
import { Party } from '../../models/party';

import { Checkbox } from '../controls/checkbox';
import { Conditional } from '../controls/conditional';
import { ConfirmButton } from '../controls/confirm-button';
import { Dropdown } from '../controls/dropdown';
import { Group } from '../controls/group';
import { Note } from '../controls/note';
import { Selector } from '../controls/selector';
import { ConnectionsPanel, MessagesPanel, SendMessagePanel } from '../panels/session-panel';
import { MapPanel } from '../panels/map-panel';
import { Expander } from '../controls/expander';

interface Props {
	view: string;
	parties: Party[];
	currentCombat: Combat | null;
	currentExploration: Exploration | null;
	setView: (view: string) => void;
	openImage: (data: string) => void;
}

interface State {
	selectedPartyID: string | null;
	selectedCombatantID: string | null;
}

export class SessionDMSidebar extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			selectedPartyID: this.props.parties.length === 1 ? this.props.parties[0].id : null,
			selectedCombatantID: null
		};
	}

	private setSelectedPartyID(id: string | null) {
		this.setState({
			selectedPartyID: id
		});
	}

	private setSelectedCombatantID(id: string | null) {
		this.setState({
			selectedCombatantID: id
		});
	}

	private getContent() {
		const state = CommsDM.getState();
		return (
			<div>
				<Conditional display={state === 'not started'}>
					<Note>
						<div className='section'>
							you're not currently running a game session
						</div>
						<div className='section'>
							select a party, then click the 'start' button to allow your players to connect to the game session
						</div>
						<div className='section'>
							you can then send messages and share content such as handouts, combat encounters, and map explorations
						</div>
					</Note>
					<Dropdown
						placeholder='select a party...'
						options={this.props.parties.map(party => ({ id: party.id, text: party.name || 'unnamed party' }))}
						selectedID={this.state.selectedPartyID}
						onSelect={id => this.setSelectedPartyID(id)}
					/>
					<button
						className={this.state.selectedPartyID ? '' : 'disabled'}
						onClick={() => {
							const party = this.props.parties.find(p => p.id === this.state.selectedPartyID);
							if (party) {
								CommsDM.init(party);
							}
						}}
					>
						start the session
					</button>
				</Conditional>
				<Conditional display={state === 'starting'}>
					<Note>
						<div className='section'>
							starting session...
						</div>
					</Note>
				</Conditional>
				<Conditional display={state === 'started'}>
					{this.getStartedContent()}
				</Conditional>
			</div>
		);
	}

	private getStartedContent() {
		switch (this.props.view) {
			case 'messages':
				return (
					<MessagesPanel
						user='dm'
						messages={Comms.data.messages}
						openImage={data => this.props.openImage(data)}
					/>
				);
			case 'people':
				return (
					<ConnectionsPanel
						user='dm'
						people={Comms.data.people}
						kick={id => {
							CommsDM.kick(id);
							this.forceUpdate();
						}}
					/>
				);
			case 'management':
				let playerURL = 'https://andyaiken.github.io/dojo/#/player/' + Comms.getID();
				if (window.location.hostname === 'localhost') {
					playerURL = 'http://localhost:3000/dojo/#/player/' + Comms.getID();
				}

				let sharing = null;
				switch (Comms.data.shared.type) {
					case 'nothing':
						sharing = '(nothing)';
						break;
					case 'combat':
						const combat = Comms.data.shared.data as Combat;
						sharing = 'encounter (' + (combat.encounter.name || 'unnamed encounter') + ')';
						break;
					case 'exploration':
						const exploration = Comms.data.shared.data as Exploration;
						sharing = 'map (' + (exploration.map.name || 'unnamed map') + ')';
						break;
					case 'handout':
						const handout = Comms.data.shared.data as { title: string, src: string };
						sharing = 'handout (' + (handout.title || 'untitled handout') + ')';
						break;
					case 'monster':
						const monster = Comms.data.shared.data as Monster;
						sharing = 'monster (' + (monster.name || 'unnamed monster') + ')';
						break;
				}

				let action = null;
				if (Comms.data.shared.type === 'nothing') {
					if (this.props.currentCombat) {
						action = (
							<button onClick={() => CommsDM.shareCombat(this.props.currentCombat as Combat)}>start sharing combat</button>
						);
					} else if (this.props.currentExploration) {
						action = (
							<button onClick={() => CommsDM.shareExploration(this.props.currentExploration as Exploration)}>start sharing exploration</button>
						);
					}
				} else {
					action = (
						<ConfirmButton onConfirm={() => CommsDM.shareNothing()}>stop sharing</ConfirmButton>
					);
				}

				return (
					<div>
						<Note>
							<div className='section'>
								give the following link to your players, and ask them to open the player app in their browser
							</div>
						</Note>
						<Group>
							<div className='content-then-icons'>
								<div className='content'>
									<div className='section'>
										player app link:
									</div>
									<div className='section'>
										<b>{playerURL}</b>
									</div>
								</div>
								<div className='icons'>
									<CopyOutlined title='copy to clipboard' onClick={() => navigator.clipboard.writeText(playerURL)} />
								</div>
							</div>
						</Group>
						<hr/>
						<div className='subheading'>currently sharing</div>
						<div className='section'>{sharing}</div>
						{action}
						{this.getTools()}
						<hr/>
						<div className='subheading'>options</div>
						<Checkbox
							label='allow chat'
							checked={Comms.data.options.allowChat}
							onChecked={value => CommsDM.setOption('allowChat', value)}
						/>
						<Checkbox
							label='allow players to control their characters'
							checked={Comms.data.options.allowControls}
							onChecked={value => CommsDM.setOption('allowControls', value)}
						/>
						<ConfirmButton onConfirm={() => CommsDM.shutdown()}>end the session</ConfirmButton>
					</div>
				);
		}

		return null;
	}

	private getTools() {
		let map = null;
		let areaID = null;
		let combatants = null;
		let lighting = null;
		let fog = null;
		if (this.props.currentCombat && this.props.currentCombat.map) {
			map = this.props.currentCombat.map;
			areaID = this.props.currentCombat.mapAreaID;
			combatants = this.props.currentCombat.combatants;
			lighting = this.props.currentCombat.lighting;
			fog = this.props.currentCombat.fog;
		} else if (this.props.currentExploration) {
			map = this.props.currentExploration.map;
			areaID = this.props.currentExploration.mapAreaID;
			combatants = this.props.currentExploration.combatants;
			lighting = this.props.currentExploration.lighting;
			fog = this.props.currentExploration.fog;
		}

		if (map) {
			const additional = Comms.data.shared.additional;
			const highlightedSquare = additional['highlightedSquare'] as { x: number, y: number} | null ?? null;

			let dropdown = null;
			if (combatants) {
				dropdown = (
					<Dropdown
						placeholder='view the map as...'
						options={combatants.map(c => ({ id: c.id, text: c.displayName }))}
						selectedID={this.state.selectedCombatantID}
						onSelect={id => this.setSelectedCombatantID(id)}
						onClear={() => this.setSelectedCombatantID(null)}
					/>
				);
			}

			return (
				<Expander text='player map'>
					<Note>
						<div className='section'>
							this is how the map looks to your players
						</div>
					</Note>
					{dropdown}
					<div className='scrollable horizontal-only'>
						<MapPanel
							mode='interactive-player'
							map={map}
							selectedAreaID={areaID}
							combatants={combatants || []}
							selectedItemIDs={this.state.selectedCombatantID ? [this.state.selectedCombatantID] : []}
							lighting={lighting || 'bright light'}
							fog={fog || []}
							focussedSquare={highlightedSquare}
						/>
					</div>
				</Expander>
			);
		}

		return null;
	}

	private getViewSelector() {
		if (CommsDM.getState() !== 'started') {
			return null;
		}

		const options = [];
		options.push('management');
		options.push('people');
		if (Comms.data.options.allowChat) {
			options.push('messages');
		}

		return (
			<Selector
				options={Utils.arrayToItems(options)}
				selectedID={this.props.view}
				onSelect={view => this.props.setView(view)}
			/>
		);
	}

	private getFooter() {
		if ((CommsDM.getState() === 'started') && (this.props.view === 'messages')) {
			return (
				<div className='sidebar-footer'>
					<SendMessagePanel
						user='dm'
						sendMessage={(to, text, language, untranslated) => CommsDM.sendMessage(to, text, language, untranslated)}
						sendLink={(to, url) => CommsDM.sendLink(to, url)}
						sendImage={(to, image) => CommsDM.sendImage(to, image)}
						sendRoll={(to, roll) => CommsDM.sendRoll(to, roll)}
						sendCard={(to, card) => CommsDM.sendCard(to, card)}
					/>
				</div>
			);
		}

		return null;
	}

	public render() {
		return (
			<div className='sidebar-container'>
				<div className='sidebar-header'>
					<div className='heading'>session</div>
					{this.getViewSelector()}
				</div>
				<div className='sidebar-content'>
					{this.getContent()}
				</div>
				{this.getFooter()}
			</div>
		);
	}
}
