// This utility file deals with parties and pcs

import Factory from './factory';

import { Party } from '../models/party';

export default class Hero {
    public static import(source: string, party: Party): void {
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
                party.pcs.push(Hero.importPC(card, true));
            }
        } catch (ex) {
            console.error(ex);
        }

        try {
            const inactive = doc.getElementsByClassName('ddb-campaigns-detail-body-listing ddb-campaigns-detail-body-listing-inactive')[0];
            const inactiveCards = inactive.getElementsByClassName('ddb-campaigns-character-card');
            for (let cardIndex = 0; cardIndex !== inactiveCards.length; ++cardIndex) {
                const card = inactiveCards[cardIndex] as HTMLElement;
                party.pcs.push(Hero.importPC(card, false));
            }
        } catch (ex) {
            console.error(ex);
        }
    }

    private static importPC(card: HTMLElement, active: boolean) {
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
}
