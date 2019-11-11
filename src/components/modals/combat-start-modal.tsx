import React from 'react';

import { Col, Input, Row } from 'antd';

import Utils from '../../utils/utils';

import { CombatSetup } from '../../models/combat';
import { Encounter, EncounterSlot } from '../../models/encounter';
import { Map } from '../../models/map';
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
    maps: Map[];
    getMonster: (monsterName: string, groupName: string) => Monster | null;
    notify: () => void;
}

interface State {
    combatSetup: CombatSetup;
}

export default class CombatStartModal extends React.Component<Props, State> {
    public static defaultProps = {
        parties: null
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            combatSetup: props.combatSetup
        };
    }

    private setPartyID(partyID: string | null) {
        const party = this.props.parties.find(p => p.id === partyID);
        // eslint-disable-next-line
        this.state.combatSetup.party = party || null;
        this.setState({
            combatSetup: this.state.combatSetup
        }, () => this.props.notify());
    }

    private setEncounterID(encounterID: string | null) {
        const encounter = this.props.encounters.find(e => e.id === encounterID);
        // eslint-disable-next-line
        this.state.combatSetup.encounter = encounter || null;
        if (encounter) {
            // eslint-disable-next-line
            this.state.combatSetup.monsterNames = Utils.getMonsterNames(encounter);
        }
        this.setState({
            combatSetup: this.state.combatSetup
        }, () => this.props.notify());
    }

    private setMapID(mapID: string | null) {
        const map = this.props.maps.find(m => m.id === mapID);
        // eslint-disable-next-line
        this.state.combatSetup.map = map || null;
        this.setState({
            combatSetup: this.state.combatSetup
        });
    }

    private setWaveID(waveID: string | null) {
        // eslint-disable-next-line
        this.state.combatSetup.waveID = waveID;
        if (this.state.combatSetup.encounter) {
            const wave = this.state.combatSetup.encounter.waves.find(w => w.id === waveID);
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
                            maps={this.props.maps}
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
        if (this.props.combatSetup.party) {
            const pcs = this.props.combatSetup.party.pcs.filter(pc => pc.active);

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

        return (
            <div>
                <div className='heading'>party</div>
                <Dropdown
                    options={partyOptions}
                    placeholder='select party'
                    selectedID={this.props.combatSetup.party ? this.props.combatSetup.party.id : undefined}
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
                <div>
                    <div className='heading'>encounter</div>
                    <div className='section'>(no encounters)</div>
                </div>
            );
        }

        const encounterOptions = this.props.encounters.map(encounter => {
            return {
                id: encounter.id,
                text: encounter.name || 'unnamed encounter'
            };
        });

        let encounterContent = null;
        if (this.props.combatSetup.encounter) {
            const monsterSections = this.props.combatSetup.encounter.slots.map(slot => {
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

            const waves = this.props.combatSetup.encounter.waves.map(wave => {
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

        return (
            <div>
                <div className='heading'>encounter</div>
                <Dropdown
                    options={encounterOptions}
                    placeholder='select encounter'
                    selectedID={this.props.combatSetup.encounter ? this.props.combatSetup.encounter.id : undefined}
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
    maps: Map[];
    setMapID: (id: string | null) => void;
}

class MapSection extends React.Component<MapSectionProps> {
    public render() {
        if (this.props.maps.length === 0) {
            return (
                <div>
                    <div className='heading'>map</div>
                    <div className='section'>(no maps)</div>
                </div>
            );
        }

        const mapOptions = this.props.maps.map(map => {
            return {
                id: map.id,
                text: map.name || 'unnamed map'
            };
        });

        let mapContent = null;
        if (this.props.combatSetup.map) {
            mapContent = (
                <div>
                    <MapPanel
                        map={this.props.combatSetup.map}
                        mode='thumbnail'
                        size={10}
                    />
                </div>
            );
        }

        return (
            <div>
                <div className='heading'>map</div>
                <Dropdown
                    options={mapOptions}
                    placeholder='select map'
                    selectedID={this.props.combatSetup.map ? this.props.combatSetup.map.id : undefined}
                    select={optionID => this.props.setMapID(optionID)}
                    clear={() => this.props.setMapID(null)}
                />
                {mapContent}
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
        if (this.props.combatSetup.encounter === null) {
            return (
                <div className='section'>you have not selected an encounter</div>
            );
        } else {
            if (this.props.combatSetup.encounter.waves.length === 0) {
                return (
                    <div className='section'>you have not defined any waves</div>
                );
            }

            const waveOptions = this.props.combatSetup.encounter.waves.map(wave => {
                return {
                    id: wave.id,
                    text: wave.name || 'unnamed wave'
                };
            });

            let waveContent = null;
            if (this.props.combatSetup.waveID) {
                const selectedWave = this.props.combatSetup.encounter.waves.find(w => w.id === this.props.combatSetup.waveID);
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
                        placeholder='select wave'
                        selectedID={this.props.combatSetup.waveID ? this.props.combatSetup.waveID : undefined}
                        select={optionID => this.props.setWaveID(optionID)}
                        clear={() => this.props.setWaveID(null)}
                    />
                    {waveContent}
                </div>
            );
        }
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
        if (this.props.combatSetup.party && this.props.combatSetup.encounter) {
            return (
                <div>
                    <div className='heading'>encounter difficulty</div>
                    <DifficultyChartPanel
                        parties={this.props.parties}
                        party={this.props.combatSetup.party}
                        encounter={this.props.combatSetup.encounter}
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
        if (this.props.combatSetup.encounter === null) {
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

        if (this.props.combatSetup.encounter) {
            let slotsContainer: { slots: EncounterSlot[] } = this.props.combatSetup.encounter;
            if (this.props.combatSetup.waveID) {
                const selectedWave = this.props.combatSetup.encounter.waves.find(w => w.id === this.props.combatSetup.waveID);
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
