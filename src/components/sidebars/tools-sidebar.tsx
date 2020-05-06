import React from 'react';

import Selector from '../controls/selector';
import DieRollerTool from './tools/die-roller-tool';
import HandoutTool from './tools/handout-tool';
import LanguageTool from './tools/language-tool';
import OracleTool from './tools/oracle-tool';

interface Props {
}

interface State {
    view: string;
}

export default class ToolsSidebar extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            view: 'die'
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
                    id: 'die',
                    text: 'die roller'
                },
                {
                    id: 'handout',
                    text: 'handout'
                },
                {
                    id: 'language',
                    text: 'language'
                },
                {
                    id: 'oracle',
                    text: 'oracle'
                }
            ];

            let content = null;
            switch (this.state.view) {
                case 'die':
                    content = (
                        <DieRollerTool />
                    );
                    break;
                case 'handout':
                    content = (
                        <HandoutTool />
                    );
                    break;
                case 'language':
                    content = (
                        <LanguageTool />
                    );
                    break;
                case 'oracle':
                    content = (
                        <OracleTool />
                    );
                    break;
            }

            return (
                <div className='sidebar-container'>
                    <div className='sidebar-header'>
                        <div className='heading'>tools</div>
                        <Selector
                            options={options}
                            selectedID={this.state.view}
                            itemsPerRow={4}
                            select={optionID => this.setView(optionID)}
                        />
                    </div>
                    <div className='sidebar-content'>
                        {content}
                    </div>
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}
