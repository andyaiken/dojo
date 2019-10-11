import React from 'react';

import Selector from '../controls/selector';
import DieRollerModule from './dm/die-roller-module';
import LanguageModule from './dm/language-module';
import NameModule from './dm/name-module';

// tslint:disable-next-line:no-empty-interface
interface Props {
    //
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
            }

            return (
                <div className='tools'>
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
