import React from 'react';

import { Input } from 'antd';

import Utils from '../../utils/utils';

interface Props {
    text: string;
    placeholder: string;
    minLines: number;
    maxLines: number;
    disabled: boolean;
    onChange: (value: string) => void;
}

interface State {
    text: string;
}

export default class Textbox extends React.Component<Props, State> {
    public static defaultProps = {
        placeholder: '',
        minLines: 1,
        maxLines: 1,
        disabled: false
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            text: props.text
        };
    }

    private onChange(value: string) {
        this.setState({
            text: value
        }, () => this.notifyAfterDelay());
    }

    private notifyAfterDelay = Utils.debounce(() => this.props.onChange(this.state.text));

    public render() {
        try {
            let style = 'textbox';
            if (this.props.disabled) {
                style += ' disabled';
            }

            if (this.props.maxLines > 1) {
                return (
                    <Input.TextArea
                        className={style}
                        value={this.state.text}
                        placeholder={this.props.placeholder}
                        autoSize={{ minRows: this.props.minLines, maxRows: this.props.maxLines }}
                        onChange={event => this.onChange(event.target.value)}
                    />
                );
            }

            return (
                <Input
                    className={style}
                    value={this.state.text}
                    placeholder={this.props.placeholder}
                    allowClear={true}
                    onChange={event => this.onChange(event.target.value)}
                />
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}
