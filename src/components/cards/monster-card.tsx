import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
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

interface Props {
    monster: Monster | (Monster & Combatant);
    mode: string;
    library: MonsterGroup[];
    nudgeValue: (source: any, field: string, delta: number) => void;
    // Library
    viewMonster: (monster: Monster) => void;
    editMonster: (monster: Monster) => void;
    removeMonster: (monster: Monster) => void;
    exportMonster: (monster: Monster) => void;
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
    // Combat
    useTrait: (trait: Trait) => void;
    rechargeTrait: (trait: Trait) => void;
}

interface State {
    cloneName: string;
}

export default class MonsterCard extends React.Component<Props, State> {
    public static defaultProps = {
        mode: 'full',
        library: null,
        nudgeValue: null,
        viewMonster: null,
        editMonster: null,
        removeMonster: null,
        exportMonster: null,
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
        toggleCondition: null,
        useTrait: null,
        rechargeTrait: null
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            cloneName: props.monster.name + ' copy'
        };
    }

    private setCloneName(cloneName: string) {
        this.setState({
            cloneName: cloneName
        });
    }

    private canSelect() {
        if (this.props.mode.indexOf('template') !== -1) {
            return true;
        }

        if (this.props.mode.indexOf('candidate') !== -1) {
            return true;
        }

        return false;
    }

    private monsterIsInWave(wave: EncounterWave) {
        return wave.slots.some(s => {
            const group = this.props.library.find(g => g.monsters.includes(this.props.monster));
            return !!group && (s.monsterGroupName === group.name) && (s.monsterName === this.props.monster.name);
        });
    }

    private getHP() {
        const combatant = this.props.monster as Monster & Combatant;
        if (combatant.hpCurrent !== undefined) {
            let current = (combatant.hpCurrent ?? 0).toString();

            if ((combatant.hpTemp ?? 0) > 0) {
                current += '+' + combatant.hpTemp;
            }

            return current;
        }

        const hp = Frankenstein.getTypicalHP(this.props.monster);
        const str = Frankenstein.getTypicalHPString(this.props.monster);
        return hp + ' (' + str + ')';
    }

    private statSection(text: string, value: string) {
        if (!value) {
            return null;
        }

        return (
            <div className='section'>
                <b>{text}</b> {value}
            </div>
        );
    }

    private getTags() {
        const tags = [];

        let size = this.props.monster.size;
        const combatant = this.props.monster as Combatant;
        if (combatant) {
            size = combatant.displaySize || size;
        }
        let sizeAndType = (size + ' ' + this.props.monster.category).toLowerCase();
        if (this.props.monster.tag) {
            sizeAndType += ' (' + this.props.monster.tag.toLowerCase() + ')';
        }
        tags.push(<Tag key='tag-main'>{sizeAndType}</Tag>);

        if (this.props.monster.alignment) {
            tags.push(<Tag key='tag-align'>{this.props.monster.alignment.toLowerCase()}</Tag>);
        }

        tags.push(<Tag key='tag-cr'>cr {Utils.challenge(this.props.monster.challenge)}</Tag>);

        return tags;
    }

    private getButtons() {
        const options = [];

        if (this.props.mode.indexOf('editable') !== -1) {
            options.push(
                <button key='view' onClick={() => this.props.viewMonster(this.props.monster)}>view monster</button>
            );

            options.push(
                <button key='edit' onClick={() => this.props.editMonster(this.props.monster)}>edit monster</button>
            );

            options.push(
                <button key='export' onClick={() => this.props.exportMonster(this.props.monster)}>export monster</button>
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
            options.push(
                <button key='view' onClick={() => this.props.viewMonster(this.props.monster)}>view monster</button>
            );
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
                    <button key='remove' onClick={() => this.props.removeEncounterSlot(this.props.slot)}>remove</button>
                );
            } else {
                // This card is in the library list
                if (!this.monsterIsInWave(this.props.encounter)) {
                    options.push(
                        <button key='add encounter' onClick={() => this.props.addEncounterSlot(this.props.monster, null)}>
                            add to encounter
                        </button>
                    );
                }
                this.props.encounter.waves.forEach(wave => {
                    if (!this.monsterIsInWave(wave)) {
                        options.push(
                            <button key={'add ' + wave.id} onClick={() => this.props.addEncounterSlot(this.props.monster, wave.id)}>
                                add to {wave.name}
                            </button>
                        );
                    }
                });
            }
        }

        return options;
    }

    private getStats() {
        let stats = null;

        if (this.props.mode.indexOf('template') === -1) {
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

            let statBlock = null;
            if ((this.props.mode.indexOf('full') !== -1) || (this.props.mode.indexOf('combat') !== -1)) {
                statBlock = (
                    <div>
                        <div className='divider' />
                        <AbilityScorePanel combatant={this.props.monster} />
                        {this.statSection('ac', this.props.monster.ac.toString())}
                        {this.statSection('hp', this.getHP())}
                        {this.statSection('saving throws', this.props.monster.savingThrows)}
                        {this.statSection('skills', this.props.monster.skills)}
                        {this.statSection('speed', this.props.monster.speed)}
                        {this.statSection('senses', this.props.monster.senses)}
                        {this.statSection('damage resistances', this.props.monster.damage.resist)}
                        {this.statSection('damage vulnerabilities', this.props.monster.damage.vulnerable)}
                        {this.statSection('damage immunities', this.props.monster.damage.immune)}
                        {this.statSection('condition immunities', this.props.monster.conditionImmunities)}
                        {this.statSection('languages', this.props.monster.languages)}
                        {this.statSection('equipment', this.props.monster.equipment)}
                        <div className='divider' />
                        <TraitsPanel
                            combatant={this.props.monster}
                            mode={this.props.mode.indexOf('combat') !== -1 ? 'combat' : 'view'}
                            useTrait={trait => this.props.useTrait(trait)}
                            rechargeTrait={trait => this.props.rechargeTrait(trait)}
                        />
                    </div>
                );
            }

            stats = (
                <div className='stats'>
                    <PortraitPanel source={this.props.monster} />
                    <div className='section centered'>
                        {this.getTags()}
                    </div>
                    {slotSection}
                    {statBlock}
                </div>
            );
        } else {
            if (this.props.mode.indexOf('overview') !== -1) {
                stats = (
                    <div className='stats'>
                        <PortraitPanel source={this.props.monster} />
                        <div className='section centered'>
                            {this.getTags()}
                        </div>
                        <div className='divider' />
                        {this.statSection('speed', this.props.monster.speed)}
                        {this.statSection('senses', this.props.monster.senses)}
                        {this.statSection('languages', this.props.monster.languages)}
                        {this.statSection('equipment', this.props.monster.equipment)}
                    </div>
                );
            }
            if (this.props.mode.indexOf('abilities') !== -1) {
                stats = (
                    <div className='stats'>
                        <AbilityScorePanel combatant={this.props.monster} />
                        {this.statSection('saving throws', this.props.monster.savingThrows)}
                        {this.statSection('skills', this.props.monster.skills)}
                    </div>
                );
            }
            if (this.props.mode.indexOf('cbt-stats') !== -1) {
                stats = (
                    <div className='stats'>
                        {this.statSection('ac', this.props.monster.ac.toString())}
                        {this.statSection('hp', this.getHP())}
                        {this.statSection('damage resistances', this.props.monster.damage.resist)}
                        {this.statSection('damage vulnerabilities', this.props.monster.damage.vulnerable)}
                        {this.statSection('damage immunities', this.props.monster.damage.immune)}
                        {this.statSection('condition immunities', this.props.monster.conditionImmunities)}
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

        return stats;
    }

    private getIcon() {
        if (this.canSelect()) {
            if (this.props.mode.indexOf('selected') !== -1) {
                return (
                    <MinusCircleOutlined onClick={() => this.props.deselectMonster(this.props.monster)} />
                );
            } else {
                return (
                    <PlusCircleOutlined onClick={() => this.props.selectMonster(this.props.monster)} />
                );
            }
        }

        return null;
    }

    public render() {
        try {
            const buttons = this.getButtons();

            const name = (this.props.monster as Combatant ? (this.props.monster as Combatant).displayName : null)
                || this.props.monster.name
                || 'unnamed monster';

            return (
                <div className='card monster'>
                    <div className='heading'>
                        <div className='title' title={name}>
                            {name}
                        </div>
                        {this.getIcon()}
                    </div>
                    <div className='card-content'>
                        {this.getStats()}
                        <div style={{ display: buttons.length > 0 ? '' : 'none' }}>
                            <div className='divider' />
                            <div className='section'>{buttons}</div>
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
