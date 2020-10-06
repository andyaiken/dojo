import React from 'react';

import { Comms, CommsPlayer } from '../../utils/uhura';

import { MessagesPanel, SendMessagePanel } from '../panels/session-panel';

interface Props {
	openImage: (data: string) => void;
}

export class SessionChatSidebar extends React.Component<Props> {
	private getContent() {
		if (CommsPlayer.getState() === 'connected') {
			return (
				<MessagesPanel
					user='player'
					messages={Comms.data.messages}
					openImage={data => this.props.openImage(data)}
				/>
			);
		}

		return null;
	}

	private getFooter() {
		if (CommsPlayer.getState() === 'connected') {
			return (
				<div className='sidebar-footer'>
					<SendMessagePanel
						user='player'
						sendMessage={(to, text, language, untranslated) => CommsPlayer.sendMessage(to, text, language, untranslated)}
						sendLink={(to, url) => CommsPlayer.sendLink(to, url)}
						sendImage={(to, image) => CommsPlayer.sendImage(to, image)}
						sendRoll={(to, roll) => CommsPlayer.sendRoll(to, roll)}
						sendCard={(to, card) => CommsPlayer.sendCard(to, card)}
					/>
				</div>
			);
		}

		return null;
	}

	public render() {
		return (
			<div className='sidebar-container'>
				<div className='sidebar-header'>
					<div className='heading'>chat</div>
				</div>
				<div className='sidebar-content'>
					{this.getContent()}
				</div>
				{this.getFooter()}
			</div>
		);
	}
}
