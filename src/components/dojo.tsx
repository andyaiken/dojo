import React from 'react';

import { Col, Drawer, Row } from 'antd';

import Factory from '../utils/factory';
import Frankenstein from '../utils/frankenstein';
import Mercator from '../utils/mercator';
import Napoleon from '../utils/napoleon';
import Utils from '../utils/utils';

import { Combat, Combatant, CombatSetup, Notification } from '../models/combat';
import { Condition } from '../models/condition';
import { Encounter, EncounterSlot, EncounterWave, MonsterFilter } from '../models/encounter';
import { Map, MapFolio, MapItem } from '../models/map-folio';
import { Monster, MonsterGroup } from '../models/monster-group';
import { Party, PC } from '../models/party';

import Checkbox from './controls/checkbox';
import AboutModal from './modals/about-modal';
import AddCombatantsModal from './modals/add-combatants-modal';
import CombatStartModal from './modals/combat-start-modal';
import ConditionModal from './modals/condition-modal';
import MapEditorModal from './modals/map-editor-modal';
import MonsterEditorModal from './modals/monster-editor-modal';
import MonsterImportModal from './modals/monster-import-modal';
import PartyImportModal from './modals/party-import-modal';
import PCEditorModal from './modals/pc-editor-modal';
import SearchModal from './modals/search-modal';
import ToolsModal from './modals/tools-modal';
import PageFooter from './panels/page-footer';
import PageHeader from './panels/page-header';
import PageNavigation from './panels/page-navigation';
import CombatListScreen from './screens/combat-list-screen';
import CombatScreen from './screens/combat-screen';
import EncounterListScreen from './screens/encounter-list-screen';
import EncounterScreen from './screens/encounter-screen';
import HomeScreen from './screens/home-screen';
import MapListScreen from './screens/map-list-screen';
import MapScreen from './screens/map-screen';
import MonsterListScreen from './screens/monster-list-screen';
import MonsterScreen from './screens/monster-screen';
import PartyListScreen from './screens/party-list-screen';
import PartyScreen from './screens/party-screen';

// tslint:disable-next-line:no-empty-interface
interface Props {
    // No props; this is the root component
}

interface State {
    view: 'home' | 'parties' | 'library' | 'encounters' | 'maps' | 'combat';
    navigation: boolean;
    drawer: any;

    parties: Party[];
    library: MonsterGroup[];
    encounters: Encounter[];
    mapFolios: MapFolio[];
    combats: Combat[];

    selectedPartyID: string | null;
    selectedMonsterGroupID: string | null;
    selectedEncounterID: string | null;
    selectedMapFolioID: string | null;
    selectedCombatID: string | null;
}

export default class Dojo extends React.Component<Props, State> {

    //#region Constructor

    constructor(props: Props) {
        super(props);

        let parties: Party[] = [];
        try {
            const str = window.localStorage.getItem('data-parties');
            if (str) {
                parties = JSON.parse(str);
            }
        } catch (ex) {
            console.error('Could not parse JSON: ', ex);
        }

        let library: MonsterGroup[] = [];
        try {
            const str = window.localStorage.getItem('data-library');
            if (str) {
                library = JSON.parse(str);
            }
        } catch (ex) {
            console.error('Could not parse JSON: ', ex);
        }

        let encounters: Encounter[] = [];
        try {
            const str = window.localStorage.getItem('data-encounters');
            if (str) {
                encounters = JSON.parse(str);
            }
        } catch (ex) {
            console.error('Could not parse JSON: ', ex);
        }

        let mapFolios: MapFolio[] = [];
        try {
            const str = window.localStorage.getItem('data-mapfolios');
            if (str) {
                mapFolios = JSON.parse(str);
            }
        } catch (ex) {
            console.error('Could not parse JSON: ', ex);
        }

        let combats: Combat[] = [];
        try {
            const str = window.localStorage.getItem('data-combats');
            if (str) {
                combats = JSON.parse(str);
            }
        } catch (ex) {
            console.error('Could not parse JSON: ', ex);
        }

        this.state = {
            view: 'home',
            navigation: false,
            drawer: null,
            parties: parties,
            library: library,
            encounters: encounters,
            mapFolios: mapFolios,
            combats: combats,
            selectedPartyID: null,
            selectedMonsterGroupID: null,
            selectedEncounterID: null,
            selectedMapFolioID: null,
            selectedCombatID: null
        };
    }

    //#endregion

    //#region Lifecycle

    public componentDidUpdate() {
        this.saveAfterDelay();
    }

    //#endregion

    //#region Helper methods

    private setView(view: 'home' | 'parties' | 'library' | 'encounters' | 'maps' | 'combat') {
        this.save();
        this.setState({
            view: view
        });
    }

    private openToolsDrawer(type: string) {
        this.setState({
            drawer: {
                type: type
            }
        });
    }

    private toggleNavigation() {
        this.setState({
            navigation: !this.state.navigation
        });
    }

    private closeDrawer() {
        this.setState({
            drawer: null
        });
    }

    private selectParty(party: Party | null) {
        this.setState({
            selectedPartyID: party ? party.id : null
        });
    }

    private selectMonsterGroup(group: MonsterGroup | null) {
        this.setState({
            selectedMonsterGroupID: group ? group.id : null
        });
    }

    private selectEncounter(encounter: Encounter | null) {
        this.setState({
            selectedEncounterID: encounter ? encounter.id : null
        });
    }

    private selectMapFolio(mapFolio: MapFolio | null) {
        this.setState({
            selectedMapFolioID: mapFolio ? mapFolio.id : null
        });
    }

    private selectPartyByID(id: string | null) {
        this.save();
        this.setState({
            view: 'parties',
            navigation: false,
            selectedPartyID: id
        });
    }

    private selectMonsterGroupByID(id: string | null) {
        this.save();
        this.setState({
            view: 'library',
            navigation: false,
            selectedMonsterGroupID: id
        });
    }

    private selectEncounterByID(id: string | null) {
        this.save();
        this.setState({
            view: 'encounters',
            navigation: false,
            selectedEncounterID: id
        });
    }

    private selectMapFolioByID(id: string | null) {
        this.save();
        this.setState({
            view: 'maps',
            navigation: false,
            selectedMapFolioID: id
        });
    }

    private selectCombatByID(id: string | null) {
        this.save();
        if ((this.state.selectedCombatID !== null) && (id === null)) {
            this.pauseCombat();
        } else {
            this.setState({
                view: 'combat',
                navigation: false,
                selectedCombatID: id
            });
        }
    }

    private resetAll() {
        this.setState({
            parties: [],
            selectedPartyID: null,
            library: [],
            selectedMonsterGroupID: null,
            encounters: [],
            selectedEncounterID: null,
            mapFolios: [],
            selectedMapFolioID: null,
            combats: [],
            selectedCombatID: null
        });
    }

    private getMonster(monsterName: string, groupName: string) {
        const group = this.state.library.find(p => p.name === groupName);
        if (group) {
            const monster = group.monsters.find(m => m.name === monsterName);
            if (monster) {
                return monster;
            }
        }

        return null;
    }

    private changeValue(combatant: any, type: string, value: any) {
        switch (type) {
            case 'hp':
                value = Math.min(value, combatant.hpMax);
                value = Math.max(value, 0);
                break;
            case 'hpTemp':
                value = Math.max(value, 0);
                break;
            case 'level':
                value = Math.max(value, 1);
                value = (combatant.player !== undefined) ? Math.min(value, 20) : Math.min(value, 6);
                break;
            case 'count':
                value = Math.max(value, 1);
                break;
            case 'hitDice':
                value = Math.max(value, 1);
                break;
            default:
                // Do nothing
                break;
        }

        const tokens = type.split('.');
        let obj = combatant;
        for (let n = 0; n !== tokens.length; ++n) {
            const token = tokens[n];
            if (n === tokens.length - 1) {
                obj[token] = value;
            } else {
                obj = obj[token];
            }
        }

        Utils.sort(this.state.parties);
        Utils.sort(this.state.library);
        Utils.sort(this.state.encounters);

        if (type === 'initiative') {
            if (!(combatant as Combatant).pending) {
                const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
                this.sortCombatants(combat as Combat);
            }
        }

        this.setState({
            parties: this.state.parties,
            library: this.state.library,
            encounters: this.state.encounters,
            combats: this.state.combats,
            selectedPartyID: this.state.selectedPartyID,
            selectedMonsterGroupID: this.state.selectedMonsterGroupID,
            selectedEncounterID: this.state.selectedEncounterID,
            selectedCombatID: this.state.selectedCombatID,
            drawer: this.state.drawer
        });
    }

    private nudgeValue(combatant: any, type: string, delta: number) {
        const tokens = type.split('.');
        let obj = combatant;
        for (let n = 0; n !== tokens.length; ++n) {
            const token = tokens[n];
            if (n === tokens.length - 1) {
                let value = null;
                switch (token) {
                    case 'challenge':
                        value = Utils.nudgeChallenge(obj[token], delta);
                        break;
                    case 'size':
                    case 'displaySize':
                        value = Utils.nudgeSize(obj[token], delta);
                        break;
                    default:
                        value = obj[token] + delta;
                }
                this.changeValue(combatant, type, value);
            } else {
                obj = obj[token];
            }
        }
    }

    //#endregion

    //#region Party screen

    private addParty() {
        const party = Factory.createParty();
        party.name = 'new party';
        const parties: Party[] = ([] as Party[]).concat(this.state.parties, [party]);
        Utils.sort(parties);
        this.setState({
            parties: parties,
            selectedPartyID: party.id
        });
    }

    private removeCurrentParty() {
        const party = this.state.parties.find(p => p.id === this.state.selectedPartyID);
        if (party) {
            this.removeParty(party);
        }
    }

    private removeParty(party: Party) {
        const index = this.state.parties.indexOf(party);
        this.state.parties.splice(index, 1);
        this.setState({
            parties: this.state.parties,
            selectedPartyID: null
        });
    }

    private importParty() {
        this.setState({
            drawer: {
                type: 'import-party',
                party: Factory.createParty()
            }
        });
    }

    private acceptImportedParty() {
        this.state.parties.push(this.state.drawer.party);
        this.setState({
            parties: this.state.parties,
            drawer: null
        });
    }

    private addPC() {
        const party = this.state.parties.find(p => p.id === this.state.selectedPartyID);
        if (party) {
            const pc = Factory.createPC();
            pc.name = 'new pc';
            party.pcs.push(pc);
            this.setState({
                parties: this.state.parties
            });
        }
    }

    private removePC(pc: PC) {
        const party = this.state.parties.find(p => p.id === this.state.selectedPartyID);
        if (party) {
            const index = party.pcs.indexOf(pc);
            party.pcs.splice(index, 1);
            this.setState({
                parties: this.state.parties
            });
        }
    }

    private sortPCs() {
        const party = this.state.parties.find(p => p.id === this.state.selectedPartyID);
        if (party) {
            Utils.sort(party.pcs);
            this.setState({
                parties: this.state.parties
            });
        }
    }

    private editPC(pc: PC) {
        const copy = JSON.parse(JSON.stringify(pc));
        this.setState({
            drawer: {
                type: 'pc',
                pc: copy
            }
        });
    }

    private savePC() {
        Utils.sort(this.state.drawer.pc.companions);
        const party = this.state.parties.find(p => p.id === this.state.selectedPartyID);
        if (party) {
            const original = party.pcs.find(pc => pc.id === this.state.drawer.pc.id);
            if (original) {
                const index = party.pcs.indexOf(original);
                party.pcs[index] = this.state.drawer.pc;
                this.setState({
                    parties: this.state.parties,
                    drawer: null
                });
            }
        }
    }

    //#endregion

    //#region Library screen

    private addMonsterGroup() {
        const group = Factory.createMonsterGroup();
        group.name = 'new group';
        const library = ([] as MonsterGroup[]).concat(this.state.library, [group]);
        Utils.sort(library);
        this.setState({
            library: library,
            selectedMonsterGroupID: group.id
        });
    }

    private removeCurrentMonsterGroup() {
        const group = this.state.library.find(g => g.id === this.state.selectedMonsterGroupID);
        if (group) {
            this.removeMonsterGroup(group);
        }
    }

    private removeMonsterGroup(group: MonsterGroup) {
        const index = this.state.library.indexOf(group);
        this.state.library.splice(index, 1);
        this.setState({
            library: this.state.library,
            selectedMonsterGroupID: null
        });
    }

    private addMonster() {
        const monster = Factory.createMonster();
        monster.name = 'new monster';
        const group = this.state.library.find(g => g.id === this.state.selectedMonsterGroupID);
        if (group) {
            group.monsters.push(monster);
            this.setState({
                library: this.state.library
            });
        }
    }

    private removeMonster(monster: Monster) {
        const group = this.state.library.find(g => g.id === this.state.selectedMonsterGroupID);
        if (group) {
            const index = group.monsters.indexOf(monster);
            group.monsters.splice(index, 1);
            this.setState({
                library: this.state.library
            });
        }
    }

    private importMonster() {
        this.setState({
            drawer: {
                type: 'import-monster',
                monster: Factory.createMonster()
            }
        });
    }

    private acceptImportedMonster() {
        const group = this.state.library.find(g => g.id === this.state.selectedMonsterGroupID);
        if (group) {
            group.monsters.push(this.state.drawer.monster);
            this.setState({
                library: this.state.library,
                drawer: null
            });
        }
    }

    private sortMonsters() {
        const group = this.state.library.find(g => g.id === this.state.selectedMonsterGroupID);
        if (group) {
            Utils.sort(group.monsters);
            this.setState({
                library: this.state.library
            });
        }
    }

    private moveToGroup(monster: Monster, groupID: string) {
        const sourceGroup = this.state.library.find(group => group.monsters.includes(monster));
        if (sourceGroup) {
            const index = sourceGroup.monsters.indexOf(monster);
            sourceGroup.monsters.splice(index, 1);

            const group = this.state.library.find(g => g.id === groupID);
            if (group) {
                group.monsters.push(monster);
                Utils.sort(group.monsters);

                this.setState({
                    library: this.state.library
                });
            }
        }
    }

    private editMonster(monster: Monster) {
        const copy = JSON.parse(JSON.stringify(monster));
        this.setState({
            drawer: {
                type: 'monster',
                monster: copy,
                showSidebar: false
            }
        });
    }

    private saveMonster() {
        const group = this.state.library.find(g => g.id === this.state.selectedMonsterGroupID);
        if (group) {
            const original = group.monsters.find(m => m.id === this.state.drawer.monster.id);
            if (original) {
                // We are editing a monster
                const index = group.monsters.indexOf(original);
                group.monsters[index] = this.state.drawer.monster;
                this.setState({
                    library: this.state.library,
                    drawer: null
                });
            } else {
                // We are adding a new monster
                group.monsters.push(this.state.drawer.monster);
                this.setState({
                    library: this.state.library,
                    drawer: null
                });
            }
        }
    }

    private toggleShowSidebar() {
        // eslint-disable-next-line
        this.state.drawer.showSidebar = !this.state.drawer.showSidebar;
        this.setState({
            drawer: this.state.drawer
        });
    }

    private cloneMonster(monster: Monster, name: string) {
        const group = this.state.library.find(g => g.monsters.includes(monster));
        if (group) {
            const clone = Frankenstein.clone(monster, name);
            group.monsters.push(clone);
            Utils.sort(group.monsters);

            this.setState({
                library: this.state.library
            });
        }
    }

    private addOpenGameContent() {
        fetch('./data/monsters.json')
            .then(response => response.json())
            .then(json => {
                json.forEach((data: any) => {
                    try {
                        if (data.name) {
                            const monster = Frankenstein.createFromJSON(data);

                            let groupName = monster.tag || monster.category;
                            if (groupName.indexOf('swarm') === 0) {
                                groupName = 'swarm';
                            }
                            if (groupName === 'any race') {
                                groupName = 'npc';
                            }

                            let group = this.state.library.find(p => p.name === groupName);
                            if (!group) {
                                group = {
                                    id: Utils.guid(),
                                    name: groupName,
                                    monsters: []
                                };
                                this.state.library.push(group);
                            }
                            group.monsters.push(monster);
                        }
                    } catch (e) {
                        console.error(e);
                    }
                });

                Utils.sort(this.state.library);

                this.setState({
                    view: 'library',
                    library: this.state.library
                });
            });
    }

    //#endregion

    //#region Encounter screen

    private addEncounter() {
        const encounter = Factory.createEncounter();
        encounter.name = 'new encounter';
        const encounters = ([] as Encounter[]).concat(this.state.encounters, [encounter]);
        Utils.sort(encounters);

        this.setState({
            encounters: encounters,
            selectedEncounterID: encounter.id
        });
    }

    private clearEncounter() {
        const encounter = this.state.encounters.find(e => e.id === this.state.selectedEncounterID);
        if (encounter) {
            encounter.slots = [];
            encounter.waves = [];

            this.setState({
                encounters: this.state.encounters
            });
        }
    }

    private removeCurrentEncounter() {
        const encounter = this.state.encounters.find(e => e.id === this.state.selectedEncounterID);
        if (encounter) {
            this.removeEncounter(encounter);
        }
    }

    private removeEncounter(encounter: Encounter) {
        const index = this.state.encounters.indexOf(encounter);
        this.state.encounters.splice(index, 1);

        this.setState({
            encounters: this.state.encounters,
            selectedEncounterID: null
        });
    }

    private buildEncounter(xp: number, filter: MonsterFilter) {
        const encounter = this.state.encounters.find(e => e.id === this.state.selectedEncounterID);
        if (encounter) {
            encounter.slots = [];
            encounter.waves = [];

            Napoleon.buildEncounter(encounter, xp, filter, this.state.library, (monsterName, groupName) => this.getMonster(monsterName, groupName));
            this.sortEncounterSlots(encounter);

            this.setState({
                encounters: this.state.encounters
            });
        }
    }

    private addEncounterSlot(monster: Monster, waveID: string | null) {
        const group = this.state.library.find(g => g.monsters.includes(monster));
        if (group) {
            const slot = Factory.createEncounterSlot();
            slot.monsterGroupName = group.name;
            slot.monsterName = monster.name;
            const encounter = this.state.encounters.find(e => e.id === this.state.selectedEncounterID);
            if (encounter) {
                if (waveID !== null) {
                    const wave = encounter.waves.find(w => w.id === waveID);
                    if (wave) {
                        wave.slots.push(slot);
                        this.sortEncounterSlots(wave);
                    }
                } else {
                    encounter.slots.push(slot);
                    this.sortEncounterSlots(encounter);
                }

                this.setState({
                    encounters: this.state.encounters
                });
            }
        }
    }

    private removeEncounterSlot(slot: EncounterSlot, waveID: string | null) {
        const encounter = this.state.encounters.find(e => e.id === this.state.selectedEncounterID);
        if (encounter) {
            if (waveID) {
                const wave = encounter.waves.find(w => w.id === waveID);
                if (wave) {
                    const index = wave.slots.indexOf(slot);
                    wave.slots.splice(index, 1);
                }
            } else {
                const n = encounter.slots.indexOf(slot);
                encounter.slots.splice(n, 1);
            }

            this.setState({
                encounters: this.state.encounters
            });
        }
    }

    private swapEncounterSlot(slot: EncounterSlot, waveID: string | null, groupName: string, monsterName: string) {
        const encounter = this.state.encounters.find(e => e.id === this.state.selectedEncounterID);
        if (encounter) {
            slot.monsterGroupName = groupName;
            slot.monsterName = monsterName;

            if (waveID) {
                const wave = encounter.waves.find(w => w.id === waveID);
                if (wave) {
                    this.sortEncounterSlots(wave);
                }
            } else {
                this.sortEncounterSlots(encounter);
            }

            this.setState({
                encounters: this.state.encounters
            });
        }
    }

    private sortEncounterSlots(slotContainer: { slots: EncounterSlot[] }) {
        slotContainer.slots.sort((a, b) => {
            const aName = a.monsterName.toLowerCase();
            const bName = b.monsterName.toLowerCase();
            if (aName < bName) { return -1; }
            if (aName > bName) { return 1; }
            return 0;
        });
    }

    private addWaveToEncounter() {
        const encounter = this.state.encounters.find(e => e.id === this.state.selectedEncounterID);
        if (encounter) {
            const wave = Factory.createEncounterWave();
            wave.name = 'wave ' + (encounter.waves.length + 2);
            encounter.waves.push(wave);

            this.setState({
                encounters: this.state.encounters
            });
        }
    }

    private removeWave(wave: EncounterWave) {
        const encounter = this.state.encounters.find(e => e.id === this.state.selectedEncounterID);
        if (encounter) {
            const index = encounter.waves.indexOf(wave);
            encounter.waves.splice(index, 1);

            this.setState({
                encounters: this.state.encounters
            });
        }
    }

    //#endregion

    //#region Map screen

    private addMapFolio() {
        const folio = Factory.createMapFolio();
        folio.name = 'new folio';
        const folios = ([] as MapFolio[]).concat(this.state.mapFolios, [folio]);
        Utils.sort(folios);

        this.setState({
            mapFolios: folios,
            selectedMapFolioID: folio.id
        });
    }

    private removeCurrentMapFolio() {
        const folio = this.state.mapFolios.find(f => f.id === this.state.selectedMapFolioID);
        if (folio) {
            this.removeMapFolio(folio);
        }
    }

    private removeMapFolio(folio: MapFolio) {
        const index = this.state.mapFolios.indexOf(folio);
        this.state.mapFolios.splice(index, 1);

        this.setState({
            mapFolios: this.state.mapFolios,
            selectedMapFolioID: null
        });
    }

    private addMap() {
        const folio = this.state.mapFolios.find(f => f.id === this.state.selectedMapFolioID);
        if (folio) {
            const map = Factory.createMap();
            map.name = 'new map';
            folio.maps.push(map);

            this.setState({
                mapFolios: this.state.mapFolios
            });
        }
    }

    private editMap(map: Map) {
        const copy = JSON.parse(JSON.stringify(map));
        this.setState({
            drawer: {
                type: 'map',
                map: copy
            }
        });
    }

    private saveMap() {
        const folio = this.state.mapFolios.find(f => f.id === this.state.selectedMapFolioID);
        if (folio) {
            const original = folio.maps.find(m => m.id === this.state.drawer.map.id);
            if (original) {
                const index = folio.maps.indexOf(original);
                folio.maps[index] = this.state.drawer.map;
                this.setState({
                    mapFolios: this.state.mapFolios,
                    drawer: null
                });
            }
        }
    }

    private removeMap(map: Map) {
        const folio = this.state.mapFolios.find(f => f.id === this.state.selectedMapFolioID);
        if (folio) {
            const index = folio.maps.indexOf(map);
            folio.maps.splice(index, 1);
            this.setState({
                mapFolios: this.state.mapFolios
            });
        }
    }

    //#endregion

    //#region Combat screen

    private createCombat() {
        const party = this.state.parties.length === 1 ? this.state.parties[0] : null;
        const encounter = this.state.encounters.length === 1 ? this.state.encounters[0] : null;

        const setup = Factory.createCombatSetup();
        setup.partyID = party ? party.id : null;
        setup.encounterID = encounter ? encounter.id : null;
        if (encounter) {
            setup.monsterNames = Utils.getMonsterNames(encounter);
        }

        this.setState({
            drawer: {
                type: 'combat-start',
                combatSetup: setup
            }
        });
    }

    private startCombat() {
        const combatSetup: CombatSetup = this.state.drawer.combatSetup;
        const party = this.state.parties.find(p => p.id === combatSetup.partyID);
        const encounter = this.state.encounters.find(e => e.id === combatSetup.encounterID);
        if (party && encounter) {
            const partyName = party.name || 'unnamed party';
            const encounterName = encounter.name || 'unnamed encounter';

            const combat = Factory.createCombat();
            combat.name = partyName + ' vs ' + encounterName;
            combat.encounterID = encounter.id;

            // Add a copy of each PC to the encounter
            party.pcs.filter(pc => pc.active).forEach(pc => {
                this.addPCToCombat(pc, combat);
            });

            encounter.slots.forEach(slot => {
                const monster = this.getMonster(slot.monsterName, slot.monsterGroupName);
                if (monster) {
                    const groupInitRoll = Utils.dieRoll();

                    for (let n = 0; n !== slot.count; ++n) {
                        let displayName = null;
                        if (combatSetup.monsterNames) {
                            const slotNames = combatSetup.monsterNames.find(names => names.id === slot.id);
                            if (slotNames) {
                                displayName = slotNames.names[n];
                            }
                        }

                        this.addMonsterToCombat(monster, combat, displayName, combatSetup.encounterInitMode, groupInitRoll);
                    }
                } else {
                    combat.issues.push('unknown monster: ' + slot.monsterName + ' in group ' + slot.monsterGroupName);
                }
            });

            this.sortCombatants(combat);

            if (combatSetup.folioID && combatSetup.mapID) {
                const folio = this.state.mapFolios.find(f => f.id === combatSetup.folioID);
                if (folio) {
                    const map = folio.maps.find(m => m.id === combatSetup.mapID);
                    if (map) {
                        combat.map = JSON.parse(JSON.stringify(map));
                    }
                }
            }

            this.setState({
                combats: ([] as Combat[]).concat(this.state.combats, [combat]),
                selectedCombatID: combat.id,
                drawer: null
            });
        }
    }

    private addPCToCombat(pc: PC, combat: Combat) {
        const combatant = JSON.parse(JSON.stringify(pc));

        combatant.current = false;
        combatant.pending = true;
        combatant.active = false;
        combatant.defeated = false;

        combatant.displayName = pc.name;
        combatant.displaySize = pc.size;
        combatant.showOnMap = true;
        combatant.initiative = 10;
        combatant.hp = null;
        combatant.conditions = [];
        combatant.tags = [];
        combatant.altitude = 0;
        combatant.aura = { radius: 0, style: 'rounded', color: '#005080' };

        combat.combatants.push(combatant);
    }

    private addMonsterToCombat(
        monster: Monster,
        combat: Combat, displayName: string | null = null,
        initMode: 'manual' | 'individual' | 'group' = 'individual',
        groupInitRoll: number = 0) {

        const combatant = JSON.parse(JSON.stringify(monster));
        combatant.id = Utils.guid();

        switch (initMode) {
            case 'group':
                combatant.initiative = Utils.modifierValue(monster.abilityScores.dex) + groupInitRoll;
                break;
            case 'individual':
                combatant.initiative = Utils.modifierValue(monster.abilityScores.dex) + Utils.dieRoll();
                break;
            default:
                combatant.initiative = 10;
                break;
        }

        combatant.current = false;
        combatant.pending = (initMode === 'manual');
        combatant.active = (initMode !== 'manual');
        combatant.defeated = false;

        combatant.displayName = displayName;
        combatant.displaySize = monster.size;
        combatant.showOnMap = true;
        combatant.hp = combatant.hpMax;
        combatant.conditions = [];
        combatant.tags = [];
        combatant.altitude = 0;
        combatant.aura = { radius: 0, style: 'rounded', color: '#005080' };

        combat.combatants.push(combatant);
    }

    private openWaveModal() {
        const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
        if (combat) {
            const encounter = this.state.encounters.find(e => e.id === combat.encounterID);
            if (encounter) {
                const setup = Factory.createCombatSetup();
                setup.encounterID = combat.encounterID;
                setup.monsterNames = Utils.getMonsterNames(encounter);

                this.setState({
                    drawer: {
                        type: 'combat-wave',
                        combatSetup: setup
                    }
                });
            }
        }
    }

    private addToEncounter() {
        const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
        if (combat) {
            this.setState({
                drawer: {
                    type: 'combat-add-combatants',
                    combatantSlots: [],
                    combat: combat
                }
            });
        }
    }

    private addCombatantsFromModal() {
        const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
        if (combat) {
            this.state.drawer.combatantSlots.forEach((slot: EncounterSlot) => {
                const m = this.getMonster(slot.monsterName, slot.monsterGroupName);
                if (m) {
                    const roll = Utils.dieRoll();
                    for (let n = 0; n !== slot.count; ++n) {
                        let displayName = m.name;
                        if (slot.count > 1) {
                            displayName += ' ' + (n + 1);
                        }
                        this.addMonsterToCombat(m, combat, displayName, 'group', roll);
                    }
                }
            });

            this.sortCombatants(combat);

            this.setState({
                combats: this.state.combats,
                drawer: null
            });
        }
    }

    private pauseCombat() {
        const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
        if (combat) {
            combat.timestamp = new Date().toLocaleString();
            this.setState({
                view: 'combat',
                combats: this.state.combats,
                selectedCombatID: null
            });
        }
    }

    private resumeCombat(combat: Combat) {
        this.setState({
            selectedCombatID: combat.id
        });
    }

    private endCurrentCombat() {
        const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
        if (combat) {
            this.endCombat(combat);
        }
    }

    private endCombat(combat: Combat) {
        const index = this.state.combats.indexOf(combat);
        this.state.combats.splice(index, 1);
        this.setState({
            combats: this.state.combats,
            selectedCombatID: null
        });
    }

    private makeCurrent(combatant: Combatant | null, newRound: boolean) {
        const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
        if (combat) {
            // Handle start-of-turn conditions
            combat.combatants.filter(actor => actor.conditions).forEach(actor => {
                actor.conditions.forEach(c => {
                    if (c.duration) {
                        switch (c.duration.type) {
                            case 'saves':
                                // If it's my condition, and point is START, notify the user
                                if (combat && combatant && (actor.id === combatant.id) && (c.duration.point === 'start')) {
                                    combat.notifications.push({
                                        id: Utils.guid(),
                                        type: 'condition-save',
                                        data: c,
                                        combatant: combatant as Combatant & Monster
                                    });
                                }
                                break;
                            case 'combatant':
                                // If this refers to me, and point is START, remove it
                                if (combat && combatant && (c.duration.combatantID === combatant.id) && (c.duration.point === 'start')) {
                                    const index = actor.conditions.indexOf(c);
                                    actor.conditions.splice(index, 1);
                                    // Notify the user
                                    combat.notifications.push({
                                        id: Utils.guid(),
                                        type: 'condition-end',
                                        data: c,
                                        combatant: combatant as Combatant & Monster
                                    });
                                }
                                break;
                            case 'rounds':
                                // If it's my condition, decrement the condition
                                if (combatant && (actor.id === combatant.id)) {
                                    c.duration.count -= 1;
                                }
                                // If it's now at 0, remove it
                                if (c.duration.count === 0) {
                                    const n = actor.conditions.indexOf(c);
                                    actor.conditions.splice(n, 1);
                                    if (combat) {
                                        // Notify the user
                                        combat.notifications.push({
                                            id: Utils.guid(),
                                            type: 'condition-end',
                                            data: c,
                                            combatant: combatant as Combatant & Monster
                                        });
                                    }
                                }
                                break;
                            default:
                                // Do nothing
                                break;
                        }
                    }
                });
            });

            // Handle recharging traits
            if (combatant && (combatant.type === 'monster')) {
                (combatant as Combatant & Monster).traits
                    .filter(t => (t.uses > 0) && t.usage.toLowerCase().startsWith('recharge '))
                    .forEach(t => {
                        combat.notifications.push({
                            id: Utils.guid(),
                            type: 'trait-recharge',
                            data: t,
                            combatant: combatant as Combatant & Monster
                        });
                    });
                (combatant as Combatant & Monster).traits
                    .filter(t => t.type === 'legendary')
                    .forEach(t => {
                        t.uses = 0;
                    });
            }

            combat.combatants.forEach(c => {
                c.current = false;
            });
            if (combatant) {
                combatant.current = true;
            }

            if (newRound) {
                combat.round += 1;
            }

            this.setState({
                combats: this.state.combats
            });
        }
    }

    private makeActive(combatant: Combatant) {
        const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
        if (combat) {
            combatant.pending = false;
            combatant.active = true;
            combatant.defeated = false;

            this.sortCombatants(combat);

            this.setState({
                combats: this.state.combats
            });
        }
    }

    private makeDefeated(combatant: Combatant) {
        combatant.pending = false;
        combatant.active = false;
        combatant.defeated = true;

        if (combatant.type === 'monster') {
            // If this monster is on the map, remove them from it
            const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
            if (combat && combat.map) {
                combat.map.items = combat.map.items.filter(item => item.id !== combatant.id);
            }
        }

        if (combatant.current) {
            this.endTurn(combatant);
        } else {
            this.setState({
                combats: this.state.combats
            });
        }
    }

    private addWaveToCombat() {
        const combatSetup: CombatSetup = this.state.drawer.combatSetup;
        const encounter = this.state.encounters.find(e => e.id === combatSetup.encounterID);
        const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
        if (combatSetup && encounter && combat) {
            const wave = encounter.waves.find(w => w.id === combatSetup.waveID);
            if (wave) {
                wave.slots.forEach(slot => {
                    const monster = this.getMonster(slot.monsterName, slot.monsterGroupName);
                    if (monster) {
                        const init = parseInt(Utils.modifier(monster.abilityScores.dex), 10);
                        const groupRoll = Utils.dieRoll();

                        for (let n = 0; n !== slot.count; ++n) {
                            const singleRoll = Utils.dieRoll();

                            const combatant = JSON.parse(JSON.stringify(monster));
                            combatant.id = Utils.guid();

                            combatant.displayName = null;
                            if (combatSetup.monsterNames) {
                                const slotNames = combatSetup.monsterNames.find(names => names.id === slot.id);
                                if (slotNames) {
                                    combatant.displayName = slotNames.names[n];
                                }
                            }

                            combatant.displaySize = monster.size;

                            switch (combatSetup.encounterInitMode) {
                                case 'manual':
                                    combatant.initiative = 10;
                                    break;
                                case 'group':
                                    combatant.initiative = init + groupRoll;
                                    break;
                                case 'individual':
                                    combatant.initiative = init + singleRoll;
                                    break;
                                default:
                                    // Do nothing
                                    break;
                            }

                            combatant.showOnMap = true;
                            combatant.current = false;
                            combatant.pending = (this.state.drawer.combatSetup.encounterInitMode === 'manual');
                            combatant.active = (this.state.drawer.combatSetup.encounterInitMode !== 'manual');
                            combatant.defeated = false;

                            combatant.hp = combatant.hpMax;
                            combatant.conditions = [];
                            combatant.tags = [];
                            combatant.altitude = 0;
                            combatant.aura = { radius: 0, style: 'rounded', color: '#005080' };

                            if (combat) {
                                combat.combatants.push(combatant);
                            }
                        }
                    } else {
                        if (combat) {
                            const issue = 'unknown monster: ' + slot.monsterName + ' in group ' + slot.monsterGroupName;
                            combat.issues.push(issue);
                        }
                    }
                });

                this.sortCombatants(combat);

                this.setState({
                    combats: this.state.combats,
                    drawer: null
                });
            }
        }
    }

    private removeCombatant(combatant: Combatant) {
        const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
        if (combat) {
            const index = combat.combatants.indexOf(combatant);
            combat.combatants.splice(index, 1);

            if (combat.map) {
                const item = combat.map.items.find(i => i.id === combatant.id);
                if (item) {
                    const n = combat.map.items.indexOf(item);
                    combat.map.items.splice(n, 1);
                }
            }

            this.setState({
                combats: this.state.combats
            });
        }
    }

    private mapAdd(combatant: Combatant, x: number, y: number) {
        const item = Factory.createMapItem();
        item.id = combatant.id;
        item.type = combatant.type as 'pc' | 'monster';
        item.x = x;
        item.y = y;
        let size = 1;
        if (combatant.type === 'monster') {
            size = Utils.miniSize((combatant as Combatant & Monster).size);
        }
        item.height = size;
        item.width = size;

        const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
        if (combat && combat.map) {
            combat.map.items.push(item);

            this.setState({
                combats: this.state.combats
            });
        }
    }

    private mapMove(id: string, dir: string) {
        const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
        if (combat && combat.map) {
            const item = combat.map.items.find(i => i.id === id);
            if (item) {
                switch (dir) {
                    case 'N':
                        item.y -= 1;
                        break;
                    case 'NE':
                        item.x += 1;
                        item.y -= 1;
                        break;
                    case 'E':
                        item.x += 1;
                        break;
                    case 'SE':
                        item.x += 1;
                        item.y += 1;
                        break;
                    case 'S':
                        item.y += 1;
                        break;
                    case 'SW':
                        item.x -= 1;
                        item.y += 1;
                        break;
                    case 'W':
                        item.x -= 1;
                        break;
                    case 'NW':
                        item.x -= 1;
                        item.y -= 1;
                        break;
                    default:
                        // Do nothing
                        break;
                }

                this.setState({
                    combats: this.state.combats
                });
            }
        }
    }

    private mapResize(id: string, dir: string, dir2: 'out' | 'in') {
        const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
        if (combat && combat.map) {
            const item = combat.map.items.find(i => i.id === id);
            if (item) {
                switch (dir2) {
                    case 'in':
                        switch (dir) {
                            case 'N':
                                if (item.height > 1) {
                                    item.y += 1;
                                    item.height -= 1;
                                }
                                break;
                            case 'E':
                                if (item.width > 1) {
                                    item.width -= 1;
                                }
                                break;
                            case 'S':
                                if (item.height > 1) {
                                    item.height -= 1;
                                }
                                break;
                            case 'W':
                                if (item.width > 1) {
                                    item.x += 1;
                                    item.width -= 1;
                                }
                                break;
                        }
                        break;
                    case 'out':
                        switch (dir) {
                            case 'N':
                                item.y -= 1;
                                item.height += 1;
                                break;
                            case 'E':
                                item.width += 1;
                                break;
                            case 'S':
                                item.height += 1;
                                break;
                            case 'W':
                                item.x -= 1;
                                item.width += 1;
                                break;
                        }
                        break;
                }

                this.setState({
                    combats: this.state.combats
                });
            }
        }
    }

    private mapRemove(id: string) {
        const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
        if (combat && combat.map) {
            const item = combat.map.items.find(i => i.id === id);
            if (item) {
                const index = combat.map.items.indexOf(item);
                combat.map.items.splice(index, 1);

                this.setState({
                    combats: this.state.combats
                });
            }
        }
    }

    private endTurn(combatant: Combatant) {
        const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
        if (combat) {
            // Handle end-of-turn conditions
            combat.combatants.filter(actor => actor.conditions).forEach(actor => {
                actor.conditions.forEach(c => {
                    if (c.duration) {
                        switch (c.duration.type) {
                            case 'saves':
                                // If it's my condition, and point is END, notify the user
                                if (combat && (actor.id === combatant.id) && (c.duration.point === 'end')) {
                                    const saveNotification = Factory.createNotification();
                                    saveNotification.type = 'condition-save';
                                    saveNotification.data = c;
                                    saveNotification.combatant = combatant as Combatant & Monster;
                                    combat.notifications.push(saveNotification);
                                }
                                break;
                            case 'combatant':
                                // If this refers to me, and point is END, remove it
                                if (combat && (c.duration.combatantID === combatant.id) && (c.duration.point === 'end')) {
                                    const n = actor.conditions.indexOf(c);
                                    actor.conditions.splice(n, 1);
                                    // Notify the user
                                    const endNotification = Factory.createNotification();
                                    endNotification.type = 'condition-end';
                                    endNotification.data = c;
                                    endNotification.combatant = combatant as Combatant & Monster;
                                    combat.notifications.push(endNotification);
                                }
                                break;
                            case 'rounds':
                                // We check this at the beginning of each turn, not at the end
                                break;
                            default:
                                // Do nothing
                                break;
                        }
                    }
                });
            });

            const active = combat.combatants.filter(c => {
                return c.current || (!c.pending && c.active && !c.defeated);
            });
            if (active.length === 0) {
                // There's no-one left in the fight
                this.makeCurrent(null, false);
            } else if ((active.length === 1) && (active[0].defeated)) {
                // The only person in the fight is me, and I'm defeated
                this.makeCurrent(null, false);
            } else {
                let index = active.indexOf(combatant) + 1;
                let newRound = false;
                if (index >= active.length) {
                    index = 0;
                    newRound = true;
                }
                this.makeCurrent(active[index], newRound);
            }
        }
    }

    private changeHP(combatant: Combatant & Monster, hp: number, temp: number) {
        combatant.hp = hp;
        combatant.hpTemp = temp;

        this.setState({
            combats: this.state.combats
        });
    }

    private addCondition(combatant: Combatant) {
        const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
        if (combat) {
            const condition = Factory.createCondition();
            condition.name = 'blinded';

            this.setState({
                drawer: {
                    type: 'condition-add',
                    condition: condition,
                    combatant: combatant,
                    combat: combat
                }
            });
        }
    }

    private addConditionFromModal() {
        const conditions: Condition[] = this.state.drawer.combatant.conditions;
        conditions.push(this.state.drawer.condition);

        // eslint-disable-next-line
        this.state.drawer.combatant.conditions = Utils.sort(conditions, [{ field: 'name', dir: 'asc' }]);

        this.setState({
            combats: this.state.combats,
            drawer: null
        });
    }

    private editCondition(combatant: Combatant, condition: Condition) {
        const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
        if (combat) {
            this.setState({
                drawer: {
                    type: 'condition-edit',
                    condition: condition,
                    combatant: combatant,
                    combat: combat
                }
            });
        }
    }

    private editConditionFromModal() {
        const conditions: Condition[] = this.state.drawer.combatant.conditions;
        const original = conditions.find(c => c.id === this.state.drawer.condition.id);
        if (original) {
            const index = conditions.indexOf(original);
            // eslint-disable-next-line
            conditions[index] = this.state.drawer.condition;

            // eslint-disable-next-line
            this.state.drawer.combatant.conditions = Utils.sort(conditions, [{ field: 'name', dir: 'asc' }]);

            this.setState({
                combats: this.state.combats,
                drawer: null
            });
        }
    }

    private removeCondition(combatant: Combatant, conditionID: string) {
        const condition = combatant.conditions.find(c => c.id === conditionID);
        if (condition) {
            const index = combatant.conditions.indexOf(condition);
            combatant.conditions.splice(index, 1);

            this.setState({
                combats: this.state.combats
            });
        }
    }

    private sortCombatants(combat: Combat) {
        combat.combatants.sort((a, b) => {
            // First sort by initiative, descending
            if (a.initiative && b.initiative && (a.initiative < b.initiative)) { return 1; }
            if (a.initiative && b.initiative && (a.initiative > b.initiative)) { return -1; }
            // Then sort by name, ascending
            if (a.displayName < b.displayName) { return -1; }
            if (a.displayName > b.displayName) { return 1; }
            return 0;
        });
    }

    private closeNotification(notification: Notification, removeCondition: boolean) {
        const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
        if (combat) {
            const index = combat.notifications.indexOf(notification);
            combat.notifications.splice(index, 1);

            if (removeCondition && notification.combatant && notification.data) {
                const conditionIndex = notification.combatant.conditions.indexOf(notification.data as Condition);
                notification.combatant.conditions.splice(conditionIndex, 1);
            }

            this.setState({
                combats: this.state.combats
            });
        }
    }

    private toggleTag(combatant: Combatant, tag: string) {
        if (combatant.tags.includes(tag)) {
            combatant.tags = combatant.tags.filter(t => t !== tag);
        } else {
            combatant.tags.push(tag);
        }

        this.setState({
            combats: this.state.combats
        });
    }

    private toggleCondition(combatant: Combatant, condition: string) {
        const existing = combatant.conditions.find(c => c.name === condition);
        if (existing) {
            this.removeCondition(combatant, existing.id);
        } else {
            const c = Factory.createCondition();
            c.name = condition;
            combatant.conditions.push(c);

            combatant.conditions = Utils.sort(combatant.conditions, [{ field: 'name', dir: 'asc' }]);

            this.setState({
                combats: this.state.combats
            });
        }
    }

    private scatterCombatants(type: 'pc' | 'monster') {
        const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
        if (combat && combat.map) {
            Mercator.scatterCombatants(combat, type);

            this.setState({
                combats: this.state.combats
            });
        }
    }

    private rotateMap() {
        const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
        if (combat && combat.map) {
            Mercator.rotateMap(combat.map);

            this.setState({
                combats: this.state.combats
            });
        }
    }

    private addMapItem(item: MapItem) {
        const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
        if (combat && combat.map) {
            combat.map.items.push(item);

            this.setState({
                combats: this.state.combats
            });
        }
    }

    //#endregion

    //#region Saving

    private saveAfterDelay = Utils.debounce(() => this.saveAll(), 10000);

    private save() {
        switch (this.state.view) {
            case 'parties':
                this.saveKey(this.state.parties, 'data-parties');
                break;
            case 'library':
                this.saveKey(this.state.library, 'data-library');
                break;
            case 'encounters':
                this.saveKey(this.state.encounters, 'data-encounters');
                break;
            case 'maps':
                this.saveKey(this.state.mapFolios, 'data-mapfolios');
                break;
            case 'combat':
                this.saveKey(this.state.combats, 'data-combats');
                break;
        }
    }

    private saveAll() {
        this.saveKey(this.state.parties, 'data-parties');
        this.saveKey(this.state.library, 'data-library');
        this.saveKey(this.state.encounters, 'data-encounters');
        this.saveKey(this.state.mapFolios, 'data-mapfolios');
        this.saveKey(this.state.combats, 'data-combats');
    }

    private saveKey(obj: any, key: string) {
        try {
            const json = JSON.stringify(obj);

            const mb = json.length / (1024 * 1024);
            if (mb >= 1) {
                console.info('Saving (' + key + '): ' + mb.toFixed(2) + ' MB');
            } else {
                const kb = json.length / 1024;
                if (kb >= 1) {
                    console.info('Saving (' + key + '): ' + kb.toFixed(2) + ' KB');
                } else {
                    console.info('Saving (' + key + '): ' + json.length + ' B');
                }
            }

            window.localStorage.setItem(key, json);
        } catch (ex) {
            console.error('Could not stringify data: ', ex);
        }
    }

    //#endregion

    //#region Rendering

    private getContent() {
        switch (this.state.view) {
            case 'home':
                return (
                    <HomeScreen
                        library={this.state.library}
                        addOpenGameContent={() => this.addOpenGameContent()}
                    />
                );
            case 'parties':
                if (this.state.selectedPartyID) {
                    return (
                        <PartyScreen
                            party={this.state.parties.find(p => p.id === this.state.selectedPartyID) as Party}
                            goBack={() => this.selectParty(null)}
                            removeParty={() => this.removeCurrentParty()}
                            addPC={() => this.addPC()}
                            editPC={pc => this.editPC(pc)}
                            removePC={pc => this.removePC(pc)}
                            sortPCs={() => this.sortPCs()}
                            changeValue={(combatant, type, value) => this.changeValue(combatant, type, value)}
                            nudgeValue={(combatant, type, delta) => this.nudgeValue(combatant, type, delta)}
                        />
                    );
                } else {
                    return (
                        <PartyListScreen
                            parties={this.state.parties}
                            addParty={() => this.addParty()}
                            importParty={() => this.importParty()}
                            selectParty={party => this.selectParty(party)}
                            deleteParty={party => this.removeParty(party)}
                        />
                    );
                }
            case 'library':
                if (this.state.selectedMonsterGroupID) {
                    return (
                        <MonsterScreen
                            monsterGroup={this.state.library.find(g => g.id === this.state.selectedMonsterGroupID) as MonsterGroup}
                            library={this.state.library}
                            goBack={() => this.selectMonsterGroup(null)}
                            removeMonsterGroup={() => this.removeCurrentMonsterGroup()}
                            addMonster={() => this.addMonster()}
                            importMonster={() => this.importMonster()}
                            removeMonster={monster => this.removeMonster(monster)}
                            sortMonsters={() => this.sortMonsters()}
                            changeValue={(combatant, type, value) => this.changeValue(combatant, type, value)}
                            nudgeValue={(combatant, type, delta) => this.nudgeValue(combatant, type, delta)}
                            editMonster={combatant => this.editMonster(combatant)}
                            cloneMonster={(combatant, name) => this.cloneMonster(combatant, name)}
                            moveToGroup={(combatant, groupID) => this.moveToGroup(combatant, groupID)}
                        />
                    );
                } else {
                    return (
                        <MonsterListScreen
                            library={this.state.library}
                            addMonsterGroup={() => this.addMonsterGroup()}
                            selectMonsterGroup={group => this.selectMonsterGroup(group)}
                            deleteMonsterGroup={group => this.removeMonsterGroup(group)}
                        />
                    );
                }
            case 'encounters':
                if (this.state.selectedEncounterID) {
                    return (
                        <EncounterScreen
                            encounter={this.state.encounters.find(e => e.id === this.state.selectedEncounterID) as Encounter}
                            parties={this.state.parties}
                            library={this.state.library}
                            goBack={() => this.selectEncounter(null)}
                            clearEncounter={() => this.clearEncounter()}
                            removeEncounter={() => this.removeCurrentEncounter()}
                            buildEncounter={(xp, filter) => this.buildEncounter(xp, filter)}
                            addWave={() => this.addWaveToEncounter()}
                            removeWave={wave => this.removeWave(wave)}
                            getMonster={(monsterName, groupName) => this.getMonster(monsterName, groupName)}
                            addEncounterSlot={(monster, waveID) => this.addEncounterSlot(monster, waveID)}
                            removeEncounterSlot={(slot, waveID) => this.removeEncounterSlot(slot, waveID)}
                            swapEncounterSlot={(s, waveID, groupID, monsterID) => this.swapEncounterSlot(s, waveID, groupID, monsterID)}
                            nudgeValue={(slot, type, delta) => this.nudgeValue(slot, type, delta)}
                            changeValue={(combatant, type, value) => this.changeValue(combatant, type, value)}
                        />
                    );
                } else {
                    return (
                        <EncounterListScreen
                            encounters={this.state.encounters}
                            addEncounter={() => this.addEncounter()}
                            selectEncounter={encounter => this.selectEncounter(encounter)}
                            deleteEncounter={encounter => this.removeEncounter(encounter)}
                            getMonster={(monsterName, groupName) => this.getMonster(monsterName, groupName)}
                        />
                    );
                }
            case 'maps':
                if (this.state.selectedMapFolioID) {
                    return (
                        <MapScreen
                            mapFolio={this.state.mapFolios.find(f => f.id === this.state.selectedMapFolioID) as MapFolio}
                            goBack={() => this.selectMapFolio(null)}
                            removeMapFolio={() => this.removeCurrentMapFolio()}
                            addMap={() => this.addMap()}
                            editMap={map => this.editMap(map)}
                            removeMap={map => this.removeMap(map)}
                            changeValue={(source, type, value) => this.changeValue(source, type, value)}
                        />
                    );
                } else {
                    return (
                        <MapListScreen
                            mapFolios={this.state.mapFolios}
                            addMapFolio={() => this.addMapFolio()}
                            selectMapFolio={folio => this.selectMapFolio(folio)}
                            deleteMapFolio={folio => this.removeMapFolio(folio)}
                        />
                    );
                }
            case 'combat':
                if (this.state.selectedCombatID) {
                    return (
                        <CombatScreen
                            combat={this.state.combats.find(c => c.id === this.state.selectedCombatID) as Combat}
                            encounters={this.state.encounters}
                            pauseCombat={() => this.pauseCombat()}
                            endCombat={() => this.endCurrentCombat()}
                            nudgeValue={(combatant, type, delta) => this.nudgeValue(combatant, type, delta)}
                            changeValue={(combatant, type, value) => this.changeValue(combatant, type, value)}
                            makeCurrent={(combatant) => this.makeCurrent(combatant, false)}
                            makeActive={(combatant) => this.makeActive(combatant)}
                            makeDefeated={(combatant) => this.makeDefeated(combatant)}
                            removeCombatant={(combatant) => this.removeCombatant(combatant)}
                            addCombatants={() => this.addToEncounter()}
                            addWave={() => this.openWaveModal()}
                            addCondition={(combatant) => this.addCondition(combatant)}
                            editCondition={(combatant, condition) => this.editCondition(combatant, condition)}
                            removeCondition={(combatant, conditionID) => this.removeCondition(combatant, conditionID)}
                            mapAdd={(combatant, x, y) => this.mapAdd(combatant, x, y)}
                            mapResize={(id, dir, dir2) => this.mapResize(id, dir, dir2)}
                            mapMove={(id, dir) => this.mapMove(id, dir)}
                            mapRemove={id => this.mapRemove(id)}
                            endTurn={(combatant) => this.endTurn(combatant)}
                            changeHP={(combatant, hp, temp) => this.changeHP(combatant, hp, temp)}
                            closeNotification={(notification, removeCondition) => this.closeNotification(notification, removeCondition)}
                            toggleTag={(combatant, tag) => this.toggleTag(combatant, tag)}
                            toggleCondition={(combatant, condition) => this.toggleCondition(combatant, condition)}
                            scatterCombatants={type => this.scatterCombatants(type)}
                            rotateMap={() => this.rotateMap()}
                            addOverlay={overlay => this.addMapItem(overlay)}
                        />
                    );
                } else {
                    return (
                        <CombatListScreen
                            combats={this.state.combats}
                            createCombat={() => this.createCombat()}
                            resumeCombat={combat => this.resumeCombat(combat)}
                            deleteCombat={combat => this.endCombat(combat)}
                        />
                    );
                }
        }

        return null;
    }

    private getDrawer() {
        let content = null;
        let header = null;
        let footer = null;
        let width = '50%';
        let closable = false;

        if (this.state.drawer) {
            switch (this.state.drawer.type) {
                case 'pc':
                    content = (
                        <PCEditorModal
                            pc={this.state.drawer.pc}
                        />
                    );
                    header = 'pc editor';
                    footer = (
                        <Row gutter={10}>
                            <Col span={12}>
                                <button onClick={() => this.savePC()}>save changes</button>
                            </Col>
                            <Col span={12}>
                                <button onClick={() => this.closeDrawer()}>discard changes</button>
                            </Col>
                        </Row>
                    );
                    break;
                case 'monster':
                    content = (
                        <MonsterEditorModal
                            monster={this.state.drawer.monster}
                            library={this.state.library}
                            showSidebar={this.state.drawer.showSidebar}
                        />
                    );
                    header = 'monster editor';
                    footer = (
                        <Row gutter={10}>
                            <Col span={8}>
                                <Checkbox
                                    label='advanced tools'
                                    checked={this.state.drawer.showSidebar}
                                    changeValue={() => this.toggleShowSidebar()}
                                />
                            </Col>
                            <Col span={8}>
                                <button onClick={() => this.saveMonster()}>save changes</button>
                            </Col>
                            <Col span={8}>
                                <button onClick={() => this.closeDrawer()}>discard changes</button>
                            </Col>
                        </Row>
                    );
                    width = '75%';
                    break;
                case 'import-party':
                    content = (
                        <PartyImportModal
                            party={this.state.drawer.party}
                        />
                    );
                    header = 'import party';
                    footer = (
                        <button onClick={() => this.acceptImportedParty()}>
                            accept party
                        </button>
                    );
                    closable = true;
                    break;
                case 'import-monster':
                    content = (
                        <MonsterImportModal
                            monster={this.state.drawer.monster}
                        />
                    );
                    header = 'import monster';
                    footer = (
                        <button onClick={() => this.acceptImportedMonster()}>
                            accept monster
                        </button>
                    );
                    closable = true;
                    break;
                case 'map':
                    content = (
                        <MapEditorModal
                            map={this.state.drawer.map}
                        />
                    );
                    header = 'map editor';
                    footer = (
                        <Row gutter={10}>
                            <Col span={12}>
                                <button onClick={() => this.saveMap()}>save changes</button>
                            </Col>
                            <Col span={12}>
                                <button onClick={() => this.closeDrawer()}>discard changes</button>
                            </Col>
                        </Row>
                    );
                    width = '75%';
                    break;
                case 'combat-start':
                    content = (
                        <CombatStartModal
                            combatSetup={this.state.drawer.combatSetup}
                            parties={this.state.parties}
                            encounters={this.state.encounters}
                            mapFolios={this.state.mapFolios}
                            getMonster={(monsterName, groupName) => this.getMonster(monsterName, groupName)}
                            notify={() => this.setState({drawer: this.state.drawer})}
                        />
                    );
                    header = 'start combat';
                    footer = (
                        <button
                            className={this.state.drawer.combatSetup.partyID && this.state.drawer.combatSetup.encounterID ? '' : 'disabled'}
                            onClick={() => this.startCombat()}
                        >
                            start encounter
                        </button>
                    );
                    width = '75%';
                    closable = true;
                    break;
                case 'combat-wave':
                    content = (
                        <CombatStartModal
                            combatSetup={this.state.drawer.combatSetup}
                            encounters={this.state.encounters}
                            getMonster={(monsterName, groupName) => this.getMonster(monsterName, groupName)}
                            notify={() => this.setState({drawer: this.state.drawer})}
                        />
                    );
                    header = 'add a wave';
                    footer = (
                        <button
                            className={this.state.drawer.combatSetup.waveID !== null ? '' : 'disabled'}
                            onClick={() => this.addWaveToCombat()}
                        >
                            add wave
                        </button>
                    );
                    width = '75%';
                    closable = true;
                    break;
                case 'combat-add-combatants':
                    content = (
                        <AddCombatantsModal
                            combatantSlots={this.state.drawer.combatantSlots}
                            library={this.state.library}
                        />
                    );
                    header = 'add combatants';
                    footer = (
                        <button onClick={() => this.addCombatantsFromModal()}>add combatants</button>
                    );
                    closable = true;
                    break;
                case 'condition-add':
                    content = (
                        <ConditionModal
                            condition={this.state.drawer.condition}
                            combatant={this.state.drawer.combatant}
                            combat={this.state.drawer.combat}
                        />
                    );
                    header = 'add a condition';
                    footer = (
                        <button onClick={() => this.addConditionFromModal()}>add</button>
                    );
                    closable = true;
                    break;
                case 'condition-edit':
                    content = (
                        <ConditionModal
                            condition={this.state.drawer.condition}
                            combatant={this.state.drawer.combatant}
                            combat={this.state.drawer.combat}
                        />
                    );
                    header = 'edit condition';
                    footer = (
                        <Row gutter={10}>
                            <Col span={12}>
                                <button onClick={() => this.editConditionFromModal()}>save changes</button>
                            </Col>
                            <Col span={12}>
                                <button onClick={() => this.closeDrawer()}>discard changes</button>
                            </Col>
                        </Row>
                    );
                    break;
                case 'tools':
                    content = (
                        <ToolsModal
                            library={this.state.library}
                        />
                    );
                    header = 'dm tools';
                    closable = true;
                    break;
                case 'search':
                    content = (
                        <SearchModal
                            parties={this.state.parties}
                            library={this.state.library}
                            encounters={this.state.encounters}
                            folios={this.state.mapFolios}
                            openParty={id => this.selectPartyByID(id)}
                            openGroup={id => this.selectMonsterGroupByID(id)}
                            openEncounter={id => this.selectEncounterByID(id)}
                            openFolio={id => this.selectMapFolioByID(id)}
                        />
                    );
                    header = 'search';
                    closable = true;
                    break;
                case 'about':
                    content = (
                        <AboutModal
                            resetAll={() => this.resetAll()}
                        />
                    );
                    header = 'about';
                    closable = true;
                    break;
            }
        }

        return {
            content: content,
            header: header,
            footer: footer,
            width: width,
            closable: closable
        };
    }

    public render() {
        try {
            const content = this.getContent();
            const drawer = this.getDrawer();

            return (
                <div className='dojo'>
                    <PageHeader
                        view={this.state.view}
                        openMenu={() => this.toggleNavigation()}
                        openDrawer={type => this.openToolsDrawer(type)}
                    />
                    <div className='page-content'>
                        {content}
                    </div>
                    <PageFooter
                        view={this.state.view}
                        parties={this.state.parties}
                        library={this.state.library}
                        encounters={this.state.encounters}
                        combats={this.state.combats}
                        setView={view => this.setView(view)}
                    />
                    <Drawer
                        placement={'left'}
                        closable={false}
                        maskClosable={true}
                        width={'25%'}
                        visible={this.state.navigation}
                        onClose={() => this.toggleNavigation()}
                    >
                        <div className='drawer-header' />
                        <div className='drawer-content'>
                            <PageNavigation
                                parties={this.state.parties}
                                library={this.state.library}
                                encounters={this.state.encounters}
                                maps={this.state.mapFolios}
                                combats={this.state.combats}
                                openParty={id => this.selectPartyByID(id)}
                                openMonsterGroup={id => this.selectMonsterGroupByID(id)}
                                openEncounter={id => this.selectEncounterByID(id)}
                                openMapFolio={id => this.selectMapFolioByID(id)}
                                openCombat={id => this.selectCombatByID(id)}
                            />
                        </div>
                        <div className='drawer-footer' />
                    </Drawer>
                    <Drawer
                        closable={false}
                        maskClosable={drawer.closable}
                        width={drawer.width}
                        visible={drawer.content !== null}
                        onClose={() => this.closeDrawer()}
                    >
                        <div className='drawer-header'><div className='text'>{drawer.header}</div></div>
                        <div className='drawer-content'>{drawer.content}</div>
                        <div className='drawer-footer'>{drawer.footer}</div>
                    </Drawer>
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }

    //#endregion
}
