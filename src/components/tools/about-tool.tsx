import React from 'react';

import Selector from '../controls/selector';
import AboutModule from './about/about-module';
import OGLModule from './about/ogl-module';
import OptionsModule from './about/options-module';

// tslint:disable-next-line:no-empty-interface
interface Props {
    resetAll: () => void;
}

interface State {
    view: string;
}

export default class AboutTool extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            view: 'about'
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
                    id: 'about',
                    text: 'about dojo'
                },
                {
                    id: 'ogl',
                    text: 'ogl'
                },
                {
                    id: 'options',
                    text: 'options'
                }
            ];

            let content = null;
            switch (this.state.view) {
                case 'about':
                    content = (
                        <AboutModule />
                    );
                    break;
                case 'ogl':
                    content = (
                        <OGLModule />
                    );
                    break;
                case 'options':
                    content = (
                        <OptionsModule resetAll={() => this.props.resetAll()} />
                    );
                    break;
            }

            return (
                <div className='about'>
                    <Selector
                        options={options}
                        selectedID={this.state.view}
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
