import React from 'react';
import Showdown from 'showdown';

import LoadingWrapper from '../../controls/loading-wrapper';

const showdown = new Showdown.Converter();
showdown.setOption('tables', true);

// tslint:disable-next-line:no-empty-interface
interface Props {
    //
}

interface State {
    source: string | null;
}

export default class SkillsModule extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            source: null
        };
    }

    private async fetchData() {
        const response = await fetch('./data/skills.md');
        const text = await response.text();
        this.setState({
            source: text
        });
    }

    public render() {
        if (!this.state.source) {
            this.fetchData();
        }

        return (
            <LoadingWrapper loaded={this.state.source !== null}>
                <div dangerouslySetInnerHTML={{ __html: showdown.makeHtml(this.state.source || '') }} />
            </LoadingWrapper>
        );
    }
}
