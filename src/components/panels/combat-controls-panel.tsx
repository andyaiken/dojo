import React from 'react';

import { Col, Collapse, Icon, Input, Row } from 'antd';

import { Combat, Combatant } from '../../models/combat';
import { Condition } from '../../models/condition';
import { Monster } from '../../models/monster-group';

import Checkbox from '../controls/checkbox';
import ConfirmButton from '../controls/confirm-button';
import NumberSpin from '../controls/number-spin';
import Radial from '../controls/radial';
import Selector from '../controls/selector';
import ConditionsPanel from './conditions-panel';

interface Props {
    combatant: Combatant;
    combat: Combat;
    tactical: 'no-map' | 'on-map' | 'off-map';
    makeCurrent: (combatant: Combatant) => void;
    makeActive: (combatant: Combatant) => void;
    makeDefeated: (combatant: Combatant) => void;
    mapAdd: (combatant: Combatant) => void;
    mapMove: (combatant: Combatant, dir: string) => void;
    mapRemove: (combatant: Combatant) => void;
    removeCombatant: (combatant: Combatant) => void;
    changeHP: (combatant: Combatant, hp: number, tempHP: number, damage: number) => void;
    addCondition: (combatant: Combatant) => void;
    editCondition: (combatant: Combatant, condition: Condition) => void;
    removeCondition: (combatant: Combatant, conditionID: string) => void;
    nudgeConditionValue: (condition: Condition, field: string, delta: number) => void;
    toggleTag: (combatant: Combatant, tag: string) => void;
    toggleCondition: (combatant: Combatant, condition: string) => void;
    changeValue: (monster: any, field: string, value: any) => void;
    nudgeValue: (source: any, field: string, delta: number) => void;
}

interface State {
    view: string;
    damageOrHealing: number;
}

export default class CombatControlsPanel extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            view: 'main',
            damageOrHealing: 0
        };
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

    private setView(view: string) {
        this.setState({
            view: view
        });
    }

    private heal() {
        const combatant = this.props.combatant as Combatant & Monster;

        let hp = (combatant.hp ? combatant.hp : 0) + this.state.damageOrHealing;
        hp = Math.min(hp, combatant.hpMax);

        this.setState({
            damageOrHealing: 0
        }, () => {
            this.props.changeHP(combatant, hp, combatant.hpTemp, 0);
        });
    }

    private damage() {
        const combatant = this.props.combatant as Combatant & Monster;

        let hp = (combatant.hp ? combatant.hp : 0);
        let temp = combatant.hpTemp;

        const totalDamage = this.state.damageOrHealing;
        let damage = totalDamage;

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
            this.props.changeHP(combatant, hp, temp, totalDamage);
        });
    }

    private getMainSection() {
        if (this.props.combatant.pending && !this.props.combatant.active && !this.props.combatant.defeated) {
            return (
                <div className='section'>pending initiative entry</div>
            );
        }

        if (!this.props.combatant.pending && this.props.combatant.active && !this.props.combatant.defeated) {
            const options = [];
            if (this.props.combatant.current) {
                options.push(<button key='makeDefeated' onClick={() => this.props.makeDefeated(this.props.combatant)}>mark as defeated and end turn</button>);
            } else {
                options.push(<button key='makeCurrent' onClick={() => this.props.makeCurrent(this.props.combatant)}>start turn</button>);
                options.push(<button key='makeDefeated' onClick={() => this.props.makeDefeated(this.props.combatant)}>mark as defeated</button>);
            }
            return (
                <div>
                    {options}
                    <Row gutter={10}>
                        <Col span={8}>
                            <Checkbox
                                label='conc.'
                                display='button'
                                checked={this.props.combatant.tags.includes('conc')}
                                changeValue={value => this.props.toggleTag(this.props.combatant, 'conc')}
                            />
                        </Col>
                        <Col span={8}>
                            <Checkbox
                                label='bane'
                                display='button'
                                checked={this.props.combatant.tags.includes('bane')}
                                changeValue={value => this.props.toggleTag(this.props.combatant, 'bane')}
                            />
                        </Col>
                        <Col span={8}>
                            <Checkbox
                                label='bless'
                                display='button'
                                checked={this.props.combatant.tags.includes('bless')}
                                changeValue={value => this.props.toggleTag(this.props.combatant, 'bless')}
                            />
                        </Col>
                    </Row>
                    <Row gutter={10}>
                        <Col span={8}>
                            <Checkbox
                                label='prone'
                                display='button'
                                checked={this.props.combatant.conditions.some(c => c.name === 'prone')}
                                changeValue={value => this.props.toggleCondition(this.props.combatant, 'prone')}
                            />
                        </Col>
                        <Col span={8}>
                            <Checkbox
                                label='uncon.'
                                display='button'
                                checked={this.props.combatant.conditions.some(c => c.name === 'unconscious')}
                                changeValue={value => this.props.toggleCondition(this.props.combatant, 'unconscious')}
                            />
                        </Col>
                        <Col span={8}>
                            <Checkbox
                                label='hidden'
                                display='button'
                                checked={!this.props.combatant.showOnMap}
                                disabled={this.props.tactical === 'no-map'}
                                changeValue={value => this.props.changeValue(this.props.combatant, 'showOnMap', !value)}
                            />
                        </Col>
                    </Row>
                    <div>
                        <Input.TextArea
                            placeholder='notes'
                            autoSize={{ minRows: 3 }}
                            value={this.props.combatant.note}
                            onChange={event => this.props.changeValue(this.props.combatant, 'note', event.target.value)}
                        />
                    </div>
                </div>
            );
        }

        if (!this.props.combatant.pending && !this.props.combatant.active && this.props.combatant.defeated) {
            return (
                <button onClick={() => this.props.makeActive(this.props.combatant)}>mark as active</button>
            );
        }

        return null;
    }

    private getHPSection() {
        const monster = this.props.combatant as Combatant & Monster;
        if (monster === null) {
            return null;
        }

        let btn = null;
        if ((monster.hp !== null) && (monster.hp <= 0)) {
            if (this.props.combatant.current) {
                btn = (
                    <button onClick={() => this.props.makeDefeated(this.props.combatant)}>
                        mark as defeated and end turn
                    </button>
                );
            } else {
                btn = (
                    <button onClick={() => this.props.makeDefeated(this.props.combatant)}>
                        mark as defeated
                    </button>
                );
            }
        }

        return (
            <div>
                <NumberSpin
                    source={this.props.combatant}
                    name='hp'
                    label='hit points'
                    factors={[1, 10]}
                    nudgeValue={delta => this.props.nudgeValue(this.props.combatant, 'hp', delta)}
                />
                <NumberSpin
                    source={this.props.combatant}
                    name='hpTemp'
                    label='temp hp'
                    factors={[1, 10]}
                    nudgeValue={delta => this.props.nudgeValue(this.props.combatant, 'hpTemp', delta)}
                />
                <div className='divider' />
                <div className='section' style={{ display: monster.damage.resist !== '' ? '' : 'none' }}>
                    <b>damage resistances</b> {monster.damage.resist}
                </div>
                <div className='section' style={{ display: monster.damage.vulnerable !== '' ? '' : 'none' }}>
                    <b>damage vulnerabilities</b> {monster.damage.vulnerable}
                </div>
                <div className='section' style={{ display: monster.damage.immune !== '' ? '' : 'none' }}>
                    <b>damage immunities</b> {monster.damage.immune}
                </div>
                <NumberSpin
                    source={this.state}
                    name='damageOrHealing'
                    factors={[1, 10]}
                    nudgeValue={delta => this.nudgeDamage(delta)}
                />
                <Row gutter={10}>
                    <Col span={8}>
                        <button className={this.state.damageOrHealing === 0 ? 'disabled' : ''} onClick={() => this.heal()}>heal</button>
                    </Col>
                    <Col span={8}>
                        <button className={this.state.damageOrHealing === 0 ? 'disabled' : ''} onClick={() => this.setDamage(0)}>reset</button>
                    </Col>
                    <Col span={8}>
                        <button className={this.state.damageOrHealing === 0 ? 'disabled' : ''} onClick={() => this.damage()}>damage</button>
                    </Col>
                </Row>
                {btn}
            </div>
        );
    }

    private getConditionSection() {
        let immunities = null;
        if (this.props.combatant.type === 'monster') {
            const monster = this.props.combatant as Combatant & Monster;
            immunities = (
                <div className='section' style={{ display: monster.conditionImmunities !== '' ? '' : 'none' }}>
                    <b>condition immunities</b> {monster.conditionImmunities}
                </div>
            );
        }
        return (
            <div>
                {immunities}
                <ConditionsPanel
                    combatant={this.props.combatant}
                    combat={this.props.combat}
                    addCondition={() => this.props.addCondition(this.props.combatant)}
                    editCondition={condition => this.props.editCondition(this.props.combatant, condition)}
                    removeCondition={conditionID => this.props.removeCondition(this.props.combatant, conditionID)}
                    nudgeConditionValue={(condition, type, delta) => this.props.nudgeConditionValue(condition, type, delta)}
                />
            </div>
        );
    }

    private getMapSection() {
        if (this.props.tactical === 'on-map') {
            let auraDetails = null;
            if (this.props.combatant.aura.radius > 0) {
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
                            selectedID={this.props.combatant.aura.style}
                            select={optionID => this.props.changeValue(this.props.combatant.aura, 'style', optionID)}
                        />
                        <input
                            type='color'
                            value={this.props.combatant.aura.color}
                            onChange={event => this.props.changeValue(this.props.combatant.aura, 'color', event.target.value)}
                        />
                    </div>
                );
            }
            return (
                <div>
                    <div className='section centered'>
                        <Radial
                            direction='eight'
                            click={dir => this.props.mapMove(this.props.combatant, dir)}
                        />
                    </div>
                    <div className='divider' />
                    <NumberSpin
                        source={this.props.combatant}
                        name='altitude'
                        label='altitude'
                        display={value => value + ' ft.'}
                        nudgeValue={delta => this.props.nudgeValue(this.props.combatant, 'altitude', delta * 5)}
                    />
                    <Collapse
                        bordered={false}
                        expandIcon={p => <Icon type='down-circle' rotate={p.isActive ? -180 : 0} />}
                        expandIconPosition={'right'}
                    >
                        <Collapse.Panel key='one' header='aura'>
                            <NumberSpin
                                source={this.props.combatant.aura}
                                name='radius'
                                label='size'
                                display={value => value + ' ft.'}
                                nudgeValue={delta => this.props.nudgeValue(this.props.combatant.aura, 'radius', delta * 5)}
                            />
                            {auraDetails}
                        </Collapse.Panel>
                    </Collapse>
                    <button onClick={() => this.props.mapRemove(this.props.combatant)}>remove from map</button>
                </div>
            );
        }

        return (
            <button key='mapAdd' onClick={() => this.props.mapAdd(this.props.combatant)}>add to map</button>
        );
    }

    private getAdvancedSection() {
        let remove = null;
        if (!this.props.combatant.current) {
            remove = (
                <ConfirmButton text='remove from encounter' callback={() => this.props.removeCombatant(this.props.combatant)} />
            );
        }

        let init = null;
        if (!this.props.combatant.pending) {
            init = (
                <Collapse
                    bordered={false}
                    expandIcon={p => <Icon type='down-circle' rotate={p.isActive ? -180 : 0} />}
                    expandIconPosition={'right'}
                >
                    <Collapse.Panel key='one' header='change initiative score'>
                        <p>adjusting initiative will re-sort the initiative order</p>
                        <p>if you have manually changed the initiative order, your changes will be lost</p>
                        <NumberSpin
                            source={this.props.combatant}
                            name='initiative'
                            label='initiative'
                            nudgeValue={delta => this.props.nudgeValue(this.props.combatant, 'initiative', delta)}
                        />
                    </Collapse.Panel>
                </Collapse>
            );
        }

        return (
            <div>
                {remove}
                <Collapse
                    bordered={false}
                    expandIcon={p => <Icon type='down-circle' rotate={p.isActive ? -180 : 0} />}
                    expandIconPosition={'right'}
                >
                    <Collapse.Panel key='one' header='change name'>
                        <Input
                            value={this.props.combatant.displayName}
                            allowClear={true}
                            onChange={event => this.props.changeValue(this.props.combatant, 'displayName', event.target.value)}
                        />
                    </Collapse.Panel>
                </Collapse>
                <Collapse
                    bordered={false}
                    expandIcon={p => <Icon type='down-circle' rotate={p.isActive ? -180 : 0} />}
                    expandIconPosition={'right'}
                >
                    <Collapse.Panel key='one' header='change size'>
                        <NumberSpin
                            source={this.props.combatant}
                            name='displaySize'
                            label='size'
                            nudgeValue={delta => this.props.nudgeValue(this.props.combatant, 'displaySize', delta)}
                        />
                    </Collapse.Panel>
                </Collapse>
                {init}
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
            if (this.props.tactical === 'no-map') {
                // No combat map, so remove the map option
                views.splice(3, 1);
            }
            if (this.props.combatant.type === 'pc') {
                // Can't change hit points for a PC
                views.splice(1, 1);
            }

            let content = null;
            switch (this.state.view) {
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

            return (
                <div className='group-panel combat-controls'>
                    <Selector
                        options={views}
                        selectedID={this.state.view}
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
