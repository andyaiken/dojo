import React from 'react';

import TextGenerator from '../../utils/text-generation';

import Checkbox from '../controls/checkbox';
import Selector from '../controls/selector';

// tslint:disable-next-line:no-empty-interface
interface Props {
    //
}

interface State {
    sources: { [id: string]: string; };
    output: string[];
}

interface Preset {
    name: string;
    languages: string[];
}

export default class LanguageModule extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            sources: {},
            output: []
        };
    }

    private getLanguages(): string[] {
        return [
            'armenian',
            'basque',
            'bulgarian',
            'croatian',
            'czech',
            'danish',
            'dutch',
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
            'nepalese',
            'norwegian',
            'persian',
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

    private getPresets(): Preset[] {
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
        const path = '/data/langs/' + language + '.txt';
        const response = await fetch(path);
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

    private generate() {
        const sources: string[] = [];
        Object.keys(this.state.sources).forEach(key => {
            const src = this.state.sources[key];
            sources.push(src);
        });
        TextGenerator.initModel(sources);
        this.setState({
            output: TextGenerator.generate(5)
        });
    }

    public render() {
        const presetOptions = this.getPresets().map(p => {
            return {
                id: p.name,
                text: p.name
            };
        });

        let selectedPreset = 'custom';
        this.getPresets().forEach(p => {
            const selected = Object.keys(this.state.sources).sort().join(', ');
            const setting = p.languages.sort().join(', ');
            if (selected === setting) {
                selectedPreset = p.name;
            }
        });

        const languages = this.getLanguages()
            .map(lang => {
                const selected = Object.keys(this.state.sources).includes(lang);
                return (
                    <div className='column' key={lang}>
                        <Checkbox
                            label={lang}
                            checked={selected}
                            changeValue={value => value ? this.addLanguage(lang) : this.removeLanguage(lang)}
                        />
                    </div>
                );
            });

        const allowGenerate = Object.keys(this.state.sources).length > 0;

        const output = [];
        for (let n = 0; n !== this.state.output.length; ++n) {
            output.push(
                <div key={n} className='column small-12 medium-12 large-12 section'>
                    {this.state.output[n]}
                </div>
            );
        }

        return (
            <div className='language'>
                <div className='subheading'>presets</div>
                <Selector
                    options={presetOptions}
                    selectedID={selectedPreset}
                    select={optionID => this.usePreset(optionID)}
                />
                <div className='subheading'>languages</div>
                <div className='row collapse small-up-3 medium-up-4 large-up-6 language-options'>
                    {languages}
                </div>
                <div className='subheading'>output</div>
                <button className={allowGenerate ? '' : 'disabled'} onClick={() => this.generate()}>generate</button>
                <div className='row language-output'>
                    {output}
                </div>
            </div>
        );
    }
}
