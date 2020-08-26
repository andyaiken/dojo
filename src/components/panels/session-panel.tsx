import { CloseCircleOutlined, CopyOutlined, ExpandOutlined, FileOutlined, LockOutlined, SendOutlined, SettingOutlined } from '@ant-design/icons';
import { Col, Row, Upload } from 'antd';
import React from 'react';
import Showdown from 'showdown';

import { Comms, CommsDM, CommsPlayer, Message, Person } from '../../utils/comms';
import Gygax from '../../utils/gygax';
import Shakespeare from '../../utils/shakespeare';
import Utils from '../../utils/utils';

import { DieRollResult } from '../../models/dice';
import { Monster, MonsterGroup } from '../../models/monster';
import { Party, PC } from '../../models/party';

import MonsterStatblockCard from '../cards/monster-statblock-card';
import Checkbox from '../controls/checkbox';
import Dropdown from '../controls/dropdown';
import Expander from '../controls/expander';
import Selector from '../controls/selector';
import Textbox from '../controls/textbox';
import DieRollPanel from './die-roll-panel';
import DieRollResultPanel from './die-roll-result-panel';
import Note from './note';
import PortraitPanel from './portrait-panel';

const showdown = new Showdown.Converter();
showdown.setOption('tables', true);

//#region SessionPanel

interface Props {
	user: 'dm' | 'player';
	parties: Party[];
	library: MonsterGroup[];
	update: () => void;
	editPC: (pc: PC) => void;
	openImage: (data: string) => void;
	openStatBlock: (monster: Monster) => void;
}

export default class SessionPanel extends React.Component<Props> {
	public static defaultProps = {
		parties: [],
		library: [],
		editPC: null
	};

	public render() {
		try {
			switch (this.props.user) {
				case 'dm':
					return (
						<DMSessionPanel
							parties={this.props.parties}
							library={this.props.library}
							update={() => this.props.update()}
							openImage={data => this.props.openImage(data)}
							openStatBlock={monster => this.props.openStatBlock(monster)}
						/>
					);
				case 'player':
					return (
						<PlayerSessionPanel
							update={() => this.props.update()}
							editPC={pc => this.props.editPC(pc)}
							openImage={data => this.props.openImage(data)}
							openStatBlock={monster => this.props.openStatBlock(monster)}
						/>
					);
			}
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}

//#endregion

//#region DMSessionPanel

interface DMSessionPanelProps {
	parties: Party[];
	library: MonsterGroup[];
	update: () => void;
	openImage: (data: string) => void;
	openStatBlock: (monster: Monster) => void;
}

class DMSessionPanel extends React.Component<DMSessionPanelProps> {
	public componentDidMount() {
		CommsDM.init();
		CommsDM.onDataChanged = () => this.props.update();
	}

	public componentWillUnmount() {
		CommsDM.onDataChanged = () => null;
	}

	public render() {
		try {
			const playerURL = window.location + (window.location.toString().endsWith('/') ? '' : '/') + 'player';

			return (
				<div>
					<Expander text='session information'>
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
						<Dropdown
							placeholder='select a party...'
							options={this.props.parties.map(party => ({ id: party.id, text: party.name }))}
							selectedID={Comms.getPartyID()}
							onSelect={id => {
								const party = this.props.parties.find(p => p.id === id);
								CommsDM.setParty(party ?? null);
							}}
							onClear={() => {
								CommsDM.setParty(null);
							}}
						/>
					</Expander>
					<Expander text='people'>
						<PeoplePanel
							user='dm'
							people={Comms.data.people}
							editPC={id => null}
						/>
					</Expander>
					<MessagesPanel
						user='dm'
						messages={Comms.data.messages}
						openImage={data => this.props.openImage(data)}
						openStatBlock={monster => this.props.openStatBlock(monster)}
					/>
					<SendMessagePanel
						user='dm'
						library={this.props.library}
						sendMessage={(to, text, language, untranslated) => CommsDM.sendMessage(to, text, language, untranslated)}
						sendLink={(to, url) => CommsDM.sendLink(to, url)}
						sendImage={(to, image) => CommsDM.sendImage(to, image)}
						sendRoll={(to, roll) => CommsDM.sendRoll(to, roll)}
						sendMonster={(to, monster) => CommsDM.sendMonster(to, monster)}
					/>
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}

//#endregion

//#region PlayerSessionPanel

interface PlayerSessionPanelProps {
	update: () => void;
	editPC: (pc: PC) => void;
	openImage: (data: string) => void;
	openStatBlock: (monster: Monster) => void;
}

interface PlayerSessionPanelState {
	code: string;
	name: string;
}

class PlayerSessionPanel extends React.Component<PlayerSessionPanelProps, PlayerSessionPanelState> {
	constructor(props: PlayerSessionPanelProps) {
		super(props);
		this.state = {
			code: '',
			name: ''
		};
	}

	public componentDidMount() {
		CommsPlayer.onStateChanged = () => this.props.update();
		CommsPlayer.onDataChanged = () => this.props.update();
	}

	public componentWillUnmount() {
		CommsPlayer.onStateChanged = () => null;
		CommsPlayer.onDataChanged = () => null;
	}

	private setCode(code: string) {
		this.setState({
			code: code
		});
	}

	private setName(name: string) {
		this.setState({
			name: name
		});
	}

	private canConnect() {
		return (this.state.code !== '') && (this.state.name !== '');
	}

	private connect() {
		if (this.canConnect()) {
			CommsPlayer.connect(this.state.code, this.state.name);
		}
	}

	private editPC(id: string) {
		if (Comms.data.party) {
			const pc = Comms.data.party.pcs.find(p => p.id === id);
			if (pc) {
				this.props.editPC(pc);
			}
		}
	}

	public render() {
		try {
			switch (CommsPlayer.getState()) {
				case 'not connected':
					return (
						<div className='connection-panel'>
							<div className='heading'>connect</div>
							<Textbox placeholder='dm code' debounce={false} text={this.state.code} onChange={code => this.setCode(code)} />
							<Textbox placeholder='your name' debounce={false} text={this.state.name} onChange={name => this.setName(name)} />
							<button className={this.canConnect() ? '' : 'disabled'} onClick={() => this.connect()}>connect</button>
						</div>
					);
				case 'connecting':
					return (
						<div className='connection-panel'>
							<Note>
								<p>connecting to <span className='app-name'>dojo</span>...</p>
							</Note>
						</div>
					);
				case 'connected':
					return (
						<Row className='full-height'>
							<Col xs={12} sm={12} md={8} lg={6} xl={4} className='scrollable sidebar sidebar-left'>
								<Note>
									<p>the following people are connected</p>
								</Note>
								<PeoplePanel
									user='player'
									people={Comms.data.people}
									editPC={id => this.editPC(id)}
								/>
							</Col>
							<Col xs={12} sm={12} md={16} lg={18} xl={20} className='scrollable'>
								<MessagesPanel
									user='player'
									messages={Comms.data.messages}
									openImage={data => this.props.openImage(data)}
									openStatBlock={monster => this.props.openStatBlock(monster)}
								/>
								<SendMessagePanel
									user='player'
									sendMessage={(to, text, language, untranslated) => CommsPlayer.sendMessage(to, text, language, untranslated)}
									sendLink={(to, url) => CommsPlayer.sendLink(to, url)}
									sendImage={(to, image) => CommsPlayer.sendImage(to, image)}
									sendRoll={(to, roll) => CommsPlayer.sendRoll(to, roll)}
									sendMonster={(to, monster) => null}
								/>
							</Col>
						</Row>
					);
			}
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}

//#endregion

//#region PeoplePanel

interface PeoplePanelProps {
	user: 'dm' | 'player';
	people: Person[];
	editPC: (id: string) => void;
}

interface PeoplePanelState {
	showControls: boolean;
	status: string;
	pc: string;
}

class PeoplePanel extends React.Component<PeoplePanelProps, PeoplePanelState> {
	constructor(props: PeoplePanelProps) {
		super(props);
		this.state = {
			showControls: false,
			status: '',
			pc: ''
		};
	}

	private toggleControls() {
		this.setState({
			showControls: !this.state.showControls
		});
	}

	private setStatus(status: string) {
		this.setState({
			status: status
		});
	}

	private setPC(id: string) {
		this.setState({
			pc: id
		}, () => {
			this.sendUpdate();
		});
	}

	private sendUpdate() {
		CommsPlayer.sendUpdate(this.state.status, this.state.pc);
	}

	private getControlsSection() {
		let pcSection = null;
		if (Comms.data.party) {
			const pc = Comms.getPC(Comms.getID());
			if (pc === '') {
				pcSection = (
					<Dropdown
						options={Comms.data.party.pcs.map(p => {
							const claimed = Comms.data.people.some(person => person.pc === p.id);
							return {
								id: p.id,
								text: p.name,
								disabled: claimed
							};
						})}
						placeholder={'select your character...'}
						selectedID={this.state.pc}
						onSelect={id => this.setPC(id)}
					/>
				);
			} else {
				pcSection = (
					<div>
						<button onClick={() => this.props.editPC(pc)}>update character stats</button>
					</div>
				);
			}
		}

		return (
			<div className='controls-panel'>
				{pcSection}
				<div className='control-with-icons'>
					<Textbox
						placeholder='update your status'
						debounce={false}
						text={this.state.status}
						onChange={status => this.setStatus(status)}
						onPressEnter={() => this.sendUpdate()}
					/>
					<div className='icons'>
						<SendOutlined
							onClick={() => this.sendUpdate()}
							title='update status'
						/>
					</div>
				</div>
			</div>
		);
	}

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

				let content = (
					<div>
						<div className='status'>{person.status}</div>
					</div>
				);

				if ((this.props.user === 'player') && (person.id === Comms.getID())) {
					icon = (
						<SettingOutlined
							className={this.state.showControls ? 'control-icon active' : 'control-icon'}
							onClick={() => this.toggleControls()}
						/>
					);

					if (this.state.showControls) {
						content = this.getControlsSection();
					}
				}

				if ((this.props.user === 'dm') && (person.id !== Comms.getID())) {
					icon = (
						<CloseCircleOutlined
							className='control-icon'
							onClick={() => CommsDM.kick(person.id)}
						/>
					);
				}

				return (
					<div key={person.id} className='group-panel person'>
						<div className='top-line'>
							<CharacterPanel person={person} />
							{icon}
						</div>
						{content}
					</div>
				);
			});

			return (
				<div className='people-panel'>
					{people}
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}

//#endregion

//#region MessagesPanel

interface MessagesPanelProps {
	user: 'dm' | 'player';
	messages: Message[];
	openImage: (data: string) => void;
	openStatBlock: (monster: Monster) => void;
}

class MessagesPanel extends React.Component<MessagesPanelProps> {
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
						openStatBlock={monster => this.props.openStatBlock(monster)}
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
				<div className='message-panel'>
					<div className='heading'>messages</div>
					{messages}
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}

//#endregion

//#region MessagePanel

interface MessagePanelProps {
	user: 'dm' | 'player';
	message: Message;
	openImage: (data: string) => void;
	openStatBlock: (monster: Monster) => void;
}

class MessagePanel extends React.Component<MessagePanelProps> {
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
							const pc = Comms.data.party.pcs.find(p => Comms.getPC(Comms.getID()) === p.id);
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
									<div dangerouslySetInnerHTML={{ __html: showdown.makeHtml(text) }}  />
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
						<img className='selectable-image' src={image} alt='' onClick={() => this.props.openImage(image)} />
					);
					break;
				case 'roll':
					const roll = this.props.message.data['roll'];
					content = (
						<DieRollResultPanel result={roll} />
					);
					break;
				case 'monster':
					const monster = this.props.message.data['monster'];
					content = (
						<button className='statblock' onClick={() => this.props.openStatBlock(monster)}>
							{monster.name}
						</button>
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
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}

//#endregion

//#region SendMessagePanel

interface SendMessagePanelProps {
	user: 'dm' | 'player';
	library: MonsterGroup[];
	sendMessage: (to: string[], text: string, language: string, untranslated: string) => void;
	sendLink: (to: string[], url: string) => void;
	sendImage: (to: string[], image: string) => void;
	sendRoll: (to: string[], roll: DieRollResult) => void;
	sendMonster: (to: string[], monster: Monster) => void;
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
	monster: Monster | null;
	mode: string;
	recipients: string[];
}

class SendMessagePanel extends React.Component<SendMessagePanelProps, SendMessagePanelState> {
	public static defaultProps = {
		library: []
	};

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
			monster: null,
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

	private resetDice() {
		const dice = this.state.dice;
		[4, 6, 8, 10, 12, 20, 100].forEach(n => dice[n] = 0);
		this.setState({
			dice: dice
		});
	}

	private setMonster(monster: Monster | null) {
		this.setState({
			monster: monster
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
			case 'monster':
				validContent = (this.state.monster !== null);
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

	private sendMonster() {
		if (this.canSend()) {
			const rec = [...this.state.recipients];
			const monster = this.state.monster as Monster;
			this.setState({
				monster: null
			}, () => {
				this.props.sendMonster(rec, monster);
			});
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
						languages = Shakespeare.getSpokenLanguages(Comms.data.party.pcs);
						languages.push('(some other language)');
					} else {
						// Only show your languages
						const character = Comms.data.party.pcs.find(pc => pc.id === Comms.getPC(Comms.getID()));
						if (character) {
							languages = Shakespeare.getSpokenLanguages([character]);
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
							<img className='nonselectable-image' src={this.state.image} alt='' />
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
			case 'monster':
				const monsters: Monster[] = [];
				this.props.library.forEach(group => {
					group.monsters.forEach(m => monsters.push(m));
				});
				Utils.sort(monsters);
				return (
					<div>
						<Dropdown
							options={monsters.map(m => ({ id: m.id, text: m.name }))}
							selectedID={this.state.monster ? this.state.monster.id : null}
							placeholder='select a monster...'
							onSelect={id => {
								const monster = monsters.find(m => m.id === id);
								this.setMonster(monster || null);
							}}
							onClear={() => this.setMonster(null)}
						/>
						{this.state.monster ? <MonsterStatblockCard monster={this.state.monster} /> : null}
						<button className={this.canSend() ? '' : 'disabled'} onClick={() => this.sendMonster()}>send</button>
					</div>
				);
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
						display='switch'
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
			<Expander text='settings'>
				<Selector
					options={['public', 'private'].map(o => ({ id: o, text: o }))}
					selectedID={this.state.mode}
					onSelect={mode => this.setMode(mode)}
				/>
				{recipients}
			</Expander>
		);
	}

	public render() {
		try {
			// There should always be a DM at least
			if (Comms.data.people.length < 2) {
				return null;
			}

			const options = ['text', 'link', 'image', 'roll'];
			if (this.props.user === 'dm') {
				options.push('monster');
			}

			return (
				<div className='send-message-panel'>
					<Selector
						options={options.map(o => ({ id: o, text: o }))}
						selectedID={this.state.type}
						onSelect={type => this.setType(type)}
					/>
					{this.getMessageSection()}
					<hr />
					{this.getSettingsSection()}
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
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
			const id = this.props.person.pc;
			const pc = Comms.data.party.pcs.find(p => p.id === id);
			if (pc) {
				return (
					<div className='character-panel'>
						<PortraitPanel source={pc} inline={true} />
						<div className='name'>{pc.name}</div>
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
