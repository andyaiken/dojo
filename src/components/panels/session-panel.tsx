import { CopyOutlined, ExpandOutlined, FileOutlined, LockOutlined, SendOutlined } from '@ant-design/icons';
import { Col, Row, Upload } from 'antd';
import React from 'react';
import Showdown from 'showdown';

import { Comms, CommsDM, CommsPlayer, Message, Person } from '../../utils/comms';
import Gygax from '../../utils/gygax';

import { DieRollResult } from '../../models/dice';

import Checkbox from '../controls/checkbox';
import Expander from '../controls/expander';
import Selector from '../controls/selector';
import Textbox from '../controls/textbox';
import DieRollPanel from './die-roll-panel';
import DieRollResultPanel from './die-roll-result-panel';
import Note from './note';

const showdown = new Showdown.Converter();
showdown.setOption('tables', true);

interface Props {
	type: 'dm' | 'player';
}

export default class SessionPanel extends React.Component<Props> {
	public render() {
		try {
			switch (this.props.type) {
				case 'dm':
					return <DMSessionPanel />;
				case 'player':
					return <PlayerSessionPanel />;
			}
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}

//#region DMSessionPanel

interface DMSessionPanelProps {
}

interface DMSessionPanelState {
}

class DMSessionPanel extends React.Component<DMSessionPanelProps, DMSessionPanelState> {
	constructor(props: DMSessionPanelProps) {
		super(props);
		this.state = {
		};

		CommsDM.init();
		CommsDM.onDataChanged = () => this.setState(this.state);
	}

	public componentWillUnmount() {
		CommsDM.onDataChanged = () => null;
	}

	public render() {
		try {
			const playerURL = window.location + (window.location.toString().endsWith('/') ? '' : '/') + 'player';

			return (
				<div>
					<Expander text='information'>
						<Note>
							<p>give your dm code to your players, and ask them to open the player app in their browser</p>
						</Note>
						<div className='generated-item group-panel'>
							<div className='text-section'>
								<p className='smallest'>your dm code for this session:</p>
								<p className='smallest strong'>{Comms.getID()}</p>
							</div>
							<div className='icon-section'>
								<CopyOutlined title='copy' onClick={e => navigator.clipboard.writeText(Comms.getID())} />
							</div>
						</div>
						<div className='generated-item group-panel'>
							<div className='text-section'>
								<p className='smallest'>player app url:</p>
								<p className='smallest strong'>{playerURL}</p>
							</div>
							<div className='icon-section'>
								<CopyOutlined title='copy' onClick={e => navigator.clipboard.writeText(playerURL)} />
							</div>
						</div>
					</Expander>
					<Expander text='people'>
						<PeoplePanel people={Comms.data.people} />
					</Expander>
					<MessagesPanel messages={Comms.data.messages} />
					<SendMessagePanel
						sendMessage={(to, text) => CommsDM.sendMessage(to, text)}
						sendLink={(to, url) => CommsDM.sendLink(to, url)}
						sendImage={(to, image) => CommsDM.sendImage(to, image)}
						sendRoll={(to, roll) => CommsDM.sendRoll(to, roll)}
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
}

interface PlayerSessionPanelState {
	code: string;
	name: string;
	status: string;
}

class PlayerSessionPanel extends React.Component<PlayerSessionPanelProps, PlayerSessionPanelState> {
	constructor(props: PlayerSessionPanelProps) {
		super(props);
		this.state = {
			code: '',
			name: '',
			status: ''
		};

		CommsPlayer.onStateChanged = () => this.setState(this.state);
		CommsPlayer.onDataChanged = () => this.setState(this.state);
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

	private setStatus(status: string) {
		this.setState({
			status: status
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

	private sendUpdate() {
		const status = this.state.status;
		this.setState({
			status: ''
		}, () => {
			CommsPlayer.sendUpdate(status);
		});
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
								<p>connecting...</p>
							</Note>
						</div>
					);
				case 'connected':
					return (
						<Row className='full-height'>
							<Col xs={12} sm={12} md={8} lg={6} xl={4} className='scrollable sidebar sidebar-left'>
								<Note>
									<p>you can set your status here</p>
								</Note>
								<div className='group-panel'>
									<div className='subheading'>
										{Comms.getName(Comms.getID())}
									</div>
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
								<Note>
									<p>the following people are connected</p>
								</Note>
								<PeoplePanel people={Comms.data.people} />
							</Col>
							<Col xs={12} sm={12} md={16} lg={18} xl={20} className='scrollable'>
								<MessagesPanel messages={Comms.data.messages} />
								<SendMessagePanel
									sendMessage={(to, text) => CommsPlayer.sendMessage(to, text)}
									sendLink={(to, url) => CommsPlayer.sendLink(to, url)}
									sendImage={(to, image) => CommsPlayer.sendImage(to, image)}
									sendRoll={(to, roll) => CommsPlayer.sendRoll(to, roll)}
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
	people: Person[];
}

class PeoplePanel extends React.Component<PeoplePanelProps> {
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

			const people = this.props.people.map(data => {
				return (
					<div key={data.id} className='group-panel person'>
						<div className='name'>{data.name}</div>
						<div className='status'>{data.status}</div>
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
	messages: Message[];
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
				.map(message => <MessagePanel key={message.id} message={message} />);

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
	message: Message;
}

class MessagePanel extends React.Component<MessagePanelProps> {
	public render() {
		try {
			let byline = Comms.getName(this.props.message.from);
			let mainStyle = 'message';
			let bylineStyle = 'message-byline';
			let contentStyle = 'message-content ' + this.props.message.type;
			let icon = null;

			if (this.props.message.from === Comms.getID()) {
				mainStyle += ' from-me';
			} else {
				mainStyle += ' to-me';
			}

			let content: JSX.Element;
			switch (this.props.message.type) {
				case 'text':
					const text = this.props.message.data['text'];
					if (text.startsWith('/')) {
						contentStyle += ' emote';
						content = (
							<div>
								{Comms.getName(this.props.message.from) + ' ' + text.substr(1)}
							</div>
						);
					} else {
						content = (
							<div dangerouslySetInnerHTML={{ __html: showdown.makeHtml(text) }} />
						);
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
						<img className='nonselectable-image' src={image} alt='' />
					);
					break;
				case 'roll':
					const roll = this.props.message.data['roll'];
					content = (
						<DieRollResultPanel result={roll} />
					);
					break;
			}

			if (this.props.message.to.length !== 0) {
				byline += ' to ' + this.props.message.to.map(rec => Comms.getName(rec)).join(', ');
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
	sendMessage: (to: string[], text: string) => void;
	sendLink: (to: string[], url: string) => void;
	sendImage: (to: string[], image: string) => void;
	sendRoll: (to: string[], roll: DieRollResult) => void;
}

interface SendMessagePanelState {
	type: string;
	message: string;
	multiline: boolean;
	image: string;
	dice: { [sides: number]: number };
	constant: number;
	mode: string;
	recipients: string[];
}

class SendMessagePanel extends React.Component<SendMessagePanelProps, SendMessagePanelState> {
	constructor(props: SendMessagePanelProps) {
		super(props);

		const dice: { [sides: number]: number } = {};
		[4, 6, 8, 10, 12, 20, 100].forEach(n => dice[n] = 0);
		dice[20] = 1;

		this.state = {
			type: 'text',
			message: '',
			multiline: false,
			image: '',
			dice: dice,
			constant: 0,
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

	private toggleMultiline() {
		this.setState({
			multiline: !this.state.multiline
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
			case 'link':
				validContent = (this.state.message !== '');
				break;
			case 'image':
				validContent = (this.state.image !== '');
				break;
			case 'roll':
				validContent = true;
				break;
		}

		return validRecipients && validContent;
	}

	private sendMessage() {
		if (this.canSend()) {
			const rec = [...this.state.recipients];
			const text = this.state.message.split('\n').join('\n\n');
			this.setState({
				message: ''
			}, () => {
				this.props.sendMessage(rec, text);
			});
		}
	}

	private sendLink() {
		if (this.canSend()) {
			const rec = [...this.state.recipients];
			const url = this.state.message;
			this.setState({
				message: ''
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

	private getMessageSection() {
		switch (this.state.type) {
			case 'text':
				return (
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
				);
			case 'link':
				return (
					<div className='control-with-icons'>
						<Textbox
							placeholder='send a link'
							debounce={false}
							text={this.state.message}
							onChange={msg => this.setMessage(msg)}
							onPressEnter={() => this.sendLink()}
						/>
						<div className='icons'>
							<SendOutlined
								onClick={() => this.sendLink()}
								title='send message'
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
									<button onClick={() => this.sendImage()}>send</button>
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
						label={person.name}
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

			return (
				<div className='send-message-panel'>
					<Selector
						options={['text', 'link', 'image', 'roll'].map(o => ({ id: o, text: o }))}
						selectedID={this.state.type}
						onSelect={type => this.setType(type)}
					/>
					{this.getMessageSection()}
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
