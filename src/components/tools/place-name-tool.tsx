import React from 'react';

import Shakespeare from '../../utils/shakespeare';

interface Props {
}

interface State {
    source: string | null;
    output: string[];
}

export default class PlaceNameTool extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            source: null,
            output: []
        };
    }

    private async fetchData() {
        const response = await fetch('/dojo/data/places.txt');
        const text = await response.text();
        this.setState({
            source: text
        });
    }

    private generate() {
        Shakespeare.initModel([this.state.source as string]);
        this.setState({
            output: Shakespeare.generate(10).map(l => l.line)
        });
    }

    public render() {
        try {
            if (!this.state.source) {
                this.fetchData();
            }

            const output = [];
            for (let n = 0; n !== this.state.output.length; ++n) {
                output.push(
                    <div key={n} className='section large'>
                        {this.state.output[n]}
                    </div>
                );
            }

            return (
                <div>
                    <div className='subheading'>place names</div>
                    <button onClick={() => this.generate()}>generate</button>
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
