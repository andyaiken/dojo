import { CopyOutlined, SoundOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import React from 'react';

import { Shakespeare } from '../../../utils/shakespeare';
import { Ustinov } from '../../../utils/ustinov';

import { Checkbox } from '../../controls/checkbox';
import { Expander } from '../../controls/expander';
import { Selector } from '../../controls/selector';
import { GridPanel } from '../../panels/grid-panel';
import { Note } from '../../panels/note';

interface Props {
	languagePreset: string | null;
	selectedLanguages: string[];
	output: string[];
	selectLanguagePreset: (preset: string) => void;
	addLanguage: (language: string) => void;
	removeLanguage: (language: string) => void;
	selectRandomLanguages: () => void;
	resetLanguages: () => void;
	generateLanguage: () => void;
}

export class LanguageTool extends React.Component<Props> {
	public render() {
		try {
			const presetOptions = ['draconic', 'dwarvish', 'elvish', 'goblin', 'orc', 'custom'].map(p => {
				return {
					id: p,
					text: p
				};
			});

			const allowGenerate = this.props.selectedLanguages.length > 0;
			const allowReset = allowGenerate || this.props.output.length > 0;

			let custom = null;
			if (this.props.languagePreset === 'custom') {
				let selectedLanguages = this.props.selectedLanguages.join(', ');
				if (selectedLanguages === '') {
					selectedLanguages = 'none';
				}

				const languages = Shakespeare.getAllLanguages()
					.map(lang => {
						const isSelected = this.props.selectedLanguages.includes(lang);
						return (
							<Checkbox
								key={lang}
								label={lang}
								checked={isSelected}
								display='button'
								onChecked={value => value ? this.props.addLanguage(lang) : this.props.removeLanguage(lang)}
							/>
						);
					});

				custom = (
					<div className='group-panel'>
						<Expander text={'selected languages: ' + selectedLanguages}>
							<div className='language-options'>
								<GridPanel columns={3} content={languages} />
							</div>
						</Expander>
						<button onClick={() => this.props.selectRandomLanguages()}>random languages</button>
					</div>
				);
			}

			const output = [];
			if (this.props.output.length > 0) {
				output.push(
					<hr key='div' />
				);
			}
			for (let n = 0; n !== this.props.output.length; ++n) {
				output.push(
					<GeneratedText
						key={n}
						text={this.props.output[n]}
						languages={this.props.selectedLanguages}
					/>
				);
			}

			return (
				<div>
					<Note>
						<p>you can use this tool to generate words and sentences in fantasy languages</p>
					</Note>
					<Selector
						options={presetOptions}
						selectedID={this.props.languagePreset}
						itemsPerRow={3}
						onSelect={optionID => this.props.selectLanguagePreset(optionID)}
					/>
					{custom}
					<hr/>
					<Row gutter={10}>
						<Col span={12}>
							<button className={allowGenerate ? '' : 'disabled'} onClick={() => this.props.generateLanguage()}>generate text</button>
						</Col>
						<Col span={12}>
							<button className={allowReset ? '' : 'disabled'} onClick={() => this.props.resetLanguages()}>reset</button>
						</Col>
					</Row>

					{output}
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}

interface GeneratedTextProps {
	text: string;
	languages: string[];
}

class GeneratedText extends React.Component<GeneratedTextProps> {
	private copy(e: React.MouseEvent) {
		e.stopPropagation();
		navigator.clipboard.writeText(this.props.text);
	}

	private say(e: React.MouseEvent) {
		e.stopPropagation();
		Ustinov.say(this.props.text, this.props.languages);
	}

	public render() {
		try {
			return (
				<div className='generated-item group-panel'>
					<div className='text-section'>
						{this.props.text.toLowerCase()}
					</div>
					<div className='icon-section'>
						<div>
							<CopyOutlined title='copy to clipboard' onClick={e => this.copy(e)} />
						</div>
						<div>
							<SoundOutlined title='say (experimental)' onClick={e => this.say(e)} />
						</div>
					</div>
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}
