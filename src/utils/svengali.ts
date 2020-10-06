// This utility file deals with cards

import { Utils } from './utils';

import { PlayingCard } from '../models/misc';

export class Svengali {
	public static getTarotDeck() {
		const cards: PlayingCard[] = [];
		return cards.concat(Svengali.getTarotMinorArcana()).concat(Svengali.getTarotMajorArcana());
	}

	public static getTarotMajorArcana() {
		return [
			this.createMajorArcana(0, 'the fool', 'innocence, new beginnings, free spirit', 'recklessness, taken advantage of, inconsideration'),
			this.createMajorArcana(1, 'the magician', 'willpower, desire, creation, manifestation', 'trickery, illusions, out of touch'),
			this.createMajorArcana(2, 'the high priestess', 'intuitive, unconscious, inner voice', 'lack of center, lost inner voice, repressed feelings'),
			this.createMajorArcana(3, 'the empress', 'motherhood, fertility, nature', 'dependence, smothering, emptiness, nosiness'),
			this.createMajorArcana(4, 'the emperor', 'authority, structure, control, fatherhood', 'tyranny, rigidity, coldness'),
			this.createMajorArcana(5, 'the hierophant', 'tradition, conformity, morality, ethics', 'rebellion, subversiveness, new approaches'),
			this.createMajorArcana(6, 'the lovers', 'partnerships, duality, union', 'loss of balance, one-sidedness, disharmony'),
			this.createMajorArcana(7, 'the chariot', 'direction, control, willpower', 'lack of control, lack of direction, aggression'),
			this.createMajorArcana(8, 'justice', 'cause and effect, clarity, truth', 'dishonesty, unaccountability, unfairness'),
			this.createMajorArcana(9, 'the hermit', 'contemplation, search for truth, inner guidance', 'loneliness, isolation, lost your way'),
			this.createMajorArcana(10, 'the wheel of fortune', 'change, cycles, inevitable fate', 'no control, clinging to control, bad luck'),
			this.createMajorArcana(11, 'strength', 'inner strength, bravery, compassion, focus', 'self doubt, weakness, insecurity'),
			this.createMajorArcana(12, 'the hanged man', 'sacrifice, release, martyrdom', 'stalling, needless sacrifice, fear of sacrifice'),
			this.createMajorArcana(13, 'death', 'end of cycle, beginnings, change, metamorphosis', 'fear of change, holding on, stagnation, decay'),
			this.createMajorArcana(14, 'temperance', 'middle path, patience, finding meaning', 'extremes, excess, lack of balance'),
			this.createMajorArcana(15, 'the devil', 'addiction, materialism, playfulness', 'freedom, release, restoring control'),
			this.createMajorArcana(16, 'the tower', 'sudden upheaval, broken pride, disaster', 'disaster avoided, delayed disaster, fear of suffering'),
			this.createMajorArcana(17, 'the star', 'hope, faith, rejuvenation', 'faithlessness, discouragement, insecurity'),
			this.createMajorArcana(18, 'the moon', 'unconscious, illusions, intuition', 'confusion, fear, misinterpretation'),
			this.createMajorArcana(19, 'the sun', 'joy, success, celebration, positivity', 'negativity, depression, sadness'),
			this.createMajorArcana(20, 'judgement', 'reflection, reckoning, awakening', 'lack of self awareness, doubt, self loathing'),
			this.createMajorArcana(21, 'the world', 'fulfillment, harmony, completion', 'incompletion, no closure')
		];
	}

	public static getTarotMinorArcana() {
		return [
			this.createMinorArcana('ace', 'swords', 'breakthrough, clarity, sharp mind', 'confusion, brutality, chaos'),
			this.createMinorArcana(2, 'swords', 'difficult choices, indecision, stalemate', 'lesser of two evils, no right choice, confusion'),
			this.createMinorArcana(3, 'swords', 'heartbreak, suffering, grief', 'recovery, forgiveness, moving on'),
			this.createMinorArcana(4, 'swords', 'rest, restoration, contemplation', 'restlessness, burnout, stress'),
			this.createMinorArcana(5, 'swords', 'unbridled ambition, win at all costs, sneakiness', 'lingering resentment, desire to reconcile, forgiveness'),
			this.createMinorArcana(6, 'swords', 'transition, leaving behind, moving on', 'emotional baggage, unresolved issues, resisting transition'),
			this.createMinorArcana(7, 'swords', 'deception, trickery, tactics and strategy', 'coming clean, rethinking approach, deception'),
			this.createMinorArcana(8, 'swords', 'imprisonment, entrapment, self-victimization', 'self acceptance, new perspective, freedom'),
			this.createMinorArcana(9, 'swords', 'anxiety, hopelessness, trauma', 'hope, reaching out, despair'),
			this.createMinorArcana(10, 'swords', 'failure, collapse, defeat', 'can\'t get worse, only upwards, inevitable end'),
			this.createMinorArcana('page', 'swords', 'curiosity, restlessness, mental energy', 'deception, manipulation, all talk'),
			this.createMinorArcana('knight', 'swords', 'action, impulsiveness, defending beliefs', 'no direction, disregard for consequences, unpredictability'),
			this.createMinorArcana('queen', 'swords', 'complexity, perceptiveness, clear mindedness', 'cold hearted, cruel, bitterness'),
			this.createMinorArcana('king', 'swords', 'head over heart, discipline, truth', 'manipulative, cruel, weakness'),

			this.createMinorArcana('ace', 'wands', 'creation, willpower, inspiration, desire', 'lack of energy, lack of passion, boredom'),
			this.createMinorArcana(2, 'wands', 'planning, making decisions, leaving home', 'fear of change, playing safe, bad planning'),
			this.createMinorArcana(3, 'wands', 'looking ahead, expansion, rapid growth', 'obstacles, delays, frustration'),
			this.createMinorArcana(4, 'wands', 'community, home, celebration', 'lack of support, transience, home conflicts'),
			this.createMinorArcana(5, 'wands', 'competition, rivalry, conflict', 'avoiding conflict, respecting differences'),
			this.createMinorArcana(6, 'wands', 'victory, success, public reward', 'excess pride, lack of recognition, punishment'),
			this.createMinorArcana(7, 'wands', 'perseverance, defensive, maintaining control', 'give up, destroyed confidence, overwhelmed'),
			this.createMinorArcana(8, 'wands', 'rapid action, movement, quick decisions', 'panic, waiting, slowdown'),
			this.createMinorArcana(9, 'wands', 'resilience, grit, last stand', 'exhaustion, fatigue, questioning motivations'),
			this.createMinorArcana(10, 'wands', 'accomplishment, responsibility, burden', 'inability to delegate, overstressed, burnt out'),
			this.createMinorArcana('page', 'wands', 'exploration, excitement, freedom', 'lack of direction, procrastination, creating conflict'),
			this.createMinorArcana('knight', 'wands', 'action, adventure, fearlessness', 'anger, impulsiveness, recklessness'),
			this.createMinorArcana('queen', 'wands', 'courage, determination, joy', 'selfishness, jealousy, insecurities'),
			this.createMinorArcana('king', 'wands', 'big picture, leader, overcoming challenges', 'impulsive, overbearing, unachievable expectations'),

			this.createMinorArcana('ace', 'cups', 'new feelings, spirituality, intuition', 'emotional loss, blocked creativity, emptiness'),
			this.createMinorArcana(2, 'cups', 'unity, partnership, connection', 'imbalance, broken communication, tension'),
			this.createMinorArcana(3, 'cups', 'friendship, community, happiness', 'overindulgence, gossip, isolation'),
			this.createMinorArcana(4, 'cups', 'apathy, contemplation, disconnectedness', 'sudden awareness, choosing happiness, acceptance'),
			this.createMinorArcana(5, 'cups', 'loss, grief, self-pity', 'acceptance, moving on, finding peace'),
			this.createMinorArcana(6, 'cups', 'familiarity, happy memories, healing', 'moving forward, leaving home, independence'),
			this.createMinorArcana(7, 'cups', 'searching for purpose, choices, daydreaming', 'lack of purpose, diversion, confusion'),
			this.createMinorArcana(8, 'cups', 'walking away, disillusionment, leaving behind', 'avoidance, fear of change, fear of loss'),
			this.createMinorArcana(9, 'cups', 'satisfaction, emotional stability, luxury', 'lack of inner joy, smugness, dissatisfaction'),
			this.createMinorArcana(10, 'cups', 'inner happiness, fulfillment, dreams coming true', 'shattered dreams, broken family, domestic disharmony'),
			this.createMinorArcana('page', 'cups', 'happy surprise, dreamer, sensitivity', 'emotional immaturity, insecurity, disappointment'),
			this.createMinorArcana('knight', 'cups', 'following the heart, idealist, romantic', 'moodiness, disappointment'),
			this.createMinorArcana('queen', 'cups', 'compassion, calm, comfort', 'martyrdom, insecurity, dependence'),
			this.createMinorArcana('king', 'cups', 'compassion, control, balance', 'coldness, moodiness, bad advice'),

			this.createMinorArcana('ace', 'pentacles', 'opportunity, prosperity, new venture', 'lost opportunity, missed chance, bad investment'),
			this.createMinorArcana(2, 'pentacles', 'balancing decisions, priorities, adapting to change', 'loss of balance, disorganized, overwhelmed'),
			this.createMinorArcana(3, 'pentacles', 'teamwork, collaboration, building', 'lack of teamwork, disorganized, group conflict'),
			this.createMinorArcana(4, 'pentacles', 'conservation, frugality, security', 'greediness, stinginess, possessiveness'),
			this.createMinorArcana(5, 'pentacles', 'need, poverty, insecurity', 'recovery, charity, improvement'),
			this.createMinorArcana(6, 'pentacles', 'charity, generosity, sharing', 'strings attached, stinginess, power and domination'),
			this.createMinorArcana(7, 'pentacles', 'hard work, perseverance, diligence', 'work without results, distractions, lack of rewards'),
			this.createMinorArcana(8, 'pentacles', 'apprenticeship, passion, high standards', 'lack of passion, uninspired, no motivation'),
			this.createMinorArcana(9, 'pentacles', 'fruits of labor, rewards, luxury', 'reckless spending, living beyond means, false success'),
			this.createMinorArcana(10, 'pentacles', 'legacy, culmination, inheritance', 'fleeting success, lack of stability, lack of resources'),
			this.createMinorArcana('page', 'pentacles', 'ambition, desire, diligence', 'lack of commitment, greediness, laziness'),
			this.createMinorArcana('knight', 'pentacles', 'efficiency, hard work, responsibility', 'laziness, obsessiveness, work without reward'),
			this.createMinorArcana('queen', 'pentacles', 'practicality, creature comforts, financial security', 'self-centeredness, jealousy, smothering'),
			this.createMinorArcana('king', 'pentacles', 'abundance, prosperity, security', 'greed, indulgence, sensuality')
		];
	}

	private static createMinorArcana(value: number | string, suit: string, upright: string, reversed: string): PlayingCard {
		return {
			id: Utils.guid(),
			value: value,
			suit: suit,
			name: value + ' of ' + suit,
			meanings: {
				upright: upright,
				reversed: reversed
			}
		};
	}

	private static createMajorArcana(value: number, name: string, upright: string, reversed: string) {
		return {
			id: Utils.guid(),
			value: value,
			suit: null,
			name: name,
			meanings: {
				upright: upright,
				reversed: reversed
			}
		};
	}

	public static getStandardDeck() {
		const cards: PlayingCard[] = [];

		['hearts', 'diamonds', 'spades', 'clubs'].forEach(suit => {
			['ace', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'jack', 'queen', 'king'].forEach(pip => {
				cards.push(Svengali.createCard(pip, suit));
			});
		});

		return cards;
	}

	public static getStandardDeckWithJokers() {
		const cards = Svengali.getStandardDeck();

		cards.push(Svengali.createJoker());
		cards.push(Svengali.createJoker());

		return cards;
	}

	private static createCard(value: number | string, suit: string): PlayingCard {
		return {
			id: Utils.guid(),
			value: value,
			suit: suit,
			name: value + ' of ' + suit,
			meanings: null
		};
	}

	private static createJoker(): PlayingCard {
		return {
			id: Utils.guid(),
			value: '',
			suit: null,
			name: 'joker',
			meanings: null
		};
	}

	public static getDeckOfManyThings() {
		return [
			Svengali.createManyThingsCard('vizier'),
			Svengali.createManyThingsCard('sun'),
			Svengali.createManyThingsCard('moon'),
			Svengali.createManyThingsCard('star'),
			Svengali.createManyThingsCard('comet'),
			Svengali.createManyThingsCard('the fates'),
			Svengali.createManyThingsCard('throne'),
			Svengali.createManyThingsCard('key'),
			Svengali.createManyThingsCard('knight'),
			Svengali.createManyThingsCard('gem'),
			Svengali.createManyThingsCard('talons'),
			Svengali.createManyThingsCard('the void'),
			Svengali.createManyThingsCard('flames'),
			Svengali.createManyThingsCard('skull'),
			Svengali.createManyThingsCard('idiot'),
			Svengali.createManyThingsCard('donjon'),
			Svengali.createManyThingsCard('ruin'),
			Svengali.createManyThingsCard('euryale'),
			Svengali.createManyThingsCard('rogue'),
			Svengali.createManyThingsCard('balance'),
			Svengali.createManyThingsCard('fool'),
			Svengali.createManyThingsCard('jester')
		];
	}

	public static getDeckOfManyThingsSmall() {
		return [
			Svengali.createManyThingsCard('sun'),
			Svengali.createManyThingsCard('moon'),
			Svengali.createManyThingsCard('star'),
			Svengali.createManyThingsCard('throne'),
			Svengali.createManyThingsCard('key'),
			Svengali.createManyThingsCard('knight'),
			Svengali.createManyThingsCard('the void'),
			Svengali.createManyThingsCard('flames'),
			Svengali.createManyThingsCard('skull'),
			Svengali.createManyThingsCard('ruin'),
			Svengali.createManyThingsCard('euryale'),
			Svengali.createManyThingsCard('rogue'),
			Svengali.createManyThingsCard('jester')
		];
	}

	private static createManyThingsCard(name: string) {
		return {
			id: Utils.guid(),
			value: '',
			suit: null,
			name: name,
			meanings: null
		};
	}
}
