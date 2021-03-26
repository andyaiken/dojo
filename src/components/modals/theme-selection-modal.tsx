import { Col, Row } from 'antd';
import React from 'react';

import { Frankenstein } from '../../utils/frankenstein';
import { Gygax } from '../../utils/gygax';

import { Monster } from '../../models/monster';

import { RenderError } from '../error';
import { MonsterStatblockCard } from '../cards/monster-statblock-card';
import { Note } from '../controls/note';
import { RadioGroup } from '../controls/radio-group';

interface Props {
	monster: Monster;
	themes: Monster[];
	selectedThemeID: string;
	selectTheme: (monsterID: string) => void;
}

export class ThemeSelectionModal extends React.Component<Props> {
	public render() {
		try {
			let monster: Monster = JSON.parse(JSON.stringify(this.props.monster));
			if (this.props.selectedThemeID) {
				const theme = this.props.themes.find(t => t.id === this.props.selectedThemeID);
				if (theme) {
					monster = Frankenstein.applyTheme(monster, theme);
				}
			}

			const items = this.props.themes.map(m => ({ id: m.id, text: m.name || 'unnamed theme', info: 'cr ' + Gygax.challenge(m.challenge) }))
			items.unshift({
				id: '',
				text: 'no theme',
				info: ''
			});

			return (
				<Row className='full-height'>
					<Col span={8} className='scrollable'>
						<Note>
							<div className='section'>
								you can quickly modify this monster by selecting one of the following themes
							</div>
						</Note>
						<RadioGroup
							items={items}
							selectedItemID={this.props.selectedThemeID}
							onSelect={id => this.props.selectTheme(id)}
						/>
					</Col>
					<Col span={16} className='scrollable'>
						<MonsterStatblockCard monster={monster} />
					</Col>
				</Row>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='ThemeSelectionModal' error={e} />;
		}
	}
}
