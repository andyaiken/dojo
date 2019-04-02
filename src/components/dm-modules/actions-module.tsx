import React from 'react';
import Showdown from 'showdown';

const showdown = new Showdown.Converter();

// tslint:disable-next-line:no-empty-interface
interface Props {
    //
}

interface State {
    source: string | null;
}

export default class ActionsModule extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            source: null
        };
    }

    private async fetchData() {
        const response = await fetch('./data/actions.md');
        this.setState({
            source: await response.text()
        });
    }

    public render() {
        if (!this.state.source) {
            this.fetchData();
        }

        return (
            <div dangerouslySetInnerHTML={{ __html: showdown.makeHtml(this.state.source || '') }} />
        );
    }
}
