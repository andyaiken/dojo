import React from 'react';
import Showdown from 'showdown';

import Selector from '../controls/selector';

const showdown = new Showdown.Converter();
showdown.setOption('tables', true);

// tslint:disable-next-line:no-empty-interface
interface Props {
    //
}

interface State {
    view: string;
    source: string | null;
}

export default class ReferenceModule extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            view: 'skills',
            source: null
        };
    }

    private setView(view: string) {
        this.setState({
            view: view,
            source: null
        });
    }

    private async fetchData() {
        const response = await fetch('./data/' + this.state.view + '.md');
        const text = await response.text();
        this.setState({
            source: text
        });
    }

    public render() {
        if (this.state.view && !this.state.source) {
            this.fetchData();
        }

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

        return (
            <div>
                <Selector
                    options={options}
                    selectedID={this.state.view}
                    select={optionID => this.setView(optionID)}
                />
                <div dangerouslySetInnerHTML={{ __html: showdown.makeHtml(this.state.source || '') }} />
            </div>
        );
    }
}
