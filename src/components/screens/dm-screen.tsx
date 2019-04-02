import React from 'react';

import { DMModule } from '../../models/dm-module';

import DMScreenCard from '../cards/information/dm-screen-card';
import ActionsModule from '../dm-modules/actions-module';
import ConditionsModule from '../dm-modules/conditions-module';
import LanguageModule from '../dm-modules/language-module';
import SkillsModule from '../dm-modules/skills-module';
import DMModuleListItem from '../list-items/dm-module-list-item';

interface Props {
    selectedModuleID: string | null;
    showHelp: boolean;
    selectModule: (module: DMModule | null) => void;
}

export default class DMScreen extends React.Component<Props> {
    private getModules(): DMModule[] {
        return [
            {
                id: 'skills',
                name: 'skills',
                desc: 'listing of all the skills in the game'
            },
            {
                id: 'conditions',
                name: 'conditions',
                desc: 'information about conditions and their effects'
            },
            {
                id: 'actions',
                name: 'actions',
                desc: 'list of the available action types and examples'
            },
            {
                id: 'language',
                name: 'language',
                desc: 'this tool allows you to generate unique languages'
            }
        ];
    }

    private getContent(): JSX.Element | null {
        switch (this.props.selectedModuleID) {
            case 'skills':
                return (
                    <SkillsModule />
                );
            case 'conditions':
                return (
                    <ConditionsModule />
                );
            case 'actions':
                return (
                    <ActionsModule />
                );
            case 'language':
                return (
                    <LanguageModule />
                );
            default:
                return null;
        }
    }

    public render() {
        try {
            let help = null;
            if (this.props.showHelp) {
                help = (
                    <DMScreenCard />
                );
            }

            const modules: DMModule[] = this.getModules();

            const moduleListItems = [];
            for (let n = 0; n !== modules.length; ++n) {
                const m = modules[n];
                moduleListItems.push(
                    <DMModuleListItem
                        key={m.id}
                        module={m}
                        selected={m.id === this.props.selectedModuleID}
                        setSelection={module => this.props.selectModule(module)}
                    />
                );
            }

            return (
                <div className='dm-screen row collapse'>
                    <div className='columns small-4 medium-4 large-3 scrollable list-column'>
                        {help}
                        {moduleListItems}
                    </div>
                    <div className='columns small-8 medium-8 large-9 scrollable'>
                        <div className='dm-module'>
                            {this.getContent()}
                        </div>
                    </div>
                </div>
            );
        } catch (ex) {
            console.error(ex);
        }
    }
}
