import React from 'react';

import * as utils from '../utils';
import * as factory from '../models/factory';

import {
    Party, PC,
    MonsterGroup, Monster, Trait,
    Encounter, EncounterSlot, EncounterWave,
    MapFolio, Map,
    CombatSetup, Combat, Combatant, Notification, Condition
} from '../models/models';

import HomeScreen from './screens/home-screen';
import PartiesScreen from './screens/parties-screen';
import MonsterLibraryScreen from './screens/monster-library-screen';
import EncounterBuilderScreen from './screens/encounter-builder-screen';
import MapFoliosScreen from './screens/map-folios-screen';
import CombatManagerScreen from './screens/combat-manager-screen';

import AboutModal from './modals/about-modal';
import DemographicsModal from './modals/demographics-modal';
import MonsterEditorModal from './modals/monster-editor-modal';
import MapEditorModal from './modals/map-editor-modal';
import CombatStartModal from './modals/combat-start-modal';
import ConditionModal from './modals/condition-modal';

import Titlebar from './panels/titlebar';
import Navbar from './panels/navbar';

import Checkbox from './controls/checkbox';

import close from "../resources/images/close-black.svg";
import monsters from '../resources/data/monsters.json';

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
            view: "home",
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
            var data: State | null = null;

            try {
                var json = window.localStorage.getItem('data');
                if (json) {
                    data = JSON.parse(json);
                }
            } catch (ex) {
                console.error("Could not parse JSON: ", ex);
                data = null;
            }

            if (data !== null) {
                if (!data.mapFolios) {
                    data.mapFolios = [];
                    data.selectedMapFolioID = null;
                }

                data.encounters.forEach(enc => {
                    if (!enc.waves) {
                        enc.waves = [];
                    }
                });

                data.combats.forEach(c => {
                    if (!c.notifications) {
                        c.notifications = [];
                    }
                    c.combatants.forEach(c => {
                        if (c.altitude === undefined) {
                            c.altitude = 0;
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
            /*
            this.state.parties = [];
            this.state.library = [];
            this.state.encounters = [];
            this.state.mapFolios = [];
            this.state.combats = [];
            this.state.selectedPartyID = null;
            this.state.selectedMonsterGroupID = null;
            this.state.selectedEncounterID = null;
            this.state.selectedMapFolioID = null;
            this.state.selectedCombatID = null;
            */
        }
    }

    componentDidUpdate() {
        var json = null;
        try {
            json = JSON.stringify(this.state);
        } catch (ex) {
            console.error("Could not stringify data: ", ex);
            json = null;
        }

        if (json !== null) {
            window.localStorage.setItem('data', json);
        }
    }

    /////////////////////////////////////////////////////////////////////////////
    // Party screen

    addParty() {
        var party = factory.createParty();
        party.name = 'new party';
        var parties: Party[] = ([] as Party[]).concat(this.state.parties, [party]);
        utils.sort(parties);
        this.setState({
            parties: parties,
            selectedPartyID: party.id
        });
    }

    removeParty() {
        var party = this.getParty(this.state.selectedPartyID);
        if (party) {
            var index = this.state.parties.indexOf(party);
            this.state.parties.splice(index, 1);
            this.setState({
                parties: this.state.parties,
                selectedPartyID: null
            });
        }
    }

    addPC() {
        var party = this.getParty(this.state.selectedPartyID);
        if (party) {
            var pc = factory.createPC();
            pc.name = 'new pc';
            party.pcs.push(pc);
            this.setState({
                parties: this.state.parties
            });
        }
    }

    removePC(pc: PC) {
        var party = this.getParty(this.state.selectedPartyID);
        if (party) {
            var index = party.pcs.indexOf(pc);
            party.pcs.splice(index, 1);
            this.setState({
                parties: this.state.parties
            });
        }
    }

    sortPCs() {
        var party = this.getParty(this.state.selectedPartyID);
        if (party) {
            utils.sort(party.pcs);
            this.setState({
                parties: this.state.parties
            });
        }
    }

    /////////////////////////////////////////////////////////////////////////////
    // Library screen

    addMonsterGroup() {
        var group = factory.createMonsterGroup();
        group.name = 'new group';
        var library = ([] as MonsterGroup[]).concat(this.state.library, [group]);
        utils.sort(library);
        this.setState({
            library: library,
            selectedMonsterGroupID: group.id
        });
    }

    removeMonsterGroup() {
        var group = this.getMonsterGroup(this.state.selectedMonsterGroupID);
        if (group) {
            var index = this.state.library.indexOf(group);
            this.state.library.splice(index, 1);
            this.setState({
                library: this.state.library,
                selectedMonsterGroupID: null
            });
        }
    }

    addMonster() {
        var monster = factory.createMonster();
        monster.name = 'new monster';
        var group = this.getMonsterGroup(this.state.selectedMonsterGroupID);
        if (group) {
            group.monsters.push(monster);
            this.setState({
                library: this.state.library
            });
        }
    }

    removeMonster(monster: Monster) {
        var group = this.getMonsterGroup(this.state.selectedMonsterGroupID);
        if (group) {
            var index = group.monsters.indexOf(monster);
            group.monsters.splice(index, 1);
            this.setState({
                library: this.state.library
            });
        }
    }

    sortMonsters() {
        var group = this.getMonsterGroup(this.state.selectedMonsterGroupID);
        if (group) {
            utils.sort(group.monsters);
            this.setState({
                library: this.state.library
            });
        }
    }

    moveToGroup(monster: Monster, groupID: string) {
        var sourceGroup = this.findMonster(monster);
        if (sourceGroup) {
            var index = sourceGroup.monsters.indexOf(monster);

            sourceGroup.monsters.splice(index, 1);
            var group = this.getMonsterGroup(groupID);
            if (group) {
                group.monsters.push(monster);
                utils.sort(group.monsters);

                this.setState({
                    library: this.state.library
                });
            }
        }
    }

    editMonster(monster: Monster) {
        var copy = JSON.parse(JSON.stringify(monster));
        this.setState({
            modal: {
                type: "monster",
                monster: copy,
                showMonsters: false
            }
        });
    }

    saveMonster() {
        var group = this.getMonsterGroup(this.state.selectedMonsterGroupID);
        if (group) {
            var original = group.monsters.find(m => m.id === this.state.modal.monster.id);
            if (original) {
                var index = group.monsters.indexOf(original);
                group.monsters[index] = this.state.modal.monster;
                this.setState({
                    library: this.state.library,
                    modal: null
                });
            }
        }
    }

    toggleShowSimilarMonsters() {
        // eslint-disable-next-line
        this.state.modal.showMonsters = !this.state.modal.showMonsters;
        this.setState({
            modal: this.state.modal
        });
    }

    openDemographics() {
        this.setState({
            modal: {
                type: "demographics"
            }
        });
    }

    cloneMonster(monster: Monster, name: string) {
        var group = this.findMonster(monster);
        if (group) {
            var clone = {
                id: utils.guid(),
                type: "monster",
                name: name || monster.name + " copy",
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
                        id: utils.guid(),
                        name: trait.name,
                        usage: trait.usage,
                        type: trait.type,
                        text: trait.text
                    };
                }),
                conditionImmunities: monster.conditionImmunities
            };

            group.monsters.push(clone);
            utils.sort(group.monsters);

            this.setState({
                library: this.state.library
            });
        }
    }

    addOpenGameContent() {
        monsters.forEach((data: any) => {
            try {
                if (data.name) {
                    var monster = factory.createMonster();

                    monster.type = "monster";
                    monster.name = data.name;
                    monster.size = data.size.toLowerCase();
                    monster.category = data.type;
                    monster.tag = data.subtype;
                    monster.alignment = data.alignment;
                    monster.challenge = utils.parseChallenge(data.challenge_rating);
                    monster.ac = data.armor_class;
                    monster.hpMax = data.hit_points;
                    monster.speed = data.speed;
                    monster.senses = data.senses;
                    monster.languages = data.languages;

                    var index = data.hit_dice.indexOf("d");
                    monster.hitDice = parseInt(data.hit_dice.substring(0, index));

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

                    var saves = [
                        {
                            field: "strength_save",
                            text: "Strength"
                        },
                        {
                            field: "dexterity_save",
                            text: "Dexterity"
                        },
                        {
                            field: "constitution_save",
                            text: "Constitution"
                        },
                        {
                            field: "intelligence_save",
                            text: "Intelligence"
                        },
                        {
                            field: "wisdom_save",
                            text: "Wisdom"
                        },
                        {
                            field: "charisma_save",
                            text: "Charisma"
                        }
                    ];
                    saves.forEach(save => {
                        if (data[save.field]) {
                            var str = save.text + " " + data[save.field];
                            monster.savingThrows += monster.savingThrows === "" ? str : ", " + str;
                        }
                    });

                    var skills = [
                        {
                            field: "acrobatics",
                            text: "Acrobatics"
                        },
                        {
                            field: "animal_handling",
                            text: "Animal handling"
                        },
                        {
                            field: "arcana",
                            text: "Arcana"
                        },
                        {
                            field: "athletics",
                            text: "Athletics"
                        },
                        {
                            field: "deception",
                            text: "Deception"
                        },
                        {
                            field: "history",
                            text: "History"
                        },
                        {
                            field: "insight",
                            text: "Insight"
                        },
                        {
                            field: "intimidation",
                            text: "Intimidation"
                        },
                        {
                            field: "investigation",
                            text: "Investigation"
                        },
                        {
                            field: "medicine",
                            text: "Medicine"
                        },
                        {
                            field: "nature",
                            text: "Nature"
                        },
                        {
                            field: "perception",
                            text: "Perception"
                        },
                        {
                            field: "performance",
                            text: "Performance"
                        },
                        {
                            field: "persuasion",
                            text: "Persuasion"
                        },
                        {
                            field: "religion",
                            text: "Religion"
                        },
                        {
                            field: "sleight_of_hand",
                            text: "Sleight of hand"
                        },
                        {
                            field: "stealth",
                            text: "Stealth"
                        },
                        {
                            field: "survival",
                            text: "Survival"
                        }
                    ];
                    skills.forEach(skill => {
                        if (data[skill.field]) {
                            var str = skill.text + " " + data[skill.field];
                            monster.skills += monster.skills === "" ? str : ", " + str;
                        }
                    });

                    if (data.special_abilities) {
                        data.special_abilities.forEach((rawTrait: any) => {
                            var trait = this.buildTrait(rawTrait, "trait");
                            monster.traits.push(trait);
                        });
                    }
                    if (data.actions) {
                        data.actions.forEach((rawTrait: any) => {
                            var trait = this.buildTrait(rawTrait, "action");
                            monster.traits.push(trait);
                        });
                    }
                    if (data.legendary_actions) {
                        data.legendary_actions.forEach((rawTrait: any) => {
                            var trait = this.buildTrait(rawTrait, "legendary");
                            monster.traits.push(trait);
                        });
                    }

                    var groupName = monster.tag;
                    if (groupName === "") {
                        groupName = monster.category;
                    }
                    if (groupName.indexOf("swarm") === 0) {
                        groupName = "swarm";
                    }
                    if (groupName === "any race") {
                        groupName = "npc";
                    }

                    var group = this.getMonsterGroupByName(groupName);
                    if (!group) {
                        group = {
                            id: utils.guid(),
                            name: groupName,
                            monsters: []
                        };
                        this.state.library.push(group);
                    }
                    group.monsters.push(monster);
                }
            } catch (e) {
                console.log(e);
            }
        });

        utils.sort(this.state.library);

        this.setState({
            view: "library",
            library: this.state.library
        });
    }

    buildTrait(rawTrait: any, type: 'trait' | 'action' | 'legendary' | 'lair' | 'regional'): Trait {
        var name = "";
        var usage = "";

        var openBracket = rawTrait.name.indexOf("(");
        if (openBracket === -1) {
            name = rawTrait.name;
        } else {
            var closeBracket = rawTrait.name.indexOf(")");
            name = rawTrait.name.substring(0, openBracket - 1);
            usage = rawTrait.name.substring(openBracket + 1, closeBracket);
        }

        return {
            id: utils.guid(),
            type: type,
            name: name,
            usage: usage,
            text: rawTrait.desc
        };
    };

    /////////////////////////////////////////////////////////////////////////////
    // Encounter screen

    addEncounter() {
        var encounter = factory.createEncounter();
        encounter.name = 'new encounter';
        var encounters = ([] as Encounter[]).concat(this.state.encounters, [encounter]);
        utils.sort(encounters);

        this.setState({
            encounters: encounters,
            selectedEncounterID: encounter.id
        });
    }

    removeEncounter() {
        var encounter = this.getEncounter(this.state.selectedEncounterID);
        if (encounter) {
            var index = this.state.encounters.indexOf(encounter);
            this.state.encounters.splice(index, 1);

            this.setState({
                encounters: this.state.encounters,
                selectedEncounterID: null
            });
        }
    }

    addEncounterSlot(monster: Monster, waveID: string | null) {
        var group = this.findMonster(monster);
        if (group) {
            var slot = factory.createEncounterSlot();
            slot.monsterGroupName = group.name;
            slot.monsterName = monster.name;
            var encounter = this.getEncounter(this.state.selectedEncounterID);
            if (encounter) {
                if (waveID !== null) {
                    var wave = encounter.waves.find(w => w.id === waveID);
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

    removeEncounterSlot(slot: EncounterSlot, waveID: string | null) {
        var encounter = this.getEncounter(this.state.selectedEncounterID);
        if (encounter) {
            if (waveID) {
                var wave = encounter.waves.find(w => w.id === waveID);
                if (wave) {
                    var index = wave.slots.indexOf(slot);
                    wave.slots.splice(index, 1);
                }
            } else {
                var n = encounter.slots.indexOf(slot);
                encounter.slots.splice(n, 1);
            }

            this.setState({
                encounters: this.state.encounters
            });
        }
    }

    sortEncounterSlots(slotContainer: { slots: EncounterSlot[] }) {
        slotContainer.slots.sort((a, b) => {
            var aName = a.monsterName.toLowerCase();
            var bName = b.monsterName.toLowerCase();
            if (aName < bName) return -1;
            if (aName > bName) return 1;
            return 0;
        });
    }

    addWaveToEncounter() {
        var encounter = this.getEncounter(this.state.selectedEncounterID);
        if (encounter) {
            var wave = factory.createEncounterWave();
            wave.name = "wave " + (encounter.waves.length + 2);
            encounter.waves.push(wave);

            this.setState({
                encounters: this.state.encounters
            });
        }
    }

    removeWave(wave: EncounterWave) {
        var encounter = this.getEncounter(this.state.selectedEncounterID);
        if (encounter) {
            var index = encounter.waves.indexOf(wave);
            encounter.waves.splice(index, 1);

            this.setState({
                encounters: this.state.encounters
            });
        }
    }

    /////////////////////////////////////////////////////////////////////////////
    // Map screen

    addMapFolio() {
        var folio = factory.createMapFolio();
        folio.name = 'new folio';
        var folios = ([] as MapFolio[]).concat(this.state.mapFolios, [folio]);
        utils.sort(folios);

        this.setState({
            mapFolios: folios,
            selectedMapFolioID: folio.id
        });
    }

    removeMapFolio() {
        var folio = this.getMapFolio(this.state.selectedMapFolioID);
        if (folio) {
            var index = this.state.mapFolios.indexOf(folio);
            this.state.mapFolios.splice(index, 1);

            this.setState({
                mapFolios: this.state.mapFolios,
                selectedMapFolioID: null
            });
        }
    }

    addMap() {
        var folio = this.getMapFolio(this.state.selectedMapFolioID);
        if (folio) {
            var map = factory.createMap();
            map.name = 'new map';
            folio.maps.push(map);

            this.setState({
                mapFolios: this.state.mapFolios
            });
        }
    }

    editMap(map: Map) {
        var copy = JSON.parse(JSON.stringify(map));
        this.setState({
            modal: {
                type: "map",
                map: copy
            }
        });
    }

    saveMap() {
        var folio = this.getMapFolio(this.state.selectedMapFolioID);
        if (folio) {
            var original = folio.maps.find(m => m.id === this.state.modal.map.id);
            if (original) {
                var index = folio.maps.indexOf(original);
                folio.maps[index] = this.state.modal.map;
                this.setState({
                    mapFolios: this.state.mapFolios,
                    modal: null
                });
            }
        }
    }

    removeMap(map: Map) {
        var folio = this.getMapFolio(this.state.selectedMapFolioID);
        if (folio) {
            var index = folio.maps.indexOf(map);
            folio.maps.splice(index, 1);
            this.setState({
                mapFolios: this.state.mapFolios
            });
        }
    }

    /////////////////////////////////////////////////////////////////////////////
    // Combat screen

    createCombat() {
        var party = this.state.parties.length === 1 ? this.state.parties[0] : null;
        var encounter = this.state.encounters.length === 1 ? this.state.encounters[0] : null;

        var setup = factory.createCombatSetup();
        setup.partyID = party ? party.id : null;
        setup.encounterID = encounter ? encounter.id : null;
        if (encounter) {
            setup.monsterNames = utils.getMonsterNames(encounter);
        }

        this.setState({
            modal: {
                type: "combat-start",
                combatSetup: setup
            }
        });
    }

    startCombat() {
        var combatSetup: CombatSetup = this.state.modal.combatSetup;
        var party = this.getParty(combatSetup.partyID);
        var encounter = this.getEncounter(combatSetup.encounterID);
        if (party && encounter) {
            var partyName = party.name || "unnamed party";
            var encounterName = encounter.name || "unnamed encounter";

            var combat = factory.createCombat();
            combat.name = partyName + " vs " + encounterName;
            combat.encounterID = encounter.id;

            // Add a copy of each PC to the encounter
            party.pcs.filter(pc => pc.active).forEach(pc => {
                var combatant = JSON.parse(JSON.stringify(pc));

                combatant.current = false;
                combatant.pending = true;
                combatant.active = false;
                combatant.defeated = false;

                combatant.displayName = pc.name;
                combatant.initiative = null;
                combatant.hp = null;
                combatant.conditions = [];
                combatant.altitude = 0;

                combat.combatants.push(combatant);
            });

            encounter.slots.forEach(slot => {
                var monster = this.getMonster(slot.monsterName, slot.monsterGroupName);
                if (monster) {
                    var init = parseInt(utils.modifier(monster.abilityScores.dex));
                    var groupRoll = utils.dieRoll();

                    for (var n = 0; n !== slot.count; ++n) {
                        var singleRoll = utils.dieRoll();

                        var combatant = JSON.parse(JSON.stringify(monster));
                        combatant.id = utils.guid();

                        combatant.displayName = null;
                        if (combatSetup.monsterNames) {
                            var slotNames = combatSetup.monsterNames.find(names => names.id === slot.id);
                            if (slotNames) {
                                combatant.displayName = slotNames.names[n];
                            }
                        }

                        switch (combatSetup.encounterInitMode) {
                            case "manual":
                                combatant.initiative = 10;
                                break;
                            case "group":
                                combatant.initiative = init + groupRoll;
                                break;
                            case "individual":
                                combatant.initiative = init + singleRoll;
                                break;
                            default:
                                // Do nothing
                                break;
                        }

                        combatant.current = false;
                        combatant.pending = (combatSetup.encounterInitMode === "manual");
                        combatant.active = (combatSetup.encounterInitMode !== "manual");
                        combatant.defeated = false;
            
                        combatant.hp = combatant.hpMax;
                        combatant.conditions = [];
                        combatant.altitude = 0;

                        combat.combatants.push(combatant);
                    }
                } else {
                    combat.issues.push("unknown monster: " + slot.monsterName + " in group " + slot.monsterGroupName);
                }
            });

            combat.combatants.forEach(c => c.altitude = 0);

            this.sortCombatants(combat);

            if (combatSetup.folioID && combatSetup.mapID) {
                var folio = this.getMapFolio(combatSetup.folioID);
                if (folio) {
                    var map = folio.maps.find(m => m.id === combatSetup.mapID);
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

    openWaveModal() {
        var combat = this.getCombat(this.state.selectedCombatID);
        if (combat) {
            var encounter = this.getEncounter(combat.encounterID);
            if (encounter) {
                var setup = factory.createCombatSetup();
                setup.encounterID = combat.encounterID;
                setup.monsterNames = utils.getMonsterNames(encounter);

                this.setState({
                    modal: {
                        type: "combat-wave",
                        combatSetup: setup
                    }
                });
            }
        }
    }

    pauseCombat() {
        var combat = this.getCombat(this.state.selectedCombatID);
        if (combat) {
            combat.timestamp = new Date().toLocaleString();
            this.setState({
                combats: this.state.combats,
                selectedCombatID: null
            });
        }
    }

    resumeCombat(combat: Combat) {
        this.setState({
            selectedCombatID: combat.id
        });
    }

    endCombat() {
        var combat = this.getCombat(this.state.selectedCombatID);
        if (combat) {
            var index = this.state.combats.indexOf(combat);
            this.state.combats.splice(index, 1);
            this.setState({
                combats: this.state.combats,
                selectedCombatID: null
            });
        }
    }

    makeCurrent(combatant: (Combatant & PC) | (Combatant & Monster) | null, newRound: boolean) {
        var combat = this.getCombat(this.state.selectedCombatID);
        if (combat) {
            // Handle start-of-turn conditions
            combat.combatants.filter(actor => actor.conditions).forEach(actor => {
                actor.conditions.forEach(c => {
                    if (c.duration) {
                        switch (c.duration.type) {
                            case "saves":
                                // If it's my condition, and point is START, notify the user
                                if (combat && combatant && (actor.id === combatant.id) && (c.duration.point === "start")) {
                                    combat.notifications.push({
                                        id: utils.guid(),
                                        type: "condition-save",
                                        condition: c,
                                        combatant: combatant as Combatant & Monster
                                    });
                                }
                                break;
                            case "combatant":
                                // If this refers to me, and point is START, remove it
                                if (combat && combatant && (c.duration.combatantID === combatant.id) && (c.duration.point === "start")) {
                                    var index = actor.conditions.indexOf(c);
                                    actor.conditions.splice(index, 1);
                                    // Notify the user
                                    combat.notifications.push({
                                        id: utils.guid(),
                                        type: "condition-end",
                                        condition: c,
                                        combatant: combatant as Combatant & Monster
                                    });
                                }
                                break;
                            case "rounds":
                                // If it's my condition, decrement the condition
                                if (combatant && (actor.id === combatant.id)) {
                                    c.duration.count -= 1;
                                }
                                // If it's now at 0, remove it
                                if (c.duration.count === 0) {
                                    var n = actor.conditions.indexOf(c);
                                    actor.conditions.splice(n, 1);
                                    if (combat) {
                                        // Notify the user
                                        combat.notifications.push({
                                            id: utils.guid(),
                                            type: "condition-end",
                                            condition: c,
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

            combat.combatants.forEach(combatant => {
                combatant.current = false;
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

    makeActive(combatant: (Combatant & PC) | (Combatant & Monster)) {
        var combat = this.getCombat(this.state.selectedCombatID);
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

    makeDefeated(combatant: (Combatant & PC) | (Combatant & Monster)) {
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

    addWaveToCombat() {
        var combatSetup: CombatSetup = this.state.modal.combat;
        var encounter = this.getEncounter(combatSetup.encounterID);
        var combat = this.getCombat(this.state.selectedCombatID);
        if (combatSetup && encounter && combat) {
            var wave = encounter.waves.find(w => w.id === combatSetup.waveID);
            if (wave) {
                wave.slots.forEach(slot => {
                    var monster = this.getMonster(slot.monsterName, slot.monsterGroupName);
                    if (monster) {
                        var init = parseInt(utils.modifier(monster.abilityScores.dex));
                        var groupRoll = utils.dieRoll();

                        for (var n = 0; n !== slot.count; ++n) {
                            var singleRoll = utils.dieRoll();

                            var combatant = JSON.parse(JSON.stringify(monster));
                            combatant.id = utils.guid();

                            combatant.displayName = null;
                            if (combatSetup.monsterNames) {
                                var slotNames = combatSetup.monsterNames.find(names => names.id === slot.id);
                                if (slotNames) {
                                    combatant.displayName = slotNames.names[n];
                                }
                            }

                            switch (combatSetup.encounterInitMode) {
                                case "manual":
                                    combatant.initiative = 10;
                                    break;
                                case "group":
                                    combatant.initiative = init + groupRoll;
                                    break;
                                case "individual":
                                    combatant.initiative = init + singleRoll;
                                    break;
                                default:
                                    // Do nothing
                                    break;
                            }

                            combatant.current = false;
                            combatant.pending = (this.state.modal.combat.encounterInitMode === "manual");
                            combatant.active = (this.state.modal.combat.encounterInitMode !== "manual");
                            combatant.defeated = false;
                
                            combatant.hp = combatant.hpMax;
                            combatant.conditions = [];

                            if (combat) {
                                combat.combatants.push(combatant);
                            }
                        }
                    } else {
                        if (combat) {
                            var issue = "unknown monster: " + slot.monsterName + " in group " + slot.monsterGroupName;
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

    removeCombatant(combatant: (Combatant & PC) | (Combatant & Monster)) {
        var combat = this.getCombat(this.state.selectedCombatID);
        if (combat) {
            var index = combat.combatants.indexOf(combatant);
            combat.combatants.splice(index, 1);

            this.setState({
                combats: this.state.combats
            });
        }
    }

    mapAdd(combatant: ((Combatant & PC) | (Combatant & Monster)), x: number, y: number) {
        var item = factory.createMapItem();
        item.id = combatant.id;
        item.type = combatant.type as 'pc' | 'monster';
        item.x = x;
        item.y = y;
        var size = 1;
        if (combatant.type === 'monster') {
            size = utils.miniSize((combatant as Monster).size);
        }
        item.height = size;
        item.width = size;

        var combat = this.getCombat(this.state.selectedCombatID);
        if (combat && combat.map) {
            combat.map.items.push(item);

            this.setState({
                combats: this.state.combats
            });
        }
    }

    mapMove(combatant: (Combatant & PC) | (Combatant & Monster), dir: string) {
        var combat = this.getCombat(this.state.selectedCombatID);
        if (combat && combat.map) {
            var item = combat.map.items.find(i => i.id === combatant.id);
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

    mapRemove(combatant: (Combatant & PC) | (Combatant & Monster)) {
        var combat = this.getCombat(this.state.selectedCombatID);
        if (combat && combat.map) {
            var item = combat.map.items.find(i => i.id === combatant.id);
            if (item) {
                var index = combat.map.items.indexOf(item);
                combat.map.items.splice(index, 1);

                this.setState({
                    combats: this.state.combats
                });
            }
        }
    }

    endTurn(combatant: (Combatant & PC) | (Combatant & Monster)) {
        var combat = this.getCombat(this.state.selectedCombatID);
        if (combat) {
            // Handle end-of-turn conditions
            combat.combatants.filter(actor => actor.conditions).forEach(actor => {
                actor.conditions.forEach(c => {
                    if (c.duration) {
                        switch (c.duration.type) {
                            case "saves":
                                // If it's my condition, and point is END, notify the user
                                if (combat && (actor.id === combatant.id) && (c.duration.point === "end")) {
                                    var saveNotification = factory.createNotification();
                                    saveNotification.type = "condition-save";
                                    saveNotification.condition = c;
                                    saveNotification.combatant = combatant as Combatant & Monster;
                                    combat.notifications.push(saveNotification);
                                }
                                break;
                            case "combatant":
                                // If this refers to me, and point is END, remove it
                                if (combat && (c.duration.combatantID === combatant.id) && (c.duration.point === "end")) {
                                    var index = actor.conditions.indexOf(c);
                                    actor.conditions.splice(index, 1);
                                    // Notify the user
                                    var endNotification = factory.createNotification();
                                    endNotification.type = "condition-end";
                                    endNotification.condition = c;
                                    endNotification.combatant = combatant as Combatant & Monster;
                                    combat.notifications.push(endNotification);
                                }
                                break;
                            case "rounds":
                                // We check this at the beginning of each turn, not at the end
                                break;
                            default:
                                // Do nothing
                                break;
                        }
                    }
                });
            });

            var active = combat.combatants.filter(combatant => {
                return combatant.current || (!combatant.pending && combatant.active && !combatant.defeated);
            });
            if (active.length === 0) {
                // There's no-one left in the fight
                this.makeCurrent(null, false);
            } else if ((active.length === 1) && (active[0].defeated)) {
                // The only person in the fight is me, and I'm defeated
                this.makeCurrent(null, false);
            } else {
                var index = active.indexOf(combatant) + 1;
                var newRound = false;
                if (index >= active.length) {
                    index = 0;
                    newRound = true;
                }
                this.makeCurrent(active[index], newRound);
            }
        }
    }

    changeHP(combatant: Combatant & Monster, hp: number, temp: number) {
        combatant.hp = hp;
        combatant.hpTemp = temp;

        this.setState({
            combats: this.state.combats
        });
    }

    addCondition(combatant: Combatant & Monster) {
        var combat = this.getCombat(this.state.selectedCombatID);
        if (combat) {
            var condition = factory.createCondition();
            condition.name = "blinded";

            this.setState({
                modal: {
                    type: "condition-add",
                    condition: condition,
                    combatant: combatant,
                    combat: combat
                }
            });
        }
    }

    addConditionFromModal() {
        this.state.modal.combatant.conditions.push(this.state.modal.condition);

        this.setState({
            combats: this.state.combats,
            modal: null
        });
    }

    editCondition(combatant: Combatant & Monster, condition: Condition) {
        var combat = this.getCombat(this.state.selectedCombatID);
        if (combat) {
            this.setState({
                modal: {
                    type: "condition-edit",
                    condition: condition,
                    combatant: combatant,
                    combat: combat
                }
            });
        }
    }

    editConditionFromModal() {
        var conditions: Condition[] = this.state.modal.combatant.conditions;
        var original = conditions.find(c => c.id === this.state.modal.condition.id);
        if (original) {
            var index = conditions.indexOf(original);
            // eslint-disable-next-line
            conditions[index] = this.state.modal.condition;

            this.setState({
                combats: this.state.combats,
                modal: null
            });
        }
    }

    removeCondition(combatant: Combatant & Monster, conditionID: string) {
        var condition = combatant.conditions.find(c => c.id === conditionID);
        if (condition) {
            var index = combatant.conditions.indexOf(condition);
            combatant.conditions.splice(index, 1);

            this.setState({
                combats: this.state.combats
            });
        }
    }

    sortCombatants(combat: Combat) {
        combat.combatants.sort((a, b) => {
            // First sort by initiative, descending
            if (a.initiative && b.initiative && (a.initiative < b.initiative)) return 1;
            if (a.initiative && b.initiative && (a.initiative > b.initiative)) return -1;
            // Then sort by name, ascending
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        });
    }

    closeNotification(notification: Notification, removeCondition: boolean) {
        var combat = this.getCombat(this.state.selectedCombatID);
        if (combat) {
            var index = combat.notifications.indexOf(notification);
            combat.notifications.splice(index, 1);

            if (removeCondition && notification.combatant && notification.condition) {
                var conditionIndex = notification.combatant.conditions.indexOf(notification.condition);
                notification.combatant.conditions.splice(conditionIndex, 1);
            }

            this.setState({
                combats: this.state.combats
            });
        }
    }

    /////////////////////////////////////////////////////////////////////////////

    setView(view: string) {
        this.setState({
            view: view
        });
    }

    openAbout() {
        this.setState({
            modal: {
                type: "about"
            }
        });
    }

    closeModal() {
        this.setState({
            modal: null
        });
    }

    selectParty(party: Party | null) {
        this.setState({
            selectedPartyID: party ? party.id : null
        });
    }

    selectMonsterGroup(group: MonsterGroup | null) {
        this.setState({
            selectedMonsterGroupID: group ? group.id : null
        });
    }

    selectEncounter(encounter: Encounter | null) {
        this.setState({
            selectedEncounterID: encounter ? encounter.id : null
        });
    }

    selectMapFolio(mapFolio: MapFolio | null) {
        this.setState({
            selectedMapFolioID: mapFolio ? mapFolio.id : null
        });
    }

    getParty(id: string | null) {
        return this.state.parties.find(p => p.id === id);
    }

    getMonsterGroup(id: string | null) {
        return this.state.library.find(g => g.id === id);
    }

    getEncounter(id: string | null) {
        return this.state.encounters.find(e => e.id === id);
    }

    getMapFolio(id: string | null) {
        return this.state.mapFolios.find(f => f.id === id);
    }

    getCombat(id: string | null) {
        return this.state.combats.find(c => c.id === id);
    }

    getMonster(monsterName: string, groupName: string) {
        var group = this.getMonsterGroupByName(groupName);
        if (group) {
            return group.monsters.find(monster => monster.name === monsterName);
        }

        return undefined;
    }

    getMonsterGroupByName(groupName: string) {
        return this.state.library.find(p => p.name === groupName);
    }

    /*
    getMonster(monsterName: string, monsterGroup: MonsterGroup): Monster | undefined {
        return monsterGroup.monsters.find(monster => monster.name === monsterName);
    }
    */

    findMonster(monster: Monster) {
        return this.state.library.find(group => group.monsters.includes(monster));
    }

    resetAll() {
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

    changeValue(combatant: any, type: string, value: any) {
        switch (type) {
            case "hp":
                value = Math.min(value, combatant.hpMax);
                value = Math.max(value, 0);
                break;
            case "hpTemp":
                value = Math.max(value, 0);
                break;
            case "level":
                value = Math.max(value, 1);
                if (combatant.player !== undefined) {
                    value = Math.min(value, 20)
                } else {
                    value = Math.min(value, 6);
                }
                break;
            case "count":
                value = Math.max(value, 1);
                break;
            case "hitDice":
                value = Math.max(value, 1);
                break;
            default:
                // Do nothing
                break;
        }

        var tokens = type.split(".");
        var obj = combatant;
        for (var n = 0; n !== tokens.length; ++n) {
            var token = tokens[n];
            if (n === tokens.length - 1) {
                obj[token] = value;
            } else {
                obj = obj[token];
            }
        }

        utils.sort(this.state.parties);
        utils.sort(this.state.library);
        utils.sort(this.state.encounters);

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

    nudgeValue(combatant: any, type: string, delta: number) {
        var tokens = type.split(".");
        var obj = combatant;
        for (var n = 0; n !== tokens.length; ++n) {
            var token = tokens[n];
            if (n === tokens.length - 1) {
                var value = null;
                if (token === "challenge") {
                    value = utils.nudgeChallenge(obj.challenge, delta);
                } else {
                    value = obj[token] + delta;
                }
                this.changeValue(combatant, type, value);
            } else {
                obj = obj[token];
            }
        }
    }

    /////////////////////////////////////////////////////////////////////////////

    render() {
        try {
            var content: JSX.Element | null = null;
            var actions: JSX.Element | null = null;
            switch (this.state.view) {
                case "home":
                    content = (
                        <HomeScreen
                            library={this.state.library}
                            addOpenGameContent={() => this.addOpenGameContent()}
                        />
                    );
                    break;
                case "parties":
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
                case "library":
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
                    var count = 0;
                    this.state.library.forEach(group => {
                        count += group.monsters.length;
                    });
                    if (count > 0) {
                        actions = (
                            <div className="actions">
                                <div className="section">
                                    <input type="text" placeholder="filter" value={this.state.libraryFilter} onChange={event => this.changeValue(this.state, "libraryFilter", event.target.value)} />
                                </div>
                                <div className="section">
                                    <button onClick={() => this.openDemographics()}>demographics</button>
                                </div>
                            </div>
                        );
                    }
                    break;
                case "encounter":
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
                case "maps":
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
                case "combat":
                    var combat = this.getCombat(this.state.selectedCombatID);
                    content = (
                        <CombatManagerScreen
                            combats={this.state.combats}
                            combat={combat || null}
                            showHelp={this.state.options.showHelp}
                            createCombat={() => this.createCombat()}
                            resumeEncounter={combat => this.resumeCombat(combat)}
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
                        var encounter = this.getEncounter(combat.encounterID);
                        if (encounter) {
                            var xp = 0;
                            combat.combatants.filter(c => c.type === "monster")
                                .forEach(combatant => {
                                    xp += utils.experience((combatant as Combatant & Monster).challenge);
                                });

                            actions = (
                                <div className="actions">
                                    <div className="section">
                                        <div className="text">round: {combat.round}</div>
                                    </div>
                                    <div className="section">
                                        <div className="text">xp: {xp}</div>
                                    </div>
                                    <div className="section" style={{ display: encounter.waves.length === 0 ? "none" : ""}}>
                                        <button onClick={() => this.openWaveModal()}>add wave</button>
                                    </div>
                                    <div className="section">
                                        <button onClick={() => this.pauseCombat()}>pause encounter</button>
                                    </div>
                                    <div className="section">
                                        <button onClick={() => this.endCombat()}>end encounter</button>
                                    </div>
                                </div>
                            );
                        }
                    }
                    break;
                default:
                    // Do nothing
                    break;
            }

            var modal = null;
            if (this.state.modal) {
                var modalTitle = null;
                var modalContent = null;
                var modalAllowClose = true;
                var modalAllowScroll = true;
                var modalButtons = {
                    left: [] as JSX.Element[],
                    right: [] as JSX.Element[]
                };

                switch (this.state.modal.type) {
                    case "about":
                        modalContent = (
                            <AboutModal
                                options={this.state.options}
                                resetAll={() => this.resetAll()}
                                changeValue={(source, type, value) => this.changeValue(source, type, value)}
                            />
                        );
                        break;
                    case "demographics":
                        modalTitle = "demographics";
                        modalContent = (
                            <DemographicsModal
                                library={this.state.library}
                            />
                        );
                        break;
                    case "monster":
                        modalTitle = "monster editor";
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
                            <Checkbox
                                key="similar"
                                label="similar monsters"
                                checked={this.state.modal.showMonsters}
                                changeValue={() => this.toggleShowSimilarMonsters()}
                            /> 
                        ];
                        modalButtons.right = [
                            <button key="save" onClick={() => this.saveMonster()}>save</button>,
                            <button key="cancel" onClick={() => this.closeModal()}>cancel</button>
                        ];
                        break;
                    case "map":
                        modalTitle = "map editor";
                        modalContent = (
                            <MapEditorModal
                                map={this.state.modal.map}
                            />
                        );
                        modalAllowClose = false;
                        modalAllowScroll = false;
                        modalButtons.right = [
                            <button key="save" onClick={() => this.saveMap()}>save</button>,
                            <button key="cancel" onClick={() => this.closeModal()}>cancel</button>
                        ];
                        break;
                    case "combat-start":
                        modalTitle = "start a new encounter";
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
                            <button key="start encounter" className={this.state.modal.combatSetup.partyID && this.state.modal.combatSetup.encounterID ? "" : "disabled"} onClick={() => this.startCombat()}>start encounter</button>,
                            <button key="cancel" onClick={() => this.closeModal()}>cancel</button>
                        ];
                        break;
                    case "combat-wave":
                        modalTitle = "encounter waves";
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
                            <button key="add wave" className={this.state.modal.combatSetup.waveID !== null ? "" : "disabled"} onClick={() => this.addWaveToCombat()}>add wave</button>,
                            <button key="cancel" onClick={() => this.closeModal()}>cancel</button>
                        ];
                        break;
                    case "condition-add":
                        modalTitle = "add a condition";
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
                            <button key="add" onClick={() => this.addConditionFromModal()}>add</button>,
                            <button key="cancel" onClick={() => this.closeModal()}>cancel</button>
                        ];
                        break;
                    case "condition-edit":
                        modalTitle = "edit condition";
                        modalContent = (
                            <ConditionModal
                                condition={this.state.modal.condition}
                                combatant={this.state.modal.combatant}
                                combat={this.state.modal.combat}
                            />
                        );
                        modalAllowClose = false;
                        modalButtons.right = [
                            <button key="save" onClick={() => this.editConditionFromModal()}>save</button>,
                            <button key="cancel" onClick={() => this.closeModal()}>cancel</button>
                        ];
                        break;
                    default:
                        // Do nothing
                        break;
                }

                modal = (
                    <div className="overlay">
                        <div className="modal">
                            <div className="modal-header">
                                <div className="title">{modalTitle}</div>
                                {modalAllowClose ? <img className="image" src={close} alt="close" onClick={() => this.closeModal()} /> : null}
                            </div>
                            <div className={modalAllowScroll ? "modal-content scrollable" : "modal-content"}>
                                {modalContent}
                            </div>
                            <div className="modal-footer">
                                <div className="left">{modalButtons.left}</div>
                                <div className="right">{modalButtons.right}</div>
                            </div>
                        </div>
                    </div>
                );
            }

            return (
                <div className="dojo">
                    <Titlebar
                        actions={actions}
                        blur={modal !== null}
                        openHome={() => this.setView("home")}
                        openAbout={() => this.openAbout()}
                    />
                    <div className={(modal === null) ? "page-content" : "page-content blur"}>
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