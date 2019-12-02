import React from 'react';

import { Col, Row } from 'antd';

import Utils from '../../utils/utils';

import Checkbox from '../controls/checkbox';
import NumberSpin from '../controls/number-spin';
import Selector from '../controls/selector';

interface Props {
}

interface State {
    dice: string;
    count: number;
    options: string[];
    rolls: number[] | null;
    result: number | null;
}

export default class DieRollerTool extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            dice: '20',
            count: 1,
            options: [],
            rolls: null,
            result: null
        };
    }

    private setDice(dice: string) {
        this.setState({
            dice: dice
        });
    }

    private nudgeCount(delta: number) {
        this.setState({
            count: Math.max(1, this.state.count + delta)
        });
    }

    private toggleOption(option: string) {
        if (this.state.options.includes(option)) {
            // Remove option
            const index = this.state.options.indexOf(option);
            this.state.options.splice(index, 1);
        } else {
            // Add option
            this.state.options.push(option);
            // Make sure we don't have both advantage and disadvantage
            if (this.state.options.includes('advantage') && this.state.options.includes('disadvantage')) {
                const index = this.state.options.indexOf(option === 'advantage' ? 'disadvantage' : 'advantage');
                this.state.options.splice(index, 1);
            }
        }
        this.setState({
            options: this.state.options
        });
    }

    private roll() {
        const sides = parseInt(this.state.dice, 10);

        const rolls: number[] = [];
        let count = this.state.count;
        if (this.state.options.includes('advantage') || this.state.options.includes('disadvantage')) {
            count = 2;
        }
        for (let n = 0; n !== count; ++n) {
            rolls.push(Utils.dieRoll(sides));
        }
        rolls.sort((a, b) => a - b);

        let result = 0;
        if ((this.state.count === 1) && (this.state.dice === '20') && this.state.options.includes('advantage')) {
            result = Math.max(...rolls);
        } else if ((this.state.count === 1) && (this.state.dice === '20') && this.state.options.includes('disadvantage')) {
            result = Math.min(...rolls);
        } else {
            rolls.forEach(roll => result += roll);
            if ((this.state.count > 1) && this.state.options.includes('drop lowest')) {
                result -= Math.min(...rolls);
            }
            if ((this.state.count > 1) && this.state.options.includes('drop highest')) {
                result -= Math.max(...rolls);
            }
        }

        this.setState({
            rolls: rolls,
            result: result
        });
    }

    public render() {
        try {
            const options = [
                {
                    id: '4',
                    text: 'd4'
                },
                {
                    id: '6',
                    text: 'd6'
                },
                {
                    id: '8',
                    text: 'd8'
                },
                {
                    id: '10',
                    text: 'd10'
                },
                {
                    id: '12',
                    text: 'd12'
                },
                {
                    id: '20',
                    text: 'd20'
                },
                {
                    id: '100',
                    text: 'd100'
                }
            ];

            let optionsSection = null;
            if ((this.state.dice === '20') && (this.state.count === 1)) {
                optionsSection = (
                    <Row gutter={10}>
                        <Col span={12}>
                            <Checkbox
                                label='advantage'
                                checked={this.state.options.includes('advantage')}
                                changeValue={value => this.toggleOption('advantage')}
                            />
                        </Col>
                        <Col span={12}>
                            <Checkbox
                                label='disadvantage'
                                checked={this.state.options.includes('disadvantage')}
                                changeValue={value => this.toggleOption('disadvantage')}
                            />
                        </Col>
                    </Row>
                );
            } else if (this.state.count > 1) {
                optionsSection = (
                    <Row gutter={10}>
                        <Col span={12}>
                            <Checkbox
                                label='drop lowest'
                                checked={this.state.options.includes('drop lowest')}
                                changeValue={value => this.toggleOption('drop lowest')}
                            />
                        </Col>
                        <Col span={12}>
                            <Checkbox
                                label='drop highest'
                                checked={this.state.options.includes('drop highest')}
                                changeValue={value => this.toggleOption('drop highest')}
                            />
                        </Col>
                    </Row>
                );
            }

            let rollsSection = null;
            if ((this.state.rolls !== null) && (this.state.rolls.length > 1)) {
                rollsSection = (
                    <div className='section die-rolls'>{this.state.rolls.join(', ')}</div>
                );
            }

            let resultSection = null;
            if (this.state.result !== null) {
                resultSection = (
                    <div className='section die-result'>{this.state.result}</div>
                );
            }

            return (
                <div>
                    <div className='subheading'>die type</div>
                    <Selector
                        options={options}
                        selectedID={this.state.dice}
                        select={optionID => this.setDice(optionID)}
                    />
                    <div className='subheading'>number of dice to roll</div>
                    <NumberSpin
                        source={this.state}
                        name='count'
                        display={count => count + 'd' + this.state.dice}
                        nudgeValue={delta => this.nudgeCount(delta)}
                    />
                    {optionsSection ? <div className='subheading'>options</div> : null}
                    {optionsSection}
                    <div className='divider' />
                    <button onClick={() => this.roll()}>roll dice</button>
                    {rollsSection}
                    {resultSection}
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}
