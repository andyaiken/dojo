import { Col, Row } from 'antd';
import React from 'react';

import { Frankenstein } from '../../../utils/frankenstein';
import { Gygax } from '../../../utils/gygax';
import { Utils } from '../../../utils/utils';

import { Monster } from '../../../models/monster';

import { RenderError } from '../../error';
import { MonsterStatblockCard } from '../../cards/monster-statblock-card';
import { Conditional } from '../../controls/conditional';
import { Note } from '../../controls/note';
import { RadioGroup } from '../../controls/radio-group';
import { Tabs } from '../../controls/tabs';
import { NumberSpin } from '../../controls/number-spin';

interface Props {
	monster: Monster;
	themes: Monster[];
	selectedThemeID: string;
	selectTheme: (monsterID: string) => void;
	deltaCR: number;
	setDeltaCR: (deltaCR: number) => void;
}

interface State {
	mode: string;
}

export class ThemeSelectionModal extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			mode: 'theme'
		};
	}

	private setMode(mode: string) {
		this.setState({
			mode: mode
		});
	}

	public render() {
		try {
			let monster: Monster = JSON.parse(JSON.stringify(this.props.monster));
			if (this.props.selectedThemeID) {
				const theme = this.props.themes.find(t => t.id === this.props.selectedThemeID);
				if (theme) {
					monster = Frankenstein.applyTheme(monster, theme);
				}
			}
			if (this.props.deltaCR !== 0) {
				monster = Frankenstein.adjustCR(monster, this.props.deltaCR);
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
						<Tabs
							options={Utils.arrayToItems(['theme', 'cr'])}
							selectedID={this.state.mode}
							onSelect={mode => this.setMode(mode)}
						/>
						<Conditional display={this.state.mode === 'theme'}>
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
						</Conditional>
						<Conditional display={this.state.mode === 'cr'}>
							<Note>
								<div className='section'>
									you can adjust the challenge rating of this monster to make it more or less deadly
								</div>
							</Note>
							<NumberSpin
								label='challenge rating adjustment'
								value={(this.props.deltaCR > 0 ? '+' : '') + this.props.deltaCR}
								downEnabled={monster.challenge > 0}
								upEnabled={monster.challenge < 30}
								onNudgeValue={delta => this.props.setDeltaCR(this.props.deltaCR + delta)}
							/>
						</Conditional>
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
