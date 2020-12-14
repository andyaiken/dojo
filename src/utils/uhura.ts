// This utility file deals with P2P communication

import LZString from 'lz-string';
import Peer, { DataConnection } from 'peerjs';
import recursivediff from 'recursive-diff';

import { Matisse } from './matisse';
import { Napoleon } from './napoleon';
import { Utils } from './utils';

import { Combat } from '../models/combat';
import { DieRollResult } from '../models/dice';
import { Exploration } from '../models/map';
import { CardDraw, Handout, SavedImage } from '../models/misc';
import { Monster } from '../models/monster';
import { Party, PC } from '../models/party';

// This controls the interval, in seconds, between pulses
const PULSE_INTERVAL = 60;

export interface Packet {
	type: 'update' | 'player-info' | 'character-info' | 'message' | 'prompt' | 'roll-result' | 'player-shared-update';
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
	type: 'text' | 'link' | 'image' | 'roll' | 'card';
	data: any;
}

export interface SharedExperience {
	type: 'nothing' | 'combat' | 'exploration' | 'handout' | 'monster';
	data: any;
	images: SavedImage[];
	additional: any;
}

export interface CommsData {
	people: Person[];
	messages: Message[];
	party: Party | null;
	shared: SharedExperience;
	options: {
		allowChat: boolean,
		allowControls: boolean
	};
}

export class Comms {
	public static peer: Peer | null = null;
	public static data: CommsData = Comms.getDefaultData();
	public static previousSentSharedState: any = null;
	public static previousReceivedSharedState: any = null;

	public static onNewMessage: ((message: Message) => void) | null;
	public static onPrompt: ((type: string, data: any) => void) | null;

	public static getDefaultData() {
		const shared: SharedExperience = {
			type: 'nothing',
			data: null,
			images: [],
			additional: {}
		};

		return {
			people: [],
			messages: [],
			party: null,
			shared: shared,
			options: {
				allowChat: false,
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
		if (Comms.data.shared.type === 'combat') {
			const combat = Comms.data.shared.data as Combat;
			return combat.combatants;
		}

		if (Comms.data.shared.type === 'exploration') {
			const exploration = Comms.data.shared.data as Exploration;
			return exploration.combatants;
		}

		return [];
	}

	public static getMap() {
		if (Comms.data.shared.type === 'combat') {
			const combat = Comms.data.shared.data as Combat;
			return combat.map;
		}

		if (Comms.data.shared.type === 'exploration') {
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

	public static createCardPacket(to: string[], card: CardDraw): Packet {
		return {
			type: 'message',
			payload: {
				id: Utils.guid(),
				from: Comms.getID(),
				to: to,
				type: 'card',
				data: {
					card: card
				}
			}
		};
	}

	public static packetToString(packet: Packet) {
		const str = JSON.stringify(packet);
		return LZString.compressToUTF16(str);
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
					Comms.previousReceivedSharedState = JSON.parse(JSON.stringify(this.data.shared));
				}
				if (packet.payload['sharedDiff']) {
					const diff = packet.payload['sharedDiff'];
					recursivediff.applyDiff(Comms.data.shared, diff);
					Comms.previousReceivedSharedState = JSON.parse(JSON.stringify(this.data.shared));
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
					} else {
						Comms.data.party.pcs.push(pc);
					}
					Utils.sort(Comms.data.party.pcs);
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
			case 'prompt':
				if (this.onPrompt) {
					const prompt = packet.payload['prompt'];
					const data = packet.payload['data'];
					this.onPrompt(prompt, data);
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
					if (Comms.data.shared.type === 'combat') {
						const combat = Comms.data.shared.data as Combat;
						Napoleon.sortCombatants(combat);
					}
				}
				break;
			case 'player-shared-update':
				if (packet.payload['shared']) {
					this.data.shared = packet.payload['shared'];
				}
				if (packet.payload['sharedDiff']) {
					const diff = packet.payload['sharedDiff'];
					recursivediff.applyDiff(Comms.data.shared, diff);
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

	public static init(party: Party) {
		if (this.state !== 'not started') {
			return;
		}

		this.state = 'starting';
		if (this.onStateChanged) {
			this.onStateChanged();
		}

		Comms.data.party = party;

		const dmCode = Utils.guid(true);
		Comms.peer = new Peer(dmCode, { host: 'dojoserver.herokuapp.com', port: 443, secure: true });

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
			if (Comms.peer) {
				Comms.peer.reconnect();
			} else {
				this.shutdown();
			}
		});
		Comms.peer.on('error', err => {
			console.error(err);
			this.shutdown();
		});
		Comms.peer.on('connection', conn => {
			this.connections.push(conn);
			conn.on('open', () => {
				this.sendPeopleUpdate();
				this.sendPartyUpdate(conn);
				this.sendSharedUpdate(conn);
				this.sendOptionsUpdate(conn);
				if (this.onNewConnection) {
					this.onNewConnection(conn.label);
				}
				if (this.onDataChanged) {
					this.onDataChanged();
				}
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

	public static setOption(option: 'allowChat' | 'allowControls', value: any) {
		Comms.data.options[option] = value;
		if (this.onDataChanged) {
			this.onDataChanged();
		}
		const packet: Packet = {
			type: 'update',
			payload: {
				options: Comms.data.options
			}
		};
		this.broadcast(packet);
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

		if (conn === null) {
			// Store the current state
			Comms.previousSentSharedState = JSON.parse(JSON.stringify(Comms.data.shared));
		}
	}

	public static sendSharedDiffUpdate() {
		Utils.debounce(() => {
			const packet: Packet = {
				type: 'update',
				payload: {
					shared: Comms.data.shared
				}
			};

			let send = true;
			if (Comms.previousSentSharedState !== null) {
				const diff = recursivediff.getDiff(Comms.previousSentSharedState, Comms.data.shared);
				send = diff.length > 0;
				packet.payload = {
					sharedDiff: diff
				};
			}

			if (send) {
				this.broadcast(packet);

				// Store the current state
				Comms.previousSentSharedState = JSON.parse(JSON.stringify(Comms.data.shared));
			}
		}, 500)();
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

	public static sendCard(to: string[], card: CardDraw) {
		this.onDataReceived(Comms.createCardPacket(to, card));
	}

	public static shareNothing() {
		Comms.previousSentSharedState = null;
		Comms.previousReceivedSharedState = null;
		Comms.data.shared = {
			type: 'nothing',
			data: null,
			images: [],
			additional: {}
		};
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
						images.push(img);
					}
				});
		}
		Comms.previousSentSharedState = null;
		Comms.previousReceivedSharedState = null;
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
		Comms.previousSentSharedState = null;
		Comms.previousReceivedSharedState = null;
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
	}

	public static shareHandout(handout: Handout) {
		Comms.previousSentSharedState = null;
		Comms.previousReceivedSharedState = null;
		Comms.data.shared = {
			type: 'handout',
			data: handout,
			images: [],
			additional: {}
		};
		if (this.onDataChanged) {
			this.onDataChanged();
		}
		this.sendSharedUpdate();
	}

	public static shareMonster(monster: Monster) {
		Comms.previousSentSharedState = null;
		Comms.previousReceivedSharedState = null;
		Comms.data.shared = {
			type: 'monster',
			data: monster,
			images: [],
			additional: {}
		};
		if (this.onDataChanged) {
			this.onDataChanged();
		}
		this.sendSharedUpdate();
	}

	public static prompt(type: string, data: any) {
		const packet: Packet = {
			type: 'prompt',
			payload: {
				prompt: type,
				data: data
			}
		};
		this.broadcast(packet);
	}

	private static onDataReceived(packet: Packet) {
		Comms.processPacket(packet);
		if (this.onDataChanged) {
			this.onDataChanged();
		}

		// If it's a player shared content update, we've incorporated it into our shared content, so just send an update
		// Otherwise, broadcast it
		if (packet.type === 'player-shared-update') {
		this.sendSharedDiffUpdate();
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
		Comms.peer = new Peer(playerCode, { host: 'dojoserver.herokuapp.com', port: 443, secure: true });

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
					try {
						const packet = Comms.stringToPacket(data);
						Comms.processPacket(packet);
						if (this.onDataChanged) {
							this.onDataChanged();
						}
					} catch (ex) {
						console.error(ex);
					}
				});
			}
		});
		Comms.peer.on('close', () => {
			this.disconnect();
		});
		Comms.peer.on('disconnected', () => {
			if (Comms.peer) {
				Comms.peer.reconnect();
			} else {
				this.disconnect();
			}
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

	public static sendCard(to: string[], card: CardDraw) {
		this.sendPacket(Comms.createCardPacket(to, card));
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

	public static sendSharedUpdate() {
		Utils.debounce(() => {
			const packet: Packet = {
				type: 'update',
				payload: {
					shared: Comms.data.shared
				}
			};

			let send = true;
			if (Comms.previousReceivedSharedState !== null) {
				const diff = recursivediff.getDiff(Comms.previousReceivedSharedState, Comms.data.shared);
				send = diff.length > 0;
				packet.payload = {
					sharedDiff: diff
				};
			}

			if (send) {
				this.sendPacket(packet);

				// Store the current state
				Comms.previousReceivedSharedState = JSON.parse(JSON.stringify(Comms.data.shared));
			}
		}, 500)();
	}

	private static sendPacket(packet: Packet) {
		if (this.connection) {
			this.connection.send(Comms.packetToString(packet));
		}
	}
}
