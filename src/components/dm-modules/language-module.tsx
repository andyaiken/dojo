import React from 'react';

import TextGenerator from '../../utils/text-generation';

import Checkbox from '../controls/checkbox';
import ControlRow from '../controls/control-row';
import Expander from '../controls/expander';
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

    private getLanguageCode(language: string) {
        switch (language) {
            case 'armenian':
                return 'hy';
            case 'basque':
                return 'eu';
            case 'bulgarian':
                return 'bg';
            case 'chichewa':
                return 'ny';
            case 'chinese':
                return 'zh';
            case 'croatian':
                return 'hr';
            case 'czech':
                return 'cs';
            case 'dutch':
                return 'nl';
            case 'german':
                return 'de';
            case 'greek':
                return 'el';
            case 'icelandic':
                return 'is';
            case 'irish':
                return 'ga';
            case 'kannada':
                return 'kn';
            case 'kazakh':
                return 'kk';
            case 'latvian':
                return 'lv';
            case 'lithuanian':
                return 'lt';
            case 'macedonian':
                return 'mk';
            case 'malay':
                return 'ms';
            case 'maltese':
                return 'mt';
            case 'maori':
                return 'mi';
            case 'polish':
                return 'pl';
            case 'portuguese':
                return 'pt';
            case 'punjabi':
                return 'pa';
            case 'samoan':
                return 'sm';
            case 'serbian':
                return 'sr';
            case 'shona':
                return 'sn';
            case 'spanish':
                return 'es';
            case 'swedish':
                return 'sv';
            case 'turkish':
                return 'tr';
            case 'welsh':
                return 'cy';
            default:
                return language.substr(0, 2);
        }
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
        const response = await fetch('./data/langs/' + language + '.txt');
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
        TextGenerator.initModel(sources);
        this.setState({
            output: TextGenerator.generate(5).map(l => l.line)
        });
    }

    private reset() {
        this.setState({
            sources: {},
            output: []
        });
    }

    private getVoices() {
        return new Promise<SpeechSynthesisVoice[]>(resolve => {
            let list = window.speechSynthesis.getVoices();
            if (list.length > 0) {
                resolve(list);
                return;
            }
            speechSynthesis.onvoiceschanged = () => {
                list = window.speechSynthesis.getVoices();
                resolve(list);
            };
        });
    }

    private async chooseVoice() {
        const voices = await this.getVoices();

        // Get language codes for the selected languages
        const langCodes = Object.keys(this.state.sources).map(lang => this.getLanguageCode(lang));

        // Filter voice list by these language codes
        let candidates = voices.filter(v => langCodes.includes(v.lang.substr(0, 2)));
        if (candidates.length === 0) {
            candidates = voices.filter(v => v.default);
        }

        const index = Math.floor(Math.random() * candidates.length);
        return candidates[index];
    }

    private async say(e: React.MouseEvent, text: string) {
        e.preventDefault();

        if (window.speechSynthesis.speaking) {
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = await this.chooseVoice();
        window.speechSynthesis.speak(utterance);
    }

    public render() {
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
                    <div className='column' key={lang}>
                        <Checkbox
                            label={lang}
                            checked={isSelected}
                            showCheck={false}
                            changeValue={value => value ? this.addLanguage(lang) : this.removeLanguage(lang)}
                        />
                    </div>
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
                <div key={n} className='section' onDoubleClick={e => this.say(e, this.state.output[n])}>
                    {this.state.output[n].toLowerCase()}
                </div>
            );
        }

        return (
            <div className='language'>
                <div className='heading'>presets</div>
                <Selector
                    options={presetOptions}
                    selectedID={selectedPreset}
                    select={optionID => this.usePreset(optionID)}
                />
                <div className='divider' />
                <Expander
                    text={'selected languages: ' + selectedLanguages}
                    content={
                        <div className='row collapse small-up-1 medium-up-2 large-up-3 language-options'>
                            {languages}
                        </div>
                    }
                />
                <div className='divider' />
                <ControlRow
                    controls={[
                        <button key='generate' className={allowGenerate ? '' : 'disabled'} onClick={() => this.generate()}>generate text</button>,
                        <button key='reset' className={allowReset ? '' : 'disabled'} onClick={() => this.reset()}>reset</button>,
                        <button key='random' onClick={() => this.random()}>random sources</button>
                    ]}
                />
                <div className='language-output'>
                    {output}
                </div>
            </div>
        );
    }
}
