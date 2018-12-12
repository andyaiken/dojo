function createParty() {
    return {
        id: guid(),
        name: "",
        pcs: []
    };
}

function createPC() {
    return {
        id: guid(),
        type: "pc",
        active: true,
        player: "",
        name: "",
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
}

function createMonsterGroup() {
    return {
        id: guid(),
        name: "",
        monsters: []
    };
}

function createMonster() {
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

function createTrait() {
    return {
        id: guid(),
        name: "",
        usage: "",
        type: type,
        text: ""
    };
}

function createEncounter() {
    return {
        id: guid(),
        name: "",
        slots: [],
        waves: []
    };
}

function createEncounterSlot() {
    return {
        id: guid(),
        monsterGroupName: "",
        monsterName: "",
        count: 1
    };
}

function createEncounterWave() {
    return {
        id: guid(),
        name: "",
        slots: []
    };
}

function createMapFolio() {
    return {
        id: guid(),
        name: "",
        maps: []
    };
}

function createMap() {
    return {
        id: guid(),
        name: "",
        items: []
    };
}

function createMapItem() {
    return {
        id: guid(),
        type: "tile",
        x: 0,
        y: 0,
        width: 4,
        height: 4
    };
}

function createCombat() {
    return {
        id: guid(),
        name: "",
        encounterID: null,
        combatants: [],
        map: null,
        round: 1,
        notifications: [],
        issues: []
    };
}