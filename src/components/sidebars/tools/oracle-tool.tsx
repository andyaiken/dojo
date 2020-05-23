import { Col, Row } from 'antd';
import React from 'react';

import Utils from '../../../utils/utils';

interface OracleCard {
	id: string;
	name: string;
	meanings: {
		upright: string,
		reversed: string
	};
}

interface Props {
}

interface State {
	deck: OracleCard[];
	draws: { id: string, cardID: string, reversed: boolean }[];
}

export default class OracleTool extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		const deck: OracleCard[] = [
			this.createCard('ace of swords', 'breakthrough, clarity, sharp mind', 'confusion, brutality, chaos'),
			this.createCard('two of swords', 'difficult choices, indecision, stalemate', 'lesser of two evils, no right choice, confusion'),
			this.createCard('three of swords', 'heartbreak, suffering, grief', 'recovery, forgiveness, moving on'),
			this.createCard('four of swords', 'rest, restoration, contemplation', 'restlessness, burnout, stress'),
			this.createCard('five of swords', 'unbridled ambition, win at all costs, sneakiness', 'lingering resentment, desire to reconcile, forgiveness'),
			this.createCard('six of swords', 'transition, leaving behind, moving on', 'emotional baggage, unresolved issues, resisting transition'),
			this.createCard('seven of swords', 'deception, trickery, tactics and strategy', 'coming clean, rethinking approach, deception'),
			this.createCard('eight of swords', 'imprisonment, entrapment, self-victimization', 'self acceptance, new perspective, freedom'),
			this.createCard('nine of swords', 'anxiety, hopelessness, trauma', 'hope, reaching out, despair'),
			this.createCard('ten of swords', 'failure, collapse, defeat', 'can\'t get worse, only upwards, inevitable end'),
			this.createCard('page of swords', 'curiosity, restlessness, mental energy', 'deception, manipulation, all talk'),
			this.createCard('knight of swords', 'action, impulsiveness, defending beliefs', 'no direction, disregard for consequences, unpredictability'),
			this.createCard('queen of swords', 'complexity, perceptiveness, clear mindedness', 'cold hearted, cruel, bitterness'),
			this.createCard('king of swords', 'head over heart, discipline, truth', 'manipulative, cruel, weakness'),

			this.createCard('ace of wands', 'creation, willpower, inspiration, desire', 'lack of energy, lack of passion, boredom'),
			this.createCard('two of wands', 'planning, making decisions, leaving home', 'fear of change, playing safe, bad planning'),
			this.createCard('three of wands', 'looking ahead, expansion, rapid growth', 'obstacles, delays, frustration'),
			this.createCard('four of wands', 'community, home, celebration', 'lack of support, transience, home conflicts'),
			this.createCard('five of wands', 'competition, rivalry, conflict', 'avoiding conflict, respecting differences'),
			this.createCard('six of wands', 'victory, success, public reward', 'excess pride, lack of recognition, punishment'),
			this.createCard('seven of wands', 'perseverance, defensive, maintaining control', 'give up, destroyed confidence, overwhelmed'),
			this.createCard('eight of wands', 'rapid action, movement, quick decisions', 'panic, waiting, slowdown'),
			this.createCard('nine of wands', 'resilience, grit, last stand', 'exhaustion, fatigue, questioning motivations'),
			this.createCard('ten of wands', 'accomplishment, responsibility, burden', 'inability to delegate, overstressed, burnt out'),
			this.createCard('page of wands', 'exploration, excitement, freedom', 'lack of direction, procrastination, creating conflict'),
			this.createCard('knight of wands', 'action, adventure, fearlessness', 'anger, impulsiveness, recklessness'),
			this.createCard('queen of wands', 'courage, determination, joy', 'selfishness, jealousy, insecurities'),
			this.createCard('king of wands', 'big picture, leader, overcoming challenges', 'impulsive, overbearing, unachievable expectations'),

			this.createCard('ace of cups', 'new feelings, spirituality, intuition', 'emotional loss, blocked creativity, emptiness'),
			this.createCard('two of cups', 'unity, partnership, connection', 'imbalance, broken communication, tension'),
			this.createCard('three of cups', 'friendship, community, happiness', 'overindulgence, gossip, isolation'),
			this.createCard('four of cups', 'apathy, contemplation, disconnectedness', 'sudden awareness, choosing happiness, acceptance'),
			this.createCard('five of cups', 'loss, grief, self-pity', 'acceptance, moving on, finding peace'),
			this.createCard('six of cups', 'familiarity, happy memories, healing', 'moving forward, leaving home, independence'),
			this.createCard('seven of cups', 'searching for purpose, choices, daydreaming', 'lack of purpose, diversion, confusion'),
			this.createCard('eight of cups', 'walking away, disillusionment, leaving behind', 'avoidance, fear of change, fear of loss'),
			this.createCard('nine of cups', 'satisfaction, emotional stability, luxury', 'lack of inner joy, smugness, dissatisfaction'),
			this.createCard('ten of cups', 'inner happiness, fulfillment, dreams coming true', 'shattered dreams, broken family, domestic disharmony'),
			this.createCard('page of cups', 'happy surprise, dreamer, sensitivity', 'emotional immaturity, insecurity, disappointment'),
			this.createCard('knight of cups', 'following the heart, idealist, romantic', 'moodiness, disappointment'),
			this.createCard('queen of cups', 'compassion, calm, comfort', 'martyrdom, insecurity, dependence'),
			this.createCard('king of cups', 'compassion, control, balance', 'coldness, moodiness, bad advice'),

			this.createCard('ace of pentacles', 'opportunity, prosperity, new venture', 'lost opportunity, missed chance, bad investment'),
			this.createCard('two of pentacles', 'balancing decisions, priorities, adapting to change', 'loss of balance, disorganized, overwhelmed'),
			this.createCard('three of pentacles', 'teamwork, collaboration, building', 'lack of teamwork, disorganized, group conflict'),
			this.createCard('four of pentacles', 'conservation, frugality, security', 'greediness, stinginess, possessiveness'),
			this.createCard('five of pentacles', 'need, poverty, insecurity', 'recovery, charity, improvement'),
			this.createCard('six of pentacles', 'charity, generosity, sharing', 'strings attached, stinginess, power and domination'),
			this.createCard('seven of pentacles', 'hard work, perseverance, diligence', 'work without results, distractions, lack of rewards'),
			this.createCard('eight of pentacles', 'apprenticeship, passion, high standards', 'lack of passion, uninspired, no motivation'),
			this.createCard('nine of pentacles', 'fruits of labor, rewards, luxury', 'reckless spending, living beyond means, false success'),
			this.createCard('ten of pentacles', 'legacy, culmination, inheritance', 'fleeting success, lack of stability, lack of resources'),
			this.createCard('page of pentacles', 'ambition, desire, diligence', 'lack of commitment, greediness, laziness'),
			this.createCard('knight of pentacles', 'efficiency, hard work, responsibility', 'laziness, obsessiveness, work without reward'),
			this.createCard('queen of pentacles', 'practicality, creature comforts, financial security', 'self-centeredness, jealousy, smothering'),
			this.createCard('king of pentacles', 'abundance, prosperity, security', 'greed, indulgence, sensuality'),

			this.createCard('the fool', 'innocence, new beginnings, free spirit', 'recklessness, taken advantage of, inconsideration'),
			this.createCard('the magician', 'willpower, desire, creation, manifestation', 'trickery, illusions, out of touch'),
			this.createCard('the high priestess', 'intuitive, unconscious, inner voice', 'lack of center, lost inner voice, repressed feelings'),
			this.createCard('the empress', 'motherhood, fertility, nature', 'dependence, smothering, emptiness, nosiness'),
			this.createCard('the emperor', 'authority, structure, control, fatherhood', 'tyranny, rigidity, coldness'),
			this.createCard('the hierophant', 'tradition, conformity, morality, ethics', 'rebellion, subversiveness, new approaches'),
			this.createCard('the lovers', 'partnerships, duality, union', 'loss of balance, one-sidedness, disharmony'),
			this.createCard('the chariot', 'direction, control, willpower', 'lack of control, lack of direction, aggression'),
			this.createCard('strength', 'inner strength, bravery, compassion, focus', 'self doubt, weakness, insecurity'),
			this.createCard('the hermit', 'contemplation, search for truth, inner guidance', 'loneliness, isolation, lost your way'),
			this.createCard('the wheel of fortune', 'change, cycles, inevitable fate', 'no control, clinging to control, bad luck'),
			this.createCard('justice', 'cause and effect, clarity, truth', 'dishonesty, unaccountability, unfairness'),
			this.createCard('the hanged man', 'sacrifice, release, martyrdom', 'stalling, needless sacrifice, fear of sacrifice'),
			this.createCard('death', 'end of cycle, beginnings, change, metamorphosis', 'fear of change, holding on, stagnation, decay'),
			this.createCard('temperance', 'middle path, patience, finding meaning', 'extremes, excess, lack of balance'),
			this.createCard('the devil', 'addiction, materialism, playfulness', 'freedom, release, restoring control'),
			this.createCard('the tower', 'sudden upheaval, broken pride, disaster', 'disaster avoided, delayed disaster, fear of suffering'),
			this.createCard('the star', 'hope, faith, rejuvenation', 'faithlessness, discouragement, insecurity'),
			this.createCard('the moon', 'unconscious, illusions, intuition', 'confusion, fear, misinterpretation'),
			this.createCard('the sun', 'joy, success, celebration, positivity', 'negativity, depression, sadness'),
			this.createCard('judgement', 'reflection, reckoning, awakening', 'lack of self awareness, doubt, self loathing'),
			this.createCard('the world', 'fulfillment, harmony, completion', 'incompletion, no closure')
		];
		this.state = {
			deck: deck,
			draws: []
		};
	}

	private createCard(name: string, upright: string, reversed: string) {
		return {
			id: Utils.guid(),
			name: name,
			meanings: {
				upright: upright,
				reversed: reversed
			}
		};
	}

	private drawCards(count: number) {
		const draws: { id: string, cardID: string, reversed: boolean }[] = [];
		while (draws.length < count) {
			const index = Utils.randomNumber(this.state.deck.length);
			const card = this.state.deck[index];
			if (!draws.find(c => c.cardID === card.id)) {
				draws.push({ id: Utils.guid(), cardID: card.id, reversed: Utils.randomBoolean() });
			}
		}
		this.setState({
			draws: draws
		});
	}

	public render() {
		try {
			const cards = this.state.draws.map(draw => {
				const card = this.state.deck.find(c => c.id === draw.cardID);
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
					<button onClick={() => this.drawCards(3)}>draw cards</button>
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
