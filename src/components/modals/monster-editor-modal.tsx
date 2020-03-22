import { MenuOutlined } from '@ant-design/icons';
import { Col, Drawer, Row } from 'antd';
import React from 'react';
import { List } from 'react-movable';

import Factory from '../../utils/factory';
import Frankenstein from '../../utils/frankenstein';
import Napoleon from '../../utils/napoleon';
import Shakespeare from '../../utils/shakespeare';
import Utils from '../../utils/utils';

import { MonsterFilter } from '../../models/encounter';
import { CATEGORY_TYPES, Monster, MonsterGroup, Trait, TRAIT_TYPES } from '../../models/monster-group';

import MonsterCard from '../cards/monster-card';
import Checkbox from '../controls/checkbox';
import Dropdown from '../controls/dropdown';
import Expander from '../controls/expander';
import NumberSpin from '../controls/number-spin';
import Selector from '../controls/selector';
import Tabs from '../controls/tabs';
import Textbox from '../controls/textbox';
import AbilityScorePanel from '../panels/ability-score-panel';
import FilterPanel from '../panels/filter-panel';
import Note from '../panels/note';
import PortraitPanel from '../panels/portrait-panel';
import ImageSelectionModal from './image-selection-modal';

interface Props {
    monster: Monster;
    library: MonsterGroup[];
    showSidebar: boolean;
}

interface State {
    monster: Monster;
    page: 'overview' | 'abilities' | 'cbt-stats' | 'actions';
    showFilter: boolean;
    helpSection: string;
    sidebar: 'similar' | 'all';
    similarFilter: {
        size: boolean,
        type: boolean,
        subtype: boolean,
        alignment: boolean,
        challenge: boolean
    };
    scratchpadFilter: MonsterFilter;
    scratchpadList: Monster[];
    showImageSelection: boolean;
}

export default class MonsterEditorModal extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            monster: props.monster,
            page: 'overview',
            showFilter: false,
            helpSection: 'speed',
            sidebar: 'similar',
            similarFilter: {
                size: true,
                type: true,
                subtype: false,
                alignment: false,
                challenge: true
            },
            scratchpadFilter: Factory.createMonsterFilter(),
            scratchpadList: [],
            showImageSelection: false
        };
    }

    private setPage(page: 'overview' | 'abilities' | 'cbt-stats' | 'actions') {
        const sections = this.getHelpOptionsForPage(page);
        this.setState({
            page: page,
            helpSection: sections[0]
        });
    }

    private setHelpSection(section: string) {
        this.setState({
            helpSection: section
        });
    }

    private toggleMatch(type: 'size' | 'type' | 'subtype' | 'alignment' | 'challenge') {
        const filter = this.state.similarFilter;
        filter[type] = !filter[type];
        this.setState({
            similarFilter: filter
        });
    }

    private toggleImageSelection() {
        this.setState({
            showImageSelection: !this.state.showImageSelection
        });
    }

    private addToScratchpad(monster: Monster) {
        const list = this.state.scratchpadList;
        list.push(monster);
        Utils.sort(list);
        this.setState({
            scratchpadList: list
        });
    }

    private removeFromScratchpad(monster: Monster) {
        const index = this.state.scratchpadList.indexOf(monster);
        this.state.scratchpadList.splice(index, 1);
        this.setState({
            scratchpadList: this.state.scratchpadList
        });
    }

    private addAllToScratchpad(monsters: Monster[]) {
        const list = this.state.scratchpadList;
        monsters.forEach(m => list.push(m));
        Utils.sort(list);
        this.setState({
            scratchpadList: list
        });
    }

    private clearScratchpad() {
        this.setState({
            scratchpadList: []
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
                return ['armor class', 'hit dice', 'resist', 'vulnerable', 'immune', 'conditions'];
            case 'actions':
                return ['actions'];
            default:
                return [];
        }
    }

    private getSimilarMonsters() {
        const monsters: Monster[] = [];
        this.props.library.forEach(group => {
            group.monsters.forEach(monster => {
                let match = true;

                if (this.state.monster.id === monster.id) {
                    match = false;
                }

                if (this.state.similarFilter.size && (this.state.monster.size !== monster.size)) {
                    match = false;
                }

                if (this.state.similarFilter.type && (this.state.monster.category !== monster.category)) {
                    match = false;
                }

                if (this.state.similarFilter.subtype && (this.state.monster.tag !== monster.tag)) {
                    match = false;
                }

                if (this.state.similarFilter.alignment && (this.state.monster.alignment !== monster.alignment)) {
                    match = false;
                }

                if (this.state.similarFilter.challenge && (this.state.monster.challenge !== monster.challenge)) {
                    match = false;
                }

                if (match) {
                    monsters.push(monster);
                }
            });
        });

        return monsters;
    }

    private setRandomValue(field: string, monsters: Monster[]) {
        Frankenstein.setRandomValue(this.state.monster, field, monsters);
        this.setState({
            monster: this.state.monster
        });
    }

    private spliceMonsters(monsters: Monster[]) {
        Frankenstein.spliceMonsters(this.state.monster, monsters);
        this.setState({
            monster: this.state.monster
        });
    }

    private addTrait(type: 'trait' | 'action' | 'bonus' | 'reaction' | 'legendary' | 'lair') {
        Frankenstein.addTrait(this.state.monster, type);
        this.setState({
            monster: this.state.monster
        });
    }

    private addRandomTrait(type: string, monsters: Monster[]) {
        Frankenstein.addRandomTrait(this.state.monster, type, monsters);
        this.setState({
            monster: this.state.monster
        });
    }

    private moveTrait(trait: Trait, moveBefore: Trait) {
        const oldIndex = this.state.monster.traits.indexOf(trait);
        const newIndex = this.state.monster.traits.indexOf(moveBefore);
        Frankenstein.moveTrait(this.state.monster, oldIndex, newIndex);
        this.setState({
            monster: this.state.monster
        });
    }

    private removeTrait(trait: Trait) {
        Frankenstein.removeTrait(this.state.monster, trait);
        this.setState({
            monster: this.state.monster
        });
    }

    private copyTrait(trait: Trait) {
        Frankenstein.copyTrait(this.state.monster, trait);
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
        Frankenstein.nudgeValue(this.state.monster, field, delta);
        this.setState({
            monster: this.state.monster
        });
    }

    private changeValue(field: string, value: any) {
        Frankenstein.changeValue(this.state.monster, field, value);
        this.setState({
            monster: this.state.monster,
            showImageSelection: false
        });
    }

    private changeFilterValue(type: 'name' | 'challenge' | 'category' | 'size', value: any) {
        const filter = this.state.scratchpadFilter as any;
        if (type === 'challenge') {
            filter.challengeMin = value[0];
            filter.challengeMax = value[1];
        } else {
            filter[type] = value;
        }
        this.setState({
            scratchpadFilter: filter
        });
    }

    private resetFilter() {
        this.setState({
            scratchpadFilter: Factory.createMonsterFilter()
        });
    }

    private matchMonster(monster: Monster) {
        return Napoleon.matchMonster(monster, this.state.scratchpadFilter);
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
            case 'resist':
                return this.getValueSection('damage.resist', 'text', monsters);
            case 'vulnerable':
                return this.getValueSection('damage.vulnerable', 'text', monsters);
            case 'immune':
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
                Utils.sort(distinct, [{ field: 'value', dir: 'asc' }]);
                break;
            case 'text':
                Utils.sort(distinct, [{ field: 'count', dir: 'desc' }, { field: 'value', dir: 'asc' }]);
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
                <Row gutter={10} className='value-list' key={distinct.indexOf(d)}>
                    <Col span={8} className='text-container'>
                        {d.value || '(none specified)'}
                    </Col>
                    <Col span={8} className='bar-container'>
                        <div className='bar' style={{ width: width + '%' }} />
                    </Col>
                    <Col span={8}>
                        <button onClick={() => this.changeValue(field, d.value)}>use this value</button>
                    </Col>
                </Row>
            );
        });

        return (
            <div>
                {valueSections}
                <button onClick={() => this.setRandomValue(field, monsters)}>select random value</button>
            </div>
        );
    }

    private getActionsSection(monsters: Monster[]) {
        const rows = [];
        rows.push(
            <Row gutter={10} className='value-list' key='header'>
                <Col span={8} className='text-container'>
                    <b>type</b>
                </Col>
                <Col span={4} className='text-container number'>
                    <b>avg</b>
                </Col>
                <Col span={4} className='text-container number'>
                    <b>min - max</b>
                </Col>
            </Row>
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
                <Row gutter={10} className='value-list' key={type}>
                    <Col span={8} className={count === 0 ? 'text-container disabled' : 'text-container'}>
                        {Utils.traitType(type, true)}
                    </Col>
                    <Col span={4} className={count === 0 ? 'text-container number disabled' : 'text-container number'}>
                        {avg}
                    </Col>
                    <Col span={4} className={count === 0 ? 'text-container number disabled' : 'text-container number'}>
                        {min} - {max}
                    </Col>
                    <Col span={8}>
                        <button className={count === 0 ? 'disabled' : ''} onClick={() => this.addRandomTrait(type, monsters)}>add random</button>
                    </Col>
                </Row>
            );
        });

        return (
            <div>
                {rows}
            </div>
        );
    }

    private getSidebar() {
        let sidebar = null;

        if (this.props.showSidebar) {
            let monsters: Monster[] = [];
            if (this.props.showSidebar) {
                switch (this.state.sidebar) {
                    case 'similar':
                        monsters = this.getSimilarMonsters();
                        break;
                    case 'all':
                        this.props.library.forEach(group => {
                            group.monsters.forEach(m => {
                                if (!monsters.includes(m) && this.matchMonster(m)) {
                                    monsters.push(m);
                                }
                            });
                        });
                        break;
                }
            }
            monsters = monsters.filter(m => !this.state.scratchpadList.find(lm => lm.id === m.id));
            Utils.sort(monsters);

            let sidebarContent = null;
            switch (this.state.sidebar) {
                case 'similar':
                    sidebarContent = (
                        <Expander text='similarity criteria'>
                            <Checkbox
                                label={'size ' + this.state.monster.size}
                                checked={this.state.similarFilter.size}
                                changeValue={value => this.toggleMatch('size')}
                            />
                            <Checkbox
                                label={'type ' + this.state.monster.category}
                                checked={this.state.similarFilter.type}
                                changeValue={value => this.toggleMatch('type')}
                            />
                            <Checkbox
                                label={this.state.monster.tag ? 'subtype ' + this.state.monster.tag : 'subtype'}
                                checked={this.state.similarFilter.subtype}
                                disabled={!this.state.monster.tag}
                                changeValue={value => this.toggleMatch('subtype')}
                            />
                            <Checkbox
                                label={this.state.monster.alignment ? 'alignment ' + this.state.monster.alignment : 'alignment'}
                                checked={this.state.similarFilter.alignment}
                                disabled={!this.state.monster.alignment}
                                changeValue={value => this.toggleMatch('alignment')}
                            />
                            <Checkbox
                                label={'challenge rating ' + Utils.challenge(this.state.monster.challenge)}
                                checked={this.state.similarFilter.challenge}
                                changeValue={value => this.toggleMatch('challenge')}
                            />
                        </Expander>
                    );
                    break;
                case 'all':
                    sidebarContent = (
                        <FilterPanel
                            filter={this.state.scratchpadFilter}
                            noTopMargin={true}
                            changeValue={(type, value) => this.changeFilterValue(type, value)}
                            resetFilter={() => this.resetFilter()}
                        />
                    );
                    break;
            }

            const sidebarOptions = [
                {
                    id: 'similar',
                    text: 'similar'
                },
                {
                    id: 'all',
                    text: 'all'
                }
            ];

            let emptyScratchpadNote = null;
            if (this.state.scratchpadList.length === 0) {
                /* tslint:disable:max-line-length */
                emptyScratchpadNote = (
                    <Note>
                        <div className='section'>
                            this is your <b>scratchpad</b> list; you can add monsters to it from the list to the right
                        </div>
                        <div className='section'>
                            you might find this useful if you're creating a monster and want it to have similar abilities to other monsters
                        </div>
                        <div className='section'>
                            when there are monsters in this list, their combined stats will be shown on the left
                        </div>
                        <div className='section'>
                            you can also quickly blend together all the monters in this list to create a new monster by clicking the <b>generate hybrid monster</b> button above
                        </div>
                    </Note>
                );
                /* tslint:enable:max-line-length */
            }
            let emptyListNote = null;
            if (monsters.length === 0) {
                emptyListNote = (
                    <Note>
                        <div className='section'>
                            there are no monsters in your library which match the above criteria (or they are all in your scratchpad already)
                        </div>
                    </Note>
                );
            }
            sidebar = (
                <Col span={12} className='scrollable sidebar sidebar-right'>
                    <Row gutter={5}>
                        <Col span={12}>
                            <Tabs
                                options={[{ id: 'scratch', text: 'scratchpad' }]}
                                selectedID={'scratch'}
                                select={() => null}
                            />
                            <button
                                className={this.state.scratchpadList.length < 2 ? 'disabled' : ''}
                                onClick={() => this.spliceMonsters(this.state.scratchpadList)}
                            >
                                generate hybrid monster
                            </button>
                            <button
                                className={monsters.length === 0 ? 'disabled' : ''}
                                onClick={() => this.addAllToScratchpad(monsters)}
                            >
                                add all from right
                            </button>
                            <button
                                className={this.state.scratchpadList.length === 0 ? 'disabled' : ''}
                                onClick={() => this.clearScratchpad()}
                            >
                                clear scratchpad
                            </button>
                            <div className='divider'/>
                            {this.getMonsterCards(this.state.scratchpadList, true)}
                            {emptyScratchpadNote}
                        </Col>
                        <Col span={12}>
                            <Tabs
                                options={sidebarOptions}
                                selectedID={this.state.sidebar}
                                select={optionID => this.setState({sidebar: optionID as 'similar' | 'all'})}
                            />
                            {sidebarContent}
                            <div className='divider'/>
                            {this.getMonsterCards(monsters, false)}
                            {emptyListNote}
                        </Col>
                    </Row>
                </Col>
            );
        } else {
            let stats = null;
            const details = Utils.challengeDetails().find(x => x.cr === this.state.monster.challenge);
            if (details) {
                stats = (
                    <Expander text='suggested stats'>
                        <div className='section'>
                            <Row>
                                <Col span={16}>challenge</Col>
                                <Col span={8} className='statistic-value'>{details.cr}</Col>
                            </Row>
                        </div>
                        <div className='section'>
                            <Row>
                                <Col span={16}>armor class</Col>
                                <Col span={8} className='statistic-value'>{details.ac}</Col>
                            </Row>
                        </div>
                        <div className='section'>
                            <Row>
                                <Col span={16}>hit points</Col>
                                <Col span={8} className='statistic-value'>{details.hpMin} - {details.hpMax}</Col>
                            </Row>
                        </div>
                        <div className='section'>
                            <Row>
                                <Col span={16}>attack bonus</Col>
                                <Col span={8} className='statistic-value'>{details.attack}</Col>
                            </Row>
                        </div>
                        <div className='section'>
                            <Row>
                                <Col span={16}>damage / rnd</Col>
                                <Col span={8} className='statistic-value'>{details.dmgMin} - {details.dmgMax}</Col>
                            </Row>
                        </div>
                        <div className='section'>
                            <Row>
                                <Col span={16}>save dc</Col>
                                <Col span={8} className='statistic-value'>{details.save}</Col>
                            </Row>
                        </div>
                    </Expander>
                );
            }

            sidebar = (
                <Col span={12} className='scrollable sidebar sidebar-right' style={{ padding: '5px' }}>
                    {stats}
                    {stats ? <div className='divider' /> : null}
                    <MonsterCard monster={this.state.monster} />
                </Col>
            );
        }

        return sidebar;
    }

    private getMonsterCards(monsters: Monster[], selected: boolean) {
        const sorted = Utils.sort(monsters);
        return sorted.map(m => {
            return (
                <div className='section' key={m.id}>
                    <MonsterCard
                        monster={m}
                        mode={'template ' + this.state.page + (selected ? ' selected' : '')}
                        copyTrait={trait => this.copyTrait(trait)}
                        selectMonster={monster => this.addToScratchpad(monster)}
                        deselectMonster={monster => this.removeFromScratchpad(monster)}
                    />
                </div>
            );
        }).filter(m => !!m);
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

            let content = null;
            switch (this.state.page) {
                case 'overview':
                    content = (
                        <OverviewTab
                            monster={this.state.monster}
                            toggleImageSelection={() => this.toggleImageSelection()}
                            changeValue={(field, value) => this.changeValue(field, value)}
                            nudgeValue={(field, delta) => this.nudgeValue(field, delta)}
                        />
                    );
                    break;
                case 'abilities':
                    content = (
                        <AbilitiesTab
                            monster={this.state.monster}
                            changeValue={(field, value) => this.changeValue(field, value)}
                            nudgeValue={(field, delta) => this.nudgeValue(field, delta)}
                        />
                    );
                    break;
                case 'cbt-stats':
                    content = (
                        <CombatTab
                            monster={this.state.monster}
                            changeValue={(field, value) => this.changeValue(field, value)}
                            nudgeValue={(field, delta) => this.nudgeValue(field, delta)}
                        />
                    );
                    break;
                case 'actions':
                    content = (
                        <TraitsTab
                            monster={this.state.monster}
                            addTrait={type => this.addTrait(type)}
                            moveTrait={(trait, moveBefore) => this.moveTrait(trait, moveBefore)}
                            removeTrait={trait => this.removeTrait(trait)}
                            changeValue={(trait, type, value) => this.changeTrait(trait, type, value)}
                        />
                    );
                    break;
                default:
                    // Do nothing
                    break;
            }

            let help = null;
            if (this.props.showSidebar && (this.state.scratchpadList.length > 0)) {
                let selector = null;
                if (this.getHelpOptionsForPage(this.state.page).length > 1) {
                    const options = this.getHelpOptionsForPage(this.state.page).map(s => {
                        return {
                            id: s,
                            text: s
                        };
                    });
                    selector = (
                        <div>
                            <div className='subheading'>fields</div>
                            <Selector
                                options={options}
                                selectedID={this.state.helpSection}
                                select={optionID => this.setHelpSection(optionID)}
                            />
                            <div className='subheading'>values</div>
                        </div>
                    );
                }

                help = (
                    <div className='monster-help group-panel'>
                        <div className='heading'>information from scratchpad monsters</div>
                        {selector}
                        {this.getHelpSection(this.state.scratchpadList)}
                    </div>
                );
            }

            return (
                <Row className='full-height'>
                    <Col span={12} className='scrollable'>
                        <Tabs
                            options={pages}
                            selectedID={this.state.page}
                            select={optionID => this.setPage(optionID as 'overview' | 'abilities' | 'cbt-stats' | 'actions')}
                        />
                        {content}
                        {help}
                    </Col>
                    {this.getSidebar()}
                    <Drawer visible={this.state.showImageSelection} closable={false} onClose={() => this.toggleImageSelection()}>
                        <ImageSelectionModal select={id => this.changeValue('portrait', id)} cancel={() => this.toggleImageSelection()} />
                    </Drawer>
                </Row>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}

interface OverviewTabProps {
    monster: Monster;
    toggleImageSelection: () => void;
    changeValue: (field: string, value: any) => void;
    nudgeValue: (field: string, delta: number) => void;
}

class OverviewTab extends React.Component<OverviewTabProps> {
    private randomName() {
        let name = Shakespeare.generateName();
        name = name[0].toUpperCase() + name.substr(1);
        this.props.changeValue('name', name);
    }

    public render() {
        try {
            const catOptions = CATEGORY_TYPES.map(cat => ({ id: cat, text: cat }));

            return (
                <Row gutter={10} key='overview'>
                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                        <div className='subheading'>name</div>
                        <Textbox
                            text={this.props.monster.name}
                            onChange={value => this.props.changeValue('name', value)}
                        />
                        <button onClick={() => this.randomName()}>generate a random name</button>
                        <div className='subheading'>size</div>
                        <NumberSpin
                            source={this.props.monster}
                            name='size'
                            nudgeValue={delta => this.props.nudgeValue('size', delta)}
                        />
                        <div className='subheading'>type</div>
                        <Dropdown
                            options={catOptions}
                            selectedID={this.props.monster.category}
                            select={optionID => this.props.changeValue('category', optionID)}
                        />
                        <div className='subheading'>subtype</div>
                        <Textbox
                            text={this.props.monster.tag}
                            onChange={value => this.props.changeValue('tag', value)}
                        />
                        <div className='subheading'>alignment</div>
                        <Textbox
                            text={this.props.monster.alignment}
                            onChange={value => this.props.changeValue('alignment', value)}
                        />
                        <div className='subheading'>challenge rating</div>
                        <NumberSpin
                            source={this.props.monster}
                            name='challenge'
                            display={value => Utils.challenge(value)}
                            nudgeValue={delta => this.props.nudgeValue('challenge', delta)}
                        />
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                        <div className='subheading'>speed</div>
                        <Textbox
                            text={this.props.monster.speed}
                            onChange={value => this.props.changeValue('speed', value)}
                        />
                        <div className='subheading'>senses</div>
                        <Textbox
                            text={this.props.monster.senses}
                            onChange={value => this.props.changeValue('senses', value)}
                        />
                        <div className='subheading'>languages</div>
                        <Textbox
                            text={this.props.monster.languages}
                            onChange={value => this.props.changeValue('languages', value)}
                        />
                        <div className='subheading'>equipment</div>
                        <Textbox
                            text={this.props.monster.equipment}
                            onChange={value => this.props.changeValue('equipment', value)}
                        />
                        <div className='subheading'>portrait</div>
                        <PortraitPanel
                            source={this.props.monster}
                            edit={() => this.props.toggleImageSelection()}
                            clear={() => this.props.changeValue('portrait', '')}
                        />
                    </Col>
                </Row>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}

interface AbilitiesTabProps {
    monster: Monster;
    changeValue: (field: string, value: any) => void;
    nudgeValue: (field: string, delta: number) => void;
}

class AbilitiesTab extends React.Component<AbilitiesTabProps> {
    public render() {
        try {
            return (
                <Row gutter={10} key='abilities'>
                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                        <div className='subheading'>ability scores</div>
                        <AbilityScorePanel
                            edit={true}
                            combatant={this.props.monster}
                            nudgeValue={(source, type, delta) => this.props.nudgeValue(type, delta)}
                        />
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                        <div className='subheading'>saving throws</div>
                        <Textbox
                            text={this.props.monster.savingThrows}
                            onChange={value => this.props.changeValue('savingThrows', value)}
                        />
                        <div className='subheading'>skills</div>
                        <Textbox
                            text={this.props.monster.skills}
                            onChange={value => this.props.changeValue('skills', value)}
                        />
                    </Col>
                </Row>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}

interface CombatTabProps {
    monster: Monster;
    changeValue: (field: string, value: any) => void;
    nudgeValue: (field: string, delta: number) => void;
}

class CombatTab extends React.Component<CombatTabProps> {
    public render() {
        try {
            return (
                <Row gutter={10} key='cbt-stats'>
                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                        <div className='subheading'>armor class</div>
                        <NumberSpin
                            source={this.props.monster}
                            name='ac'
                            nudgeValue={delta => this.props.nudgeValue('ac', delta)}
                        />
                        <div className='subheading'>hit dice</div>
                        <NumberSpin
                            source={this.props.monster}
                            name='hitDice'
                            display={value => value + 'd' + Utils.hitDieType(this.props.monster.size)}
                            nudgeValue={delta => this.props.nudgeValue('hitDice', delta)}
                        />
                        <div className='subheading'>hit points</div>
                        <div className='hp-value'>{Frankenstein.getTypicalHP(this.props.monster)} hp</div>
                        <div className='subheading'>legendary actions</div>
                        <NumberSpin
                            source={this.props.monster}
                            name='legendaryActions'
                            nudgeValue={delta => this.props.nudgeValue('legendaryActions', delta)}
                        />
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                        <div className='subheading'>damage resistances</div>
                        <Textbox
                            text={this.props.monster.damage.resist}
                            onChange={value => this.props.changeValue('damage.resist', value)}
                        />
                        <div className='subheading'>damage vulnerabilities</div>
                        <Textbox
                            text={this.props.monster.damage.vulnerable}
                            onChange={value => this.props.changeValue('damage.vulnerable', value)}
                        />
                        <div className='subheading'>damage immunities</div>
                        <Textbox
                            text={this.props.monster.damage.immune}
                            onChange={value => this.props.changeValue('damage.immune', value)}
                        />
                        <div className='subheading'>condition immunities</div>
                        <Textbox
                            text={this.props.monster.conditionImmunities}
                            onChange={value => this.props.changeValue('conditionImmunities', value)}
                        />
                    </Col>
                </Row>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}

interface TraitsTabProps {
    monster: Monster;
    addTrait: (traitType: 'trait' | 'action' | 'bonus' | 'reaction' | 'legendary' | 'lair') => void;
    copyTrait: (trait: Trait) => void;
    moveTrait: (trait: Trait, moveBefore: Trait) => void;
    removeTrait: (trait: Trait) => void;
    changeValue: (trait: Trait, field: string, value: any) => void;
}

interface TraitsTabState {
    selectedTraitID: string | null;
}

class TraitsTab extends React.Component<TraitsTabProps, TraitsTabState> {
    constructor(props: TraitsTabProps) {
        super(props);
        this.state = {
            selectedTraitID: null
        };
    }

    public static defaultProps = {
        addTrait: null,
        copyTrait: null,
        removeTrait: null,
        changeValue: null,
        swapTraits: null
    };

    private setSelectedTraitID(id: string | null) {
        this.setState({
            selectedTraitID: id
        });
    }

    private createTraitBar(trait: Trait) {
        return (
            <TraitBarPanel
                key={trait.id}
                trait={trait}
                isSelected={trait.id === this.state.selectedTraitID}
                select={id => this.setSelectedTraitID(id)}
            />
        );
    }

    private moveTrait(trait: Trait, moveBefore: Trait) {
        this.props.moveTrait(trait, moveBefore);
    }

    private createSection(traitsByType: { [id: string]: Trait[] }, type: string) {
        const traits = traitsByType[type];

        return (
            <div>
                <div className='section subheading'>{Utils.traitType(type, true)}</div>
                <List
                    values={traits}
                    lockVertically={true}
                    onChange={({ oldIndex, newIndex }) => this.moveTrait(traits[oldIndex], traits[newIndex])}
                    renderList={({ children, props }) => <div {...props}>{children}</div>}
                    renderItem={({ value, props, isDragged }) => (
                        <div {...props} className={isDragged ? 'dragged' : ''}>
                            {this.createTraitBar(value)}
                        </div>
                    )}
                />
                <button onClick={() => this.props.addTrait(type as 'trait' | 'action' | 'bonus' | 'reaction' | 'legendary' | 'lair')}>
                    add a new {type}
                </button>
            </div>
        );
    }

    public render() {
        try {
            const options: { id: string, text: string }[] = [];
            const traitsByType: { [id: string]: Trait[] } = {};

            TRAIT_TYPES.forEach(type => {
                options.push({ id: type, text: Utils.traitType(type, false) });
                traitsByType[type] = this.props.monster.traits.filter(t => t.type === type);
            });

            const selectedTrait = this.props.monster.traits.find(t => t.id === this.state.selectedTraitID);
            let selection = null;
            if (selectedTrait) {
                selection = (
                    <TraitEditorPanel
                        trait={selectedTrait}
                        removeTrait={trait => this.props.removeTrait(trait)}
                        changeValue={(trait, type, value) => this.props.changeValue(trait, type, value)}
                    />
                );
            } else {
                selection = (
                    <Note>select one of the traits or actions from the column to the left to edit its details here</Note>
                );
            }

            return (
                <Row gutter={10}>
                    <Col span={10}>
                        {this.createSection(traitsByType, 'trait')}
                        {this.createSection(traitsByType, 'action')}
                        {this.createSection(traitsByType, 'bonus')}
                        {this.createSection(traitsByType, 'reaction')}
                        {this.createSection(traitsByType, 'legendary')}
                        {this.createSection(traitsByType, 'lair')}
                    </Col>
                    <Col span={14}>
                        {selection}
                    </Col>
                </Row>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}

interface TraitBarProps {
    trait: Trait;
    isSelected: boolean;
    select: (id: string) => void;
}

class TraitBarPanel extends React.Component<TraitBarProps> {
    public render() {
        try {
            return (
                <div className={this.props.isSelected ? 'trait-bar selected' : 'trait-bar'} onClick={() => this.props.select(this.props.trait.id)}>
                    <MenuOutlined className='grabber small' data-movable-handle={true} />
                    <div className='name'>
                        {this.props.trait.name || 'unnamed ' + Utils.traitType(this.props.trait.type, false)}
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}

interface TraitEditorPanelProps {
    trait: Trait;
    removeTrait: (trait: Trait) => void;
    changeValue: (trait: Trait, field: string, value: any) => void;
}

class TraitEditorPanel extends React.Component<TraitEditorPanelProps> {
    public render() {
        try {
            return (
                <div key={this.props.trait.id} className='section'>
                    <div className='subheading'>trait name</div>
                    <Textbox
                        text={this.props.trait.name}
                        onChange={value => this.props.changeValue(this.props.trait, 'name', value)}
                    />
                    <div className='subheading'>usage</div>
                    <Textbox
                        text={this.props.trait.usage}
                        onChange={value => this.props.changeValue(this.props.trait, 'usage', value)}
                    />
                    <div className='subheading'>details</div>
                    <Textbox
                        text={this.props.trait.text}
                        placeholder='details'
                        minLines={10}
                        maxLines={20}
                        onChange={value => this.props.changeValue(this.props.trait, 'text', value)}
                    />
                    <div className='divider' />
                    <button onClick={() => this.props.removeTrait(this.props.trait)}>remove this trait</button>
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
