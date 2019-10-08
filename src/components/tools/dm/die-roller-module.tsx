import React from 'react';

import Utils from '../../../utils/utils';

import Selector from '../../controls/selector';
import Spin from '../../controls/spin';

// tslint:disable-next-line:no-empty-interface
interface Props {
    //
}

interface State {
    dice: string;
    count: number;
    rolls: number[] | null;
    result: number | null;
}

export default class DieRollerModule extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            dice: '20',
            count: 1,
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

    private roll() {
        const sides = parseInt(this.state.dice, 10);

        const rolls: number[] = [];
        for (let n = 0; n !== this.state.count; ++n) {
            rolls.push(Utils.dieRoll(sides));
        }
        rolls.sort((a, b) => a - b);

        let result = 0;
        rolls.forEach(roll => result += roll);

        this.setState({
            rolls: rolls,
            result: result
        });
    }

    public render() {
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

        let rollsSection = null;
        if (this.state.rolls !== null) {
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
                <div className='subheading'>number to roll</div>
                <Spin
                    source={this.state}
                    name='count'
                    display={count => count + 'd' + this.state.dice}
                    nudgeValue={delta => this.nudgeCount(delta)}
                />
                <div className='divider' />
                <button onClick={() => this.roll()}>roll dice</button>
                {rollsSection}
                {resultSection}
            </div>
        );
    }
}
