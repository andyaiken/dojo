import React from 'react';

import Shakespeare from '../../utils/shakespeare';

interface Props {
}

interface State {
    values: string[];
}

export default class BookTool extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            values: []
        };
    }

    private generate() {
        const values: string[] = [];
        while (values.length < 10) {
            const v = Shakespeare.generateBookTitle();
            if (!values.includes(v)) {
                values.push(v);
            }
        }
        values.sort();

        this.setState({
            values: values
        });
    }

    public render() {
        try {
            const values = [];
            for (let n = 0; n !== this.state.values.length; ++n) {
                values.push(
                    <div key={n} className='section large'>
                        {this.state.values[n].toLowerCase()}
                    </div>
                );
            }

            return (
                <div>
                    <div className='subheading'>book title</div>
                    <button onClick={() => this.generate()}>generate</button>
                    {values}
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}
