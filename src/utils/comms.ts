import Peer, { DataConnection } from 'peerjs';

import Utils from './utils';

import { Combat } from '../models/combat';
import { DieRollResult } from '../models/dice';
import { Exploration } from '../models/map';
import { SavedImage } from '../models/misc';
import { Monster } from '../models/monster';
import { Party, PC } from '../models/party';
import Matisse from './matisse';

// This controls the interval, in seconds, between pulses
const PULSE_INTERVAL = 60;

export interface Packet {
	type: 'pulse' | 'party-update' | 'share-update' | 'player-info' | 'character-info' | 'message';
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
			case 'pulse':
				this.data.people = packet.payload['people'];
				break;
			case 'party-update':
				this.data.party = packet.payload['party'];
				break;
			case 'share-update':
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
				this.sendPulse();
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
				this.sendPulse();
			});
			conn.on('close', () => {
				console.info('connection closed: ' + conn.label);
				// Remove this connection
				const index = this.connections.indexOf(conn);
				if (index !== -1) {
					this.connections.splice(index, 1);
				}
				this.sendPulse();
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

			this.sendPulse();
		}
	}

	public static sendPulse() {
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

		this.onDataReceived({
			type: 'pulse',
			payload: {
				people: people
			}
		});
	}

	public static sendPartyUpdate() {
		this.broadcast({
			type: 'party-update',
			payload: {
				party: Comms.data.party
			}
		});
	}

	public static sendShareUpdate(additional: any = {}) {
		if (Comms.data.shared) {
			Comms.data.shared.additional = additional;
		}

		this.broadcast({
			type: 'share-update',
			payload: {
				shared: Comms.data.shared
			}
		});
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
		this.sendPartyUpdate();
	}

	public static shareNothing() {
		Comms.data.shared = null;
		this.onDataChanged();
		this.sendShareUpdate();
	}

	public static shareCombat(combat: Combat) {
		const images: SavedImage[] = [];
		if (combat.map) {
			combat.map.items
				.filter(mi => (mi.terrain === 'custom') && (mi.customBackground !== ''))
				.forEach(mi => {
					const img = Matisse.getImage(mi.customBackground);
					if (img) {
						images.push(img);
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
		this.sendShareUpdate();
	}

	public static shareExploration(exploration: Exploration) {
		const images: SavedImage[] = [];
		exploration.map.items
			.filter(mi => (mi.terrain === 'custom') && (mi.customBackground !== ''))
			.forEach(mi => {
				const img = Matisse.getImage(mi.customBackground);
				if (img) {
					images.push(img);
				}
			});
		Comms.data.shared = {
			type: 'exploration',
			data: exploration,
			images: images,
			additional: {}
		};
		this.onDataChanged();
		this.sendShareUpdate();
	}

	private static onDataReceived(packet: Packet) {
		Comms.processPacket(packet);
		this.onDataChanged();
		this.broadcast(packet);
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

	private static sendPacket(packet: Packet) {
		if (this.connection) {
			this.connection.send(packet);
		}
	}
}
