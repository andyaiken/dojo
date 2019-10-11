import React from 'react';

import Selector from '../controls/selector';
import AboutTool from '../tools/about-tool';
import DMTool from '../tools/dm-tool';
import ReferenceTool from '../tools/reference-tool';

interface Props {
    resetAll: () => void;
}

interface State {
    view: string;
}

export default class ToolsSidebar extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            view: 'ref'
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
                    id: 'ref',
                    text: 'reference'
                },
                {
                    id: 'dm',
                    text: 'dm tools'
                },
                {
                    id: 'about',
                    text: 'about'
                }
            ];

            let content = null;
            switch (this.state.view) {
                case 'ref':
                    content = <ReferenceTool />;
                    break;
                case 'dm':
                    content = <DMTool />;
                    break;
                case 'about':
                    content = <AboutTool resetAll={() => this.props.resetAll()} />;
                    break;
            }

            return (
                <div>
                    <Selector
                        tabs={true}
                        options={options}
                        selectedID={this.state.view}
                        select={optionID => this.setView(optionID)}
                    />
                    {content}
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
