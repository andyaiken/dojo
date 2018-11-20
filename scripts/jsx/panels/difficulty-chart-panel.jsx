class DifficultyChartPanel extends React.Component {

    // TODO: Add radio selector for difficulty after each wave
    // TODO: Show party difficulty as a horizontal bar chart

    render() {
        var encounter = this.props.encounters.find(e => e.id === this.props.encounterID);
        var party = this.props.parties.find(p => p.id === this.props.partyID);

        var monsterCount = 0;
        var monsterXp = 0;
        var slots = [].concat(encounter.slots);
        encounter.waves.forEach(wave => {
            slots = slots.concat(wave.slots);
        })
        slots.forEach(slot => {
            monsterCount += slot.count;
            var monster = this.props.getMonster(slot.monsterName, slot.monsterGroupName);
            if (monster) {
                monsterXp += experience(monster.challenge) * slot.count;
            }
        });

        var adjustedXp = monsterXp * experienceFactor(monsterCount);

        var xpThresholds;
        var difficulty;
        if (party) {
            var xpEasy = 0;
            var xpMedium = 0;
            var xpHard = 0;
            var xpDeadly = 0;
    
            var pcs = party.pcs.filter(pc => pc.active);
            pcs.forEach(pc => {
                xpEasy += pcExperience(pc.level, "easy");
                xpMedium += pcExperience(pc.level, "medium");
                xpHard += pcExperience(pc.level, "hard");
                xpDeadly += pcExperience(pc.level, "deadly");
            });
        
            var difficulty = null;
            var adjustedDifficulty = null;
            if (adjustedXp > 0) {
                difficulty = "trivial";
                if (adjustedXp >= xpEasy) {
                    difficulty = "easy";
                }
                if (adjustedXp >= xpMedium) {
                    difficulty = "medium";
                }
                if (adjustedXp >= xpHard) {
                    difficulty = "hard";
                }
                if (adjustedXp >= xpDeadly) {
                    difficulty = "deadly";
                }

                if ((pcs.length < 3) || (pcs.length > 5)) {
                    var small = pcs.length < 3;
                    switch (difficulty) {
                        case "trivial":
                            adjustedDifficulty = small ? "easy" : "trivial";
                            break;
                        case "easy":
                            adjustedDifficulty = small ? "medium" : "trivial";
                            break;
                        case "medium":
                            adjustedDifficulty = small ? "hard" : "easy";
                            break;
                        case "hard":
                            adjustedDifficulty = small ? "deadly" : "medium";
                            break;
                        case "deadly":
                            adjustedDifficulty = small ? "deadly" : "hard";
                            break;
                    }
                }
            }

            xpThresholds = (
                <div>
                    <div className="subheading">xp thresholds for this party</div>
                    <div className="table">
                        <div>
                            <div className="cell four"><b>easy</b></div>
                            <div className="cell four"><b>medium</b></div>
                            <div className="cell four"><b>hard</b></div>
                            <div className="cell four"><b>deadly</b></div>
                        </div>
                        <div>
                            <div className="cell four">{xpEasy} xp</div>
                            <div className="cell four">{xpMedium} xp</div>
                            <div className="cell four">{xpHard} xp</div>
                            <div className="cell four">{xpDeadly} xp</div>
                        </div>
                    </div>
                </div>
            );

            difficulty = (
                <div>
                    <div className="subheading">difficulty</div>
                    <div className="section">
                        difficulty for this party
                        <div className="right">{difficulty}</div>
                    </div>
                    <div className="section" style={{ display: (adjustedDifficulty === difficulty) ? "none" : ""}}>
                        effective difficulty for {pcs.length} pc(s)
                        <div className="right"><b>{adjustedDifficulty}</b></div>
                    </div>
                </div>
            );
        }

        return (
            <div>
                {xpThresholds}
                <div className="subheading">xp value</div>
                <div className="section">
                    xp for this encounter
                    <div className="right">{monsterXp} xp</div>
                </div>
                <div className="section" style={{ display: (adjustedXp === monsterXp) ? "none" : ""}}>
                    effective xp for {monsterCount} monster(s)
                    <div className="right">{adjustedXp} xp</div>
                </div>
                {difficulty}
            </div>
        );
    }
}