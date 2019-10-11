import React from 'react';

import { MonsterGroup } from '../../models/monster-group';

import Selector from '../controls/selector';
import DieRollerModule from './dm/die-roller-module';
import LanguageModule from './dm/language-module';
import NameModule from './dm/name-module';
import DemographicsModule from './dm/demographics-module';

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
                        itemsPerRow={2}
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
