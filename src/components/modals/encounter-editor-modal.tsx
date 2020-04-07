import { Col, Drawer, InputNumber, Row } from 'antd';
import React from 'react';

import Factory from '../../utils/factory';
import Napoleon from '../../utils/napoleon';

import { Encounter, EncounterSlot, EncounterWave, MonsterFilter } from '../../models/encounter';
import { Monster, MonsterGroup } from '../../models/monster-group';
import { Party } from '../../models/party';

import MonsterCard from '../cards/monster-card';
import ConfirmButton from '../controls/confirm-button';
import Expander from '../controls/expander';
import Textbox from '../controls/textbox';
import StatBlockModal from './stat-block-modal';
import DifficultyChartPanel from '../panels/difficulty-chart-panel';
import FilterPanel from '../panels/filter-panel';
import GridPanel from '../panels/grid-panel';
import Note from '../panels/note';

interface Props {
    encounter: Encounter;
    parties: Party[];
    library: MonsterGroup[];
    getMonster: (monsterName: string, groupName: string) => Monster | null;
}

interface State {
    encounter: Encounter;
    filter: MonsterFilter;
    selectedMonster: Monster | null;
    randomEncounterXP: number;
}

export default class EncounterEditorModal extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            encounter: props.encounter,
            filter: Factory.createMonsterFilter(),
            selectedMonster: null,
            randomEncounterXP: 1000
        };
    }

    private setSelectedMonster(monster: Monster | null) {
        this.setState({
            selectedMonster: monster
        });
    }

    private setRandomEncounterXP(value: number) {
        this.setState({
            randomEncounterXP: Math.max(0, value)
        });
    }

    private addWave() {
        const wave = Factory.createEncounterWave();
        wave.name = 'wave ' + (this.state.encounter.waves.length + 2);
        this.state.encounter.waves.push(wave);

        this.setState({
            encounter: this.state.encounter
        });
    }

    private removeWave(wave: EncounterWave) {
        const index = this.state.encounter.waves.indexOf(wave);
        this.state.encounter.waves.splice(index, 1);

        this.setState({
            encounter: this.state.encounter
        });
    }

    private buildEncounter() {
        const encounter = this.state.encounter;
        encounter.slots = [];
        encounter.waves = [];

        Napoleon.buildEncounter(encounter, this.state.randomEncounterXP, this.state.filter, this.props.library, this.props.getMonster);
        this.sortEncounterSlots(encounter);
        encounter.waves.forEach(wave => this.sortEncounterSlots(wave));

        this.setState({
            encounter: encounter
        });
    }

    private clearEncounter() {
        const encounter = this.state.encounter;
        encounter.slots = [];
        encounter.waves = [];

        this.setState({
            encounter: encounter
        });
    }

    private addEncounterSlot(monster: Monster, waveID: string | null) {
        const group = this.props.library.find(g => g.monsters.includes(monster));
        if (group) {
            const slot = Factory.createEncounterSlot();
            slot.monsterGroupName = group.name;
            slot.monsterName = monster.name;

            if (waveID !== null) {
                const wave = this.state.encounter.waves.find(w => w.id === waveID);
                if (wave) {
                    wave.slots.push(slot);
                    this.sortEncounterSlots(wave);
                }
            } else {
                this.state.encounter.slots.push(slot);
                this.sortEncounterSlots(this.state.encounter);
            }

            this.setState({
                encounter: this.state.encounter
            });
        }
    }

    private sortEncounterSlots(slotContainer: { slots: EncounterSlot[] }) {
        const uniqueSlots: EncounterSlot[] = [];
        slotContainer.slots.forEach(slot => {
            let current = uniqueSlots.find(s => (s.monsterGroupName === slot.monsterGroupName) && (s.monsterName === slot.monsterName));
            if (!current) {
                current = slot;
                uniqueSlots.push(slot);
            } else {
                current.count += slot.count;
            }
        });
        slotContainer.slots = uniqueSlots;

        slotContainer.slots.sort((a, b) => {
            const aName = a.monsterName.toLowerCase();
            const bName = b.monsterName.toLowerCase();
            if (aName < bName) { return -1; }
            if (aName > bName) { return 1; }
            return 0;
        });
    }

    private removeEncounterSlot(slot: EncounterSlot, waveID: string | null) {
        if (waveID) {
            const wave = this.state.encounter.waves.find(w => w.id === waveID);
            if (wave) {
                const index = wave.slots.indexOf(slot);
                wave.slots.splice(index, 1);
            }
        } else {
            const n = this.state.encounter.slots.indexOf(slot);
            this.state.encounter.slots.splice(n, 1);
        }

        this.setState({
            encounter: this.state.encounter
        });
    }

    private swapEncounterSlot(slot: EncounterSlot, waveID: string | null, groupName: string, monsterName: string) {
        slot.monsterGroupName = groupName;
        slot.monsterName = monsterName;

        if (waveID) {
            const wave = this.state.encounter.waves.find(w => w.id === waveID);
            if (wave) {
                this.sortEncounterSlots(wave);
            }
        } else {
            this.sortEncounterSlots(this.state.encounter);
        }

        this.setState({
            encounter: this.state.encounter
        });
    }

    private moveToWave(slot: EncounterSlot, current: EncounterSlot[], waveID: string) {
        const index = current.indexOf(slot);
        current.splice(index, 1);

        if (waveID) {
            const wave = this.state.encounter.waves.find(w => w.id === waveID);
            if (wave) {
                wave.slots.push(slot);
                this.sortEncounterSlots(wave);
            }
        } else {
            this.state.encounter.slots.push(slot);
            this.sortEncounterSlots(this.state.encounter);
        }

        this.setState({
            encounter: this.state.encounter
        });
    }

    private changeValue(source: any, field: string, value: any) {
        source[field] = value;

        this.setState({
            encounter: this.state.encounter
        });
    }

    private nudgeValue(source: any, field: string, delta: number) {
        let value: number = source[field];
        value += delta;

        this.changeValue(source, field, value);
    }

    private changeFilterValue(type: 'name' | 'challenge' | 'category' | 'size', value: any) {
        const filter = this.state.filter as any;
        if (type === 'challenge') {
            filter.challengeMin = value[0];
            filter.challengeMax = value[1];
        } else {
            filter[type] = value;
        }
        this.setState({
            filter: filter
        });
    }

    private resetFilter() {
        this.setState({
            filter: Factory.createMonsterFilter()
        });
    }

    private getMonsterCards(slots: EncounterSlot[], waveID: string | null) {
        const cards = [];

        slots.forEach(slot => {
            const monster = this.props.getMonster(slot.monsterName, slot.monsterGroupName);
            if (monster) {
                cards.push(
                    <MonsterCard
                        monster={monster}
                        slot={slot}
                        encounter={this.props.encounter}
                        mode={'encounter'}
                        library={this.props.library}
                        nudgeValue={(source, type, delta) => this.nudgeValue(source, type, delta)}
                        viewMonster={monster => this.setSelectedMonster(monster)}
                        removeEncounterSlot={s => this.removeEncounterSlot(s, waveID)}
                        swapEncounterSlot={(s, groupName, monsterName) => this.swapEncounterSlot(s, waveID, groupName, monsterName)}
                        moveToWave={(s, current, id) => this.moveToWave(s, current, id)}
                    />
                );
            } else {
                cards.push(
                    <div className='card error'>
                        <div className='card-content'>
                            <div className='subheading'>unknown monster</div>
                            <div className='divider' />
                            <div className='section'>
                                could not find a monster called '<b>{slot.monsterName}</b>' in a group called '<b>{slot.monsterGroupName}'</b>
                            </div>
                            <div className='divider' />
                            <button onClick={() => this.removeEncounterSlot(slot, waveID)}>remove</button>
                        </div>
                    </div>
                );
            }
        });

        if (slots.length === 0) {
            if (waveID) {
                cards.push(
                    <Note>there are no monsters in this wave</Note>
                );
            } else {
                cards.push(
                    <Note>
                        <p>there are no monsters in this encounter</p>
                        <p>you can add monsters from the list below, or try 'build a random encounter'</p>
                    </Note>
                );
            }
        }

        return cards;
    }

    private getLibrarySection() {
        const monsters: Monster[] = [];
        this.props.library.forEach(group => {
            group.monsters.forEach(monster => {
                if (Napoleon.matchMonster(monster, this.state.filter)) {
                    monsters.push(monster);
                }
            });
        });
        monsters.sort((a, b) => {
            if (a.name < b.name) { return -1; }
            if (a.name > b.name) { return 1; }
            return 0;
        });

        const libraryCards = monsters.map(monster => {
            return (
                <MonsterCard
                    key={monster.id}
                    monster={monster}
                    encounter={this.props.encounter}
                    library={this.props.library}
                    mode={'encounter'}
                    viewMonster={monster => this.setSelectedMonster(monster)}
                    addEncounterSlot={(combatant, waveID) => this.addEncounterSlot(combatant, waveID)}
                />
            );
        });

        if (libraryCards.length === 0) {
            libraryCards.push(
                <Note><p>there are no monsters that meet the criteria <i>{Napoleon.getFilterDescription(this.state.filter)}</i></p></Note>
            );
        }

        return (
            <GridPanel
                heading='monster library'
                content={libraryCards}
                columns={3}
                showToggle={true}
            />
        );
    }

    public render() {
        try {
            const waves = this.props.encounter.waves.map(wave => (
                <div key={wave.id} className='group-panel'>
                    <Textbox
                        text={wave.name}
                        placeholder='wave name'
                        onChange={value => this.changeValue(wave, 'name', value)}
                    />
                    <ConfirmButton text='delete wave' callback={() => this.removeWave(wave)} />
                </div>
            ));

            const waveSlots = this.props.encounter.waves.map(w => {
                return (
                    <GridPanel
                        key={w.id}
                        heading={w.name || 'unnamed wave'}
                        content={this.getMonsterCards(w.slots, w.id)}
                        columns={3}
                    />
                );
            });

            return (
                <Row className='full-height'>
                    <Col span={8} className='scrollable sidebar sidebar-left'>
                        <div className='section'>
                            <div className='subheading'>encounter name</div>
                            <Textbox
                                text={this.props.encounter.name}
                                placeholder='encounter name'
                                onChange={value => this.changeValue(this.props.encounter, 'name', value)}
                            />
                        </div>
                        <div className='section'>
                            <div className='subheading'>waves</div>
                            {waves}
                            <button onClick={() => this.addWave()}>add a new wave</button>
                        </div>
                        <div className='divider' />
                        <DifficultyChartPanel
                            encounter={this.props.encounter}
                            parties={this.props.parties}
                            getMonster={(monsterName, monsterGroupName) => this.props.getMonster(monsterName, monsterGroupName)}
                        />
                        <div className='divider' />
                        <div className='section'>
                            <FilterPanel
                                filter={this.state.filter}
                                changeValue={(type, value) => this.changeFilterValue(type, value)}
                                resetFilter={() => this.resetFilter()}
                            />
                        </div>
                        <div className='divider' />
                        <div className='section'>
                            <Expander text='build a random encounter'>
                                <p>add random monsters to this encounter until its (effective)) xp value is at least the following value</p>
                                <InputNumber
                                    value={this.state.randomEncounterXP}
                                    min={0}
                                    step={1000}
                                    onChange={value => this.setRandomEncounterXP(value || 0)}
                                />
                                <button onClick={() => this.buildEncounter()}>build encounter</button>
                            </Expander>
                            <ConfirmButton text='clear encounter' callback={() => this.clearEncounter()} />
                        </div>
                    </Col>
                    <Col span={16} className='scrollable'>
                        <GridPanel
                            columns={3}
                            content={this.getMonsterCards(this.props.encounter.slots, null)}
                            heading='encounter'
                        />
                        {waveSlots}
                        {this.getLibrarySection()}
                    </Col>
                    <Drawer visible={!!this.state.selectedMonster} width='50%' closable={false} onClose={() => this.setSelectedMonster(null)}>
                        <StatBlockModal source={this.state.selectedMonster} />
                    </Drawer>
                </Row>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
