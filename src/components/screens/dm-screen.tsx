import React from 'react';

import { DMModule } from '../../models/dm-module';

import DMScreenCard from '../cards/information/dm-screen-card';
import ActionsModule from '../dm-modules/actions-module';
import ConditionsModule from '../dm-modules/conditions-module';
import SkillsModule from '../dm-modules/skills-module';
import DMModuleListItem from '../list-items/dm-module-list-item';

interface Props {
    showHelp: boolean;
}

interface State {
    moduleID: string | null;
}

export default class DMScreen extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            moduleID: null
        };
    }

    private setModule(moduleID: string) {
        this.setState({
            moduleID: moduleID
        });
    }

    private getModules(): DMModule[] {
        return [
            new SkillsModule(),
            new ConditionsModule(),
            new ActionsModule()
        ];
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
                        selected={m.id === this.state.moduleID}
                        setSelection={module => this.setModule(module.id)}
                    />
                );
            }

            let content: JSX.Element | null = null;
            if (this.state.moduleID) {
                const module = modules.find(m => m.id === this.state.moduleID);
                if (module) {
                    content = module.getContent();
                }
            }

            return (
                <div className='dm-screen row collapse'>
                    <div className='columns small-4 medium-4 large-3 scrollable list-column'>
                        {help}
                        {moduleListItems}
                    </div>
                    <div className='columns small-8 medium-8 large-9 scrollable'>
                        {content}
                    </div>
                </div>
            );
        } catch (ex) {
            console.error(ex);
        }
    }
}
