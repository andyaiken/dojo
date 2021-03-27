import { CopyOutlined } from '@ant-design/icons';
import React from 'react';

import { Comms, CommsDM } from '../../utils/uhura';
import { Utils } from '../../utils/utils';

import { Combat } from '../../models/combat';
import { Exploration } from '../../models/map';
import { Monster } from '../../models/monster';
import { Party } from '../../models/party';

import { Checkbox } from '../controls/checkbox';
import { ConfirmButton } from '../controls/confirm-button';
import { Dropdown } from '../controls/dropdown';
import { Group } from '../controls/group';
import { Note } from '../controls/note';
import { Selector } from '../controls/selector';
import { ConnectionsPanel, MessagesPanel, SendMessagePanel } from '../panels/session-panel';

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
}

export class SessionSidebar extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			selectedPartyID: this.props.parties.length === 1 ? this.props.parties[0].id : null
		};
	}

	private setSelectedPartyID(id: string | null) {
		this.setState({
			selectedPartyID: id
		});
	}

	private getContent() {
		switch (CommsDM.getState()) {
			case 'not started':
				return this.getNotStartedContent();
			case 'starting':
				return this.getStartingContent();
			case 'started':
				return this.getStartedContent();
		}
	}

	private getNotStartedContent() {
		return (
			<div>
				<Note>
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
			</div>
		);
	}

	private getStartingContent() {
		return (
			<Note>
				<div className='section'>
					starting session...
				</div>
			</Note>
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
						sharing = 'encounter (' + combat.encounter.name + ')';
						break;
					case 'exploration':
						const exploration = Comms.data.shared.data as Exploration;
						sharing = 'map (' + exploration.map.name + ')';
						break;
					case 'handout':
						const handout = Comms.data.shared.data as { title: string, src: string };
						sharing = 'handout (' + handout.title + ')';
						break;
					case 'monster':
						const monster = Comms.data.shared.data as Monster;
						sharing = 'monster (' + monster.name + ')';
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
									<CopyOutlined title='copy to clipboard' onClick={e => navigator.clipboard.writeText(playerURL)} />
								</div>
							</div>
						</Group>
						<hr/>
						<div className='subheading'>currently sharing</div>
						<div className='section'>{sharing}</div>
						{action}
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
