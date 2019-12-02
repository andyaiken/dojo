import React from 'react';

import Shakespeare from '../../utils/shakespeare';

interface Props {
}

interface State {
    names: string[];
}

export default class NameTool extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            names: []
        };
    }

    private async generate() {
        this.setState({
            names: Shakespeare.generateNames(10)
        });
    }

    public render() {
        try {
            const names = [];
            for (let n = 0; n !== this.state.names.length; ++n) {
                names.push(
                    <div key={n} className='section name-output'>
                        {this.state.names[n].toLowerCase()}
                    </div>
                );
            }

            return (
                <div className='name-output'>
                    <div className='subheading'>names</div>
                    <button onClick={() => this.generate()}>generate</button>
                    {names}
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}
