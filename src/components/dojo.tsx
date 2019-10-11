import React from 'react';

import Factory from '../utils/factory';
import Frankenstein from '../utils/frankenstein';
import Mercator from '../utils/mercator';
import Napoleon from '../utils/napoleon';
import Utils from '../utils/utils';

import { Combat, Combatant, CombatSetup, Notification } from '../models/combat';
import { Condition } from '../models/condition';
import { Encounter, EncounterSlot, EncounterWave, MonsterFilter } from '../models/encounter';
import { Map, MapFolio } from '../models/map-folio';
import { Monster, MonsterGroup } from '../models/monster-group';
import { Party, PC } from '../models/party';

import Checkbox from './controls/checkbox';
import AddCombatantsModal from './modals/add-combatants-modal';
import CombatStartModal from './modals/combat-start-modal';
import ConditionModal from './modals/condition-modal';
import MapEditorModal from './modals/map-editor-modal';
import MonsterEditorModal from './modals/monster-editor-modal';
import PCEditorModal from './modals/pc-editor-modal';
import ToolsSidebar from './modals/tools-sidebar';
import Navbar from './panels/navbar';
import Titlebar from './panels/titlebar';
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

import close from '../resources/icons/x.svg';

// tslint:disable-next-line:no-empty-interface
interface Props {
    // No props; this is the root component
}

interface State {
    view: 'home' | 'parties' | 'library' | 'encounters' | 'maps' | 'combat';
    modal: any;

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
    constructor(props: Props) {
        super(props);

        this.state = {
            view: 'home',
            modal: null,
            parties: [],
            library: [],
            encounters: [],
            mapFolios: [],
            combats: [],
            selectedPartyID: null,
            selectedMonsterGroupID: null,
            selectedEncounterID: null,
            selectedMapFolioID: null,
            selectedCombatID: null
        };

        try {
            let data: State | null = null;

            try {
                const json = window.localStorage.getItem('data');
                if (json) {
                    data = JSON.parse(json);
                }
            } catch (ex) {
                console.error('Could not parse JSON: ', ex);
                data = null;
            }

            if (data !== null) {
                data.parties.forEach(p => {
                    p.pcs.forEach(pc => {
                        if (pc.companions === undefined) {
                            pc.companions = [];
                        }
                    });
                });
                data.library.forEach(g => {
                    g.monsters.forEach(m => {
                        m.traits.forEach(t => {
                            if (t.uses === undefined) {
                                t.uses = 0;
                            }
                        });
                    });
                });

                data.encounters.forEach(enc => {
                    if (!enc.waves) {
                        enc.waves = [];
                    }
                });

                if (!data.mapFolios) {
                    data.mapFolios = [];
                    data.selectedMapFolioID = null;
                }

                data.mapFolios.forEach(folio => {
                    folio.maps.forEach(map => {
                        map.items.forEach(item => {
                            if (item.style === undefined) {
                                item.style = null;
                            }
                        });
                    });
                });

                data.combats.forEach(combat => {
                    if (!combat.notifications) {
                        combat.notifications = [];
                    }
                    combat.combatants.forEach(c => {
                        if (c.showOnMap === undefined) {
                            c.showOnMap = true;
                        }

                        if (c.altitude === undefined) {
                            c.altitude = 0;
                        }

                        if (c.tags === undefined) {
                            c.tags = [];
                        }

                        if (c.aura === undefined) {
                            c.aura = { radius: 0, style: 'rounded', color: '#005080' };
                        }

                        if (c.type === 'monster') {
                            const m = c as Combatant & Monster;
                            m.traits.forEach(t => {
                                if (t.uses === undefined) {
                                    t.uses = 0;
                                }
                            });
                        }
                    });
                });

                data.view = 'home';
                data.modal = null;

                this.state = data;
            }
        } catch (ex) {
            console.error(ex);
        }
    }

    public componentDidUpdate() {
        let json = null;
        try {
            json = JSON.stringify(this.state);
        } catch (ex) {
            console.error('Could not stringify data: ', ex);
            json = null;
        }

        if (json !== null) {
            window.localStorage.setItem('data', json);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Party screen

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

    private removeParty() {
        const party = this.state.parties.find(p => p.id === this.state.selectedPartyID);
        if (party) {
            const index = this.state.parties.indexOf(party);
            this.state.parties.splice(index, 1);
            this.setState({
                parties: this.state.parties,
                selectedPartyID: null
            });
        }
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
            modal: {
                type: 'pc',
                pc: copy
            }
        });
    }

    private savePC() {
        Utils.sort(this.state.modal.pc.companions);
        const party = this.state.parties.find(p => p.id === this.state.selectedPartyID);
        if (party) {
            const original = party.pcs.find(pc => pc.id === this.state.modal.pc.id);
            if (original) {
                const index = party.pcs.indexOf(original);
                party.pcs[index] = this.state.modal.pc;
                this.setState({
                    library: this.state.library,
                    modal: null
                });
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Library screen

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

    private removeMonsterGroup() {
        const group = this.state.library.find(g => g.id === this.state.selectedMonsterGroupID);
        if (group) {
            const index = this.state.library.indexOf(group);
            this.state.library.splice(index, 1);
            this.setState({
                library: this.state.library,
                selectedMonsterGroupID: null
            });
        }
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
            modal: {
                type: 'monster',
                monster: copy,
                showSidebar: false
            }
        });
    }

    private saveMonster() {
        const group = this.state.library.find(g => g.id === this.state.selectedMonsterGroupID);
        if (group) {
            const original = group.monsters.find(m => m.id === this.state.modal.monster.id);
            if (original) {
                // We are editing a monster
                const index = group.monsters.indexOf(original);
                group.monsters[index] = this.state.modal.monster;
                this.setState({
                    library: this.state.library,
                    modal: null
                });
            } else {
                // We are adding a new monster
                group.monsters.push(this.state.modal.monster);
                this.setState({
                    library: this.state.library,
                    modal: null
                });
            }
        }
    }

    private toggleShowSidebar() {
        // eslint-disable-next-line
        this.state.modal.showSidebar = !this.state.modal.showSidebar;
        this.setState({
            modal: this.state.modal
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

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Encounter screen

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

    private removeEncounter() {
        const encounter = this.state.encounters.find(e => e.id === this.state.selectedEncounterID);
        if (encounter) {
            const index = this.state.encounters.indexOf(encounter);
            this.state.encounters.splice(index, 1);

            this.setState({
                encounters: this.state.encounters,
                selectedEncounterID: null
            });
        }
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

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Map screen

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

    private removeMapFolio() {
        const folio = this.state.mapFolios.find(f => f.id === this.state.selectedMapFolioID);
        if (folio) {
            const index = this.state.mapFolios.indexOf(folio);
            this.state.mapFolios.splice(index, 1);

            this.setState({
                mapFolios: this.state.mapFolios,
                selectedMapFolioID: null
            });
        }
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
            modal: {
                type: 'map',
                map: copy
            }
        });
    }

    private saveMap() {
        const folio = this.state.mapFolios.find(f => f.id === this.state.selectedMapFolioID);
        if (folio) {
            const original = folio.maps.find(m => m.id === this.state.modal.map.id);
            if (original) {
                const index = folio.maps.indexOf(original);
                folio.maps[index] = this.state.modal.map;
                this.setState({
                    mapFolios: this.state.mapFolios,
                    modal: null
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

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Combat screen

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
            modal: {
                type: 'combat-start',
                combatSetup: setup
            }
        });
    }

    private startCombat() {
        const combatSetup: CombatSetup = this.state.modal.combatSetup;
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
                modal: null
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
        combatant.displaySize = 'medium';
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
                    modal: {
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
                modal: {
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
            this.state.modal.combatantSlots.forEach((slot: EncounterSlot) => {
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
                modal: null
            });
        }
    }

    private pauseCombat() {
        const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
        if (combat) {
            combat.timestamp = new Date().toLocaleString();
            this.setState({
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

    private endCombat() {
        const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
        if (combat) {
            const index = this.state.combats.indexOf(combat);
            this.state.combats.splice(index, 1);
            this.setState({
                combats: this.state.combats,
                selectedCombatID: null
            });
        }
    }

    private makeCurrent(combatant: (Combatant & PC) | (Combatant & Monster) | null, newRound: boolean) {
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
                (combatant as Monster).traits
                    .filter(t => (t.uses > 0) && t.usage.toLowerCase().startsWith('recharge '))
                    .forEach(t => {
                        combat.notifications.push({
                            id: Utils.guid(),
                            type: 'trait-recharge',
                            data: t,
                            combatant: combatant as Combatant & Monster
                        });
                    });
                (combatant as Monster).traits
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

    private makeActive(combatant: (Combatant & PC) | (Combatant & Monster)) {
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

    private makeDefeated(combatant: (Combatant & PC) | (Combatant & Monster)) {
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
        const combatSetup: CombatSetup = this.state.modal.combatSetup;
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
                            combatant.pending = (this.state.modal.combatSetup.encounterInitMode === 'manual');
                            combatant.active = (this.state.modal.combatSetup.encounterInitMode !== 'manual');
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
                    modal: null
                });
            }
        }
    }

    private removeCombatant(combatant: (Combatant & PC) | (Combatant & Monster)) {
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

    private mapAdd(combatant: ((Combatant & PC) | (Combatant & Monster)), x: number, y: number) {
        const item = Factory.createMapItem();
        item.id = combatant.id;
        item.type = combatant.type as 'pc' | 'monster';
        item.x = x;
        item.y = y;
        let size = 1;
        if (combatant.type === 'monster') {
            size = Utils.miniSize((combatant as Monster).size);
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

    private mapMove(combatant: (Combatant & PC) | (Combatant & Monster), dir: string) {
        const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
        if (combat && combat.map) {
            const item = combat.map.items.find(i => i.id === combatant.id);
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

    private mapRemove(combatant: (Combatant & PC) | (Combatant & Monster)) {
        const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
        if (combat && combat.map) {
            const item = combat.map.items.find(i => i.id === combatant.id);
            if (item) {
                const index = combat.map.items.indexOf(item);
                combat.map.items.splice(index, 1);

                this.setState({
                    combats: this.state.combats
                });
            }
        }
    }

    private endTurn(combatant: (Combatant & PC) | (Combatant & Monster)) {
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

    private addCondition(combatant: (Combatant & PC) | (Combatant & Monster)) {
        const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
        if (combat) {
            const condition = Factory.createCondition();
            condition.name = 'blinded';

            this.setState({
                modal: {
                    type: 'condition-add',
                    condition: condition,
                    combatant: combatant,
                    combat: combat
                }
            });
        }
    }

    private addConditionFromModal() {
        this.state.modal.combatant.conditions.push(this.state.modal.condition);

        this.setState({
            combats: this.state.combats,
            modal: null
        });
    }

    private editCondition(combatant: (Combatant & PC) | (Combatant & Monster), condition: Condition) {
        const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
        if (combat) {
            this.setState({
                modal: {
                    type: 'condition-edit',
                    condition: condition,
                    combatant: combatant,
                    combat: combat
                }
            });
        }
    }

    private editConditionFromModal() {
        const conditions: Condition[] = this.state.modal.combatant.conditions;
        const original = conditions.find(c => c.id === this.state.modal.condition.id);
        if (original) {
            const index = conditions.indexOf(original);
            // eslint-disable-next-line
            conditions[index] = this.state.modal.condition;

            this.setState({
                combats: this.state.combats,
                modal: null
            });
        }
    }

    private removeCondition(combatant: (Combatant & PC) | (Combatant & Monster), conditionID: string) {
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
            if (a.name < b.name) { return -1; }
            if (a.name > b.name) { return 1; }
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

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private setView(view: 'home' | 'parties' | 'library' | 'encounters' | 'maps' | 'combat') {
        this.setState({
            view: view
        });
    }

    private openToolsSidebar() {
        this.setState({
            modal: {
                type: 'tools-sidebar'
            }
        });
    }

    private closeModal() {
        this.setState({
            modal: null
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

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
            modal: this.state.modal
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

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private getActions() {
        switch (this.state.view) {
            case 'parties':
                if (this.state.selectedPartyID) {
                    return (
                        <div className='actions'>
                            <div className='section'>
                                <button onClick={() => this.selectParty(null)}>&larr; back to list</button>
                            </div>
                        </div>
                    );
                } else {
                    return (
                        <div className='actions'>
                            <div className='section'>
                                <button onClick={() => this.addParty()}>create a new party</button>
                            </div>
                        </div>
                    );
                }
            case 'library':
                if (this.state.selectedMonsterGroupID) {
                    return (
                        <div className='actions'>
                            <div className='section'>
                                <button onClick={() => this.selectMonsterGroup(null)}>&larr; back to list</button>
                            </div>
                        </div>
                    );
                } else {
                    return (
                        <div className='actions'>
                            <div className='section'>
                                <button onClick={() => this.addMonsterGroup()}>create a new monster group</button>
                            </div>
                        </div>
                    );
                }
            case 'encounters':
                if (this.state.selectedEncounterID) {
                    return (
                        <div className='actions'>
                            <div className='section'>
                                <button onClick={() => this.selectEncounter(null)}>&larr; back to list</button>
                            </div>
                        </div>
                    );
                } else {
                    return (
                        <div className='actions'>
                            <div className='section'>
                                <button onClick={() => this.addEncounter()}>create a new encounter</button>
                            </div>
                        </div>
                    );
                }
            case 'maps':
                if (this.state.selectedMapFolioID) {
                    return (
                        <div className='actions'>
                            <div className='section'>
                                <button onClick={() => this.selectMapFolio(null)}>&larr; back to list</button>
                            </div>
                        </div>
                    );
                } else {
                    return (
                        <div className='actions'>
                            <div className='section'>
                                <button onClick={() => this.addMapFolio()}>create a new map folio</button>
                            </div>
                        </div>
                    );
                }
            case 'combat':
                if (this.state.selectedCombatID) {
                    const combat = this.state.combats.find(c => c.id === this.state.selectedCombatID);
                    return (
                        <div className='actions'>
                            <div className='section'>
                                <div className='text'>round: {combat ? combat.round : 0}</div>
                            </div>
                            <div className='section'>
                                <button onClick={() => this.endCombat()}>end combat</button>
                            </div>
                        </div>
                    );
                } else {
                    return (
                        <div className='actions'>
                            <div className='section'>
                                <button onClick={() => this.createCombat()}>start a new combat</button>
                            </div>
                        </div>
                    );
                }
        }

        return null;
    }

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
                            removeParty={() => this.removeParty()}
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
                            selectParty={party => this.selectParty(party)}
                        />
                    );
                }
            case 'library':
                if (this.state.selectedMonsterGroupID) {
                    return (
                        <MonsterScreen
                            monsterGroup={this.state.library.find(g => g.id === this.state.selectedMonsterGroupID) as MonsterGroup}
                            library={this.state.library}
                            removeMonsterGroup={() => this.removeMonsterGroup()}
                            addMonster={() => this.addMonster()}
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
                            selectMonsterGroup={group => this.selectMonsterGroup(group)}
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
                            clearEncounter={() => this.clearEncounter()}
                            removeEncounter={() => this.removeEncounter()}
                            buildEncounter={(xp, filter) => this.buildEncounter(xp, filter)}
                            addWave={() => this.addWaveToEncounter()}
                            removeWave={wave => this.removeWave(wave)}
                            getMonster={(monsterName, groupName) => this.getMonster(monsterName, groupName)}
                            addEncounterSlot={(monster, waveID) => this.addEncounterSlot(monster, waveID)}
                            removeEncounterSlot={(slot, waveID) => this.removeEncounterSlot(slot, waveID)}
                            nudgeValue={(slot, type, delta) => this.nudgeValue(slot, type, delta)}
                            changeValue={(combatant, type, value) => this.changeValue(combatant, type, value)}
                        />
                    );
                } else {
                    return (
                        <EncounterListScreen
                            encounters={this.state.encounters}
                            selectEncounter={encounter => this.selectEncounter(encounter)}
                        />
                    );
                }
            case 'maps':
                if (this.state.selectedMapFolioID) {
                    return (
                        <MapScreen
                            mapFolio={this.state.mapFolios.find(f => f.id === this.state.selectedMapFolioID) as MapFolio}
                            removeMapFolio={() => this.removeMapFolio()}
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
                            selectMapFolio={folio => this.selectMapFolio(folio)}
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
                            mapMove={(combatant, dir) => this.mapMove(combatant, dir)}
                            mapRemove={combatant => this.mapRemove(combatant)}
                            endTurn={(combatant) => this.endTurn(combatant)}
                            changeHP={(combatant, hp, temp) => this.changeHP(combatant, hp, temp)}
                            closeNotification={(notification, removeCondition) => this.closeNotification(notification, removeCondition)}
                            toggleTag={(combatant, tag) => this.toggleTag(combatant, tag)}
                            scatterCombatants={type => this.scatterCombatants(type)}
                            rotateMap={() => this.rotateMap()}
                        />
                    );
                } else {
                    return (
                        <CombatListScreen
                            combats={this.state.combats}
                            resumeCombat={pausedCombat => this.resumeCombat(pausedCombat)}
                        />
                    );
                }
        }

        return null;
    }

    private getModal() {
        if (this.state.modal) {
            let modalSidebar = false;
            let modalTitle = null;
            let modalContent = null;
            let modalAllowScroll = true;

            const modalButtons = {
                left: [] as JSX.Element[],
                right: [
                    <button key='close' onClick={() => this.closeModal()}>close</button>
                ] as JSX.Element[]
            };

            switch (this.state.modal.type) {
                case 'tools-sidebar':
                    modalSidebar = true;
                    modalContent = (
                        <ToolsSidebar
                            library={this.state.library}
                            resetAll={() => this.resetAll()}
                        />
                    );
                    modalButtons.right = [];
                    break;
                case 'pc':
                        modalTitle = 'pc editor';
                        modalContent = (
                            <PCEditorModal
                                pc={this.state.modal.pc}
                            />
                        );
                        modalButtons.right = [
                            <button key='save' onClick={() => this.savePC()}>save</button>,
                            <button key='cancel' onClick={() => this.closeModal()}>cancel</button>
                        ];
                        break;
                case 'monster':
                    modalTitle = 'monster editor';
                    modalContent = (
                        <MonsterEditorModal
                            monster={this.state.modal.monster}
                            library={this.state.library}
                            showSidebar={this.state.modal.showSidebar}
                        />
                    );
                    modalAllowScroll = false;
                    modalButtons.left = [
                        (
                            <Checkbox
                                key='sidebar'
                                label='advanced tools'
                                checked={this.state.modal.showSidebar}
                                changeValue={() => this.toggleShowSidebar()}
                            />
                        )
                    ];
                    modalButtons.right = [
                        <button key='save' onClick={() => this.saveMonster()}>save</button>,
                        <button key='cancel' onClick={() => this.closeModal()}>cancel</button>
                    ];
                    break;
                case 'map':
                    modalTitle = 'map editor';
                    modalContent = (
                        <MapEditorModal
                            map={this.state.modal.map}
                        />
                    );
                    modalAllowScroll = false;
                    modalButtons.right = [
                        <button key='save' onClick={() => this.saveMap()}>save</button>,
                        <button key='cancel' onClick={() => this.closeModal()}>cancel</button>
                    ];
                    break;
                case 'combat-start':
                    modalTitle = 'start a new encounter';
                    modalContent = (
                        <CombatStartModal
                            combatSetup={this.state.modal.combatSetup}
                            parties={this.state.parties}
                            encounters={this.state.encounters}
                            mapFolios={this.state.mapFolios}
                            getMonster={(monsterName, groupName) => this.getMonster(monsterName, groupName)}
                            notify={() => this.setState({modal: this.state.modal})}
                        />
                    );
                    modalAllowScroll = false;
                    modalButtons.right = [
                        (
                            <button
                                key='start encounter'
                                className={this.state.modal.combatSetup.partyID && this.state.modal.combatSetup.encounterID ? '' : 'disabled'}
                                onClick={() => this.startCombat()}
                            >
                                start encounter
                            </button>
                        ),
                        <button key='cancel' onClick={() => this.closeModal()}>cancel</button>
                    ];
                    break;
                case 'combat-wave':
                    modalTitle = 'encounter waves';
                    modalContent = (
                        <CombatStartModal
                            combatSetup={this.state.modal.combatSetup}
                            encounters={this.state.encounters}
                            getMonster={(monsterName, groupName) => this.getMonster(monsterName, groupName)}
                            notify={() => this.setState({modal: this.state.modal})}
                        />
                    );
                    modalAllowScroll = false;
                    modalButtons.right = [
                        (
                            <button
                                key='add wave'
                                className={this.state.modal.combatSetup.waveID !== null ? '' : 'disabled'}
                                onClick={() => this.addWaveToCombat()}
                            >
                                add wave
                            </button>
                        ),
                        <button key='cancel' onClick={() => this.closeModal()}>cancel</button>
                    ];
                    break;
                case 'combat-add-combatants':
                        modalTitle = 'add combatants';
                        modalContent = (
                            <AddCombatantsModal
                                combatantSlots={this.state.modal.combatantSlots}
                                library={this.state.library}
                            />
                        );
                        modalAllowScroll = false;
                        modalButtons.right = [
                            (
                                <button
                                    key='add combatants'
                                    onClick={() => this.addCombatantsFromModal()}
                                >
                                    add combatants
                                </button>
                            ),
                            <button key='cancel' onClick={() => this.closeModal()}>cancel</button>
                        ];
                        break;
                case 'condition-add':
                    modalTitle = 'add a condition';
                    modalContent = (
                        <ConditionModal
                            condition={this.state.modal.condition}
                            combatant={this.state.modal.combatant}
                            combat={this.state.modal.combat}
                        />
                    );
                    modalAllowScroll = false;
                    modalButtons.right = [
                        <button key='add' onClick={() => this.addConditionFromModal()}>add</button>,
                        <button key='cancel' onClick={() => this.closeModal()}>cancel</button>
                    ];
                    break;
                case 'condition-edit':
                    modalTitle = 'edit condition';
                    modalContent = (
                        <ConditionModal
                            condition={this.state.modal.condition}
                            combatant={this.state.modal.combatant}
                            combat={this.state.modal.combat}
                        />
                    );
                    modalButtons.right = [
                        <button key='save' onClick={() => this.editConditionFromModal()}>save</button>,
                        <button key='cancel' onClick={() => this.closeModal()}>cancel</button>
                    ];
                    break;
                default:
                    // Do nothing
                    break;
            }

            return (
                <div className='overlay' onClick={() => modalSidebar ? this.closeModal() : null}>
                    <div className={modalSidebar ? 'modal sidebar' : 'modal'} onClick={e => e.stopPropagation()}>
                        <div className='modal-header'>
                            <div className='title'>{modalTitle}</div>
                            {modalSidebar ? <img className='image' src={close} alt='close' onClick={() => this.closeModal()} /> : null}
                        </div>
                        <div className={modalAllowScroll ? 'modal-content scrollable' : 'modal-content'}>
                            {modalContent}
                        </div>
                        <div className='modal-footer'>
                            <div className='left'>{modalButtons.left}</div>
                            <div className='right'>{modalButtons.right}</div>
                        </div>
                    </div>
                </div>
            );
        }

        return null;
    }

    public render() {
        try {
            const content = this.getContent();
            const actions = this.getActions();
            const modal = this.getModal();

            return (
                <div className='dojo'>
                    <Titlebar
                        actions={actions}
                        blur={modal !== null}
                        openHome={() => this.setView('home')}
                        openTools={() => this.openToolsSidebar()}
                    />
                    <div className={(modal === null) ? 'page-content' : 'page-content blur'}>
                        {content}
                    </div>
                    <Navbar
                        view={this.state.view}
                        parties={this.state.parties}
                        library={this.state.library}
                        encounters={this.state.encounters}
                        blur={modal !== null}
                        setView={view => this.setView(view)}
                    />
                    {modal}
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
