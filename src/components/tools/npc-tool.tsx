import React from 'react';

import Shakespeare from '../../utils/shakespeare';

interface Props {
}

interface State {
    description: string;
    physical: string;
    mental: string;
    speech: string;
}

export default class NPCTool extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            description: Shakespeare.generateNPC(),
            physical: Shakespeare.generateNPCPhysical(),
            mental: Shakespeare.generateNPCMental(),
            speech: Shakespeare.generateNPCSpeech()
        };
    }

    private generate() {
        this.setState({
            description: Shakespeare.generateNPC(),
            physical: Shakespeare.generateNPCPhysical(),
            mental: Shakespeare.generateNPCMental(),
            speech: Shakespeare.generateNPCSpeech()
        });
    }

    public render() {
        try {
            return (
                <div>
                    <button onClick={() => this.generate()}>generate</button>
                    <div className='section'>{this.state.description}</div>
                    {this.state.physical ? <div className='section'>physical: {this.state.physical}</div> : null}
                    {this.state.mental ? <div className='section'>personality: {this.state.mental}</div> : null}
                    {this.state.speech ? <div className='section'>speech: {this.state.speech}</div> : null}
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}
