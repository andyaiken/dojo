import React from 'react';

import Utils from '../../utils/utils';

import { Encounter, EncounterSlot, EncounterWave } from '../../models/encounter';
import { Monster, MonsterGroup } from '../../models/monster-group';
import { Party } from '../../models/party';

import FilterCard from '../cards/filter-card';
import MonsterCard from '../cards/monster-card';
import WaveCard from '../cards/wave-card';
import ConfirmButton from '../controls/confirm-button';
import EncounterListItem from '../list-items/encounter-list-item';
import CardGroup from '../panels/card-group';
import DifficultyChartPanel from '../panels/difficulty-chart-panel';
import Note from '../panels/note';

interface Props {
    encounters: Encounter[];
    selection: Encounter | null;
    parties: Party[];
    library: MonsterGroup[];
    filter: string;
    selectEncounter: (encounter: Encounter | null) => void;
    addEncounter: () => void;
    removeEncounter: () => void;
    addEncounterSlot: (monster: Monster, waveID: string | null) => void;
    removeEncounterSlot: (encounterSlot: EncounterSlot, waveID: string | null) => void;
    addWave: () => void;
    removeWave: (wave: EncounterWave) => void;
    changeValue: (source: any, field: string, value: any) => void;
    nudgeValue: (source: any, field: string, value: number) => void;
    getMonster: (monsterName: string, groupName: string) => Monster | null;
}

interface State {
    filter: {
        name: string,
        challengeMin: number;
        challengeMax: number;
        category: string;
        size: string;
    };
}

export default class EncounterBuilderScreen extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            filter: {
                name: '',
                challengeMin: 0,
                challengeMax: 5,
                category: 'all types',
                size: 'all sizes'
            }
        };
    }

    private matchMonster(monster: Monster) {
        if (monster.challenge < this.state.filter.challengeMin) {
            return false;
        }

        if (monster.challenge > this.state.filter.challengeMax) {
            return false;
        }

        if (this.state.filter.name !== '') {
            if (!Utils.match(this.state.filter.name, monster.name)) {
                return false;
            }
        }

        if (this.state.filter.category !== 'all types') {
            if (monster.category !== this.state.filter.category) {
                return false;
            }
        }

        if (this.state.filter.size !== 'all sizes') {
            if (monster.size !== this.state.filter.size) {
                return false;
            }
        }

        return true;
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
            filter: {
                name: '',
                challengeMin: 0,
                challengeMax: 5,
                category: 'all types',
                size: 'all sizes'
            }
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
            cards.push(
                <div className='column' key='empty'>
                    <Note content={<div className='section'>there are no monsters in this {waveID ? 'wave' : 'encounter'}</div>} />
                </div>
            );
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
                            changeValue={(type, value) => this.props.changeValue(this.props.selection, type, value)}
                            addWave={() => this.props.addWave()}
                            removeEncounter={() => this.props.removeEncounter()}
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
                    const waveCards = [];
                    waveCards.push(
                        <div className='column' key='info'>
                            <WaveCard
                                wave={w}
                                removeWave={wave => this.props.removeWave(wave)}
                                changeValue={(source, field, value) => this.props.changeValue(source, field, value)}
                            />
                        </div>
                    );

                    this.getMonsterCards(w.slots, w.id)
                        .forEach(card => waveCards.push(card));

                    return (
                        <CardGroup
                            key={w.id}
                            heading={w.name || 'unnamed wave'}
                            content={waveCards}
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
    monsterFilter: {
        name: string,
        challengeMin: number;
        challengeMax: number;
        category: string;
        size: string;
    };
    changeValue: (field: string, value: string) => void;
    addWave: () => void;
    removeEncounter: () => void;
    getMonster: (monsterName: string, groupName: string) => Monster | null;
    changeFilterValue: (type: 'name' | 'challengeMin' | 'challengeMax' | 'category' | 'size', value: any) => void;
    nudgeFilterValue: (type: 'challengeMin' | 'challengeMax', delta: number) => void;
    resetFilter: () => void;
}

class EncounterInfo extends React.Component<EncounterInfoProps> {
    public render() {
        try {
            return (
                <div>
                    <div className='section'>
                        <div className='subheading'>encounter name</div>
                        <input
                            type='text'
                            placeholder='encounter name'
                            value={this.props.selection.name}
                            disabled={!!this.props.filter}
                            onChange={event => this.props.changeValue('name', event.target.value)}
                        />
                    </div>
                    <div className='divider' />
                    <DifficultyChartPanel
                        encounter={this.props.selection}
                        parties={this.props.parties}
                        getMonster={(monsterName, monsterGroupName) => this.props.getMonster(monsterName, monsterGroupName)}
                    />
                    <div className='divider' />
                    <div className='section'>
                        <FilterCard
                            filter={this.props.monsterFilter}
                            changeValue={(type, value) => this.props.changeFilterValue(type, value)}
                            nudgeValue={(type, delta) => this.props.nudgeFilterValue(type, delta)}
                            resetFilter={() => this.props.resetFilter()}
                        />
                        <button className={this.props.filter ? 'disabled' : ''} onClick={() => this.props.addWave()}>add a new wave</button>
                        <ConfirmButton text='delete encounter' callback={() => this.props.removeEncounter()} />
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}
