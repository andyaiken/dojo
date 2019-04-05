import React from 'react';

import Utils from '../../utils/utils';

import { CATEGORY_TYPES, Monster, MonsterGroup, SIZE_TYPES } from '../../models/monster-group';

import Selector from '../controls/selector';

interface Props {
    library: MonsterGroup[];
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
            let demographics = null;

            const allMonsters: Monster[] = [];
            this.props.library.forEach(group => group.monsters.forEach(monster => allMonsters.push(monster)));
            if (allMonsters.length !== 0) {
                const buckets: { value: any, title: string }[] = [];
                let maxBucketSize = 0;
                const monsters: { [key: string]: Monster[] } = {};

                switch (this.state.chart) {
                    case 'challenge':
                        const challenges = [
                            0, 0.125, 0.25, 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30
                        ];
                        challenges.forEach(cr => {
                            buckets.push({
                                value: cr,
                                title: 'challenge ' + Utils.challenge(cr)
                            });
                        });

                        buckets.forEach(bucket => {
                            const cr = bucket.value;
                            monsters[cr.toString()] = allMonsters.filter(monster => monster.challenge === cr);
                        });

                        buckets.forEach(bucket => {
                            const cr = bucket.value;
                            maxBucketSize = Math.max(monsters[cr].length, maxBucketSize);
                        });
                        break;
                    case 'size':
                        SIZE_TYPES.forEach(size => {
                            buckets.push({
                                value: size,
                                title: size
                            });
                        });

                        buckets.forEach(bucket => {
                            const size = bucket.value;
                            monsters[size.toString()] = allMonsters.filter(monster => monster.size === size);
                        });

                        buckets.forEach(bucket => {
                            const size = bucket.value;
                            maxBucketSize = Math.max(monsters[size].length, maxBucketSize);
                        });
                        break;
                    case 'type':
                        CATEGORY_TYPES.forEach(type => {
                            buckets.push({
                                value: type,
                                title: type
                            });
                        });

                        buckets.forEach(bucket => {
                            const type = bucket.value;
                            monsters[type.toString()] = allMonsters.filter(monster => monster.category === type);
                        });

                        buckets.forEach(bucket => {
                            const type = bucket.value;
                            maxBucketSize = Math.max(monsters[type].length, maxBucketSize);
                        });
                        break;
                    default:
                        // Do nothing
                        break;
                }

                const bars = [];
                for (let index = 0; index !== buckets.length; ++index) {
                    const bucket = buckets[index];
                    const set = monsters[bucket.value];
                    const count = set ? set.length : 0;
                    bars.push(
                        <div
                            key={bucket.title}
                            className='bar-container'
                            title={bucket.title + ': ' + set.length + ' monsters'}
                        >
                            <div
                                className='bar'
                                style={{
                                    width: 'calc((100% - 1px) * ' + count + ' / ' + maxBucketSize + ')'
                                }}
                            />
                        </div>
                    );
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

                demographics = (
                    <div>
                        <Selector
                            options={chartOptions}
                            selectedID={this.state.chart}
                            select={optionID => this.selectChart(optionID)}
                        />
                        <div className='chart'>
                            <div className='plot'>{bars}</div>
                        </div>
                    </div>
                );
            }

            return demographics;
        } catch (e) {
            console.error(e);
        }
    }
}
