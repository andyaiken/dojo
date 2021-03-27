import { Slider } from 'antd';
import React from 'react';

import { Napoleon } from '../../utils/napoleon';
import { Utils } from '../../utils/utils';

import { MonsterFilter } from '../../models/encounter';
import { CATEGORY_TYPES, ROLE_TYPES, SIZE_TYPES } from '../../models/monster';

import { RenderError } from '../error';
import { Dropdown } from '../controls/dropdown';
import { Expander } from '../controls/expander';
import { Selector } from '../controls/selector';
import { Textbox } from '../controls/textbox';

interface Props {
	filter: MonsterFilter;
	prefix: string;
	showName: boolean;
	showRoles: boolean;
	changeValue: (type: 'name' | 'challenge' | 'category' | 'size' | 'role', value: any) => void;
	resetFilter: () => void;
}

export class FilterPanel extends React.Component<Props> {
	public static defaultProps = {
		prefix: 'showing',
		showName: true,
		showRoles: true
	};

	public render() {
		try {
			const catOptions = Utils.arrayToItems(['all types'].concat(CATEGORY_TYPES));
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

			let nameSection = null;
			if (this.props.showName) {
				nameSection = (
					<Textbox
						key='search'
						text={this.props.filter.name}
						placeholder='filter by name'
						noMargins={true}
						onChange={value => this.props.changeValue('name', value)}
					/>
				);
			}

			let roleSection = null;
			if (this.props.showRoles) {
				roleSection = (
					<Selector
						options={Utils.arrayToItems(['all roles'].concat(ROLE_TYPES))}
						selectedID={this.props.filter.role}
						itemsPerRow={2}
						onSelect={optionID => this.props.changeValue('role', optionID)}
					/>
				);
			}

			return (
				<div>
					{nameSection}
					<Expander text={this.props.prefix + ' ' + Napoleon.getFilterDescription(this.props.filter)}>
						<Slider
							range={true}
							min={0}
							max={30}
							value={[this.props.filter.challengeMin, this.props.filter.challengeMax]}
							onChange={value => this.props.changeValue('challenge', value)}
						/>
						<Dropdown
							options={Utils.arrayToItems(['all sizes'].concat(SIZE_TYPES))}
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
			return <RenderError context='FilterPanel' error={e} />;
		}
	}
}
