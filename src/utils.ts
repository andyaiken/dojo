﻿export const TERRAIN_TYPES = [
    "cavern",
    "dirt",
    "flagstone",
    "floorboard",
    "grassland",
    "pit",
    "sand",
    "snow",
    "water"
];

export var monsterIdToGroup = {};

export function getMonsterGroup(monster, library) {
    var group = monsterIdToGroup[monster.id];

    if (!group) {
        library.forEach(g => {
            if (!group) {
                if (g.monsters.indexOf(monster) !== -1) {
                    group = g;
                }
            }
        });
        monsterIdToGroup[monster.id] = group;
    }

    return group;
}

export function match(filter, text) {
    if (!filter) {
        return true;
    }

    var result = true;

    try {
        var tokens = filter.toLowerCase().split(' ');
        tokens.forEach(token => {
            if (text.toLowerCase().indexOf(token) === -1) {
                result = false;
            }
        });
    } catch (ex) {
        console.log(ex);
    }

    return result;
}

export function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

export function sort(collection) {
    collection.sort((a, b) => {
        var aName = a.name.toLowerCase();
        var bName = b.name.toLowerCase();
        if (aName < bName) return -1;
        if (aName > bName) return 1;
        return 0;
    });
    return collection;
}

export function sortByValue(collection) {
    collection.sort((a, b) => {
        if (a.value < b.value) return -1;
        if (a.value > b.value) return 1;
        return 0;
    });
    return collection;
}

export function sortByCount(collection) {
    collection.sort((a, b) => {
        if (a.count < b.count) return 1;
        if (a.count > b.count) return -1;

        var aValue = a.value.toLowerCase();
        var bValue = b.value.toLowerCase();
        if (aValue < bValue) return -1;
        if (aValue > bValue) return 1;

        return 0;
    });
    return collection;
}

export function createParty() {
    return {
        id: guid(),
        name: "",
        pcs: []
    };
}

export function createPC() {
    return {
        id: guid(),
        type: "pc",
        active: true,
        player: "",
        name: "",
        race: "",
        classes: "",
        background: "",
        level: 1,
        languages: "Common",
        passiveInsight: 10,
        passiveInvestigation: 10,
        passivePerception: 10,
        initiative: 10,
        url: ""
    };
}

export function createMonsterGroup() {
    return {
        id: guid(),
        name: "",
        monsters: []
    };
}

export function createMonster() {
    return {
        id: guid(),
        type: "monster",
        name: "",
        size: "medium",
        category: "humanoid",
        tag: "",
        alignment: "",
        challenge: 1,
        abilityScores: {
            str: 10,
            dex: 10,
            con: 10,
            int: 10,
            wis: 10,
            cha: 10
        },
        ac: 10,
        hpMax: 4,
        hpTemp: 0,
        hitDice: 1,
        damage: {
            resist: "",
            vulnerable: "",
            immune: ""
        },
        savingThrows: "",
        speed: "",
        skills: "",
        senses: "",
        languages: "",
        equipment: "",
        traits: [],
        conditionImmunities: ""
    };
}

export function createTrait() {
    return {
        id: guid(),
        name: "",
        usage: "",
        type: "action",
        text: ""
    };
}

export function createEncounter() {
    return {
        id: guid(),
        name: "",
        slots: [],
        waves: []
    };
}

export function createEncounterSlot() {
    return {
        id: guid(),
        monsterGroupName: "",
        monsterName: "",
        count: 1
    };
}

export function createEncounterWave() {
    return {
        id: guid(),
        name: "",
        slots: []
    };
}

export function createMapFolio() {
    return {
        id: guid(),
        name: "",
        maps: []
    };
}

export function createMap() {
    return {
        id: guid(),
        name: "",
        items: []
    };
}

export function createMapItem() {
    return {
        id: guid(),
        type: "tile",
        x: 0,
        y: 0,
        width: 4,
        height: 4,
        terrain: "flagstone"
    };
}

export function createCombat() {
    return {
        id: guid(),
        name: "",
        encounterID: null,
        combatants: [],
        map: null,
        round: 1,
        notifications: [],
        issues: []
    };
}

export const SIZE_TYPES = [
    "tiny",
    "small",
    "medium",
    "large",
    "huge",
    "gargantuan"
];

export const CATEGORY_TYPES = [
    "aberration",
    "beast",
    "celestial",
    "construct",
    "dragon",
    "elemental",
    "fey",
    "fiend",
    "giant",
    "humanoid",
    "monstrosity",
    "ooze",
    "plant",
    "undead"
];

export const TRAIT_TYPES = [
    "trait",
    "action",
    "legendary",
    "lair",
    "regional"
];

export const CONDITION_TYPES = [
    "blinded",
    "charmed",
    "deafened",
    "exhaustion",
    "frightened",
    "grappled",
    "incapacitated",
    "invisible",
    "paralyzed",
    "petrified",
    "poisoned",
    "prone",
    "restrained",
    "stunned",
    "unconscious",
    "custom"
];

export function modifier(score: number) {
    var mod = Math.floor((score - 10) / 2);
    var str = mod.toString();
    if (mod >= 0) {
        str = '+' + str;
    }
    return str;
}

export function dieRoll() {
    return Math.floor(Math.random() * 20) + 1;
}

export function miniSize(size) {
    switch (size) {
    case 'tiny': return 1;
    case 'small': return 1;
    case 'medium': return 1;
    case 'large': return 2;
    case 'huge': return 3;
    case 'gargantuan': return 4;
    default: return 1;
    }
}

export function hitDieType(size) {
    switch (size) {
    case 'tiny': return 4;
    case 'small': return 6;
    case 'medium': return 8;
    case 'large': return 10;
    case 'huge': return 12;
    case 'gargantuan': return 20;
    default: return 8;
    }
}

export function challenge(cr) {
    switch (cr) {
    case 0.125: return '1/8';
    case 0.25: return '1/4';
    case 0.5: return '1/2';
    default: return cr;
    }
}

export function parseChallenge(cr) {
    switch (cr) {
    case '1/8': return 0.125;
    case '1/4': return 0.25;
    case '1/2': return 0.5;
    default: return parseInt(cr);
    }
}

export function challengeDetails() {
    var result: any[] = [];

    result.push({ cr: 0,        ac: 13,       hpMin: 1, hpMax: 6,       attack: 3,  dmgMin: 0,   dmgMax: 1,   save: 13 });
    result.push({ cr: 0.125,    ac: 13,       hpMin: 7, hpMax: 35,      attack: 3,  dmgMin: 2,   dmgMax: 3,   save: 13 });
    result.push({ cr: 0.25,     ac: 13,       hpMin: 36, hpMax: 49,     attack: 3,  dmgMin: 4,   dmgMax: 5,   save: 13 });
    result.push({ cr: 0.5,      ac: 13,       hpMin: 50, hpMax: 70,     attack: 3,  dmgMin: 6,   dmgMax: 8,   save: 13 });
    result.push({ cr: 1,        ac: 13,       hpMin: 71, hpMax: 85,     attack: 3,  dmgMin: 9,   dmgMax: 14,  save: 13 });
    result.push({ cr: 2,        ac: 13,       hpMin: 86, hpMax: 100,    attack: 3,  dmgMin: 15,  dmgMax: 20,  save: 13 });
    result.push({ cr: 3,        ac: 13,       hpMin: 101, hpMax: 115,   attack: 4,  dmgMin: 21,  dmgMax: 26,  save: 13 });
    result.push({ cr: 4,        ac: 14,       hpMin: 116, hpMax: 130,   attack: 5,  dmgMin: 27,  dmgMax: 32,  save: 14 });
    result.push({ cr: 5,        ac: 15,       hpMin: 131, hpMax: 145,   attack: 6,  dmgMin: 33,  dmgMax: 38,  save: 15 });
    result.push({ cr: 6,        ac: 15,       hpMin: 146, hpMax: 160,   attack: 6,  dmgMin: 39,  dmgMax: 44,  save: 15 });
    result.push({ cr: 7,        ac: 15,       hpMin: 161, hpMax: 175,   attack: 6,  dmgMin: 45,  dmgMax: 50,  save: 15 });
    result.push({ cr: 8,        ac: 16,       hpMin: 176, hpMax: 190,   attack: 7,  dmgMin: 51,  dmgMax: 56,  save: 16 });
    result.push({ cr: 9,        ac: 16,       hpMin: 191, hpMax: 205,   attack: 7,  dmgMin: 57,  dmgMax: 62,  save: 16 });
    result.push({ cr: 10,       ac: 17,       hpMin: 206, hpMax: 220,   attack: 7,  dmgMin: 63,  dmgMax: 68,  save: 16 });
    result.push({ cr: 11,       ac: 17,       hpMin: 221, hpMax: 235,   attack: 8,  dmgMin: 69,  dmgMax: 74,  save: 17 });
    result.push({ cr: 12,       ac: 17,       hpMin: 236, hpMax: 250,   attack: 8,  dmgMin: 75,  dmgMax: 80,  save: 17 });
    result.push({ cr: 13,       ac: 18,       hpMin: 251, hpMax: 265,   attack: 8,  dmgMin: 81,  dmgMax: 86,  save: 18 });
    result.push({ cr: 14,       ac: 18,       hpMin: 266, hpMax: 280,   attack: 8,  dmgMin: 87,  dmgMax: 92,  save: 18 });
    result.push({ cr: 15,       ac: 18,       hpMin: 281, hpMax: 295,   attack: 8,  dmgMin: 93,  dmgMax: 98,  save: 18 });
    result.push({ cr: 16,       ac: 18,       hpMin: 296, hpMax: 310,   attack: 9,  dmgMin: 99,  dmgMax: 104, save: 18 });
    result.push({ cr: 17,       ac: 19,       hpMin: 311, hpMax: 325,   attack: 10, dmgMin: 105, dmgMax: 110, save: 19 });
    result.push({ cr: 18,       ac: 19,       hpMin: 326, hpMax: 340,   attack: 10, dmgMin: 111, dmgMax: 116, save: 19 });
    result.push({ cr: 19,       ac: 19,       hpMin: 341, hpMax: 355,   attack: 10, dmgMin: 117, dmgMax: 122, save: 19 });
    result.push({ cr: 20,       ac: 19,       hpMin: 356, hpMax: 400,   attack: 10, dmgMin: 123, dmgMax: 140, save: 19 });
    result.push({ cr: 21,       ac: 19,       hpMin: 401, hpMax: 445,   attack: 11, dmgMin: 141, dmgMax: 158, save: 20 });
    result.push({ cr: 22,       ac: 19,       hpMin: 446, hpMax: 490,   attack: 11, dmgMin: 159, dmgMax: 176, save: 20 });
    result.push({ cr: 23,       ac: 19,       hpMin: 491, hpMax: 535,   attack: 11, dmgMin: 177, dmgMax: 194, save: 20 });
    result.push({ cr: 24,       ac: 19,       hpMin: 536, hpMax: 580,   attack: 12, dmgMin: 195, dmgMax: 212, save: 21 });
    result.push({ cr: 25,       ac: 19,       hpMin: 581, hpMax: 625,   attack: 12, dmgMin: 213, dmgMax: 230, save: 21 });
    result.push({ cr: 26,       ac: 19,       hpMin: 626, hpMax: 670,   attack: 12, dmgMin: 231, dmgMax: 248, save: 21 });
    result.push({ cr: 27,       ac: 19,       hpMin: 671, hpMax: 715,   attack: 13, dmgMin: 249, dmgMax: 266, save: 22 });
    result.push({ cr: 28,       ac: 19,       hpMin: 716, hpMax: 760,   attack: 13, dmgMin: 267, dmgMax: 284, save: 22 });
    result.push({ cr: 29,       ac: 19,       hpMin: 761, hpMax: 805,   attack: 13, dmgMin: 285, dmgMax: 302, save: 22 });
    result.push({ cr: 30,       ac: 19,       hpMin: 806, hpMax: 850,   attack: 14, dmgMin: 303, dmgMax: 320, save: 23 });

    return result;
}

export function experience(cr) {
    switch (cr) {
    case 0: return 10;
    case 0.125: return 25;
    case 0.25: return 50;
    case 0.5: return 100;
    case 1: return 200;
    case 2: return 450;
    case 3: return 700;
    case 4: return 1100;
    case 5: return 1800;
    case 6: return 2300;
    case 7: return 2900;
    case 8: return 3900;
    case 9: return 5000;
    case 10: return 5900;
    case 11: return 7200;
    case 12: return 8400;
    case 13: return 10000;
    case 14: return 11500;
    case 15: return 13000;
    case 16: return 15000;
    case 17: return 18000;
    case 18: return 20000;
    case 19: return 22000;
    case 20: return 25000;
    case 21: return 33000;
    case 22: return 41000;
    case 23: return 50000;
    case 24: return 62000;
    case 30: return 155000;
    default: return 0;
    }
}

export function experienceFactor(count) {
    switch (count) {
    case 0:
        return 0;
    case 1:
        return 1;
    case 2:
        return 1.5;
    case 3:
    case 4:
    case 5:
    case 6:
        return 2;
    case 7:
    case 8:
    case 9:
    case 10:
        return 2.5;
    case 11:
    case 12:
    case 13:
    case 14:
        return 3;
    default:
        return 4;
    }
}

export function pcExperience(level, difficulty) {
    switch (difficulty) {
    case 'easy': {
        switch (level) {
        case 1: return 25;
        case 2: return 50;
        case 3: return 75;
        case 4: return 125;
        case 5: return 250;
        case 6: return 300;
        case 7: return 350;
        case 8: return 450;
        case 9: return 550;
        case 10: return 600;
        case 11: return 800;
        case 12: return 1000;
        case 13: return 1100;
        case 14: return 1250;
        case 15: return 1400;
        case 16: return 1600;
        case 17: return 2000;
        case 18: return 2100;
        case 19: return 2400;
        case 20: return 2800;
        }
    }
        break;
    case 'medium': {
        switch (level) {
        case 1: return 50;
        case 2: return 100;
        case 3: return 150;
        case 4: return 250;
        case 5: return 500;
        case 6: return 600;
        case 7: return 750;
        case 8: return 900;
        case 9: return 1100;
        case 10: return 1200;
        case 11: return 1600;
        case 12: return 2000;
        case 13: return 2200;
        case 14: return 2500;
        case 15: return 2800;
        case 16: return 3200;
        case 17: return 3900;
        case 18: return 4200;
        case 19: return 4900;
        case 20: return 5700;
        }
    }
        break;
    case 'hard': {
        switch (level) {
        case 1: return 75;
        case 2: return 150;
        case 3: return 225;
        case 4: return 375;
        case 5: return 750;
        case 6: return 900;
        case 7: return 1100;
        case 8: return 1400;
        case 9: return 1600;
        case 10: return 1900;
        case 11: return 2400;
        case 12: return 3000;
        case 13: return 3400;
        case 14: return 3800;
        case 15: return 4300;
        case 16: return 4800;
        case 17: return 5900;
        case 18: return 6300;
        case 19: return 7300;
        case 20: return 8500;
        }
    }
        break;
    case 'deadly': {
        switch (level) {
        case 1: return 100;
        case 2: return 200;
        case 3: return 400;
        case 4: return 500;
        case 5: return 1100;
        case 6: return 1400;
        case 7: return 1700;
        case 8: return 2100;
        case 9: return 2400;
        case 10: return 2800;
        case 11: return 3600;
        case 12: return 4500;
        case 13: return 5100;
        case 14: return 5700;
        case 15: return 6400;
        case 16: return 7200;
        case 17: return 8800;
        case 18: return 9500;
        case 19: return 10900;
        case 20: return 12700;
        }
    }
        break;
    }

    return 0;
}

export function traitType(type) {
    switch (type) {
        case 'trait':
            return 'trait';
        case 'action':
            return 'action';
        case 'legendary':
            return 'legendary action';
        case 'lair':
            return 'lair action';
        case 'regional':
            return 'regional effect';
        default:
            return type;
    }
}

export function nudgeChallenge(value, delta) {
    var result: number = 0;

    switch (value) {
    case 0:
        if (delta === -1) {
            result = 0;
        }
        if (delta === +1) {
            result = 0.125;
        }
        break;
    case 0.125:
        if (delta === -1) {
            result = 0;
        }
        if (delta === +1) {
            result = 0.25;
        }
        break;
    case 0.25:
        if (delta === -1) {
            result = 0.125;
        }
        if (delta === +1) {
            result = 0.5;
        }
        break;
    case 0.5:
        if (delta === -1) {
            result = 0.25;
        }
        if (delta === +1) {
            result = 1;
        }
        break;
    case 1:
        if (delta === -1) {
            result = 0.5;
        }
        if (delta === +1) {
            result = 2;
        }
        break;
    default:
        result = value + delta;
        break;
    }

    return result;
}

export function conditionText(condition) {
    switch (condition.name) {
    case 'blinded':
        return [
            'a blinded creature can’t see and automatically fails any ability check that requires sight',
            'attack rolls against the creature have advantage, and the creature’s attack rolls have disadvantage'
        ];
    case 'charmed':
        return [
            'a charmed creature can’t attack the charmer or target the charmer with harmful abilities or magical effects',
            'the charmer has advantage on any ability check to interact socially with the creature'
        ];
    case 'deafened':
        return [
            'a deafened creature can’t hear and automatically fails any ability check that requires hearing.'
        ];
    case 'exhaustion': {
        switch (condition.level) {
        case 1:
            return [
                'disadvantage on ability checks'
            ];
        case 2:
            return [
                'disadvantage on ability checks',
                'speed halved'
            ];
        case 3:
            return [
                'disadvantage on ability checks',
                'speed halved',
                'disadvantage on attack rolls and saving throws'
            ];
        case 4:
            return [
                'disadvantage on ability checks',
                'speed halved',
                'disadvantage on attack rolls and saving throws',
                'hit point maximum halved'
            ];
        case 5:
            return [
                'disadvantage on ability checks',
                'speed halved',
                'disadvantage on attack rolls and saving throws',
                'hit point maximum halved',
                'speed reduced to 0'
            ];
        case 6:
            return [
                'disadvantage on ability checks',
                'speed halved',
                'disadvantage on attack rolls and saving throws',
                'hit point maximum halved',
                'speed reduced to 0',
                'death'
            ];
        default:
            return [];
        }
    }
    case 'frightened':
        return [
            'a frightened creature has disadvantage on ability checks and attack rolls while the source of its fear is within line of sight',
            'the creature can’t willingly move closer to the source of its fear'
        ];
    case 'grappled':
        return [
            'a grappled creature’s speed becomes 0, and it can’t benefit from any bonus to its speed',
            'the condition ends if the grappler is incapacitated',
            'the condition also ends if an effect removes the grappled creature from the reach of the grappler or grappling effect'
        ];
    case 'incapacitated':
        return [
            'an incapacitated creature can’t take actions or reactions'
        ];
    case 'invisible':
        return [
            'an invisible creature is impossible to see without the aid of magic or a special sense',
            'for the purpose of hiding, the creature is heavily obscured',
            'the creature’s location can be detected by any noise it makes or any tracks it leaves',
            'attack rolls against the creature have disadvantage, and the creature’s attack rolls have advantage'
        ];
    case 'paralyzed':
        return [
            'a paralyzed creature is incapacitated (can’t take actions or reactions) and can’t move or speak',
            'the creature automatically fails strength and dexterity saving throws',
            'attack rolls against the creature have advantage',
            'any attack that hits the creature is a critical hit if the attacker is within 5 feet of the creature'
        ];
    case 'petrified':
        return [
            'a petrified creature is transformed, along with any nonmagical object it is wearing or carrying, into a solid inanimate substance (usually stone)',
            'its weight increases by a factor of ten, and it ceases aging',
            'the creature is incapacitated (can’t take actions or reactions), can’t move or speak, and is unaware of its surroundings',
            'attack rolls against the creature have advantage',
            'the creature automatically fails strength and dexterity saving throws',
            'the creature has resistance to all damage',
            'the creature is immune to poison and disease, although a poison or disease already in its system is suspended, not neutralized'
        ];
    case 'poisoned':
        return [
            'a poisoned creature has disadvantage on attack rolls and ability checks'
        ];
    case 'prone':
        return [
            'a prone creature’s only movement option is to crawl, unless it stands up and thereby ends the condition',
            'the creature has disadvantage on attack rolls',
            'an attack roll against the creature has advantage if the attacker is Within 5 feet of the creature; otherwise, the attack roll has disadvantage'
        ];
    case 'restrained':
        return [
            'a restrained creature’s speed becomes 0, and it can’t benefit from any bonus to its speed',
            'attack rolls against the creature have advantage, and the creature’s attack rolls have disadvantage',
            'the creature has disadvantage on dexterity saving throws'
        ];
    case 'stunned':
        return [
            'a stunned creature is incapacitated (can’t take actions or reactions), can’t move, and can speak only falteringly',
            'the creature automatically fails strength and dexterity saving throws',
            'attack rolls against the creature have advantage'
        ];
    case 'unconscious':
        return [
            'an unconscious creature is incapacitated (can’t take actions or reactions), can’t move or speak, and is unaware of its surroundings',
            'the creature drops whatever its holding and falls prone',
            'the creature automatically fails strength and dexterity saving throws',
            'attack rolls against the creature have advantage',
            'any attack that hits the creature is a critical hit if the attacker is within 5 feet of the creature'
        ];
    case "custom":
        return [];
    default:
        return [];
    }
}

export function conditionDurationText(condition, combat) {
    if (condition.duration !== null) {
        switch (condition.duration.type) {
            case "saves":
                var saveType = condition.duration.saveType;
                if (saveType !== "death") {
                    saveType = saveType.toUpperCase();
                }
                var saves = condition.duration.count > 1 ? "saves" : "save";
                return "until you make " + condition.duration.count + " " + saveType + " " + saves + " at dc " + condition.duration.saveDC;
            case "combatant":
                var point = condition.duration.point;
                var c = combat.combatants.find(c => c.id == condition.duration.combatantID);
                var combatant = c ? (c.displayName || c.name || "unnamed monster") + "'s" : "someone's";
                return "until the " + point + " of " + combatant + " next turn";
            case "rounds":
                var rounds = condition.duration.count > 1 ? "rounds" : "round";
                return "for " + condition.duration.count + " " + rounds;
        }
    }

    return null;
}

export function getMonsterNames(encounter) {
    var monsterNames: any[] = [];
    if (encounter) {
        encounter.slots.forEach(slot => {
            var names: any[] = [];
            if (slot.count === 1) {
                names.push(slot.monsterName);
            } else {
                for (var n = 0; n !== slot.count; ++n) {
                    names.push(slot.monsterName + " " + (n + 1));
                }
            }

            monsterNames.push({
                id: slot.id,
                names: names
            });
        });
    }

    return monsterNames;
}