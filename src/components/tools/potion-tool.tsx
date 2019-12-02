import React from 'react';

import Shakespeare from '../../utils/shakespeare';

interface Props {
}

interface State {
    current: string;
}

export default class PotionTool extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            current: Shakespeare.generatePotion()
        };
    }

    private generate() {
        this.setState({
            current: Shakespeare.generatePotion()
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
