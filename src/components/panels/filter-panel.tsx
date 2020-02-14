import React from 'react';
import { Slider } from 'antd';

import Napoleon from '../../utils/napoleon';

import { MonsterFilter } from '../../models/encounter';
import { CATEGORY_TYPES, SIZE_TYPES } from '../../models/monster-group';

import Dropdown from '../controls/dropdown';
import Expander from '../controls/expander';
import Textbox from '../controls/textbox';
import Selector from '../controls/selector';

interface Props {
    filter: MonsterFilter;
    changeValue: (type: 'name' | 'challenge' | 'category' | 'size', value: any) => void;
    resetFilter: () => void;
}

export default class FilterPanel extends React.Component<Props> {
    public render() {
        try {
            const sizes = ['all sizes'].concat(SIZE_TYPES);
            const sizeOptions = sizes.map(size => ({ id: size, text: size }));

            const categories = ['all types'].concat(CATEGORY_TYPES);
            const catOptions = categories.map(cat => ({ id: cat, text: cat }));
            const aberr = catOptions.find(o => o.id === 'aberration');
            if (aberr) {
                aberr.text = 'aberr.';
            }
            const celest = catOptions.find(o => o.id === 'celestial');
            if (celest) {
                celest.text = 'celest.';
            }
            const constr = catOptions.find(o => o.id === 'construct');
            if (constr) {
                constr.text = 'const.';
            }
            const elem = catOptions.find(o => o.id === 'elemental');
            if (elem) {
                elem.text = 'elem.';
            }
            const human = catOptions.find(o => o.id === 'humanoid');
            if (human) {
                human.text = 'human.';
            }
            const monst = catOptions.find(o => o.id === 'monstrosity');
            if (monst) {
                monst.text = 'monst.';
            }

            return (
                <div>
                    <Textbox
                        text={this.props.filter.name}
                        placeholder='name'
                        onChange={value => this.props.changeValue('name', value)}
                    />
                    <Expander text={'showing ' + Napoleon.getFilterDescription(this.props.filter)}>
                        <Slider
                            range={true}
                            min={0}
                            max={35}
                            value={[this.props.filter.challengeMin, this.props.filter.challengeMax]}
                            onChange={value => this.props.changeValue('challenge', value)}
                        />
                        <Dropdown
                            options={sizeOptions}
                            placeholder='filter by size...'
                            selectedID={this.props.filter.size}
                            select={optionID => this.props.changeValue('size', optionID)}
                        />
                        <Selector
                            options={catOptions}
                            selectedID={this.props.filter.category}
                            itemsPerRow={3}
                            select={optionID => this.props.changeValue('category', optionID)}
                        />
                        <div className='divider' />
                        <div className='section'>
                            <button onClick={() => this.props.resetFilter()}>clear filter</button>
                        </div>
                    </Expander>
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
