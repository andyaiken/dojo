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
        var tokens = filter.toLowerCase().split(" ");
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