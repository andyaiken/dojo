import React from 'react';

import Factory from '../utils/factory';
import Utils from '../utils/utils';

import { Combat, Combatant, CombatSetup, Notification } from '../models/combat';
import { Condition } from '../models/condition';
import { Encounter, EncounterSlot, EncounterWave } from '../models/encounter';
import { Map, MapFolio } from '../models/map-folio';
import { Monster, MonsterGroup, Trait } from '../models/monster-group';
import { Party, PC } from '../models/party';

import CombatManagerScreen from './screens/combat-manager-screen';
import DMScreen from './screens/dm-screen';
import EncounterBuilderScreen from './screens/encounter-builder-screen';
import HomeScreen from './screens/home-screen';
import MapFoliosScreen from './screens/map-folios-screen';
import MonsterLibraryScreen from './screens/monster-library-screen';
import PartiesScreen from './screens/parties-screen';

import AboutModal from './modals/about-modal';
import CombatStartModal from './modals/combat-start-modal';
import ConditionModal from './modals/condition-modal';
import DemographicsModal from './modals/demographics-modal';
import MapEditorModal from './modals/map-editor-modal';
import MonsterEditorModal from './modals/monster-editor-modal';

import Navbar from './panels/navbar';
import Titlebar from './panels/titlebar';

import Checkbox from './controls/checkbox';

import close from '../resources/images/close-black.svg';

import monsters from '../resources/data/monsters.json';

// tslint:disable-next-line:no-empty-interface
interface Props {
    // No props; this is the root component
}

interface State {
    view: string;
    options: {
        showHelp: boolean;
    };

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

    modal: any;

    libraryFilter: string;
}

export default class Dojo extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            view: 'home',
            options: {
                showHelp: true
            },
            parties: [],
            library: [],
            encounters: [],
            mapFolios: [],
            combats: [],
            selectedPartyID: null,
            selectedMonsterGroupID: null,
            selectedEncounterID: null,
            selectedMapFolioID: null,
            selectedCombatID: null,
            modal: null,
            libraryFilter: ''
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
                data.library.forEach(g => {
                    g.monsters.forEach(m => {
                        m.traits.forEach(t => {
                            t.uses = 0;
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

                data.combats.forEach(combat => {
                    if (!combat.notifications) {
                        combat.notifications = [];
                    }
                    combat.combatants.forEach(c => {
                        if (c.altitude === undefined) {
                            c.altitude = 0;
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
                data.libraryFilter = '';

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

    /////////////////////////////////////////////////////////////////////////////
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
        const party = this.getParty(this.state.selectedPartyID);
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
        const party = this.getParty(this.state.selectedPartyID);
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
        const party = this.getParty(this.state.selectedPartyID);
        if (party) {
            const index = party.pcs.indexOf(pc);
            party.pcs.splice(index, 1);
            this.setState({
                parties: this.state.parties
            });
        }
    }

    private sortPCs() {
        const party = this.getParty(this.state.selectedPartyID);
        if (party) {
            Utils.sort(party.pcs);
            this.setState({
                parties: this.state.parties
            });
        }
    }

    /////////////////////////////////////////////////////////////////////////////
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
        const group = this.getMonsterGroup(this.state.selectedMonsterGroupID);
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
        const group = this.getMonsterGroup(this.state.selectedMonsterGroupID);
        if (group) {
            group.monsters.push(monster);
            this.setState({
                library: this.state.library
            });
        }
    }

    private removeMonster(monster: Monster) {
        const group = this.getMonsterGroup(this.state.selectedMonsterGroupID);
        if (group) {
            const index = group.monsters.indexOf(monster);
            group.monsters.splice(index, 1);
            this.setState({
                library: this.state.library
            });
        }
    }

    private sortMonsters() {
        const group = this.getMonsterGroup(this.state.selectedMonsterGroupID);
        if (group) {
            Utils.sort(group.monsters);
            this.setState({
                library: this.state.library
            });
        }
    }

    private moveToGroup(monster: Monster, groupID: string) {
        const sourceGroup = this.findMonster(monster);
        if (sourceGroup) {
            const index = sourceGroup.monsters.indexOf(monster);

            sourceGroup.monsters.splice(index, 1);
            const group = this.getMonsterGroup(groupID);
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
                showMonsters: false
            }
        });
    }

    private saveMonster() {
        const group = this.getMonsterGroup(this.state.selectedMonsterGroupID);
        if (group) {
            const original = group.monsters.find(m => m.id === this.state.modal.monster.id);
            if (original) {
                const index = group.monsters.indexOf(original);
                group.monsters[index] = this.state.modal.monster;
                this.setState({
                    library: this.state.library,
                    modal: null
                });
            }
        }
    }

    private toggleShowSimilarMonsters() {
        // eslint-disable-next-line
        this.state.modal.showMonsters = !this.state.modal.showMonsters;
        this.setState({
            modal: this.state.modal
        });
    }

    private openDemographics() {
        this.setState({
            modal: {
                type: 'demographics'
            }
        });
    }

    private cloneMonster(monster: Monster, name: string) {
        const group = this.findMonster(monster);
        if (group) {
            const clone = {
                id: Utils.guid(),
                type: 'monster',
                name: name || monster.name + ' copy',
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
                hpTemp: monster.hpTemp,
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
                conditionImmunities: monster.conditionImmunities
            };

            group.monsters.push(clone);
            Utils.sort(group.monsters);

            this.setState({
                library: this.state.library
            });
        }
    }

    private addOpenGameContent() {
        monsters.forEach((data: any) => {
            try {
                if (data.name) {
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
                    if (data.legendary_actions) {
                        data.legendary_actions.forEach((rawTrait: any) => {
                            const trait = this.buildTrait(rawTrait, 'legendary');
                            monster.traits.push(trait);
                        });
                    }

                    let groupName = monster.tag;
                    if (groupName === '') {
                        groupName = monster.category;
                    }
                    if (groupName.indexOf('swarm') === 0) {
                        groupName = 'swarm';
                    }
                    if (groupName === 'any race') {
                        groupName = 'npc';
                    }

                    let group = this.getMonsterGroupByName(groupName);
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
    }

    private buildTrait(rawTrait: any, type: 'trait' | 'action' | 'legendary' | 'lair' | 'regional'): Trait {
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

        const text = rawTrait.desc.replace(/•/g, '*');

        return {
            id: Utils.guid(),
            type: type,
            name: name,
            usage: usage,
            text: text,
            uses: 0
        };
    }

    /////////////////////////////////////////////////////////////////////////////
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

    private removeEncounter() {
        const encounter = this.getEncounter(this.state.selectedEncounterID);
        if (encounter) {
            const index = this.state.encounters.indexOf(encounter);
            this.state.encounters.splice(index, 1);

            this.setState({
                encounters: this.state.encounters,
                selectedEncounterID: null
            });
        }
    }

    private addEncounterSlot(monster: Monster, waveID: string | null) {
        const group = this.findMonster(monster);
        if (group) {
            const slot = Factory.createEncounterSlot();
            slot.monsterGroupName = group.name;
            slot.monsterName = monster.name;
            const encounter = this.getEncounter(this.state.selectedEncounterID);
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
        const encounter = this.getEncounter(this.state.selectedEncounterID);
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
        const encounter = this.getEncounter(this.state.selectedEncounterID);
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
        const encounter = this.getEncounter(this.state.selectedEncounterID);
        if (encounter) {
            const index = encounter.waves.indexOf(wave);
            encounter.waves.splice(index, 1);

            this.setState({
                encounters: this.state.encounters
            });
        }
    }

    /////////////////////////////////////////////////////////////////////////////
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
        const folio = this.getMapFolio(this.state.selectedMapFolioID);
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
        const folio = this.getMapFolio(this.state.selectedMapFolioID);
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
        const folio = this.getMapFolio(this.state.selectedMapFolioID);
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
        const folio = this.getMapFolio(this.state.selectedMapFolioID);
        if (folio) {
            const index = folio.maps.indexOf(map);
            folio.maps.splice(index, 1);
            this.setState({
                mapFolios: this.state.mapFolios
            });
        }
    }

    /////////////////////////////////////////////////////////////////////////////
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
        const party = this.getParty(combatSetup.partyID);
        const encounter = this.getEncounter(combatSetup.encounterID);
        if (party && encounter) {
            const partyName = party.name || 'unnamed party';
            const encounterName = encounter.name || 'unnamed encounter';

            const combat = Factory.createCombat();
            combat.name = partyName + ' vs ' + encounterName;
            combat.encounterID = encounter.id;

            // Add a copy of each PC to the encounter
            party.pcs.filter(pc => pc.active).forEach(pc => {
                const combatant = JSON.parse(JSON.stringify(pc));

                combatant.current = false;
                combatant.pending = true;
                combatant.active = false;
                combatant.defeated = false;

                combatant.displayName = pc.name;
                combatant.initiative = 10;
                combatant.hp = null;
                combatant.conditions = [];
                combatant.altitude = 0;

                combat.combatants.push(combatant);
            });

            encounter.slots.forEach(slot => {
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

                        combatant.current = false;
                        combatant.pending = (combatSetup.encounterInitMode === 'manual');
                        combatant.active = (combatSetup.encounterInitMode !== 'manual');
                        combatant.defeated = false;

                        combatant.hp = combatant.hpMax;
                        combatant.conditions = [];
                        combatant.altitude = 0;

                        combat.combatants.push(combatant);
                    }
                } else {
                    combat.issues.push('unknown monster: ' + slot.monsterName + ' in group ' + slot.monsterGroupName);
                }
            });

            combat.combatants.forEach(c => c.altitude = 0);

            this.sortCombatants(combat);

            if (combatSetup.folioID && combatSetup.mapID) {
                const folio = this.getMapFolio(combatSetup.folioID);
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

    private openWaveModal() {
        const combat = this.getCombat(this.state.selectedCombatID);
        if (combat) {
            const encounter = this.getEncounter(combat.encounterID);
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

    private pauseCombat() {
        const combat = this.getCombat(this.state.selectedCombatID);
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
        const combat = this.getCombat(this.state.selectedCombatID);
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
        const combat = this.getCombat(this.state.selectedCombatID);
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
                    .filter(t => (t.uses > 1) && t.usage.toLowerCase().startsWith('recharge '))
                    .forEach(t => {
                        combat.notifications.push({
                            id: Utils.guid(),
                            type: 'trait-recharge',
                            data: t,
                            combatant: combatant as Combatant & Monster
                        });
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
        const combat = this.getCombat(this.state.selectedCombatID);
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
        const encounter = this.getEncounter(combatSetup.encounterID);
        const combat = this.getCombat(this.state.selectedCombatID);
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

                            combatant.current = false;
                            combatant.pending = (this.state.modal.combatSetup.encounterInitMode === 'manual');
                            combatant.active = (this.state.modal.combatSetup.encounterInitMode !== 'manual');
                            combatant.defeated = false;

                            combatant.hp = combatant.hpMax;
                            combatant.conditions = [];

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
        const combat = this.getCombat(this.state.selectedCombatID);
        if (combat) {
            const index = combat.combatants.indexOf(combatant);
            combat.combatants.splice(index, 1);

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

        const combat = this.getCombat(this.state.selectedCombatID);
        if (combat && combat.map) {
            combat.map.items.push(item);

            this.setState({
                combats: this.state.combats
            });
        }
    }

    private mapMove(combatant: (Combatant & PC) | (Combatant & Monster), dir: string) {
        const combat = this.getCombat(this.state.selectedCombatID);
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
        const combat = this.getCombat(this.state.selectedCombatID);
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
        const combat = this.getCombat(this.state.selectedCombatID);
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

    private addCondition(combatant: Combatant & Monster) {
        const combat = this.getCombat(this.state.selectedCombatID);
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

    private editCondition(combatant: Combatant & Monster, condition: Condition) {
        const combat = this.getCombat(this.state.selectedCombatID);
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

    private removeCondition(combatant: Combatant & Monster, conditionID: string) {
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
        const combat = this.getCombat(this.state.selectedCombatID);
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

    /////////////////////////////////////////////////////////////////////////////

    private setView(view: string) {
        this.setState({
            view: view
        });
    }

    private openAbout() {
        this.setState({
            modal: {
                type: 'about'
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

    private getParty(id: string | null) {
        return this.state.parties.find(p => p.id === id);
    }

    private getMonsterGroup(id: string | null) {
        return this.state.library.find(g => g.id === id);
    }

    private getEncounter(id: string | null) {
        return this.state.encounters.find(e => e.id === id);
    }

    private getMapFolio(id: string | null) {
        return this.state.mapFolios.find(f => f.id === id);
    }

    private getCombat(id: string | null) {
        return this.state.combats.find(c => c.id === id);
    }

    private getMonster(monsterName: string, groupName: string) {
        const group = this.getMonsterGroupByName(groupName);
        if (group) {
            return group.monsters.find(monster => monster.name === monsterName);
        }

        return undefined;
    }

    private getMonsterGroupByName(groupName: string) {
        return this.state.library.find(p => p.name === groupName);
    }

    private findMonster(monster: Monster) {
        return this.state.library.find(group => group.monsters.includes(monster));
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
            const combat = this.getCombat(this.state.selectedCombatID);
            this.sortCombatants(combat as Combat);
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
            options: this.state.options,
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
                value = (token === 'challenge') ? Utils.nudgeChallenge(obj.challenge, delta) : obj[token] + delta;
                this.changeValue(combatant, type, value);
            } else {
                obj = obj[token];
            }
        }
    }

    /////////////////////////////////////////////////////////////////////////////

    public render() {
        try {
            let content: JSX.Element | null = null;
            let actions: JSX.Element | null = null;
            switch (this.state.view) {
                case 'home':
                    content = (
                        <HomeScreen
                            library={this.state.library}
                            addOpenGameContent={() => this.addOpenGameContent()}
                        />
                    );
                    break;
                case 'parties':
                    content = (
                        <PartiesScreen
                            parties={this.state.parties}
                            selection={this.getParty(this.state.selectedPartyID) || null}
                            showHelp={this.state.options.showHelp}
                            selectParty={party => this.selectParty(party)}
                            addParty={() => this.addParty()}
                            removeParty={() => this.removeParty()}
                            addPC={() => this.addPC()}
                            removePC={pc => this.removePC(pc)}
                            sortPCs={() => this.sortPCs()}
                            changeValue={(combatant, type, value) => this.changeValue(combatant, type, value)}
                            nudgeValue={(combatant, type, delta) => this.nudgeValue(combatant, type, delta)}
                        />
                    );
                    break;
                case 'library':
                    content = (
                        <MonsterLibraryScreen
                            library={this.state.library}
                            selection={this.getMonsterGroup(this.state.selectedMonsterGroupID) || null}
                            filter={this.state.libraryFilter}
                            showHelp={this.state.options.showHelp}
                            selectMonsterGroup={group => this.selectMonsterGroup(group)}
                            addMonsterGroup={() => this.addMonsterGroup()}
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
                    let count = 0;
                    this.state.library.forEach(group => {
                        count += group.monsters.length;
                    });
                    if (count > 0) {
                        actions = (
                            <div className='actions'>
                                <div className='section'>
                                    <input
                                        type='text'
                                        placeholder='filter'
                                        value={this.state.libraryFilter}
                                        onChange={event => this.changeValue(this.state, 'libraryFilter', event.target.value)}
                                    />
                                </div>
                                <div className='section'>
                                    <button onClick={() => this.openDemographics()}>demographics</button>
                                </div>
                            </div>
                        );
                    }
                    break;
                case 'encounter':
                    content = (
                        <EncounterBuilderScreen
                            encounters={this.state.encounters}
                            selection={this.getEncounter(this.state.selectedEncounterID) || null}
                            parties={this.state.parties}
                            library={this.state.library}
                            showHelp={this.state.options.showHelp}
                            selectEncounter={encounter => this.selectEncounter(encounter)}
                            addEncounter={() => this.addEncounter()}
                            removeEncounter={() => this.removeEncounter()}
                            addWave={() => this.addWaveToEncounter()}
                            removeWave={wave => this.removeWave(wave)}
                            getMonster={(monsterName, groupName) => this.getMonster(monsterName, groupName) || null}
                            addEncounterSlot={(monster, waveID) => this.addEncounterSlot(monster, waveID)}
                            removeEncounterSlot={(slot, waveID) => this.removeEncounterSlot(slot, waveID)}
                            nudgeValue={(slot, type, delta) => this.nudgeValue(slot, type, delta)}
                            changeValue={(combatant, type, value) => this.changeValue(combatant, type, value)}
                        />
                    );
                    break;
                case 'maps':
                    content = (
                        <MapFoliosScreen
                            mapFolios={this.state.mapFolios}
                            selection={this.getMapFolio(this.state.selectedMapFolioID) || null}
                            showHelp={this.state.options.showHelp}
                            selectMapFolio={folio => this.selectMapFolio(folio)}
                            addMapFolio={() => this.addMapFolio()}
                            removeMapFolio={() => this.removeMapFolio()}
                            addMap={() => this.addMap()}
                            editMap={map => this.editMap(map)}
                            removeMap={map => this.removeMap(map)}
                            changeValue={(source, type, value) => this.changeValue(source, type, value)}
                        />
                    );
                    break;
                case 'combat':
                    const combat = this.getCombat(this.state.selectedCombatID);
                    content = (
                        <CombatManagerScreen
                            combats={this.state.combats}
                            combat={combat || null}
                            showHelp={this.state.options.showHelp}
                            createCombat={() => this.createCombat()}
                            resumeEncounter={pausedCombat => this.resumeCombat(pausedCombat)}
                            nudgeValue={(combatant, type, delta) => this.nudgeValue(combatant, type, delta)}
                            changeValue={(combatant, type, value) => this.changeValue(combatant, type, value)}
                            makeCurrent={(combatant) => this.makeCurrent(combatant, false)}
                            makeActive={(combatant) => this.makeActive(combatant)}
                            makeDefeated={(combatant) => this.makeDefeated(combatant)}
                            removeCombatant={(combatant) => this.removeCombatant(combatant)}
                            addCondition={(combatant) => this.addCondition(combatant)}
                            editCondition={(combatant, condition) => this.editCondition(combatant, condition)}
                            removeCondition={(combatant, conditionID) => this.removeCondition(combatant, conditionID)}
                            mapAdd={(combatant, x, y) => this.mapAdd(combatant, x, y)}
                            mapMove={(combatant, dir) => this.mapMove(combatant, dir)}
                            mapRemove={combatant => this.mapRemove(combatant)}
                            endTurn={(combatant) => this.endTurn(combatant)}
                            changeHP={(combatant, hp, temp) => this.changeHP(combatant, hp, temp)}
                            close={(notification, removeCondition) => this.closeNotification(notification, removeCondition)}
                        />
                    );
                    if (combat) {
                        const encounter = this.getEncounter(combat.encounterID);
                        if (encounter) {
                            let xp = 0;
                            combat.combatants.filter(c => c.type === 'monster')
                                .forEach(combatant => {
                                    xp += Utils.experience((combatant as Combatant & Monster).challenge);
                                });

                            actions = (
                                <div className='actions'>
                                    <div className='section'>
                                        <div className='text'>round: {combat.round}</div>
                                    </div>
                                    <div className='section'>
                                        <div className='text'>xp: {xp}</div>
                                    </div>
                                    <div className='section' style={{ display: encounter.waves.length === 0 ? 'none' : ''}}>
                                        <button onClick={() => this.openWaveModal()}>add wave</button>
                                    </div>
                                    <div className='section'>
                                        <button onClick={() => this.pauseCombat()}>pause encounter</button>
                                    </div>
                                    <div className='section'>
                                        <button onClick={() => this.endCombat()}>end encounter</button>
                                    </div>
                                </div>
                            );
                        }
                    }
                    break;
                case 'dm':
                    content = <DMScreen showHelp={this.state.options.showHelp} />;
                    break;
                default:
                    // Do nothing
                    break;
            }

            let modal = null;
            if (this.state.modal) {
                let modalTitle = null;
                let modalContent = null;
                let modalAllowClose = true;
                let modalAllowScroll = true;
                const modalButtons = {
                    left: [] as JSX.Element[],
                    right: [] as JSX.Element[]
                };

                switch (this.state.modal.type) {
                    case 'about':
                        modalContent = (
                            <AboutModal
                                options={this.state.options}
                                resetAll={() => this.resetAll()}
                                changeValue={(source, type, value) => this.changeValue(source, type, value)}
                            />
                        );
                        break;
                    case 'demographics':
                        modalTitle = 'demographics';
                        modalContent = (
                            <DemographicsModal
                                library={this.state.library}
                            />
                        );
                        break;
                    case 'monster':
                        modalTitle = 'monster editor';
                        modalContent = (
                            <MonsterEditorModal
                                monster={this.state.modal.monster}
                                library={this.state.library}
                                showMonsters={this.state.modal.showMonsters}
                            />
                        );
                        modalAllowClose = false;
                        modalAllowScroll = false;
                        modalButtons.left = [
                            (
                                <Checkbox
                                    key='similar'
                                    label='similar monsters'
                                    checked={this.state.modal.showMonsters}
                                    changeValue={() => this.toggleShowSimilarMonsters()}
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
                        modalAllowClose = false;
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
                                getMonster={(monsterName, groupName) => this.getMonster(monsterName, groupName) || null}
                                notify={() => this.setState({modal: this.state.modal})}
                            />
                        );
                        modalAllowClose = false;
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
                                getMonster={(monsterName, groupName) => this.getMonster(monsterName, groupName) || null}
                                notify={() => this.setState({modal: this.state.modal})}
                            />
                        );
                        modalAllowClose = false;
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
                    case 'condition-add':
                        modalTitle = 'add a condition';
                        modalContent = (
                            <ConditionModal
                                condition={this.state.modal.condition}
                                combatant={this.state.modal.combatant}
                                combat={this.state.modal.combat}
                            />
                        );
                        modalAllowClose = false;
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
                        modalAllowClose = false;
                        modalButtons.right = [
                            <button key='save' onClick={() => this.editConditionFromModal()}>save</button>,
                            <button key='cancel' onClick={() => this.closeModal()}>cancel</button>
                        ];
                        break;
                    default:
                        // Do nothing
                        break;
                }

                modal = (
                    <div className='overlay'>
                        <div className='modal'>
                            <div className='modal-header'>
                                <div className='title'>{modalTitle}</div>
                                {modalAllowClose ? <img className='image' src={close} alt='close' onClick={() => this.closeModal()} /> : null}
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

            return (
                <div className='dojo'>
                    <Titlebar
                        actions={actions}
                        blur={modal !== null}
                        openHome={() => this.setView('home')}
                        openAbout={() => this.openAbout()}
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
        }
    }
}
