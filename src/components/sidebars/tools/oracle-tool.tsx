import { Col, Row } from 'antd';
import React from 'react';

import { Svengali } from '../../../utils/svengali';

import { CardDraw, PlayingCard } from '../../../models/misc';

import { Dropdown } from '../../controls/dropdown';
import { PlayingCardPanel } from '../../panels/playing-card-panel';

interface Props {
	draws: CardDraw[];
	drawCards: (count: number, deck: PlayingCard[]) => void;
	resetDraw: () => void;
}

interface State {
	deck: string;
}

export class OracleTool extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			deck: 'tarot deck'
		};
	}

	private draw(count: number) {
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

		this.props.drawCards(count, deck);
	}

	public render() {
		try {
			if (this.props.draws.length === 0) {
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
							onSelect={id => this.setState({ deck: id })}
						/>
						<Row gutter={10}>
							<Col span={12}>
								<button onClick={() => this.draw(1)}>draw a card</button>
							</Col>
							<Col span={12}>
								<button onClick={() => this.draw(3)}>draw three cards</button>
							</Col>
						</Row>
					</div>
				);
			}

			const cards = this.props.draws.map(draw => {
				return (
					<Col span={8} key={draw.id}>
						<PlayingCardPanel card={draw.card} reversed={draw.reversed} />
					</Col>
				);
			});

			return (
				<div>
					<Row gutter={10} justify='space-around'>
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
