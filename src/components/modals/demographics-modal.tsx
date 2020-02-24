import React from 'react';

import Utils from '../../utils/utils';

import { CATEGORY_TYPES, Monster, MonsterGroup, SIZE_TYPES } from '../../models/monster-group';

import Selector from '../controls/selector';
import ChartPanel from '../panels/chart-panel';

interface Props {
    groups: MonsterGroup[];
}

interface State {
    chart: string;
}

export default class DemographicsModal extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            chart: 'challenge'
        };
    }

    private selectChart(chart: string) {
        this.setState({
            chart: chart
        });
    }

    public render() {
        try {
            const allMonsters: Monster[] = [];
            this.props.groups.forEach(group => group.monsters.forEach(monster => allMonsters.push(monster)));
            if (allMonsters.length === 0) {
                return null;
            }

            let data: { text: string, value: number }[] = [];
            switch (this.state.chart) {
                case 'challenge':
                    const crs = [
                        0, 0.125, 0.25, 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30
                    ];
                    data = crs.map(cr => {
                        return {
                            text: 'cr ' + Utils.challenge(cr),
                            value: allMonsters.filter(monster => monster.challenge === cr).length
                        };
                    });
                    break;
                case 'size':
                    data = SIZE_TYPES.map(size => {
                        return {
                            text: size,
                            value: allMonsters.filter(monster => monster.size === size).length
                        };
                    });
                    break;
                case 'type':
                    data = CATEGORY_TYPES.map(cat => {
                        return {
                            text: cat,
                            value: allMonsters.filter(monster => monster.category === cat).length
                        };
                    });
                    break;
                default:
                    // Do nothing
                    break;
            }

            const chartOptions = [
                {
                    id: 'challenge',
                    text: 'challenge rating'
                },
                {
                    id: 'size',
                    text: 'size'
                },
                {
                    id: 'type',
                    text: 'type'
                }
            ];

            return (
                <div className='scrollable' style={{ padding: '10px' }}>
                    <Selector
                        options={chartOptions}
                        selectedID={this.state.chart}
                        select={optionID => this.selectChart(optionID)}
                    />
                    <ChartPanel data={data} />
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}
