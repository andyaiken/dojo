import { CopyOutlined, SoundOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import React from 'react';

import Shakespeare from '../../utils/shakespeare';
import Ustinov from '../../utils/ustinov';

import Checkbox from '../controls/checkbox';
import Expander from '../controls/expander';
import Selector from '../controls/selector';
import GridPanel from '../panels/grid-panel';

interface Props {
}

interface State {
    sources: { [id: string]: string; };
    output: string[];
}

interface LanguagePreset {
    name: string;
    languages: string[];
}

export default class LanguageTool extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            sources: {},
            output: []
        };
    }

    private getLanguages(): string[] {
        // Note: When adding a language to this list, also check the Speech.getLanguageCode() method
        return [
            'afrikaans',
            'amharic',
            'armenian',
            'basque',
            'belarusian',
            'bulgarian',
            'chichewa',
            'chinese',
            'croatian',
            'czech',
            'danish',
            'dutch',
            'english',
            'finnish',
            'french',
            'german',
            'greek',
            'hawaiian',
            'hindi',
            'hungarian',
            'icelandic',
            'irish',
            'italian',
            'japanese',
            'kannada',
            'kazakh',
            'korean',
            'kyrgyz',
            'latvian',
            'lithuanian',
            'macedonian',
            'malay',
            'maltese',
            'maori',
            'myanmar',
            'nepali',
            'norwegian',
            'polish',
            'portuguese',
            'punjabi',
            'romanian',
            'russian',
            'samoan',
            'serbian',
            'shona',
            'somali',
            'spanish',
            'swahili',
            'swedish',
            'thai',
            'turkish',
            'welsh',
            'yiddish',
            'zulu'
        ];
    }

    private getPresets(): LanguagePreset[] {
        return [
            {
                name: 'draconic',
                languages: ['armenian', 'irish', 'maltese']
            },
            {
                name: 'dwarvish',
                languages: ['czech', 'german', 'yiddish']
            },
            {
                name: 'elvish',
                languages: ['finnish', 'spanish', 'welsh']
            },
            {
                name: 'goblin',
                languages: ['hawaiian', 'kyrgyz', 'somali']
            },
            {
                name: 'orc',
                languages: ['macedonian', 'russian', 'turkish']
            }
        ];
    }

    private async addLanguage(language: string) {
        const response = await fetch('/dojo/data/langs/' + language + '.txt');
        this.state.sources[language] = await response.text();
        this.setState({
            sources: this.state.sources
        });
    }

    private removeLanguage(language: string) {
        delete this.state.sources[language];
        this.setState({
            sources: this.state.sources
        });
    }

    private usePreset(presetName: string) {
        const preset = this.getPresets().find(p => p.name === presetName);
        if (preset) {
            this.setState({
                sources: {},
                output: []
            }, () => {
                preset.languages.forEach(lang => {
                    this.addLanguage(lang);
                });
            });
        }
    }

    private random() {
        const languages = this.getLanguages();

        const selection: string[] = [];
        while (selection.length !== 3) {
            const n = Math.floor(Math.random() * languages.length);
            const lang = languages[n];
            if (!selection.includes(lang)) {
                selection.push(lang);
            }
        }

        this.setState({
            sources: {},
            output: []
        }, () => {
            selection.forEach(lang => {
                this.addLanguage(lang);
            });
        });
    }

    private generate() {
        const sources: string[] = [];
        Object.keys(this.state.sources).forEach(key => {
            const src = this.state.sources[key];
            sources.push(src);
        });
        Shakespeare.initModel(sources);
        this.setState({
            output: Shakespeare.generate(5).map(l => l.line)
        });
    }

    private reset() {
        this.setState({
            sources: {},
            output: []
        });
    }

    public render() {
        try {
            const presetOptions = this.getPresets().map(p => {
                return {
                    id: p.name,
                    text: p.name
                };
            });

            let selectedPreset = '';
            this.getPresets().forEach(p => {
                const selected = Object.keys(this.state.sources).sort().join(', ');
                const setting = p.languages.sort().join(', ');
                if (selected === setting) {
                    selectedPreset = p.name;
                }
            });

            let selectedLanguages = Object.keys(this.state.sources).sort().join(', ');
            if (selectedLanguages === '') {
                selectedLanguages = 'none';
            }

            const languages = this.getLanguages()
                .map(lang => {
                    const isSelected = Object.keys(this.state.sources).includes(lang);
                    return (
                        <Checkbox
                            key={lang}
                            label={lang}
                            checked={isSelected}
                            changeValue={value => value ? this.addLanguage(lang) : this.removeLanguage(lang)}
                        />
                    );
                });

            const allowGenerate = Object.keys(this.state.sources).length > 0;
            const allowReset = allowGenerate || this.state.output.length > 0;

            const output = [];
            if (this.state.output.length > 0) {
                output.push(
                    <div key='div' className='divider' />
                );
            }
            for (let n = 0; n !== this.state.output.length; ++n) {
                output.push(
                    <GeneratedText
                        key={n}
                        text={this.state.output[n]}
                        languages={Object.keys(this.state.sources)}
                    />
                );
            }

            return (
                <div>
                    <div className='subheading'>presets</div>
                    <Selector
                        options={presetOptions}
                        selectedID={selectedPreset}
                        select={optionID => this.usePreset(optionID)}
                    />
                    <div className='divider' />
                    <Expander text={'selected languages: ' + selectedLanguages}>
                        <GridPanel content={languages} />
                    </Expander>
                    <div className='divider' />
                    <Row gutter={10}>
                        <Col span={8}>
                            <button className={allowGenerate ? '' : 'disabled'} onClick={() => this.generate()}>generate text</button>
                        </Col>
                        <Col span={8}>
                            <button className={allowReset ? '' : 'disabled'} onClick={() => this.reset()}>reset</button>
                        </Col>
                        <Col span={8}>
                            <button onClick={() => this.random()}>random sources</button>
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
                <div className='generated-item'>
                    <div className='text-section'>
                        {this.props.text.toLowerCase()}
                    </div>
                    <div className='icon-section'>
                        <div>
                            <CopyOutlined title='copy' onClick={e => this.copy(e)} />
                        </div>
                        <div>
                            <SoundOutlined title='say' onClick={e => this.say(e)} />
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
