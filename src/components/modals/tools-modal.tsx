import React from 'react';

import { MonsterGroup } from '../../models/monster-group';

import Selector from '../controls/selector';
import AboutTool from '../tools/about-tool';
import DMTool from '../tools/dm-tool';

interface Props {
    library: MonsterGroup[];
    resetAll: () => void;
}

interface State {
    view: string;
}

export default class ToolsModal extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            view: 'dm'
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
                case 'dm':
                    content = <DMTool library={this.props.library} />;
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
