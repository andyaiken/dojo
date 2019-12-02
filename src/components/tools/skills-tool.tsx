import React from 'react';

import { Icon, Spin } from 'antd';

import Showdown from 'showdown';
const showdown = new Showdown.Converter();
showdown.setOption('tables', true);

interface Props {
}

interface State {
    source: string | null;
}

export default class SkillsTool extends React.Component<Props, State> {
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
        try {
            if (!this.state.source) {
                this.fetchData();
            }

            const icon = <Icon type='loading' style={{ fontSize: 20, marginTop: 100 }} spin={true} />;

            return (
                <Spin spinning={this.state.source === null} indicator={icon}>
                    <div dangerouslySetInnerHTML={{ __html: showdown.makeHtml(this.state.source || '') }} />
                </Spin>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}
