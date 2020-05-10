import { Col, Row, Tag } from 'antd';
import React from 'react';

import { Combat, Combatant } from '../../models/combat';
import { Condition } from '../../models/condition';
import { Monster } from '../../models/monster-group';
import { Companion, PC } from '../../models/party';

import ConfirmButton from '../controls/confirm-button';
import Expander from '../controls/expander';
import NumberSpin from '../controls/number-spin';
import Radial from '../controls/radial';
import Selector from '../controls/selector';
import Textbox from '../controls/textbox';
import ConditionsPanel from './conditions-panel';
import Note from './note';

interface Props {
    combatants: Combatant[];
    combat: Combat;
    makeCurrent: (combatant: Combatant) => void;
    makeActive: (combatants: Combatant[]) => void;
    makeDefeated: (combatants: Combatant[]) => void;
    mapAdd: (combatant: Combatant) => void;
    mapMove: (combatants: Combatant[], dir: string) => void;
    mapRemove: (combatants: Combatant[]) => void;
    removeCombatants: (combatants: Combatant[]) => void;
    changeHP: (values: {id: string, hp: number, temp: number, damage: number}[]) => void;
    addCondition: (combatants: Combatant[]) => void;
    editCondition: (combatant: Combatant, condition: Condition) => void;
    removeCondition: (combatant: Combatant, condition: Condition) => void;
    nudgeConditionValue: (condition: Condition, field: string, delta: number) => void;
    toggleTag: (combatants: Combatant[], tag: string) => void;
    toggleCondition: (combatants: Combatant[], condition: string) => void;
    toggleHidden: (combatants: Combatant[]) => void;
    addCompanion: (companion: Companion) => void;
    changeValue: (monster: any, field: string, value: any) => void;
    nudgeValue: (source: any, field: string, delta: number) => void;
}

interface State {
    view: string;
    damageOrHealing: number;
    damageMultipliers: { [id: string]: number };
}

export default class CombatControlsPanel extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            view: 'main',
            damageOrHealing: 0,
            damageMultipliers: {}
        };
    }

    private nudgeDamage(delta: number) {
        this.setState({
            damageOrHealing: Math.max(this.state.damageOrHealing + delta, 0)
        });
    }

    private setView(view: string) {
        this.setState({
            view: view
        });
    }

    private setDamageMultiplier(id: string, multiplier: number) {
        const multipliers = this.state.damageMultipliers;
        multipliers[id] = multiplier;
        this.setState({
            damageMultipliers: multipliers
        });
    }

    private heal() {
        const value = this.state.damageOrHealing;

        this.setState({
            damageOrHealing: 0
        }, () => {
            const values: { id: string, hp: number, temp: number; damage: number }[] = [];
            this.props.combatants.forEach(combatant => {
                const hpMax = (combatant.hpMax ?? 0);

                let hp = (combatant.hpCurrent ?? 0) + value;
                hp = Math.min(hp, hpMax);

                values.push({
                    id: combatant.id,
                    hp: hp,
                    temp: combatant.hpTemp ?? 0,
                    damage: 0
                });
            });

            this.props.changeHP(values);
        });
    }

    private damage() {
        const value = this.state.damageOrHealing;

        this.setState({
            damageOrHealing: 0
        }, () => {
            const values: { id: string, hp: number, temp: number; damage: number }[] = [];
            this.props.combatants.forEach(combatant => {
                const multiplier = this.state.damageMultipliers[combatant.id] ?? 1;

                let hp = combatant.hpCurrent ?? 0;
                let temp = combatant.hpTemp ?? 0;

                const totalDamage = Math.floor(value * multiplier);
                let damage = totalDamage;

                // Take damage off temp HP first
                const val = Math.min(damage, temp);
                damage -= val;
                temp -= val;

                // Take the rest off HP
                hp -= damage;
                hp = Math.max(hp, 0);

                values.push({
                    id: combatant.id,
                    hp: hp,
                    temp: temp,
                    damage: totalDamage
                });
            });

            this.props.changeHP(values);
        });
    }

    private getMainSection() {
        if (this.props.combatants.every(c => c.pending)) {
            return (
                <div className='section'>pending initiative entry</div>
            );
        }

        if (this.props.combatants.every(c => c.active)) {
            const actions = [];
            if (this.props.combatants.every(c => c.current)) {
                actions.push(<button key='makeDefeated' onClick={() => this.props.makeDefeated(this.props.combatants)}>mark as defeated and end turn</button>);
            } else {
                if (this.props.combatants.length === 1) {
                    actions.push(<button key='makeCurrent' onClick={() => this.props.makeCurrent(this.props.combatants[0])}>start turn</button>);
                }
                actions.push(<button key='makeDefeated' onClick={() => this.props.makeDefeated(this.props.combatants)}>mark as defeated</button>);
            }

            const engaged: JSX.Element[] = [];
            if (this.props.combatants.every(c => c.type !== 'pc')) {
                const pcs = this.props.combat.combatants.filter(c => c.type === 'pc');
                pcs.forEach(pc => {
                    const tag = 'engaged:' + pc.displayName;
                    engaged.push(
                        <Tag.CheckableTag
                            key={pc.id}
                            checked={this.props.combatants.every(c => c.tags.includes(tag))}
                            onChange={() => this.props.toggleTag(this.props.combatants, tag)}
                        >
                            {pc.displayName}
                        </Tag.CheckableTag>
                    );
                });
            }
            let engagedSection = null;
            if (engaged.length > 0) {
                engagedSection = (
                    <div className='section'>
                        <b>engaged with: </b>
                        {engaged}
                    </div>
                );
            }

            return (
                <div>
                    {actions}
                    <div className='divider' />
                    <div className='section'>
                        <b>quick tags: </b>
                        <Tag.CheckableTag
                            checked={this.props.combatants.every(c => c.tags.includes('conc'))}
                            onChange={() => this.props.toggleTag(this.props.combatants, 'conc')}
                        >
                            concentrating
                        </Tag.CheckableTag>
                        <Tag.CheckableTag
                            checked={this.props.combatants.every(c => c.tags.includes('bane'))}
                            onChange={() => this.props.toggleTag(this.props.combatants, 'bane')}
                        >
                            bane
                        </Tag.CheckableTag>
                        <Tag.CheckableTag
                            checked={this.props.combatants.every(c => c.tags.includes('bless'))}
                            onChange={() => this.props.toggleTag(this.props.combatants, 'bless')}
                        >
                            bless
                        </Tag.CheckableTag>
                        <Tag.CheckableTag
                            checked={this.props.combatants.every(c => c.conditions.some(condition => condition.name === 'prone'))}
                            onChange={() => this.props.toggleCondition(this.props.combatants, 'prone')}
                        >
                            prone
                        </Tag.CheckableTag>
                        <Tag.CheckableTag
                            checked={this.props.combatants.every(c => c.conditions.some(condition => condition.name === 'unconscious'))}
                            onChange={() => this.props.toggleCondition(this.props.combatants, 'unconscious')}
                        >
                            unconscious
                        </Tag.CheckableTag>
                        <Tag.CheckableTag
                            checked={!this.props.combatants.every(c => c.showOnMap)}
                            onChange={() => this.props.toggleHidden(this.props.combatants)}
                        >
                            hidden
                        </Tag.CheckableTag>
                    </div>
                    {engagedSection}
                </div>
            );
        }

        if (this.props.combatants.every(c => c.defeated)) {
            return (
                <button onClick={() => this.props.makeActive(this.props.combatants)}>mark as active</button>
            );
        }

        return (
            <Note>
                <div className='section'>multiple combatants are selected</div>
            </Note>
        );
    }

    private getHPSection() {
        if (!this.props.combatants.every(c => c.type === 'monster')) {
            return null;
        }

        let current = null;
        if (this.props.combatants.length === 1) {
            const monster = this.props.combatants[0] as Combatant & Monster;
            current = (
                <div>
                    <NumberSpin
                        source={monster}
                        name='hpCurrent'
                        label='hit points'
                        factors={[1, 10]}
                        nudgeValue={delta => this.props.nudgeValue(monster, 'hpCurrent', delta)}
                    />
                    <NumberSpin
                        source={monster}
                        name='hpTemp'
                        label='temp hp'
                        factors={[1, 10]}
                        nudgeValue={delta => this.props.nudgeValue(monster, 'hpTemp', delta)}
                    />
                    <div className='divider' />
                </div>
            );
        }

        const modifiers = this.props.combatants.map(c => {
            const monster = c as Combatant & Monster;
            let resist = null;
            let vuln = null;
            let immune = null;
            let conc = null;
            if (monster.damage.resist) {
                resist = (
                    <div className='section'>
                        <b>damage resistances</b> {monster.damage.resist} {this.props.combatants.length > 1 ? <i> - {c.displayName}</i> : null}
                    </div>
                );
            }
            if (monster.damage.vulnerable) {
                vuln = (
                    <div className='section'>
                        <b>damage vulnerabilities</b> {monster.damage.vulnerable} {this.props.combatants.length > 1 ? <i> - {c.displayName}</i> : null}
                    </div>
                );
            }
            if (monster.damage.immune) {
                immune = (
                    <div className='section'>
                        <b>damage immunities</b> {monster.damage.immune} {this.props.combatants.length > 1 ? <i> - {c.displayName}</i> : null}
                    </div>
                );
            }
            if (monster.tags.includes('conc')) {
                conc = (
                    <Note>
                        <div className='section'>
                            {monster.displayName} is <b>concentrating</b>, and will need to make a check if they take damage
                        </div>
                    </Note>
                );
            }
            if (resist || vuln || immune || conc) {
                return (
                    <div key={c.id}>
                        {resist}
                        {vuln}
                        {immune}
                        {conc}
                    </div>
                );
            }
            return null;
        });

        const degreeOptions = [
            { id: 'half', text: 'half' },
            { id: 'normal', text: 'normal' },
            { id: 'double', text: 'double' }
        ];
        const degrees = this.props.combatants.map(c => {
            let selected = 'normal';
            const multiplier = this.state.damageMultipliers[c.id] ?? 1;
            if (multiplier < 1) {
                selected = 'half';
            }
            if (multiplier > 1) {
                selected = 'double';
            }
            const selector = (
                <Selector
                    options={degreeOptions}
                    selectedID={selected}
                    select={id => {
                        let value = 1;
                        if (id === 'half') {
                            value = 0.5;
                        }
                        if (id === 'double') {
                            value = 2;
                        }
                        this.setDamageMultiplier(c.id, value);
                    }}
                />
            );
            if (this.props.combatants.length === 1) {
                return (
                    <div key={c.id}>
                        {selector}
                    </div>
                );
            }
            return (
                <Row key={c.id} align='middle' justify='center'>
                    <Col span={8}>
                        <div>{c.displayName}</div>
                    </Col>
                    <Col span={16}>
                        {selector}
                    </Col>
                </Row>
            );
        });

        let defeatedBtn = null;
        const atZero = this.props.combatants.filter(c => (c.hpCurrent != null) && (c.hpCurrent <= 0));
        if (atZero.length > 0) {
            const txt = (atZero.length === 1) && (atZero[0].current) ? 'mark as defeated and end turn' : 'mark as defeated';
            let names = null;
            if (this.props.combatants.length > 1) {
                names = (
                    <ul>
                        {atZero.map(c => <li key={c.id}>{c.displayName}</li>)}
                    </ul>
                );
            }
            defeatedBtn = (
                <button onClick={() => this.props.makeDefeated(atZero)}>
                    {txt}
                    {names}
                </button>
            );
        }

        return (
            <div>
                {current}
                {modifiers}
                <NumberSpin
                    source={this.state}
                    name='damageOrHealing'
                    factors={[1, 10]}
                    nudgeValue={delta => this.nudgeDamage(delta)}
                />
                <Row gutter={10}>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <button className={this.state.damageOrHealing === 0 ? 'disabled' : ''} onClick={() => this.heal()}>
                            heal
                        </button>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <button className={this.state.damageOrHealing === 0 ? 'disabled' : ''} onClick={() => this.damage()}>
                            damage
                        </button>
                    </Col>
                </Row>
                {degrees}
                {defeatedBtn}
            </div>
        );
    }

    private getConditionSection() {
        const conditionImmunities = this.props.combatants.map(c => {
            if (c.type !== 'monster') {
                return null;
            }

            const monster = c as Combatant & Monster;
            if (!monster.conditionImmunities) {
                return null;
            }

            return (
                <div key={c.id} className='section'>
                    <b>condition immunities</b> {monster.conditionImmunities} {this.props.combatants.length > 1 ? <i> - {c.displayName}</i> : null}
                </div>
            );
        });

        const conditions = (
            <ConditionsPanel
                combatants={this.props.combatants}
                combat={this.props.combat}
                addCondition={() => this.props.addCondition(this.props.combatants)}
                editCondition={(combatant, condition) => this.props.editCondition(combatant, condition)}
                removeCondition={(combatant, condition) => this.props.removeCondition(combatant, condition)}
                nudgeConditionValue={(condition, type, delta) => this.props.nudgeConditionValue(condition, type, delta)}
            />
        );

        return (
            <div>
                {conditionImmunities}
                {conditions}
            </div>
        );
    }

    private getMapSection() {
        if (!this.props.combat.map) {
            return null;
        }

        const allOnMap = this.props.combatants.every(c => {
            return this.props.combat.map && this.props.combat.map.items.find(i => i.id === c.id);
        });
        if (allOnMap) {
            let altitude = null;
            let aura = null;
            if (this.props.combatants.length === 1) {
                const combatant = this.props.combatants[0];
                altitude = (
                    <NumberSpin
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
                aura = (
                    <Expander text='aura'>
                        <NumberSpin
                            source={combatant.aura}
                            name='radius'
                            label='size'
                            display={value => value + ' ft.'}
                            nudgeValue={delta => this.props.nudgeValue(combatant.aura, 'radius', delta * 5)}
                        />
                        {auraDetails}
                    </Expander>
                );
            }

            return (
                <div>
                    <div className='section centered'>
                        <Radial click={dir => this.props.mapMove(this.props.combatants, dir)} />
                    </div>
                    <div className='divider' />
                    {altitude}
                    {aura}
                    <button onClick={() => this.props.mapRemove(this.props.combatants)}>remove from map</button>
                </div>
            );
        }

        if (this.props.combatants.length === 1) {
            return (
                <button key='mapAdd' onClick={() => this.props.mapAdd(this.props.combatants[0])}>add to map</button>
            );
        }

        return null;
    }

    private getAdvancedSection() {
        let remove = null;
        if (this.props.combatants.every(c => !c.current)) {
            remove = (
                <ConfirmButton text='remove from encounter' callback={() => this.props.removeCombatants(this.props.combatants)} />
            );
        }

        let changeName = null;
        let changeSize = null;
        let changeInit = null;
        if (this.props.combatants.length === 1) {
            const combatant = this.props.combatants[0];
            changeName = (
                <Expander text='change name'>
                    <Textbox
                        text={combatant.displayName}
                        onChange={value => this.props.changeValue(combatant, 'displayName', value)}
                    />
                </Expander>
            );

            changeSize = (
                <Expander text='change size'>
                    <NumberSpin
                        source={combatant}
                        name='displaySize'
                        label='size'
                        nudgeValue={delta => this.props.nudgeValue(combatant, 'displaySize', delta)}
                    />
                </Expander>
            );

            if (!combatant.pending) {
                changeInit = (
                    <Expander text='change initiative score'>
                        <NumberSpin
                            source={combatant}
                            name='initiative'
                            label='initiative'
                            nudgeValue={delta => this.props.nudgeValue(combatant, 'initiative', delta)}
                        />
                    </Expander>
                );
            }
        }

        const companions: JSX.Element[] = [];
        this.props.combatants
            .filter(c => c.type === 'pc')
            .forEach(pc => {
                (pc as Combatant & PC).companions
                    .filter(comp => !this.props.combat.combatants.find(c => c.id === comp.id))
                    .forEach(comp => {
                        companions.push(
                            <button key={comp.id} onClick={() => this.props.addCompanion(comp)}>add {comp.name}</button>
                        );
                    });
                });

        let notes = null;
        if (this.props.combatants.length === 1) {
            const combatant = this.props.combatants[0];
            notes = (
                <Textbox
                    text={combatant.note}
                    placeholder='notes'
                    multiLine={true}
                    onChange={value => this.props.changeValue(combatant, 'note', value)}
                />
            );
        }

        return (
            <div>
                {remove}
                {changeName}
                {changeSize}
                {changeInit}
                {companions}
                {notes}
            </div>
        );
    }

    public render() {
        try {
            const views = ['main', 'hp', 'cond', 'map', 'adv'].map(m => {
                return {
                    id: m,
                    text: m
                };
            });
            if (!this.props.combat.map) {
                // No combat map, so remove the map option
                views.splice(3, 1);
            }
            if (!this.props.combatants.every(c => c.type === 'monster')) {
                // Not everything is a monster, so can't change hit points
                views.splice(1, 1);
            }

            let currentView = this.state.view;
            if (!views.find(v => v.id === currentView)) {
                currentView = 'main';
            }

            let content = null;
            switch (currentView) {
                case 'main':
                    content = this.getMainSection();
                    break;
                case 'hp':
                    content = this.getHPSection();
                    break;
                case 'cond':
                    content = this.getConditionSection();
                    break;
                case 'map':
                    content = this.getMapSection();
                    break;
                case 'adv':
                    content = this.getAdvancedSection();
                    break;
            }

            const name = this.props.combatants.length === 1 ? this.props.combatants[0].displayName : 'multiple combatants';

            return (
                <div className='group-panel combat-controls'>
                    <div className='subheading'>{name}</div>
                    <Selector
                        options={views}
                        selectedID={currentView}
                        select={option => this.setView(option)}
                    />
                    <div className='divider' />
                    {content}
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
