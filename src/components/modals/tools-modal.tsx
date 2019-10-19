import React from 'react';

import { Col, Collapse, Icon, Row, Spin } from 'antd';
import Showdown from 'showdown';

import Shakespeare from '../../utils/shakespeare';
import Ustinov from '../../utils/ustinov';
import Utils from '../../utils/utils';

import { CATEGORY_TYPES, Monster, MonsterGroup, SIZE_TYPES } from '../../models/monster-group';

import Checkbox from '../controls/checkbox';
import ControlRow from '../controls/control-row';
import NumberSpin from '../controls/number-spin';
import Selector from '../controls/selector';
import GridPanel from '../panels/grid-panel';

const showdown = new Showdown.Converter();
showdown.setOption('tables', true);

interface Props {
    library: MonsterGroup[];
}

interface State {
    view: string;
}

export default class ToolsModal extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            view: 'skills'
        };
    }

    private setView(view: string) {
        this.setState({
            view: view
        });
    }

    public render() {
        try {
            const options = [
                {
                    id: 'skills',
                    text: 'skills reference'
                },
                {
                    id: 'conditions',
                    text: 'conditions reference'
                },
                {
                    id: 'actions',
                    text: 'actions reference'
                },
                {
                    id: 'die',
                    text: 'die roller'
                },
                {
                    id: 'language',
                    text: 'language generator'
                },
                {
                    id: 'name',
                    text: 'name generator'
                },
                {
                    id: 'demographics',
                    text: 'monster demographics'
                }
            ];

            let content = null;
            switch (this.state.view) {
                case 'skills':
                    content = (
                        <SkillsModule />
                    );
                    break;
                case 'conditions':
                    content = (
                        <ConditionsModule />
                    );
                    break;
                case 'actions':
                    content = (
                        <ActionsModule />
                    );
                    break;
                case 'die':
                    content = (
                        <DieRollerModule />
                    );
                    break;
                case 'language':
                    content = (
                        <LanguageModule />
                    );
                    break;
                case 'name':
                    content = (
                        <NameModule />
                    );
                    break;
                case 'demographics':
                    content = (
                        <DemographicsModule library={this.props.library} />
                    );
            }

            return (
                <div className='scrollable'>
                    <div className='heading'>dm tools</div>
                    <Selector
                        options={options}
                        selectedID={this.state.view}
                        itemsPerRow={3}
                        select={optionID => this.setView(optionID)}
                    />
                    <div className='divider' />
                    {content}
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}

// tslint:disable-next-line:no-empty-interface
interface ActionsModuleProps {
    //
}

interface ActionsModuleState {
    source: string | null;
}

class ActionsModule extends React.Component<ActionsModuleProps, ActionsModuleState> {
    constructor(props: ActionsModuleProps) {
        super(props);

        this.state = {
            source: null
        };
    }

    private async fetchData() {
        const response = await fetch('./data/actions.md');
        const text = await response.text();
        this.setState({
            source: text
        });
    }

    public render() {
        try {
            if (!this.state.source) {
                this.fetchData();
            }

            const icon = <Icon type='loading' style={{ fontSize: 20, marginTop: 100 }} spin={true} />;

            return (
                <Spin spinning={this.state.source === null} indicator={icon}>
                    <div dangerouslySetInnerHTML={{ __html: showdown.makeHtml(this.state.source || '') }} />
                </Spin>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}

// tslint:disable-next-line:no-empty-interface
interface ConditionsModuleProps {
    //
}

interface ConditionsModuleState {
    source: string | null;
}

class ConditionsModule extends React.Component<ConditionsModuleProps, ConditionsModuleState> {
    constructor(props: ConditionsModuleProps) {
        super(props);

        this.state = {
            source: null
        };
    }

    private async fetchData() {
        const response = await fetch('./data/conditions.md');
        const text = await response.text();
        this.setState({
            source: text
        });
    }

    public render() {
        try {
            if (!this.state.source) {
                this.fetchData();
            }

            const icon = <Icon type='loading' style={{ fontSize: 20, marginTop: 100 }} spin={true} />;

            return (
                <Spin spinning={this.state.source === null} indicator={icon}>
                    <div dangerouslySetInnerHTML={{ __html: showdown.makeHtml(this.state.source || '') }} />
                </Spin>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}

interface DemographicsModuleProps {
    library: MonsterGroup[];
}

interface DemographicsModuleState {
    chart: string;
}

class DemographicsModule extends React.Component<DemographicsModuleProps, DemographicsModuleState> {
    constructor(props: DemographicsModuleProps) {
        super(props);
        this.state = {
            chart: 'challenge'
        };
    }

    private selectChart(chart: string) {
        this.setState({
            chart: chart
        });
    }

    public render() {
        try {
            const allMonsters: Monster[] = [];
            this.props.library.forEach(group => group.monsters.forEach(monster => allMonsters.push(monster)));
            if (allMonsters.length === 0) {
                return null;
            }

            const buckets: { value: any, title: string }[] = [];
            let maxBucketSize = 0;
            const monsters: { [key: string]: Monster[] } = {};

            switch (this.state.chart) {
                case 'challenge':
                    const challenges = [
                        0, 0.125, 0.25, 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30
                    ];
                    challenges.forEach(cr => {
                        buckets.push({
                            value: cr,
                            title: 'challenge ' + Utils.challenge(cr)
                        });
                    });

                    buckets.forEach(bucket => {
                        const cr = bucket.value;
                        monsters[cr.toString()] = allMonsters.filter(monster => monster.challenge === cr);
                    });

                    buckets.forEach(bucket => {
                        const cr = bucket.value;
                        maxBucketSize = Math.max(monsters[cr].length, maxBucketSize);
                    });
                    break;
                case 'size':
                    SIZE_TYPES.forEach(size => {
                        buckets.push({
                            value: size,
                            title: size
                        });
                    });

                    buckets.forEach(bucket => {
                        const size = bucket.value;
                        monsters[size.toString()] = allMonsters.filter(monster => monster.size === size);
                    });

                    buckets.forEach(bucket => {
                        const size = bucket.value;
                        maxBucketSize = Math.max(monsters[size].length, maxBucketSize);
                    });
                    break;
                case 'type':
                    CATEGORY_TYPES.forEach(type => {
                        buckets.push({
                            value: type,
                            title: type
                        });
                    });

                    buckets.forEach(bucket => {
                        const type = bucket.value;
                        monsters[type.toString()] = allMonsters.filter(monster => monster.category === type);
                    });

                    buckets.forEach(bucket => {
                        const type = bucket.value;
                        maxBucketSize = Math.max(monsters[type].length, maxBucketSize);
                    });
                    break;
                default:
                    // Do nothing
                    break;
            }

            const bars = [];
            for (let index = 0; index !== buckets.length; ++index) {
                const bucket = buckets[index];
                const set = monsters[bucket.value];
                const count = set ? set.length : 0;
                bars.push(
                    <div
                        key={bucket.title}
                        className='bar-container'
                        title={bucket.title + ': ' + set.length + ' monsters'}
                    >
                        <div
                            className='bar'
                            style={{
                                width: 'calc((100% - 1px) * ' + count + ' / ' + maxBucketSize + ')'
                            }}
                        />
                    </div>
                );
            }

            const chartOptions = [
                {
                    id: 'challenge',
                    text: 'challenge rating'
                },
                {
                    id: 'size',
                    text: 'size'
                },
                {
                    id: 'type',
                    text: 'type'
                }
            ];

            return (
                <div>
                    <Selector
                        options={chartOptions}
                        selectedID={this.state.chart}
                        select={optionID => this.selectChart(optionID)}
                    />
                    <div className='chart'>
                        <div className='plot'>{bars}</div>
                    </div>
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}

// tslint:disable-next-line:no-empty-interface
interface DieRollerModuleProps {
    //
}

interface DieRollerModuleState {
    dice: string;
    count: number;
    options: string[];
    rolls: number[] | null;
    result: number | null;
}

class DieRollerModule extends React.Component<DieRollerModuleProps, DieRollerModuleState> {
    constructor(props: DieRollerModuleProps) {
        super(props);

        this.state = {
            dice: '20',
            count: 1,
            options: [],
            rolls: null,
            result: null
        };
    }

    private setDice(dice: string) {
        this.setState({
            dice: dice
        });
    }

    private nudgeCount(delta: number) {
        this.setState({
            count: Math.max(1, this.state.count + delta)
        });
    }

    private toggleOption(option: string) {
        if (this.state.options.includes(option)) {
            // Remove option
            const index = this.state.options.indexOf(option);
            this.state.options.splice(index, 1);
        } else {
            // Add option
            this.state.options.push(option);
            // Make sure we don't have both advantage and disadvantage
            if (this.state.options.includes('advantage') && this.state.options.includes('disadvantage')) {
                const index = this.state.options.indexOf(option === 'advantage' ? 'disadvantage' : 'advantage');
                this.state.options.splice(index, 1);
            }
        }
        this.setState({
            options: this.state.options
        });
    }

    private roll() {
        const sides = parseInt(this.state.dice, 10);

        const rolls: number[] = [];
        let count = this.state.count;
        if (this.state.options.includes('advantage') || this.state.options.includes('disadvantage')) {
            count = 2;
        }
        for (let n = 0; n !== count; ++n) {
            rolls.push(Utils.dieRoll(sides));
        }
        rolls.sort((a, b) => a - b);

        let result = 0;
        if ((this.state.count === 1) && (this.state.dice === '20') && this.state.options.includes('advantage')) {
            result = Math.max(...rolls);
        } else if ((this.state.count === 1) && (this.state.dice === '20') && this.state.options.includes('disadvantage')) {
            result = Math.min(...rolls);
        } else {
            rolls.forEach(roll => result += roll);
            if ((this.state.count > 1) && this.state.options.includes('drop lowest')) {
                result -= Math.min(...rolls);
            }
            if ((this.state.count > 1) && this.state.options.includes('drop highest')) {
                result -= Math.max(...rolls);
            }
        }

        this.setState({
            rolls: rolls,
            result: result
        });
    }

    public render() {
        try {
            const options = [
                {
                    id: '4',
                    text: 'd4'
                },
                {
                    id: '6',
                    text: 'd6'
                },
                {
                    id: '8',
                    text: 'd8'
                },
                {
                    id: '10',
                    text: 'd10'
                },
                {
                    id: '12',
                    text: 'd12'
                },
                {
                    id: '20',
                    text: 'd20'
                },
                {
                    id: '100',
                    text: 'd100'
                }
            ];

            let optionsSection = null;
            if ((this.state.dice === '20') && (this.state.count === 1)) {
                optionsSection = (
                    <ControlRow
                        controls={[
                            <Checkbox
                                key='advantage'
                                label='advantage'
                                checked={this.state.options.includes('advantage')}
                                changeValue={value => this.toggleOption('advantage')}
                            />,
                            <Checkbox
                                key='disadvantage'
                                label='disadvantage'
                                checked={this.state.options.includes('disadvantage')}
                                changeValue={value => this.toggleOption('disadvantage')}
                            />
                        ]}
                    />
                );
            } else if (this.state.count > 1) {
                optionsSection = (
                    <ControlRow
                        controls={[
                            <Checkbox
                                key='drop-lowest'
                                label='drop lowest'
                                checked={this.state.options.includes('drop lowest')}
                                changeValue={value => this.toggleOption('drop lowest')}
                            />,
                            <Checkbox
                                key='drop-highest'
                                label='drop highest'
                                checked={this.state.options.includes('drop highest')}
                                changeValue={value => this.toggleOption('drop highest')}
                            />
                        ]}
                    />
                );
            }

            let rollsSection = null;
            if ((this.state.rolls !== null) && (this.state.rolls.length > 1)) {
                rollsSection = (
                    <div className='section die-rolls'>{this.state.rolls.join(', ')}</div>
                );
            }

            let resultSection = null;
            if (this.state.result !== null) {
                resultSection = (
                    <div className='section die-result'>{this.state.result}</div>
                );
            }

            return (
                <div>
                    <div className='subheading'>die type</div>
                    <Selector
                        options={options}
                        selectedID={this.state.dice}
                        select={optionID => this.setDice(optionID)}
                    />
                    <div className='subheading'>number of dice to roll</div>
                    <NumberSpin
                        source={this.state}
                        name='count'
                        display={count => count + 'd' + this.state.dice}
                        nudgeValue={delta => this.nudgeCount(delta)}
                    />
                    {optionsSection ? <div className='subheading'>options</div> : null}
                    {optionsSection}
                    <div className='divider' />
                    <button onClick={() => this.roll()}>roll dice</button>
                    {rollsSection}
                    {resultSection}
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}

// tslint:disable-next-line:no-empty-interface
interface LanguageModuleProps {
    //
}

interface LanguageModuleState {
    sources: { [id: string]: string; };
    output: string[];
}

interface LanguagePreset {
    name: string;
    languages: string[];
}

class LanguageModule extends React.Component<LanguageModuleProps, LanguageModuleState> {
    constructor(props: LanguageModuleProps) {
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
                    <Collapse
                        bordered={false}
                        expandIcon={p => <Icon type='down-circle' rotate={p.isActive ? -180 : 0} />}
                        expandIconPosition={'right'}
                    >
                        <Collapse.Panel key='one' header={'selected languages: ' + selectedLanguages}>
                            <GridPanel content={languages} />
                        </Collapse.Panel>
                    </Collapse>
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
        e.preventDefault();
        navigator.clipboard.writeText(this.props.text);
    }

    private say(e: React.MouseEvent) {
        e.preventDefault();
        Ustinov.say(this.props.text, this.props.languages);
    }

    public render() {
        try {
            return (
                <Collapse
                    bordered={false}
                    expandIcon={p => <Icon type='down-circle' rotate={p.isActive ? -180 : 0} />}
                    expandIconPosition={'right'}
                >
                    <Collapse.Panel key='one' header={this.props.text.toLowerCase()}>
                        <button onClick={e => this.copy(e)}>copy to clipboard</button>
                        <button onClick={e => this.say(e)}>say</button>
                        <div className='section'>
                            <b>note:</b> speech may not work consistently on all platforms
                        </div>
                    </Collapse.Panel>
                </Collapse>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}

// tslint:disable-next-line:no-empty-interface
interface NameModuleProps {
    //
}

interface NameModuleState {
    output: {
        male: string[],
        female: string[],
        surname: string[]
    };
}

class NameModule extends React.Component<NameModuleProps, NameModuleState> {
    constructor(props: NameModuleProps) {
        super(props);

        this.state = {
            output: {
                male: [],
                female: [],
                surname: []
            }
        };
    }

    private async generate(type: 'male' | 'female' | 'surname') {
        const response = await fetch('./data/names/' + type + '.txt');
        const input = await response.text();

        Shakespeare.initModel([input]);
        const names = Shakespeare.generate(10).map(n => n.line).sort();

        this.state.output[type] = names;
        this.setState({
            output: this.state.output
        });
    }

    public render() {
        try {
            const male = [];
            for (let n = 0; n !== this.state.output.male.length; ++n) {
                male.push(
                    <div key={n} className='section'>
                        {this.state.output.male[n].toLowerCase()}
                    </div>
                );
            }

            const female = [];
            for (let n = 0; n !== this.state.output.female.length; ++n) {
                female.push(
                    <div key={n} className='section'>
                        {this.state.output.female[n].toLowerCase()}
                    </div>
                );
            }

            const surname = [];
            for (let n = 0; n !== this.state.output.surname.length; ++n) {
                surname.push(
                    <div key={n} className='section'>
                        {this.state.output.surname[n].toLowerCase()}
                    </div>
                );
            }

            return (
                <div className='name-output'>
                    <Row gutter={10}>
                        <Col span={8}>
                            <div className='heading'>male names</div>
                            <button onClick={() => this.generate('male')}>generate</button>
                            {male}
                        </Col>
                        <Col span={8}>
                            <div className='heading'>female names</div>
                            <button onClick={() => this.generate('female')}>generate</button>
                            {female}
                        </Col>
                        <Col span={8}>
                            <div className='heading'>surnames</div>
                            <button onClick={() => this.generate('surname')}>generate</button>
                            {surname}
                        </Col>
                    </Row>
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}

// tslint:disable-next-line:no-empty-interface
interface SkillsModuleProps {
    //
}

interface SkillsModuleState {
    source: string | null;
}

class SkillsModule extends React.Component<SkillsModuleProps, SkillsModuleState> {
    constructor(props: SkillsModuleProps) {
        super(props);

        this.state = {
            source: null
        };
    }

    private async fetchData() {
        const response = await fetch('./data/skills.md');
        const text = await response.text();
        this.setState({
            source: text
        });
    }

    public render() {
        try {
            if (!this.state.source) {
                this.fetchData();
            }

            const icon = <Icon type='loading' style={{ fontSize: 20, marginTop: 100 }} spin={true} />;

            return (
                <Spin spinning={this.state.source === null} indicator={icon}>
                    <div dangerouslySetInnerHTML={{ __html: showdown.makeHtml(this.state.source || '') }} />
                </Spin>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}
