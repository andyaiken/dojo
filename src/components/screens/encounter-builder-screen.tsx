import React from 'react';

import Utils from '../../utils/utils';

import { Encounter, EncounterSlot, EncounterWave } from '../../models/encounter';
import { Monster, MonsterGroup } from '../../models/monster-group';
import { Party } from '../../models/party';

import EncounterCard from '../cards/encounter-card';
import FilterCard from '../cards/filter-card';
import MonsterCard from '../cards/monster-card';
import WaveCard from '../cards/wave-card';
import EncounterListItem from '../list-items/encounter-list-item';
import CardGroup from '../panels/card-group';
import Note from '../panels/note';

interface Props {
    encounters: Encounter[];
    selection: Encounter | null;
    parties: Party[];
    library: MonsterGroup[];
    filter: string;
    showHelp: boolean;
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
        this.state.filter[type] = value;
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

        const libraryCards = [];
        libraryCards.push(
            <div className='column' key='filter'>
                <FilterCard
                    filter={this.state.filter}
                    changeValue={(type, value) => this.changeFilterValue(type, value)}
                    nudgeValue={(type, delta) => this.nudgeFilterValue(type, delta)}
                    resetFilter={() => this.resetFilter()}
                />
            </div>
        );

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
        monsters.forEach(monster => {
            libraryCards.push(
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
            let help = null;
            if (this.props.showHelp) {
                help = (
                    <HelpCard encounters={this.props.encounters} />
                );
            }

            const encounters = this.props.encounters.filter(e => this.showEncounter(e)).map(e => {
                return (
                    <EncounterListItem
                        key={e.id}
                        encounter={e}
                        selected={e === this.props.selection}
                        setSelection={encounter => this.props.selectEncounter(encounter)}
                    />
                );
            });

            let encounterName;
            const encounterCards = [];
            let waves: JSX.Element[] = [];

            if (this.props.selection) {
                encounterName = this.props.selection.name || 'unnamed encounter';

                encounterCards.push(
                    <div className='column' key='info'>
                        <EncounterCard
                            selection={this.props.selection}
                            parties={this.props.parties}
                            filter={this.props.filter}
                            changeValue={(type, value) => this.props.changeValue(this.props.selection, type, value)}
                            addWave={() => this.props.addWave()}
                            removeEncounter={() => this.props.removeEncounter()}
                            getMonster={(monsterName, monsterGroupName) => this.props.getMonster(monsterName, monsterGroupName)}
                        />
                    </div>
                );

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
                            <div className='watermark'>encounter builder</div>
                        </div>
                    </div>
                );
            }

            return (
                <div className='encounter-builder row collapse'>
                    <div className='columns small-4 medium-4 large-3 scrollable list-column'>
                        {help}
                        <button onClick={() => this.props.addEncounter()}>add a new encounter</button>
                        {encounters}
                    </div>
                    <div className='columns small-8 medium-8 large-9 scrollable'>
                        <CardGroup
                            content={encounterCards}
                            heading={encounterName}
                            showClose={this.props.selection !== null}
                            close={() => this.props.selectEncounter(null)}
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
                    <div className='section'>to start building an encounter, press the button below</div>
                );
            } else {
                action = (
                    <div className='section'>select an encounter from the list to add monsters to it</div>
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
