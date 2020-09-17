import { Col, Row } from 'antd';
import React from 'react';

import { CardDraw, OracleCard } from '../../../models/misc';
import Svengali from '../../../utils/svengali';

interface Props {
	draws: CardDraw[];
	drawCards: (count: number) => void;
	resetDraw: () => void;
}

export default class OracleTool extends React.Component<Props> {
	public render() {
		try {
			if (this.props.draws.length === 0) {
				return (
					<button onClick={() => this.props.drawCards(3)}>draw cards</button>
				);
			}

			const deck = Svengali.getCards();

			const cards = this.props.draws.map(draw => {
				const card = deck.find(c => c.id === draw.cardID);
				if (!card) {
					return null;
				}

				return (
					<Col span={8} key={draw.id}>
						<Card card={card} reversed={draw.reversed} />
					</Col>
				);
			});

			return (
				<div>
					<Row>
						{cards}
					</Row>
					<button onClick={() => this.props.resetDraw()}>reset</button>
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}

interface CardProps {
	card: OracleCard;
	reversed: boolean;
}

interface CardState {
	flipped: boolean;
}

class Card extends React.Component<CardProps, CardState> {
	constructor(props: CardProps) {
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
			return (
				<div className={this.state.flipped ? 'oracle-card flipped' : 'oracle-card'} onClick={() => this.flip()}>
					<div className='oracle-card-inner'>
						<div className='oracle-card-front'>
							?
						</div>
						<div className='oracle-card-back'>
							<div className='oracle-card-name'>
								<div>{this.props.card.name}</div>
							</div>
							<div className='oracle-card-meaning scrollable'>
								<div>{this.props.reversed ? this.props.card.meanings.reversed : this.props.card.meanings.upright}</div>
							</div>
							<div className='oracle-card-footer'>
								<div>{this.props.reversed ? '(reversed)' : ''}</div>
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
