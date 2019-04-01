import React from 'react';

import { DMModule } from '../../models/dm-module';

import DMScreenCard from '../cards/information/dm-screen-card';
import ActionsModule from '../dm-modules/actions-module';
import ConditionsModule from '../dm-modules/conditions-module';
import SkillsModule from '../dm-modules/skills-module';
import DMModuleListItem from '../list-items/dm-module-list-item';

interface Props {
    selectedModuleID: string | null;
    showHelp: boolean;
    selectModule: (module: DMModule | null) => void;
}

export default class DMScreen extends React.Component<Props> {
    constructor(props: Props) {
        super(props);

        this.getModules().forEach(m => m.init());
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
                        selected={m.id === this.props.selectedModuleID}
                        setSelection={module => this.props.selectModule(module)}
                    />
                );
            }

            let content: JSX.Element | null = null;
            if (this.props.selectedModuleID) {
                const module = modules.find(m => m.id === this.props.selectedModuleID);
                if (module) {
                    content = <div className="dm-module">{module.getContent()}</div>;
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
