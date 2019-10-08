import React from 'react';

import Shakespeare from '../../../utils/shakespeare';

// tslint:disable-next-line:no-empty-interface
interface Props {
    //
}

interface State {
    output: {
        male: string[],
        female: string[],
        surname: string[]
    };
}

export default class NameModule extends React.Component<Props, State> {
    constructor(props: Props) {
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
            <div>
                <div className='name-output'>
                    <div className='row'>
                        <div className='columns small-4 medium-4 large-4'>
                            <div className='heading'>male names</div>
                            <button onClick={() => this.generate('male')}>generate</button>
                            {male}
                        </div>
                        <div className='columns small-4 medium-4 large-4'>
                            <div className='heading'>female names</div>
                            <button onClick={() => this.generate('female')}>generate</button>
                            {female}
                        </div>
                        <div className='columns small-4 medium-4 large-4'>
                            <div className='heading'>surnames</div>
                            <button onClick={() => this.generate('surname')}>generate</button>
                            {surname}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
