class CombatStartModal extends React.Component {
    constructor(props) {
        super();

        this.state = {
            combat: props.combat
        }
    }

    setParty(partyID) {
        this.state.combat.partyID = partyID;
        this.setState({
            combat: this.state.combat
        }, () => this.props.notify());
    }

    setEncounter(encounterID) {
        this.state.combat.encounterID = encounterID;
        var enc = this.props.encounters.find(enc => enc.id === encounterID);
        this.state.combat.monsterNames = getMonsterNames(enc);
        this.setState({
            combat: this.state.combat
        }, () => this.props.notify());
    }

    setFolioID(id) {
        if (id) {
            var folio = this.props.mapFolios.find(f => f.id === id);
            this.state.combat.folioID = folio.id;
            this.state.combat.mapID = folio.maps.length === 1 ? folio.maps[0].id : null;
        } else {
            this.state.combat.folioID = null;
            this.state.combat.mapID = null;    
        }
        this.setState({
            combat: this.state.combat
        });
    }

    setMapID(id) {
        this.state.combat.mapID = id;
        this.setState({
            combat: this.state.combat
        });
    }

    setWave(waveID) {
        this.state.combat.waveID = waveID;
        var enc = this.props.encounters.find(enc => enc.id === this.state.combat.encounterID);
        var wave = enc.waves.find(w => w.id === waveID);
        this.state.combat.monsterNames = getMonsterNames(wave);
        this.setState({
            combat: this.state.combat
        }, () => this.props.notify());
    }

    setEncounterInitMode(mode) {
        this.state.combat.encounterInitMode = mode;
        this.setState({
            combat: this.state.combat
        });
    }

    changeName(slotID, index, name) {
        var slot = this.state.combat.monsterNames.find(s => s.id === slotID);
        if (slot) {
            slot.names[index] = name;
            this.setState({
                combat: this.state.combat
            });
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    getPartySection() {
        if (this.props.parties.length === 0) {
            return (
                <div className="section">you have not defined any parties</div>
            );
        }

        var partyOptions = this.props.parties.map(party => {
            return {
                id: party.id,
                text: party.name || "unnamed party"
            };
        });

        var partyContent = null;
        if (this.state.combat.partyID) {
            var selectedParty = this.props.parties.find(p => p.id === this.state.combat.partyID);
            var pcs = selectedParty.pcs.filter(pc => pc.active);

            var pcSections = pcs.map(pc => 
                <li key={pc.id}>
                    {pc.name || "unnamed pc"} (level {pc.level})
                </li>
            );

            if (pcSections.length === 0) {
                pcSections.push(
                    <li key={"empty"}>no pcs</li>
                );
            }
    
            partyContent = (
                <div>
                    <div className="subheading">pcs</div>
                    <ul>{pcSections}</ul>
                </div>
            );
        }

        return (
            <div>
                <div className="heading">party</div>
                <Dropdown
                    options={partyOptions}
                    placeholder="select party..."
                    selectedID={this.state.combat.partyID}
                    select={optionID => this.setParty(optionID)}
                />
                {partyContent}
            </div>
        );
    }

    getEncounterSection() {
        if (this.props.encounters.length === 0) {
            return (
                <div className="section">you have not built any encounters</div>
            );
        }

        var encounterOptions = this.props.encounters.map(encounter => {
            return {
                id: encounter.id,
                text: encounter.name || "unnamed encounter"
            }
        });

        var encounterContent = null;
        if (this.state.combat.encounterID) {
            var selectedEncounter = this.props.encounters.find(e => e.id === this.state.combat.encounterID);
            var monsterSections = selectedEncounter.slots.map(slot => {
                var name = slot.monsterName || "unnamed monster";
                if (slot.count > 1) {
                    name += " (x" + slot.count + ")";
                }
                return (
                    <li key={slot.id}>{name}</li>
                );
            });

            if (monsterSections.length === 0) {
                monsterSections.push(
                    <li key={"empty"}>no monsters</li>
                );
            }

            var waves = selectedEncounter.waves.map(wave => {
                if (wave.slots.length === 0) {
                    return null;
                }

                var waveMonsters = wave.slots.map(slot => {
                    var name = slot.monsterName || "unnamed monster";
                    if (slot.count > 1) {
                        name += " x" + slot.count;
                    }
                    return (
                        <li key={slot.id}>{name}</li>
                    );
                });
    
                return (
                    <div key={wave.id}>
                        <div className="subheading">{wave.name || "unnamed wave"}</div>
                        <ul>{waveMonsters}</ul>
                    </div>
                );
            });
    
            encounterContent = (
                <div>
                    <div className="subheading">monsters</div>
                    <ul>{monsterSections}</ul>
                    {waves}
                </div>
            );
        }

        return (
            <div>
                <div className="heading">encounter</div>
                <Dropdown
                    options={encounterOptions}
                    placeholder="select encounter..."
                    selectedID={this.state.combat.encounterID}
                    select={optionID => this.setEncounter(optionID)}
                />
                {encounterContent}
            </div>
        );
    }

    getMapSection() {
        var folios = this.props.mapFolios.filter(folio => folio.maps.length > 0);
        if (folios.length === 0) {
            return null;
        }

        var folioOptions = folios.map(folio => {
            return {
                id: folio.id,
                text: folio.name || "unnamed folio"
            };
        });
        folioOptions = [{id: null, text: "none"}].concat(folioOptions);

        var selectMapSection = null;
        var thumbnailSection = null;

        if (this.state.combat.folioID) {
            var folio = this.props.mapFolios.find(f => f.id === this.state.combat.folioID);
            var mapOptions = folio.maps.map(m => {
                return {
                    id: m.id,
                    text: m.name || "unnamed map"
                };
            });            

            if (mapOptions.length !== 1) {
                selectMapSection = (
                    <Selector
                        options={mapOptions}
                        placeholder="select map..."
                        selectedID={this.state.combatmapID}
                        select={optionID => this.setMapID(optionID)}
                    />
                );
            }

            if (this.state.combat.mapID) {
                var map = folio.maps.find(m => m.id === this.state.combat.mapID);
                thumbnailSection = (
                    <MapPanel
                        map={map}
                        mode="thumbnail"
                    />
                );
            }
        }

        return (
            <div>
                <div className="heading">map</div>
                <Dropdown
                    options={folioOptions}
                    placeholder="select map folio..."
                    selectedID={this.state.combat.folioID}
                    select={optionID => this.setFolioID(optionID)}
                />
                {selectMapSection}
                {thumbnailSection}
            </div>
        );
    }

    getWaveSection() {
        if (this.state.combat.encounterID === null) {
            return (
                <div className="section">you have not selected an encounter</div>
            );
        }

        var selectedEncounter = this.props.encounters.find(e => e.id === this.state.combat.encounterID);
        if (selectedEncounter.waves.length === 0) {
            return (
                <div className="section">you have not defined any waves</div>
            );
        }

        var waveOptions = selectedEncounter.waves.map(wave => {
            return {
                id: wave.id,
                text: wave.name || "unnamed wave"
            };
        });

        var waveContent = null;
        if (this.state.combat.waveID) {
            var selectedWave = selectedEncounter.waves.find(w => w.id === this.state.combat.waveID);

            var monsterSections = selectedWave.slots.map(slot => {
                var name = slot.monsterName || "unnamed monster";
                if (slot.count > 1) {
                    name += " (x" + slot.count + ")";
                }
                return (
                    <li key={slot.id}>{name}</li>
                );
            });

            if (monsterSections.length === 0) {
                monsterSections.push(
                    <li key={"empty"}>no monsters</li>
                );
            }
    
            waveContent = (
                <div>
                    <div className="subheading">monsters</div>
                    <ul>{monsterSections}</ul>
                </div>
            );
        }

        return (
            <div>
                <div className="heading">wave</div>
                <Dropdown
                    options={waveOptions}
                    placeholder="select wave..."
                    selectedID={this.state.combat.waveID}
                    select={optionID => this.setWave(optionID)}
                />
                {waveContent}
            </div>
        );
    }

    getDifficultySection() {
        if (!this.state.combat.partyID || !this.state.combat.encounterID) {
            return (
                <div>
                    <div className="heading">encounter difficulty</div>
                    <div className="section">select a party and an encounter on the left to see difficulty information.</div>
                </div>
            );
        }

        return (
            <div>
                <div className="heading">encounter difficulty</div>
                <DifficultyChartPanel
                    partyID={this.state.combat.partyID}
                    encounterID={this.state.combat.encounterID}
                    parties={this.props.parties}
                    encounters={this.props.encounters}
                    getMonster={(monsterName, monsterGroupName) => this.props.getMonster(monsterName, monsterGroupName)}
                />
            </div>
        );
    }

    getMonsterSection() {
        if (this.state.combat.encounterID === null) {
            return (
                <div>
                    <div className="heading">monsters</div>
                    <div className="section">select an encounter to see monster options here.</div>
                </div>
            );
        }

        if (!this.props.parties && this.state.combat.waveID === null) {
            return (
                <div>
                    <div className="heading">monsters</div>
                    <div className="section">select a wave to see monster options here.</div>
                </div>
            );
        }

        var selectedEncounter = this.props.encounters.find(e => e.id === this.state.combat.encounterID);
        if (this.state.combat.waveID) {
            selectedEncounter = selectedEncounter.waves.find(w => w.id === this.state.combat.waveID);
        }

        if (selectedEncounter.slots.length === 0) {
            return null;
        }

        var initOptions = [
            {
                id: "manual",
                text: "enter manually"
            },
            {
                id: "individual",
                text: "roll individually"
            },
            {
                id: "group",
                text: "roll in groups"
            }
        ];

        var names = this.state.combat.monsterNames.map(slotNames => {
            var slot = selectedEncounter.slots.find(s => s.id === slotNames.id);
            var inputs = [];
            for (var n = 0; n !== slotNames.names.length; ++n) {
                inputs.push(
                    <div key={n}>
                        <MonsterName
                            value={slotNames.names[n]}
                            slotID={slot.id}
                            index={n}
                            changeName={(slotID, index, value) => this.changeName(slotID, index, value)}
                        />
                    </div>
                );
            }
            return (
                <div key={slotNames.id} className="name-row">
                    <div className="name-label">
                        {slot.monsterName}
                    </div>
                    <div className="name-inputs">
                        {inputs}
                    </div>
                </div>
            );
        });

        return (
            <div>
                <div className="heading">monsters</div>
                <div className="subheading">initiative</div>
                <Selector
                    options={initOptions}
                    selectedID={this.state.combat.encounterInitMode}
                    select={optionID => this.setEncounterInitMode(optionID)}
                />
                <div className="subheading">names</div>
                <div>{names}</div>
            </div>
        );
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    render() {
        try {
            var leftSection = null;
            var rightSection = null;

            if (this.props.parties) {
                leftSection = (
                    <div>
                        {this.getPartySection()}
                        {this.getEncounterSection()}
                        {this.getMapSection()}
                    </div>
                );
    
                rightSection = (
                    <div>
                        {this.getDifficultySection()}
                        {this.getMonsterSection()}
                    </div>
                );
            } else {
                leftSection = (
                    <div>
                        {this.getWaveSection()}
                    </div>
                );
    
                rightSection = (
                    <div>
                        {this.getMonsterSection()}
                    </div>
                );
            }

            return (
                <div className="row" style={{ height: "100%", margin: "0 -15px" }}>
                    <div className="column small-6 medium-6 large-6 scrollable">
                        {leftSection}
                    </div>
                    <div className="column small-6 medium-6 large-6 scrollable">
                        {rightSection}
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}

class MonsterName extends React.Component {
    render() {
        return (
            <input type="text" value={this.props.value} onChange={event => this.props.changeName(this.props.slotID, this.props.index, event.target.value)} />
        )
    }
}