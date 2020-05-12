import { CopyOutlined, SoundOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import React from 'react';

import Shakespeare from '../../../utils/shakespeare';
import Ustinov from '../../../utils/ustinov';

import Checkbox from '../../controls/checkbox';
import Expander from '../../controls/expander';
import Selector from '../../controls/selector';
import GridPanel from '../../panels/grid-panel';

interface Props {
}

interface State {
    preset: string | null;
    languages: string[];
    output: string[];
}

export default class LanguageTool extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            preset: null,
            languages: [],
            output: []
        };
    }

    private getAllLanguages(): string[] {
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

    private addLanguage(language: string) {
        this.state.languages.push(language);
        this.setState({
            languages: this.state.languages.sort()
        });
    }

    private removeLanguage(language: string) {
        const index = this.state.languages.indexOf(language);
        this.state.languages.splice(index, 1);
        this.setState({
            languages: this.state.languages
        });
    }

    private usePreset(preset: string) {
        let languages: string[] = [];
        switch (preset) {
            case 'draconic':
                languages = ['armenian', 'irish', 'maltese'];
                break;
            case 'dwarvish':
                languages = ['czech', 'german', 'yiddish'];
                break;
            case 'elvish':
                languages = ['finnish', 'spanish', 'welsh'];
                break;
            case 'goblin':
                languages = ['hawaiian', 'kyrgyz', 'somali'];
                break;
            case 'orc':
                languages = ['macedonian', 'russian', 'turkish'];
                break;
        }

        this.setState({
            preset: preset,
            languages: languages.sort(),
            output: []
        });
    }

    private random() {
        const languages = this.getAllLanguages();

        const selection: string[] = [];
        while (selection.length !== 3) {
            const n = Math.floor(Math.random() * languages.length);
            const lang = languages[n];
            if (!selection.includes(lang)) {
                selection.push(lang);
            }
        }

        this.setState({
            languages: selection,
            output: []
        });
    }

    private generate() {
        const responses = this.state.languages.map(language => fetch('/dojo/data/langs/' + language + '.txt'));
        Promise.all(responses).then(r => {
            const data = r.map(response => response.text());
            Promise.all(data).then(text => {
                Shakespeare.initModel(text);
                this.setState({
                    output: Shakespeare.generate(5).map(l => l.line)
                });
            });
        });
    }

    private reset() {
        this.setState({
            preset: null,
            languages: [],
            output: []
        });
    }

    public render() {
        try {
            const presetOptions = ['draconic', 'dwarvish', 'elvish', 'goblin', 'orc', 'custom'].map(p => {
                return {
                    id: p,
                    text: p
                };
            });

            const allowGenerate = this.state.languages.length > 0;

            let custom = null;
            if (this.state.preset === 'custom') {
                let selectedLanguages = this.state.languages.join(', ');
                if (selectedLanguages === '') {
                    selectedLanguages = 'none';
                }

                const languages = this.getAllLanguages()
                    .map(lang => {
                        const isSelected = this.state.languages.includes(lang);
                        return (
                            <Checkbox
                                key={lang}
                                label={lang}
                                checked={isSelected}
                                display='button'
                                changeValue={value => value ? this.addLanguage(lang) : this.removeLanguage(lang)}
                            />
                        );
                    });

                const allowReset = allowGenerate || this.state.output.length > 0;
                custom = (
                    <div className='group-panel'>
                        <Expander text={'selected languages: ' + selectedLanguages}>
                            <div className='language-options'>
                                <GridPanel columns={3} content={languages} />
                            </div>
                        </Expander>
                        <Row gutter={10}>
                            <Col span={12}>
                                <button onClick={() => this.random()}>random languages</button>
                            </Col>
                            <Col span={12}>
                                <button className={allowReset ? '' : 'disabled'} onClick={() => this.reset()}>reset</button>
                            </Col>
                        </Row>
                    </div>
                );
            }

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
                        languages={this.state.languages}
                    />
                );
            }

            return (
                <div>
                    <Selector
                        options={presetOptions}
                        selectedID={this.state.preset}
                        itemsPerRow={3}
                        select={optionID => this.usePreset(optionID)}
                    />
                    {custom}
                    <div className='divider' />
                    <button className={allowGenerate ? '' : 'disabled'} onClick={() => this.generate()}>generate text</button>
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
                <div className='generated-item group-panel clickable'>
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
