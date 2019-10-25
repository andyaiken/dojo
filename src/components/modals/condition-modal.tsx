import React from 'react';

import { Col, Input, Row } from 'antd';

import Factory from '../../utils/factory';
import Utils from '../../utils/utils';

import { Combat, Combatant } from '../../models/combat';
import { Condition, CONDITION_TYPES, ConditionDurationCombatant, ConditionDurationSaves } from '../../models/condition';
import { Monster } from '../../models/monster-group';
import { PC } from '../../models/party';

import Dropdown from '../controls/dropdown';
import NumberSpin from '../controls/number-spin';
import RadioGroup from '../controls/radio-group';
import Selector from '../controls/selector';

interface Props {
    condition: Condition;
    combatant: Combatant & Monster;
    combat: Combat;
}

interface State {
    condition: Condition;
}

export default class ConditionModal extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            condition: props.condition
        };
    }

    private setCondition(conditionName: string) {
        // eslint-disable-next-line
        this.state.condition.name = conditionName;
        // eslint-disable-next-line
        this.state.condition.level = 1;
        // eslint-disable-next-line
        this.state.condition.text = conditionName === 'custom' ? 'custom condition' : null;

        this.setState({
            condition: this.state.condition
        });
    }

    private setDuration(durationType: 'saves' | 'combatant' | 'rounds') {
        let duration = null;

        switch (durationType) {
            case 'saves':
                duration = Factory.createConditionDurationSaves();
                break;
            case 'combatant':
                duration = Factory.createConditionDurationCombatant();
                duration.combatantID = this.props.combatant.id;
                break;
            case 'rounds':
                duration = Factory.createConditionDurationRounds();
                break;
            default:
                // Do nothing
                break;
        }

        // eslint-disable-next-line
        this.state.condition.duration = duration;
        this.setState({
            condition: this.state.condition
        });
    }

    private changeValue(object: any, field: string, value: any) {
        object[field] = value;

        this.setState({
            condition: this.state.condition
        });
    }

    private nudgeValue(object: any, field: string, delta: number) {
        let value = object[field] + delta;
        if (field === 'level') {
            value = Math.max(value, 1);
            value = Math.min(value, 6);
        }
        if (field === 'count') {
            value = Math.max(value, 1);
        }
        if (field === 'saveDC') {
            value = Math.max(value, 0);
        }
        object[field] = value;

        this.setState({
            condition: this.state.condition
        });
    }

    public render() {
        try {
            const conditions = CONDITION_TYPES.map(condition => {
                const controls = [];
                const description = [];
                if (condition === this.state.condition.name) {
                    if (condition === 'custom') {
                        controls.push(
                            <Input
                                placeholder='custom condition'
                                value={this.state.condition.text ? this.state.condition.text : ''}
                                allowClear={true}
                                onChange={event => this.changeValue(this.state.condition, 'text', event.target.value)}
                            />
                        );
                    }
                    if (condition === 'exhaustion') {
                        controls.push(
                            <NumberSpin
                                key='exhaustion-spin'
                                source={this.props.condition}
                                name='level'
                                label='exhaustion'
                                nudgeValue={delta => this.nudgeValue(this.props.condition, 'level', delta)}
                            />
                        );
                    }
                    const text = Utils.conditionText(this.state.condition);
                    for (let n = 0; n !== text.length; ++n) {
                        description.push(<li key={n} className='section'>{text[n]}</li>);
                    }
                }

                return {
                    id: condition,
                    text: condition,
                    details: (
                        <div key={condition}>
                            {controls}
                            <ul>
                                {description}
                            </ul>
                        </div>
                    ),
                    disabled: this.props.combatant.conditionImmunities ? this.props.combatant.conditionImmunities.indexOf(condition) !== -1 : false
                };
            });

            const saveOptions = ['str', 'dex', 'con', 'int', 'wis', 'cha', 'death'].map(c => ({ id: c, text: c }));
            const pointOptions = [
                {
                    id: 'start',
                    text: 'start of turn'
                },
                {
                    id: 'end',
                    text: 'end of turn'
                }
            ];
            const combatantOptions = this.props.combat.combatants.map(combatant => {
                const c = combatant as (Combatant & PC) | (Combatant & Monster);
                return {
                    id: c.id,
                    text: (c.displayName || c.name || 'unnamed monster')
                };
            });

            const durations = [
                {
                    id: 'none',
                    text: 'until removed (default)',
                    details: (
                        <div className='section'>
                            <div>the condition persists until it is manually removed</div>
                        </div>
                    )
                },
                {
                    id: 'saves',
                    text: 'until a successful save',
                    details: (
                        <div>
                            <div className='section'>
                                <div className='subheading'>number of saves required</div>
                                <NumberSpin
                                    source={this.props.condition.duration}
                                    name='count'
                                    nudgeValue={delta => this.nudgeValue(this.props.condition.duration, 'count', delta)}
                                />
                            </div>
                            <div className='section'>
                                <div className='subheading'>save dc</div>
                                <NumberSpin
                                    source={this.props.condition.duration}
                                    name='saveDC'
                                    nudgeValue={delta => this.nudgeValue(this.props.condition.duration, 'saveDC', delta)}
                                />
                            </div>
                            <div className='section'>
                                <div className='subheading'>type of save</div>
                                <Selector
                                    options={saveOptions}
                                    selectedID={
                                        (this.props.condition.duration as ConditionDurationSaves)
                                        ? (this.props.condition.duration as ConditionDurationSaves).saveType
                                        : null
                                    }
                                    select={optionID => this.changeValue(this.props.condition.duration, 'saveType', optionID)}
                                />
                            </div>
                            <div className='section'>
                                <div className='subheading'>make the save at the start or end of the turn</div>
                                <Selector
                                    options={pointOptions}
                                    selectedID={
                                        (this.props.condition.duration as ConditionDurationSaves)
                                        ? (this.props.condition.duration as ConditionDurationSaves).point
                                        : null
                                    }
                                    select={optionID => this.changeValue(this.props.condition.duration, 'point', optionID)}
                                />
                            </div>
                        </div>
                    )
                },
                {
                    id: 'combatant',
                    text: 'until someone\'s next turn',
                    details: (
                        <div>
                            <div className='section'>
                                <div className='subheading'>combatant</div>
                                <Dropdown
                                    options={combatantOptions}
                                    selectedID={
                                        (this.props.condition.duration as ConditionDurationCombatant)
                                        ? (this.props.condition.duration as ConditionDurationCombatant).combatantID || undefined
                                        : undefined
                                    }
                                    select={optionID => this.changeValue(this.props.condition.duration, 'combatantID', optionID)}
                                />
                            </div>
                            <div className='section'>
                                <div className='subheading'>start or end of the turn</div>
                                <Selector
                                    options={pointOptions}
                                    selectedID={
                                        (this.props.condition.duration as ConditionDurationCombatant)
                                        ? (this.props.condition.duration as ConditionDurationCombatant).point
                                        : null
                                    }
                                    select={optionID => this.changeValue(this.props.condition.duration, 'point', optionID)}
                                />
                            </div>
                        </div>
                    )
                },
                {
                    id: 'rounds',
                    text: 'for a number of rounds',
                    details: (
                        <div>
                            <div className='section'>
                                <div className='subheading'>number of rounds</div>
                                <NumberSpin
                                    source={this.props.condition.duration}
                                    name='count'
                                    nudgeValue={delta => this.nudgeValue(this.props.condition.duration, 'count', delta)}
                                />
                            </div>
                        </div>
                    )
                }
            ];

            return (
                <Row className='full-height'>
                    <Col span={12} className='scrollable'>
                        <div className='subheading'>condition</div>
                        <RadioGroup
                            items={conditions}
                            selectedItemID={this.state.condition.name}
                            select={itemID => this.setCondition(itemID)}
                        />
                    </Col>
                    <Col span={12} className='scrollable'>
                        <div className='subheading'>duration</div>
                        <RadioGroup
                            items={durations}
                            selectedItemID={this.state.condition.duration ? this.state.condition.duration.type : 'none'}
                            select={itemID => this.setDuration(itemID as 'saves' | 'combatant' | 'rounds')}
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
