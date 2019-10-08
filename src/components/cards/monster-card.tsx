import React from 'react';

import Utils from '../../utils/utils';

import { Combat, COMBAT_TAGS, Combatant } from '../../models/combat';
import { Condition } from '../../models/condition';
import { Encounter, EncounterSlot, EncounterWave } from '../../models/encounter';
import { Monster, MonsterGroup, Trait } from '../../models/monster-group';

import Checkbox from '../controls/checkbox';
import ConfirmButton from '../controls/confirm-button';
import ControlRow from '../controls/control-row';
import Dropdown from '../controls/dropdown';
import Expander from '../controls/expander';
import Radial from '../controls/radial';
import Selector from '../controls/selector';
import Spin from '../controls/spin';
import AbilityScorePanel from '../panels/ability-score-panel';
import ConditionsPanel from '../panels/conditions-panel';
import TraitsPanel from '../panels/traits-panel';
import InfoCard from './info-card';

import arrow from '../../resources/icons/down-arrow.svg';

interface Props {
    combatant: Monster | (Monster & Combatant);
    mode: string;
    library: MonsterGroup[];
    changeValue: (monster: any, field: string, value: any) => void;
    nudgeValue: (source: any, field: string, delta: number) => void;
    // Library
    filter: string;
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
    // Combat
    combat: Combat;
    makeCurrent: (combatant: Combatant) => void;
    makeActive: (combatant: Combatant) => void;
    makeDefeated: (combatant: Combatant) => void;
    endTurn: (combatant: Combatant) => void;
    mapAdd: (combatant: Combatant) => void;
    mapMove: (combatant: Combatant, dir: string) => void;
    mapRemove: (combatant: Combatant) => void;
    removeCombatant: (combatant: Combatant) => void;
    changeHP: (combatant: Combatant, hp: number, tempHP: number) => void;
    addCondition: (combatant: Combatant) => void;
    editCondition: (combatant: Combatant, condition: Condition) => void;
    removeCondition: (combatant: Combatant, conditionID: string) => void;
    nudgeConditionValue: (condition: Condition, field: string, delta: number) => void;
    toggleTag: (combatant: Combatant, tag: string) => void;
}

interface State {
    showDetails: boolean;
    cloneName: string;
    combatMode: string;
    damageOrHealing: number;
}

export default class MonsterCard extends React.Component<Props, State> {
    public static defaultProps = {
        library: null,
        changeValue: null,
        nudgeValue: null,
        filter: '',
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
        toggleTag: null
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            showDetails: false,
            cloneName: props.combatant.name + ' copy',
            combatMode: 'main',
            damageOrHealing: 0
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

    private setDamage(value: number) {
        this.setState({
            damageOrHealing: value
        });
    }

    private nudgeDamage(delta: number) {
        this.setState({
            damageOrHealing: Math.max(this.state.damageOrHealing + delta, 0)
        });
    }

    private setCombatMode(mode: string) {
        this.setState({
            combatMode: mode
        });
    }

    private heal() {
        const combatant = this.props.combatant as Combatant;

        let hp = (combatant.hp ? combatant.hp : 0) + this.state.damageOrHealing;
        hp = Math.min(hp, this.props.combatant.hpMax);

        this.setState({
            damageOrHealing: 0
        }, () => {
            this.props.changeHP(combatant, hp, this.props.combatant.hpTemp);
        });
    }

    private damage() {
        const combatant = this.props.combatant as Combatant;

        let hp = (combatant.hp ? combatant.hp : 0);
        let temp = this.props.combatant.hpTemp;

        let damage = this.state.damageOrHealing;

        // Take damage off temp HP first
        const val = Math.min(damage, temp);
        damage -= val;
        temp -= val;

        // Take the rest off HP
        hp -= damage;
        hp = Math.max(hp, 0);

        this.setState({
            damageOrHealing: 0
        }, () => {
            this.props.changeHP(combatant, hp, temp);
        });
    }

    private description() {
        let size = this.props.combatant.size;
        const combatant = this.props.combatant as (Monster & Combatant);
        if (combatant) {
            size = combatant.displaySize || size;
        }
        let sizeAndType = (size + ' ' + this.props.combatant.category).toLowerCase();
        if (this.props.combatant.tag) {
            sizeAndType += ' (' + this.props.combatant.tag.toLowerCase() + ')';
        }
        sizeAndType += ', ';

        let align = '';
        if (this.props.combatant.alignment) {
            align = this.props.combatant.alignment.toLowerCase() + ', ';
        }

        const cr = 'cr ' + Utils.challenge(this.props.combatant.challenge);

        return sizeAndType + align + cr;
    }

    private monsterIsInWave(wave: EncounterWave) {
        return wave.slots.some(s => {
            const group = this.props.library.find(g => g.monsters.includes(this.props.combatant));
            return !!group && (s.monsterGroupName === group.name) && (s.monsterName === this.props.combatant.name);
        });
    }

    private getHP() {
        if (this.props.combatant.hitDice === 0) {
            return this.props.combatant.hpMax;
        }

        const die = Utils.hitDieType(this.props.combatant.size);
        const conMod = Utils.modifierValue(this.props.combatant.abilityScores.con) * this.props.combatant.hitDice;
        let conModStr = '';
        if (conMod > 0) {
            conModStr = ' +' + conMod;
        }
        if (conMod < 0) {
            conModStr = ' ' + conMod;
        }
        return this.props.combatant.hpMax + ' (' + this.props.combatant.hitDice + 'd' + die + conModStr + ')';
    }

    private getCombatControls() {
        const combatant = this.props.combatant as Combatant;

        const options = [];

        const combatModes = ['main', 'hp', 'cond', 'map', 'adv'].map(m => {
            return {
                id: m,
                text: m
            };
        });
        if (this.props.mode.indexOf('tactical') === -1) {
            // No combat map, so remove the map option
            combatModes.splice(3, 1);
        }
        options.push(
            <Selector
                key='selector'
                options={combatModes}
                selectedID={this.state.combatMode}
                select={option => this.setCombatMode(option)}
            />
        );
        options.push(<div key='selector-sep' className='divider' />);

        switch (this.state.combatMode) {
            case 'main':
                if (!combatant.pending && combatant.active && !combatant.defeated) {
                    if (combatant.current) {
                        options.push(<button key='endTurn' onClick={() => this.props.endTurn(combatant)}>end turn</button>);
                        options.push(<button key='makeDefeated' onClick={() => this.props.makeDefeated(combatant)}>mark as defeated and end turn</button>);
                    } else {
                        options.push(<button key='makeCurrent' onClick={() => this.props.makeCurrent(combatant)}>start turn</button>);
                        options.push(<button key='makeDefeated' onClick={() => this.props.makeDefeated(combatant)}>mark as defeated</button>);
                    }
                }
                if (!combatant.pending && !combatant.active && combatant.defeated) {
                    options.push(<button key='makeActive' onClick={() => this.props.makeActive(combatant)}>mark as active</button>);
                }
                options.push(<div key='tag-sep' className='divider' />);
                if (this.props.mode.indexOf('tactical') !== -1) {
                    options.push(
                        <Checkbox
                            key='hidden'
                            label='hidden'
                            display='switch'
                            checked={!combatant.showOnMap}
                            changeValue={value => this.props.changeValue(combatant, 'showOnMap', !value)}
                        />
                    );
                }
                options.push(
                    <ControlRow
                        key='tags'
                        controls={COMBAT_TAGS.map(tag =>
                            <Checkbox
                                key={tag}
                                label={tag}
                                display='button'
                                checked={combatant.tags.includes(tag)}
                                changeValue={value => this.props.toggleTag(combatant, tag)}
                            />
                        )}
                    />
                );
                break;
            case 'hp':
                options.push(
                    <div key='hp'>
                        <Spin
                            source={this.props.combatant}
                            name='hp'
                            label='hit points'
                            factors={[1, 10]}
                            nudgeValue={delta => this.props.nudgeValue(this.props.combatant, 'hp', delta)}
                        />
                        <Spin
                            source={this.props.combatant}
                            name='hpTemp'
                            label='temp hp'
                            factors={[1, 10]}
                            nudgeValue={delta => this.props.nudgeValue(this.props.combatant, 'hpTemp', delta)}
                        />
                        <div className='divider' />
                        <div className='section' style={{ display: this.props.combatant.damage.resist !== '' ? '' : 'none' }}>
                            <b>damage resistances</b> {this.props.combatant.damage.resist}
                        </div>
                        <div className='section' style={{ display: this.props.combatant.damage.vulnerable !== '' ? '' : 'none' }}>
                            <b>damage vulnerabilities</b> {this.props.combatant.damage.vulnerable}
                        </div>
                        <div className='section' style={{ display: this.props.combatant.damage.immune !== '' ? '' : 'none' }}>
                            <b>damage immunities</b> {this.props.combatant.damage.immune}
                        </div>
                        <Spin
                            source={this.state}
                            name='damageOrHealing'
                            factors={[1, 10]}
                            nudgeValue={delta => this.nudgeDamage(delta)}
                        />
                        <ControlRow
                            controls={[
                                <button key='heal' onClick={() => this.heal()}>heal</button>,
                                <button key='reset' onClick={() => this.setDamage(0)}>reset</button>,
                                <button key='damage' onClick={() => this.damage()}>damage</button>
                            ]}
                            disabled={this.state.damageOrHealing === 0}
                        />
                    </div>
                );
                break;
            case 'cond':
                options.push(
                    <div key='conditions'>
                        <div className='section' style={{ display: this.props.combatant.conditionImmunities !== '' ? '' : 'none' }}>
                            <b>condition immunities</b> {this.props.combatant.conditionImmunities}
                        </div>
                        <ConditionsPanel
                            combatant={this.props.combatant as Combatant}
                            combat={this.props.combat}
                            addCondition={() => this.props.addCondition(this.props.combatant as Combatant)}
                            editCondition={condition => this.props.editCondition(this.props.combatant as Combatant, condition)}
                            removeCondition={conditionID => this.props.removeCondition(this.props.combatant as Combatant, conditionID)}
                            nudgeConditionValue={(condition, type, delta) => this.props.nudgeConditionValue(condition, type, delta)}
                        />
                    </div>
                );
                break;
            case 'map':
                if (this.props.mode.indexOf('on-map') !== -1) {
                    options.push(
                        <div key='mapMove' className='section centered'>
                            <Radial
                                direction='eight'
                                click={dir => this.props.mapMove(combatant, dir)}
                            />
                        </div>
                    );
                    options.push(<div key='move-sep' className='divider' />);
                    options.push(
                        <Spin
                            key='altitude'
                            source={combatant}
                            name='altitude'
                            label='altitude'
                            display={value => value + ' ft.'}
                            nudgeValue={delta => this.props.nudgeValue(combatant, 'altitude', delta * 5)}
                        />
                    );
                    let auraDetails = null;
                    if (combatant.aura.radius > 0) {
                        const auraStyleOptions = [
                            {
                                id: 'square',
                                text: 'square'
                            },
                            {
                                id: 'rounded',
                                text: 'rounded'
                            },
                            {
                                id: 'circle',
                                text: 'circle'
                            }
                        ];
                        auraDetails = (
                            <div>
                                <Selector
                                    options={auraStyleOptions}
                                    selectedID={combatant.aura.style}
                                    select={optionID => this.props.changeValue(combatant.aura, 'style', optionID)}
                                />
                                <input
                                    type='color'
                                    value={combatant.aura.color}
                                    onChange={event => this.props.changeValue(combatant.aura, 'color', event.target.value)}
                                />
                            </div>
                        );
                    }
                    options.push(
                        <Expander
                            key='aura'
                            text='aura'
                            content={(
                                <div>
                                    <Spin
                                        source={combatant.aura}
                                        name='radius'
                                        label='size'
                                        display={value => value + ' ft.'}
                                        nudgeValue={delta => this.props.nudgeValue(combatant.aura, 'radius', delta * 5)}
                                    />
                                    {auraDetails}
                                </div>
                            )}
                        />
                    );
                    options.push(<button key='mapRemove' onClick={() => this.props.mapRemove(combatant)}>remove from map</button>);
                }
                if (this.props.mode.indexOf('off-map') !== -1) {
                    options.push(<button key='mapAdd' onClick={() => this.props.mapAdd(combatant)}>add to map</button>);
                }
                break;
            case 'adv':
                if (!combatant.current) {
                    options.push(<ConfirmButton key='remove' text='remove from encounter' callback={() => this.props.removeCombatant(combatant)} />);
                }
                if (!combatant.pending) {
                    options.push(
                        <Expander
                            key='init'
                            text='change initiative score'
                            content={(
                                <div>
                                    <Spin
                                        source={this.props.combatant}
                                        name='initiative'
                                        label='initiative'
                                        nudgeValue={delta => this.props.nudgeValue(this.props.combatant, 'initiative', delta)}
                                    />
                                </div>
                            )}
                        />
                    );
                }
                options.push(
                    <Expander
                        key='size'
                        text='change size'
                        content={(
                            <div>
                                <Spin
                                    source={this.props.combatant}
                                    name='displaySize'
                                    label='size'
                                    nudgeValue={delta => this.props.nudgeValue(this.props.combatant, 'displaySize', delta)}
                                />
                            </div>
                        )}
                    />
                );
                options.push(
                    <Expander
                        key='rename'
                        text='change name'
                        content={(
                            <div>
                                <input
                                    type='text'
                                    value={combatant.displayName}
                                    onChange={event => this.props.changeValue(this.props.combatant, 'displayName', event.target.value)}
                                />
                            </div>
                        )}
                    />
                );
                break;
        }

        return (
            <div>
                <div className='combat-options-panel'>
                    {options}
                </div>
                <div className='divider' />
            </div>
        );
    }

    public render() {
        try {
            const options = [];
            if (this.props.mode.indexOf('no-buttons') === -1) {
                if (this.props.mode.indexOf('view') !== -1) {
                    if (this.props.mode.indexOf('editable') !== -1) {
                        options.push(
                            <button key='edit' onClick={() => this.props.editMonster(this.props.combatant)}>edit monster</button>
                        );

                        options.push(
                            <Expander
                                key='clone'
                                text='clone monster'
                                content={
                                    <div>
                                        <input
                                            type='text'
                                            placeholder='monster name'
                                            value={this.state.cloneName}
                                            onChange={event => this.setCloneName(event.target.value)}
                                        />
                                        <button onClick={() => this.props.cloneMonster(this.props.combatant, this.state.cloneName)}>create copy</button>
                                    </div>
                                }
                            />
                        );

                        const groupOptions: { id: string, text: string }[] = [];
                        this.props.library.forEach(group => {
                            if (group.monsters.indexOf(this.props.combatant) === -1) {
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
                                select={optionID => this.props.moveToGroup(this.props.combatant, optionID)}
                            />
                        );

                        options.push(<ConfirmButton key='remove' text='delete monster' callback={() => this.props.removeMonster(this.props.combatant)} />);
                    }
                    if (this.props.mode.indexOf('encounter') !== -1) {
                        if (this.props.slot) {
                            // This card is in an encounter or a wave
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
                                    <button key='add encounter' onClick={() => this.props.addEncounterSlot(this.props.combatant, null)}>
                                        add to encounter
                                    </button>
                                );
                                canAdd = true;
                            }
                            this.props.encounter.waves.forEach(wave => {
                                if (!this.monsterIsInWave(wave)) {
                                    options.push(
                                        <button key={'add ' + wave.id} onClick={() => this.props.addEncounterSlot(this.props.combatant, wave.id)}>
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
                                        heading={
                                            (
                                                <div className='heading'>
                                                    <div className='title'>{this.props.combatant.name}</div>
                                                </div>
                                            )
                                        }
                                        content={
                                            (
                                                <div className='section centered'>
                                                    <i>this monster is already part of this encounter</i>
                                                </div>
                                            )
                                        }
                                    />
                                );
                            }
                        }
                    }
                    if (this.props.mode.indexOf('candidate') !== -1) {
                        if (this.props.mode.indexOf('selected') === -1) {
                            options.push(
                                <button key='select' onClick={() => this.props.selectMonster(this.props.combatant)}>select monster</button>
                            );
                        } else {
                            options.push(
                                <button key='deselect' onClick={() => this.props.deselectMonster(this.props.combatant)}>deselect monster</button>
                            );
                        }
                    }
                }
                if (this.props.mode.indexOf('template') !== -1) {
                    // None
                }
            }

            let combat = null;
            if (this.props.mode.indexOf('combat') !== -1) {
                combat = this.getCombatControls();
            }

            let stats = null;
            if (this.props.mode.indexOf('view') !== -1) {
                let slotSection = null;
                if (this.props.slot) {
                    slotSection = (
                        <div>
                            <div className='divider' />
                            <Spin
                                source={this.props.slot}
                                name='count'
                                label='count'
                                nudgeValue={delta => this.props.nudgeValue(this.props.slot, 'count', delta)}
                            />
                        </div>
                    );
                }

                let details = null;
                if (this.state.showDetails || (this.props.mode.indexOf('generated') !== -1)) {
                    details = (
                        <div>
                            <div className='divider' />
                            <div className='section'>
                                <b>ac</b> {this.props.combatant.ac}
                            </div>
                            <div className='section' style={{ display: this.props.combatant.hpMax !== 0 ? '' : 'none' }}>
                                <b>hp</b> {this.getHP()}
                            </div>
                            <div className='section' style={{ display: this.props.combatant.speed !== '' ? '' : 'none' }}>
                                <b>speed</b> {this.props.combatant.speed}
                            </div>
                            <div className='section'>
                                <AbilityScorePanel combatant={this.props.combatant} />
                            </div>
                            <div className='section' style={{ display: this.props.combatant.savingThrows !== '' ? '' : 'none' }}>
                                <b>saving throws</b> {this.props.combatant.savingThrows}
                            </div>
                            <div className='section' style={{ display: this.props.combatant.skills !== '' ? '' : 'none' }}>
                                <b>skills</b> {this.props.combatant.skills}
                            </div>
                            <div className='section' style={{ display: this.props.combatant.damage.resist !== '' ? '' : 'none' }}>
                                <b>damage resistances</b> {this.props.combatant.damage.resist}
                            </div>
                            <div className='section' style={{ display: this.props.combatant.damage.vulnerable !== '' ? '' : 'none' }}>
                                <b>damage vulnerabilities</b> {this.props.combatant.damage.vulnerable}
                            </div>
                            <div className='section' style={{ display: this.props.combatant.damage.immune !== '' ? '' : 'none' }}>
                                <b>damage immunities</b> {this.props.combatant.damage.immune}
                            </div>
                            <div className='section' style={{ display: this.props.combatant.conditionImmunities !== '' ? '' : 'none' }}>
                                <b>condition immunities</b> {this.props.combatant.conditionImmunities}
                            </div>
                            <div className='section' style={{ display: this.props.combatant.senses !== '' ? '' : 'none' }}>
                                <b>senses</b> {this.props.combatant.senses}
                            </div>
                            <div className='section' style={{ display: this.props.combatant.languages !== '' ? '' : 'none' }}>
                                <b>languages</b> {this.props.combatant.languages}
                            </div>
                            <div className='section' style={{ display: this.props.combatant.equipment !== '' ? '' : 'none' }}>
                                <b>equipment</b> {this.props.combatant.equipment}
                            </div>
                            <div className='divider' />
                            <TraitsPanel combatant={this.props.combatant} />
                        </div>
                    );
                }

                stats = (
                    <div className='stats'>
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
                        <div className='section centered'>
                            <i>{this.description()}</i>
                        </div>
                        <div className='divider' />
                        {combat}
                        <div className='section'>
                            <AbilityScorePanel combatant={this.props.combatant} />
                        </div>
                        <div className='section' style={{ display: this.props.combatant.ac !== 0 ? '' : 'none' }}>
                            <b>ac</b> {this.props.combatant.ac}
                        </div>
                        <div className='section' style={{ display: this.props.combatant.savingThrows !== '' ? '' : 'none' }}>
                            <b>saving throws</b> {this.props.combatant.savingThrows}
                        </div>
                        <div className='section' style={{ display: this.props.combatant.skills !== '' ? '' : 'none' }}>
                            <b>skills</b> {this.props.combatant.skills}
                        </div>
                        <div className='section' style={{ display: this.props.combatant.speed !== '' ? '' : 'none' }}>
                            <b>speed</b> {this.props.combatant.speed}
                        </div>
                        <div className='section' style={{ display: this.props.combatant.senses !== '' ? '' : 'none' }}>
                            <b>senses</b> {this.props.combatant.senses}
                        </div>
                        <div className='section' style={{ display: this.props.combatant.damage.resist !== '' ? '' : 'none' }}>
                            <b>damage resistances</b> {this.props.combatant.damage.resist}
                        </div>
                        <div className='section' style={{ display: this.props.combatant.damage.vulnerable !== '' ? '' : 'none' }}>
                            <b>damage vulnerabilities</b> {this.props.combatant.damage.vulnerable}
                        </div>
                        <div className='section' style={{ display: this.props.combatant.damage.immune !== '' ? '' : 'none' }}>
                            <b>damage immunities</b> {this.props.combatant.damage.immune}
                        </div>
                        <div className='section' style={{ display: this.props.combatant.conditionImmunities !== '' ? '' : 'none' }}>
                            <b>condition immunities</b> {this.props.combatant.conditionImmunities}
                        </div>
                        <div className='section' style={{ display: this.props.combatant.languages !== '' ? '' : 'none' }}>
                            <b>languages</b> {this.props.combatant.languages}
                        </div>
                        <div className='section' style={{ display: this.props.combatant.equipment !== '' ? '' : 'none' }}>
                            <b>equipment</b> {this.props.combatant.equipment}
                        </div>
                        <div className='divider' />
                        <TraitsPanel
                            combatant={this.props.combatant}
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
                            <div className='section centered'>
                                <i>{this.description()}</i>
                            </div>
                            <div className='divider' />
                            <div className='section'>
                                <b>speed</b> {this.props.combatant.speed || '-'}
                            </div>
                            <div className='section'>
                                <b>senses</b> {this.props.combatant.senses || '-'}
                            </div>
                            <div className='section'>
                                <b>languages</b> {this.props.combatant.languages || '-'}
                            </div>
                            <div className='section'>
                                <b>equipment</b> {this.props.combatant.equipment || '-'}
                            </div>
                        </div>
                    );
                }
                if (this.props.mode.indexOf('abilities') !== -1) {
                    stats = (
                        <div>
                            <div className='section'>
                                <AbilityScorePanel combatant={this.props.combatant} />
                            </div>
                            <div className='section'>
                                <b>saving throws</b> {this.props.combatant.savingThrows || '-'}
                            </div>
                            <div className='section'>
                                <b>skills</b> {this.props.combatant.skills || '-'}
                            </div>
                        </div>
                    );
                }
                if (this.props.mode.indexOf('cbt-stats') !== -1) {
                    stats = (
                        <div>
                            <div className='section'>
                                <b>ac</b> {this.props.combatant.ac}
                            </div>
                            <div className='section'>
                                <b>hp</b> {this.getHP()}
                            </div>
                            <div className='section'>
                                <b>damage immunity</b> {this.props.combatant.damage.immune || '-'}
                            </div>
                            <div className='section'>
                                <b>damage resistance</b> {this.props.combatant.damage.resist || '-'}
                            </div>
                            <div className='section'>
                                <b>damage vulnerability</b> {this.props.combatant.damage.vulnerable || '-'}
                            </div>
                            <div className='section'>
                                <b>condition immunities</b> {this.props.combatant.conditionImmunities || '-'}
                            </div>
                        </div>
                    );
                }
                if (this.props.mode.indexOf('actions') !== -1) {
                    stats = (
                        <TraitsPanel
                            combatant={this.props.combatant}
                            mode='template'
                            filter={this.props.filter}
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
            } else if (this.props.mode.indexOf('view generated') !== -1) {
                // Don't show toggle button for generated monster
            } else {
                const imageStyle = this.state.showDetails ? 'image rotate' : 'image';
                toggle = (
                    <img className={imageStyle} src={arrow} alt='arrow' onClick={() => this.toggleDetails()} />
                );
            }

            const name = (this.props.combatant as Combatant ? (this.props.combatant as Combatant).displayName : null)
                || this.props.combatant.name
                || 'unnamed monster';

            return (
                <div className='card monster'>
                    <div className='heading'>
                        <div className='title'>{name}</div>
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
        }
    }
}
