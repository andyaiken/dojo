import React from 'react';

import { Col, Input, Row } from 'antd';

import Utils from '../../utils/utils';

import { CombatSetup } from '../../models/combat';
import { Encounter, EncounterSlot } from '../../models/encounter';
import { MapFolio } from '../../models/map-folio';
import { Monster } from '../../models/monster-group';
import { Party } from '../../models/party';

import Dropdown from '../controls/dropdown';
import Selector from '../controls/selector';
import DifficultyChartPanel from '../panels/difficulty-chart-panel';
import MapPanel from '../panels/map-panel';

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
        };
    }

    private setPartyID(partyID: string | null) {
        // eslint-disable-next-line
        this.state.combatSetup.partyID = partyID;
        this.setState({
            combatSetup: this.state.combatSetup
        }, () => this.props.notify());
    }

    private setEncounterID(encounterID: string | null) {
        // eslint-disable-next-line
        this.state.combatSetup.encounterID = encounterID;
        const enc = this.props.encounters.find(e => e.id === encounterID);
        if (enc) {
            // eslint-disable-next-line
            this.state.combatSetup.monsterNames = Utils.getMonsterNames(enc);
        }
        this.setState({
            combatSetup: this.state.combatSetup
        }, () => this.props.notify());
    }

    private setFolioID(id: string | null) {
        if (id && (id !== '')) {
            const folio = this.props.mapFolios.find(f => f.id === id);
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

    private setMapID(id: string) {
        // eslint-disable-next-line
        this.state.combatSetup.mapID = id;
        this.setState({
            combatSetup: this.state.combatSetup
        });
    }

    private setWaveID(waveID: string | null) {
        // eslint-disable-next-line
        this.state.combatSetup.waveID = waveID;
        const enc = this.props.encounters.find(e => e.id === this.state.combatSetup.encounterID);
        if (enc) {
            const wave = enc.waves.find(w => w.id === waveID);
            if (wave) {
                // eslint-disable-next-line
                this.state.combatSetup.monsterNames = Utils.getMonsterNames(wave);
            }
        }
        this.setState({
            combatSetup: this.state.combatSetup
        }, () => this.props.notify());
    }

    private setEncounterInitMode(mode: 'manual' | 'individual' | 'group') {
        // eslint-disable-next-line
        this.state.combatSetup.encounterInitMode = mode;
        this.setState({
            combatSetup: this.state.combatSetup
        });
    }

    private changeName(slotID: string, index: number, name: string) {
        const slot = this.state.combatSetup.monsterNames.find(s => s.id === slotID);
        if (slot) {
            slot.names[index] = name;
            this.setState({
                combatSetup: this.state.combatSetup
            });
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    public render() {
        try {
            let leftSection = null;
            let rightSection = null;

            if (this.props.parties) {
                leftSection = (
                    <div>
                        <PartySection
                            combatSetup={this.state.combatSetup}
                            parties={this.props.parties}
                            setPartyID={id => this.setPartyID(id)}
                        />
                        <EncounterSection
                            combatSetup={this.state.combatSetup}
                            encounters={this.props.encounters}
                            setEncounterID={id => this.setEncounterID(id)}
                        />
                        <MapSection
                            combatSetup={this.state.combatSetup}
                            mapFolios={this.props.mapFolios}
                            setFolioID={id => this.setFolioID(id)}
                            setMapID={id => this.setMapID(id)}
                        />
                    </div>
                );

                rightSection = (
                    <div>
                        <DifficultySection
                            combatSetup={this.state.combatSetup}
                            parties={this.props.parties}
                            encounters={this.props.encounters}
                            getMonster={(monsterName, groupName) => this.props.getMonster(monsterName, groupName)}
                        />
                        <MonsterSection
                            combatSetup={this.state.combatSetup}
                            parties={this.props.parties}
                            encounters={this.props.encounters}
                            setEncounterInitMode={mode => this.setEncounterInitMode(mode)}
                            changeName={(slotID, index, name) => this.changeName(slotID, index, name)}
                        />
                    </div>
                );
            } else {
                leftSection = (
                    <div>
                        <WaveSection
                            combatSetup={this.state.combatSetup}
                            encounters={this.props.encounters}
                            setWaveID={id => this.setWaveID(id)}
                        />
                    </div>
                );

                rightSection = (
                    <div>
                        <MonsterSection
                            combatSetup={this.state.combatSetup}
                            parties={this.props.parties}
                            encounters={this.props.encounters}
                            setEncounterInitMode={mode => this.setEncounterInitMode(mode)}
                            changeName={(slotID, index, name) => this.changeName(slotID, index, name)}
                        />
                    </div>
                );
            }

            return (
                <Row className='full-height'>
                    <Col span={12} className='scrollable'>
                        {leftSection}
                    </Col>
                    <Col span={12} className='scrollable'>
                        {rightSection}
                    </Col>
                </Row>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}

interface PartySectionProps {
    combatSetup: CombatSetup;
    parties: Party[];
    setPartyID: (id: string | null) => void;
}

class PartySection extends React.Component<PartySectionProps> {
    public render() {
        if (this.props.parties.length === 0) {
            return (
                <div className='section'>you have not defined any parties</div>
            );
        }

        const partyOptions = this.props.parties.map(party => {
            return {
                id: party.id,
                text: party.name || 'unnamed party'
            };
        });

        let partyContent = null;
        if (this.props.combatSetup.partyID) {
            const selectedParty = this.props.parties.find(p => p.id === this.props.combatSetup.partyID);
            if (selectedParty) {
                const pcs = selectedParty.pcs.filter(pc => pc.active);

                const pcSections = pcs.map(pc =>
                    (
                        <li key={pc.id}>
                            {pc.name || 'unnamed pc'} (level {pc.level})
                        </li>
                    )
                );

                if (pcSections.length === 0) {
                    pcSections.push(
                        <li key={'empty'}>no pcs</li>
                    );
                }

                partyContent = (
                    <div>
                        <div className='subheading'>pcs</div>
                        <ul>{pcSections}</ul>
                    </div>
                );
            }
        }

        return (
            <div>
                <div className='heading'>party</div>
                <Dropdown
                    options={partyOptions}
                    placeholder='select party...'
                    selectedID={this.props.combatSetup.partyID ? this.props.combatSetup.partyID : undefined}
                    select={optionID => this.props.setPartyID(optionID)}
                    clear={() => this.props.setPartyID(null)}
                />
                {partyContent}
            </div>
        );
    }
}

interface EncounterSectionProps {
    combatSetup: CombatSetup;
    encounters: Encounter[];
    setEncounterID: (id: string | null) => void;
}

class EncounterSection extends React.Component<EncounterSectionProps> {
    public render() {
        if (this.props.encounters.length === 0) {
            return (
                <div className='section'>you have not built any encounters</div>
            );
        }

        const encounterOptions = this.props.encounters.map(encounter => {
            return {
                id: encounter.id,
                text: encounter.name || 'unnamed encounter'
            };
        });

        let encounterContent = null;
        if (this.props.combatSetup.encounterID) {
            const selectedEncounter = this.props.encounters.find(e => e.id === this.props.combatSetup.encounterID);
            if (selectedEncounter) {
                const monsterSections = selectedEncounter.slots.map(slot => {
                    let name = slot.monsterName || 'unnamed monster';
                    if (slot.count > 1) {
                        name += ' (x' + slot.count + ')';
                    }
                    return (
                        <li key={slot.id}>{name}</li>
                    );
                });

                if (monsterSections.length === 0) {
                    monsterSections.push(
                        <li key={'empty'}>no monsters</li>
                    );
                }

                const waves = selectedEncounter.waves.map(wave => {
                    if (wave.slots.length === 0) {
                        return null;
                    }

                    const waveMonsters = wave.slots.map(slot => {
                        let name = slot.monsterName || 'unnamed monster';
                        if (slot.count > 1) {
                            name += ' x' + slot.count;
                        }
                        return (
                            <li key={slot.id}>{name}</li>
                        );
                    });

                    return (
                        <div key={wave.id}>
                            <div className='subheading'>{wave.name || 'unnamed wave'}</div>
                            <ul>{waveMonsters}</ul>
                        </div>
                    );
                });

                encounterContent = (
                    <div>
                        <div className='subheading'>monsters</div>
                        <ul>{monsterSections}</ul>
                        {waves}
                    </div>
                );
            }
        }

        return (
            <div>
                <div className='heading'>encounter</div>
                <Dropdown
                    options={encounterOptions}
                    placeholder='select encounter...'
                    selectedID={this.props.combatSetup.encounterID ? this.props.combatSetup.encounterID : undefined}
                    select={optionID => this.props.setEncounterID(optionID)}
                    clear={() => this.props.setEncounterID(null)}
                />
                {encounterContent}
            </div>
        );
    }
}

interface MapSectionProps {
    combatSetup: CombatSetup;
    mapFolios: MapFolio[];
    setFolioID: (id: string | null) => void;
    setMapID: (id: string) => void;
}

class MapSection extends React.Component<MapSectionProps> {
    public render() {
        const folios = this.props.mapFolios.filter(folio => folio.maps.length > 0);
        if (folios.length === 0) {
            return null;
        }

        const folioOptions = [{
            id: '',
            text: 'none'
        }].concat(folios.map(folio => {
            return {
                id: folio.id,
                text: folio.name || 'unnamed folio'
            };
        }));

        let selectMapSection = null;
        let thumbnailSection = null;

        if (this.props.combatSetup.folioID) {
            const folio = this.props.mapFolios.find(f => f.id === this.props.combatSetup.folioID);
            if (folio) {
                const mapOptions = folio.maps.map(m => {
                    return {
                        id: m.id,
                        text: m.name || 'unnamed map'
                    };
                });

                if (mapOptions.length !== 1) {
                    selectMapSection = (
                        <Selector
                            options={mapOptions}
                            selectedID={this.props.combatSetup.mapID}
                            select={optionID => this.props.setMapID(optionID)}
                        />
                    );
                }

                if (this.props.combatSetup.mapID) {
                    const map = folio.maps.find(m => m.id === this.props.combatSetup.mapID);
                    if (map) {
                        thumbnailSection = (
                            <MapPanel
                                map={map}
                                mode='thumbnail'
                                size={10}
                            />
                        );
                    }
                }
            }
        }

        return (
            <div>
                <div className='heading'>map</div>
                <Dropdown
                    options={folioOptions}
                    placeholder='select map folio...'
                    selectedID={this.props.combatSetup.folioID ? this.props.combatSetup.folioID : undefined}
                    select={optionID => this.props.setFolioID(optionID)}
                    clear={() => this.props.setFolioID(null)}
                />
                {selectMapSection}
                {thumbnailSection}
            </div>
        );
    }
}

interface WaveSectionProps {
    combatSetup: CombatSetup;
    encounters: Encounter[];
    setWaveID: (id: string | null) => void;
}

class WaveSection extends React.Component<WaveSectionProps> {
    public render() {
        if (this.props.combatSetup.encounterID === null) {
            return (
                <div className='section'>you have not selected an encounter</div>
            );
        }

        const selectedEncounter = this.props.encounters.find(e => e.id === this.props.combatSetup.encounterID);
        if (selectedEncounter) {
            if (selectedEncounter.waves.length === 0) {
                return (
                    <div className='section'>you have not defined any waves</div>
                );
            }

            const waveOptions = selectedEncounter.waves.map(wave => {
                return {
                    id: wave.id,
                    text: wave.name || 'unnamed wave'
                };
            });

            let waveContent = null;
            if (this.props.combatSetup.waveID) {
                const selectedWave = selectedEncounter.waves.find(w => w.id === this.props.combatSetup.waveID);
                if (selectedWave) {
                    const monsterSections = selectedWave.slots.map(slot => {
                        let name = slot.monsterName || 'unnamed monster';
                        if (slot.count > 1) {
                            name += ' (x' + slot.count + ')';
                        }
                        return (
                            <li key={slot.id}>{name}</li>
                        );
                    });

                    if (monsterSections.length === 0) {
                        monsterSections.push(
                            <li key={'empty'}>no monsters</li>
                        );
                    }

                    waveContent = (
                        <div>
                            <div className='subheading'>monsters</div>
                            <ul>{monsterSections}</ul>
                        </div>
                    );
                }
            }

            return (
                <div>
                    <div className='heading'>wave</div>
                    <Dropdown
                        options={waveOptions}
                        placeholder='select wave...'
                        selectedID={this.props.combatSetup.waveID ? this.props.combatSetup.waveID : undefined}
                        select={optionID => this.props.setWaveID(optionID)}
                        clear={() => this.props.setWaveID(null)}
                    />
                    {waveContent}
                </div>
            );
        }

        return null;
    }
}

interface DifficultySectionProps {
    combatSetup: CombatSetup;
    parties: Party[];
    encounters: Encounter[];
    getMonster: (monsterName: string, groupName: string) => Monster | null;
}

class DifficultySection extends React.Component<DifficultySectionProps> {
    public render() {
        const party = this.props.parties.find(p => p.id === this.props.combatSetup.partyID);
        const encounter = this.props.encounters.find(enc => enc.id === this.props.combatSetup.encounterID);

        if (party && encounter) {
            return (
                <div>
                    <div className='heading'>encounter difficulty</div>
                    <DifficultyChartPanel
                        parties={this.props.parties}
                        party={party}
                        encounter={encounter}
                        getMonster={(monsterName, monsterGroupName) => this.props.getMonster(monsterName, monsterGroupName)}
                    />
                </div>
            );
        }

        return (
            <div>
                <div className='heading'>encounter difficulty</div>
                <div className='section'>select a party and an encounter on the left to see difficulty information.</div>
            </div>
        );
    }
}

interface MonsterSectionProps {
    combatSetup: CombatSetup;
    parties: Party[];
    encounters: Encounter[];
    setEncounterInitMode: (mode: 'manual' | 'individual' | 'group') => void;
    changeName: (slotID: string, index: number, name: string) => void;
}

class MonsterSection extends React.Component<MonsterSectionProps> {
    public render() {
        if (this.props.combatSetup.encounterID === null) {
            return (
                <div>
                    <div className='heading'>monsters</div>
                    <div className='section'>select an encounter to see monster options here.</div>
                </div>
            );
        }

        if (!this.props.parties && this.props.combatSetup.waveID === null) {
            return (
                <div>
                    <div className='heading'>monsters</div>
                    <div className='section'>select a wave to see monster options here.</div>
                </div>
            );
        }

        const selectedEncounter = this.props.encounters.find(e => e.id === this.props.combatSetup.encounterID);
        if (selectedEncounter) {
            let slotsContainer: { slots: EncounterSlot[] } = selectedEncounter;
            if (this.props.combatSetup.waveID) {
                const selectedWave = selectedEncounter.waves.find(w => w.id === this.props.combatSetup.waveID);
                if (selectedWave) {
                    slotsContainer = selectedWave;
                }
            }

            if (slotsContainer.slots.length === 0) {
                return null;
            }

            const initOptions = [
                {
                    id: 'manual',
                    text: 'enter manually'
                },
                {
                    id: 'individual',
                    text: 'roll individually'
                },
                {
                    id: 'group',
                    text: 'roll in groups'
                }
            ];

            const names = this.props.combatSetup.monsterNames.map(slotNames => {
                const slot = slotsContainer.slots.find(s => s.id === slotNames.id);
                if (slot) {
                    const inputs = [];
                    for (let n = 0; n !== slotNames.names.length; ++n) {
                        inputs.push(
                            <div key={n}>
                                <MonsterName
                                    value={slotNames.names[n]}
                                    slotID={slot.id}
                                    index={n}
                                    changeName={(slotID, index, value) => this.props.changeName(slotID, index, value)}
                                />
                            </div>
                        );
                    }
                    return (
                        <div key={slotNames.id} className='name-row'>
                            <div className='name-label'>
                                {slot.monsterName}
                            </div>
                            <div className='name-inputs'>
                                {inputs}
                            </div>
                        </div>
                    );
                }
                return null;
            });

            return (
                <div>
                    <div className='heading'>monsters</div>
                    <div className='subheading'>initiative</div>
                    <Selector
                        options={initOptions}
                        selectedID={this.props.combatSetup.encounterInitMode}
                        select={optionID => this.props.setEncounterInitMode(optionID as 'manual' | 'individual' | 'group')}
                    />
                    <div className='subheading'>names</div>
                    <div>{names}</div>
                </div>
            );
        }

        return null;
    }
}

interface MonsterNameProps {
    slotID: string;
    index: number;
    value: string;
    changeName: (slotID: string, index: number, value: string) => void;
}

class MonsterName extends React.Component<MonsterNameProps> {
    public render() {
        try {
            return (
                <Input
                    value={this.props.value}
                    allowClear={true}
                    onChange={event => this.props.changeName(this.props.slotID, this.props.index, event.target.value)}
                />
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}
