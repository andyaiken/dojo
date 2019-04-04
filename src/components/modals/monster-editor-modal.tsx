import React from 'react';

import Factory from '../../utils/factory';
import Utils from '../../utils/utils';

import { CATEGORY_TYPES, Monster, MonsterGroup, SIZE_TYPES, Trait, TRAIT_TYPES } from '../../models/monster-group';

import MonsterCard from '../cards/monster-card';
import Checkbox from '../controls/checkbox';
import Dropdown from '../controls/dropdown';
import Selector from '../controls/selector';
import Spin from '../controls/spin';
import AbilityScorePanel from '../panels/ability-score-panel';
import TraitsPanel from '../panels/traits-panel';

import arrow from '../../resources/images/down-arrow.svg';

interface Props {
    monster: Monster;
    library: MonsterGroup[];
    showMonsters: boolean;
}

interface State {
    monster: Monster;
    page: 'overview' | 'abilities' | 'cbt-stats' | 'actions';
    showFilter: boolean;
    helpSection: string;
    filter: {
        size: boolean,
        type: boolean,
        subtype: boolean,
        alignment: boolean,
        challenge: boolean,
        text: string
    };
}

export default class MonsterEditorModal extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            monster: props.monster,
            page: 'overview',
            showFilter: false,
            helpSection: 'speed',
            filter: {
                size: true,
                type: true,
                subtype: false,
                alignment: false,
                challenge: true,
                text: ''
            }
        };
    }

    private setPage(page: 'overview' | 'abilities' | 'cbt-stats' | 'actions') {
        const sections = this.getHelpOptionsForPage(page);
        this.setState({
            page: page,
            helpSection: sections[0]
        });
    }

    private toggleFilter() {
        this.setState({
            showFilter: !this.state.showFilter
        });
    }

    private setHelpSection(section: string) {
        this.setState({
            helpSection: section
        });
    }

    private toggleMatch(type: 'size' | 'type' | 'subtype' | 'alignment' | 'challenge') {
        // eslint-disable-next-line
        this.state.filter[type] = !this.state.filter[type];
        this.setState({
            filter: this.state.filter
        });
    }

    private setFilterText(value: string) {
        // eslint-disable-next-line
        this.state.filter.text = value;
        this.setState({
            filter: this.state.filter
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Helper methods

    private getHelpOptionsForPage(page: 'overview' | 'abilities' | 'cbt-stats' | 'actions') {
        switch (page) {
            case 'overview':
                return ['speed', 'senses', 'languages', 'equipment'];
            case 'abilities':
                return ['str', 'dex', 'con', 'int', 'wis', 'cha', 'saves', 'skills'];
            case 'cbt-stats':
                return ['armor class', 'hit dice', 'resistances', 'vulnerabilities', 'immunities', 'conditions'];
            case 'actions':
                return ['actions'];
            default:
                return [];
        }
    }

    private getMonsters() {
        const monsters: Monster[] = [];
        this.props.library.forEach(group => {
            group.monsters.forEach(monster => {
                let match = true;

                if (this.state.monster.id === monster.id) {
                    match = false;
                }

                if (this.state.filter.size && (this.state.monster.size !== monster.size)) {
                    match = false;
                }

                if (this.state.filter.type && (this.state.monster.category !== monster.category)) {
                    match = false;
                }

                if (this.state.filter.subtype && (this.state.monster.tag !== monster.tag)) {
                    match = false;
                }

                if (this.state.filter.alignment && (this.state.monster.alignment !== monster.alignment)) {
                    match = false;
                }

                if (this.state.filter.challenge && (this.state.monster.challenge !== monster.challenge)) {
                    match = false;
                }

                if (match) {
                    monsters.push(monster);
                }
            });
        });

        return monsters;
    }

    private setRandomValue(field: string, monsters: Monster[], notify: boolean) {
        const index = Math.floor(Math.random() * monsters.length);
        const m = monsters[index];

        let source: any = m;
        let value = null;
        const tokens = field.split('.');
        tokens.forEach(token => {
            if (token === tokens[tokens.length - 1]) {
                value = source[token];
            } else {
                source = source[token];
            }
        });

        this.changeValue(field, value, notify);
    }

    private geneSplice(monsters: Monster[]) {
        [
            'speed',
            'senses',
            'languages',
            'equipment',
            'abilityScores.str',
            'abilityScores.dex',
            'abilityScores.con',
            'abilityScores.int',
            'abilityScores.wis',
            'abilityScores.cha',
            'savingThrows',
            'skills',
            'ac',
            'hitDice',
            'damage.resist',
            'damage.vulnerable',
            'damage.immune',
            'conditionImmunities'
        ].forEach(field => {
            this.setRandomValue(field, monsters, false);
        });

        TRAIT_TYPES.forEach(type => {
            // Clear current traits of this type
            const currentTraits = this.state.monster.traits.filter(t => t.type === type);
            currentTraits.forEach(c => {
                const index = this.state.monster.traits.findIndex(t => t === c);
                this.state.monster.traits.splice(index, 1);
            });

            // Get all traits of this type
            const traits: Trait[] = [];
            monsters.forEach(m => {
                m.traits.filter(t => t.type === type)
                    .forEach(t => traits.push(t));
            });

            // Collate by name
            const distinct: { trait: Trait, count: number }[] = [];
            traits.forEach(t => {
                const current = distinct.find(d => d.trait.name === t.name);
                if (current) {
                    current.count += 1;
                } else {
                    distinct.push({
                        trait: t,
                        count: 1
                    });
                }
            });

            // If any are common to all monsters, copy them and remove from the candidates
            const addedIDs: string[] = [];
            distinct.filter(d => d.count === monsters.length)
                .forEach(d => {
                    this.copyTrait(d.trait);
                    addedIDs.push(d.trait.id);
                });
            addedIDs.forEach(id => {
                const index = distinct.findIndex(d => d.trait.id === id);
                distinct.splice(index, 1);
            });

            const avg = traits.length / monsters.length;
            while (this.state.monster.traits.filter(t => t.type === type).length < avg) {
                const index = Math.floor(Math.random() * distinct.length);
                const t = distinct[index].trait;
                this.copyTrait(t);
                distinct.splice(index, 1);
            }
        });

        this.setState({
            monster: this.state.monster
        });
    }

    private addTrait(type: 'trait' | 'action' | 'legendary' | 'lair' | 'regional') {
        const trait = Factory.createTrait();
        trait.type = type;
        trait.name = 'New ' + this.getActionTypeName(type, false).toLowerCase();
        this.state.monster.traits.push(trait);
        this.setState({
            monster: this.state.monster
        });
    }

    private addRandomTrait(type: string, monsters: Monster[]) {
        const traits: Trait[] = [];
        monsters.forEach(m => {
            m.traits.filter(t => t.type === type)
                .forEach(t => {
                    traits.push(t);
                });
        });

        const index = Math.floor(Math.random() * traits.length);
        const trait = traits[index];

        this.copyTrait(trait);
    }

    private removeTrait(trait: Trait) {
        const index = this.state.monster.traits.indexOf(trait);
        this.state.monster.traits.splice(index, 1);
        this.setState({
            monster: this.state.monster
        });
    }

    private swapTraits(t1: Trait, t2: Trait) {
        const index1 = this.state.monster.traits.indexOf(t1);
        const index2 = this.state.monster.traits.indexOf(t2);
        this.state.monster.traits[index2] = t1;
        this.state.monster.traits[index1] = t2;
        this.setState({
            monster: this.state.monster
        });
    }

    private getActionTypeName(type: string, plural: boolean) {
        let name = Utils.traitType(type);
        if (plural) {
            name += 's';
        }
        return name;
    }

    private copyTrait(trait: Trait) {
        const copy = JSON.parse(JSON.stringify(trait));
        copy.id = Utils.guid();
        this.state.monster.traits.push(copy);
        this.setState({
            monster: this.state.monster
        });
    }

    private changeTrait(trait: Trait, field: string, value: any) {
        (trait as any)[field] = value;
        this.setState({
            monster: this.state.monster
        });
    }

    private nudgeValue(field: string, delta: number) {
        let source: any = this.state.monster;
        let value: any = null;
        const tokens = field.split('.');
        tokens.forEach(token => {
            if (token === tokens[tokens.length - 1]) {
                value = source[token];
            } else {
                source = source[token];
            }
        });

        const newValue = (field === 'challenge') ? Utils.nudgeChallenge(value, delta) : (value ? value : 0) + delta;
        this.changeValue(field, newValue);
    }

    private changeValue(field: string, value: any, notify = true) {
        let source: any = this.state.monster;
        const tokens = field.split('.');
        tokens.forEach(token => {
            if (token === tokens[tokens.length - 1]) {
                source[token] = value;

                if ((field === 'abilityScores.con') || (field === 'size') || (field === 'hitDice')) {
                    const sides = Utils.hitDieType(this.state.monster.size);
                    const conMod = Math.floor((this.state.monster.abilityScores.con - 10) / 2);
                    const hpPerDie = ((sides + 1) / 2) + conMod;
                    const hp = Math.floor(this.state.monster.hitDice * hpPerDie);
                    // eslint-disable-next-line
                    this.state.monster.hpMax = hp;
                }

                if (notify) {
                    this.setState({
                        monster: this.state.monster
                    });
                }
            } else {
                source = source[token];
            }
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // HTML render methods

    private getHelpSection(monsters: Monster[]) {
        switch (this.state.helpSection) {
            case 'speed':
                return this.getValueSection('speed', 'text', monsters);
            case 'senses':
                return this.getValueSection('senses', 'text', monsters);
            case 'languages':
                return this.getValueSection('languages', 'text', monsters);
            case 'equipment':
                return this.getValueSection('equipment', 'text', monsters);
            case 'str':
                return this.getValueSection('abilityScores.str', 'number', monsters);
            case 'dex':
                return this.getValueSection('abilityScores.dex', 'number', monsters);
            case 'con':
                return this.getValueSection('abilityScores.con', 'number', monsters);
            case 'int':
                return this.getValueSection('abilityScores.int', 'number', monsters);
            case 'wis':
                return this.getValueSection('abilityScores.wis', 'number', monsters);
            case 'cha':
                return this.getValueSection('abilityScores.cha', 'number', monsters);
            case 'saves':
                return this.getValueSection('savingThrows', 'text', monsters);
            case 'skills':
                return this.getValueSection('skills', 'text', monsters);
            case 'armor class':
                return this.getValueSection('ac', 'number', monsters);
            case 'hit dice':
                return this.getValueSection('hitDice', 'number', monsters);
            case 'resistances':
                return this.getValueSection('damage.resist', 'text', monsters);
            case 'vulnerabilities':
                return this.getValueSection('damage.vulnerable', 'text', monsters);
            case 'immunities':
                return this.getValueSection('damage.immune', 'text', monsters);
            case 'conditions':
                return this.getValueSection('conditionImmunities', 'text', monsters);
            case 'actions':
                return this.getActionsSection(monsters);
            default:
                return null;
        }
    }

    private getValueSection(field: string, dataType: 'text' | 'number', monsters: Monster[]) {
        const values: any[] = monsters
            .map(m => {
                const tokens = field.split('.');
                let source: any = m;
                let value = null;
                tokens.forEach(token => {
                    if (token === tokens[tokens.length - 1]) {
                        value = source[token];
                    } else {
                        source = source[token];
                    }
                });
                if ((dataType === 'text') && (value === '')) {
                    value = null;
                }
                return value;
            })
            .filter(v => v !== null);

        const distinct: { value: any, count: number }[] = [];
        if (dataType === 'number') {
            let min: number | null = null;
            let max: number | null = null;
            values.forEach(v => {
                if ((min === null) || (v < min)) {
                    min = v;
                }
                if ((max === null) || (v > max)) {
                    max = v;
                }
            });
            if ((min !== null) && (max !== null)) {
                for (let n = min; n <= max; ++n) {
                    distinct.push({
                        value: n,
                        count: 0
                    });
                }
            }
        }
        values.forEach(v => {
            const current = distinct.find(d => d.value === v);
            if (current) {
                current.count += 1;
            } else {
                distinct.push({
                    value: v,
                    count: 1
                });
            }
        });

        switch (dataType) {
            case 'number':
                Utils.sortByValue(distinct);
                break;
            case 'text':
                Utils.sortByCount(distinct);
                break;
            default:
                // Do nothing
                break;
        }

        if (dataType === 'text') {
            const count = monsters.length - values.length;
            if (count !== 0) {
                distinct.push({
                    value: '',
                    count: monsters.length - values.length
                });
            }
        }

        const valueSections = distinct.map(d => {
            const width = 100 * d.count / monsters.length;
            return (
                <div className='row small-up-3 medium-up-3 large-up-3 value-list' key={distinct.indexOf(d)}>
                    <div className='column'>
                        <div className='text-container'>
                            {d.value || '(none specified)'}
                        </div>
                    </div>
                    <div className='column'>
                        <div className='bar-container'>
                            <div className='bar' style={{ width: width + '%' }} />
                        </div>
                    </div>
                    <div className='column'>
                        <button onClick={() => this.changeValue(field, d.value)}>use this value</button>
                    </div>
                </div>
            );
        });

        return (
            <div>
                {valueSections}
                <button onClick={() => this.setRandomValue(field, monsters, true)}>select random value</button>
            </div>
        );
    }

    private getActionsSection(monsters: Monster[]) {
        const rows = [];
        rows.push(
            <div className='row small-up-4 medium-up-4 large-up-4 value-list' key='header'>
                <div className='column'>
                    <div className='text-container'>
                        <b>type</b>
                    </div>
                </div>
                <div className='column'>
                    <div className='text-container number'>
                        <b>average number</b>
                    </div>
                </div>
                <div className='column'>
                    <div className='text-container number'>
                        <b>min - max</b>
                    </div>
                </div>
            </div>
        );

        TRAIT_TYPES.forEach(type => {
            let min: number | null = null;
            let max: number | null = null;
            let count = 0;
            monsters.forEach(m => {
                const n = m.traits.filter(t => t.type === type).length;
                if ((min === null) || (n < min)) {
                    min = n;
                }
                if ((max === null) || (n > max)) {
                    max = n;
                }
                count += n;
            });
            const avg = Math.round(count / monsters.length);

            rows.push(
                <div className='row small-up-4 medium-up-4 large-up-4 value-list' key={type}>
                    <div className='column'>
                        <div className={count === 0 ? 'text-container disabled' : 'text-container'}>
                            {this.getActionTypeName(type, true)}
                        </div>
                    </div>
                    <div className='column'>
                        <div className={count === 0 ? 'text-container number disabled' : 'text-container number'}>
                            {avg}
                        </div>
                    </div>
                    <div className='column'>
                        <div className={count === 0 ? 'text-container number disabled' : 'text-container number'}>
                            {min} - {max}
                        </div>
                    </div>
                    <div className='column'>
                        <button className={count === 0 ? 'disabled' : ''} onClick={() => this.addRandomTrait(type, monsters)}>add random</button>
                    </div>
                </div>
            );
        });

        return (
            <div>
                {rows}
            </div>
        );
    }

    private getFilterCard(monsters: Monster[]) {
        const criteria: string[] = [];
        if (this.state.filter.size) {
            criteria.push('size');
        }
        if (this.state.filter.type) {
            criteria.push('type');
        }
        if (this.state.filter.subtype) {
            criteria.push('subtype');
        }
        if (this.state.filter.alignment) {
            criteria.push('alignment');
        }
        if (this.state.filter.challenge) {
            criteria.push('challenge rating');
        }
        const criteriaText = (criteria.length > 0) ? 'based on ' + criteria.join(', ') : 'no criteria specified';
        const similar = (
            <div className='section'>
                {monsters.length} similar monsters ({criteriaText})
            </div>
        );

        let filterContent = null;
        if (this.state.showFilter) {
            filterContent = (
                <div>
                    <Checkbox
                        label={'size ' + this.state.monster.size}
                        checked={this.state.filter.size}
                        changeValue={value => this.toggleMatch('size')}
                    />
                    <Checkbox
                        label={'type ' + this.state.monster.category}
                        checked={this.state.filter.type}
                        changeValue={value => this.toggleMatch('type')}
                    />
                    <Checkbox
                        label={this.state.monster.tag ? 'subtype ' + this.state.monster.tag : 'subtype'}
                        checked={this.state.filter.subtype}
                        disabled={!this.state.monster.tag}
                        changeValue={value => this.toggleMatch('subtype')}
                    />
                    <Checkbox
                        label={this.state.monster.alignment ? 'alignment ' + this.state.monster.alignment : 'alignment'}
                        checked={this.state.filter.alignment}
                        disabled={!this.state.monster.alignment}
                        changeValue={value => this.toggleMatch('alignment')}
                    />
                    <Checkbox
                        label={'challenge rating ' + Utils.challenge(this.state.monster.challenge)}
                        checked={this.state.filter.challenge}
                        changeValue={value => this.toggleMatch('challenge')}
                    />
                    <div className='divider' />
                    <button className={monsters.length < 2 ? 'disabled' : ''} onClick={() => this.geneSplice(monsters)}>build random monster</button>
                    <div className='divider' />
                    {similar}
                </div>
            );
        } else {
            filterContent = (
                <div>
                    {similar}
                </div>
            );
        }

        return (
            <div className='section'>
                <div className='card'>
                    <div className='heading'>
                        <div className='title'>similar monsters</div>
                        <img className={this.state.showFilter ? 'image rotate' : 'image'} src={arrow} alt='arrow' onClick={() => this.toggleFilter()} />
                    </div>
                    <div className='card-content'>
                        {filterContent}
                    </div>
                </div>
            </div>
        );
    }

    private getMonsterCards(monsters: Monster[]) {
        const sorted = Utils.sort(monsters);
        const monsterCards = sorted.map(m => {
            const showMonster = m.traits.some((t: Trait) => Utils.match(this.state.filter.text, t.name));
            if (showMonster) {
                return (
                    <div className='section' key={m.id}>
                        <MonsterCard
                            combatant={m}
                            mode={'template ' + this.state.page}
                            filter={this.state.filter.text}
                            copyTrait={trait => this.copyTrait(trait)}
                        />
                    </div>
                );
            } else {
                return null;
            }
        }).filter(m => !!m);

        return monsterCards;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    public render() {
        try {
            const pages = [
                {
                    id: 'overview',
                    text: 'overview'
                },
                {
                    id: 'abilities',
                    text: 'abilities'
                },
                {
                    id: 'cbt-stats',
                    text: 'combat'
                },
                {
                    id: 'actions',
                    text: 'actions'
                }
            ];

            let monsters: Monster[] = [];
            if (this.props.showMonsters) {
                monsters = this.getMonsters();
            }

            let content = null;
            switch (this.state.page) {
                case 'overview':
                    const catOptions = CATEGORY_TYPES.map(cat => ({ id: cat, text: cat }));
                    const sizeOptions = SIZE_TYPES.map(size => ({ id: size, text: size }));

                    content = (
                        <div className='row'>
                            <div className='columns small-6 medium-6 large-6'>
                                <div className='subheading'>name</div>
                                <input type='text' value={this.state.monster.name} onChange={event => this.changeValue('name', event.target.value)} />
                                <div className='subheading'>size</div>
                                <Dropdown
                                    options={sizeOptions}
                                    selectedID={this.state.monster.size}
                                    select={optionID => this.changeValue('size', optionID)}
                                />
                                <div className='subheading'>type</div>
                                <Dropdown
                                    options={catOptions}
                                    selectedID={this.state.monster.category}
                                    select={optionID => this.changeValue('category', optionID)}
                                />
                                <div className='subheading'>subtype</div>
                                <input type='text' value={this.state.monster.tag} onChange={event => this.changeValue('tag', event.target.value)} />
                                <div className='subheading'>alignment</div>
                                <input type='text' value={this.state.monster.alignment} onChange={event => this.changeValue('alignment', event.target.value)} />
                            </div>
                            <div className='columns small-6 medium-6 large-6'>
                                <div className='subheading'>challenge rating</div>
                                <Spin
                                    source={this.state.monster}
                                    name='challenge'
                                    display={value => Utils.challenge(value)}
                                    nudgeValue={delta => this.nudgeValue('challenge', delta)}
                                />
                                <div className='subheading'>speed</div>
                                <input type='text' value={this.state.monster.speed} onChange={event => this.changeValue('speed', event.target.value)} />
                                <div className='subheading'>senses</div>
                                <input type='text' value={this.state.monster.senses} onChange={event => this.changeValue('senses', event.target.value)} />
                                <div className='subheading'>languages</div>
                                <input type='text' value={this.state.monster.languages} onChange={event => this.changeValue('languages', event.target.value)} />
                                <div className='subheading'>equipment</div>
                                <input type='text' value={this.state.monster.equipment} onChange={event => this.changeValue('equipment', event.target.value)} />
                            </div>
                        </div>
                    );
                    break;
                case 'abilities':
                    content = (
                        <div className='row'>
                            <div className='columns small-6 medium-6 large-6'>
                                <div className='subheading'>ability scores</div>
                                <AbilityScorePanel
                                    edit={true}
                                    combatant={this.state.monster}
                                    nudgeValue={(source, type, delta) => this.nudgeValue(type, delta)}
                                />
                            </div>
                            <div className='columns small-6 medium-6 large-6'>
                                <div className='subheading'>saving throws</div>
                                <input
                                    type='text'
                                    value={this.state.monster.savingThrows}
                                    onChange={event => this.changeValue('savingThrows', event.target.value)}
                                />
                                <div className='subheading'>skills</div>
                                <input
                                    type='text'
                                    value={this.state.monster.skills}
                                    onChange={event => this.changeValue('skills', event.target.value)}
                                />
                            </div>
                        </div>
                    );
                    break;
                case 'cbt-stats':
                    content = (
                        <div className='row'>
                            <div className='columns small-6 medium-6 large-6'>
                                <div className='subheading'>armor class</div>
                                <Spin
                                    source={this.state.monster}
                                    name='ac'
                                    nudgeValue={delta => this.nudgeValue('ac', delta)}
                                />
                                <div className='subheading'>hit dice</div>
                                <Spin
                                    source={this.state.monster}
                                    name='hitDice'
                                    display={value => value + 'd' + Utils.hitDieType(this.state.monster.size)}
                                    nudgeValue={delta => this.nudgeValue('hitDice', delta)}
                                />
                                <div className='subheading'>hit points</div>
                                <div className='hp-value'>{this.state.monster.hpMax} hp</div>
                            </div>
                            <div className='columns small-6 medium-6 large-6'>
                                <div className='subheading'>damage resistances</div>
                                <input
                                    type='text'
                                    value={this.state.monster.damage.resist}
                                    onChange={event => this.changeValue('damage.resist', event.target.value)}
                                />
                                <div className='subheading'>damage vulnerabilities</div>
                                <input
                                    type='text'
                                    value={this.state.monster.damage.vulnerable}
                                    onChange={event => this.changeValue('damage.vulnerable', event.target.value)}
                                />
                                <div className='subheading'>damage immunities</div>
                                <input
                                    type='text'
                                    value={this.state.monster.damage.immune}
                                    onChange={event => this.changeValue('damage.immune', event.target.value)}
                                />
                                <div className='subheading'>condition immunities</div>
                                <input
                                    type='text'
                                    value={this.state.monster.conditionImmunities}
                                    onChange={event => this.changeValue('conditionImmunities', event.target.value)}
                                />
                            </div>
                        </div>
                    );
                    break;
                case 'actions':
                    content = (
                        <TraitsPanel
                            combatant={this.state.monster}
                            mode='edit'
                            addTrait={type => this.addTrait(type)}
                            removeTrait={trait => this.removeTrait(trait)}
                            swapTraits={(t1, t2) => this.swapTraits(t1, t2)}
                            changeValue={(trait, type, value) => this.changeTrait(trait, type, value)}
                        />
                    );
                    break;
                default:
                    // Do nothing
                    break;
            }

            let help = null;
            if (this.props.showMonsters && (monsters.length > 1)) {
                let selector = null;
                if (this.getHelpOptionsForPage(this.state.page).length > 1) {
                    const options = this.getHelpOptionsForPage(this.state.page).map(s => {
                        return {
                            id: s,
                            text: s
                        };
                    });
                    selector = (
                        <Selector
                            tabs={false}
                            options={options}
                            selectedID={this.state.helpSection}
                            select={optionID => this.setHelpSection(optionID)}
                        />
                    );
                }

                help = (
                    <div className='monster-help'>
                        <div className='subheading'>information from similar monsters</div>
                        {selector}
                        {this.getHelpSection(monsters)}
                    </div>
                );
            }

            let monsterList = null;
            if (this.props.showMonsters) {
                let searchBox = null;
                if ((this.state.page === 'actions') && (monsters.length > 0)) {
                    searchBox = (
                        <input
                            type='text'
                            placeholder='search for traits and actions'
                            value={this.state.filter.text}
                            onChange={event => this.setFilterText(event.target.value)}
                        />
                    );
                }
                monsterList = (
                    <div className='columns small-4 medium-4 large-4 scrollable list-column'>
                        {this.getFilterCard(monsters)}
                        {searchBox}
                        {this.getMonsterCards(monsters)}
                    </div>
                );
            }

            return (
                <div className='row' style={{ height: '100%', margin: '0 -15px' }}>
                    <div
                        className={
                            this.props.showMonsters
                            ? 'columns small-8 medium-8 large-8 scrollable'
                            : 'columns small-12 medium-12 large-12 scrollable'
                        }
                        style={{ transition: 'none' }}
                    >
                        <div className='section'>
                            <Selector
                                tabs={true}
                                options={pages}
                                selectedID={this.state.page}
                                select={optionID => this.setPage(optionID as 'overview' | 'abilities' | 'cbt-stats' | 'actions')}
                            />
                            {content}
                            {help}
                        </div>
                    </div>
                    {monsterList}
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}
