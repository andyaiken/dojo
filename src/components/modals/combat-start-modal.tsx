import React from 'react';

import { Col, Row } from 'antd';

import Factory from '../../utils/factory';
import Mercator from '../../utils/mercator';
import Napoleon from '../../utils/napoleon';
import Utils from '../../utils/utils';

import { CombatSetup, CombatSlotInfo } from '../../models/combat';
import { Encounter, EncounterSlot } from '../../models/encounter';
import { Map } from '../../models/map';
import { Monster, MonsterGroup } from '../../models/monster-group';
import { Party } from '../../models/party';

import Dropdown from '../controls/dropdown';
import NumberSpin from '../controls/number-spin';
import Selector from '../controls/selector';
import Textbox from '../controls/textbox';
import DifficultyChartPanel from '../panels/difficulty-chart-panel';
import MapPanel from '../panels/map-panel';

interface Props {
    combatSetup: CombatSetup;
    parties: Party[];
    library: MonsterGroup[];
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
        parties: null,
        library: null,
        encounters: null,
        maps: null
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            combatSetup: props.combatSetup
        };
    }

    private setPartyID(partyID: string | null) {
        const setup = this.state.combatSetup;
        const party = this.props.parties.find(p => p.id === partyID);
        setup.party = party ? JSON.parse(JSON.stringify(party)) : null;
        this.setState({
            combatSetup: setup
        }, () => this.props.notify());
    }

    private setEncounterID(encounterID: string | null) {
        const setup = this.state.combatSetup;
        const encounter = this.props.encounters.find(e => e.id === encounterID);
        setup.encounter = encounter ? JSON.parse(JSON.stringify(encounter)) : null;
        setup.slotInfo = Utils.getCombatSlotData(setup.encounter);
        this.setState({
            combatSetup: setup
        }, () => this.props.notify());
    }

    private setMapID(mapID: string | null) {
        const map = this.props.maps.find(m => m.id === mapID);
        const setup = this.state.combatSetup;
        setup.map = map || null;
        this.setState({
            combatSetup: setup
        });
    }

    private setWaveID(waveID: string | null) {
        const setup = this.state.combatSetup;
        setup.waveID = waveID;
        if (setup.encounter) {
            const wave = setup.encounter.waves.find(w => w.id === waveID);
            if (wave) {
                setup.slotInfo = Utils.getCombatSlotData(wave);
            }
        }
        this.setState({
            combatSetup: setup
        }, () => this.props.notify());
    }

    private generateEncounter(diff: string) {
        const encounter = Factory.createEncounter();
        encounter.name = 'new encounter';

        const filter = Factory.createMonsterFilter();

        let xp = 0;
        let sumLevel = 0;
        if (this.state.combatSetup.party) {
            const pcs = this.state.combatSetup.party.pcs.filter(pc => pc.active);
            pcs.forEach(pc => {
                xp += Utils.pcExperience(pc.level, diff);
                sumLevel += pc.level;
            });

            const avgLevel = sumLevel / pcs.length;
            filter.challengeMax = Math.max(avgLevel, 5);
        }

        Napoleon.buildEncounter(encounter, xp, filter, this.props.library, this.props.getMonster);
        const setup = this.state.combatSetup;
        setup.encounter = encounter;
        setup.slotInfo = Utils.getCombatSlotData(encounter);
        this.setState({
            combatSetup: setup
        }, () => this.props.notify());
    }

    private generateMap(type: string) {
        const map = Factory.createMap();
        map.name = 'new map';
        Mercator.generate(type, map);
        const setup = this.state.combatSetup;
        setup.map = map;
        this.setState({
            combatSetup: setup
        }, () => this.props.notify());
    }

    private changeName(slotID: string, index: number, name: string) {
        const monsterNames = this.state.combatSetup.slotInfo.find(mn => mn.id === slotID);
        if (monsterNames) {
            monsterNames.members[index].name = name;
            this.setState({
                combatSetup: this.state.combatSetup
            });
        }
    }

    private nudgeCount(slotID: string, delta: number) {
        const setup = this.state.combatSetup;
        if (setup.encounter) {
            const slot = setup.encounter.slots.find(s => s.id === slotID);
            if (slot) {
                // Change number
                slot.count = Math.max(0, slot.count + delta);
                // Reset names
                setup.slotInfo = Utils.getCombatSlotData(setup.encounter);
                this.setState({
                    combatSetup: setup
                });
            }
        }
    }

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
                            generateEncounter={diff => this.generateEncounter(diff)}
                        />
                        <MapSection
                            combatSetup={this.state.combatSetup}
                            maps={this.props.maps}
                            setMapID={id => this.setMapID(id)}
                            generateMap={type => this.generateMap(type)}
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
                            changeName={(slotID, index, name) => this.changeName(slotID, index, name)}
                            nudgeCount={(slotID, delta) => this.nudgeCount(slotID, delta)}
                        />
                    </div>
                );
            } else {
                leftSection = (
                    <div>
                        <WaveSection
                            combatSetup={this.state.combatSetup}
                            setWaveID={id => this.setWaveID(id)}
                        />
                    </div>
                );

                rightSection = (
                    <div>
                        <MonsterSection
                            combatSetup={this.state.combatSetup}
                            parties={this.props.parties}
                            changeName={(slotID, index, name) => this.changeName(slotID, index, name)}
                            nudgeCount={(slotID, delta) => this.nudgeCount(slotID, delta)}
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
                    placeholder='select a party'
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
    generateEncounter: (diff: string) => void;
}

class EncounterSection extends React.Component<EncounterSectionProps> {
    public render() {
        let tools = null;
        if (this.props.combatSetup.encounter) {
            tools = (
                <div>
                    <button onClick={() => this.props.setEncounterID(null)}>choose a different encounter</button>
                </div>
            );
        } else {
            let selector = null;
            if (this.props.encounters.length > 0) {
                const options = this.props.encounters.map(encounter => {
                    return {
                        id: encounter.id,
                        text: encounter.name || 'unnamed encounter'
                    };
                });
                selector = (
                    <Dropdown
                        options={options}
                        placeholder='select an encounter'
                        select={optionID => this.props.setEncounterID(optionID)}
                    />
                );
            }

            let random = null;
            if (this.props.combatSetup.party) {
                random = (
                    <button onClick={() => this.props.generateEncounter('medium')}>generate a random encounter</button>
                );
            }

            tools = (
                <div>
                    {selector}
                    {random}
                </div>
            );
        }

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
                {tools}
                {encounterContent}
            </div>
        );
    }
}

interface MapSectionProps {
    combatSetup: CombatSetup;
    maps: Map[];
    setMapID: (id: string | null) => void;
    generateMap: (type: string) => void;
}

class MapSection extends React.Component<MapSectionProps> {
    public render() {
        let tools = null;
        if (this.props.combatSetup.map) {
            tools = (
                <div>
                    <button onClick={() => this.props.setMapID(null)}>choose a different map</button>
                </div>
            );
        } else {
            let selector = null;
            if (this.props.maps.length > 0) {
                const options = this.props.maps.map(map => {
                    return {
                        id: map.id,
                        text: map.name || 'unnamed map'
                    };
                });
                selector = (
                    <Dropdown
                        options={options}
                        placeholder='select a map'
                        select={optionID => this.props.setMapID(optionID)}
                    />
                );
            }

            tools = (
                <div>
                    {selector}
                    <button onClick={() => this.props.generateMap('delve')}>generate a random delve</button>
                </div>
            );
        }

        let mapContent = null;
        if (this.props.combatSetup.map) {
            mapContent = (
                <MapPanel
                    map={this.props.combatSetup.map}
                    mode='thumbnail'
                    size={12}
                />
            );
        }

        return (
            <div>
                <div className='heading'>map</div>
                {tools}
                {mapContent}
            </div>
        );
    }
}

interface WaveSectionProps {
    combatSetup: CombatSetup;
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
    changeName: (slotID: string, index: number, name: string) => void;
    nudgeCount: (slotID: string, delta: number) => void;
}

class MonsterSection extends React.Component<MonsterSectionProps> {
    public render() {
        if (!this.props.combatSetup.encounter) {
            return (
                <div>
                    <div className='heading'>monsters</div>
                    <div className='section'>select an encounter to see monster options here.</div>
                </div>
            );
        }

        if (!this.props.parties && !this.props.combatSetup.waveID) {
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

            const slots = this.props.combatSetup.slotInfo.map(slotInfo => {
                const slot = slotsContainer.slots.find(s => s.id === slotInfo.id);
                if (!slot) {
                    return null;
                }
                return (
                    <MonsterSlotSection
                        key={slotInfo.id}
                        slotInfo={slotInfo}
                        slot={slot}
                        changeName={(slotID, index, name) => this.props.changeName(slotID, index, name)}
                        nudgeCount={(slotID, delta) => this.props.nudgeCount(slotID, delta)}
                    />
                );
            });

            return (
                <div>
                    <div className='heading'>monsters</div>
                    <div>{slots}</div>
                </div>
            );
        }

        return null;
    }
}

interface MonsterSlotSectionProps {
    slotInfo: CombatSlotInfo;
    slot: EncounterSlot;
    changeName: (slotID: string, index: number, name: string) => void;
    nudgeCount: (slotID: string, delta: number) => void;
}

interface MonsterSlotSectionState {
    view: string;
}

class MonsterSlotSection extends React.Component<MonsterSlotSectionProps, MonsterSlotSectionState> {
    constructor(props: MonsterSlotSectionProps) {
        super(props);
        this.state = {
            view: 'init'
        };
    }

    private setView(view: string) {
        this.setState({
            view: view
        });
    }

    private getInitSection() {
        // TODO: One value for all (checkbox, default TRUE)

        // TODO: auto-rolled / manual (default auto)
        // Reroll button
        // Slider (bonus+1 - bonus+20)

        return (
            <div>
                Initiative
            </div>
        );
    }

    private getHPSection() {
        // TODO: One value for all (checkbox, default TRUE)

        // Option: auto-rolled /  manual / typical (default typical)
        // Reroll button
        // Slider (min to max)

        return (
            <div>
                HP
            </div>
        );
    }

    private getNameSection() {
        const nameSections = [];

        for (let n = 0; n !== this.props.slotInfo.members.length; ++n) {
            const data = this.props.slotInfo.members[n];
            nameSections.push(
                <Textbox
                    key={n}
                    text={data.name}
                    onChange={value => this.props.changeName(this.props.slot.id, n, value)}
                />
            );
        }

        return nameSections;
    }

    public render() {
        let selector = null;
        const showSelector = false;
        if (showSelector) {
            const options = ['init', 'hp', 'names'].map(s => {
                return { id: s, text: s };
            });
            selector = (
                <Selector options={options} selectedID={this.state.view} select={id => this.setView(id)} />
            );
        }

        let content = null;
        switch (this.state.view) {
            case 'init':
                content = this.getInitSection();
                break;
            case 'hp':
                content = this.getHPSection();
                break;
            case 'names':
                content = this.getNameSection();
                break;
        }

        return (
            <Row gutter={10}>
                <Col span={10}>
                    <div className='subheading'>{this.props.slot.monsterName}</div>
                    <div className='divider' />
                    <NumberSpin
                        source={this.props.slot}
                        name='count'
                        nudgeValue={delta => this.props.nudgeCount(this.props.slot.id, delta)}
                    />
                </Col>
                <Col span={14}>
                    {selector}
                    {content}
                </Col>
            </Row>
        );
    }
}
