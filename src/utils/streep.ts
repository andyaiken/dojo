// This utility file deals with awards

import { Factory } from './factory';

export class Streep {
	public static getAward(id: string) {
		return Streep.getAwards().find(a => a.id === id) ?? null;
	}

	public static getAwards() {
		return [
			// Social
			Streep.createAward('award-003', 'social', 'Peace Sells', 'Reconcile differences between mortal enemies'),
			Streep.createAward('award-001', 'social', 'I Speak Jive', 'Act as the party translator'),
			Streep.createAward('award-004', 'social', 'Well I Didn\'t Vote For Him', 'Legitimately achieve high political status'),
			Streep.createAward('award-024', 'social', 'Maybe We Can Reason With It', 'Defeat an enemy using only social skills'),
			Streep.createAward('award-006', 'social', 'Objection', 'Win a legal case'),
			Streep.createAward('award-009', 'social', 'Hey, It\'s Enrico Palazzo', 'Beat a performance check while in disguise'),
			Streep.createAward('award-035', 'social', 'Chewbacca Defense', 'Successfully use poor logic in a persuasion check'),
			Streep.createAward('award-060', 'social', 'Bottoms Up', 'Win a drinking contest'),
			Streep.createAward('award-007', 'social', 'Dobby Is Free', 'Team up with an NPC sidekick'),
			Streep.createAward('award-019', 'social', 'Missionary Position', 'Convert an NPC\'s religion'),
			Streep.createAward('award-041', 'social', 'Do You Hear The People Sing?', 'Overthrow a government'),
			Streep.createAward('award-046', 'social', 'You Got Me Monologuing', 'Take advantage of a talkative villain'),
			Streep.createAward('award-083', 'social', 'Sexual Tyrannosaurus', 'Seduce an NPC'),

			// Exploration
			Streep.createAward('award-000', 'exploration', 'Crikey', 'Tame an animal'),
			Streep.createAward('award-014', 'exploration', 'Oh Yeah', 'Burst through a wall'),
			Streep.createAward('award-033', 'exploration', 'Safety First', 'Discover a trap before it discovers you'),
			Streep.createAward('award-050', 'exploration', 'Who Needs Sleep?', 'Go 3 days without a long rest'),
			Streep.createAward('award-076', 'exploration', 'Glutton For Punishment', 'Knowingly activate a trap'),
			Streep.createAward('award-101', 'exploration', 'Suck It, Boromir', 'Simply walk into a well-guarded place'),
			Streep.createAward('award-049', 'exploration', 'And Stay Out', 'Get kicked out of a public establishment'),
			Streep.createAward('award-103', 'exploration', 'African Or European?', 'Spend more than 30 minutes on a puzzle'),

			// Combat
			Streep.createAward('award-022', 'combat', 'Hippie', 'Deal no damage in an encounter'),
			Streep.createAward('award-042', 'combat', 'Are You Not Entertained?', 'Finish an encounter within 3 rounds'),
			Streep.createAward('award-043', 'combat', 'Make It Last', 'Finish an encounter after at least 10 rounds'),
			Streep.createAward('award-053', 'combat', 'Get Over Here', 'Grapple enemies 3 times in an encounter'),
			Streep.createAward('award-021', 'combat', 'Nuke It From Orbit', 'Deal 20 overkill damage to an enemy'),
			Streep.createAward('award-023', 'combat', 'Walking Guillotine', 'Decapitate 20 enemies'),
			Streep.createAward('award-037', 'combat', 'It\'s Super Effective', 'Trigger an enemy\'s vulnerability'),
			Streep.createAward('award-055', 'combat', 'Avengers Assemble', 'Have the party team up on a single enemy'),
			Streep.createAward('award-056', 'combat', 'You Merely Adopted The Dark', 'Hit an enemy in complete darkness'),
			Streep.createAward('award-077', 'combat', 'I\'ve Fallen And I Can\'t Get Up', 'Remain prone for 3 rounds'),
			Streep.createAward('award-078', 'combat', 'Hadouken', 'Lob a flaming projectile at en enemy'),
			Streep.createAward('award-079', 'combat', 'French Tactics', 'Retreat from 5 battles'),
			Streep.createAward('award-081', 'combat', 'My Turn', 'Revive an enemy in order to kill them yourself'),
			Streep.createAward('award-093', 'combat', 'Your Mother Was A Hamster', 'Taunt an enemy to get their attention'),
			Streep.createAward('award-032', 'combat', 'Butterfingers', 'Disarm an NPC'),
			Streep.createAward('award-054', 'combat', 'Rasputin', 'Have 3 impairing conditions at once'),
			Streep.createAward('award-097', 'combat', 'Imperial Marksmanship', 'Achieve only ranged misses in an encounter'),

			// Murder
			Streep.createAward('award-025', 'murder', 'Finish Him', 'Deliver 10 coups de grâce'),
			Streep.createAward('award-094', 'murder', 'Clever Girl', 'Flank and kill an unsuspecting enemy'),
			Streep.createAward('award-058', 'murder', 'This Is Sparta', 'Kill an enemy using falling damage'),
			Streep.createAward('award-059', 'murder', 'Ain\'t Got Time To Bleed', 'Kill 3 enemies in an encounter while at half HP'),
			Streep.createAward('award-062', 'murder', 'Sic Semper Tyrannis', 'Kill a beloved political figure'),
			Streep.createAward('award-063', 'murder', 'Armaments 2:9-21', 'Kill an enemy with a holy weapon'),
			Streep.createAward('award-064', 'murder', 'Showoff', 'Kill all enemies in an encounter by yourself'),
			Streep.createAward('award-065', 'murder', 'Buzzkill', 'Kill an annoying NPC'),
			Streep.createAward('award-066', 'murder', 'I Can Kill You With My Brain', 'Kill an enemy using only skill checks'),
			Streep.createAward('award-067', 'murder', 'Dracarys', 'Kill an enemy with an animal'),
			Streep.createAward('award-068', 'murder', 'Whose Life Is It Anyway?', 'Kill an enemy with an improvised weapon'),
			Streep.createAward('award-069', 'murder', 'Finesse', 'Kill an enemy with no overkill damage'),
			Streep.createAward('award-070', 'murder', 'Nothing Is True', 'Kill an enemy without being seen or heard'),
			Streep.createAward('award-071', 'murder', 'Douple Tap', 'Kill an undead enemy with a headshot'),
			Streep.createAward('award-072', 'murder', 'Long Live The King', 'Kill and replace a sovereign leader'),
			Streep.createAward('award-073', 'murder', 'Sorry About The Mess', 'Kill an enemy in a public place'),
			Streep.createAward('award-074', 'murder', 'Dark And Full Of Terrors', 'Kill an enemy in the name of a god'),
			Streep.createAward('award-075', 'murder', 'Fatality', 'Kill an enemy using the environment'),

			// Survival
			Streep.createAward('award-108', 'survival', 'Birth Of The Joker', 'Survive 50 points of acid damage'),
			Streep.createAward('award-109', 'survival', 'Are You God Of Hammers?', 'Survive 50 points of bludgeoning damage'),
			Streep.createAward('award-110', 'survival', 'Overlook Hotel', 'Survive 50 points of cold damage'),
			Streep.createAward('award-111', 'survival', 'I\'m Very Badly Burned', 'Survive 50 points of fire damage'),
			Streep.createAward('award-112', 'survival', 'Is That All You Got?', 'Survive 50 points of force damage'),
			Streep.createAward('award-113', 'survival', 'It\'s Electrifying', 'Survive 50 points of lightning damage'),
			Streep.createAward('award-114', 'survival', 'Thriller', 'Survive 50 points of necrotic damage'),
			Streep.createAward('award-115', 'survival', 'I\'m A Leaf On The Wind', 'Survive 50 points of piercing damage'),
			Streep.createAward('award-116', 'survival', 'Mithridates, He Died Old', 'Survive 50 points of poison damage'),
			Streep.createAward('award-117', 'survival', 'Nosebleed', 'Survive 50 points of psychic damage'),
			Streep.createAward('award-118', 'survival', 'So Bright I Gotta Wear Shades', 'Survive 50 points of radiant damage'),
			Streep.createAward('award-119', 'survival', 'Just A Flesh Wound', 'Survive 50 points of slashing damage'),
			Streep.createAward('award-120', 'survival', 'Loud Noises', 'Survive 50 points of thunder damage'),
			Streep.createAward('award-098', 'survival', 'Gonna Need A Bigger Boat', 'Survive an encounter with a sea monster'),
			Streep.createAward('award-099', 'survival', 'All Washed Up', 'Survive a shipwreck'),
			Streep.createAward('award-045', 'survival', 'It\'s In The Pipes', 'Survive being petrified'),
			Streep.createAward('award-008', 'survival', 'Stop, Drop, And Roll', 'Survive 3 rounds of ongoing fire damage'),

			// Economic
			Streep.createAward('award-002', 'economic', 'Holla Holla Get Dolla', 'Amass 10,000 gold pieces'),
			Streep.createAward('award-092', 'economic', 'Sticky Fingers', 'Steal 1,000 gold pieces'),
			Streep.createAward('award-080', 'economic', 'My Precious', 'Retrieve a MacGuffin'),
			Streep.createAward('award-106', 'economic', 'Bloodbath And Beyond', 'Open a shop'),
			Streep.createAward('award-104', 'economic', 'Nothing To See Here', 'Take and / or give 20 bribes'),
			Streep.createAward('award-090', 'economic', 'It Belongs In A Museum', 'Take an artifact from a dungeon'),
			Streep.createAward('award-052', 'economic', 'Spare No Expense', 'Go broke'),

			// Dice
			Streep.createAward('award-085', 'dice', 'Did You Break A Mirror?', 'Roll 2 natural 1s in a row'),
			Streep.createAward('award-086', 'dice', 'Taxi!', 'Roll 2 natural 1s on an advantaged roll'),
			Streep.createAward('award-087', 'dice', 'Single File Solar System', 'Roll 2 natural 20s in a row'),
			Streep.createAward('award-088', 'dice', 'I Am A Golden God', 'Roll 2 natural 20s on a disadvantaged roll'),
			Streep.createAward('award-039', 'dice', 'Never Tell Me The Odds', 'Succeed only because you rolled a 20'),
			Streep.createAward('award-048', 'dice', 'A Bird In The Hand', 'Get a worse result on a reroll'),
			Streep.createAward('award-051', 'dice', 'Who Needs Rules?', 'Go a full session without touching your dice'),

			// Paragon
			Streep.createAward('award-015', 'paragon', 'For King And Country', 'Successfully defend a royal life'),
			Streep.createAward('award-034', 'paragon', 'Flawless Victory', 'The party takes 0 damage in an encounter'),
			Streep.createAward('award-044', 'paragon', 'Breaker Of Chains', 'Free 20 captive people'),
			Streep.createAward('award-082', 'paragon', 'All The World\'s A Stage', 'Roleplay your character exceptionally'),
			Streep.createAward('award-095', 'paragon', 'I Volunteer As Tribute', 'Sacrifice yourself'),
			Streep.createAward('award-096', 'paragon', 'Friendship Is Magic', 'Save a fellow PC'),
			Streep.createAward('award-102', 'paragon', 'It Still Only Counts As One', 'Kill a large enemy by yourself'),

			// Renegade
			Streep.createAward('award-018', 'renegade', 'The Rains Of Castamere', 'Commit genocide'),
			Streep.createAward('award-012', 'renegade', 'I\'m Gotham\'s Reckoning', 'Destroy an entire city'),
			Streep.createAward('award-084', 'renegade', 'Chaos Is A Ladder', 'Shift your alignment to chaotic'),
			Streep.createAward('award-100', 'renegade', 'You Either Die A Hero...', 'Shift your alignment to evil'),
			Streep.createAward('award-107', 'renegade', 'Sudden But Inevitable', 'Betray the party for your own gain'),
			Streep.createAward('award-091', 'renegade', '99 Red Balloons', 'Start a war'),
			Streep.createAward('award-105', 'renegade', 'This Is Bat Country', 'Take drugs'),
			Streep.createAward('award-013', 'renegade', 'Homewrecker', 'Break up an NPC relationship'),

			// Oops
			Streep.createAward('award-016', 'oops', 'Did I Do That?', 'Cause a total party kill'),
			Streep.createAward('award-010', 'oops', 'Tubthumping', 'Reach 0 HP twice in a single encounter'),
			Streep.createAward('award-005', 'oops', 'Helen Keller', 'Become deafened and blinded simultaneously'),
			Streep.createAward('award-028', 'oops', 'He\'s Dead, Jim', 'Die for the first time'),
			Streep.createAward('award-029', 'oops', 'Fool Me Twice', 'Die for the second time'),
			Streep.createAward('award-030', 'oops', 'Angered The Dice Gods', 'Die for the third time'),
			Streep.createAward('award-026', 'oops', 'Was That Important?', 'Destroy an item necessary for a quest'),
			Streep.createAward('award-057', 'oops', 'I Was Elected To Lead', 'Ignore a crucial plot point'),
			Streep.createAward('award-047', 'oops', 'It\'s Not A Tumor', 'Get a permanent deformity'),
			Streep.createAward('award-038', 'oops', 'She Turned Me Into A Newt', 'Be polymorphed against your will'),
			Streep.createAward('award-040', 'oops', 'Keaton Was Keyser Soze', 'Fall for a red herring'),

			// Misc
			Streep.createAward('award-089', 'misc', 'The Cardinal Sin', 'Deliberately split the party'),
			Streep.createAward('award-031', 'misc', 'Karma', 'Experience revenge from an old enemy'),
			Streep.createAward('award-036', 'misc', 'Get On With It', 'Talk out of character for a full minute'),
			Streep.createAward('award-061', 'misc', 'Don\'t You Forget About Me', 'Meet with a recurring villain'),
			Streep.createAward('award-020', 'misc', 'The Black Wind Howls', 'Correctly predict the death of another PC')
		];
	}

	public static getCategories() {
		const categories: string[] = [];
		Streep.getAwards()
			.filter(award => award.category !== 'misc')
			.forEach(award => {
				if (!categories.includes(award.category)) {
					categories.push(award.category);
				}
			});
		categories.sort();
		categories.push('misc');
		return categories;
	}

	private static createAward(id: string, category: string, name: string, description: string) {
		const award = Factory.createAward();
		award.id = id;
		award.category = category;
		award.name = name;
		award.description = description;
		return award;
	}
}
