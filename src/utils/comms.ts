import Peer, { DataConnection } from 'peerjs';

import Factory from './factory';
import Matisse from './matisse';
import Mercator from './mercator';
import Napoleon from './napoleon';
import Utils from './utils';

import { Combat } from '../models/combat';
import { Condition } from '../models/condition';
import { DieRollResult } from '../models/dice';
import { Exploration } from '../models/map';
import { SavedImage } from '../models/misc';
import { Monster } from '../models/monster';
import { Companion, Party, PC } from '../models/party';

// This controls the interval, in seconds, between pulses
const PULSE_INTERVAL = 60;

export interface Packet {
	type: 'update' | 'player-info' | 'character-info' | 'message' | 'action';
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
}

export class Comms {
	public static peer: Peer | null = null;
	public static data: CommsData = {
		people: [],
		messages: [],
		party: null,
		shared: null
	};
	public static sentImageIDs: string[] = [];

	public static onNewMessage: (message: Message) => void;

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

	public static processPacket(packet: Packet) {
		switch (packet.type) {
			case 'update':
				this.data.people = packet.payload['people'];
				this.data.party = packet.payload['party'];
				this.data.shared = packet.payload['shared'];
				break;
			case 'player-info':
				const id = packet.payload['player'];
				const person = this.data.people.find(p => p.id === id);
				if (person) {
					person.status = packet.payload['status'];
					person.characterID = packet.payload['characterID'];
				}
				break;
			case 'character-info':
				const pc = packet.payload['pc'];
				if (Comms.data.party) {
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
						this.onNewMessage(msg);
					}
				}
				break;
			case 'action':
				const action = packet.payload['action'];
				const combatant = Comms.getCombatant(packet.payload['id']);
				const map = Comms.getMap();
				switch (action) {
					case 'change-value':
						if (combatant) {
							const field = packet.payload['field'] as string;
							const value = packet.payload['value'];
							(combatant as any)[field] = value;
							if ((field === 'initiative') && Comms.data.shared && (Comms.data.shared.type === 'combat')) {
								Napoleon.sortCombatants(Comms.data.shared.data as Combat);
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
								combatant.conditions.filter(c => c.name !== condition);
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

		Comms.data = {
			people: [],
			messages: [],
			party: null,
			shared: null
		};
	}
}

export class CommsDM {
	private static connections: DataConnection[] = [];
	private static state: 'not started' | 'starting' | 'started' = 'not started';

	public static getState() {
		return this.state;
	}

	public static onStateChanged: () => void;
	public static onDataChanged: () => void;
	public static onNewConnection: (name: string) => void;

	public static init() {
		if (this.state !== 'not started') {
			return;
		}

		this.state = 'starting';
		this.onStateChanged();

		const dmCode = 'dm-' + Utils.guid();
		Comms.peer = new Peer(dmCode);

		Comms.peer.on('open', id => {
			console.info('peer ' + id + ' open');

			setInterval(() => {
				this.sendUpdate();
			}, PULSE_INTERVAL * 1000);

			this.state = 'started';
			this.onStateChanged();
		});
		Comms.peer.on('close', () => {
			console.info('peer closed');
			this.shutdown();
		});
		Comms.peer.on('disconnected', () => {
			console.info('peer disconnected');
			this.shutdown();
		});
		Comms.peer.on('error', err => {
			console.error(err);
			this.shutdown();
		});
		Comms.peer.on('connection', conn => {
			this.connections.push(conn);
			conn.on('open', () => {
				console.info('connection opened: ' + conn.label);
				this.onNewConnection(conn.label);
				this.sendUpdate();
			});
			conn.on('close', () => {
				console.info('connection closed: ' + conn.label);
				// Remove this connection
				const index = this.connections.indexOf(conn);
				if (index !== -1) {
					this.connections.splice(index, 1);
				}
				this.sendUpdate();
			});
			conn.on('error', err => {
				console.error(err);
				this.kick(conn.peer);
			});
			conn.on('data', packet => {
				this.onDataReceived(packet);
			});
		});

	}

	public static shutdown() {
		this.connections.forEach(conn => conn.close());
		this.connections = [];

		Comms.finish();

		this.state = 'not started';
		this.onStateChanged();
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

			this.sendUpdate();
		}
	}

	public static sendUpdate(additional: any = null) {
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

		if (Comms.data.shared) {
			Comms.data.shared.additional = additional ?? Comms.data.shared.additional;
		}

		const packet: Packet = {
			type: 'update',
			payload: {
				people: people,
				party: Comms.data.party,
				shared: Comms.data.shared
			}
		};
		Comms.processPacket(packet);
		this.broadcast(packet);
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
		this.onDataChanged();
		this.sendUpdate();
	}

	public static shareNothing() {
		Comms.data.shared = null;
		this.onDataChanged();
		this.sendUpdate();
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
		this.onDataChanged();
		this.sendUpdate();
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
		this.onDataChanged();
		this.sendUpdate();
		images.forEach(img => Comms.sentImageIDs.push(img.id));
	}

	private static onDataReceived(packet: Packet) {
		Comms.processPacket(packet);
		this.onDataChanged();

		// If it's an action, we've incorporated it, so send an update
		// Otherwise, broadcast it
		if (packet.type === 'action') {
			this.sendUpdate();
		} else {
			this.broadcast(packet);
		}
	}

	private static broadcast(packet: Packet) {
		this.connections
			.filter(conn => conn.open)
			.forEach(conn => conn.send(packet));
	}
}

export class CommsPlayer {
	private static connection: DataConnection | null = null;
	private static state: 'not connected' | 'connecting' | 'connected' = 'not connected';

	public static getState() {
		return this.state;
	}

	public static onStateChanged: () => void;
	public static onDataChanged: () => void;

	public static connect(dmCode: string, name: string) {
		if (this.state !== 'not connected') {
			return;
		}

		this.state = 'connecting';
		this.onStateChanged();

		const playerCode = 'player-' + Utils.guid();
		Comms.peer = new Peer(playerCode);

		Comms.peer.on('open', id => {
			console.info('peer ' + id + ' open');

			if (Comms.peer) {
				// Connect to the DM
				const conn = Comms.peer.connect(dmCode, { label: name, reliable: true });
				this.connection = conn;
				conn.on('open', () => {
					console.info('connection opened');
					this.state = 'connected';
					this.onStateChanged();
				});
				conn.on('close', () => {
					console.info('connection closed');
					this.disconnect();
				});
				conn.on('error', err => {
					console.error(err);
					this.disconnect();
				});
				conn.on('data', packet => {
					Comms.processPacket(packet);
					this.onDataChanged();
				});
			}
		});
		Comms.peer.on('close', () => {
			console.info('peer closed');
			this.disconnect();
		});
		Comms.peer.on('disconnected', () => {
			console.info('peer disconnected');
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
		this.onStateChanged();
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

	public static sendAction(data: any) {
		this.sendPacket({
			type: 'action',
			payload: data
		});
	}

	private static sendPacket(packet: Packet) {
		if (this.connection) {
			this.connection.send(packet);
		}
	}
}
