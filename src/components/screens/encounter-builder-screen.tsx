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
import Spin from '../controls/spin';
import EncounterListItem from '../list-items/encounter-list-item';
import CardGroup from '../panels/card-group';
import DifficultyChartPanel from '../panels/difficulty-chart-panel';
import FilterPanel from '../panels/filter-panel';
import Note from '../panels/note';

interface Props {
    encounters: Encounter[];
    selection: Encounter | null;
    parties: Party[];
    library: MonsterGroup[];
    filter: string;
    selectEncounter: (encounter: Encounter | null) => void;
    addEncounter: () => void;
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

export default class EncounterBuilderScreen extends React.Component<Props, State> {
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
                            combatant={monster}
                            slot={slot}
                            encounter={this.props.selection as Encounter}
                            mode={'view encounter'}
                            nudgeValue={(source, type, delta) => this.props.nudgeValue(source, type, delta)}
                            removeEncounterSlot={source => this.props.removeEncounterSlot(source, waveID)}
                        />
                    </div>
                );
            } else {
                const index = slots.indexOf(slot);
                const error = 'unknown monster: ' + slot.monsterName + ' in group ' + slot.monsterGroupName;
                cards.push(
                    <div className='column' key={index}>
                        <div className='card error'>
                            <div className='card-content'>
                                <div className='section'>
                                    {error}
                                </div>
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
        if (!this.props.selection) {
            return null;
        }

        const monsters: Monster[] = [];
        if (this.props.selection) {
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
        }

        const libraryCards = monsters.map(monster => {
            return (
                <div className='column' key={monster.id}>
                    <MonsterCard
                        key={monster.id}
                        combatant={monster}
                        encounter={this.props.selection as Encounter}
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

    private showEncounter(enc: Encounter) {
        return Utils.match(this.props.filter, enc.name);
    }

    public render() {
        try {
            let leftColumn = null;
            if (this.props.selection) {
                leftColumn = (
                    <div>
                        <EncounterInfo
                            selection={this.props.selection}
                            parties={this.props.parties}
                            filter={this.props.filter}
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
                        <div className='divider' />
                        <button onClick={() => this.props.selectEncounter(null)}>&larr; back to list</button>
                    </div>
                );
            } else {
                let listItems = this.props.encounters.filter(e => this.showEncounter(e)).map(e => {
                    return (
                        <EncounterListItem
                            key={e.id}
                            encounter={e}
                            selected={e === this.props.selection}
                            setSelection={encounter => this.props.selectEncounter(encounter)}
                        />
                    );
                });
                if (listItems.length === 0) {
                    listItems = [(
                        <Note
                            key='empty'
                            content={'you have not defined any encounters yet'}
                        />
                    )];
                }

                leftColumn = (
                    <div>
                        <button onClick={() => this.props.addEncounter()}>add a new encounter</button>
                        <div className='divider' />
                        {listItems}
                    </div>
                );
            }

            let encounterName;
            const encounterCards: JSX.Element[] = [];
            let waves: JSX.Element[] = [];

            if (this.props.selection) {
                encounterName = this.props.selection.name || 'unnamed encounter';

                this.getMonsterCards(this.props.selection.slots, null)
                    .forEach(card => encounterCards.push(card));

                waves = this.props.selection.waves.map(w => {
                    return (
                        <CardGroup
                            key={w.id}
                            heading={w.name || 'unnamed wave'}
                            content={this.getMonsterCards(w.slots, w.id)}
                            showToggle={true}
                        />
                    );
                });
            }

            let watermark;
            if (!this.props.selection) {
                watermark = (
                    <div className='vertical-center-outer'>
                        <div className='vertical-center-middle'>
                            <div className='vertical-center-inner'>
                                <HelpCard encounters={this.props.encounters} />
                            </div>
                        </div>
                    </div>
                );
            }

            return (
                <div className='encounter-builder row collapse'>
                    <div className='columns small-4 medium-4 large-3 scrollable list-column'>
                        {leftColumn}
                    </div>
                    <div className='columns small-8 medium-8 large-9 scrollable'>
                        <CardGroup
                            content={encounterCards}
                            heading={encounterName}
                            hidden={!this.props.selection}
                        />
                        {waves}
                        {this.getLibrarySection()}
                        {watermark}
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}

interface HelpCardProps {
    encounters: Encounter[];
}

class HelpCard extends React.Component<HelpCardProps> {
    public render() {
        try {
            let action: JSX.Element | null = null;
            if (this.props.encounters.length === 0) {
                action = (
                    <div className='section'>to start building an encounter, press the <b>add a new encounter</b> button</div>
                );
            } else {
                action = (
                    <div>
                        <div className='section'>on the left you will see a list of encounters that you have created</div>
                        <div className='section'>select an encounter from the list to add monsters to it</div>
                    </div>
                );
            }

            return (
                <Note
                    content={
                        <div>
                            <div className='section'>on this page you can set up encounters</div>
                            <div className='section'>
                                when you have created an encounter you can add monsters to it, then gauge its difficulty for a party of pcs
                            </div>
                            <div className='divider'/>
                            {action}
                        </div>
                    }
                />
            );
        } catch (ex) {
            console.error(ex);
        }
    }
}

interface EncounterInfoProps {
    selection: Encounter;
    parties: Party[];
    filter: string;
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
}

class EncounterInfo extends React.Component<EncounterInfoProps, EncounterInfoState> {
    constructor(props: EncounterInfoProps) {
        super(props);
        this.state = {
            randomEncounterXP: 100
        };
    }

    private setRandomEncounterXP(value: number) {
        this.setState({
            randomEncounterXP: Math.max(0, value)
        });
    }

    public render() {
        try {
            const waves = this.props.selection.waves.map(wave => (
                <div key={wave.id} className='list-item non-clickable'>
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
                            value={this.props.selection.name}
                            disabled={!!this.props.filter}
                            onChange={event => this.props.changeValue(this.props.selection, 'name', event.target.value)}
                        />
                    </div>
                    <div className='section'>
                        <div className='subheading'>waves</div>
                        {waves}
                        <button className={this.props.filter ? 'disabled' : ''} onClick={() => this.props.addWave()}>add a new wave</button>
                    </div>
                    <div className='divider' />
                    <DifficultyChartPanel
                        encounter={this.props.selection}
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
                                        nudgeValue={delta => this.setRandomEncounterXP(this.state.randomEncounterXP + (delta * 100))}
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
        }
    }
}
