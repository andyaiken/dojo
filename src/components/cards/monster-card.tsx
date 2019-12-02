import React from 'react';

import Frankenstein from '../../utils/frankenstein';
import Utils from '../../utils/utils';

import { Combatant } from '../../models/combat';
import { Encounter, EncounterSlot, EncounterWave } from '../../models/encounter';
import { Monster, MonsterGroup, Trait } from '../../models/monster-group';

import ConfirmButton from '../controls/confirm-button';
import Dropdown from '../controls/dropdown';
import Expander from '../controls/expander';
import NumberSpin from '../controls/number-spin';
import Textbox from '../controls/textbox';
import AbilityScorePanel from '../panels/ability-score-panel';
import PortraitPanel from '../panels/portrait-panel';
import TraitsPanel from '../panels/traits-panel';
import InfoCard from './info-card';

import arrow from '../../resources/icons/down-arrow.svg';

interface Props {
    monster: Monster | (Monster & Combatant);
    mode: string;
    library: MonsterGroup[];
    changeValue: (monster: any, field: string, value: any) => void;
    nudgeValue: (source: any, field: string, delta: number) => void;
    // Library
    editMonster: (monster: Monster) => void;
    removeMonster: (monster: Monster) => void;
    cloneMonster: (monster: Monster, name: string) => void;
    moveToGroup: (monster: Monster, group: string) => void;
    copyTrait: (trait: Trait) => void;
    selectMonster: (monster: Monster) => void;
    deselectMonster: (monster: Monster) => void;
    // Encounter builder
    encounter: Encounter;
    slot: EncounterSlot;
    addEncounterSlot: (monster: Monster, waveID: string | null) => void;
    removeEncounterSlot: (slot: EncounterSlot) => void;
    swapEncounterSlot: (slot: EncounterSlot, groupName: string, monsterName: string) => void;
    moveToWave: (slot: EncounterSlot, current: EncounterSlot[], waveID: string) => void;
}

interface State {
    showDetails: boolean;
    cloneName: string;
}

export default class MonsterCard extends React.Component<Props, State> {
    public static defaultProps = {
        library: null,
        changeValue: null,
        nudgeValue: null,
        editMonster: null,
        removeMonster: null,
        cloneMonster: null,
        moveToGroup: null,
        copyTrait: null,
        selectMonster: null,
        deselectMonster: null,
        encounter: null,
        slot: null,
        addEncounterSlot: null,
        removeEncounterSlot: null,
        swapEncounterSlot: null,
        moveToWave: null,
        combat: null,
        makeCurrent: null,
        makeActive: null,
        makeDefeated: null,
        endTurn: null,
        mapAdd: null,
        mapMove: null,
        mapRemove: null,
        removeCombatant: null,
        changeHP: null,
        addCondition: null,
        editCondition: null,
        removeCondition: null,
        nudgeConditionValue: null,
        toggleTag: null,
        toggleCondition: null
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            showDetails: false,
            cloneName: props.monster.name + ' copy'
        };
    }

    private setCloneName(cloneName: string) {
        this.setState({
            cloneName: cloneName
        });
    }

    private toggleDetails() {
        this.setState({
            showDetails: !this.state.showDetails
        });
    }

    private description() {
        return Frankenstein.getDescription(this.props.monster);
    }

    private monsterIsInWave(wave: EncounterWave) {
        return wave.slots.some(s => {
            const group = this.props.library.find(g => g.monsters.includes(this.props.monster));
            return !!group && (s.monsterGroupName === group.name) && (s.monsterName === this.props.monster.name);
        });
    }

    private getHP() {
        if (this.props.monster.hitDice === 0) {
            return this.props.monster.hpMax;
        }

        const die = Utils.hitDieType(this.props.monster.size);
        const conMod = Utils.modifierValue(this.props.monster.abilityScores.con) * this.props.monster.hitDice;
        let conModStr = '';
        if (conMod > 0) {
            conModStr = ' +' + conMod;
        }
        if (conMod < 0) {
            conModStr = ' ' + conMod;
        }
        return this.props.monster.hpMax + ' (' + this.props.monster.hitDice + 'd' + die + conModStr + ')';
    }

    public render() {
        try {
            const options = [];
            if (this.props.mode.indexOf('no-buttons') === -1) {
                if (this.props.mode.indexOf('view') !== -1) {
                    if (this.props.mode.indexOf('editable') !== -1) {
                        options.push(
                            <button key='edit' onClick={() => this.props.editMonster(this.props.monster)}>edit monster</button>
                        );

                        options.push(
                            <Expander key='clone' text='clone monster'>
                                <Textbox
                                    text={this.state.cloneName}
                                    placeholder='monster name'
                                    onChange={value => this.setCloneName(value)}
                                />
                                <button onClick={() => this.props.cloneMonster(this.props.monster, this.state.cloneName)}>create copy</button>
                            </Expander>
                        );

                        const groupOptions: { id: string, text: string }[] = [];
                        this.props.library.forEach(group => {
                            if (group.monsters.indexOf(this.props.monster) === -1) {
                                groupOptions.push({
                                    id: group.id,
                                    text: group.name
                                });
                            }
                        });
                        options.push(
                            <Dropdown
                                key='move'
                                options={groupOptions}
                                placeholder='move to group...'
                                select={optionID => this.props.moveToGroup(this.props.monster, optionID)}
                            />
                        );

                        options.push(<ConfirmButton key='remove' text='delete monster' callback={() => this.props.removeMonster(this.props.monster)} />);
                    }
                    if (this.props.mode.indexOf('encounter') !== -1) {
                        if (this.props.slot) {
                            // This card is in an encounter (or a wave)
                            const candidates: {id: string, text: string, group: string}[] = [];
                            this.props.library.forEach(group => {
                                group.monsters
                                    .filter(m => m.challenge === this.props.monster.challenge)
                                    .filter(m => m.id !== this.props.monster.id)
                                    .forEach(m => candidates.push({ id: m.id, text: m.name, group: group.name }));
                            });
                            Utils.sort(candidates, [{ field: 'text', dir: 'asc' }]);
                            if (candidates.length > 0) {
                                options.push(
                                    <Dropdown
                                        key='replace'
                                        placeholder='replace with...'
                                        options={candidates}
                                        select={id => {
                                            const candidate = candidates.find(c => c.id === id);
                                            if (candidate) {
                                                this.props.swapEncounterSlot(this.props.slot, candidate.group, candidate.text);
                                            }
                                        }}
                                    />
                                );
                            }
                            if (this.props.encounter.waves.length > 0) {
                                let current = this.props.encounter.slots;
                                const waves = [];
                                if (!this.props.encounter.slots.includes(this.props.slot)) {
                                    waves.push({ id: '', text: 'main encounter' });
                                }
                                this.props.encounter.waves.forEach(wave => {
                                    if (wave.slots.includes(this.props.slot)) {
                                        current = wave.slots;
                                    } else {
                                        waves.push({ id: wave.id, text: wave.name });
                                    }
                                });
                                options.push(
                                    <Dropdown
                                        key='move'
                                        placeholder='move to...'
                                        options={waves}
                                        select={id => this.props.moveToWave(this.props.slot, current, id)}
                                    />
                                );
                            }
                            options.push(
                                <button key='remove' onClick={() => this.props.removeEncounterSlot(this.props.slot)}>
                                    remove from encounter
                                </button>
                            );
                        } else {
                            let canAdd = false;
                            // This card is in the library list
                            if (!this.monsterIsInWave(this.props.encounter)) {
                                options.push(
                                    <button key='add encounter' onClick={() => this.props.addEncounterSlot(this.props.monster, null)}>
                                        add to encounter
                                    </button>
                                );
                                canAdd = true;
                            }
                            this.props.encounter.waves.forEach(wave => {
                                if (!this.monsterIsInWave(wave)) {
                                    options.push(
                                        <button key={'add ' + wave.id} onClick={() => this.props.addEncounterSlot(this.props.monster, wave.id)}>
                                            add to {wave.name}
                                        </button>
                                    );
                                    canAdd = true;
                                }
                            });
                            // If we can't add it anywhere, don't show it
                            if (!canAdd) {
                                return (
                                    <InfoCard
                                        heading={(
                                            <div className='heading'>
                                                <div className='title'>{this.props.monster.name}</div>
                                            </div>
                                        )}
                                    >
                                        <div className='section'>
                                            <i>this monster is already part of this encounter</i>
                                        </div>
                                    </InfoCard>
                                );
                            }
                        }
                    }
                    if (this.props.mode.indexOf('candidate') !== -1) {
                        if (this.props.mode.indexOf('selected') === -1) {
                            options.push(
                                <button key='select' onClick={() => this.props.selectMonster(this.props.monster)}>select monster</button>
                            );
                        } else {
                            options.push(
                                <button key='deselect' onClick={() => this.props.deselectMonster(this.props.monster)}>deselect monster</button>
                            );
                        }
                    }
                }
                if (this.props.mode.indexOf('template') !== -1) {
                    // None
                }
            }

            let stats = null;
            if (this.props.mode.indexOf('view') !== -1) {
                let slotSection = null;
                if (this.props.slot) {
                    slotSection = (
                        <div>
                            <div className='divider' />
                            <NumberSpin
                                source={this.props.slot}
                                name='count'
                                label='count'
                                nudgeValue={delta => this.props.nudgeValue(this.props.slot, 'count', delta)}
                            />
                        </div>
                    );
                }

                let details = null;
                if (this.state.showDetails || (this.props.mode.indexOf('full') !== -1)) {
                    details = (
                        <div>
                            <div className='divider' />
                            <div className='section'>
                                <AbilityScorePanel combatant={this.props.monster} />
                            </div>
                            <div className='section'>
                                <b>ac</b> {this.props.monster.ac}
                            </div>
                            <div className='section' style={{ display: this.props.monster.hpMax !== 0 ? '' : 'none' }}>
                                <b>hp</b> {this.getHP()}
                            </div>
                            <div className='section' style={{ display: this.props.monster.speed !== '' ? '' : 'none' }}>
                                <b>speed</b> {this.props.monster.speed}
                            </div>
                            <div className='section' style={{ display: this.props.monster.savingThrows !== '' ? '' : 'none' }}>
                                <b>saving throws</b> {this.props.monster.savingThrows}
                            </div>
                            <div className='section' style={{ display: this.props.monster.skills !== '' ? '' : 'none' }}>
                                <b>skills</b> {this.props.monster.skills}
                            </div>
                            <div className='section' style={{ display: this.props.monster.damage.resist !== '' ? '' : 'none' }}>
                                <b>damage resistances</b> {this.props.monster.damage.resist}
                            </div>
                            <div className='section' style={{ display: this.props.monster.damage.vulnerable !== '' ? '' : 'none' }}>
                                <b>damage vulnerabilities</b> {this.props.monster.damage.vulnerable}
                            </div>
                            <div className='section' style={{ display: this.props.monster.damage.immune !== '' ? '' : 'none' }}>
                                <b>damage immunities</b> {this.props.monster.damage.immune}
                            </div>
                            <div className='section' style={{ display: this.props.monster.conditionImmunities !== '' ? '' : 'none' }}>
                                <b>condition immunities</b> {this.props.monster.conditionImmunities}
                            </div>
                            <div className='section' style={{ display: this.props.monster.senses !== '' ? '' : 'none' }}>
                                <b>senses</b> {this.props.monster.senses}
                            </div>
                            <div className='section' style={{ display: this.props.monster.languages !== '' ? '' : 'none' }}>
                                <b>languages</b> {this.props.monster.languages}
                            </div>
                            <div className='section' style={{ display: this.props.monster.equipment !== '' ? '' : 'none' }}>
                                <b>equipment</b> {this.props.monster.equipment}
                            </div>
                            <div className='divider' />
                            <TraitsPanel combatant={this.props.monster} />
                        </div>
                    );
                }

                stats = (
                    <div className='stats'>
                        <PortraitPanel source={this.props.monster} />
                        <div className='section centered'>
                            <i>{this.description()}</i>
                        </div>
                        {slotSection}
                        {details}
                    </div>
                );
            }
            if (this.props.mode.indexOf('combat') !== -1) {
                stats = (
                    <div className='stats'>
                        <PortraitPanel source={this.props.monster} />
                        <div className='section centered'>
                            <i>{this.description()}</i>
                        </div>
                        <div className='divider' />
                        <div className='section'>
                            <AbilityScorePanel combatant={this.props.monster} />
                        </div>
                        <div className='section' style={{ display: this.props.monster.ac !== 0 ? '' : 'none' }}>
                            <b>ac</b> {this.props.monster.ac}
                        </div>
                        <div className='section' style={{ display: this.props.monster.savingThrows !== '' ? '' : 'none' }}>
                            <b>saving throws</b> {this.props.monster.savingThrows}
                        </div>
                        <div className='section' style={{ display: this.props.monster.skills !== '' ? '' : 'none' }}>
                            <b>skills</b> {this.props.monster.skills}
                        </div>
                        <div className='section' style={{ display: this.props.monster.speed !== '' ? '' : 'none' }}>
                            <b>speed</b> {this.props.monster.speed}
                        </div>
                        <div className='section' style={{ display: this.props.monster.senses !== '' ? '' : 'none' }}>
                            <b>senses</b> {this.props.monster.senses}
                        </div>
                        <div className='section' style={{ display: this.props.monster.damage.resist !== '' ? '' : 'none' }}>
                            <b>damage resistances</b> {this.props.monster.damage.resist}
                        </div>
                        <div className='section' style={{ display: this.props.monster.damage.vulnerable !== '' ? '' : 'none' }}>
                            <b>damage vulnerabilities</b> {this.props.monster.damage.vulnerable}
                        </div>
                        <div className='section' style={{ display: this.props.monster.damage.immune !== '' ? '' : 'none' }}>
                            <b>damage immunities</b> {this.props.monster.damage.immune}
                        </div>
                        <div className='section' style={{ display: this.props.monster.conditionImmunities !== '' ? '' : 'none' }}>
                            <b>condition immunities</b> {this.props.monster.conditionImmunities}
                        </div>
                        <div className='section' style={{ display: this.props.monster.languages !== '' ? '' : 'none' }}>
                            <b>languages</b> {this.props.monster.languages}
                        </div>
                        <div className='section' style={{ display: this.props.monster.equipment !== '' ? '' : 'none' }}>
                            <b>equipment</b> {this.props.monster.equipment}
                        </div>
                        <div className='divider' />
                        <TraitsPanel
                            combatant={this.props.monster}
                            mode='combat'
                            changeValue={(trait, field, value) => this.props.changeValue(trait, field, value)}
                        />
                    </div>
                );
            }
            if (this.props.mode.indexOf('template') !== -1) {
                if (this.props.mode.indexOf('overview') !== -1) {
                    stats = (
                        <div>
                        <PortraitPanel source={this.props.monster} />
                            <div className='section centered'>
                                <i>{this.description()}</i>
                            </div>
                            <div className='divider' />
                            <div className='section'>
                                <b>speed</b> {this.props.monster.speed || '-'}
                            </div>
                            <div className='section'>
                                <b>senses</b> {this.props.monster.senses || '-'}
                            </div>
                            <div className='section'>
                                <b>languages</b> {this.props.monster.languages || '-'}
                            </div>
                            <div className='section'>
                                <b>equipment</b> {this.props.monster.equipment || '-'}
                            </div>
                        </div>
                    );
                }
                if (this.props.mode.indexOf('abilities') !== -1) {
                    stats = (
                        <div>
                            <div className='section'>
                                <AbilityScorePanel combatant={this.props.monster} />
                            </div>
                            <div className='section'>
                                <b>saving throws</b> {this.props.monster.savingThrows || '-'}
                            </div>
                            <div className='section'>
                                <b>skills</b> {this.props.monster.skills || '-'}
                            </div>
                        </div>
                    );
                }
                if (this.props.mode.indexOf('cbt-stats') !== -1) {
                    stats = (
                        <div>
                            <div className='section'>
                                <b>ac</b> {this.props.monster.ac}
                            </div>
                            <div className='section'>
                                <b>hp</b> {this.getHP()}
                            </div>
                            <div className='section'>
                                <b>damage immunity</b> {this.props.monster.damage.immune || '-'}
                            </div>
                            <div className='section'>
                                <b>damage resistance</b> {this.props.monster.damage.resist || '-'}
                            </div>
                            <div className='section'>
                                <b>damage vulnerability</b> {this.props.monster.damage.vulnerable || '-'}
                            </div>
                            <div className='section'>
                                <b>condition immunities</b> {this.props.monster.conditionImmunities || '-'}
                            </div>
                        </div>
                    );
                }
                if (this.props.mode.indexOf('actions') !== -1) {
                    stats = (
                        <TraitsPanel
                            combatant={this.props.monster}
                            mode='template'
                            copyTrait={trait => this.props.copyTrait(trait)}
                        />
                    );
                }
            }

            let toggle = null;
            if (this.props.mode.indexOf('combat') !== -1) {
                // Don't show toggle button for combatant
            } else if (this.props.mode.indexOf('template') !== -1) {
                // Don't show toggle button for template
            } else if (this.props.mode.indexOf('view full') !== -1) {
                // Don't show toggle button if we're in 'full' mode
            } else {
                const imageStyle = this.state.showDetails ? 'image rotate' : 'image';
                toggle = (
                    <img className={imageStyle} src={arrow} alt='arrow' onClick={() => this.toggleDetails()} />
                );
            }

            const name = (this.props.monster as Combatant ? (this.props.monster as Combatant).displayName : null)
                || this.props.monster.name
                || 'unnamed monster';

            return (
                <div className='card monster'>
                    <div className='heading'>
                        <div className='title'>
                            {name}
                        </div>
                        {toggle}
                    </div>
                    <div className='card-content'>
                        {stats}
                        <div style={{ display: options.length > 0 ? '' : 'none' }}>
                            <div className='divider' />
                            <div className='section'>{options}</div>
                        </div>
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
