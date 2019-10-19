import React from 'react';

import { Collapse, Icon } from 'antd';

interface Props {
    text: string;
    disabled: boolean;
}

export default class Expander extends React.Component<Props> {
    public static defaultProps = {
        disabled: false
    };

    public render() {
        try {
            return (
                <Collapse
                    className={this.props.disabled ? 'disabled' : ''}
                    bordered={false}
                    expandIcon={p => <Icon type='down-circle' style={{ fontSize: 16, right: 13 }} rotate={p.isActive ? -180 : 0} />}
                    expandIconPosition={'right'}
                >
                    <Collapse.Panel key='one' header={this.props.text}>
                        {this.props.children}
                    </Collapse.Panel>
                </Collapse>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}
