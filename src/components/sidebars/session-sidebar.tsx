import { CopyOutlined } from '@ant-design/icons';
import React from 'react';

import Factory from '../../utils/factory';
import Gygax from '../../utils/gygax';
import Mercator from '../../utils/mercator';
import Napoleon from '../../utils/napoleon';
import { Comms, CommsDM, CommsPlayer } from '../../utils/uhura';
import Utils from '../../utils/utils';

import { Combat, Combatant } from '../../models/combat';
import { Condition } from '../../models/condition';
import { Exploration, Map } from '../../models/map';
import { Monster } from '../../models/monster';
import { Party } from '../../models/party';

import Checkbox from '../controls/checkbox';
import ConfirmButton from '../controls/confirm-button';
import Dropdown from '../controls/dropdown';
import Selector from '../controls/selector';
import CombatControlsPanel from '../panels/combat-controls-panel';
import Note from '../panels/note';
import { ConnectionsPanel, MessagesPanel, PlayerStatusPanel, SendMessagePanel } from '../panels/session-panel';

interface Props {
	view: string;
	user: 'dm' | 'player';
	parties: Party[];
	combat: Combat | null;
	exploration: Exploration | null;
	setView: (view: string) => void;
	openImage: (data: string) => void;
	editPC: (id: string) => void;
	addCondition: (combatants: Combatant[], allCombatants: Combatant[]) => void;
	editCondition: (combatant: Combatant, condition: Condition, allCombatants: Combatant[]) => void;
	toggleAddingToMap: () => void;
	onUpdated: () => void;
}

export default class SessionSidebar extends React.Component<Props> {
	private getContent() {
		if (this.props.user === 'player') {
			switch (CommsPlayer.getState()) {
				case 'not connected':
				case 'connecting':
					return this.getNotConnectedContent();
				case 'connected':
					return this.getConnectedContent();
			}
		}

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
					<p>select a party, then click the 'start' button to allow your players to connect to the game session</p>
					<p>you can then send messages and share handouts, combat encounters, and map explorations</p>
				</Note>
				<Dropdown
					placeholder='select a party...'
					options={this.props.parties.map(party => ({ id: party.id, text: party.name }))}
					selectedID={Comms.getPartyID()}
					onSelect={id => {
						const party = this.props.parties.find(p => p.id === id);
						CommsDM.setParty(party ?? null);
					}}
				/>
				<button className={Comms.getPartyID() === '' ? 'disabled' : ''} onClick={() => CommsDM.init()}>start the session</button>
			</div>
		);
	}

	private getStartingContent() {
		return (
			<Note>
				<p>starting session...</p>
			</Note>
		);
	}

	private getStartedContent() {
		const playerURL = window.location + (window.location.toString().endsWith('/') ? '' : '/') + 'player';

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

				let stopSharingBtn = null;
				if (Comms.data.shared.type !== 'nothing') {
					stopSharingBtn = (
						<ConfirmButton text='stop sharing' onConfirm={() => CommsDM.shareNothing()} />
					);
				}

				return (
					<div>
						<Note>
							<p>give your dm code to your players, and ask them to open the player app in their browser</p>
						</Note>
						<div className='generated-item group-panel'>
							<div className='text-section'>
								<p className='smallest'>your dm code for this session:</p>
								<p className='smallest strong'>{Comms.getID()}</p>
							</div>
							<div className='icon-section'>
								<CopyOutlined title='copy to clipboard' onClick={e => navigator.clipboard.writeText(Comms.getID())} />
							</div>
						</div>
						<div className='generated-item group-panel'>
							<div className='text-section'>
								<p className='smallest'>player app url:</p>
								<p className='smallest strong'>{playerURL}</p>
							</div>
							<div className='icon-section'>
								<CopyOutlined title='copy to clipboard' onClick={e => navigator.clipboard.writeText(playerURL)} />
							</div>
						</div>
						<hr/>
						<div className='subheading'>currently sharing</div>
						<div className='section'>{sharing}</div>
						{stopSharingBtn}
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
						<ConfirmButton
							text='end the session'
							onConfirm={() => CommsDM.shutdown()}
						/>
					</div>
				);
		}

		return null;
	}

	private getNotConnectedContent() {
		return (
			<Note>
				<p>you're not yet connected to the session</p>
				<p>when you are connected, this sidebar will allow you to manage your presence</p>
			</Note>
		);
	}

	private getConnectedContent() {
		switch (this.props.view) {
			case 'messages':
				return (
					<MessagesPanel
						user='player'
						messages={Comms.data.messages}
						openImage={data => this.props.openImage(data)}
					/>
				);
			case 'people':
				return (
					<ConnectionsPanel
						user='player'
						people={Comms.data.people}
						kick={id => null}
					/>
				);
			case 'controls':
				return this.getPlayerControls();
			case 'management':
				return (
					<PlayerStatusPanel
						editPC={id => this.props.editPC(id)}
					/>
				);
		}

		return null;
	}

	private getPlayerControls() {
		let allCombatants: Combatant[] = [];
		let map: Map | null = null;

		if (Comms.data.shared.type === 'combat') {
			const combat = Comms.data.shared.data as Combat;
			allCombatants = combat.combatants;
			map = combat.map;
		}
		if (Comms.data.shared.type === 'exploration') {
			const exploration = Comms.data.shared.data as Exploration;
			allCombatants = exploration.combatants;
			map = exploration.map;
		}

		const characterID = Comms.getCharacterID(Comms.getID());
		const current = allCombatants.find(c => c.id === characterID);
		if (!current) {
			return (
				<Note>
					<p>when you choose your character, you will be able to control it here</p>
				</Note>
			);
		}

		return (
			<CombatControlsPanel
				combatants={[current]}
				allCombatants={allCombatants}
				map={map}
				showTabs={false}
				// Main tab
				toggleTag={(combatants, tag) => {
					combatants.forEach(c => {
						if (c.tags.includes(tag)) {
							c.tags = c.tags.filter(t => t !== tag);
						} else {
							c.tags.push(tag);
						}
					});
					CommsPlayer.sendSharedUpdate();
					this.props.onUpdated();
				}}
				toggleCondition={(combatants, condition) => {
					combatants.forEach(c => {
						if (c.conditions.some(cnd => cnd.name === condition)) {
							c.conditions = c.conditions.filter(cnd => cnd.name !== condition);
						} else {
							const cnd = Factory.createCondition();
							cnd.name = condition;
							c.conditions.push(cnd);

							c.conditions = Utils.sort(c.conditions, [{ field: 'name', dir: 'asc' }]);
						}
					});
					CommsPlayer.sendSharedUpdate();
					this.props.onUpdated();
				}}
				toggleHidden={combatants => {
					combatants.forEach(c => c.showOnMap = !c.showOnMap);
					CommsPlayer.sendSharedUpdate();
					this.props.onUpdated();
				}}
				// Cond tab
				addCondition={combatants => this.props.addCondition(combatants, allCombatants)}
				editCondition={(combatant, condition) => this.props.editCondition(combatant, condition, allCombatants)}
				removeCondition={(combatant, condition) => {
					combatant.conditions = combatant.conditions.filter(cnd => cnd.name !== condition.name);
					CommsPlayer.sendSharedUpdate();
					this.props.onUpdated();
				}}
				// Map tab
				mapAdd={combatant => this.props.toggleAddingToMap()}
				mapMove={(combatants, dir) => {
					const ids = combatants.map(c => c.id);
					const list = Napoleon.getMountsAndRiders(ids, allCombatants).map(c => c.id);
					ids.forEach(id => {
						if (!list.includes(id)) {
							list.push(id);
						}
					});
					list.forEach(id => Mercator.move(map as Map, id, dir));
					Napoleon.setMountPositions(allCombatants, map as Map);
					CommsPlayer.sendSharedUpdate();
					this.props.onUpdated();
				}}
				mapRemove={combatants => {
					const ids = combatants.map(c => c.id);
					const list = Napoleon.getMountsAndRiders(ids, allCombatants).map(c => c.id);
					ids.forEach(id => {
						if (!list.includes(id)) {
							list.push(id);
						}
					});
					list.forEach(id => Mercator.remove(map as Map, id));
					CommsPlayer.sendSharedUpdate();
					this.props.onUpdated();
				}}
				onChangeAltitude={(combatant, value) => {
					const list = Napoleon.getMountsAndRiders([combatant.id], allCombatants);
					list.forEach(c => c.altitude = value);
					CommsPlayer.sendSharedUpdate();
					this.props.onUpdated();
				}}
				// Adv tab
				addCompanion={companion => {
					allCombatants.push(Napoleon.convertCompanionToCombatant(companion));
					Utils.sort(allCombatants, [{ field: 'displayName', dir: 'asc' }]);
					CommsPlayer.sendSharedUpdate();
					this.props.onUpdated();
				}}
				// General
				changeValue={(source, field, value) => {
					source[field] = value;
					CommsPlayer.sendSharedUpdate();
					this.props.onUpdated();
				}}
				nudgeValue={(source, field, delta) => {
					let value = null;
					switch (field) {
						case 'displaySize':
							value = Gygax.nudgeSize(source.displaySize, delta);
							break;
						default:
							value = source[field] + delta;
							break;
					}
					source[field] = value;
					if (Comms.data.shared.type === 'combat') {
						const combat = Comms.data.shared.data as Combat;
						Napoleon.sortCombatants(combat);
					}
					CommsPlayer.sendSharedUpdate();
					this.props.onUpdated();
				}}
			/>
		);
	}

	private getViewSelector() {
		if ((this.props.user === 'dm') && (CommsDM.getState() !== 'started')) {
			return null;
		}

		if ((this.props.user === 'player') && (CommsPlayer.getState() !== 'connected')) {
			return null;
		}

		const options = [];
		options.push('management');
		options.push('people');
		if (Comms.data.options.allowChat) {
			options.push('messages');
		}
		if ((this.props.user === 'player') && (Comms.data.options.allowControls)) {
			switch (Comms.data.shared.type) {
				case 'combat':
				case 'exploration':
					options.push('controls');
					break;
			}
		}

		return (
			<Selector
				options={options.map(o => ({ id: o, text: o }))}
				selectedID={this.props.view}
				onSelect={view => this.props.setView(view)}
			/>
		);
	}

	private getFooter() {
		if ((this.props.user === 'dm') && (CommsDM.getState() === 'started') && (this.props.view === 'messages')) {
			return (
				<div className='sidebar-footer'>
					<SendMessagePanel
						user='dm'
						sendMessage={(to, text, language, untranslated) => CommsDM.sendMessage(to, text, language, untranslated)}
						sendLink={(to, url) => CommsDM.sendLink(to, url)}
						sendImage={(to, image) => CommsDM.sendImage(to, image)}
						sendRoll={(to, roll) => CommsDM.sendRoll(to, roll)}
					/>
				</div>
			);
		}

		if ((this.props.user === 'player') && (CommsPlayer.getState() === 'connected') && (this.props.view === 'messages')) {
			return (
				<div className='sidebar-footer'>
					<SendMessagePanel
						user='player'
						sendMessage={(to, text, language, untranslated) => CommsPlayer.sendMessage(to, text, language, untranslated)}
						sendLink={(to, url) => CommsPlayer.sendLink(to, url)}
						sendImage={(to, image) => CommsPlayer.sendImage(to, image)}
						sendRoll={(to, roll) => CommsPlayer.sendRoll(to, roll)}
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
