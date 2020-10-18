import React from 'react';

import { PlayingCard } from '../../models/misc';

interface Props {
	card: PlayingCard;
	reversed: boolean;
}

interface State {
	flipped: boolean;
}

export class PlayingCardPanel extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			flipped: false
		};
	}

	private flip() {
		this.setState({
			flipped: !this.state.flipped
		});
	}

	public render() {
		try {
			let data = '';
			let dataClass = '';
			let footer = '';
			if (this.props.card.data) {
				if (typeof this.props.card.data === 'number') {
					data = String.fromCharCode(this.props.card.data);
					dataClass = 'suit';
					footer = String.fromCharCode(this.props.card.data);
				} else {
					data = this.props.reversed ? this.props.card.data.reversed : this.props.card.data.upright;
					footer = this.props.reversed ? '(reversed)' : '';
				}
			}

			return (
				<div className={this.state.flipped ? 'playing-card flipped' : 'playing-card'} onClick={() => this.flip()} role='button'>
					<div className='playing-card-inner'>
						<div className='playing-card-front'>
							?
						</div>
						<div className='playing-card-back'>
							<div className='playing-card-name'>
								<div>{this.props.card.name}</div>
							</div>
							<div className={'playing-card-data scrollable ' + dataClass}>
								<div>{data}</div>
							</div>
							<div className='playing-card-footer'>
								<div>{footer}</div>
								<div><b>{typeof this.props.card.value === 'number' ? this.props.card.value : ''}</b></div>
							</div>
						</div>
					</div>
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}
