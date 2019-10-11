import React from 'react';

import Selector from '../controls/selector';
import ActionsModule from './reference/actions-module';
import ConditionsModule from './reference/conditions-module';
import SkillsModule from './reference/skills-module';

// tslint:disable-next-line:no-empty-interface
interface Props {
    //
}

interface State {
    view: string;
}

export default class ReferenceTool extends React.Component<Props, State> {
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
                        <SkillsModule />
                    );
                    break;
                case 'conditions':
                    content = (
                        <ConditionsModule />
                    );
                    break;
                case 'actions':
                    content = (
                        <ActionsModule />
                    );
                    break;
            }

            return (
                <div className='reference'>
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
