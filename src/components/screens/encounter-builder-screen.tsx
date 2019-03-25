import React from 'react';

import Utils from '../../utils/utils';

import { Encounter, EncounterSlot, EncounterWave } from '../../models/encounter';
import { Monster, MonsterGroup } from '../../models/monster-group';
import { Party } from '../../models/party';

import EncounterCard from '../cards/encounter-card';
import ErrorCard from '../cards/error-card';
import FilterCard from '../cards/filter-card';
import InfoCard from '../cards/info-card';
import EncounterBuilderCard from '../cards/information/encounter-builder-card';
import MonsterCard from '../cards/monster-card';
import WaveCard from '../cards/wave-card';
import EncounterListItem from '../list-items/encounter-list-item';
import CardGroup from '../panels/card-group';

interface Props {
    encounters: Encounter[];
    selection: Encounter | null;
    parties: Party[];
    library: MonsterGroup[];
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

    private inEncounter(monster: Monster) {
        var result = false;

        if (this.props.selection) {
            const group = Utils.getMonsterGroup(monster, this.props.library);

            this.props.selection.slots.forEach(slot => {
                if ((slot.monsterGroupName === group.name) && (slot.monsterName === monster.name)) {
                    result = true;
                }
            });
        }

        return result;
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
                        <ErrorCard
                            getContent={() => <div className='section'>{error}</div>}
                        />
                    </div>
                );
            }
        });

        if (slots.length === 0) {
            cards.push(
                <div className='column' key='empty'>
                    <InfoCard getContent={() => <div className='section'>no monsters</div>} />
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

    public render() {
        try {
            var help = null;
            if (this.props.showHelp) {
                help = (
                    <EncounterBuilderCard encounters={this.props.encounters} />
                );
            }

            const encounters = [];
            for (var n = 0; n !== this.props.encounters.length; ++n) {
                const e = this.props.encounters[n];
                encounters.push(
                    <EncounterListItem
                        key={e.id}
                        encounter={e}
                        selected={e === this.props.selection}
                        setSelection={encounter => this.props.selectEncounter(encounter)}
                    />
                );
            }

            var encounterName;
            const encounterCards = [];
            var waves: JSX.Element[] = [];

            if (this.props.selection) {
                encounterName = this.props.selection.name || 'unnamed encounter';

                encounterCards.push(
                    <div className='column' key='info'>
                        <EncounterCard
                            selection={this.props.selection}
                            parties={this.props.parties}
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
                        />
                        {waves}
                        {this.getLibrarySection()}
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}
