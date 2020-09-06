import LZString from 'lz-string';
import Peer, { DataConnection } from 'peerjs';

import Factory from './factory';
import Matisse from './matisse';
import Mercator from './mercator';
import Napoleon from './napoleon';
import Utils from './utils';

import { Combat, Combatant } from '../models/combat';
import { Condition } from '../models/condition';
import { DieRollResult } from '../models/dice';
import { Exploration } from '../models/map';
import { SavedImage } from '../models/misc';
import { Monster } from '../models/monster';
import { Companion, Party, PC } from '../models/party';

// This controls the interval, in seconds, between pulses
const PULSE_INTERVAL = 60;

export interface Packet {
	type: 'update' | 'player-info' | 'character-info' | 'message' | 'ask-for-roll' | 'roll-result' | 'action';
	payload: any;
}

export interface Person {
	id: string;
	name: string;
	status: string;
	characterID: string;
}

export interface Message {
	id: string;
	from: string;
	to: string[];
	type: 'text' | 'link' | 'image' | 'roll' | 'monster';
	data: any;
}

export interface SharedExperience {
	type: 'combat' | 'exploration';
	data: any;
	images: SavedImage[];
	additional: any;
}

export interface CommsData {
	people: Person[];
	messages: Message[];
	party: Party | null;
	shared: SharedExperience | null;
	options: {
		allowControls: boolean
	};
}

export class Comms {
	public static peer: Peer | null = null;
	public static data: CommsData = Comms.getDefaultData();
	public static sentImageIDs: string[] = [];

	public static onNewMessage: ((message: Message) => void) | null;
	public static onPromptForRoll: ((type: string) => void) | null;

	public static getDefaultData() {
		return {
			people: [],
			messages: [],
			party: null,
			shared: null,
			options: {
				allowControls: false
			}
		};
	}

	public static getID() {
		return this.peer ? this.peer.id : '';
	}

	public static getPartyID() {
		return this.data.party ? this.data.party.id : '';
	}

	public static getName(id: string) {
		const person = this.data.people.find(p => p.id === id);
		return person ? person.name : 'unknown person';
	}

	public static getStatus(id: string) {
		const person = this.data.people.find(p => p.id === id);
		return person ? person.status : '';
	}

	public static getCharacterID(id: string) {
		const person = this.data.people.find(p => p.id === id);
		return person ? person.characterID : '';
	}

	public static getCurrentName(id: string) {
		if (this.data.party) {
			const person = this.data.people.find(p => p.id === id);
			if (person && person.characterID) {
				const character = this.data.party.pcs.find(pc => pc.id === person.characterID);
				if (character) {
					return character.name;
				}
			}
		}

		return Comms.getName(id);
	}

	public static getCombatant(id: string) {
		return Comms.getCombatants().find(c => c.id === id) ?? null;
	}

	public static getCombatants() {
		if (Comms.data.shared && (Comms.data.shared.type === 'combat')) {
			const combat = Comms.data.shared.data as Combat;
			return combat.combatants;
		}

		if (Comms.data.shared && (Comms.data.shared.type === 'exploration')) {
			const exploration = Comms.data.shared.data as Exploration;
			return exploration.combatants;
		}

		return [];
	}

	public static getMap() {
		if (Comms.data.shared && (Comms.data.shared.type === 'combat')) {
			const combat = Comms.data.shared.data as Combat;
			return combat.map;
		}

		if (Comms.data.shared && (Comms.data.shared.type === 'exploration')) {
			const exploration = Comms.data.shared.data as Exploration;
			return exploration.map;
		}

		return null;
	}

	public static createTextPacket(to: string[], text: string, language: string, untranslated: string): Packet {
		return {
			type: 'message',
			payload: {
				id: Utils.guid(),
				from: Comms.getID(),
				to: to,
				type: 'text',
				data: {
					text: text,
					language: language,
					untranslated: untranslated
				}
			}
		};
	}

	public static createLinkPacket(to: string[], url: string): Packet {
		return {
			type: 'message',
			payload: {
				id: Utils.guid(),
				from: Comms.getID(),
				to: to,
				type: 'link',
				data: {
					url: url
				}
			}
		};
	}

	public static createImagePacket(to: string[], image: string): Packet {
		return {
			type: 'message',
			payload: {
				id: Utils.guid(),
				from: Comms.getID(),
				to: to,
				type: 'image',
				data: {
					image: image
				}
			}
		};
	}

	public static createRollPacket(to: string[], roll: DieRollResult): Packet {
		return {
			type: 'message',
			payload: {
				id: Utils.guid(),
				from: Comms.getID(),
				to: to,
				type: 'roll',
				data: {
					roll: roll
				}
			}
		};
	}

	public static createMonsterPacket(to: string[], monster: Monster): Packet {
		return {
			type: 'message',
			payload: {
				id: Utils.guid(),
				from: Comms.getID(),
				to: to,
				type: 'monster',
				data: {
					monster: monster
				}
			}
		};
	}

	public static packetToString(packet: Packet) {
		const str = JSON.stringify(packet);
		const s = LZString.compressToUTF16(str);
		return s;
	}

	public static stringToPacket(str: string): Packet {
		const s = LZString.decompressFromUTF16(str) as string;
		return JSON.parse(s) as Packet;
	}

	public static processPacket(packet: Packet) {
		switch (packet.type) {
			case 'update':
				if (packet.payload['people']) {
					this.data.people = packet.payload['people'];
				}
				if (packet.payload['party']) {
					this.data.party = packet.payload['party'];
				}
				if (packet.payload['shared']) {
					this.data.shared = packet.payload['shared'];
				}
				if (packet.payload['options']) {
					this.data.options = packet.payload['options'];
				}
				break;
			case 'player-info':
				const playerID = packet.payload['player'];
				const person = this.data.people.find(p => p.id === playerID);
				if (person) {
					person.status = packet.payload['status'];
					person.characterID = packet.payload['characterID'];
				}
				break;
			case 'character-info':
				if (Comms.data.party) {
					const pc = packet.payload['pc'];
					const original = Comms.data.party.pcs.find(p => p.id === pc.id);
					if (original) {
						const index = Comms.data.party.pcs.indexOf(original);
						if (index !== -1) {
							Comms.data.party.pcs[index] = pc;
						}
					}
				}
				break;
			case 'message':
				const msg: Message = {
					id: packet.payload['id'],
					from: packet.payload['from'],
					to: packet.payload['to'],
					type: packet.payload['type'],
					data: packet.payload['data']
				};
				this.data.messages.push(msg);
				if (msg.from !== Comms.getID()) {
					if ((msg.to.length === 0) || (msg.to.includes(Comms.getID()))) {
						if (this.onNewMessage) {
							this.onNewMessage(msg);
						}
					}
				}
				break;
			case 'ask-for-roll':
				if (this.onPromptForRoll) {
					this.onPromptForRoll(packet.payload['roll']);
				}
				break;
			case 'roll-result':
				if (packet.payload['roll'] === 'initiative') {
					const id = packet.payload['id'];
					const combatants = Comms.getCombatants();
					const initCombatant = combatants.find(c => c.id === id);
					if (initCombatant) {
						initCombatant.initiative = packet.payload['result'];
						initCombatant.pending = false;
						initCombatant.active = true;
					}
				}
				break;
			case 'action':
				const action = packet.payload['action'];
				const combatant = Comms.getCombatant(packet.payload['id']);
				const map = Comms.getMap();
				switch (action) {
					case 'update-combatant':
						if (combatant) {
							const updated = packet.payload['combatant'] as Combatant;
							const all = Comms.getCombatants();
							const index = all.findIndex(c => c.id === updated.id);
							if (index !== -1) {
								all[index] = updated;
								if (Comms.data.shared && (Comms.data.shared.type === 'combat')) {
									Napoleon.sortCombatants(Comms.data.shared.data as Combat);
								}
							}
						}
						break;
					case 'toggle-tag':
						if (combatant) {
							const tag = packet.payload['tag'] as string;
							if (combatant.tags.includes(tag)) {
								combatant.tags = combatant.tags.filter(t => t !== tag);
							} else {
								combatant.tags.push(tag);
							}
						}
						break;
					case 'toggle-condition':
						if (combatant) {
							const condition = packet.payload['condition'] as string;
							if (combatant.conditions.some(cnd => cnd.name === condition)) {
								combatant.conditions = combatant.conditions.filter(c => c.name !== condition);
							} else {
								const cnd = Factory.createCondition();
								cnd.name = condition;
								combatant.conditions.push(cnd);
								combatant.conditions = Utils.sort(combatant.conditions, [{ field: 'name', dir: 'asc' }]);
							}
						}
						break;
					case 'add-condition':
						if (combatant) {
							const condition = packet.payload['condition'] as Condition;
							combatant.conditions.push(condition);
						}
						break;
					case 'edit-condition':
						if (combatant) {
							const condition = packet.payload['condition'] as Condition;
							const index = combatant.conditions.findIndex(c => c.id === condition.id);
							if (index !== -1) {
								combatant.conditions[index] = condition;
							}
						}
						break;
					case 'remove-condition':
						if (combatant) {
							const conditionID = packet.payload['conditionID'] as string;
							const index = combatant.conditions.findIndex(c => c.id === conditionID);
							if (index !== -1) {
								combatant.conditions.splice(index, 1);
							}
						}
						break;
					case 'map-add':
						if (combatant && map) {
							const x = packet.payload['x'] as number;
							const y = packet.payload['y'] as number;
							const list = Napoleon.getMountsAndRiders([combatant.id], Comms.getCombatants());
							list.forEach(c => Mercator.add(map, c, x, y));
						}
						break;
					case 'map-move':
						if (combatant && map) {
							const dir = packet.payload['dir'] as string;
							const ids = Napoleon.getMountsAndRiders([combatant.id], Comms.getCombatants()).map(c => c.id);
							ids.forEach(movingID => Mercator.move(map, movingID, dir));
							Napoleon.setMountPositions(Comms.getCombatants(), map);
						}
						break;
					case 'map-remove':
						if (combatant && map) {
							const ids = Napoleon.getMountsAndRiders([combatant.id], Comms.getCombatants()).map(c => c.id);
							ids.forEach(removingID => Mercator.remove(map, removingID));
						}
						break;
					case 'add-companion':
						const companion = packet.payload['companion'] as Companion;
						const companionCombatant = Napoleon.convertCompanionToCombatant(companion);
						Comms.getCombatants().push(companionCombatant);
						break;
				}
				break;
		}
	}

	public static finish() {
		if (Comms.peer) {
			Comms.peer.destroy();
			Comms.peer = null;
		}

		Comms.data = this.getDefaultData();
	}
}

export class CommsDM {
	private static connections: DataConnection[] = [];
	private static state: 'not started' | 'starting' | 'started' = 'not started';

	public static getState() {
		return this.state;
	}

	public static onStateChanged: (() => void) | null;
	public static onDataChanged: (() => void) | null;
	public static onNewConnection: ((name: string) => void) | null;

	public static init() {
		if (this.state !== 'not started') {
			return;
		}

		this.state = 'starting';
		if (this.onStateChanged) {
			this.onStateChanged();
		}

		const dmCode = 'dm-' + Utils.guid();
		Comms.peer = new Peer(dmCode);

		Comms.peer.on('open', () => {
			setInterval(() => this.sendPulse(), PULSE_INTERVAL * 1000);
			this.state = 'started';
			if (this.onStateChanged) {
				this.onStateChanged();
			}
		});
		Comms.peer.on('close', () => {
			this.shutdown();
		});
		Comms.peer.on('disconnected', () => {
			this.shutdown();
		});
		Comms.peer.on('error', err => {
			console.error(err);
			this.shutdown();
		});
		Comms.peer.on('connection', conn => {
			this.connections.push(conn);
			conn.on('open', () => {
				if (this.onNewConnection) {
					this.onNewConnection(conn.label);
				}
				this.sendPeopleUpdate();
				this.sendPartyUpdate(conn);
				this.sendSharedUpdate(conn);
				this.sendOptionsUpdate(conn);
			});
			conn.on('close', () => {
				// Remove this connection
				const index = this.connections.indexOf(conn);
				if (index !== -1) {
					this.connections.splice(index, 1);
				}
				this.sendPeopleUpdate();
			});
			conn.on('error', err => {
				console.error(err);
				this.kick(conn.peer);
			});
			conn.on('data', data => {
				const packet = Comms.stringToPacket(data);
				this.onDataReceived(packet);
			});
		});

	}

	public static shutdown() {
		this.connections.forEach(conn => conn.close());
		this.connections = [];

		Comms.finish();

		this.state = 'not started';
		if (this.onStateChanged) {
			this.onStateChanged();
		}
	}

	public static kick(id: string) {
		const conn = this.connections
			.filter(c => c.open)
			.find(c => c.peer === id);

		if (conn) {
			conn.close();

			const index = this.connections.indexOf(conn);
			if (index !== -1) {
				this.connections.splice(index, 1);
			}

			this.sendPeopleUpdate();
		}
	}

	public static sendPulse() {
		this.sendPeopleUpdate();
		this.sendPartyUpdate();
		this.sendSharedUpdate();
		this.sendOptionsUpdate();
	}

	public static sendPeopleUpdate() {
		const people = this.connections
			.filter(conn => conn.open)
			.map(conn => ({
				id: conn.peer,
				name: conn.label,
				status: Comms.getStatus(conn.peer),
				characterID: Comms.getCharacterID(conn.peer)
			}));

		Utils.sort(people);

		people.unshift({
			id: Comms.getID(),
			name: 'DM',
			status: '',
			characterID: ''
		});

		const packet: Packet = {
			type: 'update',
			payload: {
				people: people
			}
		};
		Comms.processPacket(packet);
		this.broadcast(packet);
	}

	public static sendPartyUpdate(conn: DataConnection | null = null) {
		const packet: Packet = {
			type: 'update',
			payload: {
				party: Comms.data.party
			}
		};
		this.broadcast(packet, conn);
	}

	public static sendSharedUpdate(conn: DataConnection | null = null) {
		const packet: Packet = {
			type: 'update',
			payload: {
				shared: Comms.data.shared
			}
		};
		this.broadcast(packet, conn);
	}

	public static sendOptionsUpdate(conn: DataConnection | null = null) {
		const packet: Packet = {
			type: 'update',
			payload: {
				options: Comms.data.options
			}
		};
		this.broadcast(packet, conn);
	}

	public static sendMessage(to: string[], text: string, language: string, untranslated: string) {
		this.onDataReceived(Comms.createTextPacket(to, text, language, untranslated));
	}

	public static sendLink(to: string[], url: string) {
		this.onDataReceived(Comms.createLinkPacket(to, url));
	}

	public static sendImage(to: string[], image: string) {
		this.onDataReceived(Comms.createImagePacket(to, image));
	}

	public static sendRoll(to: string[], roll: DieRollResult) {
		this.onDataReceived(Comms.createRollPacket(to, roll));
	}

	public static sendMonster(to: string[], monster: Monster) {
		this.onDataReceived(Comms.createMonsterPacket(to, monster));
	}

	public static setParty(party: Party | null) {
		Comms.data.party = party;
		if (this.onDataChanged) {
			this.onDataChanged();
		}
		this.sendPartyUpdate();
	}

	public static shareNothing() {
		Comms.data.shared = null;
		if (this.onDataChanged) {
			this.onDataChanged();
		}
		this.sendSharedUpdate();
	}

	public static shareCombat(combat: Combat) {
		const images: SavedImage[] = [];
		if (combat.map) {
			combat.map.items
				.filter(mi => (mi.terrain === 'custom') && (mi.customBackground !== ''))
				.forEach(mi => {
					const img = Matisse.getImage(mi.customBackground);
					if (img) {
						if (!Comms.sentImageIDs.includes(img.id)) {
							images.push(img);
						}
					}
				});
		}
		Comms.data.shared = {
			type: 'combat',
			data: combat,
			images: images,
			additional: {}
		};
		if (this.onDataChanged) {
			this.onDataChanged();
		}
		this.sendSharedUpdate();
		images.forEach(img => Comms.sentImageIDs.push(img.id));
	}

	public static shareExploration(exploration: Exploration) {
		const images: SavedImage[] = [];
		exploration.map.items
			.filter(mi => (mi.terrain === 'custom') && (mi.customBackground !== ''))
			.forEach(mi => {
				const img = Matisse.getImage(mi.customBackground);
				if (img) {
					if (!Comms.sentImageIDs.includes(img.id)) {
						images.push(img);
					}
				}
			});
		Comms.data.shared = {
			type: 'exploration',
			data: exploration,
			images: images,
			additional: {}
		};
		if (this.onDataChanged) {
			this.onDataChanged();
		}
		this.sendSharedUpdate();
		images.forEach(img => Comms.sentImageIDs.push(img.id));
	}

	public static askForRoll(type: string) {
		const packet: Packet = {
			type: 'ask-for-roll',
			payload: {
				roll: type
			}
		};
		this.broadcast(packet);
	}

	private static onDataReceived(packet: Packet) {
		Comms.processPacket(packet);
		if (this.onDataChanged) {
			this.onDataChanged();
		}

		// If it's an action, we've incorporated it into the shared content, so send an update
		// Otherwise, broadcast it
		if (packet.type === 'action') {
			this.sendSharedUpdate();
		} else {
			this.broadcast(packet);
		}
	}

	private static broadcast(packet: Packet, connection: DataConnection | null = null) {
		const str = Comms.packetToString(packet);
		if (connection) {
			connection.send(str);
		} else {
			this.connections
				.filter(conn => conn.open)
				.forEach(conn => conn.send(str));
		}
	}
}

export class CommsPlayer {
	private static connection: DataConnection | null = null;
	private static state: 'not connected' | 'connecting' | 'connected' = 'not connected';

	public static getState() {
		return this.state;
	}

	public static onStateChanged: (() => void) | null;
	public static onDataChanged: (() => void) | null;

	public static connect(dmCode: string, name: string) {
		if (this.state !== 'not connected') {
			return;
		}

		this.state = 'connecting';
		if (this.onStateChanged) {
			this.onStateChanged();
		}

		const playerCode = 'player-' + Utils.guid();
		Comms.peer = new Peer(playerCode);

		Comms.peer.on('open', () => {
			if (Comms.peer) {
				// Connect to the DM
				const conn = Comms.peer.connect(dmCode, { label: name, reliable: true });
				this.connection = conn;
				conn.on('open', () => {
					this.state = 'connected';
					if (this.onStateChanged) {
						this.onStateChanged();
					}
				});
				conn.on('close', () => {
					this.disconnect();
				});
				conn.on('error', err => {
					console.error(err);
					this.disconnect();
				});
				conn.on('data', data => {
					const packet = Comms.stringToPacket(data);
					Comms.processPacket(packet);
					if (this.onDataChanged) {
						this.onDataChanged();
					}
				});
			}
		});
		Comms.peer.on('close', () => {
			this.disconnect();
		});
		Comms.peer.on('disconnected', () => {
			this.disconnect();
		});
		Comms.peer.on('error', err => {
			console.error(err);
			this.disconnect();
		});
	}

	public static disconnect() {
		if (this.connection) {
			this.connection.close();
			this.connection = null;
		}

		Comms.finish();

		this.state = 'not connected';
		if (this.onStateChanged) {
			this.onStateChanged();
		}
	}

	public static sendUpdate(status: string, characterID: string) {
		this.sendPacket({
			type: 'player-info',
			payload: {
				player: Comms.getID(),
				status: status,
				characterID: characterID
			}
		});
	}

	public static sendMessage(to: string[], text: string, language: string, untranslated: string) {
		this.sendPacket(Comms.createTextPacket(to, text, language, untranslated));
	}

	public static sendLink(to: string[], url: string) {
		this.sendPacket(Comms.createLinkPacket(to, url));
	}

	public static sendImage(to: string[], image: string) {
		this.sendPacket(Comms.createImagePacket(to, image));
	}

	public static sendRoll(to: string[], roll: DieRollResult) {
		this.sendPacket(Comms.createRollPacket(to, roll));
	}

	public static sendCharacter(pc: PC) {
		this.sendPacket({
			type: 'character-info',
			payload: {
				pc: pc
			}
		});
	}

	public static sendRollResult(type: string, result: number) {
		this.sendPacket({
			type: 'roll-result',
			payload: {
				id: Comms.getCharacterID(Comms.getID()),
				roll: type,
				result: result
			}
		});
	}

	public static sendAction(data: any) {
		this.sendPacket({
			type: 'action',
			payload: data
		});
	}

	private static sendPacket(packet: Packet) {
		if (this.connection) {
			this.connection.send(Comms.packetToString(packet));
		}
	}
}
