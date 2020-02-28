import React from 'react';

import { Col, Drawer, Row } from 'antd';

import Factory from '../utils/factory';
import Frankenstein from '../utils/frankenstein';
import Mercator from '../utils/mercator';
import Utils from '../utils/utils';

import { Combat, Combatant, CombatSetup, Notification } from '../models/combat';
import { Condition } from '../models/condition';
import { Encounter, EncounterSlot } from '../models/encounter';
import { Map, MapItem } from '../models/map';
import { Monster, MonsterGroup } from '../models/monster-group';
import { Companion, Party, PC } from '../models/party';

import Checkbox from './controls/checkbox';
import AboutModal from './modals/about-modal';
import AddCombatantsModal from './modals/add-combatants-modal';
import CombatStartModal from './modals/combat-start-modal';
import ConditionModal from './modals/condition-modal';
import DemographicsModal from './modals/demographics-modal';
import EncounterEditorModal from './modals/encounter-editor-modal';
import LeaderboardModal from './modals/leaderboard-modal';
import MapEditorModal from './modals/map-editor-modal';
import MonsterEditorModal from './modals/monster-editor-modal';
import MonsterImportModal from './modals/monster-import-modal';
import MonsterInfoModal from './modals/monster-info-modal';
import PartyImportModal from './modals/party-import-modal';
import PCEditorModal from './modals/pc-editor-modal';
import PCUpdateModal from './modals/pc-update-modal';
import ReferenceModal from './modals/reference-modal';
import SearchModal from './modals/search-modal';
import ToolsModal from './modals/tools-modal';
import PageFooter from './panels/page-footer';
import PageHeader from './panels/page-header';
import PageNavigation from './panels/page-navigation';
import CombatListScreen from './screens/combat-list-screen';
import CombatScreen from './screens/combat-screen';
import EncounterListScreen from './screens/encounter-list-screen';
import HomeScreen from './screens/home-screen';
import MapListScreen from './screens/map-list-screen';
import MonsterListScreen from './screens/monster-list-screen';
import MonsterScreen from './screens/monster-screen';
import PartyListScreen from './screens/party-list-screen';
import PartyScreen from './screens/party-screen';

import pkg from '../../package.json';

interface Props {
}

interface State {
    view: string;
    navigation: boolean;
    drawer: any;
    maximized: boolean;

    parties: Party[];
    library: MonsterGroup[];
    encounters: Encounter[];
    maps: Map[];
    combats: Combat[];

    selectedPartyID: string | null;
    selectedMonsterGroupID: string | null;
    selectedCombatID: string | null;
}

export default class App extends React.Component<Props, State> {

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

        let maps: Map[] = [];
        try {
            const str = window.localStorage.getItem('data-maps');
            if (str) {
                maps = JSON.parse(str);
            }
        } catch (ex) {
            console.error('Could not parse JSON: ', ex);
        }

        let combats: Combat[] = [];
        try {
            const str = window.localStorage.getItem('data-combats');
            if (str) {
                combats = JSON.parse(str);

                combats.forEach(combat => {
                    combat.combatants.forEach(c => {
                        if (c.note === undefined) {
                            c.note = '';
                        }
                    });

                    if (combat.map) {
                        if (combat.map.notes === undefined) {
                            combat.map.notes = [];
                        }
                    }

                    if (combat.report === undefined) {
                        combat.report = [];
                    }
                });
            }
        } catch (ex) {
            console.error('Could not parse JSON: ', ex);
        }

        this.state = {
            view: 'home',
            navigation: false,
            drawer: null,
            maximized: false,
            parties: parties,
            library: library,
            encounters: encounters,
            maps: maps,
            combats: combats,
            selectedPartyID: null,
            selectedMonsterGroupID: null,
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

    private setView(view: string) {
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

    private toggleMaximized() {
        this.setState({
            maximized: !this.state.maximized
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
            navigation: false
        });
    }

    private selectMapByID(id: string | null) {
        this.save();
        this.setState({
            view: 'maps',
            navigation: false
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
            library: [],
            encounters: [],
            maps: [],
            combats: [],
            selectedPartyID: null,
            selectedMonsterGroupID: null,
            selectedCombatID: null
        }, () => this.saveAll());
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

    private editPC(pc: PC | null) {
        if (!pc) {
            pc = Factory.createPC();
            pc.name = 'new pc';
        }

        const copy = JSON.parse(JSON.stringify(pc));
        this.setState({
            drawer: {
                type: 'pc',
                pc: copy
            }
        });
    }

    private importPC(pc: PC) {
        const copy = JSON.parse(JSON.stringify(pc));
        this.setState({
            drawer: {
                type: 'update-pc',
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
            } else {
                party.pcs.push(this.state.drawer.pc);
            }
            Utils.sort(party.pcs);
            this.setState({
                parties: this.state.parties,
                drawer: null
            });
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

    private editMonster(monster: Monster | null) {
        if (!monster) {
            monster = Factory.createMonster();
            monster.name = 'new monster';
        }

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
                const index = group.monsters.indexOf(original);
                group.monsters[index] = this.state.drawer.monster;
            } else {
                group.monsters.push(this.state.drawer.monster);
            }
            Utils.sort(group.monsters);
            this.setState({
                library: this.state.library,
                drawer: null
            });
        }
    }

    private toggleShowSidebar() {
        const drawer = this.state.drawer;
        drawer.showSidebar = !drawer.showSidebar;
        this.setState({
            drawer: drawer
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
                    library: this.state.library
                });
            });
    }

    private openMonsterInfoModal(groupName: string, monsterName: string) {
        const monster = this.getMonster(monsterName, groupName);
        if (monster) {
            this.setState({
                drawer: {
                    type: 'monster-stat-block',
                    monster: monster
                }
            });
        }
    }

    private openDemographics(group: MonsterGroup | null) {
        this.setState({
            drawer: {
                type: 'monster-demographics',
                group: group
            }
        });
    }

    //#endregion

    //#region Encounter screen

    private editEncounter(encounter: Encounter | null) {
        if (!encounter) {
            encounter = Factory.createEncounter();
            encounter.name = 'new encounter';
        }

        const copy = JSON.parse(JSON.stringify(encounter));
        this.setState({
            drawer: {
                type: 'encounter',
                encounter: copy
            }
        });
    }

    private saveEncounter() {
        const encounters = this.state.encounters;
        const original = this.state.encounters.find(e => e.id === this.state.drawer.encounter.id);
        if (original) {
            const index = this.state.encounters.indexOf(original);
            encounters[index] = this.state.drawer.encounter;
        } else {
            encounters.push(this.state.drawer.encounter);
        }

        Utils.sort(encounters);
        this.setState({
            encounters: encounters,
            drawer: null
        });
    }

    private removeEncounter(encounter: Encounter) {
        const index = this.state.encounters.indexOf(encounter);
        this.state.encounters.splice(index, 1);

        this.setState({
            encounters: this.state.encounters
        });
    }

    //#endregion

    //#region Map screen

    private generateMap(type: string) {
        const map = Factory.createMap();
        map.name = 'new ' + type;
        Mercator.generate(type, map);
        this.state.maps.push(map);

        this.setState({
            maps: this.state.maps
        });
    }

    private editMap(map: Map | null) {
        if (!map) {
            map = Factory.createMap();
            map.name = 'new map';
        }

        const copy = JSON.parse(JSON.stringify(map));
        this.setState({
            drawer: {
                type: 'map',
                map: copy
            }
        });
    }

    private saveMap() {
        const maps = this.state.maps;
        const original = this.state.maps.find(m => m.id === this.state.drawer.map.id);
        if (original) {
            const index = this.state.maps.indexOf(original);
            maps[index] = this.state.drawer.map;
        } else {
            maps.push(this.state.drawer.map);
        }
        Utils.sort(maps);
        this.setState({
            maps: maps,
            drawer: null
        });
    }

    private removeMap(map: Map) {
        const index = this.state.maps.indexOf(map);
        this.state.maps.splice(index, 1);
        this.setState({
            maps: this.state.maps
        });
    }

    //#endregion

    //#region Combat screen

    private createCombat(encounter: Encounter | null = null, partyID: string | null = null) {
        let party = this.state.parties.length === 1 ? this.state.parties[0] : null;
        if (partyID) {
            const p = this.state.parties.find(par => par.id === partyID);
            if (p) {
                party = p;
            }
        }
        let enc = this.state.encounters.length === 1 ? this.state.encounters[0] : null;
        if (encounter) {
            enc = encounter;
        }

        const setup = Factory.createCombatSetup();
        setup.party = JSON.parse(JSON.stringify(party));
        setup.encounter = JSON.parse(JSON.stringify(encounter));
        if (enc) {
            setup.slotInfo = Utils.getCombatSlotData(enc);
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
        if (combatSetup.party && combatSetup.encounter) {
            const partyName = combatSetup.party.name || 'unnamed party';
            const encounterName = combatSetup.encounter.name || 'unnamed encounter';

            const combat = Factory.createCombat();
            combat.name = partyName + ' vs ' + encounterName;
            combat.encounter = JSON.parse(JSON.stringify(combatSetup.encounter));

            const entry = Factory.createCombatReportEntry();
            entry.type = 'combat-start';
            combat.report.push(entry);

            // Add a copy of each PC to the encounter
            combatSetup.party.pcs.filter(pc => pc.active).forEach(pc => {
                this.addPCToCombat(pc, combat);
            });

            combat.encounter.slots.forEach(slot => {
                const monster = this.getMonster(slot.monsterName, slot.monsterGroupName);
                if (monster) {
                    const groupInitRoll = Utils.dieRoll();

                    for (let n = 0; n !== slot.count; ++n) {
                        let displayName = null;
                        if (combatSetup.slotInfo) {
                            const slotInfo = combatSetup.slotInfo.find(info => info.id === slot.id);
                            if (slotInfo) {
                                displayName = slotInfo.members[n].name;
                            }
                        }

                        this.addMonsterToCombat(monster, combat, displayName, combatSetup.encounterInitMode, groupInitRoll);
                    }
                } else {
                    combat.issues.push('unknown monster: ' + slot.monsterName + ' in group ' + slot.monsterGroupName);
                }
            });

            this.sortCombatants(combat);

            if (combatSetup.map) {
                combat.map = JSON.parse(JSON.stringify(combatSetup.map));
            }

            this.setState({
                combats: ([] as Combat[]).concat(this.state.combats, [combat]),
                selectedCombatID: combat.id,
                drawer: null,
                view: 'combat'
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
        combatant.hpTemp = null;
        combatant.conditions = [];
        combatant.tags = [];
        combatant.note = '';
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
        combatant.hpTemp = 0;
        combatant.conditions = [];
        combatant.tags = [];
        combatant.note = '';
        combatant.altitude = 0;
        combatant.aura = { radius: 0, style: 'rounded', color: '#005080' };

        combat.combatants.push(combatant);
    }

    private addCompanionToCombat(companion: Companion | null) {
        const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
        if (combat) {
            const combatant: Combatant = {
                id: companion ? companion.id : Utils.guid(),
                type: 'companion',

                current: false,
                pending: true,
                active: false,
                defeated: false,

                displayName: companion ? companion.name : 'companion',
                displaySize: 'medium',
                showOnMap: true,
                initiative: 10,
                hp: null,
                hpTemp: null,
                conditions: [],
                tags: [],
                note: '',
                altitude: 0,
                aura: { radius: 0, style: 'rounded', color: '#005080' }
            };

            combat.combatants.push(combatant);
            this.setState({
                combats: this.state.combats
            });
        }
    }

    private openWaveModal() {
        const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
        if (combat) {
            const setup = Factory.createCombatSetup();
            setup.encounter = combat.encounter;
            setup.slotInfo = Utils.getCombatSlotData(combat.encounter);

            this.setState({
                drawer: {
                    type: 'combat-wave',
                    combatSetup: setup
                }
            });
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

    private addPCToEncounter(partyID: string, pcID: string) {
        const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
        if (combat) {
            const party = this.state.parties.find(p => p.id === partyID);
            if (party) {
                const pc = party.pcs.find(item => item.id === pcID);
                if (pc) {
                    this.addPCToCombat(pc, combat);
                    this.setState({
                        combats: this.state.combats
                    });
                }
            }
        }
    }

    private pauseCombat() {
        const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
        if (combat) {
            const entry = Factory.createCombatReportEntry();
            entry.type = 'combat-pause';
            combat.report.push(entry);

            this.setState({
                selectedCombatID: null,
                maximized: false
            });
        }
    }

    private resumeCombat(combat: Combat) {
        const entry = Factory.createCombatReportEntry();
        entry.type = 'combat-resume';
        combat.report.push(entry);

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
        const entry = Factory.createCombatReportEntry();
        entry.type = 'combat-end';
        combat.report.push(entry);

        const index = this.state.combats.indexOf(combat);
        this.state.combats.splice(index, 1);
        this.setState({
            combats: this.state.combats,
            selectedCombatID: null,
            maximized: false
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
                                if (combatant && (actor.id === combatant.id) && (c.duration.point === 'start')) {
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
                                if (combatant && ((c.duration.combatantID === combatant.id) || (c.duration.combatantID === null)) && (c.duration.point === 'start')) {
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

                if (combatant.type === 'pc') {
                    const entry = Factory.createCombatReportEntry();
                    entry.type = 'turn-start';
                    entry.combatantID = combatant.id;
                    combat.report.push(entry);
                }
            }

            if (newRound) {
                combat.round += 1;
            }

            this.setState({
                combats: this.state.combats
            });
        }
    }

    private makeActive(combatants: Combatant[]) {
        const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
        if (combat) {
            const wasPending = combatants.some(c => c.pending);

            combatants.forEach(c => {
                c.pending = false;
                c.active = true;
                c.defeated = false;
            });

            if (wasPending) {
                this.sortCombatants(combat);
            }

            this.setState({
                combats: this.state.combats
            });
        }
    }

    private makeDefeated(combatants: Combatant[]) {
        const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
        if (combat) {
            const current = combat.combatants.find(c => c.current);

            combatants.forEach(c => {
                c.pending = false;
                c.active = false;
                c.defeated = true;

                // If this monster is on the map, remove them from it
                if (combat.map) {
                    combat.map.items = combat.map.items.filter(item => item.id !== c.id);
                }

                if (current && (current.type === 'pc') && (c.type === 'monster')) {
                    const entry = Factory.createCombatReportEntry();
                    entry.type = 'kill';
                    entry.combatantID = current.id;
                    combat.report.push(entry);
                }
            });

            if (current) {
                this.endTurn(current);
            } else {
                this.setState({
                    combats: this.state.combats
                });
            }
        }
    }

    private addWaveToCombat() {
        const combatSetup: CombatSetup = this.state.drawer.combatSetup;
        const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
        if (combatSetup && combatSetup.encounter && combat) {
            const wave = combatSetup.encounter.waves.find(w => w.id === combatSetup.waveID);
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
                            if (combatSetup.slotInfo) {
                                const slotNames = combatSetup.slotInfo.find(info => info.id === slot.id);
                                if (slotNames) {
                                    combatant.displayName = slotNames.members[n].name;
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

    private moveCombatant(oldIndex: number, newIndex: number) {
        const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
        if (combat) {
            const c = combat.combatants.splice(oldIndex, 1);
            combat.combatants.splice(newIndex, 0, ...c);

            this.setState({
                combats: this.state.combats
            });
        }
    }

    private removeCombatants(combatants: Combatant[]) {
        const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
        if (combat) {
            combatants.forEach(c => {
                const index = combat.combatants.indexOf(c);
                combat.combatants.splice(index, 1);

                if (combat.map) {
                    const item = combat.map.items.find(i => i.id === c.id);
                    if (item) {
                        const n = combat.map.items.indexOf(item);
                        combat.map.items.splice(n, 1);
                    }
                }
            });

            this.setState({
                combats: this.state.combats
            });
        }
    }

    private mapAdd(combatant: Combatant, x: number, y: number) {
        const item = Factory.createMapItem();
        item.id = combatant.id;
        item.type = combatant.type as 'pc' | 'monster' | 'companion';
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

    private mapMove(ids: string[], dir: string) {
        const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
        if (combat) {
            ids.forEach(id => {
                if (combat.map) {
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

                        if (item.type === 'pc') {
                            const entry = Factory.createCombatReportEntry();
                            entry.type = 'movement';
                            entry.combatantID = item.id;
                            combat.report.push(entry);
                        }
                    }
                }
            });

            this.setState({
                combats: this.state.combats
            });
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

    private mapRemove(ids: string[]) {
        const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
        if (combat) {
            ids.forEach(id => {
                if (combat.map) {
                    const item = combat.map.items.find(i => i.id === id);
                    if (item) {
                        const index = combat.map.items.indexOf(item);
                        combat.map.items.splice(index, 1);
                    }
                }
            });

            this.setState({
                combats: this.state.combats
            });
        }
    }

    private mapAddNote(tileID: string) {
        const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
        if (combat && combat.map) {
            const note = Factory.createMapNote();
            note.targetID = tileID;
            combat.map.notes.push(note);

            this.setState({
                combats: this.state.combats
            });
        }
    }

    private mapRemoveNote(tileID: string) {
        const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
        if (combat && combat.map) {
            const index = combat.map.notes.findIndex(n => n.targetID === tileID);
            combat.map.notes.splice(index, 1);

            this.setState({
                combats: this.state.combats
            });
        }
    }

    private endTurn(combatant: Combatant) {
        const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
        if (combat) {
            if (combatant.type === 'pc') {
                const entry = Factory.createCombatReportEntry();
                entry.type = 'turn-end';
                entry.combatantID = combatant.id;
                combat.report.push(entry);
            }

            // Handle end-of-turn conditions
            combat.combatants.filter(actor => actor.conditions).forEach(actor => {
                actor.conditions.forEach(c => {
                    if (c.duration) {
                        switch (c.duration.type) {
                            case 'saves':
                                // If it's my condition, and point is END, notify the user
                                if ((actor.id === combatant.id) && (c.duration.point === 'end')) {
                                    const saveNotification = Factory.createNotification();
                                    saveNotification.type = 'condition-save';
                                    saveNotification.data = c;
                                    saveNotification.combatant = combatant as Combatant & Monster;
                                    combat.notifications.push(saveNotification);
                                }
                                break;
                            case 'combatant':
                                // If this refers to me, and point is END, remove it
                                if (((c.duration.combatantID === combatant.id) || (c.duration.combatantID === null)) && (c.duration.point === 'end')) {
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

    private changeHP(values: {id: string, hp: number, temp: number, damage: number}[]) {
        const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
        if (combat) {
            values.forEach(v => {
                const combatant = combat.combatants.find(c => c.id === v.id);
                if (combatant) {
                    combatant.hp = v.hp;
                    combatant.hpTemp = v.temp;
                }

                const current = combat.combatants.find(c => c.current);
                if (current && (current.type === 'pc')) {
                    const entry = Factory.createCombatReportEntry();
                    entry.type = 'damage';
                    entry.combatantID = current.id;
                    entry.value = v.damage;
                    combat.report.push(entry);
                }
            });

            this.setState({
                combats: this.state.combats
            });
        }
    }

    private addCondition(combatants: Combatant[]) {
        const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
        if (combat) {
            const condition = Factory.createCondition();
            condition.name = 'blinded';

            this.setState({
                drawer: {
                    type: 'condition-add',
                    condition: condition,
                    combatants: combatants,
                    combat: combat
                }
            });
        }
    }

    private addConditionFromModal() {
        const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
        if (combat) {
            this.state.drawer.combatants.forEach((combatant: Combatant) => {
                const condition: Condition = JSON.parse(JSON.stringify(this.state.drawer.condition));
                condition.id = Utils.guid();
                combatant.conditions.push(condition);
                Utils.sort(combatant.conditions, [{ field: 'name', dir: 'asc' }]);

                const current = combat.combatants.find(c => c.current);
                if (current && (current.type === 'pc')) {
                    const entry = Factory.createCombatReportEntry();
                    entry.type = 'condition-add';
                    entry.combatantID = current.id;
                    combat.report.push(entry);
                }
            });

            this.setState({
                combats: this.state.combats,
                drawer: null
            });
        }
    }

    private editCondition(combatant: Combatant, condition: Condition) {
        const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
        if (combat) {
            this.setState({
                drawer: {
                    type: 'condition-edit',
                    condition: condition,
                    combatants: [combatant],
                    combat: combat
                }
            });
        }
    }

    private editConditionFromModal() {
        this.state.drawer.combatants.forEach((combatant: Combatant) => {
            const original = combatant.conditions.find(c => c.id === this.state.drawer.condition.id);
            if (original) {
                const index = combatant.conditions.indexOf(original);
                combatant.conditions[index] = this.state.drawer.condition;
                Utils.sort(combatant.conditions, [{ field: 'name', dir: 'asc' }]);
            }
        });

        this.setState({
            combats: this.state.combats,
            drawer: null
        });
    }

    private removeCondition(combatant: Combatant, condition: Condition) {
        const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
        if (combat) {
            const index = combatant.conditions.indexOf(condition);
            combatant.conditions.splice(index, 1);

            const current = combat.combatants.find(c => c.current);
            if (current && (current.type === 'pc')) {
                const entry = Factory.createCombatReportEntry();
                entry.type = 'condition-remove';
                entry.combatantID = current.id;
                combat.report.push(entry);
            }

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

    private toggleTag(combatants: Combatant[], tag: string) {
        combatants.forEach(c => {
            if (c.tags.includes(tag)) {
                c.tags = c.tags.filter(t => t !== tag);
            } else {
                c.tags.push(tag);
            }
        });

        this.setState({
            combats: this.state.combats
        });
    }

    private toggleCondition(combatants: Combatant[], condition: string) {
        const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
        if (combat) {
            combatants.forEach(c => {
                const existing = c.conditions.find(cond => cond.name === condition);
                if (existing) {
                    this.removeCondition(c, existing);
                } else {
                    const cnd = Factory.createCondition();
                    cnd.name = condition;
                    c.conditions.push(cnd);

                    c.conditions = Utils.sort(c.conditions, [{ field: 'name', dir: 'asc' }]);

                    const current = combat.combatants.find(combatant => combatant.current);
                    if (current && (current.type === 'pc')) {
                        const entry = Factory.createCombatReportEntry();
                        entry.type = 'condition-add';
                        entry.combatantID = current.id;
                        combat.report.push(entry);
                    }
                }
            });

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

    private showLeaderboard() {
        const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
        if (combat) {
            this.setState({
                drawer: {
                    type: 'leaderboard',
                    combat: combat
                }
            });
        }
    }

    //#endregion

    //#region Saving

    private saveAfterDelay = Utils.debounce(() => this.saveAll(), 5 * 1000);

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
                this.saveKey(this.state.maps, 'data-maps');
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
        this.saveKey(this.state.maps, 'data-maps');
        this.saveKey(this.state.combats, 'data-combats');
    }

    private saveKey(obj: any, key: string) {
        try {
            const json = JSON.stringify(obj);
            console.info('Saving (' + key + '): ' + Utils.toData(json.length));
            window.localStorage.setItem(key, json);
        } catch (ex) {
            console.error('Could not stringify data: ', ex);
        }
    }

    //#endregion

    //#region Rendering

    private getContent() {
        let hasPCs = false;
        this.state.parties.forEach(party => hasPCs = hasPCs || party.pcs.length > 0);
        let hasMonsters = false;
        this.state.library.forEach(group => hasMonsters = hasMonsters || group.monsters.length > 0);

        switch (this.state.view) {
            case 'home':
                return (
                    <HomeScreen />
                );
            case 'parties':
                if (this.state.selectedPartyID) {
                    return (
                        <PartyScreen
                            party={this.state.parties.find(p => p.id === this.state.selectedPartyID) as Party}
                            goBack={() => this.selectParty(null)}
                            removeParty={() => this.removeCurrentParty()}
                            addPC={() => this.editPC(null)}
                            editPC={pc => this.editPC(pc)}
                            importPC={pc => this.importPC(pc)}
                            removePC={pc => this.removePC(pc)}
                            changeValue={(pc, type, value) => this.changeValue(pc, type, value)}
                            nudgeValue={(pc, type, delta) => this.nudgeValue(pc, type, delta)}
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
                            openDemographics={group => this.openDemographics(group)}
                            addMonster={() => this.editMonster(null)}
                            importMonster={() => this.importMonster()}
                            removeMonster={monster => this.removeMonster(monster)}
                            changeValue={(monster, type, value) => this.changeValue(monster, type, value)}
                            nudgeValue={(monster, type, delta) => this.nudgeValue(monster, type, delta)}
                            viewMonster={monster => this.setState({drawer: { type: 'monster-stat-block', monster: monster }})}
                            editMonster={monster => this.editMonster(monster)}
                            cloneMonster={(monster, name) => this.cloneMonster(monster, name)}
                            moveToGroup={(monster, groupID) => this.moveToGroup(monster, groupID)}
                        />
                    );
                } else {
                    return (
                        <MonsterListScreen
                            library={this.state.library}
                            hasMonsters={hasMonsters}
                            addMonsterGroup={() => this.addMonsterGroup()}
                            selectMonsterGroup={group => this.selectMonsterGroup(group)}
                            deleteMonsterGroup={group => this.removeMonsterGroup(group)}
                            addOpenGameContent={() => this.addOpenGameContent()}
                            openStatBlock={(groupName, monsterName) => this.openMonsterInfoModal(groupName, monsterName)}
                            openDemographics={group => this.openDemographics(group)}
                        />
                    );
                }
            case 'encounters':
                return (
                    <EncounterListScreen
                        encounters={this.state.encounters}
                        parties={this.state.parties}
                        hasMonsters={hasMonsters}
                        addEncounter={() => this.editEncounter(null)}
                        editEncounter={encounter => this.editEncounter(encounter)}
                        deleteEncounter={encounter => this.removeEncounter(encounter)}
                        runEncounter={(encounter, partyID) => this.createCombat(encounter, partyID)}
                        getMonster={(monsterName, groupName) => this.getMonster(monsterName, groupName)}
                        setView={view => this.setView(view)}
                        openStatBlock={(groupName, monsterName) => this.openMonsterInfoModal(groupName, monsterName)}
                    />
                );
            case 'maps':
                return (
                    <MapListScreen
                        maps={this.state.maps}
                        addMap={() => this.editMap(null)}
                        generateMap={(type) => this.generateMap(type)}
                        editMap={map => this.editMap(map)}
                        deleteMap={map => this.removeMap(map)}
                    />
                );
            case 'combat':
                if (this.state.selectedCombatID) {
                    return (
                        <CombatScreen
                            combat={this.state.combats.find(c => c.id === this.state.selectedCombatID) as Combat}
                            parties={this.state.parties}
                            encounters={this.state.encounters}
                            maximized={this.state.maximized}
                            maximize={() => this.toggleMaximized()}
                            pauseCombat={() => this.pauseCombat()}
                            endCombat={() => this.endCurrentCombat()}
                            nudgeValue={(combatant, type, delta) => this.nudgeValue(combatant, type, delta)}
                            changeValue={(combatant, type, value) => this.changeValue(combatant, type, value)}
                            makeCurrent={combatant => this.makeCurrent(combatant, false)}
                            makeActive={combatants => this.makeActive(combatants)}
                            makeDefeated={combatants => this.makeDefeated(combatants)}
                            moveCombatant={(oldIndex, newIndex) => this.moveCombatant(oldIndex, newIndex)}
                            removeCombatants={combatants => this.removeCombatants(combatants)}
                            addCombatants={() => this.addToEncounter()}
                            addCompanion={companion => this.addCompanionToCombat(companion)}
                            addPC={(partyID, pcID) => this.addPCToEncounter(partyID, pcID)}
                            addWave={() => this.openWaveModal()}
                            addCondition={combatants => this.addCondition(combatants)}
                            editCondition={(combatant, condition) => this.editCondition(combatant, condition)}
                            removeCondition={(combatant, condition) => this.removeCondition(combatant, condition)}
                            mapAdd={(combatant, x, y) => this.mapAdd(combatant, x, y)}
                            mapResize={(id, dir, dir2) => this.mapResize(id, dir, dir2)}
                            mapMove={(ids, dir) => this.mapMove(ids, dir)}
                            mapRemove={ids => this.mapRemove(ids)}
                            mapAddNote={itemID => this.mapAddNote(itemID)}
                            mapRemoveNote={itemID => this.mapRemoveNote(itemID)}
                            endTurn={combatant => this.endTurn(combatant)}
                            changeHP={values => this.changeHP(values)}
                            closeNotification={(notification, removeCondition) => this.closeNotification(notification, removeCondition)}
                            toggleTag={(combatants, tag) => this.toggleTag(combatants, tag)}
                            toggleCondition={(combatants, condition) => this.toggleCondition(combatants, condition)}
                            scatterCombatants={type => this.scatterCombatants(type)}
                            rotateMap={() => this.rotateMap()}
                            addOverlay={overlay => this.addMapItem(overlay)}
                            showLeaderboard={() => this.showLeaderboard()}
                        />
                    );
                } else {
                    return (
                        <CombatListScreen
                            combats={this.state.combats}
                            hasPCs={hasPCs}
                            hasMonsters={hasMonsters}
                            createCombat={() => this.createCombat()}
                            resumeCombat={combat => this.resumeCombat(combat)}
                            deleteCombat={combat => this.endCombat(combat)}
                            setView={view => this.setView(view)}
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
                case 'update-pc':
                    content = (
                        <PCUpdateModal
                            pc={this.state.drawer.pc}
                        />
                    );
                    header = 'update pc';
                    footer = (
                        <button onClick={() => this.savePC()}>
                            accept pc
                        </button>
                    );
                    closable = true;
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
                            <Col span={6}>
                                <button onClick={() => this.saveMonster()}>save changes</button>
                            </Col>
                            <Col span={6}>
                                <button onClick={() => this.closeDrawer()}>discard changes</button>
                            </Col>
                            <Col span={12}>
                                <Checkbox
                                    label='advanced tools'
                                    checked={this.state.drawer.showSidebar}
                                    changeValue={() => this.toggleShowSidebar()}
                                />
                            </Col>
                        </Row>
                    );
                    width = '85%';
                    break;
                case 'monster-stat-block':
                    content = (
                        <MonsterInfoModal
                            monster={this.state.drawer.monster}
                        />
                    );
                    header = 'monster';
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
                case 'monster-demographics':
                    content = (
                        <DemographicsModal
                            groups={this.state.drawer.group ? [this.state.drawer.group] : this.state.library}
                        />
                    );
                    header = 'demographics';
                    closable = true;
                    break;
                case 'encounter':
                    content = (
                        <EncounterEditorModal
                            encounter={this.state.drawer.encounter}
                            parties={this.state.parties}
                            library={this.state.library}
                            getMonster={(monsterName, groupName) => this.getMonster(monsterName, groupName)}
                        />
                    );
                    header = 'encounter editor';
                    footer = (
                        <Row gutter={10}>
                            <Col span={12}>
                                <button onClick={() => this.saveEncounter()}>save changes</button>
                            </Col>
                            <Col span={12}>
                                <button onClick={() => this.closeDrawer()}>discard changes</button>
                            </Col>
                        </Row>
                    );
                    width = '75%';
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
                    width = '100%';
                    break;
                case 'combat-start':
                    content = (
                        <CombatStartModal
                            combatSetup={this.state.drawer.combatSetup}
                            parties={this.state.parties}
                            library={this.state.library}
                            encounters={this.state.encounters}
                            maps={this.state.maps}
                            getMonster={(monsterName, groupName) => this.getMonster(monsterName, groupName)}
                            notify={() => this.setState({drawer: this.state.drawer})}
                        />
                    );
                    header = 'start combat';
                    footer = (
                        <button
                            className={this.state.drawer.combatSetup.party && this.state.drawer.combatSetup.encounter ? '' : 'disabled'}
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
                            combatants={this.state.drawer.combatants}
                            combat={this.state.drawer.combat}
                        />
                    );
                    header = 'add a condition';
                    footer = (
                        <button onClick={() => this.addConditionFromModal()}>add</button>
                    );
                    width = '75%';
                    closable = true;
                    break;
                case 'condition-edit':
                    content = (
                        <ConditionModal
                            condition={this.state.drawer.condition}
                            combatants={this.state.drawer.combatants}
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
                    width = '75%';
                    break;
                case 'leaderboard':
                    content = (
                        <LeaderboardModal
                            combat={this.state.drawer.combat}
                        />
                    );
                    header = 'leaderboard';
                    closable = true;
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
                case 'reference':
                    content = (
                        <ReferenceModal
                        />
                    );
                    header = 'reference';
                    closable = true;
                    break;
                case 'search':
                    content = (
                        <SearchModal
                            parties={this.state.parties}
                            library={this.state.library}
                            encounters={this.state.encounters}
                            maps={this.state.maps}
                            openParty={id => this.selectPartyByID(id)}
                            openGroup={id => this.selectMonsterGroupByID(id)}
                            openEncounter={id => this.selectEncounterByID(id)}
                            openMap={id => this.selectMapByID(id)}
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
            const header = this.state.maximized ? null : (
                <PageHeader
                    view={this.state.view}
                    openMenu={() => this.toggleNavigation()}
                    openDrawer={type => this.openToolsDrawer(type)}
                />
            );
            const footer = this.state.maximized ? null : (
                <PageFooter
                    view={this.state.view}
                    setView={view => this.setView(view)}
                />
            );

            const leftDrawer = (
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
                            maps={this.state.maps}
                            combats={this.state.combats}
                            openParty={id => this.selectPartyByID(id)}
                            openMonsterGroup={id => this.selectMonsterGroupByID(id)}
                            openEncounter={id => this.selectEncounterByID(id)}
                            openMap={id => this.selectMapByID(id)}
                            openCombat={id => this.selectCombatByID(id)}
                        />
                    </div>
                    <div className='drawer-footer'>
                        <div style={{ padding: '10px 0' }}>version <b>{pkg.version}</b></div>
                    </div>
                </Drawer>
            );

            const drawer = this.getDrawer();
            const rightDrawer = (
                <Drawer
                    closable={false}
                    maskClosable={drawer.closable}
                    width={drawer.width}
                    visible={drawer.content !== null}
                    onClose={() => this.closeDrawer()}
                >
                    <div className='drawer-header'><div className='app-title'>{drawer.header}</div></div>
                    <div className='drawer-content'>{drawer.content}</div>
                    <div className='drawer-footer'>{drawer.footer}</div>
                </Drawer>
            );

            return (
                <div className='dojo'>
                    {header}
                    <div className={this.state.maximized ? 'page-content maximized' : 'page-content'}>
                        {this.getContent()}
                    </div>
                    {footer}
                    {leftDrawer}
                    {rightDrawer}
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }

    //#endregion
}
