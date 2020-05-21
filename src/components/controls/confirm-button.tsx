import { QuestionCircleOutlined } from '@ant-design/icons';
import { Popover } from 'antd';
import React from 'react';

interface Props {
    text: string | JSX.Element | JSX.Element[];
    prompt: string | JSX.Element | JSX.Element[];
    info: string | JSX.Element | JSX.Element[] | null;
    disabled: boolean;
    onConfirm: () => void;
}

export default class ConfirmButton extends React.Component<Props> {
    public static defaultProps = {
        prompt: 'are you sure you want to do this?',
        info: null,
        disabled: false
    };

    public render() {
        try {
            return (
                <Popover
                    content={(
                        <div>
                            <div className='section'>
                                <QuestionCircleOutlined style={{ color: 'red' }} />
                                <span style={{ marginLeft: '10px' }}>{this.props.prompt}</span>
                            </div>
                            {this.props.info}
                            <div className='divider' />
                            <button onClick={() => this.props.onConfirm()}>confirm</button>
                        </div>
                    )}
                    trigger='click'
                >
                    <button className={this.props.disabled ? 'danger disabled' : 'danger'}>{this.props.text}</button>
                </Popover>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}
