import React from 'react';

import Selector from '../controls/selector';

import ActionsTool from '../tools/actions-tool';
import ConditionsTool from '../tools/conditions-tool';
import SkillsTool from '../tools/skills-tool';

interface Props {
}

interface State {
    view: string;
}

export default class ReferenceSidebar extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            view: 'skills'
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
                    id: 'skills',
                    text: 'skills'
                },
                {
                    id: 'conditions',
                    text: 'conditions'
                },
                {
                    id: 'actions',
                    text: 'actions'
                }
            ];

            let content = null;
            switch (this.state.view) {
                case 'skills':
                    content = (
                        <SkillsTool />
                    );
                    break;
                case 'conditions':
                    content = (
                        <ConditionsTool />
                    );
                    break;
                case 'actions':
                    content = (
                        <ActionsTool />
                    );
                    break;
            }

            return (
                <div>
                    <Selector
                        options={options}
                        selectedID={this.state.view}
                        itemsPerRow={3}
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
