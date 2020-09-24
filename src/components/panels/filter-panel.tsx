import { Slider } from 'antd';
import React from 'react';

import { Napoleon } from '../../utils/napoleon';

import { MonsterFilter } from '../../models/encounter';
import { CATEGORY_TYPES, ROLE_TYPES, SIZE_TYPES } from '../../models/monster';

import { Dropdown } from '../controls/dropdown';
import { Expander } from '../controls/expander';
import { Selector } from '../controls/selector';
import { Textbox } from '../controls/textbox';

interface Props {
	filter: MonsterFilter;
	showRoles: boolean;
	changeValue: (type: 'name' | 'challenge' | 'category' | 'size' | 'role', value: any) => void;
	resetFilter: () => void;
}

export class FilterPanel extends React.Component<Props> {
	public static defaultProps = {
		showRoles: true
	};

	public render() {
		try {
			const sizeOptions = ['all sizes'].concat(SIZE_TYPES).map(size => ({ id: size, text: size }));

			const catOptions = ['all types'].concat(CATEGORY_TYPES).map(cat => ({ id: cat, text: cat }));
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

			let roleSection = null;
			if (this.props.showRoles) {
				const roles = ['all roles'].concat(ROLE_TYPES);
				const roleOptions = roles.map(role => ({ id: role, text: role }));

				roleSection = (
					<Selector
						options={roleOptions}
						selectedID={this.props.filter.role}
						itemsPerRow={2}
						onSelect={optionID => this.props.changeValue('role', optionID)}
					/>
				);
			}

			return (
				<div>
					<Textbox
						key='search'
						text={this.props.filter.name}
						placeholder='filter by name'
						noMargins={true}
						onChange={value => this.props.changeValue('name', value)}
					/>
					<Expander text={'showing ' + Napoleon.getFilterDescription(this.props.filter)}>
						<Slider
							range={true}
							min={0}
							max={30}
							value={[this.props.filter.challengeMin, this.props.filter.challengeMax]}
							onChange={value => this.props.changeValue('challenge', value)}
						/>
						<Dropdown
							options={sizeOptions}
							placeholder='filter by size...'
							selectedID={this.props.filter.size}
							onSelect={optionID => this.props.changeValue('size', optionID)}
						/>
						<Selector
							options={catOptions}
							selectedID={this.props.filter.category}
							itemsPerRow={3}
							onSelect={optionID => this.props.changeValue('category', optionID)}
						/>
						{roleSection}
						<hr/>
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
