import { CopyOutlined, ExpandOutlined, LockOutlined, SendOutlined, SettingOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import React from 'react';
import Showdown from 'showdown';

import { Comms, CommsDM, CommsPlayer, Message, Person } from '../../utils/comms';

import Checkbox from '../controls/checkbox';
import Expander from '../controls/expander';
import Selector from '../controls/selector';
import Textbox from '../controls/textbox';
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
			const url = window.location + (window.location.toString().endsWith('/') ? '' : '/') + 'player';

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
								<p className='smallest strong'>{url}</p>
							</div>
							<div className='icon-section'>
								<CopyOutlined title='copy' onClick={e => navigator.clipboard.writeText(url)} />
							</div>
						</div>
					</Expander>
					<Expander text='people'>
						<PeoplePanel people={Comms.data.people} />
					</Expander>
					<MessagesPanel messages={Comms.data.messages} />
					<SendMessagePanel sendMessage={(to, text) => CommsDM.sendMessage(to, text)} />
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
								<SendMessagePanel sendMessage={(to, text) => CommsPlayer.sendMessage(to, text)} />
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
			let contentStyle = 'message-content';
			let icon = null;

			if (this.props.message.from === Comms.getID()) {
				mainStyle += ' from-me';
			} else {
				mainStyle += ' to-me';
			}

			let content: JSX.Element;
			if (this.props.message.text.startsWith('/')) {
				contentStyle += ' emote';
				content = (
					<div>
						{Comms.getName(this.props.message.from) + ' ' + this.props.message.text.substr(1)}
					</div>
				);
			} else {
				content = (
					<div dangerouslySetInnerHTML={{ __html: showdown.makeHtml(this.props.message.text) }} />
				);
			}

			if (this.props.message.to.length !== 0) {
				byline += ' to ' + this.props.message.to.map(rec => Comms.getName(rec)).join(', ');
				bylineStyle += ' private';
				icon = <LockOutlined title='private message' />;
			}

			/* tslint:disable:max-line-length */
			// eslint-disable-next-line
			const regexp = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/gi;
			/* tslint:enable:max-line-length */

			const buttons = Array.from(this.props.message.text.matchAll(regexp))
				.map(match => match[0])
				.map((url, n) => (
					<a key={n} className='link' href={url} target='_blank' rel='noopener noreferrer'>
						{url}
					</a>
				));

			return (
				<div className={mainStyle}>
					<div className={bylineStyle}>
						{byline}
						{icon}
					</div>
					<div className={contentStyle}>
						{content}
					</div>
					<div className='buttons'>
						{buttons}
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
}

interface SendMessagePanelState {
	multiline: boolean;
	showControls: boolean;
	mode: string;
	recipients: string[];
	message: string;
}

class SendMessagePanel extends React.Component<SendMessagePanelProps, SendMessagePanelState> {
	constructor(props: SendMessagePanelProps) {
		super(props);
		this.state = {
			multiline: false,
			showControls: false,
			mode: 'public',
			recipients: [],
			message: ''
		};
	}

	private toggleMultiline() {
		this.setState({
			multiline: !this.state.multiline
		});
	}

	private toggleControls() {
		this.setState({
			showControls: !this.state.showControls
		});
	}

	private setMode(mode: string) {
		this.setState({
			mode: mode,
			recipients: mode === 'public' ? [] : this.state.recipients
		});
	}

	private setMessage(message: string) {
		this.setState({
			message: message
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

		const validMessage = (this.state.message !== '');

		return validRecipients && validMessage;
	}

	private sendMessage() {
		if (this.canSend()) {
			const rec = [...this.state.recipients];
			const msg = this.state.message.replace('\n', '\n\n');
			this.setState({
				message: ''
			}, () => {
				this.props.sendMessage(rec, msg);
			});
		}
	}

	public render() {
		try {
			// There should always be a DM at least
			if (Comms.data.people.length < 2) {
				return null;
			}

			let controls = null;
			if (this.state.showControls) {
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
								<p> for a private message, you must select at least one person</p>
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

				controls = (
					<div className='group-panel'>
						<div className='subheading'>message settings</div>
						<Selector
							options={['public', 'private'].map(o => ({ id: o, text: o }))}
							selectedID={this.state.mode}
							onSelect={mode => this.setMode(mode)}
						/>
						{recipients}
					</div>
				);
			}

			return (
				<div className='send-message-panel'>
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
							<SendOutlined
								onClick={() => this.sendMessage()}
								title='send message'
								className={this.canSend() ? '' : 'disabled'}
							/>
							<SettingOutlined
								onClick={() => this.toggleControls()}
								title={'settings'}
								className={this.state.showControls ? 'active' : ''}
							/>
							<ExpandOutlined
								onClick={() => this.toggleMultiline()}
								title={'expand'}
								className={this.state.multiline ? 'active' : ''}
							/>
						</div>
					</div>
					{controls}
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}

//#endregion
