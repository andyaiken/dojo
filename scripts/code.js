var monsterIdToGroup = {};

function getMonsterGroup(monster, library) {
    var group = monsterIdToGroup[monster.id];

    if (!group) {
        library.forEach(g => {
            if (!group) {
                if (g.monsters.indexOf(monster) !== -1) {
                    group = g;
                }
            }
        });
        monsterIdToGroup[monster.id] = group;
    }

    return group;
}

function match(filter, text) {
    if (!filter) {
        return true;
    }

    var result = true;

    try {
        var tokens = filter.toLowerCase().split(' ');
        tokens.forEach(token => {
            if (text.toLowerCase().indexOf(token) === -1) {
                result = false;
            }
        });
    } catch (ex) {
        console.log(ex);
    }

    return result;
}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function sort(collection) {
    collection.sort((a, b) => {
        var aName = a.name.toLowerCase();
        var bName = b.name.toLowerCase();
        if (aName < bName) return -1;
        if (aName > bName) return 1;
        return 0;
    });
}