class Dojo extends React.Component {
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
            combats: [],
            selectedPartyID: null,
            selectedMonsterGroupID: null,
            selectedEncounterID: null,
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
                data.encounters.forEach(enc => {
                    if (!enc.waves) {
                        enc.waves = [];
                    }
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
            this.state.combats = [];
            this.state.selectedPartyID = null;
            this.state.selectedMonsterGroupID = null;
            this.state.selectedEncounterID = null;
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
        var party = {
            id: guid(),
            name: name,
            pcs: []
        };
        var parties = [].concat(this.state.parties, [party]);
        sort(parties);
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
        var pc = {
            id: guid(),
            type: "pc",
            active: true,
            player: "",
            name: name,
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
        sort(party.pcs);
        this.setState({
            parties: this.state.parties
        });
    }

    /////////////////////////////////////////////////////////////////////////////
    // Library screen

    addMonsterGroup(name) {
        var group = {
            id: guid(),
            name: name,
            monsters: []
        };
        var library = [].concat(this.state.library, [group]);
        sort(library);
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
        var monster = this.createMonster();
        monster.name = name;
        var group = this.getMonsterGroup(this.state.selectedMonsterGroupID);
        group.monsters.push(monster);
        this.setState({
            library: this.state.library
        });
    }

    createMonster() {
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
        sort(group.monsters);
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
        sort(group.monsters);

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

    cloneMonster(monster) {
        var group = this.findMonster(monster);

        var clone = {
            id: guid(),
            type: "monster",
            name: monster.name + " copy",
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
                    id: guid(),
                    name: trait.name,
                    usage: trait.usage,
                    type: trait.type,
                    text: trait.text
                };
            }),
            conditionImmunities: monster.conditionImmunities
        };

        group.monsters.push(clone);
        sort(group.monsters);

        this.setState({
            library: this.state.library
        });
    }

    addOpenGameContent() {
        var request = new XMLHttpRequest();
        request.overrideMimeType("application/json");
        request.open('GET', 'resources/data/monsters.json', true);
        request.onreadystatechange = () => {
            if (request.readyState === 4 && request.status === 200) {
                var monsters = JSON.parse(request.responseText);
                monsters.forEach(data => {
                    try {
                        if (data.name) {
                            var monster = this.createMonster();

                            monster.type = "monster";
                            monster.name = data.name;
                            monster.size = data.size.toLowerCase();
                            monster.category = data.type;
                            monster.tag = data.subtype;
                            monster.alignment = data.alignment;
                            monster.challenge = parseChallenge(data.challenge_rating);
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
                                var group = {
                                    id: guid(),
                                    name: groupName,
                                    monsters: []
                                }
                                this.state.library.push(group);
                            }
                            group.monsters.push(monster);
                        }
                    } catch (e) {
                        console.log(e);
                    }
                });

                sort(this.state.library);

                this.setState({
                    view: "library",
                    library: this.state.library
                });
            }
        };
        request.send(null);
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
            id: guid(),
            type: type,
            name: name,
            usage: usage,
            text: rawTrait.desc
        };
    };

    /////////////////////////////////////////////////////////////////////////////
    // Encounter screen

    addEncounter(name) {
        var encounter = {
            id: guid(),
            name: name,
            slots: [],
            waves: []
        };
        var encounters = [].concat(this.state.encounters, [encounter]);
        sort(encounters);

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
        var slot = {
            id: guid(),
            monsterGroupName: group.name,
            monsterName: monster.name,
            count: 1
        }
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
            var index = encounter.slots.indexOf(slot);
            encounter.slots.splice(index, 1);
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
        var waveNumber = encounter.waves.length + 2;
        var waveName = "wave " + waveNumber;

        encounter.waves.push({
            id: guid(),
            name: waveName,
            slots: []
        });

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
                    encounterInitMode: "group",
                    monsterNames: getMonsterNames(encounter)
                }
            }
        });
    }

    startCombat() {
        var party = this.getParty(this.state.modal.combat.partyID);
        var partyName = party.name || "unnamed party";

        var encounter = this.getEncounter(this.state.modal.combat.encounterID);
        var encounterName = encounter.name || "unnamed encounter";

        var combat = {
            id: guid(),
            encounterID: encounter.id,
            name: partyName + " vs " + encounterName,
            combatants: [],
            round: 1,
            issues: []
        };

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
                var init = parseInt(modifier(monster.abilityScores.dex));
                var groupRoll = dieRoll();

                for (var n = 0; n !== slot.count; ++n) {
                    var singleRoll = dieRoll();

                    var combatant = JSON.parse(JSON.stringify(monster));
                    combatant.id = guid();

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
                    monsterNames: getMonsterNames(encounter)
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
        })
    }

    makeCurrent(combatant, newRound) {
        var combat = this.getCombat(this.state.selectedCombatID);

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
        })
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
                var init = parseInt(modifier(monster.abilityScores.dex));
                var groupRoll = dieRoll();

                for (var n = 0; n !== slot.count; ++n) {
                    var singleRoll = dieRoll();

                    var combatant = JSON.parse(JSON.stringify(monster));
                    combatant.id = guid();

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

    endTurn(combatant) {
        var combat = this.getCombat(this.state.selectedCombatID);
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

    addCondition(combatant, condition) {
        combatant.conditions.push(condition);

        this.setState({
            combats: this.state.combats
        });
    }

    removeCondition(combatant, condition) {
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

        sort(this.state.parties);
        sort(this.state.library);
        sort(this.state.encounters);

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
                    value = nudgeChallenge(obj.challenge, delta);
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
            var action = null;
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
                            cloneMonster={combatant => this.cloneMonster(combatant)}
                            moveToGroup={(combatant, groupID) => this.moveToGroup(combatant, groupID)}
                            addOpenGameContent={() => this.addOpenGameContent()}
                        />
                    );
                    var count = 0;
                    this.state.library.forEach(group => {
                        count += group.monsters.length;
                    });
                    if (count > 0) {
                        action = (
                            <div className="section">
                                <button onClick={() => this.openDemographics()}>demographics</button>
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
                            addCondition={(combatant, condition) => this.addCondition(combatant, condition)}
                            removeCondition={(combatant, condition) => this.removeCondition(combatant, condition)}
                            endTurn={(combatant) => this.endTurn(combatant)}
                        />
                    );
                    if (combat) {
                        var xp = 0;
                        combat.combatants.filter(c => c.type === "monster")
                            .forEach(combatant => {
                                xp += experience(combatant.challenge);
                            });
                        
                        var encounter = this.getEncounter(combat.encounterID);

                        action = (
                            <div>
                                <div className="section">
                                    <div>round: {combat.round}</div>
                                </div>
                                <div className="section">
                                    <div>xp: {xp}</div>
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
                    case "combat-start":
                        modalTitle = "start a new encounter";
                        modalContent = (
                            <CombatStartModal
                                combat={this.state.modal.combat}
                                parties={this.state.parties}
                                encounters={this.state.encounters}
                                getMonster={(monsterName, monsterGroupName) => this.getMonster(monsterName, this.getMonsterGroupByName(monsterGroupName))}
                                notify={() => this.setState({modal: this.state.modal})}
                            />
                        );
                        modalAllowClose = false;
                        modalAllowScroll = false;
                        var canClose = this.state.modal.combat.partyID && this.state.modal.combat.encounterID;
                        modalButtons.right = [
                            <button key="start encounter" className={canClose ? "" : "disabled"} onClick={() => this.startCombat()}>start encounter</button>,
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
                        var canClose = this.state.modal.combat.waveID !== null;
                        modalButtons.right = [
                            <button key="add wave" className={canClose ? "" : "disabled"} onClick={() => this.addWaveToCombat()}>add wave</button>,
                            <button key="cancel" onClick={() => this.closeModal()}>cancel</button>
                        ];
                        break;
                }

                modal = (
                    <div className="overlay">
                        <div className="modal">
                            <div className="modal-header">
                                <div className="title">{modalTitle}</div>
                                {modalAllowClose ? <img className="image" src="resources/images/close-white.svg" onClick={() => this.closeModal()} /> : null}
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
                        action={action}
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