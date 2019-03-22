import React from 'react';

import * as utils from '../../utils';

import { CombatSetup, Encounter, Party, MapFolio, Monster, EncounterWave, EncounterSlot } from '../../models/models';

import Dropdown from '../controls/dropdown';
import Selector from '../controls/selector';
import MapPanel from '../panels/map-panel';
import DifficultyChartPanel from '../panels/difficulty-chart-panel';

interface Props {
    combatSetup: CombatSetup;
    parties: Party[];
    encounters: Encounter[];
    mapFolios: MapFolio[];
    getMonster: (monsterName: string, groupName: string) => Monster | null;
    notify: () => void;
}

interface State {
    combatSetup: CombatSetup;
}

export default class CombatStartModal extends React.Component<Props, State> {
    public static defaultProps = {
        parties: null,
        mapFolios: null
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            combatSetup: props.combatSetup
        }
    }

    setParty(partyID: string) {
        // eslint-disable-next-line
        this.state.combatSetup.partyID = partyID;
        this.setState({
            combatSetup: this.state.combatSetup
        }, () => this.props.notify());
    }

    setEncounter(encounterID: string) {
        // eslint-disable-next-line
        this.state.combatSetup.encounterID = encounterID;
        var enc = this.props.encounters.find(enc => enc.id === encounterID);
        if (enc) {
            // eslint-disable-next-line
            this.state.combatSetup.monsterNames = utils.getMonsterNames(enc);
        }
        this.setState({
            combatSetup: this.state.combatSetup
        }, () => this.props.notify());
    }

    setFolioID(id: string) {
        if (id && (id !== '')) {
            var folio = this.props.mapFolios.find(f => f.id === id);
            if (folio) {
                // eslint-disable-next-line
                this.state.combatSetup.folioID = folio.id;
                // eslint-disable-next-line
                this.state.combatSetup.mapID = folio.maps.length === 1 ? folio.maps[0].id : null;
            }
        } else {
            // eslint-disable-next-line
            this.state.combatSetup.folioID = null;
            // eslint-disable-next-line
            this.state.combatSetup.mapID = null;    
        }
        this.setState({
            combatSetup: this.state.combatSetup
        });
    }

    setMapID(id: string) {
        // eslint-disable-next-line
        this.state.combatSetup.mapID = id;
        this.setState({
            combatSetup: this.state.combatSetup
        });
    }

    setWave(waveID: string) {
        // eslint-disable-next-line
        this.state.combatSetup.waveID = waveID;
        var enc = this.props.encounters.find(enc => enc.id === this.state.combatSetup.encounterID);
        if (enc) {
            var wave = enc.waves.find(w => w.id === waveID);
            if (wave) {
                // eslint-disable-next-line
                this.state.combatSetup.monsterNames = utils.getMonsterNames(wave);
            }
        }
        this.setState({
            combatSetup: this.state.combatSetup
        }, () => this.props.notify());
    }

    setEncounterInitMode(mode: 'manual' | 'individual' | 'group') {
        // eslint-disable-next-line
        this.state.combatSetup.encounterInitMode = mode;
        this.setState({
            combatSetup: this.state.combatSetup
        });
    }

    changeName(slotID: string, index: number, name: string) {
        var slot = this.state.combatSetup.monsterNames.find(s => s.id === slotID);
        if (slot) {
            slot.names[index] = name;
            this.setState({
                combatSetup: this.state.combatSetup
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
        if (this.state.combatSetup.partyID) {
            var selectedParty = this.props.parties.find(p => p.id === this.state.combatSetup.partyID);
            if (selectedParty) {
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
        }

        return (
            <div>
                <div className="heading">party</div>
                <Dropdown
                    options={partyOptions}
                    placeholder="select party..."
                    selectedID={this.state.combatSetup.partyID ? this.state.combatSetup.partyID : undefined}
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
        if (this.state.combatSetup.encounterID) {
            var selectedEncounter = this.props.encounters.find(e => e.id === this.state.combatSetup.encounterID);
            if (selectedEncounter) {
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
        }

        return (
            <div>
                <div className="heading">encounter</div>
                <Dropdown
                    options={encounterOptions}
                    placeholder="select encounter..."
                    selectedID={this.state.combatSetup.encounterID ? this.state.combatSetup.encounterID : undefined}
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

        var folioOptions = [{
            id: '',
            text: "none"
        }].concat(folios.map(folio => {
            return {
                id: folio.id,
                text:folio.name || "unnamed folio"
            };
        }));

        var selectMapSection = null;
        var thumbnailSection = null;

        if (this.state.combatSetup.folioID) {
            var folio = this.props.mapFolios.find(f => f.id === this.state.combatSetup.folioID);
            if (folio) {
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
                            selectedID={this.state.combatSetup.mapID}
                            select={optionID => this.setMapID(optionID)}
                        />
                    );
                }

                if (this.state.combatSetup.mapID) {
                    var map = folio.maps.find(m => m.id === this.state.combatSetup.mapID);
                    if (map) {
                        thumbnailSection = (
                            <MapPanel
                                map={map}
                                mode="thumbnail"
                            />
                        );
                    }
                }
            }
        }

        return (
            <div>
                <div className="heading">map</div>
                <Dropdown
                    options={folioOptions}
                    placeholder="select map folio..."
                    selectedID={this.state.combatSetup.folioID ? this.state.combatSetup.folioID : undefined}
                    select={optionID => this.setFolioID(optionID)}
                />
                {selectMapSection}
                {thumbnailSection}
            </div>
        );
    }

    getWaveSection() {
        if (this.state.combatSetup.encounterID === null) {
            return (
                <div className="section">you have not selected an encounter</div>
            );
        }

        var selectedEncounter = this.props.encounters.find(e => e.id === this.state.combatSetup.encounterID);
        if (selectedEncounter) {
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
            if (this.state.combatSetup.waveID) {
                var selectedWave = selectedEncounter.waves.find(w => w.id === this.state.combatSetup.waveID);
                if (selectedWave) {
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
            }

            return (
                <div>
                    <div className="heading">wave</div>
                    <Dropdown
                        options={waveOptions}
                        placeholder="select wave..."
                        selectedID={this.state.combatSetup.waveID ? this.state.combatSetup.waveID : undefined}
                        select={optionID => this.setWave(optionID)}
                    />
                    {waveContent}
                </div>
            );
        }

        return null;
    }

    getDifficultySection() {
        var party = this.props.parties.find(p => p.id === this.state.combatSetup.partyID);
        var encounter = this.props.encounters.find(enc => enc.id === this.state.combatSetup.encounterID);

        if (party && encounter) {
            return (
                <div>
                    <div className="heading">encounter difficulty</div>
                    <DifficultyChartPanel
                        party={party}
                        encounter={encounter}
                        getMonster={(monsterName, monsterGroupName) => this.props.getMonster(monsterName, monsterGroupName)}
                    />
                </div>
            );
        }

        return (
            <div>
                <div className="heading">encounter difficulty</div>
                <div className="section">select a party and an encounter on the left to see difficulty information.</div>
            </div>
        );
    }

    getMonsterSection() {
        if (this.state.combatSetup.encounterID === null) {
            return (
                <div>
                    <div className="heading">monsters</div>
                    <div className="section">select an encounter to see monster options here.</div>
                </div>
            );
        }

        if (!this.props.parties && this.state.combatSetup.waveID === null) {
            return (
                <div>
                    <div className="heading">monsters</div>
                    <div className="section">select a wave to see monster options here.</div>
                </div>
            );
        }

        var selectedEncounter = this.props.encounters.find(e => e.id === this.state.combatSetup.encounterID);
        if (selectedEncounter) {
            var slotsContainer: { slots: EncounterSlot[] } = selectedEncounter;
            if (this.state.combatSetup.waveID) {
                var selectedWave = selectedEncounter.waves.find(w => w.id === this.state.combatSetup.waveID);
                if (selectedWave) {
                    slotsContainer = selectedWave;
                }
            }

            if (slotsContainer.slots.length === 0) {
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

            var names = this.state.combatSetup.monsterNames.map(slotNames => {
                var slot = slotsContainer.slots.find(s => s.id === slotNames.id);
                if (slot) {
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
                }
            });

            return (
                <div>
                    <div className="heading">monsters</div>
                    <div className="subheading">initiative</div>
                    <Selector
                        options={initOptions}
                        selectedID={this.state.combatSetup.encounterInitMode}
                        select={optionID => this.setEncounterInitMode(optionID as 'manual' | 'individual' | 'group')}
                    />
                    <div className="subheading">names</div>
                    <div>{names}</div>
                </div>
            );
        }

        return null;
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

interface MonsterNameProps {
    slotID: string;
    index: number;
    value: string;
    changeName: (slotID: string, index: number, value: string) => void;
}

class MonsterName extends React.Component<MonsterNameProps> {
    render() {
        return (
            <input type="text" value={this.props.value} onChange={event => this.props.changeName(this.props.slotID, this.props.index, event.target.value)} />
        )
    }
}