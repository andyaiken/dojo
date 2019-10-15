import React from 'react';

import { MonsterGroup } from '../../models/monster-group';

import Selector from '../controls/selector';
import ActionsModule from './dm/actions-module';
import ConditionsModule from './dm/conditions-module';
import DemographicsModule from './dm/demographics-module';
import DieRollerModule from './dm/die-roller-module';
import LanguageModule from './dm/language-module';
import NameModule from './dm/name-module';
import SkillsModule from './dm/skills-module';

interface Props {
    library: MonsterGroup[];
}

interface State {
    view: string;
}

export default class DMTool extends React.Component<Props, State> {
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
                    text: 'skills reference'
                },
                {
                    id: 'conditions',
                    text: 'conditions reference'
                },
                {
                    id: 'actions',
                    text: 'actions reference'
                },
                {
                    id: 'die',
                    text: 'die roller'
                },
                {
                    id: 'language',
                    text: 'language generator'
                },
                {
                    id: 'name',
                    text: 'name generator'
                },
                {
                    id: 'demographics',
                    text: 'monster demographics'
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
                case 'die':
                    content = (
                        <DieRollerModule />
                    );
                    break;
                case 'language':
                    content = (
                        <LanguageModule />
                    );
                    break;
                case 'name':
                    content = (
                        <NameModule />
                    );
                    break;
                case 'demographics':
                    content = (
                        <DemographicsModule library={this.props.library} />
                    );
            }

            return (
                <div className='tools'>
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
