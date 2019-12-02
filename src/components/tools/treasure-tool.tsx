import React from 'react';

import Shakespeare from '../../utils/shakespeare';

interface Props {
}

interface State {
    current: string;
}

export default class TreasureTool extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            current: Shakespeare.generateTreasure()
        };
    }

    private generate() {
        this.setState({
            current: Shakespeare.generateTreasure()
        });
    }

    public render() {
        try {
            return (
                <div>
                    <button onClick={() => this.generate()}>generate</button>
                    <div className='section'>{this.state.current}</div>
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}
