import Peer, { DataConnection } from 'peerjs';

import Utils from './utils';

export interface Packet {
	type: 'pulse' | 'player-info' | 'message';
	payload: any;
}

export interface Person {
	id: string;
	name: string;
	status: string;
}

export interface Message {
	id: string;
	from: string;
	to: string[];
	text: string;
}

export interface CommsData {
	people: Person[];
	messages: Message[];
}

export class Comms {
	public static peer: Peer | null = null;
	public static data: CommsData = {
		people: [],
		messages: []
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

	public static getName(id: string) {
		const person = this.data.people.find(p => p.id === id);
		return person ? person.name : 'unknown person';
	}

	public static getStatus(id: string) {
		const person = this.data.people.find(p => p.id === id);
		return person ? person.status : '';
	}

	public static processPacket(packet: Packet) {
		switch (packet.type) {
			case 'pulse':
				this.data.people = packet.payload['people'];
				break;
			case 'player-info':
				const id = packet.payload['player'];
				const person = this.data.people.find(p => p.id === id);
				if (person) {
					person.status = packet.payload['status'];
				}
				break;
			case 'message':
				const msg: Message = {
					id: packet.payload['id'],
					from: packet.payload['from'],
					to: packet.payload['to'],
					text: packet.payload['text']
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
						// Notify everyone
						this.sendPulse();
					});
					conn.on('close', () => {
						console.info('connection closed: ' + conn.label);
						// Remove this connection
						const index = this.connections.indexOf(conn);
						this.connections.splice(index, 1);
						this.onDataChanged();
					});
					conn.on('error', err => {
						console.error(err);
						// Remove this connection
						const index = this.connections.indexOf(conn);
						this.connections.splice(index, 1);
						this.onDataChanged();
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

	public static sendPulse() {
		const people = this.connections
			.filter(conn => conn.open)
			.map(conn => ({
				id: conn.peer,
				name: conn.label,
				status: Comms.getStatus(conn.peer)
			}));

		Utils.sort(people);

		people.unshift({
			id: Comms.getID(),
			name: 'DM',
			status: ''
		});

		this.onDataReceived({
			type: 'pulse',
			payload: {
				people: people
			}
		});
	}

	public static sendMessage(to: string[], text: string) {
		this.onDataReceived({
			type: 'message',
			payload: {
				id: Utils.guid(),
				from: Comms.getID(),
				to: to,
				text: text
			}
		});
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

	public static sendUpdate(status: string) {
		this.sendPacket({
			type: 'player-info',
			payload: {
				player: Comms.getID(),
				status: status
			}
		});
	}

	public static sendMessage(to: string[], text: string) {
		this.sendPacket({
			type: 'message',
			payload: {
				id: Utils.guid(),
				from: Comms.getID(),
				to: to,
				text: text
			}
		});
	}

	private static sendPacket(packet: Packet) {
		if (this.connection) {
			this.connection.send(packet);
		}
	}
}
