import React from 'react';

import Utils from '../../utils/utils';

import { CATEGORY_TYPES, SIZE_TYPES } from '../../models/monster-group';

import Dropdown from '../controls/dropdown';
import Spin from '../controls/spin';

import arrow from '../../resources/images/down-arrow.svg';

interface Props {
    filter: {
        name: string,
        challengeMin: number;
        challengeMax: number;
        category: string;
        size: string;
    };
    changeValue: (type: 'name' | 'challengeMin' | 'challengeMax' | 'category' | 'size', value: any) => void;
    nudgeValue: (type: 'challengeMin' | 'challengeMax', delta: number) => void;
    resetFilter: () => void;
}

interface State {
    showAll: boolean;
}

export default class FilterCard extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            showAll: false
        };
    }

    private toggleAll() {
        this.setState({
            showAll: !this.state.showAll
        });
    }

    public render() {
        try {
            const sizes = ['all sizes'].concat(SIZE_TYPES);
            const sizeOptions = sizes.map(size => ({ id: size, text: size }));

            const categories = ['all types'].concat(CATEGORY_TYPES);
            const catOptions = categories.map(cat => ({ id: cat, text: cat }));

            let content = null;
            if (this.state.showAll) {
                content = (
                    <div>
                        <div className='section'>
                            <input
                                type='text'
                                placeholder='name'
                                value={this.props.filter.name}
                                onChange={event => this.props.changeValue('name', event.target.value)}
                            />
                        </div>
                        <Spin
                            source={this.props.filter}
                            name='challengeMin'
                            label='min cr'
                            display={value => Utils.challenge(value)}
                            nudgeValue={delta => this.props.nudgeValue('challengeMin', delta)}
                        />
                        <Spin
                            source={this.props.filter}
                            name='challengeMax'
                            label='max cr'
                            display={value => Utils.challenge(value)}
                            nudgeValue={delta => this.props.nudgeValue('challengeMax', delta)}
                        />
                        <Dropdown
                            options={sizeOptions}
                            placeholder='filter by size...'
                            selectedID={this.props.filter.size}
                            select={optionID => this.props.changeValue('size', optionID)}
                        />
                        <Dropdown
                            options={catOptions}
                            placeholder='filter by type...'
                            selectedID={this.props.filter.category}
                            select={optionID => this.props.changeValue('category', optionID)}
                        />
                        <div className='divider' />
                        <div className='section'>
                            <button onClick={() => this.props.resetFilter()}>clear filter</button>
                        </div>
                    </div>
                );
            } else {
                let summary = '';
                if (this.props.filter.size !== 'all sizes') {
                    summary += summary ? ' ' + this.props.filter.size : this.props.filter.size;
                }
                if (this.props.filter.category !== 'all types') {
                    summary += summary ? ' ' + this.props.filter.category : this.props.filter.category;
                }
                summary += ' monsters of cr ' + Utils.challenge(this.props.filter.challengeMin) + ' to ' + Utils.challenge(this.props.filter.challengeMax);

                content = (
                    <div>
                        <div className='section'>
                            <input
                                type='text'
                                placeholder='name'
                                value={this.props.filter.name}
                                onChange={event => this.props.changeValue('name', event.target.value)}
                            />
                        </div>
                        <div className='section'>showing {summary}</div>
                    </div>
                );
            }

            return (
                <div className='card'>
                    <div className='heading'>
                        <div className='title'>filter</div>
                        <img className={this.state.showAll ? 'image rotate' : 'image'} src={arrow} alt='arrow' onClick={() => this.toggleAll()} />
                    </div>
                    <div className='card-content'>
                        {content}
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}