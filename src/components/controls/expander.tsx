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
            let style = 'expander';
            if (this.props.disabled) {
                style += ' disabled';
            }

            return (
                <Collapse
                    className={style}
                    bordered={false}
                    expandIcon={p => <Icon type='down-circle' rotate={p.isActive ? -180 : 0} />}
                    expandIconPosition={'right'}
                >
                    <Collapse.Panel key='one' header={<div className='collapse-header-text'>{this.props.text}</div>}>
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
