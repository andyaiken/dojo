import React from 'react';

import * as utils from '../utils';
import * as factory from '../models/factory';

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

import Checkbox from './controls/checkbox';
import Titlebar from './controls/titlebar';
import Navbar from './controls/navbar';

import close from "../resources/images/close-black.svg";
import monsters from '../resources/data/monsters.json';

export default class Dojo extends React.Component {
    constructor() {
        super();

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
            modal: null
        };

        try {
            var data = null;

            try {
                var json = window.localStorage.getItem('data');
                data = JSON.parse(json);
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

                this.state = data;
                this.state.view = "home";
                this.state.modal = null;
            }
        } catch (ex) {
            console.error(ex);
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

    addParty(name) {
        var party = factory.createParty();
        party.name = name;
        var parties = [].concat(this.state.parties, [party]);
        utils.sort(parties);
        this.setState({
            parties: parties,
            selectedPartyID: party.id
        });
    }

    removeParty() {
        var party = this.getParty(this.state.selectedPartyID);
        var index = this.state.parties.indexOf(party);
        this.state.parties.splice(index, 1);
        this.setState({
            parties: this.state.parties,
            selectedPartyID: null
        });
    }

    addPC(name) {
        var pc = factory.createPC();
        pc.name = name;
        var party = this.getParty(this.state.selectedPartyID);
        party.pcs.push(pc);
        this.setState({
            parties: this.state.parties
        });
        return pc;
    }

    removePC(pc) {
        var party = this.getParty(this.state.selectedPartyID);
        var index = party.pcs.indexOf(pc);
        party.pcs.splice(index, 1);
        this.setState({
            parties: this.state.parties
        });
    }

    sortPCs() {
        var party = this.getParty(this.state.selectedPartyID);
        utils.sort(party.pcs);
        this.setState({
            parties: this.state.parties
        });
    }

    /////////////////////////////////////////////////////////////////////////////
    // Library screen

    addMonsterGroup(name) {
        var group = factory.createMonsterGroup();
        group.name = name;
        var library = [].concat(this.state.library, [group]);
        utils.sort(library);
        this.setState({
            library: library,
            selectedMonsterGroupID: group.id
        });
    }

    removeMonsterGroup() {
        var group = this.getMonsterGroup(this.state.selectedMonsterGroupID);
        var index = this.state.library.indexOf(group);
        this.state.library.splice(index, 1);
        this.setState({
            library: this.state.library,
            selectedMonsterGroupID: null
        });
    }

    addMonster(name) {
        var monster = factory.createMonster();
        monster.name = name;
        var group = this.getMonsterGroup(this.state.selectedMonsterGroupID);
        group.monsters.push(monster);
        this.setState({
            library: this.state.library
        });
    }

    removeMonster(monster) {
        var group = this.getMonsterGroup(this.state.selectedMonsterGroupID);
        var index = group.monsters.indexOf(monster);
        group.monsters.splice(index, 1);
        this.setState({
            library: this.state.library
        });
    }

    sortMonsters() {
        var group = this.getMonsterGroup(this.state.selectedMonsterGroupID);
        utils.sort(group.monsters);
        this.setState({
            library: this.state.library
        });
    }

    moveToGroup(monster, groupID) {
        var sourceGroup = this.findMonster(monster);
        var index = sourceGroup.monsters.indexOf(monster);

        sourceGroup.monsters.splice(index, 1);
        var group = this.getMonsterGroup(groupID);
        group.monsters.push(monster);
        utils.sort(group.monsters);

        this.setState({
            library: this.state.library
        });
    }

    editMonster(monster) {
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
        var original = group.monsters.find(m => m.id === this.state.modal.monster.id);
        var index = group.monsters.indexOf(original);
        group.monsters[index] = this.state.modal.monster;
        this.setState({
            library: this.state.library,
            modal: null
        });
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

    cloneMonster(monster, name) {
        var group = this.findMonster(monster);

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

    addOpenGameContent() {
        monsters.forEach(data => {
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
                    monster.hp = data.hit_points;
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
                        data.special_abilities.forEach(rawTrait => {
                            var trait = this.buildTrait(rawTrait, "trait");
                            monster.traits.push(trait);
                        });
                    }
                    if (data.actions) {
                        data.actions.forEach(rawTrait => {
                            var trait = this.buildTrait(rawTrait, "action");
                            monster.traits.push(trait);
                        });
                    }
                    if (data.legendary_actions) {
                        data.legendary_actions.forEach(rawTrait => {
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

    buildTrait(rawTrait, type) {
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

    addEncounter(name) {
        var encounter = factory.createEncounter();
        encounter.name = name;
        var encounters = [].concat(this.state.encounters, [encounter]);
        utils.sort(encounters);

        this.setState({
            encounters: encounters,
            selectedEncounterID: encounter.id
        });
    }

    removeEncounter() {
        var encounter = this.getEncounter(this.state.selectedEncounterID);
        var index = this.state.encounters.indexOf(encounter);
        this.state.encounters.splice(index, 1);

        this.setState({
            encounters: this.state.encounters,
            selectedEncounterID: null
        });
    }

    addEncounterSlot(monster, waveID) {
        var group = this.findMonster(monster);

        var slot = factory.createEncounterSlot();
        slot.monsterGroupName = group.name;
        slot.monsterName = monster.name;
        var encounter = this.getEncounter(this.state.selectedEncounterID);
        if (waveID !== null) {
            var wave = encounter.waves.find(w => w.id === waveID);
            wave.slots.push(slot);
            this.sortEncounterSlots(wave);
        } else {
            encounter.slots.push(slot);
            this.sortEncounterSlots(encounter);
        }

        this.setState({
            encounters: this.state.encounters
        });

        return slot;
    }

    removeEncounterSlot(slot, waveID) {
        var encounter = this.getEncounter(this.state.selectedEncounterID);
        if (waveID) {
            var wave = encounter.waves.find(w => w.id === waveID);
            var index = wave.slots.indexOf(slot);
            wave.slots.splice(index, 1);
        } else {
            var n = encounter.slots.indexOf(slot);
            encounter.slots.splice(n, 1);
        }

        this.setState({
            encounters: this.state.encounters
        });
    }

    sortEncounterSlots(slotContaimer) {
        slotContaimer.slots.sort((a, b) => {
            var aName = a.monsterName.toLowerCase();
            var bName = b.monsterName.toLowerCase();
            if (aName < bName) return -1;
            if (aName > bName) return 1;
            return 0;
        });
    }

    addWaveToEncounter() {
        var encounter = this.getEncounter(this.state.selectedEncounterID);

        var wave = factory.createEncounterWave();
        wave.name = "wave " + (encounter.waves.length + 2);
        encounter.waves.push(wave);

        this.setState({
            encounters: this.state.encounters
        });
    }

    removeWave(wave) {
        var encounter = this.getEncounter(this.state.selectedEncounterID);
        var index = encounter.waves.indexOf(wave);
        encounter.waves.splice(index, 1);

        this.setState({
            encounters: this.state.encounters
        });
    }

    /////////////////////////////////////////////////////////////////////////////
    // Map screen

    addMapFolio(name) {
        var folio = factory.createMapFolio();
        folio.name = name;
        var folios = [].concat(this.state.mapFolios, [folio]);
        utils.sort(folios);

        this.setState({
            mapFolios: folios,
            selectedMapFolioID: folio.id
        });
    }

    removeMapFolio() {
        var folio = this.getMapFolio(this.state.selectedMapFolioID);
        var index = this.state.mapFolios.indexOf(folio);
        this.state.mapFolios.splice(index, 1);

        this.setState({
            mapFolios: this.state.mapFolios,
            selectedMapFolioID: null
        });
    }

    addMap(name) {
        var map = factory.createMap();
        map.name = name;

        var folio = this.getMapFolio(this.state.selectedMapFolioID);
        folio.maps.push(map);

        this.setState({
            mapFolios: this.state.mapFolios
        });
    }

    editMap(map) {
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
        var original = folio.maps.find(m => m.id === this.state.modal.map.id);
        var index = folio.maps.indexOf(original);
        folio.maps[index] = this.state.modal.map;
        this.setState({
            mapFolios: this.state.mapFolios,
            modal: null
        });
    }

    removeMap(map) {
        var folio = this.getMapFolio(this.state.selectedMapFolioID);
        var index = folio.maps.indexOf(map);
        folio.maps.splice(index, 1);
        this.setState({
            mapFolios: this.state.mapFolios
        });
    }

    /////////////////////////////////////////////////////////////////////////////
    // Combat screen

    createCombat() {
        var party = this.state.parties.length === 1 ? this.state.parties[0] : null;
        var encounter = this.state.encounters.length === 1 ? this.state.encounters[0] : null;

        this.setState({
            modal: {
                type: "combat-start",
                combat: {
                    partyID: party ? party.id : null,
                    encounterID: encounter ? encounter.id : null,
                    folioID: null,
                    mapID: null,
                    encounterInitMode: "group",
                    monsterNames: utils.getMonsterNames(encounter),
                    map: null
                }
            }
        });
    }

    startCombat() {
        var party = this.getParty(this.state.modal.combat.partyID);
        var partyName = party.name || "unnamed party";

        var encounter = this.getEncounter(this.state.modal.combat.encounterID);
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

            combat.combatants.push(combatant);
        });

        encounter.slots.forEach(slot => {
            var group = this.getMonsterGroupByName(slot.monsterGroupName);
            var monster = this.getMonster(slot.monsterName, group);

            if (monster) {
                var init = parseInt(utils.modifier(monster.abilityScores.dex));
                var groupRoll = utils.dieRoll();

                for (var n = 0; n !== slot.count; ++n) {
                    var singleRoll = utils.dieRoll();

                    var combatant = JSON.parse(JSON.stringify(monster));
                    combatant.id = utils.guid();

                    combatant.displayName = null;
                    if (this.state.modal.combat.monsterNames) {
                        var slotNames = this.state.modal.combat.monsterNames.find(names => names.id === slot.id);
                        if (slotNames) {
                            combatant.displayName = slotNames.names[n];
                        }
                    }

                    switch (this.state.modal.combat.encounterInitMode) {
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
                    combat.combatants.push(combatant);
                }
            } else {
                combat.issues.push("unknown monster: " + slot.monsterName + " in group " + slot.monsterGroupName);
            }
        });

        combat.combatants.forEach(c => c.altitude = 0);

        this.sortCombatants(combat);

        if (this.state.modal.combat.folioID && this.state.modal.combat.mapID) {
            var folio = this.getMapFolio(this.state.modal.combat.folioID);
            var map = folio.maps.find(m => m.id === this.state.modal.combat.mapID);
            combat.map = JSON.parse(JSON.stringify(map));
        }

        this.setState({
            combats: [].concat(this.state.combats, [combat]),
            selectedCombatID: combat.id,
            modal: null
        });
    }

    openWaveModal() {
        var combat = this.getCombat(this.state.selectedCombatID);
        var encounter = this.getEncounter(combat.encounterID);

        this.setState({
            modal: {
                type: "combat-wave",
                combat: {
                    encounterID: combat.encounterID,
                    encounterInitMode: "group",
                    waveID: null,
                    monsterNames: utils.getMonsterNames(encounter)
                }
            }
        });
    }

    pauseCombat() {
        var combat = this.getCombat(this.state.selectedCombatID);
        combat.timestamp = new Date().toLocaleString();
        this.setState({
            combats: this.state.combats,
            selectedCombatID: null
        });
    }

    resumeCombat(combat) {
        this.setState({
            selectedCombatID: combat.id
        });
    }

    endCombat() {
        var combat = this.getCombat(this.state.selectedCombatID);
        var index = this.state.combats.indexOf(combat);
        this.state.combats.splice(index, 1);
        this.setState({
            combats: this.state.combats,
            selectedCombatID: null
        });
    }

    makeCurrent(combatant, newRound) {
        var combat = this.getCombat(this.state.selectedCombatID);

        // Handle start-of-turn conditions
        combat.combatants.filter(actor => actor.conditions).forEach(actor => {
            actor.conditions.filter(c => c.duration !== null)
                .forEach(c => {
                    switch (c.duration.type) {
                        case "saves":
                            // If it's my condition, and point is START, notify the user
                            if ((actor.id === combatant.id) && (c.duration.point === "start")) {
                                combat.notifications.push({
                                    id: utils.guid(),
                                    type: "condition-save",
                                    condition: c,
                                    combatant: combatant
                                });
                            }
                            break;
                        case "combatant":
                            // If this refers to me, and point is START, remove it
                            if ((c.duration.combatantID === combatant.id) && (c.duration.point === "start")) {
                                var index = actor.conditions.indexOf(c);
                                actor.conditions.splice(index, 1);
                                // Notify the user
                                combat.notifications.push({
                                    id: utils.guid(),
                                    type: "condition-end",
                                    condition: c,
                                    combatant: combatant
                                });
                            }
                            break;
                        case "rounds":
                            // If it's my condition, decrement the condition
                            if (actor.id === combatant.id) {
                                c.duration.count -= 1;
                            }
                            // If it's now at 0, remove it
                            if (c.duration.count === 0) {
                                var n = actor.conditions.indexOf(c);
                                actor.conditions.splice(n, 1);
                                // Notify the user
                                combat.notifications.push({
                                    id: utils.guid(),
                                    type: "condition-end",
                                    condition: c,
                                    combatant: combatant
                                });
                            }
                            break;
                        default:
                            // Do nothing
                            break;
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

    makeActive(combatant) {
        combatant.pending = false;
        combatant.active = true;
        combatant.defeated = false;

        var combat = this.getCombat(this.state.selectedCombatID);
        this.sortCombatants(combat);

        this.setState({
            combats: this.state.combats
        });
    }

    makeDefeated(combatant) {
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
        var encounter = this.getEncounter(this.state.modal.combat.encounterID);
        var combat = this.getCombat(this.state.selectedCombatID);
        var wave = encounter.waves.find(w => w.id === this.state.modal.combat.waveID);

        wave.slots.forEach(slot => {
            var group = this.getMonsterGroupByName(slot.monsterGroupName);
            var monster = this.getMonster(slot.monsterName, group);

            if (monster) {
                var init = parseInt(utils.modifier(monster.abilityScores.dex));
                var groupRoll = utils.dieRoll();

                for (var n = 0; n !== slot.count; ++n) {
                    var singleRoll = utils.dieRoll();

                    var combatant = JSON.parse(JSON.stringify(monster));
                    combatant.id = utils.guid();

                    combatant.displayName = null;
                    if (this.state.modal.combat.monsterNames) {
                        var slotNames = this.state.modal.combat.monsterNames.find(names => names.id === slot.id);
                        if (slotNames) {
                            combatant.displayName = slotNames.names[n];
                        }
                    }

                    switch (this.state.modal.combat.encounterInitMode) {
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
                    combat.combatants.push(combatant);
                }
            } else {
                combat.issues.push("unknown monster: " + slot.monsterName + " in group " + slot.monsterGroupName);
            }
        });

        this.sortCombatants(combat);

        this.setState({
            combats: this.state.combats,
            modal: null
        });
    }

    removeCombatant(combatant) {
        var combat = this.getCombat(this.state.selectedCombatID);
        var index = combat.combatants.indexOf(combatant);
        combat.combatants.splice(index, 1);

        this.setState({
            combats: this.state.combats
        });
    }

    mapAdd(combatant, x, y) {
        var item = factory.createMapItem();
        item.id = combatant.id;
        item.type = combatant.type;
        item.x = x;
        item.y = y;
        var size = 1;
        if (combatant.type === 'monster') {
            size = utils.miniSize(combatant.size);
        }
        item.height = size;
        item.width = size;

        var combat = this.getCombat(this.state.selectedCombatID);
        combat.map.items.push(item);

        this.setState({
            combats: this.state.combats
        });
    }

    mapMove(combatant, dir) {
        var combat = this.getCombat(this.state.selectedCombatID);
        var item = combat.map.items.find(i => i.id === combatant.id);
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

    mapRemove(combatant) {
        var combat = this.getCombat(this.state.selectedCombatID);
        var item = combat.map.items.find(i => i.id === combatant.id);
        var index = combat.map.items.indexOf(item);
        combat.map.items.splice(index, 1);

        this.setState({
            combats: this.state.combats
        });
    }

    endTurn(combatant) {
        var combat = this.getCombat(this.state.selectedCombatID);

        // Handle end-of-turn conditions
        combat.combatants.filter(actor => actor.conditions).forEach(actor => {
            actor.conditions.filter(c => c.duration !== null)
                .forEach(c => {
                    switch (c.duration.type) {
                        case "saves":
                            // If it's my condition, and point is END, notify the user
                            if ((actor.id === combatant.id) && (c.duration.point === "end")) {
                                combat.notifications.push({
                                    id: utils.guid(),
                                    type: "condition-save",
                                    condition: c,
                                    combatant: combatant
                                });
                            }
                            break;
                        case "combatant":
                            // If this refers to me, and point is END, remove it
                            if ((c.duration.combatantID === combatant.id) && (c.duration.point === "end")) {
                                var index = actor.conditions.indexOf(c);
                                actor.conditions.splice(index, 1);
                                // Notify the user
                                combat.notifications.push({
                                    id: utils.guid(),
                                    type: "condition-end",
                                    condition: c,
                                    combatant: combatant
                                });
                            }
                            break;
                        case "rounds":
                            // We check this at the beginning of each turn, not at the end
                            break;
                        default:
                            // Do nothing
                            break;
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

    changeHP(combatant, hp, temp) {
        combatant.hp = hp;
        combatant.hpTemp = temp;

        this.setState({
            combats: this.state.combats
        });
    }

    addCondition(combatant) {
        var condition = {
            id: utils.guid(),
            name: "blinded",
            level: 1,
            text: null,
            duration: null
        }

        var combat = this.getCombat(this.state.selectedCombatID);

        this.setState({
            modal: {
                type: "condition-add",
                condition: condition,
                combatant: combatant,
                combat: combat
            }
        });
    }

    addConditionFromModal() {
        this.state.modal.combatant.conditions.push(this.state.modal.condition);

        this.setState({
            combats: this.state.combats,
            modal: null
        });
    }

    editCondition(combatant, condition) {
        var combat = this.getCombat(this.state.selectedCombatID);

        this.setState({
            modal: {
                type: "condition-edit",
                condition: condition,
                combatant: combatant,
                combat: combat
            }
        });
    }

    editConditionFromModal() {
        var original = this.state.modal.combatant.conditions.find(c => c.id === this.state.modal.condition.id);
        var index = this.state.modal.combatant.conditions.indexOf(original);
        // eslint-disable-next-line
        this.state.modal.combatant.conditions[index] = this.state.modal.condition;

        this.setState({
            combats: this.state.combats,
            modal: null
        });
    }

    removeCondition(combatant, conditionID) {
        var condition = combatant.conditions.find(c => c.id === conditionID);
        var index = combatant.conditions.indexOf(condition);
        combatant.conditions.splice(index, 1);

        this.setState({
            combats: this.state.combats
        });
    }

    sortCombatants(combat) {
        combat.combatants.sort((a, b) => {
            // First sort by initiative, descending
            if (a.initiative < b.initiative) return 1;
            if (a.initiative > b.initiative) return -1;
            // Then sort by name, ascending
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        });
    }

    closeNotification(notification, removeCondition) {
        var combat = this.getCombat(this.state.selectedCombatID);
        var index = combat.notifications.indexOf(notification);
        combat.notifications.splice(index, 1);

        if (removeCondition) {
            var conditionIndex = notification.combatant.conditions.indexOf(notification.condition);
            notification.combatant.conditions.splice(conditionIndex, 1);
        }

        this.setState({
            combats: this.state.combats
        });
    }

    /////////////////////////////////////////////////////////////////////////////

    setView(view) {
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

    selectParty(party) {
        this.setState({
            selectedPartyID: party ? party.id : null
        });
    }

    selectMonsterGroup(group) {
        this.setState({
            selectedMonsterGroupID: group ? group.id : null
        });
    }

    selectEncounter(encounter) {
        this.setState({
            selectedEncounterID: encounter ? encounter.id : null
        });
    }

    selectMapFolio(mapFolio) {
        this.setState({
            selectedMapFolioID: mapFolio ? mapFolio.id : null
        });
    }

    getParty(id) {
        var result = null;
        this.state.parties.forEach(party => {
            if (party.id === id) {
                result = party;
            }
        });
        return result;
    }

    getMonsterGroup(id) {
        var result = null;
        this.state.library.forEach(group => {
            if (group.id === id) {
                result = group;
            }
        });
        return result;
    }

    getEncounter(id) {
        var result = null;
        this.state.encounters.forEach(encounter => {
            if (encounter.id === id) {
                result = encounter;
            }
        });
        return result;
    }

    getMapFolio(id) {
        var result = null;
        this.state.mapFolios.forEach(folio => {
            if (folio.id === id) {
                result = folio;
            }
        });
        return result;
    }

    getCombat(id) {
        var result = null;
        this.state.combats.forEach(combat => {
            if (combat.id === id) {
                result = combat;
            }
        });
        return result;
    }

    getMonsterGroupByName(groupName) {
        var result = null;

        this.state.library.forEach(group => {
            if (group.name === groupName) {
                result = group;
            }
        });

        return result;
    }

    getMonster(monsterName, monsterGroup) {
        var result = null;

        if (monsterGroup && monsterGroup.monsters) {
            monsterGroup.monsters.forEach(monster => {
                if (monster.name === monsterName) {
                    result = monster;
                }
            });
        }

        return result;
    }

    findMonster(monster) {
        var result = null;
        this.state.library.forEach(group => {
            if (group.monsters.indexOf(monster) !== -1) {
                result = group;
            }
        });
        return result;
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

    changeValue(combatant, type, value) {
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

    nudgeValue(combatant, type, delta) {
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
            var content = null;
            var actions = null;
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
                            selection={this.getParty(this.state.selectedPartyID)}
                            showHelp={this.state.options.showHelp}
                            selectParty={party => this.selectParty(party)}
                            addParty={name => this.addParty(name)}
                            removeParty={() => this.removeParty()}
                            addPC={name => this.addPC(name)}
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
                            selection={this.getMonsterGroup(this.state.selectedMonsterGroupID)}
                            filter={this.state.libraryFilter}
                            showHelp={this.state.options.showHelp}
                            selectMonsterGroup={group => this.selectMonsterGroup(group)}
                            addMonsterGroup={name => this.addMonsterGroup(name)}
                            removeMonsterGroup={() => this.removeMonsterGroup()}
                            addMonster={name => this.addMonster(name)}
                            removeMonster={monster => this.removeMonster(monster)}
                            sortMonsters={() => this.sortMonsters()}
                            changeValue={(combatant, type, value) => this.changeValue(combatant, type, value)}
                            nudgeValue={(combatant, type, delta) => this.nudgeValue(combatant, type, delta)}
                            editMonster={combatant => this.editMonster(combatant)}
                            cloneMonster={(combatant, name) => this.cloneMonster(combatant, name)}
                            moveToGroup={(combatant, groupID) => this.moveToGroup(combatant, groupID)}
                            addOpenGameContent={() => this.addOpenGameContent()}
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
                            selection={this.getEncounter(this.state.selectedEncounterID)}
                            parties={this.state.parties}
                            library={this.state.library}
                            showHelp={this.state.options.showHelp}
                            selectEncounter={encounter => this.selectEncounter(encounter)}
                            addEncounter={name => this.addEncounter(name)}
                            removeEncounter={encounter => this.removeEncounter(encounter)}
                            addWave={() => this.addWaveToEncounter()}
                            removeWave={wave => this.removeWave(wave)}
                            getMonster={(monsterName, monsterGroupName) => this.getMonster(monsterName, this.getMonsterGroupByName(monsterGroupName))}
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
                            selection={this.getMapFolio(this.state.selectedMapFolioID)}
                            showHelp={this.state.options.showHelp}
                            selectMapFolio={folio => this.selectMapFolio(folio)}
                            addMapFolio={name => this.addMapFolio(name)}
                            removeMapFolio={() => this.removeMapFolio()}
                            addMap={name => this.addMap(name)}
                            editMap={map => this.editMap(map)}
                            removeMap={map => this.removeMap(map)}
                            nudgeValue={(source, type, delta) => this.nudgeValue(source, type, delta)}
                            changeValue={(source, type, value) => this.changeValue(source, type, value)}
                        />
                    );
                    break;
                case "combat":
                    var combat = this.getCombat(this.state.selectedCombatID);
                    content = (
                        <CombatManagerScreen
                            parties={this.state.parties}
                            encounters={this.state.encounters}
                            combats={this.state.combats}
                            combat={combat}
                            showHelp={this.state.options.showHelp}
                            createCombat={() => this.createCombat()}
                            resumeEncounter={combat => this.resumeCombat(combat)}
                            nudgeValue={(combatant, type, delta) => this.nudgeValue(combatant, type, delta)}
                            changeValue={(combatant, type, value) => this.changeValue(combatant, type, value)}
                            makeCurrent={(combatant) => this.makeCurrent(combatant)}
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
                        var xp = 0;
                        combat.combatants.filter(c => c.type === "monster")
                            .forEach(combatant => {
                                xp += utils.experience(combatant.challenge);
                            });
                        
                        var encounter = this.getEncounter(combat.encounterID);

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
                    left: [],
                    right: []
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
                                combat={this.state.modal.combat}
                                parties={this.state.parties}
                                encounters={this.state.encounters}
                                mapFolios={this.state.mapFolios}
                                getMonster={(monsterName, monsterGroupName) => this.getMonster(monsterName, this.getMonsterGroupByName(monsterGroupName))}
                                notify={() => this.setState({modal: this.state.modal})}
                            />
                        );
                        modalAllowClose = false;
                        modalAllowScroll = false;
                        modalButtons.right = [
                            <button key="start encounter" className={this.state.modal.combat.partyID && this.state.modal.combat.encounterID ? "" : "disabled"} onClick={() => this.startCombat()}>start encounter</button>,
                            <button key="cancel" onClick={() => this.closeModal()}>cancel</button>
                        ];
                        break;
                    case "combat-wave":
                        modalTitle = "encounter waves";
                        modalContent = (
                            <CombatStartModal
                                combat={this.state.modal.combat}
                                encounters={this.state.encounters}
                                getMonster={(monsterName, monsterGroupName) => this.getMonster(monsterName, this.getMonsterGroupByName(monsterGroupName))}
                                notify={() => this.setState({modal: this.state.modal})}
                            />
                        );
                        modalAllowClose = false;
                        modalAllowScroll = false;
                        modalButtons.right = [
                            <button key="add wave" className={this.state.modal.combat.waveID !== null ? "" : "disabled"} onClick={() => this.addWaveToCombat()}>add wave</button>,
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