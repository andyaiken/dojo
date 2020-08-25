import Peer, { DataConnection } from 'peerjs';

import Utils from './utils';

import { DieRollResult } from '../models/dice';
import { Monster } from '../models/monster';
import { Party, PC } from '../models/party';

export interface Packet {
	type: 'pulse' | 'player-info' | 'character-info' | 'message';
	payload: any;
}

export interface Person {
	id: string;
	name: string;
	status: string;
	pc: string;
}

export interface Message {
	id: string;
	from: string;
	to: string[];
	type: 'text' | 'link' | 'image' | 'roll' | 'monster';
	data: any;
}

export interface CommsData {
	people: Person[];
	messages: Message[];
	party: Party | null;
}

export class Comms {
	private static server: any;

	public static peer: Peer | null = null;
	public static data: CommsData = {
		people: [],
		messages: [],
		party: null
	};

	public static init() {
		if (this.peer) {
			return;
		}

		this.peer = new Peer(Utils.guid());
		this.peer.on('open', id => console.info('peer ' + id + ' open'));
		this.peer.on('close', () => console.info('peer closed'));
		this.peer.on('disconnected', () => console.info('peer disconnected'));
		this.peer.on('error', err => console.error(err));
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

	public static getPC(id: string) {
		const person = this.data.people.find(p => p.id === id);
		return person ? person.pc : '';
	}

	public static getCurrentName(id: string) {
		if (this.data.party) {
			const person = this.data.people.find(p => p.id === id);
			if (person && person.pc) {
				const character = this.data.party.pcs.find(pc => pc.id === person.pc);
				if (character) {
					return character.name;
				}
			}
		}

		return Comms.getName(id);
	}

	public static createTextPacket(to: string[], text: string): Packet {
		return {
			type: 'message',
			payload: {
				id: Utils.guid(),
				from: Comms.getID(),
				to: to,
				type: 'text',
				data: {
					text: text
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
				this.data.party = packet.payload['party'];
				break;
			case 'player-info':
				const id = packet.payload['player'];
				const person = this.data.people.find(p => p.id === id);
				if (person) {
					person.status = packet.payload['status'];
					person.pc = packet.payload['pc'];
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
}

export class CommsDM {
	private static initialised: boolean = false;
	private static connections: DataConnection[] = [];

	public static onDataChanged: () => void;

	public static init() {
		if (!this.initialised) {
			if (Comms.peer) {
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
						// Remove this connection
						const index = this.connections.indexOf(conn);
						if (index !== -1) {
							this.connections.splice(index, 1);
						}
						this.sendPulse();
					});
					conn.on('data', packet => {
						this.onDataReceived(packet);
					});
				});

				setInterval(() => {
					this.sendPulse();
				}, 30 * 1000);

				this.initialised = true;
			}
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
				pc: Comms.getPC(conn.peer)
			}));

		Utils.sort(people);

		people.unshift({
			id: Comms.getID(),
			name: 'DM',
			status: '',
			pc: ''
		});

		this.onDataReceived({
			type: 'pulse',
			payload: {
				people: people,
				party: Comms.data.party
			}
		});
	}

	public static sendMessage(to: string[], text: string) {
		this.onDataReceived(Comms.createTextPacket(to, text));
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
		this.sendPulse();
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

	public static connect(id: string, name: string) {
		if (Comms.peer) {
			this.state = 'connecting';
			this.onStateChanged();
			const conn = Comms.peer.connect(id, { label: name, reliable: true });
			this.connection = conn;
			conn.on('open', () => {
				console.info('connection opened');
				this.state = 'connected';
				this.onStateChanged();
			});
			conn.on('close', () => {
				console.info('connection closed');
				this.state = 'not connected';
				this.connection = null;
				this.onStateChanged();
			});
			conn.on('error', err => {
				console.error(err);
				this.state = 'not connected';
				this.connection = null;
				this.onStateChanged();
			});
			conn.on('data', packet => {
				Comms.processPacket(packet);
				this.onDataChanged();
			});
		}
	}

	public static sendUpdate(status: string, pc: string) {
		this.sendPacket({
			type: 'player-info',
			payload: {
				player: Comms.getID(),
				status: status,
				pc: pc
			}
		});
	}

	public static sendMessage(to: string[], text: string) {
		this.sendPacket(Comms.createTextPacket(to, text));
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
