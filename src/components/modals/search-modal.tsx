import React from 'react';

import { Input } from 'antd';

import Sherlock from '../../utils/sherlock';

import { Encounter } from '../../models/encounter';
import { MapFolio } from '../../models/map-folio';
import { MonsterGroup } from '../../models/monster-group';
import { Party } from '../../models/party';

import Note from '../panels/note';

interface Props {
    parties: Party[];
    library: MonsterGroup[];
    encounters: Encounter[];
    folios: MapFolio[];
    openParty: (id: string) => void;
    openGroup: (id: string) => void;
    openEncounter: (id: string) => void;
    openFolio: (id: string) => void;
}

interface State {
    text: string;
}

export default class SearchModal extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            text: ''
        };
    }

    private setSearchTerm(text: string) {
        this.setState({
            text: text
        });
    }

    public render() {
        try {
            const results = [];
            if (this.state.text.length > 2) {
                this.props.parties.filter(party => Sherlock.matchParty(this.state.text, party)).forEach(party => {
                    const pcs: JSX.Element[] = [];
                    party.pcs.filter(pc => Sherlock.matchPC(this.state.text, pc)).forEach(pc => {
                        const companions: JSX.Element[] = [];
                        pc.companions.filter(comp => Sherlock.matchCompanion(this.state.text, comp)).forEach(comp => {
                            companions.push(
                                <div key={comp.id} className='group-panel'>
                                    <div className='section'>{comp.name}</div>
                                </div>
                            );
                        });
                        pcs.push(
                            <div key={pc.id} className='group-panel'>
                                <div className='section'>{pc.name}</div>
                                {companions}
                            </div>
                        );
                    });
                    results.push(
                        <div key={party.id} className='group-panel clickable' onClick={() => this.props.openParty(party.id)}>
                            <div className='section'>{party.name}</div>
                            {pcs}
                        </div>
                    );
                });

                this.props.library.filter(group => Sherlock.matchGroup(this.state.text, group)).forEach(group => {
                    const monsters: JSX.Element[] = [];
                    group.monsters.filter(monster => Sherlock.matchMonster(this.state.text, monster)).forEach(monster => {
                        const traits: JSX.Element[] = [];
                        monster.traits.filter(trait => Sherlock.matchTrait(this.state.text, trait)).forEach(trait => {
                            traits.push(
                                <div key={trait.id} className='group-panel'>
                                    <div className='section'>{trait.name}</div>
                                </div>
                            );
                        });
                        monsters.push(
                            <div key={monster.id} className='group-panel'>
                                <div className='section'>{monster.name}</div>
                                {traits}
                            </div>
                        );
                    });
                    results.push(
                        <div key={group.id} className='group-panel clickable' onClick={() => this.props.openGroup(group.id)}>
                            <div className='section'>{group.name}</div>
                            {monsters}
                        </div>
                    );
                });

                this.props.encounters.filter(encounter => Sherlock.matchEncounter(this.state.text, encounter)).forEach(encounter => {
                    const slots: JSX.Element[] = [];
                    encounter.slots.filter(slot => Sherlock.matchEncounterSlot(this.state.text, slot)).forEach(slot => {
                        slots.push(
                            <div key={slot.id} className='group-panel'>
                                <div className='section'>{slot.monsterName}</div>
                            </div>
                        );
                    });
                    const waves: JSX.Element[] = [];
                    encounter.waves.filter(wave => Sherlock.matchEncounterWave(this.state.text, wave)).forEach(wave => {
                        const waveSlots: JSX.Element[] = [];
                        wave.slots.filter(slot => Sherlock.matchEncounterSlot(this.state.text, slot)).forEach(slot => {
                            waveSlots.push(
                                <div key={slot.id} className='group-panel'>
                                    <div className='section'>{slot.monsterName}</div>
                                </div>
                            );
                        });
                        waves.push(
                            <div key={wave.id} className='group-panel'>
                                <div className='section'>{wave.name}</div>
                                {waveSlots}
                            </div>
                        );
                    });
                    results.push(
                        <div key={encounter.id} className='group-panel clickable' onClick={() => this.props.openEncounter(encounter.id)}>
                            <div className='section'>{encounter.name}</div>
                            {slots}
                            {waves}
                        </div>
                    );
                });

                this.props.folios.filter(folio => Sherlock.matchFolio(this.state.text, folio)).forEach(folio => {
                    const maps: JSX.Element[] = [];
                    folio.maps.filter(map => Sherlock.matchMap(this.state.text, map)).forEach(map => {
                        maps.push(
                            <div key={map.id} className='group-panel'>
                                <div className='section'>{map.name}</div>
                            </div>
                        );
                    });
                    results.push(
                        <div key={folio.id} className='group-panel clickable' onClick={() => this.props.openFolio(folio.id)}>
                            <div className='section'>{folio.name}</div>
                            {maps}
                        </div>
                    );
                });

                if (results.length === 0) {
                    results.push(
                        <Note key='empty'>
                            no results
                        </Note>
                    );
                }
            } else {
                results.push(
                    <Note key='empty'>
                        search
                    </Note>
                );
            }

            return (
                <div className='scrollable'>
                    <div className='heading'>search</div>
                    <Input.Search
                        placeholder='search'
                        onChange={e => this.setSearchTerm(e.target.value)}
                        onSearch={value => this.setSearchTerm(value)}
                    />
                    <div className='divider' />
                    {results}
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}
