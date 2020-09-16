import { Col, Row } from 'antd';
import React from 'react';

import { CardDraw, OracleCard } from '../../../models/misc';
import Svengali from '../../../utils/svengali';

interface Props {
	draws: CardDraw[];
	drawCards: (count: number) => void;
}

export default class OracleTool extends React.Component<Props> {
	public render() {
		try {
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
					<button onClick={() => this.props.drawCards(3)}>draw cards</button>
					<Row>
						{cards}
					</Row>
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
								{this.props.card.name}
							</div>
							<div className='oracle-card-reversed'>
								{this.props.reversed ? '(reversed)' : ''}
							</div>
							<div className='oracle-card-meaning'>
								{this.props.reversed ? this.props.card.meanings.reversed : this.props.card.meanings.upright}
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
