import React from 'react';

import Factory from '../../utils/factory';
import Napoleon from '../../utils/napoleon';
import Utils from '../../utils/utils';

import { Encounter, EncounterSlot, EncounterWave, MonsterFilter } from '../../models/encounter';
import { Monster, MonsterGroup } from '../../models/monster-group';
import { Party } from '../../models/party';

import MonsterCard from '../cards/monster-card';
import ConfirmButton from '../controls/confirm-button';
import Expander from '../controls/expander';
import Selector from '../controls/selector';
import Spin from '../controls/spin';
import CardGroup from '../panels/card-group';
import DifficultyChartPanel from '../panels/difficulty-chart-panel';
import FilterPanel from '../panels/filter-panel';
import Note from '../panels/note';

interface Props {
    encounter: Encounter;
    parties: Party[];
    library: MonsterGroup[];
    clearEncounter: () => void;
    removeEncounter: () => void;
    buildEncounter: (xp: number, filter: MonsterFilter) => void;
    addEncounterSlot: (monster: Monster, waveID: string | null) => void;
    removeEncounterSlot: (encounterSlot: EncounterSlot, waveID: string | null) => void;
    addWave: () => void;
    removeWave: (wave: EncounterWave) => void;
    changeValue: (source: any, field: string, value: any) => void;
    nudgeValue: (source: any, field: string, value: number) => void;
    getMonster: (monsterName: string, groupName: string) => Monster | null;
}

interface State {
    filter: MonsterFilter;
}

export default class EncounterScreen extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            filter: Factory.createMonsterFilter()
        };
    }

    private matchMonster(monster: Monster) {
        return Napoleon.matchMonster(monster, this.state.filter);
    }

    private changeFilterValue(type: 'name' | 'challengeMin' | 'challengeMax' | 'category' | 'size', value: any) {
        // eslint-disable-next-line
        this.state.filter[type] = value as never;
        this.setState({
            filter: this.state.filter
        });
    }

    private nudgeFilterValue(type: 'challengeMin' | 'challengeMax', delta: number) {
        const value = Utils.nudgeChallenge(this.state.filter[type], delta);
        this.changeFilterValue(type, value);
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
                    <div className='column' key={monster.id}>
                        <MonsterCard
                            monster={monster}
                            slot={slot}
                            encounter={this.props.encounter}
                            mode={'view encounter'}
                            nudgeValue={(source, type, delta) => this.props.nudgeValue(source, type, delta)}
                            removeEncounterSlot={s => this.props.removeEncounterSlot(s, waveID)}
                        />
                    </div>
                );
            } else {
                const index = slots.indexOf(slot);
                cards.push(
                    <div className='column' key={index}>
                        <div className='card error'>
                            <div className='card-content'>
                                <div className='subheading'>unknown monster</div>
                                <div className='divider' />
                                <div className='section'>
                                    could not find a monster called '<b>{slot.monsterName}</b>' in a group called '<b>{slot.monsterGroupName}'</b>
                                </div>
                                <div className='divider' />
                                <button onClick={() => this.props.removeEncounterSlot(slot, waveID)}>remove</button>
                            </div>
                        </div>
                    </div>
                );
            }
        });

        if (slots.length === 0) {
            if (waveID) {
                cards.push(
                    <div className='column' key='empty'>
                        <Note
                            content={
                                <div>
                                    <p>there are no monsters in this wave</p>
                                </div>
                            }
                        />
                    </div>
                );
            } else {
                cards.push(
                    <div className='column' key='empty'>
                        <Note
                            content={
                                <div>
                                    <p>there are no monsters in this encounter</p>
                                    <p>you can add monsters from the list below, or try 'build a random encounter'</p>
                                </div>
                            }
                        />
                    </div>
                );
            }
        }

        return cards;
    }

    private getLibrarySection() {
        const monsters: Monster[] = [];
        this.props.library.forEach(group => {
            group.monsters.forEach(monster => {
                if (this.matchMonster(monster)) {
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
                <div className='column' key={monster.id}>
                    <MonsterCard
                        key={monster.id}
                        monster={monster}
                        encounter={this.props.encounter}
                        library={this.props.library}
                        mode={'view encounter'}
                        addEncounterSlot={(combatant, waveID) => this.props.addEncounterSlot(combatant, waveID)}
                    />
                </div>
            );
        });

        if (libraryCards.length === 0) {
            libraryCards.push(
                <div className='column' key='empty'>
                    <Note
                        content={
                            <div>
                                <p>there are no monsters that meet the criteria <i>{Napoleon.getFilterDescription(this.state.filter)}</i></p>
                            </div>
                        }
                    />
                </div>
            );
        }

        return (
            <CardGroup
                heading='monster library'
                content={libraryCards}
                showToggle={true}
            />
        );
    }

    public render() {
        try {
            const waves = this.props.encounter.waves.map(w => {
                return (
                    <CardGroup
                        key={w.id}
                        heading={w.name || 'unnamed wave'}
                        content={this.getMonsterCards(w.slots, w.id)}
                    />
                );
            });

            return (
                <div className='screen row collapse'>
                    <div className='columns small-4 medium-4 large-3 scrollable left-column'>
                        <EncounterInfo
                            encounter={this.props.encounter}
                            parties={this.props.parties}
                            monsterFilter={this.state.filter}
                            changeValue={(source, type, value) => this.props.changeValue(source, type, value)}
                            addWave={() => this.props.addWave()}
                            removeWave={wave => this.props.removeWave(wave)}
                            clearEncounter={() => this.props.clearEncounter()}
                            removeEncounter={() => this.props.removeEncounter()}
                            buildEncounter={xp => this.props.buildEncounter(xp, this.state.filter)}
                            getMonster={(monsterName, monsterGroupName) => this.props.getMonster(monsterName, monsterGroupName)}
                            changeFilterValue={(type, value) => this.changeFilterValue(type, value)}
                            nudgeFilterValue={(type, delta) => this.nudgeFilterValue(type, delta)}
                            resetFilter={() => this.resetFilter()}
                        />
                    </div>
                    <div className='columns small-8 medium-8 large-9 scrollable'>
                        <CardGroup
                            content={this.getMonsterCards(this.props.encounter.slots, null)}
                            heading={this.props.encounter.name || 'unnamed encounter'}
                        />
                        {waves}
                        {this.getLibrarySection()}
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}

interface EncounterInfoProps {
    encounter: Encounter;
    parties: Party[];
    monsterFilter: MonsterFilter;
    changeValue: (source: any, field: string, value: any) => void;
    addWave: () => void;
    removeWave: (wave: EncounterWave) => void;
    clearEncounter: () => void;
    removeEncounter: () => void;
    buildEncounter: (xp: number) => void;
    getMonster: (monsterName: string, groupName: string) => Monster | null;
    changeFilterValue: (type: 'name' | 'challengeMin' | 'challengeMax' | 'category' | 'size', value: any) => void;
    nudgeFilterValue: (type: 'challengeMin' | 'challengeMax', delta: number) => void;
    resetFilter: () => void;
}

interface EncounterInfoState {
    randomEncounterXP: number;
    randomEncounterStep: number;
}

class EncounterInfo extends React.Component<EncounterInfoProps, EncounterInfoState> {
    constructor(props: EncounterInfoProps) {
        super(props);
        this.state = {
            randomEncounterXP: 100,
            randomEncounterStep: 100
        };
    }

    private setRandomEncounterXP(value: number) {
        this.setState({
            randomEncounterXP: Math.max(0, value)
        });
    }

    private setRandomEncounterStep(value: number) {
        this.setState({
            randomEncounterStep: value
        });
    }

    public render() {
        try {
            const waves = this.props.encounter.waves.map(wave => (
                <div key={wave.id} className='group-panel'>
                    <input
                        type='text'
                        placeholder='wave name'
                        value={wave.name}
                        onChange={event => this.props.changeValue(wave, 'name', event.target.value)}
                    />
                    <ConfirmButton text='delete wave' callback={() => this.props.removeWave(wave)} />
                </div>
            ));

            return (
                <div>
                    <div className='section'>
                        <div className='subheading'>encounter name</div>
                        <input
                            type='text'
                            placeholder='encounter name'
                            value={this.props.encounter.name}
                            onChange={event => this.props.changeValue(this.props.encounter, 'name', event.target.value)}
                        />
                    </div>
                    <div className='section'>
                        <div className='subheading'>waves</div>
                        {waves}
                        <button onClick={() => this.props.addWave()}>add a new wave</button>
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
                            filter={this.props.monsterFilter}
                            changeValue={(type, value) => this.props.changeFilterValue(type, value)}
                            nudgeValue={(type, delta) => this.props.nudgeFilterValue(type, delta)}
                            resetFilter={() => this.props.resetFilter()}
                        />
                    </div>
                    <div className='divider' />
                    <div className='section'>
                        <Expander
                            text='build a random encounter'
                            content={(
                                <div>
                                    <p>add random monsters to this encounter until its adjusted xp value is at least the following value</p>
                                    <Spin
                                        source={this.state}
                                        name='randomEncounterXP'
                                        label='xp'
                                        nudgeValue={delta => this.setRandomEncounterXP(this.state.randomEncounterXP + (delta * this.state.randomEncounterStep))}
                                    />
                                    <Selector
                                        options={['10', '100', '1000'].map(t => {
                                            return { id: t, text: t };
                                        })}
                                        selectedID={this.state.randomEncounterStep.toString()}
                                        select={optionID => this.setRandomEncounterStep(Number.parseInt(optionID, 10))}
                                    />
                                    <button onClick={() => this.props.buildEncounter(this.state.randomEncounterXP)}>build encounter</button>
                                </div>
                            )}
                        />
                        <ConfirmButton text='clear encounter' callback={() => this.props.clearEncounter()} />
                        <ConfirmButton text='delete encounter' callback={() => this.props.removeEncounter()} />
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
