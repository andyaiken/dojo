// This utility file deals with parties and pcs

import Factory from './factory';

import { Party, PC } from '../models/party';
import Utils from './utils';

export default class Hero {
    public static importParty(source: string, party: Party): void {
        party.name = '';
        party.pcs = [];

        const parser = new DOMParser();
        const doc = parser.parseFromString(source, 'text/html');

        try {
            party.name = (doc.getElementsByClassName('page-title')[0] as HTMLElement).innerText.trim();
        } catch (ex) {
            console.error(ex);
        }

        try {
            const active = doc.getElementsByClassName('ddb-campaigns-detail-body-listing ddb-campaigns-detail-body-listing-active')[0];
            const activeCards = active.getElementsByClassName('ddb-campaigns-character-card');
            for (let cardIndex = 0; cardIndex !== activeCards.length; ++cardIndex) {
                const card = activeCards[cardIndex] as HTMLElement;
                party.pcs.push(Hero.getCharacter(card, true));
            }
        } catch (ex) {
            console.error(ex);
        }

        try {
            const inactive = doc.getElementsByClassName('ddb-campaigns-detail-body-listing ddb-campaigns-detail-body-listing-inactive')[0];
            const inactiveCards = inactive.getElementsByClassName('ddb-campaigns-character-card');
            for (let cardIndex = 0; cardIndex !== inactiveCards.length; ++cardIndex) {
                const card = inactiveCards[cardIndex] as HTMLElement;
                party.pcs.push(Hero.getCharacter(card, false));
            }
        } catch (ex) {
            console.error(ex);
        }
    }

    private static getCharacter(card: HTMLElement, active: boolean) {
        const pc = Factory.createPC();

        pc.name = (card.getElementsByClassName('ddb-campaigns-character-card-header-upper-character-info-primary')[0] as HTMLElement)
            .innerText.trim();
        pc.player = (card.getElementsByClassName('ddb-campaigns-character-card-header-upper-character-info-secondary')[1] as HTMLElement)
            .innerText.trim().substring(8);
        pc.active = active;

        const strLevelRaceClass = (card.getElementsByClassName('ddb-campaigns-character-card-header-upper-character-info-secondary')[0] as HTMLElement)
            .innerText.trim();
        const tokens = strLevelRaceClass.split('|');
        pc.level = Number.parseInt(tokens[0].substring(4).trim(), 10);
        pc.race = tokens[1].trim();
        pc.classes = tokens[2].trim();

        const url = card.getElementsByClassName('ddb-campaigns-character-card-header-upper-details-link')[0] as HTMLElement;
        pc.url = 'https://www.dndbeyond.com' + url.getAttribute('href');

        return pc;
    }

    public static importPC(source: string, pc: PC): void {
        try {
            const json = JSON.parse(source);

            pc.name = json.character.name;
            pc.size = json.character.race.size;
            pc.race = json.character.race.fullName;

            let level = 0;
            let classes = '';
            json.character.classes.forEach((c: any) => {
                level += c.level;
                if (classes !== '') {
                    classes += ' / ';
                }
                classes += c.definition.name;
                if (c.subclassDefinition) {
                    classes += ' (' + c.subclassDefinition.name + ')';
                }
            });
            pc.classes = classes;
            pc.level = level;

            const modifiers: any[] = []
                .concat(json.character.modifiers.race)
                .concat(json.character.modifiers.class)
                .concat(json.character.modifiers.background)
                .concat(json.character.modifiers.item)
                .concat(json.character.modifiers.feat)
                .concat(json.character.modifiers.condition);

            const languages = modifiers.filter(mod => mod.type === 'language').map(mod => mod.friendlySubtypeName);
            pc.languages = languages.join(', ');

            const prof = Utils.proficiency(level);

            let int = json.character.stats[3].value;
            let wis = json.character.stats[4].value;
            modifiers.filter(mod => mod.type === 'bonus' && mod.subType === 'intelligence-score').forEach(mod => int += mod.value);
            modifiers.filter(mod => mod.type === 'bonus' && mod.subType === 'wisdom-score').forEach(mod => wis += mod.value);

            let profIns = 0;
            let profInv = 0;
            let profPerc = 0;
            const insTypes = modifiers.filter(mod => mod.subType === 'insight' || mod.subType === 'wisdom-ability-checks').map(mod => mod.type);
            if (insTypes.includes('expertise')) {
                profIns = 2;
            } else if (insTypes.includes('proficiency')) {
                profIns = 1;
            } else if (insTypes.includes('half-proficiency-round-up')) {
                profIns = 0.5;
            }
            const invTypes = modifiers.filter(mod => mod.subType === 'investigation' || mod.subType === 'intelligence-ability-checks').map(mod => mod.type);
            if (invTypes.includes('expertise')) {
                profInv = 2;
            } else if (invTypes.includes('proficiency')) {
                profInv = 1;
            } else if (insTypes.includes('half-proficiency-round-up')) {
                profInv = 0.5;
            }
            const percTypes = modifiers.filter(mod => mod.subType === 'perception' || mod.subType === 'wisdom-ability-checks').map(mod => mod.type);
            if (percTypes.includes('expertise')) {
                profPerc = 2;
            } else if (percTypes.includes('proficiency')) {
                profPerc = 1;
            } else if (insTypes.includes('half-proficiency-round-up')) {
                profPerc = 0.5;
            }

            pc.passiveInsight = 10 + Utils.modifierValue(wis) + Math.floor(prof * profIns);
            pc.passiveInvestigation = 10 + Utils.modifierValue(int) + Math.floor(prof * profInv);
            pc.passivePerception = 10 + Utils.modifierValue(wis) + Math.floor(prof * profPerc);

            pc.companions = [];
            json.character.creatures.forEach((creature: any) => {
                const companion = Factory.createCompanion();
                companion.name = creature.name;
                pc.companions.push(companion);
            });

            // TODO: Portrait
        } catch (e) {
            console.error(e);
        }
    }
}
