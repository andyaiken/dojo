import { CloseCircleOutlined, ExpandOutlined, FileOutlined, LockOutlined, SendOutlined, UnlockOutlined } from '@ant-design/icons';
import { Col, Row, Upload } from 'antd';
import React from 'react';
import ReactMarkdown from 'react-markdown';

import { Gygax } from '../../utils/gygax';
import { Shakespeare } from '../../utils/shakespeare';
import { Svengali } from '../../utils/svengali';
import { Comms, CommsPlayer, Message, Person } from '../../utils/uhura';
import { Utils } from '../../utils/utils';

import { DieRollResult } from '../../models/dice';
import { CardDraw, PlayingCard } from '../../models/misc';

import { RenderError } from '../error';
import { Checkbox } from '../controls/checkbox';
import { ConfirmButton } from '../controls/confirm-button';
import { Dropdown } from '../controls/dropdown';
import { Note } from '../controls/note';
import { Selector } from '../controls/selector';
import { Textbox } from '../controls/textbox';
import { DieRollPanel, DieRollResultPanel } from './die-roll-panel';
import { PlayingCardPanel } from './playing-card-panel';
import { PortraitPanel } from './portrait-panel';

//#region ConnectionsPanel

interface ConnectionsPanelProps {
	user: 'dm' | 'player';
	people: Person[];
	kick: (id: string) => void;
}

export class ConnectionsPanel extends React.Component<ConnectionsPanelProps> {
	public render() {
		try {
			// There should always be a DM at least
			if (this.props.people.length < 2) {
				return (
					<Note key='empty'>
						<p>no-one else is currently connected</p>
					</Note>
				);
			}

			const people = this.props.people.map(person => {
				let icon = null;
				if ((this.props.user === 'dm') && (person.id !== Comms.getID())) {
					icon = (
						<CloseCircleOutlined
							title='kick'
							onClick={() => this.props.kick(person.id)}
						/>
					);
				}

				return (
					<div key={person.id} className='group-panel'>
						<div className='person'>
							<div className='person-details'>
								<CharacterPanel person={person} />
								<div className='status'>{person.status}</div>
							</div>
							<div className='person-icon'>
								{icon}
							</div>
						</div>
					</div>
				);
			});

			return (
				<div className='connections-panel'>
					{people}
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='ConnectionsPanel' error={e} />;
		}
	}
}

//#endregion

//#region PlayerStatusPanel

interface PlayerStatusPanelProps {
}

interface PlayerStatusPanelState {
	status: string;
}

export class PlayerStatusPanel extends React.Component<PlayerStatusPanelProps, PlayerStatusPanelState> {
	constructor(props: PlayerStatusPanelProps) {
		super(props);

		const id = Comms.getID();
		const person = Comms.data.people.find(p => p.id === id);

		this.state = {
			status: person ? person.status : ''
		};
	}

	private setStatus(status: string) {
		this.setState({
			status: status
		});
	}

	private sendPlayerUpdate() {
		const id = Comms.getID();
		const person = Comms.data.people.find(p => p.id === id);
		if (person) {
			CommsPlayer.sendUpdate(this.state.status, person.characterID);
		}
	}

	public render() {
		return (
			<div className='player-status-panel'>
				<div className='content-then-icons'>
					<div className='content'>
						<Textbox
							placeholder='update your status'
							debounce={false}
							text={this.state.status}
							onChange={status => this.setStatus(status)}
							onPressEnter={() => this.sendPlayerUpdate()}
						/>
					</div>
					<div className='icons'>
						<SendOutlined
							onClick={() => this.sendPlayerUpdate()}
							title='update status'
						/>
					</div>
				</div>
				<ConfirmButton onConfirm={() => CommsPlayer.disconnect()}>disconnect</ConfirmButton>
			</div>
		);
	}
}

//#endregion

//#region MessagesPanel

interface MessagesPanelProps {
	user: 'dm' | 'player';
	messages: Message[];
	openImage: (data: string) => void;
}

export class MessagesPanel extends React.Component<MessagesPanelProps> {
	private bottom = React.createRef<HTMLDivElement>();

	public componentDidMount() {
		this.scrollToBottom();
	}

	public componentDidUpdate() {
		this.scrollToBottom();
	}

	private scrollToBottom = () => {
		if (this.bottom && this.bottom.current) {
			this.bottom.current.scrollIntoView({ behavior: 'smooth' });
		}
	}

	private showMessage(message: Message) {
		// Show messages from me, or to all (to is empty), or to me (to contains me)
		const me = Comms.getID();
		return (message.from === me) || (message.to.length === 0) || (message.to.includes(me));
	}

	public render() {
		try {
			const messages = this.props.messages
				.filter(message => this.showMessage(message))
				.map(message => (
					<MessagePanel
						key={message.id}
						user={this.props.user}
						message={message}
						openImage={data => this.props.openImage(data)}
					/>
				));

			if (messages.length === 0) {
				messages.push(
					<Note key='empty'>
						<p>no messages yet</p>
					</Note>
				);
			}

			return (
				<div className='messages-panel'>
					{messages}
					<div ref={this.bottom} />
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='MessagesPanel' error={e} />;
		}
	}
}

//#endregion

//#region MessagePanel

interface MessagePanelProps {
	user: 'dm' | 'player';
	message: Message;
	openImage: (data: string) => void;
}

export class MessagePanel extends React.Component<MessagePanelProps> {
	public render() {
		try {
			let byline = Comms.getCurrentName(this.props.message.from);
			let mainStyle = 'message';
			let bylineStyle = 'message-byline';
			const contentStyle = 'message-content';
			let icon = null;

			if (this.props.message.from === Comms.getID()) {
				mainStyle += ' from-me';
			} else {
				mainStyle += ' to-me';
			}

			let content: JSX.Element | null = null;
			switch (this.props.message.type) {
				case 'text':
					const text = this.props.message.data['text'];
					const language = this.props.message.data['language'];
					const untranslated = this.props.message.data['untranslated'];
					if ((this.props.user === 'player') && (language !== '')) {
						// Only show the text if we know the language
						let known = false;
						if (Comms.data.party) {
							const characterID = Comms.getCharacterID(Comms.getID());
							const pc = Comms.data.party.pcs.find(p => p.id === characterID);
							if (pc) {
								known = pc.languages.toLowerCase().indexOf(language.toLowerCase()) !== -1;
							}
						}
						if (!known) {
							content = (
								<div className='text'>
									<div className='text untranslated'>{untranslated}</div>
									<div className='language'>in an unknown language</div>
								</div>
							);
						}
					}
					if (!content) {
						if (text.startsWith('/')) {
							content = (
								<div className='emote'>
									{Comms.getName(this.props.message.from) + ' ' + text.substr(1)}
								</div>
							);
						} else {
							content = (
								<div className='text'>
									<ReactMarkdown source={text} />
									{language !== '' ? <div className='language'>in {language}</div> : null}
								</div>
							);
						}
					}
					break;
				case 'link':
					const url = this.props.message.data['url'];
					content = (
						<a className='link' href={url} target='_blank' rel='noopener noreferrer'>
							{url}
						</a>
					);
					break;
				case 'image':
					const image = this.props.message.data['image'];
					content = (
						<img className='selectable-image' src={image} alt='shared' onClick={() => this.props.openImage(image)} />
					);
					break;
				case 'roll':
					const roll = this.props.message.data['roll'] as DieRollResult;
					content = (
						<DieRollResultPanel result={roll} />
					);
					break;
				case 'card':
					const card = this.props.message.data['card'] as CardDraw;
					content = (
						<Row justify='space-around'>
							<Col span={10}>
								<PlayingCardPanel card={card.card} reversed={card.reversed} />
							</Col>
						</Row>
					);
					break;
			}

			if (this.props.message.to.length !== 0) {
				byline += ' to ' + this.props.message.to.map(rec => Comms.getCurrentName(rec)).join(', ');
				bylineStyle += ' private';
				icon = <LockOutlined title='private message' />;
			}

			return (
				<div className={mainStyle}>
					<div className={bylineStyle}>
						{byline}
						{icon}
					</div>
					<div className={contentStyle}>
						{content}
					</div>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='MessagePanel' error={e} />;
		}
	}
}

//#endregion

//#region SendMessagePanel

interface SendMessagePanelProps {
	user: 'dm' | 'player';
	sendMessage: (to: string[], text: string, language: string, untranslated: string) => void;
	sendLink: (to: string[], url: string) => void;
	sendImage: (to: string[], image: string) => void;
	sendRoll: (to: string[], roll: DieRollResult) => void;
	sendCard: (to: string[], card: CardDraw) => void;
}

interface SendMessagePanelState {
	type: string;
	message: string;
	language: string;
	multiline: boolean;
	url: string;
	image: string;
	dice: { [sides: number]: number };
	constant: number;
	deck: string;
	mode: string;
	recipients: string[];
}

export class SendMessagePanel extends React.Component<SendMessagePanelProps, SendMessagePanelState> {
	constructor(props: SendMessagePanelProps) {
		super(props);

		const dice: { [sides: number]: number } = {};
		[4, 6, 8, 10, 12, 20, 100].forEach(n => dice[n] = 0);
		dice[20] = 1;

		this.state = {
			type: 'text',
			message: '',
			language: '',
			multiline: false,
			url: '',
			image: '',
			dice: dice,
			constant: 0,
			deck: 'tarot deck',
			mode: 'public',
			recipients: []
		};
	}

	private setType(type: string) {
		this.setState({
			type: type
		});
	}

	private setMessage(message: string) {
		this.setState({
			message: message
		});
	}

	private setLanguage(language: string) {
		this.setState({
			language: language
		});
	}

	private toggleMultiline() {
		this.setState({
			multiline: !this.state.multiline
		});
	}

	private setURL(url: string) {
		this.setState({
			url: url
		});
	}

	private setImage(image: string) {
		this.setState({
			image: image
		});
	}

	private readFile(file: File) {
		const reader = new FileReader();
		reader.onload = progress => {
			if (progress.target) {
				const image = progress.target.result as string;
				this.setImage(image);
			}
		};
		reader.readAsDataURL(file);
		return false;
	}

	private setDie(sides: number, count: number) {
		const dice = this.state.dice;
		dice[sides] = count;
		this.setState({
			dice: dice
		});
	}

	private setConstant(value: number) {
		this.setState({
			constant: value
		});
	}

	private setDeck(deck: string) {
		this.setState({
			deck: deck
		});
	}

	private resetDice() {
		const dice = this.state.dice;
		[4, 6, 8, 10, 12, 20, 100].forEach(n => dice[n] = 0);
		this.setState({
			dice: dice,
			constant: 0
		});
	}

	private setMode(mode: string) {
		this.setState({
			mode: mode,
			recipients: mode === 'public' ? [] : this.state.recipients
		});
	}

	private addRecipient(id: string) {
		const rec = this.state.recipients;
		rec.push(id);

		this.setState({
			recipients: rec
		});
	}

	private removeRecipient(id: string) {
		const rec = this.state.recipients;
		const index = rec.indexOf(id);
		rec.splice(index, 1);

		this.setState({
			recipients: rec
		});
	}

	private canSend() {
		let validRecipients = false;
		switch (this.state.mode) {
			case 'public':
				validRecipients = true;
				break;
			case 'private':
				validRecipients = (this.state.recipients.length > 0);
				break;
		}

		let validContent = false;
		switch (this.state.type) {
			case 'text':
				validContent = (this.state.message !== '');
				break;
			case 'link':
				validContent = (this.state.url !== '');
				break;
			case 'image':
				validContent = (this.state.image !== '');
				break;
			case 'roll':
				validContent = true;
				break;
			case 'card':
				validContent = true;
				break;
		}

		return validRecipients && validContent;
	}

	private async sendMessage() {
		if (this.canSend()) {
			const rec = [...this.state.recipients];
			const text = this.state.message.split('\n').join('\n\n');
			const language = this.state.language;
			const untranslated = (language === '') ? '' : Shakespeare.generateTranslation(text);
			this.setState({
				message: ''
			}, () => {
				this.props.sendMessage(rec, text, language, untranslated);
			});
		}
	}

	private sendLink() {
		if (this.canSend()) {
			const rec = [...this.state.recipients];
			const url = this.state.url;
			this.setState({
				url: ''
			}, () => {
				this.props.sendLink(rec, url);
			});
		}
	}

	private sendImage() {
		if (this.canSend()) {
			const rec = [...this.state.recipients];
			const image = this.state.image;
			this.setState({
				image: ''
			}, () => {
				this.props.sendImage(rec, image);
			});
		}
	}

	private sendRoll(mode: '' | 'advantage' | 'disadvantage') {
		if (this.canSend()) {
			const rec = [...this.state.recipients];
			const result = Gygax.rollDice(this.state.dice, this.state.constant, mode);
			this.props.sendRoll(rec, result);
		}
	}

	private sendCard() {
		if (this.canSend()) {
			const rec = [...this.state.recipients];

			let deck: PlayingCard[] = [];
			switch (this.state.deck) {
				case 'tarot deck':
					deck = Svengali.getTarotDeck();
					break;
				case 'tarot deck (major arcana)':
					deck = Svengali.getTarotMajorArcana();
					break;
				case 'tarot deck (minor arcana)':
					deck = Svengali.getTarotMinorArcana();
					break;
				case 'standard deck':
					deck = Svengali.getStandardDeck();
					break;
				case 'standard deck (with jokers)':
					deck = Svengali.getStandardDeckWithJokers();
					break;
				case 'deck of many things':
					deck = Svengali.getDeckOfManyThings();
					break;
				case 'deck of many things (13 cards)':
					deck = Svengali.getDeckOfManyThingsSmall();
					break;
			}

			const card = deck[Utils.randomNumber(deck.length)];
			const draw: CardDraw = {
				id: Utils.guid(),
				card: card,
				reversed: Utils.randomBoolean()
			};
			this.props.sendCard(rec, draw);
		}
	}

	private getMessageSection() {
		switch (this.state.type) {
			case 'text':
				let languageSection = null;
				if (Comms.data.party) {
					let languages: string[] = [];
					if (this.props.user === 'dm') {
						// Show all languages
						languages = Shakespeare.getKnownLanguages(Comms.data.party.pcs);
						languages.push('(some other language)');
					} else {
						// Only show your languages
						const characterID = Comms.getCharacterID(Comms.getID());
						const character = Comms.data.party.pcs.find(pc => pc.id === characterID);
						if (character) {
							languages = Shakespeare.getKnownLanguages([character]);
						}
					}
					languageSection = (
						<Dropdown
							placeholder='(no language specified)'
							options={languages.map(lang => ({ id: lang, text: lang }))}
							selectedID={this.state.language}
							onSelect={lang => this.setLanguage(lang)}
							onClear={() => this.setLanguage('')}
						/>
					);
				}
				return (
					<div>
						<div className='control-with-icons'>
							<Textbox
								placeholder='send a message'
								multiLine={this.state.multiline}
								debounce={false}
								text={this.state.message}
								onChange={msg => this.setMessage(msg)}
								onPressEnter={() => this.sendMessage()}
							/>
							<div className='icons'>
								<ExpandOutlined
									onClick={() => this.toggleMultiline()}
									title={'expand'}
									className={this.state.multiline ? 'active' : ''}
								/>
								<SendOutlined
									onClick={() => this.sendMessage()}
									title='send message'
									className={this.canSend() ? '' : 'disabled'}
								/>
							</div>
						</div>
						{languageSection}
					</div>
				);
			case 'link':
				return (
					<div className='control-with-icons'>
						<Textbox
							placeholder='send a link'
							debounce={false}
							text={this.state.url}
							onChange={url => this.setURL(url)}
							onPressEnter={() => this.sendLink()}
						/>
						<div className='icons'>
							<SendOutlined
								onClick={() => this.sendLink()}
								title='send link'
								className={this.canSend() ? '' : 'disabled'}
							/>
						</div>
					</div>
				);
			case 'image':
				if (this.state.image !== '') {
					return (
						<div>
							<img className='nonselectable-image' src={this.state.image} alt='shared' />
							<Row gutter={10}>
								<Col span={12}>
									<button onClick={() => this.setImage('')}>clear</button>
								</Col>
								<Col span={12}>
									<button className={this.canSend() ? '' : 'disabled'} onClick={() => this.sendImage()}>send</button>
								</Col>
							</Row>
						</div>
					);
				}
				return (
					<div>
						<Upload.Dragger accept='image/*' showUploadList={false} beforeUpload={file => this.readFile(file)}>
							<p className='ant-upload-drag-icon'>
								<FileOutlined />
							</p>
							<p className='ant-upload-text'>
								click here, or drag a file here, to upload it
							</p>
						</Upload.Dragger>
					</div>
				);
			case 'roll':
				return (
					<DieRollPanel
						dice={this.state.dice}
						constant={this.state.constant}
						setDie={(sides, count) => this.setDie(sides, count)}
						setConstant={value => this.setConstant(value)}
						resetDice={() => this.resetDice()}
						rollDice={mode => this.sendRoll(mode)}
					/>
				);
			case 'card':
				return (
					<div>
						<Dropdown
							options={[
								'tarot deck',
								'tarot deck (major arcana)',
								'tarot deck (minor arcana)',
								'standard deck',
								'standard deck (with jokers)',
								'deck of many things',
								'deck of many things (13 cards)'
							].map(o => ({ id: o, text: o }))}
							selectedID={this.state.deck}
							onSelect={deck => this.setDeck(deck)}
						/>
						<button onClick={() => this.sendCard()}>draw a card</button>
					</div>
				);
			case 'settings':
				return this.getSettingsSection();
		}

		return null;
	}

	private getSettingsSection() {
		let recipients = null;
		if (this.state.mode === 'private') {
			const list = Comms.data.people
				.filter(person => person.id !== Comms.getID())
				.map(person => (
					<Checkbox
						key={person.id}
						label={Comms.getCurrentName(person.id)}
						checked={this.state.recipients.includes(person.id)}
						onChecked={value => value ? this.addRecipient(person.id) : this.removeRecipient(person.id)}
					/>
				));

			let info = null;
			if (this.state.recipients.length === 0) {
				info = (
					<Note>
						<p>for a private message, you must select at least one person</p>
					</Note>
				);
			}

			recipients = (
				<div>
					<div className='subheading'>choose who to send your message to</div>
					{list}
					{info}
				</div>
			);
		}

		return (
			<div>
				<Selector
					options={['public', 'private'].map(o => ({ id: o, text: o }))}
					selectedID={this.state.mode}
					onSelect={mode => this.setMode(mode)}
				/>
				{recipients}
			</div>
		);
	}

	public render() {
		try {
			// There should always be a DM at least
			if (Comms.data.people.length < 2) {
				return null;
			}

			let icon = null;
			if (this.state.mode === 'public') {
				icon = (
					<UnlockOutlined title='message is public' onClick={() => this.setType('settings')} />
				);
			} else {
				icon = (
					<LockOutlined title='message is private' onClick={() => this.setType('settings')} />
				);
			}

			return (
				<div className='send-message-panel'>
					<div className='message-controls'>
						<Selector
							options={['text', 'link', 'image', 'roll', 'card'].map(o => ({ id: o, text: o }))}
							selectedID={this.state.type}
							onSelect={type => this.setType(type)}
						/>
						{icon}
					</div>
					{this.getMessageSection()}
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='SendMessagePanel' error={e} />;
		}
	}
}

//#endregion

//#region CharacterPanel

interface CharacterPanelProps {
	person: Person | null;
}

class CharacterPanel extends React.Component<CharacterPanelProps> {
	public render() {
		if (!this.props.person) {
			return null;
		}

		if (Comms.data.party !== null) {
			const characterID = this.props.person.characterID;
			const pc = Comms.data.party.pcs.find(p => p.id === characterID);
			if (pc) {
				return (
					<div className='character-panel'>
						<PortraitPanel source={pc} inline={true} />
						<div className='name pc'>{pc.name}</div>
					</div>
				);
			}
		}

		return (
			<div className='character-panel'>
				<div className='name'>{this.props.person.name}</div>
			</div>
		);
	}
}

//#endregion
