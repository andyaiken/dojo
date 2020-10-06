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
			let meaning = '';
			let reversed = '';
			if (this.props.card.meanings) {
				meaning = this.props.reversed ? this.props.card.meanings.reversed : this.props.card.meanings.upright;
				reversed = this.props.reversed ? '(reversed)' : '';
			}

			return (
				<div className={this.state.flipped ? 'oracle-card flipped' : 'oracle-card'} onClick={() => this.flip()} role='button'>
					<div className='oracle-card-inner'>
						<div className='oracle-card-front'>
							?
						</div>
						<div className='oracle-card-back'>
							<div className='oracle-card-name'>
								<div>{this.props.card.name}</div>
							</div>
							<div className='oracle-card-meaning scrollable'>
								<div>{meaning}</div>
							</div>
							<div className='oracle-card-footer'>
								<div>{reversed}</div>
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
