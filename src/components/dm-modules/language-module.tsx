import React from 'react';

import TextGenerator from '../../utils/text-generation';

interface Props {
    //
}

interface State {
    sources: { [id: string]: string; },
    generated: string
}

export default class LanguageModule extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            sources: {},
            generated: ''
        };
    }

    /*
    fetchSource('English', '/data/langs/eng.txt');
    fetchSource('gae', '/data/langs/gae.txt');
    fetchSource('cym', '/data/langs/cym.txt');
    fetchSource('fra', '/data/langs/fra.txt');
    fetchSource('deu', '/data/langs/deu.txt');
    fetchSource('esp', '/data/langs/esp.txt');
    fetchSource('ita', '/data/langs/ita.txt');
    fetchSource('por', '/data/langs/por.txt');
    fetchSource('rus', '/data/langs/rus.txt');
    fetchSource('arm', '/data/langs/arm.txt');
    // bulg
    // romanian
    // romany
    fetchSource('ara', '/data/langs/ara.txt');
    fetchSource('gre', '/data/langs/gre.txt');
    fetchSource('tur', '/data/langs/tur.txt');
    fetchSource('sve', '/data/langs/sve.txt');
    fetchSource('nor', '/data/langs/nor.txt');
    fetchSource('dan', '/data/langs/dan.txt');
    fetchSource('fin', '/data/langs/fin.txt');
    */

    private async fetchData(field: string, path: string) {
        const response = await fetch(path);
        this.state.sources[field] = await response.text();
        this.setState({
            sources: this.state.sources
        });
    }

    private generate() {
        const sources: string[] = [];
        Object.keys(this.state.sources).forEach(key => {
            const src = this.state.sources[key]
            sources.push(src);
        });
        TextGenerator.initModel(sources);
        const str = TextGenerator.generate(1)[0];
        this.setState({
            generated: str
        });
    }

    public render() {
        var allowGenerate = Object.keys(this.state.sources).length > 0;
        return (
            <div>
                <button onClick={() => this.fetchData('English', '/data/langs/english.txt')}>add english</button>
                <button onClick={() => this.fetchData('Latin', '/data/langs/latin.txt')}>add latin</button>
                <button className={allowGenerate ? '' : 'disabled'} onClick={() => this.generate()}>generate</button>
                <div>{this.state.generated}</div>
            </div>
        );
    }
}
