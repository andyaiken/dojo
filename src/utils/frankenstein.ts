// This utility file deals with monster groups and monsters

import Factory from './factory';
import Utils from './utils';

import { Combatant } from '../models/combat';
import { Monster, Trait, TRAIT_TYPES } from '../models/monster-group';

export default class Frankenstein {
    public static getDescription(monster: Monster | (Monster & Combatant)) {
        let size = monster.size;
        const combatant = monster as Combatant;
        if (combatant) {
            size = combatant.displaySize || size;
        }
        let sizeAndType = (size + ' ' + monster.category).toLowerCase();
        if (monster.tag) {
            sizeAndType += ' (' + monster.tag.toLowerCase() + ')';
        }
        sizeAndType += ', ';

        let align = '';
        if (monster.alignment) {
            align = monster.alignment.toLowerCase() + ', ';
        }

        const cr = 'cr ' + Utils.challenge(monster.challenge);

        return sizeAndType + align + cr;
    }

    public static nudgeValue(target: Monster, field: string, delta: number) {
        let source: any = target;
        let value: any = null;
        const tokens = field.split('.');
        tokens.forEach(token => {
            if (token === tokens[tokens.length - 1]) {
                value = source[token];
            } else {
                source = source[token];
            }
        });

        let newValue;
        switch (field) {
            case 'challenge':
                newValue = Utils.nudgeChallenge(value, delta);
                break;
            case 'size':
                newValue = Utils.nudgeSize(value, delta);
                break;
            default:
                newValue = (value ? value : 0) + delta;
                break;
        }
        Frankenstein.changeValue(target, field, newValue);
    }

    public static changeValue(target: Monster, field: string, value: any) {
        let source: any = target;
        const tokens = field.split('.');
        tokens.forEach(token => {
            if (token === tokens[tokens.length - 1]) {
                source[token] = value;

                if ((field === 'abilityScores.con') || (field === 'size') || (field === 'hitDice')) {
                    const sides = Utils.hitDieType(target.size);
                    const conMod = Math.floor((target.abilityScores.con - 10) / 2);
                    const hpPerDie = ((sides + 1) / 2) + conMod;
                    const hp = Math.floor(target.hitDice * hpPerDie);
                    target.hpMax = hp;
                }
            } else {
                source = source[token];
            }
        });
    }

    public static clear(monster: Monster) {
        monster.name = '';
        monster.size = 'medium';
        monster.category = 'beast';
        monster.tag = '';
        monster.alignment = '';
        monster.challenge = 1;
        monster.abilityScores.str = 10;
        monster.abilityScores.dex = 10;
        monster.abilityScores.con = 10;
        monster.abilityScores.int = 10;
        monster.abilityScores.wis = 10;
        monster.abilityScores.cha = 10;
        monster.ac = 10;
        monster.hpMax = 0;
        monster.hitDice = 1;
        monster.damage.resist = '';
        monster.damage.vulnerable = '';
        monster.damage.immune = '';
        monster.savingThrows = '';
        monster.speed = '';
        monster.skills = '';
        monster.senses = '';
        monster.languages = '';
        monster.equipment = '';
        monster.traits = [];
        monster.conditionImmunities = '';
        monster.portrait = '';
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Monster creation

    public static clone(monster: Monster, name: string): Monster {
        return {
            id: Utils.guid(),
            type: 'monster',
            name: name || (monster.name + ' copy'),
            size: monster.size,
            category: monster.category,
            tag: monster.tag,
            alignment: monster.alignment,
            challenge: monster.challenge,
            abilityScores: {
                str: monster.abilityScores.str,
                dex: monster.abilityScores.dex,
                con: monster.abilityScores.con,
                int: monster.abilityScores.int,
                wis: monster.abilityScores.wis,
                cha: monster.abilityScores.cha
            },
            ac: monster.ac,
            hpMax: monster.hpMax,
            hitDice: monster.hitDice,
            damage: {
                resist: monster.damage.resist,
                vulnerable: monster.damage.vulnerable,
                immune: monster.damage.immune
            },
            savingThrows: monster.savingThrows,
            speed: monster.speed,
            skills: monster.skills,
            senses: monster.senses,
            languages: monster.languages,
            equipment: monster.equipment,
            traits: monster.traits.map(trait => {
                return {
                    id: Utils.guid(),
                    name: trait.name,
                    usage: trait.usage,
                    type: trait.type,
                    text: trait.text,
                    uses: 0
                };
            }),
            conditionImmunities: monster.conditionImmunities,
            portrait: monster.portrait
        };
    }

    public static createFromJSON(data: any): Monster {
        const monster = Factory.createMonster();

        monster.type = 'monster';
        monster.name = data.name;
        monster.size = data.size.toLowerCase();
        monster.category = data.type;
        monster.tag = data.subtype;
        monster.alignment = data.alignment;
        monster.challenge = Utils.parseChallenge(data.challenge_rating);
        monster.ac = data.armor_class;
        monster.hpMax = data.hit_points;
        monster.speed = data.speed;
        monster.senses = data.senses;
        monster.languages = data.languages;

        const index = data.hit_dice.indexOf('d');
        monster.hitDice = parseInt(data.hit_dice.substring(0, index), 10);

        monster.abilityScores.str = data.strength;
        monster.abilityScores.dex = data.dexterity;
        monster.abilityScores.con = data.constitution;
        monster.abilityScores.int = data.intelligence;
        monster.abilityScores.wis = data.wisdom;
        monster.abilityScores.cha = data.charisma;

        monster.damage.resist = data.damage_resistances;
        monster.damage.vulnerable = data.damage_vulnerabilities;
        monster.damage.immune = data.damage_immunities;
        monster.conditionImmunities = data.condition_immunities;

        const saves = [
            {
                field: 'strength_save',
                text: 'Strength'
            },
            {
                field: 'dexterity_save',
                text: 'Dexterity'
            },
            {
                field: 'constitution_save',
                text: 'Constitution'
            },
            {
                field: 'intelligence_save',
                text: 'Intelligence'
            },
            {
                field: 'wisdom_save',
                text: 'Wisdom'
            },
            {
                field: 'charisma_save',
                text: 'Charisma'
            }
        ];
        saves.forEach(save => {
            if (data[save.field]) {
                const str = save.text + ' ' + data[save.field];
                monster.savingThrows += monster.savingThrows === '' ? str : ', ' + str;
            }
        });

        const skills = [
            {
                field: 'acrobatics',
                text: 'Acrobatics'
            },
            {
                field: 'animal_handling',
                text: 'Animal handling'
            },
            {
                field: 'arcana',
                text: 'Arcana'
            },
            {
                field: 'athletics',
                text: 'Athletics'
            },
            {
                field: 'deception',
                text: 'Deception'
            },
            {
                field: 'history',
                text: 'History'
            },
            {
                field: 'insight',
                text: 'Insight'
            },
            {
                field: 'intimidation',
                text: 'Intimidation'
            },
            {
                field: 'investigation',
                text: 'Investigation'
            },
            {
                field: 'medicine',
                text: 'Medicine'
            },
            {
                field: 'nature',
                text: 'Nature'
            },
            {
                field: 'perception',
                text: 'Perception'
            },
            {
                field: 'performance',
                text: 'Performance'
            },
            {
                field: 'persuasion',
                text: 'Persuasion'
            },
            {
                field: 'religion',
                text: 'Religion'
            },
            {
                field: 'sleight_of_hand',
                text: 'Sleight of hand'
            },
            {
                field: 'stealth',
                text: 'Stealth'
            },
            {
                field: 'survival',
                text: 'Survival'
            }
        ];
        skills.forEach(skill => {
            if (data[skill.field]) {
                const str = skill.text + ' ' + data[skill.field];
                monster.skills += monster.skills === '' ? str : ', ' + str;
            }
        });

        if (data.special_abilities) {
            data.special_abilities.forEach((rawTrait: any) => {
                const trait = this.buildTrait(rawTrait, 'trait');
                monster.traits.push(trait);
            });
        }
        if (data.actions) {
            data.actions.forEach((rawTrait: any) => {
                const trait = this.buildTrait(rawTrait, 'action');
                monster.traits.push(trait);
            });
        }
        if (data.reactions) {
            data.reactions.forEach((rawTrait: any) => {
                const trait = this.buildTrait(rawTrait, 'reaction');
                monster.traits.push(trait);
            });
        }
        if (data.legendary_actions) {
            data.legendary_actions.forEach((rawTrait: any) => {
                const trait = this.buildTrait(rawTrait, 'legendary');
                monster.traits.push(trait);
            });
        }

        return monster;
    }

    private static buildTrait(rawTrait: any, type: 'trait' | 'action' | 'bonus' | 'reaction' | 'legendary' | 'lair'): Trait {
        let name = '';
        let usage = '';

        const openBracket = rawTrait.name.indexOf('(');
        if (openBracket === -1) {
            name = rawTrait.name;
        } else {
            const closeBracket = rawTrait.name.indexOf(')');
            name = rawTrait.name.substring(0, openBracket - 1);
            usage = rawTrait.name.substring(openBracket + 1, closeBracket).toLowerCase();
        }

        const text: string = rawTrait.desc.replace(/•/g, '*');

        let finalType = type;
        if (name === 'Lair Actions') {
            finalType = 'lair';
        }
        if (text.indexOf('As a bonus action') === 0) {
            finalType = 'bonus';
        }

        return {
            id: Utils.guid(),
            type: finalType,
            name: name,
            usage: usage,
            text: text,
            uses: 0
        };
    }

    public static import(source: string, monster: Monster): void {
        Frankenstein.clear(monster);

        const parser = new DOMParser();
        const doc = parser.parseFromString(source, 'text/html');

        try {
            monster.name = (doc.getElementsByClassName('mon-stat-block__name')[0] as HTMLElement).innerText.trim();
            let meta = (doc.getElementsByClassName('mon-stat-block__meta')[0] as HTMLElement).innerText.toLowerCase().trim();
            const firstSpace = meta.indexOf(' ');
            monster.size = meta.substring(0, firstSpace).trim();
            meta = meta.substring(firstSpace + 1).trim();
            const comma = meta.indexOf(',');
            monster.alignment = meta.substring(comma + 1).trim();
            meta = meta.substring(0, comma).trim();
            const open = meta.indexOf('(');
            const close = meta.indexOf(')');
            if ((open !== -1) && (close !== -1)) {
                monster.tag = meta.substring(open + 1, close).trim();
                meta = meta.substring(0, open).trim();
            }
            monster.category = meta;
        } catch (ex) {
            console.error(ex);
        }

        try {
            const attrs = doc.getElementsByClassName('mon-stat-block__attribute');
            for (let attrIndex = 0; attrIndex !== attrs.length; ++attrIndex) {
                const attr = attrs[attrIndex];
                const label = (attr.getElementsByClassName('mon-stat-block__attribute-label')[0] as HTMLElement).innerText.toLowerCase().trim();
                const value = (attr.getElementsByClassName('mon-stat-block__attribute-data-value')[0] as HTMLElement).innerText.toLowerCase().trim();
                switch (label) {
                    case 'armor class':
                        monster.ac = Number.parseInt(value, 10);
                        break;
                    case 'hit points':
                        monster.hpMax = Number.parseInt(value, 10);
                        const extra = (attr.getElementsByClassName('mon-stat-block__attribute-data-extra')[0] as HTMLElement).innerText.toLowerCase().trim();
                        monster.hitDice = Number.parseInt(extra.substring(1, extra.indexOf('d')), 10);
                        break;
                    case 'speed':
                        monster.speed = value;
                        break;
                }
            }
        } catch (ex) {
            console.error(ex);
        }

        try {
            const stats = doc.getElementsByClassName('ability-block__stat');
            for (let statIndex = 0; statIndex !== stats.length; ++statIndex) {
                const stat = stats[statIndex];
                const ability = (stat.getElementsByClassName('ability-block__heading')[0] as HTMLElement).innerText.toLowerCase().trim();
                const scoreStr = (stat.getElementsByClassName('ability-block__score')[0] as HTMLElement).innerText.toLowerCase().trim();
                const score = Number.parseInt(scoreStr, 10);
                monster.abilityScores[ability as 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha'] = score;
            }
        } catch (ex) {
            console.error(ex);
        }

        try {
            const tidbits = doc.getElementsByClassName('mon-stat-block__tidbit');
            for (let tidbitIndex = 0; tidbitIndex !== tidbits.length; ++tidbitIndex) {
                const tidbit = tidbits[tidbitIndex];
                const label = (tidbit.getElementsByClassName('mon-stat-block__tidbit-label')[0] as HTMLElement).innerText.toLowerCase().trim();
                const value = (tidbit.getElementsByClassName('mon-stat-block__tidbit-data')[0] as HTMLElement).innerText.toLowerCase().trim();
                switch (label) {
                    case 'saving throws':
                        monster.savingThrows = value;
                        break;
                    case 'skills':
                        monster.skills = value;
                        break;
                    case 'damage vulnerabilities':
                        monster.damage.vulnerable = value;
                        break;
                    case 'damage resistances':
                        monster.damage.resist = value;
                        break;
                    case 'damage immunities':
                        monster.damage.immune = value;
                        break;
                    case 'condition immunities':
                        monster.conditionImmunities = value;
                        break;
                    case 'senses':
                        monster.senses = value;
                        break;
                    case 'languages':
                        monster.languages = value;
                        break;
                    case 'challenge':
                        const sp = value.indexOf(' ');
                        monster.challenge = Number.parseInt(value.substring(0, sp), 10);
                        break;
                }
            }
        } catch (ex) {
            console.error(ex);
        }

        try {
            const blocks = doc.getElementsByClassName('mon-stat-block__description-block');
            for (let blockIndex = 0; blockIndex !== blocks.length; ++blockIndex) {
                const block = blocks[blockIndex];
                let traitType: 'trait' | 'action' | 'bonus' | 'reaction' | 'legendary' | 'lair' = 'trait';
                const headingElements = block.getElementsByClassName('mon-stat-block__description-block-heading');
                if (headingElements.length > 0) {
                    const heading = (headingElements[0] as HTMLElement).innerText.toLowerCase().trim();
                    switch (heading) {
                        case 'actions':
                            traitType = 'action';
                            break;
                        case 'bonus actions':
                            traitType = 'bonus';
                            break;
                        case 'reactions':
                            traitType = 'reaction';
                            break;
                        case 'legendary actions':
                            traitType = 'legendary';
                            break;
                        case 'lair actions':
                            traitType = 'lair';
                            break;
                    }
                }
                const traits = block.getElementsByTagName('p');
                for (let traitIndex = 0; traitIndex !== traits.length; ++traitIndex) {
                    let text = (traits[traitIndex] as HTMLElement).innerText.trim();
                    const t = Factory.createTrait();
                    t.type = traitType;
                    const stop = text.indexOf('.');
                    t.text = text.substring(stop + 1).trim();
                    text = text.substring(0, stop);
                    const open = text.indexOf('(');
                    const close = text.indexOf(')');
                    if ((open !== -1) && (close !== -1)) {
                        t.usage = text.substring(open + 1, close).trim();
                        text = text.substring(0, open).trim();
                    }
                    t.name = text;
                    if (t.name) {
                        monster.traits.push(t);
                    } else {
                        // This is part of the previous trait
                        const prev = monster.traits[monster.traits.length - 1];
                        prev.text += '\n';
                        prev.text += t.text;
                    }
                }
            }
        } catch (ex) {
            console.error(ex);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Traits

    public static copyTrait(target: Monster, trait: Trait) {
        const copy = JSON.parse(JSON.stringify(trait));
        copy.id = Utils.guid();
        target.traits.push(copy);
    }

    public static addTrait(target: Monster, type: 'trait' | 'action' | 'bonus' | 'reaction' | 'legendary' | 'lair') {
        const trait = Factory.createTrait();
        trait.type = type;
        trait.name = 'New ' + Utils.traitType(type, false).toLowerCase();
        target.traits.push(trait);
    }

    public static moveTrait(target: Monster, oldIndex: number, newIndex: number) {
        const t = target.traits.splice(oldIndex, 1);
        target.traits.splice(newIndex, 0, ...t);
    }

    public static removeTrait(target: Monster, trait: Trait) {
        const index = target.traits.indexOf(trait);
        target.traits.splice(index, 1);
    }

    public static swapTraits(target: Monster, t1: Trait, t2: Trait) {
        const index1 = target.traits.indexOf(t1);
        const index2 = target.traits.indexOf(t2);
        target.traits[index2] = t1;
        target.traits[index1] = t2;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Randomisation

    public static spliceMonsters(target: Monster, monsters: Monster[]) {
        const fields = [
            'size',
            'category',
            'tag',
            'alignment',
            'challenge',
            'speed',
            'senses',
            'languages',
            'equipment',
            'abilityScores.str',
            'abilityScores.dex',
            'abilityScores.con',
            'abilityScores.int',
            'abilityScores.wis',
            'abilityScores.cha',
            'savingThrows',
            'skills',
            'ac',
            'hitDice',
            'damage.resist',
            'damage.vulnerable',
            'damage.immune',
            'conditionImmunities'
        ];
        fields.forEach(field => {
            this.setRandomValue(target, field, monsters);
        });

        target.traits = [];

        TRAIT_TYPES.forEach(type => {
            // Get all traits of this type
            const traits: Trait[] = [];
            monsters.forEach(m => {
                m.traits.filter(t => t.type === type)
                    .forEach(t => traits.push(t));
            });

            // Collate by name
            const distinct: { trait: Trait, count: number }[] = [];
            traits.forEach(t => {
                const current = distinct.find(d => d.trait.name === t.name);
                if (current) {
                    current.count += 1;
                } else {
                    distinct.push({
                        trait: t,
                        count: 1
                    });
                }
            });

            // If any are common to all monsters, copy them and remove from the candidates
            const addedIDs: string[] = [];
            distinct.filter(d => d.count === monsters.length)
                .forEach(d => {
                    this.copyTrait(target, d.trait);
                    addedIDs.push(d.trait.id);
                });
            addedIDs.forEach(id => {
                const index = distinct.findIndex(d => d.trait.id === id);
                distinct.splice(index, 1);
            });

            const avg = traits.length / monsters.length;
            while (target.traits.filter(t => t.type === type).length < avg) {
                const index = Math.floor(Math.random() * distinct.length);
                const t = distinct[index].trait;
                this.copyTrait(target, t);
                distinct.splice(index, 1);
            }
        });
    }

    public static setRandomValue(target: Monster, field: string, monsters: Monster[]) {
        const index = Math.floor(Math.random() * monsters.length);
        const m = monsters[index];

        let source: any = m;
        let value = null;
        const tokens = field.split('.');
        tokens.forEach(token => {
            if (token === tokens[tokens.length - 1]) {
                value = source[token];
            } else {
                source = source[token];
            }
        });

        this.changeValue(target, field, value);
    }

    public static addRandomTrait(target: Monster, type: string, monsters: Monster[]) {
        const traits: Trait[] = [];
        monsters.forEach(m => {
            m.traits.filter(t => t.type === type)
                .forEach(t => {
                    traits.push(t);
                });
        });

        const index = Math.floor(Math.random() * traits.length);
        const trait = traits[index];

        this.copyTrait(target, trait);
    }
}
