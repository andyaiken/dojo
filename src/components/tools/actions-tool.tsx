import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import React from 'react';

import Showdown from 'showdown';
const showdown = new Showdown.Converter();
showdown.setOption('tables', true);

interface Props {
}

interface State {
    source: string | null;
}

export default class ActionsTool extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            source: null
        };
    }

    private async fetchData() {
        const response = await fetch('/dojo/data/actions.md');
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

            return (
                <Spin spinning={this.state.source === null} indicator={<LoadingOutlined style={{ fontSize: 20, marginTop: 100 }} />}>
                    <div dangerouslySetInnerHTML={{ __html: showdown.makeHtml(this.state.source || '') }} />
                </Spin>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}
